import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Target, TrendingUp } from 'lucide-react';
import { UPLOADED_IMAGES } from '../constants/uploadedImages';

export default function PlannerPage() {
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
                <img 
                  src={UPLOADED_IMAGES.strategy} 
                  alt="Strategy Planning"
                  className="w-48 h-48 object-cover rounded-2xl shadow-lg"
                />
              </div>
              <div className="flex-1 text-center md:text-left space-y-4">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Start Your 3000 Outreach Plan</h2>
                  <p className="text-muted-foreground text-lg">
                    Create a strategic 30-day plan with daily targets across all platforms
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                  <div className="flex items-center gap-2 text-sm">
                    <Target className="h-5 w-5 text-primary" />
                    <span className="font-medium">100 leads/day</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <span className="font-medium">Multi-channel reach</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="font-medium">30-day timeline</span>
                  </div>
                </div>
                <Button size="lg" className="focus-ring">Start 3000 Outreach Plan</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Feature Cards */}
        <Card className="interactive-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-center">
              <img 
                src={UPLOADED_IMAGES.aiAutomation} 
                alt="AI Automation"
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">AI Automation</h3>
              <p className="text-sm text-muted-foreground">
                Automate your outreach with intelligent scheduling and personalization
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="interactive-card">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-center">
              <img 
                src={UPLOADED_IMAGES.deployment} 
                alt="Rapid Deployment"
                className="w-24 h-24 object-contain"
              />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-lg font-semibold">Rapid Deployment</h3>
              <p className="text-sm text-muted-foreground">
                Launch campaigns quickly with pre-built templates and workflows
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
