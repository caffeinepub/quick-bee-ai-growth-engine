import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface BlockedStateCardProps {
  title: string;
  message: string;
  actionLabel?: string;
  actionPath?: string;
}

export function BlockedStateCard({ title, message, actionLabel, actionPath }: BlockedStateCardProps) {
  const navigate = useNavigate();

  return (
    <Card>
      <CardContent className="py-12 text-center space-y-4">
        <div className="flex justify-center">
          <div className="rounded-full bg-yellow-100 p-3">
            <AlertCircle className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground max-w-md mx-auto">{message}</p>
        </div>
        {actionLabel && actionPath && (
          <Button onClick={() => navigate({ to: actionPath })}>
            {actionLabel}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
