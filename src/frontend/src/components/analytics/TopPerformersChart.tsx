import { ChartBlock } from '../common/ChartBlock';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetAgencyAnalytics } from '../../hooks/useAgencyAnalytics';
import { computeTopPerformers } from '../../utils/analytics/computeTopPerformers';

export function TopPerformersChart() {
  const { data: analytics, isLoading, error } = useGetAgencyAnalytics();

  if (isLoading) {
    return (
      <ChartBlock title="Top Performers">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ChartBlock>
    );
  }

  if (error) {
    return (
      <ChartBlock title="Top Performers">
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Failed to load service data
        </div>
      </ChartBlock>
    );
  }

  const topPerformers = computeTopPerformers(analytics?.services || []);

  return (
    <ChartBlock title="Top Performers">
      {topPerformers.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topPerformers} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis 
              type="number"
              stroke="oklch(var(--muted-foreground))"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
            />
            <YAxis 
              type="category"
              dataKey="name" 
              width={150}
              stroke="oklch(var(--muted-foreground))"
              tick={{ fill: 'oklch(var(--muted-foreground))', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Bar 
              dataKey="value" 
              fill="#00b3a4"
              radius={[0, 8, 8, 0]}
              animationDuration={1000}
            />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No service performance data available yet
        </div>
      )}
    </ChartBlock>
  );
}
