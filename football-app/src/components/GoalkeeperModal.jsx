import React from 'react';
import { Button } from '@/components/ui/button';

const GoalkeeperModal = ({ onConfirm, onClose, videoRef, setIsPlaying, eventType }) => {
const goalkeeperTechniques = [
  { type: 'Shot Saved', color: 'bg-orange-500' },
  { type: 'Save', color: 'bg-orange-600' },
  { type: 'Collected', color: 'bg-orange-700' },
  { type: 'Smother', color: 'bg-orange-800' },
];

  const handleActionSelect = (technique) => {
    if (!technique) {
      alert('Please select a technique.'); 
      return;
    }

    if (videoRef?.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }

    onConfirm(technique);
  };

  return (
    <div className="fixed inset-0 bg-background/80 flex items-center justify-center z-50">
      <div className="bg-card text-card-foreground flex flex-col gap-6 rounded-xl border py-6 shadow-sm w-full max-w-md">
        <div className="px-6">
          <h2 className="text-xl font-bold mb-4">Goalkeeper Action</h2>
          <div className="grid grid-cols-2 gap-2">
            {goalkeeperTechniques.map((technique) => (
              <button
                key={technique.type}
                onClick={() => handleActionSelect(technique.type)}
                className={`p-3 ${technique.color} text-white rounded hover:opacity-90`}
              >
                {technique.type}
              </button>
            ))}
          </div>
          <Button 
            variant="outline"
            onClick={onClose}
            className="mt-4 w-full"
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GoalkeeperModal;