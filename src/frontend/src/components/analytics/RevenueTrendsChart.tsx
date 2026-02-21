import { ChartBlock } from '../common/ChartBlock';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetAllPayments } from '../../hooks/usePayments';
import { computeRevenueTrends } from '../../utils/analytics/computeRevenueTrends';

export function RevenueTrendsChart() {
  const { data: payments, isLoading, error } = useGetAllPayments();

  if (isLoading) {
    return (
      <ChartBlock title="Revenue Trends">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ChartBlock>
    );
  }

  if (error) {
    return (
      <ChartBlock title="Revenue Trends">
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Failed to load revenue data
        </div>
      </ChartBlock>
    );
  }

  const trendData = computeRevenueTrends(payments || []);

  return (
    <ChartBlock title="Revenue Trends">
      {trendData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={trendData}>
            <CartesianGrid strokeDasharray="3 3" stroke="oklch(var(--border))" />
            <XAxis 
              dataKey="date" 
              stroke="oklch(var(--muted-foreground))"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
            />
            <YAxis 
              stroke="oklch(var(--muted-foreground))"
              tick={{ fill: 'oklch(var(--muted-foreground))' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Revenue']}
            />
            <Line 
              type="monotone" 
              dataKey="revenue" 
              stroke="#00b3a4" 
              strokeWidth={2}
              dot={{ fill: '#00b3a4', r: 4 }}
              activeDot={{ r: 6, fill: '#00f0ff' }}
              animationDuration={1000}
            />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No revenue data available yet
        </div>
      )}
    </ChartBlock>
  );
}
