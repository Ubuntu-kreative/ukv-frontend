import type { Metadata } from 'next'

// ── NAVIGATION ─────────────────────────────────
import NavWrapper from '@/components/NavWrapper'

// ── SERVER COMPONENTS ─────────────────────────────
import FarmHero from './_components/server/FarmHero'
import FarmStatsBar from './_components/server/FarmStatsBar'
import FarmLog from './_components/server/FarmLog'

// ── CLIENT ORCHESTRATOR (handles ALL client islands) ──
import ClientIslandWrapper from './_components/client/ClientIslandWrapper'

// ── STATIC CONFIG ─────────────────────────────────
export const dynamic = 'force-static'
export const revalidate = 3600

export const metadata: Metadata = {
  title: 'The Living Farm | Ubuntu Kreative Village',
  description:
    'Explore regenerative agriculture, immersive farm experiences, and the living system behind Ubuntu Kreative Village.',
}

// ── PAGE ──────────────────────────────────────────
export default function FarmPage() {
  return (
    <>
      <NavWrapper />
      <main className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">

        {/* ── HERO (instant render, no JS) ─────────── */}
        <FarmHero />

        {/* ── STATS BAR ───────────────────────────── */}
        <section className="relative z-10 bg-[#0a0a0a] py-24">
          <div className="max-w-7xl mx-auto px-6">
            <FarmStatsBar />
          </div>
        </section>

        {/* ── CLIENT ISLANDS (deferred) ───────────── */}
        <ClientIslandWrapper />

        {/* ── FARM LOG / STORY ───────────────────── */}
        <section id="farm-log" className="py-24 border-t border-white/5">
          <div className="max-w-6xl mx-auto px-6">
            <FarmLog />
          </div>
        </section>

      </main>
    </>
  )
}
