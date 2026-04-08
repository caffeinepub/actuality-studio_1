import type { Principal } from "@icp-sdk/core/principal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Backend } from "../backend";
import { type Membership, MembershipTier, type UserProfile } from "../types";
import { useActor } from "./useActor";

// Helper to cast actor to access backend methods not yet typed in backend.d.ts
// biome-ignore lint/suspicious/noExplicitAny: backend interface is incomplete
type AnyActor = Record<string, (...args: unknown[]) => Promise<unknown>>;
function asAny(actor: Backend | null): AnyActor | null {
  return actor as unknown as AnyActor | null;
}

// ─── User Profile ────────────────────────────────────────────────────────────

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();
  const anyActor = asAny(actor);

  const query = useQuery<UserProfile | null>({
    queryKey: ["currentUserProfile"],
    queryFn: async () => {
      if (!anyActor) throw new Error("Actor not available");
      return (await anyActor.getCallerUserProfile()) as UserProfile | null;
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
  const anyActor = asAny(actor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!anyActor) throw new Error("Actor not available");
      return anyActor.saveCallerUserProfile(profile as unknown);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUserProfile"] });
    },
  });
}

// ─── Membership ──────────────────────────────────────────────────────────────

export function useGetMembershipForCaller() {
  const { actor, isFetching: actorFetching } = useActor();
  const anyActor = asAny(actor);

  const query = useQuery<Membership | null>({
    queryKey: ["membershipForCaller"],
    queryFn: async () => {
      if (!anyActor) throw new Error("Actor not available");
      return (await anyActor.getMembershipForCaller()) as Membership | null;
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
  const anyActor = asAny(actor);

  return useQuery<boolean>({
    queryKey: ["isTrialActive"],
    queryFn: async () => {
      if (!anyActor) throw new Error("Actor not available");
      return (await anyActor.isTrialActive()) as boolean;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useIsMembershipActive() {
  const { actor, isFetching: actorFetching } = useActor();
  const anyActor = asAny(actor);

  return useQuery<boolean>({
    queryKey: ["isMembershipActive"],
    queryFn: async () => {
      if (!anyActor) throw new Error("Actor not available");
      return (await anyActor.isMembershipActive()) as boolean;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useGetTrialExpiryDate() {
  const { actor, isFetching: actorFetching } = useActor();
  const anyActor = asAny(actor);

  return useQuery<bigint | null>({
    queryKey: ["trialExpiryDate"],
    queryFn: async () => {
      if (!anyActor) throw new Error("Actor not available");
      return (await anyActor.getTrialExpiryDate()) as bigint | null;
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useMintMembership() {
  const { actor } = useActor();
  const anyActor = asAny(actor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!anyActor) throw new Error("Actor not available");
      return anyActor.mintMembership();
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
  const anyActor = asAny(actor);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!anyActor) throw new Error("Actor not available");
      return anyActor.cancelMembership();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["membershipForCaller"] });
      queryClient.invalidateQueries({ queryKey: ["isMembershipActive"] });
    },
  });
}

export function useGetMembershipTier(principal: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();
  const anyActor = asAny(actor);

  return useQuery<MembershipTier>({
    queryKey: ["membershipTier", principal?.toString()],
    queryFn: async () => {
      if (!anyActor || !principal)
        throw new Error("Actor or principal not available");
      return (await anyActor.getMembershipTier(
        principal as unknown,
      )) as MembershipTier;
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false,
  });
}

export function useGetLinkedApps(principal: Principal | undefined) {
  const { actor, isFetching: actorFetching } = useActor();
  const anyActor = asAny(actor);

  return useQuery<string[]>({
    queryKey: ["linkedApps", principal?.toString()],
    queryFn: async () => {
      if (!anyActor || !principal)
        throw new Error("Actor or principal not available");
      return (await anyActor.getLinkedApps(principal as unknown)) as string[];
    },
    enabled: !!actor && !actorFetching && !!principal,
    retry: false,
  });
}

export { MembershipTier };
