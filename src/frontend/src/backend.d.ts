import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export interface ClientServiceRequest {
    id: string;
    principal: string;
    createdAt: bigint;
    agency: string;
    details?: string;
    serviceId: string;
}
export interface OutreachActivity {
    createdAt: bigint;
    sent: boolean;
    platform: string;
    leadId: string;
    message: string;
    replied: boolean;
    followUpDate: bigint;
}
export interface Service {
    id: string;
    active: boolean;
    revenue: bigint;
    name: string;
    agency: string;
    deliveryTime: string;
    salesCount: bigint;
    price: bigint;
}
export interface Lead {
    id: string;
    status: LeadStatus;
    contact: string;
    owner: string;
    city: string;
    name: string;
    createdAt: bigint;
    revenuePotential: bigint;
    agency: string;
    niche: string;
}
export interface Deal {
    id: string;
    status: DealStatus;
    closeDate?: bigint;
    value: bigint;
    createdAt: bigint;
    agency: string;
    leadId: string;
}
export interface Project {
    id: string;
    files: Array<ExternalBlob>;
    completion: bigint;
    status: string;
    clientId: string;
    agency: string;
    notes: string;
    serviceId: string;
    startDate: bigint;
    milestones: Array<string>;
}
export interface UserProfile {
    revenueGoal: bigint;
    principal: string;
    name: string;
    role: UserRole;
    subscriptionPlan: string;
    agency: string;
    mobileNumber?: string;
    email: string;
    totalRevenue: bigint;
}
export enum DealStatus {
    won = "won",
    lost = "lost",
    open = "open",
    proposalSent = "proposalSent"
}
export enum LeadStatus {
    won = "won",
    cold = "cold",
    lost = "lost",
    proposalSent = "proposalSent",
    contacted = "contacted",
    interested = "interested",
    qualified = "qualified"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLead(request: {
        id: string;
        status: LeadStatus;
        contact: string;
        owner: string;
        city: string;
        name: string;
        revenuePotential: bigint;
        agency: string;
        niche: string;
    }): Promise<void>;
    addOutreach(activity: OutreachActivity): Promise<void>;
    addProject(project: Project): Promise<void>;
    addService(service: Service): Promise<void>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeProject(projectId: string): Promise<void>;
    createClientServiceRequest(serviceId: string, agency: string, details: string | null): Promise<void>;
    getAgencyAnalytics(agency: string): Promise<[Array<Lead>, Array<Deal>, Array<OutreachActivity>, Array<Service>, Array<Project>]>;
    getAllClientServiceRequests(): Promise<Array<ClientServiceRequest>>;
    getAllLeads(): Promise<Array<Lead>>;
    getAllOutreachActivities(): Promise<Array<OutreachActivity>>;
    getAllServices(): Promise<Array<Service>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientServiceRequest(requestId: string): Promise<ClientServiceRequest | null>;
    getClientServiceRequestsByAgency(agency: string): Promise<Array<ClientServiceRequest>>;
    getUserDeals(agency: string): Promise<Array<Deal>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    importLeads(leadList: Array<Lead>, agency: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(principal: string, name: string, email: string, mobileNumber: string | null, agency: string, role: UserRole, revenueGoal: bigint, subscriptionPlan: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDealStatus(dealId: string, status: DealStatus): Promise<void>;
    updateLeadStatus(leadId: string, status: LeadStatus): Promise<void>;
    updateServiceStatus(serviceId: string, active: boolean): Promise<void>;
}
