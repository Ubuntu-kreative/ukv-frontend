'use client'
/**
 * _components/MenuCard.tsx
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FIXES IN THIS REVISION
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * FIX-A  DEFENSIVE onOpenLog GUARD
 *   The crash `onOpenLog is not a function` happened because MenuGrid was
 *   not passing the prop.  MenuGrid.tsx is now fixed to always pass it, but
 *   this file adds a second line of defence: every call site uses
 *   `onOpenLog?.(item)` (optional chaining) so the component never throws
 *   even if the prop is accidentally omitted in a future refactor.
 *
 * FIX-B  handleAddToFeast — same guard
 *   The crashing line was:
 *     if (isStaged) { onOpenLog(item); return }
 *   Changed to:
 *     if (isStaged) { onOpenLog?.(item); return }
 *   This stops the TypeError from propagating through React's error boundary,
 *   which was causing the Turbopack hot-reload loop.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * EXISTING OPTIMISATIONS (unchanged)
 * ─────────────────────────────────────────────────────────────────────────────
 *   1. Tilt throttled via useRef + requestAnimationFrame — eliminates 3000+
 *      setState/sec that froze the browser with 50+ cards on screen.
 *   2. React.memo with custom comparator — card only re-renders when its own
 *      item ID, category, or onOpenLog identity changes.
 *   3. Granular Zustand selectors — subscribes only to the specific staged
 *      entry for this item and to addingId, not the whole store.
 *   4. DishImage memo'd — parent never re-renders on image load errors.
 *   5. handleMouseMove & handleAddToFeast in useCallback with stable deps.
 */

import { memo, useState, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useFeastStore }  from '../_store/feast-store'
import { useCartStore }   from '@/context/cartStore'
import type { MenuItem }  from '../_data/menu-data'

// ─── SUB-COMPONENTS ──────────────────────────────────────────────────────────

function DishBadge({ item }: { item: MenuItem }) {
  if (item.signature)  return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)] text-[7px] uppercase tracking-widest font-mono rounded-full">★ Signature</span>
  if (item.chefChoice) return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white/5 border border-white/20 text-white/60 text-[7px] uppercase tracking-widest font-mono rounded-full">Chef&apos;s Choice</span>
  if (item.seasonal)   return <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-[var(--neon)]/10 border border-[var(--neon)]/30 text-[var(--neon)] text-[7px] uppercase tracking-widest font-mono rounded-full">Seasonal</span>
  return null
}

function AvailabilityBadge({ item }: { item: MenuItem }) {
  if (!item.availability) return null
  const isLow      = typeof item.availabilityCount === 'number' && item.availabilityCount <= 3
  const isTomorrow = item.availability === 'Harvest Tomorrow'
  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-[7px] uppercase tracking-widest font-mono border rounded-full ${isLow ? 'bg-red-500/10 border-red-500/30 text-red-400' : isTomorrow ? 'bg-white/5 border-white/10 text-white/30' : 'bg-[var(--neon)]/5 border-[var(--neon)]/20 text-[var(--neon)]/60'}`}>
      {item.availability}
    </span>
  )
}

function TrendBar({ score }: { score?: number }) {
  if (!score || score < 60) return null
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex gap-0.5 items-end">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="w-0.5 rounded-full" style={{ height: `${5 + i * 2}px`, background: i <= Math.ceil(score / 20) ? 'var(--gold)' : 'rgba(255,255,255,0.08)' }} />
        ))}
      </div>
      <span className="font-mono text-[7px] text-[var(--gold)]/50 uppercase tracking-widest">
        {score >= 90 ? '🔥 Trending' : score >= 75 ? 'Popular' : 'Liked'}
      </span>
    </div>
  )
}

function Co2Badge({ score }: { score?: 'low' | 'medium' | 'high' }) {
  if (!score || score === 'medium') return null
  return (
    <span className={`px-2 py-0.5 text-[6px] uppercase tracking-widest font-mono border rounded-full ${score === 'low' ? 'bg-[var(--neon)]/5 border-[var(--neon)]/20 text-[var(--neon)]/50' : 'bg-orange-500/10 border-orange-500/20 text-orange-400'}`}>
      ◉ {score === 'low' ? 'Low Carbon' : 'Higher Impact'}
    </span>
  )
}

// Memo'd to prevent re-render on parent card tilt updates
const DishImage = memo(function DishImage({
  src, alt, className,
}: { src: string; alt: string; className?: string }) {
  const [err, setErr] = useState(false)
  return (
    <Image
      src={err ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' : src}
      alt={alt}
      fill
      loading="lazy"
      className={className}
      onError={() => setErr(true)}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
    />
  )
})

// ─── MENU CARD ───────────────────────────────────────────────────────────────

interface MenuCardProps {
  item:      MenuItem
  category:  string
  onOpenLog: (item: MenuItem) => void
}

function MenuCardInner({ item, category, onOpenLog }: MenuCardProps) {
  // Granular selectors — this card only re-renders when ITS data changes
  const addingId   = useFeastStore(s => s.addingId)
  const stageItem  = useFeastStore(s => s.stageItem)
  const stagedItem = useFeastStore(s => s.staged.find(p => p.item.id === item.id))
  const { addItem: addToCart } = useCartStore()

  const [localQty,  setLocalQty]  = useState(1)
  const [favorited, setFavorited] = useState(false)
  const [hovered,   setHovered]   = useState(false)
  const tiltRef = useRef({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)
  const rafRef  = useRef<number | null>(null)

  const isStaged  = !!stagedItem
  const stagedQty = stagedItem?.qty ?? 0
  const isAdding  = addingId === item.id

  // Tilt via rAF — at most one DOM write per animation frame
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (rafRef.current !== null) return
    rafRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) { rafRef.current = null; return }
      const rect = cardRef.current.getBoundingClientRect()
      const x = ((e.clientY - rect.top)  / rect.height - 0.5) * 3
      const y = ((e.clientX - rect.left) / rect.width  - 0.5) * -3
      cardRef.current.style.transform = hovered
        ? `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) translateY(-3px)`
        : 'none'
      tiltRef.current = { x, y }
      rafRef.current = null
    })
  }, [hovered])

  const handleMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (cardRef.current) cardRef.current.style.transform = ''
    setHovered(false)
  }, [])

  const syncToCart = useCallback((qty: number) => {
    addToCart({
      id: item.id, cartKey: `restaurant-${item.id}`, name: item.name,
      price: item.price, tag: item.tags?.[0] || 'Organic',
      category, unit: 'portion', qty,
    })
  }, [addToCart, item.id, item.name, item.price, item.tags, category])

  const handleAddToFeast = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    // FIX-B: optional chaining prevents crash if prop is ever missing
    if (isStaged) { onOpenLog?.(item); return }
    stageItem(item, category, localQty)
    syncToCart(localQty)
  }, [isStaged, stageItem, syncToCart, item, category, localQty, onOpenLog])

  return (
    <div
      ref={cardRef}
      className="group flex flex-col h-full overflow-hidden rounded-2xl"
      style={{
        background: isStaged ? 'rgba(200,168,75,0.04)' : 'rgba(255,255,255,0.02)',
        border:     isStaged ? '1px solid rgba(200,168,75,0.2)' : '1px solid rgba(255,255,255,0.05)',
        transition: 'background 0.35s, border 0.35s, box-shadow 0.35s, transform 0.15s',
        boxShadow:  isStaged ? '0 0 0 1px rgba(200,168,75,0.1), 0 12px 40px rgba(200,168,75,0.06)'
                             : hovered ? '0 20px 48px rgba(0,0,0,0.5)' : '0 4px 16px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {/* ── Image area — click anywhere to open full log ── */}
      <div
        className="relative aspect-[4/3] overflow-hidden cursor-pointer rounded-t-2xl"
        // FIX-A: optional chain on every call site
        onClick={() => onOpenLog?.(item)}
      >
        <DishImage
          src={item.image}
          alt={item.name}
          className="object-cover transition-all duration-[2s] group-hover:scale-[1.08] contrast-[1.05] saturate-[1.05] grayscale-[30%] group-hover:grayscale-0"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Freshness badge */}
        <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 text-[7px] text-[var(--neon)] font-mono uppercase tracking-widest border border-[var(--neon)]/20 rounded-lg">
          {item.freshness}% FRESH
        </div>

        {/* Favourite button */}
        <button
          onClick={e => { e.stopPropagation(); setFavorited(f => !f) }}
          className="absolute top-3 left-3 w-7 h-7 bg-black/50 border border-white/10 rounded-lg flex items-center justify-center hover:border-[var(--gold)]/40 transition-all z-10"
        >
          <span className={`text-[11px] transition-colors ${favorited ? 'text-[var(--gold)]' : 'text-white/20 hover:text-white/50'}`}>
            {favorited ? '♥' : '♡'}
          </span>
        </button>

        {/* In-feast overlay */}
        {isStaged && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
            <span className="px-4 py-2 border border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)] font-mono text-[9px] uppercase tracking-widest rounded-full">
              ✓ In Feast ×{stagedQty}
            </span>
          </div>
        )}

        {/* Chef's pick badge */}
        {item.featured && item.signature && !isStaged && (
          <div className="absolute bottom-10 left-3 px-2 py-1 bg-black/70 backdrop-blur-sm border border-[var(--gold)]/20 text-[var(--gold)] font-mono text-[7px] uppercase tracking-widest rounded-lg">
            🔥 Chef&apos;s Pick Tonight
          </div>
        )}

        {/* Hot badge */}
        {(item.trendScore ?? 0) >= 85 && !isStaged && !item.featured && (
          <div className="absolute top-10 right-3 px-2 py-0.5 bg-orange-500/15 border border-orange-500/30 text-orange-300 font-mono text-[7px] uppercase tracking-widest rounded-lg">
            🔥 Hot
          </div>
        )}

        {/* Price overlay */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="font-display text-xl text-[var(--cream)]">KES {item.price.toLocaleString()}</div>
          <div className="text-[8px] text-[var(--neon)]/50 tracking-widest uppercase font-mono mt-0.5">[{item.id}]</div>
        </div>

        {/* Hover CTA hint */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <span className="bg-black/60 backdrop-blur-sm border border-white/10 px-4 py-2 font-mono text-[8px] text-white/50 uppercase tracking-widest rounded-full">
            View Full Log →
          </span>
        </div>
      </div>

      {/* ── Card body ── */}
      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="flex flex-wrap gap-1.5 mb-3">
          <DishBadge item={item} />
          <AvailabilityBadge item={item} />
        </div>

        <h3 className="font-display text-xl sm:text-2xl text-[var(--cream)] mb-1.5 group-hover:text-[var(--gold)] transition-colors duration-300 uppercase tracking-tight leading-none">
          {item.name}
        </h3>

        <p className="font-body text-xs text-white/40 leading-relaxed mb-3 italic line-clamp-2">
          &ldquo;{item.storyLine || item.description}&rdquo;
        </p>

        {item.pairing && (
          <p className="text-[8px] uppercase tracking-widest text-[var(--gold)]/40 mb-3 font-mono">◈ {item.pairing}</p>
        )}

        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <TrendBar score={item.trendScore} />
          <Co2Badge score={item.co2Score} />
        </div>

        {/* Data grid */}
        <div className="grid grid-cols-2 border border-white/8 mb-4 bg-black/30 rounded-xl overflow-hidden text-center">
          <div className="p-2.5 border-r border-white/8">
            <div className="text-[7px] uppercase text-white/25 mb-0.5">Source</div>
            <div className="text-[10px] text-white/70 font-mono truncate px-1">{item.field || item.animal}</div>
          </div>
          <div className="p-2.5">
            <div className="text-[7px] uppercase text-white/25 mb-0.5">Freshness</div>
            <div className="text-[10px] text-[var(--neon)]">{item.freshness}%</div>
          </div>
          {item.prepTime && (
            <div className="p-2.5 border-r border-t border-white/8">
              <div className="text-[7px] uppercase text-white/25 mb-0.5">Prep</div>
              <div className="text-[10px] text-white/60 font-mono">{item.prepTime}m</div>
            </div>
          )}
          {item.servingSize && (
            <div className="p-2.5 border-t border-white/8">
              <div className="text-[7px] uppercase text-white/25 mb-0.5">Serving</div>
              <div className="text-[10px] text-white/60 font-mono truncate">{item.servingSize}</div>
            </div>
          )}
        </div>

        {/* Qty stepper */}
        {!isStaged && (
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[8px] uppercase tracking-widest text-white/25">Qty</span>
            <button
              onClick={e => { e.stopPropagation(); setLocalQty(q => Math.max(1, q - 1)) }}
              className="w-6 h-6 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all text-xs flex items-center justify-center rounded-md"
            >−</button>
            <span className="font-mono text-sm text-white/70 w-5 text-center">{localQty}</span>
            <button
              onClick={e => { e.stopPropagation(); setLocalQty(q => q + 1) }}
              className="w-6 h-6 border border-white/10 text-white/40 hover:text-white hover:border-white/30 transition-all text-xs flex items-center justify-center rounded-md"
            >+</button>
          </div>
        )}

        {/* Action row */}
        <div className="flex items-center gap-2 mt-auto">
          {/* Log button — FIX-A: optional chain */}
          <button
            onClick={() => onOpenLog?.(item)}
            className="px-4 py-2.5 border border-white/10 text-[9px] uppercase tracking-widest text-white/40 hover:text-white hover:border-white/25 transition-colors rounded-xl flex-shrink-0"
          >
            Log
          </button>

          {/* Add to Feast / In Feast button — FIX-B: optional chain inside handler */}
          <button
            onClick={handleAddToFeast}
            className={`flex-1 py-2.5 text-[9px] uppercase tracking-widest font-bold transition-all duration-400 rounded-xl ${
              isAdding   ? 'bg-[var(--neon)] text-black scale-[0.97]'
              : isStaged ? 'bg-[var(--gold)]/15 border border-[var(--gold)]/40 text-[var(--gold)]'
              : 'bg-[var(--gold)] text-black hover:bg-[var(--gold-light)] active:scale-[0.98]'
            }`}
          >
            {isAdding
              ? '✓ Added'
              : isStaged
              ? `✓ In Feast ×${stagedQty}`
              : `Add ${localQty > 1 ? `×${localQty} ` : ''}to Feast`}
          </button>
        </div>
      </div>
    </div>
  )
}

// Custom comparator — only re-render if item, category, or callback identity changed
export const MenuCard = memo(MenuCardInner, (prev, next) =>
  prev.item.id  === next.item.id  &&
  prev.category === next.category &&
  prev.onOpenLog === next.onOpenLog
)