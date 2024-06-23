import os
from mistralai.client import MistralClient
from mistralai.models.chat_completion import ChatMessage
import json

api_key = os.environ["MISTRAL_API_KEY"]
model = "mistral-large-latest"

client = MistralClient(api_key=api_key)


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



