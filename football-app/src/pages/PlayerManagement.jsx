import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ArrowLeft, LogOut, Plus, Trash2, User, Users } from 'lucide-react';
import CreatePlayerModal from '../components/CreatePlayerModal';

const PlayerManagement = () => {
  const navigate = useNavigate();
  const { state, actions } = useApp();
  const [selectedTeam, setSelectedTeam] = useState(null);

  useEffect(() => {
    if (!state.selectedLeague) {
      navigate('/leagues');
      return;
    }
  }, [state.selectedLeague, navigate]);

  // Get teams for the selected league
  const teamsForLeague = state.customTeams.filter(team => team.leagueId === state.selectedLeague?.id);

  const handleDeletePlayer = (teamId, playerId) => {
    if (window.confirm('Are you sure you want to delete this player?')) {
      actions.deletePlayerFromTeam(teamId, playerId);
    }
  };

  const handleBackToTeams = () => {
    navigate('/teams');
  };

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  const handleProceedToLineup = () => {
    navigate('/lineup');
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBackToTeams}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Teams
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Player Management</h1>
              <p className="text-gray-600 mt-2">
                {state.selectedLeague?.name} • Manage players for your teams
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Proceed to Lineup */}
        <div className="mb-6 text-center">
          <Button 
            onClick={handleProceedToLineup}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
            size="lg"
          >
            Proceed to Lineup Selection
          </Button>
        </div>

        {/* Teams List */}
        {teamsForLeague.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No teams available</h3>
              <p className="text-gray-600 mb-4">Create teams first to manage players.</p>
              <Button onClick={() => navigate('/teams')}>
                Go to Team Management
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {teamsForLeague.map((team) => (
              <Card key={team.id}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-green-600" />
                        {team.name}
                      </CardTitle>
                      <CardDescription>
                        {team.city && `${team.city} • `}
                        Players: {state.customPlayers[team.id]?.length || 0}
                      </CardDescription>
                    </div>
                    <CreatePlayerModal teamId={team.id}>
                      <Button size="sm">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Player
                      </Button>
                    </CreatePlayerModal>
                  </div>
                </CardHeader>
                
                <CardContent>
                  {state.customPlayers[team.id]?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <User className="h-8 w-8 mx-auto mb-2" />
                      <p>No players in this team yet.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {state.customPlayers[team.id]?.map((player) => (
                        <div key={player.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-semibold">{player.name}</h4>
                              <p className="text-sm text-gray-600">{player.position}</p>
                            </div>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleDeletePlayer(team.id, player.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="text-xs text-gray-500 space-y-1">
                            {player.jersey_number && <p>Jersey: #{player.jersey_number}</p>}
                            {player.age && <p>Age: {player.age}</p>}
                            {player.nationality && <p>Nationality: {player.nationality}</p>}
                            {player.height && <p>Height: {player.height}cm</p>}
                            {player.weight && <p>Weight: {player.weight}kg</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerManagement;
