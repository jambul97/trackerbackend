# Project Tracker Backend

A backend service for tracking climber locations and managing climbing routes. Built with Node.js, Express, and Supabase.

## Features

- User authentication (signup/login)
- Real-time location tracking
- Route and checkpoint management
- Session tracking
- Rate limiting for tracking endpoints

## Tech Stack

- Node.js
- Express.js
- Supabase (Database)
- JWT Authentication
- Ngrok (Tunnel for development)

## Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- Supabase account and project

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3008
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_key
NGROK_AUTHTOKEN=your_ngrok_auth_token
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication

#### POST /users/signup
Create a new user account
```json
{
  "nama": "string",
  "alamat": "string",
  "tanggal_lahir": "string",
  "umur": "number",
  "username": "string",
  "email": "string",
  "password": "string",
  "telepon": "string"
}
```

#### POST /users/login
Authenticate user
```json
{
  "usernameOremail": "string",
  "password": "string"
}
```

### Tracking

#### POST /tracking/create
Create a single tracking log
```json
{
  "tracking_session_id": "string",
  "timestamp": "string",
  "latitude": "number",
  "longitude": "number",
  "jalur_id": "string",
  "nama_jalur": "string",
  "id_pos": "string",
  "nama_pos": "string"
}
```

#### POST /tracking/batch
Create multiple tracking logs (with rate limiting)
```json
[
  {
    "tracking_session_id": "string",
    "timestamp": "string",
    "latitude": "number",
    "longitude": "number",
    "jalur_id": "string",
    "nama_jalur": "string",
    "id_pos": "string",
    "nama_pos": "string"
  }
]
```

#### GET /tracking/:user_id
Get tracking logs for a specific user

## Rate Limiting

The tracking batch endpoint is rate-limited to 100 requests per minute per IP address.

## Error Handling

The API returns appropriate HTTP status codes and error messages:

- 200: Success
- 201: Created
- 400: Bad Request
- 429: Too Many Requests
- 500: Internal Server Error

## Database Schema

### Users Table
- user_id (UUID)
- nama (string)
- alamat (string)
- tanggal_lahir (date)
- umur (integer)
- username (string, unique)
- email (string, unique)
- password (string, hashed)
- telepon (string)

### Tracking Sessions Table
- tracking_session_id (UUID)
- user_id (UUID, foreign key)
- start_time (timestamp)
- end_time (timestamp)

### Tracking Log Table
- log_id (UUID)
- tracking_session_id (UUID, foreign key)
- timestamp (timestamp)
- latitude (float)
- longitude (float)
- jalur_id (string)
- nama_jalur (string)
- id_pos (string)
- nama_pos (string)

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

ISC