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
export interface UserProfile {
    name: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    cancelMembership(): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getMembership(owner: Principal): Promise<Membership | null>;
    getMembershipForCaller(): Promise<Membership | null>;
    getTrialExpiryDate(): Promise<Time | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    isMembershipActive(): Promise<boolean>;
    isTrialActive(): Promise<boolean>;
    mintMembership(): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
}
