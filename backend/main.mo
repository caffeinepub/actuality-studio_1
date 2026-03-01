import Time "mo:core/Time";
import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = { name : Text };
  let userProfiles = Map.empty<Principal, UserProfile>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  public type Membership = {
    owner : Principal;
    tokenId : Nat;
    mintTimestamp : Time.Time;
    active : Bool;
    trialPeriod : Bool;
  };

  let memberships = Map.empty<Principal, Membership>();
  var globalTokenIdCounter : Nat = 0;
  let oneDayInNanos = 24 * 60 * 60 * 1_000_000_000;
  let trialPeriodDays = 30;

  func getAndIncrementTokenId() : Nat {
    let current = globalTokenIdCounter;
    globalTokenIdCounter += 1;
    current;
  };

  public shared ({ caller }) func mintMembership() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can mint a membership");
    };
    if (memberships.containsKey(caller)) {
      Runtime.trap("Principal already has a membership");
    };

    let newMembership : Membership = {
      owner = caller;
      tokenId = getAndIncrementTokenId();
      mintTimestamp = Time.now();
      active = true;
      trialPeriod = true;
    };

    memberships.add(caller, newMembership);
  };

  public query ({ caller }) func getMembershipForCaller() : async ?Membership {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can view their membership");
    };
    memberships.get(caller);
  };

  public query ({ caller }) func getMembership(owner : Principal) : async ?Membership {
    if (caller != owner and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own membership");
    };
    memberships.get(owner);
  };

  public query ({ caller }) func isTrialActive() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check trial status");
    };
    switch (memberships.get(caller)) {
      case (null) { false };
      case (?membership) {
        if (not membership.trialPeriod) {
          return false;
        };
        let currentTime = Time.now();
        let trialExpiryTime = membership.mintTimestamp + (trialPeriodDays * oneDayInNanos);
        currentTime < trialExpiryTime;
      };
    };
  };

  public query ({ caller }) func isMembershipActive() : async Bool {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check membership status");
    };
    switch (memberships.get(caller)) {
      case (null) { false };
      case (?membership) { membership.active };
    };
  };

  public query ({ caller }) func getTrialExpiryDate() : async ?Time.Time {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can check trial expiry");
    };
    switch (memberships.get(caller)) {
      case (null) { null };
      case (?membership) {
        ?(membership.mintTimestamp + (trialPeriodDays * oneDayInNanos));
      };
    };
  };

  public shared ({ caller }) func cancelMembership() : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can cancel a membership");
    };
    switch (memberships.get(caller)) {
      case (null) { Runtime.trap("No active membership found") };
      case (?membership) {
        let updatedMembership : Membership = {
          owner = membership.owner;
          tokenId = membership.tokenId;
          mintTimestamp = membership.mintTimestamp;
          active = false;
          trialPeriod = membership.trialPeriod;
        };
        memberships.add(caller, updatedMembership);
      };
    };
  };
};
