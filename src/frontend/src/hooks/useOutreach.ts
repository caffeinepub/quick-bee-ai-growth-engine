import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OutreachActivity } from '../types/local';

export function useGetAllOutreachActivities() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OutreachActivity[]>({
    queryKey: ['outreach'],
    queryFn: async () => {
      // Backend doesn't have outreach functionality yet
      return [];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOutreach() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: OutreachActivity) => {
      // Backend doesn't have outreach functionality yet
      console.warn('Outreach creation not implemented in backend');
      return activity;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });
}

export function useUpdateOutreachStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ activity, updates }: { activity: OutreachActivity; updates: Partial<OutreachActivity> }) => {
      // Backend doesn't have update method
      return { ...activity, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
