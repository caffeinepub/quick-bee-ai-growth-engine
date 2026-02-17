import { useGetAgencyAnalytics } from '../hooks/useAgencyAnalytics';
import { ChartBlock } from '../components/common/ChartBlock';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function AnalyticsPage() {
  const { data: analytics, isLoading } = useGetAgencyAnalytics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Revenue by service
  const revenueByService = analytics?.services.map(s => ({
    name: s.name,
    revenue: Number(s.revenue),
  })) || [];

  // Revenue by niche
  const nicheRevenue = new Map<string, number>();
  analytics?.leads.forEach(lead => {
    const leadDeals = analytics.deals.filter(d => d.leadId === lead.id && d.status === 'won');
    const revenue = leadDeals.reduce((sum, d) => sum + Number(d.value), 0);
    nicheRevenue.set(lead.niche, (nicheRevenue.get(lead.niche) || 0) + revenue);
  });
  const revenueByNiche = Array.from(nicheRevenue.entries()).map(([name, revenue]) => ({ name, revenue }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
        <p className="text-muted-foreground">Deep dive into your performance metrics</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <ChartBlock title="Revenue by Service">
          {revenueByService.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No service revenue data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--chart-1))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartBlock>

        <ChartBlock title="Revenue by Niche">
          {revenueByNiche.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No niche revenue data yet</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByNiche}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="hsl(var(--chart-2))" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartBlock>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Best Selling Service</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics?.services.sort((a, b) => Number(b.salesCount) - Number(a.salesCount))[0]?.name || 'N/A'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Deal Value</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              ${analytics?.deals.length ? Math.round(analytics.deals.reduce((sum, d) => sum + Number(d.value), 0) / analytics.deals.length).toLocaleString() : 0}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium text-muted-foreground">Close Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {analytics?.deals.length ? Math.round((analytics.deals.filter(d => d.status === 'won').length / analytics.deals.length) * 100) : 0}%
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
