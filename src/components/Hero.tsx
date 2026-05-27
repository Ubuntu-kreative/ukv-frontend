'use client'

/**
 * ── Hero Component ────────────────────────────────────────────
 * Cinematic luxury rewrite — Aman / Six Senses aesthetic.
 *
 * Key improvements:
 * • Stripped overlays → footage breathes, feels expensive
 * • Framer Motion parallax on video + content (useScroll / useTransform)
 * • Subtle 8s scale-breath on video on load
 * • Cinematic [0.22, 1, 0.36, 1] easing on all entrances
 * • Film grain instead of scanlines
 * • Warm earth vignette only — no green glow, no scanlines
 * • Smoked-glass secondary button (no neon)
 * • Magnetic CTA buttons
 * • Balanced vertical layout (items-center + bottom pb)
 * ──────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
} from 'framer-motion'

// ── Ease curve used across all cinematic reveals ──────────────
const CINEMA_EASE = [0.22, 1, 0.36, 1] as const

// ── Magnetic button hook ──────────────────────────────────────
function useMagnetic() {
  const [pos, setPos] = useState({ x: 0, y: 0 })

  const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = e
    const { width, height, left, top } = currentTarget.getBoundingClientRect()
    setPos({
      x: (clientX - (left + width / 2)) * 0.28,
      y: (clientY - (top + height / 2)) * 0.28,
    })
  }

  const reset = () => setPos({ x: 0, y: 0 })
  return { pos, handleMouse, reset }
}

export default function Hero() {
  const [loaded, setLoaded]         = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [weather]                   = useState('24°C')

  const containerRef = useRef<HTMLElement>(null)
  const videoRef     = useRef<HTMLVideoElement>(null)

  // ── Scroll-driven parallax ────────────────────────────────
  const { scrollY } = useScroll()

  // Direct transforms (no useSpring — springs keep rAF loops alive while scrolling)
  const yVideo    = useTransform(scrollY, [0, 900], [0, 130])
  const yContent  = useTransform(scrollY, [0, 900], [0, -70])

  // Subtle opacity fade on scroll
  const heroOpacity = useTransform(scrollY, [0, 600], [1, 0])

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 120)
    return () => clearTimeout(t)
  }, [])

  const mag1 = useMagnetic()
  const mag2 = useMagnetic()

  return (
    <section
      ref={containerRef}
      className="relative flex items-center overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* ── VIDEO LAYER with parallax + scale-breath ─────── */}
      <motion.div
        className="absolute inset-0"
        style={{ y: yVideo, scale: videoReady ? 1.04 : 1 }}
        // 8-second cinematic breath-in on load
        initial={{ scale: 1.08 }}
        animate={{ scale: videoReady ? 1.04 : 1.08 }}
        transition={{ duration: 8, ease: 'easeOut' }}
      >
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          onCanPlay={() => setVideoReady(true)}
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity:    videoReady ? 1 : 0,
            transition: 'opacity 1.8s ease',
          }}
         >
          <source src="/videos/Hero-Main01.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* ── FALLBACK (while video loads) ─────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0C0A07 0%, #1C1208 50%, #0C0A07 100%)',
          opacity:    videoReady ? 0 : 1,
          transition: 'opacity 1.4s ease',
          zIndex:     0,
        }}
      />

      {/* ── OVERLAY 1 — Cinematic gradient (lighter than before) ── */}
      {/* Was: rgba(0,0,0,0.90) at bottom — crushed all detail     */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.18) 0%,
              rgba(0,0,0,0.08) 30%,
              rgba(0,0,0,0.26) 68%,
              rgba(0,0,0,0.62) 100%
            )
          `,
          zIndex: 1,
        }}
      />

      {/* ── OVERLAY 2 — Warm earth vignette only (no green glow) ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(
              ellipse 70% 55% at 50% 100%,
              rgba(28,18,10,0.26) 0%,
              transparent 70%
            )
          `,
          zIndex: 2,
        }}
      />

      {/* ── FILM GRAIN (replaces scanlines — cinematic realism) ── */}
      {/* SVG fractal noise: sharpens perceived image, hides      */}
      {/* compression artefacts, feels like real film print.      */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 3, opacity: 0.028, mixBlendMode: 'soft-light' }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <filter id="grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.72"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain)" />
      </svg>

      {/* ── CORNER HUD BRACKETS ─────────────────────────────── */}
      {[
        { top: '88px',    left:  '24px', borderTop:    '1px solid rgba(212,168,83,0.3)', borderLeft:   '1px solid rgba(212,168,83,0.3)' },
        { top: '88px',    right: '24px', borderTop:    '1px solid rgba(212,168,83,0.3)', borderRight:  '1px solid rgba(212,168,83,0.3)' },
        { bottom: '32px', left:  '24px', borderBottom: '1px solid rgba(212,168,83,0.3)', borderLeft:   '1px solid rgba(212,168,83,0.3)' },
        { bottom: '32px', right: '24px', borderBottom: '1px solid rgba(212,168,83,0.3)', borderRight:  '1px solid rgba(212,168,83,0.3)' },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ ...s, width: 22, height: 22, zIndex: 4 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 0.55 : 0 }}
          transition={{ duration: 1.2, delay: 1.2 + i * 0.08 }}
        />
      ))}

      {/* ── HERO CONTENT with scroll parallax ─────────────── */}
      {/* pt-28 md:pt-32 clears the fixed nav (typically 64–80px tall) */}
      <motion.div
        className="relative w-full max-w-8xl mx-auto px-6 md:px-10 page-hero-offset pb-28 md:pb-36"
        style={{ zIndex: 5, y: yContent, opacity: heroOpacity }}
      >

        {/* Status label */}
        <motion.div
          className="flex items-center gap-4 mb-8"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 14 }}
          transition={{ duration: 0.9, ease: CINEMA_EASE }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C9A96E] opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C9A96E]" />
            </span>
            <span
              className="font-body text-[10px] tracking-[0.22em] uppercase"
              style={{ color: 'rgba(255,255,255,0.75)' }}
            >
              Farm Online&nbsp;·&nbsp;{weather}
            </span>
          </div>
          <span className="h-px w-10 bg-white/20" />
          <span
            className="font-body text-[10px] tracking-[0.22em] uppercase"
            style={{ color: 'rgba(255,255,255,0.38)' }}
          >
            Kenya&nbsp;·&nbsp;Est. 2024
          </span>
        </motion.div>

        {/* Main headline — staggered word-level reveal */}
        <motion.h1
          className="font-display leading-[0.88] mb-7"
          style={{
            fontSize:   'clamp(3.4rem, 10vw, 9rem)',
            fontWeight: 300,
            color:      '#FFFFFF',
            // lighter shadow — was too heavy and muddy
            textShadow: '0 4px 18px rgba(0,0,0,0.26)',
          }}
          initial={{ opacity: 0, y: 44 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 44 }}
          transition={{ duration: 1.5, ease: CINEMA_EASE, delay: 0.08 }}
        >
          <em style={{ fontStyle: 'italic' }}>I am</em>
          <br />
          because{' '}
          <span
            style={{
              color:      'var(--gold, #D4A853)',
              // soft gold glow — refined, not garish
              textShadow: '0 0 48px rgba(212,168,83,0.32)',
            }}
          >
            we are.
          </span>
        </motion.h1>

        {/* Sub-copy — elegant serif italic for warmth and contrast */}
        <motion.p
          className="max-w-xl mb-12"
          style={{
            fontFamily:    'Georgia, "Times New Roman", serif',
            fontStyle:     'italic',
            fontSize:      'clamp(0.98rem, 1.5vw, 1.15rem)',
            lineHeight:    1.92,
            letterSpacing: '0.012em',
            fontWeight:    400,
            color:         'rgba(255,255,255,0.72)',
          }}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 18 }}
          transition={{ duration: 1.2, ease: CINEMA_EASE, delay: 0.26 }}
        >
          A living farm retreat in Kenya — where Pokomo Cottages,
          Arohamai Spa, and farm-to-fork dining converge in one
          immersive village experience.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-wrap items-center gap-5"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 14 }}
          transition={{ duration: 1.1, ease: CINEMA_EASE, delay: 0.42 }}
        >
          {/* Primary — warm gold, refined shadow */}
          <motion.div
            onMouseMove={mag1.handleMouse}
            onMouseLeave={mag1.reset}
            animate={{ x: mag1.pos.x, y: mag1.pos.y }}
            transition={{ type: 'spring', stiffness: 160, damping: 16, mass: 0.1 }}
          >
            <Link
              href="/contact"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '10px',
                padding:        '14px 36px',
                background:     '#D4A853',
                color:          '#0A0A0A',
                fontSize:       '0.72rem',
                fontFamily:     'var(--font-body)',
                fontWeight:     500,
                letterSpacing:  '0.18em',
                textTransform:  'uppercase',
                textDecoration: 'none',
                backdropFilter: 'blur(8px)',
                boxShadow:      '0 10px 40px rgba(212,168,83,0.22)',
                transition:     'background 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background  = '#E0B96A'
                el.style.boxShadow   = '0 14px 48px rgba(212,168,83,0.32)'
                el.style.transform   = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background  = '#D4A853'
                el.style.boxShadow   = '0 10px 40px rgba(212,168,83,0.22)'
                el.style.transform   = 'translateY(0)'
              }}
            >
              Reserve Your Stay
            </Link>
          </motion.div>

          {/* Secondary — smoked glass luxury (was neon — wrong for brand) */}
          <motion.div
            onMouseMove={mag2.handleMouse}
            onMouseLeave={mag2.reset}
            animate={{ x: mag2.pos.x, y: mag2.pos.y }}
            transition={{ type: 'spring', stiffness: 160, damping: 16, mass: 0.1 }}
          >
            <Link
              href="/cottages"
              style={{
                display:        'inline-flex',
                alignItems:     'center',
                gap:            '10px',
                padding:        '13px 36px',
                background:     'rgba(255,255,255,0.06)',
                color:          'rgba(255,255,255,0.82)',
                fontSize:       '0.72rem',
                fontFamily:     'var(--font-body)',
                fontWeight:     400,
                letterSpacing:  '0.18em',
                textTransform:  'uppercase',
                textDecoration: 'none',
                border:         '1px solid rgba(255,255,255,0.14)',
                backdropFilter: 'blur(12px)',
                transition:     'background 0.3s ease, border-color 0.3s ease, transform 0.2s ease',
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background   = 'rgba(255,255,255,0.11)'
                el.style.borderColor  = 'rgba(255,255,255,0.24)'
                el.style.transform    = 'translateY(-1px)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLAnchorElement
                el.style.background   = 'rgba(255,255,255,0.06)'
                el.style.borderColor  = 'rgba(255,255,255,0.14)'
                el.style.transform    = 'translateY(0)'
              }}
            >
              Explore Cottages
            </Link>
          </motion.div>
        </motion.div>

        {/* Footer meta */}
        <motion.p
          className="font-body text-[8px] tracking-widest mt-9"
          style={{ color: 'rgba(255,255,255,0.42)', letterSpacing: '0.28em' }}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          transition={{ duration: 1.2, delay: 1.1 }}
        >
          Kenya Highlands&nbsp;·&nbsp;Sustainable Luxury&nbsp;·&nbsp;Living Architecture
        </motion.p>
      </motion.div>

      {/* ── SCROLL INDICATOR ──────────────────────────────── */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 5 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: loaded ? 1 : 0 }}
        transition={{ duration: 1, delay: 1.4 }}
      >
        <span
          className="font-body text-[8px] tracking-[0.35em] uppercase"
          style={{ color: 'rgba(255,255,255,0.32)' }}
        >
          Scroll
        </span>
        {/* Animated gold drop — replaces green neon bar */}
        <motion.div
          style={{
            width:        '1px',
            height:       '48px',
            background:   'linear-gradient(to bottom, rgba(212,168,83,0.7), transparent)',
            originY:      0,
          }}
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, ease: 'easeInOut', repeat: Infinity }}
        />
      </motion.div>
    </section>
  )
}