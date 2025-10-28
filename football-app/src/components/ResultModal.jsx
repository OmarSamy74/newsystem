import React from 'react';
import { Button } from '@/components/ui/button';

const ResultModal = ({ eventType, currentEvent, onConfirm, onClose, videoRef, setIsPlaying, outcomes }) => {
  const results = outcomes || (
    eventType === 'Goalkeeper' && currentEvent?.actionType === 'Punch'
      ? ['Fail', 'In Play Danger', 'In Play Safe', 'Punched Out', 'Punch Outcome']
      : eventType === 'Goalkeeper' && currentEvent?.actionType === 'Keeper Sweeper'
        ? ['Clam', 'Clear']
        : eventType === 'Goalkeeper'
          ? ['Success', 'In Play Safe', 'In Play Danger', 'Saved Twice', 'Touched Out', 'Touched In', 'No Touch']
          : eventType === 'Dribble'
            ? ['Successful', 'Unsuccessful']
            : eventType === 'Interception'
              ? ['Won', 'Lost In Play', 'Lost Out']
              : eventType === 'Duel'
                ? ['Lost Out', 'Lost In Play', 'Success In Play', 'Won']
                : ['Complete', 'Incomplete', 'Out']
  );

  const handleResultSelect = (result) => {
    onConfirm(result);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm w-full max-w-sm">
        <div className="px-6">
          <h2 className="text-lg font-semibold mb-4">Select Result</h2>
          <div className="flex flex-col space-y-2">
            {results.length > 0 ? (
              results.map((result) => (
                <Button
                  key={result}
                  onClick={() => handleResultSelect(result)}
                  variant="outline"
                  className="justify-start"
                >
                  {result}
                </Button>
              ))
            ) : (
              <p className="text-destructive">No results available for this event.</p>
            )}
            <Button
              variant="destructive"
              onClick={onClose}
              className="mt-4"
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultModal;