'use client'
/**
 * _components/ModalController.tsx — CLIENT COMPONENT
 *
 * Single event-delegation listener for all data-ritual-id cards on the page.
 * RitualModal JS is only parsed on first click.
 *
 * FIX: Body Care / Facial modals — their ritualIds ('body-exfoliation',
 * 'hydrating-facial') do not exist in RITUALS. We synthesise a complete
 * Ritual from the SpaService data, parsing the price from `subtitle`
 * (e.g. "From KES 3,000" → 3000) so "KES 0" never appears.
 */

import { useState, useEffect, useCallback } from 'react'
import { AnimatePresence } from 'framer-motion'
import dynamic from 'next/dynamic'

import { RITUALS, SPA_SERVICES, type Ritual } from '../_data/spa-data'

const RitualModal = dynamic(() => import('./RitualModal'), { ssr: false })

// ── Parse "From KES 3,000" or "KES 18,000" → 3000 / 18000 ──────────────────
function parsePrice(subtitle: string): number {
  const match = subtitle.replace(/,/g, '').match(/[\d]+/)
  return match ? parseInt(match[0], 10) : 0
}

// ── Primary lookup: id → Ritual (covers RitualGrid + ThermalSanctuaries) ────
const RITUAL_BY_ID = new Map(RITUALS.map((r) => [r.id, r]))

// ── Secondary: service ritualId → Ritual ─────────────────────────────────────
// Synthesised rituals for services whose ritualId isn't in RITUALS.
// Data is matched to the actual service content from spa-data.ts.
const SYNTHESISED: Record<string, Omit<Ritual, 'id' | 'name' | 'image' | 'description' | 'categoryTag'>> = {
  'body-exfoliation': {
    duration:    '60 MIN',
    price:       3000,
    status:      'Available',
    aromaNotes:  ['Volcanic Clay', 'Raw Shea Butter', 'Baobab Oil', 'Lemongrass'],
    soundscape:  'Forest Rain & Earth',
    mood:        'Polish, nourish and restore the skin barrier',
    heatLevel:   'Warm Towel Wrap',
    pressure:    'Firm Exfoliation',
    timeline: [
      '00 MIN — Dry Body Brushing',
      '15 MIN — Natural Botanical Scrub',
      '35 MIN — Warm Mask Application',
      '50 MIN — Rinse & Shea Butter Seal',
      '60 MIN — Cooling Finish & Hydration',
    ],
    addOns: ['Herbal Soak', 'Aromatherapy Massage', 'Hydrating Facial'],
    recovery: { stress: 78, sleep: 72, energy: 80, emotional: 74 },
  },
  'hydrating-facial': {
    duration:    '60 MIN',
    price:       3500,
    status:      'Available',
    aromaNotes:  ['Aloe Vera', 'Wild Marula', 'Rose Water', 'Argan Oil'],
    soundscape:  'Gentle Streams & Birdsong',
    mood:        'Renew, hydrate and illuminate the skin',
    heatLevel:   'Steam & Warm Towel',
    pressure:    'Gentle Facial',
    timeline: [
      '00 MIN — Cleanse & Steam',
      '15 MIN — Exfoliation',
      '25 MIN — Extraction (if needed)',
      '35 MIN — Serum & Mask',
      '50 MIN — Massage & Moisturise',
      '60 MIN — SPF & Finish',
    ],
    addOns: ['Hair Masking Treatment', 'Eye Treatment', 'Jade Roller Therapy'],
    recovery: { stress: 76, sleep: 74, energy: 78, emotional: 82 },
  },
  'herbal-soak': {
    duration:    '50 MIN',
    price:       3000,
    status:      'Available',
    aromaNotes:  ['Lemongrass', 'Eucalyptus', 'Chamomile', 'Lavender'],
    soundscape:  'Flowing Water & Forest',
    mood:        'Ease tension, nourish skin and calm the mind',
    heatLevel:   'Warm 38–40°C',
    pressure:    'None',
    timeline: [
      '00 MIN — Herbal Welcome Tea',
      '10 MIN — Herb-Infused Bath Draw',
      '15 MIN — Full Immersion Soak',
      '45 MIN — Warm Rinse',
      '50 MIN — Body Oil & Rest',
    ],
    addOns: ['Aromatherapy Candles', 'Flower Petal Upgrade', 'Post-Soak Massage'],
    recovery: { stress: 88, sleep: 90, energy: 72, emotional: 86 },
  },
  'half-day-retreat': {
    duration:    '4 HRS',
    price:       18000,
    status:      'Available',
    aromaNotes:  ['Frankincense', 'Eucalyptus', 'Rose', 'Cedarwood'],
    soundscape:  'Curated Healing Frequencies',
    mood:        'Complete half-day restoration of body and mind',
    heatLevel:   'Multiple Thermal Experiences',
    pressure:    'Customised',
    timeline: [
      '00 MIN — Herbal Tea Welcome & Consultation',
      '30 MIN — Bath Therapy of Choice',
      '90 MIN — Signature Massage',
      '150 MIN — Facial or Hair Ritual',
      '210 MIN — Healthy Wellness Meal',
      '240 MIN — Integration & Farewell',
    ],
    addOns: ['Couples Upgrade', 'Private Lounge', 'Wine Pairing'],
    recovery: { stress: 92, sleep: 88, energy: 85, emotional: 90 },
  },
}

const SERVICE_RITUAL_MAP = new Map<string, Ritual>()
SPA_SERVICES.forEach((svc) => {
  if (!svc.ritualId) return
  if (RITUAL_BY_ID.has(svc.ritualId)) return // real ritual exists, skip

  const extra = SYNTHESISED[svc.ritualId]
  const price = extra?.price ?? parsePrice(svc.subtitle)

  SERVICE_RITUAL_MAP.set(svc.ritualId, {
    id:          svc.ritualId,
    name:        svc.title,
    categoryTag: svc.tag,
    status:      'Available',
    image:       svc.image,
    description: svc.description,
    price,
    duration:    extra?.duration    ?? 'Varies',
    heatLevel:   extra?.heatLevel   ?? '—',
    pressure:    extra?.pressure    ?? '—',
    mood:        extra?.mood        ?? 'Restore',
    soundscape:  extra?.soundscape  ?? 'Nature ambience',
    aromaNotes:  extra?.aromaNotes  ?? [],
    timeline:    extra?.timeline    ?? [],
    addOns:      extra?.addOns      ?? [],
    recovery:    extra?.recovery    ?? { stress: 80, sleep: 70, energy: 75, emotional: 72 },
  } satisfies Ritual)
})

function findRitual(id: string): Ritual | undefined {
  return RITUAL_BY_ID.get(id) ?? SERVICE_RITUAL_MAP.get(id)
}

export default function ModalController() {
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)
  const handleClose = useCallback(() => setSelectedRitual(null), [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      const target = (e.target as Element).closest('[data-ritual-id]') as HTMLElement | null
      if (!target) return
      const id = target.dataset.ritualId
      if (!id) return
      const ritual = findRitual(id)
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