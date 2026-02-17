import { ReactNode } from 'react';
import { useGetUserRole } from '../../hooks/useQueries';
import { useDemoSession } from '../../hooks/useDemoSession';
import { useSessionAppRole } from '../../hooks/useSessionAppRole';
import { AppRole } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldAlert, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface RequireRoleProps {
  children: ReactNode;
  allowedRoles: AppRole[];
}

export default function RequireRole({ children, allowedRoles }: RequireRoleProps) {
  const navigate = useNavigate();
  const { data: backendRole, isLoading: roleLoading } = useGetUserRole();
  const { isDemoActive } = useDemoSession();
  const { selectedRole } = useSessionAppRole();

  // Determine effective role (session role takes precedence for immediate gating)
  const effectiveRole = selectedRole || backendRole;

  // Show loading state
  if (roleLoading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  // Demo mode has restricted access
  if (isDemoActive) {
    // Demo users can only access Dashboard, Pricing, and Projects
    const demoAllowedPaths = ['/', '/pricing', '/projects'];
    const currentPath = window.location.pathname;
    
    if (!demoAllowedPaths.includes(currentPath)) {
      return (
        <div className="min-h-[60vh] flex items-center justify-center p-4">
          <Card className="max-w-md w-full">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-destructive/10 p-4">
                  <ShieldAlert className="h-12 w-12 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-2xl">Demo Mode Restriction</CardTitle>
              <CardDescription className="text-base">
                This feature is not available in demo mode. Please log in with Internet Identity for full access.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => navigate({ to: '/login' })} className="w-full" size="lg">
                Go to Login
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }
  }

  // Check if user's role is allowed
  const hasAccess = effectiveRole && allowedRoles.includes(effectiveRole);

  if (!hasAccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-destructive/10 p-4">
                <ShieldAlert className="h-12 w-12 text-destructive" />
              </div>
            </div>
            <CardTitle className="text-2xl">Access Denied</CardTitle>
            <CardDescription className="text-base">
              Your current role ({effectiveRole || 'Unknown'}) does not have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Required roles:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                {allowedRoles.map((role) => (
                  <li key={role}>• {role}</li>
                ))}
              </ul>
            </div>
            <Button onClick={() => navigate({ to: '/' })} className="w-full" size="lg">
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
