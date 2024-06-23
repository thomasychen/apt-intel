import json
from haralyzer import HarParser, HarPage

with open('../raw_data/berkeley-test-1.har', 'r', encoding='utf-8') as f:
     har_parser = HarParser(json.loads(f.read()))

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

data = har_parser.har_data

posts = []

for entry in filter_entries(data["entries"]):
    try:
        data = json.loads(entry["response"]["content"]["text"].splitlines()[0])
        if "data" in data:
            group_feed = data['data']['node']['group_feed']['edges']
            for post in group_feed:
                post_metadata = post["node"]
                post_data = post_metadata["comet_sections"]["content"]["story"]
                user = post_data['actors'][0]['name']
                post_id = post_metadata['post_id']
                post_link = post_data['wwwURL']
                post_text = post_data['message']['text']
                image_urls = [media['media']['image']['uri'] for media in post_data['attachments'][0]['styles']['attachment']['all_subattachments']['nodes']]

                posts.append({
                    'user': user,
                    'post_id': post_id,
                    'post_link': post_link,
                    'post_text': post_text,
                    'image_urls': image_urls
                })
    except:
        pass

print(posts)



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
