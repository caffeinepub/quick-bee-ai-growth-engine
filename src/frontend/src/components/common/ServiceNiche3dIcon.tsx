/**
 * Reusable component for rendering 3D service and niche icons with graceful fallback.
 */

import { SafeImage } from './SafeImage';
import { getServiceIcon, getNicheIcon } from '../../utils/icons/serviceNiche3dIcons';
import type { Service } from '../../backend';

interface ServiceNiche3dIconProps {
  variant: 'service' | 'niche';
  service?: Service | { serviceType?: string; serviceSubType?: string; name?: string };
  niche?: string;
  size?: number;
  className?: string;
}

export function ServiceNiche3dIcon({
  variant,
  service,
  niche,
  size = 48,
  className = '',
}: ServiceNiche3dIconProps) {
  const iconUrl = variant === 'service' && service
    ? getServiceIcon(service)
    : variant === 'niche' && niche
    ? getNicheIcon(niche)
    : '';

  if (!iconUrl) return null;

  // Generate initials for fallback
  const fallbackText = variant === 'service' && service
    ? (service.name || 'SVC').substring(0, 2).toUpperCase()
    : variant === 'niche' && niche
    ? niche.substring(0, 2).toUpperCase()
    : '3D';

  return (
    <SafeImage
      src={iconUrl}
      alt={variant === 'service' ? 'Service icon' : 'Niche icon'}
      fallback={fallbackText}
      className={className}
      style={{ width: size, height: size }}
    />
  );
}
