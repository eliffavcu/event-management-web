from flask import Flask, jsonify, request
from flask_cors import CORS
import sys
import os

# Proje kök dizinini sys.path'e ekle (utils klasörünü import edebilmek için)
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

# Utils modüllerini import et
from utils.users import get_all_users, get_user_by_id, create_user, delete_user_by_id, get_user_event_by_id
from utils.organizators import get_all_organizators, get_organizator_by_id, create_organizator, delete_organizator_by_id, get_organizator_event_by_id
from utils.events import (get_all_events, get_event_by_id, create_event, delete_event_by_id, 
                         update_event_by_id, get_event_attandance_by_id, get_event_speakers_by_id, 
                         get_event_sponsors_by_id, get_event_full_info_by_id)
from utils.attendances import get_all_attendances, get_attendance_by_id, create_attendance, delete_attendance_by_id
from utils.tickets import get_all_tickets, get_ticket_by_id, create_ticket, delete_ticket_by_id, get_tickets_by_user_id
from utils.login import login_as_normal_user, login_as_organizator  # login.py dosyasından fonksiyonları import et

app = Flask(__name__)
CORS(app)  # CORS'u etkinleştir

# Ana Sayfa
@app.route('/')
def home():
    return jsonify({
        "status": "success",
        "message": "Kültür Etkinlikleri API'sine Hoş Geldiniz",
        "endpoints": {
            "users": "/api/users",
            "organizators": "/api/organizators",
            "events": "/api/events",
            "attendances": "/api/attendances",
            "tickets": "/api/tickets",
            "auth": "/api/auth"  # Auth endpointi eklendi
        }
    })

# ----- AUTH ROUTES -----
@app.route('/api/auth/login', methods=['GET'])
def api_auth_login():
    email = request.args.get('email')
    password = request.args.get('password')
    user_type = request.args.get('user_type', 'normal')  # Varsayılan olarak normal kullanıcı
    
    # Zorunlu alanları kontrol et
    if not (email and password):
        return jsonify({"status": "error", "message": "E-posta ve şifre gerekli"}), 400
    
    try:
        if user_type.lower() == 'organizator':
            # Organizatör girişi
            result = login_as_organizator(email, password)
        else:
            # Normal kullanıcı girişi
            result = login_as_normal_user(email, password)
        
        if result:
            return jsonify(result)
        else:
            return jsonify({"status": "error", "message": "Giriş başarısız. Geçersiz e-posta veya şifre."}), 401
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ----- USER ROUTES -----
@app.route('/api/users', methods=['GET'])
def api_users():
    action = request.args.get('action', 'list')  # Varsayılan olarak liste getir
    
    if action == 'list':
        try:
            users = get_all_users()
            return jsonify({"status": "success", "data": users})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'create':
        try:
            # GET parametrelerinden kullanıcı bilgilerini al
            username = request.args.get('user_name')
            surname = request.args.get('user_surname')
            age = request.args.get('user_age')
            if age:
                age = int(age)
            email = request.args.get('user_email')
            telephone = request.args.get('user_telephone')
            birthday = request.args.get('user_birthday')
            password = request.args.get('password')
            
            # Zorunlu alanları kontrol et
            if not (username and surname and email and password):
                return jsonify({"status": "error", "message": "Gerekli alanlar eksik"}), 400
            
            result = create_user(
                username=username,
                surname=surname,
                age=age,
                email=email,
                telephone=telephone,
                birthday=birthday,
                password=password
            )
            return jsonify(result), 201
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/users/<int:user_id>', methods=['GET'])
def api_user(user_id):
    action = request.args.get('action', 'get')  # Varsayılan olarak kullanıcı bilgisi getir
    
    if action == 'get':
        try:
            user = get_user_by_id(user_id)
            return jsonify({"status": "success", "data": user})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'delete':
        try:
            result = delete_user_by_id(user_id)
            return jsonify(result)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/users/<int:user_id>/events', methods=['GET'])
def api_user_events(user_id):
    try:
        events = get_user_event_by_id(user_id)
        return jsonify({"status": "success", "data": events})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ----- ORGANIZATOR ROUTES -----
@app.route('/api/organizators', methods=['GET'])
def api_organizators():
    action = request.args.get('action', 'list')  # Varsayılan olarak liste getir
    
    if action == 'list':
        try:
            organizators = get_all_organizators()
            return jsonify({"status": "success", "data": organizators})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'create':
        try:
            # GET parametrelerinden organizatör bilgilerini al
            username = request.args.get('organizator_name')
            surname = request.args.get('organizator_surname')
            location = request.args.get('organization_location')
            email = request.args.get('organizator_email')
            telephone = request.args.get('organizator_telephone')
            password = request.args.get('password')
            
            # Zorunlu alanları kontrol et
            if not (username and surname and email and password):
                return jsonify({"status": "error", "message": "Gerekli alanlar eksik"}), 400
            
            result = create_organizator(
                username=username,
                surname=surname,
                location=location,
                email=email,
                telephone=telephone,
                password=password
            )
            return jsonify(result), 201
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/organizators/<int:organizator_id>', methods=['GET'])
def api_organizator(organizator_id):
    action = request.args.get('action', 'get')  # Varsayılan olarak organizatör bilgisi getir
    
    if action == 'get':
        try:
            organizator = get_organizator_by_id(organizator_id)
            return jsonify({"status": "success", "data": organizator})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'delete':
        try:
            result = delete_organizator_by_id(organizator_id)
            return jsonify(result)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/organizators/<int:organizator_id>/events', methods=['GET'])
def api_organizator_events(organizator_id):
    try:
        events = get_organizator_event_by_id(organizator_id)
        return jsonify({"status": "success", "data": events})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ----- EVENT ROUTES -----
@app.route('/api/events', methods=['GET'])
def api_events():
    action = request.args.get('action', 'list')  # Varsayılan olarak liste getir
    
    if action == 'list':
        try:
            events = get_all_events()
            return jsonify({"status": "success", "data": events})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'create':
        try:
            # GET parametrelerinden etkinlik bilgilerini al
            event_name = request.args.get('event_name')
            event_location = request.args.get('event_location')
            event_date = request.args.get('event_date')
            event_time = request.args.get('event_time')
            event_type_id = request.args.get('event_type_id')
            if event_type_id:
                event_type_id = int(event_type_id)
            limit_for_attendance = request.args.get('limit_for_attendance')
            if limit_for_attendance:
                limit_for_attendance = int(limit_for_attendance)
            organizator_id = request.args.get('organizator_id')
            if organizator_id:
                organizator_id = int(organizator_id)
            
            # Zorunlu alanları kontrol et
            if not (event_name and event_location and event_date and event_type_id and organizator_id):
                return jsonify({"status": "error", "message": "Gerekli alanlar eksik"}), 400
            
            result = create_event(
                event_name=event_name,
                event_location=event_location,
                event_date=event_date,
                event_time=event_time,
                event_type_id=event_type_id,
                limit_for_attendance=limit_for_attendance,
                organizator_id=organizator_id
            )
            return jsonify(result), 201
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/events/<int:event_id>', methods=['GET'])
def api_event(event_id):
    action = request.args.get('action', 'get')  # Varsayılan olarak etkinlik bilgisi getir
    
    if action == 'get':
        try:
            event = get_event_by_id(event_id)
            return jsonify({"status": "success", "data": event})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'full-info':
        try:
            # Etkinliğin tüm bilgilerini getir
            event_full_info = get_event_full_info_by_id(event_id)
            return jsonify({"status": "success", "data": event_full_info})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'update':
        try:
            # GET parametrelerinden etkinlik güncelleme bilgilerini al
            event_name = request.args.get('event_name')
            event_location = request.args.get('event_location')
            event_date = request.args.get('event_date')
            event_time = request.args.get('event_time')
            event_type_id = request.args.get('event_type_id')
            if event_type_id:
                event_type_id = int(event_type_id)
            limit_for_attendance = request.args.get('limit_for_attendance')
            if limit_for_attendance:
                limit_for_attendance = int(limit_for_attendance)
            organizator_id = request.args.get('organizator_id')
            if organizator_id:
                organizator_id = int(organizator_id)
            
            result = update_event_by_id(
                event_id=event_id,
                event_name=event_name,
                event_location=event_location,
                event_date=event_date,
                event_time=event_time,
                event_type_id=event_type_id,
                limit_for_attendance=limit_for_attendance,
                organizator_id=organizator_id
            )
            return jsonify(result)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'delete':
        try:
            result = delete_event_by_id(event_id)
            return jsonify(result)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/events/<int:event_id>/attendees', methods=['GET'])
def api_event_attendees(event_id):
    try:
        attendees = get_event_attandance_by_id(event_id)
        return jsonify({"status": "success", "data": attendees})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/events/<int:event_id>/speakers', methods=['GET'])
def api_event_speakers(event_id):
    try:
        speakers = get_event_speakers_by_id(event_id)
        return jsonify({"status": "success", "data": speakers})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.route('/api/events/<int:event_id>/sponsors', methods=['GET'])
def api_event_sponsors(event_id):
    try:
        sponsors = get_event_sponsors_by_id(event_id)
        return jsonify({"status": "success", "data": sponsors})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# ----- ATTENDANCE ROUTES -----
@app.route('/api/attendances', methods=['GET'])
def api_attendances():
    action = request.args.get('action', 'list')  # Varsayılan olarak liste getir
    
    if action == 'list':
        try:
            attendances = get_all_attendances()
            return jsonify({"status": "success", "data": attendances})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'create':
        try:
            # GET parametrelerinden katılım bilgilerini al
            user_id = request.args.get('user_id')
            if user_id:
                user_id = int(user_id)
            event_id = request.args.get('event_id')
            if event_id:
                event_id = int(event_id)
            attending_date = request.args.get('attending_date')
            
            # Zorunlu alanları kontrol et
            if not (user_id and event_id):
                return jsonify({"status": "error", "message": "Gerekli alanlar eksik"}), 400
            
            result = create_attendance(
                user_id=user_id,
                event_id=event_id,
                attending_date=attending_date
            )
            return jsonify(result), 201
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/attendances/<int:attendance_id>', methods=['GET'])
def api_attendance(attendance_id):
    action = request.args.get('action', 'get')  # Varsayılan olarak katılım bilgisi getir
    
    if action == 'get':
        try:
            attendance = get_attendance_by_id(attendance_id)
            return jsonify({"status": "success", "data": attendance})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'delete':
        try:
            result = delete_attendance_by_id(attendance_id)
            return jsonify(result)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

# ----- TICKET ROUTES -----
@app.route('/api/tickets', methods=['GET'])
def api_tickets():
    action = request.args.get('action', 'list')  # Varsayılan olarak liste getir
    
    if action == 'list':
        try:
            tickets = get_all_tickets()
            return jsonify({"status": "success", "data": tickets})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'create':
        try:
            # GET parametrelerinden bilet bilgilerini al
            user_id = request.args.get('user_id')
            if user_id:
                user_id = int(user_id)
            event_id = request.args.get('event_id')
            if event_id:
                event_id = int(event_id)
            ticket_type_id = request.args.get('ticket_type_id')
            if ticket_type_id:
                ticket_type_id = int(ticket_type_id)
            
            # Zorunlu alanları kontrol et
            if not (user_id and event_id and ticket_type_id):
                return jsonify({"status": "error", "message": "Gerekli alanlar eksik"}), 400
            
            result = create_ticket(
                user_id=user_id,
                event_id=event_id,
                ticket_type_id=ticket_type_id
            )
            return jsonify(result), 201
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/tickets/<int:ticket_id>', methods=['GET'])
def api_ticket(ticket_id):
    action = request.args.get('action', 'get')  # Varsayılan olarak bilet bilgisi getir
    
    if action == 'get':
        try:
            ticket = get_ticket_by_id(ticket_id)
            return jsonify({"status": "success", "data": ticket})
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    elif action == 'delete':
        try:
            result = delete_ticket_by_id(ticket_id)
            return jsonify(result)
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500
    else:
        return jsonify({"status": "error", "message": "Geçersiz işlem"}), 400

@app.route('/api/tickets/user/<int:user_id>', methods=['GET'])
def api_user_tickets(user_id):
    try:
        tickets = get_tickets_by_user_id(user_id)
        return jsonify({"status": "success", "data": tickets})
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000)
