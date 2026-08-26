'use client'

import { useMemo, useCallback, useState } from 'react'
import { motion, cubicBezier } from 'framer-motion'
import Masonry from 'react-masonry-css'
import type { GalleryPhoto, GalleryCategory, GalleryConfig } from './Gallery.data'
import { GALLERY_CONFIG } from './Gallery.data'
import { PhotoCard } from './PhotoCard'

interface MasonryPhotosGalleryProps {
  photos: GalleryPhoto[]
  activeCategory?: GalleryCategory
  config?: GalleryConfig
  displayCount?: number
  onPhotoClick?: (photo: GalleryPhoto) => void
}

/**
 * Premium masonry photo gallery with responsive columns
 * - Pinterest-style layout
 * - Lazy loading support
 * - Hover animations
 * - Responsive 4/3/2/1 columns
 */
export function MasonryPhotosGallery({
  photos,
  activeCategory = 'All',
  config = GALLERY_CONFIG,
  displayCount,
  onPhotoClick,
}: MasonryPhotosGalleryProps) {
  const [columnCount, setColumnCount] = useState(4)

  // Filter photos by category
  const filteredPhotos = useMemo(() => {
    if (activeCategory === 'All') return photos
    return photos.filter(p => p.category === activeCategory)
  }, [photos, activeCategory])

  // Apply display limit for infinite scroll
  const displayedPhotos = useMemo(() => {
    return displayCount ? filteredPhotos.slice(0, displayCount) : filteredPhotos
  }, [filteredPhotos, displayCount])

  // Handle responsive columns
  const breakpoints = useMemo(() => ({
    default: config.masonryColumns.desktop,
    1400: config.masonryColumns.desktop,
    1024: config.masonryColumns.tablet,
    768: config.masonryColumns.mobile,
    480: config.masonryColumns.small,
  }), [config.masonryColumns])

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: config.animationDuration,
        ease: cubicBezier(0.16, 1, 0.3, 1),
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      style={{ width: '100%' }}
    >
      <Masonry
        breakpointCols={breakpoints}
        className="masonry-grid"
        columnClassName="masonry-grid-column"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
          gridAutoRows: 'auto',
          gap: '20px',
        }}
      >
        {displayedPhotos.map((photo, idx) => (
          <motion.div
            key={photo.id}
            variants={itemVariants}
          >
            <PhotoCard
              photo={photo}
              onClick={onPhotoClick}
              index={idx}
            />
          </motion.div>
        ))}
      </Masonry>

      {displayedPhotos.length === 0 && (
        <div style={{
          gridColumn: '1 / -1',
          textAlign: 'center',
          padding: '60px 20px',
          color: 'rgba(255,255,255,0.4)',
        }}>
          <p style={{ fontSize: '1.1rem', marginBottom: 8 }}>
            No photos found in this category.
          </p>
          <p style={{ fontSize: '0.95rem' }}>
            Try selecting a different category or browse all photos.
          </p>
        </div>
      )}

      <style jsx>{`
        .masonry-grid {
          display: grid;
          gap: 20px;
        }

        @media (min-width: 1400px) {
          .masonry-grid {
            grid-template-columns: repeat(4, 1fr);
          }
        }

        @media (max-width: 1399px) and (min-width: 1024px) {
          .masonry-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }

        @media (max-width: 1023px) and (min-width: 768px) {
          .masonry-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 767px) {
          .masonry-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </motion.div>
  )
}
