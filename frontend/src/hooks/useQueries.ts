import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, Membership } from '../backend';

// ─── User Profile ────────────────────────────────────────────────────────────

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

// ─── Membership ──────────────────────────────────────────────────────────────

export function useGetMembershipForCaller() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Membership | null>({
    queryKey: ['membershipForCaller'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getMembershipForCaller();
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

export function useIsTrialActive() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isTrialActive'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isTrialActive();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsMembershipActive() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isMembershipActive'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isMembershipActive();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetTrialExpiryDate() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint | null>({
    queryKey: ['trialExpiryDate'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getTrialExpiryDate();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useMintMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.mintMembership();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipForCaller'] });
      queryClient.invalidateQueries({ queryKey: ['isTrialActive'] });
      queryClient.invalidateQueries({ queryKey: ['isMembershipActive'] });
      queryClient.invalidateQueries({ queryKey: ['trialExpiryDate'] });
    },
  });
}

export function useCancelMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.cancelMembership();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['membershipForCaller'] });
      queryClient.invalidateQueries({ queryKey: ['isMembershipActive'] });
    },
  });
}
