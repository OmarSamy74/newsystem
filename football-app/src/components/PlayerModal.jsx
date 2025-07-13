import { useState ,useEffect } from 'react';
import React from 'react';
import { useApp } from '../context/AppContext';

const PlayerModal = ({ onConfirm, onClose, videoRef, setIsPlaying, title, selectingPlayerOut, selectingPlayerIn }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const { state } = useApp();
  
  // Get all players from the selected lineup (starting + substitutes)
  const allPlayers = [...state.lineup.starting, ...state.lineup.substitutes];

  useEffect(() => {
    console.log('PlayerModal: Available players from lineup:', allPlayers.map(p => p.name));
  }, [allPlayers]);

  useEffect(() => {
    setSelectedPlayer('');
  }, [selectingPlayerOut, selectingPlayerIn]);

  const handleConfirm = () => {
    if (selectedPlayer) {
      onConfirm(selectedPlayer);
      if (videoRef?.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
      if (!selectingPlayerOut && !selectingPlayerIn) {
        onClose();
      }
    } else {
      alert('Please select an option');
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg shadow-xl w-80">
        <h2 className="text-lg mb-2">
          {selectingPlayerOut ? 'Select Player Out' : 
           selectingPlayerIn ? 'Select Player In' : 
           'Select Player'}
        </h2>
        
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="w-full p-2 border rounded mb-4"
        >
          <option value="">Select a player</option>
          {allPlayers.map((player) => (
            <option key={player.id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="px-4 py-2 bg-blue-500 text-white rounded"
            disabled={!selectedPlayer}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;