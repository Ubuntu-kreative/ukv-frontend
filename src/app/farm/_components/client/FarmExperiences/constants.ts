/**
 * FarmExperiences/constants.ts
 *
 * All module-level constants. Hoisted here so they are:
 *  • Created once at module-load time
 *  • Never recreated inside render cycles (no GC pressure)
 *  • Fully tree-shakeable — only imported constants are bundled
 *
 * PERF-03 FIX: toast style objects were previously created inline on every
 * toast() invocation. Moving them here eliminates that GC noise.
 */

export const TOAST_STYLE = {
  background:    '#0a0a0a',
  border:        '1px solid rgba(0,255,65,0.3)',
  color:         'var(--neon, #00ff41)',
  fontFamily:    'var(--font-body, sans-serif)',
  fontSize:      '11px',
  letterSpacing: '0.05em',
  textTransform: 'uppercase' as const,
} as const

export const TOAST_ICON_THEME = {
  primary:   '#00ff41',
  secondary: '#000',
} as const

/** How long (ms) the "just added" button state persists. */
export const JUST_ADDED_DURATION = 2000

/** Breakpoint string used by every grid image's `sizes` attribute. */
export const CARD_IMAGE_SIZES =
  '(max-width:640px) 100vw, (max-width:1024px) 50vw, 500px'

export const TAB_CARD_IMAGE_SIZES =
  '(max-width:500px) 100vw, (max-width:768px) 50vw, 320px'

export const MODAL_IMAGE_SIZES =
  '(max-width:700px) 100vw, 440px'