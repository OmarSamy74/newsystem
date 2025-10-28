# Football Analysis System

A comprehensive football match analysis application built with React and Python FastAPI.

## Features

### 🏆 **League & Team Management**
- Create custom leagues and teams
- Local storage persistence (no database required)
- Manage multiple leagues and teams

### 👥 **Player Management**
- Create custom players with detailed information
- Assign tactical positions (GK, CB, LB, RB, CDM, CM, CAM, LW, RW, ST, SS, CF)
- Player statistics tracking

### ⚽ **Lineup Selection**
- Tactical formation setup
- Position assignment with dropdown menus
- Visual formation display
- Starting XI and substitutes management

### 📊 **Match Analysis**
- Video upload and playback
- Event tracking with timestamps
- Half/period tracking (1st Half, 2nd Half, Extra Time, Penalties)
- Comprehensive event categorization:
  - **Pass Events**: Ground Pass, Low Pass, High Pass
  - **Shot Events**: Shot, Goal, Save
  - **Possession Events**: Dribble, Dispossessed, Ball Recovery
  - **Defensive Events**: Press, Foul Won, Duel, Interception, Clearance, Block
  - **Set Pieces**: Corner, Free Kick, Throw-in, Penalty

### 📈 **Data Export**
- Export analysis data to CSV/Excel
- Comprehensive event table with all details
- Lineup and formation tracking

## Technology Stack

### Frontend
- **React 18** with modern hooks
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **shadcn/ui** components for consistent UI
- **React Router** for navigation
- **Context API** for state management

### Backend
- **Python FastAPI** for API server
- **Uvicorn** for ASGI server
- **Pydantic** for data validation

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- Python 3.8+
- npm or yarn

### Frontend Setup
```bash
cd football-app
npm install
npm run dev
```

### Backend Setup
```bash
cd football_api
pip install -r requirements.txt
python -m uvicorn src.main:app --reload --host 0.0.0.0 --port 8000
```

## Project Structure

```
football-analysis-complete/
├── football-app/                 # React frontend
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/              # Main application pages
│   │   ├── context/            # State management
│   │   ├── services/           # API services
│   │   └── lib/                # Utilities
│   ├── public/                 # Static assets
│   └── package.json
├── football_api/               # Python backend
│   ├── src/
│   │   ├── routes/             # API endpoints
│   │   ├── models/             # Data models
│   │   └── main.py             # FastAPI app
│   └── requirements.txt
└── README.md
```

## Key Features Implementation

### 1. Custom Data Management
- Local storage for leagues, teams, and players
- No external database dependencies
- Data persistence across sessions

### 2. Tactical Position System
- 16 tactical positions available
- Visual formation display
- Position assignment with dropdowns

### 3. Event Tracking System
- Real-time event recording
- Half/period tracking
- Comprehensive event categorization
- Video timestamp synchronization

### 4. Analysis Dashboard
- Visual formation display
- Event table with filtering
- Export functionality
- Lineup management

## Usage

1. **Create League**: Start by creating a custom league
2. **Add Teams**: Create teams for your league
3. **Manage Players**: Add players to teams with positions
4. **Setup Lineup**: Select starting XI and assign tactical positions
5. **Upload Video**: Upload match video for analysis
6. **Record Events**: Track events during different halves
7. **Export Data**: Export analysis results

## Development

### Running in Development Mode
```bash
# Frontend (http://localhost:5173)
cd football-app && npm run dev

# Backend (http://localhost:8000)
cd football_api && python -m uvicorn src.main:app --reload
```

### Building for Production
```bash
cd football-app
npm run build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.

## Author

**Omar Samy**
- GitHub: [@OmarSamy74](https://github.com/OmarSamy74)
- Repository: [https://github.com/OmarSamy74/newsystem](https://github.com/OmarSamy74/newsystem)

---

Built with ❤️ for football analysis enthusiasts