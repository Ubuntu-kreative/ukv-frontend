'use client'

import { useEffect, useState } from 'react'
import { motion, useScroll, useSpring } from 'framer-motion'

/**
 * Fixed top progress bar reflecting how far the user has scrolled
 * through the gallery page. Uses Framer Motion's scroll progress
 * hook + a spring for smoothing — no manual scroll-event listeners.
 */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    restDelta: 0.001,
  })

  // Avoid SSR/CSR mismatch for the aria-valuenow text fallback
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] bg-stone-900/5"
      role="progressbar"
      aria-label="Gallery scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full origin-left bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600"
        style={{ scaleX }}
      />
      {!mounted && null}
    </div>
  )
}