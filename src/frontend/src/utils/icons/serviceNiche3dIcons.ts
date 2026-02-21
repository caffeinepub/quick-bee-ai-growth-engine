/**
 * Centralized mapping utilities for 3D service and niche icons.
 * Maps service types/subtypes and niche values to static 3D icon assets.
 */

import { publicAssetUrl } from '../assets/publicAssetUrl';

// Default fallback icon
const DEFAULT_SERVICE_ICON = publicAssetUrl('assets/generated/svc-3d-default.dim_256x256.png');

// Service icon mapping based on serviceType and serviceSubType
const SERVICE_ICON_MAP: Record<string, string> = {
  // Primary service types
  'website': publicAssetUrl('assets/generated/svc-3d-website.dim_256x256.png'),
  'whatsapp-automation': publicAssetUrl('assets/generated/svc-3d-whatsapp-automation.dim_256x256.png'),
  'lead-machine': publicAssetUrl('assets/generated/svc-3d-lead-machine.dim_256x256.png'),
  'personal-brand': publicAssetUrl('assets/generated/svc-3d-personal-brand.dim_256x256.png'),
  'ai-automation': publicAssetUrl('assets/generated/svc-3d-ai-automation.dim_256x256.png'),
  'ai-growth': publicAssetUrl('assets/generated/svc-3d-ai-growth.dim_256x256.png'),
  'maintenance': publicAssetUrl('assets/generated/svc-3d-maintenance.dim_256x256.png'),
  
  // Pricing page category keys
  'website-packages': publicAssetUrl('assets/generated/svc-3d-website-packages.dim_256x256.png'),
  'whatsapp-automation-packages': publicAssetUrl('assets/generated/svc-3d-whatsapp-automation-packages.dim_256x256.png'),
  'lead-generation-systems': publicAssetUrl('assets/generated/svc-3d-lead-generation-systems.dim_256x256.png'),
  'personal-brand-services': publicAssetUrl('assets/generated/svc-3d-personal-brand-services.dim_256x256.png'),
  'seo-services': publicAssetUrl('assets/generated/svc-3d-seo-services.dim_256x256.png'),
  'business-systems': publicAssetUrl('assets/generated/svc-3d-business-systems.dim_256x256.png'),
  'outreach-systems': publicAssetUrl('assets/generated/svc-3d-outreach-systems.dim_256x256.png'),
  'ecommerce': publicAssetUrl('assets/generated/svc-3d-ecommerce.dim_256x256.png'),
  'student-packages': publicAssetUrl('assets/generated/svc-3d-student-packages.dim_256x256.png'),
  'all-in-one-growth-kit': publicAssetUrl('assets/generated/svc-3d-all-in-one-growth-kit.dim_256x256.png'),
  'maintenance-plans': publicAssetUrl('assets/generated/svc-3d-maintenance-plans.dim_256x256.png'),
};

// Niche icon mapping
const NICHE_ICON_MAP: Record<string, string> = {
  'ecommerce': publicAssetUrl('assets/generated/niche-3d-ecommerce.dim_256x256.png'),
  'saas': publicAssetUrl('assets/generated/niche-3d-saas.dim_256x256.png'),
  'healthcare': publicAssetUrl('assets/generated/niche-3d-healthcare.dim_256x256.png'),
  'real-estate': publicAssetUrl('assets/generated/niche-3d-real-estate.dim_256x256.png'),
  'restaurant': publicAssetUrl('assets/generated/niche-3d-restaurant.dim_256x256.png'),
  'fitness': publicAssetUrl('assets/generated/niche-3d-fitness.dim_256x256.png'),
  'education': publicAssetUrl('assets/generated/niche-3d-education.dim_256x256.png'),
};

const DEFAULT_NICHE_ICON = publicAssetUrl('assets/generated/niche-3d-default.dim_256x256.png');

/**
 * Get the 3D icon URL for a service based on its type and subtype.
 * Returns default icon if no specific mapping exists.
 */
export function getServiceIcon(service: { serviceType?: string; serviceSubType?: string }): string {
  if (!service.serviceType) {
    return DEFAULT_SERVICE_ICON;
  }

  const normalizedType = service.serviceType.toLowerCase().trim();
  
  // Try exact match first
  if (SERVICE_ICON_MAP[normalizedType]) {
    return SERVICE_ICON_MAP[normalizedType];
  }
  
  // Try subtype if available
  if (service.serviceSubType) {
    const normalizedSubType = service.serviceSubType.toLowerCase().trim();
    if (SERVICE_ICON_MAP[normalizedSubType]) {
      return SERVICE_ICON_MAP[normalizedSubType];
    }
  }
  
  // Return default icon
  return DEFAULT_SERVICE_ICON;
}

/**
 * Get the 3D icon URL for a niche.
 * Returns default niche icon if no specific mapping exists.
 */
export function getNicheIcon(niche: string): string {
  if (!niche) {
    return DEFAULT_NICHE_ICON;
  }

  const normalizedNiche = niche.toLowerCase().trim();
  
  if (NICHE_ICON_MAP[normalizedNiche]) {
    return NICHE_ICON_MAP[normalizedNiche];
  }
  
  return DEFAULT_NICHE_ICON;
}

/**
 * Get the default service icon URL.
 */
export function getDefaultServiceIcon(): string {
  return DEFAULT_SERVICE_ICON;
}

/**
 * Get the default niche icon URL.
 */
export function getDefaultNicheIcon(): string {
  return DEFAULT_NICHE_ICON;
}
