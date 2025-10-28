import { useState ,useEffect } from 'react';
import React from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm w-full max-w-md">
        <div className="px-6">
          <h2 className="text-lg mb-2">
            {selectingPlayerOut ? 'Select Player Out' : 
             selectingPlayerIn ? 'Select Player In' : 
             'Select Player'}
          </h2>
          
          <div className="space-y-2">
            <Label htmlFor="player-select">Player</Label>
            <select
              id="player-select"
              value={selectedPlayer}
              onChange={(e) => setSelectedPlayer(e.target.value)}
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a player</option>
              {allPlayers.map((player) => (
                <option key={player.id} value={player.name}>
                  {player.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={!selectedPlayer}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerModal;