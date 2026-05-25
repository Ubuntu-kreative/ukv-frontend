/**
 * components/client/BentoGridSkeleton.tsx
 *
 * CLS-safe skeleton that EXACTLY mirrors the BentoGrid layout.
 * minHeight on every cell matches the rendered component so there
 * is zero layout shift when BentoGrid hydrates.
 *
 * Used as the `loading` prop on dynamic(() => import('./BentoGrid'), { loading: BentoGridSkeleton })
 * AND as the <Suspense> fallback in page.tsx.
 */

import type { CSSProperties } from 'react'

// ── Stable style constants (module-level, never re-allocated) ─────────────────

const S = {
  root: {
    padding: 'clamp(48px, 8vw, 80px) clamp(16px, 4vw, 24px)',
    maxWidth: '88rem',
    margin:   '0 auto',
  } satisfies CSSProperties,

  header: {
    height:        28,
    width:         260,
    margin:        '0 auto 40px',
    borderRadius:  4,
    background:    'rgba(255,255,255,0.04)',
  } satisfies CSSProperties,

  statusBar: {
    height:        32,
    marginBottom:  40,
    borderRadius:  4,
    background:    'rgba(0,255,65,0.03)',
    border:        '0.5px solid rgba(0,255,65,0.08)',
  } satisfies CSSProperties,

  grid: {
    display:             'grid',
    gridTemplateColumns: 'repeat(12, 1fr)',
    gap:                 10,
  } satisfies CSSProperties,

  moxie: {
    gridColumn: 'span 12',
    minHeight:  100,
    background: 'rgba(0,255,65,0.02)',
    border:     '0.5px solid rgba(0,255,65,0.08)',
    borderRadius: 2,
  } satisfies CSSProperties,
} as const

// Card definitions mirror the real CARDS layout exactly
const SKELETON_CARDS: { col: string; minH: number }[] = [
  { col: 'span 5', minH: 280 },
  { col: 'span 7', minH: 280 },
  { col: 'span 4', minH: 260 },
  { col: 'span 4', minH: 260 },
  { col: 'span 4', minH: 260 },
]

// Stable per-card styles — same object reference every render
const CARD_STYLES: CSSProperties[] = SKELETON_CARDS.map(c => ({
  gridColumn: c.col,
  minHeight:  c.minH,
  background: 'rgba(255,255,255,0.02)',
  border:     '0.5px solid rgba(255,255,255,0.05)',
  borderRadius: 2,
  overflow:   'hidden',
  position:   'relative',
}))

export default function BentoGridSkeleton() {
  return (
    <section style={S.root} aria-hidden="true">
      <div style={S.header} className="pulse-opacity" />
      <div style={S.statusBar} className="pulse-opacity" />
      <div style={S.grid}>
        {CARD_STYLES.map((style, i) => (
          <div key={i} style={style} className="pulse-opacity">
            {/* Inner chrome lines — mirror real card anatomy */}
            <div style={{ position:'absolute', top:0, left:0, right:0, height:1, background:'rgba(255,255,255,0.04)' }} />
            <div style={{ padding:'22px 24px' }}>
              <div style={{ width:44, height:6, background:'rgba(255,255,255,0.05)', borderRadius:2, marginBottom:14 }} />
              <div style={{ width:'70%', height:10, background:'rgba(255,255,255,0.04)', borderRadius:2, marginBottom:8 }} />
              <div style={{ width:'45%', height:8, background:'rgba(255,255,255,0.03)', borderRadius:2 }} />
            </div>
          </div>
        ))}
        <div style={S.moxie} className="pulse-opacity" />
      </div>
    </section>
  )
}