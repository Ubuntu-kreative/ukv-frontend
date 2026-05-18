'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — BentoGrid  (production v2)
//
// FIXES:
//   1. AnimatedNumber — ReferenceError: `total` is not defined.
//      Root cause: the useEffect dependency array referenced `total` but
//      that variable was never declared in the component scope (leftover
//      from a refactor that replaced `total` with a local FRAMES constant).
//      Fix: declare FRAMES as a const INSIDE the effect so it is always
//      self-contained. Remove `total` from deps entirely. Add `started`
//      to the dep array so the animation only fires once after the delay.
//
//   2. Mobile layout — the hard-coded 12-column CSS grid collapsed and
//      cards overlapped on narrow viewports.
//      Fix: CSS media queries (injected via <style> tag) swap grid columns
//      to 2-column at ≤900 px and 1-column at ≤560 px. All className
//      helpers (bento-col-*) map to the correct spans at every breakpoint.
//      MoxieIntelligenceCore always spans full width via bento-col-full.
//      Waveform bars hidden below tablet to save horizontal space.
//
// PRESERVED (everything else):
//   • All 5 BentoCardData entries + CARDS array — untouched
//   • ENV_SIGNALS telemetry ticker
//   • LivingStatusBar, BentoCard, MoxieIntelligenceCore — full originals
//   • CornerMark, LiveDot — unchanged
//   • All keyframes: ukv-pulse, ukv-scroll, ukv-rise, ukv-flicker
//   • eventsLabel prop + cards override
//   • All hover effects, grain texture, ambient glows, corner brackets
//   • All Ubuntu Kreative Village CSS variable tokens
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface BentoGridProps {
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
// ENVIRONMENTAL DATA
// ─────────────────────────────────────────────────────────────────────────────
const ENV_SIGNALS = [
  { label: 'WIND',    value: '12 km/h',  color: '#A8D8F0' },
  { label: 'SOIL',    value: 'HEALTHY',  color: 'var(--neon)' },
  { label: 'SUNSET',  value: '18:42',    color: 'var(--gold)' },
  { label: 'MOON',    value: 'WAXING ◑', color: '#C4B5E0' },
  { label: 'TEMP',    value: '24°C',     color: '#A8D4B4' },
  { label: 'ECOLOGY', value: 'STABLE',   color: 'var(--neon)' },
  { label: 'FARM',    value: 'SYNC OK',  color: 'var(--neon)' },
  { label: 'RAIN',    value: '72%',      color: '#A8D8F0' },
]

// ─────────────────────────────────────────────────────────────────────────────
// CARD DATA
// ─────────────────────────────────────────────────────────────────────────────
const CARDS: BentoCardData[] = [
  {
    id:          'farm',
    log:         'Farm Log',
    label:       'The Pulse',
    title:       'Ecological Estate',
    subtitle:    'Livestock · Crops · Soil Intelligence',
    metric:      24,
    metricLabel: 'Living Species Tracked',
    status:      'live',
    accent:      'var(--neon)',
    href:        '/farm',
    col:         '5',
    envTag:      'SOIL HEALTHY',
    details: [
      'Soil moisture Field A: 68% — optimal',
      'Next harvest: Kale — 3 days',
      'Cattle Unit 3: All healthy, grazing',
      'North Apiary: honey extraction due',
      'Last FarmERP sync: 8 minutes ago',
    ],
  },
  {
    id:          'restaurant',
    log:         'Restaurant Log',
    label:       'The Menu',
    title:       'Provenance Dining',
    subtitle:    'Farm-to-Fork · Live inventory · Field provenance',
    metric:      8,
    metricLabel: 'Dining Availabilities Tonight',
    status:      'live',
    accent:      'var(--gold)',
    href:        '/restaurant',
    col:         '7',
    envTag:      'KITCHEN OPEN',
    details: [
      'Tonight: Boma goat stew — Animal #UKV-047',
      'Field B kale: harvested 2 hours ago',
      'Allergen check: active for 3 guests',
      'Wine pairing: Maasai Valley Reserve',
      'Kitchen opens: 6:00 PM tonight',
    ],
  },
  {
    id:          'cottages',
    log:         'Guest Log',
    label:       'The Passport',
    title:       'Sanctuary Suites',
    subtitle:    'Pokomo Cottages · The Farmhouse',
    metric:      6,
    metricLabel: 'Sanctuaries Available',
    status:      'synced',
    accent:      '#B8A9F0',
    href:        '/cottages',
    col:         '4',
    envTag:      'ROOMS READY',
    details: [
      'Pokomo Cottages 1–4: available',
      'Farmhouse Suite A: available from Friday',
      'Farmhouse Suite B: booked this week',
      'Book 3+ nights for 15% quiet season rate',
      'All cottages: fresh linen, firewood stocked',
    ],
  },
  {
    id:          'spa',
    log:         'Spa Log',
    label:       'The Ritual',
    title:       'Arohamai Ritual Spa',
    subtitle:    'Ancient African therapies · Organic botanicals',
    metric:      3,
    metricLabel: 'Ritual Slots Open Today',
    status:      'live',
    accent:      '#F0A8B8',
    href:        '/spa',
    col:         '4',
    envTag:      'SPA SERENE',
    details: [
      'Volcanic Mud Ritual: 2:00 PM open',
      'Forest Massage: 4:00 PM — 1 slot',
      'Ubuntu Couples Ritual: Saturday',
      'Organic botanicals: fully stocked',
      'Outdoor treatment pavilion: open',
    ],
  },
  {
    id:          'events',
    log:         'Events Log',
    label:       'The Calendar',
    title:       'Events Ledger',
    subtitle:    'Harvest dinners · Weddings · Fire circles',
    status:      'synced',
    accent:      'var(--gold)',
    href:        '/events',
    col:         '4',
    envTag:      'CALENDAR LIVE',
    events: [
      { label: 'Harvest Fire Dinner',      date: 'Last Sat monthly',   color: 'var(--gold)' },
      { label: 'New Moon Circle',          date: 'Each new moon',      color: '#A8D8F0'      },
      { label: 'Farm-to-Table Workshop',   date: 'Fri by arrangement', color: 'var(--neon)' },
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
// ANIMATED COUNTER
//
// FIX: `total` was referenced in the useEffect dep array but never declared
// in the component scope. Root cause: an earlier refactor renamed `total`
// to a local FRAMES const inside the effect, but forgot to remove the outer
// reference from the dep array.
//
// Solution:
//   • FRAMES is now declared as a const INSIDE the effect — fully self-contained.
//   • `started` is added to the dep array so the animation triggers once the
//     entrance delay fires (staggered cards).
//   • `total` is gone entirely — no more ReferenceError.
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedNumber({
  value,
  color,
  delay = 0,
}: {
  value:  number
  color:  string
  delay?: number
}) {
  const [display, setDisplay] = useState(0)
  const [started, setStarted] = useState(false)

  // Delay start for staggered entrance effect
  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  // !! FIX: FRAMES declared INSIDE effect. `total` removed from deps.
  useEffect(() => {
    if (!started) return

    const FRAMES = 36  // self-contained — never leaks to outer scope
    let frame = 0

    const timer = setInterval(() => {
      frame++
      const ease = 1 - Math.pow(1 - frame / FRAMES, 3)
      setDisplay(prev => {
        const next = Math.min(Math.round(value * ease), value)
        return prev === next ? prev : next
      })
      if (frame >= FRAMES) clearInterval(timer)
    }, 22)

    return () => clearInterval(timer)
  }, [value, started]) // ← `started` replaces the defunct `total`

  return (
    <span style={{
      fontFamily:         'var(--font-display)',
      fontSize:           'clamp(2.8rem, 5vw, 3.6rem)',
      fontWeight:          300,
      color,
      lineHeight:          1,
      display:            'block',
      marginBottom:        6,
      letterSpacing:      '-0.02em',
      fontVariantNumeric: 'tabular-nums',
    }}>
      {display}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DOT
// ─────────────────────────────────────────────────────────────────────────────
function LiveDot({ status }: { status: CardStatus }) {
  const map = {
    live:   { label: 'LIVE',   bg: 'rgba(0,255,65,0.12)',    border: 'rgba(0,255,65,0.35)',    dot: 'var(--neon)',           text: 'var(--neon)'           },
    synced: { label: 'SYNCED', bg: 'rgba(212,168,83,0.1)',   border: 'rgba(212,168,83,0.3)',   dot: 'var(--gold)',           text: 'var(--gold)'           },
    idle:   { label: 'IDLE',   bg: 'rgba(255,255,255,0.04)', border: 'rgba(255,255,255,0.12)', dot: 'rgba(255,255,255,0.3)', text: 'rgba(255,255,255,0.3)' },
  }
  const s = map[status]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '2px 9px',
      background: s.bg, border: `0.5px solid ${s.border}`,
      fontFamily: 'var(--font-body)', fontSize: '7px',
      letterSpacing: '0.2em', textTransform: 'uppercase', color: s.text,
    }}>
      <span style={{
        width: 4, height: 4, borderRadius: '50%',
        background: s.dot, flexShrink: 0,
        animation: status === 'live' ? 'ukv-pulse 1.8s ease-in-out infinite' : 'none',
      }} />
      {s.label}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CORNER MARKS
// ─────────────────────────────────────────────────────────────────────────────
function CornerMark({ pos, color }: { pos: 'tl' | 'br'; color: string }) {
  const base: React.CSSProperties = {
    position: 'absolute', width: 12, height: 12,
    borderColor: `${color}35`, borderStyle: 'solid',
    pointerEvents: 'none', transition: 'border-color 0.4s',
  }
  return (
    <span style={{
      ...base,
      ...(pos === 'tl'
        ? { top: 14, left: 14, borderWidth: '1px 0 0 1px' }
        : { bottom: 14, right: 14, borderWidth: '0 1px 1px 0' }),
    }} />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVING STATUS BAR
// ─────────────────────────────────────────────────────────────────────────────
function LivingStatusBar() {
  const items = [...ENV_SIGNALS, ...ENV_SIGNALS]
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      borderTop:    '0.5px solid rgba(0,255,65,0.12)',
      borderBottom: '0.5px solid rgba(0,255,65,0.12)',
      padding: '7px 0', marginBottom: 40,
      background: 'rgba(0,255,65,0.02)',
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: 60, background: 'linear-gradient(to right, var(--obsidian, #060606), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 0, right: 0, bottom: 0, width: 60, background: 'linear-gradient(to left, var(--obsidian, #060606), transparent)', zIndex: 2, pointerEvents: 'none' }} />
      <div style={{ display: 'flex', gap: 40, animation: 'ukv-scroll 28s linear infinite', width: 'max-content' }}>
        {items.map((sig, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
              {sig.label}
            </span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: sig.color, letterSpacing: '0.1em' }}>
              {sig.value}
            </span>
            <span style={{ width: 2, height: 2, borderRadius: '50%', background: 'rgba(255,255,255,0.1)', flexShrink: 0 }} />
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BENTO CARD
// ─────────────────────────────────────────────────────────────────────────────
function BentoCard({ card, index }: { card: BentoCardData; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const [hovered,  setHovered]  = useState(false)
  const [visible,  setVisible]  = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.12 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const toggle = useCallback(() => setExpanded(p => !p), [])

  return (
    <div
      ref={ref}
      onClick={toggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      aria-expanded={expanded}
      tabIndex={0}
      onKeyDown={e => e.key === 'Enter' && toggle()}
      style={{
        position:      'relative',
        background:     hovered ? 'rgba(255,255,255,0.035)' : 'rgba(255,255,255,0.02)',
        border:         `0.5px solid ${hovered ? `${card.accent}40` : 'rgba(255,255,255,0.06)'}`,
        overflow:       'hidden',
        cursor:         'pointer',
        minHeight:       220,
        height:         '100%',           // fill grid cell on all breakpoints
        display:        'flex',
        flexDirection:  'column',
        transition:     'border-color 0.4s, box-shadow 0.5s, transform 0.4s, background 0.4s',
        transform:       hovered ? 'translateY(-3px) scale(1.005)' : 'translateY(0) scale(1)',
        boxShadow:       hovered
          ? `0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px ${card.accent}18, 0 20px 60px ${card.accent}06`
          : '0 2px 12px rgba(0,0,0,0.2)',
        opacity:           visible ? 1 : 0,
        animationName:     visible ? 'ukv-rise' : 'none',
        animationDuration: '0.7s',
        animationDelay:    `${index * 90}ms`,
        animationFillMode: 'both',
        animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Accent top line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${card.accent}, transparent)`, opacity: hovered ? 0.7 : 0.35, transition: 'opacity 0.4s', pointerEvents: 'none' }} />

      {/* Ambient glow — top left */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 70% 55% at 20% 20%, ${card.accent}18, transparent 65%)`, opacity: hovered ? 1 : 0, transition: 'opacity 0.6s' }} />
      {/* Ambient glow — bottom right */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: `radial-gradient(ellipse 50% 40% at 85% 90%, ${card.accent}0d, transparent 60%)`, opacity: hovered ? 0.8 : 0, transition: 'opacity 0.5s 0.1s' }} />

      {/* Grain texture */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")', opacity: 0.025, mixBlendMode: 'overlay' }} />

      <CornerMark pos="tl" color={hovered ? card.accent : 'rgba(255,255,255,0.4)'} />
      <CornerMark pos="br" color={hovered ? card.accent : 'rgba(255,255,255,0.4)'} />

      {/* Expand chevron */}
      <div style={{ position: 'absolute', top: 16, right: 16, fontFamily: 'var(--font-body)', fontSize: '10px', color: hovered ? card.accent : 'rgba(255,255,255,0.2)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), color 0.3s', pointerEvents: 'none', userSelect: 'none' }}>
        ▾
      </div>

      {/* Card body */}
      <div style={{ padding: 'clamp(16px,3vw,22px) clamp(16px,3vw,24px) clamp(18px,3vw,24px)', display: 'flex', flexDirection: 'column', flex: 1 }}>

        {/* Status + env tag */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <LiveDot status={card.status} />
          {card.envTag && (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '6px', letterSpacing: '0.28em', textTransform: 'uppercase', color: `${card.accent}80` }}>
              {card.envTag}
            </span>
          )}
        </div>

        {/* Log + label */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', marginBottom: 8 }}>
          {card.log} · {card.label}
        </p>

        {/* Title */}
        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.25rem, 2.2vw, 2rem)', fontWeight: 300, lineHeight: 1.15, color: hovered ? 'var(--cream)' : 'rgba(237,230,211,0.9)', marginBottom: 6, transition: 'color 0.3s', letterSpacing: '-0.01em' }}>
          {card.title}
        </h3>

        {/* Subtitle */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', lineHeight: 1.65, color: 'rgba(255,255,255,0.35)', marginBottom: 20 }}>
          {card.subtitle}
        </p>

        {/* Metric OR event pills */}
        {card.metric !== undefined ? (
          <div style={{ marginTop: 'auto' }}>
            <AnimatedNumber value={card.metric} color={card.accent} delay={index * 90 + 300} />
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>
              {card.metricLabel}
            </p>
          </div>
        ) : card.events ? (
          <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 5 }}>
            {card.events.map(ev => (
              <div key={ev.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '5px 0', borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: ev.color, flexShrink: 0 }} />
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: ev.color, letterSpacing: '0.04em' }}>{ev.label}</span>
                </div>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: 'rgba(255,255,255,0.22)', letterSpacing: '0.06em' }}>{ev.date}</span>
              </div>
            ))}
          </div>
        ) : null}

        {/* Expanded details */}
        <div style={{ overflow: 'hidden', maxHeight: expanded ? '260px' : '0', opacity: expanded ? 1 : 0, transition: 'max-height 0.5s cubic-bezier(0.16,1,0.3,1), opacity 0.4s', marginTop: expanded ? 16 : 0 }}>
          <div style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)', paddingTop: 14 }}>
            {card.details?.map((detail, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.52)', padding: '4px 0', opacity: expanded ? 1 : 0, transform: expanded ? 'translateX(0)' : 'translateX(-6px)', transition: `opacity 0.35s ${i * 55}ms, transform 0.35s ${i * 55}ms` }}>
                <span style={{ color: card.accent, fontSize: '7px', marginTop: 5, flexShrink: 0 }}>▸</span>
                {detail}
              </div>
            ))}
            <Link
              href={card.href}
              onClick={e => e.stopPropagation()}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: card.accent, marginTop: 14, textDecoration: 'none', opacity: 0.85, transition: 'opacity 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '0.85')}
            >
              Open Full Log →
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOXIE INTELLIGENCE CORE
// ─────────────────────────────────────────────────────────────────────────────
function MoxieIntelligenceCore() {
  const [wavePhase, setWavePhase] = useState(0)
  const [hovered,   setHovered]   = useState(false)
  const waveRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    waveRef.current = setInterval(() => setWavePhase(p => p + 1), 140)
    return () => { if (waveRef.current) clearInterval(waveRef.current) }
  }, [])

  const BAR_COUNT  = 18
  const getBarHeight = (i: number) => {
    const base  = Math.sin((i / BAR_COUNT) * Math.PI * 2 + wavePhase * 0.18) * 0.45 + 0.55
    const noise = Math.sin((i * 2.7 + wavePhase * 0.3)) * 0.2
    return Math.max(0.1, Math.min(1, base + noise))
  }

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:   'relative',
        overflow:   'hidden',
        background:  hovered ? 'rgba(0,255,65,0.04)' : 'rgba(0,255,65,0.025)',
        border:      `0.5px solid ${hovered ? 'rgba(0,255,65,0.25)' : 'rgba(0,255,65,0.12)'}`,
        padding:    'clamp(20px,4vw,28px) clamp(18px,4vw,32px)',
        transition: 'border-color 0.4s, background 0.4s, box-shadow 0.4s, transform 0.4s',
        boxShadow:   hovered ? '0 0 60px rgba(0,255,65,0.05)' : 'none',
        transform:   hovered ? 'translateY(-2px)' : 'translateY(0)',
      }}
    >
      {/* Top neon line */}
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--neon),transparent)', opacity: hovered ? 0.55 : 0.28, transition: 'opacity 0.4s' }} />
      {/* Bottom neon line */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 1, background: 'linear-gradient(90deg,transparent,var(--neon),transparent)', opacity: hovered ? 0.55 : 0.28, transition: 'opacity 0.4s' }} />
      {/* Ambient glow */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 80% at 10% 50%, rgba(0,255,65,0.06), transparent 60%)', opacity: hovered ? 1 : 0, transition: 'opacity 0.6s' }} />

      <CornerMark pos="tl" color="var(--neon)" />
      <CornerMark pos="br" color="var(--neon)" />

      {/* Responsive inner flex row */}
      <div className="moxie-core-inner">

        {/* Left — identity */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', marginBottom: 10 }}>
            AI Concierge Protocol · All 6 Logs · Sanctuary Intelligence
          </p>

          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 6, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.7rem,4vw,2.8rem)', fontWeight: 300, color: 'var(--cream)' }}>Meet</span>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 500, fontSize: 'clamp(1.7rem,4vw,2.8rem)', color: 'var(--neon)', letterSpacing: '0.06em', textShadow: hovered ? '0 0 30px rgba(0,255,65,0.5)' : '0 0 12px rgba(0,255,65,0.2)', transition: 'text-shadow 0.5s' }}>MOXIE</span>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.7 }}>
            She reads the farm, the menu, your room —{' '}
            <em style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'italic' }}>and she&apos;s proactive.</em>
          </p>

          <div style={{ display: 'flex', gap: 18, marginTop: 12, flexWrap: 'wrap' }}>
            {[
              { label: 'Farm Sync',    val: 'ACTIVE'  },
              { label: 'Menu Log',     val: 'LIVE'    },
              { label: 'Guest Mode',   val: 'ON'      },
              { label: 'Spa Schedule', val: 'UPDATED' },
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)', display: 'block' }}>{t.label}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: 'var(--neon)', letterSpacing: '0.1em' }}>{t.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Centre — animated waveform (hidden on mobile via CSS) */}
        <div className="moxie-waveform" style={{ display: 'flex', alignItems: 'center', gap: 3, height: 52, flexShrink: 0, opacity: 0.7 }}>
          {Array.from({ length: BAR_COUNT }).map((_, i) => (
            <div key={i} style={{ width: 3, height: `${getBarHeight(i) * 52}px`, background: `rgba(0,255,65,${0.3 + getBarHeight(i) * 0.5})`, transition: 'height 0.14s ease, background 0.14s ease', flexShrink: 0 }} />
          ))}
        </div>

        {/* Right — CTA */}
        <Link
          href="/moxie"
          className="moxie-cta"
          style={{ display: 'inline-flex', alignItems: 'center', gap: 10, padding: '12px 24px', border: '0.5px solid rgba(0,255,65,0.4)', background: hovered ? 'rgba(0,255,65,0.08)' : 'transparent', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--neon)', textDecoration: 'none', transition: 'background 0.3s, border-color 0.3s', flexShrink: 0, whiteSpace: 'nowrap', alignSelf: 'center' }}
          onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background = 'rgba(0,255,65,0.12)'; el.style.borderColor = 'rgba(0,255,65,0.6)' }}
          onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background = hovered ? 'rgba(0,255,65,0.08)' : 'transparent'; el.style.borderColor = 'rgba(0,255,65,0.4)' }}
        >
          Chat with Moxie →
        </Link>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// BENTO GRID — exported main component
// ─────────────────────────────────────────────────────────────────────────────
export default function BentoGrid({ eventsLabel = 'Events Ledger' }: BentoGridProps) {

  const cards = CARDS.map(c => c.id === 'events' ? { ...c, title: eventsLabel } : c)

  return (
    <>
      {/* ── Keyframes + mobile responsive grid ── */}
      <style>{`
        /* ─── Core animations ─── */
        @keyframes ukv-pulse {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.2; }
        }
        @keyframes ukv-scroll {
          0%   { transform: translateX(0);    }
          100% { transform: translateX(-50%); }
        }
        @keyframes ukv-rise {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes ukv-flicker {
          0%,100% { opacity: 1;   }
          92%     { opacity: 1;   }
          93%     { opacity: 0.4; }
          94%     { opacity: 1;   }
          97%     { opacity: 1;   }
          98%     { opacity: 0.6; }
          99%     { opacity: 1;   }
        }

        /* ─── Moxie core flex row ─── */
        .moxie-core-inner {
          display:         flex;
          align-items:     center;
          justify-content: space-between;
          gap:             24px;
          flex-wrap:       wrap;
        }

        /* ─── Grid system ─── */
        .bento-grid {
          display:               grid;
          grid-template-columns: repeat(12, 1fr);
          gap:                   10px;
        }
        .bento-col-5  { grid-column: span 5;  }
        .bento-col-7  { grid-column: span 7;  }
        .bento-col-4  { grid-column: span 4;  }
        .bento-col-12 { grid-column: span 12; }

        /* ─── Tablet ≤ 900 px: 2-column ─── */
        @media (max-width: 900px) {
          .bento-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
          }
          .bento-col-5,
          .bento-col-7,
          .bento-col-4 { grid-column: span 1; }
          .bento-col-12 { grid-column: span 2; }
          .moxie-waveform { display: none; }
          .moxie-cta { align-self: flex-start; }
        }

        /* ─── Mobile ≤ 560 px: 1-column ─── */
        @media (max-width: 560px) {
          .bento-grid {
            grid-template-columns: 1fr;
            gap: 8px;
          }
          .bento-col-5,
          .bento-col-7,
          .bento-col-4,
          .bento-col-12 { grid-column: span 1; }
          .moxie-core-inner {
            flex-direction: column;
            align-items:    flex-start;
            gap:            16px;
          }
          .moxie-waveform { display: none; }
          .moxie-cta {
            align-self: stretch;
            justify-content: center;
          }
        }
      `}</style>

      <section style={{ position: 'relative', padding: 'clamp(48px, 8vw, 80px) 0 clamp(56px, 8vw, 96px)' }}>

        {/* Background atmospheric glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '80%', height: '60%', pointerEvents: 'none', background: 'radial-gradient(ellipse at center, rgba(0,255,65,0.025) 0%, transparent 65%)' }} />

        <div style={{ maxWidth: '88rem', margin: '0 auto', padding: '0 clamp(16px, 4vw, 24px)' }}>

          {/* ── Section header ── */}
          <div style={{ textAlign: 'center', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16, justifyContent: 'center' }}>
              <div style={{ height: '0.5px', width: 80, background: 'linear-gradient(to right, transparent, rgba(0,255,65,0.4))' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.35em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                The 6 Master Logs
              </span>
              <div style={{ height: '0.5px', width: 80, background: 'linear-gradient(to left, transparent, rgba(0,255,65,0.4))' }} />
            </div>
            <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: 'clamp(0.95rem, 1.6vw, 1.35rem)', color: 'rgba(200,168,75,0.35)', letterSpacing: '0.06em', lineHeight: 1.6 }}>
              &ldquo;Refresh your soul, ground your spirit&rdquo;
            </p>
          </div>

          {/* ── Living Status Bar ── */}
          <LivingStatusBar />

          {/* ── MAIN GRID ── */}
          <div className="bento-grid">

            {/* Row 1: Farm (5) + Restaurant (7) */}
            <div className="bento-col-5">
              <BentoCard card={cards[0]} index={0} />
            </div>
            <div className="bento-col-7">
              <BentoCard card={cards[1]} index={1} />
            </div>

            {/* Row 2: Cottages + Spa + Events (4 each) */}
            <div className="bento-col-4">
              <BentoCard card={cards[2]} index={2} />
            </div>
            <div className="bento-col-4">
              <BentoCard card={cards[3]} index={3} />
            </div>
            <div className="bento-col-4">
              <BentoCard card={cards[4]} index={4} />
            </div>

            {/* Row 3: Moxie — always full width */}
            <div className="bento-col-12">
              <MoxieIntelligenceCore />
            </div>

          </div>

          {/* Footer note */}
          <p style={{ textAlign: 'center', fontFamily: 'var(--font-body)', fontStyle: 'italic', fontSize: '9px', letterSpacing: '0.18em', color: 'rgba(255,255,255,0.12)', marginTop: 20 }}>
            A living archive of ecology, culture, wellness, and memory
          </p>

        </div>
      </section>
    </>
  )
}