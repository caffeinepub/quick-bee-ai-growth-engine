import Map "mo:core/Map";
import Time "mo:core/Time";
import Array "mo:core/Array";
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
    role : Text;
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

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view profiles");
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

  public shared ({ caller }) func updateSettings(newSettings : Settings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update settings");
    };
    systemSettings := newSettings;
  };

  public query ({ caller }) func getSettings() : async Settings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view settings");
    };
    systemSettings;
  };

  public shared ({ caller }) func updatePaymentSettings(newSettings : PaymentSettings) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update payment settings");
    };
    paymentSettings := newSettings;
  };

  public query ({ caller }) func getPaymentSettings() : async PaymentSettings {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payment settings");
    };
    paymentSettings;
  };

  public shared ({ caller }) func createPayment(serviceId : Text, amount : Nat, paymentMethod : PaymentMethod) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create payments");
    };
    let paymentId = serviceId.concat("-").concat(caller.toText()).concat("-").concat(Time.now().toText());
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update payment status");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payments");
    };
    switch (payments.get(paymentId)) {
      case (?payment) {
        if (payment.userId == caller or AccessControl.isAdmin(accessControlState, caller)) {
          ?payment;
        } else {
          Runtime.trap("Unauthorized: Can only view your own payments");
        };
      };
      case (null) { null };
    };
  };

  public query ({ caller }) func getUserPayments() : async [Payment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view payments");
    };
    let allPayments = payments.values().toArray();
    allPayments.filter(func(payment : Payment) : Bool { payment.userId == caller });
  };

  public query ({ caller }) func getAllPayments() : async [Payment] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can view all payments");
    };
    payments.values().toArray();
  };

  public query ({ caller }) func getLeadsPaginated(offset : Nat, limit : Nat) : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leads");
    };
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
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create leads");
    };
    leads.add(lead.id, lead);
  };

  public shared ({ caller }) func updateLead(leadId : Text, lead : Lead) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update leads");
    };
    leads.add(leadId, lead);
  };

  public shared ({ caller }) func deleteLead(leadId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete leads");
    };
    leads.remove(leadId);
  };

  public query func getServices() : async [Service] {
    services.values().toArray();
  };

  public query ({ caller }) func getService(serviceId : Text) : async ?Service {
    services.get(serviceId);
  };

  public shared ({ caller }) func createService(service : Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create services");
    };
    services.add(service.id, service);
  };

  public shared ({ caller }) func updateService(serviceId : Text, service : Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update services");
    };
    services.add(serviceId, service);
  };

  public shared ({ caller }) func deleteService(serviceId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can delete services");
    };
    services.remove(serviceId);
  };

  public shared ({ caller }) func createClientServiceRequest(request : ClientServiceRequest) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create service requests");
    };
    if (request.principal != caller.toText()) {
      Runtime.trap("Unauthorized: Can only create requests for yourself");
    };
    clientServiceRequests.add(request.id, request);
  };

  public query ({ caller }) func getClientServiceRequests() : async [ClientServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view service requests");
    };
    let allRequests = clientServiceRequests.values().toArray();
    if (AccessControl.isAdmin(accessControlState, caller)) {
      allRequests;
    } else {
      allRequests.filter(func(req : ClientServiceRequest) : Bool { req.principal == caller.toText() });
    };
  };

  public query ({ caller }) func getProjects() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view projects");
    };
    let allProjects = projects.values().toArray();
    if (AccessControl.isAdmin(accessControlState, caller)) {
      allProjects;
    } else {
      allProjects.filter(func(proj : Project) : Bool { proj.clientId == caller.toText() });
    };
  };

  public shared ({ caller }) func createProject(project : Project) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can create projects");
    };
    projects.add(project.id, project);
  };

  public shared ({ caller }) func updateProject(projectId : Text, project : Project) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can update projects");
    };
    projects.add(projectId, project);
  };
};
