/**
 * Centralized mapping for uploaded static image assets.
 * Uses base-path aware URL generation for production compatibility.
 */

import { publicAssetUrl } from '../utils/assets/publicAssetUrl';

export const UPLOADED_IMAGES = {
  // App Branding
  qbLogo: publicAssetUrl('assets/uploaded/qb%20logo.png'),
  
  // Platform/Channel Icons (neon style)
  instagram: publicAssetUrl('assets/uploaded/f25340160.jpeg'),
  whatsapp: publicAssetUrl('assets/uploaded/f25339648.jpeg'),
  email: publicAssetUrl('assets/uploaded/f25481216.jpeg'),
  phone: publicAssetUrl('assets/uploaded/f25737984.jpeg'),
  
  // Service/Feature Illustrations
  aiAutomation: publicAssetUrl('assets/uploaded/AI%20automation.png'),
  digitalMarketing: publicAssetUrl('assets/uploaded/DM%20ICON.png'),
  deployment: publicAssetUrl('assets/uploaded/deployment%20icon.png'),
  
  // People/Team Illustrations
  strategy: publicAssetUrl('assets/uploaded/discover%20%26%20strategy.jpeg'),
  teamMember1: publicAssetUrl('assets/uploaded/f25737216.jpeg'),
  teamMember2: publicAssetUrl('assets/uploaded/f25741568.jpeg'),
  
  // Workspace/Dashboard Illustrations
  workspace1: publicAssetUrl('assets/uploaded/f5418752.jpeg'),
  workspace2: publicAssetUrl('assets/uploaded/f25726208.jpeg'),
  workspace3: publicAssetUrl('assets/uploaded/f25639680.jpeg'),
  workspace4: publicAssetUrl('assets/uploaded/f25731584.jpeg'),
} as const;

export type UploadedImageKey = keyof typeof UPLOADED_IMAGES;
