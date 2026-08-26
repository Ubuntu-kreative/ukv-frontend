'use client'

import { motion } from 'framer-motion'

interface GalleryChapterHeaderProps {
  number: string
  title: string
  subtitle?: string
  description?: string
  accent?: string
}

/**
 * Chapter header for gallery sections
 * - Chapter number
 * - Title
 * - Optional description
 * - Elegant styling
 */
export function GalleryChapterHeader({
  number,
  title,
  subtitle,
  description,
  accent = 'rgba(212,168,83,0.4)',
}: GalleryChapterHeaderProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true }}
      style={{
        marginBottom: '60px',
      }}
    >
      {/* Chapter Badge */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
        marginBottom: '16px',
      }}>
        <span style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(12px, 1.2vw, 14px)',
          letterSpacing: '0.38em',
          textTransform: 'uppercase',
          color: accent,
        }}>
          {number}
        </span>
        <div style={{
          width: '44px',
          height: '1px',
          background: accent,
        }} />
        {subtitle && (
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(12px, 1.1vw, 14px)',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            color: accent,
          }}>
            {subtitle}
          </span>
        )}
      </div>

      {/* Title */}
      <h2 style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
        fontWeight: 300,
        color: 'var(--cream, #F5F0E8)',
        lineHeight: 1.05,
        marginBottom: '16px',
      }}>
        {title}
      </h2>

      {/* Description */}
      {description && (
        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(14px, 1.45vw, 18px)',
          color: 'rgba(255,255,255,0.32)',
          lineHeight: 1.9,
          maxWidth: '580px',
          letterSpacing: '0.01em',
        }}>
          {description}
        </p>
      )}
    </motion.div>
  )
}
