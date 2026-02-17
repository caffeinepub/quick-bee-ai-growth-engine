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
  const { clear } = useInternetIdentity();
  const { data: isAdmin } = useIsCallerAdmin();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    clearSignInIdentifier();
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6 hidden lg:block">
        <div className="flex items-center gap-3">
          <img src="/assets/generated/quickbee-app-icon.dim_256x256.png" alt="Quick Bee" className="w-10 h-10" />
          <div>
            <h1 className="font-bold text-xl">Quick Bee</h1>
            <p className="text-xs text-muted-foreground">AI Growth Engine</p>
          </div>
        </div>
      </div>

      <Separator className="hidden lg:block" />

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPath === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}

        {!isAdmin && (
          <>
            <Separator className="my-2" />
            <Link
              to="/onboarding"
              onClick={onNavigate}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                currentPath === '/onboarding'
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
            >
              <UserPlus className="h-5 w-5" />
              <span className="font-medium">Client Onboarding</span>
            </Link>
          </>
        )}
      </nav>

      <Separator />

      <div className="p-4">
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
