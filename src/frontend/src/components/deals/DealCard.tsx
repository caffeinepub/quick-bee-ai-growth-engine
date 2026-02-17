import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { Deal } from '../../types/local';

interface DealCardProps {
  deal: Deal;
  onStatusChange?: (dealId: string, newStatus: string) => void;
}

export function DealCard({ deal, onStatusChange }: DealCardProps) {
  const formatINR = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'won':
        return 'bg-green-600';
      case 'lost':
        return 'bg-red-600';
      case 'proposal sent':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-base">Deal #{deal.id.slice(0, 8)}</CardTitle>
          <Badge className={getStatusColor(deal.status)}>{deal.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Value</p>
          <p className="text-xl font-bold">{formatINR(deal.value)}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Lead ID</p>
          <p className="text-sm font-mono">{deal.leadId.slice(0, 12)}...</p>
        </div>
      </CardContent>
    </Card>
  );
}
