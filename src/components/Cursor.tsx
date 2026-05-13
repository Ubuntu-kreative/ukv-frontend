'use client'

import { useEffect } from 'react'

export default function Cursor() {
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.matchMedia('(hover: none)').matches) return

    // ── Create dot ───────────────────────────────────────────
    const dot = document.createElement('div')
    dot.id = 'ukv-cursor-dot'
    dot.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 8px !important;
      height: 8px !important;
      background-color: #00FF41 !important;
      border-radius: 50% !important;
      pointer-events: none !important;
      z-index: 2147483647 !important;
      transform: translate(-50%, -50%) !important;
      transition: width 0.25s ease, height 0.25s ease, background-color 0.25s ease !important;
      will-change: left, top !important;
      display: block !important;
      opacity: 1 !important;
      mix-blend-mode: normal !important;
    `

    // ── Create ring ──────────────────────────────────────────
    const ring = document.createElement('div')
    ring.id = 'ukv-cursor-ring'
    ring.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 36px !important;
      height: 36px !important;
      border: 1px solid rgba(0, 255, 65, 0.4) !important;
      background: transparent !important;
      border-radius: 50% !important;
      pointer-events: none !important;
      z-index: 2147483646 !important;
      transform: translate(-50%, -50%) !important;
      transition: width 0.35s ease, height 0.35s ease, border-color 0.3s ease, border-width 0.3s ease !important;
      will-change: left, top !important;
      display: block !important;
      opacity: 1 !important;
      mix-blend-mode: normal !important;
      background-color: transparent !important;
    `

    // ── Force cursor:none ────────────────────────────────────
    const styleTag = document.createElement('style')
    styleTag.id = 'ukv-cursor-style'
    styleTag.textContent = `
      *, *::before, *::after {
        cursor: none !important;
      }
    `
    document.head.appendChild(styleTag)
    document.body.appendChild(dot)
    document.body.appendChild(ring)

    // ── Mouse tracking ───────────────────────────────────────
    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0
    let rafId: number

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = `${mouseX}px`
      dot.style.top  = `${mouseY}px`
    }

    const animate = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = `${ringX}px`
      ring.style.top  = `${ringY}px`
      rafId = requestAnimationFrame(animate)
    }

    // ── Hover: dot shrinks, ring grows, both turn gold ───────
    const onEnter = () => {
      dot.style.width           = '5px'
      dot.style.height          = '5px'
      dot.style.backgroundColor = '#D4A853'
      ring.style.width          = '48px'
      ring.style.height         = '48px'
      ring.style.borderColor    = 'rgba(212, 168, 83, 0.6)'
      ring.style.borderWidth    = '1.5px'
    }

    const onLeave = () => {
      dot.style.width           = '8px'
      dot.style.height          = '8px'
      dot.style.backgroundColor = '#00FF41'
      ring.style.width          = '36px'
      ring.style.height         = '36px'
      ring.style.borderColor    = 'rgba(0, 255, 65, 0.4)'
      ring.style.borderWidth    = '1px'
    }

    const addHoverListeners = () => {
      document.querySelectorAll(
        'a, button, [data-hover], input, select, textarea, label'
      ).forEach(el => {
        el.removeEventListener('mouseenter', onEnter)
        el.removeEventListener('mouseleave', onLeave)
        el.addEventListener('mouseenter', onEnter)
        el.addEventListener('mouseleave', onLeave)
      })
    }

    window.addEventListener('mousemove', onMove)
    rafId = requestAnimationFrame(animate)
    addHoverListeners()

    const observer = new MutationObserver(() => addHoverListeners())
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
      observer.disconnect()
      document.getElementById('ukv-cursor-dot')?.remove()
      document.getElementById('ukv-cursor-ring')?.remove()
      document.getElementById('ukv-cursor-style')?.remove()
    }
  }, [])

  return null
}