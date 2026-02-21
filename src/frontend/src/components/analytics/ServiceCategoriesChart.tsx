import { ChartBlock } from '../common/ChartBlock';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useGetAgencyAnalytics } from '../../hooks/useAgencyAnalytics';
import { computeServiceCategories } from '../../utils/analytics/computeServiceCategories';

const CATEGORY_COLORS = [
  '#00b3a4', // Teal green
  '#00f0ff', // Electric blue
  '#10b981', // Emerald
  '#8b5cf6', // Purple
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#06b6d4', // Cyan
  '#ec4899', // Pink
];

export function ServiceCategoriesChart() {
  const { data: analytics, isLoading, error } = useGetAgencyAnalytics();

  if (isLoading) {
    return (
      <ChartBlock title="Service Categories">
        <div className="h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ChartBlock>
    );
  }

  if (error) {
    return (
      <ChartBlock title="Service Categories">
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          Failed to load service data
        </div>
      </ChartBlock>
    );
  }

  const categoryData = computeServiceCategories(analytics?.services || []);

  return (
    <ChartBlock title="Service Categories">
      {categoryData.length > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={(entry) => `${entry.category} (${entry.count})`}
              outerRadius={90}
              fill="#8884d8"
              dataKey="count"
              animationDuration={1000}
            >
              {categoryData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{
                backgroundColor: 'oklch(var(--card))',
                border: '1px solid oklch(var(--border))',
                borderRadius: '8px',
              }}
              formatter={(value: number, name: string, props: any) => [
                `${value} services (₹${props.payload.revenue.toLocaleString()})`,
                props.payload.category
              ]}
            />
            <Legend 
              verticalAlign="bottom" 
              height={36}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
          No service categories available yet
        </div>
      )}
    </ChartBlock>
  );
}
