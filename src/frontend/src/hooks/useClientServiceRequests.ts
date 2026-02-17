import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { useInternetIdentity } from './useInternetIdentity';
import type { ClientServiceRequest } from '../backend';

export function useCreateClientServiceRequest() {
  const { actor } = useActor();
  const { identity } = useInternetIdentity();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: { serviceId: string; agency: string; details: string | null }) => {
      if (!actor) throw new Error('Actor not available');
      
      const principal = identity?.getPrincipal().toString() || 'anonymous';
      const request: ClientServiceRequest = {
        id: `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        principal,
        agency: params.agency,
        serviceId: params.serviceId,
        createdAt: BigInt(Date.now() * 1000000),
        details: params.details || undefined,
      };
      
      return actor.createClientServiceRequest(request);
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
      // Backend only has getClientServiceRequests which returns all for current user
      const allRequests = await actor.getClientServiceRequests();
      return allRequests.filter(req => req.agency === agency);
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
      return actor.getClientServiceRequests();
    },
    enabled: !!actor && !actorFetching,
  });
}
