import json
from haralyzer import HarParser, HarPage
from MistralAi import extract_features
from sqlalchemy import insert
import logging
from server import Apartment, get_session
import datetime

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
                    write_to_db(features)
                valid = True
            except Exception as e:
                error_details = str(e)
                retries += 1



def write_to_db(features):
    session = get_session()
    
    # Check if the apartment with the given id already exists
    existing_apt = session.query(Apartment).filter_by(id=features['id']).first()
    
    if existing_apt is None:
        new_apt = Apartment(
            id=features['id'], 
            bed=features['bed'], 
            bath=features['bath'], 
            cost=features['cost'], 
            description=features['description'], 
            city=features['city'], 
            state=features['state'], 
            end_date=datetime.datetime.strptime(features['end_date'], '%Y-%m-%d'), 
            start_date=datetime.datetime.strptime(features['start_date'], '%Y-%m-%d'), 
            address=features['address'], 
            sqft=features['sqft'], 
            phone=features['phone'], 
            email=features['email'], 
            url=features['url'], 
            gender=features['gender'], 
            shared=features['shared'], 
            furnished=features['furnished'], 
            pets=features['pets'], 
            parking=features['parking'], 
            laundry=features['laundry'], 
            image_urls=features['image_urls'],
            group_id=features['group_id']
        )
        session.add(new_apt)
        session.commit()
    else:
        logging.info(f"Apartment with id {features['id']} already exists in the database.")
    
    session.close()



har_processing_logic([("raw_data/berkeley-test-2.har", "Berkeley", "California"), ("raw_data/uw.har", "Seattle", "Washington")])
        
    



# from scripts.MistralAi import extract_features
# def read_file_to_chunks(filename, chunk_size):
#     with open(filename, 'r') as file:
#         text = file.read()
        
#     chunks = [text[i:i+chunk_size] for i in range(0, len(text), chunk_size)]
#     return chunks

# # Usage example
# filename = 'entry_content_412.txt'
# chunk_size = 50000  # Specify the length of each chunk
# chunks = read_file_to_chunks(filename, chunk_size)
# json_responses = []

# for chunk in chunks:
#     # print("hi", chunk)
#     json_responses.append(extract_features(chunk))

# print(json_responses)
