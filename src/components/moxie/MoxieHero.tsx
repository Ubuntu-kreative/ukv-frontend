'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion'

const TELEMETRY_LINES = [
  'SOLAR OUTPUT: 94%',
  'ECOLOGY PULSE: STABLE',
  'SANCTUARY: ACTIVE',
  'SEASON: DRY SEASON — WEEK 6',
  'MOXIE: ONLINE',
]

const TAGLINES = [
  'Where the land remembers.',
  'A sanctuary that breathes.',
  'Intelligence meets the wild.',
  'Luxury rooted in the earth.',
]

export default function MoxieHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [taglineIndex, setTaglineIndex] = useState(0)
  const [telemetryIndex, setTelemetryIndex] = useState(0)
  const [mounted, setMounted] = useState(false)

  const { scrollY } = useScroll()
  const yParallax = useTransform(scrollY, [0, 600], [0, 120])
  const opacityFade = useTransform(scrollY, [0, 400], [1, 0])

  useEffect(() => {
    setMounted(true)
    const tagTimer = setInterval(() => {
      setTaglineIndex((i) => (i + 1) % TAGLINES.length)
    }, 4000)
    const telTimer = setInterval(() => {
      setTelemetryIndex((i) => (i + 1) % TELEMETRY_LINES.length)
    }, 2200)
    return () => {
      clearInterval(tagTimer)
      clearInterval(telTimer)
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="moxie-hero relative w-full min-h-screen overflow-hidden bg-obsidian flex flex-col items-center justify-center"
      aria-label="Ubuntu Kreative Village — Moxie AI Sanctuary"
    >
      {/* Deep atmospheric background */}
      <motion.div
        style={{ y: yParallax }}
        className="absolute inset-0 z-0"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-radial-hero" />
        <div className="absolute inset-0 moxie-noise-overlay" />
        <div className="absolute inset-0 moxie-grid-overlay opacity-10" />
      </motion.div>

      {/* Ambient glow orbs */}
      <motion.div
        aria-hidden="true"
        className="absolute top-1/4 left-1/3 w-[520px] h-[520px] rounded-full bg-gold/5 blur-[120px] z-0"
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        aria-hidden="true"
        className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] rounded-full bg-green-900/20 blur-[100px] z-0"
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
      />

      {/* Main content */}
      <motion.div
        style={{ opacity: opacityFade }}
        className="relative z-10 flex flex-col items-center text-center px-6 md:px-12 max-w-5xl mx-auto"
      >
        {/* Pre-title telemetry badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : -20 }}
          transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
          className="mb-8"
        >
          <div className="moxie-telemetry-badge inline-flex items-center gap-3 px-4 py-2 rounded-full border border-gold/20 bg-white/[0.03] backdrop-blur-sm">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <AnimatePresence mode="wait">
              <motion.span
                key={telemetryIndex}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="text-xs tracking-[0.2em] text-gold/70 font-mono uppercase"
              >
                {TELEMETRY_LINES[telemetryIndex]}
              </motion.span>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Wordmark */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 40 }}
          transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          <p className="text-xs tracking-[0.45em] text-gold/50 uppercase font-mono mb-4">
            Ubuntu Kreative Village
          </p>
          <h1 className="moxie-hero-title text-[clamp(3.5rem,10vw,8rem)] font-display font-light leading-[0.9] tracking-tight text-white">
            MOXIE
          </h1>
          <div className="h-px w-32 mx-auto bg-gradient-to-r from-transparent via-gold/60 to-transparent mt-4" />
        </motion.div>

        {/* Animated tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-8 h-10 flex items-center justify-center"
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={taglineIndex}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
              className="text-xl md:text-2xl font-light text-white/60 italic tracking-wide"
            >
              {TAGLINES[taglineIndex]}
            </motion.p>
          </AnimatePresence>
        </motion.div>

        {/* Sub-description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 20 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="mt-6 max-w-xl text-base md:text-lg text-white/35 leading-relaxed font-light"
        >
          Your AI sanctuary concierge — aware of the land, the weather, the season,
          and the quiet intelligence of this living ecosystem.
        </motion.p>

        {/* CTA cluster */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: mounted ? 1 : 0, y: mounted ? 0 : 24 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="mt-12 flex flex-col sm:flex-row items-center gap-4"
        >
          <button
            className="moxie-cta-primary group relative px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium text-obsidian bg-gold overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(212,175,55,0.35)]"
            aria-label="Begin your Moxie experience"
          >
            <span className="relative z-10">Begin the Journey</span>
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
          </button>
          <button
            className="px-8 py-4 rounded-full text-sm tracking-[0.15em] uppercase font-medium text-gold/70 border border-gold/20 hover:border-gold/50 hover:text-gold transition-all duration-300"
            aria-label="Explore the sanctuary"
          >
            Explore Sanctuary
          </button>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: mounted ? 1 : 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="mt-20 flex flex-col items-center gap-2"
          aria-hidden="true"
        >
          <span className="text-[10px] tracking-[0.3em] text-white/20 uppercase font-mono">
            Scroll
          </span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-px h-10 bg-gradient-to-b from-gold/30 to-transparent"
          />
        </motion.div>
      </motion.div>

      {/* Corner telemetry decorations */}
      <div className="absolute top-6 left-6 text-[10px] font-mono text-white/15 tracking-widest hidden md:block" aria-hidden="true">
        <div>LAT: 0.3476° S</div>
        <div>LNG: 36.9137° E</div>
      </div>
      <div className="absolute top-6 right-6 text-[10px] font-mono text-white/15 tracking-widest text-right hidden md:block" aria-hidden="true">
        <div>SYS: ONLINE</div>
        <div>AI: ACTIVE</div>
      </div>
    </section>
  )
}