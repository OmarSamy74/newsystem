import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import apiService from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Trophy, LogOut } from 'lucide-react';

const LeagueSelection = () => {
  const [leagues, setLeagues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const { state, actions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    fetchLeagues();
  }, []);

  const fetchLeagues = async () => {
    try {
      setIsLoading(true);
      const data = await apiService.getLeagues();
      setLeagues(data.data || []);
    } catch (err) {
      setError('Failed to load leagues. Please try again.');
      console.error('Error fetching leagues:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLeagueSelect = (league) => {
    actions.setLeague(league);
    navigate('/teams');
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
          <p>Loading leagues...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Select League</h1>
            <p className="text-gray-600 mt-2">
              Welcome back, {state.user?.name}! Choose a league to get started.
            </p>
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

        {/* Leagues Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leagues.map((league) => (
            <Card
              key={league.id}
              className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:border-blue-300"
              onClick={() => handleLeagueSelect(league)}
            >
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                  <Trophy className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{league.name}</CardTitle>
                <CardDescription>
                  {league.country && `${league.country} • `}
                  {league.season || 'Current Season'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <Button className="w-full">
                    Select League
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {leagues.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No leagues available</h3>
            <p className="text-gray-600">Please check back later or contact support.</p>
            <Button onClick={fetchLeagues} className="mt-4">
              Retry
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeagueSelection;

