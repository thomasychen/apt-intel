import json 
from haralyzer import HarParser
import logging
import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import boto3
import datetime 
import requests

api_key = os.getenv("MISTRAL_API_KEY")
model = "mistral-large-latest"

client = MistralClient(api_key=api_key)
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

def lambda_handler(event, context):
    '''Demonstrates a simple HTTP endpoint using API Gateway. You have full
    access to the request and response payload, including headers and
    status code.

    To scan a DynamoDB table, make a GET request with the TableName as a
    query string parameter. To put, update, or delete an item, make a POST,
    PUT, or DELETE request respectively, passing in the payload to the
    DynamoDB API as a JSON body.
    '''
    print("Received event: " + json.dumps(event, indent=2))
    logging.info("Received event: " + json.dumps(event, indent=2))
    
    bucket_name = event['Records'][0]['s3']['bucket']['name']
    object_key = event['Records'][0]['s3']['object']['key']
    s3_client = boto3.client('s3')
    print("Started client")
    response = s3_client.get_object(Bucket=bucket_name, Key=object_key)
    split_name = object_key.split("-")
    city = split_name[0]
    state = split_name[1]
    print("got object from s3")
    print(city, state)
    file_content = response['Body'].read().decode('utf-8')
    har_parser = HarParser(json.loads(file_content))
    data = har_parser.har_data
    posts = []
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

                    new_image_urls = []
                    for i, url in enumerate(image_urls):
                        image_data = download_image(url)
                        new_image_url = upload_to_s3(s3_client, image_data, "aptai-images-bucket", generate_image_name(post_id, i))
                        new_image_urls.append(new_image_url)

                    posts.append({
                        'user': user,
                        'post_id': post_id,
                        'post_link': post_link,
                        'post_text': post_text,
                        'image_urls': new_image_urls,
                        'post_date': date_str,
                        'group_city':city,
                        'group_state':state,
                        'group_id': group_id,
                    })
        except: 
            pass
    all_features = []
    for post in posts: 
        valid = False
        retries = 0
        error_details = None
        while not valid and retries < 3:
            try:
                post_text = json.dumps(post)
                new_text = extract_features(post_text, error_details)
                features = json.loads(new_text)
                if "error" in features: 
                   logging.info(features["error"]) 
                else:
                    features["id"] = post["post_id"]
                    # TODO: figure out how to download all the images and write them to s3 bucket, then get the url to each
                    features["image_urls"] = json.dumps(post["image_urls"])
                    features["city"] = post['group_city']
                    features["state"] = post['group_state']
                    features['group_id'] = post['group_id']
                    features['url'] = f"https://facebook.com/groups/{features['group_id']}/permalink/{features['id']}/"
                    all_features.append(features)
                    write_to_dynamodb(features)
                valid = True
            except Exception as e:
                error_details = str(e)
                print(error_details)
                retries += 1

    return {
        'statusCode': 200,
        'body': all_features
    }


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


def extract_features(text, error_msg, default_city="Berkeley"):
    prompt = f"IMPORTANT: ONLY RETURN THE STRING FORMAT JSON. If you cannot fill out the NOT NULL fields, return a single field in the json with 'error' as the key, and write which field you couldn't fill. We have a json with information from a facebook groups post for listing an apartment: {text} \
      please parse the text section of the json to generate a new json with all these fields: \
    bed INT NOT NULL (if they mention a room but not number of beds it should have 1 bed), \
    bath INT NOT NULL (even if shared space, any access to a bathroom should be 1), \
    cost INT NOT NULL (make sure cost is full cost for number of bedrooms),\
    description TEXT NOT NULL,\
    city VARCHAR(255) NOT NULL (infer based on context, otherwise {default_city}),\
    state VARCHAR(255) NOT NULL (full state name with capital first letters, use city for context),\
    start_date VARCHAR(255) NOT NULL (YYYY-MM-DD estimate using context of post_text + post_date if not clear),\
    end_date VARCHAR(255) NOT NULL (YYYY-MM-DD estimate using context of post_text + post_date if not clear), \
    address VARCHAR(255),\
    sqft INT,\
    phone VARCHAR(255),\
    email VARCHAR(255),\
    url VARCHAR(255),\
    gender INT (1 male, 2 female, 0 none),\
    shared INT (1 true (for shared room not just multiple people overall), 0 false),\
    furnished INT (1 true, 0 false),\
    pets INT (1 allowed, 0 not),\
    parking INT (1 true, 0 false),\
    laundry INT (0 none, 1 not in unit, 2 in unit), \
    If the following is not blank, you had this error with the parsing: {error_msg}"

    response = client.chat(
        model=model,
        response_format={"type": "json_object"},
        messages=[ChatMessage(role="user", content=prompt)]
    )

    return response.choices[0].message.content

def download_image(url):
    response = requests.get(url, stream=True)
    if response.status_code == 200:
        return response
    return None

def upload_to_s3(s3_client, image_data, bucket_name, object_name):
    if image_data is not None:
        s3_client.upload_fileobj(image_data.raw, bucket_name,object_name)
        return f"https://{bucket_name}.s3.amazonaws.com/{object_name}"
    return None

def generate_image_name(post_id, idx):
    return f"{post_id}/{idx}.jpg"

def write_to_dynamodb(features):
    try:
        print("Putting Item...")
        table.put_item(Item=features)
        logging.info(f"Successfully inserted item with id {features['id']}")
    except Exception as e:
        logging.error(f"Error inserting item with id {features['id']}: {str(e)}")