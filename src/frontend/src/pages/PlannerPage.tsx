import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';

export default function PlannerPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">30-Day Planner</h1>
        <p className="text-muted-foreground">Plan and track your 3000 outreach goal</p>
      </div>

      <Card>
        <CardContent className="py-12 text-center space-y-4">
          <Calendar className="h-16 w-16 mx-auto text-muted-foreground" />
          <div>
            <h3 className="text-xl font-semibold mb-2">Start Your 3000 Outreach Plan</h3>
            <p className="text-muted-foreground mb-4">
              Create a 30-day plan with daily targets across all platforms
            </p>
            <Button size="lg">Start 3000 Outreach Plan</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
