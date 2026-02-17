import { useState, useEffect } from 'react';
import { AppRole } from '../backend';
import { getSessionRole, setSessionRole, clearSessionRole } from '../utils/sessionAuth';

export function useSessionAppRole() {
  const [selectedRole, setSelectedRoleState] = useState<AppRole | null>(() => getSessionRole());

  useEffect(() => {
    // Sync with session storage on mount
    const role = getSessionRole();
    if (role !== selectedRole) {
      setSelectedRoleState(role);
    }
  }, []);

  const setSelectedRole = (role: AppRole) => {
    setSessionRole(role);
    setSelectedRoleState(role);
  };

  const clearRole = () => {
    clearSessionRole();
    setSelectedRoleState(null);
  };

  return {
    selectedRole,
    setSelectedRole,
    clearRole,
  };
}
