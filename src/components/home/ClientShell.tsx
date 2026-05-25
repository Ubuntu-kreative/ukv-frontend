'use client'

import { useEffect } from 'react'

/**
 * FIX-14: Stores the installed flag on `window` so it survives HMR module
 * re-evaluation in dev, while still preventing double-install in production.
 *
 * This component renders nothing — it is a pure side-effect vehicle.
 * Intentionally no cleanup: the observer lives for the entire browser session.
 */
export default function ClientShell() {
  useEffect(() => {
    if ((window as any).__revealInstalled) return
    ;(window as any).__revealInstalled = true

    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('visible')
        }),
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    const observeAll = (root: Document | Element) =>
      root
        .querySelectorAll('.reveal, .reveal-left, .reveal-right')
        .forEach((el) => io.observe(el))

    observeAll(document)

    const mo = new MutationObserver((mutations) =>
      mutations.forEach((m) =>
        m.addedNodes.forEach((node) => {
          if (node instanceof Element) observeAll(node)
        })
      )
    )
    mo.observe(document.body, { childList: true, subtree: true })
  }, [])

  return null
}