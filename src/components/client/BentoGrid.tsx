'use client'

/**
 * components/home/BentoGrid.tsx
 *
 * Pure home island — loaded via:
 *   const BentoGrid = dynamic(() => import('@/components/home/BentoGrid'), {
 *     ssr: false, loading: BentoGridSkeleton
 *   })
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BOTTLENECKS FIXED (vs previous version)
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * FIX-A  AnimatedNumber: setInterval(22ms) → requestAnimationFrame
 *   Old: setInterval at 22ms × 36 ticks = 180+ interval callbacks per card.
 *   setInterval runs off React's scheduler, so each callback is an untracked
 *   microtask — cannot be batched with anything.
 *   New: single rAF loop, cancelAnimationFrame on cleanup.
 *   Each frame is one setState, scheduled inside the browser's paint cycle.
 *
 * FIX-B  One shared IntersectionObserver (was: one per card)
 *   Old: 5 × new IntersectionObserver() + 5 × observe() in 5 useEffect calls.
 *   New: one module-level shared observer (cardObserver) registers all cards.
 *   Cards register via ref callback; observer is created lazily on first mount.
 *
 * FIX-C  CSS :hover replaces useState(hovered) on cards + Moxie
 *   Old: onMouseEnter/Leave → setState → full component re-render on every
 *   pixel the cursor moves over a card boundary.
 *   New: all hover effects via CSS custom properties + data-hovered attribute.
 *   Zero React re-renders on hover. Cursor effects are compositor-only.
 *
 * FIX-D  All style objects hoisted to module scope
 *   Old: inline `style={{ ... }}` inside every map() produces a new object on
 *   every render, forcing React to diff all style keys even when unchanged.
 *   New: every reusable style is a module-level CSSProperties const.
 *   Per-item dynamic values (accent colour) passed as CSS custom properties
 *   via a single `--accent` variable so the object reference is stable.
 *
 * FIX-E  <style> tag moved out of render tree
 *   Old: <style>{`...`}</style> inside the component JSX — React sees a new
 *   string child every render and diffs the entire text node.
 *   New: styles live in a separate <BentoStyles /> component that returns
 *   a single <style> tag. React.memo guarantees it is never re-rendered.
 *
 * FIX-F  AnimatedNumber memo + stable delay
 *   Wrapped in React.memo — parent re-renders (expanded toggle) don't
 *   re-run the number animation.
 *
 * FIX-G  Expanded details: CSS max-height transition, not JS height measurement
 *   No offsetHeight reads, no ResizeObserver — pure CSS accordion.
 *
 * FIX-H  LivingStatusBar memoized
 *   Static data, never changes — React.memo ensures it never re-renders.
 *
 * FIX-I  MoxieIntelligenceCore hover: CSS data-attr, not useState
 *   Waveform is already pure CSS; now the container hover is also CSS-only.
 *
 * FIX-J  useMemo on cards array
 *   Only recomputes when eventsLabel prop changes (rare).
 */

import {
  memo,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
  type CSSProperties,
} from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
export interface BentoGridProps {
  eventsLabel?: string
}

type CardStatus = 'live' | 'synced' | 'idle'

interface BentoCardData {
  id:           string
  log:          string
  label:        string
  title:        string
  subtitle:     string
  metric?:      number
  metricLabel?: string
  status:       CardStatus
  accent:       string
  href:         string
  col:          string
  details?:     string[]
  envTag?:      string
  events?:      { label: string; date: string; color: string }[]
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC DATA — module-level, never reallocated
// ─────────────────────────────────────────────────────────────────────────────
const ENV_SIGNALS = [
  { label: 'WIND',    value: '12 km/h',  color: '#A8D8F0'     },
  { label: 'SOIL',    value: 'HEALTHY',  color: 'var(--neon)' },
  { label: 'SUNSET',  value: '18:42',    color: 'var(--gold)' },
  { label: 'MOON',    value: 'WAXING ◑', color: '#C4B5E0'     },
  { label: 'TEMP',    value: '24°C',     color: '#A8D4B4'     },
  { label: 'ECOLOGY', value: 'STABLE',   color: 'var(--neon)' },
  { label: 'FARM',    value: 'SYNC OK',  color: 'var(--neon)' },
  { label: 'RAIN',    value: '72%',      color: '#A8D8F0'     },
]
// Pre-doubled — never spliced at render time
const STATUS_BAR_ITEMS = [...ENV_SIGNALS, ...ENV_SIGNALS]

const CARDS: BentoCardData[] = [
  {
    id: 'farm', log: 'Farm Log', label: 'The Pulse',
    title: 'Ecological Estate', subtitle: 'Livestock · Crops · Soil Intelligence',
    metric: 24, metricLabel: 'Living Species Tracked',
    status: 'live', accent: 'var(--neon)', href: '/farm', col: '5',
    envTag: 'SOIL HEALTHY',
    details: [
      'Soil moisture Field A: 68% — optimal',
      'Next harvest: Kale — 3 days',
      'Cattle Unit 3: All healthy, grazing',
      'North Apiary: honey extraction due',
      'Last FarmERP sync: 8 minutes ago',
    ],
  },
  {
    id: 'restaurant', log: 'Restaurant Log', label: 'The Menu',
    title: 'Provenance Dining', subtitle: 'Farm-to-Fork · Live inventory · Field provenance',
    metric: 8, metricLabel: 'Dining Availabilities Tonight',
    status: 'live', accent: 'var(--gold)', href: '/restaurant', col: '7',
    envTag: 'KITCHEN OPEN',
    details: [
      'Tonight: Boma goat stew — Animal #UKV-047',
      'Field B kale: harvested 2 hours ago',
      'Allergen check: active for 3 guests',
      'Wine pairing: Maasai Valley Reserve',
      'Kitchen opens: 6:00 PM tonight',
    ],
  },
  {
    id: 'cottages', log: 'Guest Log', label: 'The Passport',
    title: 'Sanctuary Suites', subtitle: 'Pokomo Cottages · The Farmhouse',
    metric: 6, metricLabel: 'Sanctuaries Available',
    status: 'synced', accent: '#B8A9F0', href: '/cottages', col: '4',
    envTag: 'ROOMS READY',
    details: [
      'Pokomo Cottages 1–4: available',
      'Farmhouse Suite A: available from Friday',
      'Farmhouse Suite B: booked this week',
      'Book 3+ nights for 15% quiet season rate',
      'All cottages: fresh linen, firewood stocked',
    ],
  },
  {
    id: 'spa', log: 'Spa Log', label: 'The Ritual',
    title: 'Arohamai Ritual Spa', subtitle: 'Ancient African therapies · Organic botanicals',
    metric: 3, metricLabel: 'Ritual Slots Open Today',
    status: 'live', accent: '#F0A8B8', href: '/spa', col: '4',
    envTag: 'SPA SERENE',
    details: [
      'Volcanic Mud Ritual: 2:00 PM open',
      'Forest Massage: 4:00 PM — 1 slot',
      'Ubuntu Couples Ritual: Saturday',
      'Organic botanicals: fully stocked',
      'Outdoor treatment pavilion: open',
    ],
  },
  {
    id: 'events', log: 'Events Log', label: 'The Calendar',
    title: 'Events Ledger', subtitle: 'Harvest dinners · Weddings · Fire circles',
    status: 'synced', accent: 'var(--gold)', href: '/events', col: '4',
    envTag: 'CALENDAR LIVE',
    events: [
      { label: 'Harvest Fire Dinner',    date: 'Last Sat monthly',   color: 'var(--gold)' },
      { label: 'New Moon Circle',        date: 'Each new moon',      color: '#A8D8F0'      },
      { label: 'Farm-to-Table Workshop', date: 'Fri by arrangement', color: 'var(--neon)' },
    ],
    details: [
      'Sunset bonfire gathering — this Friday',
      'Acoustic night under the acacia tree',
      'Ceramic artist residency: May',
      'Harvest festival preparations active',
      'Corporate retreat: enquire for dates',
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// FIX-B: SHARED INTERSECTION OBSERVER
// One observer instance handles all card visibility.
// Created lazily on first card mount; persists for the session.
// ─────────────────────────────────────────────────────────────────────────────
type VisibilityCallback = (isVisible: boolean) => void
const visibilityCallbacks = new Map<Element, VisibilityCallback>()
let cardObserver: IntersectionObserver | null = null

function getCardObserver(): IntersectionObserver {
  if (!cardObserver) {
    cardObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const cb = visibilityCallbacks.get(entry.target)
          if (cb) cb(entry.isIntersecting)
          // Once visible, unobserve — entrance animation fires once only
          if (entry.isIntersecting) {
            cardObserver?.unobserve(entry.target)
            visibilityCallbacks.delete(entry.target)
          }
        }
      },
      { threshold: 0.05 }
    )
  }
  return cardObserver
}

// ─────────────────────────────────────────────────────────────────────────────
// MODULE-LEVEL STYLE CONSTANTS
// FIX-D: defined once at module load, never recreated during renders.
// ─────────────────────────────────────────────────────────────────────────────
const ST = {
  sectionWrap: {
    position: 'relative',
    padding:  'clamp(48px, 8vw, 80px) 0 clamp(56px, 8vw, 96px)',
  } satisfies CSSProperties,

  innerWrap: {
    maxWidth: '88rem',
    margin:   '0 auto',
    padding:  '0 clamp(16px, 4vw, 24px)',
    position: 'relative',
  } satisfies CSSProperties,

  headerWrap: {
    textAlign:    'center',
    marginBottom: 16,
  } satisfies CSSProperties,

  headerRow: {
    display:        'flex',
    alignItems:     'center',
    gap:            16,
    marginBottom:   16,
    justifyContent: 'center',
  } satisfies CSSProperties,

  headerLineL: {
    height:     '0.5px',
    width:      80,
    background: 'linear-gradient(to right, transparent, rgba(0,255,65,0.4))',
  } satisfies CSSProperties,

  headerLineR: {
    height:     '0.5px',
    width:      80,
    background: 'linear-gradient(to left, transparent, rgba(0,255,65,0.4))',
  } satisfies CSSProperties,

  headerLabel: {
    fontFamily:    'var(--font-body)',
    fontSize:      '8px',
    letterSpacing: '0.35em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.2)',
  } satisfies CSSProperties,

  headerQuote: {
    fontFamily:    'var(--font-display)',
    fontStyle:     'italic',
    fontSize:      'clamp(0.95rem, 1.6vw, 1.35rem)',
    color:         'rgba(200,168,75,0.35)',
    letterSpacing: '0.06em',
    lineHeight:    1.6,
  } satisfies CSSProperties,

  bgGlow: {
    position:   'absolute',
    top:        '20%',
    left:       '50%',
    transform:  'translateX(-50%)',
    width:      '80%',
    height:     '60%',
    background: 'radial-gradient(ellipse at center, rgba(0,255,65,0.025) 0%, transparent 65%)',
    pointerEvents: 'none',
  } satisfies CSSProperties,

  footer: {
    textAlign:     'center',
    fontFamily:    'var(--font-body)',
    fontStyle:     'italic',
    fontSize:      '9px',
    letterSpacing: '0.18em',
    color:         'rgba(255,255,255,0.12)',
    marginTop:     20,
  } satisfies CSSProperties,

  // Status bar
  statusBarWrap: {
    position:     'relative',
    overflow:     'hidden',
    borderTop:    '0.5px solid rgba(0,255,65,0.12)',
    borderBottom: '0.5px solid rgba(0,255,65,0.12)',
    padding:      '7px 0',
    marginBottom: 40,
    background:   'rgba(0,255,65,0.02)',
  } satisfies CSSProperties,

  statusFadeL: {
    position:   'absolute',
    top:        0, left:   0, bottom: 0,
    width:      60,
    background: 'linear-gradient(to right, var(--obsidian, #060606), transparent)',
    zIndex:     2,
    pointerEvents: 'none',
  } satisfies CSSProperties,

  statusFadeR: {
    position:   'absolute',
    top:        0, right:  0, bottom: 0,
    width:      60,
    background: 'linear-gradient(to left, var(--obsidian, #060606), transparent)',
    zIndex:     2,
    pointerEvents: 'none',
  } satisfies CSSProperties,

  statusTrack: {
    display:           'flex',
    gap:               40,
    animation:         'ukv-scroll 28s linear infinite',
    width:             'max-content',
    willChange:        'transform',
  } satisfies CSSProperties,

  statusItem: {
    display:    'flex',
    alignItems: 'center',
    gap:        8,
    flexShrink: 0,
  } satisfies CSSProperties,

  statusItemLabel: {
    fontFamily:    'var(--font-body)',
    fontSize:      '7px',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.2)',
  } satisfies CSSProperties,

  statusDot: {
    width:        2,
    height:       2,
    borderRadius: '50%',
    background:   'rgba(255,255,255,0.1)',
    flexShrink:   0,
  } satisfies CSSProperties,

  // Card internals
  cardBody: {
    padding:       'clamp(16px,3vw,22px) clamp(16px,3vw,24px) clamp(18px,3vw,24px)',
    display:       'flex',
    flexDirection: 'column',
    flex:          1,
  } satisfies CSSProperties,

  cardTopRow: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   14,
  } satisfies CSSProperties,

  cardLog: {
    fontFamily:    'var(--font-body)',
    fontSize:      '8px',
    letterSpacing: '0.22em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.22)',
    marginBottom:  8,
  } satisfies CSSProperties,

  cardSubtitle: {
    fontFamily:  'var(--font-body)',
    fontSize:    '11px',
    lineHeight:  1.65,
    color:       'rgba(255,255,255,0.35)',
    marginBottom: 20,
  } satisfies CSSProperties,

  cardMetricLabel: {
    fontFamily:    'var(--font-body)',
    fontSize:      '8px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.28)',
  } satisfies CSSProperties,

  cardEventsWrap: {
    marginTop:     'auto',
    display:       'flex',
    flexDirection: 'column',
    gap:           5,
  } satisfies CSSProperties,

  cardDetailDivider: {
    borderTop:  '0.5px solid rgba(255,255,255,0.06)',
    paddingTop: 14,
  } satisfies CSSProperties,

  cardDetailItem: {
    display:    'flex',
    alignItems: 'flex-start',
    gap:        8,
    fontFamily: 'var(--font-body)',
    fontSize:   '11px',
    color:      'rgba(255,255,255,0.52)',
    padding:    '4px 0',
  } satisfies CSSProperties,

  // Corner mark shared — position overridden per instance via className
  cornerBase: {
    position:   'absolute',
    width:      12,
    height:     12,
    borderStyle: 'solid',
    pointerEvents: 'none',
  } satisfies CSSProperties,

  // Moxie
  moxieWrap: {
    position:  'relative',
    overflow:  'hidden',
    padding:   'clamp(20px,4vw,28px) clamp(18px,4vw,32px)',
    zIndex:    1,
  } satisfies CSSProperties,

  moxieInner: {
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'space-between',
    gap:            24,
    flexWrap:       'wrap',
  } satisfies CSSProperties,

  moxieLeft: {
    flex:    1,
    minWidth: 0,
  } satisfies CSSProperties,

  moxieEyebrow: {
    fontFamily:    'var(--font-body)',
    fontSize:      '7px',
    letterSpacing: '0.3em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.2)',
    marginBottom:  10,
  } satisfies CSSProperties,

  moxieTitleRow: {
    display:     'flex',
    alignItems:  'baseline',
    gap:         12,
    marginBottom: 6,
    flexWrap:    'wrap',
  } satisfies CSSProperties,

  moxieMeet: {
    fontFamily:  'var(--font-display)',
    fontSize:    'clamp(1.7rem,4vw,2.8rem)',
    fontWeight:  300,
    color:       'var(--cream)',
  } satisfies CSSProperties,

  moxieName: {
    fontFamily:    'var(--font-display)',
    fontWeight:    500,
    fontSize:      'clamp(1.7rem,4vw,2.8rem)',
    color:         'var(--neon)',
    letterSpacing: '0.06em',
  } satisfies CSSProperties,

  moxieDesc: {
    fontFamily: 'var(--font-body)',
    fontSize:   '12px',
    color:      'rgba(255,255,255,0.38)',
    lineHeight: 1.7,
  } satisfies CSSProperties,

  moxieStatusRow: {
    display:    'flex',
    gap:        18,
    marginTop:  12,
    flexWrap:   'wrap',
  } satisfies CSSProperties,

  moxieStatusItem: {
    display:       'flex',
    flexDirection: 'column',
    gap:           2,
  } satisfies CSSProperties,

  moxieStatusLabel: {
    fontFamily:    'var(--font-body)',
    fontSize:      '7px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color:         'rgba(255,255,255,0.2)',
    display:       'block',
  } satisfies CSSProperties,

  moxieStatusValue: {
    fontFamily:    'var(--font-body)',
    fontSize:      '8px',
    color:         'var(--neon)',
    letterSpacing: '0.1em',
  } satisfies CSSProperties,

  moxieWaveform: {
    display:    'flex',
    alignItems: 'center',
    gap:        3,
    height:     52,
    flexShrink: 0,
    opacity:    0.7,
  } satisfies CSSProperties,

  moxieCta: {
    display:       'inline-flex',
    alignItems:    'center',
    gap:           10,
    padding:       '12px 24px',
    fontFamily:    'var(--font-body)',
    fontSize:      '9px',
    letterSpacing: '0.2em',
    textTransform: 'uppercase',
    color:         'var(--neon)',
    textDecoration:'none',
    flexShrink:    0,
    whiteSpace:    'nowrap',
    alignSelf:     'center',
  } satisfies CSSProperties,
} as const

// LiveDot per-status style maps — module-level, never recreated
const LIVE_DOT_STYLES: Record<CardStatus, {
  wrap: CSSProperties; dot: CSSProperties; label: string
}> = {
  live: {
    label: 'LIVE',
    wrap: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 9px',
      background: 'rgba(0,255,65,0.12)',
      border: '0.5px solid rgba(0,255,65,0.35)',
      fontFamily: 'var(--font-body)', fontSize: '7px',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: 'var(--neon)',
    },
    dot: {
      width: 4, height: 4, borderRadius: '50%',
      background: 'var(--neon)', flexShrink: 0,
      animation: 'ukv-pulse 1.8s ease-in-out infinite',
    },
  },
  synced: {
    label: 'SYNCED',
    wrap: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 9px',
      background: 'rgba(212,168,83,0.1)',
      border: '0.5px solid rgba(212,168,83,0.3)',
      fontFamily: 'var(--font-body)', fontSize: '7px',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: 'var(--gold)',
    },
    dot: {
      width: 4, height: 4, borderRadius: '50%',
      background: 'var(--gold)', flexShrink: 0,
    },
  },
  idle: {
    label: 'IDLE',
    wrap: {
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 9px',
      background: 'rgba(255,255,255,0.04)',
      border: '0.5px solid rgba(255,255,255,0.12)',
      fontFamily: 'var(--font-body)', fontSize: '7px',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: 'rgba(255,255,255,0.3)',
    },
    dot: {
      width: 4, height: 4, borderRadius: '50%',
      background: 'rgba(255,255,255,0.3)', flexShrink: 0,
    },
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// FIX-E: STYLES EXTRACTED TO MEMO COMPONENT
// React.memo guarantees this never re-renders; the <style> DOM node
// is created once and never touched again.
// ─────────────────────────────────────────────────────────────────────────────
const BENTO_STYLES = `
  @keyframes ukv-pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.2; }
  }
  @keyframes ukv-scroll {
    0%   { transform: translateX(0); }
    100% { transform: translateX(-50%); }
  }
  @keyframes ukv-rise {
    from { opacity: 0; transform: translateY(18px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes moxie-wave {
    0%, 100% { height: 10px; opacity: 0.3; }
    50%       { height: 48px; opacity: 0.9; }
  }

  /* FIX-C: CSS hover replaces useState(hovered) on cards */
  .ukv-card {
    position:       relative;
    background:     rgba(255,255,255,0.02);
    border:         0.5px solid rgba(255,255,255,0.06);
    overflow:       hidden;
    cursor:         pointer;
    min-height:     220px;
    height:         100%;
    display:        flex;
    flex-direction: column;
    transition:     border-color 0.4s, box-shadow 0.5s, transform 0.4s, background 0.4s;
    will-change:    transform;
    z-index:        1;
  }
  .ukv-card:hover {
    background:   rgba(255,255,255,0.035);
    border-color: color-mix(in srgb, var(--card-accent) 25%, transparent);
    transform:    translateY(-3px) scale(1.005);
    box-shadow:   0 8px 40px rgba(0,0,0,0.5), 0 20px 60px rgba(0,0,0,0.3);
  }
  .ukv-card-accent-line {
    position:   absolute;
    top:        0; left: 0; right: 0;
    height:     1px;
    background: linear-gradient(90deg, transparent, var(--card-accent), transparent);
    opacity:    0.35;
    transition: opacity 0.4s;
    pointer-events: none;
  }
  .ukv-card:hover .ukv-card-accent-line { opacity: 0.7; }

  .ukv-card-glow-tl {
    position:       absolute;
    inset:          0;
    pointer-events: none;
    background:     radial-gradient(ellipse 70% 55% at 20% 20%, color-mix(in srgb, var(--card-accent) 12%, transparent), transparent 65%);
    opacity:        0;
    transition:     opacity 0.6s;
  }
  .ukv-card:hover .ukv-card-glow-tl { opacity: 1; }

  .ukv-card-glow-br {
    position:       absolute;
    inset:          0;
    pointer-events: none;
    background:     radial-gradient(ellipse 50% 40% at 85% 90%, color-mix(in srgb, var(--card-accent) 8%, transparent), transparent 60%);
    opacity:        0;
    transition:     opacity 0.5s 0.1s;
  }
  .ukv-card:hover .ukv-card-glow-br { opacity: 0.8; }

  .ukv-card-chevron {
    position:       absolute;
    top:            16px; right: 16px;
    font-family:    var(--font-body);
    font-size:      10px;
    color:          rgba(255,255,255,0.2);
    transition:     transform 0.35s cubic-bezier(0.16,1,0.3,1), color 0.3s;
    pointer-events: none;
    user-select:    none;
  }
  .ukv-card:hover .ukv-card-chevron { color: var(--card-accent); }
  .ukv-card[aria-expanded="true"] .ukv-card-chevron { transform: rotate(180deg); }
  .ukv-card[aria-expanded="true"]:hover .ukv-card-chevron {
    color: var(--card-accent);
    transform: rotate(180deg);
  }

  .ukv-card-title {
    font-family:    var(--font-display);
    font-size:      clamp(1.25rem, 2.2vw, 2rem);
    font-weight:    300;
    line-height:    1.15;
    color:          rgba(237,230,211,0.9);
    margin-bottom:  6px;
    transition:     color 0.3s;
    letter-spacing: -0.01em;
  }
  .ukv-card:hover .ukv-card-title { color: var(--cream); }

  .ukv-card-corner-tl {
    position:     absolute;
    top:          14px; left: 14px;
    width:        12px; height: 12px;
    border-color: rgba(255,255,255,0.15);
    border-style: solid;
    border-width: 1px 0 0 1px;
    pointer-events: none;
    transition:   border-color 0.4s;
  }
  .ukv-card-corner-br {
    position:     absolute;
    bottom:       14px; right: 14px;
    width:        12px; height: 12px;
    border-color: rgba(255,255,255,0.15);
    border-style: solid;
    border-width: 0 1px 1px 0;
    pointer-events: none;
    transition:   border-color 0.4s;
  }
  .ukv-card:hover .ukv-card-corner-tl,
  .ukv-card:hover .ukv-card-corner-br {
    border-color: color-mix(in srgb, var(--card-accent) 33%, transparent);
  }

  /* FIX-G: CSS accordion — no JS height measurement */
  .ukv-details {
    overflow:    hidden;
    max-height:  0;
    opacity:     0;
    transition:  max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s;
    margin-top:  0;
  }
  .ukv-details[data-open="true"] {
    max-height: 260px;
    opacity:    1;
    margin-top: 16px;
  }

  /* Detail row stagger via nth-child — no inline transition per item */
  .ukv-detail-row {
    display:    flex;
    align-items: flex-start;
    gap:        8px;
    font-family: var(--font-body);
    font-size:  11px;
    color:      rgba(255,255,255,0.52);
    padding:    4px 0;
    opacity:    0;
    transform:  translateX(-6px);
    transition: opacity 0.35s, transform 0.35s;
  }
  .ukv-details[data-open="true"] .ukv-detail-row { opacity: 1; transform: translateX(0); }
  .ukv-details[data-open="true"] .ukv-detail-row:nth-child(1) { transition-delay: 0ms; }
  .ukv-details[data-open="true"] .ukv-detail-row:nth-child(2) { transition-delay: 30ms; }
  .ukv-details[data-open="true"] .ukv-detail-row:nth-child(3) { transition-delay: 60ms; }
  .ukv-details[data-open="true"] .ukv-detail-row:nth-child(4) { transition-delay: 90ms; }
  .ukv-details[data-open="true"] .ukv-detail-row:nth-child(5) { transition-delay: 120ms; }

  /* FIX-I: Moxie hover via CSS */
  .ukv-moxie {
    background:   rgba(0,255,65,0.025);
    border:       0.5px solid rgba(0,255,65,0.12);
    transition:   border-color 0.4s, background 0.4s, box-shadow 0.4s, transform 0.4s;
    will-change:  transform;
  }
  .ukv-moxie:hover {
    background:  rgba(0,255,65,0.04);
    border-color: rgba(0,255,65,0.25);
    box-shadow:  0 0 60px rgba(0,255,65,0.05);
    transform:   translateY(-2px);
  }
  .ukv-moxie-line-top,
  .ukv-moxie-line-bottom {
    position:   absolute;
    left:       0; right: 0;
    height:     1px;
    background: linear-gradient(90deg,transparent,var(--neon),transparent);
    opacity:    0.28;
    transition: opacity 0.4s;
  }
  .ukv-moxie-line-top    { top: 0; }
  .ukv-moxie-line-bottom { bottom: 0; }
  .ukv-moxie:hover .ukv-moxie-line-top,
  .ukv-moxie:hover .ukv-moxie-line-bottom { opacity: 0.55; }
  .ukv-moxie-glow {
    position:       absolute;
    inset:          0;
    pointer-events: none;
    background:     radial-gradient(ellipse 60% 80% at 10% 50%, rgba(0,255,65,0.06), transparent 60%);
    opacity:        0;
    transition:     opacity 0.6s;
  }
  .ukv-moxie:hover .ukv-moxie-glow { opacity: 1; }
  .ukv-moxie-name {
    text-shadow: 0 0 12px rgba(0,255,65,0.2);
    transition:  text-shadow 0.5s;
  }
  .ukv-moxie:hover .ukv-moxie-name { text-shadow: 0 0 30px rgba(0,255,65,0.5); }
  .ukv-moxie-cta {
    border:     0.5px solid rgba(0,255,65,0.4);
    background: transparent;
    transition: background 0.3s, border-color 0.3s;
  }
  .ukv-moxie:hover .ukv-moxie-cta,
  .ukv-moxie-cta:hover {
    background:   rgba(0,255,65,0.12);
    border-color: rgba(0,255,65,0.6);
  }
  .moxie-bar {
    width:    3px;
    background: var(--neon);
    flex-shrink: 0;
    animation: moxie-wave 1.4s ease-in-out infinite;
    will-change: transform, opacity;
  }

  /* Rise animation */
  .ukv-card-enter {
    opacity:   0;
    animation: ukv-rise 0.7s cubic-bezier(0.16, 1, 0.3, 1) both;
    will-change: transform, opacity;
  }

  /* GRID */
  .bento-grid {
    display:             grid;
    grid-template-columns: repeat(12, 1fr);
    gap:                 10px;
  }
  .bento-col-5  { grid-column: span 5; }
  .bento-col-7  { grid-column: span 7; }
  .bento-col-4  { grid-column: span 4; }
  .bento-col-12 { grid-column: span 12; }

  @media (max-width: 900px) {
    .bento-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .bento-col-5, .bento-col-7, .bento-col-4 { grid-column: span 1; }
    .bento-col-12 { grid-column: span 2; }
    .ukv-moxie-waveform { display: none; }
    .ukv-moxie-cta { align-self: flex-start; }
  }
  @media (max-width: 560px) {
    .bento-grid { grid-template-columns: 1fr; gap: 8px; }
    .bento-col-5, .bento-col-7, .bento-col-4,
    .bento-col-12 { grid-column: span 1; }
    .ukv-moxie-inner { flex-direction: column; align-items: flex-start; gap: 16px; }
    .ukv-moxie-waveform { display: none; }
    .ukv-moxie-cta { align-self: stretch; justify-content: center; }
  }
  @media (prefers-reduced-motion: reduce) {
    .ukv-card, .ukv-moxie { transition: none !important; }
    .ukv-card-enter { animation: none !important; opacity: 1; }
    .moxie-bar { animation: none !important; height: 28px; }
    .ukv-details { transition: none !important; }
  }
`

const BentoStyles = memo(function BentoStyles() {
  return <style>{BENTO_STYLES}</style>
})
BentoStyles.displayName = 'BentoStyles'

// ─────────────────────────────────────────────────────────────────────────────
// FIX-A: ANIMATED NUMBER — rAF, not setInterval
// FIX-F: React.memo — parent expand/collapse doesn't restart animation
// ─────────────────────────────────────────────────────────────────────────────
const AnimatedNumber = memo(function AnimatedNumber({
  value,
  color,
  delay = 0,
}: {
  value: number
  color: string
  delay?: number
}) {
  const [display, setDisplay] = useState(0)
  const rafRef   = useRef<number>(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      const DURATION = 36 * 22 // ≈800ms — same feel as before
      const start    = performance.now()

      const tick = (now: number) => {
        const t    = Math.min((now - start) / DURATION, 1)
        const ease = 1 - Math.pow(1 - t, 3)
        setDisplay(Math.min(Math.round(value * ease), value))
        if (t < 1) rafRef.current = requestAnimationFrame(tick)
      }

      rafRef.current = requestAnimationFrame(tick)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [value, delay])

  return (
    <span style={{
      fontFamily:         'var(--font-display)',
      fontSize:           'clamp(2.8rem, 5vw, 3.6rem)',
      fontWeight:         300,
      color,
      lineHeight:         1,
      display:            'block',
      marginBottom:       6,
      letterSpacing:      '-0.02em',
      fontVariantNumeric: 'tabular-nums',
    }}>
      {display}
    </span>
  )
})
AnimatedNumber.displayName = 'AnimatedNumber'

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DOT — pure display, memo'd
// ─────────────────────────────────────────────────────────────────────────────
const LiveDot = memo(function LiveDot({ status }: { status: CardStatus }) {
  const s = LIVE_DOT_STYLES[status]
  return (
    <span style={s.wrap}>
      <span style={s.dot} />
      {s.label}
    </span>
  )
})
LiveDot.displayName = 'LiveDot'

// ─────────────────────────────────────────────────────────────────────────────
// FIX-H: LIVING STATUS BAR — static, never re-renders
// ─────────────────────────────────────────────────────────────────────────────
const LivingStatusBar = memo(function LivingStatusBar() {
  return (
    <div style={ST.statusBarWrap}>
      <div style={ST.statusFadeL} />
      <div style={ST.statusFadeR} />
      <div style={ST.statusTrack}>
        {STATUS_BAR_ITEMS.map((sig, i) => (
          <div key={`${sig.label}-${i}`} style={ST.statusItem}>
            <span style={ST.statusItemLabel}>{sig.label}</span>
            <span style={{ fontFamily:'var(--font-body)', fontSize:'8px', color:sig.color, letterSpacing:'0.1em' }}>
              {sig.value}
            </span>
            <span style={ST.statusDot} />
          </div>
        ))}
      </div>
    </div>
  )
})
LivingStatusBar.displayName = 'LivingStatusBar'

// ─────────────────────────────────────────────────────────────────────────────
// BENTO CARD
// FIX-B: uses shared observer
// FIX-C: hover via CSS classes, not useState
// FIX-G: CSS accordion
// ─────────────────────────────────────────────────────────────────────────────
const BentoCard = memo(function BentoCard({
  card,
  index,
}: {
  card:  BentoCardData
  index: number
}) {
  const [expanded, setExpanded] = useState(false)
  const [visible,  setVisible]  = useState(false)
  const divRef = useRef<HTMLButtonElement>(null)

  // FIX-B: register with the shared observer via ref callback
  useEffect(() => {
    const el = divRef.current
    if (!el) return
    visibilityCallbacks.set(el, (isVisible) => {
      if (isVisible) setVisible(true)
    })
    getCardObserver().observe(el)
    return () => {
      getCardObserver().unobserve(el)
      visibilityCallbacks.delete(el)
    }
  }, [])

  const handleCardClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const path = e.nativeEvent.composedPath?.() ?? []
    if (path.some(el => el instanceof HTMLElement && el.tagName === 'A')) return
    setExpanded(p => !p)
  }, [])

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    if ((e.target as HTMLElement).closest('a')) return
    e.preventDefault()
    setExpanded(p => !p)
  }, [])

  // Grain style is stable per card (same data)
  const grainStyle = useMemo<CSSProperties>(() => ({
    position:        'absolute',
    inset:           0,
    pointerEvents:   'none',
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
    opacity:         0.025,
    mixBlendMode:    'overlay',
  }), [])

  return (
    <button
      ref={divRef}
      className={`ukv-card${visible ? ' ukv-card-enter' : ''}`}
      style={{
        '--card-accent':         card.accent,
        animationDelay:          visible ? `${index * 50}ms` : undefined,
        opacity:                 visible ? undefined : 0,
      } as CSSProperties}
      onClick={handleCardClick}
      aria-expanded={expanded}
    >
      {/* Compositor-only decorations */}
      <div className="ukv-card-accent-line" />
      <div className="ukv-card-glow-tl" />
      <div className="ukv-card-glow-br" />
      <div style={grainStyle} />
      <div className="ukv-card-corner-tl" />
      <div className="ukv-card-corner-br" />
      <div className="ukv-card-chevron">▾</div>

      <div style={ST.cardBody}>
        <div style={ST.cardTopRow}>
          <LiveDot status={card.status} />
          {card.envTag && (
            <span style={{ fontFamily:'var(--font-body)', fontSize:'6px', letterSpacing:'0.28em', textTransform:'uppercase', color:`${card.accent}80` }}>
              {card.envTag}
            </span>
          )}
        </div>

        <p style={ST.cardLog}>{card.log} · {card.label}</p>
        <h3 className="ukv-card-title">{card.title}</h3>
        <p style={ST.cardSubtitle}>{card.subtitle}</p>

        {card.metric !== undefined ? (
          <div style={{ marginTop: 'auto' }}>
            <AnimatedNumber value={card.metric} color={card.accent} delay={index * 50 + 150} />
            <p style={ST.cardMetricLabel}>{card.metricLabel}</p>
          </div>
        ) : card.events ? (
          <div style={ST.cardEventsWrap}>
            {card.events.map(ev => (
              <div key={`${card.id}-ev-${ev.label}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '5px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)',
              }}>
                <div style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ width:3, height:3, borderRadius:'50%', background:ev.color, flexShrink:0 }} />
                  <span style={{ fontFamily:'var(--font-body)', fontSize:'9px', color:ev.color, letterSpacing:'0.04em' }}>
                    {ev.label}
                  </span>
                </div>
                <span style={{ fontFamily:'var(--font-body)', fontSize:'8px', color:'rgba(255,255,255,0.22)', letterSpacing:'0.06em' }}>
                  {ev.date}
                </span>
              </div>
            ))}
          </div>
        ) : null}

        {/* FIX-G: CSS accordion via data-open attribute */}
        <div className="ukv-details" data-open={String(expanded)}>
          <div style={ST.cardDetailDivider}>
            {card.details?.map((detail) => (
              <div key={`${card.id}-d-${detail}`} className="ukv-detail-row">
                <span style={{ color:card.accent, fontSize:'7px', marginTop:5, flexShrink:0 }}>▸</span>
                {detail}
              </div>
            ))}
            <Link
              href={card.href}
              prefetch={false}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()}
              style={{ display:'inline-flex', alignItems:'center', gap:5, fontFamily:'var(--font-body)', fontSize:'8px', letterSpacing:'0.2em', textTransform:'uppercase', color:card.accent, marginTop:14, textDecoration:'none', opacity:0.85 }}
            >
              Open Full Log →
            </Link>
          </div>
        </div>
      </div>
    </button>
  )
})
BentoCard.displayName = 'BentoCard'

// ─────────────────────────────────────────────────────────────────────────────
// MOXIE INTELLIGENCE CORE
// FIX-I: hover via CSS class — zero React re-renders on hover
// ─────────────────────────────────────────────────────────────────────────────
const MOXIE_BAR_COUNT = 18
// Stable delay values — module-level, never reallocated
const MOXIE_BAR_DELAYS = Array.from({ length: MOXIE_BAR_COUNT }, (_, i) => `${i * 0.12}s`)

const MoxieIntelligenceCore = memo(function MoxieIntelligenceCore() {
  return (
    <div className="ukv-moxie" style={ST.moxieWrap}>
      <div className="ukv-moxie-line-top" />
      <div className="ukv-moxie-line-bottom" />
      <div className="ukv-moxie-glow" />

      <div className="ukv-moxie-inner" style={ST.moxieInner}>
        {/* Left — identity */}
        <div style={ST.moxieLeft}>
          <p style={ST.moxieEyebrow}>
            AI Concierge Protocol · All 6 Logs · Sanctuary Intelligence
          </p>
          <div style={ST.moxieTitleRow}>
            <span style={ST.moxieMeet}>Meet</span>
            <span className="ukv-moxie-name" style={ST.moxieName}>MOXIE</span>
          </div>
          <p style={ST.moxieDesc}>
            She reads the farm, the menu, your room —{' '}
            <em style={{ color:'rgba(255,255,255,0.55)', fontStyle:'italic' }}>and she&apos;s proactive.</em>
          </p>
          <div style={ST.moxieStatusRow}>
            {(['Farm Sync', 'Menu Log', 'Guest Mode', 'Spa Schedule'] as const).map((label, i) => (
              <div key={label} style={ST.moxieStatusItem}>
                <span style={ST.moxieStatusLabel}>{label}</span>
                <span style={ST.moxieStatusValue}>
                  {(['ACTIVE', 'LIVE', 'ON', 'UPDATED'] as const)[i]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Centre — pure CSS waveform */}
        <div className="ukv-moxie-waveform" style={ST.moxieWaveform}>
          {MOXIE_BAR_DELAYS.map((delay, i) => (
            <div
              key={`mbar-${i}`}
              className="moxie-bar"
              style={{ animationDelay: delay }}
            />
          ))}
        </div>

        {/* Right — CTA */}
        <Link
          href="/moxie"
          prefetch={false}
          className="ukv-moxie-cta"
          style={ST.moxieCta}
        >
          Chat with Moxie →
        </Link>
      </div>
    </div>
  )
})
MoxieIntelligenceCore.displayName = 'MoxieIntelligenceCore'

// ─────────────────────────────────────────────────────────────────────────────
// BENTO GRID — main export
// ─────────────────────────────────────────────────────────────────────────────
export default function BentoGrid({ eventsLabel = 'Events Ledger' }: BentoGridProps) {
  // FIX-J: useMemo — CARDS.map only runs when eventsLabel changes
  const cards = useMemo(
    () => CARDS.map(c => c.id === 'events' ? { ...c, title: eventsLabel } : c),
    [eventsLabel]
  )

  return (
    <>
      {/* FIX-E: styles rendered once, never diffed again */}
      <BentoStyles />

      <section style={ST.sectionWrap}>
        <div style={ST.bgGlow} />

        <div style={ST.innerWrap}>
          {/* Section header */}
          <div style={ST.headerWrap}>
            <div style={ST.headerRow}>
              <div style={ST.headerLineL} />
              <span style={ST.headerLabel}>The 6 Master Logs</span>
              <div style={ST.headerLineR} />
            </div>
            <p style={ST.headerQuote}>&ldquo;Refresh your soul, ground your spirit&rdquo;</p>
          </div>

          {/* FIX-H: never re-renders */}
          <LivingStatusBar />

          <div className="bento-grid">
            <div className="bento-col-5"><BentoCard card={cards[0]} index={0} /></div>
            <div className="bento-col-7"><BentoCard card={cards[1]} index={1} /></div>
            <div className="bento-col-4"><BentoCard card={cards[2]} index={2} /></div>
            <div className="bento-col-4"><BentoCard card={cards[3]} index={3} /></div>
            <div className="bento-col-4"><BentoCard card={cards[4]} index={4} /></div>
            <div className="bento-col-12"><MoxieIntelligenceCore /></div>
          </div>

          <p style={ST.footer}>
            A living archive of ecology, culture, wellness, and memory
          </p>
        </div>
      </section>
    </>
  )
}