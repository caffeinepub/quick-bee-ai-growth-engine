/**
 * Reusable component for rendering 3D service and niche icons with graceful fallback.
 */

import { SafeImage } from './SafeImage';
import { getServiceIcon, getNicheIcon, getDefaultServiceIcon } from '../../utils/icons/serviceNiche3dIcons';
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
  let iconUrl = '';
  
  if (variant === 'service' && service) {
    iconUrl = getServiceIcon(service);
  } else if (variant === 'niche' && niche) {
    iconUrl = getNicheIcon(niche);
  }
  
  // Always use default icon if no specific icon found
  if (!iconUrl) {
    iconUrl = getDefaultServiceIcon();
  }

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
