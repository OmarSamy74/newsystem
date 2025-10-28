# API Documentation

## Football Analysis System API

This document describes the REST API endpoints for the Football Analysis System.

## Base URL
```
http://localhost:8000
```

## Authentication
The API uses JWT tokens for authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your-token>
```

## Endpoints

### Authentication

#### POST /auth/login
Login with username and password.

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "access_token": "string",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "string",
    "email": "string"
  }
}
```

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

### Leagues

#### GET /leagues
Get all available leagues.

**Response:**
```json
[
  {
    "id": 1,
    "name": "Premier League",
    "country": "England",
    "logo": "string"
  }
]
```

#### POST /leagues
Create a new league.

**Request Body:**
```json
{
  "name": "string",
  "country": "string",
  "logo": "string"
}
```

### Teams

#### GET /teams
Get all teams for a specific league.

**Query Parameters:**
- `league_id`: League ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "Manchester United",
    "logo": "string",
    "league_id": 1
  }
]
```

#### POST /teams
Create a new team.

**Request Body:**
```json
{
  "name": "string",
  "logo": "string",
  "league_id": 1
}
```

### Players

#### GET /players
Get all players for a specific team.

**Query Parameters:**
- `team_id`: Team ID

**Response:**
```json
[
  {
    "id": 1,
    "name": "Cristiano Ronaldo",
    "position": "ST",
    "jersey_number": 7,
    "team_id": 1
  }
]
```

#### POST /players
Create a new player.

**Request Body:**
```json
{
  "name": "string",
  "position": "string",
  "jersey_number": 1,
  "team_id": 1
}
```

### Events

#### GET /events
Get all events for a specific match.

**Query Parameters:**
- `match_id`: Match ID

**Response:**
```json
[
  {
    "id": 1,
    "timestamp": "00:05:30",
    "duration": 5.5,
    "half": "1st Half",
    "lineup": [
      {
        "id": 1,
        "name": "Player Name",
        "position": "ST",
        "jersey_number": 7
      }
    ],
    "event_type": "Shot",
    "subtype": "Goal",
    "player": "Cristiano Ronaldo",
    "team": "Manchester United",
    "location": {
      "x": 50,
      "y": 30
    },
    "outcome": "Goal",
    "technique": "Right Foot",
    "body_part": "Foot"
  }
]
```

#### POST /events
Create a new event.

**Request Body:**
```json
{
  "timestamp": "00:05:30",
  "duration": 5.5,
  "half": "1st Half",
  "lineup": [
    {
      "id": 1,
      "name": "Player Name",
      "position": "ST",
      "jersey_number": 7
    }
  ],
  "event_type": "Shot",
  "subtype": "Goal",
  "player": "Cristiano Ronaldo",
  "team": "Manchester United",
  "location": {
    "x": 50,
    "y": 30
  },
  "outcome": "Goal",
  "technique": "Right Foot",
  "body_part": "Foot"
}
```

### External Data

#### GET /external/leagues
Get leagues from external API.

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Premier League",
      "country": "England",
      "logo": "string"
    }
  ]
}
```

#### GET /external/teams
Get teams from external API.

**Query Parameters:**
- `league_id`: League ID

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Manchester United",
      "logo": "string",
      "league_id": 1
    }
  ]
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "detail": "Invalid request data"
}
```

### 401 Unauthorized
```json
{
  "detail": "Not authenticated"
}
```

### 403 Forbidden
```json
{
  "detail": "Not enough permissions"
}
```

### 404 Not Found
```json
{
  "detail": "Resource not found"
}
```

### 422 Unprocessable Entity
```json
{
  "detail": [
    {
      "loc": ["body", "field_name"],
      "msg": "error message",
      "type": "error_type"
    }
  ]
}
```

### 500 Internal Server Error
```json
{
  "detail": "Internal server error"
}
```

## Rate Limiting

The API has rate limiting enabled:
- 100 requests per minute per IP
- 1000 requests per hour per authenticated user

## Data Models

### League
```json
{
  "id": "integer",
  "name": "string",
  "country": "string",
  "logo": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Team
```json
{
  "id": "integer",
  "name": "string",
  "logo": "string",
  "league_id": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Player
```json
{
  "id": "integer",
  "name": "string",
  "position": "string",
  "jersey_number": "integer",
  "team_id": "integer",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

### Event
```json
{
  "id": "integer",
  "timestamp": "string",
  "duration": "float",
  "half": "string",
  "lineup": "array",
  "event_type": "string",
  "subtype": "string",
  "player": "string",
  "team": "string",
  "location": "object",
  "outcome": "string",
  "technique": "string",
  "body_part": "string",
  "created_at": "datetime",
  "updated_at": "datetime"
}
```

## Examples

### Creating a Complete Match Analysis

1. **Create League:**
```bash
curl -X POST "http://localhost:8000/leagues" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Custom League", "country": "Custom Country"}'
```

2. **Create Team:**
```bash
curl -X POST "http://localhost:8000/teams" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Custom Team", "league_id": 1}'
```

3. **Create Player:**
```bash
curl -X POST "http://localhost:8000/players" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"name": "Player Name", "position": "ST", "jersey_number": 7, "team_id": 1}'
```

4. **Record Event:**
```bash
curl -X POST "http://localhost:8000/events" \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "timestamp": "00:05:30",
    "duration": 5.5,
    "half": "1st Half",
    "lineup": [{"id": 1, "name": "Player Name", "position": "ST", "jersey_number": 7}],
    "event_type": "Shot",
    "subtype": "Goal",
    "player": "Player Name",
    "team": "Custom Team",
    "location": {"x": 50, "y": 30},
    "outcome": "Goal",
    "technique": "Right Foot",
    "body_part": "Foot"
  }'
```

## Interactive API Documentation

Visit `http://localhost:8000/docs` for interactive API documentation with Swagger UI.
