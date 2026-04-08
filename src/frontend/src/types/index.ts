import type { Principal } from "@icp-sdk/core/principal";

export interface UserProfile {
  name: string;
  displayName: string;
  email: string;
}

export interface Membership {
  tokenId: bigint;
  owner: Principal;
  mintTimestamp: bigint;
  trialStartTimestamp: bigint;
}

export interface ShareLinkPublic {
  id: string;
  documentName: string;
  expiryTime: bigint;
  active: boolean;
  hasPassword: boolean;
}

export enum MembershipTier {
  free = "free",
  trial = "trial",
  full = "full",
}
