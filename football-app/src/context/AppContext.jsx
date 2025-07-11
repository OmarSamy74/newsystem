import React, { createContext, useContext, useReducer } from 'react';

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
  allPlayers: []
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
  MOVE_TO_STARTING: 'MOVE_TO_STARTING'
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
        newStarting.push(player);
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
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

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
    moveToStarting: (player) => dispatch({ type: actionTypes.MOVE_TO_STARTING, payload: player })
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

