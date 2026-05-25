'use client'
/**
 * FarmExperiences/TabItemCard.tsx
 *
 * Memoized tab item card.
 * Same isolation contract as ExperienceCard: zero cart subscriptions.
 */

import { memo, useCallback, useMemo } from 'react'
import Image from 'next/image'
import type { TabItem } from '../../../_data/farm-data'
import { useJustAdded } from './hooks'
import { TAB_CARD_IMAGE_SIZES } from './constants'

interface TabItemCardProps {
  item:   TabItem
  onOpen: (i: TabItem) => void
  onAdd:  (item: TabItem) => void
}

export const TabItemCard = memo(function TabItemCard({
  item, onOpen, onAdd,
}: TabItemCardProps) {
  const [justAdded, triggerJustAdded] = useJustAdded()

  // CSS custom property object — memoized so it's a stable reference
  const cardStyle = useMemo(
    () => ({ '--tab-accent': item.accentColor } as React.CSSProperties),
    [item.accentColor]
  )

  const handleAdd = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    onAdd(item)
    triggerJustAdded()
  }, [onAdd, item, triggerJustAdded])

  const handleOpen    = useCallback(() => onOpen(item), [onOpen, item])
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleOpen()
  }, [handleOpen])

  const handleDetailsClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    handleOpen()
  }, [handleOpen])

  return (
    <article
      className="ukv-tab-card"
      onClick={handleOpen}
      style={cardStyle}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`View ${item.name} details`}
    >
      <div className="ukv-tab-card__image-wrap">
        <Image
          src={item.image}
          alt={item.name}
          fill
          loading="lazy"
          sizes={TAB_CARD_IMAGE_SIZES}
          className="ukv-tab-card__image"
          style={{ objectFit: 'cover' }}
          {...(item.blurDataURL ? { placeholder: 'blur', blurDataURL: item.blurDataURL } : {})}
        />
        <div className="ukv-tab-card__image-overlay" />
        <span className="ukv-tab-card__tag">{item.tag}</span>
        <div className="ukv-tab-card__image-footer">
          <h3 className="ukv-tab-card__name font-display">{item.name}</h3>
          {item.duration && (
            <span className="ukv-tab-card__meta">
              ⏱ {item.duration} · 👥 {item.capacity}
            </span>
          )}
        </div>
      </div>

      <div className="ukv-tab-card__body">
        <p className="ukv-tab-card__description">{item.description}</p>
        <div className="ukv-tab-card__highlights">
          {item.highlights.slice(0, 2).map((h) => (
            <span key={h} className="ukv-tab-card__highlight-tag">{h}</span>
          ))}
        </div>
        <div className="ukv-tab-card__footer">
          {item.price ? (
            <span className="ukv-tab-card__price font-display">
              KES {item.price.toLocaleString()}
            </span>
          ) : (
            <span className="ukv-tab-card__price-note">Included in walks</span>
          )}
          <div className="ukv-tab-card__actions">
            <button
              onClick={handleDetailsClick}
              className="ukv-tab-card__btn ukv-tab-card__btn--ghost"
            >
              Details
            </button>
            {item.price && (
              <button
                onClick={handleAdd}
                className={`ukv-tab-card__btn ukv-tab-card__btn--primary${
                  justAdded ? ' ukv-tab-card__btn--added' : ''
                }`}
              >
                {justAdded ? '✓' : '+ Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  )
})