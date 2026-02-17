import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClientServiceRequest } from '../backend';

export function useCreateClientServiceRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { serviceId: string; agency: string; details: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createClientServiceRequest(params.serviceId, params.agency, params.details);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientServiceRequests'] });
    },
  });
}

export function useGetClientServiceRequestsByAgency(agency: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ClientServiceRequest[]>({
    queryKey: ['clientServiceRequests', agency],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClientServiceRequestsByAgency(agency);
    },
    enabled: !!actor && !actorFetching && !!agency,
  });
}

export function useGetAllClientServiceRequests() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<ClientServiceRequest[]>({
    queryKey: ['clientServiceRequests'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllClientServiceRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}
