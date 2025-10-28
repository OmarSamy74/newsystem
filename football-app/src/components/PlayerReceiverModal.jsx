import { useState } from 'react';
import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm w-full max-w-md">
        <div className="px-6">
          <h2 className="text-lg mb-2">Select Receiver Player</h2>
          <div className="space-y-2">
            <Label htmlFor="receiver-select">Receiver Player</Label>
            <select
              id="receiver-select"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="" disabled>Select a receiver player</option>
              {availablePlayers.map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              onClick={handleConfirm}
              disabled={!selectedPlayer}
            >
              Confirm
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerReceiverModal;