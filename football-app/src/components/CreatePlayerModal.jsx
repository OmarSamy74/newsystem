import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, User } from 'lucide-react';

const CreatePlayerModal = ({ teamId, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    jerseyNumber: '',
    age: '',
    nationality: '',
    height: '',
    weight: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { actions } = useApp();

  const positions = [
    { id: 1, name: 'Goalkeeper', short: 'GK' },
    { id: 2, name: 'Defender', short: 'DEF' },
    { id: 3, name: 'Midfielder', short: 'MID' },
    { id: 4, name: 'Forward', short: 'FWD' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const selectedPosition = positions.find(p => p.id.toString() === formData.position);
      const newPlayer = {
        id: `custom_player_${Date.now()}`,
        name: formData.name,
        position: selectedPosition?.name || 'Midfielder',
        position_id: parseInt(formData.position) || 3,
        jersey_number: formData.jerseyNumber,
        age: parseInt(formData.age) || 25,
        nationality: formData.nationality,
        height: formData.height,
        weight: formData.weight,
        teamId: teamId,
        isCustom: true,
        createdAt: new Date().toISOString()
      };

      actions.addPlayerToTeam(teamId, newPlayer);
      
      // Reset form
      setFormData({
        name: '',
        position: '',
        jerseyNumber: '',
        age: '',
        nationality: '',
        height: '',
        weight: ''
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating player:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      position: '',
      jerseyNumber: '',
      age: '',
      nationality: '',
      height: '',
      weight: ''
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create New Player
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            Create New Player
          </DialogTitle>
          <DialogDescription>
            Create a custom player for your team. This will be saved locally.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Player Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Lionel Messi, Cristiano Ronaldo"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Position *</Label>
            <select
              id="position"
              name="position"
              value={formData.position}
              onChange={(e) => handleSelectChange('position', e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select position</option>
              {positions.map((position) => (
                <option key={position.id} value={position.id.toString()}>
                  {position.name} ({position.short})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jerseyNumber">Jersey Number</Label>
              <Input
                id="jerseyNumber"
                name="jerseyNumber"
                value={formData.jerseyNumber}
                onChange={handleInputChange}
                placeholder="e.g., 10"
                type="number"
                min="1"
                max="99"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                name="age"
                value={formData.age}
                onChange={handleInputChange}
                placeholder="e.g., 25"
                type="number"
                min="16"
                max="45"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nationality">Nationality</Label>
            <Input
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleInputChange}
              placeholder="e.g., Argentina, Portugal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="height">Height (cm)</Label>
              <Input
                id="height"
                name="height"
                value={formData.height}
                onChange={handleInputChange}
                placeholder="e.g., 170"
                type="number"
                min="150"
                max="220"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                name="weight"
                value={formData.weight}
                onChange={handleInputChange}
                placeholder="e.g., 70"
                type="number"
                min="50"
                max="120"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim() || !formData.position}>
              {isSubmitting ? 'Creating...' : 'Create Player'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlayerModal;
