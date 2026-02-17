import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  public type UserRole = {
    #admin;
    #user;
    #guest;
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

  let userProfiles = Map.empty<Principal, UserProfile>();
  let leads = Map.empty<Text, Lead>();
  let outreachActivities = Map.empty<Text, OutreachActivity>();
  let deals = Map.empty<Text, Deal>();
  let services = Map.empty<Text, Service>();
  let projects = Map.empty<Text, Project>();
  let clientServiceRequests = Map.empty<Text, ClientServiceRequest>();

  public type Settings = {
    defaultSort : Text;
    timeZone : Text;
    onboardingCompleted : Bool;
    pricingType : Text;
    defaultValues : Text;
    tutorialStage : Int;
  };

  var systemSettings : Settings = {
    defaultSort = "agency";
    timeZone = "America/New_York";
    onboardingCompleted = false;
    pricingType = "retainer";
    defaultValues = "yes";
    tutorialStage = 1;
  };

  // Settings - No authorization required (guest access allowed)
  public shared ({ caller }) func updateSettings(newSettings : Settings) : async () {
    systemSettings := newSettings;
  };

  public query ({ caller }) func getSettings() : async Settings {
    systemSettings;
  };

  // User Management
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

  public shared ({ caller }) func registerUser(
    principal : Text,
    name : Text,
    email : Text,
    mobileNumber : ?Text,
    agency : Text,
    role : Text,
    revenueGoal : Nat,
    subscriptionPlan : Text,
  ) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can register");
    };
    let profile : UserProfile = {
      principal;
      name;
      email;
      mobileNumber;
      agency;
      role;
      revenueGoal;
      subscriptionPlan;
      totalRevenue = 0;
    };
    userProfiles.add(caller, profile);
  };

  // Client Service Requests - No authorization required (guest access allowed)
  public shared ({ caller }) func createClientServiceRequest(serviceId : Text, agency : Text, details : ?Text) : async () {
    let requestId = serviceId.concat("-").concat(caller.toText());
    let newRequest : ClientServiceRequest = {
      id = requestId;
      principal = caller.toText();
      agency;
      serviceId;
      createdAt = Time.now();
      details;
    };

    clientServiceRequests.add(requestId, newRequest);
  };

  public query ({ caller }) func getAllClientServiceRequests() : async [ClientServiceRequest] {
    clientServiceRequests.values().toArray();
  };

  public query ({ caller }) func getClientServiceRequestsByAgency(agency : Text) : async [ClientServiceRequest] {
    let requests = clientServiceRequests.values().toArray();
    requests.filter(
      func(request) {
        request.agency == agency;
      }
    );
  };

  public query ({ caller }) func getClientServiceRequest(requestId : Text) : async ?ClientServiceRequest {
    clientServiceRequests.get(requestId);
  };

  // Lead Management - User access required
  public shared ({ caller }) func addLead(request : { id : Text; agency : Text; name : Text; contact : Text; city : Text; niche : Text; status : Text; revenuePotential : Nat; owner : Text }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add leads");
    };
    let lead : Lead = {
      id = request.id;
      agency = request.agency;
      name = request.name;
      contact = request.contact;
      city = request.city;
      niche = request.niche;
      status = request.status;
      revenuePotential = request.revenuePotential;
      createdAt = Time.now();
      owner = request.owner;
    };
    leads.add(request.id, lead);
  };

  public query ({ caller }) func getAllLeads() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view leads");
    };
    leads.values().toArray();
  };

  public query ({ caller }) func getLeadsForExport() : async [Lead] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can export leads");
    };
    leads.values().toArray();
  };

  public shared ({ caller }) func updateLeadStatus(leadId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update lead status");
    };
    switch (leads.get(leadId)) {
      case (?lead) {
        let updatedLead : Lead = {
          id = lead.id;
          agency = lead.agency;
          name = lead.name;
          contact = lead.contact;
          city = lead.city;
          niche = lead.niche;
          status;
          revenuePotential = lead.revenuePotential;
          createdAt = lead.createdAt;
          owner = lead.owner;
        };
        leads.add(leadId, updatedLead);
      };
      case (null) {};
    };
  };

  // Outreach Management - User access required
  public shared ({ caller }) func addOutreach(activity : OutreachActivity) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add outreach activities");
    };
    outreachActivities.add(activity.leadId, activity);
  };

  public query ({ caller }) func getAllOutreachActivities() : async [OutreachActivity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view outreach activities");
    };
    outreachActivities.values().toArray();
  };

  public query ({ caller }) func getOutreachActivitiesForExport() : async [OutreachActivity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can export outreach activities");
    };
    outreachActivities.values().toArray();
  };

  // Deal Management - User access required
  public query ({ caller }) func getUserDeals(agency : Text) : async [Deal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view deals");
    };
    let allDeals = deals.values().toArray();
    allDeals.filter(func(deal : Deal) : Bool { deal.agency == agency });
  };

  public shared ({ caller }) func updateDealStatus(dealId : Text, status : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update deal status");
    };
    switch (deals.get(dealId)) {
      case (?deal) {
        let updatedDeal : Deal = {
          id = deal.id;
          leadId = deal.leadId;
          agency = deal.agency;
          status;
          value = deal.value;
          createdAt = deal.createdAt;
          closeDate = deal.closeDate;
        };
        deals.add(dealId, updatedDeal);
      };
      case (null) {};
    };
  };

  public query ({ caller }) func getDealsForExport() : async [Deal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can export deals");
    };
    deals.values().toArray();
  };

  // Project Management - User access required
  public shared ({ caller }) func addProject(project : Project) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add projects");
    };
    projects.add(project.id, project);
  };

  public query ({ caller }) func getProjectsForExport() : async [Project] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can export projects");
    };
    projects.values().toArray();
  };

  public shared ({ caller }) func completeProject(projectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete projects");
    };
    switch (projects.get(projectId)) {
      case (?project) {
        let updatedProject : Project = {
          id = project.id;
          agency = project.agency;
          serviceId = project.serviceId;
          clientId = project.clientId;
          startDate = project.startDate;
          milestones = project.milestones;
          files = project.files;
          notes = project.notes;
          completion = 100;
          status = "Completed";
        };
        projects.add(projectId, updatedProject);
      };
      case (null) {};
    };
  };

  // Service Management - No authorization required (guest access allowed)
  public shared ({ caller }) func addService(service : Service) : async () {
    services.add(service.id, service);
  };

  public shared ({ caller }) func updateServiceStatus(serviceId : Text, active : Bool) : async () {
    switch (services.get(serviceId)) {
      case (?service) {
        let updatedService : Service = {
          id = service.id;
          agency = service.agency;
          name = service.name;
          price = service.price;
          deliveryTime = service.deliveryTime;
          active;
          revenue = service.revenue;
          salesCount = service.salesCount;
          serviceType = service.serviceType;
          serviceSubType = service.serviceSubType;
          cost = service.cost;
          niche = service.niche;
          date = service.date;
          time = service.time;
        };
        services.add(serviceId, updatedService);
      };
      case (null) {};
    };
  };

  public query ({ caller }) func getServicesForExport() : async [Service] {
    services.values().toArray();
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray();
  };

  public query ({ caller }) func getServiceById(serviceId : Text) : async ?Service {
    services.get(serviceId);
  };

  // Analytics - User access required
  public query ({ caller }) func getAgencyAnalytics(agency : Text) : async ([Lead], [Deal], [OutreachActivity], [Service], [Project]) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };
    let leadList = leads.values().toArray();
    let dealList = deals.values().toArray();
    let outreachList = outreachActivities.values().toArray();
    let serviceList = services.values().toArray();
    let projectList = projects.values().toArray();

    (leadList, dealList, outreachList, serviceList, projectList);
  };

  // Admin Functions - Admin access required
  public shared ({ caller }) func importLeads(leadList : [Lead], agency : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can import leads");
    };
    let leadsToAdd = List.fromArray<Lead>(leadList);
    leadsToAdd.forEach(func(lead) { 
      leads.add(lead.id, lead);
    });
  };
};
