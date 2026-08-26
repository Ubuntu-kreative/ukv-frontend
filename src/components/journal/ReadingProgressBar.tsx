/**
 * src/components/journal/ReadingProgressBar.tsx
 *
 * Reading progress indicator bar
 * Shows scroll progress on article pages
 */

'use client'

import React, { useEffect, useState } from 'react'

export default function ReadingProgressBar() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrolled = document.documentElement.scrollTop
      const scrollPercent = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0
      setProgress(scrollPercent)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-emerald-600 origin-left transition-transform duration-300 ease-out" style={{ transform: `scaleX(${progress / 100})` }} aria-hidden="true" />
  )
}
