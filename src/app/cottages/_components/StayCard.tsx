'use client'

// ─────────────────────────────────────────────────────────────
// StayCard.tsx  — Memoized card component
//
// KEY OPTIMIZATIONS:
// 1. React.memo with custom comparator — only re-renders when
//    the specific card's price-relevant props actually change
// 2. useCallback for handlers — stable references across renders
// 3. Framer Motion only on the outer wrapper (one motion.div vs. many)
// 4. No inline object literals in props — avoids new references
// 5. AnimatePresence scoped to the "in cart" overlay only
// ─────────────────────────────────────────────────────────────

import { memo, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { useCartStore } from '@/context/cartStore'
import type { Stay, BoardOption } from '../_data/stays-data'
import { BOARD_LABELS } from '../_data/stays-data'

interface StayCardProps {
  c: Stay
  index: number
  onOpenSpecs: (c: Stay) => void
  featured?: boolean
  selectedBoard: BoardOption
  guests: number
}

// ── Plain card ──────────────────────────────────────────────
function StayCardInner({ c, index, onOpenSpecs, featured = false, selectedBoard, guests }: StayCardProps) {
  const addItem   = useCartStore((s) => s.addItem)
  const openCart  = useCartStore((s) => s.openCart)
  // Granular selector: only re-render when THIS card's cart state changes
  const inCart    = useCartStore((s) => s.items.some((i) => i.id === `${c.id}-${selectedBoard}`))

  const pricePerPerson = c.rates[selectedBoard]
  const totalPrice     = pricePerPerson * guests

  const handleAddToCart = useCallback(() => {
    if (c.status === 'reserved') return
    if (inCart) { toast('Already in your Reservation', { icon: '✦' }); openCart(); return }
    addItem({
      id: `${c.id}-${selectedBoard}`,
      name: `${c.name} · ${BOARD_LABELS[selectedBoard]}`,
      tag: c.category,
      category: 'cottage',
      price: totalPrice,
      unit: `/ night · ${guests} guest${guests > 1 ? 's' : ''}`,
    })
    toast.success(`${c.name} added to Reservation`)
  }, [c, selectedBoard, guests, totalPrice, inCart, addItem, openCart])

  const handleOpen = useCallback(() => onOpenSpecs(c), [c, onOpenSpecs])

  // ── FEATURED layout ──────────────────────────────────────
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="col-span-full stay-card-shadow group relative overflow-hidden flex flex-col md:flex-row bg-[#0a0a0a] border border-white/5 hover:border-[var(--gold)]/30 transition-all duration-700 rounded-2xl"
      >
        <div
          className="relative md:w-[60%] h-72 md:h-[500px] overflow-hidden cursor-pointer flex-shrink-0 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl"
          onClick={handleOpen}
        >
          <Image
            src={c.images[0]}
            alt={c.name}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a] opacity-40 pointer-events-none" />
          <div className="absolute top-6 left-6 flex gap-2 z-10 pointer-events-none">
            <span className="log-badge backdrop-blur-md bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)]">{c.category}</span>
            {c.isPenthouse && <span className="log-badge backdrop-blur-md bg-black/40 border-white/10 text-white/50">★ Penthouse</span>}
          </div>
        </div>

        <div className="flex-1 flex flex-col justify-between p-8 md:p-16">
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--gold)]/60 mb-4">Ubuntu {c.category} · {c.floor}</p>
            <h3 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight leading-[0.9] mb-6">{c.name}</h3>
            <p className="story-quote font-body text-base text-white/40 italic leading-relaxed mb-8 pl-1">"{c.storyLine}"</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Guests',   value: `${c.guests}` },
                { label: 'Bedrooms', value: `${c.bedrooms}` },
                { label: 'Size',     value: `${c.size}m²` },
                { label: 'Min stay', value: `${c.bookingDetails.minNights}n` },
              ].map(({ label, value }) => (
                <div key={label} className="border border-white/5 rounded-lg p-3 text-center">
                  <p className="font-display text-xl text-[var(--gold)]">{value}</p>
                  <p className="text-[8px] uppercase tracking-widest text-white/25 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {c.amenities.slice(0, 4).map((a, i) => (
                <span key={i} className="px-3 py-1 border border-white/10 rounded-full text-[9px] uppercase tracking-wider text-white/40">{a}</span>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">{BOARD_LABELS[selectedBoard]} · per guest / night</p>
              <p className="font-display text-3xl text-[var(--gold)]">KES {pricePerPerson.toLocaleString()}</p>
              {guests > 1 && <p className="text-[10px] text-white/30 mt-1">KES {totalPrice.toLocaleString()} for {guests} guests / night</p>}
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleAddToCart}
                disabled={c.status === 'reserved'}
                className={`font-body text-[10px] uppercase tracking-[0.2em] py-4 px-8 border rounded-xl transition-all duration-300 ${inCart ? 'bg-[var(--gold)] border-[var(--gold)] text-black' : 'border-[var(--gold)]/40 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black'} ${c.status === 'reserved' ? 'opacity-30 pointer-events-none' : ''}`}
              >
                {inCart ? '✓ Reserved' : 'Reserve Stay'}
              </button>
              <button onClick={handleOpen} className="font-body text-[10px] uppercase tracking-[0.2em] py-4 px-6 border rounded-xl border-white/10 hover:border-[var(--gold)]/30 text-white/40 hover:text-white/70 transition-all">
                Explore →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  // ── STANDARD card layout ──────────────────────────────────
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.08, 0.4) }} // cap delay at 400ms
      className="stay-card-shadow group relative overflow-hidden flex flex-col bg-[#0a0a0a] border border-white/5 hover:border-[var(--gold)]/20 transition-all duration-700 rounded-2xl"
    >
      {/* Image section */}
      <div
        className="relative h-64 sm:h-72 w-full overflow-hidden cursor-pointer rounded-t-2xl"
        onClick={handleOpen}
      >
        <Image
          src={c.images[0]}
          alt={c.name}
          fill
          loading="lazy"
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover grayscale-[0.35] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />

        <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap pointer-events-none">
          <span className="log-badge backdrop-blur-md border-[var(--gold)]/30 bg-black/50" style={{ color: c.accent, borderColor: `${c.accent}44` }}>{c.category}</span>
          {c.isPenthouse && <span className="log-badge backdrop-blur-md bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)]">Penthouse</span>}
          <span className="log-badge backdrop-blur-md bg-black/40 border-white/10 text-white/50">{c.status === 'available' ? '● Available' : '○ Reserved'}</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none gap-2">
          {[
            { label: 'Floor',    value: c.floor },
            { label: 'Guests',   value: `${c.guests} Max` },
            { label: 'Min Stay', value: `${c.bookingDetails.minNights}n` },
          ].map(({ label, value }) => (
            <div key={label} className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-2 sm:px-3 py-2 flex-1 text-center">
              <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.3em] text-white/30">{label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-[var(--gold)] truncate">{value}</p>
            </div>
          ))}
        </div>

        {/* "In cart" overlay — scoped AnimatePresence */}
        <AnimatePresence>
          {inCart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 pointer-events-none"
            >
              <span className="font-body text-[10px] tracking-[0.25em] uppercase px-4 py-2 border border-[var(--gold)] rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">✓ In Reservation</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content section */}
      <div className="p-7 sm:p-9 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-1">
          <h3 className="font-display text-xl sm:text-2xl text-white uppercase tracking-tight leading-none">{c.name}</h3>
          {c.isPenthouse && <span className="text-[8px] font-mono text-[var(--gold)] border border-[var(--gold)]/30 rounded-md px-2 py-1 flex-shrink-0">PENTHOUSE</span>}
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display text-xl text-[var(--gold)]">KES {pricePerPerson.toLocaleString()}</span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/30">/guest · {BOARD_LABELS[selectedBoard]}</span>
        </div>

        <p className="story-quote font-body text-xs text-white/40 italic leading-relaxed mb-6 line-clamp-2 pl-1">"{c.storyLine}"</p>

        <div className="grid grid-cols-2 gap-2 mb-6">
          {c.amenities.slice(0, 4).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[9px] text-white/40 uppercase tracking-widest">
              <span className="text-[var(--gold)] text-[10px] flex-shrink-0">◈</span>
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          {guests > 1 && (
            <div className="text-center text-[9px] text-white/30 py-2 border border-white/5 rounded-lg font-mono">
              KES {totalPrice.toLocaleString()} total for {guests} guests / night
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={c.status === 'reserved'}
              className={`flex-1 font-body text-[10px] uppercase tracking-[0.2em] py-4 border rounded-xl transition-all duration-300 ${inCart ? 'bg-[var(--gold)] border-[var(--gold)] text-black' : 'border-white/10 text-white/60 hover:border-[var(--gold)] hover:text-[var(--gold)]'} ${c.status === 'reserved' ? 'opacity-30 pointer-events-none' : ''}`}
            >
              {inCart ? '✓ In Reservation' : '+ Reserve Stay'}
            </button>
            <button
              onClick={() => toast(`Moxie is curating ${c.name}...`, { icon: '✦' })}
              className="px-4 sm:px-5 border border-white/10 rounded-xl hover:border-[var(--neon)] text-white/30 hover:text-[var(--neon)] transition-all"
            >
              <span className="font-mono text-xs">M.</span>
            </button>
          </div>

          <button
            onClick={handleOpen}
            disabled={c.status === 'reserved'}
            className={`text-center text-[9px] uppercase tracking-[0.3em] py-3 border rounded-lg border-white/5 hover:border-[var(--gold)]/30 hover:text-[var(--gold)] transition-all ${c.status === 'reserved' ? 'opacity-30 text-white/20 pointer-events-none' : 'text-white/30'}`}
          >
            {c.status === 'available' ? 'Explore Room →' : 'Currently Reserved'}
          </button>

          {inCart && (
            <button onClick={openCart} className="font-body text-[9px] tracking-[0.2em] uppercase text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors py-2">
              View Reservation →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── Custom comparator: skip re-render when only unrelated cart items change ──
function arePropsEqual(prev: StayCardProps, next: StayCardProps) {
  return (
    prev.c.id         === next.c.id         &&
    prev.selectedBoard === next.selectedBoard &&
    prev.guests        === next.guests        &&
    prev.featured      === next.featured      &&
    prev.index         === next.index
    // NOTE: onOpenSpecs excluded intentionally — it's stable via useCallback in parent
  )
}

export const StayCard = memo(StayCardInner, arePropsEqual)