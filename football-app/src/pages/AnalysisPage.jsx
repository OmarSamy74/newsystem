import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, LogOut, Upload, Play, Pause } from 'lucide-react';

// Import analysis components
import Navbar from '../components/Navbar';
import ExportButton from '../components/ExportButton';
import EventTable from '../components/EventTable';
import PassEvents from '../components/categories/PassEvents';
import ShotEvents from '../components/categories/ShotEvents';
import PossessionDribblingEvents from '../components/categories/PossessionDribblingEvents';
import DefensiveEvents from '../components/categories/DefensiveEvents';
import SetPiecesSpecialEvents from '../components/categories/SetPiecesSpecialEvents';

// Enhanced ExportButton component that uses the filename generator
const EnhancedExportButton = ({ events, ...props }) => {
  const { state } = useApp();
  
  const generateFilename = (homeTeam, awayTeam) => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    
    const homeTeamName = homeTeam?.name || 'Home';
    const awayTeamName = awayTeam?.name || 'Away';
    
    return `${homeTeamName} Vs ${awayTeamName} ${dateString}`;
  };
  
  const handleExport = () => {
    const filename = generateFilename(state.homeTeam, state.awayTeam);
    
    // Create CSV content
    const headers = ['Event Type', 'Player', 'Time', 'Extra Info'];
    const csvContent = [
      headers.join(','),
      ...events.map(event => [
        event.eventType || '',
        event.playerName || '',
        event.videoTimestamp || '',
        event.extraInfo || ''
      ].map(field => `"${field}"`).join(','))
    ].join('\n');
    
    // Create and download file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <button
      onClick={handleExport}
      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
      {...props}
    >
      Export Analysis
    </button>
  );
};

const AnalysisPage = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const videoRef = useRef(null);
  const { state, actions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state.homeTeam || !state.awayTeam || state.lineup.starting.length === 0) {
      navigate('/lineup');
      return;
    }
    
    // Load saved video and events from localStorage
    const savedVideo = localStorage.getItem('currentVideo');
    if (savedVideo) {
      setVideoSrc(savedVideo);
    }
    
    const savedEvents = localStorage.getItem('footballEvents');
    if (savedEvents) {
      const parsedEvents = JSON.parse(savedEvents).map((event) => ({
        ...event,
        id: event.id || Date.now() + Math.random(),
        videoTimestamp: event.videoTimestamp || (event.startTime ? new Date(event.startTime).getTime() / 1000 : 0),
        endTime: event.endTime || (event.videoTimestamp || 0),
        duration: event.duration || (event.endTime && event.videoTimestamp ? (event.endTime - event.videoTimestamp) * 1000 / 1000 : 0),
        extraInfo: event.extraInfo || '-',
        passType: event.passType || '-',
        bodyPart: event.bodyPart || '-',
        saveTechnique: event.saveTechnique || '-',
        playerReceiver: event.playerReceiver || '-',
        playerOut: event.playerOut || '-',
        playerIn: event.playerIn || '-',
        team: event.team || '-',
      }));
      setEvents(parsedEvents);
    }
  }, [state.homeTeam, state.awayTeam, state.lineup, navigate]);

  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, []);

  const handleNewVideoUpload = (newVideoURL) => {
    if (videoSrc) {
      URL.revokeObjectURL(videoSrc);
      localStorage.removeItem('currentVideo');
    }
    setVideoSrc(newVideoURL);
    localStorage.setItem('currentVideo', newVideoURL);
  };

  const openVideo = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const newVideoURL = URL.createObjectURL(file);
        handleNewVideoUpload(newVideoURL);
      }
    };
    input.click();
  };

  const togglePlay = async () => {
    try {
      if (!isPlaying) {
        await videoRef.current.play();
      } else {
        videoRef.current.pause();
      }
      setIsPlaying(!isPlaying);
    } catch (error) {
      console.error('Error controlling video:', error);
    }
  };

  const finalizeEvent = (updatedEvent) => {
    const eventId = updatedEvent.id || Date.now() + Math.floor(Math.random() * 1000);
    const endTime = updatedEvent.endTime || (videoRef.current?.currentTime || Date.now() / 1000);
    const duration =
      updatedEvent.type === 'Var Stop' || updatedEvent.type === 'Water Break'
        ? endTime - (updatedEvent.startTime || updatedEvent.videoTimestamp || 0)
        : updatedEvent.endTime && updatedEvent.videoTimestamp
        ? (endTime - updatedEvent.videoTimestamp) * 1000 / 1000
        : 0;

    const completedEvent = {
      ...updatedEvent,
      id: eventId,
      endTime,
      duration,
      player: updatedEvent.type === 'Sub' ? null : (updatedEvent.player || selectedPlayer?.name),
      videoTimestamp: updatedEvent.videoTimestamp || 0,
      extraInfo: updatedEvent.type === 'Sub' ? '-' : updatedEvent.extraInfo || '-',
      passType: updatedEvent.type === 'Sub' ? '-' : updatedEvent.passType || '-',
      bodyPart: updatedEvent.type === 'Sub' ? '-' : updatedEvent.bodyPart || '-',
      saveTechnique: updatedEvent.type === 'Sub' ? '-' : updatedEvent.saveTechnique || '-',
      playerReceiver: updatedEvent.type === 'Sub' ? '-' : updatedEvent.playerReceiver || '-',
      playerOut: updatedEvent.type === 'Sub' ? updatedEvent.playerOut || '-' : '-',
      playerIn: updatedEvent.type === 'Sub' ? updatedEvent.playerIn || '-' : '-',
      team: updatedEvent.team || state.homeTeam?.name || '-',
      startLocation: updatedEvent.type === 'Sub' ? null : updatedEvent.startLocation,
      endLocation: updatedEvent.type === 'Sub' ? null : updatedEvent.endLocation,
    };

    const updatedEvents = events.filter((event) => event.id !== completedEvent.id);
    updatedEvents.push(completedEvent);
    setEvents(updatedEvents);
    localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));

    if (videoRef.current && videoRef.current.src) {
      videoRef.current.pause();
    }
  };

  const handleEventClick = (event) => {
    if (!events.length) return;
    const videoTime = event.videoTimestamp;
    if (videoRef.current) {
      videoRef.current.currentTime = videoTime;
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleBack = () => {
    navigate('/lineup');
  };

  const handleLogout = () => {
    actions.logout();
    navigate('/login');
  };

  // Get all players (starting + substitutes) for dropdown
  const allPlayers = [...state.lineup.starting, ...state.lineup.substitutes];

  console.log("allPlayers in AnalysisPage:", allPlayers);

  useEffect(() => {
    const handleKeyPress = (e) => {
      const keyActions = {
        w: () => document.querySelector(`button[data-type="Ground Pass"]`)?.click(),
        q: () => document.querySelector(`button[data-type="High Pass"]`)?.click(),
        e: () => document.querySelector(`button[data-type="Low Pass"]`)?.click(),
        d: () => document.querySelector(`button[data-type="Shot"]`)?.click(),
        t: () => document.querySelector(`button[data-type="Dribble"]`)?.click(),
        s: () => document.querySelector(`button[data-type="Dispossessed"]`)?.click(),
        5: () => document.querySelector(`button[data-type="Miss control"]`)?.click(),
        r: () => document.querySelector(`button[data-type="Ball Recovery"]`)?.click(),
        g: () => document.querySelector(`button[data-type="Press"]`)?.click(),
        8: () => document.querySelector(`button[data-type="Foul Won"]`)?.click(),
        a: () => document.querySelector(`button[data-type="Duel"]`)?.click(),
        x: () => document.querySelector(`button[data-type="Interception"]`)?.click(),
        f: () => document.querySelector(`button[data-type="Clearance"]`)?.click(),
        b: () => document.querySelector(`button[data-type="Block"]`)?.click(),
        n: () => document.querySelector(`button[data-type="Dribbled Past"]`)?.click(),
        9: () => document.querySelector(`button[data-type="Foul Commit"]`)?.click(),
      };

      if (e.ctrlKey && e.code === 'Digit0') {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
        }
      } else if (e.shiftKey && e.code === 'Digit0') {
        e.preventDefault();
        if (videoRef.current) {
          videoRef.current.currentTime = Math.min(
            videoRef.current.duration,
            videoRef.current.currentTime + 10
          );
        }
      } else if (keyActions[e.key.toLowerCase()]) {
        e.preventDefault();
        keyActions[e.key.toLowerCase()]();
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [events]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Lineup
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Football Analysis</h1>
              <p className="text-gray-600 mt-1">
                {state.homeTeam?.name} vs {state.awayTeam?.name} • Analyzing {state.lineup.starting.length} players
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>

        {/* Player Selection */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Current Player Selection</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select
                  value={selectedPlayer?.id?.toString() || ''}
                  onValueChange={(value) => {
                    const player = allPlayers.find(p => p.id.toString() === value);
                    setSelectedPlayer(player);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a player for analysis" />
                  </SelectTrigger>
                  <SelectContent>
                    {allPlayers.length === 0 ? (
                      <option value="">No players available</option>
                    ) : (
                      allPlayers.map((player) => (
                        <SelectItem key={player.id} value={player.id.toString()}>
                          {player.name}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>
              {selectedPlayer && (
                <div className="text-sm text-gray-600">
                  Selected: <span className="font-medium">{selectedPlayer.name}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-6">
          {/* Video Section */}
          <div className="lg:w-2/3">
            <Card>
              <CardContent className="p-6">
                {videoSrc ? (
                  <video
                    ref={videoRef}
                    src={videoSrc}
                    preload="auto"
                    className="w-full rounded shadow"
                    controls
                  />
                ) : (
                  <div className="aspect-video bg-gray-100 rounded flex items-center justify-center">
                    <div className="text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No video uploaded</p>
                    </div>
                  </div>
                )}
                <div className="mt-4 flex space-x-2">
                  <Button onClick={openVideo}>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Video
                  </Button>
                  <Button onClick={togglePlay} disabled={!videoSrc}>
                    {isPlaying ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Play
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Event Categories */}
          <div className="lg:w-1/3 space-y-4">
            <PassEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              selectedPlayer={selectedPlayer}
              allPlayers={allPlayers}
            />
            <ShotEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              selectedPlayer={selectedPlayer}
            />
            <PossessionDribblingEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              selectedPlayer={selectedPlayer}
            />
            <DefensiveEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              selectedPlayer={selectedPlayer}
            />
            <SetPiecesSpecialEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              selectedPlayer={selectedPlayer}
            />
          </div>
        </div>

        {/* Event Table */}
        <div className="mt-8">
          <EventTable events={events} onEventClick={handleEventClick} setEvents={setEvents} />
          <div className="mt-4">
            <EnhancedExportButton events={events} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;

