'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Masonry from 'react-masonry-css'
import Image from 'next/image'
import type { GalleryPhoto } from './Gallery.data'
import { ImageLightbox } from './ImageLightbox'

type Props = {
  photos: GalleryPhoto[]
  onPhotoClick?: (photo: GalleryPhoto, index: number) => void
  maxItems?: number
}

// Font size constants (matching design system)
const FS = {
  label: '10px',
  bodySm: '13px',
  body: '14px',
  cta: '11px',
  micro: '9px',
}

export function LatestMemoriesChapter({ photos, onPhotoClick, maxItems = 20 }: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Get newest photos sorted by date
  const latestPhotos = useMemo(() => {
    return photos
      .filter(p => p.featured !== false) // Include all, but prioritize featured
      .sort((a, b) => {
        const aDate = new Date(a.date ?? '2026-01-01').getTime()
        const bDate = new Date(b.date ?? '2026-01-01').getTime()
        return bDate - aDate
      })
      .slice(0, maxItems)
  }, [photos, maxItems])

  const handlePhotoClick = useCallback((photo: GalleryPhoto, index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    onPhotoClick?.(photo, index)
  }, [onPhotoClick])

  const handleLightboxClose = useCallback(() => {
    setLightboxOpen(false)
  }, [])

  const breakpointColumns = {
    default: 4,
    1400: 4,
    1024: 3,
    768: 2,
    480: 1,
  }

  return (
    <section
      id="latest-memories"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(80px, 10vw, 120px) 0',
        background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.02))',
      }}
    >
      {/* Chapter Header */}
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '0 clamp(24px, 5vw, 80px)',
        marginBottom: 'clamp(48px, 6vw, 72px)',
      }}>
        {/* Chapter Number + Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: FS.label,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(212, 168, 83, 0.4)',
          }}>
            02
          </span>
          <div style={{ width: 44, height: 1, background: 'rgba(212, 168, 83, 0.2)' }} />
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: FS.label,
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: 'rgba(212, 168, 83, 0.4)',
          }}>
            Latest Memories
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-100px' }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            fontWeight: 300,
            color: 'var(--cream, #F5F0E8)',
            lineHeight: 1.05,
            marginBottom: 16,
          }}
        >
          What's New at Ubuntu
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-100px' }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: FS.body,
            color: 'rgba(255, 255, 255, 0.45)',
            lineHeight: 1.85,
            maxWidth: 600,
            letterSpacing: '0.01em',
          }}
        >
          Fresh moments from our community. Community gatherings, workshops, guests, and the daily life of our creative village. Captured in real time.
        </motion.p>
      </div>

      {/* Masonry Grid */}
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '0 clamp(24px, 5vw, 80px)',
      }}>
        <Masonry
          breakpointCols={breakpointColumns}
          className="gallery-masonry"
          columnClassName="gallery-masonry-column"
          style={{
            display: 'flex',
            width: 'auto',
            marginLeft: 'calc(-1 * 14px)',
          }}
        >
          {latestPhotos.map((photo, idx) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: Math.min(idx * 0.05, 0.3),
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: '-40px' }}
              style={{
                paddingLeft: 14,
                marginBottom: 14,
              }}
            >
              <button
                onClick={() => handlePhotoClick(photo, idx)}
                aria-label={`View ${photo.title || 'Photo'}`}
                style={{
                  position: 'relative',
                  width: '100%',
                  height: 'auto',
                  overflow: 'hidden',
                  borderRadius: 12,
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  background: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  aspectRatio:
                    photo.aspect === 'portrait' ? '2/3'
                    : photo.aspect === 'landscape' ? '16/9'
                    : '1',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={e => {
                  const element = e.currentTarget
                  element.style.borderColor = 'rgba(200, 169, 110, 0.3)'
                  element.style.boxShadow = '0 16px 40px rgba(0, 0, 0, 0.4), 0 0 30px rgba(200, 169, 110, 0.1)'
                }}
                onMouseLeave={e => {
                  const element = e.currentTarget
                  element.style.borderColor = 'rgba(255, 255, 255, 0.06)'
                  element.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)'
                }}
              >
                {/* Image */}
                <Image
                  src={photo.image}
                  alt={photo.title || 'Community photo'}
                  fill
                  sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  quality={75}
                  loading="lazy"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={e => {
                    const img = e.currentTarget as HTMLImageElement
                    img.style.transform = 'scale(1.05)'
                  }}
                  onMouseLeave={e => {
                    const img = e.currentTarget as HTMLImageElement
                    img.style.transform = 'scale(1)'
                  }}
                />

                {/* Gradient Overlay */}
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.3) 70%, rgba(0, 0, 0, 0.7) 100%)',
                  pointerEvents: 'none',
                }} />

                {/* Featured Badge */}
                {photo.featured && (
                  <div style={{
                    position: 'absolute',
                    top: 10,
                    left: 10,
                    padding: '4px 10px',
                    borderRadius: 20,
                    background: 'rgba(200, 169, 110, 0.2)',
                    border: '1px solid rgba(200, 169, 110, 0.4)',
                    fontFamily: 'var(--font-body)',
                    fontSize: FS.micro,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: '#C8A96E',
                  }}>
                    🆕 New
                  </div>
                )}

                {/* Metadata Overlay (appears on hover/click) */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: 'clamp(8px, 2vw, 16px)',
                    pointerEvents: 'none',
                  }}
                >
                  {photo.title && (
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'clamp(12px, 1.5vw, 16px)',
                      fontWeight: 300,
                      color: 'var(--cream, #F5F0E8)',
                      marginBottom: 4,
                      lineHeight: 1.2,
                    }}>
                      {photo.title}
                    </h3>
                  )}

                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {photo.category && (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: 'rgba(0, 0, 0, 0.4)',
                        fontFamily: 'var(--font-body)',
                        fontSize: FS.micro,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        color: 'rgba(255, 255, 255, 0.7)',
                      }}>
                        {photo.category}
                      </span>
                    )}

                    {photo.date && (
                      <span style={{
                        padding: '2px 8px',
                        borderRadius: 12,
                        background: 'rgba(0, 0, 0, 0.4)',
                        fontFamily: 'var(--font-body)',
                        fontSize: FS.micro,
                        letterSpacing: '0.1em',
                        color: 'rgba(255, 255, 255, 0.5)',
                      }}>
                        {photo.date}
                      </span>
                    )}
                  </div>
                </motion.div>

                {/* Click Icon Hint */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 5,
                  }}
                >
                  <div style={{
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    background: 'rgba(200, 169, 110, 0.2)',
                    border: '2px solid rgba(200, 169, 110, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    color: '#C8A96E',
                  }}>
                    🔍
                  </div>
                </motion.div>
              </button>
            </motion.div>
          ))}
        </Masonry>
      </div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-100px' }}
        style={{
          textAlign: 'center',
          marginTop: 'clamp(60px, 8vw, 100px)',
          padding: '0 clamp(24px, 5vw, 80px)',
        }}
      >
        <Link
          href="#explore-life"
          style={{
            display: 'inline-block',
            padding: 'clamp(12px, 2vw, 16px) clamp(28px, 4vw, 44px)',
            borderRadius: 10,
            background: 'rgba(200, 169, 110, 0.12)',
            border: '1px solid rgba(200, 169, 110, 0.3)',
            color: '#C8A96E',
            fontFamily: 'var(--font-body)',
            fontSize: FS.cta,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            fontWeight: 700,
            textDecoration: 'none',
            transition: 'all 0.3s',
            cursor: 'pointer',
          }}
          onMouseEnter={e => {
            const element = e.currentTarget as HTMLAnchorElement
            element.style.background = 'rgba(200, 169, 110, 0.2)'
            element.style.borderColor = 'rgba(200, 169, 110, 0.5)'
          }}
          onMouseLeave={e => {
            const element = e.currentTarget as HTMLAnchorElement
            element.style.background = 'rgba(200, 169, 110, 0.12)'
            element.style.borderColor = 'rgba(200, 169, 110, 0.3)'
          }}
        >
          View All Memories →
        </Link>
      </motion.div>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        photos={latestPhotos}
        initialIndex={lightboxIndex}
        onClose={handleLightboxClose}
      />

      {/* CSS for Masonry */}
      <style>{`
        .gallery-masonry {
          display: flex;
          width: auto;
          margin-left: calc(-1 * 14px);
        }
        .gallery-masonry-column {
          padding-left: 14px;
          background-clip: padding-box;
        }
      `}</style>
    </section>
  )
}
