import { AppRole } from '../backend';

export interface NavItem {
  path: string;
  label: string;
  icon: any;
  allowedRoles: AppRole[];
}

// Define which roles can access which routes
export const ROUTE_PERMISSIONS: Record<string, AppRole[]> = {
  '/': [AppRole.Admin, AppRole.Manager, AppRole.Client],
  '/leads': [AppRole.Admin, AppRole.Manager],
  '/outreach': [AppRole.Admin, AppRole.Manager],
  '/services': [AppRole.Admin],
  '/pricing': [AppRole.Admin, AppRole.Manager, AppRole.Client],
  '/deals': [AppRole.Admin, AppRole.Manager],
  '/projects': [AppRole.Admin, AppRole.Manager, AppRole.Client],
  '/planner': [AppRole.Admin, AppRole.Manager],
  '/analytics': [AppRole.Admin, AppRole.Manager],
  '/settings': [AppRole.Admin, AppRole.Manager, AppRole.Client],
};

// Demo mode has even more restricted access
export const DEMO_ALLOWED_PATHS = ['/', '/pricing', '/projects'];

export function canAccessPath(role: AppRole | null | undefined, path: string, isDemo: boolean = false): boolean {
  if (!role) return false;
  
  // Demo mode restrictions
  if (isDemo) {
    return DEMO_ALLOWED_PATHS.includes(path);
  }
  
  const allowedRoles = ROUTE_PERMISSIONS[path];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(role);
}

export function getNavItemsForRole(role: AppRole | null, isDemo: boolean = false): string[] {
  if (!role) return [];
  
  if (isDemo) {
    return DEMO_ALLOWED_PATHS;
  }
  
  return Object.keys(ROUTE_PERMISSIONS).filter((path) => {
    const allowedRoles = ROUTE_PERMISSIONS[path];
    return allowedRoles.includes(role);
  });
}

export function isAdminRole(role: AppRole | null | undefined): boolean {
  return role === AppRole.Admin;
}

export function isManagerOrAdmin(role: AppRole | null | undefined): boolean {
  return role === AppRole.Admin || role === AppRole.Manager;
}

export function isClientOrHigher(role: AppRole | null | undefined): boolean {
  return role === AppRole.Admin || role === AppRole.Manager || role === AppRole.Client;
}
