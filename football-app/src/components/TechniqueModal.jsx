import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const TechniqueModal = ({ eventType, onConfirm, onClose ,videoRef ,setIsPlaying}) => {
const techniques = {
  'Ground Pass': ['Head', 'Right Foot', 'Left Foot', 'Other', 'Keeper Arm', 'Heel', 'Arial Pass'],
  'Low Pass': ['Head', 'Right Foot', 'Left Foot', 'Other', 'Keeper Arm', 'Heel'],
  'High Pass': ['Head', 'Right Foot', 'Left Foot', 'Other', 'Keeper Arm', 'Heel'],
  'Dribble': ['Over run', 'Nut'],
  'Dribble Past': ['Over run', 'Nut'],
  'Shot': ['Normal Shot', 'Volley', 'Penalty', 'Half volly', 'over kik'],
  'Goalkeeper': ['Shot Saved', 'Save', 'Punch', 'Collected', 'Smother', 'Penalty Saved', 'Keeper Sweeper', 'Goal Conceded', 'Penalty Conceded', 'Shot Faced'],
  'Duel': ['Aerial', 'Tackle']
};

  const [selectedTechnique, setSelectedTechnique] = useState('');

const handleSubmit = () => {
  onConfirm(selectedTechnique || 'Not Specified'); 
   if (videoRef.current) {
      videoRef.current.pause(); 
      setIsPlaying();
    }
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm w-full max-w-md">
        <div className="px-6">
          <h2 className="text-xl font-bold mb-4">Select Technique</h2>

          <div className="space-y-2">
            <Label htmlFor="technique-select">Technique</Label>
            <select
              id="technique-select"
              className="flex h-9 w-full rounded-md border border-gray-300 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              value={selectedTechnique}
              onChange={(e) => setSelectedTechnique(e.target.value)}
            >
              <option value="">-- Choose a technique --</option>
              {techniques[eventType]?.map((tech) => (
                <option key={tech} value={tech}>
                  {tech}
                </option>
              ))}
            </select>
          </div>

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleSubmit}
              disabled={!selectedTechnique}
              className="flex-1"
            >
              Confirm
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechniqueModal;
