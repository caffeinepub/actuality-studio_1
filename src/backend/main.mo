import Time "mo:core/Time";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Set "mo:core/Set";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type MembershipTier = {
    #free;
    #trial;
    #full;
  };

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

  public query ({ caller }) func getUserByPrincipal(p : Principal) : async ?UserProfile {
    if (caller != p and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(p);
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
  let oneDayInNanos = 24 * 60 * 1_000_000_000;
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

  public query func getMembershipForUser(user : Principal) : async ?Membership {
    // No authorization check - public for cross-app use
    memberships.get(user);
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

  public query func getMembershipTier(p : Principal) : async MembershipTier {
    // No authorization check - public for cross-app use
    switch (memberships.get(p)) {
      case (null) { #free };
      case (?membership) {
        if (membership.trialPeriod) {
          let trialExpiry = membership.mintTimestamp + (trialPeriodDays * oneDayInNanos);
          if (Time.now() < trialExpiry) {
            return #trial;
          };
        };
        if (membership.active) { #full } else { #free };
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

  // LINK APP PRINCIPAL
  let linkedApps = Map.empty<Principal, Set.Set<Text>>();

  public shared ({ caller }) func linkAppPrincipal(appId : Text, userPrincipal : Principal) : async () {
    // Allow any authenticated caller (not anonymous) - app canisters can call this
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Anonymous principals cannot link app principals");
    };
    var apps = switch (linkedApps.get(userPrincipal)) {
      case (null) { Set.empty<Text>() };
      case (?existing) { existing };
    };

    apps.add(appId);
    linkedApps.add(userPrincipal, apps);
  };

  public query func getLinkedApps(p : Principal) : async [Text] {
    // No authorization check - public for cross-app use
    switch (linkedApps.get(p)) {
      case (null) { [] };
      case (?apps) { apps.toArray() };
    };
  };

  // ART SELECTIONS
  let userArtSelections = Map.empty<Principal, [Text]>();

  public shared ({ caller }) func saveSelectedArts(arts : [Text]) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can save art selections");
    };
    userArtSelections.add(caller, arts);
  };

  public query ({ caller }) func getSelectedArts() : async [Text] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can get art selections");
    };
    switch (userArtSelections.get(caller)) {
      case (null) { [] };
      case (?arts) { arts };
    };
  };

  public type ShareLink = {
    id : Text;
    documentName : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    expiryTime : Time.Time;
    passwordHash : Text;
    active : Bool;
  };

  public type ShareLinkPublic = {
    id : Text;
    documentName : Text;
    createdBy : Principal;
    createdAt : Time.Time;
    expiryTime : Time.Time;
    active : Bool;
  };

  let shareLinks = Map.empty<Text, ShareLink>();

  public shared ({ caller }) func createShareLink(documentName : Text, expiryHours : Nat, passwordHash : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can create share links");
    };

    let now = Time.now();
    let expiryTime = now + (expiryHours * 3600 * 1_000_000_000);
    let id = documentName.concat(shareLinks.size().toText()).concat(now.toText());

    let link : ShareLink = {
      id;
      documentName;
      createdBy = caller;
      createdAt = now;
      expiryTime;
      passwordHash;
      active = true;
    };

    shareLinks.add(id, link);
    id;
  };

  public query ({ caller }) func getShareLink(linkId : Text) : async ?ShareLinkPublic {
    switch (shareLinks.get(linkId)) {
      case (null) { null };
      case (?link) {
        ?{
          id = link.id;
          documentName = link.documentName;
          createdBy = link.createdBy;
          createdAt = link.createdAt;
          expiryTime = link.expiryTime;
          active = link.active;
        };
      };
    };
  };

  public shared ({ caller }) func validateShareLink(linkId : Text, passwordHash : Text) : async Bool {
    switch (shareLinks.get(linkId)) {
      case (null) { false };
      case (?link) {
        if (not link.active) {
          Runtime.trap("Link is no longer active");
        };
        if (Time.now() > link.expiryTime) {
          Runtime.trap("Link has already expired");
        };
        if (link.passwordHash != passwordHash) {
          Runtime.trap("Incorrect password provided");
        };
        true;
      };
    };
  };

  public shared ({ caller }) func revokeShareLink(linkId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authenticated users can revoke share links");
    };
    switch (shareLinks.get(linkId)) {
      case (null) { Runtime.trap("The provided link does not exist") };
      case (?link) {
        if (caller != link.createdBy and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("Unauthorized: Only link creator or admin can revoke this link");
        };
        let updatedLink : ShareLink = {
          id = link.id;
          documentName = link.documentName;
          createdBy = link.createdBy;
          createdAt = link.createdAt;
          expiryTime = link.expiryTime;
          passwordHash = link.passwordHash;
          active = false;
        };
        shareLinks.add(linkId, updatedLink);
      };
    };
  };
};
