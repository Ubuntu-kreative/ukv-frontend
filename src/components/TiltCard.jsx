// /src/components/TiltCard.jsx
"use client";
import React from "react";

export default function TiltCard({ children, className = "" }) {
  return (
    <div className={`tilt-card ${className}`}>
      <div className="tilt-card-inner">
        {children}
      </div>
    </div>
  );
}
