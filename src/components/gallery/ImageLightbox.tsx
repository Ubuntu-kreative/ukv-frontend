'use client'

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { GalleryPhoto } from './Gallery.data'

type Props = {
  isOpen: boolean
  photos: GalleryPhoto[]
  initialIndex?: number
  onClose: () => void
  onNavigate?: (index: number) => void
  autoplay?: boolean
}

export function ImageLightbox({
  isOpen,
  photos,
  initialIndex = 0,
  onClose,
  onNavigate,
  autoplay = false,
}: Props) {
  const [mounted, setMounted] = useState(false)
  const [index, setIndex] = useState(initialIndex)
  const [isAutoplay, setIsAutoplay] = useState(autoplay)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartX = useRef(0)
  const touchStartY = useRef(0)

  const currentPhoto = useMemo(() => photos[index] ?? photos[0], [photos, index])

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update state when initialIndex changes
  useEffect(() => {
    setIndex(currentIndex => currentIndex === initialIndex ? currentIndex : initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (!isOpen) return
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Notify parent of navigation
  useEffect(() => {
    if (!isOpen) return
    onNavigate?.(index)
  }, [isOpen, index, onNavigate])

  // Autoplay effect
  useEffect(() => {
    if (!isOpen || !isAutoplay) {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
      return
    }

    autoplayRef.current = setInterval(() => {
      setIndex(prev => (prev + 1) % photos.length)
    }, 3500)

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [isOpen, isAutoplay, photos.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'n') {
        setIndex(prev => (prev + 1) % photos.length)
      } else if (e.key === 'ArrowLeft' || e.key === 'p') {
        setIndex(prev => (prev - 1 + photos.length) % photos.length)
      } else if (e.key === 'Escape') {
        onClose()
      } else if (e.key === ' ') {
        e.preventDefault()
        setIsAutoplay(!isAutoplay)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, photos.length, isAutoplay, onClose])

  // Touch swipe support
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0]?.clientX ?? 0
    touchStartY.current = e.touches[0]?.clientY ?? 0
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    const endX = e.changedTouches[0]?.clientX ?? 0
    const endY = e.changedTouches[0]?.clientY ?? 0
    const diffX = touchStartX.current - endX
    const diffY = touchStartY.current - endY

    // Only consider horizontal swipes (threshold: 50px, slope < 1)
    if (Math.abs(diffX) > 50 && Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > 0) {
        // Swiped left → next
        setIndex(prev => (prev + 1) % photos.length)
      } else {
        // Swiped right → prev
        setIndex(prev => (prev - 1 + photos.length) % photos.length)
      }
    }
  }

  const goToPrevious = useCallback(() => {
    setIndex(prev => (prev - 1 + photos.length) % photos.length)
  }, [photos.length])

  const goToNext = useCallback(() => {
    setIndex(prev => (prev + 1) % photos.length)
  }, [photos.length])

  if (!mounted || !isOpen || !currentPhoto) return null

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9500,
          background: 'rgba(0, 0, 0, 0.95)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 'clamp(12px, 3vw, 24px)',
        }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Header — Counter + Close */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            position: 'absolute',
            top: 'clamp(12px, 2vw, 24px)',
            left: 'clamp(12px, 2vw, 24px)',
            right: 'clamp(12px, 2vw, 24px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            zIndex: 10,
          }}
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.5)',
          }}>
            {index + 1} / {photos.length}
          </span>
          <button
            onClick={onClose}
            aria-label="Close lightbox"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: 'rgba(255, 255, 255, 0.7)',
              width: 40,
              height: 40,
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.15)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'
            }}
          >
            ✕
          </button>
        </motion.div>

        {/* Main Image Container */}
        <motion.div
          key={`lightbox-image-${currentPhoto.id}`}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.3 }}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'relative',
            width: '100%',
            maxWidth: 'min(90vw, 1200px)',
            aspectRatio: currentPhoto.aspect === 'portrait' ? '3/4'
              : currentPhoto.aspect === 'landscape' ? '16/9'
              : '1',
            overflow: 'hidden',
            borderRadius: 12,
            background: 'rgba(0, 0, 0, 0.5)',
          }}
        >
          <Image
            src={currentPhoto.image}
            alt={currentPhoto.title}
            fill
            sizes="(max-width: 1200px) 90vw, 1200px"
            priority
            quality={85}
            style={{ objectFit: 'cover' }}
          />

          {/* Navigation Arrows */}
          <button
            onClick={e => {
              e.stopPropagation()
              goToPrevious()
            }}
            aria-label="Previous image"
            style={{
              position: 'absolute',
              left: 'clamp(12px, 2vw, 24px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
            }}
          >
            ‹
          </button>

          <button
            onClick={e => {
              e.stopPropagation()
              goToNext()
            }}
            aria-label="Next image"
            style={{
              position: 'absolute',
              right: 'clamp(12px, 2vw, 24px)',
              top: '50%',
              transform: 'translateY(-50%)',
              zIndex: 10,
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: 'rgba(255, 255, 255, 0.8)',
              cursor: 'pointer',
              fontSize: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.6)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 1)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(0, 0, 0, 0.4)'
              e.currentTarget.style.color = 'rgba(255, 255, 255, 0.8)'
            }}
          >
            ›
          </button>
        </motion.div>

        {/* Metadata Footer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute',
            bottom: 'clamp(12px, 2vw, 24px)',
            left: 'clamp(12px, 2vw, 24px)',
            right: 'clamp(12px, 2vw, 24px)',
            maxWidth: 'min(90vw - 48px, 1200px)',
            padding: 'clamp(12px, 2vw, 20px)',
            borderRadius: 12,
            background: 'rgba(0, 0, 0, 0.6)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(12px)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'start' }}>
            {/* Left: Photo details */}
            <div>
              {currentPhoto.title && (
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(14px, 2vw, 18px)',
                  fontWeight: 300,
                  color: 'rgba(255, 255, 255, 0.95)',
                  marginBottom: 8,
                  lineHeight: 1.3,
                }}>
                  {currentPhoto.title}
                </h3>
              )}

              <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
              }}>
                {currentPhoto.category && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    background: 'rgba(200, 169, 110, 0.15)',
                    border: '1px solid rgba(200, 169, 110, 0.3)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: '#C8A96E',
                  }}>
                    {currentPhoto.category}
                  </span>
                )}

                {currentPhoto.date && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}>
                    {currentPhoto.date}
                  </span>
                )}

                {currentPhoto.location && (
                  <span style={{
                    padding: '4px 12px',
                    borderRadius: 16,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '11px',
                    letterSpacing: '0.12em',
                    color: 'rgba(255, 255, 255, 0.5)',
                  }}>
                    📍 {currentPhoto.location}
                  </span>
                )}
              </div>

              {currentPhoto.description && (
                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  lineHeight: 1.6,
                  marginTop: 12,
                }}>
                  {currentPhoto.description}
                </p>
              )}
            </div>

            {/* Right: Controls */}
            <div style={{
              display: 'flex',
              gap: 8,
              whiteSpace: 'nowrap',
            }}>
              <button
                onClick={() => setIsAutoplay(!isAutoplay)}
                aria-label={isAutoplay ? 'Pause autoplay' : 'Start autoplay'}
                title={`${isAutoplay ? 'Pause' : 'Play'} (SPACE)`}
                style={{
                  padding: '6px 12px',
                  borderRadius: 8,
                  background: isAutoplay ? 'rgba(200, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.08)',
                  border: `1px solid ${isAutoplay ? 'rgba(200, 169, 110, 0.4)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: isAutoplay ? '#C8A96E' : 'rgba(255, 255, 255, 0.6)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(200, 169, 110, 0.25)'
                  e.currentTarget.style.color = '#C8A96E'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = isAutoplay ? 'rgba(200, 169, 110, 0.2)' : 'rgba(255, 255, 255, 0.08)'
                  e.currentTarget.style.color = isAutoplay ? '#C8A96E' : 'rgba(255, 255, 255, 0.6)'
                }}
              >
                {isAutoplay ? '⏸' : '▶'}
              </button>
            </div>
          </div>

          {/* Keyboard Hints */}
          <div style={{
            marginTop: 12,
            paddingTop: 12,
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            fontSize: '10px',
            color: 'rgba(255, 255, 255, 0.4)',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
          }}>
            ← → or P/N to navigate • ESC to close • SPACE to autoplay • Swipe on mobile
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body,
  )
}
