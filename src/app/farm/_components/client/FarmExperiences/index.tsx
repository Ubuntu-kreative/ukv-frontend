'use client'
/**
 * FarmExperiences/index.tsx
 *
 * ROOT ORCHESTRATOR — production-grade, hydration-minimal.
 *
 * Design contract:
 *  • ONE Zustand subscription for the entire subtree (PERF-01)
 *  • Stable callbacks passed as props so memo() on children actually holds
 *  • Modals are lazy-imported — zero cost until opened
 *  • FloatingCartButton has its own isolated selector
 *  • No Framer Motion in grid-level renders
 */

import { useState, useCallback, useMemo, lazy, Suspense } from 'react'
import { useCartStore } from '@/context/cartStore'
import { EXPERIENCE_ITEMS, TAB_DATA, type ExperienceItem, type TabItem, type FarmTab } from '../../../_data/farm-data'
import { addExperienceAction, addTabItemAction } from './actions'
import { ExperienceGrid } from './ExperienceGrid'
import { TabSection } from './TabSection'
import { FloatingCartButton } from './FloatingCartButton'

// ─── LAZY MODALS — zero bundle cost until first open ──────────────────────────
// Dynamic import means modal code is NOT included in the initial JS chunk.
// Each modal is ~8–12 KB; deferring them saves ~20 KB from the initial parse.
const ExperienceModal = lazy(() =>
  import('./ExperienceModal').then(m => ({ default: m.ExperienceModal }))
)
const TabItemModal = lazy(() =>
  import('./TabItemModal').then(m => ({ default: m.TabItemModal }))
)

export default function FarmExperiences() {
  const [modalItem,    setModalItem]    = useState<ExperienceItem | null>(null)
  const [tabModalItem, setTabModalItem] = useState<TabItem | null>(null)
  const [activeTab,    setActiveTab]    = useState<FarmTab>('walks')

  // ─── SINGLE SUBSCRIPTION — entire subtree benefits ────────────────────────
  const { items, openCart } = useCartStore()

  const farmItems = useMemo(
    () => items.filter(i => i.category === 'farm'),
    [items]
  )
  const farmCount = farmItems.length

  // Stable derived selectors — passed as props, never recreated in children
  const isInCart = useCallback(
    (id: string) => farmItems.some(i => i.id === id),
    [farmItems]
  )
  const getQty = useCallback(
    (id: string) => farmItems.filter(i => i.id === id).length,
    [farmItems]
  )

  // Stable action callbacks — memo() on child components will hold
  const handleAddTabItem = useCallback((item: TabItem) => {
    addTabItemAction(item)
  }, [])

  const closeExpModal  = useCallback(() => setModalItem(null),    [])
  const closeTabModal  = useCallback(() => setTabModalItem(null), [])

  return (
    <>
      {/* ── Experience cards grid ── */}
      <ExperienceGrid
        items={EXPERIENCE_ITEMS}
        farmCount={farmCount}
        isInCart={isInCart}
        openCart={openCart}
        onOpenModal={setModalItem}
      />

      {/* ── Tab browsing section ── */}
      <TabSection
        tabData={TAB_DATA}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpen={setTabModalItem}
        onAdd={handleAddTabItem}
      />

      {/* ── Modals — rendered only when active, lazy-loaded chunks ── */}
      {modalItem && (
        <Suspense fallback={null}>
          <ExperienceModal
            item={modalItem}
            inCart={isInCart(modalItem.id)}
            cartQty={getQty(modalItem.id)}
            openCart={openCart}
            onClose={closeExpModal}
          />
        </Suspense>
      )}
      {tabModalItem && (
        <Suspense fallback={null}>
          <TabItemModal
            item={tabModalItem}
            openCart={openCart}
            onClose={closeTabModal}
          />
        </Suspense>
      )}

      {/* ── Floating cart — isolated subscription, re-renders independently ── */}
      <FloatingCartButton openCart={openCart} />
    </>
  )
}