'use client'

import { useCallback, useState } from 'react'
import type { MouseEvent } from 'react'
import Image from 'next/image'
import type { ExperienceItem } from '../../../_data/farm-data'
import { addExperienceAction } from './actions'
import { useJustAdded, useModalScrollLock } from './hooks'

interface ExperienceModalProps {
  item:     ExperienceItem
  inCart:   boolean
  cartQty:  number
  openCart: () => void
  onClose:  () => void
}

export function ExperienceModal({
  item, inCart, cartQty, openCart, onClose,
}: ExperienceModalProps) {
  const [qty, setQty] = useState(1)
  const [justAdded, triggerJustAdded] = useJustAdded()

  useModalScrollLock(onClose)

  const handleAdd = useCallback(() => {
    addExperienceAction(item, qty)
    triggerJustAdded()
  }, [item, qty, triggerJustAdded])

  const decQty = useCallback(() => setQty((q) => Math.max(1, q - 1)), [])
  const incQty = useCallback(() => setQty((q) => q + 1), [])
  const stopProp = useCallback((e: MouseEvent<HTMLDivElement>) => e.stopPropagation(), [])

  return (
    <div
      className="farm-modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div className="farm-modal" onClick={stopProp}>
        <div className="farm-modal__image-panel">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width:700px) 100vw, 440px"
            style={{ objectFit: 'cover' }}
          />
          <div className="farm-modal__image-overlay" />
          <button onClick={onClose} className="farm-modal__close" aria-label="Close">✕</button>

          {item.badge && (
            <span
              className="farm-modal__badge"
              style={{ color: item.badgeColor, borderColor: `${item.badgeColor}55`, background: `${item.badgeColor}22` }}
            >
              {item.badge}
            </span>
          )}
          {inCart && (
            <span className="farm-modal__in-cart-tag">✓ In Cart × {cartQty}</span>
          )}

          <div className="farm-modal__image-stats">
            {([['Duration', item.duration], ['Group', item.groupSize]] as const).map(([label, value]) => (
              <div key={label} className="farm-modal__stat">
                <div className="farm-modal__stat-label">{label}</div>
                <div className="farm-modal__stat-value">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="farm-modal__content">
          <div>
            <span className="farm-modal__category">{item.category}</span>
            <h2 className="farm-modal__title font-display">{item.name}</h2>
            <div className="farm-modal__price-row">
              <span className="farm-modal__price font-display">KES {item.price.toLocaleString()}</span>
              <span className="farm-modal__price-unit">/ person</span>
            </div>
          </div>

          <blockquote className="farm-modal__story">"{item.storyLine}"</blockquote>
          <p className="farm-modal__description">{item.description}</p>

          <div>
            <div className="farm-modal__section-label">What's Included</div>
            <ul className="farm-modal__includes">
              {item.includes.map((inc) => (
                <li key={inc}>
                  <span className="farm-modal__check">✓</span>{inc}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="farm-modal__section-label">Highlights</div>
            <div className="farm-modal__tags">
              {item.highlights.map((h) => (
                <span key={h} className="farm-modal__tag">{h}</span>
              ))}
            </div>
          </div>

          <div className="farm-modal__cta-section">
            <div className="farm-modal__qty-row">
              <span className="farm-modal__qty-label">Guests</span>
              <div className="farm-modal__qty-control">
                <button onClick={decQty} aria-label="Fewer guests">−</button>
                <span className="farm-modal__qty-value font-display">{qty}</span>
                <button onClick={incQty} aria-label="More guests">+</button>
              </div>
              <span className="farm-modal__qty-total">= KES {(item.price * qty).toLocaleString()}</span>
            </div>

            {inCart ? (
              <div className="farm-modal__btn-row">
                <button onClick={handleAdd} className="farm-modal__btn farm-modal__btn--ghost">
                  + Add More
                </button>
                <button onClick={openCart} className="farm-modal__btn farm-modal__btn--primary">
                  View Cart ({cartQty}) →
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                className={`farm-modal__btn farm-modal__btn--primary farm-modal__btn--full${
                  justAdded ? ' farm-modal__btn--added' : ''
                }`}
              >
                {justAdded ? '✓ Added to Cart' : '+ Add to Cart'}
              </button>
            )}

            {cartQty > 0 && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(0,255,65,0.5)', textAlign: 'center', marginTop: 8 }}>
                {cartQty} already in your cart
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
