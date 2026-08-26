'use client'

import { motion } from 'framer-motion'
import type { GalleryPhoto } from './Gallery.data'

interface PhotoCardHoverOverlayProps {
  photo: GalleryPhoto
}

/**
 * Metadata overlay displayed on photo hover
 * - Title
 * - Category
 * - Location
 * - Date
 */
export function PhotoCardHoverOverlay({
  photo,
}: PhotoCardHoverOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 50%, rgba(0,0,0,0.85) 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '20px',
        zIndex: 10,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        {/* Category Label */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '8px',
        }}>
          <span style={{
            fontSize: '11px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
          }}>
            {photo.category}
          </span>
          <div style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.4)',
          }} />
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            color: 'rgba(255,255,255,0.5)',
          }}>
            {photo.year}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: 'clamp(14px, 1.1vw, 18px)',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.95)',
          lineHeight: 1.3,
          marginBottom: '10px',
          fontFamily: 'var(--font-display, Georgia, serif)',
        }}>
          {photo.title}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '12px',
          fontWeight: 400,
          color: 'rgba(255,255,255,0.7)',
          lineHeight: 1.5,
          marginBottom: '10px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {photo.description}
        </p>

        {/* Metadata */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '11px',
          color: 'rgba(255,255,255,0.5)',
        }}>
          <span>📍 {photo.location ?? 'Village'}</span>
          <span>•</span>
          <span>📅 {new Date(photo.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
        </div>
      </motion.div>
    </motion.div>
  )
}
