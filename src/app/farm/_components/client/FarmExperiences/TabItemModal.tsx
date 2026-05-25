'use client'
/**
 * FarmExperiences/TabItemModal.tsx
 *
 * Lazy-loaded — NOT in the initial JS bundle.
 * Saves ~8 KB from the initial hydration payload.
 */

import { useCallback, useMemo } from 'react'
import Image from 'next/image'
import type { TabItem } from '../../../_data/farm-data'
import { addTabItemAction } from './actions'
import { useJustAdded, useModalScrollLock } from './hooks'

interface TabItemModalProps {
  item:     TabItem
  openCart: () => void
  onClose:  () => void
}

export function TabItemModal({ item, openCart, onClose }: TabItemModalProps) {
  const [justAdded, triggerJustAdded] = useJustAdded()

  useModalScrollLock(onClose)

  // All inline style objects memoized per item reference
  const overlayStyle = useMemo(() => ({
    background: `radial-gradient(ellipse at center, ${item.accentColor}12, transparent 70%)`,
  }), [item.accentColor])

  const borderStyle = useMemo(() => ({
    borderColor: `${item.accentColor}30`,
  }), [item.accentColor])

  const tagStyle = useMemo(() => ({
    color:       item.accentColor,
    background:  `${item.accentColor}18`,
    borderColor: `${item.accentColor}44`,
  }), [item.accentColor])

  const highlightStyle = useMemo(() => ({
    color:       item.accentColor,
    background:  `${item.accentColor}10`,
    borderColor: `${item.accentColor}25`,
  }), [item.accentColor])

  const handleAdd = useCallback(() => {
    addTabItemAction(item)
    triggerJustAdded()
  }, [item, triggerJustAdded])

  const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  return (
    <div
      className="farm-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div className="farm-tab-modal" onClick={stopProp} style={borderStyle}>

        <div className="farm-tab-modal__image-wrap">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="100vw"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="farm-tab-modal__image-overlay" style={overlayStyle} />
          <button onClick={onClose} className="farm-modal__close" aria-label="Close">✕</button>
          <span className="farm-tab-modal__tag" style={tagStyle}>
            {item.tag}
          </span>
          <div className="farm-tab-modal__image-footer">
            <h2 className="farm-tab-modal__title font-display">{item.name}</h2>
            {item.price && (
              <span className="farm-tab-modal__price font-display">
                KES {item.price.toLocaleString()}
                <span className="farm-tab-modal__price-unit"> / person</span>
              </span>
            )}
          </div>
        </div>

        <div className="farm-tab-modal__content">
          {(item.duration || item.capacity) && (
            <div className="farm-tab-modal__meta-row">
              {item.duration && (
                <span className="farm-tab-modal__meta-tag">⏱ {item.duration}</span>
              )}
              {item.capacity && (
                <span className="farm-tab-modal__meta-tag">👥 {item.capacity} guests</span>
              )}
            </div>
          )}

          <p className="farm-tab-modal__description">{item.description}</p>

          <div>
            <div className="farm-modal__section-label">Highlights</div>
            <div className="farm-modal__tags">
              {item.highlights.map((h) => (
                <span key={h} className="farm-modal__tag" style={highlightStyle}>
                  {h}
                </span>
              ))}
            </div>
          </div>

          {item.price ? (
            <div className="farm-tab-modal__cta-row">
              <button
                onClick={handleAdd}
                className={`farm-modal__btn farm-modal__btn--primary farm-modal__btn--full${
                  justAdded ? ' farm-modal__btn--added' : ''
                }`}
              >
                {justAdded ? '✓ Added to Cart' : '+ Add to Cart'}
              </button>
              {justAdded && (
                <button
                  onClick={openCart}
                  className="farm-modal__btn farm-modal__btn--neon"
                >
                  View Cart →
                </button>
              )}
            </div>
          ) : (
            <button
              onClick={onClose}
              className="farm-modal__btn farm-modal__btn--ghost farm-modal__btn--full"
            >
              Close
            </button>
          )}
        </div>

      </div>
    </div>
  )
}