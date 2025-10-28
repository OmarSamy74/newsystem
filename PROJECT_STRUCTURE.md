# Project Structure

```
football-analysis-complete/
├── 📁 football-app/                    # React Frontend Application
│   ├── 📁 src/
│   │   ├── 📁 components/             # Reusable UI Components
│   │   │   ├── 📁 categories/        # Event Category Components
│   │   │   │   ├── DefensiveEvents.jsx
│   │   │   │   ├── PassEvents.jsx
│   │   │   │   ├── PossessionDribblingEvents.jsx
│   │   │   │   ├── SetPiecesSpecialEvents.jsx
│   │   │   │   └── ShotEvents.jsx
│   │   │   ├── 📁 ui/                 # shadcn/ui Components
│   │   │   │   ├── button.jsx
│   │   │   │   ├── card.jsx
│   │   │   │   ├── dialog.jsx
│   │   │   │   ├── input.jsx
│   │   │   │   ├── label.jsx
│   │   │   │   ├── select.jsx
│   │   │   │   ├── table.jsx
│   │   │   │   └── ... (other UI components)
│   │   │   ├── BodyPartModal.jsx      # Body Part Selection Modal
│   │   │   ├── CreateLeagueModal.jsx  # League Creation Modal
│   │   │   ├── CreatePlayerModal.jsx  # Player Creation Modal
│   │   │   ├── CreateTeamModal.jsx    # Team Creation Modal
│   │   │   ├── CustomDataManager.jsx  # Custom Data Management
│   │   │   ├── EventCategories.jsx    # Event Category Selection
│   │   │   ├── EventTable.jsx         # Events Display Table
│   │   │   ├── ExportButton.jsx      # Data Export Functionality
│   │   │   ├── ExtraInfoModal.jsx    # Additional Event Info
│   │   │   ├── GoalkeeperModal.jsx    # Goalkeeper Event Modal
│   │   │   ├── GoalLocation.jsx       # Goal Location Component
│   │   │   ├── LocationModal.jsx      # Location Selection Modal
│   │   │   ├── Navbar.jsx             # Navigation Bar
│   │   │   ├── PlayerModal.jsx        # Player Selection Modal
│   │   │   ├── PlayerReceiverModal.jsx # Player Receiver Modal
│   │   │   ├── ProtectedRoute.jsx    # Route Protection
│   │   │   ├── ResultModal.jsx       # Event Result Modal
│   │   │   ├── TeamModal.jsx         # Team Selection Modal
│   │   │   └── TechniqueModal.jsx    # Technique Selection Modal
│   │   ├── 📁 context/               # React Context for State Management
│   │   │   └── AppContext.jsx        # Main Application Context
│   │   ├── 📁 hooks/                 # Custom React Hooks
│   │   │   └── use-mobile.js         # Mobile Detection Hook
│   │   ├── 📁 lib/                   # Utility Libraries
│   │   │   └── utils.js              # Utility Functions
│   │   ├── 📁 pages/                 # Main Application Pages
│   │   │   ├── AnalysisPage.jsx      # Match Analysis Page
│   │   │   ├── HomeAwaySelection.jsx # Home/Away Team Selection
│   │   │   ├── LeagueSelection.jsx  # League Selection Page
│   │   │   ├── LineupSelection.jsx   # Lineup Selection Page
│   │   │   ├── LoginPage.jsx         # User Login Page
│   │   │   ├── PlayerManagement.jsx # Player Management Page
│   │   │   ├── TeamChoice.jsx        # Team Choice Page
│   │   │   └── TeamSelection.jsx    # Team Management Page
│   │   ├── 📁 services/              # API Services
│   │   │   ├── api.js                # API Service Layer
│   │   │   └── mockData.js           # Mock Data for Development
│   │   ├── App.css                   # Global Styles
│   │   ├── App.jsx                   # Main App Component
│   │   ├── index.css                 # Base Styles
│   │   └── main.jsx                  # Application Entry Point
│   ├── 📁 public/                    # Static Assets
│   │   ├── 📁 assets/                # Application Assets
│   │   │   ├── goall.jpeg            # Goal Image
│   │   │   ├── image.jpg             # General Image
│   │   │   ├── logo.PNG              # Application Logo
│   │   │   └── react.svg             # React Logo
│   │   └── vite.svg                  # Vite Logo
│   ├── 📁 dist/                      # Production Build Output
│   ├── components.json               # shadcn/ui Configuration
│   ├── eslint.config.js             # ESLint Configuration
│   ├── index.html                    # HTML Template
│   ├── jsconfig.json                 # JavaScript Configuration
│   ├── package.json                  # Node.js Dependencies
│   ├── pnpm-lock.yaml               # Package Lock File
│   └── vite.config.js               # Vite Configuration
├── 📁 football_api/                  # Python FastAPI Backend
│   ├── 📁 src/
│   │   ├── 📁 database/              # Database Files
│   │   │   └── app.db                # SQLite Database
│   │   ├── 📁 models/                # Data Models
│   │   │   └── user.py               # User Model
│   │   ├── 📁 routes/                # API Routes
│   │   │   ├── external.py           # External API Routes
│   │   │   └── user.py               # User Routes
│   │   ├── 📁 static/                # Static Files
│   │   │   └── index.html            # Static HTML
│   │   ├── __init__.py               # Python Package Init
│   │   └── main.py                   # FastAPI Application
│   └── requirements.txt              # Python Dependencies
├── 📁 .github/                       # GitHub Configuration
│   └── 📁 workflows/                 # GitHub Actions
│       └── ci-cd.yml                 # CI/CD Pipeline
├── .gitignore                        # Git Ignore Rules
├── API_DOCUMENTATION.md              # API Documentation
├── CONTRIBUTING.md                   # Contribution Guidelines
├── DEPLOYMENT.md                     # Deployment Guide
├── LICENSE                           # MIT License
└── README.md                         # Project Documentation
```

## Key Components Overview

### 🎯 **Core Features**

#### **League & Team Management**
- **CreateLeagueModal**: Modal for creating custom leagues
- **CreateTeamModal**: Modal for creating custom teams
- **CustomDataManager**: Interface for managing custom data
- **LeagueSelection**: Page for selecting leagues
- **TeamSelection**: Page for team management

#### **Player Management**
- **CreatePlayerModal**: Modal for creating players
- **PlayerManagement**: Page for managing players
- **LineupSelection**: Page for lineup setup

#### **Match Analysis**
- **AnalysisPage**: Main analysis interface
- **EventCategories**: Event category selection
- **EventTable**: Events display table
- **ExportButton**: Data export functionality

#### **Event Modals**
- **BodyPartModal**: Body part selection
- **ExtraInfoModal**: Additional event information
- **GoalkeeperModal**: Goalkeeper-specific events
- **LocationModal**: Location selection
- **PlayerModal**: Player selection
- **PlayerReceiverModal**: Player receiver selection
- **ResultModal**: Event result selection
- **TeamModal**: Team selection
- **TechniqueModal**: Technique selection

### 🔧 **Technical Architecture**

#### **Frontend (React)**
- **State Management**: React Context API (`AppContext.jsx`)
- **Routing**: React Router for navigation
- **UI Components**: shadcn/ui component library
- **Styling**: Tailwind CSS
- **Build Tool**: Vite

#### **Backend (Python)**
- **Framework**: FastAPI
- **Database**: SQLite (local development)
- **Authentication**: JWT tokens
- **API Documentation**: Swagger UI

#### **Data Flow**
1. **User Authentication** → Login/Register
2. **League Selection** → Choose or create league
3. **Team Management** → Create/manage teams
4. **Player Management** → Add players to teams
5. **Lineup Selection** → Setup starting XI
6. **Match Analysis** → Record events and analyze

### 📊 **Data Models**

#### **League**
```javascript
{
  id: number,
  name: string,
  country: string,
  logo: string,
  isCustom: boolean
}
```

#### **Team**
```javascript
{
  id: number,
  name: string,
  logo: string,
  leagueId: number,
  isCustom: boolean
}
```

#### **Player**
```javascript
{
  id: number,
  name: string,
  position: string,
  jerseyNumber: number,
  teamId: number
}
```

#### **Event**
```javascript
{
  id: number,
  timestamp: string,
  duration: number,
  half: string,
  lineup: Array<Player>,
  eventType: string,
  subtype: string,
  player: string,
  team: string,
  location: {x: number, y: number},
  outcome: string,
  technique: string,
  bodyPart: string
}
```

### 🚀 **Development Workflow**

1. **Setup**: Install dependencies for both frontend and backend
2. **Development**: Run both servers simultaneously
3. **Testing**: Use mock data for development
4. **Building**: Create production builds
5. **Deployment**: Deploy to hosting platforms

### 📱 **Responsive Design**

- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Responsive design for tablets
- **Desktop**: Full-featured desktop experience
- **Touch-Friendly**: Touch-optimized interactions

### 🔒 **Security Features**

- **Authentication**: JWT-based authentication
- **Route Protection**: Protected routes for authenticated users
- **Input Validation**: Form validation and sanitization
- **CORS**: Cross-origin resource sharing configuration

### 📈 **Performance Optimizations**

- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Vite build optimizations
- **Caching**: Local storage for custom data
- **Efficient Rendering**: React optimization patterns

This structure provides a comprehensive foundation for a football analysis system with room for future enhancements and scalability.
