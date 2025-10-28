import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Users } from 'lucide-react';

const CreateTeamModal = ({ leagueId, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    city: '',
    founded: '',
    stadium: '',
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
      const newTeam = {
        id: `custom_team_${Date.now()}`,
        name: formData.name,
        city: formData.city,
        founded: formData.founded,
        stadium: formData.stadium,
        description: formData.description,
        leagueId: leagueId,
        isCustom: true,
        createdAt: new Date().toISOString()
      };

      actions.addCustomTeam(newTeam);
      
      // Reset form
      setFormData({
        name: '',
        city: '',
        founded: '',
        stadium: '',
        description: ''
      });
      
      setIsOpen(false);
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      city: '',
      founded: '',
      stadium: '',
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
            Create New Team
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-green-600" />
            Create New Team
          </DialogTitle>
          <DialogDescription>
            Create a custom team for your league. This will be saved locally.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Team Name *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g., Manchester United, Barcelona"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="e.g., Manchester, Barcelona"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="founded">Founded Year</Label>
            <Input
              id="founded"
              name="founded"
              value={formData.founded}
              onChange={handleInputChange}
              placeholder="e.g., 1878"
              type="number"
              min="1800"
              max="2024"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="stadium">Stadium</Label>
            <Input
              id="stadium"
              name="stadium"
              value={formData.stadium}
              onChange={handleInputChange}
              placeholder="e.g., Old Trafford, Camp Nou"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Optional description of the team"
              rows={3}
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting || !formData.name.trim()}>
              {isSubmitting ? 'Creating...' : 'Create Team'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTeamModal;
