import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Lead } from '../backend';

export function useGetAllLeads() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Lead[]>({
    queryKey: ['leads'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllLeads();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddLead() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (request: {
      id: string;
      agency: string;
      name: string;
      contact: string;
      city: string;
      niche: string;
      status: string;
      revenuePotential: bigint;
      owner: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addLead(request);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useUpdateLeadStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leadId, status }: { leadId: string; status: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateLeadStatus(leadId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}

export function useImportLeads() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ leads, agency }: { leads: Lead[]; agency: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.importLeads(leads, agency);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
