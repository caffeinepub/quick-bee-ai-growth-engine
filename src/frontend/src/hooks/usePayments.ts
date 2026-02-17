import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { PaymentMethod, PaymentStatus, type Payment, type PaymentSettings } from '../backend';

export function useCreatePayment() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ serviceId, amount, paymentMethod }: { serviceId: string; amount: bigint; paymentMethod: PaymentMethod }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.createPayment(serviceId, amount, paymentMethod);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['userPayments'] });
    },
  });
}

export function useGetUserPayments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Payment[]>({
    queryKey: ['userPayments'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getUserPayments();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPayment(paymentId: string | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Payment | null>({
    queryKey: ['payment', paymentId],
    queryFn: async () => {
      if (!actor || !paymentId) return null;
      return await actor.getPayment(paymentId);
    },
    enabled: !!actor && !actorFetching && !!paymentId,
  });
}

export function useUpdatePaymentStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ paymentId, status }: { paymentId: string; status: PaymentStatus }) => {
      if (!actor) throw new Error('Actor not available');
      return await actor.updatePaymentStatus(paymentId, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['userPayments'] });
    },
  });
}

export function useGetAllPayments() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Payment[]>({
    queryKey: ['payments'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.getAllPayments();
    },
    enabled: !!actor && !actorFetching,
  });
}

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
