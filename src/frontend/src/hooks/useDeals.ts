import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useCurrentUserProfile';
import type { Deal, DealStatus } from '../backend';

export function useGetUserDeals() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile } = useGetCallerUserProfile();

  return useQuery<Deal[]>({
    queryKey: ['deals', profile?.agency],
    queryFn: async () => {
      if (!actor || !profile?.agency) return [];
      return actor.getUserDeals(profile.agency);
    },
    enabled: !!actor && !actorFetching && !!profile?.agency,
  });
}

export function useUpdateDealStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dealId, status }: { dealId: string; status: DealStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateDealStatus(dealId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
