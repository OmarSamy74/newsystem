import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Users, ArrowLeft, LogOut } from 'lucide-react';

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

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getTeams(state.selectedLeague.id);
      setTeams(data);
    } catch (err) {
      setError('Failed to load teams. Please try again.');
      console.error('Error fetching teams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeamSelect = (team) => {
    actions.setTeam(team);
    navigate('/lineup');
  };

  const handleBack = () => {
    navigate('/leagues');
  };

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
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
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leagues
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Select Team</h1>
              <p className="text-gray-600 mt-2">
                {state.selectedLeague?.name} • Choose your team for analysis
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

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => (
            <Card
              key={team.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-300"
              onClick={() => handleTeamSelect(team)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">{team.name}</CardTitle>
                <CardDescription>
                  {team.city && `${team.city} • `}
                  {team.founded && `Founded ${team.founded}`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-2">
                  {team.stadium && (
                    <p className="text-sm text-gray-600">Stadium: {team.stadium}</p>
                  )}
                  <Button className="w-full">
                    Select Team
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {teams.length === 0 && !isLoading && (
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

