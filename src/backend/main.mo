import Map "mo:core/Map";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Time "mo:core/Time";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  type UserRole = AccessControl.UserRole;

  // User Profile
  public type UserProfile = {
    principal : Text;
    name : Text;
    email : Text;
    mobileNumber : ?Text;
    agency : Text;
    role : UserRole;
    revenueGoal : Nat;
    subscriptionPlan : Text;
    totalRevenue : Nat;
  };

  // Leads
  public type LeadStatus = {
    #cold;
    #contacted;
    #interested;
    #qualified;
    #proposalSent;
    #won;
    #lost;
  };

  public type Lead = {
    id : Text;
    agency : Text;
    name : Text;
    contact : Text;
    city : Text;
    niche : Text;
    status : LeadStatus;
    revenuePotential : Nat;
    createdAt : Int;
    owner : Text;
  };

  // Outreach Activities
  public type OutreachActivity = {
    leadId : Text;
    platform : Text;
    message : Text;
    sent : Bool;
    replied : Bool;
    followUpDate : Int;
    createdAt : Int;
  };

  // Deals
  public type DealStatus = {
    #open;
    #proposalSent;
    #won;
    #lost;
  };

  public type Deal = {
    id : Text;
    leadId : Text;
    agency : Text;
    status : DealStatus;
    value : Nat;
    createdAt : Int;
    closeDate : ?Int;
  };

  // Services
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

  // Projects
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

  // Client Service Requests
  public type ClientServiceRequest = {
    id : Text;
    principal : Text;
    agency : Text;
    serviceId : Text;
    createdAt : Int;
    details : ?Text;
  };

  // State Maps
  let userProfiles = Map.empty<Principal, UserProfile>();
  let leads = Map.empty<Text, Lead>();
  let outreachActivities = Map.empty<Text, OutreachActivity>();
  let deals = Map.empty<Text, Deal>();
  let services = Map.empty<Text, Service>();
  let projects = Map.empty<Text, Project>();
  let clientServiceRequests = Map.empty<Text, ClientServiceRequest>();

  // Authentication Mixin
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to get user's agency
  private func getUserAgency(caller : Principal) : ?Text {
    switch (userProfiles.get(caller)) {
      case (?profile) { ?profile.agency };
      case (null) { null };
    };
  };

  // Helper function to verify agency access
  private func verifyAgencyAccess(caller : Principal, agency : Text) : Bool {
    switch (getUserAgency(caller)) {
      case (?userAgency) { userAgency == agency };
      case (null) { false };
    };
  };

  // Helper function to check if caller is authorized admin
  private func isAuthorizedAdmin(email : Text, mobileNumber : ?Text) : Bool {
    let adminEmail = "quickbeeagency@gmail.com";
    let adminMobile = "+919182768591";

    if (Text.equal(email, adminEmail)) {
      return true;
    };

    switch (mobileNumber) {
      case (?number) {
        if (Text.equal(number, adminMobile)) {
          return true;
        };
      };
      case (null) {};
    };

    false;
  };

  // User Management - Required profile functions
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

    // Verify the profile principal matches the caller
    let callerText = caller.toText();
    if (profile.principal != callerText) {
      Runtime.trap("Unauthorized: Cannot save profile for another user");
    };

    // Prevent unauthorized admin registration
    if (profile.role == #admin and not isAuthorizedAdmin(profile.email, profile.mobileNumber)) {
      Runtime.trap("Unauthorized: Only allowlisted accounts can register as admin");
    };

    userProfiles.add(caller, profile);
  };

  public shared ({ caller }) func registerUser(
    principal : Text,
    name : Text,
    email : Text,
    mobileNumber : ?Text,
    agency : Text,
    role : UserRole,
    revenueGoal : Nat,
    subscriptionPlan : Text
  ) : async () {
    // Only allow self-registration or admin registration
    let callerText = caller.toText();
    if (callerText != principal and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only register yourself");
    };

    // Prevent unauthorized admin registration
    if (role == #admin and not isAuthorizedAdmin(email, mobileNumber)) {
      Runtime.trap("Unauthorized: Only allowlisted accounts can register as admin");
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

  // Client Service Requests
  public shared ({ caller }) func createClientServiceRequest(serviceId : Text, agency : Text, details : ?Text) : async () {
    // Only allow non-admin users to create client service requests
    let callerProfile = switch (userProfiles.get(caller)) {
      case (?profile) { profile };
      case (null) { Runtime.trap("User not found") };
    };

    if (callerProfile.role == #admin) {
      Runtime.trap("Unauthorized: Admins cannot create client service requests");
    };

    let requestId = serviceId.concat("-").concat(callerProfile.principal);
    let newRequest : ClientServiceRequest = {
      id = requestId;
      principal = callerProfile.principal;
      agency;
      serviceId;
      createdAt = Time.now();
      details;
    };

    clientServiceRequests.add(requestId, newRequest);
  };

  public query ({ caller }) func getAllClientServiceRequests() : async [ClientServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view client service requests");
    };

    clientServiceRequests.values().toArray();
  };

  public query ({ caller }) func getClientServiceRequestsByAgency(agency : Text) : async [ClientServiceRequest] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view client service requests");
    };

    let requests = clientServiceRequests.values().toArray();
    requests.filter(
      func(request) {
        request.agency == agency;
      }
    );
  };

  public query ({ caller }) func getClientServiceRequest(requestId : Text) : async ?ClientServiceRequest {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view client service requests");
    };

    clientServiceRequests.get(requestId);
  };

  // Lead Management
  public shared ({ caller }) func addLead(request : { id : Text; agency : Text; name : Text; contact : Text; city : Text; niche : Text; status : LeadStatus; revenuePotential : Nat; owner : Text }) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add leads");
    };

    // Verify caller belongs to the agency
    if (not verifyAgencyAccess(caller, request.agency)) {
      Runtime.trap("Unauthorized: Cannot add leads for another agency");
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

    // Filter leads by caller's agency
    switch (getUserAgency(caller)) {
      case (?agency) {
        leads.values().toArray().filter<Lead>(
          func(lead : Lead) : Bool { lead.agency == agency }
        );
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func updateLeadStatus(leadId : Text, status : LeadStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update leads");
    };

    let lead = switch (leads.get(leadId)) {
      case (?lead) { lead };
      case (null) { Runtime.trap("Lead not found") };
    };

    // Verify caller belongs to the lead's agency
    if (not verifyAgencyAccess(caller, lead.agency)) {
      Runtime.trap("Unauthorized: Cannot update leads from another agency");
    };

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

  // Outreach Management
  public shared ({ caller }) func addOutreach(activity : OutreachActivity) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add outreach activities");
    };

    // Verify the lead belongs to caller's agency
    let lead = switch (leads.get(activity.leadId)) {
      case (?lead) { lead };
      case (null) { Runtime.trap("Lead not found") };
    };

    if (not verifyAgencyAccess(caller, lead.agency)) {
      Runtime.trap("Unauthorized: Cannot add outreach for leads from another agency");
    };

    outreachActivities.add(activity.leadId, activity);
  };

  public query ({ caller }) func getAllOutreachActivities() : async [OutreachActivity] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view outreach activities");
    };

    // Filter by caller's agency through leads
    switch (getUserAgency(caller)) {
      case (?agency) {
        outreachActivities.values().toArray().filter<OutreachActivity>(
          func(activity : OutreachActivity) : Bool {
            switch (leads.get(activity.leadId)) {
              case (?lead) { lead.agency == agency };
              case (null) { false };
            };
          }
        );
      };
      case (null) { [] };
    };
  };

  public query ({ caller }) func getUserDeals(agency : Text) : async [Deal] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view deals");
    };

    // Verify caller belongs to the requested agency
    if (not verifyAgencyAccess(caller, agency)) {
      Runtime.trap("Unauthorized: Cannot view deals from another agency");
    };

    deals.values().toArray().filter<Deal>(
      func(deal : Deal) : Bool { deal.agency == agency }
    );
  };

  // Deal Management
  public shared ({ caller }) func updateDealStatus(dealId : Text, status : DealStatus) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update deals");
    };

    let deal = switch (deals.get(dealId)) {
      case (?deal) { deal };
      case (null) { Runtime.trap("Deal not found") };
    };

    // Verify caller belongs to the deal's agency
    if (not verifyAgencyAccess(caller, deal.agency)) {
      Runtime.trap("Unauthorized: Cannot update deals from another agency");
    };

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

  // Project Management
  public shared ({ caller }) func addProject(project : Project) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add projects");
    };

    // Verify caller belongs to the project's agency
    if (not verifyAgencyAccess(caller, project.agency)) {
      Runtime.trap("Unauthorized: Cannot add projects for another agency");
    };

    projects.add(project.id, project);
  };

  // Service Management
  public shared ({ caller }) func addService(service : Service) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add services");
    };

    // Verify caller belongs to the service's agency
    if (not verifyAgencyAccess(caller, service.agency)) {
      Runtime.trap("Unauthorized: Cannot add services for another agency");
    };

    services.add(service.id, service);
  };

  public shared ({ caller }) func updateServiceStatus(serviceId : Text, active : Bool) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can update services");
    };

    let service = switch (services.get(serviceId)) {
      case (?service) { service };
      case (null) { Runtime.trap("Service not found") };
    };

    // Verify caller belongs to the service's agency
    if (not verifyAgencyAccess(caller, service.agency)) {
      Runtime.trap("Unauthorized: Cannot update services from another agency");
    };

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

  // Analytics
  public query ({ caller }) func getAgencyAnalytics(agency : Text) : async ([Lead], [Deal], [OutreachActivity], [Service], [Project]) {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view analytics");
    };

    // Verify caller belongs to the requested agency
    if (not verifyAgencyAccess(caller, agency)) {
      Runtime.trap("Unauthorized: Cannot view analytics from another agency");
    };

    let leadList = leads.values().toArray().filter(
      func(lead : Lead) : Bool { lead.agency == agency }
    );

    let dealList = deals.values().toArray().filter(
      func(deal : Deal) : Bool { deal.agency == agency }
    );

    let outreachList = outreachActivities.values().toArray().filter(
      func(activity : OutreachActivity) : Bool {
        switch (leads.get(activity.leadId)) {
          case (?lead) { lead.agency == agency };
          case (null) { false };
        };
      }
    );

    let serviceList = services.values().toArray().filter(
      func(service : Service) : Bool { service.agency == agency }
    );

    let projectList = projects.values().toArray().filter(
      func(project : Project) : Bool { project.agency == agency }
    );

    (leadList, dealList, outreachList, serviceList, projectList);
  };

  // Import Leads
  public shared ({ caller }) func importLeads(leadList : [Lead], agency : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can import leads");
    };

    // Verify caller belongs to the agency
    if (not verifyAgencyAccess(caller, agency)) {
      Runtime.trap("Unauthorized: Cannot import leads for another agency");
    };

    // Verify all leads belong to the same agency
    for (lead in leadList.vals()) {
      if (lead.agency != agency) {
        Runtime.trap("Unauthorized: All leads must belong to your agency");
      };
    };

    let leadsToAdd = List.fromArray<Lead>(leadList);
    leadsToAdd.forEach(func(lead) { leads.add(lead.id, lead) });
  };

  public query ({ caller }) func getAllServices() : async [Service] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view services");
    };

    // Filter services by caller's agency
    switch (getUserAgency(caller)) {
      case (?agency) {
        services.values().toArray().filter<Service>(
          func(service : Service) : Bool { service.agency == agency }
        );
      };
      case (null) { [] };
    };
  };

  public shared ({ caller }) func completeProject(projectId : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can complete projects");
    };

    let project = switch (projects.get(projectId)) {
      case (?project) { project };
      case (null) { Runtime.trap("Project not found") };
    };

    // Verify caller belongs to the project's agency
    if (not verifyAgencyAccess(caller, project.agency)) {
      Runtime.trap("Unauthorized: Cannot complete projects from another agency");
    };

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
};
