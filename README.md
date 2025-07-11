# Football Analysis Pro - Complete Application

## Overview
This is a complete football analysis application with home/away team selection, lineup management, and enhanced analysis features.

## Application Structure

### Frontend (React Application)
- **Location**: `football-app/`
- **Framework**: React with Vite
- **UI Library**: Tailwind CSS + shadcn/ui components

### Backend (Mock API Server)
- **Location**: `football_api/`
- **Framework**: Flask
- **Purpose**: Provides mock data for leagues, teams, players, and positions

## Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- Python 3.11
- pnpm (or npm)

### Step 1: Setup Frontend Application
```bash
cd football-app
pnpm install
# or
npm install
```

### Step 2: Setup Backend API Server
```bash
cd football_api
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

## Running the Application

### Step 1: Start the Backend API Server
```bash
cd football_api
source venv/bin/activate  # On Windows: venv\Scripts\activate
python src/main.py
```
The API server will run on `http://127.0.0.1:8000`

### Step 2: Start the Frontend Application
```bash
cd football-app
pnpm run dev --host
# or
npm run dev -- --host
```
The frontend will run on `http://localhost:5173`

## Application Flow

1. **Login** → Use credentials: `admin` / `password`
2. **Competition Selection** → Choose a league (e.g., Premier League)
3. **Home/Away Team Selection** → Select both home and away teams
4. **Team Choice** → Choose which team to create lineup for
5. **Lineup Setup** → Configure starting XI and substitutes
6. **Analysis** → Perform video analysis with enhanced export

## Key Features

### Enhanced User Flow
- **Home/Away Selection**: Choose both teams for the match
- **Team Choice**: Select which team to analyze and create lineup for
- **Flexible Lineup**: Create lineup for either home or away team

### Enhanced Download
- **Smart Filename**: Downloads use format "Home Team Vs Away Team YYYY-MM-DD.csv"
- **Example**: "Manchester United Vs Liverpool FC 2025-06-15.csv"

### Mock Data
- **Leagues**: Premier League, La Liga, Serie A, Bundesliga
- **Teams**: 4 teams per league with realistic data
- **Players**: 23 players per team with positions and jersey numbers
- **Positions**: Goalkeeper, Defender, Midfielder, Forward

## File Structure

```
football-app/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # shadcn/ui components
│   │   ├── categories/     # Analysis event categories
│   │   └── ...             # Other components
│   ├── pages/              # Application pages
│   │   ├── LoginPage.jsx
│   │   ├── LeagueSelection.jsx
│   │   ├── HomeAwaySelection.jsx
│   │   ├── TeamChoice.jsx
│   │   ├── LineupSelection.jsx
│   │   └── AnalysisPage.jsx
│   ├── context/            # React context for state management
│   ├── services/           # API services and mock data
│   └── utils/              # Utility functions
├── package.json
└── vite.config.js

football_api/
├── src/
│   ├── routes/             # API route handlers
│   │   ├── external.py     # External API endpoints
│   │   └── user.py         # User management
│   ├── models/             # Data models
│   ├── database/           # SQLite database
│   └── main.py             # Flask application entry point
└── requirements.txt
```

## API Endpoints

- `GET /api/external/leagues` - Get all leagues
- `GET /api/external/teams?league_id=1` - Get teams by league
- `GET /api/external/players?team_id=1` - Get players by team
- `GET /api/external/positions` - Get all positions

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Kill processes: `fuser -k 8000/tcp` (API) or `fuser -k 5173/tcp` (Frontend)

2. **API Connection Issues**
   - Ensure API server is running on port 8000
   - Check `src/services/api.js` for correct API_BASE_URL

3. **Missing Dependencies**
   - Run `pnpm install` in frontend directory
   - Run `pip install -r requirements.txt` in backend directory

### Development Mode
- Frontend supports hot reload for instant updates
- Backend requires restart for code changes

## Production Deployment
- Frontend: Run `pnpm run build` to create production build
- Backend: Use production WSGI server like Gunicorn

## Support
For issues or questions, refer to the application logs or check the browser console for frontend errors.

