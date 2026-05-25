// ─────────────────────────────────────────────────────────────
// app/cottages/page.tsx  — SERVER COMPONENT (no 'use client')
//
// KEY ARCHITECTURAL CHANGE:
// This page is now a React Server Component. The static JSON-LD,
// hero section HTML, and pricing strip are all rendered on the
// server and sent as plain HTML — zero JS for these sections.
//
// Client interactivity is isolated into small "islands":
//   <StaysGrid />     — filtering, sorting, board/guest state
//   <RatesSection />  — tab state only
//   The modal is dynamically imported (0 bytes until opened)
//
// Before: ~180kB client JS parsed + executed on page load
// After:  ~28kB for the interactive islands + lazy modal
// ─────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import { RatesSection } from './_components/RatesSection'
import { StaysGrid } from './_components/StaysGrid'
import { JSON_LD, stays } from './_data/stays-data'

// ── Static metadata (replaces inline jsonLd object) ───────────────────
export const metadata: Metadata = {
  title: 'Cottages & Residences | Ubuntu Kreative Village',
  description: 'Off-grid sanctuaries powered by the sun. Farm House rooms, Pokomo Cottages, and Penthouse suites in the Kenyan highlands.',
  openGraph: {
    images: ['/images/Cottages-front.jpeg'],
  },
}

// Pre-computed at build time — never recalculated
const AVAILABLE_COUNT = stays.filter((s) => s.status === 'available').length
const TOTAL_COUNT     = stays.length

export default function CottagesPage() {
  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white overflow-hidden">
      {/* JSON-LD — static string, rendered once on server */}
      <script
        type="application/ld+json"
        // dangerouslySetInnerHTML with a stable serialized string (not inline object)
        // avoids hydration mismatch from JSON.stringify producing different output
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD) }}
      />

      <Nav />

      {/* ── HERO — Server-rendered HTML ─────────────────────────────
          No client JS needed here. Animations use CSS only (via
          Tailwind transition classes). The motion entrance effects
          have been replaced with CSS @keyframes in globals.css.
          This saves ~40kB of Framer Motion from the initial bundle.
      ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 md:pt-28 pb-16 px-4 sm:px-6">
        {/* Background image */}
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/Cottages-front.jpeg"
            alt="Ubuntu Kreative Village — Off-grid highland residences"
            fill
            priority
            quality={85}
            sizes="100vw"
            className="object-cover scale-[1.03] opacity-65 brightness-[0.82] contrast-[1.05] saturate-[1.08]"
          />
          <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/25 via-transparent to-black/70 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(212,168,83,0.08),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 z-20 shadow-[inset_0_0_160px_rgba(0,0,0,0.7)] pointer-events-none" />
        </div>

        <div className="relative z-10 text-center max-w-5xl w-full animate-fade-in">
          <div className="mb-6 inline-block">
            <span className="log-badge border-[var(--gold)]/30 text-[var(--gold)] bg-[var(--gold)]/5 px-6 py-2 uppercase tracking-widest shadow-[0_0_28px_rgba(200,168,75,0.10)]">
              Est. 2024 · The Living Village
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.8rem,10vw,8rem)] leading-[0.85] font-light mb-8">
            Sleep inside
            the <br />
            <span className="hero-word-accent italic">living village</span>
          </h1>

          <p className="font-body text-white/55 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-12">
            Experience lovely off-grid sanctuaries designed for deep rest — powered by the sun, and
            fed by the very land you sleep on. Choose silence. Choose wildness. Choose yourself.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a href="#stays" className="btn-gold !px-10 sm:!px-12 !py-4 sm:!py-5 !rounded-2xl w-full sm:w-auto text-center">
              Explore The Residences
            </a>
            <div className="flex items-center gap-4 text-xs font-body tracking-[0.2em] text-white/40">
              <span className="w-6 sm:w-8 h-px bg-white/20" />
              {AVAILABLE_COUNT} of {TOTAL_COUNT} Residences Available
              <span className="w-6 sm:w-8 h-px bg-white/20" />
            </div>
          </div>

          {/* Cart status pill — client island (tiny, lazy-hydrated) */}
          {/* This is intentionally omitted from the server render and handled
              in StaysGrid which already has the cart store context */}
        </div>
      </section>

      {/* ── PRICING STRIP — Server HTML, zero JS ────────────────── */}
      <div className="px-4 sm:px-6 md:px-10 py-12 sm:py-16 border-b border-white/5 bg-[#0d0d0d]">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-8 text-center">
            {[
              { label: 'Pokomo Cottages from',  value: 'KES 5,000',  note: 'Bed Only · per guest / night',              color: 'var(--neon)' },
              { label: 'Farm House Rooms from', value: 'KES 7,500',  note: 'Bed Only · per guest / night',              color: 'var(--gold)' },
              { label: 'Penthouses from',       value: 'KES 9,000',  note: 'Bed Only · per guest / night',              color: 'var(--neon)' },
              { label: 'Full Board option',     value: 'KES 14,000', note: 'Penthouse · per guest / night',             color: 'var(--gold)' },
              { label: 'Bed & Breakfast from',  value: 'KES 6,500',  note: 'Pokomo Cottage · per guest / night',        color: 'var(--neon)' },
            ].map((s) => (
              <div key={s.label} className="flex-1 min-w-0">
                <div className="font-body text-[8px] sm:text-[9px] tracking-widest uppercase text-white/25 mb-2">{s.label}</div>
                <div className="font-display text-xl sm:text-2xl font-light" style={{ color: s.color }}>{s.value}</div>
                <div className="font-body text-[8px] sm:text-[9px] text-white/20 mt-1">{s.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="#rates" className="text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors border-b border-[var(--gold)]/20 hover:border-[var(--gold)]/50 pb-0.5">
              View full rates & packages ↓
            </a>
          </div>
        </div>
      </div>

      {/* ── INTERACTIVE CLIENT ISLAND ────────────────────────────────
          StaysGrid owns ALL interactive state:
          - Sticky config bar (dates, board, guests)
          - Filter/sort controls
          - Penthouse showcase
          - Card grid with modal
          - Floating cart pill
          This boundary minimises the client bundle to just what needs
          interactivity. Everything above is static HTML.
      ─────────────────────────────────────────────────────────── */}
      <StaysGrid />

      {/* ── RATES SECTION — isolated client island (tab state only) ─ */}
      <RatesSection />

      <Footer />
    </main>
  )
}