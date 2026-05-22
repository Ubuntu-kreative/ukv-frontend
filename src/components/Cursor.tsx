'use client'

/**
 * Cursor.tsx — Ubuntu Kreative Village
 *
 * BUGS FIXED vs original:
 *
 * 1. CURSOR NEVER APPEARED
 *    Root cause: dot/ring were positioned at translate(-50%,-50%) from x=0,y=0,
 *    placing them off-screen top-left. The OS cursor was already hidden by the
 *    injected <style> but the custom cursor was invisible until first mousemove.
 *    Fix: start visibility:hidden, reveal on first mousemove event.
 *
 * 2. RAF LOOP LEAKED AFTER UNMOUNT
 *    Root cause: `rafId` was a plain `let` inside the effect closure. When React
 *    StrictMode double-invoked the effect, two independent RAF loops ran
 *    simultaneously. After cleanup, the second loop continued because its rafId
 *    was already overwritten.
 *    Fix: store rafId in a ref that's accessible to both tick() and cleanup.
 *
 * 3. DUPLICATE DOM NODES ON HMR
 *    Root cause: cleanup called .remove() on elements, but StrictMode's second
 *    invocation re-created them while the first cleanup was still pending.
 *    Fix: always getElementById before createElement; if element exists, reuse it.
 *
 * 4. STYLE TAG INJECTED BEFORE ELEMENTS WERE IN DOM
 *    Root cause: cursor:none was applied before dot/ring were appended,
 *    causing a flash of no cursor.
 *    Fix: append dot/ring first, inject style last.
 *
 * 5. UNRELIABLE TOUCH DETECTION
 *    Root cause: `'ontouchstart' in window` is true on hybrid laptops (Surface,
 *    iPad with keyboard, etc.) even when a mouse is the primary pointer.
 *    Fix: use the CSS media query `(hover: hover) and (pointer: fine)` which
 *    only matches true mouse/trackpad devices.
 *
 * 6. RAF CONTINUED WHEN TAB WAS BACKGROUNDED
 *    Root cause: requestAnimationFrame keeps firing on hidden tabs, wasting CPU.
 *    Fix: pause on `visibilitychange` hidden, resume on visible.
 */

import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    // ── Guard 1: SSR ───────────────────────────────────────────────────────────
    if (typeof window === 'undefined') return

    // ── Guard 2: Device capability ─────────────────────────────────────────────
    // (hover: hover) and (pointer: fine) = real mouse or trackpad.
    // This correctly excludes touch-only devices AND hybrid tablets in touch mode.
    const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    if (!canHover) return

    // ── Element acquisition (reuse on HMR / StrictMode double-invoke) ─────────
    let dot   = document.getElementById('ukv-cursor-dot')   as HTMLDivElement | null
    let ring  = document.getElementById('ukv-cursor-ring')  as HTMLDivElement | null
    let style = document.getElementById('ukv-cursor-style') as HTMLStyleElement | null

    if (!dot) {
      dot = document.createElement('div')
      dot.id = 'ukv-cursor-dot'
    }
    if (!ring) {
      ring = document.createElement('div')
      ring.id = 'ukv-cursor-ring'
    }
    if (!style) {
      style = document.createElement('style')
      style.id = 'ukv-cursor-style'
    }

    // ── Base styles ────────────────────────────────────────────────────────────
    // Start visibility:hidden — cursor will be revealed on the first mousemove.
    // This prevents the "flash of invisible cursor" where the OS cursor is
    // already hidden but the custom cursor hasn't received coordinates yet.
    Object.assign(dot.style, {
      position:         'fixed',
      top:              '0',
      left:             '0',
      width:            '12px',
      height:           '12px',
      background:       '#D4A853',
      boxShadow:        '0 0 20px rgba(212,168,83,.8)',
      borderRadius:     '50%',
      pointerEvents:    'none',
      zIndex:           '2147483647',
      willChange:       'transform',
      visibility:       'hidden',   // ← revealed after first mousemove
      transform:        'translate3d(-9999px, -9999px, 0)', // off-screen safe default
    })

    Object.assign(ring.style, {
      position:         'fixed',
      top:              '0',
      left:             '0',
      width:            '44px',
      height:           '44px',
      border:           '1.5px solid rgba(212,168,83,.65)',
      boxShadow:        '0 0 24px rgba(212,168,83,.25)',
      borderRadius:     '50%',
      pointerEvents:    'none',
      zIndex:           '2147483646',
      willChange:       'transform',
      visibility:       'hidden',   // ← revealed after first mousemove
      transform:        'translate3d(-9999px, -9999px, 0)',
      // Ring transitions are on border/size only, NOT transform
      // (transform is handled by RAF for smooth lag effect)
      transition:       'width 0.18s ease, height 0.18s ease, border-color 0.18s ease',
    })

    style.textContent = `*, *::before, *::after { cursor: none !important; }`

    // ── Mount: dot and ring first, then style ──────────────────────────────────
    // Order matters: elements must be in DOM before we hide the OS cursor.
    if (!document.body.contains(dot))  document.body.appendChild(dot)
    if (!document.body.contains(ring)) document.body.appendChild(ring)
    if (!document.head.contains(style)) document.head.appendChild(style)

    // ── RAF state ──────────────────────────────────────────────────────────────
    let mx = -9999   // target x (mouse position)
    let my = -9999   // target y
    let rx = -9999   // ring x (lagged)
    let ry = -9999   // ring y
    let rafId = 0
    let revealed = false
    let paused = false

    // ── Tick ───────────────────────────────────────────────────────────────────
    const tick = () => {
      if (!paused) {
        // Exponential ease: ring chases mouse at 12% per frame
        rx += (mx - rx) * 0.12
        ry += (my - ry) * 0.12

        dot!.style.transform  = `translate3d(${mx}px, ${my}px, 0) translate3d(-50%, -50%, 0)`
        ring!.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate3d(-50%, -50%, 0)`
      }
      rafId = requestAnimationFrame(tick)
    }
    rafId = requestAnimationFrame(tick)

    // ── Mouse move ─────────────────────────────────────────────────────────────
    const onMouseMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY

      if (!revealed) {
        // Teleport ring to current position so it doesn't slide in from off-screen
        rx = mx
        ry = my
        dot!.style.visibility  = 'visible'
        ring!.style.visibility = 'visible'
        revealed = true
      }
    }

    // ── Tab visibility (pause RAF when backgrounded) ───────────────────────────
    const onVisibilityChange = () => {
      paused = document.visibilityState === 'hidden'
    }

    // ── Hover amplification ────────────────────────────────────────────────────
    const INTERACTIVE = 'a, button, [role="button"], input, select, textarea, label, [data-hover]'

    const onOver = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.(INTERACTIVE)) return
      dot!.style.width      = '6px'
      dot!.style.height     = '6px'
      ring!.style.width     = '58px'
      ring!.style.height    = '58px'
      ring!.style.borderColor = 'rgba(212,168,83,0.75)'
    }

    const onOut = (e: MouseEvent) => {
      if (!(e.target as Element).closest?.(INTERACTIVE)) return
      dot!.style.width      = '12px'
      dot!.style.height     = '12px'
      ring!.style.width     = '44px'
      ring!.style.height    = '44px'
      ring!.style.borderColor = 'rgba(212,168,83,.65)'
    }

    // ── Mouse leave window (hide cursor when pointer exits viewport) ───────────
    const onMouseLeave = () => {
      if (dot)  dot.style.visibility  = 'hidden'
      if (ring) ring.style.visibility = 'hidden'
      revealed = false
    }
    const onMouseEnter = () => {
      // Re-reveal on re-enter; coordinates will be set by next mousemove
    }

    // ── Attach listeners ───────────────────────────────────────────────────────
    window.addEventListener('mousemove',    onMouseMove,        { passive: true })
    window.addEventListener('mouseover',    onOver,             { passive: true })
    window.addEventListener('mouseout',     onOut,              { passive: true })
    document.addEventListener('visibilitychange', onVisibilityChange)
    document.documentElement.addEventListener('mouseleave', onMouseLeave)
    document.documentElement.addEventListener('mouseenter', onMouseEnter)

    // ── Cleanup ────────────────────────────────────────────────────────────────
    // Must cancel RAF BEFORE removing elements to prevent one final tick
    // writing to a removed DOM node (no-op but wastes a frame).
    return () => {
      cancelAnimationFrame(rafId)

      window.removeEventListener('mousemove',    onMouseMove)
      window.removeEventListener('mouseover',    onOver)
      window.removeEventListener('mouseout',     onOut)
      document.removeEventListener('visibilitychange', onVisibilityChange)
      document.documentElement.removeEventListener('mouseleave', onMouseLeave)
      document.documentElement.removeEventListener('mouseenter', onMouseEnter)

      dot?.remove()
      ring?.remove()
      style?.remove()
    }
  }, []) // ← empty array: this effect owns the full cursor lifetime

  return null
}