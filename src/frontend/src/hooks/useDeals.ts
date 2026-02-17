import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useGetCallerUserProfile } from './useCurrentUserProfile';
import type { Deal } from '../types/local';

export function useGetUserDeals() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile } = useGetCallerUserProfile();

  return useQuery<Deal[]>({
    queryKey: ['deals', profile?.agency],
    queryFn: async () => {
      // Backend doesn't have deals functionality yet
      return [];
    },
    enabled: !!actor && !actorFetching && !!profile?.agency,
  });
}

export function useUpdateDealStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dealId, status }: { dealId: string; status: string }) => {
      // Backend doesn't have deals functionality yet
      console.warn('Deal status update not implemented in backend');
      return { dealId, status };
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
      // Backend doesn't have createDeal
      console.warn('Deal creation not implemented in backend');
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateDeal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deal: Deal) => {
      // Backend doesn't have deals functionality yet
      console.warn('Deal update not implemented in backend');
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
