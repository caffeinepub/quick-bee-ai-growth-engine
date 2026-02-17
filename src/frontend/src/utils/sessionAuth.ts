import { AppRole } from '../backend';

const SESSION_ROLE_KEY = 'quickbee_session_role';
const DEMO_SESSION_KEY = 'quickbee_demo_session';

export function setSessionRole(role: AppRole): void {
  sessionStorage.setItem(SESSION_ROLE_KEY, role);
}

export function getSessionRole(): AppRole | null {
  const role = sessionStorage.getItem(SESSION_ROLE_KEY);
  if (!role) return null;
  
  // Validate it's a valid AppRole
  if (['Admin', 'Manager', 'Client', 'Demo'].includes(role)) {
    return role as AppRole;
  }
  return null;
}

export function clearSessionRole(): void {
  sessionStorage.removeItem(SESSION_ROLE_KEY);
}

export function setDemoSession(isDemo: boolean): void {
  if (isDemo) {
    sessionStorage.setItem(DEMO_SESSION_KEY, 'true');
  } else {
    sessionStorage.removeItem(DEMO_SESSION_KEY);
  }
}

export function getDemoSession(): boolean {
  return sessionStorage.getItem(DEMO_SESSION_KEY) === 'true';
}

export function clearDemoSession(): void {
  sessionStorage.removeItem(DEMO_SESSION_KEY);
}

export function clearAllSessionAuth(): void {
  clearSessionRole();
  clearDemoSession();
}
