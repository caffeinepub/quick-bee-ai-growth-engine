import { ReactNode, useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useDemoSession } from '../../hooks/useDemoSession';
import { Loader2 } from 'lucide-react';

interface AuthGateProps {
  children: ReactNode;
}

export default function AuthGate({ children }: AuthGateProps) {
  const navigate = useNavigate();
  const { identity, isInitializing } = useInternetIdentity();
  const { isDemoActive, isLoading: demoLoading } = useDemoSession();

  const isAuthenticated = !!identity;
  const isAuthorized = isAuthenticated || isDemoActive;
  const isLoading = isInitializing || demoLoading;

  useEffect(() => {
    // Only redirect if we're done loading and not authorized
    if (!isLoading && !isAuthorized) {
      navigate({ to: '/login' });
    }
  }, [isLoading, isAuthorized, navigate]);

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render children if not authorized
  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}
