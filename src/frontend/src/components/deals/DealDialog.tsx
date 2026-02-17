import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreateDeal } from '../../hooks/useDeals';
import { toast } from 'sonner';
import type { Deal } from '../../types/local';

interface DealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  leadId?: string;
  agency: string;
}

export function DealDialog({ open, onOpenChange, leadId, agency }: DealDialogProps) {
  const [value, setValue] = useState('');
  const [status, setStatus] = useState('Open');
  const createDeal = useCreateDeal();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!value || !leadId) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const deal: Deal = {
        id: `deal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        leadId,
        agency,
        status,
        value: parseInt(value),
        createdAt: Date.now(),
      };

      await createDeal.mutateAsync(deal);
      toast.success('Deal created successfully');
      onOpenChange(false);
      setValue('');
      setStatus('Open');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create deal');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Deal</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="value">Deal Value (₹)</Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter deal value"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Open">Open</SelectItem>
                <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDeal.isPending}>
              {createDeal.isPending ? 'Creating...' : 'Create Deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
