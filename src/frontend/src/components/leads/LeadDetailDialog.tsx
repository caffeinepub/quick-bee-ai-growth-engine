import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateLeadStatus } from '../../hooks/useLeads';
import { toast } from 'sonner';
import type { Lead, PaymentStatus } from '../../backend';

interface LeadDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lead: Lead | null;
}

export function LeadDetailDialog({ open, onOpenChange, lead }: LeadDetailDialogProps) {
  const updateLead = useUpdateLeadStatus();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    city: '',
    niche: '',
    status: '',
    revenuePotential: '',
    owner: '',
    paymentStatus: '' as '' | 'pending' | 'paid' | 'failed',
    notes: '',
  });

  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name,
        contact: lead.contact,
        city: lead.city,
        niche: lead.niche,
        status: lead.status,
        revenuePotential: Number(lead.revenuePotential).toString(),
        owner: lead.owner,
        paymentStatus: lead.paymentStatus ? (lead.paymentStatus as 'pending' | 'paid' | 'failed') : '',
        notes: lead.notes || '',
      });
      setIsEditing(false);
    }
  }, [lead]);

  if (!lead) return null;

  const handleSave = async () => {
    try {
      const updatedLead: Lead = {
        ...lead,
        name: formData.name,
        contact: formData.contact,
        city: formData.city,
        niche: formData.niche,
        status: formData.status,
        revenuePotential: BigInt(formData.revenuePotential || 0),
        owner: formData.owner,
        paymentStatus: formData.paymentStatus ? (formData.paymentStatus as PaymentStatus) : undefined,
        notes: formData.notes || undefined,
      };
      
      await updateLead.mutateAsync({ leadId: lead.id, lead: updatedLead });
      toast.success('Lead updated successfully');
      setIsEditing(false);
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update lead');
    }
  };

  const formatINR = (amount: bigint) => {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  };

  const getPaymentStatusBadge = (status?: PaymentStatus) => {
    if (!status) return null;
    
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-500', label: 'Pending' },
      paid: { color: 'bg-green-500', label: 'Paid' },
      failed: { color: 'bg-red-500', label: 'Failed' },
    };
    
    const variant = variants[status] || { color: 'bg-gray-500', label: status };
    return <Badge className={variant.color}>{variant.label}</Badge>;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Edit Lead' : lead.name}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Update lead information' : 'Lead details and status management'}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="edit">Edit</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Name</Label>
                <p className="font-medium">{lead.name}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Status</Label>
                <div className="mt-1">
                  <Badge>{lead.status}</Badge>
                </div>
              </div>
            </div>

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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-muted-foreground">Revenue Potential</Label>
                <p className="text-xl font-bold text-green-600">{formatINR(lead.revenuePotential)}</p>
              </div>
              {lead.paymentStatus && (
                <div>
                  <Label className="text-muted-foreground">Payment Status</Label>
                  <div className="mt-1">
                    {getPaymentStatusBadge(lead.paymentStatus)}
                  </div>
                </div>
              )}
            </div>

            {lead.notes && (
              <div>
                <Label className="text-muted-foreground">Notes</Label>
                <p className="mt-1 whitespace-pre-wrap text-sm">{lead.notes}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="edit" className="space-y-4 py-4">
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">Name *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-contact">Contact *</Label>
                <Input
                  id="edit-contact"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-city">City *</Label>
                  <Input
                    id="edit-city"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-niche">Niche *</Label>
                  <Input
                    id="edit-niche"
                    value={formData.niche}
                    onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="edit-status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="New">New</SelectItem>
                    <SelectItem value="Contacted">Contacted</SelectItem>
                    <SelectItem value="Qualified">Qualified</SelectItem>
                    <SelectItem value="Proposal">Proposal</SelectItem>
                    <SelectItem value="Negotiation">Negotiation</SelectItem>
                    <SelectItem value="Won">Won</SelectItem>
                    <SelectItem value="Lost">Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-payment-status">Payment Status</Label>
                <Select 
                  value={formData.paymentStatus} 
                  onValueChange={(value) => setFormData({ ...formData, paymentStatus: value as '' | 'pending' | 'paid' | 'failed' })}
                >
                  <SelectTrigger id="edit-payment-status">
                    <SelectValue placeholder="Select payment status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">None</SelectItem>
                    <SelectItem value="pending">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-yellow-500" />
                        Pending
                      </div>
                    </SelectItem>
                    <SelectItem value="paid">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                        Paid
                      </div>
                    </SelectItem>
                    <SelectItem value="failed">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500" />
                        Failed
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-revenue">Revenue Potential (₹)</Label>
                <Input
                  id="edit-revenue"
                  type="number"
                  value={formData.revenuePotential}
                  onChange={(e) => setFormData({ ...formData, revenuePotential: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-owner">Owner</Label>
                <Input
                  id="edit-owner"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="edit-notes">Notes</Label>
                <Textarea
                  id="edit-notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add notes about this lead..."
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleSave} disabled={updateLead.isPending}>
            {updateLead.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
