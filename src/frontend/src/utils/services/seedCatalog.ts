import type { Service } from '../../backend';

export interface CatalogService {
  name: string;
  serviceType: string;
  price: number;
  deliveryTime: string;
}

export const SERVICE_CATALOG: CatalogService[] = [
  // Website & Funnel Services
  {
    name: 'Custom Business Website Development',
    serviceType: 'Website & Funnel Services',
    price: 150000,
    deliveryTime: '14-21 days',
  },
  {
    name: 'High-Converting Landing Page Design',
    serviceType: 'Website & Funnel Services',
    price: 50000,
    deliveryTime: '7-10 days',
  },
  {
    name: 'Sales Funnel Strategy & Build',
    serviceType: 'Website & Funnel Services',
    price: 100000,
    deliveryTime: '10-14 days',
  },
  {
    name: 'E-commerce Store Development',
    serviceType: 'Website & Funnel Services',
    price: 200000,
    deliveryTime: '21-30 days',
  },
  {
    name: 'Website Redesign & Optimization',
    serviceType: 'Website & Funnel Services',
    price: 80000,
    deliveryTime: '10-14 days',
  },
  {
    name: 'Conversion Rate Optimization (CRO)',
    serviceType: 'Website & Funnel Services',
    price: 60000,
    deliveryTime: '7-14 days',
  },
  {
    name: 'Speed Optimization & Technical Fixes',
    serviceType: 'Website & Funnel Services',
    price: 40000,
    deliveryTime: '5-7 days',
  },
  {
    name: 'Website Maintenance & Support',
    serviceType: 'Website & Funnel Services',
    price: 25000,
    deliveryTime: 'Monthly',
  },

  // AI & Automation Services
  {
    name: 'WhatsApp Automation & Lead Response System',
    serviceType: 'AI & Automation Services',
    price: 75000,
    deliveryTime: '7-10 days',
  },
  {
    name: 'AI Chatbot Development (Website + WhatsApp)',
    serviceType: 'AI & Automation Services',
    price: 100000,
    deliveryTime: '10-14 days',
  },
  {
    name: 'CRM Setup & Workflow Automation',
    serviceType: 'AI & Automation Services',
    price: 90000,
    deliveryTime: '10-14 days',
  },
  {
    name: 'AI Lead Qualification System',
    serviceType: 'AI & Automation Services',
    price: 80000,
    deliveryTime: '7-10 days',
  },
  {
    name: 'Automated Follow-up Sequences (Email/SMS/WhatsApp)',
    serviceType: 'AI & Automation Services',
    price: 70000,
    deliveryTime: '7-10 days',
  },
  {
    name: 'AI Personalized Outreach System',
    serviceType: 'AI & Automation Services',
    price: 85000,
    deliveryTime: '10-14 days',
  },
  {
    name: 'Appointment Booking Automation',
    serviceType: 'AI & Automation Services',
    price: 50000,
    deliveryTime: '5-7 days',
  },
  {
    name: 'No-Code Internal Business Automation',
    serviceType: 'AI & Automation Services',
    price: 60000,
    deliveryTime: '7-10 days',
  },

  // Marketing & Growth Systems
  {
    name: 'SEO Setup & Local SEO Optimization',
    serviceType: 'Marketing & Growth Systems',
    price: 70000,
    deliveryTime: '14-21 days',
  },
  {
    name: 'Google Business Profile Optimization',
    serviceType: 'Marketing & Growth Systems',
    price: 30000,
    deliveryTime: '3-5 days',
  },
  {
    name: 'LinkedIn Lead Generation System',
    serviceType: 'Marketing & Growth Systems',
    price: 80000,
    deliveryTime: '10-14 days',
  },
  {
    name: 'Instagram Growth & Automation System',
    serviceType: 'Marketing & Growth Systems',
    price: 65000,
    deliveryTime: '7-10 days',
  },
  {
    name: 'Cold Email Lead Generation System',
    serviceType: 'Marketing & Growth Systems',
    price: 75000,
    deliveryTime: '7-10 days',
  },
  {
    name: 'Paid Ads Funnel Setup (Meta + Google)',
    serviceType: 'Marketing & Growth Systems',
    price: 90000,
    deliveryTime: '10-14 days',
  },
  {
    name: 'Retargeting Funnel Setup',
    serviceType: 'Marketing & Growth Systems',
    price: 55000,
    deliveryTime: '7-10 days',
  },
  {
    name: 'Review & Reputation Management System',
    serviceType: 'Marketing & Growth Systems',
    price: 45000,
    deliveryTime: '5-7 days',
  },

  // High-Ticket Business Solutions
  {
    name: 'Complete AI Growth Engine Setup (All-in-One Package)',
    serviceType: 'High-Ticket Business Solutions',
    price: 500000,
    deliveryTime: '30-45 days',
  },
  {
    name: 'SaaS Development for Agencies',
    serviceType: 'High-Ticket Business Solutions',
    price: 750000,
    deliveryTime: '45-60 days',
  },
  {
    name: 'Multi-Channel Outreach System (3000-touch plan)',
    serviceType: 'High-Ticket Business Solutions',
    price: 300000,
    deliveryTime: '21-30 days',
  },
  {
    name: 'Revenue Dashboard & Funnel Analytics Setup',
    serviceType: 'High-Ticket Business Solutions',
    price: 150000,
    deliveryTime: '14-21 days',
  },
  {
    name: 'Proposal Generator & Sales Automation System',
    serviceType: 'High-Ticket Business Solutions',
    price: 120000,
    deliveryTime: '10-14 days',
  },
  {
    name: 'Full Business Digitization & Automation Package',
    serviceType: 'High-Ticket Business Solutions',
    price: 600000,
    deliveryTime: '45-60 days',
  },

  // Bonus High-Value Add-ons (Optional Upsells)
  {
    name: 'International Payment Gateway Setup (Stripe, PayPal)',
    serviceType: 'Bonus High-Value Add-ons (Optional Upsells)',
    price: 40000,
    deliveryTime: '5-7 days',
  },
  {
    name: 'Indian Payment Gateway Integration (Razorpay, UPI)',
    serviceType: 'Bonus High-Value Add-ons (Optional Upsells)',
    price: 35000,
    deliveryTime: '5-7 days',
  },
  {
    name: 'White-label CRM for Agencies',
    serviceType: 'Bonus High-Value Add-ons (Optional Upsells)',
    price: 250000,
    deliveryTime: '21-30 days',
  },
  {
    name: 'Subscription SaaS Monetization Setup',
    serviceType: 'Bonus High-Value Add-ons (Optional Upsells)',
    price: 180000,
    deliveryTime: '14-21 days',
  },
  {
    name: 'Client Portal Development',
    serviceType: 'Bonus High-Value Add-ons (Optional Upsells)',
    price: 120000,
    deliveryTime: '14-21 days',
  },
  {
    name: 'Funnel Audit & Strategy Consultation',
    serviceType: 'Bonus High-Value Add-ons (Optional Upsells)',
    price: 50000,
    deliveryTime: '3-5 days',
  },
];

export function createServiceFromCatalog(catalogService: CatalogService, agency: string): Service {
  return {
    id: `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    agency,
    name: catalogService.name,
    price: BigInt(catalogService.price),
    deliveryTime: catalogService.deliveryTime,
    active: true,
    revenue: BigInt(0),
    salesCount: BigInt(0),
    serviceType: catalogService.serviceType,
    serviceSubType: 'default',
    cost: BigInt(0),
    niche: 'default',
    date: '',
    time: '',
  };
}

export function generateCatalogServices(agency: string): Service[] {
  return SERVICE_CATALOG.map(catalogService => createServiceFromCatalog(catalogService, agency));
}
