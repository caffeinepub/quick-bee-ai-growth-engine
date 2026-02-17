import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAddOutreach } from '../../hooks/useOutreach';
import { toast } from 'sonner';
import type { OutreachActivity } from '../../types/local';

interface StartOutreachDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId: string;
  platform: string;
}

export function StartOutreachDialog({ open, onOpenChange, leadId, platform }: StartOutreachDialogProps) {
  const [message, setMessage] = useState('');
  const addOutreach = useAddOutreach();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    try {
      const activity: OutreachActivity = {
        leadId,
        platform,
        message,
        sent: true,
        replied: false,
        followUpDate: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days from now
        createdAt: Date.now(),
      };

      await addOutreach.mutateAsync(activity);
      toast.success('Outreach activity recorded');
      onOpenChange(false);
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to record outreach');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Start Outreach - {platform}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your outreach message..."
              rows={6}
              required
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={addOutreach.isPending}>
              {addOutreach.isPending ? 'Recording...' : 'Record Outreach'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
