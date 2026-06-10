'use client'

/**
 * src/app/restaurant/_components/MenuGrid.tsx
 *
 * Single client island — contains ALL menu interactivity:
 * search · category filter · dietary filter · sort · menu render · dish log modal
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BUG FIXES IN THIS REVISION
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * FIX-A  "onOpenLog is not a function" — CRASH FIX (root cause)
 *   MenuCard declared `onOpenLog: (item: MenuItem) => void` as a required prop.
 *   MenuGrid was rendering:
 *     <MenuCard key={dish.id} item={dish} />
 *   — i.e. the prop was simply never passed.  React rendered `undefined` for it,
 *   so the first click on any card called `undefined(item)` → TypeError.
 *   The error then triggered React's error boundary, which retried the render,
 *   causing Turbopack to see a repeating error loop → "infinite compiling".
 *
 *   Fix: MenuGrid now owns the modal state and passes a stable memoized
 *   `handleOpenLog` to every <MenuCard />, and also passes `category`.
 *
 * FIX-B  LogModal never rendered — MISSING MOUNT
 *   LogModal.tsx existed in the codebase but was never imported or rendered
 *   anywhere.  Added here via dynamic() with ssr:false so its JS (~40 kB) is
 *   only loaded when a card is first clicked, not on page load.
 *
 * FIX-C  Turbopack hot-reload loop — SECONDARY EFFECT OF FIX-A
 *   React's error boundary was retrying the failed render on every HMR cycle,
 *   which Turbopack interpreted as a file change → continuous recompilation.
 *   Eliminated by fixing the root TypeError in FIX-A.
 *
 * FIX-D  Inline arrow functions in render loop — STABILITY
 *   onClick={() => handleCategoryClick(cat.id)} etc. created new function refs
 *   on every render.  Fine in isolation but combined with the error loop it
 *   meant thousands of new refs per second.  Handlers are already useCallback'd;
 *   the category/dietary pill onClick arrows are left intentionally (they close
 *   over a loop variable and cannot be lifted without a data-attr trick — the
 *   cost is trivial for < 20 pills).
 *
 * FIX-E  category prop not passed to MenuCard — SILENT CART BUG
 *   stageItem(item, category, qty) in MenuCard relied on the `category` prop
 *   to label staged items.  Without it the staged item had category=undefined,
 *   which silently broke cart grouping.  Now passed explicitly as dish.category.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PERFORMANCE DECISIONS (unchanged from original)
 * ─────────────────────────────────────────────────────────────────────────────
 * - useReducer:     one re-render per action, not multiple setState calls
 * - useMemo:        filter+sort pipeline runs once per state change
 * - useTransition:  search input stays responsive while filter recalculates
 * - MenuCard:       memo()'d — unchanged cards never re-render
 * - handleOpenLog:  useCallback — stable ref → memo comparator stays valid
 * - LogModal:       dynamic(ssr:false) — JS parsed only on first click
 */

import {
  useReducer,
  useMemo,
  useCallback,
  useTransition,
  useRef,
  useEffect,
  useState,
} from 'react'
import dynamic from 'next/dynamic'

import { MenuCard } from './MenuCard'
import {
  DISHES,
  CATEGORIES,
  DIETARY_FILTERS,
  SORT_OPTIONS,
  type DietaryTag,
  type SortKey,
  type Dish,
  type MenuItem,
} from '../_data/menu-data'

// ─── DYNAMIC IMPORT — LogModal ────────────────────────────────────────────────
// ssr:false: modal uses document.body, window.addEventListener — server-unsafe.
// Only loaded when selectedDish becomes non-null, so it never blocks page load.
const LogModal = dynamic(() => import('./LogModal'), { ssr: false })

// ─── STATE ────────────────────────────────────────────────────────────────────

interface FilterState {
  category:   string
  dietary:    DietaryTag[]
  sort:       SortKey
  searchRaw:  string   // input shows this instantly
  searchTerm: string   // filter uses this (deferred via useTransition)
}

const INITIAL_STATE: FilterState = {
  category:   'all',
  dietary:    [],
  sort:       'default',
  searchRaw:  '',
  searchTerm: '',
}

type Action =
  | { type: 'SET_CATEGORY';   payload: string     }
  | { type: 'TOGGLE_DIETARY'; payload: DietaryTag }
  | { type: 'SET_SORT';       payload: SortKey    }
  | { type: 'SET_SEARCH_RAW'; payload: string     }
  | { type: 'SET_SEARCH';     payload: string     }
  | { type: 'RESET' }

function reducer(state: FilterState, action: Action): FilterState {
  switch (action.type) {
    case 'SET_CATEGORY':
      return { ...state, category: action.payload }
    case 'TOGGLE_DIETARY': {
      const has = state.dietary.includes(action.payload)
      return {
        ...state,
        dietary: has
          ? state.dietary.filter(d => d !== action.payload)
          : [...state.dietary, action.payload],
      }
    }
    case 'SET_SORT':
      return { ...state, sort: action.payload }
    case 'SET_SEARCH_RAW':
      return { ...state, searchRaw: action.payload }
    case 'SET_SEARCH':
      return { ...state, searchTerm: action.payload }
    case 'RESET':
      return INITIAL_STATE
    default:
      return state
  }
}

// ─── PURE FILTER + SORT FUNCTION ─────────────────────────────────────────────

function applyFilters(dishes: Dish[], state: FilterState): Dish[] {
  const term = state.searchTerm.toLowerCase().trim()

  let result = dishes.filter(dish => {
    if (state.category !== 'all' && dish.category !== state.category) return false
    if (state.dietary.length > 0 && !state.dietary.every(d => dish.tags.includes(d))) return false
    if (term && !dish.name.toLowerCase().includes(term) && !dish.description.toLowerCase().includes(term)) return false
    return true
  })

  switch (state.sort) {
    case 'price-asc':   result = [...result].sort((a, b) => a.price - b.price); break
    case 'price-desc':  result = [...result].sort((a, b) => b.price - a.price); break
    case 'popular':     result = [...result].sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0)); break
    case 'recommended': result = [...result].sort((a, b) => (b.recommended ? 1 : 0) - (a.recommended ? 1 : 0)); break
  }

  return result
}

function groupByCategory(dishes: Dish[]): Map<string, Dish[]> {
  const map = new Map<string, Dish[]>()
  for (const dish of dishes) {
    const existing = map.get(dish.category)
    if (existing) existing.push(dish)
    else map.set(dish.category, [dish])
  }
  return map
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────

export default function MenuGrid() {
  const [state, dispatch]            = useReducer(reducer, INITIAL_STATE)
  const [isPending, startTransition] = useTransition()
  const stickyRef                    = useRef<HTMLDivElement>(null)

  // ── FIX-A + FIX-B: modal state lives here, passed down as stable callbacks ──
  const [selectedDish, setSelectedDish] = useState<MenuItem | null>(null)

  /**
   * FIX-A: stable memoized handler — useCallback([]) means the reference
   * never changes between renders, so MenuCard's memo comparator
   * (prev.onOpenLog === next.onOpenLog) stays true and cards never
   * unnecessarily re-render because of this prop.
   */
  const handleOpenLog = useCallback((dish: MenuItem) => {
    setSelectedDish(dish)
  }, [])

  const handleCloseLog = useCallback(() => {
    setSelectedDish(null)
  }, [])

  // ── Filter handlers ────────────────────────────────────────────────────────

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    dispatch({ type: 'SET_SEARCH_RAW', payload: value })
    startTransition(() => dispatch({ type: 'SET_SEARCH', payload: value }))
  }, [])

  const handleCategoryClick = useCallback((id: string) => {
    dispatch({ type: 'SET_CATEGORY', payload: id })
  }, [])

  const handleDietaryToggle = useCallback((id: DietaryTag) => {
    dispatch({ type: 'TOGGLE_DIETARY', payload: id })
  }, [])

  const handleSortChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch({ type: 'SET_SORT', payload: e.target.value as SortKey })
  }, [])

  const handleReset = useCallback(() => dispatch({ type: 'RESET' }), [])

  // ── Derived data ───────────────────────────────────────────────────────────

  const filteredDishes   = useMemo(() => applyFilters(DISHES, state), [state])
  const groupedDishes    = useMemo(() => groupByCategory(filteredDishes), [filteredDishes])
  const activeCategories = useMemo(
    () => CATEGORIES.filter(c => c.id !== 'all' && groupedDishes.has(c.id)),
    [groupedDishes]
  )

  // ── Sticky shadow — no scroll listener, uses IntersectionObserver ──────────
  useEffect(() => {
    const el = stickyRef.current
    if (!el) return
    const sentinel = document.createElement('div')
    sentinel.style.cssText = 'position:absolute;top:0;height:1px;width:100%;pointer-events:none'
    el.parentElement?.insertBefore(sentinel, el)
    const io = new IntersectionObserver(
      ([entry]) => el.classList.toggle('ukv-filter-bar--stuck', !entry.isIntersecting),
      { threshold: 1, rootMargin: '-1px 0px 0px 0px' }
    )
    io.observe(sentinel)
    return () => { io.disconnect(); sentinel.remove() }
  }, [])

  const hasActiveFilters =
    state.category !== 'all' || state.dietary.length > 0 || state.searchTerm !== ''

  return (
    <div className="ukv-menu-root" id="menu">

      {/* ── STICKY FILTER BAR ── */}
      <div ref={stickyRef} className="ukv-filter-bar" role="navigation" aria-label="Menu filters">

        <div className="ukv-filter-bar__scroll" role="tablist" aria-label="Menu categories">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              role="tab"
              aria-selected={state.category === cat.id}
              className={`ukv-pill${state.category === cat.id ? ' ukv-pill--active' : ''}`}
              onClick={() => handleCategoryClick(cat.id)}
            >
              {cat.emoji && <span aria-hidden="true">{cat.emoji}</span>}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="ukv-filter-bar__controls">
          <label htmlFor="ukv-sort" className="sr-only">Sort dishes</label>
          <select
            id="ukv-sort"
            className="ukv-select"
            value={state.sort}
            onChange={handleSortChange}
          >
            {SORT_OPTIONS.map(o => (
              <option key={o.id} value={o.id}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── SEARCH & DIETARY ROW ── */}
      <div className="ukv-search-row">
        <div className="ukv-search-wrap">
          <span className="ukv-search-icon" aria-hidden="true">⌕</span>
          <input
            type="search"
            className="ukv-search"
            placeholder="Search dishes, ingredients…"
            value={state.searchRaw}
            onChange={handleSearchChange}
            aria-label="Search menu"
            autoComplete="off"
            spellCheck={false}
          />
          {isPending && <span className="ukv-search-spinner" aria-hidden="true" />}
        </div>

        <div className="ukv-dietary" role="group" aria-label="Dietary filters">
          {DIETARY_FILTERS.map(f => (
            <button
              key={f.id}
              className={`ukv-dietary__btn${state.dietary.includes(f.id) ? ' ukv-dietary__btn--active' : ''}`}
              onClick={() => handleDietaryToggle(f.id)}
              aria-pressed={state.dietary.includes(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button className="ukv-reset-btn" onClick={handleReset} aria-label="Clear all filters">
            ✕ Clear
          </button>
        )}
      </div>

      {/* ── RESULTS ── */}
      {filteredDishes.length === 0 ? (
        <div className="ukv-empty" role="status">
          <p className="ukv-empty__heading">Nothing found</p>
          <p className="ukv-empty__body">Try a different search or remove some filters.</p>
          <button className="ukv-reset-btn" onClick={handleReset}>Clear filters</button>
        </div>
      ) : state.category !== 'all' ? (
        <div className="ukv-category-section">
          {(() => {
            const cat = CATEGORIES.find(c => c.id === state.category)
            return (
              <>
                <CategoryHeader
                  label={cat?.label ?? state.category}
                  subtitle={cat?.subtitle}
                  count={filteredDishes.length}
                />
                <div className="ukv-grid">
                  {/* FIX-A + FIX-E: onOpenLog and category now passed */}
                  {filteredDishes.map(dish => (
                    <MenuCard
                      key={dish.id}
                      item={dish}
                      category={dish.category}
                      onOpenLog={handleOpenLog}
                    />
                  ))}
                </div>
              </>
            )
          })()}
        </div>
      ) : (
        activeCategories.map(cat => {
          const dishes = groupedDishes.get(cat.id) ?? []
          return (
            <div key={cat.id} className="ukv-category-section" id={`cat-${cat.id}`}>
              <CategoryHeader label={cat.label} subtitle={cat.subtitle} count={dishes.length} />
              <div className="ukv-grid">
                {/* FIX-A + FIX-E: onOpenLog and category now passed */}
                {dishes.map(dish => (
                  <MenuCard
                    key={dish.id}
                    item={dish}
                    category={dish.category}
                    onOpenLog={handleOpenLog}
                  />
                ))}
              </div>
            </div>
          )
        })
      )}

      {/*
        FIX-B: LogModal is mounted here — the single source of truth for the
        dish detail overlay. It is conditionally rendered (selectedDish !== null)
        and dynamically imported so its JS is only parsed on first use.

        The modal receives:
          item    — the dish the user clicked
          onClose — stable callback that clears selectedDish
      */}
      {selectedDish && (
        <LogModal
          item={selectedDish}
          onClose={handleCloseLog}
        />
      )}
    </div>
  )
}

// ─── CATEGORY HEADER ─────────────────────────────────────────────────────────

function CategoryHeader({
  label, subtitle, count,
}: { label: string; subtitle?: string; count: number }) {
  return (
    <header className="ukv-cat-header">
      <div className="ukv-cat-header__left">
        <h2 className="ukv-cat-header__title">{label}</h2>
        {subtitle && <p className="ukv-cat-header__subtitle">{subtitle}</p>}
      </div>
      <span className="ukv-cat-header__count" aria-label={`${count} items`}>
        {count} {count === 1 ? 'item' : 'items'}
      </span>
    </header>
  )
}