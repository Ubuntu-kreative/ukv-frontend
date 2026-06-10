'use client'
/**
 * _components/client/FarmScrollReveal.tsx  — PERFORMANCE-OPTIMISED v4
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * FIXES IN THIS VERSION
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * FIX-A  MutationObserver self-trigger loop → re-entrancy guard
 * FIX-B  Re-entrancy guard narrowed to activateElements() call only
 * FIX-C  MO scan guard — only act on genuinely new [data-reveal] nodes
 * FIX-D  Soft-nav above-fold disappear — viewport check before IO registration
 * FIX-E  MO_LIFETIME_MS=600 killed too early — removed, MO lives full lifetime
 * FIX-F  `processing` flag too broad — narrowed to DOM-write step only
 *
 * FIX-G  (v4) getBoundingClientRect() returns wrong values on soft nav
 * ─────────────────────────────────────────────────────────────────────────────
 * THE BUG: React's useEffect fires synchronously after render, before the
 * browser has completed layout for the new page. On soft nav (Next.js <Link>),
 * getBoundingClientRect() returns 0 or stale values for all elements because
 * the browser hasn't painted yet. This means the FIX-D viewport check
 * (rect.top < vh) evaluates incorrectly — elements that should scroll-animate
 * get instantly revealed, or vice versa.
 *
 * THE FIX: Wrap the initial activateElements() pass in a double
 * requestAnimationFrame. The double-rAF pattern ("rAF inside rAF") defers
 * execution until after the browser has completed layout AND painted at least
 * one frame, guaranteeing that getBoundingClientRect() returns accurate
 * positions. Single rAF is not enough — it runs before paint. Double rAF
 * runs after the first paint, when layout is settled.
 *
 * The MutationObserver is started immediately (before the rAF) so it doesn't
 * miss any nodes added by dynamic islands during the rAF wait window.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect } from 'react'

export default function FarmScrollReveal() {
  useEffect(() => {
    // ── IntersectionObserver ─────────────────────────────────────────────────
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          const el = entry.target as HTMLElement
          el.classList.add('farm-reveal--visible')
          io.unobserve(el)
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    )

    // ── activateElements ─────────────────────────────────────────────────────
    // FIX-D: Elements already in the viewport are revealed instantly.
    // FIX-G: Only called after double-rAF so getBoundingClientRect is accurate.
    function activateElements(elements: NodeListOf<HTMLElement> | HTMLElement[]) {
      if (!elements.length) return

      const vh = window.innerHeight
      const groups = new Map<Element, HTMLElement[]>()

      Array.from(elements).forEach((el) => {
        if (el.classList.contains('farm-reveal')) return

        const direction = el.dataset.reveal ?? 'up'
        el.classList.add('farm-reveal', `farm-reveal--${direction}`)

        // FIX-D: already in viewport → reveal immediately, no IO
        const rect = el.getBoundingClientRect()
        if (rect.top < vh) {
          el.style.setProperty('--farm-delay', '0ms')
          el.classList.add('farm-reveal--visible')
          return
        }

        const parent =
          el.closest('.farm-exp-grid, .farm-tab-grid, .farm-log-grid, .farm-stats-bar__inner') ??
          document.body
        if (!groups.has(parent)) groups.set(parent, [])
        groups.get(parent)!.push(el)
      })

      groups.forEach((groupEls) => {
        groupEls.forEach((el, i) => {
          const customDelay = el.dataset.revealDelay
          el.style.setProperty(
            '--farm-delay',
            customDelay ? `${customDelay}ms` : `${i * 80}ms`
          )
          io.observe(el)
        })
      })
    }

    // ── MutationObserver ─────────────────────────────────────────────────────
    // Started immediately — before the rAF — so no dynamic nodes are missed
    // during the layout wait window.
    let idleCbId: number | ReturnType<typeof setTimeout> | null = null
    let pendingEls: HTMLElement[] = []
    let processing = false

    function flushPending() {
      idleCbId = null
      if (!pendingEls.length) return
      const batch = pendingEls
      pendingEls = []
      if (processing) return
      processing = true
      try {
        activateElements(batch)
      } finally {
        processing = false
      }
    }

    const mo = new MutationObserver((mutations) => {
      mutations.forEach((m) => {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.dataset.reveal && !node.classList.contains('farm-reveal')) {
            pendingEls.push(node)
          }
          node.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
            if (!el.classList.contains('farm-reveal')) pendingEls.push(el)
          })
        })
      })

      if (!pendingEls.length) return
      if (idleCbId !== null) return

      if (typeof window.requestIdleCallback === 'function') {
        idleCbId = window.requestIdleCallback(flushPending, { timeout: 300 })
      } else {
        idleCbId = setTimeout(flushPending, 100)
      }
    })

    mo.observe(document.body, { childList: true, subtree: true })

    // ── FIX-G: Initial pass deferred via double-rAF ──────────────────────────
    // Single rAF fires before paint (layout not settled).
    // Double rAF fires after first paint — getBoundingClientRect is accurate.
    let raf1: number
    let raf2: number
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        activateElements(document.querySelectorAll<HTMLElement>('[data-reveal]'))
      })
    })

    return () => {
      cancelAnimationFrame(raf1)
      cancelAnimationFrame(raf2)
      if (idleCbId !== null) {
        if (typeof window.cancelIdleCallback === 'function') {
          window.cancelIdleCallback(idleCbId as number)
        } else {
          clearTimeout(idleCbId as ReturnType<typeof setTimeout>)
        }
      }
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}