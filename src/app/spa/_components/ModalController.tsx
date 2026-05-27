'use client'
/**
 * _components/ModalController.tsx — CLIENT COMPONENT
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * WHY THIS EXISTS
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * All ritual cards, service cards, and thermal cards are Server Components
 * (pure HTML). They cannot have onClick handlers directly.
 *
 * Instead of turning every card into a client component (which would mean
 * 13+ 'use client' boundaries and 13+ hydration trees), we use a SINGLE
 * event-delegation listener here that catches clicks anywhere on the page
 * that carry a `data-ritual-id` attribute.
 *
 * Benefits:
 *   - 13 cards = 0 extra JS on first load (server HTML only)
 *   - 1 event listener covers the entire page
 *   - RitualModal JS is only parsed when it's actually needed (first click)
 *   - No hydration cost for any card
 *
 * FIX: This is also why the previous architecture hung — it registered
 * 30+ independent onClick handlers during hydration. This pattern
 * registers exactly ONE.
 */

import { useState, useEffect, useCallback, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

import { ModalPortal } from '@/components/ui/ModalPortal'
import { RITUALS, type Ritual } from '../_data/spa-data'

// RitualModal JS only loads when a card is first clicked
function RitualModalFallback() {
  return (
    <ModalPortal>
      <div className="fixed inset-0 z-[9998] bg-black/90 flex items-center justify-center px-4">
        <div className="max-w-sm rounded-3xl border border-white/10 bg-[#101010]/95 px-8 py-6 text-center text-sm text-white/80">
          Loading ritual details…
        </div>
      </div>
    </ModalPortal>
  )
}

const RitualModal = dynamic(() => import('./RitualModal'), { ssr: false, loading: () => <RitualModalFallback /> })

// O(1) lookup — built once at module load, never recreated
const RITUAL_BY_ID = new Map(RITUALS.map((r) => [r.id, r]))

export default function ModalController() {
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)

  const handleClose = useCallback(() => setSelectedRitual(null), [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const prefetchRitualModal = () => {
      void import('./RitualModal')
    }

    if ('requestIdleCallback' in window) {
      const handle = (window as any).requestIdleCallback(prefetchRitualModal)
      return () => (window as any).cancelIdleCallback(handle)
    }

    const timer = globalThis.setTimeout(prefetchRitualModal, 1800)
    return () => globalThis.clearTimeout(timer)
  }, [])

  useEffect(() => {
    // Single delegated listener — catches clicks on ANY data-ritual-id element
    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest('[data-ritual-id]') as HTMLElement | null
      if (!target) return
      const id = target.dataset.ritualId
      if (!id) return
      const ritual = RITUAL_BY_ID.get(id)
      if (ritual) setSelectedRitual(ritual)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  return (
    <AnimatePresence>
      {selectedRitual && (
        <Suspense fallback={<RitualModalFallback />}>
          <RitualModal ritual={selectedRitual} onClose={handleClose} />
        </Suspense>
      )}
    </AnimatePresence>
  )
}