import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import type { PlannerPlan } from '../../hooks/usePlanner';

interface PlannerPlanViewProps {
  plan: PlannerPlan;
}

export function PlannerPlanView({ plan }: PlannerPlanViewProps) {
  const totalLeadsTarget = plan.tasks.reduce((sum, t) => sum + t.leadsTarget, 0);
  const totalLeadsCompleted = plan.tasks.reduce((sum, t) => sum + t.leadsCompleted, 0);
  const totalOutreachTarget = plan.tasks.reduce((sum, t) => sum + t.outreachTarget, 0);
  const totalOutreachCompleted = plan.tasks.reduce((sum, t) => sum + t.outreachCompleted, 0);
  
  const overallCompletion = Math.round(
    ((totalLeadsCompleted + totalOutreachCompleted) / (totalLeadsTarget + totalOutreachTarget)) * 100
  );

  // Calculate streak
  let streak = 0;
  for (const task of plan.tasks) {
    if (task.completed) {
      streak++;
    } else if (task.date < new Date()) {
      break;
    }
  }

  const completedDays = plan.tasks.filter(t => t.completed).length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Target className="h-4 w-4" />
              Overall Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{overallCompletion}%</div>
              <Progress value={overallCompletion} />
              <p className="text-xs text-muted-foreground">
                {completedDays} of 30 days completed
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{streak} days</div>
            <p className="text-xs text-muted-foreground mt-2">
              Keep it up! Consistency is key.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Days Remaining
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{30 - completedDays}</div>
            <p className="text-xs text-muted-foreground mt-2">
              Stay focused on your goals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Tasks */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {plan.tasks.map(task => {
              const isToday = task.date.toDateString() === new Date().toDateString();
              const isPast = task.date < new Date() && !isToday;
              
              return (
                <div key={task.day} className={`p-4 border rounded-lg ${isToday ? 'border-primary bg-primary/5' : ''}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">Day {task.day}</span>
                      <span className="text-sm text-muted-foreground">
                        {task.date.toLocaleDateString()}
                      </span>
                      {isToday && <Badge>Today</Badge>}
                      {task.completed && <Badge variant="outline" className="bg-green-100">✓ Completed</Badge>}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Leads</p>
                      <p className="font-medium">{task.leadsCompleted} / {task.leadsTarget}</p>
                      <Progress value={(task.leadsCompleted / task.leadsTarget) * 100} className="mt-1 h-1" />
                    </div>
                    <div>
                      <p className="text-muted-foreground">Outreach</p>
                      <p className="font-medium">{task.outreachCompleted} / {task.outreachTarget}</p>
                      <Progress value={(task.outreachCompleted / task.outreachTarget) * 100} className="mt-1 h-1" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
