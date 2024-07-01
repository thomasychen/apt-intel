import os
from dotenv import load_dotenv
import boto3

load_dotenv()

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

def put_item():
    response = table.put_item(
        Item={
            'city': '001', 
            'cost': '5',
            'Attribute2': 'Value2'
        }
    )
    print("PutItem succeeded:")
    print(response)

def get_item():
    response = table.get_item(
        Key={
            'city': '001',
            'cost': '5'
        }
    )
    item = response.get('Item')
    print("GetItem succeeded:")
    print(item)

if __name__ == "__main__":
    put_item()
    get_item()