'use client'
/**
 * FarmExperiences/ExperienceGrid.tsx
 *
 * Renders the experience card grid.
 *
 * OPTIMIZATIONS:
 *  • Section header is pure JSX — no animation wrappers at grid level
 *  • Cards rendered with memo; only re-render when their specific inCart changes
 *  • isInCart called per-card with a stable callback — no array spread in JSX
 *  • data-reveal attributes handled by a single global IntersectionObserver
 *    (defined in your scroll-reveal system, NOT per-component)
 *  • If EXPERIENCE_ITEMS grows beyond ~20 items, switch to the virtualized
 *    variant (see comment below) using react-window or @tanstack/virtual
 */

import type { ExperienceItem } from '../../../_data/farm-data'
import { ExperienceCard } from './ExperienceCard'

interface ExperienceGridProps {
  items:       ExperienceItem[]
  farmCount:   number
  isInCart:    (id: string) => boolean
  openCart:    () => void
  onOpenModal: (item: ExperienceItem) => void
}

export function ExperienceGrid({
  items,
  farmCount,
  isInCart,
  openCart,
  onOpenModal,
}: ExperienceGridProps) {
  return (
    <section id="farm-experiences" className="farm-section">
      <div className="farm-inner">

        <div className="farm-section-header farm-section-header--flex">
          <div>
            <div className="farm-eyebrow" data-reveal="up">
              <span className="farm-eyebrow__line" />
              <span className="farm-eyebrow__text">Book directly · Instant confirmation</span>
            </div>
            <h2
              className="farm-section-title font-display"
              data-reveal="up"
              data-reveal-delay="80"
            >
              Walk the land.{' '}
              <em className="farm-section-title-accent">Know your food.</em>
            </h2>
            <p
              className="farm-section-body"
              data-reveal="up"
              data-reveal-delay="160"
            >
              Pick what calls to you. Each experience is self-contained and goes
              directly into your cart. Everything feeds back to the same table.
            </p>
          </div>

          {farmCount > 0 && (
            <button
              onClick={openCart}
              className="farm-cart-summary-btn"
              aria-live="polite"
            >
              <span className="farm-cart-summary-btn__count">{farmCount}</span>
              View Cart
            </button>
          )}
        </div>

        {/*
          GRID NOTE:
          For ≤12 items: direct map is fine — DOM node count stays low.
          For 12+ items: replace with a windowed list:

          import { useVirtualizer } from '@tanstack/react-virtual'
          ... virtualizer rows with fixed/variable height

          The card CSS grid becomes a single-column virtualizer container;
          each "virtual row" may contain 1–3 cards depending on breakpoint.
          This keeps DOM nodes under 50 regardless of data size.
        */}
        <div className="farm-exp-grid">
          {items.map((item) => (
            <ExperienceCard
              key={item.id}
              item={item}
              inCart={isInCart(item.id)}
              openCart={openCart}
              onOpenModal={onOpenModal}
            />
          ))}
        </div>

      </div>
    </section>
  )
}