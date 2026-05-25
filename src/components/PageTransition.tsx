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
      `}</style>
      <div className={`page-transition-container ${isTransitioning ? 'visible' : ''}`}>
        {displayChildren}
      </div>
    </>
  );
}
