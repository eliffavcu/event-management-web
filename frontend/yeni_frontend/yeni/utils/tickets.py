import requests
import json

BASE_URL = "http://localhost:3000/api"

headers = {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiJ9.e30.xoM4GImzYa8Y3GS3Lo53VLuE7Qabiia4rnsFxnB4Zbk' 
    }

def get_all_tickets():
    url = f"{BASE_URL}/tickets"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None
    
def get_ticket_by_id(ticket_id):
    url = f"{BASE_URL}/tickets/{ticket_id}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None
    
def create_ticket(user_id, event_id, ticket_type_id):
    
    url = f"{BASE_URL}/tickets"
    ticket_data = {
        "user_id": user_id,
        "event_id": event_id,
        "ticket_type_id": ticket_type_id
    }
    payload = json.dumps(ticket_data)
    response = requests.post(url, headers=headers, data=payload)
    if response.status_code == 201:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

def delete_ticket_by_id(ticket_id):
    url = f"{BASE_URL}/tickets/{ticket_id}"
    response = requests.delete(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None

def get_tickets_by_user_id(user_id):
    url = f"{BASE_URL}/tickets/user/{user_id}"
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code}")
        return None
    

