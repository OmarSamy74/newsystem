import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { apiService } from '../services/api';

const HomeAwaySelection = () => {
  const navigate = useNavigate();
  const { state, actions } = useContext(AppContext);
  const { selectedLeague } = state;
  const { setHomeTeam, setAwayTeam } = actions;
  const [teams, setTeams] = useState([]);
  const [selectedHomeTeam, setSelectedHomeTeam] = useState(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedLeague) {
      navigate('/leagues');
      return;
    }
    fetchTeams();
  }, [selectedLeague, navigate]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const teamsData = await apiService.getTeams(selectedLeague.id);
      setTeams(teamsData.data || []);
    } catch (err) {
      setError('Failed to load teams');
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleHomeTeamSelect = (team) => {
    setSelectedHomeTeam(team);
    if (selectedAwayTeam && selectedAwayTeam.id === team.id) {
      setSelectedAwayTeam(null);
    }
  };

  const handleAwayTeamSelect = (team) => {
    setSelectedAwayTeam(team);
    if (selectedHomeTeam && selectedHomeTeam.id === team.id) {
      setSelectedHomeTeam(null);
    }
  };

  const handleProceed = () => {
    if (selectedHomeTeam && selectedAwayTeam) {
      setHomeTeam(selectedHomeTeam);
      setAwayTeam(selectedAwayTeam);
      navigate('/team-choice');
    }
  };

  const handleBackToLeagues = () => {
    navigate('/leagues');
  };

  const handleLogout = () => {
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchTeams}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBackToLeagues}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            ← Back to Leagues
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
          >
            🚪 Logout
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Select Teams</h1>
          <p className="text-gray-600">
            {selectedLeague?.name} • Choose home and away teams for analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Home Team Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              🏠 Home Team
            </h2>
            {selectedHomeTeam ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-green-800">{selectedHomeTeam.name}</h3>
                <p className="text-green-600 text-sm">{selectedHomeTeam.city}</p>
                <p className="text-green-600 text-sm">Stadium: {selectedHomeTeam.stadium}</p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center">
                <p className="text-gray-500">No home team selected</p>
              </div>
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleHomeTeamSelect(team)}
                  disabled={selectedAwayTeam && selectedAwayTeam.id === team.id}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selectedHomeTeam && selectedHomeTeam.id === team.id
                      ? 'bg-green-100 border-green-300'
                      : selectedAwayTeam && selectedAwayTeam.id === team.id
                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-600">{team.city}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Away Team Selection */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center">
              ✈️ Away Team
            </h2>
            {selectedAwayTeam ? (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800">{selectedAwayTeam.name}</h3>
                <p className="text-blue-600 text-sm">{selectedAwayTeam.city}</p>
                <p className="text-blue-600 text-sm">Stadium: {selectedAwayTeam.stadium}</p>
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4 text-center">
                <p className="text-gray-500">No away team selected</p>
              </div>
            )}
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {teams.map((team) => (
                <button
                  key={team.id}
                  onClick={() => handleAwayTeamSelect(team)}
                  disabled={selectedHomeTeam && selectedHomeTeam.id === team.id}
                  className={`w-full text-left p-3 rounded border transition-colors ${
                    selectedAwayTeam && selectedAwayTeam.id === team.id
                      ? 'bg-blue-100 border-blue-300'
                      : selectedHomeTeam && selectedHomeTeam.id === team.id
                      ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-600">{team.city}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Match Summary and Proceed Button */}
        {selectedHomeTeam && selectedAwayTeam && (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Match Setup</h3>
            <div className="text-lg text-gray-700 mb-6">
              <span className="font-semibold text-green-600">{selectedHomeTeam.name}</span>
              <span className="mx-4 text-gray-500">VS</span>
              <span className="font-semibold text-blue-600">{selectedAwayTeam.name}</span>
            </div>
            <button
              onClick={handleProceed}
              className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold"
            >
              ▶ Proceed to Lineup Setup
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeAwaySelection;

