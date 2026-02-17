import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import AppShell from './components/layout/AppShell';
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
import ProposalSharePage from './pages/ProposalSharePage';
import LoginPage from './pages/LoginPage';
import UnauthorizedPage from './pages/UnauthorizedPage';
import AuthGate from './components/auth/AuthGate';
import RequireRole from './components/auth/RequireRole';
import { AppRole } from './backend';

function RootComponent() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: () => (
    <AuthGate>
      <AppShell>
        <Outlet />
      </AppShell>
    </AuthGate>
  ),
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <DashboardPage />
    </RequireRole>
  ),
});

const leadsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/leads',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <LeadsPage />
    </RequireRole>
  ),
});

const outreachRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/outreach',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <OutreachPage />
    </RequireRole>
  ),
});

const servicesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/services',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin]}>
      <ServicesPage />
    </RequireRole>
  ),
});

const servicesPricingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/pricing',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <ServicesPricingPage />
    </RequireRole>
  ),
});

const dealsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/deals',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <DealsPage />
    </RequireRole>
  ),
});

const projectsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/projects',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <ProjectsPage />
    </RequireRole>
  ),
});

const plannerRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/planner',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <PlannerPage />
    </RequireRole>
  ),
});

const analyticsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/analytics',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager]}>
      <AnalyticsPage />
    </RequireRole>
  ),
});

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/settings',
  component: () => (
    <RequireRole allowedRoles={[AppRole.Admin, AppRole.Manager, AppRole.Client]}>
      <SettingsPage />
    </RequireRole>
  ),
});

const proposalShareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proposal/$proposalId',
  component: ProposalSharePage,
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  layoutRoute.addChildren([
    dashboardRoute,
    leadsRoute,
    outreachRoute,
    servicesRoute,
    servicesPricingRoute,
    dealsRoute,
    projectsRoute,
    plannerRoute,
    analyticsRoute,
    settingsRoute,
  ]),
  proposalShareRoute,
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
