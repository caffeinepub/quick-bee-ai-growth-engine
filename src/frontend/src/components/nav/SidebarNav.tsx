import { Link, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
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
  Tag,
} from 'lucide-react';
import { clearSignInIdentifier } from '../../utils/signInIdentifier';
import { UPLOADED_IMAGES } from '../../constants/uploadedImages';
import { SafeImage } from '../common/SafeImage';

const navItems = [
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
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  const isAuthenticated = !!identity;

  const handleClearSession = async () => {
    if (isAuthenticated) {
      await clear();
    }
    queryClient.clear();
    clearSignInIdentifier();
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
