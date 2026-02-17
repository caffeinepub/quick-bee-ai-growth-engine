import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { UPLOADED_IMAGES } from '../constants/uploadedImages';
import { SafeImage } from '../components/common/SafeImage';
import { useGetPlannerPlan, useCreatePlannerPlan } from '../hooks/usePlanner';
import { PlannerPlanView } from '../components/planner/PlannerPlanView';
import { toast } from 'sonner';

export default function PlannerPage() {
  const { data: plan, isLoading } = useGetPlannerPlan();
  const createPlan = useCreatePlannerPlan();

  const handleStartPlan = async () => {
    try {
      await createPlan.mutateAsync();
      toast.success('30-day plan created successfully!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create plan');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading planner...</p>
        </div>
      </div>
    );
  }

  if (plan) {
    return (
      <div className="space-y-8">
        <div className="page-header">
          <h1 className="page-title">30-Day Planner</h1>
          <p className="page-description">Track your 3000 outreach goal</p>
        </div>
        <PlannerPlanView plan={plan} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="page-header">
        <h1 className="page-title">30-Day Planner</h1>
        <p className="page-description">Plan and track your 3000 outreach goal</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Main CTA Card */}
        <Card className="interactive-card md:col-span-2">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex-shrink-0">
                <SafeImage
                  src={UPLOADED_IMAGES.strategy} 
                  alt="Strategy Planning"
                  className="w-48 h-48 object-cover rounded-2xl shadow-lg"
                  fallbackClassName="w-48 h-48 rounded-2xl"
                />
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Start Your 3000 Outreach Plan</h2>
                  <p className="text-muted-foreground">
                    A structured 30-day plan to reach 300 leads and send 3000 outreach messages. 
                    Track your daily progress and maintain your streak.
                  </p>
                </div>
                <Button size="lg" className="focus-ring" onClick={handleStartPlan} disabled={createPlan.isPending}>
                  {createPlan.isPending ? 'Creating Plan...' : 'Start 30-Day Plan'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <Card className="interactive-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <SafeImage
                  src={UPLOADED_IMAGES.aiAutomation} 
                  alt="AI Automation"
                  className="w-16 h-16 object-cover rounded-xl"
                  fallbackClassName="w-16 h-16 rounded-xl"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">AI-Powered Automation</h3>
                <p className="text-sm text-muted-foreground">
                  Automate your outreach with intelligent message generation
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="interactive-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                <SafeImage
                  src={UPLOADED_IMAGES.deployment} 
                  alt="Deployment"
                  className="w-16 h-16 object-cover rounded-xl"
                  fallbackClassName="w-16 h-16 rounded-xl"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">Quick Deployment</h3>
                <p className="text-sm text-muted-foreground">
                  Launch your campaigns across multiple channels instantly
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
