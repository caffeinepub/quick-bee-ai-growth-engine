import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Runtime "mo:core/Runtime";

actor {
  // Set up the authentication system.
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);
  include MixinStorage();

  // Types
  public type UserRole = AccessControl.UserRole;

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

  // Helper functions
  func requirePermission(caller : Principal, role : UserRole) {
    if (not (AccessControl.hasPermission(accessControlState, caller, role))) {
      Runtime.trap(
        switch (role) {
          case (#admin) { "You must be an admin to perform this action. Please contact support if this is an error." };
          case (#user) { "You must be logged in to perform this action. Please sign in or register to continue." };
          case (#guest) { "You must be logged in to perform this action. Please sign in or register to continue." };
        }
      );
    };
  };

  func getUserAgency(caller : Principal) : ?Text {
    switch (userProfiles.get(caller)) {
      case (?profile) { ?profile.agency };
      case (null) { null };
    };
  };

  // User Management - Required profile functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    requirePermission(caller, #user);
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("You can only view your own profile. Please sign in to access your profile.");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    requirePermission(caller, #user);
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
    // Only allow users to register themselves, or admins to register others
    if (caller.toText() != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("You can only register your own account. Please contact an administrator for assistance.");
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

  // Client Service Requests - Public access allowed for clients to request services
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
    requirePermission(caller, #user);
    clientServiceRequests.values().toArray();
  };

  public query ({ caller }) func getClientServiceRequestsByAgency(agency : Text) : async [ClientServiceRequest] {
    requirePermission(caller, #user);
    
    // Users can only see requests for their own agency, admins can see all
    switch (getUserAgency(caller)) {
      case (?userAgency) {
        if (userAgency != agency and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("You can only view service requests for your own agency.");
        };
      };
      case (null) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("You must have a registered profile to view service requests.");
        };
      };
    };
    
    let requests = clientServiceRequests.values().toArray();
    requests.filter(
      func(request) {
        request.agency == agency;
      }
    );
  };

  public query ({ caller }) func getClientServiceRequest(requestId : Text) : async ?ClientServiceRequest {
    requirePermission(caller, #user);
    
    switch (clientServiceRequests.get(requestId)) {
      case (?request) {
        // Users can view requests they created or requests for their agency
        if (request.principal == caller.toText()) {
          ?request;
        } else {
          switch (getUserAgency(caller)) {
            case (?userAgency) {
              if (userAgency == request.agency or AccessControl.isAdmin(accessControlState, caller)) {
                ?request;
              } else {
                Runtime.trap("You can only view your own service requests or requests for your agency.");
              };
            };
            case (null) {
              if (AccessControl.isAdmin(accessControlState, caller)) {
                ?request;
              } else {
                Runtime.trap("You can only view your own service requests.");
              };
            };
          };
        };
      };
      case (null) { null };
    };
  };

  // Lead Management
  public shared ({ caller }) func addLead(request : { id : Text; agency : Text; name : Text; contact : Text; city : Text; niche : Text; status : Text; revenuePotential : Nat; owner : Text }) : async () {
    requirePermission(caller, #user);
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
    requirePermission(caller, #user);
    
    // Users can only see leads for their own agency, admins can see all
    switch (getUserAgency(caller)) {
      case (?userAgency) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          leads.values().toArray();
        } else {
          let allLeads = leads.values().toArray();
          allLeads.filter(func(lead : Lead) : Bool { lead.agency == userAgency });
        };
      };
      case (null) {
        if (AccessControl.isAdmin(accessControlState, caller)) {
          leads.values().toArray();
        } else {
          Runtime.trap("You must have a registered profile to view leads.");
        };
      };
    };
  };

  // Unrestricted export API for leads - public access for export functionality
  public query ({ caller }) func getLeadsForExport() : async [Lead] {
    leads.values().toArray();
  };

  public shared ({ caller }) func updateLeadStatus(leadId : Text, status : Text) : async () {
    requirePermission(caller, #user);
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

  // Outreach Management
  public shared ({ caller }) func addOutreach(activity : OutreachActivity) : async () {
    requirePermission(caller, #user);
    outreachActivities.add(activity.leadId, activity);
  };

  public query ({ caller }) func getAllOutreachActivities() : async [OutreachActivity] {
    requirePermission(caller, #user);
    outreachActivities.values().toArray();
  };

  // Unrestricted export API for outreach activities - public access for export functionality
  public query ({ caller }) func getOutreachActivitiesForExport() : async [OutreachActivity] {
    outreachActivities.values().toArray();
  };

  public query ({ caller }) func getUserDeals(_agency : Text) : async [Deal] {
    requirePermission(caller, #user);
    deals.values().toArray();
  };

  // Deal Management
  public shared ({ caller }) func updateDealStatus(dealId : Text, status : Text) : async () {
    requirePermission(caller, #user);
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

  // Unrestricted export API for deals - public access for export functionality
  public query ({ caller }) func getDealsForExport() : async [Deal] {
    deals.values().toArray();
  };

  // Project Management
  public shared ({ caller }) func addProject(project : Project) : async () {
    requirePermission(caller, #user);
    projects.add(project.id, project);
  };

  // Unrestricted export API for projects - public access for export functionality
  public query ({ caller }) func getProjectsForExport() : async [Project] {
    projects.values().toArray();
  };

  // Service Management
  public shared ({ caller }) func addService(service : Service) : async () {
    requirePermission(caller, #user);
    services.add(service.id, service);
  };

  public shared ({ caller }) func updateServiceStatus(serviceId : Text, active : Bool) : async () {
    requirePermission(caller, #user);
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
        };
        services.add(serviceId, updatedService);
      };
      case (null) {};
    };
  };

  // Unrestricted export API for services - public access for export functionality
  public query ({ caller }) func getServicesForExport() : async [Service] {
    services.values().toArray();
  };

  // Analytics
  public query ({ caller }) func getAgencyAnalytics(agency : Text) : async ([Lead], [Deal], [OutreachActivity], [Service], [Project]) {
    requirePermission(caller, #user);
    
    // Users can only view analytics for their own agency, admins can view all
    switch (getUserAgency(caller)) {
      case (?userAgency) {
        if (userAgency != agency and not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("You can only view analytics for your own agency.");
        };
      };
      case (null) {
        if (not AccessControl.isAdmin(accessControlState, caller)) {
          Runtime.trap("You must have a registered profile to view analytics.");
        };
      };
    };
    
    let leadList = leads.values().toArray().filter(
      func(lead : Lead) : Bool { lead.agency == agency }
    );

    let dealList = deals.values().toArray().filter(
      func(deal : Deal) : Bool { deal.agency == agency }
    );

    let outreachList = outreachActivities.values().toArray();

    let serviceList = services.values().toArray().filter(
      func(service : Service) : Bool { service.agency == agency }
    );

    let projectList = projects.values().toArray().filter(
      func(project : Project) : Bool { project.agency == agency }
    );

    (leadList, dealList, outreachList, serviceList, projectList);
  };

  // Import Leads
  public shared ({ caller }) func importLeads(leadList : [Lead], _agency : Text) : async () {
    requirePermission(caller, #user);
    let leadsToAdd = List.fromArray<Lead>(leadList);
    leadsToAdd.forEach(func(lead) { leads.add(lead.id, lead) });
  };

  // Public service catalog - allows guests to browse available services
  public query ({ caller }) func getAllServices() : async [Service] {
    services.values().toArray();
  };

  public shared ({ caller }) func completeProject(projectId : Text) : async () {
    requirePermission(caller, #user);
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
};
