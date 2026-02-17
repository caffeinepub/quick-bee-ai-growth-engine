import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useDemoSession } from '../../hooks/useDemoSession';
import { useSessionAppRole } from '../../hooks/useSessionAppRole';
import { useGetUserRole } from '../../hooks/useQueries';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Briefcase,
  DollarSign,
  FolderKanban,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Tag,
} from 'lucide-react';
import { clearSignInIdentifier } from '../../utils/signInIdentifier';
import { clearAllSessionAuth } from '../../utils/sessionAuth';
import { UPLOADED_IMAGES } from '../../constants/uploadedImages';
import { SafeImage } from '../common/SafeImage';
import { canAccessPath } from '../../utils/rbac';

const allNavItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/leads', label: 'Leads', icon: Users },
  { path: '/outreach', label: 'Outreach', icon: MessageSquare },
  { path: '/services', label: 'Services', icon: Briefcase },
  { path: '/pricing', label: 'Pricing', icon: Tag },
  { path: '/deals', label: 'Deals', icon: DollarSign },
  { path: '/projects', label: 'Projects', icon: FolderKanban },
  { path: '/planner', label: 'Planner', icon: Calendar },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Settings },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { clear, identity } = useInternetIdentity();
  const { isDemoActive, endDemo } = useDemoSession();
  const { selectedRole, clearRole } = useSessionAppRole();
  const { data: backendRole } = useGetUserRole();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;
  const effectiveRole = selectedRole || backendRole;

  // Filter nav items based on role
  const visibleNavItems = allNavItems.filter((item) =>
    canAccessPath(effectiveRole, item.path, isDemoActive)
  );

  const handleClearSession = async () => {
    if (isAuthenticated) {
      await clear();
    }
    if (isDemoActive) {
      await endDemo();
    }
    queryClient.clear();
    clearSignInIdentifier();
    clearAllSessionAuth();
    clearRole();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-5">
        <div className="flex items-center gap-3">
          <SafeImage
            src={UPLOADED_IMAGES.qbLogo}
            alt="Quick Bee"
            className="w-10 h-10 object-contain rounded"
            fallback="QB"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Quick Bee</h2>
            <p className="text-xs text-muted-foreground">AI Growth Engine</p>
          </div>
        </div>
        {isDemoActive && (
          <Badge variant="outline" className="mt-3 w-full justify-center">
            Demo Mode
          </Badge>
        )}
        {effectiveRole && (
          <div className="mt-2 text-xs text-muted-foreground text-center">
            Role: <span className="font-medium text-foreground">{effectiveRole}</span>
          </div>
        )}
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 focus-ring ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={onNavigate}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <Separator />

      <div className="p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 focus-ring hover:bg-accent"
          onClick={handleClearSession}
        >
          <LogOut className="h-5 w-5" />
          <span>Clear Session</span>
        </Button>
      </div>
    </div>
  );
}
