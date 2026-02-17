import { ReactNode, useState } from 'react';
import { SidebarNav } from '../nav/SidebarNav';
import { FollowUpBadge } from '../nav/FollowUpBadge';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UPLOADED_IMAGES } from '../../constants/uploadedImages';
import { SafeImage } from '../common/SafeImage';

export default function AppShell({ children }: { children: ReactNode }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4 shadow-sm">
        <div className="flex items-center gap-3">
          <SafeImage
            src={UPLOADED_IMAGES.qbLogo} 
            alt="Quick Bee" 
            className="w-8 h-8 object-contain rounded"
            fallback="QB"
          />
          <span className="font-bold text-lg">Quick Bee</span>
        </div>
        <div className="flex items-center gap-2">
          <FollowUpBadge />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="focus-ring"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-card border-r border-border z-40 transition-transform duration-300 lg:translate-x-0 shadow-lg lg:shadow-none ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarNav onNavigate={() => setMobileMenuOpen(false)} />
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="container mx-auto p-6 lg:p-10 max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  );
}
