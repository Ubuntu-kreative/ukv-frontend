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
          opacity: ${isTransitioning ? 1 : 0};
          transform: translateY(${isTransitioning ? 0 : 20}px});
          transition: opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1), transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
      <div className="page-transition-container">
        {displayChildren}
      </div>
    </>
  );
}
