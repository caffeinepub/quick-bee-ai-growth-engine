import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, UserRole } from '../backend';
import { clearSignInIdentifier } from '../utils/signInIdentifier';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useRegisterUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      principal: string;
      name: string;
      email: string;
      mobileNumber: string | null;
      agency: string;
      role: UserRole;
      revenueGoal: bigint;
      subscriptionPlan: string;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.registerUser(
        params.principal,
        params.name,
        params.email,
        params.mobileNumber,
        params.agency,
        params.role,
        params.revenueGoal,
        params.subscriptionPlan
      );
    },
    onSuccess: () => {
      // Clear the stored sign-in identifier after successful profile setup
      clearSignInIdentifier();
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}
