import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useGetAllLeads } from '../../hooks/useLeads';
import { useGetCallerUserProfile } from '../../hooks/useCurrentUserProfile';
import { useCreateDeal, useUpdateDeal } from '../../hooks/useDeals';
import { toast } from 'sonner';
import type { Deal } from '../../backend';

interface DealDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deal?: Deal | null;
}

export function DealDialog({ open, onOpenChange, deal }: DealDialogProps) {
  const { data: profile } = useGetCallerUserProfile();
  const { data: leads = [] } = useGetAllLeads();
  const createDeal = useCreateDeal();
  const updateDeal = useUpdateDeal();
  
  const [formData, setFormData] = useState({
    leadId: '',
    value: '',
    status: 'open',
  });

  useEffect(() => {
    if (deal) {
      setFormData({
        leadId: deal.leadId,
        value: Number(deal.value).toString(),
        status: deal.status,
      });
    } else {
      setFormData({ leadId: '', value: '', status: 'open' });
    }
  }, [deal, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!profile?.agency) {
      toast.error('You must have a profile to manage deals');
      return;
    }

    if (!formData.leadId || !formData.value) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const dealData: Deal = {
        id: deal?.id || `deal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        leadId: formData.leadId,
        agency: profile.agency,
        status: formData.status,
        value: BigInt(formData.value),
        createdAt: deal?.createdAt || BigInt(Date.now() * 1000000),
        closeDate: formData.status === 'won' || formData.status === 'lost' ? BigInt(Date.now() * 1000000) : undefined,
      };

      if (deal) {
        await updateDeal.mutateAsync(dealData);
        toast.success('Deal updated successfully');
      } else {
        await createDeal.mutateAsync(dealData);
        toast.success('Deal created successfully');
      }
      
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save deal');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{deal ? 'Edit Deal' : 'Create New Deal'}</DialogTitle>
          <DialogDescription>
            {deal ? 'Update deal details' : 'Create a new deal for a lead'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="lead">Select Lead *</Label>
              <Select value={formData.leadId} onValueChange={(value) => setFormData({ ...formData, leadId: value })} disabled={!!deal}>
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
              <Label htmlFor="value">Deal Value ($) *</Label>
              <Input
                id="value"
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                placeholder="0"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="status">Status</Label>
              <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="open">Open</SelectItem>
                  <SelectItem value="proposalSent">Proposal Sent</SelectItem>
                  <SelectItem value="won">Won</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createDeal.isPending || updateDeal.isPending}>
              {(createDeal.isPending || updateDeal.isPending) ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
