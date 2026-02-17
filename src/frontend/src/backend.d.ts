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
export interface Service {
    id: string;
    serviceType: string;
    active: boolean;
    revenue: bigint;
    cost: bigint;
    date: string;
    name: string;
    time: string;
    agency: string;
    deliveryTime: string;
    shortDescription: string;
    serviceSubType: string;
    niche: string;
    deliverables: Array<string>;
    salesCount: bigint;
    detailedDescription: string;
    price: bigint;
    requirements: Array<string>;
    supportedProviders: Array<string>;
}
export interface Payment {
    id: string;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    userId: Principal;
    createdAt: bigint;
    updatedAt: bigint;
    serviceId: string;
    amount: bigint;
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
export interface Settings {
    defaultSort: string;
    pricingType: string;
    defaultValues: string;
    onboardingCompleted: boolean;
    tutorialStage: bigint;
    timeZone: string;
}
export interface PaymentSettings {
    upiDetails: string;
    razorpayLink: string;
    stripeLink: string;
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
export enum PaymentMethod {
    upi = "upi",
    stripe = "stripe",
    razorpay = "razorpay"
}
export enum PaymentStatus {
    cancelled = "cancelled",
    pending = "pending",
    paid = "paid",
    failed = "failed"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createClientServiceRequest(request: ClientServiceRequest): Promise<void>;
    createLead(lead: Lead): Promise<void>;
    createPayment(serviceId: string, amount: bigint, paymentMethod: PaymentMethod): Promise<string>;
    createProject(project: Project): Promise<void>;
    createService(service: Service): Promise<void>;
    deleteLead(leadId: string): Promise<void>;
    deleteService(serviceId: string): Promise<void>;
    getAllPayments(): Promise<Array<Payment>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getClientServiceRequests(): Promise<Array<ClientServiceRequest>>;
    getLeadsPaginated(offset: bigint, limit: bigint): Promise<Array<Lead>>;
    getPayment(paymentId: string): Promise<Payment | null>;
    getPaymentSettings(): Promise<PaymentSettings>;
    getProjects(): Promise<Array<Project>>;
    getService(serviceId: string): Promise<Service | null>;
    getServices(): Promise<Array<Service>>;
    getSettings(): Promise<Settings>;
    getUserPayments(): Promise<Array<Payment>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateLead(leadId: string, lead: Lead): Promise<void>;
    updatePaymentSettings(newSettings: PaymentSettings): Promise<void>;
    updatePaymentStatus(paymentId: string, newStatus: PaymentStatus): Promise<void>;
    updateProject(projectId: string, project: Project): Promise<void>;
    updateService(serviceId: string, service: Service): Promise<void>;
    updateSettings(newSettings: Settings): Promise<void>;
}
