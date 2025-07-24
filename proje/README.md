# Event Management API

A RESTful API for an event management system built with Node.js, Express, and MySQL.

## Features

- User management (registration, authentication, profile management)
- Event management (creation, updates, listing)
- Event attendances
- Ticket booking
- Speakers and sponsors management

## Database Schema

The API uses a MySQL database with the following tables:
- users: For user's profiles
- organizators: For organizer's profiles
- event_types: Types of events
- events: Event details
- attendances: Records of users attending events
- ticket_types: Different types of tickets
- tickets: Records of tickets purchased
- event_speakers: Speakers at events
- event_sponsors: Sponsors of events
- login: User authentication details

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - User login
- PUT /api/auth/change-password - Change user password

### Users
- GET /api/users - Get all users
- GET /api/users/:id - Get user by ID
- POST /api/users - Create new user
- PUT /api/users/:id - Update user
- DELETE /api/users/:id - Delete user
- GET /api/users/:id/events - Get user's events

### Organizators
- GET /api/organizators - Get all organizators
- GET /api/organizators/:id - Get organizator by ID
- POST /api/organizators - Create new organizator
- PUT /api/organizators/:id - Update organizator
- DELETE /api/organizators/:id - Delete organizator
- GET /api/organizators/:id/events - Get organizator's events

### Events
- GET /api/events - Get all events
- GET /api/events/:id - Get event by ID
- POST /api/events - Create new event
- PUT /api/events/:id - Update event
- DELETE /api/events/:id - Delete event
- GET /api/events/types - Get event types
- GET /api/events/:id/full-info - Get event full information
- GET /api/events/:id/attendees - Get event attendees
- GET /api/events/:id/speakers - Get event speakers
- GET /api/events/:id/sponsors - Get event sponsors

### Attendances
- GET /api/attendances - Get all attendances
- GET /api/attendances/:id - Get attendance by ID
- POST /api/attendances - Create new attendance (register for an event)
- DELETE /api/attendances/:id - Delete attendance (cancel registration)

### Speakers
- GET /api/speakers - Get all speakers
- GET /api/speakers/:id - Get speaker by ID
- POST /api/speakers - Create new speaker
- PUT /api/speakers/:id - Update speaker
- DELETE /api/speakers/:id - Delete speaker

### Sponsors
- GET /api/sponsors - Get all sponsors
- GET /api/sponsors/:id - Get sponsor by ID
- POST /api/sponsors - Create new sponsor
- PUT /api/sponsors/:id - Update sponsor
- DELETE /api/sponsors/:id - Delete sponsor

## Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Configure your database settings in `.env` file
4. Run the application with `npm start`

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=event_management

# JWT Secret for authentication
JWT_SECRET=your_jwt_secret_key

# Server Port
PORT=3000
```

## Running the API

```
npm install
npm start
```

For development mode:
```
npm run dev
```

## API Authentication

Most endpoints require authentication. To authenticate, include the JWT token in the Authorization header:

```
Authorization: Bearer your_token_here
```

## Error Handling

The API returns appropriate HTTP status codes and error messages in JSON format:

```json
{
  "status": "error",
  "message": "Error message details"
}
```

## Success Responses

Successful responses include a status and data property:

```json
{
  "status": "success",
  "data": {
    "property": "value"
  }
}
```
