// /src/components/GoldButton.jsx
"use client";
import React from "react";

export default function GoldButton({ children, href = "#", className = "" }) {
  return (
    <a href={href} className={`btn-gold ${className}`}>
      <span>{children}</span>
    </a>
  );
}
