import { useGetAgencyAnalytics } from '../hooks/useAgencyAnalytics';
import { StatsCard } from '../components/common/StatsCard';
import { ChartBlock } from '../components/common/ChartBlock';
import { DollarSign, Users, TrendingUp, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];

export default function AnalyticsPage() {
  const { data: analytics, isLoading, error } = useGetAgencyAnalytics();

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

  if (error) {
    return (
      <div className="space-y-6">
        <div className="page-header">
          <h1 className="page-title">Analytics</h1>
          <p className="page-description">Advanced business insights</p>
        </div>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Failed to load analytics data. Please try again.</p>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { leads, deals, outreach, services } = analytics;

  // Calculate metrics
  const totalRevenue = deals.filter(d => d.status === 'won').reduce((sum, d) => sum + Number(d.value), 0);
  const totalDeals = deals.length;
  const wonDeals = deals.filter(d => d.status === 'won').length;
  const closeRate = totalDeals > 0 ? Math.round((wonDeals / totalDeals) * 100) : 0;
  const avgDealValue = wonDeals > 0 ? Math.round(totalRevenue / wonDeals) : 0;

  // Revenue by service
  const revenueByService = services.map(service => ({
    name: service.name,
    revenue: Number(service.revenue),
  })).sort((a, b) => b.revenue - a.revenue);

  // Revenue by niche
  const revenueByNiche: Record<string, number> = {};
  deals.filter(d => d.status === 'won').forEach(deal => {
    const lead = leads.find(l => l.id === deal.leadId);
    if (lead) {
      revenueByNiche[lead.niche] = (revenueByNiche[lead.niche] || 0) + Number(deal.value);
    }
  });

  const nicheData = Object.entries(revenueByNiche).map(([name, revenue]) => ({
    name,
    revenue,
  })).sort((a, b) => b.revenue - a.revenue);

  const bestSellingService = revenueByService[0];

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-description">Advanced business insights</p>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Revenue"
          value={`$${totalRevenue.toLocaleString()}`}
          icon={DollarSign}
          subtitle="From won deals"
        />
        <StatsCard
          title="Close Rate"
          value={`${closeRate}%`}
          icon={Target}
          subtitle={`${wonDeals} of ${totalDeals} deals won`}
        />
        <StatsCard
          title="Avg Deal Value"
          value={`$${avgDealValue.toLocaleString()}`}
          icon={TrendingUp}
          subtitle="Per won deal"
        />
        <StatsCard
          title="Total Leads"
          value={leads.length.toString()}
          icon={Users}
          subtitle="In pipeline"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <ChartBlock title="Revenue by Service">
          {revenueByService.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByService}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="oklch(var(--primary))" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No service data available
            </div>
          )}
        </ChartBlock>

        <ChartBlock title="Revenue by Niche">
          {nicheData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={nicheData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="revenue"
                >
                  {nicheData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              No niche data available
            </div>
          )}
        </ChartBlock>
      </div>

      {/* Best Selling Service */}
      {bestSellingService && (
        <ChartBlock title="Best Selling Service">
          <div className="p-6 text-center">
            <h3 className="text-2xl font-bold mb-2">{bestSellingService.name}</h3>
            <p className="text-muted-foreground">
              Generated ${bestSellingService.revenue.toLocaleString()} in revenue
            </p>
          </div>
        </ChartBlock>
      )}
    </div>
  );
}
