import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trophy } from 'lucide-react';

const CreateLeagueModal = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    country: '',
    season: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { actions } = useApp();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newLeague = {
        id: `custom_${Date.now()}`,
        name: formData.name,
        country: formData.country,
        season: formData.season || '2024/25',
        description: formData.description,
        isCustom: true,
        createdAt: new Date().toISOString()
      };

      actions.addCustomLeague(newLeague);
      
      // Reset form
      setFormData({
        name: '',
        country: '',
        season: '',
        description: ''
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating league:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      country: '',
      season: '',
      description: ''
    });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Create New League
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-blue-600" />
            Create New League
          </DialogTitle>
          <DialogDescription>
            Create a custom league for your football analysis. This will be saved locally.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">League Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Premier League, La Liga"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              placeholder="e.g., England, Spain"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="season">Season</Label>
            <Input
              id="season"
              name="season"
              value={formData.season}
              onChange={handleInputChange}
              placeholder="e.g., 2024/25"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description of the league"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? 'Creating...' : 'Create League'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLeagueModal;

