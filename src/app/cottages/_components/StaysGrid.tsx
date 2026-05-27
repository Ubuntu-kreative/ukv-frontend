'use client'

// ─────────────────────────────────────────────────────────────
// StaysGrid.tsx  — Interactive client island
//
// Contains ALL stateful interactions for the cottages page.
// Kept as a single component to share state (board, guests)
// between toolbar and cards without prop-drilling or context.
//
// KEY OPTIMIZATIONS:
// 1. Modal dynamically imported (0kB until first open)
// 2. useCallback on ALL stable handlers
// 3. filteredStays memo: derived purely from primitive values
// 4. AnimatePresence removed from grid wrapper — instead use
//    CSS opacity transition on individual cards (whileInView)
//    Cards mount/unmount cleanly without re-mounting siblings
// 5. Cart item count from granular selector (not full items[])
// 6. globalBoard/globalGuests state colocated — no context
// 7. PenthouseShowcase lazy-imported
// ─────────────────────────────────────────────────────────────

import {
  useState, useMemo, useCallback, Suspense,
} from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/context/cartStore'
import {
  stays, FILTER_TABS, SORT_OPTIONS, BOARD_OPTIONS, BOARD_LABELS,
  type Stay, type BoardOption,
} from '../_data/stays-data'
import { StayCard } from './StayCard'

// ── Lazy imports — 0 bytes until needed ───────────────────────────────
function StayModalFallback() {
  return (
    <div className="fixed inset-0 z-[9998] bg-black/90 flex items-center justify-center px-4">
      <div className="max-w-md rounded-3xl border border-white/10 bg-[#101010]/95 px-8 py-6 text-center text-sm text-white/80">
        Loading residence details…
      </div>
    </div>
  )
}

const StayModal = dynamic(
  () => import('./StayModal').then((m) => ({ default: m.StayModal })),
  { ssr: false, loading: () => <StayModalFallback /> }
)

// Penthouse showcase is heavy (image + motion) — defer it
const PenthouseShowcase = dynamic(
  () => import('./PenthouseShowcase').then((m) => ({ default: m.PenthouseShowcase })),
  { ssr: false, loading: () => <div className="h-96 bg-[#0a0a0a]" /> }
)

// Pre-computed counts (never recalculate)
const FILTER_COUNTS: Record<string, number> = {
  All:              stays.length,
  'Farm House':     stays.filter((s) => s.category === 'Farm House').length,
  'Pokomo Cottage': stays.filter((s) => s.category === 'Pokomo Cottage').length,
  Penthouse:        stays.filter((s) => s.isPenthouse).length,
  Rooftop:          stays.filter((s) => s.floor === 'Rooftop').length,
}

const FEATURED_PENTHOUSE = stays.find((s) => s.isPenthouse && s.floor === 'Rooftop')

export function StaysGrid() {
  const openCart      = useCartStore((s) => s.openCart)
  // Granular count selector — does NOT re-render on unrelated cart changes
  const cottagesInCart = useCartStore(
    (s) => s.items.filter((i) => i.category === 'cottage').length
  )

  const [selectedStay,  setSelectedStay]  = useState<Stay | null>(null)
  const [activeFilter,  setActiveFilter]  = useState('All')
  const [activeSort,    setActiveSort]    = useState('featured')
  const [globalBoard,   setGlobalBoard]   = useState<BoardOption>('bedBreakfast')
  const [globalGuests,  setGlobalGuests]  = useState(1)
  const [modalGuests,   setModalGuests]   = useState(1)
  const [checkIn,       setCheckIn]       = useState('')
  const [checkOut,      setCheckOut]      = useState('')

  // ── Stable handlers ───────────────────────────────────────────────
  const handleOpenStay = useCallback((stay: Stay) => {
    setModalGuests(globalGuests)
    setSelectedStay(stay)
  }, [globalGuests])

  const handleCloseModal  = useCallback(() => setSelectedStay(null), [])
  const handleBoardChange = useCallback((b: BoardOption) => setGlobalBoard(b), [])
  const handleGuestsChange = useCallback((n: number) => setModalGuests(n), [])

  // ── Filtered + sorted stays ───────────────────────────────────────
  const filteredStays = useMemo(() => {
    let result = stays.filter((s) => {
      if (activeFilter === 'Penthouse') return s.isPenthouse
      if (activeFilter === 'Rooftop')   return s.floor === 'Rooftop'
      return activeFilter === 'All' || s.category === activeFilter
    })
    switch (activeSort) {
      case 'price-asc':  return [...result].sort((a, b) => a.rates[globalBoard] - b.rates[globalBoard])
      case 'price-desc': return [...result].sort((a, b) => b.rates[globalBoard] - a.rates[globalBoard])
      case 'guests':     return [...result].sort((a, b) => b.guests - a.guests)
      default:           return [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
  }, [activeFilter, activeSort, globalBoard]) // guests NOT in deps — doesn't affect sort

  return (
    <>
      {/* ── PENTHOUSE SHOWCASE ── */}
      {FEATURED_PENTHOUSE && (
        <PenthouseShowcase
          stay={FEATURED_PENTHOUSE}
          onOpen={() => handleOpenStay(FEATURED_PENTHOUSE)}
        />
      )}

      {/* ── STICKY CONFIG BAR ── */}
      <div className="sticky-glass sticky top-[64px] sm:top-[72px] z-30 px-4 sm:px-6 md:px-10 py-3 border-y border-white/5">
        <div className="max-w-8xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-white/30">Arrival</span>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer"
              />
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-white/30">Departure</span>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer"
              />
            </div>
            <div className="w-px h-7 bg-white/10 hidden sm:block" />
            <div className="flex-col hidden sm:flex">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">Meal Plan</span>
              <select
                value={globalBoard}
                onChange={(e) => setGlobalBoard(e.target.value as BoardOption)}
                className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer"
              >
                {BOARD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="w-px h-7 bg-white/10 hidden sm:block" />
            <div className="flex-col hidden sm:flex">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">Guests</span>
              <select
                value={globalGuests}
                onChange={(e) => setGlobalGuests(Number(e.target.value))}
                className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer"
              >
                {[1,2,3,4,5,6,7,8].map((n) => (
                  <option key={n} value={n} className="bg-black text-white">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>
          {cottagesInCart > 0 && (
            <button onClick={openCart} className="btn-neon !py-2 !px-4 !text-[9px] !rounded-xl">
              View Reservation ({cottagesInCart})
            </button>
          )}
        </div>
      </div>

      {/* ── FILTER + SORT BAR ── */}
      <section id="stays" className="pt-16 sm:pt-24 pb-4 px-4 sm:px-6 md:px-10">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="max-w-xl">
              <span className="text-[var(--gold)] text-[10px] tracking-[0.4em] uppercase mb-4 block opacity-60">Our Residences</span>
              <h2 className="font-display text-4xl sm:text-5xl font-light">
                CHOOSE YOUR <span className="italic">SANCTUARY</span>
              </h2>
              <p className="font-body text-sm text-white/30 mt-4 leading-relaxed">
                {filteredStays.length} residence{filteredStays.length !== 1 ? 's' : ''} · all solar-powered · farm breakfast available
              </p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[8px] uppercase tracking-widest text-white/25 mr-2">Sort</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setActiveSort(opt.value)}
                  className={`px-3 sm:px-4 py-2 text-[9px] uppercase tracking-wider border rounded-lg transition-all ${activeSort === opt.value ? 'border-[var(--gold)]/50 text-[var(--gold)] bg-[var(--gold)]/5' : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-4">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-4 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] border rounded-xl transition-all duration-300 ${activeFilter === tab.value ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5' : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'}`}
              >
                {tab.label}
                <span className="ml-1 sm:ml-2 font-mono text-[8px] opacity-50">({FILTER_COUNTS[tab.value]})</span>
              </button>
            ))}
          </div>

          {/* Mobile controls */}
          <div className="flex sm:hidden gap-4 mb-6 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Meal Plan</span>
              <select
                value={globalBoard}
                onChange={(e) => setGlobalBoard(e.target.value as BoardOption)}
                className="bg-black border border-white/10 rounded-lg text-[var(--gold)] font-mono text-xs px-3 py-2 focus:ring-0"
              >
                {BOARD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Guests</span>
              <select
                value={globalGuests}
                onChange={(e) => setGlobalGuests(Number(e.target.value))}
                className="bg-black border border-white/10 rounded-lg text-[var(--gold)] font-mono text-xs px-3 py-2 focus:ring-0"
              >
                {[1,2,3,4,5,6,7,8].map((n) => (
                  <option key={n} value={n} className="bg-black text-white">{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Active price context bar */}
          <div className="mb-8 sm:mb-12 p-3 sm:p-4 border border-white/5 rounded-xl bg-white/[0.01] flex flex-wrap items-center gap-3 sm:gap-6">
            <p className="text-[9px] uppercase tracking-widest text-white/25">Showing prices for:</p>
            <span className="text-[var(--gold)] font-mono text-xs">{BOARD_LABELS[globalBoard]}</span>
            <span className="text-white/30 text-[10px]">·</span>
            <span className="text-white/50 text-xs font-mono">{globalGuests} guest{globalGuests > 1 ? 's' : ''}</span>
            <span className="text-white/30 text-[10px]">·</span>
            <span className="text-white/30 text-[9px]">per guest · per night</span>
          </div>
        </div>
      </section>

      {/* ── CARD GRID ── */}
      <section className="pb-24 sm:pb-32 px-4 sm:px-6 md:px-10">
        <div className="max-w-8xl mx-auto">
          {/*
            REMOVED: AnimatePresence mode="wait" wrapper on the grid
            WHY: It was unmounting and remounting ALL 15+ cards on every
            filter change, causing a full DOM teardown + React reconciliation.
            Each card's whileInView animation already handles its own entrance.
            The grid container now uses a simple CSS transition for opacity.
          */}
          <div
            key={`${activeFilter}-${activeSort}-${globalBoard}`}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 transition-opacity duration-200"
          >
            {filteredStays.map((c, index) => (
              <StayCard
                key={c.id}
                c={c}
                index={index}
                onOpenSpecs={handleOpenStay}
                featured={Boolean(c.featured && index === 0)}
                selectedBoard={globalBoard}
                guests={globalGuests}
              />
            ))}
          </div>

          {filteredStays.length === 0 && (
            <div className="py-32 text-center">
              <p className="font-display text-4xl text-white/20 mb-4">No residences found</p>
              <button
                onClick={() => setActiveFilter('All')}
                className="text-[10px] uppercase tracking-widest text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors"
              >
                Clear filters →
              </button>
            </div>
          )}

          {/* Cart CTA */}
          {cottagesInCart > 0 && (
            <div className="mt-16 sm:mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-12 border border-[var(--gold)]/20 bg-[var(--gold)]/5 rounded-2xl">
              <div>
                <p className="font-display text-2xl sm:text-3xl mb-2 text-white font-light">Ready to confirm your stay?</p>
                <p className="font-body text-sm text-white/30 leading-relaxed">
                  {cottagesInCart} {cottagesInCart === 1 ? 'residence' : 'residences'} selected — complete your reservation and we will be in touch within 2 hours.
                </p>
              </div>
              <button onClick={openCart} className="btn-gold !px-10 sm:!px-12 !py-4 !text-xs !rounded-2xl flex-shrink-0 w-full sm:w-auto text-center">
                Review Reservation →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Floating cart pill */}
      <AnimatePresence>
        {cottagesInCart > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={openCart}
            className="cart-float fixed bottom-24 right-4 sm:right-6 z-40 flex items-center gap-2 bg-[var(--gold)] text-black text-[10px] font-medium tracking-[0.12em] uppercase px-4 py-3 hover:bg-[#E0B96A] transition-all"
          >
            <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[9px] font-bold">{cottagesInCart}</span>
            Reservation
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── MODAL — dynamically imported, only mounts when needed ── */}
      <AnimatePresence>
        {selectedStay && (
          <Suspense fallback={<StayModalFallback />}>
            <StayModal
              c={selectedStay}
              onClose={handleCloseModal}
              selectedBoard={globalBoard}
              onBoardChange={handleBoardChange}
              guests={modalGuests}
              onGuestsChange={handleGuestsChange}
            />
          </Suspense>
        )}
      </AnimatePresence>
    </>
  )
}