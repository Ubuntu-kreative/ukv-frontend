'use client'
/**
 * _components/WellnessClientLayer.tsx — CLIENT COMPONENT
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PURPOSE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * This is the single 'use client' boundary that owns all ssr:false dynamic
 * imports. It exists for one reason: `dynamic(..., { ssr: false })` is only
 * legal inside a Client Component. Since page.tsx must remain a Server
 * Component, this wrapper takes on that responsibility.
 *
 * It also acts as the layout host for the two interactive sections that sit
 * between RitualGrid and TestimonialsSection in the page flow:
 *   • WellnessJourneyBuilder
 *   • TherapistSection
 *
 * And it defers the floating UI features:
 *   • ModalController      — zero render until a ritual card is clicked
 *   • AmbientWellnessLayer — appears after 3.5 s (CSS delay)
 *   • WellnessAssistant    — appears after 5 s (CSS delay)
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * DELAY STRATEGY
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * AmbientWellnessLayer and WellnessAssistant manage their own visual delays
 * via CSS `animation-delay` inside their components, so they can be mounted
 * immediately. The components render an invisible element that slides in after
 * the delay — this is smoother than setTimeout-gated conditional rendering
 * which would cause a layout shift when the element appears.
 *
 * ModalController has no visible render until a card is clicked, so it mounts
 * with zero cost.
 *
 * WellnessJourneyBuilder and TherapistSection are interactive sections that
 * appear in the page scroll flow. They use Suspense with lightweight shells
 * so the server-rendered page has correct layout even before these hydrate.
 */

import dynamic   from 'next/dynamic'
import { Suspense } from 'react'

// ── ssr:false imports — ALL legal here because this file is 'use client' ─────

const ModalController = dynamic(
  () => import('./ModalController'),
  {
    ssr:     false,
    loading: () => null,   // renders nothing while loading — it's invisible anyway
  }
)

const WellnessJourneyBuilder = dynamic(
  () => import('./WellnessJourneyBuilder'),
  {
    ssr:     false,
    loading: () => <WellnessBuilderShell />,
  }
)

const TherapistSection = dynamic(
  () => import('./TherapistSection'),
  {
    ssr:     false,
    loading: () => <TherapistShell />,
  }
)

const AmbientWellnessLayer = dynamic(
  () => import('./AmbientWellnessLayer'),
  {
    ssr:     false,
    loading: () => null,
  }
)

const WellnessAssistant = dynamic(
  () => import('./WellnessAssistant'),
  {
    ssr:     false,
    loading: () => null,
  }
)

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function WellnessClientLayer() {
  return (
    <>
      {/*
        ── IN-FLOW INTERACTIVE SECTIONS ──────────────────────────────────────
        These appear in the page's vertical scroll order, between
        RitualGrid and TestimonialsSection.

        Suspense boundaries here are belt-and-suspenders: dynamic() already
        provides the loading component, but Suspense catches any async
        operations inside the components themselves.
      */}
      <Suspense fallback={<WellnessBuilderShell />}>
        <WellnessJourneyBuilder />
      </Suspense>

      <Suspense fallback={<TherapistShell />}>
        <TherapistSection />
      </Suspense>

      {/*
        ── FLOATING / OVERLAY FEATURES ───────────────────────────────────────
        These are position:fixed elements that float over the page.
        They mount immediately but appear on a CSS delay (3.5s / 5s).
        ModalController renders nothing until a ritual card is clicked.
      */}
      <ModalController />
      <AmbientWellnessLayer />
      <WellnessAssistant />
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOADING SHELLS
// Height-matched placeholders that prevent CLS while the client islands load.
// Intentionally minimal — they are replaced within milliseconds on fast
// connections and within ~500 ms on slow ones.
// ─────────────────────────────────────────────────────────────────────────────

function WellnessBuilderShell() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#050505]" aria-hidden="true">
      <div className="max-w-7xl mx-auto">
        <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">
          Moxie Wellness Intelligence
        </p>
        <div className="h-8 w-96 max-w-full bg-white/[0.03] rounded-xl mb-6 animate-pulse" />
        <div className="flex flex-wrap gap-3">
          {['Stress Relief', 'Deep Sleep', 'Energy Restoration', 'Emotional Reset', 'Skin Renewal', 'Muscle Recovery'].map((g) => (
            <div
              key={g}
              className="px-6 py-3 rounded-full border border-white/5 text-[9px] uppercase tracking-[0.28em] text-white/15"
            >
              {g}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TherapistShell() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5" aria-hidden="true">
      <div className="max-w-7xl mx-auto">
        <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">
          Healing Practitioners
        </p>
        <div className="h-8 w-80 bg-white/[0.03] rounded-xl animate-pulse" />
      </div>
    </section>
  )
}