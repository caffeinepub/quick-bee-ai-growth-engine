import { useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, HelpCircle } from 'lucide-react';

export default function PaymentFailurePage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { session_id?: string };
  const [sessionId] = useState(search.session_id || '');

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-red-50 to-orange-100 dark:from-red-950 dark:to-orange-950">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600 dark:text-red-400" />
          </div>
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Your payment was cancelled or failed to process.
            </p>
            {sessionId && (
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Session ID</p>
                <p className="text-sm font-mono break-all">{sessionId}</p>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <Button 
              className="w-full" 
              onClick={() => navigate({ to: '/services' })}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Try Again
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate({ to: '/' })}
            >
              Return to Dashboard
            </Button>
          </div>

          <div className="pt-4 border-t">
            <Button 
              variant="ghost" 
              className="w-full"
              onClick={() => {
                // In a real app, this would open a support dialog or navigate to a contact page
                window.location.href = 'mailto:support@example.com';
              }}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
