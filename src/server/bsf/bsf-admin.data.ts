// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu BSF Supply Plan — CONFIDENTIAL INTERNAL DATA
// Source: Ubuntu BSF Supply Plan PDF, May 2026
//
// ⚠  This file must ONLY be imported by:
//      app/admin/bsf/page.tsx
//      components/bsf/BsfDashboardClient.tsx
//
//    It must NEVER be imported by any public page, layout, or component.
//    Importing it in a public route will expose confidential data in the
//    client-side JS bundle.
//
//    Path: src/server/bsf/bsf-admin.data.ts
//    Alias: @/server/bsf/bsf-admin.data
// ─────────────────────────────────────────────────────────────────────────────

import 'server-only'   // npm install server-only — throws build error if
                       // imported from a client component or public route

export const BSF_META = {
  documentTitle:      'Ubuntu Black Soldier Fly Supply — USA Export Programme',
  preparedDate:       'May 2026',
  classification:     'Confidential — For Client Use Only',
  exportDestination:  'United States of America',
  supplyStartDate:    'Week 2 of June 2026',
  firstShipmentTarget:'9 June 2026',
}

// ─── Product lines ─────────────────────────────────────────────────────────

export type ProductLine = {
  id: string
  name: string
  unit: string
  weeklyMinKg: number
  conditional: boolean       // true = only ships if client confirms interest
  conditionNote?: string
  active: boolean
}

export const PRODUCT_LINES: ProductLine[] = [
  {
    id: 'bsf-eggs',
    name: 'BSF Eggs',
    unit: 'kg/week',
    weeklyMinKg: 3,
    conditional: false,
    active: true,
  },
  {
    id: 'bsf-neonates',
    name: 'BSF Neonates',
    unit: 'kg/week',
    weeklyMinKg: 2,
    conditional: true,
    conditionNote:
      'Subject to client confirmation of interest. Logistics and packaging alignment required before dispatch.',
    active: false, // toggle to true once client confirms
  },
]

// ─── Milestone ramp-up plan ───────────────────────────────────────────────

export type Milestone = {
  id: string
  period: string
  periodShort: string        // for chart labels
  eggsMinKg: number
  eggsMaxKg: number | null   // null = exact figure (no range)
  notes: string
  status: 'completed' | 'active' | 'upcoming'
  targetDate: string         // ISO date of period start
}

export const MILESTONES: Milestone[] = [
  {
    id: 'm1',
    period: 'Week 2 of June 2026',
    periodShort: 'Jun W2',
    eggsMinKg: 3,
    eggsMaxKg: null,
    notes:
      'Supply commences — local partners fully operational. First shipment target: 9 June 2026.',
    status: 'active',
    targetDate: '2026-06-09',
  },
  {
    id: 'm2',
    period: 'July 2026',
    periodShort: 'Jul',
    eggsMinKg: 4,
    eggsMaxKg: 5,
    notes: 'Incremental ramp-up as in-house breeding scales.',
    status: 'upcoming',
    targetDate: '2026-07-01',
  },
  {
    id: 'm3',
    period: 'August 2026',
    periodShort: 'Aug',
    eggsMinKg: 7,
    eggsMaxKg: null,
    notes: 'Target milestone — expanded facility capacity online.',
    status: 'upcoming',
    targetDate: '2026-08-01',
  },
  {
    id: 'm4',
    period: 'September–October 2026',
    periodShort: 'Sep–Oct',
    eggsMinKg: 10,
    eggsMaxKg: 20,
    notes: 'Continued acceleration; new breeding cohorts active.',
    status: 'upcoming',
    targetDate: '2026-09-01',
  },
  {
    id: 'm5',
    period: 'November 2026',
    periodShort: 'Nov',
    eggsMinKg: 30,
    eggsMaxKg: null,
    notes:
      'Full-scale production target achieved — Ubuntu positioned as reliable high-volume US supplier.',
    status: 'upcoming',
    targetDate: '2026-11-01',
  },
]

// ─── Client action checklist ──────────────────────────────────────────────

export type ActionItem = {
  id: string
  title: string
  description: string
  responsible: 'client' | 'ubuntu' | 'both'
  completed: boolean
  dueNote?: string
}

export const CLIENT_ACTIONS: ActionItem[] = [
  {
    id: 'a1',
    title: 'Client confirms neonate interest',
    description:
      'Client to confirm interest in BSF Neonate supply (2 kg/week minimum) to allow logistics planning.',
    responsible: 'client',
    completed: false,
    dueNote: 'Required before first shipment',
  },
  {
    id: 'a2',
    title: 'Packaging specifications agreed',
    description:
      'Agree on packaging specifications, viability benchmarks, and labelling requirements.',
    responsible: 'both',
    completed: false,
    dueNote: 'Before 9 June 2026',
  },
  {
    id: 'a3',
    title: 'First shipment date confirmed',
    description:
      'Confirm first shipment date (target: week of 9 June 2026) and arrange shipping and import documentation.',
    responsible: 'both',
    completed: false,
    dueNote: 'Target: 9 June 2026',
  },
  {
    id: 'a4',
    title: 'Quality standards call scheduled',
    description:
      'Schedule a brief call or written exchange to align on quality standards and contingency protocols.',
    responsible: 'both',
    completed: false,
    dueNote: 'Before first shipment',
  },
  {
    id: 'a5',
    title: 'Import documentation prepared',
    description:
      'Shipping and import documentation for US entry prepared and verified.',
    responsible: 'ubuntu',
    completed: false,
  },
  {
    id: 'a6',
    title: 'Cold-chain protocol confirmed',
    description:
      'Cold-chain integrity procedures agreed for transit from Kenya to USA.',
    responsible: 'both',
    completed: false,
  },
]

// ─── Shipment log ─────────────────────────────────────────────────────────

export type ShipmentEntry = {
  id: string
  weekOf: string            // ISO date of Monday
  productId: string
  committedKg: number
  actualKg: number | null   // null = not yet shipped
  qcPassed: boolean | null
  notes?: string
}

// Starts empty — team fills this in as weekly exports happen.
// In a future phase connect to Supabase so the team can update from the UI.
export const SHIPMENT_LOG: ShipmentEntry[] = [
  // Uncomment and fill in once actual shipments begin:
  // {
  //   id: 's1',
  //   weekOf: '2026-06-09',
  //   productId: 'bsf-eggs',
  //   committedKg: 3,
  //   actualKg: null,
  //   qcPassed: null,
  //   notes: 'First export shipment — awaiting dispatch',
  // },
]

// ─── Public story copy (safe to use on farm page) ─────────────────────────
// Nothing below references volumes, milestones, export destinations, or clients.
// Kept here as the authoritative single source of truth for story copy.
// BsfFarmSection.tsx mirrors this inline so it has zero import dependency
// on this confidential file — if you change copy here, update it there too.

export const BSF_PUBLIC_STORY = {
  headline: 'Closing the Loop with Nature',
  subheadline: 'Black Soldier Fly · Regenerative Protein Cycle',
  body: `Ubuntu farm uses Black Soldier Fly larvae to transform organic waste into
high-quality protein and natural fertiliser — a closed-loop system that feeds
the land back into itself. No synthetic inputs. No waste. Just biology doing
what it has done for millions of years.`,
  ecologyPoints: [
    {
      icon: '♻',
      title: 'Waste becomes nutrition',
      body: 'Farm organic matter feeds the larvae, eliminating waste at source.',
    },
    {
      icon: '◎',
      title: 'Larvae become protein',
      body: 'Harvested larvae provide a sustainable protein input for the farm ecosystem.',
    },
    {
      icon: '✦',
      title: 'Frass becomes fertiliser',
      body: 'Larval frass returns as a rich, natural soil amendment — completing the cycle.',
    },
  ],
  ctaLabel: 'Interested in sustainable protein partnerships',
  ctaHref: '/contact?subject=bsf-partnership',
}