import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Service } from '../backend';

export function useGetAllServices() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.getAllServices();
      } catch (error) {
        console.error('Failed to fetch services:', error);
        return [];
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useAddService() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (service: Service) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.addService(service);
      } catch (error: any) {
        console.error('Add service error:', error);
        throw new Error(error.message || 'Failed to add service');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
    onError: (error: any) => {
      console.error('Service mutation error:', error);
    },
  });
}

export function useUpdateServiceStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, active }: { serviceId: string; active: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.updateServiceStatus(serviceId, active);
      } catch (error: any) {
        console.error('Update service status error:', error);
        throw new Error(error.message || 'Failed to update service status');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
    },
    onError: (error: any) => {
      console.error('Service status mutation error:', error);
    },
  });
}

export function useSeedServices() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (services: Service[]) => {
      if (!actor) throw new Error('Actor not available');
      
      // Add services sequentially
      for (const service of services) {
        try {
          await actor.addService(service);
        } catch (error) {
          console.error(`Failed to seed service: ${service.name}`, error);
          // Continue with other services even if one fails
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    },
  });
}
