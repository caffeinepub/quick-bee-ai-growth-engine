import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PaymentSettings } from '../backend';

export function useGetPaymentSettings() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PaymentSettings>({
    queryKey: ['paymentSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return await actor.getPaymentSettings();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useUpdatePaymentSettings() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (settings: PaymentSettings) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.updatePaymentSettings(settings);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['paymentSettings'] });
    },
  });
}
