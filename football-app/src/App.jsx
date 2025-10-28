import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';

// Import pages
import LoginPage from './pages/LoginPage';
import LeagueSelection from './pages/LeagueSelection';
import TeamSelection from './pages/TeamSelection';
import HomeAwaySelection from './pages/HomeAwaySelection';
import TeamChoice from './pages/TeamChoice';
import LineupSelection from './pages/LineupSelection';
import AnalysisPage from './pages/AnalysisPage';
import PlayerManagement from './pages/PlayerManagement';
import CustomDataManager from './components/CustomDataManager';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/leagues" element={
              <ProtectedRoute>
                <LeagueSelection />
              </ProtectedRoute>
            } />
            <Route path="/teams" element={
              <ProtectedRoute>
                <TeamSelection />
              </ProtectedRoute>
            } />
            <Route path="/players" element={
              <ProtectedRoute>
                <PlayerManagement />
              </ProtectedRoute>
            } />
            <Route path="/home-away" element={
              <ProtectedRoute>
                <HomeAwaySelection />
              </ProtectedRoute>
            } />
            <Route path="/team-choice" element={
              <ProtectedRoute>
                <TeamChoice />
              </ProtectedRoute>
            } />
            <Route path="/lineup" element={
              <ProtectedRoute>
                <LineupSelection />
              </ProtectedRoute>
            } />
            <Route path="/analysis" element={
              <ProtectedRoute>
                <AnalysisPage />
              </ProtectedRoute>
            } />
            <Route path="/custom-data" element={
              <ProtectedRoute>
                <CustomDataManager />
              </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;

