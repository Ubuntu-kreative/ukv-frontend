"use client";

import React, { useState } from "react";
import Image, { ImageProps } from "next/image";

interface OptimizedImageProps extends Omit<ImageProps, "blurDataURL"> {
  blurDataURL?: string;
  fallback?: string;
  showSkeleton?: boolean;
}

export default function OptimizedImage({
  src,
  alt,
  blurDataURL,
  fallback = "/images/placeholder.jpg",
  showSkeleton = true,
  className = "",
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Generate a subtle blur placeholder if none provided
  const generateBlurDataUrl = () => {
    if (blurDataURL) return blurDataURL;
    
    // Generate a simple blur placeholder data URL
    const canvas = document.createElement("canvas");
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#1a1a1a";
      ctx.fillRect(0, 0, 40, 40);
      // Add some noise
      for (let i = 0; i < 100; i++) {
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.1})`;
        ctx.fillRect(
          Math.random() * 40,
          Math.random() * 40,
          2,
          2
        );
      }
    }
    return canvas.toDataURL("image/jpeg", 0.1);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  return (
    <>
      <style>{`
        .optimized-image-container {
          position: relative;
          overflow: hidden;
        }
        .optimized-image-skeleton {
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, #1a1a1a 25%, #2a2a2a 50%, #1a1a1a 75%);
          background-size: 200% 100%;
          animation: skeleton-shimmer 1.5s infinite;
        }
        @keyframes skeleton-shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .optimized-image {
          transition: opacity 0.4s ease, filter 0.4s ease;
        }
        .optimized-image.loading {
          opacity: 0;
          filter: blur(10px);
        }
        .optimized-image.loaded {
          opacity: 1;
          filter: blur(0);
        }
      `}</style>
      <div className={`optimized-image-container ${className}`}>
        {showSkeleton && isLoading && (
          <div className="optimized-image-skeleton" aria-hidden="true" />
        )}
        <Image
          src={hasError ? fallback : src}
          alt={alt}
          placeholder="blur"
          blurDataURL={generateBlurDataUrl()}
          className={`optimized-image ${isLoading ? 'loading' : 'loaded'}`}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      </div>
    </>
  );
}

// Specialized variants for common use cases

export function HeroImage({ src, alt, className = "", ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`w-full h-full object-cover ${className}`}
      priority
      showSkeleton={false}
      {...props}
    />
  );
}

export function GalleryImage({ src, alt, className = "", ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`w-full h-full object-cover rounded-lg ${className}`}
      loading="lazy"
      {...props}
    />
  );
}

export function ThumbnailImage({ src, alt, className = "", ...props }: OptimizedImageProps) {
  return (
    <OptimizedImage
      src={src}
      alt={alt}
      className={`w-16 h-16 object-cover rounded-md ${className}`}
      loading="lazy"
      {...props}
    />
  );
}
