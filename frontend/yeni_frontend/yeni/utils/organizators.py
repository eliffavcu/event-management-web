import requests
import json

BASE_URL = "http://localhost:3000/api"

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.e30.xoM4GImzYa8Y3GS3Lo53VLuE7Qabiia4rnsFxnB4Zbk' 
    }

def get_all_organizators():
    url = f"{BASE_URL}/organizators"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.json()["data"]

def get_organizator_by_id(organizator_id):
    url = f"{BASE_URL}/organizators/{organizator_id}"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]

def create_organizator(username, surname, location, email, telephone, password):
    
    url = f"{BASE_URL}/auth/register"
    
    organizator_register_data = {
        "organizator_name": username,
        "organizator_surname": surname,
        "organizator_email": email,
        "organizator_telephone": telephone,
        "password": password,
        "organization_location": location,
        "user_type": "organizator"
    }

    payload = json.dumps(organizator_register_data)
    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json()

def delete_organizator_by_id(organizator_id):
    url = f"{BASE_URL}/organizators/{organizator_id}"

    payload = {}

    response = requests.request("DELETE", url, headers=headers, data=payload)
    return response.json()

def get_organizator_event_by_id(organizator_id):
    url = f"{BASE_URL}/organizators/{organizator_id}/events"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]

