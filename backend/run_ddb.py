import json
from haralyzer import HarParser, HarPage
from MistralAi import extract_features
from sqlalchemy import insert
import logging
from server import Apartment, get_session
import datetime
import os
from dotenv import load_dotenv
import boto3

load_dotenv()
print("Connecting to DDB")
ddb_name = os.getenv('DDB_NAME')
access_id = os.getenv('USER_ACCESS_ID')
secret_access_id = os.getenv('SECRET_USER_ACCESS_ID')
region = os.getenv('REGION')

dynamodb = boto3.resource(
    'dynamodb',
    region_name=region,
    aws_access_key_id=access_id,
    aws_secret_access_key=secret_access_id
)

table = dynamodb.Table(ddb_name) 
print("Successful connection to DDB")

def filter_entries(entries):
    filtered_entries = []
    for entry in entries:
        request = entry['request']
        if 'graphql' in request['url']:
            for header in request['headers']:
                # print(header['name'], header['value'])
                if header['name'] == 'x-fb-friendly-name' and header['value'] == 'GroupsCometFeedRegularStoriesPaginationQuery':
                    filtered_entries.append(entry)
                    break
    return filtered_entries

def har_processing_logic(files):
    posts = []
    for file, city, state in files: 
        with open(file, 'r', encoding='utf-8') as f:
            har_parser = HarParser(json.loads(f.read()))

            data = har_parser.har_data

            for entry in filter_entries(data["entries"]):
                try:
                    data = json.loads(entry["response"]["content"]["text"].splitlines()[0])
                    if "data" in data:
                        group_feed = data['data']['node']['group_feed']['edges']
                        group_id = data['data']['node']['id']
                        for post in group_feed:
                            post_metadata = post["node"]
                            post_data = post_metadata["comet_sections"]["content"]["story"]
                            user = post_data['actors'][0]['name']
                            post_id = post_metadata['post_id']
                            post_link = post_data['wwwURL']
                            post_text = post_data['message']['text']
                            image_urls = [media['media']['image']['uri'] for media in post_data['attachments'][0]['styles']['attachment']['all_subattachments']['nodes']]
                            timestamp = post_metadata["comet_sections"]["context_layout"]["story"]["comet_sections"]["metadata"][0]["story"]["creation_time"]
                            # Convert the timestamp to a datetime object
                            dt_object = datetime.datetime.fromtimestamp(timestamp)
                            # Format the datetime object to a string in the format YYYY-MM-DD
                            date_str = dt_object.strftime('%Y-%m-%d')

                            posts.append({
                                'user': user,
                                'post_id': post_id,
                                'post_link': post_link,
                                'post_text': post_text,
                                'image_urls': image_urls,
                                'post_date': date_str,
                                'group_city':city,
                                'group_state':state,
                                'group_id': group_id,
                            })
                except:
                    pass
    for post in posts: 
        print("Post start:")
        valid = False
        retries = 0
        error_details = None
        while not valid and retries < 3:
            try:
                post_text = json.dumps(post)
                new_text = extract_features(post_text, error_details, city)
                features = json.loads(new_text)
                if "error" in features: 
                    logging.info(features["error"])
                else:
                    features["id"] = post["post_id"]
                    features["image_urls"] = json.dumps(post["image_urls"])
                    features["city"] = post['group_city']
                    features["state"] = post['group_state']
                    features['group_id'] = post['group_id']
                    features['url'] = f"https://facebook.com/groups/{features['group_id']}/permalink/{features['id']}/"
                    write_to_dynamodb(features)
                valid = True
            except Exception as e:
                error_details = str(e)
                retries += 1
        print("Post end.")

def write_to_dynamodb(features):
    try:
        print("Putting Item...")
        table.put_item(Item=features)
        logging.info(f"Successfully inserted item with id {features['id']}")
    except Exception as e:
        logging.error(f"Error inserting item with id {features['id']}: {str(e)}")



har_processing_logic([("/Users/alexoon/Downloads/berkeley-test-0.har", "Berkeley", "California")])
        