# API Documentation

Bu doküman, geliştirdiğiniz API'yi açıklamak ve kullanılabilirliğini artırmak amacıyla hazırlanmıştır. Endpointler kategorilere ayrılmıştır ve her bir endpoint için açıklamalar, örnekler ve kullanımlarla ilgili bilgiler sağlanmıştır.

---

## Kullanıcı (User) Endpointleri

### 1. Kullanıcı Listesi
**GET** `/api/users`  
Tüm kullanıcıları listeler.

### 2. Belirli Bir Kullanıcıyı Getir
**GET** `/api/users/{id}`  
ID'si verilen kullanıcıyı getirir.

**Örnek:**
```http
GET http://localhost:3000/api/users/1
```

### 3. Yeni Kullanıcı Oluştur
**POST** `/api/users`  
Yeni bir kullanıcı oluşturur.

**Gönderilecek JSON:**
```json
{
  "user_name": "Test",
  "user_surname": "User",
  "user_age": 25,
  "user_email": "test@example.com",
  "user_telephone": "5551234567",
  "user_birthday": "1998-01-15"
}
```

### 4. Kullanıcı Güncelle
**PUT** `/api/users/{id}`  
ID'si verilen kullanıcıyı günceller.

**Gönderilecek JSON:**
```json
{
  "user_name": "Updated",
  "user_surname": "User",
  "user_age": 26,
  "user_email": "test@example.com",
  "user_telephone": "5551234567",
  "user_birthday": "1998-01-15"
}
```

### 5. Kullanıcı Sil
**DELETE** `/api/users/{id}`  
ID'si verilen kullanıcıyı siler.

**Örnek:**
```http
DELETE http://localhost:3000/api/users/1
```

### 6. Kullanıcının Etkinliklerini Listele
**GET** `/api/users/{id}/events`  
ID'si verilen kullanıcının katıldığı etkinlikleri listeler.

---

## Organizatör (Organizator) Endpointleri

### 1. Organizatör Listesi
**GET** `/api/organizators`  
Tüm organizatörleri listeler.

### 2. Belirli Bir Organizatörü Getir
**GET** `/api/organizators/{id}`  
ID'si verilen organizatörü getirir.

### 3. Yeni Organizatör Oluştur
**POST** `/api/organizators`

**Gönderilecek JSON:**
```json
{
  "organizator_name": "Test",
  "organizator_surname": "Organizator",
  "organizator_email": "org@example.com",
  "organizator_telephone": "5551234568",
  "organization_location": "Istanbul, Turkey"
}
```

### 4. Organizatör Güncelle
**PUT** `/api/organizators/{id}`

### 5. Organizatör Sil
**DELETE** `/api/organizators/{id}`

### 6. Organizatörün Etkinliklerini Listele
**GET** `/api/organizators/{id}/events`

---

## Etkinlik (Event) Endpointleri

### 1. Etkinlik Listesi
**GET** `/api/events`

### 2. Belirli Bir Etkinliği Getir
**GET** `/api/events/{id}`

### 3. Yeni Etkinlik Oluştur
**POST** `/api/events`

**Gönderilecek JSON:**
```json
{
  "event_name": "Test Event",
  "event_date": "2025-12-25",
  "event_time": "14:00:00",
  "event_location": "Kadıköy, Istanbul",
  "event_type_id": 1,
  "limit_for_attendance": 200,
  "organizator_id": 1
}
```

### 4. Etkinlik Güncelle
**PUT** `/api/events/{id}`

### 5. Etkinlik Sil
**DELETE** `/api/events/{id}`

### 6. Etkinlik Tiplerini Listele
**GET** `/api/events/types`

### 7. Etkinlik Detaylarını Getir
**GET** `/api/events/{id}/full-info`

### 8. Etkinlik Katılımcılarını Listele
**GET** `/api/events/{id}/attendees`

### 9. Etkinlik Konuşmacılarını Listele
**GET** `/api/events/{id}/speakers`

### 10. Etkinlik Sponsorlarını Listele
**GET** `/api/events/{id}/sponsors`

---

## Katılım (Attendance) Endpointleri

### 1. Katılım Listesi
**GET** `/api/attendances`

### 2. Belirli Bir Katılımı Getir
**GET** `/api/attendances/{id}`

### 3. Yeni Katılım Oluştur
**POST** `/api/attendances`

**Gönderilecek JSON:**
```json
{
  "user_id": 1,
  "event_id": 2,
  "attending_date": "2025-10-20"
}
```

### 4. Katılım Sil
**DELETE** `/api/attendances/{id}`

---

## Bilet (Ticket) Endpointleri

### 1. Bilet Listesi
**GET** `/api/tickets`

### 2. Belirli Bir Bileti Getir
**GET** `/api/tickets/{id}`

### 3. Yeni Bilet Oluştur
**POST** `/api/tickets`

**Gönderilecek JSON:**
```json
{
  "user_id": 1,
  "event_id": 1,
  "ticket_type_id": 1
}
```

### 4. Bilet Sil
**DELETE** `/api/tickets/{id}`

### 5. Kullanıcıya Ait Biletleri Listele
**GET** `/api/tickets/user/{id}`

---

## Kimlik Doğrulama (Authentication) Endpointleri

### 1. Yeni Kullanıcı Kaydı
**POST** `/api/auth/register`

**Gönderilecek JSON:**
```json
{
  "user_name": "New",
  "user_surname": "User",
  "user_age": 30,
  "user_email": "new@example.com",
  "user_telephone": "5559876543",
  "user_birthday": "1995-05-20",
  "password": "securepassword123"
}
```

### 2. Kullanıcı Girişi
**POST** `/api/auth/login`

**Gönderilecek JSON:**
```json
{
  "email": "new@example.com",
  "password": "securepassword123"
}
```

### 3. Şifre Değiştirme
**PUT** `/api/auth/change-password`

**Gönderilecek JSON:**
```json
{
  "currentPassword": "securepassword123",
  "newPassword": "newpassword456"
}
```

---

## Notlar

1. **JWT Authentication:** Bazı endpointlere erişim için JWT token gereklidir. `Authorization` başlığında aşağıdaki şekilde göndermeniz gerekir:
   ```
   Authorization: Bearer {JWT_TOKEN}
   ```

2. **Server Çalıştırma:**
   ```bash
   npm run dev
   ```

3. **Çevre Değişkenleri:** `.env` dosyanızı ayarlayın:
   - `JWT_SECRET`
   - Veritabanı bağlantı bilgileri

---

Bu doküman, API'nizi verimli bir şekilde kullanmanıza yardımcı olmak için hazırlanmıştır. Tüm endpointler test edilmiş ve örneklerle detaylandırılmıştır.
