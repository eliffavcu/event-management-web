# Kültür Etkinlikleri Flask API Bağlantı Aracı

Bu Flask API bağlantı aracı, Kültür Etkinlikleri projesinin API'sine kolay erişim sağlamaktadır. Uygulama, dış API ile iletişim kuran bir proxy görevi görür ve utils klasöründeki uygulamaları kullanır. Bu aracın kullanım amacı front-end tarafındaki sorguların GET sorgularına indirgenerek kullanımın kolaylaştırılmasıdır. 

## Kurulum

1. Gerekli paketleri yükleyin:
   ```
   pip install -r requirements.txt
   ```

2. Uygulamayı çalıştırın:
   ```
   python app.py
   ```

## API Endpointleri

Tüm işlemler GET metodu üzerinden yapılabilir. İşlem türü `action` parametresi ile belirtilir.

### Kimlik Doğrulama
- `GET /api/auth/login?email=user@example.com&password=password&user_type=normal` - Normal kullanıcı girişi
- `GET /api/auth/login?email=org@example.com&password=password&user_type=organizator` - Organizatör girişi

### Kullanıcılar
- `GET /api/users?action=list` - Tüm kullanıcıları listeler
- `GET /api/users/{id}?action=get` - Belirli bir kullanıcıyı gösterir
- `GET /api/users?action=create&user_name=Ad&user_surname=Soyad&user_age=25&user_email=email@example.com&user_telephone=5551234567&user_birthday=1998-01-15&password=sifre` - Yeni bir kullanıcı oluşturur
- `GET /api/users/{id}?action=delete` - Kullanıcıyı siler
- `GET /api/users/{id}/events` - Kullanıcının etkinliklerini gösterir

### Organizatörler
- `GET /api/organizators?action=list` - Tüm organizatörleri listeler
- `GET /api/organizators/{id}?action=get` - Belirli bir organizatörü gösterir
- `GET /api/organizators?action=create&organizator_name=Ad&organizator_surname=Soyad&organizator_email=email@example.com&organizator_telephone=5551234567&organization_location=Istanbul&password=sifre` - Yeni bir organizatör oluşturur
- `GET /api/organizators/{id}?action=delete` - Organizatörü siler
- `GET /api/organizators/{id}/events` - Organizatörün etkinliklerini gösterir

### Etkinlikler
- `GET /api/events?action=list` - Tüm etkinlikleri listeler
- `GET /api/events/{id}?action=get` - Belirli bir etkinliği gösterir
- `GET /api/events/{id}?action=full-info` - Belirli bir etkinliğin tüm bilgilerini gösterir
- `GET /api/events?action=create&event_name=Etkinlik&event_location=Konum&event_date=2025-06-12&event_time=09:30:00&event_type_id=1&limit_for_attendance=250&organizator_id=1` - Yeni bir etkinlik oluşturur
- `GET /api/events/{id}?action=update&event_name=Etkinlik&event_location=Konum&event_date=2025-06-12&event_time=09:30:00&event_type_id=1&limit_for_attendance=250&organizator_id=1` - Etkinliği günceller
- `GET /api/events/{id}?action=delete` - Etkinliği siler
- `GET /api/events/{id}/attendees` - Etkinliğe katılanları listeler
- `GET /api/events/{id}/speakers` - Etkinlik konuşmacılarını listeler
- `GET /api/events/{id}/sponsors` - Etkinlik sponsorlarını listeler

### Katılımlar
- `GET /api/attendances?action=list` - Tüm katılımları listeler
- `GET /api/attendances/{id}?action=get` - Belirli bir katılımı gösterir
- `GET /api/attendances?action=create&user_id=1&event_id=1&attending_date=2025-06-12` - Yeni bir katılım oluşturur
- `GET /api/attendances/{id}?action=delete` - Katılımı siler

### Biletler
- `GET /api/tickets?action=list` - Tüm biletleri listeler
- `GET /api/tickets/{id}?action=get` - Belirli bir bileti gösterir
- `GET /api/tickets?action=create&user_id=1&event_id=1&ticket_type_id=1` - Yeni bir bilet oluşturur
- `GET /api/tickets/{id}?action=delete` - Bileti siler
- `GET /api/tickets/user/{id}` - Kullanıcının biletlerini gösterir
