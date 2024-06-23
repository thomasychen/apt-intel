import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import json

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = MistralClient(api_key=api_key)


def extract_features(text):
    prompt = f"You are getting a chunk of an entry of a har file that could contain information on one or more apartment listing from a facebook group. Please return a json list of the following features for every distinct apartment listing you detect. If you can't find the information for a specfic feature, leave the feature blank:\n\n\
    1. Price\n\
    2. Number of bedrooms\n\
    3. Number of bathrooms\n\n\
    4. Square footage\n\n\
    5. Gender Preference\n\n\
    5. Street Name\n\n\
    6. City\n\n\
    7. State\n\n\
    8. Shared or Single Room \n\n\
    9. Post URL\n\n\
    10. Image URL list\n\n\
    House Listing: {text}"
    

    response = client.chat(
        model=model,
        # response_format={"type": "json_object"},
        messages=[ChatMessage(role="user", content=prompt)]
    )
    print(response)

    # json_string = json.dumps(response, indent=4)

    return response



