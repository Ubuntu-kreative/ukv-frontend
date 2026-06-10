'use client'
/**
 * FarmExperiences/TabItemModal.tsx
 *
 * Lazy-loaded — NOT in the initial JS bundle.
 * Two-panel cinematic layout matching ExperienceModal quality.
 */

import { useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
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
  useModalScrollLock(onClose)

  const [justAdded, triggerJustAdded] = useJustAdded()

  const highlightStyle = useMemo(() => ({
    color:       item.accentColor,
    background:  `${item.accentColor}10`,
    borderColor: `${item.accentColor}28`,
  }), [item.accentColor])

  // Accent-tinted image bottom overlay
  const accentOverlayStyle = useMemo(() => ({
    background: `linear-gradient(180deg,
      rgba(4,6,3,0.45) 0%,
      rgba(4,6,3,0.05) 30%,
      ${item.accentColor}18 65%,
      rgba(4,6,3,0.92) 100%)`,
  }), [item.accentColor])

  const handleAdd = useCallback(() => {
    addTabItemAction(item)
    triggerJustAdded()
  }, [item, triggerJustAdded])

  const stopProp = useCallback((e: React.MouseEvent) => e.stopPropagation(), [])

  return createPortal(
    <div
      className="farm-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
      >
      <div
        className="farm-modal-shell farm-modal-shell--tilt"
        onClick={stopProp}
       >
        {/* ── LEFT: Image Panel ── */}
        <div className="farm-modal__image-meta">
           <h2 className="farm-modal__image-title font-display">
           {item.name}
           </h2>

         {(item.duration || item.capacity) && (
          <div className="farm-modal__image-pills">

         {item.duration && (
        <span className="farm-modal__image-pill">
          <span>⏱</span>
          <span>{item.duration}</span>
        </span>
        )}

           {item.capacity && (
              <span className="farm-modal__image-pill">
          <span>👥</span>
          <span>{item.capacity} Guests</span>
                </span>
            )}

             </div>
            )}
            </div>

      {/* ── RIGHT: Content Panel ── */}
        <div className="farm-modal__content">

          <div className="farm-modal__header">
            <span className="farm-modal__category">{item.tag}</span>
            {item.price && (
              <div className="farm-modal__price-row" style={{ marginTop: 8 }}>
                <span className="farm-modal__price font-display">KES {item.price.toLocaleString()}</span>
                <span className="farm-modal__price-unit">/ person</span>
              </div>
            )}
          </div>

          <p className="farm-modal__description">{item.description}</p>

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

          <div className="farm-modal__cta-section">
            {item.price ? (
              <>
                {justAdded ? (
                  /* Seamless cart reveal after adding */
                  <div className="farm-modal__btn-row farm-modal__btn-row--seamless">
                    <button
                      onClick={handleAdd}
                      className="farm-modal__btn farm-modal__btn--ghost"
                    >
                      + Add More
                    </button>
                    <button
                      onClick={openCart}
                      className="farm-modal__btn farm-modal__btn--primary farm-modal__btn--cart-cta"
                    >
                      <span>View Cart</span>
                      <span className="farm-modal__cart-badge">→</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleAdd}
                    className="farm-modal__btn farm-modal__btn--primary farm-modal__btn--full"
                  >
                    + Add to Cart
                  </button>
                )}
                {justAdded && (
                  <p className="farm-modal__cart-note">✓ Added — ready in your cart</p>
                )}
              </>
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
    </div>,
    document.body
  )
}