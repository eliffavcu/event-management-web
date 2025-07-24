-- Create the database
CREATE DATABASE IF NOT EXISTS event_management;
USE event_management;

-- For user's profiles
CREATE TABLE users (
    user_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    user_name VARCHAR(20),                  
    user_surname VARCHAR(20),
    user_age INT,
    user_email VARCHAR(50) UNIQUE,        
    user_telephone VARCHAR(15),
    user_birthday DATE                 
);

-- For organizator's profiles
CREATE TABLE organizators (
    organizator_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    organizator_name VARCHAR(20),                  
    organizator_surname VARCHAR(20),                 
    organizator_email VARCHAR(50) UNIQUE,        
    organizator_telephone VARCHAR(15),
    organization_location VARCHAR(100)
);

CREATE TABLE event_types (
    event_type_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    event_type_name VARCHAR(30)
);

CREATE TABLE events (
    event_id INTEGER PRIMARY KEY AUTO_INCREMENT,
    event_name VARCHAR(50),
    event_date DATE,
    event_time TIME,
    event_location VARCHAR(60),
    event_type_id INT,
    limit_for_attendance INT,
    organizator_id INT,
    FOREIGN KEY (organizator_id) REFERENCES organizators(organizator_id),
    FOREIGN KEY (event_type_id) REFERENCES event_types(event_type_id)
);

CREATE TABLE attendances (
    attendance_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    user_id INT,                             
    event_id INT,                             
    attending_date DATE,              
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE ticket_types (
    ticket_type_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    ticket_type_name VARCHAR(30),
    ticket_price DECIMAL(6,2)               
);

CREATE TABLE tickets (
    ticket_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    user_id INT,                             
    event_id INT,                             
    ticket_type_id INT,              
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (event_id) REFERENCES events(event_id),
    FOREIGN KEY (ticket_type_id) REFERENCES ticket_types(ticket_type_id)
);

CREATE TABLE event_speakers (
    speaker_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    event_id INT,                             
    speaker_name VARCHAR(20),                             
    speaker_surname VARCHAR(20),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE event_sponsors (
    sponsor_id INTEGER PRIMARY KEY AUTO_INCREMENT, 
    event_id INT,                             
    sponsor_name VARCHAR(20),                             
    sponsor_surname VARCHAR(20),
    FOREIGN KEY (event_id) REFERENCES events(event_id)
);

CREATE TABLE login (
    user_id INT PRIMARY KEY, 
    password_hash VARCHAR(255),  -- We will store the password as a hash.
    FOREIGN KEY (user_id) REFERENCES users(user_id)
);

-- Sample data
INSERT INTO users (user_id, user_name, user_surname, user_age, user_email, user_telephone, user_birthday)
VALUES
(1, 'Adrian', 'Smith', 38, 'adrian@email.com', '5572234567', '1990-01-15'),
(2, 'Diana', 'Lady', 36, 'ayse@email.com', '5876876543', '1992-04-23'),
(3, 'Marcus', 'Blackwell', 30, 'mehmet@email.com', '5656781234', '1988-07-10');

INSERT INTO organizators (organizator_id, organizator_name, organizator_surname, organizator_email, organizator_telephone, organization_location)
VALUES
(1, 'Luke', 'Skywalker', 'luke_sky@email.com', '5672233445', 'Paris, France'),
(2, 'Leia', 'Organa', 'leia@email.com', '5553344466', 'Amsterdam, Netherland');

INSERT INTO event_types (event_type_id, event_type_name)
VALUES
(1, 'Symposium'),
(2, 'Festival'),
(3, 'Workshop'),
(4, 'Conference') ,
(5, 'Seminar'),
(6, 'Concert');

INSERT INTO events (event_id, event_name, event_date, event_time, event_location, event_type_id, limit_for_attendance, organizator_id)
VALUES 
(1, 'Technology Symposium 2025', '2025-06-13', '09:30:00', 'Küçükçekmece, Istanbul', 1, 250, 1),
(2, 'Python Workshop', '2025-10-20', '10:00:00', 'Esenler, Istanbul', 3, 100, 2),
(3, 'AI Conference 2025', '2025-09-15', '13:00:00', 'Beşiktaş, Istanbul', 4, 300, 1);

INSERT INTO attendances (attendance_id, user_id, event_id, attending_date)
VALUES 
(1, 1, 1, '2025-06-13'),
(2, 2, 2, '2025-10-20');

INSERT INTO ticket_types (ticket_type_id, ticket_type_name, ticket_price)
VALUES 
(1, 'Student', 50.00),
(2, 'Teacher', 100.00),
(3, 'VIP', 150.00);

INSERT INTO tickets (ticket_id, user_id, event_id, ticket_type_id)
VALUES 
(1, 1, 1, 1),
(2, 2, 2, 2);

INSERT INTO event_speakers (speaker_id, event_id, speaker_name, speaker_surname)
VALUES 
(1, 1, 'John', 'Williams'),
(2, 2, 'Sarah', 'Schmitz');

INSERT INTO event_sponsors (sponsor_id, event_id, sponsor_name, sponsor_surname)
VALUES 
(1, 1, 'Datacamp', 'Ltd.'),
(2, 2, 'Python Academy', 'Inc.');

-- Showing the details of the event in the page.
CREATE VIEW user_event_details_view AS
SELECT 
    u.user_id,
    u.user_name,
    u.user_surname,
    e.event_id,
    e.event_name,
    e.event_date,
    e.event_location,
    t.ticket_type_name,
    t.ticket_price
FROM users u
JOIN attendances a ON u.user_id = a.user_id
JOIN events e ON e.event_id = a.event_id
LEFT JOIN tickets tk ON tk.user_id = u.user_id AND tk.event_id = e.event_id
LEFT JOIN ticket_types t ON t.ticket_type_id = tk.ticket_type_id;

-- When you click the button you will see the full information
CREATE VIEW event_full_info_view AS
SELECT 
    e.event_id,
    e.event_name,
    e.event_date,
    e.event_time,
    e.event_location,
    o.organizator_name,
    o.organizator_surname,
    s.speaker_name,
    s.speaker_surname,
    sp.sponsor_name,
    sp.sponsor_surname
FROM events e
LEFT JOIN organizators o ON o.organizator_id = e.organizator_id
LEFT JOIN event_speakers s ON s.event_id = e.event_id
LEFT JOIN event_sponsors sp ON sp.event_id = e.event_id;

-- For limiting the attendance
DELIMITER //
CREATE TRIGGER check_attendance_limit
BEFORE INSERT ON attendances
FOR EACH ROW
BEGIN
    DECLARE current_attendance INT;
    DECLARE attendance_limit INT;

    SELECT COUNT(*) INTO current_attendance FROM attendances WHERE event_id = NEW.event_id;
    SELECT limit_for_attendance INTO attendance_limit FROM events WHERE event_id = NEW.event_id;

    IF current_attendance >= attendance_limit THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Attendance limit exceeded for this event';
    END IF;
END //
DELIMITER ;