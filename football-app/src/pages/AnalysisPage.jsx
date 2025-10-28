import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LogOut, Upload, Play, Pause, Users, Clock, Square } from 'lucide-react';

// Import analysis components
import Navbar from '../components/Navbar';
import ExportButton from '../components/ExportButton';
import EventTable from '../components/EventTable';
import PassEvents from '../components/categories/PassEvents';
import ShotEvents from '../components/categories/ShotEvents';
import PossessionDribblingEvents from '../components/categories/PossessionDribblingEvents';
import DefensiveEvents from '../components/categories/DefensiveEvents';
import SetPiecesSpecialEvents from '../components/categories/SetPiecesSpecialEvents';

const AnalysisPage = () => {
  const [videoSrc, setVideoSrc] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [events, setEvents] = useState([]);
  const [currentHalf, setCurrentHalf] = useState('1st Half');
  const [isHalfActive, setIsHalfActive] = useState(false);
  const videoRef = useRef(null);
  const { state, actions } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
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
        team: event.team || (state.homeTeam?.name || state.awayTeam?.name || 'Unknown Team'),
      }));
      setEvents(parsedEvents);
    }
  }, [state.homeTeam, state.awayTeam]);

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
      player: updatedEvent.type === 'Sub' ? null : updatedEvent.player,
      videoTimestamp: updatedEvent.videoTimestamp || 0,
      extraInfo: updatedEvent.type === 'Sub' ? '-' : updatedEvent.extraInfo || '-',
      passType: updatedEvent.type === 'Sub' ? '-' : updatedEvent.passType || '-',
      bodyPart: updatedEvent.type === 'Sub' ? '-' : updatedEvent.bodyPart || '-',
      saveTechnique: updatedEvent.type === 'Sub' ? '-' : updatedEvent.saveTechnique || '-',
      playerReceiver: updatedEvent.type === 'Sub' ? '-' : updatedEvent.playerReceiver || '-',
      playerOut: updatedEvent.type === 'Sub' ? updatedEvent.playerOut || '-' : '-',
      playerIn: updatedEvent.type === 'Sub' ? updatedEvent.playerIn || '-' : '-',
      team: updatedEvent.team || (state.homeTeam?.name || state.awayTeam?.name || 'Unknown Team'),
      startLocation: updatedEvent.type === 'Sub' ? null : updatedEvent.startLocation,
      endLocation: updatedEvent.type === 'Sub' ? null : updatedEvent.endLocation,
      half: isHalfActive ? currentHalf : 'Not Started',
    };

    const updatedEvents = events.filter((event) => event.id !== completedEvent.id);
    updatedEvents.push(completedEvent);
    setEvents(updatedEvents);
    localStorage.setItem('footballEvents', JSON.stringify(updatedEvents));
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

  const handleHalfStart = () => {
    setIsHalfActive(true);
  };

  const handleHalfEnd = () => {
    setIsHalfActive(false);
  };

  const handleHalfChange = (half) => {
    setCurrentHalf(half);
    setIsHalfActive(false);
  };

  const halfOptions = ['1st Half', '2nd Half', 'Extra Time', 'Penalties'];

  // Get all players (starting + substitutes) for the event components
  const allPlayers = [...state.lineup.starting, ...state.lineup.substitutes];

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

        {/* Half Control */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Match Period Control
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap items-center gap-4">
              {/* Half Selection */}
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium">Period:</label>
                <select
                  value={currentHalf}
                  onChange={(e) => handleHalfChange(e.target.value)}
                  disabled={isHalfActive}
                  className="flex h-9 rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {halfOptions.map((half) => (
                    <option key={half} value={half}>
                      {half}
                    </option>
                  ))}
                </select>
              </div>

              {/* Status Indicator */}
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isHalfActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                <span className="text-sm font-medium">
                  {isHalfActive ? `Recording ${currentHalf}` : 'Not Recording'}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex gap-2">
                {!isHalfActive ? (
                  <Button 
                    onClick={handleHalfStart}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Clock className="h-4 w-4 mr-2" />
                    Start {currentHalf}
                  </Button>
                ) : (
                  <Button 
                    onClick={handleHalfEnd}
                    variant="destructive"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    End {currentHalf}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Current Half Status Banner */}
        {isHalfActive && (
          <div className="mb-6 p-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-lg font-semibold">Recording {currentHalf}</h3>
                  <p className="text-green-100 text-sm">All new events will be tagged with this period</p>
                </div>
              </div>
              <Button 
                onClick={handleHalfEnd}
                variant="secondary"
                className="bg-white text-green-600 hover:bg-green-50"
              >
                <Square className="h-4 w-4 mr-2" />
                End {currentHalf}
              </Button>
            </div>
          </div>
        )}

        {/* Lineup Display */}
        {state.lineup.starting.length > 0 && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Starting Lineup ({state.lineup.starting.length}/11)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Formation Display */}
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-sm font-semibold text-green-800 mb-3">Formation</h4>
                <div className="grid grid-cols-11 gap-1 text-center">
                  {state.lineup.starting.map((player, index) => (
                    <div key={player.id} className="bg-white rounded p-2 border border-gray-200">
                      <div className="text-xs font-semibold text-green-800">
                        {player.lineupPosition || 'POS'}
                      </div>
                      <div className="text-xs text-green-600 truncate">
                        {player.name.split(' ')[0]}
                      </div>
                      <div className="text-xs text-green-500">
                        #{player.jersey_number || '?'}
                      </div>
                    </div>
                  ))}
                  {Array.from({ length: 11 - state.lineup.starting.length }).map((_, index) => (
                    <div key={`empty-${index}`} className="bg-gray-100 rounded p-2 border border-gray-200">
                      <div className="text-xs text-gray-400">Empty</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Player List */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {state.lineup.starting.map((player, index) => (
                  <div key={player.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-blue-900">{player.name}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="text-xs">
                            {player.lineupPosition || player.position || 'Unknown'}
                          </Badge>
                          {player.jersey_number && (
                            <span className="text-xs text-blue-700">#{player.jersey_number}</span>
                          )}
                        </div>
                        {player.lineupPosition && player.position && player.lineupPosition !== player.position && (
                          <p className="text-xs text-gray-500">
                            Original: {player.position}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {state.lineup.starting.length < 11 && (
                <p className="text-sm text-gray-600 mt-4">
                  {11 - state.lineup.starting.length} more players needed for a complete lineup
                </p>
              )}
            </CardContent>
          </Card>
        )}

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
              allPlayers={allPlayers}
              selectedTeam={state.homeTeam?.name || state.awayTeam?.name || 'Unknown Team'}
            />
            <ShotEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              allPlayers={allPlayers}
              selectedTeam={state.homeTeam?.name || state.awayTeam?.name || 'Unknown Team'}
            />
            <PossessionDribblingEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              allPlayers={allPlayers}
              selectedTeam={state.homeTeam?.name || state.awayTeam?.name || 'Unknown Team'}
            />
            <DefensiveEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              allPlayers={allPlayers}
              selectedTeam={state.homeTeam?.name || state.awayTeam?.name || 'Unknown Team'}
            />
            <SetPiecesSpecialEvents
              videoRef={videoRef}
              setIsPlaying={setIsPlaying}
              events={events}
              setEvents={setEvents}
              finalizeEvent={finalizeEvent}
              allPlayers={allPlayers}
              selectedTeam={state.homeTeam?.name || state.awayTeam?.name || 'Unknown Team'}
            />
          </div>
        </div>

        {/* Event Table */}
        <div className="mt-8">
          <EventTable events={events} onEventClick={handleEventClick} setEvents={setEvents} lineup={state.lineup} />
          <div className="mt-4">
            <ExportButton events={events} lineup={state.lineup} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisPage;

