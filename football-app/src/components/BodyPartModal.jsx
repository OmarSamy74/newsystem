import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const BodyPartModal = ({ onConfirm, onClose, videoRef, setIsPlaying }) => {
  const [selectedBodyPart, setSelectedBodyPart] = useState('');

  const bodyParts = [
    'Right Foot',
    'Left Foot',
    'Head',
    'Chest',
    'Right Hand',
    'Left Hand',
    'Both Hands',
  ];

  const handleConfirm = () => {
    if (selectedBodyPart) {
      onConfirm(selectedBodyPart);
      if (videoRef?.current) {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full max-w-md">
        <div className="px-6">
          <h2 className="text-lg font-bold mb-4">Select Body Part</h2>
          <div className="space-y-2">
            <Label htmlFor="body-part-select">Body Part</Label>
            <select
              id="body-part-select"
              value={selectedBodyPart}
              onChange={(e) => setSelectedBodyPart(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">-- Select Body Part --</option>
              {bodyParts.map((part) => (
                <option key={part} value={part}>
                  {part}
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
              disabled={!selectedBodyPart}
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyPartModal;