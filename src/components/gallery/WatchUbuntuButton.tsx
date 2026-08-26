'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import type { GalleryPhoto } from './Gallery.data'

type Props = {
  photos: GalleryPhoto[]
  autoplaySpeed?: number
}

export function WatchUbuntuButton({ photos, autoplaySpeed = 4000 }: Props) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const autoplayRef = useRef<NodeJS.Timeout | null>(null)

  // Autoplay effect
  useEffect(() => {
    if (!isOpen) {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
      return
    }

    autoplayRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % photos.length)
    }, autoplaySpeed)

    return () => {
      if (autoplayRef.current) clearInterval(autoplayRef.current)
    }
  }, [isOpen, photos.length, autoplaySpeed])

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
      else if (e.key === 'ArrowRight') setCurrentIndex(prev => (prev + 1) % photos.length)
      else if (e.key === 'ArrowLeft') setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length)
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, photos.length])

  const currentPhoto = photos[currentIndex]

  return (
    <>
      {/* Floating Button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.6 }}
        onClick={() => setIsOpen(true)}
        aria-label="Watch Ubuntu cinematic mode"
        style={{
          position: 'fixed',
          bottom: 'clamp(24px, 4vw, 48px)',
          right: 'clamp(24px, 4vw, 48px)',
          zIndex: 8200,
          padding: 'clamp(12px, 1.5vw, 18px) clamp(20px, 2vw, 28px)',
          borderRadius: 12,
          border: '1px solid rgba(200, 169, 110, 0.3)',
          background: 'rgba(10, 12, 9, 0.88)',
          backdropFilter: 'blur(12px)',
          color: '#C8A96E',
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(10px, 1.5vw, 12px)',
          letterSpacing: '0.15em',
          textTransform: 'uppercase',
          fontWeight: 600,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          whiteSpace: 'nowrap',
          transition: 'all 0.3s ease',
        }}
        onMouseEnter={e => {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.background = 'rgba(10, 12, 9, 0.95)'
          btn.style.borderColor = 'rgba(200, 169, 110, 0.5)'
          btn.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.4), 0 0 24px rgba(200, 169, 110, 0.15)'
        }}
        onMouseLeave={e => {
          const btn = e.currentTarget as HTMLButtonElement
          btn.style.background = 'rgba(10, 12, 9, 0.88)'
          btn.style.borderColor = 'rgba(200, 169, 110, 0.3)'
          btn.style.boxShadow = 'none'
        }}
      >
        <span>▶</span>
        <span>Watch Ubuntu</span>
      </motion.button>

      {/* Cinematic Fullscreen Mode */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 9400,
              background: '#000',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'clamp(12px, 2vw, 24px)',
              overflow: 'hidden',
            }}
          >
            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              onClick={() => setIsOpen(false)}
              aria-label="Close"
              style={{
                position: 'absolute',
                top: 'clamp(12px, 2vw, 24px)',
                right: 'clamp(12px, 2vw, 24px)',
                zIndex: 10,
                width: 44,
                height: 44,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: '20px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s',
              }}
              onMouseEnter={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = 'rgba(255, 255, 255, 0.15)'
                btn.style.color = 'rgba(255, 255, 255, 1)'
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget as HTMLButtonElement
                btn.style.background = 'rgba(255, 255, 255, 0.1)'
                btn.style.color = 'rgba(255, 255, 255, 0.7)'
              }}
            >
              ✕
            </motion.button>

            {/* Main Image */}
            <motion.div
              key={`watch-${currentPhoto.id}`}
              initial={{ opacity: 0, scale: 1.02 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.8 }}
              onClick={e => e.stopPropagation()}
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                maxWidth: 'calc(100% - 48px)',
                maxHeight: 'calc(100% - 48px)',
                borderRadius: 8,
                overflow: 'hidden',
              }}
            >
              <Image
                src={currentPhoto.image}
                alt={currentPhoto.title}
                fill
                priority
                quality={90}
                sizes="100vw"
                style={{ objectFit: 'contain' }}
              />
            </motion.div>

            {/* Navigation & Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: 'clamp(20px, 3vw, 36px)',
                background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)',
                zIndex: 10,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: 24,
              }}
              onClick={e => e.stopPropagation()}
            >
              {/* Left: Photo Info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                {currentPhoto.title && (
                  <h3 style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 'clamp(16px, 2vw, 24px)',
                    fontWeight: 300,
                    color: 'rgba(255, 255, 255, 0.95)',
                    marginBottom: 10,
                    lineHeight: 1.2,
                  }}>
                    {currentPhoto.title}
                  </h3>
                )}

                <div style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                }}>
                  {currentPhoto.category && (
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: 16,
                      background: 'rgba(200, 169, 110, 0.15)',
                      border: '1px solid rgba(200, 169, 110, 0.3)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
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
                      background: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      fontFamily: 'var(--font-body)',
                      fontSize: '10px',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      color: 'rgba(255, 255, 255, 0.5)',
                    }}>
                      {currentPhoto.date}
                    </span>
                  )}
                </div>
              </div>

              {/* Right: Counter & Navigation */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                whiteSpace: 'nowrap',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '11px',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  color: 'rgba(255, 255, 255, 0.4)',
                }}>
                  {currentIndex + 1} / {photos.length}
                </span>

                <div style={{ width: 1, height: 24, background: 'rgba(255, 255, 255, 0.2)' }} />

                <button
                  onClick={e => {
                    e.stopPropagation()
                    setCurrentIndex(prev => (prev - 1 + photos.length) % photos.length)
                  }}
                  aria-label="Previous"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.background = 'rgba(255, 255, 255, 0.15)'
                    btn.style.color = 'rgba(255, 255, 255, 0.9)'
                  }}
                  onMouseLeave={e => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.background = 'rgba(255, 255, 255, 0.08)'
                    btn.style.color = 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  ‹
                </button>

                <button
                  onClick={e => {
                    e.stopPropagation()
                    setCurrentIndex(prev => (prev + 1) % photos.length)
                  }}
                  aria-label="Next"
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'rgba(255, 255, 255, 0.6)',
                    cursor: 'pointer',
                    fontSize: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.background = 'rgba(255, 255, 255, 0.15)'
                    btn.style.color = 'rgba(255, 255, 255, 0.9)'
                  }}
                  onMouseLeave={e => {
                    const btn = e.currentTarget as HTMLButtonElement
                    btn.style.background = 'rgba(255, 255, 255, 0.08)'
                    btn.style.color = 'rgba(255, 255, 255, 0.6)'
                  }}
                >
                  ›
                </button>
              </div>
            </motion.div>

            {/* Keyboard Hints */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                position: 'absolute',
                top: 'clamp(60px, 8vw, 100px)',
                left: 'clamp(20px, 3vw, 32px)',
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255, 255, 255, 0.3)',
              }}
            >
              ← → or ESC to close • Click image to navigate
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
