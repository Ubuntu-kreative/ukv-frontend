'use client'

// ─────────────────────────────────────────────────────────────
// PenthouseShowcase.tsx  — Lazy-loaded showcase section
//
// This is dynamically imported in StaysGrid so it doesn't add
// to the initial JS bundle. It only loads when the page is
// scrolled enough to warrant it (triggered by Suspense boundary).
// ─────────────────────────────────────────────────────────────

import Image from 'next/image'
import { motion } from 'framer-motion'
import type { Stay, BoardOption } from '../_data/stays-data'

interface Props {
  stay: Stay
  onOpen: () => void
}

export function PenthouseShowcase({ stay, onOpen }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: '-100px' }}
      className="relative py-24 px-4 sm:px-6 md:px-10 overflow-hidden border-y border-white/5"
    >
      <div className="relative max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div className="relative px-8 py-10 rounded-[32px] bg-gradient-to-br from-white/[0.02] to-white/[0.01] backdrop-blur-sm shadow-[0_0_1px_rgba(212,175,55,0.2), 0_8px_32px_rgba(0,0,0,0.6), inset_0_1px_1px_rgba(212,175,55,0.08)]">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-12 h-[1px] bg-[var(--gold)]" />
            <span className="text-[var(--gold)] font-mono text-[8px] tracking-[0.6em] uppercase font-medium">
              The Penthouse Experience · {stay.floor}
            </span>
          </div>

          <h2 className="font-display text-6xl md:text-7xl font-light mb-10 leading-[0.9] tracking-[-0.02em] uppercase text-white">{stay.name}</h2>
          <p className="story-quote font-body text-base text-white/60 italic leading-[1.7] mb-12 pl-1">"{stay.storyLine}"</p>

          <div className="flex flex-wrap gap-2.5 mb-14">
            {stay.amenities.slice(0, 6).map((a, i) => (
              <span key={i} className="px-3.5 py-1.5 border border-[var(--gold)]/25 rounded-full text-[8px] uppercase tracking-widest text-white/45 font-medium">{a}</span>
            ))}
          </div>

          <div className="flex flex-col gap-8">
            <div>
              <p className="text-[8px] text-white/30 uppercase tracking-widest mb-3 font-medium">From · Per Guest / Night</p>
              <p className="font-display text-6xl md:text-7xl text-[var(--gold)] font-light leading-none mb-3">KES {stay.rates.bedOnly.toLocaleString()}</p>
              <p className="text-[8px] text-white/25 uppercase tracking-widest font-medium">Bed Only · Per Night</p>
            </div>
            <button onClick={onOpen} className="btn-gold !px-10 !py-4 !text-[10px] !rounded-2xl w-full md:w-auto">
              View Penthouse →
            </button>
          </div>
        </div>

        {/* Image mosaic */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.25fr 1fr',
            gridTemplateRows: '1fr 1fr 1fr',
            gap: '12px 16px',
            height: '680px',
          }}
        >
          {stay.images.map((img, i) => (
            <motion.div
              key={img}
              whileHover={{ scale: 1.02 }}
              onClick={onOpen}
              className="relative overflow-hidden cursor-pointer rounded-[44px]"
              style={i === 0 ? { gridColumn: 1, gridRow: 'span 3' } : {}}
             >
              <div className="relative w-full h-full overflow-hidden rounded-[44px]">
  <Image
    src={img}
    alt={`${stay.name} ${i + 1}`}
    fill
    loading="lazy"
    sizes="(max-width: 768px) 50vw, 25vw"
    className="object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
  />
</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}