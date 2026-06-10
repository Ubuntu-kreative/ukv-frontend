// /src/components/ScrollReveal.jsx
"use client";
import React, { useEffect, useRef } from "react";

export default function ScrollReveal({ 
  children, 
  direction = "up", // options: "up", "left", "right"
  className = "" 
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Assign correct base class depending on direction
    if (direction === "left") {
      el.classList.add("reveal-left");
    } else if (direction === "right") {
      el.classList.add("reveal-right");
    } else {
      el.classList.add("reveal");
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          el.classList.add("visible");
        }
      });
    }, { threshold: 0.2 });

    observer.observe(el);

    return () => observer.disconnect();
  }, [direction]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
