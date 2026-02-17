import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Int "mo:core/Int";
import Text "mo:core/Text";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";


 actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  type AccessState = AccessControl.AccessControlState;

  // Application-level roles that map to AccessControl roles
  public type AppRole = {
    #Admin;    // Maps to AccessControl #admin
    #Manager;  // Maps to AccessControl #user with manager flag
    #Client;   // Maps to AccessControl #user with client flag
    #Demo;     // Maps to AccessControl #guest with demo flag
  };

  public type Lead = {
    id : Text;
    agency : Text;
    name : Text;
    contact : Text;
    city : Text;
    niche : Text;
    status : Text;
    revenuePotential : Nat;
    createdAt : Int;
    owner : Text;
  };

  public type OutreachActivity = {
    leadId : Text;
    platform : Text;
    message : Text;
    sent : Bool;
    replied : Bool;
    followUpDate : Int;
    createdAt : Int;
  };

  public type Deal = {
    id : Text;
    leadId : Text;
    agency : Text;
    status : Text;
    value : Nat;
    createdAt : Int;
    closeDate : ?Int;
  };

  public type Service = {
    id : Text;
    agency : Text;
    name : Text;
    price : Nat;
    deliveryTime : Text;
    active : Bool;
    revenue : Nat;
    salesCount : Nat;
    serviceType : Text;
    serviceSubType : Text;
    cost : Nat;
    niche : Text;
    date : Text;
    time : Text;
    shortDescription : Text;
    detailedDescription : Text;
    deliverables : [Text];
    requirements : [Text];
    supportedProviders : [Text];
  };

  public type Project = {
    id : Text;
    agency : Text;
    serviceId : Text;
    clientId : Text;
    startDate : Int;
    milestones : [Text];
    files : [Storage.ExternalBlob];
    notes : Text;
    completion : Nat;
    status : Text;
  };

  public type ClientServiceRequest = {
    id : Text;
    principal : Text;
    agency : Text;
    serviceId : Text;
    createdAt : Int;
    details : ?Text;
  };

  public type UserProfile = {
    principal : Text;
    name : Text;
    email : Text;
    mobileNumber : ?Text;
    agency : Text;
    role : AppRole;
    revenueGoal : Nat;
    subscriptionPlan : Text;
    totalRevenue : Nat;
  };

  public type Settings = {
    defaultSort : Text;
    timeZone : Text;
    onboardingCompleted : Bool;
    pricingType : Text;
    defaultValues : Text;
    tutorialStage : Int;
  };

  public type PaymentMethod = {
    #upi;
    #razorpay;
    #stripe;
  };

  public type PaymentStatus = {
    #pending;
    #paid;
    #failed;
    #cancelled;
  };

  public type PaymentSettings = {
    upiDetails : Text;
    razorpayLink : Text;
    stripeLink : Text;
  };

  public type Payment = {
    id : Text;
    serviceId : Text;
    userId : Principal;
    amount : Nat;
    paymentMethod : PaymentMethod;
    status : PaymentStatus;
    createdAt : Int;
    updatedAt : Int;
  };

  var systemSettings : Settings = {
    defaultSort = "agency";
    timeZone = "America/New_York";
    onboardingCompleted = false;
    pricingType = "retainer";
    defaultValues = "yes";
    tutorialStage = 1;
  };

  var accessState = AccessControl.initState();
  var paymentSettings : PaymentSettings = {
    upiDetails = "sample@upi";
    razorpayLink = "https://razorpay.com";
    stripeLink = "https://stripe.com";
  };

  var userProfiles = Map.empty<Principal, UserProfile>();
  var leads = Map.empty<Text, Lead>();
  var outreachActivities = Map.empty<Text, OutreachActivity>();
  var deals = Map.empty<Text, Deal>();
  var services = Map.empty<Text, Service>();
  var projects = Map.empty<Text, Project>();
  var clientServiceRequests = Map.empty<Text, ClientServiceRequest>();
  var payments = Map.empty<Text, Payment>();
  var demoSessions = Map.empty<Principal, Bool>();

  // Helper function to get application role
  private func getAppRole(caller : Principal) : AppRole {
    // Check if demo session
    switch (demoSessions.get(caller)) {
      case (?true) { return #Demo };
      case (_) {};
    };

    // Check user profile for role
    switch (userProfiles.get(caller)) {
      case (?profile) { return profile.role };
      case (null) {
        // Fall back to AccessControl role mapping
        if (AccessControl.isAdmin(accessControlState, caller)) {
          return #Admin;
        };
        if (AccessControl.hasPermission(accessControlState, caller, #user)) {
          return #Client; // Default authenticated users to Client
        };
        return #Demo; // Unauthenticated/guest users are demo
      };
    };
  };

  // Authorization helpers
  private func requireAdmin(caller : Principal) {
    let role = getAppRole(caller);
    switch (role) {
      case (#Admin) {};
      case (_) {
        Runtime.trap("Unauthorized: Admin access required");
      };
    };
  };

  private func requireManagerOrAdmin(caller : Principal) {
    let role = getAppRole(caller);
    switch (role) {
      case (#Admin or #Manager) {};
      case (_) {
        Runtime.trap("Unauthorized: Manager or Admin access required");
      };
    };
  };

  private func requireClientOrHigher(caller : Principal) {
    let role = getAppRole(caller);
    switch (role) {
      case (#Admin or #Manager or #Client) {};
      case (_) {
        Runtime.trap("Unauthorized: Client access required");
      };
    };
  };

  private func requireAuthenticated(caller : Principal) {
    if (caller.isAnonymous()) {
      Runtime.trap("Unauthorized: Authentication required");
    };
    let role = getAppRole(caller);
    switch (role) {
      case (#Demo) {
        Runtime.trap("Unauthorized: Demo mode does not allow this operation");
      };
      case (_) {};
    };
  };

  // Demo session management
  public shared ({ caller }) func startDemoSession() : async () {
    if (not caller.isAnonymous()) {
      Runtime.trap("Demo sessions are only for anonymous users");
    };
    demoSessions.add(caller, true);
  };

  public shared ({ caller }) func endDemoSession() : async () {
    demoSessions.remove(caller);
  };

  public query ({ caller }) func isDemoSession() : async Bool {
    switch (demoSessions.get(caller)) {
      case (?true) { true };
      case (_) { false };
    };
  };

  // User profile management
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    requireAuthenticated(caller);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    requireAuthenticated(caller);
    if (caller != user) {
      requireAdmin(caller);
    };
    userProfiles.get(user);
  };

  public query ({ caller }) func getUserRole() : async AppRole {
    getAppRole(caller);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    requireAuthenticated(caller);

    // Verify the profile principal matches caller
    let callerText = caller.toText();
    if (profile.principal != callerText) {
      Runtime.trap("Unauthorized: Cannot save profile for different user");
    };

    // Users cannot elevate their own role
    switch (userProfiles.get(caller)) {
      case (?existingProfile) {
        // Check if role is being changed
        let existingRole = existingProfile.role;
        let newRole = profile.role;
        if (existingRole != newRole) {
          requireAdmin(caller);
        };
      };
      case (null) {
        // New profile - only Admin can assign Admin or Manager roles
        switch (profile.role) {
          case (#Admin or #Manager) {
            requireAdmin(caller);
          };
          case (_) {};
        };
      };
    };

    userProfiles.add(caller, profile);
  };

  // Settings management - Admin only
  public shared ({ caller }) func updateSettings(newSettings : Settings) : async () {
    requireAdmin(caller);
    systemSettings := newSettings;
  };

  public query ({ caller }) func getSettings() : async Settings {
    requireClientOrHigher(caller);
    systemSettings;
  };

  // Payment settings - Admin only
  public shared ({ caller }) func updatePaymentSettings(newSettings : PaymentSettings) : async () {
    requireAdmin(caller);
    paymentSettings := newSettings;
  };

  public query ({ caller }) func getPaymentSettings() : async PaymentSettings {
    requireManagerOrAdmin(caller);
    paymentSettings;
  };

  // Payment management
  public shared ({ caller }) func createPayment(serviceId : Text, amount : Nat, paymentMethod : PaymentMethod) : async Text {
    requireClientOrHigher(caller);

    let paymentId = serviceId.concat("-".concat(caller.toText().concat("-".concat(Time.now().toText()))));
    let newPayment : Payment = {
      id = paymentId;
      serviceId;
      userId = caller;
      amount;
      paymentMethod;
      status = #pending;
      createdAt = Time.now();
      updatedAt = Time.now();
    };
    payments.add(paymentId, newPayment);
    paymentId;
  };

  public shared ({ caller }) func updatePaymentStatus(paymentId : Text, newStatus : PaymentStatus) : async () {
    requireManagerOrAdmin(caller);

    switch (payments.get(paymentId)) {
      case (?payment) {
        let updatedPayment : Payment = {
          id = payment.id;
          serviceId = payment.serviceId;
          userId = payment.userId;
          amount = payment.amount;
          paymentMethod = payment.paymentMethod;
          status = newStatus;
          createdAt = payment.createdAt;
          updatedAt = Time.now();
        };
        payments.add(paymentId, updatedPayment);
      };
      case (null) {
        Runtime.trap("Payment not found");
      };
    };
  };

  public query ({ caller }) func getPayment(paymentId : Text) : async ?Payment {
    requireClientOrHigher(caller);

    switch (payments.get(paymentId)) {
      case (?payment) {
        let role = getAppRole(caller);
        switch (role) {
          case (#Admin or #Manager) {
            ?payment;
          };
          case (#Client) {
            if (payment.userId == caller) {
              ?payment;
            } else {
              Runtime.trap("Unauthorized: Can only view your own payments");
            };
          };
          case (_) {
            Runtime.trap("Unauthorized");
          };
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserPayments() : async [Payment] {
    requireClientOrHigher(caller);

    let allPayments = payments.values().toArray();
    let role = getAppRole(caller);
    switch (role) {
      case (#Admin or #Manager) {
        allPayments;
      };
      case (#Client) {
        allPayments.filter<Payment>(func(payment : Payment) : Bool { payment.userId == caller });
      };
      case (_) {
        [];
      };
    };
  };

  public query ({ caller }) func getAllPayments() : async [Payment] {
    requireManagerOrAdmin(caller);
    payments.values().toArray();
  };

  // Lead management - Manager or Admin only
  public query ({ caller }) func getLeadsPaginated(offset : Nat, limit : Nat) : async [Lead] {
    requireManagerOrAdmin(caller);

    let allLeads = leads.values().toArray();
    let end = if (offset + limit > allLeads.size()) { allLeads.size() } else {
      offset + limit;
    };
    if (offset >= allLeads.size()) {
      [];
    } else {
      allLeads.sliceToArray(offset, end);
    };
  };

  public shared ({ caller }) func createLead(lead : Lead) : async () {
    requireManagerOrAdmin(caller);
    leads.add(lead.id, lead);
  };

  public shared ({ caller }) func updateLead(leadId : Text, lead : Lead) : async () {
    requireManagerOrAdmin(caller);
    leads.add(leadId, lead);
  };

  public shared ({ caller }) func deleteLead(leadId : Text) : async () {
    requireAdmin(caller);
    leads.remove(leadId);
  };

  // Service management
  public query func getServices() : async [Service] {
    // Public read access for service catalog
    services.values().toArray();
  };

  public query func getService(serviceId : Text) : async ?Service {
    // Public read access for service details
    services.get(serviceId);
  };

  public shared ({ caller }) func createService(service : Service) : async () {
    requireAdmin(caller);
    services.add(service.id, service);
  };

  public shared ({ caller }) func updateService(serviceId : Text, service : Service) : async () {
    requireAdmin(caller);
    services.add(serviceId, service);
  };

  public shared ({ caller }) func deleteService(serviceId : Text) : async () {
    requireAdmin(caller);
    services.remove(serviceId);
  };

  // Client service requests - Client or higher
  public shared ({ caller }) func createClientServiceRequest(request : ClientServiceRequest) : async () {
    requireClientOrHigher(caller);

    let callerText = caller.toText();
    if (request.principal != callerText) {
      Runtime.trap("Unauthorized: Can only create requests for yourself");
    };
    clientServiceRequests.add(request.id, request);
  };

  public query ({ caller }) func getClientServiceRequests() : async [ClientServiceRequest] {
    requireClientOrHigher(caller);

    let allRequests = clientServiceRequests.values().toArray();
    let role = getAppRole(caller);
    switch (role) {
      case (#Admin or #Manager) {
        allRequests;
      };
      case (#Client) {
        let callerText = caller.toText();
        allRequests.filter<ClientServiceRequest>(func(req : ClientServiceRequest) : Bool { 
          req.principal == callerText 
        });
      };
      case (_) {
        [];
      };
    };
  };

  // Project management
  public query ({ caller }) func getProjects() : async [Project] {
    requireClientOrHigher(caller);

    let allProjects = projects.values().toArray();
    let role = getAppRole(caller);
    switch (role) {
      case (#Admin or #Manager) {
        allProjects;
      };
      case (#Client) {
        let callerText = caller.toText();
        allProjects.filter<Project>(func(proj : Project) : Bool { 
          proj.clientId == callerText 
        });
      };
      case (_) {
        [];
      };
    };
  };

  public shared ({ caller }) func createProject(project : Project) : async () {
    requireManagerOrAdmin(caller);
    projects.add(project.id, project);
  };

  public shared ({ caller }) func updateProject(projectId : Text, project : Project) : async () {
    requireManagerOrAdmin(caller);
    projects.add(projectId, project);
  };

  public shared ({ caller }) func deleteProject(projectId : Text) : async () {
    requireAdmin(caller);
    projects.remove(projectId);
  };

  // Outreach activities - Manager or Admin only
  public query ({ caller }) func getOutreachActivities() : async [OutreachActivity] {
    requireManagerOrAdmin(caller);
    outreachActivities.values().toArray();
  };

  public shared ({ caller }) func createOutreachActivity(activity : OutreachActivity) : async () {
    requireManagerOrAdmin(caller);
    let activityId = activity.leadId.concat("-".concat(activity.createdAt.toText()));
    outreachActivities.add(activityId, activity);
  };

  // Deal management - Manager or Admin only
  public query ({ caller }) func getDeals() : async [Deal] {
    requireManagerOrAdmin(caller);
    deals.values().toArray();
  };

  public shared ({ caller }) func createDeal(deal : Deal) : async () {
    requireManagerOrAdmin(caller);
    deals.add(deal.id, deal);
  };

  public shared ({ caller }) func updateDeal(dealId : Text, deal : Deal) : async () {
    requireManagerOrAdmin(caller);
    deals.add(dealId, deal);
  };

  public shared ({ caller }) func deleteDeal(dealId : Text) : async () {
    requireAdmin(caller);
    deals.remove(dealId);
  };
};
