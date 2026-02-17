import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lead } from '../backend';

export function useGetAllLeads() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!actor) return [];
      // Use paginated method with large limit to get all leads
      try {
        return await actor.getLeadsPaginated(BigInt(0), BigInt(10000));
      } catch (error) {
        console.error('Failed to fetch leads:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetLeadsPaginated(offset: number, limit: number) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ['leadsPaginated', offset, limit],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getLeadsPaginated(BigInt(offset), BigInt(limit));
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (lead: Lead) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createLead(lead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadsPaginated'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateLeadStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, lead }: { leadId: string; lead: Lead }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLead(leadId, lead);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['leadsPaginated'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useImportLeads() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leads }: { leads: Lead[] }) => {
      if (!actor) throw new Error('Actor not available');
      // Import leads one by one using createLead
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
  });
}
