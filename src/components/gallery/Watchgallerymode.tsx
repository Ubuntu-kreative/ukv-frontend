'use client'

import { useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { AnimatePresence, motion } from 'framer-motion'
import type { GalleryPhoto } from './Gallery.data'

interface WatchGalleryModeProps {
  photos: GalleryPhoto[]
  open: boolean
  onClose: () => void
}

const SLIDE_DURATION = 6000

/**
 * Fullscreen cinematic presentation mode. Each photo gets a slow Ken Burns
 * pan/zoom; slides cross-fade. Pure CSS/Framer Motion transforms only —
 * no canvas/video — keeping this lightweight.
 */
export function WatchGalleryMode({ photos, open, onClose }: WatchGalleryModeProps) {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  const advance = useCallback(() => {
    setIndex((i) => (i + 1) % photos.length)
  }, [photos.length])

  useEffect(() => {
    if (!open) {
      setIndex(0)
      setPaused(false)
    }
  }, [open])

  useEffect(() => {
    if (!open || paused || photos.length === 0) return
    const timer = setTimeout(advance, SLIDE_DURATION)
    return () => clearTimeout(timer)
  }, [open, paused, index, advance, photos.length])

  useEffect(() => {
    if (!open) return
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setIndex((i) => (i + 1) % photos.length)
      if (e.key === 'ArrowLeft') setIndex((i) => (i - 1 + photos.length) % photos.length)
      if (e.key === ' ') {
        e.preventDefault()
        setPaused((p) => !p)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, onClose, photos.length])

  // Lock body scroll while in watch mode
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [open])

  if (photos.length === 0) return null
  const current = photos[index]

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-label="Cinematic gallery presentation"
          className="fixed inset-0 z-[100] overflow-hidden bg-stone-950"
        >
          <AnimatePresence mode="sync">
            <motion.div
              key={current.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeInOut' }}
              className="absolute inset-0"
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{ scale: 1.12 }}
                transition={{ duration: SLIDE_DURATION / 1000 + 1, ease: 'linear' }}
                className="absolute inset-0"
              >
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  sizes="100vw"
                  priority={index === 0}
                  className="object-cover"
                />
              </motion.div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/10 to-stone-950/40" />
            </motion.div>
          </AnimatePresence>

          {/* Caption */}
          <div className="absolute inset-x-0 bottom-0 z-10 px-6 pb-12 sm:px-12 sm:pb-16">
            <motion.div
              key={`${current.id}-caption`}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="max-w-2xl"
            >
              <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-300">
                {current.category} · {current.location}
              </span>
              <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">{current.title}</h2>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-stone-300 sm:text-base">
                {current.description}
              </p>
            </motion.div>
          </div>

          {/* Top bar: close + pause */}
          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-8 sm:top-8">
            <button
              type="button"
              onClick={() => setPaused((p) => !p)}
              aria-label={paused ? 'Resume slideshow' : 'Pause slideshow'}
              className="rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              {paused ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M6 5h4v14H6zM14 5h4v14h-4z" /></svg>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Exit cinematic gallery (Esc)"
              className="rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          {/* Progress dots */}
          <div className="absolute left-1/2 top-6 z-20 flex -translate-x-1/2 gap-1.5 sm:top-8">
            {photos.map((p, i) => (
              <span
                key={p.id}
                className={`h-1 rounded-full transition-all duration-300 ${
                  i === index ? 'w-8 bg-amber-400' : 'w-3 bg-white/30'
                }`}
              />
            ))}
          </div>

          <p className="absolute bottom-4 left-1/2 z-10 -translate-x-1/2 text-[11px] uppercase tracking-[0.2em] text-stone-500 sm:left-auto sm:right-8 sm:translate-x-0">
            Press Esc to exit
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface WatchGalleryButtonProps {
  onClick: () => void
}

export function WatchGalleryButton({ onClick }: WatchGalleryButtonProps) {
  return (
    <motion.button
      id="watch-gallery"
      type="button"
      onClick={onClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.97 }}
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2.5 rounded-full bg-stone-900 px-5 py-3.5 text-sm font-semibold text-white shadow-xl shadow-stone-900/30 ring-1 ring-white/10 transition-colors hover:bg-stone-800 sm:bottom-8 sm:right-8"
    >
      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-400 text-stone-900">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
      </span>
      Watch Gallery
    </motion.button>
  )
}