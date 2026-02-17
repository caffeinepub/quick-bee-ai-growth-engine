/**
 * Generate base-path aware URLs for static assets served from frontend/public.
 * Handles both local development and production deployments (including non-root base paths).
 */

/**
 * Get the runtime base URL for the application.
 * In production, this respects the base path where the app is deployed.
 */
function getBaseUrl(): string {
  // Use the base element if present (set by build tools like Vite)
  const base = document.querySelector('base');
  if (base?.href) {
    return base.href.replace(/\/$/, '');
  }
  
  // Fallback to origin for root deployments
  return window.location.origin;
}

/**
 * Build a full URL for a public asset, respecting the app's base path.
 * @param path - Relative path from public/ directory (e.g., 'assets/uploaded/image.png')
 * @returns Full URL that works in any deployment context
 */
export function publicAssetUrl(path: string): string {
  // Remove leading slash if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  const base = getBaseUrl();
  return `${base}/${cleanPath}`;
}
