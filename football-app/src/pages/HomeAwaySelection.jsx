import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ArrowLeft, LogOut, Home, Plane } from 'lucide-react';

const HomeAwaySelection = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [teams, setTeams] = useState([]);
  const [selectedHomeTeam, setSelectedHomeTeam] = useState(null);
  const [selectedAwayTeam, setSelectedAwayTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!state.selectedLeague) {
      navigate('/leagues');
      return;
    }
    fetchTeams();
  }, [state.selectedLeague, navigate]);

  // Get custom teams for the selected league
  const customTeamsForLeague = state.customTeams.filter(team => team.leagueId === state.selectedLeague?.id);
  
  // Combine API teams with custom teams
  const allTeams = [...teams, ...customTeamsForLeague];

  const fetchTeams = async () => {
    try {
      setLoading(true);
      // Only fetch from API if it's not a custom league
      if (state.selectedLeague && !state.selectedLeague.isCustom) {
        const teamsData = await apiService.getTeams(state.selectedLeague.id);
        setTeams(teamsData.data || teamsData || []);
      } else {
        setTeams([]); // Custom leagues don't have API teams
      }
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
      actions.setHomeTeam(selectedHomeTeam);
      actions.setAwayTeam(selectedAwayTeam);
      navigate('/lineup');
    }
  };

  const handleBackToLeagues = () => {
    navigate('/leagues');
  };

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading teams...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button onClick={fetchTeams}>
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={handleBackToLeagues}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Leagues
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Select Teams</h1>
          <p className="text-gray-600">
            {state.selectedLeague?.name} • Choose home and away teams for analysis
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Home Team Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Home className="h-5 w-5 text-green-600" />
                Home Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedHomeTeam ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-green-800">{selectedHomeTeam.name}</h3>
                  <p className="text-green-600 text-sm">{selectedHomeTeam.city}</p>
                  {selectedHomeTeam.stadium && (
                    <p className="text-green-600 text-sm">Stadium: {selectedHomeTeam.stadium}</p>
                  )}
                  {selectedHomeTeam.isCustom && (
                    <p className="text-green-600 text-sm">• Custom Team</p>
                  )}
                </div>
              ) : (
                <div className="bg-muted border border-border rounded-lg p-4 mb-4 text-center">
                  <p className="text-gray-500">No home team selected</p>
                </div>
              )}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allTeams.map((team) => (
                  <Button
                    key={team.id}
                    variant={selectedHomeTeam && selectedHomeTeam.id === team.id ? "default" : "outline"}
                    onClick={() => handleHomeTeamSelect(team)}
                    disabled={selectedAwayTeam && selectedAwayTeam.id === team.id}
                    className={`w-full justify-start text-left h-auto p-3 ${
                      selectedHomeTeam && selectedHomeTeam.id === team.id
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : selectedAwayTeam && selectedAwayTeam.id === team.id
                        ? 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-600">{team.city}</div>
                      {team.isCustom && (
                        <div className="text-xs text-blue-600">Custom Team</div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Away Team Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-center gap-2">
                <Plane className="h-5 w-5 text-blue-600" />
                Away Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selectedAwayTeam ? (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-blue-800">{selectedAwayTeam.name}</h3>
                  <p className="text-blue-600 text-sm">{selectedAwayTeam.city}</p>
                  {selectedAwayTeam.stadium && (
                    <p className="text-blue-600 text-sm">Stadium: {selectedAwayTeam.stadium}</p>
                  )}
                  {selectedAwayTeam.isCustom && (
                    <p className="text-blue-600 text-sm">• Custom Team</p>
                  )}
                </div>
              ) : (
                <div className="bg-muted border border-border rounded-lg p-4 mb-4 text-center">
                  <p className="text-gray-500">No away team selected</p>
                </div>
              )}
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {allTeams.map((team) => (
                  <Button
                    key={team.id}
                    variant={selectedAwayTeam && selectedAwayTeam.id === team.id ? "default" : "outline"}
                    onClick={() => handleAwayTeamSelect(team)}
                    disabled={selectedHomeTeam && selectedHomeTeam.id === team.id}
                    className={`w-full justify-start text-left h-auto p-3 ${
                      selectedAwayTeam && selectedAwayTeam.id === team.id
                        ? 'bg-blue-100 border-blue-300 text-blue-800'
                        : selectedHomeTeam && selectedHomeTeam.id === team.id
                        ? 'bg-muted border-border text-muted-foreground cursor-not-allowed'
                        : ''
                    }`}
                  >
                    <div>
                      <div className="font-medium">{team.name}</div>
                      <div className="text-sm text-gray-600">{team.city}</div>
                      {team.isCustom && (
                        <div className="text-xs text-blue-600">Custom Team</div>
                      )}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Match Summary and Proceed Button */}
        {selectedHomeTeam && selectedAwayTeam && (
          <Card>
            <CardContent className="text-center py-6">
              <CardTitle className="mb-4">Match Setup</CardTitle>
              <div className="text-lg text-gray-700 mb-6">
                <span className="font-semibold text-green-600">{selectedHomeTeam.name}</span>
                <span className="mx-4 text-gray-500">VS</span>
                <span className="font-semibold text-blue-600">{selectedAwayTeam.name}</span>
              </div>
              <Button
                onClick={handleProceed}
                className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3"
                size="lg"
              >
                Proceed to Lineup Setup
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default HomeAwaySelection;

