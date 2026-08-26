'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useEffect, useState } from 'react'

const SCROLL_THRESHOLD = 400

export default function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updateVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD)
    }

    updateVisibility()
    window.addEventListener('scroll', updateVisibility, { passive: true })

    return () => window.removeEventListener('scroll', updateVisibility)
  }, [])

  const scrollToTop = () => {
    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches

    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.8, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 12 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed bottom-[calc(104px+env(safe-area-inset-bottom))] right-4 z-[100] flex size-12 items-center justify-center rounded-full border border-[rgba(212,168,83,0.4)] bg-[rgba(10,12,9,0.85)] text-[#d4a853] shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md transition-colors hover:border-[rgba(212,168,83,0.7)] hover:bg-[rgba(10,12,9,0.95)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0d0c09] sm:right-6"
        >
          <ArrowUp aria-hidden="true" size={18} strokeWidth={1.75} />
        </motion.button>
      )}
    </AnimatePresence>
  )
}
