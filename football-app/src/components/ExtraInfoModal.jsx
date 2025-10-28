import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

const ExtraInfoModal = ({ onConfirm, onClose, eventType ,videoRef ,setIsPlaying }) => {
  const [extraInfo, setExtraInfo] = useState('');
  const [passType, setPassType] = useState('Open Play');
  const [bodyPart, setBodyPart] = useState('');
  const [saveTechnique, setSaveTechnique] = useState('');

  const extraInfoOptions = ['Recovery', 'Interception', ''];
  const passTypeOptions = ['Open Play', 'Throw-in', 'Corner', 'Free Kick', 'Goal Kick'];
  const bodyPartOptions = ['Right Foot', 'Left Foot', 'Head', 'Chest', 'Right Hand', 'Left Hand', 'Both Hand', ''];
  const saveTechniqueOptions = ['Diving', 'Standing', ''];

const handleConfirm = () => {
  if (videoRef?.current) {
    videoRef.current.pause();
    setIsPlaying(false);
  }
  onConfirm({ extraInfo, passType, bodyPart, saveTechnique });
  onClose();
};

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white text-gray-900 flex flex-col gap-6 rounded-xl border border-gray-200 py-6 shadow-sm w-full max-w-md">
        <div className="px-6">
          <h2 className="text-lg mb-2">Select Extra Information</h2>
          <div className="space-y-2">
            <Label htmlFor="extra-info">Extra Info</Label>
            <select
              id="extra-info"
              value={extraInfo}
              onChange={(e) => setExtraInfo(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {extraInfoOptions.map((option) => (
                <option key={option} value={option}>
                  {option || 'None'}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="pass-type">Pass Type</Label>
            <select
              id="pass-type"
              value={passType}
              onChange={(e) => setPassType(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            >
              {passTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          {eventType === 'Goalkeeper' && (
            <>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Body Part</label>
                <select
                  value={bodyPart}
                  onChange={(e) => setBodyPart(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {bodyPartOptions.map((option) => (
                    <option key={option} value={option}>
                      {option || 'None'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Save Technique</label>
                <select
                  value={saveTechnique}
                  onChange={(e) => setSaveTechnique(e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  {saveTechniqueOptions.map((option) => (
                    <option key={option} value={option}>
                      {option || 'None'}
                    </option>
                  ))}
                </select>
              </div>
            </>
          )}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              onClick={handleConfirm}
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

export default ExtraInfoModal;