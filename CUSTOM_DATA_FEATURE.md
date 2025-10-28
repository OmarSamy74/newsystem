# Football Analysis App - Custom Data Feature

## Overview
The Football Analysis App now supports creating and managing custom leagues and teams with local storage persistence. Users can create their own leagues and add teams without needing a database connection.

## Features Added

### 1. Custom League Creation
- Users can create custom leagues with the following fields:
  - League Name (required)
  - Country (optional)
  - Season (optional, defaults to 2024/25)
  - Description (optional)
- Custom leagues are marked with a "Custom" badge
- Custom leagues can be deleted (with confirmation)

### 2. Custom Team Creation
- Users can add teams to custom leagues with the following fields:
  - Team Name (required)
  - City (optional)
  - Founded Year (optional)
  - Stadium (optional)
  - Description (optional)
- Custom teams are marked with a "Custom" badge
- Custom teams can be deleted (with confirmation)

### 3. Local Storage Persistence
- All custom data is automatically saved to browser's localStorage
- Data persists between browser sessions
- Data is loaded automatically when the app starts

### 4. Custom Data Manager
- Dedicated page to manage all custom leagues and teams
- Accessible via "Manage Data" button in the league selection page
- Shows all custom leagues with expandable team lists
- Provides centralized management interface

## How to Use

### Creating a Custom League
1. Go to the League Selection page
2. Click "Create Custom League" button
3. Fill in the league details
4. Click "Create League"

### Adding Teams to Custom Leagues
1. Select a custom league from the League Selection page
2. Click "Create Custom Team" button (only visible for custom leagues)
3. Fill in the team details
4. Click "Create Team"

### Managing Custom Data
1. Click "Manage Data" button on the League Selection page
2. View all custom leagues and their teams
3. Expand league cards to see teams
4. Delete leagues or teams using the delete buttons

## Technical Implementation

### Components Added
- `CreateLeagueModal.jsx` - Modal for creating custom leagues
- `CreateTeamModal.jsx` - Modal for creating custom teams
- `CustomDataManager.jsx` - Management interface for custom data

### Context Updates
- Added local storage persistence to `AppContext.jsx`
- Custom data is automatically saved/loaded from localStorage
- State management for custom leagues, teams, and players

### Routing Updates
- Added `/custom-data` route for the Custom Data Manager
- Fixed routing to use correct TeamSelection component

## Data Structure

### Custom League
```javascript
{
  id: "custom_[timestamp]",
  name: "League Name",
  country: "Country",
  season: "2024/25",
  description: "Description",
  isCustom: true,
  createdAt: "ISO timestamp"
}
```

### Custom Team
```javascript
{
  id: "custom_team_[timestamp]",
  name: "Team Name",
  city: "City",
  founded: "Year",
  stadium: "Stadium Name",
  description: "Description",
  leagueId: "league_id",
  isCustom: true,
  createdAt: "ISO timestamp"
}
```

## Local Storage Keys
- `football_custom_leagues` - Stores custom leagues
- `football_custom_teams` - Stores custom teams
- `football_custom_players` - Stores custom players (for future use)

## Benefits
- No database dependency for custom data
- Data persists locally in the browser
- Easy to manage and organize custom content
- Seamless integration with existing API data
- User-friendly interface for data management

