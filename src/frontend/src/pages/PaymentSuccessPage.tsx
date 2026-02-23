import { useEffect, useState } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowRight, Receipt } from 'lucide-react';

export default function PaymentSuccessPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { session_id?: string };
  const [sessionId] = useState(search.session_id || '');

  useEffect(() => {
    // Optional: Verify payment status with backend
    // You can call getStripeSessionStatus here if needed
  }, [sessionId]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-950">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <p className="text-muted-foreground">
              Your payment has been processed successfully.
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
              onClick={() => navigate({ to: '/settings' })}
            >
              <Receipt className="mr-2 h-4 w-4" />
              View Payment History
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate({ to: '/services' })}
            >
              Browse Services
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            You will receive a confirmation email shortly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
