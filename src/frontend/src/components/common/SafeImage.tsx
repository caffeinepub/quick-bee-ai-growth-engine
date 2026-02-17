import { useState, ImgHTMLAttributes } from 'react';

interface SafeImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: React.ReactNode;
  fallbackClassName?: string;
}

/**
 * Image component with graceful error handling and fallback UI.
 * Prevents broken image icons and console spam from repeated load failures.
 */
export function SafeImage({ 
  src, 
  alt, 
  fallback, 
  fallbackClassName = '',
  className = '',
  ...props 
}: SafeImageProps) {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default fallback: styled placeholder with initials
    const initials = alt
      .split(' ')
      .map(word => word[0])
      .filter(Boolean)
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 ${fallbackClassName || className}`}
        title={alt}
      >
        <span className="text-primary/60 font-semibold text-lg">
          {initials || '?'}
        </span>
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div className={`animate-pulse bg-muted ${className}`} />
      )}
      <img
        src={src}
        alt={alt}
        className={`${className} ${isLoading ? 'hidden' : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        {...props}
      />
    </>
  );
}
