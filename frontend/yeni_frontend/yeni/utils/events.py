import requests
import json

BASE_URL = "http://localhost:3000/api"

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.e30.xoM4GImzYa8Y3GS3Lo53VLuE7Qabiia4rnsFxnB4Zbk' 
    }

def get_all_events():

    url = f"{BASE_URL}/events"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)

    return response.json()["data"]

def get_event_by_id(event_id):
    url = f"{BASE_URL}/events/{event_id}"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]

def create_event(event_name, event_location, event_date, event_time, event_type_id, limit_for_attendance, organizator_id):

    url = f"{BASE_URL}/events"

    event_register_data = {
        "event_name": event_name,
        "event_date": event_date,
        "event_time": event_time,
        "event_location": event_location,
        "event_type_id": event_type_id,
        "limit_for_attendance": limit_for_attendance,
        "organizator_id": organizator_id
    }

    
    payload = json.dumps(event_register_data)
    response = requests.request("POST", url, headers=headers, data=payload)
    return response.json()

def delete_event_by_id(event_id):
    url = f"{BASE_URL}/events/{event_id}"

    payload = {}

    response = requests.request("DELETE", url, headers=headers, data=payload)
    return response.json()

def update_event_by_id(event_id, event_name, event_location, event_date, event_time, event_type_id, limit_for_attendance, organizator_id):
    url = f"{BASE_URL}/events/{event_id}"

    event_current_data = get_event_by_id(event_id)

    event_updated_data = {
        "event_name": event_name if event_name else event_current_data["event_name"],
        "event_date": event_date if event_date else event_current_data["event_date"],
        "event_time": event_time if event_time else event_current_data["event_time"],
        "event_location": event_location if event_location else event_current_data["event_location"],
        "event_type_id": event_type_id if event_type_id else event_current_data["event_type_id"],
        "limit_for_attendance": limit_for_attendance if limit_for_attendance else event_current_data["limit_for_attendance"],
        "organizator_id": organizator_id if organizator_id else event_current_data["organizator_id"]
        }
    
    payload = json.dumps(event_updated_data)
    response = requests.request("PUT", url, headers=headers, data=payload)
    return response.json()

def get_event_full_info_by_id(event_id):
    url = f"{BASE_URL}/events/{event_id}/full-info"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]

def get_event_attandance_by_id(event_id):
    url = f"{BASE_URL}/events/{event_id}/attendees"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]

def get_event_speakers_by_id(event_id):
    url = f"{BASE_URL}/events/{event_id}/speakers"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]

def get_event_sponsors_by_id(event_id):
    url = f"{BASE_URL}/events/{event_id}/sponsors"

    payload = {}

    response = requests.request("GET", url, headers=headers, data=payload)
    return response.json()["data"]


