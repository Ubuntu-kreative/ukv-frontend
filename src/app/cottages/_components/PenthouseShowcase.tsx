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
      {/* Background */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[32px]">

  <section className="relative min-h-screen overflow-hidden">
  <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[28px]">
  <div className="absolute inset-0 pointer-events-none">
    <Image
      src={stay.images[0]}
      alt={stay.name}
      fill
      priority={stay.featured}
      sizes="100vw"
      className="object-cover"
    />

    <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]" />
  </div>
</div>

  {/* CONTENT */}
  <div className="relative z-10">
    ...
  </div>
</section>

</div>

      <div className="relative max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-[var(--gold)]" />
            <span className="text-[var(--gold)] font-mono text-[9px] tracking-[0.5em] uppercase">
              The Penthouse Experience · {stay.floor}
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-light mb-6 leading-[0.85] uppercase">{stay.name}</h2>
          <p className="story-quote font-body text-lg text-white/50 italic leading-relaxed mb-8 pl-1">"{stay.storyLine}"</p>

          <div className="flex flex-wrap gap-2 mb-10">
            {stay.amenities.slice(0, 6).map((a, i) => (
              <span key={i} className="px-3 py-1 border border-[var(--gold)]/20 rounded-full text-[9px] uppercase tracking-wider text-white/40">{a}</span>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">From · per guest / night</p>
              <p className="font-display text-3xl text-[var(--gold)]">KES {stay.rates.bedOnly.toLocaleString()}</p>
              <p className="text-[8px] text-white/20 mt-1">Bed Only · per night</p>
            </div>
            <button onClick={onOpen} className="btn-gold !px-10 !py-4 !text-[10px] !rounded-2xl">
              View Penthouse →
            </button>
          </div>
        </div>

        {/* Image mosaic */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gridTemplateRows: '1fr 1fr',
            gap: '12px',
            height: 'clamp(280px, 40vw, 420px)',
          }}
        >
          {stay.images.map((img, i) => (
            <motion.div
              key={img}
              whileHover={{ scale: 1.02 }}
              onClick={onOpen}
              className="relative overflow-hidden cursor-pointer border border-white/5 rounded-2xl"
              style={i === 0 ? { gridRow: '1 / 3' } : {}}
             >
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl">
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