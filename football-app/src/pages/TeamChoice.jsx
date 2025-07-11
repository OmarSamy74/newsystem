import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';

const TeamChoice = () => {
  const navigate = useNavigate();
  const { state, actions } = useContext(AppContext);
  const { homeTeam, awayTeam } = state;

  const handleTeamChoice = (team) => {
    actions.setTeam(team);
    navigate('/lineup');
  };

  const handleBackToTeams = () => {
    navigate('/teams');
  };

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  useEffect(() => {
    if (!homeTeam || !awayTeam) {
      navigate('/teams');
    }
  }, [homeTeam, awayTeam, navigate]);

  if (!homeTeam || !awayTeam) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <button
            onClick={handleBackToTeams}
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 flex items-center gap-2"
          >
            ← Back to Teams
          </button>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 flex items-center gap-2"
          >
            🚪 Logout
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Choose Team for Lineup</h1>
          <p className="text-gray-600">
            Select which team you want to create a lineup for
          </p>
        </div>

        {/* Match Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 text-center mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Match Setup</h3>
          <div className="text-lg text-gray-700 mb-6">
            <span className="font-semibold text-green-600">{homeTeam.name}</span>
            <span className="mx-4 text-gray-500">VS</span>
            <span className="font-semibold text-blue-600">{awayTeam.name}</span>
          </div>
        </div>

        {/* Team Choice Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Home Team Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">🏠</div>
              <h2 className="text-2xl font-bold text-green-600 mb-2">{homeTeam.name}</h2>
              <p className="text-gray-600">{homeTeam.city}</p>
              <p className="text-gray-600 text-sm">Stadium: {homeTeam.stadium}</p>
            </div>
            <button
              onClick={() => handleTeamChoice(homeTeam)}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors font-semibold"
            >
              Create Lineup for {homeTeam.name}
            </button>
          </div>

          {/* Away Team Card */}
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4">✈️</div>
              <h2 className="text-2xl font-bold text-blue-600 mb-2">{awayTeam.name}</h2>
              <p className="text-gray-600">{awayTeam.city}</p>
              <p className="text-gray-600 text-sm">Stadium: {awayTeam.stadium}</p>
            </div>
            <button
              onClick={() => handleTeamChoice(awayTeam)}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Create Lineup for {awayTeam.name}
            </button>
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-8 max-w-2xl mx-auto">
          <div className="flex items-start gap-3">
            <div className="text-blue-600 text-xl">ℹ️</div>
            <div>
              <h4 className="font-semibold text-blue-800 mb-1">Choose Your Focus Team</h4>
              <p className="text-blue-700 text-sm">
                Select the team you want to analyze. You'll create a lineup for this team and perform detailed analysis of their performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamChoice;

