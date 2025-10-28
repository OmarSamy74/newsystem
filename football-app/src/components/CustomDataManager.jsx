import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Users, Trash2, Edit, ArrowLeft } from 'lucide-react';
import CreateLeagueModal from './CreateLeagueModal';
import CreateTeamModal from './CreateTeamModal';

const CustomDataManager = () => {
  const { state, actions } = useApp();
  const navigate = useNavigate();
  const [selectedLeague, setSelectedLeague] = useState(null);

  const handleDeleteLeague = (leagueId) => {
    if (window.confirm('Are you sure you want to delete this league and all its teams?')) {
      // Delete all teams for this league first
      const teamsToDelete = state.customTeams.filter(team => team.leagueId === leagueId);
      teamsToDelete.forEach(team => {
        actions.deleteCustomTeam(team.id);
      });
      // Then delete the league
      actions.deleteCustomLeague(leagueId);
    }
  };

  const handleDeleteTeam = (teamId) => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      actions.deleteCustomTeam(teamId);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/leagues')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Leagues
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Custom Data Manager</h1>
              <p className="text-gray-600 mt-2">
                Manage your custom leagues and teams
              </p>
            </div>
          </div>
          <CreateLeagueModal>
            <Button>
              <Trophy className="h-4 w-4 mr-2" />
              Create League
            </Button>
          </CreateLeagueModal>
        </div>

        <div className="space-y-6">

      {state.customLeagues.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No custom leagues yet</h3>
            <p className="text-gray-600 mb-4">Create your first custom league to get started.</p>
            <CreateLeagueModal>
              <Button>Create Your First League</Button>
            </CreateLeagueModal>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {state.customLeagues.map((league) => (
            <Card key={league.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-blue-600" />
                      {league.name}
                    </CardTitle>
                    <CardDescription>
                      {league.country && `${league.country} • `}
                      {league.season || 'Current Season'}
                      <Badge variant="secondary" className="ml-2">Custom</Badge>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLeague(selectedLeague === league.id ? null : league.id)}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Teams ({state.customTeams.filter(t => t.leagueId === league.id).length})
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteLeague(league.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              {selectedLeague === league.id && (
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Teams in {league.name}</h4>
                      <CreateTeamModal leagueId={league.id}>
                        <Button size="sm">
                          <Users className="h-4 w-4 mr-2" />
                          Add Team
                        </Button>
                      </CreateTeamModal>
                    </div>
                    
                    {state.customTeams.filter(team => team.leagueId === league.id).length === 0 ? (
                      <div className="text-center py-4 text-gray-500">
                        No teams in this league yet.
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {state.customTeams
                          .filter(team => team.leagueId === league.id)
                          .map((team) => (
                            <div key={team.id} className="flex justify-between items-center p-3 border rounded-lg">
                              <div>
                                <div className="font-medium">{team.name}</div>
                                <div className="text-sm text-gray-600">
                                  {team.city && `${team.city} • `}
                                  {team.founded && `Founded ${team.founded}`}
                                </div>
                              </div>
                              <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteTeam(team.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default CustomDataManager;
