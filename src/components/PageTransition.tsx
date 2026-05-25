"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [displayChildren, setDisplayChildren] = useState(children);

  useEffect(() => {
    setDisplayChildren(children);
    setIsTransitioning(true);

    const timeout = setTimeout(() => {
      setIsTransitioning(false);
    }, 50);

    return () => clearTimeout(timeout);
  }, [pathname, children]);

  return (
    <>
      <style>{`
        .page-transition-container {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .page-transition-container.visible {
          opacity: 1;
          transform: translateY(0);
        }
        .page-transition-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(180deg, rgba(16,21,17,0.95) 0%, rgba(23,32,24,0.98) 100%);
          z-index: 9999;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.4s ease;
        }
        .page-transition-overlay.active {
          opacity: 1;
          pointer-events: auto;
        }
        .page-transition-shimmer {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(196,164,90,0.6), transparent);
          animation: page-shimmer 1.5s ease-in-out infinite;
        }
        @keyframes page-shimmer {
          0% { left: -30%; }
          100% { left: 130%; }
        }
      `}</style>
      <div className={`page-transition-container ${isTransitioning ? 'visible' : ''}`}>
        {displayChildren}
      </div>
      <div className="page-transition-overlay">
        <div className="page-transition-shimmer" />
      </div>
    </>
  );
}
