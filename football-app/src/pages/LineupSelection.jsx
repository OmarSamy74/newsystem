import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { Loader2, Users, ArrowLeft, LogOut, UserPlus, UserMinus, Play } from 'lucide-react';

const LineupSelection = () => {
  const tacticalPositions = [
    { id: 'GK', name: 'Goalkeeper (GK)', category: 'Goalkeeper' },
    { id: 'CB', name: 'Center Back (CB)', category: 'Defender' },
    { id: 'LB', name: 'Left Back (LB)', category: 'Defender' },
    { id: 'RB', name: 'Right Back (RB)', category: 'Defender' },
    { id: 'LWB', name: 'Left Wing Back (LWB)', category: 'Defender' },
    { id: 'RWB', name: 'Right Wing Back (RWB)', category: 'Defender' },
    { id: 'CDM', name: 'Defensive Midfielder (CDM)', category: 'Midfielder' },
    { id: 'CM', name: 'Central Midfielder (CM)', category: 'Midfielder' },
    { id: 'CAM', name: 'Attacking Midfielder (CAM)', category: 'Midfielder' },
    { id: 'LM', name: 'Left Midfielder (LM)', category: 'Midfielder' },
    { id: 'RM', name: 'Right Midfielder (RM)', category: 'Midfielder' },
    { id: 'LW', name: 'Left Winger (LW)', category: 'Forward' },
    { id: 'RW', name: 'Right Winger (RW)', category: 'Forward' },
    { id: 'ST', name: 'Striker (ST)', category: 'Forward' },
    { id: 'SS', name: 'Second Striker (SS)', category: 'Forward' },
    { id: 'CF', name: 'Center Forward (CF)', category: 'Forward' }
  ];
  const [players, setPlayers] = useState([]);
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { state, actions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.homeTeam && !state.awayTeam) {
      navigate('/home-away');
      return;
    }
    fetchData();
  }, [state.homeTeam, state.awayTeam, navigate]);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      
      // Define default positions if API fails
      const defaultPositions = [
        { id: 1, name: 'Goalkeeper' },
        { id: 2, name: 'Defender' },
        { id: 3, name: 'Midfielder' },
        { id: 4, name: 'Forward' }
      ];
      
      // Try to get positions from API, fallback to defaults
      try {
        const positionsResponse = await apiService.getPositions();
        const positionsData = positionsResponse.data || positionsResponse || defaultPositions;
        setPositions(positionsData);
      } catch (err) {
        console.log('Using default positions');
        setPositions(defaultPositions);
      }
      
      // Get players - check if it's a custom team
      let playersData = [];
      const currentTeam = state.homeTeam || state.awayTeam;
      
      if (currentTeam?.isCustom) {
        // Get custom players for this team
        playersData = state.customPlayers[currentTeam.id] || [];
      } else {
        // Get API players
        try {
          const playersResponse = await apiService.getPlayers(currentTeam.id);
          playersData = playersResponse.data || playersResponse || [];
        } catch (err) {
          console.log('No API players available, using empty array');
          playersData = [];
        }
      }
      
      setPlayers(playersData);
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

  const handlePositionChange = (playerId, newPositionId) => {
    // Update the player's lineup position
    actions.updatePlayerLineupPosition(playerId, newPositionId);
  };

  const handleProceedToAnalysis = () => {
    if (state.lineup.starting.length === 0) {
      setError('Please select at least one player for the starting lineup');
      return;
    }
    // Save lineup data to analysis page
    actions.setLineup(state.lineup);
    navigate('/analysis');
  };

  const handleBack = () => {
    navigate('/home-away');
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
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home/Away Selection
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Setup Lineup</h1>
              <p className="text-gray-600 mt-2">
                {(state.homeTeam || state.awayTeam)?.name} • Select your starting lineup and substitutes
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
                {state.lineup.starting.length > 0 && (
                  <div className="mt-2 p-2 bg-blue-50 rounded border border-blue-200">
                    <p className="text-xs text-blue-800 font-medium">Current Formation:</p>
                    <p className="text-xs text-blue-600">
                      {state.lineup.starting.map(p => p.lineupPosition || p.position).join(' • ')}
                    </p>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {state.lineup.starting.map((player) => (
                    <div
                      key={player.id}
                      className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{player.name}</p>
                        <p className="text-sm text-gray-600">
                          {player.lineupPosition || player.position || 'Unknown'} • #{player.jersey_number || '?'}
                        </p>
                        {player.lineupPosition && player.position && player.lineupPosition !== player.position && (
                          <p className="text-xs text-blue-600 mt-1">
                            Original: {player.position} → Tactical: {player.lineupPosition}
                          </p>
                        )}
                        <div className="mt-2">
                          <select
                            value={player.lineupPosition || ''}
                            onChange={(e) => handlePositionChange(player.id, e.target.value)}
                            className="flex h-7 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="">Select tactical position</option>
                            {player.position && (
                              <option value={player.position}>
                                Keep Original: {player.position}
                              </option>
                            )}
                            {tacticalPositions.map((position) => (
                              <option key={position.id} value={position.id}>
                                {position.name}
                              </option>
                            ))}
                          </select>
                        </div>
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
                          onPositionChange={handlePositionChange}
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
                            onPositionChange={handlePositionChange}
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
const PlayerCard = ({ player, positions, onAddToStarting, isInStarting, onPositionChange }) => {
  const getPositionName = (positionId) => {
    const position = positions.find(p => p.id === positionId);
    return position ? position.name : 'Unknown';
  };

  const handlePositionChange = (newPositionId) => {
    if (onPositionChange) {
      onPositionChange(player.id, parseInt(newPositionId));
    }
  };

  return (
    <div className="flex items-center justify-between p-4 bg-card rounded-lg border hover:shadow-md transition-shadow">
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
        {isInStarting && (
          <div className="mt-2">
            <Label className="text-xs text-gray-600">Tactical Position:</Label>
            <select
              value={player.lineupPosition || ''}
              onChange={(e) => handlePositionChange(player.id, e.target.value)}
              className="flex h-8 w-full rounded-md border border-input bg-transparent px-2 py-1 text-xs shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select tactical position</option>
              {tacticalPositions.map((position) => (
                <option key={position.id} value={position.id}>
                  {position.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Original: {player.position || 'Unknown'} → Tactical: {player.lineupPosition || 'Not assigned'}
            </p>
          </div>
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

