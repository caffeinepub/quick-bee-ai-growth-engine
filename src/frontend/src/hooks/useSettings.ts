import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useDemoSession } from './useDemoSession';
import { useGetUserRole } from './useQueries';
import { isAdminRole } from '../utils/rbac';
import type { Settings } from '../backend';
import { toast } from 'sonner';

export function useGetSettings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Settings>({
    queryKey: ['settings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getSettings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdateSettings() {
  const { actor } = useActor();
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: Settings) => {
      if (isDemoActive) {
        throw new Error('Cannot update settings in demo mode');
      }
      if (!isAdminRole(role)) {
        throw new Error('Unauthorized: Admin access required');
      }
      if (!actor) throw new Error('Actor not available');
      return await actor.updateSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settings'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update settings');
    },
  });
}
