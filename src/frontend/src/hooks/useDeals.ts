import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useCurrentUserProfile';
import type { Deal } from '../backend';

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
    mutationFn: async ({ dealId, status }: { dealId: string; status: string }) => {
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

export function useCreateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deal: Deal) => {
      // Backend doesn't have createDeal, so we simulate it
      // In production, this would need backend support
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateDeal() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deal: Deal) => {
      if (!actor) throw new Error('Actor not available');
      // Use updateDealStatus for now
      return actor.updateDealStatus(deal.id, deal.status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
