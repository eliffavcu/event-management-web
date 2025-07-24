import requests
import json

BASE_URL = "http://localhost:3000/api"

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.e30.xoM4GImzYa8Y3GS3Lo53VLuE7Qabiia4rnsFxnB4Zbk' 
    }

def login_as_normal_user(email, password):
    url = f"{BASE_URL}/auth/login"
    
    login_data = {
        "email": email,
        "password": password,
        "user_type": "normal"
    }
    
    payload = json.dumps(login_data)
    response = requests.request("POST", url, headers=headers, data=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None
    
def login_as_organizator(email, password):
    url = f"{BASE_URL}/auth/login"
    
    login_data = {
        "email": email,
        "password": password,
        "user_type": "organizator"
    }
    
    payload = json.dumps(login_data)
    response = requests.request("POST", url, headers=headers, data=payload)
    
    if response.status_code == 200:
        return response.json()
    else:
        return None
    
