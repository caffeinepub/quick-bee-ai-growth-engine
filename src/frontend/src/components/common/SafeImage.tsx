import { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  className?: string;
}

export function SafeImage({ src, alt, fallback, className = '', ...props }: SafeImageProps) {
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
    const initials = fallback || alt.substring(0, 2).toUpperCase();
    return (
      <div
        className={`flex items-center justify-center bg-muted text-muted-foreground font-semibold ${className}`}
        style={props.style}
        title={alt}
      >
        {initials}
      </div>
    );
  }

  return (
    <>
      {isLoading && (
        <div
          className={`animate-pulse bg-muted ${className}`}
          style={props.style}
        />
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
