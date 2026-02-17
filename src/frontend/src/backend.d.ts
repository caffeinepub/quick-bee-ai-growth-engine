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
export interface Lead {
    id: string;
    status: string;
    contact: string;
    owner: string;
    city: string;
    name: string;
    createdAt: bigint;
    revenuePotential: bigint;
    agency: string;
    niche: string;
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
export interface Deal {
    id: string;
    status: string;
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
    role: string;
    subscriptionPlan: string;
    agency: string;
    mobileNumber?: string;
    email: string;
    totalRevenue: bigint;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addLead(request: {
        id: string;
        status: string;
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
    getDealsForExport(): Promise<Array<Deal>>;
    getLeadsForExport(): Promise<Array<Lead>>;
    getOutreachActivitiesForExport(): Promise<Array<OutreachActivity>>;
    getProjectsForExport(): Promise<Array<Project>>;
    getServicesForExport(): Promise<Array<Service>>;
    getUserDeals(_agency: string): Promise<Array<Deal>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    importLeads(leadList: Array<Lead>, _agency: string): Promise<void>;
    isCallerAdmin(): Promise<boolean>;
    registerUser(principal: string, name: string, email: string, mobileNumber: string | null, agency: string, role: string, revenueGoal: bigint, subscriptionPlan: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateDealStatus(dealId: string, status: string): Promise<void>;
    updateLeadStatus(leadId: string, status: string): Promise<void>;
    updateServiceStatus(serviceId: string, active: boolean): Promise<void>;
}
