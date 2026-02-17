import { useState } from 'react';
import { useGetUserDeals } from '../hooks/useDeals';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { DealCard } from '../components/deals/DealCard';
import { DealDialog } from '../components/deals/DealDialog';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import type { Deal } from '../types/local';

export default function DealsPage() {
  const { data: deals = [], isLoading } = useGetUserDeals();
  const { data: profile } = useGetCallerUserProfile();
  const [dialogOpen, setDialogOpen] = useState(false);

  const dealsByStatus = {
    Open: deals.filter((d) => d.status === 'Open'),
    'Proposal Sent': deals.filter((d) => d.status === 'Proposal Sent'),
    Won: deals.filter((d) => d.status === 'Won'),
    Lost: deals.filter((d) => d.status === 'Lost'),
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
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Deal
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        {Object.entries(dealsByStatus).map(([status, statusDeals]) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold">{status}</h2>
              <span className="text-sm text-muted-foreground">{statusDeals.length}</span>
            </div>
            <div className="space-y-3">
              {statusDeals.length === 0 ? (
                <Card>
                  <CardContent className="py-8 text-center text-sm text-muted-foreground">
                    No {status.toLowerCase()} deals
                  </CardContent>
                </Card>
              ) : (
                statusDeals.map((deal) => <DealCard key={deal.id} deal={deal} />)
              )}
            </div>
          </div>
        ))}
      </div>

      <DealDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        agency={profile?.agency || 'Default Agency'}
      />
    </div>
  );
}
