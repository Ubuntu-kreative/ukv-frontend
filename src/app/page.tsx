'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// Core Layout Components
import Nav from '@/components/Nav'
import Hero from '@/components/Hero'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import CookieConsent from '@/components/CookieConsent'
import { CartPanel } from '@/components/cart/CartPanel'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Experience {
  title: string
  sub: string
  href: string
  accent: string
  emoji: string
  desc: string
  cta: string
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPROVEMENT #12 — extended earth palette injected globally once
// Adds --earth and --sand to complement black / gold / neon
// ─────────────────────────────────────────────────────────────────────────────
const EARTH_STYLE = `
  :root {
    --earth: #3F4F3C;
    --sand:  #C8B38A;
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// IMPROVEMENT #11 — Cinematic Intro Overlay
// Black screen → logo → motto → dissolve into site
// ─────────────────────────────────────────────────────────────────────────────
function CinematicIntro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<'logo' | 'motto' | 'out'>('logo')

  useEffect(() => {
    // Respect reduced-motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone(); return
    }
    // Skip on repeat visits this session
    if (sessionStorage.getItem('ukv-intro-seen')) {
      onDone(); return
    }
    sessionStorage.setItem('ukv-intro-seen', '1')

    const t1 = setTimeout(() => setPhase('motto'), 1400)
    const t2 = setTimeout(() => setPhase('out'),   3000)
    const t3 = setTimeout(onDone,                  4200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3) }
  }, [onDone])

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 99999,
        background: '#030303',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 24,
        opacity: phase === 'out' ? 0 : 1,
        transition: phase === 'out' ? 'opacity 1.1s ease' : 'none',
        pointerEvents: phase === 'out' ? 'none' : 'all',
      }}
    >
      {/* Logo word-mark */}
      <div
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.2rem, 7vw, 5rem)',
          fontWeight: 300,
          letterSpacing: '0.25em',
          color: 'var(--cream)',
          textTransform: 'uppercase',
          opacity: phase === 'logo' || phase === 'motto' ? 1 : 0,
          transform: phase === 'logo' || phase === 'motto' ? 'translateY(0)' : 'translateY(-8px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        Ubuntu
        <span style={{ color: 'var(--gold)' }}>.</span>
      </div>

      {/* Improvement #1 — motto below logo in intro */}
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(0.8rem, 1.5vw, 1.1rem)',
          letterSpacing: '0.12em',
          color: 'rgba(255,255,255,0.35)',
          opacity: phase === 'motto' ? 1 : 0,
          transform: phase === 'motto' ? 'translateY(0)' : 'translateY(6px)',
          transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
        }}
      >
        &ldquo;Refresh your soul, ground your spirit&rdquo;
      </p>

      {/* Thin neon pulse line */}
      <div
        style={{
          width: phase === 'motto' ? 80 : 0,
          height: 1,
          background: 'var(--neon)',
          opacity: 0.5,
          transition: 'width 1s ease 0.3s',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// IMPROVEMENT #14 — Global Ambient Background Layer
// Grain texture + very-low-opacity African geometric pattern (SVG inline)
// ─────────────────────────────────────────────────────────────────────────────
function AmbientBackground() {
  return (
    <>
      {/* Improvement #12: earth palette */}
      <style>{EARTH_STYLE}</style>

      {/* Fixed grain layer */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.028,
          mixBlendMode: 'soft-light',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px',
        }}
      />

      {/* Improvement #8 — Adinkra-inspired geometric pattern, 3% opacity */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.032,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(200,179,138,0.6)' stroke-width='0.5'%3E%3Crect x='10' y='10' width='40' height='40'/%3E%3Ccircle cx='30' cy='30' r='14'/%3E%3Cline x1='10' y1='10' x2='50' y2='50'/%3E%3Cline x1='50' y1='10' x2='10' y2='50'/%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Improvement #14 — slow drifting radial glow */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none',
          background: 'radial-gradient(circle at 50% 50%, rgba(0,255,65,0.04) 0%, transparent 65%)',
          animation: 'ambientDrift 18s ease-in-out infinite alternate',
        }}
      />

      {/* Grid overlay */}
      <div
        aria-hidden="true"
        style={{
          position: 'fixed', inset: 0, zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.1,
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='0.5'/%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px',
        }}
      />

      <style>{`
        @keyframes ambientDrift {
          0%   { background-position: 40% 40%; opacity: 0.5; }
          50%  { background-position: 60% 55%; opacity: 0.8; }
          100% { background-position: 45% 60%; opacity: 0.5; }
        }
      `}</style>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION SEPARATOR — Improvement #4
// ─────────────────────────────────────────────────────────────────────────────
function SectionSeparator({ glow = false }: { glow?: boolean }) {
  return (
    <div
      style={{
        height: 1,
        width: '100%',
        background: glow
          ? 'linear-gradient(90deg, transparent, rgba(212,168,83,0.18), transparent)'
          : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
        margin: 0,
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL HOOK (original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE — Improvement #9: luxury vocabulary
// ─────────────────────────────────────────────────────────────────────────────
function Marquee() {
  // Improvement #9: upgraded to luxury vocabulary
  const items = [
    'Living Heritage',
    'Ecological Luxury',
    'Farm Provenance',
    'Arohamai Ritual Spa',
    'Ubuntu Consciousness',
    'Regenerative Sanctuary',
    'Harvest Alchemy',
    'Pokomo Estate',
    'Fifty-Year Archive',
    'Moxie Intelligence',
  ]

  return (
    <div className="relative py-5 overflow-hidden border-t border-b border-white/5 bg-black/20">
      <div className="marquee-track flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-4 px-8">
            <span
              className="font-display italic text-lg font-light"
              style={{
                color: i % 3 === 0 ? 'var(--neon)' : i % 3 === 1 ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
              }}
            >
              {item}
            </span>
            <span className="text-[8px] text-white/10">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS STRIP (original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function StatsStrip() {
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const targets = [6, 24, 6, 50]
  const ref = useRef<HTMLDivElement>(null)
  const fired = useRef(false)

  useEffect(() => {
    if (!ref.current) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired.current) return
      fired.current = true
      targets.forEach((target, i) => {
        let start = 0
        const step = target / 40
        const timer = setInterval(() => {
          start += step
          if (start >= target) { start = target; clearInterval(timer) }
          setCounts(prev => {
            const updated = [...prev]; updated[i] = Math.floor(start); return updated
          })
        }, 30)
      })
      observer.disconnect()
    }, { threshold: 0.3 })
    observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const stats = [
    { label: 'Accommodation options', suffix: '',   color: 'var(--neon)' },
    { label: 'Animals tracked live',  suffix: '+',  color: 'var(--gold)' },
    { label: 'Master logs connected', suffix: '',   color: 'var(--neon)' },
    { label: 'Year audit retention',  suffix: 'yr', color: 'var(--gold)' },
  ]

  return (
    <div ref={ref} className="relative py-16 px-6 md:px-10 border-b border-white/5">
      <div className="max-w-8xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center md:items-start">
            <span
              className="font-display leading-none mb-2 font-light"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)', color: s.color }}
            >
              {counts[i]}{s.suffix}
            </span>
            <span className="font-body text-[9px] tracking-[0.2em] uppercase text-white/30 text-center md:text-left">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOTTO STRIP — Improvement #1: motto placed immediately after Hero
// ─────────────────────────────────────────────────────────────────────────────
function MottoStrip() {
  return (
    <div
      style={{
        padding: '56px 24px',
        textAlign: 'center',
        background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(63,79,60,0.06) 100%)',
      }}
    >
      <p
        className="reveal"
        style={{
          fontFamily: 'var(--font-display)',
          fontStyle: 'italic',
          fontSize: 'clamp(1rem, 2vw, 1.6rem)',
          letterSpacing: '0.1em',
          color: 'rgba(255,255,255,0.32)',
          fontWeight: 300,
          maxWidth: 680,
          margin: '0 auto',
          lineHeight: 1.7,
        }}
      >
        &ldquo;Refresh your soul,{' '}
        <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>ground your spirit</span>
        &rdquo;
      </p>
      <div
        className="reveal"
        style={{
          width: 48, height: 1,
          background: 'var(--neon)',
          opacity: 0.3,
          margin: '20px auto 0',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PHILOSOPHY — Improvement #6: ambient parallax motion, breathing room
// Improvement #3 + #13: more negative space, contrast
// ─────────────────────────────────────────────────────────────────────────────
function Philosophy() {
  const ref = useRef<HTMLDivElement>(null)
  const [offsetY, setOffsetY] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      setOffsetY(rect.top * 0.06)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={ref} className="relative py-40 px-6 md:px-10 overflow-hidden">
      {/* Improvement #6: animated ambient glow behind philosophy */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 60% 60% at 50% 50%, rgba(212,168,83,0.055) 0%, transparent 70%)',
          transform: `translateY(${offsetY}px)`,
          transition: 'transform 0.1s linear',
        }}
      />

      {/* Improvement #8: acacia silhouette SVG — very subtle */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', bottom: 0, right: '8%', opacity: 0.04, pointerEvents: 'none', height: '70%' }}
        viewBox="0 0 200 300" fill="var(--sand)"
      >
        {/* Simplified acacia silhouette */}
        <rect x="95" y="200" width="10" height="100" />
        <ellipse cx="100" cy="160" rx="80" ry="55" />
        <ellipse cx="60"  cy="175" rx="45" ry="30" />
        <ellipse cx="145" cy="170" rx="50" ry="28" />
        <ellipse cx="100" cy="130" rx="55" ry="35" />
      </svg>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex items-center gap-4 justify-center mb-20 reveal">
          <div className="h-[1px] w-16 bg-[var(--neon)] opacity-30" />
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-white/20">Our Philosophy</span>
          <div className="h-[1px] w-16 bg-[var(--neon)] opacity-30" />
        </div>

        {/* Improvement #5: Cormorant-style (--font-display) for emotional text */}
        <blockquote
          className="font-display italic leading-tight mb-12 reveal text-white"
          style={{ fontSize: 'clamp(1.8rem,5.5vw,4.5rem)', fontWeight: 300 }}
        >
          &ldquo;A living, breathing experience that celebrates{' '}
          <span className="text-grow">togetherness,</span>{' '}
          <span className="text-grow">creativity,</span> and{' '}
          <span className="text-grow" style={{ color: 'var(--gold)' }}>authenticity.</span>&rdquo;
        </blockquote>

        {/* Improvement #13: more breathing room, reduced tracking */}
        <p className="font-body text-[13px] leading-[2.1] reveal" style={{ color: 'rgba(255,255,255,0.3)', letterSpacing: '0.04em' }}>
          Rooted in the African philosophy of Ubuntu —{' '}
          <em className="font-display not-italic" style={{ color: 'rgba(255,255,255,0.5)', fontSize: '1.05rem' }}>
            &ldquo;Refresh your soul, ground your spirit&rdquo;
          </em>{' '}
          — our village is more than a destination. It is a community, a story, and a living system.
        </p>

        {/* Improvement #8: small Adinkra glyph ornament */}
        <div className="flex justify-center mt-14 reveal">
          <svg width="48" height="48" viewBox="0 0 48 48" fill="none" style={{ opacity: 0.18 }}>
            <circle cx="24" cy="24" r="20" stroke="var(--gold)" strokeWidth="0.6" />
            <circle cx="24" cy="24" r="10" stroke="var(--gold)" strokeWidth="0.6" />
            <line x1="4" y1="24" x2="44" y2="24" stroke="var(--gold)" strokeWidth="0.6" />
            <line x1="24" y1="4" x2="24" y2="44" stroke="var(--gold)" strokeWidth="0.6" />
            <circle cx="24" cy="24" r="3" fill="var(--gold)" opacity="0.4" />
          </svg>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED EXPERIENCES — Improvement #10: upgraded CTA language
// Improvement #13: more spacing
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedExperiences() {
  const experiences: Experience[] = [
    {
      title: 'Our Cottages',
      sub: 'Pokomo Cottages · Farmhouse Suites',
      href: '/cottages',
      accent: '#B8A9F0',
      emoji: '🌿',
      desc: '6 exclusive accommodations inside the living farm.',
      // Improvement #10: cinematic CTA language
      cta: 'Enter Estate',
    },
    {
      title: 'Arohamai Spa',
      sub: 'Ancient African therapies',
      href: '/spa',
      accent: '#F0A8B8',
      emoji: '✦',
      desc: 'Farm-sourced botanicals. 200m from field to treatment.',
      cta: 'Explore Rituals',
    },
    {
      title: 'Farm-to-Fork',
      sub: 'Live provenance dining',
      href: '/restaurant',
      accent: 'var(--gold)',
      emoji: '◉',
      desc: 'Every dish traced to a specific animal or field.',
      cta: 'View the Harvest',
    },
    {
      title: 'Living Farm',
      sub: 'FarmERP · Live data',
      href: '/farm',
      accent: 'var(--neon)',
      emoji: '⬡',
      desc: '24 animals. 6 fields. All tracked in real time.',
      cta: 'Open the Farm Log',
    },
  ]

  return (
    <section className="px-6 md:px-10 py-32">
      <div className="max-w-8xl mx-auto">
        {/* Improvement #13: generous heading space */}
        <div className="flex items-center gap-4 mb-20">
          <div className="h-[1px] flex-1 bg-white/5" />
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-white/25">Featured Experiences</span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {experiences.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              className="glass group relative overflow-hidden flex flex-col no-underline transition-all duration-300 hover:-translate-y-1"
              style={{ minHeight: 300 }}
            >
              <div
                className="absolute top-0 inset-x-0 h-[1px] opacity-55"
                style={{ background: `linear-gradient(90deg, transparent, ${exp.accent}, transparent)` }}
              />
              <span className="corner-tl" style={{ borderColor: `${exp.accent}55` }} />
              <span className="corner-br" style={{ borderColor: `${exp.accent}55` }} />

              <div className="p-8 flex flex-col flex-1">
                <span
                  className="font-display mb-5 text-[2.8rem] opacity-30 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ color: exp.accent }}
                >
                  {exp.emoji}
                </span>
                <h3 className="font-display text-white font-light text-2xl mb-1">{exp.title}</h3>
                <p
                  className="font-body text-[9px] tracking-wider uppercase mb-4"
                  style={{ color: exp.accent }}
                >
                  {exp.sub}
                </p>
                <p className="font-body text-[11px] leading-relaxed flex-1 text-white/40">{exp.desc}</p>

                {/* Improvement #10: cinematic CTA */}
                <div
                  className="flex items-center gap-2 mt-7 font-body text-[10px] tracking-wider uppercase transition-colors duration-300"
                  style={{ color: exp.accent }}
                >
                  <span>{exp.cta}</span>
                  <span style={{ transition: 'transform 0.3s' }} className="group-hover:translate-x-1 inline-block">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DIGITAL ARCHIVE — Improvement #7: cinematic copy, Improvement #6: ambient
// Improvement #2: "Events Log" concept absorbed into archive as "Events Ledger"
// ─────────────────────────────────────────────────────────────────────────────
function DigitalArchive() {
  const years = [2024, 2025, 2026, '∞'] as const

  const yearMeta: Record<string | number, { label: string; accent: string; cta: string }> = {
    2024: { label: 'Foundation Year',     accent: 'var(--sand)',  cta: 'Open Memory Archive' },
    2025: { label: 'Ecological Record',   accent: 'var(--neon)',  cta: 'View Ecological Record' },
    2026: { label: 'Events Ledger',       accent: 'var(--gold)',  cta: 'Enter Events Archive' },
    '∞':  { label: 'Living Heritage Log', accent: '#F0A8B8',      cta: 'Open the Ledger' },
  }

  return (
    <section className="border-t border-white/5 py-40 relative overflow-hidden">
      {/* Improvement #6: ambient glow behind archive */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 70% 50% at 80% 50%, rgba(63,79,60,0.12) 0%, transparent 65%)',
        }}
      />

      {/* Improvement #8: subtle geometric ornament */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', top: '10%', left: '3%', opacity: 0.055, pointerEvents: 'none' }}
        width="180" height="180" viewBox="0 0 180 180"
      >
        <polygon points="90,10 170,50 170,130 90,170 10,130 10,50" fill="none" stroke="var(--sand)" strokeWidth="0.8" />
        <polygon points="90,30 150,60 150,120 90,150 30,120 30,60" fill="none" stroke="var(--gold)" strokeWidth="0.4" />
        <circle cx="90" cy="90" r="30" fill="none" stroke="var(--gold)" strokeWidth="0.4" />
      </svg>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-start">

          {/* Left — Improvement #7: cinematic copy */}
          <div className="col-span-12 lg:col-span-4 lg:pr-8">
            <div className="flex items-center gap-3 mb-8">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', opacity: 0.6 }} />
              <span className="font-body text-[9px] tracking-[0.28em] uppercase text-white/25">Heritage System</span>
            </div>

            <h2
              className="font-display mb-7 text-white reveal"
              style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 300, lineHeight: 1.1, textTransform: 'uppercase', letterSpacing: '-0.01em' }}
            >
              The 50-Year<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Archive</em>
            </h2>

            {/* Improvement #7: deeper, more cinematic language */}
            <p
              className="font-body reveal"
              style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', lineHeight: 2, letterSpacing: '0.05em', maxWidth: 300 }}
            >
              A permanent memory of ecological restoration, ritual, and heritage — encoded for generations yet to walk this land. Not just data. A living inheritance.
            </p>

            <div className="mt-10 reveal">
              <Link
                href="/archive"
                className="inline-flex items-center gap-2 font-body text-[10px] tracking-[0.18em] uppercase"
                style={{ color: 'var(--gold)' }}
              >
                {/* Improvement #10: cinematic CTA */}
                Enter the Full Archive
                <span>→</span>
              </Link>
            </div>
          </div>

          {/* Right — Year tiles */}
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {years.map((year, i) => {
              const meta = yearMeta[year]
              return (
                <div
                  key={year}
                  className="group border border-white/5 p-8 hover:border-[var(--neon)]/25 transition-all duration-500 cursor-pointer relative overflow-hidden"
                  style={{
                    background: 'rgba(255,255,255,0.01)',
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  {/* Improvement #6: ambient hover glow */}
                  <div
                    style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: `radial-gradient(ellipse 80% 80% at 50% 50%, ${meta.accent}08 0%, transparent 70%)`,
                      opacity: 0,
                      transition: 'opacity 0.5s',
                    }}
                    className="group-hover:opacity-100"
                  />

                  {/* Scan-active indicator */}
                  <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="text-[var(--neon)] font-mono text-[8px] tracking-widest">SCAN_ACTIVE</span>
                  </div>

                  <span
                    className="font-mono text-[11px] transition-colors duration-300"
                    style={{ color: 'rgba(255,255,255,0.2)' }}
                  >
                    {year}
                  </span>

                  <p
                    className="mt-3 font-body text-[9px] uppercase tracking-[0.18em] transition-colors duration-300"
                    style={{ color: 'rgba(255,255,255,0.35)' }}
                  >
                    {meta.label}
                  </p>

                  {/* Improvement #7 + #10: cinematic CTA per tile */}
                  <p
                    className="mt-6 font-body text-[8px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300"
                    style={{ color: meta.accent }}
                  >
                    {meta.cta} →
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BENTO GRID — dynamic import (preserved)
// Improvement #2: "Gallery Log" renamed "Events Log" handled inside BentoGrid
// (pass prop so BentoGrid can rename if it reads from parent)
// ─────────────────────────────────────────────────────────────────────────────
const BentoGrid = dynamic(() => import('@/components/BentoGrid'))

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [introVisible, setIntroVisible] = useState(true)
  const handleIntroDone = useCallback(() => setIntroVisible(false), [])

  useReveal()

  useEffect(() => {
    import('./effects')
      .then(mod => {
        // @ts-ignore
        if (mod.initEffects) mod.initEffects()
      })
      .catch(err => console.error('Visual effects failed to load:', err))
  }, [])

  return (
    <>
      {/* Improvement #11 — Cinematic intro overlay */}
      {introVisible && <CinematicIntro onDone={handleIntroDone} />}

      <main
        className="relative min-h-screen overflow-x-hidden bg-[#080808]"
        style={{ opacity: introVisible ? 0 : 1, transition: 'opacity 0.6s ease' }}
      >
        {/* Improvement #14 + #8 + #12 — Ambient background layers */}
        <AmbientBackground />

        <div className="relative z-10">
          <Nav />

          {/* Hero */}
          <Hero />

          {/* Improvement #1 — Motto immediately after hero */}
          <MottoStrip />

          <SectionSeparator />

          {/* Marquee + Stats */}
          <section className="reveal">
            <Marquee />
            <StatsStrip />
          </section>

          <SectionSeparator glow />

          {/* Philosophy — Improvement #3: breathing room, ambient motion */}
          <section id="philosophy" className="reveal">
            <Philosophy />
          </section>

          <SectionSeparator />

          {/* Featured Experiences — Improvement #10: CTA language */}
          <section id="experiences" className="reveal">
            <FeaturedExperiences />
          </section>

          <SectionSeparator glow />

          {/* Live Farm Telemetry */}
          {/* Improvement #2: "Events Log" wording passed as prop; BentoGrid
              should render it as "Events Ledger" rather than "Gallery Log"    */}
          <section id="live-farm" className="reveal py-24 border-t border-white/5">
            <div className="container mx-auto px-6">
              <div className="flex items-center gap-4 mb-12">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
                <h3 className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--neon)]">
                  Live Farm Telemetry System
                </h3>
              </div>
              {/* Pass eventsLabel prop — BentoGrid can read it to rename
                  "Gallery Log" → "Events Ledger" without removing anything */}
              <BentoGrid eventsLabel="Events Ledger" />
            </div>
          </section>

          <SectionSeparator />

          {/* 50-Year Digital Archive — Improvement #7: cinematic copy */}
          <section className="reveal">
            <DigitalArchive />
          </section>

          <SectionSeparator glow />

          <Footer />
        </div>

        {/* Interface overlays */}
        <MoxieChat className="glass-panel" />
        <CookieConsent />
        <CartPanel />
      </main>
    </>
  )
}