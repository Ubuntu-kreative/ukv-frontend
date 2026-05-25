"use client";

import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular" | "rounded";
  width?: string | number;
  height?: string | number;
  animation?: "pulse" | "wave" | "none";
}

export default function LoadingSkeleton({
  className = "",
  variant = "rectangular",
  width,
  height,
  animation = "pulse",
}: SkeletonProps) {
  const baseClasses = "bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800";
  
  const variantClasses: Record<string, string> = {
    text: "h-4 rounded",
    circular: "rounded-full",
    rectangular: "rounded-sm",
    rounded: "rounded-lg",
  };

  const animationClasses: Record<string, string> = {
    pulse: "animate-pulse",
    wave: "animate-shimmer",
    none: "",
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === "number" ? `${width}px` : width;
  if (height) style.height = typeof height === "number" ? `${height}px` : height;

  return (
    <>
      <style>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
          background-size: 200% 100%;
        }
      `}</style>
      <div
        className={`${baseClasses} ${variantClasses[variant]} ${animationClasses[animation]} ${className}`}
        style={style}
        aria-hidden="true"
      />
    </>
  );
}

// Pre-configured skeleton components for common use cases

export function CardSkeleton() {
  return (
    <div className="p-4 border border-gray-800 rounded-lg space-y-3">
      <LoadingSkeleton variant="rectangular" height={160} className="w-full" />
      <LoadingSkeleton variant="text" width="70%" />
      <LoadingSkeleton variant="text" width="40%" />
    </div>
  );
}

export function TextSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <LoadingSkeleton
          key={i}
          variant="text"
          width={i === 0 ? "80%" : i === lines - 1 ? "60%" : "100%"}
        />
      ))}
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="space-y-4">
      <LoadingSkeleton variant="rectangular" height={400} className="w-full rounded-lg" />
      <div className="space-y-2 pt-4">
        <LoadingSkeleton variant="text" width="60%" height={32} />
        <LoadingSkeleton variant="text" width="40%" />
        <LoadingSkeleton variant="rectangular" width={120} height={40} className="mt-4" />
      </div>
    </div>
  );
}

export function ListSkeleton({ items = 5 }: { items?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, i) => (
        <div key={i} className="flex items-center gap-3 p-3">
          <LoadingSkeleton variant="circular" width={48} height={48} />
          <div className="flex-1 space-y-2">
            <LoadingSkeleton variant="text" width="70%" />
            <LoadingSkeleton variant="text" width="40%" />
          </div>
        </div>
      ))}
    </div>
  );
}

export function ImageGridSkeleton({ cols = 3 }: { cols?: number }) {
  return (
    <div className={`grid grid-cols-${cols} gap-4`}>
      {Array.from({ length: cols * 2 }).map((_, i) => (
        <LoadingSkeleton key={i} variant="rectangular" height={200} className="w-full rounded" />
      ))}
    </div>
  );
}
