import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserRole } from '../backend';

export function useGetCallerUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<UserRole | null>({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getCallerUserRole();
      } catch (error) {
        // Gracefully handle unauthorized/guest errors
        console.warn('Role query failed (likely guest user):', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      try {
        return await actor.isCallerAdmin();
      } catch (error) {
        // Gracefully handle unauthorized/guest errors - default to non-admin
        console.warn('Admin check failed (likely guest user):', error);
        return false;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
