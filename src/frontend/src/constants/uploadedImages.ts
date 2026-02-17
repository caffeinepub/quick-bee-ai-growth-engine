/**
 * Centralized mapping for uploaded static image assets.
 * Handles URL encoding for filenames with spaces and special characters.
 */

export const UPLOADED_IMAGES = {
  // Platform/Channel Icons (neon style)
  instagram: '/assets/uploaded/f25340160.jpeg',
  whatsapp: '/assets/uploaded/f25339648.jpeg',
  email: '/assets/uploaded/f25481216.jpeg',
  phone: '/assets/uploaded/f25737984.jpeg',
  
  // Service/Feature Illustrations
  aiAutomation: '/assets/uploaded/AI%20automation.png',
  digitalMarketing: '/assets/uploaded/DM%20ICON.png',
  deployment: '/assets/uploaded/deployment%20icon.png',
  
  // People/Team Illustrations
  strategy: '/assets/uploaded/discover%20%26%20strategy.jpeg',
  teamMember1: '/assets/uploaded/f25737216.jpeg',
  teamMember2: '/assets/uploaded/f25741568.jpeg',
  
  // Workspace/Dashboard Illustrations
  workspace1: '/assets/uploaded/f5418752.jpeg',
  workspace2: '/assets/uploaded/f25726208.jpeg',
  workspace3: '/assets/uploaded/f25639680.jpeg',
  workspace4: '/assets/uploaded/f25731584.jpeg',
} as const;

export type UploadedImageKey = keyof typeof UPLOADED_IMAGES;
