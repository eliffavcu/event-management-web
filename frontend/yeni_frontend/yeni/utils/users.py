import requests
import json

BASE_URL = "http://localhost:3000/api"

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.e30.xoM4GImzYa8Y3GS3Lo53VLuE7Qabiia4rnsFxnB4Zbk' 
    }

def get_all_users():
    url = f"{BASE_URL}/users"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.json()["data"]

def get_user_by_id(user_id):
    url = f"{BASE_URL}/users/{user_id}"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]

def create_user(username, surname, age, email, telephone, birthday, password):

    user_register_data = {
        "user_name": username,
        "user_surname": surname,
        "user_age": age,
        "user_email": email,
        "user_telephone": telephone,
        "user_birthday": birthday,
        "password": password,
        "user_type": "normal"
    }

    payload = json.dumps(user_register_data)
    url = f"{BASE_URL}/auth/register"
    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json()

def delete_user_by_id(user_id):
    url = f"{BASE_URL}/users/{user_id}"

    payload = {}

    response = requests.request("DELETE", url, headers=headers, data=payload)
    return response.json()


def get_user_event_by_id(user_id):
    url = f"{BASE_URL}/users/{user_id}/events"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]



