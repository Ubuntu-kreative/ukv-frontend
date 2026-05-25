/**
 * app/page.tsx — Ubuntu Kreative Village  [PRODUCTION-FINAL]
 *
 * This file is intentionally a SERVER COMPONENT (no 'use client').
 * The only client code on this page lives in four isolated leaf components:
 *
 *   ClientShell         — installs the one-time IntersectionObserver for reveals
 *   StatsStrip          — rAF counter animation
 *   FeaturedExperiences — hover-prefetch router interaction
 *   BentoGridClient     — live telemetry (dynamic, ssr:false) via client wrapper
 *
 * All other sections (AmbientBackground, Marquee, MottoStrip, Philosophy,
 * DigitalArchive, SectionSeparator) are pure Server Components — they emit
 * HTML with zero client JS.
 */

// ─── NEXT.JS METADATA (server-only export) ───────────────────────────────────
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title:       'Ubuntu Kreative Village — Refresh your soul, ground your spirit',
  description: 'A living, breathing sanctuary rooted in the African philosophy of Ubuntu. Cottages, spa, farm-to-fork dining, and living farm telemetry.',
  openGraph: {
    title:       'Ubuntu Kreative Village',
    description: 'Ecological luxury. Farm provenance. Ubuntu consciousness.',
    type:        'website',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Ubuntu Kreative Village',
  },
}

// ─── SERVER COMPONENT IMPORTS ────────────────────────────────────────────────
import type { CSSProperties } from 'react'
import { Suspense }           from 'react'
import Link                   from 'next/link'

import NavWrapper    from '@/components/NavWrapper'
import Hero          from '@/components/Hero'
import Footer        from '@/components/Footer'
import CookieConsent from '@/components/CookieConsent'

// ─── CLIENT LEAF IMPORTS ─────────────────────────────────────────────────────
// Each is a dedicated 'use client' file — the server component tree is clean.
import ClientShell         from '@/components/home/ClientShell'
import StatsStrip          from '@/components/home/StatsStrip'
import SustainabilityMetrics from '@/components/SustainabilityMetrics'
import CulturalStorytelling from '@/components/CulturalStorytelling'
import FeaturedExperiences from '@/components/home/FeaturedExperiences'
import BentoGridClient     from '@/components/home/BentoGridClient'

// ─── STATIC DATA  (module-level — allocated once at build time) ───────────────

const MARQUEE_ITEMS = [
  'Living Heritage', 'Ecological Luxury', 'Farm Provenance',
  'Arohamai Ritual Spa', 'Ubuntu Consciousness', 'Regenerative Sanctuary',
  'Harvest Alchemy', 'Pokomo Estate', 'Fifty-Year Archive', 'Moxie Intelligence',
]
// Pre-computed — server never runs a ternary per item at runtime
const MARQUEE_COLOURS = MARQUEE_ITEMS.flatMap((_, i) => [
  i % 3 === 0 ? 'var(--neon)' : i % 3 === 1 ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
  i % 3 === 0 ? 'var(--neon)' : i % 3 === 1 ? 'var(--gold)' : 'rgba(255,255,255,0.2)',
])
const MARQUEE_DOUBLED = [...MARQUEE_ITEMS, ...MARQUEE_ITEMS]

const ARCHIVE_YEARS = [2024, 2025, 2026, '∞'] as const
const ARCHIVE_META: Record<string | number, { label: string }> = {
  2024: { label: 'Foundation Year'     },
  2025: { label: 'Ecological Record'   },
  2026: { label: 'Events Ledger'       },
  '∞':  { label: 'Living Heritage Log' },
}

// ─── STABLE STYLE CONSTANTS ──────────────────────────────────────────────────
// All style objects are module-level constants — React sees the same reference
// every render and skips diffing entirely.

const NOISE_BG = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
const GRID_BG  = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='rgba(200,179,138,0.6)' stroke-width='0.5'%3E%3Crect x='10' y='10' width='40' height='40'/%3E%3Ccircle cx='30' cy='30' r='14'/%3E%3Cline x1='10' y1='10' x2='50' y2='50'/%3E%3Cline x1='50' y1='10' x2='10' y2='50'/%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/svg%3E")`
const MESH_BG  = `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='rgba(255,255,255,0.03)' stroke-width='0.5'/%3E%3C/svg%3E")`

// FIX-05: translateZ(0) + willChange moves divs to dedicated GPU compositor layer
const AMBIENT_STYLES: CSSProperties[] = [
  { position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.028, mixBlendMode:'soft-light', backgroundImage:NOISE_BG, backgroundSize:'180px', willChange:'transform', transform:'translateZ(0)' },
  { position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.032, backgroundImage:GRID_BG,   backgroundSize:'60px 60px', willChange:'transform', transform:'translateZ(0)' },
  { position:'fixed', inset:0, zIndex:0, pointerEvents:'none', background:'radial-gradient(circle at 50% 50%, rgba(0,255,65,0.04) 0%, transparent 65%)', willChange:'transform', transform:'translateZ(0)' },
  { position:'fixed', inset:0, zIndex:0, pointerEvents:'none', opacity:0.1, backgroundImage:MESH_BG, backgroundSize:'40px 40px', willChange:'transform', transform:'translateZ(0)' },
]

const SEP_PLAIN: CSSProperties = { height:1, width:'100%', background:'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)', margin:0 }
const SEP_GLOW:  CSSProperties = { height:1, width:'100%', background:'linear-gradient(90deg, transparent, rgba(212,168,83,0.18), transparent)', margin:0 }

const MOTTO_WRAP:  CSSProperties = { padding:'56px 24px', textAlign:'center', background:'linear-gradient(180deg,rgba(0,0,0,0) 0%,rgba(63,79,60,0.06) 100%)' }
const MOTTO_TEXT:  CSSProperties = { fontFamily:'var(--font-display)', fontStyle:'italic', fontSize:'clamp(1rem,2vw,1.6rem)', letterSpacing:'0.1em', color:'rgba(255,255,255,0.32)', fontWeight:300, maxWidth:680, margin:'0 auto', lineHeight:1.7 }
const MOTTO_LINE:  CSSProperties = { width:48, height:1, background:'var(--neon)', opacity:0.3, margin:'20px auto 0' }
const DOT_STYLE:   CSSProperties = { width:8, height:8, borderRadius:'50%', background:'var(--gold)', display:'inline-block', opacity:0.6 }

// ─────────────────────────────────────────────────────────────────────────────
// SERVER COMPONENTS — emit static HTML, zero client JS
// ─────────────────────────────────────────────────────────────────────────────

function AmbientBackground() {
  return (
    <>
      {AMBIENT_STYLES.map((s, i) => (
        <div key={i} aria-hidden="true" style={s} />
      ))}
    </>
  )
}

function SectionSeparator({ glow = false }: { glow?: boolean }) {
  return <div style={glow ? SEP_GLOW : SEP_PLAIN} />
}

function Marquee() {
  return (
    <div className="relative py-5 overflow-hidden border-t border-b border-white/5 bg-black/20">
      <div className="marquee-track flex whitespace-nowrap">
        {MARQUEE_DOUBLED.map((item, i) => (
          <span key={`m-${i}`} className="flex items-center gap-4 px-8">
            <span className="font-display italic text-lg font-light" style={{ color: MARQUEE_COLOURS[i] }}>
              {item}
            </span>
            <span className="text-[8px] text-white/10">◆</span>
          </span>
        ))}
      </div>
    </div>
  )
}

function MottoStrip() {
  return (
    <div style={MOTTO_WRAP}>
      <p className="reveal" style={MOTTO_TEXT}>
        &ldquo;Refresh your soul,{' '}
        <span style={{ color:'var(--gold)', fontStyle:'normal' }}>ground your spirit</span>
        &rdquo;
      </p>
      <div className="reveal" style={MOTTO_LINE} />
    </div>
  )
}

function Philosophy() {
  return (
    <section className="relative py-40 px-6 md:px-10 overflow-hidden cv-auto">
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <div className="flex items-center gap-4 justify-center mb-20 reveal">
          <div className="h-[1px] w-16 bg-[var(--neon)] opacity-30" />
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-white/20">Our Philosophy</span>
          <div className="h-[1px] w-16 bg-[var(--neon)] opacity-30" />
        </div>
        <blockquote
          className="font-display italic leading-tight mb-12 reveal text-white"
          style={{ fontSize:'clamp(1.8rem,5.5vw,4.5rem)', fontWeight:300 }}
        >
          &ldquo;A living, breathing experience that celebrates{' '}
          <span className="text-grow">togetherness,</span>{' '}
          <span className="text-grow">creativity,</span> and{' '}
          <span className="text-grow" style={{ color:'var(--gold)' }}>authenticity.</span>&rdquo;
        </blockquote>
        <p
          className="font-body text-[15px] leading-[2] reveal max-w-[720px]"
          style={{ color:'rgba(255,255,255,0.58)', letterSpacing:'0.015em', fontWeight:300 }}
        >
          Rooted in the African philosophy of Ubuntu —{' '}
          <em className="font-display italic" style={{ color:'rgba(255,255,255,0.82)', fontSize:'1.08rem', fontWeight:400 }}>
            &ldquo;Refresh your soul, ground your spirit&rdquo;
          </em>{' '}
          — our village is more than a destination. It is a community, a story, and a living system.
        </p>
      </div>
    </section>
  )
}

function DigitalArchive() {
  return (
    <section className="border-t border-white/5 py-40 relative overflow-hidden cv-auto">
      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-12 gap-8 items-start">

          <div className="col-span-12 lg:col-span-4 lg:pr-8">
            <div className="flex items-center gap-3 mb-8">
              <span style={DOT_STYLE} />
              <span className="font-body text-[9px] tracking-[0.28em] uppercase text-white/25">Heritage System</span>
            </div>
            <h2
              className="font-display mb-7 text-white reveal"
              style={{ fontSize:'clamp(2.2rem,4.5vw,3.6rem)', fontWeight:300, lineHeight:1.1, textTransform:'uppercase' }}
            >
              The 50-Year<br />
              <em style={{ color:'var(--gold)', fontStyle:'normal' }}>Archive</em>
            </h2>
            <p className="font-body reveal" style={{ color:'rgba(255,255,255,0.35)', fontSize:'12px', lineHeight:2, maxWidth:300 }}>
              A permanent memory of ecological restoration, ritual, and heritage — encoded for generations yet to walk this land.
            </p>
          </div>

          <div className="col-span-12 lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-4">
            {ARCHIVE_YEARS.map((year) => (
              <div key={year} className="group border border-white/5 p-8 bg-white/[0.01] cursor-pointer relative overflow-hidden">
                <span className="font-mono text-[11px] text-white/20">{year}</span>
                <p className="mt-3 font-body text-[9px] uppercase tracking-[0.18em] text-white/40">
                  {ARCHIVE_META[year].label}
                </p>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE — Server Component root
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#080808]">

      {/* Decorative fixed layers — pure HTML, zero JS */}
      <AmbientBackground />

      {/* Installs the one-time IntersectionObserver for .reveal elements */}
      <ClientShell />

      <div className="relative z-10">

        {/* ── ABOVE THE FOLD ── */}
        <NavWrapper />
        <Hero />

        {/* ── BELOW THE FOLD ── */}

        <div className="cv-auto">
          <MottoStrip />
        </div>

        <SectionSeparator />

        <section className="reveal cv-auto">
          <Marquee />
          {/*
            StatsStrip uses useState/useEffect — it never throws a promise,
            so no Suspense wrapper needed. Shows zeros on first paint,
            then animates when scrolled into view.
          */}
          <StatsStrip />
          
          {/* Sustainability metrics */}
          <div className="mt-12">
            <SustainabilityMetrics />
          </div>
        </section>

        <SectionSeparator glow />

        <section id="philosophy" className="reveal">
          <Philosophy />
        </section>

        <SectionSeparator />

        {/* Cultural storytelling */}
        <section className="reveal">
          <CulturalStorytelling />
        </section>

        <SectionSeparator />

        <FeaturedExperiences />

        <SectionSeparator glow />

        {/* Live telemetry — fully code-split via BentoGridClient (ssr:false) */}
        <section id="live-farm" className="reveal py-24 border-t border-white/5 cv-auto">
          <div className="container mx-auto px-6">
            <div className="flex items-center gap-4 mb-12">
              {/* pulse-opacity: compositor-safe, only animates opacity */}
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--neon)] pulse-opacity" />
              <h3 className="font-mono text-[10px] uppercase tracking-[0.5em] text-[var(--neon)]">
                Live Farm Telemetry System
              </h3>
            </div>
            {/*
              Suspense IS correct here — BentoGridClient wraps a dynamic() import
              which is React.lazy under the hood and can suspend.
            */}
            <Suspense fallback={
              <div style={{
                minHeight: 600, display:'flex', alignItems:'center', justifyContent:'center',
                opacity: 0.2, fontFamily:'var(--font-body)', fontSize:'9px',
                letterSpacing:'0.3em', textTransform:'uppercase', color:'rgba(0,255,65,0.5)',
              }}>
                Loading live data…
              </div>
            }>
              <BentoGridClient eventsLabel="Events Ledger" />
            </Suspense>
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
      {/* CartPanel lives in layout.tsx — not here */}

    </main>
  )
}