import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, Calendar } from 'lucide-react';
import type { Deal } from '../../backend';

interface DealCardProps {
  deal: Deal;
  leadName?: string;
  onClick?: () => void;
}

export function DealCard({ deal, leadName, onClick }: DealCardProps) {
  const formatDate = (timestamp: bigint) => {
    const date = new Date(Number(timestamp) / 1000000);
    return date.toLocaleDateString();
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="font-medium">{leadName || `Lead #${deal.leadId.slice(0, 8)}`}</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
              <DollarSign className="h-3 w-3" />
              <span>${Number(deal.value).toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>{formatDate(deal.createdAt)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
