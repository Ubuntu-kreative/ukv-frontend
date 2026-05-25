"use client";

import React from "react";

interface SustainabilityMetric {
  label: string;
  value: string;
  icon: string;
  description: string;
  color: string;
}

const SUSTAINABILITY_METRICS: SustainabilityMetric[] = [
  {
    label: "Carbon Negative",
    value: "-12.4",
    icon: "🌱",
    description: "tons CO₂ offset monthly",
    color: "rgba(125,184,125,0.8)",
  },
  {
    label: "Solar Powered",
    value: "87%",
    icon: "☀️",
    description: "renewable energy usage",
    color: "rgba(196,164,90,0.8)",
  },
  {
    label: "Water Conservation",
    value: "40%",
    icon: "💧",
    description: "rainwater harvesting",
    color: "rgba(122,150,114,0.8)",
  },
  {
    label: "Zero Waste",
    value: "94%",
    icon: "♻️",
    description: "recycling & composting",
    color: "rgba(166,124,82,0.8)",
  },
];

export default function SustainabilityMetrics() {
  return (
    <>
      <style>{`
        .sustainability-metrics {
          display: flex;
          gap: 24px;
          padding: 16px 24px;
          background: linear-gradient(180deg, rgba(16,21,17,0.6) 0%, rgba(23,32,24,0.8) 100%);
          border-top: 1px solid rgba(196,164,90,0.12);
          border-bottom: 1px solid rgba(196,164,90,0.12);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
        .sustainability-metric {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          padding: 12px 16px;
          background: rgba(196,164,90,0.04);
          border: 1px solid rgba(196,164,90,0.15);
          border-radius: 8px;
          min-width: 120px;
          transition: all 0.3s ease;
          cursor: default;
        }
        .sustainability-metric:hover {
          background: rgba(196,164,90,0.08);
          border-color: rgba(196,164,90,0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(196,164,90,0.1);
        }
        .sustainability-icon {
          font-size: 24px;
          filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
        }
        .sustainability-value {
          font-family: 'Cormorant Garamond', serif;
          font-size: 28px;
          font-weight: 300;
          color: #F5F0E8;
          line-height: 1;
          letter-spacing: 0.05em;
        }
        .sustainability-label {
          font-size: 8px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(196,164,90,0.7);
          font-weight: 500;
          text-align: center;
        }
        .sustainability-description {
          font-size: 9px;
          color: rgba(245,240,232,0.4);
          text-align: center;
          font-style: italic;
          font-family: 'Cormorant Garamond', serif;
        }
        @media (max-width: 768px) {
          .sustainability-metrics {
            flex-direction: column;
            gap: 12px;
            padding: 12px 16px;
          }
          .sustainability-metric {
            flex-direction: row;
            align-items: center;
            gap: 12px;
            min-width: auto;
            padding: 10px 14px;
          }
          .sustainability-icon {
            font-size: 20px;
          }
          .sustainability-value {
            font-size: 20px;
          }
        }
      `}</style>
      <div className="sustainability-metrics">
        {SUSTAINABILITY_METRICS.map((metric) => (
          <div key={metric.label} className="sustainability-metric">
            <span className="sustainability-icon">{metric.icon}</span>
            <span className="sustainability-value">{metric.value}</span>
            <span className="sustainability-label">{metric.label}</span>
            <span className="sustainability-description">{metric.description}</span>
          </div>
        ))}
      </div>
    </>
  );
}
