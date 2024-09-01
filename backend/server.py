from flask import Flask, jsonify, request
from flask_cors import CORS
import boto3
from boto3.dynamodb.conditions import Key, Attr
import json
import datetime
from decimal import Decimal
import os

app = Flask(__name__)
CORS(app)

# Initialize DynamoDB client

ddb_name = os.getenv('DDB_NAME')
region = os.getenv('REGION')

dynamodb = boto3.resource('dynamodb', region_name=region)
table = dynamodb.Table("Apartments")

class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, Decimal):
            return float(o)
        return super(DecimalEncoder, self).default(o)

@app.route("/ping", methods=['GET'])
def ping(): 
    return jsonify({"status": "alive"})

@app.route("/apartments", methods=['GET'])
def get_apartments():
    filter_expression = None
    key_condition_expression = None

    if 'city' in request.args and request.args['city']:
        key_condition_expression = Key('city').eq(request.args['city'])
        if 'id' in request.args:
            key_condition_expression &= Key('id').eq(request.args['id'])
    
    # Add more filters as needed
    if 'bed_min' in request.args:
        new_condition = Attr('bed').gte(int(request.args['bed_min']))
        filter_expression = new_condition if filter_expression is None else filter_expression & new_condition
    
    if 'bed_max' in request.args:
        new_condition = Attr('bed').lte(int(request.args['bed_max']))
        filter_expression = new_condition if filter_expression is None else filter_expression & new_condition
    
    # Add similar conditions for other filters...

    if key_condition_expression:
        if filter_expression:
            response = table.query(
                KeyConditionExpression=key_condition_expression,
                FilterExpression=filter_expression
            )
        else:
            response = table.query(
                KeyConditionExpression=key_condition_expression
            )
    else:
        if filter_expression:
            response = table.scan(FilterExpression=filter_expression)
        else:
            response = table.scan()

    items = response['Items']

    # Process dates and image_urls
    for item in items:
        if 'start_date' in item:
            item['start_date'] = item['start_date']
        if 'end_date' in item:
            item['end_date'] = item['end_date']
        if 'image_urls' in item:
            item['image_urls'] = json.loads(item['image_urls'])

    return json.dumps(items, cls=DecimalEncoder)

@app.route("/apartments/<string:city>/<string:id>", methods=['GET'])
def get_apartment_by_city_and_id(city, id):
    response = table.get_item(Key={'city': city, 'id': id})
    
    if 'Item' not in response:
        return jsonify({"error": "Apartment not found"}), 404
    
    item = response['Item']
    
    # Process dates and image_urls
    if 'start_date' in item:
        item['start_date'] = item['start_date']
    if 'end_date' in item:
        item['end_date'] = item['end_date']
    if 'image_urls' in item:
        item['image_urls'] = json.loads(item['image_urls'])
    
    return json.dumps(item, cls=DecimalEncoder)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)