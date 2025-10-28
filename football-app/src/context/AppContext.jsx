import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  selectedLeague: null,
  selectedTeam: null,
  homeTeam: null,
  awayTeam: null,
  selectedPlayers: [],
  lineup: {
    starting: [],
    substitutes: []
  },
  allPlayers: [],
  customTeams: [],
  customPlayers: {},
  customLeagues: []
};

// Action types
const actionTypes = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_LEAGUE: 'SET_LEAGUE',
  SET_TEAM: 'SET_TEAM',
  SET_HOME_TEAM: 'SET_HOME_TEAM',
  SET_AWAY_TEAM: 'SET_AWAY_TEAM',
  SET_PLAYERS: 'SET_PLAYERS',
  SET_LINEUP: 'SET_LINEUP',
  ADD_TO_LINEUP: 'ADD_TO_LINEUP',
  REMOVE_FROM_LINEUP: 'REMOVE_FROM_LINEUP',
  MOVE_TO_SUBSTITUTES: 'MOVE_TO_SUBSTITUTES',
  MOVE_TO_STARTING: 'MOVE_TO_STARTING',
  UPDATE_PLAYER_POSITION: 'UPDATE_PLAYER_POSITION',
  UPDATE_PLAYER_LINEUP_POSITION: 'UPDATE_PLAYER_LINEUP_POSITION',
  ADD_CUSTOM_TEAM: 'ADD_CUSTOM_TEAM',
  UPDATE_CUSTOM_TEAM: 'UPDATE_CUSTOM_TEAM',
  DELETE_CUSTOM_TEAM: 'DELETE_CUSTOM_TEAM',
  ADD_PLAYER_TO_TEAM: 'ADD_PLAYER_TO_TEAM',
  UPDATE_PLAYER_IN_TEAM: 'UPDATE_PLAYER_IN_TEAM',
  DELETE_PLAYER_FROM_TEAM: 'DELETE_PLAYER_FROM_TEAM',
  ADD_CUSTOM_LEAGUE: 'ADD_CUSTOM_LEAGUE',
  UPDATE_CUSTOM_LEAGUE: 'UPDATE_CUSTOM_LEAGUE',
  DELETE_CUSTOM_LEAGUE: 'DELETE_CUSTOM_LEAGUE'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.LOGIN:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true
      };
    
    case actionTypes.LOGOUT:
      return {
        ...initialState
      };
    
    case actionTypes.SET_LEAGUE:
      return {
        ...state,
        selectedLeague: action.payload,
        selectedTeam: null,
        homeTeam: null,
        awayTeam: null,
        selectedPlayers: [],
        lineup: { starting: [], substitutes: [] },
        allPlayers: []
      };
    
    case actionTypes.ADD_CUSTOM_LEAGUE:
      return {
        ...state,
        customLeagues: [...state.customLeagues, action.payload]
      };
    
    case actionTypes.UPDATE_CUSTOM_LEAGUE: {
      const updatedLeague = action.payload;
      return {
        ...state,
        customLeagues: state.customLeagues.map(l => l.id === updatedLeague.id ? updatedLeague : l)
      };
    }
    
    case actionTypes.DELETE_CUSTOM_LEAGUE:
      const deletedLeagueId = action.payload;
      return {
        ...state,
        customLeagues: state.customLeagues.filter(l => l.id !== deletedLeagueId)
      };
    
    case actionTypes.SET_TEAM:
      return {
        ...state,
        selectedTeam: action.payload,
        selectedPlayers: [],
        lineup: { starting: [], substitutes: [] }
      };
    
    case actionTypes.SET_HOME_TEAM:
      return {
        ...state,
        homeTeam: action.payload,
        selectedTeam: action.payload
      };
    
    case actionTypes.SET_AWAY_TEAM:
      return {
        ...state,
        awayTeam: action.payload
      };
    
    case actionTypes.SET_PLAYERS:
      return {
        ...state,
        allPlayers: action.payload,
        lineup: { starting: [], substitutes: action.payload }
      };
    
    case actionTypes.SET_LINEUP:
      return {
        ...state,
        lineup: action.payload
      };
    
    case actionTypes.ADD_TO_LINEUP:
      const { player, position } = action.payload;
      const newStarting = [...state.lineup.starting];
      const newSubstitutes = state.lineup.substitutes.filter(p => p.id !== player.id);
      
      if (position === 'starting') {
        // Add player with default lineup position (their natural position)
        const playerWithLineupPosition = {
          ...player,
          lineupPosition: player.position_id || 1
        };
        newStarting.push(playerWithLineupPosition);
      }
      
      return {
        ...state,
        lineup: {
          starting: newStarting,
          substitutes: newSubstitutes
        }
      };
    
    case actionTypes.REMOVE_FROM_LINEUP:
      const playerToRemove = action.payload;
      return {
        ...state,
        lineup: {
          starting: state.lineup.starting.filter(p => p.id !== playerToRemove.id),
          substitutes: [...state.lineup.substitutes, playerToRemove]
        }
      };
    
    case actionTypes.MOVE_TO_SUBSTITUTES:
      const playerToSub = action.payload;
      return {
        ...state,
        lineup: {
          starting: state.lineup.starting.filter(p => p.id !== playerToSub.id),
          substitutes: [...state.lineup.substitutes, playerToSub]
        }
      };
    
    case actionTypes.MOVE_TO_STARTING:
      const playerToStart = action.payload;
      return {
        ...state,
        lineup: {
          starting: [...state.lineup.starting, playerToStart],
          substitutes: state.lineup.substitutes.filter(p => p.id !== playerToStart.id)
        }
      };
    
    case actionTypes.UPDATE_PLAYER_POSITION:
      const { playerId, lineupPosition } = action.payload;
      return {
        ...state,
        lineup: {
          starting: state.lineup.starting.map(p => 
            p.id === playerId ? { ...p, lineupPosition } : p
          ),
          substitutes: state.lineup.substitutes
        }
      };
    
    case actionTypes.UPDATE_PLAYER_LINEUP_POSITION:
      const { playerId: pid, lineupPosition: lpos } = action.payload;
      return {
        ...state,
        lineup: {
          starting: state.lineup.starting.map(p => 
            p.id === pid ? { ...p, lineupPosition: lpos } : p
          ),
          substitutes: state.lineup.substitutes
        }
      };
    
    case actionTypes.ADD_CUSTOM_TEAM:
      return {
        ...state,
        customTeams: [...state.customTeams, action.payload]
      };
    
    case actionTypes.UPDATE_CUSTOM_TEAM:
      const updatedTeam = action.payload;
      return {
        ...state,
        customTeams: state.customTeams.map(t => t.id === updatedTeam.id ? updatedTeam : t)
      };
    
    case actionTypes.DELETE_CUSTOM_TEAM:
      const deletedTeamId = action.payload;
      const newCustomPlayers = { ...state.customPlayers };
      delete newCustomPlayers[deletedTeamId];
      return {
        ...state,
        customTeams: state.customTeams.filter(t => t.id !== deletedTeamId),
        customPlayers: newCustomPlayers
      };
    
    case actionTypes.ADD_PLAYER_TO_TEAM: {
      const { teamId: addTeamId, player } = action.payload;
      return {
        ...state,
        customPlayers: {
          ...state.customPlayers,
          [addTeamId]: [...(state.customPlayers[addTeamId] || []), player]
        }
      };
    }
    
    case actionTypes.UPDATE_PLAYER_IN_TEAM: {
      const { teamId: updateTeamId, player: updatedPlayer } = action.payload;
      return {
        ...state,
        customPlayers: {
          ...state.customPlayers,
          [updateTeamId]: state.customPlayers[updateTeamId]?.map(p => 
            p.id === updatedPlayer.id ? updatedPlayer : p
          ) || []
        }
      };
    }
    
    case actionTypes.DELETE_PLAYER_FROM_TEAM: {
      const { teamId: deleteTeamId, playerId } = action.payload;
      return {
        ...state,
        customPlayers: {
          ...state.customPlayers,
          [deleteTeamId]: state.customPlayers[deleteTeamId]?.filter(p => p.id !== playerId) || []
        }
      };
    }
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCustomLeagues = localStorage.getItem('football_custom_leagues');
    const savedCustomTeams = localStorage.getItem('football_custom_teams');
    const savedCustomPlayers = localStorage.getItem('football_custom_players');

    if (savedCustomLeagues) {
      try {
        const leagues = JSON.parse(savedCustomLeagues);
        leagues.forEach(league => {
          dispatch({ type: actionTypes.ADD_CUSTOM_LEAGUE, payload: league });
        });
      } catch (error) {
        console.error('Error loading custom leagues:', error);
      }
    }

    if (savedCustomTeams) {
      try {
        const teams = JSON.parse(savedCustomTeams);
        teams.forEach(team => {
          dispatch({ type: actionTypes.ADD_CUSTOM_TEAM, payload: team });
        });
      } catch (error) {
        console.error('Error loading custom teams:', error);
      }
    }

    if (savedCustomPlayers) {
      try {
        const players = JSON.parse(savedCustomPlayers);
        Object.keys(players).forEach(teamId => {
          players[teamId].forEach(player => {
            dispatch({ type: actionTypes.ADD_PLAYER_TO_TEAM, payload: { teamId, player } });
          });
        });
      } catch (error) {
        console.error('Error loading custom players:', error);
      }
    }
  }, []);

  // Save to localStorage whenever custom data changes
  useEffect(() => {
    localStorage.setItem('football_custom_leagues', JSON.stringify(state.customLeagues));
  }, [state.customLeagues]);

  useEffect(() => {
    localStorage.setItem('football_custom_teams', JSON.stringify(state.customTeams));
  }, [state.customTeams]);

  useEffect(() => {
    localStorage.setItem('football_custom_players', JSON.stringify(state.customPlayers));
  }, [state.customPlayers]);

  const actions = {
    login: (user) => dispatch({ type: actionTypes.LOGIN, payload: user }),
    logout: () => dispatch({ type: actionTypes.LOGOUT }),
    setLeague: (league) => dispatch({ type: actionTypes.SET_LEAGUE, payload: league }),
    setTeam: (team) => dispatch({ type: actionTypes.SET_TEAM, payload: team }),
    setHomeTeam: (team) => dispatch({ type: actionTypes.SET_HOME_TEAM, payload: team }),
    setAwayTeam: (team) => dispatch({ type: actionTypes.SET_AWAY_TEAM, payload: team }),
    setPlayers: (players) => dispatch({ type: actionTypes.SET_PLAYERS, payload: players }),
    setLineup: (lineup) => dispatch({ type: actionTypes.SET_LINEUP, payload: lineup }),
    addToLineup: (player, position) => dispatch({ type: actionTypes.ADD_TO_LINEUP, payload: { player, position } }),
    removeFromLineup: (player) => dispatch({ type: actionTypes.REMOVE_FROM_LINEUP, payload: player }),
    moveToSubstitutes: (player) => dispatch({ type: actionTypes.MOVE_TO_SUBSTITUTES, payload: player }),
    moveToStarting: (player) => dispatch({ type: actionTypes.MOVE_TO_STARTING, payload: player }),
    updatePlayerPosition: (playerId, lineupPosition) => dispatch({ type: actionTypes.UPDATE_PLAYER_POSITION, payload: { playerId, lineupPosition } }),
    updatePlayerLineupPosition: (playerId, lineupPosition) => dispatch({ type: actionTypes.UPDATE_PLAYER_LINEUP_POSITION, payload: { playerId, lineupPosition } }),
    addCustomTeam: (team) => dispatch({ type: actionTypes.ADD_CUSTOM_TEAM, payload: team }),
    updateCustomTeam: (team) => dispatch({ type: actionTypes.UPDATE_CUSTOM_TEAM, payload: team }),
    deleteCustomTeam: (teamId) => dispatch({ type: actionTypes.DELETE_CUSTOM_TEAM, payload: teamId }),
    addPlayerToTeam: (teamId, player) => dispatch({ type: actionTypes.ADD_PLAYER_TO_TEAM, payload: { teamId, player } }),
    updatePlayerInTeam: (teamId, player) => dispatch({ type: actionTypes.UPDATE_PLAYER_IN_TEAM, payload: { teamId, player } }),
    deletePlayerFromTeam: (teamId, playerId) => dispatch({ type: actionTypes.DELETE_PLAYER_FROM_TEAM, payload: { teamId, playerId } }),
    addCustomLeague: (league) => dispatch({ type: actionTypes.ADD_CUSTOM_LEAGUE, payload: league }),
    updateCustomLeague: (league) => dispatch({ type: actionTypes.UPDATE_CUSTOM_LEAGUE, payload: league }),
    deleteCustomLeague: (leagueId) => dispatch({ type: actionTypes.DELETE_CUSTOM_LEAGUE, payload: leagueId })
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

// Export the context for direct use
export { AppContext };

