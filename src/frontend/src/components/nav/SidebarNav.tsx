import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { useIsCallerAdmin } from '../../hooks/useAuthRole';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
  UserPlus,
} from 'lucide-react';
import { clearSignInIdentifier } from '../../utils/signInIdentifier';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, adminOnly: false },
  { path: '/leads', label: 'Leads', icon: Users, adminOnly: false },
  { path: '/outreach', label: 'Outreach', icon: MessageSquare, adminOnly: false },
  { path: '/services', label: 'Services', icon: Briefcase, adminOnly: false },
  { path: '/deals', label: 'Deals', icon: DollarSign, adminOnly: false },
  { path: '/projects', label: 'Projects', icon: FolderKanban, adminOnly: false },
  { path: '/planner', label: 'Planner', icon: Calendar, adminOnly: false },
  { path: '/analytics', label: 'Analytics', icon: BarChart3, adminOnly: false },
  { path: '/settings', label: 'Settings', icon: Settings, adminOnly: false },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const { clear, identity } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;

  const handleClearSession = async () => {
    if (isAuthenticated) {
      await clear();
    }
    // Clear all cached data
    queryClient.clear();
    clearSignInIdentifier();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 pb-5">
        <div className="flex items-center gap-3">
          <img
            src="/assets/generated/quickbee-app-icon.dim_256x256.png"
            alt="Quick Bee"
            className="w-10 h-10"
          />
          <div>
            <h2 className="text-xl font-bold tracking-tight">Quick Bee</h2>
            <p className="text-xs text-muted-foreground">AI Growth Engine</p>
          </div>
        </div>
      </div>

      <Separator />

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
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

        {!isAdmin && (
          <>
            <Separator className="my-3" />
            <Link
              to="/onboarding"
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 focus-ring ${
                currentPath === '/onboarding'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'hover:bg-accent hover:text-accent-foreground'
              }`}
              onClick={onNavigate}
            >
              <UserPlus className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium">Client Onboarding</span>
            </Link>
          </>
        )}
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
