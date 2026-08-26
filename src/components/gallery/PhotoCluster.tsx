'use client'

import React, { useState, useMemo, useCallback } from 'react'
import { motion } from 'framer-motion'
import Masonry from 'react-masonry-css'
import Image from 'next/image'
import type { GalleryPhoto } from './Gallery.data'
import { ImageLightbox } from './ImageLightbox'

type Props = {
  photos: GalleryPhoto[]
  title?: string
  description?: string
  onPhotoClick?: (photo: GalleryPhoto, index: number) => void
  maxItems?: number
  columnCount?: number
  spacing?: number
}

export function PhotoCluster({
  photos,
  title,
  description,
  onPhotoClick,
  maxItems = 8,
  columnCount = 4,
  spacing = 14,
}: Props) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const clusterPhotos = useMemo(() => photos.slice(0, maxItems), [photos, maxItems])

  const handlePhotoClick = useCallback((photo: GalleryPhoto, index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
    onPhotoClick?.(photo, index)
  }, [onPhotoClick])

  const breakpointColumns = {
    default: Math.min(columnCount, 4),
    1400: Math.min(columnCount, 4),
    1024: Math.min(columnCount - 1, 3),
    768: Math.min(columnCount - 2, 2),
    480: 1,
  }

  return (
    <>
      {/* Header */}
      {(title || description) && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
          style={{ marginBottom: 'clamp(24px, 3vw, 36px)' }}
        >
          {title && (
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
              fontWeight: 300,
              color: 'var(--cream, #F5F0E8)',
              marginBottom: title && description ? 8 : 0,
              lineHeight: 1.2,
            }}>
              {title}
            </h3>
          )}
          {description && (
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              color: 'rgba(255, 255, 255, 0.4)',
              lineHeight: 1.6,
              maxWidth: 500,
            }}>
              {description}
            </p>
          )}
        </motion.div>
      )}

      {/* Masonry Grid */}
      <Masonry
        breakpointCols={breakpointColumns}
        className="photo-cluster-masonry"
        columnClassName="photo-cluster-column"
        style={{
          display: 'flex',
          width: 'auto',
          marginLeft: `calc(-1 * ${spacing}px)`,
        }}
      >
        {clusterPhotos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: Math.min(idx * 0.06, 0.25),
              ease: [0.16, 1, 0.3, 1],
            }}
            viewport={{ once: true, margin: '-40px' }}
            style={{
              paddingLeft: spacing,
              marginBottom: spacing,
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
                borderRadius: 'clamp(8px, 1.5vw, 12px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                background: 'none',
                cursor: 'pointer',
                padding: 0,
                aspectRatio:
                  photo.aspect === 'portrait' ? '2/3'
                  : photo.aspect === 'landscape' ? '16/9'
                  : '1',
                transition: 'all 0.35s ease',
              }}
              onMouseEnter={e => {
                const element = e.currentTarget
                element.style.borderColor = 'rgba(200, 169, 110, 0.25)'
                element.style.boxShadow = '0 12px 32px rgba(0, 0, 0, 0.35), 0 0 24px rgba(200, 169, 110, 0.08)'
              }}
              onMouseLeave={e => {
                const element = e.currentTarget
                element.style.borderColor = 'rgba(255, 255, 255, 0.05)'
                element.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.15)'
              }}
            >
              {/* Image */}
              <Image
                src={photo.image}
                alt={photo.title || 'Photo'}
                fill
                sizes={`(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) ${100 / Math.min(columnCount - 1, 3)}vw, ${100 / columnCount}vw`}
                quality={75}
                loading="lazy"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.4s ease',
                }}
                onMouseEnter={e => {
                  const img = e.currentTarget as HTMLImageElement
                  img.style.transform = 'scale(1.04)'
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
                background: 'linear-gradient(135deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.2) 100%)',
                pointerEvents: 'none',
              }} />

              {/* Hover Magnifier */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileHover={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                style={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: 40,
                  height: 40,
                  borderRadius: '50%',
                  background: 'rgba(200, 169, 110, 0.15)',
                  border: '1.5px solid rgba(200, 169, 110, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '16px',
                  zIndex: 2,
                  pointerEvents: 'none',
                }}
              >
                🔍
              </motion.div>
            </button>
          </motion.div>
        ))}
      </Masonry>

      {/* Lightbox */}
      <ImageLightbox
        isOpen={lightboxOpen}
        photos={clusterPhotos}
        initialIndex={lightboxIndex}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Masonry CSS */}
      <style>{`
        .photo-cluster-masonry {
          display: flex;
          width: auto;
          margin-left: calc(-1 * ${spacing}px);
        }
        .photo-cluster-column {
          padding-left: ${spacing}px;
          background-clip: padding-box;
        }
      `}</style>
    </>
  )
}
