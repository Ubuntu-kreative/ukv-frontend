'use client'

/**
 * _components/client/FarmVideoLoader.tsx
 *
 * TINY CLIENT ISLAND — sole purpose: inject video src after LCP paints.
 *
 * WHY THIS EXISTS:
 * The hero video was previously autoPlay in the server HTML. The browser
 * fetches the video immediately on parse, blocking LCP and the main thread.
 *
 * Fix: The <video> element is rendered by FarmHero (server) with NO src.
 * This tiny client component runs after hydration, waits for idle callback,
 * then sets src and plays. The user sees the static poster image during LCP
 * (fast), and the video fades in after (~2s) without blocking anything.
 *
 * Renders nothing to the DOM — pure side-effect component.
 */

import { useEffect } from 'react'

export default function FarmVideoLoader() {
  useEffect(() => {
    const load = () => {
      const video = document.getElementById('farm-hero-video') as HTMLVideoElement | null
      if (!video) return
      video.src = '/videos/farm-hero.mp4'
      video.load()
      video.play().catch(() => {
        // Autoplay blocked — poster image remains. Fine.
      })
    }

    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load, { timeout: 3000 })
      return () => window.cancelIdleCallback(id)
    } else {
      const id = setTimeout(load, 2000)
      return () => clearTimeout(id)
    }
  }, [])

  return null
}