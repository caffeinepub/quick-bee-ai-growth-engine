import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddOutreach } from '../../hooks/useOutreach';
import { useGetAllLeads } from '../../hooks/useLeads';
import { toast } from 'sonner';
import type { OutreachActivity } from '../../backend';

interface StartOutreachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  platform: string;
}

export function StartOutreachDialog({ open, onOpenChange, platform }: StartOutreachDialogProps) {
  const { data: leads = [] } = useGetAllLeads();
  const addOutreach = useAddOutreach();
  
  const [formData, setFormData] = useState({
    leadId: '',
    message: '',
    followUpDays: '7',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.leadId || !formData.message) {
      toast.error('Please select a lead and enter a message');
      return;
    }

    try {
      const followUpDate = Date.now() + (parseInt(formData.followUpDays) * 24 * 60 * 60 * 1000);
      
      const activity: OutreachActivity = {
        leadId: formData.leadId,
        platform,
        message: formData.message,
        sent: false,
        replied: false,
        followUpDate: BigInt(followUpDate * 1000000),
        createdAt: BigInt(Date.now() * 1000000),
      };

      await addOutreach.mutateAsync(activity);
      
      toast.success('Outreach activity created successfully');
      onOpenChange(false);
      setFormData({ leadId: '', message: '', followUpDays: '7' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to create outreach activity');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Start {platform} Outreach</DialogTitle>
          <DialogDescription>
            Create a new outreach activity for a lead
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="lead">Select Lead *</Label>
              <Select value={formData.leadId} onValueChange={(value) => setFormData({ ...formData, leadId: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a lead" />
                </SelectTrigger>
                <SelectContent>
                  {leads.map(lead => (
                    <SelectItem key={lead.id} value={lead.id}>
                      {lead.name} - {lead.niche}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder={`Enter your ${platform} message...`}
                rows={6}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="followUp">Follow-up in (days)</Label>
              <Select value={formData.followUpDays} onValueChange={(value) => setFormData({ ...formData, followUpDays: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="14">14 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addOutreach.isPending}>
              {addOutreach.isPending ? 'Creating...' : 'Create Outreach'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
