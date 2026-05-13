'use client'

import { useState } from 'react'
import { PageHero } from '@/components/ui/PageHero'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ProductCard } from '@/components/ui/ProductCard'
import { FARM_WALKS, FARM_ANIMALS, FARM_WORKSHOPS, FARM_HARVEST } from '@/lib/data'
import type { Product } from '@/types'

type FarmTab = 'walks' | 'animals' | 'workshops' | 'harvest'

const TABS: { key: FarmTab; label: string; data: Product[] }[] = [
  { key: 'walks',     label: 'Farm Walks',         data: FARM_WALKS },
  { key: 'animals',  label: 'Animal Encounters',   data: FARM_ANIMALS },
  { key: 'workshops',label: 'Workshops',            data: FARM_WORKSHOPS },
  { key: 'harvest',  label: 'Harvest & Field',     data: FARM_HARVEST },
]

export function FarmSection() {
  const [tab, setTab] = useState<FarmTab>('walks')
  const active = TABS.find((t) => t.key === tab)!

  return (
    <div className="animate-fade-up">
      <PageHero
        eyebrow="Living Farm · 24 Animals · 6 Fields · Live Tracked"
        title="Walk the land."
        titleGold="Know your food."
        subtitle="Book individual farm walks, animal encounters, workshops, and field sessions. Everything is available directly — pick what calls to you and add it to your cart."
      />

      <div className="px-8 md:px-10 py-14">
        {/* Tab Bar */}
        <div
          className="flex overflow-x-auto mb-9"
          style={{ borderBottom: '0.5px solid rgba(237,230,211,0.08)', scrollbarWidth: 'none' }}
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className="px-6 py-3 text-[10px] tracking-[0.14em] uppercase whitespace-nowrap transition-all duration-200"
              style={{
                fontFamily: 'var(--font-body)',
                color: tab === t.key ? 'var(--gold)' : 'var(--muted)',
                borderBottom: tab === t.key ? '1.5px solid var(--gold)' : '1.5px solid transparent',
                marginBottom: '-0.5px',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.key ? '1.5px solid var(--gold)' : '1.5px solid transparent',
                cursor: 'pointer',
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        <SectionDivider label={active.label} />

        <div
          key={tab}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[rgba(200,168,75,0.1)] animate-fade-up"
        >
          {active.data.map((item, i) => (
            <ProductCard key={item.id} product={item} delay={i * 60} />
          ))}
        </div>
      </div>
    </div>
  )
}
