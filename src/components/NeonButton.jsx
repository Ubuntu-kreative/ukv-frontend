// /src/components/NeonButton.jsx
"use client";
import React from "react";

export default function NeonButton({ children, href = "#", className = "" }) {
  return (
    <a href={href} className={`btn-neon ${className}`}>
      <span>{children}</span>
    </a>
  );
}
