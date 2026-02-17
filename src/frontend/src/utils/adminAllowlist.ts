// Admin allowlist utility for Quick Bee
// Contains the allowlisted admin identity details and functions to check matches

const ADMIN_EMAIL = 'quickbeeagency@gmail.com';
const ADMIN_MOBILE = '+919182768591';
const ADMIN_NAME = 'Aryan Abhishek';

export interface AdminAllowlistData {
  name: string;
  email: string;
  mobileNumber: string;
}

export const ADMIN_ALLOWLIST_DATA: AdminAllowlistData = {
  name: ADMIN_NAME,
  email: ADMIN_EMAIL,
  mobileNumber: ADMIN_MOBILE,
};

// Normalize phone number by removing spaces, dashes, and parentheses
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

// Check if the provided identifier matches the admin allowlist
export function isAdminAllowlisted(identifier: string): boolean {
  if (!identifier) return false;

  const trimmed = identifier.trim();

  // Check email (case-insensitive)
  if (trimmed.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
    return true;
  }

  // Check phone (normalized)
  const normalizedInput = normalizePhone(trimmed);
  const normalizedAdmin = normalizePhone(ADMIN_MOBILE);
  if (normalizedInput === normalizedAdmin) {
    return true;
  }

  return false;
}

// Get prefill data if identifier matches admin allowlist
export function getAdminPrefillData(identifier: string): AdminAllowlistData | null {
  if (isAdminAllowlisted(identifier)) {
    return ADMIN_ALLOWLIST_DATA;
  }
  return null;
}
