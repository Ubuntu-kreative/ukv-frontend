'use client';

// src/components/moxie/RetreatMatcher.tsx
// Ubuntu Kreative Village — Emotional Retreat Recommendation Engine
// Converts guest intent into personalized cottage + experience bundles

import React, { useState, useCallback } from 'react';
import {
  type GuestIntent,
  type RecommendationBundle,
  type RecommendedExperience,
  getRecommendationByIntent,
  getAllIntents,
  getIntentLabel,
  getIntentIcon,
} from '@/lib/moxie/recommendations';

// ─── Intent Selection Data ─────────────────────────────────────────────────────

const INTENT_PROMPTS: { intent: GuestIntent; question: string; detail: string }[] = [
  {
    intent: 'burnout',
    question: 'I need to properly rest',
    detail: 'Running on empty. Need to actually stop.',
  },
  {
    intent: 'romance',
    question: 'Romantic escape',
    detail: 'Anniversary, honeymoon, or just us.',
  },
  {
    intent: 'creative',
    question: 'Creative retreat',
    detail: 'Make, write, or find inspiration.',
  },
  {
    intent: 'healing',
    question: 'Healing journey',
    detail: 'Physical or emotional restoration.',
  },
  {
    intent: 'digital-detox',
    question: 'Disconnect completely',
    detail: 'No screens, no agenda.',
  },
  {
    intent: 'family',
    question: 'Family getaway',
    detail: 'With kids, parents, or the whole crew.',
  },
  {
    intent: 'adventure',
    question: 'Active adventure',
    detail: 'Cycling, hiking, the Rift Valley.',
  },
  {
    intent: 'spiritual',
    question: 'Spiritual practice',
    detail: 'Ceremony, meditation, ceremony.',
  },
  {
    intent: 'celebration',
    question: 'Celebrate something big',
    detail: 'Birthday, milestone, achievement.',
  },
  {
    intent: 'workation',
    question: 'Work + nature balance',
    detail: 'Deep focus + genuine rest.',
  },
];

// ─── Sub-components ────────────────────────────────────────────────────────────

function ExperienceCard({
  experience,
  variant = 'supporting',
}: {
  experience: RecommendedExperience;
  variant?: 'primary' | 'supporting' | 'package';
}) {
  const isPrimary = variant === 'primary';
  const isPackage = variant === 'package';

  return (
    <div
      className={`
        relative rounded-2xl border transition-all duration-300 group cursor-pointer
        ${isPrimary
          ? 'bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 border-amber-500/30 hover:border-amber-400/50'
          : isPackage
          ? 'bg-gradient-to-br from-amber-950/80 to-stone-900 border-amber-500/40 hover:border-amber-400/60'
          : 'bg-stone-900/60 border-stone-700/40 hover:border-stone-600/60'
        }
      `}
      style={{ padding: isPrimary ? '1.75rem' : '1.25rem' }}
    >
      {/* Category badge */}
      <div className="flex items-start justify-between mb-3">
        <span
          className={`
            text-xs font-semibold uppercase tracking-widest px-2.5 py-1 rounded-full
            ${isPrimary ? 'bg-amber-500/20 text-amber-400' : 'bg-stone-700/60 text-stone-400'}
          `}
        >
          {experience.category}
        </span>
        {experience.urgency && (
          <span className="text-xs text-red-400/80 font-medium bg-red-950/40 px-2.5 py-1 rounded-full">
            {experience.urgency}
          </span>
        )}
      </div>

      {/* Name and tagline */}
      <h3
        className={`font-semibold text-white mb-1 ${isPrimary ? 'text-xl' : 'text-base'}`}
        style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
      >
        {experience.name}
      </h3>
      <p className={`text-stone-400 italic mb-3 ${isPrimary ? 'text-sm' : 'text-xs'}`}>
        {experience.tagline}
      </p>

      {/* Description — only for primary and package */}
      {(isPrimary || isPackage) && (
        <p className="text-stone-300 text-sm leading-relaxed mb-4">{experience.description}</p>
      )}

      {/* Duration */}
      {experience.duration && (
        <p className="text-stone-500 text-xs mb-3">{experience.duration}</p>
      )}

      {/* Footer: price + CTA */}
      <div className="flex items-center justify-between">
        <span
          className={`font-semibold ${
            isPackage ? 'text-amber-400 text-sm' : isPrimary ? 'text-amber-300 text-base' : 'text-stone-300 text-sm'
          }`}
        >
          {experience.priceRange}
        </span>
        {experience.bookingUrl && (
          <a
            href={experience.bookingUrl}
            className={`
              text-xs font-semibold px-4 py-2 rounded-full transition-all duration-200
              ${isPrimary || isPackage
                ? 'bg-amber-500 hover:bg-amber-400 text-black'
                : 'bg-stone-700 hover:bg-stone-600 text-white'
              }
            `}
          >
            {isPackage ? 'Book Package' : 'Reserve'}
          </a>
        )}
      </div>
    </div>
  );
}

function RecommendationView({
  bundle,
  onReset,
}: {
  bundle: RecommendationBundle;
  onReset: () => void;
}) {
  return (
    <div className="animate-[fadeIn_0.5s_ease-out]">
      {/* Moxie message */}
      <div className="mb-8 relative">
        <div className="flex items-start gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 mt-1"
            style={{ background: 'linear-gradient(135deg, #d4a853, #a07830)' }}
          >
            <span className="text-black text-sm font-bold">M</span>
          </div>
          <div className="flex-1">
            <p
              className="text-sm font-semibold text-amber-400 mb-1"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Moxie
            </p>
            <p className="text-stone-200 text-sm leading-relaxed italic">
              "{bundle.moxieMessage}"
            </p>
          </div>
        </div>
      </div>

      {/* Headline + narrative */}
      <div className="mb-8">
        <h2
          className="text-2xl md:text-3xl font-light text-white mb-3"
          style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
        >
          {bundle.headline}
        </h2>
        <p className="text-stone-400 text-sm leading-relaxed max-w-2xl">{bundle.narrative}</p>
      </div>

      {/* Primary recommendation */}
      <div className="mb-6">
        <p className="text-xs text-amber-500/80 uppercase tracking-widest font-semibold mb-3">
          Our recommendation
        </p>
        <ExperienceCard experience={bundle.primary} variant="primary" />
      </div>

      {/* Supporting experiences */}
      {bundle.supporting.length > 0 && (
        <div className="mb-6">
          <p className="text-xs text-stone-500 uppercase tracking-widest font-semibold mb-3">
            Pair it with
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {bundle.supporting.map((exp) => (
              <ExperienceCard key={exp.id} experience={exp} variant="supporting" />
            ))}
          </div>
        </div>
      )}

      {/* Package offer */}
      {bundle.package && (
        <div className="mb-8">
          <p className="text-xs text-amber-500/80 uppercase tracking-widest font-semibold mb-3 flex items-center gap-2">
            <span>✦</span> Best value bundle
          </p>
          <ExperienceCard experience={bundle.package} variant="package" />
        </div>
      )}

      {/* Reset */}
      <button
        onClick={onReset}
        className="text-xs text-stone-500 hover:text-stone-300 transition-colors duration-200 underline underline-offset-4"
      >
        ← Start over / different intent
      </button>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function RetreatMatcher() {
  const [selectedIntent, setSelectedIntent] = useState<GuestIntent | null>(null);
  const [bundle, setBundle] = useState<RecommendationBundle | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleIntentSelect = useCallback((intent: GuestIntent) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIntent(intent);
      setBundle(getRecommendationByIntent(intent));
      setIsTransitioning(false);
    }, 300);
  }, []);

  const handleReset = useCallback(() => {
    setIsTransitioning(true);
    setTimeout(() => {
      setSelectedIntent(null);
      setBundle(null);
      setIsTransitioning(false);
    }, 200);
  }, []);

  return (
    <section
      id="retreat-matcher"
      className="relative py-24 md:py-32"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111008 50%, #0a0a0a 100%)' }}
    >
      {/* Ambient texture */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle at 20% 30%, #d4a853 0%, transparent 50%), radial-gradient(circle at 80% 70%, #d4a853 0%, transparent 50%)',
        }}
      />

      <div
        className="relative z-10 mx-auto px-4 sm:px-6 lg:px-8"
        style={{ maxWidth: '1100px' }}
      >
        {/* Section header */}
        {!bundle && (
          <div className="text-center mb-14">
            <p className="text-xs text-amber-500/80 uppercase tracking-[0.3em] font-semibold mb-4">
              Personalised Experience
            </p>
            <h2
              className="text-3xl md:text-5xl font-light text-white mb-5"
              style={{ fontFamily: "'Cormorant Garamond', 'Georgia', serif" }}
            >
              What brings you to Ubuntu?
            </h2>
            <p className="text-stone-400 text-sm max-w-lg mx-auto leading-relaxed">
              Tell us what you're carrying — and we'll find what the village holds for you.
            </p>
          </div>
        )}

        {/* Transition wrapper */}
        <div
          className="transition-opacity duration-300"
          style={{ opacity: isTransitioning ? 0 : 1 }}
        >
          {!bundle ? (
            /* Intent selection grid */
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {INTENT_PROMPTS.map(({ intent, question, detail }) => (
                <button
                  key={intent}
                  onClick={() => handleIntentSelect(intent)}
                  className="
                    group relative flex flex-col items-start text-left p-4 rounded-2xl
                    border border-stone-800/60 bg-stone-900/40
                    hover:border-amber-500/40 hover:bg-stone-800/60
                    transition-all duration-300 cursor-pointer
                  "
                >
                  <span className="text-2xl mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">
                    {getIntentIcon(intent)}
                  </span>
                  <span className="text-white text-sm font-medium leading-snug mb-1">
                    {question}
                  </span>
                  <span className="text-stone-500 text-xs leading-snug">{detail}</span>
                </button>
              ))}
            </div>
          ) : (
            /* Recommendation view */
            <RecommendationView bundle={bundle} onReset={handleReset} />
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}