import { useState } from 'react';
import React from 'react';
import { useApp } from '../context/AppContext';

const PlayerReceiverModal = ({ onConfirm, onClose, currentPlayer }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');
  const { state } = useApp();
  
  // Get all players from the selected lineup (starting + substitutes) and filter out current player
  const allPlayers = [...state.lineup.starting, ...state.lineup.substitutes];
  const availablePlayers = allPlayers.filter(player => player.name !== currentPlayer);

  const handleConfirm = () => {
    if (selectedPlayer) {
      onConfirm(selectedPlayer);
    }
  };

  return (
    <div className="fixed inset-0 bg-transparent flex items-center justify-center">
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg mb-2">Select Receiver Player</h2>
        <select
          value={selectedPlayer}
          onChange={(e) => setSelectedPlayer(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="" disabled>Select a receiver player</option>
          {availablePlayers.map((player) => (
            <option key={player.id} value={player.name}>
              {player.name}
            </option>
          ))}
        </select>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={handleConfirm}
            className="p-2 bg-blue-500 text-white rounded disabled:opacity-50"
            disabled={!selectedPlayer}
          >
            Confirm
          </button>
          <button onClick={onClose} className="p-2 bg-red-500 text-white rounded">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayerReceiverModal;