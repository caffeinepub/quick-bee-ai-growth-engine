import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import AuthGate from './components/auth/AuthGate';
import RequireRole from './components/auth/RequireRole';
import AppShell from './components/layout/AppShell';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import LeadsPage from './pages/LeadsPage';
import OutreachPage from './pages/OutreachPage';
import ServicesPage from './pages/ServicesPage';
import ServicesPricingPage from './pages/ServicesPricingPage';
import DealsPage from './pages/DealsPage';
import ProjectsPage from './pages/ProjectsPage';
import PlannerPage from './pages/PlannerPage';
import AnalyticsPage from './pages/AnalyticsPage';
import SettingsPage from './pages/SettingsPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import PaymentSuccessPage from './pages/PaymentSuccessPage';
import PaymentFailurePage from './pages/PaymentFailurePage';
import { AppRole } from './backend';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

const rootRoute = createRootRoute({
  component: () => (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <AuthGate>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthGate>
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  ),
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <DashboardPage />
    </RequireRole>
  ),
});

const leadsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/leads',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <LeadsPage />
    </RequireRole>
  ),
});

const outreachRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/outreach',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <OutreachPage />
    </RequireRole>
  ),
});

const servicesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/services',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <ServicesPage />
    </RequireRole>
  ),
});

const pricingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/pricing',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <ServicesPricingPage />
    </RequireRole>
  ),
});

const dealsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/deals',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <DealsPage />
    </RequireRole>
  ),
});

const projectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/projects',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <ProjectsPage />
    </RequireRole>
  ),
});

const plannerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/planner',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <PlannerPage />
    </RequireRole>
  ),
});

const analyticsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/analytics',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <AnalyticsPage />
    </RequireRole>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/settings',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <SettingsPage />
    </RequireRole>
  ),
});

const unauthorizedRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/unauthorized',
  component: UnauthorizedPage,
});

const paymentSuccessRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-success',
  component: PaymentSuccessPage,
});

const paymentFailureRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/payment-failure',
  component: PaymentFailurePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  dashboardRoute,
  leadsRoute,
  outreachRoute,
  servicesRoute,
  pricingRoute,
  dealsRoute,
  projectsRoute,
  plannerRoute,
  analyticsRoute,
  settingsRoute,
  unauthorizedRoute,
  paymentSuccessRoute,
  paymentFailureRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
