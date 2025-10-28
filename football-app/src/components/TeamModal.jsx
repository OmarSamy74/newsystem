import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const TeamModal = ({ onConfirm, onClose, videoRef, setIsPlaying }) => {
  const [selectedTeam, setSelectedTeam] = useState('');
  const teamOptions = ['Team 1', 'Team 2'];

  const handleConfirm = () => {
    if (videoRef?.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
    if (selectedTeam) {
      onConfirm(selectedTeam);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full max-w-md">
        <div className="px-6">
          <h2 className="text-lg mb-2">Select Team</h2>
          <div className="space-y-2">
            <Label htmlFor="team-select">Team</Label>
            <select
              id="team-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Select a team</option>
              {teamOptions.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              onClick={handleConfirm}
              disabled={!selectedTeam}
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

export default TeamModal;