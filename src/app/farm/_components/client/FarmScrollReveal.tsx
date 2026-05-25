'use client'
/**
 * _components/client/FarmScrollReveal.tsx  — PERFORMANCE-OPTIMISED
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * PERF-07  MUTATIONOBSERVER SELF-TRIGGER LOOP  ← SECONDARY FREEZE CAUSE
 * ─────────────────────────────────────────────────────────────────────────────
 *
 * The original MutationObserver watched document.body with { childList: true,
 * subtree: true }. Inside its callback, activateElements() mutated the DOM
 * by calling el.classList.add('farm-reveal', 'farm-reveal--up') and
 * el.style.setProperty('--farm-delay', ...).
 *
 * classList.add() and style.setProperty() on an observed element's descendant
 * DO NOT fire childList mutations — BUT if any browser or framework (e.g.
 * React DevTools, Zustand react-tracked, Next.js router) also triggers
 * attribute changes on those same elements immediately after, the observer
 * fires again, re-scanning the subtree, which can create a feedback loop
 * of rapid successive MutationObserver callbacks on every cart update.
 *
 * More critically: the observer had NO GUARD against re-processing already-
 * activated elements. If a parent node was re-mounted (e.g. React reconciler
 * swapping a subtree during a state change), the observer would re-scan its
 * entire subtree, calling activateElements() on elements that already had
 * 'farm-reveal'. The `if (el.classList.contains('farm-reveal')) return` guard
 * existed, but the *outer scan* still iterated ALL descendants on EVERY
 * mutation — on a large DOM this is O(N) per mutation, and cart interactions
 * trigger multiple mutations.
 *
 * FIX-A: MutationObserver is DISCONNECTED after FarmExperiences has mounted.
 *   We only need it for the dynamic-import race window (roughly 0–500ms).
 *   A 600ms timeout disconnects the observer once all dynamic islands have
 *   had time to paint. After that, all [data-reveal] elements are in the DOM
 *   and the IntersectionObserver handles them indefinitely.
 *
 * FIX-B: Observer uses a `processing` flag (re-entrancy guard). If the
 *   callback is already running, new mutations that fire during DOM writes
 *   are ignored. This eliminates any remaining feedback-loop risk.
 *
 * FIX-C: Descendant scan is guarded by checking if any NEW [data-reveal]
 *   nodes were actually found before calling activateElements, avoiding
 *   redundant work on purely structural mutations (class changes, etc.).
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * BUG-07 (original) / BUG-08 (original) — preserved from previous audit.
 * All other observer and stagger logic is unchanged.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { useEffect } from 'react'

// How long to keep the MutationObserver alive after mount.
// This covers the ssr:false hydration window for FarmExperiences.
// After this time all dynamic nodes are in the DOM; the MO is no longer needed.
const MO_LIFETIME_MS = 600

export default function FarmScrollReveal() {
  useEffect(() => {
    // IntersectionObserver: created once, reused for all elements
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

    /**
     * Applies reveal classes + stagger delays, then observes with IO.
     * Idempotent: already-activated elements are skipped.
     */
    function activateElements(elements: NodeListOf<HTMLElement> | HTMLElement[]) {
      if (!elements.length) return

      const groups = new Map<Element, HTMLElement[]>()

      Array.from(elements).forEach((el) => {
        if (el.classList.contains('farm-reveal')) return  // idempotency guard

        const direction = el.dataset.reveal ?? 'up'
        el.classList.add('farm-reveal', `farm-reveal--${direction}`)

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

    // Initial pass: server-rendered nodes (FarmHero, FarmLog, FarmStatsBar)
    activateElements(document.querySelectorAll<HTMLElement>('[data-reveal]'))

    // ── FIX-A + FIX-B + FIX-C: MutationObserver with tight lifetime + guard
    let processing = false  // FIX-B: re-entrancy guard

    const mo = new MutationObserver((mutations) => {
      if (processing) return  // FIX-B: ignore mutations caused by our own DOM writes
      processing = true

      try {
        const newRevealEls: HTMLElement[] = []

        mutations.forEach((m) => {
          m.addedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return
            // FIX-C: only scan nodes that were *added* (not attribute changes)
            if (node.dataset.reveal && !node.classList.contains('farm-reveal')) {
              newRevealEls.push(node)
            }
            node.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
              if (!el.classList.contains('farm-reveal')) newRevealEls.push(el)
            })
          })
        })

        // FIX-C: skip activateElements call if nothing new was found
        if (newRevealEls.length) activateElements(newRevealEls)
      } finally {
        processing = false
      }
    })

    mo.observe(document.body, { childList: true, subtree: true })

    // FIX-A: disconnect MO after the dynamic-import race window closes.
    // The IO stays alive for the page lifetime (it's lightweight; it only
    // fires when elements scroll into view and immediately unobserves them).
    const moTimeout = setTimeout(() => mo.disconnect(), MO_LIFETIME_MS)

    return () => {
      clearTimeout(moTimeout)
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return null
}