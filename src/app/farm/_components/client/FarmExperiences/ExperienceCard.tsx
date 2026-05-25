'use client'
/**
 * FarmExperiences/ExperienceCard.tsx
 *
 * Memoized experience card.
 *
 * KEY PERF PROPERTIES:
 *  • Zero Zustand subscriptions — cart state arrives as props
 *  • memo() wrapping is effective because all props are stable
 *  • Badge style computed once per item reference (useMemo)
 *  • No Framer Motion — grid-level animation was the repaint storm source
 *  • Image uses next/image with explicit sizes, lazy, placeholder=blur (if blurDataURL available)
 *  • All event handlers are stable useCallbacks
 */

import { memo, useCallback, useMemo } from 'react'
import Image from 'next/image'
import type { ExperienceItem } from '../../../_data/farm-data'
import { addExperienceAction } from './actions'
import { useJustAdded } from './hooks'
import { CARD_IMAGE_SIZES } from './constants'

interface ExperienceCardProps {
  item:        ExperienceItem
  inCart:      boolean
  openCart:    () => void
  onOpenModal: (item: ExperienceItem) => void
}

export const ExperienceCard = memo(function ExperienceCard({
  item,
  inCart,
  openCart,
  onOpenModal,
}: ExperienceCardProps) {
  const [justAdded, triggerJustAdded] = useJustAdded()

  // Badge style — recomputed only when badgeColor changes (stable per item)
  const badgeStyle = useMemo(() => ({
    color:       item.badgeColor,
    borderColor: `${item.badgeColor}55`,
    background:  `${item.badgeColor}22`,
  }), [item.badgeColor])

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (inCart) { openCart(); return }
    addExperienceAction(item)
    triggerJustAdded()
  }, [inCart, openCart, item, triggerJustAdded])

  const handleOpen = useCallback(() => onOpenModal(item), [onOpenModal, item])

  // PERF-06 FIX: stable keydown — not recreated on every render
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleOpen()
  }, [handleOpen])

  // Inline stop-propagation for Details button (stable because handleOpen is stable)
  const handleDetailsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    handleOpen()
  }, [handleOpen])

  return (
    <article
      className={`ukv-exp-card${inCart ? ' ukv-exp-card--in-cart' : ''}`}
      onClick={handleOpen}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View ${item.name} details`}
    >
      <div className="ukv-exp-card__image-wrap">
        <Image
          src={item.image}
          alt={item.name}
          fill
          loading="lazy"
          sizes={CARD_IMAGE_SIZES}
          className="ukv-exp-card__image"
          style={{ objectFit: 'cover' }}
          // Provide blurDataURL in your data file for CLS-free lazy loading
          {...(item.blurDataURL ? { placeholder: 'blur', blurDataURL: item.blurDataURL } : {})}
        />
        <div className="ukv-exp-card__image-overlay" />

        {inCart && (
          <div className="ukv-exp-card__in-cart-indicator">
            <span>✓ In Cart — View</span>
          </div>
        )}

        {item.badge && !inCart && (
          <span className="ukv-exp-card__badge" style={badgeStyle}>
            {item.badge}
          </span>
        )}

        <span className="ukv-exp-card__category-tag">{item.category}</span>

        <div className="ukv-exp-card__image-footer">
          <div className="ukv-exp-card__name font-display">{item.name}</div>
          <div className="ukv-exp-card__meta">
            <span>⏱ {item.duration}</span>
            <span>👥 {item.groupSize}</span>
          </div>
        </div>
      </div>

      <div className="ukv-exp-card__body">
        <p className="ukv-exp-card__story">"{item.storyLine}"</p>

        <div className="ukv-exp-card__footer">
          <div>
            <span className="ukv-exp-card__price-label">per person</span>
            <span className="ukv-exp-card__price font-display">
              KES {item.price.toLocaleString()}
            </span>
          </div>
          <div className="ukv-exp-card__actions">
            <button
              onClick={handleDetailsClick}
              className="ukv-exp-card__btn ukv-exp-card__btn--ghost"
            >
              Details
            </button>
            <button
              onClick={handleAdd}
              className={`ukv-exp-card__btn ukv-exp-card__btn--primary${
                (inCart || justAdded) ? ' ukv-exp-card__btn--added' : ''
              }`}
            >
              {inCart ? '✓ View Cart' : justAdded ? '✓ Added' : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </article>
  )
})