import requests
import json

BASE_URL = "http://localhost:3000/api"

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.e30.xoM4GImzYa8Y3GS3Lo53VLuE7Qabiia4rnsFxnB4Zbk' 
    }

def get_all_attendances():
    url = f"{BASE_URL}/attendances"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.json()["data"]

def get_attendance_by_id(attendance_id):
    url = f"{BASE_URL}/attendances/{attendance_id}"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]  

def create_attendance(user_id, event_id, attending_date):
    
    url = f"{BASE_URL}/attendances"
    
    attendance_data = {
        "user_id": user_id,
        "event_id": event_id,
        "attending_date": attending_date
    }

    payload = json.dumps(attendance_data)
    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json()

def delete_attendance_by_id(attendance_id):
    url = f"{BASE_URL}/attendances/{attendance_id}"

    payload = {}

    response = requests.request("DELETE", url, headers=headers, data=payload)
    return response.json()


