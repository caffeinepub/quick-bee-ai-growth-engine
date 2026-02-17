import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useDemoSession } from './useDemoSession';
import { useGetUserRole } from './useQueries';
import { isManagerOrAdmin } from '../utils/rbac';
import type { Lead } from '../backend';
import { toast } from 'sonner';

export function useGetAllLeads() {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: role } = useGetUserRole();

  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!actor) return [];
      if (!isManagerOrAdmin(role)) {
        return [];
      }
      try {
        return await actor.getLeadsPaginated(BigInt(0), BigInt(10000));
      } catch (error) {
        console.error('Failed to fetch leads:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching && isManagerOrAdmin(role),
  });
}

export function useGetLeadsPaginated(offset: number, limit: number) {
  const { actor, isFetching: actorFetching } = useActor();
  const { data: role } = useGetUserRole();

  return useQuery<Lead[]>({
    queryKey: ['leadsPaginated', offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      if (!isManagerOrAdmin(role)) {
        return [];
      }
      return actor.getLeadsPaginated(BigInt(offset), BigInt(limit));
    },
    enabled: !!actor && !actorFetching && isManagerOrAdmin(role),
  });
}

export function useAddLead() {
  const { actor } = useActor();
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lead: Lead) => {
      if (isDemoActive) {
        throw new Error('Cannot create leads in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      if (!actor) throw new Error('Actor not available');
      return actor.createLead(lead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadsPaginated'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create lead');
    },
  });
}

export function useUpdateLeadStatus() {
  const { actor } = useActor();
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, lead }: { leadId: string; lead: Lead }) => {
      if (isDemoActive) {
        throw new Error('Cannot update leads in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      if (!actor) throw new Error('Actor not available');
      return actor.updateLead(leadId, lead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadsPaginated'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update lead');
    },
  });
}

export function useImportLeads() {
  const { actor } = useActor();
  const { isDemoActive } = useDemoSession();
  const { data: role } = useGetUserRole();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leads }: { leads: Lead[] }) => {
      if (isDemoActive) {
        throw new Error('Cannot import leads in demo mode');
      }
      if (!isManagerOrAdmin(role)) {
        throw new Error('Unauthorized: Manager or Admin access required');
      }
      if (!actor) throw new Error('Actor not available');
      for (const lead of leads) {
        try {
          await actor.createLead(lead);
        } catch (error) {
          console.error('Failed to import lead:', lead.name, error);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadsPaginated'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to import leads');
    },
  });
}
