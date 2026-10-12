'use client'

// ─────────────────────────────────────────────────────────────
// StayModal.tsx  — Lazy-loaded, memory-safe modal
//
// KEY OPTIMIZATIONS:
// 1. GalleryImage: removed useMotionValue/useSpring/useTransform (12 subscriptions
//    per modal open → 0). 3D tilt is now pure CSS with transform on hover.
//    This was the single biggest cause of lag — each spring creates a
//    requestAnimationFrame loop that never stops until unmount.
// 2. Body scroll lock: stable effect with proper cleanup, no closure stale ref
// 3. Keyboard handler: single addEventListener, stable dependency array
// 4. No AnimatePresence inside modal accordions using layout shift
// 5. useCallback on all event handlers
// 6. Accordion state: string | null instead of boolean map (fewer re-renders)
// ─────────────────────────────────────────────────────────────

import { useState, useEffect, useCallback, memo } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCartStore } from '@/context/cartStore'
import type { Stay, BoardOption } from '../_data/stays-data'
import { BOARD_LABELS, BOARD_INCLUDES, BOARD_OPTIONS } from '../_data/stays-data'

// ── Gallery image (pure CSS tilt — no spring subscriptions) ───────────
function GalleryImage({ src, alt, index, onClick, style }: {
  src: string; alt: string; index: number; onClick: () => void; style?: React.CSSProperties
}) {
  return (
    <div
      onClick={onClick}
      style={style}
      className="relative overflow-hidden group cursor-zoom-in w-full h-full [transform-style:preserve-3d] transition-transform duration-300 hover:[transform:perspective(800px)_rotateX(2deg)_rotateY(-2deg)_scale(1.01)]"
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        sizes="(max-width: 768px) 50vw, 30vw"
        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-3 left-3 font-mono text-[8px] text-[var(--muted2)] bg-[var(--glass-bg)] px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {String(index + 1).padStart(2, '0')} / 04
      </div>
    </div>
  )
}

interface StayModalProps {
  c: Stay
  onClose: () => void
  selectedBoard: BoardOption
  onBoardChange: (b: BoardOption) => void
  guests: number
  onGuestsChange: (n: number) => void
}

function StayModalInner({ c, onClose, selectedBoard, onBoardChange, guests, onGuestsChange }: StayModalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const addItem  = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)
  const inCart   = useCartStore((s) => s.items.some((i) => i.id === `${c.id}-${selectedBoard}`))

  const [zoomedImg, setZoomedImg]           = useState<string | null>(null)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  const pricePerPerson = c.rates[selectedBoard]
  const totalPrice     = pricePerPerson * guests
  const baseTax        = Math.round(totalPrice * c.bookingDetails.taxRate)

  // ── Scroll lock — stable effect, no closure issues ────────────────
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = original }
  }, []) // empty array — run once on mount/unmount only

  // ── Keyboard handler — stable ref, correct deps ───────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (zoomedImg) setZoomedImg(null)
      else onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [zoomedImg, onClose]) // only re-register when these actually change

  const handleAddToCart = useCallback(() => {
    if (c.status === 'reserved') return
    if (inCart) { openCart(); return }
    addItem({
      id: `${c.id}-${selectedBoard}`,
      resourceId: c.id,
      name: `${c.name} · ${BOARD_LABELS[selectedBoard]}`,
      tag: c.category,
      category: 'cottage',
      price: totalPrice,
      unit: `/ night · ${guests} guest${guests > 1 ? 's' : ''}`,
    })
    toast.success(`${c.name} added to Reservation`)
  }, [c, selectedBoard, guests, totalPrice, inCart, addItem, openCart])

  const toggleAccordion = useCallback((id: string) => {
    setActiveAccordion((prev) => (prev === id ? null : id))
  }, [])

  const collapsibleSections = [
    {
      id: 'sustainability',
      label: 'Sustainability & Infrastructure',
      content: (
        <div className="pt-4 space-y-3">
          {Object.entries(c.specs).map(([key, val]) => (
            <div key={key} className="flex justify-between items-start gap-6">
              <p className="text-xs text-[var(--muted2)] capitalize w-28 flex-shrink-0">{key}</p>
              <p className="text-sm text-[var(--muted)] text-right leading-snug">{val}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'booking',
      label: 'Booking Policies',
      content: (
        <div className="pt-4">
          {[
            ['Minimum stay',    `${c.bookingDetails.minNights} nights`],
            ['Cleaning fee',    c.bookingDetails.cleaningFee === 0 ? 'Included' : `KES ${c.bookingDetails.cleaningFee.toLocaleString()}`],
            ['VAT (16%)',       'Calculated at checkout'],
            ['Max occupancy',  `${c.bookingDetails.maxOccupancy} guests`],
            ['Pricing model',  'Per person, per night'],
            ['Cancellation',    c.bookingDetails.cancellationPolicy],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-start gap-4 py-3 border-b border-[var(--border2)] last:border-0">
              <p className="text-xs text-[var(--muted2)]">{k}</p>
              <p className="text-sm text-[var(--muted)] text-right leading-snug max-w-[200px]">{v}</p>
            </div>
          ))}
        </div>
      ),
    },
  ]

  if (!mounted) return null

  return createPortal(
    <div className="fixed inset-0 z-[9999] isolation-auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 flex items-center justify-center p-0 md:p-4 lg:p-6"
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-[var(--bg)] cursor-pointer"
          onClick={onClose}
        />

        {/* Modal container */}
        <motion.div
          initial={{ scale: 0.98, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.98, opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative w-full max-w-[1520px] h-full md:h-[92vh] bg-[var(--bg)] flex flex-col lg:flex-row overflow-hidden md:rounded-2xl shadow-2xl"
          style={{ zIndex: 50 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.025),transparent_55%)] pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-0 right-0 z-20 px-5 py-3.5 text-[10px] tracking-[0.2em] uppercase text-[var(--muted2)] hover:text-[var(--muted)] border-l border-b border-[var(--border2)] hover:border-[var(--border2)] bg-transparent hover:bg-[var(--glass-bg)] transition-all duration-200 md:rounded-tr-2xl"
          >
            ✕ close
          </button>

          {/* ── LEFT COLUMN ─────────────────────────────────────────── */}
          <div
            className="w-full lg:w-[62%] flex-shrink-0 flex flex-col overflow-y-auto min-h-0"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,168,75,0.18) transparent' }}
          >
            {/* Image grid — explicit dimensions prevent layout thrash */}
            <div
              className="w-full flex-shrink-0"
              style={{ minHeight: '300px', maxHeight: '60vh', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'auto auto auto', gap: '16px', background: '#111' }}
            >
              {c.images.map((img, i) => (
                <GalleryImage
                  key={img} // key on src, not index — prevents remounts on reorder
                  src={img}
                  alt={`${c.name} ${i + 1}`}
                  index={i}
                  onClick={() => setZoomedImg(img)}
                  style={i === 0 ? { gridColumn: 1, gridRow: 'span 3' } : {}}
                />
              ))}
            </div>

            <div className="px-6 sm:px-8 md:px-12 lg:px-14 pt-10 pb-16 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-px bg-[var(--gold)]/60" />
                <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--gold)]/50">
                  {c.category}{c.isPenthouse ? ' · Penthouse' : ` · ${c.floor}`}
                </span>
              </div>

              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-light leading-[0.88] uppercase tracking-tight text-[var(--cream)] mb-2">{c.name}</h2>
              <p className={`text-xs mb-8 ${c.status === 'available' ? 'text-[var(--neon)]' : 'text-[var(--muted3)]'}`}>
                {c.status === 'available' ? '● Available' : '○ Currently Reserved'}
              </p>

              <blockquote className="relative py-6 pl-5 border-l-2 border-[var(--gold)]/35 mb-8">
                <p className="font-body text-[clamp(1rem,2vw,1.2rem)] font-light italic leading-[1.7] text-[var(--cream)] max-w-[640px]">"{c.storyLine}"</p>
              </blockquote>

              <p className="font-body text-[15px] text-[var(--muted)] leading-[1.85] mb-10 max-w-[640px]">{c.description}</p>

              <div className="grid grid-cols-3 gap-3 mb-10 p-5 bg-[var(--glass-bg)] border border-[var(--border2)] rounded-xl">
                {[
                  { label: 'Guests',   value: `${c.guests}` },
                  { label: 'Bedrooms', value: `${c.bedrooms}` },
                  { label: 'Size',     value: `${c.size}m²` },
                ].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="font-display text-3xl font-light text-[var(--gold)]">{value}</p>
                    <p className="text-[9px] uppercase tracking-wider text-[var(--muted3)] mt-1.5">{label}</p>
                  </div>
                ))}
              </div>

              <div className="mb-10">
                <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted3)] mb-4">Amenities & Inclusions</p>
                <div className="flex flex-wrap gap-2">
                  {c.amenities.map((a, i) => (
                    <span key={i} className="px-3 py-1.5 text-xs text-[var(--muted)] bg-[var(--glass-bg)] rounded-full border border-[var(--border2)] hover:text-[var(--muted)] transition-colors">{a}</span>
                  ))}
                </div>
              </div>

              {/* Accordions — CSS height transition, no motion */}
              <div className="space-y-2">
                {collapsibleSections.map((section) => {
                  const isOpen = activeAccordion === section.id
                  return (
                    <div key={section.id} className="border border-[var(--border2)]">
                      <button
                        onClick={() => toggleAccordion(section.id)}
                        className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-[var(--glass-bg)] transition-colors"
                      >
                        <span className="text-[13px] text-[var(--muted2)]">{section.label}</span>
                        <span className="text-[var(--muted3)] text-base ml-4 flex-shrink-0 font-light">{isOpen ? '−' : '+'}</span>
                      </button>
                      {/* CSS grid trick for height animation — no JS overhead */}
                      <div
                        className="overflow-hidden transition-all duration-250"
                        style={{ display: 'grid', gridTemplateRows: isOpen ? '1fr' : '0fr' }}
                      >
                        <div className="min-h-0">
                          <div className="px-5 pb-5">{section.content}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN ────────────────────────────────────────── */}
          <div
            className="w-full lg:w-[38%] flex-shrink-0 flex flex-col bg-[var(--bg)]/95 border-l border-[var(--border2)] overflow-y-auto"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,168,75,0.18) transparent' }}
          >
            <div className="px-6 sm:px-8 md:px-10 pt-12 pb-8 flex flex-col gap-8 flex-1">
              {/* Price display */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.35em] text-[var(--muted3)] mb-1">{BOARD_LABELS[selectedBoard]} · per guest / night</p>
                <p className="font-display text-3xl font-light text-[var(--gold)]">KES {pricePerPerson.toLocaleString()}</p>
                <p className="text-[10px] text-[var(--muted3)] mt-1">VAT not included · taxes calculated at checkout</p>
              </div>

              {/* Guests selector */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted3)] mb-4">Guests</p>
                <div className="flex items-center gap-5">
                  <button
                    onClick={() => onGuestsChange(Math.max(1, guests - 1))}
                    className="w-10 h-10 border border-[var(--border2)] hover:border-[var(--gold)]/40 text-[var(--muted2)] hover:text-[var(--gold)] transition-all text-xl leading-none rounded-lg"
                  >−</button>
                  <span className="font-display text-3xl font-light text-[var(--gold)] w-8 text-center tabular-nums">{guests}</span>
                  <button
                    onClick={() => onGuestsChange(Math.min(c.bookingDetails.maxOccupancy, guests + 1))}
                    className="w-10 h-10 border border-[var(--border2)] hover:border-[var(--gold)]/40 text-[var(--muted2)] hover:text-[var(--gold)] transition-all text-xl leading-none rounded-lg"
                  >+</button>
                  <span className="text-xs text-[var(--muted3)]">max {c.bookingDetails.maxOccupancy}</span>
                </div>
                <p className="text-[10px] text-[var(--muted3)] mt-3 leading-relaxed">
                  KES {pricePerPerson.toLocaleString()} × {guests} guest{guests > 1 ? 's' : ''}
                  <span className="text-[var(--muted3)] mx-2">·</span>
                  <span className="text-[var(--muted2)]">KES {totalPrice.toLocaleString()} / night</span>
                </p>
              </div>

              {/* Meal plan selector */}
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-[var(--muted3)] mb-4">Meal Plan</p>
                <div className="space-y-2">
                  {BOARD_OPTIONS.map((opt) => {
                    const isSelected = selectedBoard === opt.value
                    return (
                      <button
                        key={opt.value}
                        onClick={() => onBoardChange(opt.value)}
                        className={`w-full flex justify-between items-center px-4 py-3 text-left transition-all duration-200 border rounded-xl ${isSelected ? 'border-[var(--gold)]/30 bg-[var(--gold)]/[0.06] text-[var(--gold)]' : 'border-[var(--border2)] bg-[var(--glass-bg)] text-[var(--muted)] hover:border-[var(--border2)] hover:text-[var(--muted)] hover:bg-[var(--glass-bg)]'}`}
                      >
                        <div>
                          <span className="text-[13px] font-medium block">{opt.label}</span>
                          {isSelected && <span className="text-[10px] text-[var(--gold)]/50 mt-0.5 block font-normal">{BOARD_INCLUDES[opt.value]}</span>}
                        </div>
                        <span className="text-[13px] font-medium ml-4 flex-shrink-0 tabular-nums">{c.rates[opt.value].toLocaleString()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Price summary */}
              <div className="price-summary-card space-y-2.5">
                <div className="flex justify-between text-xs text-[var(--muted)]">
                  <span>KES {pricePerPerson.toLocaleString()} × {guests} guest{guests > 1 ? 's' : ''}</span>
                  <span className="tabular-nums text-[var(--muted)]">KES {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-[var(--muted3)]">
                  <span>VAT (16%)</span>
                  <span className="tabular-nums">KES {baseTax.toLocaleString()}</span>
                </div>
                <div className="h-px bg-[var(--glass-bg)] my-1" />
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] uppercase tracking-wider text-[var(--muted3)]">Total / night</span>
                  <span className="font-display text-lg font-light text-[var(--gold)] tabular-nums">KES {(totalPrice + baseTax).toLocaleString()}</span>
                </div>
                <p className="text-[9px] text-[var(--muted3)] pt-1">Cleaning fee (KES {c.bookingDetails.cleaningFee.toLocaleString()}) added at checkout</p>
              </div>

              {/* CTA buttons */}
              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  disabled={c.status === 'reserved'}
                  className={`w-full h-12 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${inCart ? 'bg-[var(--gold)] text-black' : c.status === 'reserved' ? 'bg-[var(--glass-bg)] border border-[var(--border2)] text-[var(--muted3)] pointer-events-none' : 'bg-[var(--bg2)] text-[var(--cream)] hover:bg-[var(--bg3)] active:scale-[0.98]'}`}
                >
                  {c.status === 'reserved' ? 'Currently Reserved' : inCart ? '✓ View Reservation' : 'Reserve Stay'}
                </button>

                <Link
                  href="/contact"
                  className="flex items-center justify-center w-full h-12 text-xs border border-[var(--border2)] hover:border-[var(--border2)] hover:bg-[var(--glass-bg)] transition-all text-[var(--muted2)] hover:text-[var(--muted)] rounded-xl"
                >
                  Speak with our concierge
                </Link>

                {inCart && (
                  <button onClick={openCart} className="w-full text-center text-[10px] tracking-[0.2em] uppercase text-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors py-2">
                    View Reservation →
                  </button>
                )}
              </div>

              <p className="text-[9px] text-[var(--muted3)] text-center leading-relaxed">
                Minimum {c.bookingDetails.minNights} nights · {c.bookingDetails.cancellationPolicy.includes('Free cancellation') ? 'Free cancellation policy applies' : c.bookingDetails.cancellationPolicy}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Zoomed image lightbox */}
      <AnimatePresence>
        {zoomedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImg(null)}
            className="fixed inset-0 z-[99999] bg-[var(--bg)] flex items-center justify-center p-6 cursor-zoom-out"
            style={{ isolation: 'isolate' }}
          >
            <motion.div
              initial={{ scale: 0.92 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-7xl h-[90vh]"
            >
              <Image src={zoomedImg} alt="Expanded view" fill sizes="100vw" className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>,
    document.body
  )
}

export const StayModal = memo(StayModalInner)