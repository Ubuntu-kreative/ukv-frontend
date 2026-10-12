"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

interface PageTransitionProps {
  children: React.ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const containerRef = useRef<HTMLDivElement>(null);
  const previousPathname = useRef(pathname);

  useEffect(() => {
    if (previousPathname.current === pathname) return
    previousPathname.current = pathname

    const container = containerRef.current
    if (!container) return

    container.style.transition = 'none'
    container.style.opacity = '0'
    container.style.transform = 'translateY(10px)'

    const frame = window.requestAnimationFrame(() => {
      container.style.transition = 'opacity 180ms ease-out, transform 180ms ease-out'
      container.style.opacity = '1'
      container.style.transform = 'translateY(0)'
    })

    return () => window.cancelAnimationFrame(frame)
  }, [pathname]);

  return (
    <div
      ref={containerRef}
      style={{
        opacity: '1',
        transform: 'translateY(0)',
        transition: 'opacity 180ms ease-out, transform 180ms ease-out',
      }}
    >
      {children}
    </div>
  );
}
