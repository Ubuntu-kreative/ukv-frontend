'use client'

import { useCallback, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
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
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  // Scroll lock + Escape key
  useModalScrollLock(onClose)

  const [qty, setQty] = useState(1)
  const [justAdded, triggerJustAdded] = useJustAdded()
  // Track cart-added confirmation state for seamless cart CTA reveal
  const [showCartCTA, setShowCartCTA] = useState(inCart)

  const handleAdd = useCallback(() => {
    addExperienceAction(item, qty)
    triggerJustAdded()
    setShowCartCTA(true)
  }, [item, qty, triggerJustAdded])

  const decQty = useCallback(() => setQty((q) => Math.max(1, q - 1)), [])
  const incQty = useCallback(() => setQty((q) => q + 1), [])
  const stopProp = useCallback((e: MouseEvent<HTMLDivElement>) => e.stopPropagation(), [])

  if (!mounted) return null

  const totalCartQty = inCart ? cartQty : (showCartCTA ? qty : 0)

  return createPortal(
    <div
      className="farm-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={item.name}
    >
      <div className="farm-modal-shell farm-modal-shell--tilt" onClick={stopProp}>

        {/* ── LEFT: Image Panel ── */}
        <div className="farm-modal__image-panel">
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width:767px) 100vw, 480px"
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="farm-modal__image-overlay" />

          {/* Close */}
          <button onClick={onClose} className="farm-modal-close" aria-label="Close">✕</button>

          {/* Badge */}
          {item.badge && (
            <span
              className="farm-modal__badge"
              style={{ color: item.badgeColor, borderColor: `${item.badgeColor}55`, background: `${item.badgeColor}22` }}
            >
              {item.badge}
            </span>
          )}

          {/* In-cart indicator */}
          {(inCart || showCartCTA) && (
            <span className="farm-modal__in-cart-tag">✓ In Cart × {totalCartQty}</span>
          )}

          {/* Image meta: category, title, pills */}
          <div className="farm-modal__image-meta">
            <span className="farm-modal__image-category">{item.category}</span>
            <h2 className="farm-modal__image-title font-display">{item.name}</h2>
            <div className="farm-modal__image-pills">
              <span className="farm-modal__image-pill">
                <span>⏱</span>
                <span>{item.duration}</span>
              </span>
              <span className="farm-modal__image-pill">
                <span>👥</span>
                <span>{item.groupSize}</span>
              </span>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Content Panel ── */}
        <div className="farm-modal__content">

          {/* Price */}
          <div className="farm-modal__header">
            <div className="farm-modal__price-row">
              <span className="farm-modal__price font-display">KES {item.price.toLocaleString()}</span>
              <span className="farm-modal__price-unit">/ person</span>
            </div>
          </div>

          {/* Story */}
          <blockquote className="farm-modal__story">"{item.storyLine}"</blockquote>

          {/* Description */}
          <p className="farm-modal__description">{item.description}</p>

          {/* Includes */}
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

          {/* Highlights */}
          <div>
            <div className="farm-modal__section-label">Highlights</div>
            <div className="farm-modal__tags">
              {item.highlights.map((h) => (
                <span key={h} className="farm-modal__tag">{h}</span>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="farm-modal__cta-section">
            {/* Guest qty selector */}
            <div className="farm-modal__qty-row">
              <span className="farm-modal__qty-label">Guests</span>
              <div className="farm-modal__qty-control">
                <button onClick={decQty} aria-label="Fewer guests">−</button>
                <span className="farm-modal__qty-value font-display">{qty}</span>
                <button onClick={incQty} aria-label="More guests">+</button>
              </div>
              <span className="farm-modal__qty-total">= KES {(item.price * qty).toLocaleString()}</span>
            </div>

            {/* Seamless add → cart reveal */}
            {showCartCTA ? (
              <div className="farm-modal__btn-row">
                <button onClick={handleAdd} className="farm-modal__btn farm-modal__btn--ghost">
                  + Add More
                </button>
                <button onClick={openCart} className="farm-modal__btn farm-modal__btn--primary farm-modal__btn--cart-cta">
                  <span>View Cart</span>
                  <span className="farm-modal__cart-badge">{totalCartQty}</span>
                  <span>→</span>
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

            {totalCartQty > 0 && (
              <p className="farm-modal__cart-note">
                {totalCartQty} {totalCartQty === 1 ? 'guest' : 'guests'} in your cart for this experience
              </p>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}