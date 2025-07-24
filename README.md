# Event Management Web Project

A comprehensive platform for managing events, attendees, tickets, speakers, and sponsors through a RESTful API, a Flask proxy layer, and a modern front-end interface.

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Directory Structure](#directory-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#database-setup)
  - [Backend API](#backend-api)
  - [Flask Proxy & Front-End](#flask-proxy--front-end)
- [API Endpoints](#api-endpoints)
- [Local Tunneling (ngrok)](#local-tunneling-ngrok)
- [Contributing](#contributing)
- [License](#license)

## Project Overview

This project delivers a full-featured event management system:

1. **Backend API**: Node.js + Express.js application with MySQL persistence. Handles user authentication, events, attendances, tickets, speakers, and sponsors.
2. **Flask Proxy Layer**: Simplifies API calls for the front-end by converting requests into Flask-based GET endpoints.
3. **Front-End**: Static HTML/CSS/JavaScript interface for attendees and organizers to browse events, register/login, purchase tickets, and manage their dashboard.

## Tech Stack

- Node.js (v14+) & Express.js
- MySQL
- Python (3.8+) & Flask
- HTML, CSS, JavaScript
- ngrok for secure local tunneling

## Directory Structure

```
/ (project root)
├─ ngrok.exe
├─ frontend/
│  └─ yeni_frontend/
│     ├─ yeni/
│     │  ├─ flask_project/   # Flask app and README
│     │  └─ ui/              # Static front-end assets
│     └─ yeni_frontend.rar
└─ proje/
   ├─ app.js                # Express server entry point
   ├─ initDb.js             # Database initialization script
   ├─ database.sql          # Raw SQL schema
   ├─ package.json
   ├─ config/               # Database configuration
   ├─ controllers/          # Route handlers
   ├─ middleware/           # Auth middleware
   └─ routes/               # API route definitions
```

## Getting Started

### Prerequisites

- Node.js v14+ & npm
- Python 3.8+ & pip
- MySQL Server
- PowerShell (default shell on Windows)

### Database Setup

1. Navigate to the backend folder:
   ```powershell
   cd proje
   ```
2. Install dependencies:
   ```powershell
   npm install
   ```
3. Copy and configure environment variables:
   ```powershell
   cp .env.example .env
   # Edit .env to set your MySQL credentials and PORT
   ```
4. Initialize the database:
   ```powershell
   node initDb.js
   ```

### Backend API

Start the Express server:
```powershell
npm start
``` 
The API will run at `http://localhost:3000` by default.

### Flask Proxy & Front-End

1. Change to the Flask project directory:
   ```powershell
   cd ../frontend/yeni_frontend/yeni/flask_project
   ```
2. Install Python requirements:
   ```powershell
   pip install -r requirements.txt
   ```
3. Run the Flask proxy:
   ```powershell
   python app.py
   ```
   The proxy will be available at `http://localhost:5000`.

4. Serve or open the front-end UI:
   - Directly open `frontend/yeni_frontend/yeni/ui/htmlFiles/index.html` in your browser
   - Or run a simple HTTP server:
     ```powershell
     cd ../ui
     npm install
     npm run start
     ```

## API Endpoints

Refer to `proje/API_README.md` or `proje/README.md` for detailed endpoint documentation. Key modules include:

- **Auth** (`/api/auth`): register, login, change password
- **Users** (`/api/users`): CRUD operations and user-specific events
- **Events** (`/api/events`), **Attendances**, **Tickets**, **Speakers**, **Sponsors**

## Local Tunneling (ngrok)

Expose your local services for remote testing or demos:
```powershell
.\ngrok.exe http 3000  # Backend API
.\ngrok.exe http 5000  # Flask proxy
```

## Contributing

1. Fork this repository
2. Create a new feature branch
3. Commit your changes with descriptive messages
4. Push to your fork and open a Pull Request

Please follow the established coding standards and include tests where applicable.

## License

This project is licensed under the [MIT License](LICENSE).
