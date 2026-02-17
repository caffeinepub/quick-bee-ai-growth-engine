import { useGetUserDeals } from '../hooks/useDeals';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DollarSign } from 'lucide-react';

const statusColumns = [
  { id: 'open', label: 'Open', color: 'bg-blue-500' },
  { id: 'proposalSent', label: 'Proposal Sent', color: 'bg-yellow-500' },
  { id: 'won', label: 'Won', color: 'bg-green-600' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export default function DealsPage() {
  const { data: deals = [], isLoading } = useGetUserDeals();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading deals...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
        <p className="text-muted-foreground">Track your sales pipeline</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {statusColumns.map(column => {
          const columnDeals = deals.filter(d => d.status === column.id);
          const totalValue = columnDeals.reduce((sum, d) => sum + Number(d.value), 0);

          return (
            <div key={column.id} className="space-y-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center justify-between">
                    <span>{column.label}</span>
                    <Badge variant="secondary">{columnDeals.length}</Badge>
                  </CardTitle>
                  <p className="text-xs text-muted-foreground">
                    ${totalValue.toLocaleString()}
                  </p>
                </CardHeader>
              </Card>

              <div className="space-y-2">
                {columnDeals.map(deal => (
                  <Card key={deal.id} className="cursor-move hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium">Lead #{deal.leadId.slice(0, 8)}</p>
                          <div className="flex items-center gap-1 mt-2 text-sm text-muted-foreground">
                            <DollarSign className="h-3 w-3" />
                            <span>${Number(deal.value).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
