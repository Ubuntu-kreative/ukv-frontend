'use client'
/**
 * _components/LogModal.tsx
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BUG AUDIT & FIXES — this revision only
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * CRASH-1  item.dietary.join(', ')  →  TypeError: Cannot read properties of
 *          undefined (reading 'join')                          [line 271 orig]
 *
 *   Root cause: The Dish / MenuItem type has NO `dietary` field.
 *   The correct field name is `tags: DietaryTag[]`.
 *   `item.dietary` is always `undefined` at runtime — calling `.join()` on it
 *   crashes every time the Nutrition tab is opened.
 *
 *   Fix: replaced `item.dietary.join(', ')` with
 *        `(item.tags ?? []).join(', ') || '—'`
 *
 * CRASH-2  item.dietary[0]  in handleFirstAdd               [line 149 orig]
 *
 *   Same root cause — `dietary` does not exist on Dish.
 *   `item.dietary[0]` evaluates to `undefined[0]` → TypeError.
 *
 *   Fix: replaced with `item.tags?.[0] ?? 'Organic'`
 *
 * CRASH-3  item.ingredients.map(...)  — unsafe direct .map()  [line 238 orig]
 *
 *   `ingredients` is declared `optional` in the Dish type (`ingredients?: string[]`).
 *   Several dishes in the dataset omit it entirely.
 *   Calling `.map()` directly on `undefined` throws at runtime.
 *
 *   Fix: `(item.ingredients ?? []).map(...)`
 *   Also wrapped the outer `<div>` in a length guard so the "Ingredients"
 *   heading is hidden when the array is empty.
 *
 * CRASH-4  item.allergens.map(...)  — unsafe direct .map()    [line 244 orig]
 *
 *   `allergens` is `allergens?: string[]` — optional.
 *   The outer guard only checked `item.allergens && item.allergens[0] !== 'None'`
 *   which is correct for hiding the block, but if the block renders, .map()
 *   itself was safe — however a second call at line 272 used
 *   `item.allergens?.join(', ')` (correct optional chain). The inconsistency
 *   was risky. Both sites now use `(item.allergens ?? [])`.
 *
 * HIDDEN-1  item.dietary?.[0] in syncToCart             [line 143 orig]
 *
 *   Used optional chaining so it didn't crash, but produced `undefined` as
 *   the cart `tag` value, which silently corrupted cart entries.
 *   Fix: replaced with `item.tags?.[0] ?? 'Organic'` (consistent with CRASH-2).
 *
 * HIDDEN-2  item.offset in Specs tab — `${item.offset} CO₂e`
 *
 *   `offset` is `offset?: string` — when undefined, renders as
 *   "undefined CO₂e" in the UI.
 *   Fix: `item.offset ? \`${item.offset} CO₂e\` : '—'`
 *
 * HIDDEN-3  item.temp / item.phLevel in Specs tab
 *
 *   Both optional. Rendered as `undefined` when missing.
 *   Fix: fallback `|| '—'` on both.
 *
 * HIDDEN-4  item.field in Provenance tab
 *
 *   `field?: string` — optional. Rendered as `undefined` when missing.
 *   Fix: `item.field || '—'`
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * NOTHING ELSE CHANGED — UI, layout, styling, animation, and all logic
 * outside the above lines are byte-for-byte identical to the original.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import { useFeastStore } from '../_store/feast-store'
import { useCartStore }  from '@/context/cartStore'
import type { MenuItem } from '../_data/menu-data'

// ─── DISH IMAGE (error boundary built-in) ────────────────────────────────────

function DishImage({
  src, alt, className, onClick,
}: { src: string; alt: string; className?: string; onClick?: () => void }) {
  const [err, setErr] = useState(false)
  return (
    <Image
      src={err ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' : src}
      alt={alt} fill loading="lazy" className={className}
      onError={() => setErr(true)} onClick={onClick}
      sizes="(max-width: 768px) 100vw, 46vw"
    />
  )
}

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

// ─── LOG MODAL ───────────────────────────────────────────────────────────────

interface LogModalProps {
  item:    MenuItem
  onClose: () => void
}

export default function LogModal({ item, onClose }: LogModalProps) {
  const stageItem     = useFeastStore(s => s.stageItem)
  const updateQty     = useFeastStore(s => s.updateQty)
  const getStagedItem = useFeastStore(s => s.getStagedItem)
  const stagedCount   = useFeastStore(s => s.stagedCount)
  const addingId      = useFeastStore(s => s.addingId)
  const { openCart, addItem } = useCartStore()

  const [localQty,  setLocalQty]  = useState(1)
  const [zoomed,    setZoomed]    = useState(false)
  const [zoomPos,   setZoomPos]   = useState({ x: 0, y: 0 })
  const [activeTab, setActiveTab] = useState<'story' | 'specs' | 'nutrition' | 'provenance'>('story')
  const [cookPref,  setCookPref]  = useState('')
  const [note,      setNote]      = useState('')
  const zoomRafRef = useRef<number | null>(null)

  const stagedItem = getStagedItem(item.id)
  const isStaged   = !!stagedItem
  const fCount     = stagedCount()

  // Body scroll lock — captures original and restores on cleanup
  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomed) setZoomed(false)
        else onClose()
      }
    }
    window.addEventListener('keydown', fn)
    return () => {
      window.removeEventListener('keydown', fn)
      document.body.style.overflow = original
    }
  }, [zoomed, onClose])

  // Zoom mousemove throttled via rAF
  const handleZoomMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!zoomed) return
    if (zoomRafRef.current !== null) return
    const { clientX, clientY } = e
    const rect = e.currentTarget.getBoundingClientRect()
    zoomRafRef.current = requestAnimationFrame(() => {
      setZoomPos({
        x: ((clientX - rect.left) / rect.width  - 0.5) * -40,
        y: ((clientY - rect.top)  / rect.height - 0.5) * -40,
      })
      zoomRafRef.current = null
    })
  }, [zoomed])

  // HIDDEN-1 FIX: use item.tags (the real field) not item.dietary (doesn't exist)
  const syncToCart = useCallback((qty: number) => {
    addItem({
      id: item.id, cartKey: `restaurant-${item.id}`, name: item.name,
      price: item.price, tag: item.tags?.[0] ?? 'Organic',
      category: 'restaurant', unit: 'portion', qty,
    })
  }, [addItem, item])

  // CRASH-2 FIX: item.dietary does not exist — use item.tags
  const handleFirstAdd = useCallback(() => {
    stageItem(item, item.tags?.[0] ?? 'Organic', localQty)
    syncToCart(localQty)
  }, [stageItem, syncToCart, item, localQty])

  const handleAddMore = useCallback(() => {
    updateQty(item.id, localQty)
    syncToCart(localQty)
  }, [updateQty, syncToCart, item.id, localQty])

  const tabs = [
    { key: 'story'      as const, label: 'Story'      },
    { key: 'specs'      as const, label: 'Specs'      },
    { key: 'nutrition'  as const, label: 'Nutrition'  },
    { key: 'provenance' as const, label: 'Provenance' },
  ]
  const cookOptions = item.customisable ? ['Wet Fry', 'Dry Fry', 'Grilled', 'Choma', 'Boiled'] : []

  // Safe array helpers — avoids repeating null-coalescing at every call site
  const safeIngredients = item.ingredients ?? []
  const safeAllergens   = item.allergens   ?? []
  const safeTags        = item.tags        ?? []

  return (
    <>
      <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/95 backdrop-blur-2xl p-0 sm:p-4 md:p-6">
        <div className="absolute inset-0" onClick={onClose} />
        <div className="relative w-full max-w-6xl h-[95dvh] sm:h-[90vh] flex flex-col md:flex-row bg-[#060606] overflow-hidden shadow-[0_0_120px_rgba(0,0,0,0.9)] rounded-t-3xl sm:rounded-2xl border border-white/[0.06]">

          {/* ── Left: image ── */}
          <div className="relative md:w-[46%] h-56 sm:h-72 md:h-full flex-shrink-0 bg-black overflow-hidden group rounded-t-3xl sm:rounded-tl-2xl sm:rounded-bl-2xl md:rounded-tr-none">
            <div className="relative w-full h-full cursor-zoom-in overflow-hidden" onClick={() => setZoomed(true)} onMouseMove={handleZoomMove}>
              <DishImage src={item.image} alt={item.name} className="object-cover transition-transform duration-[2s] group-hover:scale-105 grayscale-[20%] group-hover:grayscale-0" />
              <div className="absolute inset-0 pointer-events-none opacity-[0.04]" style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.1) 2px,rgba(255,255,255,0.1) 4px)' }} />
              {(['top-4 left-4 border-t-2 border-l-2','top-4 right-4 border-t-2 border-r-2','bottom-4 left-4 border-b-2 border-l-2','bottom-4 right-4 border-b-2 border-r-2'] as const).map((c, i) => (
                <div key={i} className={`absolute w-7 h-7 ${c} border-[var(--neon)]/30 pointer-events-none`} />
              ))}
              <div className="absolute top-3 right-12 bg-black/60 backdrop-blur-sm px-2 py-1 text-[8px] text-[var(--neon)] font-mono uppercase tracking-widest border border-[var(--neon)]/20 rounded-md">{item.freshness}% FRESH</div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 px-5 py-4 bg-gradient-to-t from-black via-black/60 to-transparent pointer-events-none">
              <p className="font-display text-2xl text-[var(--gold)]">KES {item.price.toLocaleString()}</p>
              {item.servingSize && <p className="font-mono text-[8px] text-white/30 mt-0.5">{item.servingSize}</p>}
            </div>
          </div>

          {/* ── Right: detail ── */}
          <div className="flex-1 flex flex-col overflow-hidden min-h-0">

            {/* Header */}
            <div className="flex items-center justify-between px-5 sm:px-8 py-4 border-b border-white/5 flex-shrink-0">
              <div className="flex flex-wrap gap-2">
                <DishBadge item={item} />
                <AvailabilityBadge item={item} />
                {(item.trendScore ?? 0) >= 75 && (
                  <span className="px-2.5 py-1 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[7px] uppercase tracking-widest font-mono rounded-full">
                    {(item.trendScore ?? 0) >= 90 ? '🔥 Hot Tonight' : '↑ Trending'}
                  </span>
                )}
              </div>
              {fCount > 0 && (
                <button onClick={() => { onClose(); openCart() }} className="flex items-center gap-2 bg-[var(--gold)] text-black font-bold uppercase tracking-widest px-3 py-2 text-[8px] rounded-xl hover:bg-[var(--gold-light)] transition-colors">
                  <span className="w-4 h-4 rounded-full bg-black text-[var(--gold)] flex items-center justify-center text-[8px] font-black">{fCount}</span>
                  View Feast
                </button>
              )}
            </div>

            {/* Title */}
            <div className="px-5 sm:px-8 pt-5 pb-3 flex-shrink-0">
              <h2 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-tight leading-[0.9] mb-2">{item.name}</h2>
              <div className="flex flex-wrap items-center gap-3 mt-1.5">
                {item.pairing && <p className="font-mono text-[8px] text-[var(--gold)]/50 uppercase tracking-widest">◈ {item.pairing}</p>}
                <TrendBar score={item.trendScore} />
                <Co2Badge score={item.co2Score} />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-0 border-b border-white/5 px-5 sm:px-8 flex-shrink-0 overflow-x-auto">
              {tabs.map(t => (
                <button key={t.key} onClick={() => setActiveTab(t.key)}
                  className={`pb-3 pr-5 text-[9px] uppercase tracking-widest whitespace-nowrap border-b-2 transition-all duration-200 ${activeTab === t.key ? 'border-[var(--gold)] text-[var(--gold)]' : 'border-transparent text-white/25 hover:text-white/50'}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="flex-1 overflow-y-auto px-5 sm:px-8 py-5" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,168,75,0.15) transparent' }}>

              {/* ── STORY TAB ── */}
              {activeTab === 'story' && (
                <div className="space-y-4">
                  <p className="font-body text-sm text-white/50 italic leading-relaxed">&ldquo;{item.storyLine || item.description}&rdquo;</p>
                  <p className="font-body text-xs text-white/30 leading-relaxed">{item.description}</p>

                  {/* CRASH-3 FIX: safeIngredients guards against undefined — only render block when non-empty */}
                  {safeIngredients.length > 0 && (
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/20 mb-2.5">Ingredients</p>
                      <div className="flex flex-wrap gap-1.5">
                        {safeIngredients.map(ing => (
                          <span key={ing} className="px-2.5 py-1 bg-white/[0.03] border border-white/5 text-[10px] text-white/50 font-body rounded-lg">
                            {ing}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CRASH-4 FIX: safeAllergens — guard handles undefined and ['None'] correctly */}
                  {safeAllergens.length > 0 && safeAllergens[0] !== 'None' && (
                    <div>
                      <p className="text-[8px] uppercase tracking-widest text-white/20 mb-2.5">Allergens</p>
                      <div className="flex flex-wrap gap-1.5">
                        {safeAllergens.map(a => (
                          <span key={a} className="px-2 py-1 bg-red-500/10 border border-red-500/20 text-[9px] text-red-400 uppercase tracking-wider rounded-lg">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── SPECS TAB ── */}
              {activeTab === 'specs' && (
                <div className="grid grid-cols-2 gap-2.5">
                  {([
                    // HIDDEN-2 FIX: offset is optional — render '—' when missing
                    // HIDDEN-3 FIX: temp and phLevel are optional — fallback to '—'
                    ['Source',      item.field || item.animal || '—'],
                    ['Temperature', item.temp       || '—'],
                    ['pH Level',    item.phLevel     || '—'],
                    ['Offset',      item.offset ? `${item.offset} CO₂e` : '—'],
                    ...(item.prepTime    ? [['Prep Time', `${item.prepTime} min`]] : []),
                    ...(item.servingSize ? [['Serving',    item.servingSize]]       : []),
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="p-3 border border-white/5 bg-white/[0.02] rounded-xl">
                      <p className="text-[7px] uppercase tracking-widest text-white/25 mb-1">{k}</p>
                      <p className="font-mono text-[11px] text-white/80 truncate">{v}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── NUTRITION TAB ── */}
              {activeTab === 'nutrition' && (
                <div className="space-y-3">
                  {([
                    ['Calories',     item.calories ? `${item.calories} kcal` : '—'],
                    ['Serving Size', item.servingSize || '—'],
                    // CRASH-1 FIX: item.dietary does not exist — the real field is item.tags
                    // safeTags is already guarded with ?? [] above
                    ['Dietary Tags', safeTags.join(', ') || '—'],
                    // CRASH-4 FIX (nutrition): safeAllergens guards against undefined
                    ['Allergens',    safeAllergens.join(', ') || 'None'],
                    ['Freshness',    `${item.freshness ?? '—'}%`],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start border-b border-white/5 pb-3">
                      <span className="text-[9px] uppercase tracking-widest text-white/25">{k}</span>
                      <span className="font-mono text-[10px] text-white/70 text-right max-w-[55%]">{v}</span>
                    </div>
                  ))}
                  <div className="pt-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-[8px] uppercase tracking-widest text-white/20">Freshness</span>
                      <span className="font-mono text-[9px] text-[var(--neon)]">{item.freshness ?? '—'}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/8 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[var(--neon)] to-emerald-400 transition-all duration-1000"
                        style={{ width: `${item.freshness ?? 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ── PROVENANCE TAB ── */}
              {activeTab === 'provenance' && (
                <div className="space-y-3">
                  {([
                    // HIDDEN-4 FIX: item.field is optional — fallback to '—'
                    ['Source Location', item.field  || '—'],
                    ['Animal Tag',      item.animal || 'Farm Sourced'],
                    ['Harvest Time',    'Dawn — same day'],
                    ['Distance',        '< 2km from kitchen'],
                    ['Logistics',       'Zero-emission, on-farm'],
                    ['Certification',   'Ubuntu Farm Organic Standard'],
                  ] as [string, string][]).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-start border-b border-white/5 pb-3">
                      <span className="text-[9px] uppercase tracking-widest text-white/25">{k}</span>
                      <span className="font-mono text-[10px] text-white/70 text-right max-w-[60%]">{v}</span>
                    </div>
                  ))}
                  <div className="p-4 border border-[var(--neon)]/10 bg-[var(--neon)]/[0.03] rounded-xl">
                    <p className="font-mono text-[8px] text-[var(--neon)]/50 uppercase tracking-widest mb-1">Traceability Chain</p>
                    <p className="font-body text-[10px] text-white/30 italic leading-relaxed">Soil tested weekly · Animal welfare certified · No synthetic inputs · Carbon logged per batch</p>
                  </div>
                </div>
              )}
            </div>

            {/* ── CTA panel ── */}
            <div className="px-5 sm:px-8 py-5 border-t border-white/5 bg-black/60 flex-shrink-0 space-y-3">
              {cookOptions.length > 0 && (
                <div>
                  <p className="text-[8px] uppercase tracking-widest text-white/25 mb-2">Cooking Preference</p>
                  <div className="flex gap-2 flex-wrap">
                    {cookOptions.map(opt => (
                      <button key={opt} onClick={() => setCookPref(opt === cookPref ? '' : opt)}
                        className={`px-3 py-1.5 text-[8px] uppercase tracking-wider border transition-all rounded-lg ${cookPref === opt ? 'border-[var(--gold)]/60 text-[var(--gold)] bg-[var(--gold)]/5' : 'border-white/10 text-white/30 hover:border-white/20'}`}>
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <input
                type="text"
                placeholder="Special request or note (optional)"
                value={note}
                onChange={e => setNote(e.target.value)}
                className="w-full bg-white/[0.02] border border-white/8 px-4 py-2.5 text-[10px] text-white/50 placeholder:text-white/20 outline-none font-mono focus:border-[var(--gold)]/20 transition-colors rounded-xl"
              />

              <div className="flex items-center gap-3">
                <span className="text-[8px] uppercase tracking-widest text-white/25">Qty</span>
                <div className="flex items-center border border-white/10 rounded-xl overflow-hidden">
                  <button onClick={() => setLocalQty(q => Math.max(1, q - 1))} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">−</button>
                  <span className="w-10 text-center font-mono text-sm text-white/80">{localQty}</span>
                  <button onClick={() => setLocalQty(q => q + 1)} className="w-9 h-9 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-all">+</button>
                </div>
                <span className="font-display text-lg text-[var(--gold)] ml-auto">KES {(item.price * localQty).toLocaleString()}</span>
              </div>

              {!isStaged ? (
                <button
                  onClick={handleFirstAdd}
                  className={`w-full py-3.5 font-bold text-[10px] uppercase tracking-[0.25em] rounded-xl transition-all duration-500 ${addingId === item.id ? 'bg-[var(--neon)] text-black scale-[0.98]' : 'bg-[var(--gold)] text-black hover:bg-[var(--gold-light)]'}`}
                >
                  {addingId === item.id ? '✓ Added to Feast' : `Add ${localQty > 1 ? `×${localQty} ` : ''}to Feast`}
                </button>
              ) : (
                <div className="flex gap-2.5">
                  <div className="flex-1 flex items-center justify-between px-4 py-3 bg-[var(--gold)]/8 border border-[var(--gold)]/30 rounded-xl">
                    <span className="font-mono text-[9px] text-[var(--gold)] uppercase tracking-widest">✓ In Feast ×{stagedItem.qty}</span>
                    <span className="font-display text-base text-[var(--gold)]">KES {(item.price * stagedItem.qty).toLocaleString()}</span>
                  </div>
                  <button onClick={handleAddMore} className="px-4 py-3 border border-[var(--gold)]/40 text-[var(--gold)] text-[9px] uppercase tracking-widest hover:bg-[var(--gold)]/10 transition-all font-mono rounded-xl">
                    +{localQty}
                  </button>
                </div>
              )}
            </div>
          </div>

          <button onClick={onClose} className="absolute top-0 right-0 z-10 px-5 py-4 bg-white/[0.03] hover:bg-red-500/10 border-l border-b border-white/8 font-mono text-[9px] text-white/30 hover:text-white transition-all rounded-tr-2xl rounded-bl-lg">
            ✕
          </button>
        </div>
      </div>

      {/* ── Zoom overlay ── */}
      {zoomed && (
        <div
          className="fixed inset-0 z-[400] bg-black/98 flex items-center justify-center cursor-zoom-out overflow-hidden"
          onClick={() => setZoomed(false)}
          onMouseMove={handleZoomMove}
        >
          <div className="absolute top-6 left-1/2 -translate-x-1/2 font-mono text-[8px] text-white/20 uppercase tracking-widest z-10">Click or Esc to close</div>
          <div className="relative w-full max-w-4xl aspect-[4/3] overflow-hidden rounded-2xl">
            <div className="w-full h-full" style={{ transform: `translate(${zoomPos.x}px, ${zoomPos.y}px) scale(1.4)`, transition: 'transform 0.1s ease-out' }}>
              <Image src={item.image} alt={item.name} fill className="object-cover" sizes="100vw" />
            </div>
            <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
              <div className="bg-black/70 border border-[var(--neon)]/20 px-4 py-2 rounded-xl">
                {/* HIDDEN-4 FIX: item.field is optional */}
                <p className="font-mono text-[8px] text-[var(--neon)]/60 uppercase tracking-widest">{item.name}</p>
                <p className="font-mono text-[8px] text-white/30">{item.field || 'Farm'} · {item.freshness ?? '—'}% fresh</p>
              </div>
              <div className="bg-black/70 border border-white/10 px-4 py-2 rounded-xl">
                <p className="font-display text-xl text-[var(--gold)]">KES {item.price.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}