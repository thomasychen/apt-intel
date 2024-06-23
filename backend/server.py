from flask import Flask, jsonify, request
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, scoped_session
import json

app = Flask(__name__)

DATABASE_URL = "sqlite:///../db/apartments.db"

engine = create_engine(DATABASE_URL)

Base = declarative_base()

class Apartment(Base):
    __tablename__ = 'apartments'
    id = Column(Integer, primary_key=True)
    bed = Column(Integer, nullable=False)
    bath = Column(Integer, nullable=False)
    cost = Column(Integer, nullable=False)
    description = Column(Text, nullable=False)
    city = Column(String(255), nullable=False)
    state = Column(String(255), nullable=False)
    start_date = Column(String(255), nullable=False)
    end_date = Column(String(255), nullable=False)
    address = Column(String(255))
    sqft = Column(Integer)
    phone = Column(String(255))
    email = Column(String(255))
    url = Column(String(255))
    gender = Column(Integer)
    shared = Column(Integer)
    furnished = Column(Integer)
    pets = Column(Integer)
    parking = Column(Integer)
    laundry = Column(Integer)
    image_urls = Column(Text)

Base.metadata.create_all(engine)
Session = sessionmaker(bind=engine)
session = scoped_session(Session)\

def get_session():
    return session()

@app.route("/ping", methods=['GET'])
def ping(): 
    return jsonify({"status": "alive"})

@app.route("/apartments", methods=['GET'])
def get_apartments():
    query = session.query(Apartment)
    
    if 'id' in request.args:
        query = query.filter(Apartment.id == request.args['id'])
    if 'bed_min' in request.args:
        query = query.filter(Apartment.bed >= request.args['bed_min'])
    if 'bed_max' in request.args:
        query = query.filter(Apartment.bed <= request.args['bed_max'])
    if 'bath_min' in request.args:
        query = query.filter(Apartment.bath >= request.args['bath_min'])
    if 'bath_max' in request.args:
        query = query.filter(Apartment.bath <= request.args['bath_max'])
    if 'cost_min' in request.args:
        query = query.filter(Apartment.cost >= request.args['cost_min'])
    if 'cost_max' in request.args:
        query = query.filter(Apartment.cost <= request.args['cost_max'])
    if 'description' in request.args:
        query = query.filter(Apartment.description.like(f"%{request.args['description']}%"))
    if 'city' in request.args:
        query = query.filter(Apartment.city == request.args['city'])
    if 'state' in request.args:
        query = query.filter(Apartment.state == request.args['state'])
    if 'start_date' in request.args:
        query = query.filter(Apartment.date <= request.args['start_date'])
    if 'end_date' in request.args:
        query = query.filter(Apartment.date >= request.args['end_date'])
    if 'address' in request.args:
        query = query.filter(Apartment.address.like(f"%{request.args['address']}%"))
    if 'sqft_min' in request.args:
        query = query.filter(Apartment.sqft >= request.args['sqft_min'])
    if 'sqft_max' in request.args:
        query = query.filter(Apartment.sqft <= request.args['sqft_max'])
    if 'phone' in request.args:
        query = query.filter(Apartment.phone == request.args['phone'])
    if 'email' in request.args:
        query = query.filter(Apartment.email == request.args['email'])
    if 'url' in request.args:
        query = query.filter(Apartment.url == request.args['url'])
    if 'gender' in request.args:
        query = query.filter(Apartment.gender == request.args['gender'])
    if 'shared' in request.args:
        query = query.filter(Apartment.shared == request.args['shared'])
    if 'furnished' in request.args:
        query = query.filter(Apartment.furnished == request.args['furnished'])
    if 'pets' in request.args:
        query = query.filter(Apartment.pets == request.args['pets'])
    if 'parking' in request.args:
        query = query.filter(Apartment.parking == request.args['parking'])
    if 'laundry' in request.args:
        query = query.filter(Apartment.laundry == request.args['laundry'])

    apartments = query.all()
    
    result = [
        {
            "id": apt.id,
            "bed": apt.bed,
            "bath": apt.bath,
            "cost": apt.cost,
            "description": apt.description,
            "city": apt.city,
            "state": apt.state,
            "start_date": apt.start_date,
            "end_date": apt.end_date,
            "address": apt.address,
            "sqft": apt.sqft,
            "phone": apt.phone,
            "email": apt.email,
            "url": apt.url,
            "gender": apt.gender,
            "shared": apt.shared,
            "furnished": apt.furnished,
            "pets": apt.pets,
            "parking": apt.parking,
            "laundry": apt.laundry,
            "image_urls": json.loads(apt.image_urls)
        }
        for apt in apartments
    ]

    return jsonify(result)

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=8080, debug=True)
