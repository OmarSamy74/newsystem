import { useState } from 'react';
import React from 'react';

const PlayerReceiverModal = ({ players = [], onConfirm, onClose }) => {
  const [selectedPlayer, setSelectedPlayer] = useState('');

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
          {players.length > 0 && typeof players[0] === 'object'
            ? players.map((player) => (
              <option key={player.id} value={player.id}>{player.name}</option>
            ))
            : players.map((player) => (
              <option key={player} value={player}>{player}</option>
            ))}
        </select>
        <div className="mt-2 flex space-x-2">
          <button
            onClick={() => {
              if (!selectedPlayer) return;
              if (players.length > 0 && typeof players[0] === 'object') {
                const playerObj = players.find(p => p.id.toString() === selectedPlayer);
                onConfirm(playerObj);
              } else {
                onConfirm(selectedPlayer);
              }
            }}
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