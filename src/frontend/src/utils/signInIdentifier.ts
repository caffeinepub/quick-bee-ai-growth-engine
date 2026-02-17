// Helper functions to store/retrieve/clear the entered sign-in identifier in sessionStorage

const SIGN_IN_IDENTIFIER_KEY = 'quickbee_signin_identifier';

export function setSignInIdentifier(identifier: string): void {
  sessionStorage.setItem(SIGN_IN_IDENTIFIER_KEY, identifier);
}

export function getSignInIdentifier(): string | null {
  return sessionStorage.getItem(SIGN_IN_IDENTIFIER_KEY);
}

export function clearSignInIdentifier(): void {
  sessionStorage.removeItem(SIGN_IN_IDENTIFIER_KEY);
}

// Normalize phone number by removing spaces, dashes, and parentheses
function normalizePhone(phone: string): string {
  return phone.replace(/[\s\-\(\)]/g, '');
}

// Simple heuristic to classify identifier as email vs phone
export function classifyIdentifier(identifier: string): 'email' | 'phone' | 'unknown' {
  if (!identifier || identifier.trim() === '') {
    return 'unknown';
  }

  const trimmed = identifier.trim();

  // Check if it looks like an email (contains @ and a dot after @)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(trimmed)) {
    return 'email';
  }

  // Check if it looks like a phone number (contains mostly digits, possibly with +, -, (), spaces)
  const phoneRegex = /^[\d\s\-\+\(\)]+$/;
  const digitCount = (trimmed.match(/\d/g) || []).length;
  if (phoneRegex.test(trimmed) && digitCount >= 7) {
    return 'phone';
  }

  return 'unknown';
}

export function prefillFromIdentifier(identifier: string | null): {
  email: string;
  mobileNumber: string;
} {
  if (!identifier) {
    return { email: '', mobileNumber: '' };
  }

  const type = classifyIdentifier(identifier);

  if (type === 'email') {
    return { email: identifier.trim(), mobileNumber: '' };
  } else if (type === 'phone') {
    return { email: '', mobileNumber: identifier.trim() };
  }

  return { email: '', mobileNumber: '' };
}

// Compare two identifiers (case-insensitive for email, normalized for phone)
export function identifiersMatch(id1: string, id2: string): boolean {
  if (!id1 || !id2) return false;

  const type1 = classifyIdentifier(id1);
  const type2 = classifyIdentifier(id2);

  if (type1 === 'email' && type2 === 'email') {
    return id1.trim().toLowerCase() === id2.trim().toLowerCase();
  }

  if (type1 === 'phone' && type2 === 'phone') {
    return normalizePhone(id1) === normalizePhone(id2);
  }

  return false;
}
