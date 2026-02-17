import { useGetAgencyAnalytics } from '../hooks/useAgencyAnalytics';
import { useGetCallerUserProfile } from '../hooks/useCurrentUserProfile';
import { StatsCard } from '../components/common/StatsCard';
import { ChartBlock } from '../components/common/ChartBlock';
import { ProgressBar } from '../components/common/ProgressBar';
import { Users, MessageSquare, DollarSign, TrendingUp, Target, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

export default function DashboardPage() {
  const { data: analytics, isLoading } = useGetAgencyAnalytics();
  const { data: profile } = useGetCallerUserProfile();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const totalLeads = analytics?.leads.length || 0;
  const totalOutreach = analytics?.outreach.length || 0;
  const sentOutreach = analytics?.outreach.filter(o => o.sent).length || 0;
  const repliedOutreach = analytics?.outreach.filter(o => o.replied).length || 0;
  const replyRate = sentOutreach > 0 ? Math.round((repliedOutreach / sentOutreach) * 100) : 0;
  
  const wonDeals = analytics?.deals.filter(d => d.status === 'won').length || 0;
  const totalRevenue = analytics?.deals
    .filter(d => d.status === 'won')
    .reduce((sum, d) => sum + Number(d.value), 0) || 0;
  
  const revenueGoal = Number(profile?.totalRevenue || 0);

  // Outreach by platform
  const platformData = ['Email', 'LinkedIn', 'Instagram', 'WhatsApp', 'SMS'].map(platform => ({
    name: platform,
    count: analytics?.outreach.filter(o => o.platform === platform).length || 0,
  }));

  // Conversion funnel
  const funnelData = [
    { stage: 'Cold', count: analytics?.leads.filter(l => l.status === 'cold').length || 0 },
    { stage: 'Contacted', count: analytics?.leads.filter(l => l.status === 'contacted').length || 0 },
    { stage: 'Interested', count: analytics?.leads.filter(l => l.status === 'interested').length || 0 },
    { stage: 'Qualified', count: analytics?.leads.filter(l => l.status === 'qualified').length || 0 },
    { stage: 'Proposal', count: analytics?.leads.filter(l => l.status === 'proposalSent').length || 0 },
    { stage: 'Won', count: analytics?.leads.filter(l => l.status === 'won').length || 0 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (totalLeads === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-96 space-y-4">
        <img
          src="/assets/generated/empty-state-dashboard.dim_1200x800.png"
          alt="No data yet"
          className="w-96 h-64 object-contain opacity-50"
        />
        <h2 className="text-2xl font-bold">Welcome to Quick Bee!</h2>
        <p className="text-muted-foreground">Start by adding your first lead to see your dashboard come to life.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Overview of your agency's performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Total Leads" value={totalLeads} icon={Users} />
        <StatsCard title="Total Outreach" value={totalOutreach} icon={MessageSquare} />
        <StatsCard title="Reply Rate" value={`${replyRate}%`} icon={TrendingUp} />
        <StatsCard title="Closed Deals" value={wonDeals} icon={CheckCircle} />
      </div>

      {/* Revenue Goal Progress */}
      <ChartBlock title="Revenue Goal Progress">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold">${totalRevenue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">of ${revenueGoal.toLocaleString()} goal</p>
            </div>
            <Target className="h-8 w-8 text-muted-foreground" />
          </div>
          <ProgressBar value={totalRevenue} max={revenueGoal} showPercentage />
        </div>
      </ChartBlock>

      {/* Charts Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartBlock title="Outreach by Platform">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={platformData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>

        <ChartBlock title="Conversion Funnel">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={funnelData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="stage" type="category" width={80} />
              <Tooltip />
              <Bar dataKey="count" fill="hsl(var(--chart-1))" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBlock>
      </div>
    </div>
  );
}
