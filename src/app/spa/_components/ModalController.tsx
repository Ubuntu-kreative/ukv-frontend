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

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

import { RITUALS, type Ritual } from '../_data/spa-data'

// RitualModal JS only loads when a card is first clicked
const RitualModal = dynamic(() => import('./RitualModal'), { ssr: false })

// O(1) lookup — built once at module load, never recreated
const RITUAL_BY_ID = new Map(RITUALS.map((r) => [r.id, r]))

export default function ModalController() {
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)

  const handleClose = useCallback(() => setSelectedRitual(null), [])

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
        <RitualModal ritual={selectedRitual} onClose={handleClose} />
      )}
    </AnimatePresence>
  )
}