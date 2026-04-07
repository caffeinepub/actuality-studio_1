import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Membership {
    active: boolean;
    tokenId: bigint;
    trialPeriod: boolean;
    owner: Principal;
    mintTimestamp: Time;
}
export type Time = bigint;
export interface ShareLinkPublic {
    id: string;
    documentName: string;
    active: boolean;
    createdAt: Time;
    createdBy: Principal;
    expiryTime: Time;
}
export interface UserProfile {
    name: string;
}
export enum MembershipTier {
    trial = "trial",
    free = "free",
    full = "full"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelMembership(): Promise<void>;
    createShareLink(documentName: string, expiryHours: bigint, passwordHash: string): Promise<string>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getLinkedApps(p: Principal): Promise<Array<string>>;
    getMembership(owner: Principal): Promise<Membership | null>;
    getMembershipForCaller(): Promise<Membership | null>;
    getMembershipForUser(user: Principal): Promise<Membership | null>;
    getMembershipTier(p: Principal): Promise<MembershipTier>;
    getSelectedArts(): Promise<Array<string>>;
    getShareLink(linkId: string): Promise<ShareLinkPublic | null>;
    getTrialExpiryDate(): Promise<Time | null>;
    getUserByPrincipal(p: Principal): Promise<UserProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isMembershipActive(): Promise<boolean>;
    isTrialActive(): Promise<boolean>;
    linkAppPrincipal(appId: string, userPrincipal: Principal): Promise<void>;
    mintMembership(): Promise<void>;
    revokeShareLink(linkId: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    saveSelectedArts(arts: Array<string>): Promise<void>;
    validateShareLink(linkId: string, passwordHash: string): Promise<boolean>;
}
