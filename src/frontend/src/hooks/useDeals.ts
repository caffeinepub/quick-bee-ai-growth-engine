import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useDemoSession } from './useDemoSession';
import { useGetUserRole } from './useQueries';
import { useGetCallerUserProfile } from './useCurrentUserProfile';
import { isManagerOrAdmin } from '../utils/rbac';
import type { Deal } from '../types/local';
import { toast } from 'sonner';

export function useGetUserDeals() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: profile } = useGetCallerUserProfile();
  const { data: role } = useGetUserRole();

  return useQuery<Deal[]>({
    queryKey: ['deals', profile?.agency],
    queryFn: async () => {
      if (!isManagerOrAdmin(role)) {
        return [];
      }
      return [];
    },
    enabled: !!actor && !actorFetching && !!profile?.agency && isManagerOrAdmin(role),
  });
}

export function useUpdateDealStatus() {
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dealId, status }: { dealId: string; status: string }) => {
      if (isDemoActive) {
        throw new Error('Cannot update deals in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      console.warn('Deal status update not implemented in backend');
      return { dealId, status };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update deal');
    },
  });
}

export function useCreateDeal() {
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deal: Deal) => {
      if (isDemoActive) {
        throw new Error('Cannot create deals in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      console.warn('Deal creation not implemented in backend');
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create deal');
    },
  });
}

export function useUpdateDeal() {
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (deal: Deal) => {
      if (isDemoActive) {
        throw new Error('Cannot update deals in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      console.warn('Deal update not implemented in backend');
      return deal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update deal');
    },
  });
}
