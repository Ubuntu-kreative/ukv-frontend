'use client'

/**
 * page.tsx (HomePage) — Ubuntu Kreative Village
 *
 * BUGS FIXED:
 *
 * 1. CARTPANEL MOUNTED TWICE — CRITICAL
 *    layout.tsx already renders <CartPanel /> inside <CartProvider>.
 *    This page was also rendering <CartPanel />, causing:
 *    - Two cart panels in the DOM
 *    - Two sets of Zustand store subscriptions
 *    - React tree reconciliation conflicts
 *    Fix: removed CartPanel from this page entirely.
 *
 * 2. STATSSTRIP INTERVAL LEAK
 *    The `timers` array was populated inside the IntersectionObserver callback
 *    but the cleanup `return () => { timers.forEach(clearInterval) }` ran
 *    BEFORE the observer fired (i.e. the array was empty at cleanup time).
 *    Fix: store timers in a ref so cleanup always sees the current list.
 *
 * 3. BENTOGRID LAYOUT SHIFT
 *    BentoGrid loaded with dynamic(ssr:false) had no loading placeholder,
 *    causing a large CLS (Cumulative Layout Shift) when it hydrated.
 *    Fix: added a minimal height placeholder as the fallback.
 *
 * 4. CINEMATIC INTRO — REMOVED FROM RENDER TREE
 *    The component was never shown (introVisible always false) but was still
 *    being imported, adding to bundle weight and sessionStorage reads.
 *    Fix: fully removed. Re-enable by restoring the commented block.
 *
 * 5. FEATUREDEXPERIENCES LINKS — prefetch={false}
 *    4 eager prefetches on page load for /cottages, /spa, /restaurant, /farm.
 *    Fix: prefetch={false} on all four.
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import Nav          from '@/components/Nav'
import Hero         from '@/components/Hero'
import Footer       from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'
// CartPanel is already mounted in layout.tsx — DO NOT mount it here again.

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Experience {
  title:  string
  sub:    string
  href:   string
  accent: string
  emoji:  string
  desc:   string
  cta:    string
}

const EARTH_STYLE = `
  :root {
    --earth: #3F4F3C;
    --sand:  #C8B38A;
  }
`

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT BACKGROUND
// ─────────────────────────────────────────────────────────────────────────────
function AmbientBackground() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: EARTH_STYLE }} />
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.028, mixBlendMode: 'soft-light', backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`, backgroundSize: '180px' }} />
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.032, backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(200,179,138,0.6)' stroke-width='0.5'%3E%3Crect x='10' y='10' width='40' height='40'/%3E%3Ccircle cx='30' cy='30' r='14'/%3E%3Cline x1='10' y1='10' x2='50' y2='50'/%3E%3Cline x1='50' y1='10' x2='10' y2='50'/%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', background: 'radial-gradient(circle at 50% 50%, rgba(0,255,65,0.04) 0%, transparent 65%)' }} />
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', opacity: 0.1, backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='0.5'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }} />
    </>
  )
}

function SectionSeparator({ glow = false }: { glow?: boolean }) {
  return (
    <div style={{ height: 1, width: '100%', background: glow ? 'linear-gradient(90deg, transparent, rgba(212,168,83,0.18), transparent)' : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', margin: 0 }} />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// REVEAL HOOK
// ─────────────────────────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right')
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )
    els.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])
}

// ─────────────────────────────────────────────────────────────────────────────
// MARQUEE
// ─────────────────────────────────────────────────────────────────────────────
const MARQUEE_ITEMS = [
  'Living Heritage', 'Ecological Luxury', 'Farm Provenance',
  'Arohamai Ritual Spa', 'Ubuntu Consciousness', 'Regenerative Sanctuary',
  'Harvest Alchemy', 'Pokomo Estate', 'Fifty-Year Archive', 'Moxie Intelligence',
]

function Marquee() {
  return (
    <div className="relative py-5 overflow-hidden border-t border-b border-white/5 bg-black/20">
      <div className="marquee-track flex whitespace-nowrap">
        {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
          <span key={`${item}-${i}`} className="flex items-center gap-4 px-8">
            <span className="font-display italic text-lg font-light" style={{ color: i % 3 === 0 ? 'var(--neon)' : i % 3 === 1 ? 'var(--gold)' : 'rgba(255,255,255,0.2)' }}>
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
// STATS STRIP
// FIX: timers stored in a ref so the cleanup function always sees the current
// list regardless of when React decides to run the cleanup.
// ─────────────────────────────────────────────────────────────────────────────
const STATS_TARGETS = [6, 24, 6, 50]
const STATS_META = [
  { label: 'Accommodation options', suffix: '',   color: 'var(--neon)' },
  { label: 'Animals tracked live',  suffix: '+',  color: 'var(--gold)' },
  { label: 'Master logs connected', suffix: '',   color: 'var(--neon)' },
  { label: 'Year audit retention',  suffix: 'yr', color: 'var(--gold)' },
]

function StatsStrip() {
  const [counts, setCounts] = useState([0, 0, 0, 0])
  const elRef   = useRef<HTMLDivElement>(null)
  const fired   = useRef(false)
  // FIX: store intervals in a ref so cleanup always has the full list
  const timers  = useRef<ReturnType<typeof setInterval>[]>([])

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting || fired.current) return
      fired.current = true

      STATS_TARGETS.forEach((target, i) => {
        let start = 0
        const step = target / 40
        const timer = setInterval(() => {
          start = Math.min(start + step, target)
          setCounts(prev => {
            const next = [...prev]
            next[i] = Math.floor(start)
            return next
          })
          if (start >= target) clearInterval(timer)
        }, 30)
        timers.current.push(timer) // ← ref, always accessible in cleanup
      })
      observer.disconnect()
    }, { threshold: 0.3 })

    observer.observe(el)

    return () => {
      observer.disconnect()
      // FIX: timers.current is the ref — always populated regardless of timing
      timers.current.forEach(clearInterval)
      timers.current = []
    }
  }, [])

  return (
    <div ref={elRef} className="relative py-16 px-6 md:px-10 border-b border-white/5">
      <div className="max-w-8xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS_META.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center md:items-start">
            <span className="font-display leading-none mb-2 font-light" style={{ fontSize: 'clamp(3rem,6vw,5rem)', color: s.color }}>
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
// MOTTO STRIP
// ─────────────────────────────────────────────────────────────────────────────
function MottoStrip() {
  return (
    <div style={{ padding: '56px 24px', textAlign: 'center', background: 'linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(63,79,60,0.06) 100%)' }}>
      <p className="reveal" style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(1rem, 2vw, 1.6rem)', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.32)', fontWeight: 300, maxWidth: 680, margin: '0 auto', lineHeight: 1.7 }}>
        &ldquo;Refresh your soul,{' '}
        <span style={{ color: 'var(--gold)', fontStyle: 'normal' }}>ground your spirit</span>
        &rdquo;
      </p>
      <div className="reveal" style={{ width: 48, height: 1, background: 'var(--neon)', opacity: 0.3, margin: '20px auto 0' }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PHILOSOPHY
// ─────────────────────────────────────────────────────────────────────────────
function Philosophy() {
  return (
    <section className="relative py-40 px-6 md:px-10 overflow-hidden">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex items-center gap-4 justify-center mb-20 reveal">
          <div className="h-[1px] w-16 bg-[var(--neon)] opacity-30" />
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-white/20">Our Philosophy</span>
          <div className="h-[1px] w-16 bg-[var(--neon)] opacity-30" />
        </div>
        <blockquote className="font-display italic leading-tight mb-12 reveal text-white" style={{ fontSize: 'clamp(1.8rem,5.5vw,4.5rem)', fontWeight: 300 }}>
          &ldquo;A living, breathing experience that celebrates{' '}
          <span className="text-grow">togetherness,</span>{' '}
          <span className="text-grow">creativity,</span> and{' '}
          <span className="text-grow" style={{ color: 'var(--gold)' }}>authenticity.</span>&rdquo;
        </blockquote>
        <p className="font-body text-[15px] leading-[2] reveal max-w-[720px]" style={{ color: 'rgba(255,255,255,0.58)', letterSpacing: '0.015em', fontWeight: 300 }}>
          Rooted in the African philosophy of Ubuntu —{' '}
          <em className="font-display italic" style={{ color: 'rgba(255,255,255,0.82)', fontSize: '1.08rem', fontWeight: 400 }}>
            "Refresh your soul, ground your spirit"
          </em>{' '}
          — our village is more than a destination. It is a community, a story, and a living system.
        </p>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED EXPERIENCES
// FIX: prefetch={false} on all links — prevents 4 simultaneous route prefetches
// on page load that were consuming bandwidth and CPU during the first paint.
// ─────────────────────────────────────────────────────────────────────────────
const EXPERIENCES: Experience[] = [
  { title: 'Our Cottages', sub: 'Pokomo Cottages · Farmhouse Suites', href: '/cottages', accent: '#B8A9F0', emoji: '🌿', desc: '6 exclusive accommodations inside the living farm.', cta: 'Enter Estate' },
  { title: 'Arohamai Spa', sub: 'Ancient African therapies', href: '/spa',      accent: '#F0A8B8',    emoji: '✦', desc: 'Farm-sourced botanicals. 200m from field to treatment.', cta: 'Explore Rituals' },
  { title: 'Farm-to-Fork', sub: 'Live provenance dining',    href: '/restaurant', accent: 'var(--gold)', emoji: '◉', desc: 'Every dish traced to a specific animal or field.', cta: 'View the Harvest' },
  { title: 'Living Farm',  sub: 'FarmERP · Live data',       href: '/farm',     accent: 'var(--neon)', emoji: '⬡', desc: '24 animals. 6 fields. All tracked in real time.', cta: 'Open the Farm Log' },
]

function FeaturedExperiences() {
  return (
    <section className="px-6 md:px-10 py-32">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center gap-4 mb-20">
          <div className="h-[1px] flex-1 bg-white/5" />
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-white/25">Featured Experiences</span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIENCES.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              prefetch={false}
              className="glass group relative overflow-hidden flex flex-col no-underline transition-all duration-300 hover:-translate-y-1"
              style={{ minHeight: 300 }}
            >
              <div className="absolute top-0 inset-x-0 h-[1px] opacity-55" style={{ background: `linear-gradient(90deg, transparent, ${exp.accent}, transparent)` }} />
              <span className="corner-tl" style={{ borderColor: `${exp.accent}55` }} />
              <span className="corner-br" style={{ borderColor: `${exp.accent}55` }} />
              <div className="p-8 flex flex-col flex-1">
                <span className="font-display mb-5 text-[2.8rem] opacity-30" style={{ color: exp.accent }}>{exp.emoji}</span>
                <h3 className="font-display text-white font-light text-2xl mb-1">{exp.title}</h3>
                <p className="font-body text-[9px] tracking-wider uppercase mb-4" style={{ color: exp.accent }}>{exp.sub}</p>
                <p className="font-body text-[11px] leading-relaxed flex-1 text-white/40">{exp.desc}</p>
                <div className="flex items-center gap-2 mt-7 font-body text-[10px] tracking-wider uppercase" style={{ color: exp.accent }}>
                  <span>{exp.cta}</span><span>→</span>
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
// DIGITAL ARCHIVE
// ─────────────────────────────────────────────────────────────────────────────
const ARCHIVE_YEARS = [2024, 2025, 2026, '∞'] as const
const ARCHIVE_META: Record<string | number, { label: string; accent: string }> = {
  2024: { label: 'Foundation Year',     accent: 'var(--sand)' },
  2025: { label: 'Ecological Record',   accent: 'var(--neon)' },
  2026: { label: 'Events Ledger',       accent: 'var(--gold)' },
  '∞':  { label: 'Living Heritage Log', accent: '#F0A8B8'     },
}

function DigitalArchive() {
  return (
    <section className="border-t border-white/5 py-40 relative overflow-hidden">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-start">
          <div className="col-span-12 lg:col-span-4 lg:pr-8">
            <div className="flex items-center gap-3 mb-8">
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--gold)', display: 'inline-block', opacity: 0.6 }} />
              <span className="font-body text-[9px] tracking-[0.28em] uppercase text-white/25">Heritage System</span>
            </div>
            <h2 className="font-display mb-7 text-white reveal" style={{ fontSize: 'clamp(2.2rem, 4.5vw, 3.6rem)', fontWeight: 300, lineHeight: 1.1, textTransform: 'uppercase' }}>
              The 50-Year<br />
              <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Archive</em>
            </h2>
            <p className="font-body reveal" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', lineHeight: 2, maxWidth: 300 }}>
              A permanent memory of ecological restoration, ritual, and heritage — encoded for generations yet to walk this land.
            </p>
          </div>
          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {ARCHIVE_YEARS.map((year) => (
              <div key={year} className="group border border-white/5 p-8 bg-white/[0.01] cursor-pointer relative overflow-hidden">
                <span className="font-mono text-[11px] text-white/20">{year}</span>
                <p className="mt-3 font-body text-[9px] uppercase tracking-[0.18em] text-white/40">{ARCHIVE_META[year].label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BENTO GRID — dynamic import with placeholder
// FIX: added fallback placeholder to prevent CLS (Cumulative Layout Shift)
// when BentoGrid hydrates after the initial paint.
// ─────────────────────────────────────────────────────────────────────────────
const BentoGrid = dynamic(
  () => import('@/components/BentoGrid'),
  {
    ssr: false,
    loading: () => (
      <div style={{
        minHeight: 600,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.2,
        fontFamily: 'var(--font-body)',
        fontSize: '9px',
        letterSpacing: '0.3em',
        textTransform: 'uppercase',
        color: 'rgba(0,255,65,0.5)',
      }}>
        Loading live data...
      </div>
    ),
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// HOME PAGE — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  useReveal()

  return (
    // NOTE: CartPanel is intentionally NOT rendered here.
    // It is already mounted in layout.tsx inside <CartProvider>.
    // Mounting it here was causing duplicate panels and double subscriptions.
    <main className="relative min-h-screen overflow-x-hidden bg-[#080808]" style={{ opacity: 1 }}>
      <AmbientBackground />

      <div className="relative z-10">
        <Nav />
        <Hero />
        <MottoStrip />
        <SectionSeparator />

        <section className="reveal">
          <Marquee />
          <StatsStrip />
        </section>

        <SectionSeparator glow />

        <section id="philosophy" className="reveal">
          <Philosophy />
        </section>

        <SectionSeparator />
        <FeaturedExperiences />
        <SectionSeparator glow />

        <section id="live-farm" className="reveal py-24 border-t border-white/5">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
              <h3 className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--neon)]">
                Live Farm Telemetry System
              </h3>
            </div>
            <BentoGrid eventsLabel="Events Ledger" />
          </div>
        </section>

        <SectionSeparator />

        <section className="reveal">
          <DigitalArchive />
        </section>

        <SectionSeparator glow />
        <Footer />
      </div>

      <CookieConsent />
      {/* CartPanel rendered by layout.tsx — removed from here */}
    </main>
  )
}