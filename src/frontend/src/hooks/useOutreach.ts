import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useDemoSession } from './useDemoSession';
import { useGetUserRole } from './useQueries';
import { isManagerOrAdmin } from '../utils/rbac';
import type { OutreachActivity } from '../types/local';
import { toast } from 'sonner';

export function useGetAllOutreachActivities() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: role } = useGetUserRole();

  return useQuery<OutreachActivity[]>({
    queryKey: ['outreach'],
    queryFn: async () => {
      if (!isManagerOrAdmin(role)) {
        return [];
      }
      return [];
    },
    enabled: !!actor && !actorFetching && isManagerOrAdmin(role),
  });
}

export function useAddOutreach() {
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: OutreachActivity) => {
      if (isDemoActive) {
        throw new Error('Cannot create outreach activities in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      console.warn('Outreach creation not implemented in backend');
      return activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create outreach activity');
    },
  });
}

export function useUpdateOutreachStatus() {
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      activity,
      updates,
    }: {
      activity: OutreachActivity;
      updates: Partial<OutreachActivity>;
    }) => {
      if (isDemoActive) {
        throw new Error('Cannot update outreach activities in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      return { ...activity, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update outreach activity');
    },
  });
}
