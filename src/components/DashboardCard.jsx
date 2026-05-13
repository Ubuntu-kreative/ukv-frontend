// /src/components/DashboardCard.jsx
"use client";
import React from "react";
import TiltCard from "@/components/TiltCard";
import LiveClock from "@/components/LiveClock";
import LiveDateTime from "@/components/LiveDateTime";

export default function DashboardCard({ title = "System Status", className = "" }) {
  return (
    <TiltCard className={`glass p-6 relative ${className}`}>
      <div className="flex flex-col gap-4">
        {/* Card Title */}
        <h2 className="font-display neon-text text-lg">{title}</h2>

        {/* Live Time + Date */}
        <div className="flex flex-col gap-2">
          <LiveClock className="gold-text text-xl font-bold" />
          <LiveDateTime className="text-grow text-sm" />
        </div>

        {/* Status Dot */}
        <div className="flex items-center gap-2 mt-2">
          <span className="status-dot"></span>
          <span className="text-xs uppercase tracking-wider">Active</span>
        </div>
      </div>
    </TiltCard>
  );
}
