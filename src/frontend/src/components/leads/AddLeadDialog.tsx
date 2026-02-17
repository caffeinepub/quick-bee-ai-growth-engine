import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddLead } from '../../hooks/useLeads';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { toast } from 'sonner';

interface AddLeadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddLeadDialog({ open, onOpenChange }: AddLeadDialogProps) {
  const { data: profile } = useGetCallerUserProfile();
  const addLead = useAddLead();
  
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    city: '',
    niche: '',
    status: 'cold',
    revenuePotential: '',
    owner: profile?.name || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.agency) {
      toast.error('You must have a profile to add leads');
      return;
    }

    if (!formData.name || !formData.contact || !formData.city || !formData.niche) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await addLead.mutateAsync({
        id: `lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        agency: profile.agency,
        name: formData.name,
        contact: formData.contact,
        city: formData.city,
        niche: formData.niche,
        status: formData.status,
        revenuePotential: BigInt(formData.revenuePotential || 0),
        owner: formData.owner || profile.name,
      });
      
      toast.success('Lead added successfully');
      onOpenChange(false);
      setFormData({
        name: '',
        contact: '',
        city: '',
        niche: '',
        status: 'cold',
        revenuePotential: '',
        owner: profile?.name || '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to add lead');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
          <DialogDescription>
            Enter the details of your new lead. All fields are required.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Lead name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="contact">Contact *</Label>
              <Input
                id="contact"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                placeholder="Email or phone"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="City"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="niche">Niche *</Label>
              <Input
                id="niche"
                value={formData.niche}
                onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                placeholder="e.g., E-commerce, SaaS, Healthcare"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold">Cold</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="interested">Interested</SelectItem>
                  <SelectItem value="qualified">Qualified</SelectItem>
                  <SelectItem value="proposalSent">Proposal Sent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="revenuePotential">Revenue Potential ($)</Label>
              <Input
                id="revenuePotential"
                type="number"
                value={formData.revenuePotential}
                onChange={(e) => setFormData({ ...formData, revenuePotential: e.target.value })}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="owner">Owner</Label>
              <Input
                id="owner"
                value={formData.owner}
                onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                placeholder="Lead owner"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addLead.isPending}>
              {addLead.isPending ? 'Adding...' : 'Add Lead'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
