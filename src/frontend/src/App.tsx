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

function RootComponent() {
  return <Outlet />;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const layoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'layout',
  component: () => <AppShell><Outlet /></AppShell>,
});

const dashboardRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/',
  component: DashboardPage,
});

const leadsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/leads',
  component: LeadsPage,
});

const outreachRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/outreach',
  component: OutreachPage,
});

const servicesRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/services',
  component: ServicesPage,
});

const servicesPricingRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/pricing',
  component: ServicesPricingPage,
});

const dealsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/deals',
  component: DealsPage,
});

const projectsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/projects',
  component: ProjectsPage,
});

const plannerRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/planner',
  component: PlannerPage,
});

const analyticsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/analytics',
  component: AnalyticsPage,
});

const settingsRoute = createRoute({
  getParentRoute: () => layoutRoute,
  path: '/settings',
  component: SettingsPage,
});

const proposalShareRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/proposal/$proposalId',
  component: ProposalSharePage,
});

const routeTree = rootRoute.addChildren([
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
