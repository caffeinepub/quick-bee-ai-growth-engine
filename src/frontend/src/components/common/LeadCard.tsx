import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, User, Eye } from 'lucide-react';
import { LeadDetailDialog } from '../leads/LeadDetailDialog';
import { ServiceNiche3dIcon } from './ServiceNiche3dIcon';
import type { Lead, PaymentStatus } from '../../backend';

interface LeadCardProps {
  lead: Lead;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500',
  contacted: 'bg-yellow-500',
  qualified: 'bg-green-500',
  proposal: 'bg-purple-500',
  negotiation: 'bg-orange-500',
  closed: 'bg-emerald-600',
  lost: 'bg-gray-500',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-500',
  paid: 'bg-green-500',
  failed: 'bg-red-500',
};

const paymentStatusLabels: Record<string, string> = {
  pending: 'Pending',
  paid: 'Paid',
  failed: 'Failed',
};

export function LeadCard({ lead }: LeadCardProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  const formatINR = (amount: bigint | number) => {
    const num = typeof amount === 'bigint' ? Number(amount) : amount;
    return `₹${num.toLocaleString('en-IN')}`;
  };

  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader>
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{lead.name}</CardTitle>
            <div className="flex flex-col gap-1 items-end">
              <Badge className={statusColors[lead.status] || 'bg-gray-500'}>
                {lead.status}
              </Badge>
              {lead.paymentStatus && (
                <Badge className={paymentStatusColors[lead.paymentStatus] || 'bg-gray-500'}>
                  {paymentStatusLabels[lead.paymentStatus] || lead.paymentStatus}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {lead.niche && lead.niche !== 'default' && (
            <div className="flex items-center gap-2">
              <ServiceNiche3dIcon
                variant="niche"
                niche={lead.niche}
                size={20}
                className="rounded flex-shrink-0"
              />
              <span className="text-sm font-medium">{lead.niche}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span>{lead.city}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="font-semibold text-green-600">
              {formatINR(lead.revenuePotential)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>{lead.owner}</span>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2"
            onClick={() => setDetailsOpen(true)}
          >
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </Button>
        </CardContent>
      </Card>

      <LeadDetailDialog
        lead={lead}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
}
