import React, { useState } from 'react';
import PlayerModal from '../PlayerModal';
import LocationModal from '../LocationModal';
import TeamModal from '../TeamModal';

const setPiecesSpecialEvents = [
  { type: 'Own Goal For', text: 'Own Goal For', shortcut: null, color: 'bg-purple-500' },
  { type: 'Offside', text: 'Offside', shortcut: null, color: 'bg-purple-600' },
  { type: 'Own Goal', text: 'Own Goal', shortcut: null, color: 'bg-purple-700' },
  { type: 'Error', text: 'Error', shortcut: null, color: 'bg-purple-800' },
  { type: 'Bad Behaviour', text: 'Bad Behaviour', shortcut: null, color: 'bg-gray-500' },
  { type: 'Injury Stop', text: 'Injury Stop', shortcut: null, color: 'bg-gray-600' },
  { type: 'Var Stop', text: 'Var Stop', shortcut: null, color: 'bg-gray-700' },
  { type: 'Ball Drop', text: 'Ball Drop', shortcut: null, color: 'bg-gray-800' },
  { type: 'Water Break', text: 'Water Break', shortcut: null, color: 'bg-teal-700' },
  { type: 'Sub', text: 'Sub', shortcut: null, color: 'bg-purple-600' },
];

const SetPiecesSpecialEvents = ({ videoRef, setIsPlaying, events, setEvents, finalizeEvent, allPlayers }) => {
  const [currentEvent, setCurrentEvent] = useState(null);
  const [showPlayerModal, setShowPlayerModal] = useState(false);
  const [showTeamModal, setShowTeamModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [selectingPlayerOut, setSelectingPlayerOut] = useState(false);
  const [selectingPlayerIn, setSelectingPlayerIn] = useState(false);
  const [showPlayerInModal, setShowPlayerInModal] = useState(false);
  const [locationType, setLocationType] = useState('start');

  const handleStartEvent = (eventType) => {
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    if (eventType === 'Var Stop' || eventType === 'Water Break') {
      const newEvent = {
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0,
        startTime: videoRef.current?.currentTime || 0,
        endTime: videoRef.current?.currentTime || 0,
        duration: 0,
      };
      finalizeEvent(newEvent);
    } else if (eventType === 'Ball Drop') {
      setCurrentEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0,
      });
      setShowLocationModal(true);
    } else if (eventType === 'Own Goal For') {
      setCurrentEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0,
      });
      setShowTeamModal(true);
    } else if (eventType === 'Sub') {
      setCurrentEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0,
        player: null,
        playerOut: null,
        playerIn: null,
      });
      setSelectingPlayerOut(true);
      setSelectingPlayerIn(false);
      setShowPlayerModal(true);
    } else {
      setCurrentEvent({
        type: eventType,
        videoTimestamp: videoRef.current?.currentTime || 0,
      });
      setShowPlayerModal(true);
    }
  };

  const handlePlayerSelect = (playerId) => {
    const player = allPlayers.find(p => p.id.toString() === playerId.toString());
    const playerName = player ? player.name : '';
    
    if (currentEvent.type === 'Sub') {
      setCurrentEvent({ ...currentEvent, playerOut: playerName });
      setShowPlayerModal(false);
      setShowPlayerInModal(true);
    } else {
      setCurrentEvent({ ...currentEvent, player: playerName });
      setShowPlayerModal(false);
      setLocationType('start');
      setShowLocationModal(true);
    }
  };

  const handlePlayerInSelect = (playerId) => {
    const player = allPlayers.find(p => p.id.toString() === playerId.toString());
    const playerName = player ? player.name : '';
    const updatedEvent = { ...currentEvent, playerIn: playerName };
    
    setCurrentEvent(updatedEvent);
    finalizeEvent(updatedEvent); 
    setShowPlayerInModal(false);
  };

  const handleTeamSelect = (teamName) => {
    const updatedEvent = { ...currentEvent, team: teamName };
    setShowTeamModal(false);
    finalizeEvent(updatedEvent);
  };

  const handleLocationSelect = async (x, y) => {
    if (locationType === 'start') {
      setShowLocationModal(false);
      finalizeEvent({ ...currentEvent, startLocation: { x, y } });
    }
  };

  const handleModalClose = () => {
    setShowPlayerModal(false);
    setSelectingPlayerOut(false);
    setSelectingPlayerIn(false);
    setCurrentEvent(null);
  };

  return (
    <div className="p-4">
      <h3 className="text-lg font-bold text-gray-800 mb-2">Set Pieces & Special Events</h3>
      <div className="grid grid-cols-3 gap-2">
        {setPiecesSpecialEvents.map((event) => (
          <button
            key={event.type}
            data-type={event.type}
            onClick={() => handleStartEvent(event.type)}
            className={`${event.color} text-white text-sm py-1 px-2 rounded-lg hover:opacity-80 transition-opacity w-full text-center flex items-center justify-center gap-1`}
          >
            <span>{event.text}</span>
            {event.shortcut && (
              <span className="text-xs text-white px-1 rounded">({event.shortcut})</span>
            )}
          </button>
        ))}
      </div>
      {showPlayerModal && (
        <PlayerModal
          players={allPlayers}
          onConfirm={handlePlayerSelect}
          onClose={() => setShowPlayerModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
          selectingPlayerOut={currentEvent?.type === 'Sub' ? true : false}
          selectingPlayerIn={false}
        />
      )}
      {showTeamModal && (
        <TeamModal
          onConfirm={handleTeamSelect}
          onClose={() => setShowTeamModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
      {showLocationModal && (
        <LocationModal
          onSelect={handleLocationSelect}
          onClose={() => setShowLocationModal(false)}
          videoRef={videoRef}
          setIsPlaying={setIsPlaying}
        />
      )}
    </div>
  );
};

export default SetPiecesSpecialEvents;