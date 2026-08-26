'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { PHOTOS, type GalleryPhoto } from './Gallery.data'
import { ImageLightbox } from './ImageLightbox'

const AUTOPLAY_DELAY = 5500
const RESUME_DELAY = 4500

export function GalleryHighlights({ photos = PHOTOS }: { photos?: GalleryPhoto[] }) {
  const reduceMotion = useReducedMotion()
  const highlights = useMemo(() => (photos && photos.length > 0 ? photos : PHOTOS), [photos])
  const [activeIndex, setActiveIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [isAutoplayPaused, setIsAutoplayPaused] = useState(false)
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const activePhoto = highlights[activeIndex]
  const nextIndex = highlights.length > 0 ? (activeIndex + 1) % highlights.length : 0
  const nextPhoto = highlights[nextIndex]
  const closeLightbox = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const goTo = useCallback((index: number) => {
    setActiveIndex((index + highlights.length) % highlights.length)
  }, [highlights.length])

  const pauseAndResume = useCallback((index: number) => {
    goTo(index)
    setIsAutoplayPaused(true)
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
    resumeTimeoutRef.current = setTimeout(() => {
      setIsAutoplayPaused(false)
      resumeTimeoutRef.current = null
    }, RESUME_DELAY)
  }, [goTo])

  useEffect(() => () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current)
  }, [])

  useEffect(() => {
    if (reduceMotion || isAutoplayPaused || highlights.length < 2) return
    const interval = setInterval(() => {
      setActiveIndex(index => (index + 1) % highlights.length)
    }, AUTOPLAY_DELAY)
    return () => clearInterval(interval)
  }, [highlights.length, isAutoplayPaused, reduceMotion])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault()
        pauseAndResume(activeIndex + 1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        pauseAndResume(activeIndex - 1)
      }
    }

    const section = document.getElementById('gallery-highlights')
    section?.addEventListener('keydown', handleKeyDown)
    return () => section?.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, pauseAndResume])

  if (!activePhoto || highlights.length === 0) return null

  return (
    <section
      id="gallery-highlights"
      tabIndex={0}
      aria-label="Gallery highlights"
      className="relative outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d4a853]"
    >
      <div className="relative h-[70vh] min-h-[520px] max-h-[900px] overflow-hidden bg-[#0a0c09]">
        <AnimatePresence initial={false} mode="sync">
          <motion.div
            key={activePhoto.id}
            className="absolute inset-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.1, ease: 'easeInOut' }}
          >
            <motion.div
              className="absolute inset-0"
              initial={{ scale: reduceMotion ? 1 : 1.01, x: 0, y: 0 }}
              animate={{ scale: reduceMotion ? 1 : 1.08, x: reduceMotion ? 0 : '-1%', y: reduceMotion ? 0 : '-1%' }}
              transition={{ duration: AUTOPLAY_DELAY / 1000, ease: 'linear' }}
            >
              <Image
                src={activePhoto.image}
                alt={activePhoto.title}
                fill
                priority
                sizes="100vw"
                quality={85}
                style={{ objectFit: 'cover' }}
              />
            </motion.div>
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,9,10,0.78)_0%,rgba(6,9,10,0.28)_55%,rgba(6,9,10,0.42)_100%),linear-gradient(0deg,rgba(6,9,10,0.86)_0%,transparent_48%)]" />
          </motion.div>
        </AnimatePresence>

        {nextPhoto && nextPhoto.id !== activePhoto.id && (
          <Image
            src={nextPhoto.image}
            alt=""
            fill
            priority
            sizes="100vw"
            quality={70}
            aria-hidden="true"
            className="pointer-events-none opacity-0"
          />
        )}

        <div className="absolute inset-x-0 bottom-0 z-10 mx-auto flex max-w-7xl flex-col gap-6 px-6 pb-28 pt-16 sm:px-10 lg:px-16">
          <div aria-live="polite" aria-atomic="true">
            <p className="mb-3 font-body text-[10px] uppercase tracking-[0.32em] text-[#d4a853]">
              {activePhoto.category} / Highlights / {activeIndex + 1} of {highlights.length}
            </p>
            <h2 className="max-w-3xl font-display text-5xl font-light leading-[0.95] text-[#ede6d3] sm:text-7xl lg:text-8xl">
              {activePhoto.title}
            </h2>
            <p className="mt-5 max-w-xl font-body text-sm leading-7 tracking-[0.04em] text-white/65 sm:text-base">
              {activePhoto.description}
            </p>
          </div>
        </div>

        <button
          type="button"
          aria-label="Previous highlight"
          onClick={() => pauseAndResume(activeIndex - 1)}
          className="absolute left-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-2xl text-white/80 backdrop-blur-md transition hover:border-[#d4a853]/60 hover:text-[#d4a853] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] sm:left-8"
        >
          <span aria-hidden="true">&#8249;</span>
        </button>
        <button
          type="button"
          aria-label="Next highlight"
          onClick={() => pauseAndResume(activeIndex + 1)}
          className="absolute right-4 top-1/2 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/35 text-2xl text-white/80 backdrop-blur-md transition hover:border-[#d4a853]/60 hover:text-[#d4a853] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853] sm:right-8"
        >
          <span aria-hidden="true">&#8250;</span>
        </button>

        <button
          type="button"
          aria-label={`Open ${activePhoto.title} in fullscreen viewer`}
          onClick={() => setLightboxOpen(true)}
          className="absolute inset-0 z-[5] cursor-zoom-in focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#d4a853]"
        />
      </div>

      <div className="relative z-10 -mt-20 mx-auto flex max-w-7xl snap-x snap-mandatory gap-2 overflow-x-auto px-6 pb-6 scroll-smooth sm:px-10 lg:px-16">
        {highlights.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            aria-label={`Show highlight ${index + 1}: ${photo.title}`}
            aria-current={index === activeIndex ? 'true' : undefined}
            onClick={() => pauseAndResume(index)}
            className={`relative h-16 w-24 shrink-0 snap-start overflow-hidden rounded-sm border bg-[#0a0c09] transition sm:h-20 sm:w-32 ${index === activeIndex ? 'border-[#d4a853] shadow-[0_0_20px_rgba(212,168,83,0.3)]' : 'border-white/20 opacity-70 hover:border-[#d4a853]/60 hover:opacity-100'} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#d4a853]`}
          >
            <Image
              src={photo.image}
              alt=""
              fill
              sizes="128px"
              quality={60}
              loading="lazy"
              className="object-cover"
            />
          </button>
        ))}
      </div>

      <ImageLightbox
        isOpen={lightboxOpen}
        photos={highlights}
        initialIndex={activeIndex}
        onClose={closeLightbox}
        onNavigate={setActiveIndex}
      />
    </section>
  )
}
