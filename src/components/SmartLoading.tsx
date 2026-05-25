"use client";

import React, { useEffect, useState } from "react";

interface SmartLoadingProps {
  isLoading: boolean;
  children: React.ReactNode;
  skeleton?: React.ReactNode;
  minDisplayTime?: number;
}

export default function SmartLoading({
  isLoading,
  children,
  skeleton,
  minDisplayTime = 500,
}: SmartLoadingProps) {
  const [showLoader, setShowLoader] = useState(false);
  const [canShowContent, setCanShowContent] = useState(false);

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true);
      setCanShowContent(false);
    } else {
      const timer = setTimeout(() => {
        setCanShowContent(true);
      }, minDisplayTime);
      return () => clearTimeout(timer);
    }
  }, [isLoading, minDisplayTime]);

  useEffect(() => {
    if (canShowContent) {
      const timer = setTimeout(() => {
        setShowLoader(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [canShowContent]);

  return (
    <>
      <style>{`
        .smart-loading-container {
          position: relative;
          min-height: 200px;
        }
        .smart-loading-content {
          opacity: ${showLoader ? 0 : 1};
          transition: opacity 0.3s ease;
        }
        .smart-loading-skeleton {
          position: absolute;
          inset: 0;
          display: ${showLoader ? 'flex' : 'none'};
          align-items: center;
          justify-content: center;
          background: linear-gradient(180deg, rgba(16,21,17,0.3) 0%, rgba(23,32,24,0.5) 100%);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border-radius: 8px;
          transition: opacity 0.3s ease;
        }
        .smart-loading-spinner {
          width: 40px;
          height: 40px;
          border: 2px solid rgba(196,164,90,0.2);
          border-top-color: rgba(196,164,90,0.8);
          border-radius: 50%;
          animation: smart-spin 0.8s linear infinite;
        }
        @keyframes smart-spin {
          to { transform: rotate(360deg); }
        }
        .smart-loading-dots {
          display: flex;
          gap: 8px;
        }
        .smart-loading-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: rgba(196,164,90,0.6);
          animation: smart-dot 1.4s ease-in-out infinite;
        }
        .smart-loading-dot:nth-child(1) { animation-delay: 0s; }
        .smart-loading-dot:nth-child(2) { animation-delay: 0.2s; }
        .smart-loading-dot:nth-child(3) { animation-delay: 0.4s; }
        @keyframes smart-dot {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }
      `}</style>
      <div className="smart-loading-container">
        <div className="smart-loading-content">
          {canShowContent && children}
        </div>
        <div className="smart-loading-skeleton">
          {skeleton || (
            <div className="smart-loading-dots">
              <span className="smart-loading-dot" />
              <span className="smart-loading-dot" />
              <span className="smart-loading-dot" />
            </div>
          )}
        </div>
      </div>
    </>
  );
}

// Pre-configured loading variants
export function PageLoader({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
  const pageSkeleton = (
    <div style={{ textAlign: 'center', padding: '60px 20px' }}>
      <div className="smart-loading-spinner" style={{ margin: '0 auto 20px' }} />
      <p style={{ 
        fontSize: '11px', 
        letterSpacing: '0.2em', 
        textTransform: 'uppercase', 
        color: 'rgba(196,164,90,0.6)',
        fontWeight: 500 
      }}>
        Loading Experience
      </p>
    </div>
  );

  return (
    <SmartLoading 
      isLoading={isLoading} 
      skeleton={pageSkeleton}
      minDisplayTime={800}
    >
      {children}
    </SmartLoading>
  );
}

export function CardLoader({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
  return (
    <SmartLoading 
      isLoading={isLoading}
      minDisplayTime={300}
    >
      {children}
    </SmartLoading>
  );
}
