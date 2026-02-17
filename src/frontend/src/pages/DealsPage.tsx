import { useState } from 'react';
import { useGetUserDeals, useUpdateDealStatus } from '../hooks/useDeals';
import { useGetAllLeads } from '../hooks/useLeads';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DealCard } from '../components/deals/DealCard';
import { DealDialog } from '../components/deals/DealDialog';
import type { Deal } from '../backend';

const statusColumns = [
  { id: 'open', label: 'Open', color: 'bg-blue-500' },
  { id: 'proposalSent', label: 'Proposal Sent', color: 'bg-yellow-500' },
  { id: 'won', label: 'Won', color: 'bg-green-600' },
  { id: 'lost', label: 'Lost', color: 'bg-red-500' },
];

export default function DealsPage() {
  const { data: deals = [], isLoading } = useGetUserDeals();
  const { data: leads = [] } = useGetAllLeads();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  const handleDealClick = (deal: Deal) => {
    setSelectedDeal(deal);
    setDialogOpen(true);
  };

  const handleAddDeal = () => {
    setSelectedDeal(null);
    setDialogOpen(true);
  };

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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Deals</h1>
          <p className="text-muted-foreground">Track your sales pipeline</p>
        </div>
        <Button onClick={handleAddDeal}>
          <Plus className="mr-2 h-4 w-4" />
          New Deal
        </Button>
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
                {columnDeals.map(deal => {
                  const lead = leads.find(l => l.id === deal.leadId);
                  return (
                    <DealCard 
                      key={deal.id} 
                      deal={deal} 
                      leadName={lead?.name}
                      onClick={() => handleDealClick(deal)}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      <DealDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        deal={selectedDeal}
      />
    </div>
  );
}
