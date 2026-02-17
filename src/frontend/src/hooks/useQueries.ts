import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import { AppRole } from '../backend';

export function useGetUserRole() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<AppRole | null>({
    queryKey: ['userRole'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getUserRole();
      } catch (error) {
        console.warn('Failed to get user role:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}
