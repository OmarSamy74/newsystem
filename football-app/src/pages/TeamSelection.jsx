import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, ArrowLeft, LogOut, Plus, Trash2 } from 'lucide-react';
import CreateTeamModal from '../components/CreateTeamModal';

const TeamSelection = () => {
  const [teams, setTeams] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { state, actions } = useApp();
  const navigate = useNavigate();

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
      setIsLoading(true);
      // Only fetch from API if it's not a custom league
      if (state.selectedLeague && !state.selectedLeague.isCustom) {
        const data = await apiService.getTeams(state.selectedLeague.id);
        setTeams(data);
      } else {
        setTeams([]); // Custom leagues don't have API teams
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
      setError('Failed to load teams. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleProceedToHomeAway = () => {
    navigate('/home-away');
  };

  const handleBack = () => {
    navigate('/leagues');
  };

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  const handleDeleteCustomTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this custom team?')) {
      actions.deleteCustomTeam(teamId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading teams...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leagues
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Teams</h1>
              <p className="text-gray-600 mt-2">
                {state.selectedLeague?.name} • Add or delete custom teams for this league
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Create Team Button - Only show for custom leagues */}
        {state.selectedLeague?.isCustom && (
          <div className="mb-6">
            <CreateTeamModal leagueId={state.selectedLeague.id}>
              <Button className="w-full md:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Team
              </Button>
            </CreateTeamModal>
          </div>
        )}

        {/* Proceed to Home/Away Selection */}
        <div className="mb-6 text-center space-x-4">
          <Button 
            onClick={() => navigate('/players')}
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-3"
            size="lg"
          >
            Manage Players
          </Button>
          <Button 
            onClick={handleProceedToHomeAway}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            size="lg"
          >
            Proceed to Home/Away Selection
          </Button>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allTeams.map((team) => (
            <Card
              key={team.id}
              className="hover:shadow-lg transition-shadow duration-200"
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">{team.name}</CardTitle>
                <CardDescription>
                  {team.city && `${team.city} • `}
                  {team.founded && `Founded ${team.founded}`}
                  {team.isCustom && ' • Custom'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  {team.stadium && (
                    <p className="text-sm text-gray-600">Stadium: {team.stadium}</p>
                  )}
                  {team.isCustom && (
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      className="w-full"
                      onClick={() => handleDeleteCustomTeam(team.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Team
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {allTeams.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No teams available</h3>
            <p className="text-gray-600">No teams found for this league.</p>
            <Button onClick={fetchTeams} className="mt-4">
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamSelection;

