import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useUpdateLeadStatus } from '../../hooks/useLeads';
import { toast } from 'sonner';
import type { Lead } from '../../backend';
import { Mail, MapPin, DollarSign, User } from 'lucide-react';

interface LeadDetailDialogProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LeadDetailDialog({ lead, open, onOpenChange }: LeadDetailDialogProps) {
  const updateStatus = useUpdateLeadStatus();
  const [selectedStatus, setSelectedStatus] = useState(lead?.status || 'cold');

  if (!lead) return null;

  const handleStatusUpdate = async () => {
    if (selectedStatus === lead.status) {
      toast.info('Status unchanged');
      return;
    }

    try {
      await updateStatus.mutateAsync({ leadId: lead.id, status: selectedStatus });
      toast.success('Lead status updated successfully');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update lead status');
    }
  };

  const statusColors: Record<string, string> = {
    cold: 'bg-gray-500',
    contacted: 'bg-blue-500',
    interested: 'bg-yellow-500',
    qualified: 'bg-green-500',
    proposalSent: 'bg-purple-500',
    won: 'bg-emerald-600',
    lost: 'bg-red-500',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>{lead.name}</span>
            <Badge className={statusColors[lead.status] || 'bg-gray-500'}>
              {lead.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            Lead details and status management
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Contact:</span>
              <span>{lead.contact}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">City:</span>
              <span>{lead.city}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <Badge variant="outline">{lead.niche}</Badge>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Revenue Potential:</span>
              <span>${Number(lead.revenuePotential).toLocaleString()}</span>
            </div>
          </div>

          <div className="grid gap-2">
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Owner:</span>
              <span>{lead.owner}</span>
            </div>
          </div>

          <div className="border-t pt-4 mt-2">
            <Label htmlFor="status" className="mb-2 block">Update Status</Label>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cold">Cold</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="interested">Interested</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="proposalSent">Proposal Sent</SelectItem>
                <SelectItem value="won">Won</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
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
