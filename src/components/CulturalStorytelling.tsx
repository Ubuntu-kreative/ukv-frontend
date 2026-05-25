"use client";

import React from "react";

interface CulturalStory {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  origin: string;
}

const CULTURAL_STORIES: CulturalStory[] = [
  {
    title: "Ubuntu Philosophy",
    subtitle: "I am because we are",
    description: "The African philosophy that emphasizes community, compassion, and shared humanity. At Ubuntu Kreative Village, every experience is designed to foster connection and collective well-being.",
    icon: "🤝",
    origin: "Southern Africa",
  },
  {
    title: "Pokomo Heritage",
    subtitle: "Guardians of the Tana River",
    description: "The Pokomo people have stewarded this land for generations, practicing sustainable fishing, farming, and living in harmony with the river ecosystem that sustains life.",
    icon: "🌊",
    origin: "Kenyan Coast",
  },
  {
    title: "Arohamai Healing",
    subtitle: "Ancient wellness wisdom",
    description: "Drawing from traditional African healing practices, our spa rituals honor ancestral knowledge of plants, waters, and natural remedies for spiritual and physical restoration.",
    icon: "🌿",
    origin: "East African Traditions",
  },
  {
    title: "Harvest Rhythms",
    subtitle: "Cycles of the land",
    description: "Following lunar cycles and seasonal wisdom, our farming practices respect ancient agricultural calendars that have sustained communities for millennia.",
    icon: "🌙",
    origin: "African Agricultural Wisdom",
  },
];

export default function CulturalStorytelling() {
  return (
    <>
      <style>{`
        .cultural-storytelling {
          padding: 80px 24px;
          background: linear-gradient(180deg, rgba(16,21,17,0.4) 0%, rgba(23,32,24,0.6) 50%, rgba(16,21,17,0.4) 100%);
          border-top: 1px solid rgba(196,164,90,0.1);
          border-bottom: 1px solid rgba(196,164,90,0.1);
        }
        .cultural-header {
          text-align: center;
          margin-bottom: 60px;
        }
        .cultural-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 300;
          color: #F5F0E8;
          letter-spacing: 0.08em;
          margin-bottom: 12px;
          line-height: 1.2;
        }
        .cultural-subtitle {
          font-size: 10px;
          letter-spacing: 0.3em;
          text-transform: uppercase;
          color: rgba(196,164,90,0.6);
          font-weight: 500;
        }
        .cultural-stories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 32px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .cultural-story-card {
          background: rgba(196,164,90,0.03);
          border: 1px solid rgba(196,164,90,0.15);
          border-radius: 12px;
          padding: 32px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .cultural-story-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, transparent, rgba(196,164,90,0.5), transparent);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }
        .cultural-story-card:hover {
          background: rgba(196,164,90,0.06);
          border-color: rgba(196,164,90,0.3);
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(196,164,90,0.1);
        }
        .cultural-story-card:hover::before {
          transform: scaleX(1);
        }
        .cultural-story-icon {
          font-size: 48px;
          margin-bottom: 20px;
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.3));
        }
        .cultural-story-title {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 400;
          color: #F5F0E8;
          letter-spacing: 0.05em;
          margin-bottom: 8px;
          line-height: 1.3;
        }
        .cultural-story-subtitle {
          font-size: 11px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(196,164,90,0.7);
          font-weight: 500;
          margin-bottom: 16px;
          font-style: italic;
          font-family: 'Cormorant Garamond', serif;
        }
        .cultural-story-description {
          font-size: 13px;
          line-height: 1.8;
          color: rgba(245,240,232,0.6);
          margin-bottom: 20px;
        }
        .cultural-origin {
          font-size: 9px;
          letter-spacing: 0.25em;
          text-transform: uppercase;
          color: rgba(245,240,232,0.3);
          font-weight: 500;
        }
        @media (max-width: 768px) {
          .cultural-storytelling {
            padding: 48px 16px;
          }
          .cultural-stories-grid {
            grid-template-columns: 1fr;
            gap: 24px;
          }
          .cultural-story-card {
            padding: 24px;
          }
          .cultural-story-icon {
            font-size: 36px;
          }
          .cultural-story-title {
            font-size: 20px;
          }
        }
      `}</style>
      <div className="cultural-storytelling">
        <div className="cultural-header">
          <h2 className="cultural-title">Living Heritage</h2>
          <p className="cultural-subtitle">Stories Rooted in African Wisdom</p>
        </div>
        <div className="cultural-stories-grid">
          {CULTURAL_STORIES.map((story) => (
            <div key={story.title} className="cultural-story-card">
              <span className="cultural-story-icon">{story.icon}</span>
              <h3 className="cultural-story-title">{story.title}</h3>
              <p className="cultural-story-subtitle">{story.subtitle}</p>
              <p className="cultural-story-description">{story.description}</p>
              <span className="cultural-origin">{story.origin}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
