import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Membership, UserProfile } from "../backend";
import { MembershipTier } from "../backend";
import { useActor } from "./useActor";

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
      if (!actor) throw new Error("Actor not available");
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Membership ──────────────────────────────────────────────────────────────

export function useGetMembershipForCaller() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<Membership | null>({
    queryKey: ["membershipForCaller"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
    queryKey: ["isTrialActive"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.isTrialActive();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsMembershipActive() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ["isMembershipActive"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.isMembershipActive();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetTrialExpiryDate() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<bigint | null>({
    queryKey: ["trialExpiryDate"],
    queryFn: async () => {
      if (!actor) throw new Error("Actor not available");
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
      if (!actor) throw new Error("Actor not available");
      return actor.mintMembership();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipForCaller"] });
      queryClient.invalidateQueries({ queryKey: ["isTrialActive"] });
      queryClient.invalidateQueries({ queryKey: ["isMembershipActive"] });
      queryClient.invalidateQueries({ queryKey: ["trialExpiryDate"] });
      queryClient.invalidateQueries({ queryKey: ["membershipTier"] });
    },
  });
}

export function useCancelMembership() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error("Actor not available");
      return actor.cancelMembership();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipForCaller"] });
      queryClient.invalidateQueries({ queryKey: ["isMembershipActive"] });
    },
  });
}

export function useGetMembershipTier(principal: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MembershipTier>({
    queryKey: ["membershipTier", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal)
        throw new Error("Actor or principal not available");
      return actor.getMembershipTier(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false,
  });
}

export function useGetLinkedApps(principal: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<string[]>({
    queryKey: ["linkedApps", principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal)
        throw new Error("Actor or principal not available");
      return actor.getLinkedApps(principal);
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false,
  });
}

export { MembershipTier };
