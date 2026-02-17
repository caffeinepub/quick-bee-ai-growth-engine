import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUpdateLeadStatus } from '../../hooks/useLeads';
import { toast } from 'sonner';
import type { Lead } from '../../backend';

interface LeadDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

export function LeadDetailDialog({ open, onOpenChange, lead }: LeadDetailDialogProps) {
  const updateStatus = useUpdateLeadStatus();
  const [selectedStatus, setSelectedStatus] = useState(lead?.status || '');

  if (!lead) return null;

  const handleStatusUpdate = async () => {
    if (selectedStatus === lead.status) {
      toast.info('Status unchanged');
      return;
    }

    try {
      const updatedLead = { ...lead, status: selectedStatus };
      await updateStatus.mutateAsync({ leadId: lead.id, lead: updatedLead });
      toast.success('Lead status updated');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update status');
    }
  };

  const formatINR = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
          <DialogDescription>Lead details and status management</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Contact</Label>
              <p className="font-medium">{lead.contact}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">City</Label>
              <p className="font-medium">{lead.city}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-muted-foreground">Niche</Label>
              <p className="font-medium">{lead.niche}</p>
            </div>
            <div>
              <Label className="text-muted-foreground">Owner</Label>
              <p className="font-medium">{lead.owner}</p>
            </div>
          </div>

          <div>
            <Label className="text-muted-foreground">Revenue Potential</Label>
            <p className="text-xl font-bold text-green-600">{formatINR(lead.revenuePotential)}</p>
          </div>

          <div>
            <Label className="text-muted-foreground">Current Status</Label>
            <div className="mt-2">
              <Badge>{lead.status}</Badge>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Update Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger id="status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="Contacted">Contacted</SelectItem>
                <SelectItem value="Qualified">Qualified</SelectItem>
                <SelectItem value="Proposal Sent">Proposal Sent</SelectItem>
                <SelectItem value="Negotiation">Negotiation</SelectItem>
                <SelectItem value="Won">Won</SelectItem>
                <SelectItem value="Lost">Lost</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleStatusUpdate} disabled={updateStatus.isPending || selectedStatus === lead.status}>
            {updateStatus.isPending ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
