/**
 * Centralized mapping utilities for 3D service and niche icons.
 * Maps service types/subtypes and niche values to static 3D icon assets.
 */

import { publicAssetUrl } from '../assets/publicAssetUrl';

// Service icon mapping based on serviceType and serviceSubType
const SERVICE_ICON_MAP: Record<string, string> = {
  // Primary service types
  'website': publicAssetUrl('assets/generated/svc-3d-website.dim_256x256.png'),
  'whatsapp-automation': publicAssetUrl('assets/generated/svc-3d-whatsapp-automation.dim_256x256.png'),
  'lead-machine': publicAssetUrl('assets/generated/svc-3d-lead-machine.dim_256x256.png'),
  'personal-brand': publicAssetUrl('assets/generated/svc-3d-personal-brand.dim_256x256.png'),
  'ai-growth': publicAssetUrl('assets/generated/svc-3d-ai-growth.dim_256x256.png'),
  'maintenance': publicAssetUrl('assets/generated/svc-3d-maintenance.dim_256x256.png'),
  
  // Alternative keys for matching
  'web': publicAssetUrl('assets/generated/svc-3d-website.dim_256x256.png'),
  'whatsapp': publicAssetUrl('assets/generated/svc-3d-whatsapp-automation.dim_256x256.png'),
  'lead': publicAssetUrl('assets/generated/svc-3d-lead-machine.dim_256x256.png'),
  'brand': publicAssetUrl('assets/generated/svc-3d-personal-brand.dim_256x256.png'),
  'ai': publicAssetUrl('assets/generated/svc-3d-ai-growth.dim_256x256.png'),
  'monthly': publicAssetUrl('assets/generated/svc-3d-maintenance.dim_256x256.png'),
};

// Niche icon mapping
const NICHE_ICON_MAP: Record<string, string> = {
  'ecommerce': publicAssetUrl('assets/generated/niche-3d-ecommerce.dim_256x256.png'),
  'e-commerce': publicAssetUrl('assets/generated/niche-3d-ecommerce.dim_256x256.png'),
  'real-estate': publicAssetUrl('assets/generated/niche-3d-real-estate.dim_256x256.png'),
  'realestate': publicAssetUrl('assets/generated/niche-3d-real-estate.dim_256x256.png'),
  'education': publicAssetUrl('assets/generated/niche-3d-education.dim_256x256.png'),
  'healthcare': publicAssetUrl('assets/generated/niche-3d-healthcare.dim_256x256.png'),
  'restaurant': publicAssetUrl('assets/generated/niche-3d-restaurant.dim_256x256.png'),
  'food': publicAssetUrl('assets/generated/niche-3d-restaurant.dim_256x256.png'),
  'fitness': publicAssetUrl('assets/generated/niche-3d-fitness.dim_256x256.png'),
  'gym': publicAssetUrl('assets/generated/niche-3d-fitness.dim_256x256.png'),
  'saas': publicAssetUrl('assets/generated/niche-3d-saas.dim_256x256.png'),
  'software': publicAssetUrl('assets/generated/niche-3d-saas.dim_256x256.png'),
  'local-business': publicAssetUrl('assets/generated/niche-3d-local-business.dim_256x256.png'),
  'local': publicAssetUrl('assets/generated/niche-3d-local-business.dim_256x256.png'),
};

// Default fallback icons
const DEFAULT_SERVICE_ICON = publicAssetUrl('assets/generated/svc-3d-default.dim_256x256.png');
const DEFAULT_NICHE_ICON = publicAssetUrl('assets/generated/niche-3d-default.dim_256x256.png');

/**
 * Normalize a string for matching (lowercase, remove spaces/hyphens)
 */
function normalizeKey(key: string): string {
  return key.toLowerCase().replace(/[\s_]/g, '-');
}

/**
 * Get the 3D icon URL for a service based on its type, subtype, or name
 */
export function getServiceIcon(service: {
  serviceType?: string;
  serviceSubType?: string;
  name?: string;
}): string {
  // Try serviceType first
  if (service.serviceType && service.serviceType !== 'default') {
    const normalized = normalizeKey(service.serviceType);
    if (SERVICE_ICON_MAP[normalized]) {
      return SERVICE_ICON_MAP[normalized];
    }
  }

  // Try serviceSubType
  if (service.serviceSubType && service.serviceSubType !== 'default') {
    const normalized = normalizeKey(service.serviceSubType);
    if (SERVICE_ICON_MAP[normalized]) {
      return SERVICE_ICON_MAP[normalized];
    }
  }

  // Try matching keywords in name
  if (service.name) {
    const nameLower = service.name.toLowerCase();
    for (const [key, iconUrl] of Object.entries(SERVICE_ICON_MAP)) {
      if (nameLower.includes(key)) {
        return iconUrl;
      }
    }
  }

  return DEFAULT_SERVICE_ICON;
}

/**
 * Get the 3D icon URL for a niche
 */
export function getNicheIcon(niche: string): string {
  if (!niche || niche === 'default') {
    return DEFAULT_NICHE_ICON;
  }

  const normalized = normalizeKey(niche);
  return NICHE_ICON_MAP[normalized] || DEFAULT_NICHE_ICON;
}

/**
 * Get icon for a pricing tier/category by ID or name
 */
export function getPricingCategoryIcon(categoryId: string): string {
  const normalized = normalizeKey(categoryId);
  return SERVICE_ICON_MAP[normalized] || DEFAULT_SERVICE_ICON;
}
