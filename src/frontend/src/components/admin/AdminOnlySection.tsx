import { useIsCallerAdmin } from '../../hooks/useAuthRole';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';

interface AdminOnlySectionProps {
  children: React.ReactNode;
}

export default function AdminOnlySection({ children }: AdminOnlySectionProps) {
  const { data: isAdmin, isLoading } = useIsCallerAdmin();

  if (isLoading) {
    return null;
  }

  if (!isAdmin) {
    return (
      <Alert variant="destructive">
        <ShieldAlert className="h-4 w-4" />
        <AlertTitle>Access Denied</AlertTitle>
        <AlertDescription>
          You do not have permission to view this section. Admin access is required.
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
