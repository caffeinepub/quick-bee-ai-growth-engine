import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartBlockProps {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}

export function ChartBlock({ title, children, action }: ChartBlockProps) {
  return (
    <Card className="interactive-card">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-xl font-semibold tracking-tight">{title}</CardTitle>
        {action}
      </CardHeader>
      <CardContent className="pt-2">{children}</CardContent>
    </Card>
  );
}
