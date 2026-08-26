'use client'

import { motion } from 'framer-motion'
import type { GalleryCategory } from './Gallery.data'
import { CATEGORIES } from './Gallery.data'

interface CategoryFilterBarProps {
  activeCategory: GalleryCategory
  photoCountByCategory?: Record<GalleryCategory, number>
  onCategoryChange: (category: GalleryCategory) => void
}

/**
 * Category filter button bar
 * - All / Community / Culture / Art / Workshops / Nature / Accommodation / Food / Events / Guests
 * - Instant filtering with smooth transitions
 * - Show photo count per category
 */
export function CategoryFilterBar({
  activeCategory,
  photoCountByCategory,
  onCategoryChange,
}: CategoryFilterBarProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      overflowX: 'auto',
      overflowY: 'hidden',
      padding: '20px 0',
      scrollbarWidth: 'none',
      msOverflowStyle: 'none',
    }}>
      {CATEGORIES.map((category) => {
        const isActive = activeCategory === category
        const count = photoCountByCategory?.[category] ?? 0

        return (
          <motion.button
            key={category}
            onClick={() => onCategoryChange(category as GalleryCategory)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            style={{
              padding: '10px 16px',
              borderRadius: 24,
              border: `1.5px solid ${isActive ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)'}`,
              background: isActive ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.02)',
              color: isActive ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.5)',
              fontSize: '13px',
              fontWeight: 500,
              letterSpacing: '0.05em',
              textTransform: 'capitalize',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.3s ease',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {category}
            {count > 0 && (
              <span style={{
                fontSize: '11px',
                opacity: isActive ? 0.8 : 0.5,
              }}>
                ({count})
              </span>
            )}
          </motion.button>
        )
      })}

      <style jsx>{`
        ::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
