/**
 * app/spa/page.tsx — SERVER COMPONENT
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BUILD FIX: `ssr: false` in Server Components
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * PROBLEM:
 *   Next.js 13+ App Router forbids dynamic(..., { ssr: false }) inside Server
 *   Components. The previous page.tsx used it directly for AmbientWellnessLayer,
 *   WellnessAssistant, ModalController, WellnessJourneyBuilder, and TherapistSection.
 *
 * ROOT CAUSE:
 *   Server Components run in Node.js — there is no browser, no window, no
 *   document. `ssr: false` means "skip SSR for this import", which is a
 *   client-side concept. Using it in a Server Component is a contradiction:
 *   the Server Component IS the SSR pass.
 *
 * FIX (one rule, applied consistently):
 *   `ssr: false` is only legal inside a 'use client' file.
 *   → All `ssr: false` dynamic imports are now in WellnessClientLayer.tsx
 *   → page.tsx imports WellnessClientLayer as a plain static import
 *   → page.tsx itself keeps zero dynamic() calls
 *
 * ARCHITECTURE (unchanged except for the wrapper):
 *
 *   page.tsx (SERVER — zero client JS)
 *     ├── Nav                      SERVER
 *     ├── SpaHero                  SERVER  → first paint, instant
 *     ├── SpaStatsBar              SERVER
 *     ├── SpaServicesGrid          SERVER
 *     ├── ThermalSanctuaries       SERVER
 *     ├── FarmToRitual             SERVER
 *     ├── RitualGrid               SERVER
 *     ├── WellnessJourneyBuilder   ← loaded by WellnessClientLayer (CLIENT)
 *     ├── TherapistSection         ← loaded by WellnessClientLayer (CLIENT)
 *     ├── TestimonialsSection      SERVER
 *     ├── MembershipSection        SERVER
 *     ├── FinalCTA                 SERVER
 *     ├── Footer                   SERVER
 *     └── WellnessClientLayer      CLIENT boundary
 *           ├── ModalController    ssr:false, loads on click
 *           ├── AmbientWellnessLayer  ssr:false, delayed 3.5s
 *           └── WellnessAssistant  ssr:false, delayed 5s
 */

import { Suspense }      from 'react'
import type { Metadata } from 'next'

import Nav    from '@/components/Nav'
import Footer from '@/components/Footer'

import SpaHero             from './_components/SpaHero'
import SpaStatsBar         from './_components/SpaStatsBar'
import SpaServicesGrid     from './_components/SpaServicesGrid'
import ThermalSanctuaries  from './_components/ThermalSanctuaries'
import FarmToRitual        from './_components/FarmToRitual'
import RitualGrid          from './_components/RitualGrid'
import TestimonialsSection from './_components/TestimonialsSection'
import MembershipSection   from './_components/MembershipSection'
import FinalCTA            from './_components/FinalCTA'

// ── THE FIX ──────────────────────────────────────────────────────────────────
// WellnessClientLayer is a 'use client' component that owns ALL ssr:false
// dynamic imports. This is the only change needed in page.tsx.
// No dynamic() calls remain here; this is a plain static import of a Client
// Component — which is 100% legal from a Server Component.
import WellnessClientLayer from './_components/WellnessClientLayer'

// ─── SEO Metadata — only possible in Server Components ───────────────────────
export const metadata: Metadata = {
  title:       'Arohamai Spa | Ubuntu Eco Lodge — Holistic Wellness Nairobi',
  description: 'Mud baths, Moroccan hammam, sauna, massage therapies, facials and signature healing packages at Arohamai Spa, Ubuntu Eco Lodge, Nairobi.',
  openGraph: {
    title:       'Arohamai Spa at Ubuntu Eco Lodge',
    description: 'Holistic wellness from skin to body. Affordable luxury inspired by healing, nature, and restoration.',
    type:        'website',
  },
}

// ─── JSON-LD — server-rendered, zero JS cost ─────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type':    'HealthAndBeautyBusiness',
  name:        'Arohamai Spa at Ubuntu Eco Lodge',
  description: 'Holistic wellness from skin to body. Affordable luxury inspired by healing, nature, and restoration.',
  telephone:   '+254700000000',
  priceRange:  '$$',
  address:     { '@type': 'PostalAddress', addressLocality: 'Nairobi', addressCountry: 'KE' },
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE ROOT — Server Component, no 'use client', no dynamic()
// ─────────────────────────────────────────────────────────────────────────────
export default function SpaPage() {
  return (
    <>
      {/* Structured data — server-rendered, never blocks JS */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-[#050505] text-white min-h-screen overflow-x-hidden">
        <Nav />

        {/* ── ABOVE THE FOLD: server HTML on first byte ───────────────────── */}
        <SpaHero />
        <SpaStatsBar />

        {/* ── BELOW THE FOLD: streamed server sections ────────────────────── */}
        <SpaServicesGrid />
        <ThermalSanctuaries />
        <FarmToRitual />

        {/*
          Static card HTML. ModalController inside WellnessClientLayer
          intercepts clicks via data-ritual-id event delegation.
          13 cards = 0 extra JS handlers on first load.
        */}
        <RitualGrid />

        {/*
          WellnessClientLayer is the single Client Component boundary.
          It owns all ssr:false dynamic imports and renders:
            • WellnessJourneyBuilder  (with its own Suspense shell)
            • TherapistSection        (with its own Suspense shell)
            • ModalController         (zero-render until click)
            • AmbientWellnessLayer    (visible after 3.5s)
            • WellnessAssistant       (visible after 5s)
        */}
        <WellnessClientLayer />

        <TestimonialsSection />
        <MembershipSection />
        <FinalCTA />

        <Footer />
      </main>
    </>
  )
}