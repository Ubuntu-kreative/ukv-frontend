import type { Metadata } from 'next'

import './farm.css'

// ── NAVIGATION ─────────────────────────────────
import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'

// ── SERVER COMPONENTS ─────────────────────────────
import FarmHero from './_components/server/FarmHero'
import FarmStatsBar from './_components/server/FarmStatsBar'
import FarmLivingDashboard from './_components/server/FarmLivingDashboard'
import FarmLivestockIntelligence from './_components/server/FarmLivestockIntelligence'
import FarmCropIntelligence from './_components/server/FarmCropIntelligence'
import FarmRegenerativeStory from './_components/server/FarmRegenerativeStory'
import FarmTestimonialsAndFAQ from './_components/server/FarmTestimonialsAndFAQ'
import FarmLog from './_components/server/FarmLog'

// ── CLIENT ORCHESTRATOR (handles ALL client islands) ──
import ClientIslandWrapper from './_components/client/ClientIslandWrapper'

// ── EXPERIENCES (client island, hoisted above fold) ──
import FarmExperiences from './_components/client/FarmExperiences'

// ── STATIC CONFIG ─────────────────────────────────
export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'The Living Farm | Ubuntu Kreative Village',
  description:
    'Explore regenerative agriculture, immersive farm experiences, and the living system behind Ubuntu Kreative Village.',
  openGraph: {
    title: 'The Living Farm | Ubuntu Kreative Village',
    description: 'Regenerative agriculture and immersive farm experiences in the Kenyan highlands.',
    type: 'website',
    url: 'https://ubuntuecolodge.com/farm',
    images: [
      {
        url: 'https://ubuntuecolodge.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ubuntu Farm - Regenerative Agriculture',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'The Living Farm | Ubuntu Kreative Village',
    description: 'Regenerative agriculture and immersive farm experiences in Kenya.',
  },
  alternates: {
    canonical: 'https://ubuntuecolodge.com/farm',
  },
}

// ── PAGE ──────────────────────────────────────────
export default function FarmPage() {
  return (
    <>
      <NavWrapper />
      <main className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">

        {/* ── HERO (instant render, no JS) ─────────── */}
        <FarmHero />

        {/* ── EXPERIENCES (booking section) ───────── */}
        <FarmExperiences />

        {/* ── STATS BAR ───────────────────────────── */}
        <section className="relative z-10 bg-[#0a0a0a] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <FarmStatsBar />
          </div>
        </section>

        {/* ── LIVING FARM DASHBOARD ───────────────── */}
        <FarmLivingDashboard />

        {/* ── LIVESTOCK INTELLIGENCE ──────────────── */}
        <FarmLivestockIntelligence />

        {/* ── CROP INTELLIGENCE ──────────────────── */}
        <FarmCropIntelligence />

        {/* ── REGENERATIVE AGRICULTURE STORY ────── */}
        <FarmRegenerativeStory />

        {/* ── FARM LOG / LIVING HISTORY ─────────── */}
        <section id="farm-log" className="py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <FarmLog />
          </div>
        </section>

        {/* ── CLIENT ISLANDS (deferred) ───────────── */}
        <ClientIslandWrapper />

        {/* ── TESTIMONIALS & FAQ ──────────────────── */}
        <FarmTestimonialsAndFAQ />

      </main>
      <Footer />
    </>
  )
}