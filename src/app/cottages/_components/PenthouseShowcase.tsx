'use client'

// ─────────────────────────────────────────────────────────────
// PenthouseShowcase.tsx  — Lazy-loaded Neem Penthouse hero section
//
// Renders the exact Neem Penthouse design shown in the screenshot.
// This is only used for the featured penthouse showcase on the cottages page.
// ─────────────────────────────────────────────────────────────

import { memo, useCallback } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Stay } from '../_data/stays-data'

interface PenthouseShowcaseProps {
  stay: Stay
  onOpen: () => void
}

function PenthouseShowcaseInner({ stay, onOpen }: PenthouseShowcaseProps) {
  const handleOpen = useCallback(() => onOpen(), [onOpen])

  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-120px' }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="relative py-24 px-4 sm:px-6 md:px-10 overflow-hidden"
    >
      <div className="max-w-8xl mx-auto grid gap-8 lg:grid-cols-[1.05fr_0.95fr] items-start">
        <div className="relative rounded-[32px] border border-white/5 bg-[#0a0a0a] p-8 sm:p-10 lg:p-12 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(212,168,75,0.12),transparent_40%)] pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 pointer-events-none" />

          <div className="relative z-10">
            <p className="text-[9px] uppercase tracking-[0.45em] text-[var(--gold)]/70 mb-6">
              THE PENTHOUSE EXPERIENCE · {stay.floor.toUpperCase()}
            </p>
            <h2 className="font-display text-[clamp(3.25rem,7vw,5.5rem)] leading-[0.88] uppercase tracking-[-0.04em] text-white mb-8">
              {stay.name}
            </h2>
            <p className="font-body text-base sm:text-lg leading-[1.95] text-white/60 max-w-2xl mb-8">
              "{stay.storyLine}"
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {['GYM', 'SWIMMING POOL', 'CONFERENCE FACILITIES', 'FARM TOURS', 'MOVIE NIGHTS', 'CYCLING'].map((amenity) => (
                <span
                  key={amenity}
                  className="px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-white/60 border border-white/10 rounded-full"
                >
                  {amenity}
                </span>
              ))}
            </div>

            <div className="grid grid-cols-[auto_1fr] gap-6 items-end">
              <div>
                <p className="text-[8px] uppercase tracking-[0.45em] text-white/30 mb-2">
                  FROM · PER GUEST / NIGHT
                </p>
                <p className="font-display text-5xl sm:text-6xl text-[var(--gold)] leading-none">
                  KES {stay.rates.bedOnly.toLocaleString()}
                </p>
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/30 mt-2">
                  Bed Only · per night
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpen}
                className="h-14 px-10 rounded-full bg-[var(--gold)] text-black text-[10px] uppercase tracking-[0.35em] font-semibold shadow-[0_12px_50px_rgba(212,168,75,0.18)] hover:bg-[#d4af3f]/90 transition-colors duration-200"
              >
                View Penthouse →
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.05fr_0.95fr] md:grid-rows-[repeat(3,minmax(0,auto))]">
          <div
            className="relative rounded-[32px] overflow-hidden border border-white/5 h-[360px] md:row-span-3 md:h-full group"
            role="button"
            tabIndex={0}
            onClick={handleOpen}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen() }}
          >
            <Image
              src={stay.images[0]}
              alt={`${stay.name} exterior`}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover transform-gpu transition-transform duration-500 group-hover:scale-105 group-hover:[transform:perspective(900px)_rotateX(2deg)_rotateY(-2deg)_scale(1.02)]"
            />
          </div>

          <div
            className="relative rounded-[28px] overflow-hidden border border-white/5 h-[176px] sm:h-[220px] group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen() }}
            onClick={handleOpen}
          >
            <Image
              src={stay.images[1]}
              alt={`${stay.name} interior`}
              fill
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover transform-gpu transition-transform duration-500 group-hover:scale-105 group-hover:[transform:perspective(800px)_rotateX(2deg)_rotateY(-2deg)_scale(1.02)]"
            />
          </div>

          <div
            className="relative rounded-[28px] overflow-hidden border border-white/5 h-[176px] sm:h-[220px] group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen() }}
            onClick={handleOpen}
          >
            <Image
              src={stay.images[2]}
              alt={`${stay.name} bedroom`}
              fill
              sizes="(max-width: 768px) 100vw, 35vw"
              className="object-cover transform-gpu transition-transform duration-500 group-hover:scale-105 group-hover:[transform:perspective(800px)_rotateX(2deg)_rotateY(-2deg)_scale(1.02)]"
            />
          </div>

          <div
            className="relative rounded-[32px] overflow-hidden border border-white/5 h-[220px] sm:h-[260px] group"
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleOpen() }}
            onClick={handleOpen}
          >
            <Image
              src={stay.images[3]}
              alt={`${stay.name} terrace`}
              fill
              sizes="100vw"
              className="object-cover transform-gpu transition-transform duration-500 group-hover:scale-105 group-hover:[transform:perspective(800px)_rotateX(2deg)_rotateY(-2deg)_scale(1.02)]"
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export const PenthouseShowcase = memo(PenthouseShowcaseInner)
