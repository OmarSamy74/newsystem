import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Loader2, Users, ArrowLeft, LogOut, UserPlus, UserMinus, Play } from 'lucide-react';

const LineupSelection = () => {
  const [players, setPlayers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { state, actions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.selectedTeam) {
      navigate('/team-choice');
      return;
    }
    fetchData();
  }, [state.selectedTeam, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [playersResponse, positionsResponse] = await Promise.all([
        apiService.getPlayers(state.selectedTeam.id),
        apiService.getPositions()
      ]);
      const playersData = playersResponse.data || [];
      const positionsData = positionsResponse.data || [];
      
      setPlayers(playersData);
      setPositions(positionsData);
      actions.setPlayers(playersData);
    } catch (err) {
      setError('Failed to load players. Please try again.');
      console.error('Error fetching data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToStarting = (player) => {
    if (state.lineup.starting.length >= 11) {
      setError('Starting lineup is full (11 players maximum)');
      return;
    }
    actions.addToLineup(player, 'starting');
    setError('');
  };

  const handleRemoveFromStarting = (player) => {
    actions.removeFromLineup(player);
  };

  const handleProceedToAnalysis = () => {
    if (state.lineup.starting.length === 0) {
      setError('Please select at least one player for the starting lineup');
      return;
    }
    navigate('/analysis');
  };

  const handleBack = () => {
    navigate('/team-choice');
  };

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  const getPositionName = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.name : 'Unknown';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Loading players...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Team Choice
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Setup Lineup</h1>
              <p className="text-gray-600 mt-2">
                {state.selectedTeam?.name} • Select your starting lineup and substitutes
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Starting Lineup */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Starting Lineup ({state.lineup.starting.length}/11)
                </CardTitle>
                <CardDescription>
                  Players selected for the starting lineup
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.lineup.starting.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-600">
                          {getPositionName(player.position_id)} • #{player.jersey_number}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFromStarting(player)}
                      >
                        <UserMinus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {state.lineup.starting.length === 0 && (
                    <p className="text-gray-500 text-center py-4">
                      No players selected
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Button
              onClick={handleProceedToAnalysis}
              className="w-full mt-4"
              disabled={state.lineup.starting.length === 0}
            >
              <Play className="h-4 w-4 mr-2" />
              Proceed to Analysis
            </Button>
          </div>

          {/* Available Players */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="all">All Players</TabsTrigger>
                <TabsTrigger value="goalkeepers">GK</TabsTrigger>
                <TabsTrigger value="defenders">DEF</TabsTrigger>
                <TabsTrigger value="midfielders">MID</TabsTrigger>
                <TabsTrigger value="forwards">FWD</TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>All Players</CardTitle>
                    <CardDescription>
                      All available players in the squad
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {state.lineup.substitutes.map((player) => (
                        <PlayerCard
                          key={player.id}
                          player={player}
                          positions={positions}
                          onAddToStarting={handleAddToStarting}
                          isInStarting={state.lineup.starting.some(p => p.id === player.id)}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Position-specific tabs would filter players by position */}
              <TabsContent value="goalkeepers" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Goalkeepers</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {state.lineup.substitutes
                        .filter(player => {
                          const position = positions.find(p => p.id === player.position_id);
                          return position && position.name.toLowerCase().includes('goalkeeper');
                        })
                        .map((player) => (
                          <PlayerCard
                            key={player.id}
                            player={player}
                            positions={positions}
                            onAddToStarting={handleAddToStarting}
                            isInStarting={state.lineup.starting.some(p => p.id === player.id)}
                          />
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Similar structure for other position tabs */}
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

// Player Card Component
const PlayerCard = ({ player, positions, onAddToStarting, isInStarting }) => {
  const getPositionName = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.name : 'Unknown';
  };

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h4 className="font-medium">{player.name}</h4>
        <div className="flex items-center space-x-2 mt-1">
          <Badge variant="secondary">
            {getPositionName(player.position_id)}
          </Badge>
          <span className="text-sm text-gray-600">#{player.jersey_number}</span>
        </div>
        {player.age && (
          <p className="text-sm text-gray-600 mt-1">Age: {player.age}</p>
        )}
      </div>
      <Button
        size="sm"
        onClick={() => onAddToStarting(player)}
        disabled={isInStarting}
      >
        {isInStarting ? (
          'In Starting XI'
        ) : (
          <>
            <UserPlus className="h-4 w-4 mr-1" />
            Add
          </>
        )}
      </Button>
    </div>
  );
};

export default LineupSelection;

