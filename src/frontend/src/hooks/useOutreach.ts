import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { OutreachActivity } from '../backend';

export function useGetAllOutreachActivities() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<OutreachActivity[]>({
    queryKey: ['outreach'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllOutreachActivities();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddOutreach() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (activity: OutreachActivity) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addOutreach(activity);
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
      // Since backend doesn't have update method, we simulate optimistic update
      return { ...activity, ...updates };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
