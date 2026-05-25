"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Trigger animation when pathname changes
    if (containerRef.current) {
      containerRef.current.style.opacity = '0';
      containerRef.current.style.transform = 'translateY(10px)';
      
      // Force reflow
      void containerRef.current.offsetWidth;
      
      // Animate in
      containerRef.current.style.transition = 'opacity 0.4s ease-out, transform 0.4s ease-out';
      containerRef.current.style.opacity = '1';
      containerRef.current.style.transform = 'translateY(0)';
    }
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      style={{
        opacity: '1',
        transform: 'translateY(0)',
        transition: 'opacity 0.4s ease-out, transform 0.4s ease-out',
      }}
    >
      {children}
    </div>
  );
}
