'use client'
/**
 * FarmExperiences/TabSection.tsx
 *
 * Tab browsing section.
 *
 * OPTIMIZATIONS:
 *  • Tab buttons use stable callbacks via useCallback
 *  • Tab content panel only renders the active tab's items
 *  • No framer motion wrappers — tab transition handled by CSS (opacity + translateY)
 *  • TabItemCard is memoized; switching tabs does not re-render unchanged cards
 *    because memo() compares item/onOpen/onAdd props by reference
 */

import { useCallback } from 'react'
import type { FarmTab, TabItem } from '../../../_data/farm-data'
import { TabItemCard } from './TabItemCard'

// Type matches the shape of TAB_DATA from farm-data
type TabDataShape = Record<FarmTab, { label: string; items: TabItem[] }>

interface TabSectionProps {
  tabData:     TabDataShape
  activeTab:   FarmTab
  onTabChange: (tab: FarmTab) => void
  onOpen:      (item: TabItem) => void
  onAdd:       (item: TabItem) => void
}

export function TabSection({
  tabData, activeTab, onTabChange, onOpen, onAdd,
}: TabSectionProps) {
  // One stable callback factory per tab key — avoids inline arrow in JSX
  // useCallback with a factory here is the correct pattern for dynamic keys
  const makeTabHandler = useCallback(
    (key: FarmTab) => () => onTabChange(key),
    [onTabChange]
  )

  const tabs = Object.keys(tabData) as FarmTab[]

  return (
    <section className="farm-section farm-section--alt">
      <div className="farm-inner">

        <div className="farm-eyebrow" data-reveal="left">
          <span className="farm-eyebrow__line farm-eyebrow__line--gold" />
          <span className="farm-eyebrow__text">Explore by Category</span>
        </div>

        <div
          className="farm-tab-nav"
          role="tablist"
          aria-label="Farm experience categories"
          data-reveal="up"
        >
          {tabs.map((key) => (
            <TabButton
              key={key}
              tabKey={key}
              label={tabData[key].label}
              isActive={activeTab === key}
              onClick={makeTabHandler(key)}
            />
          ))}
        </div>

        <div
          id={`tab-panel-${activeTab}`}
          role="tabpanel"
          className="farm-tab-grid"
        >
          {tabData[activeTab].items.map((item) => (
            <TabItemCard
              key={item.id}
              item={item}
              onOpen={onOpen}
              onAdd={onAdd}
            />
          ))}
        </div>

      </div>
    </section>
  )
}

// ─── Isolated tab button ──────────────────────────────────────────────────────
// Extracted to its own component so React can skip reconciling inactive buttons
// during tab switches (memo bails if isActive hasn't changed for that key).

interface TabButtonProps {
  tabKey:   FarmTab
  label:    string
  isActive: boolean
  onClick:  () => void
}

import { memo } from 'react'

const TabButton = memo(function TabButton({
  tabKey, label, isActive, onClick,
}: TabButtonProps) {
  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`tab-panel-${tabKey}`}
      className={`farm-tab-btn${isActive ? ' farm-tab-btn--active' : ''}`}
      onClick={onClick}
    >
      {label}
    </button>
  )
})