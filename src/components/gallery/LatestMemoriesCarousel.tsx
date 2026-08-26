'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { motion, AnimatePresence, cubicBezier } from 'framer-motion'
import type { GalleryPhoto } from './Gallery.data'

interface LatestMemoriesCarouselProps {
  photos: GalleryPhoto[]
  maxItems?: number
  onPhotoClick?: (photo: GalleryPhoto) => void
}

/**
 * Latest Memories Section
 * - Newest uploads first
 * - Carousel/strip layout
 * - Drag scrollable
 * - View All button
 */
export function LatestMemoriesCarousel({
  photos,
  maxItems = 8,
  onPhotoClick,
}: LatestMemoriesCarouselProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  // Sort by date, newest first
  const latest = [...photos]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, maxItems)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: cubicBezier(0.16, 1, 0.3, 1),
      },
    },
  }

  return (
    <div>
      {/* Carousel */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        style={{
          display: 'flex',
          gap: '16px',
          overflowX: 'auto',
          paddingBottom: '12px',
          scrollBehavior: 'smooth',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.1) transparent',
        }}
      >
        {latest.map((photo) => (
          <motion.div
            key={photo.id}
            variants={itemVariants}
            onHoverStart={() => setHoveredId(photo.id)}
            onHoverEnd={() => setHoveredId(null)}
            onClick={() => onPhotoClick?.(photo)}
            style={{
              flexShrink: 0,
              width: '280px',
              borderRadius: 12,
              overflow: 'hidden',
              cursor: onPhotoClick ? 'pointer' : 'default',
              background: 'rgba(10,12,8,0.88)',
              border: '1px solid rgba(255,255,255,0.04)',
            }}
          >
            {/* Image */}
            <div style={{
              position: 'relative',
              width: '100%',
              paddingBottom: '66.67%',
              overflow: 'hidden',
            }}>
              <motion.div
                animate={{ scale: hoveredId === photo.id ? 1.08 : 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  position: 'absolute',
                  inset: 0,
                }}
              >
                <Image
                  src={photo.image}
                  alt={photo.title}
                  fill
                  sizes="300px"
                  quality={75}
                  className="object-cover"
                />
              </motion.div>

              {/* Overlay */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.4) 100%)',
              }} />

              {/* New Badge */}
              {photo.featured && (
                <div style={{
                  position: 'absolute',
                  top: 8,
                  left: 8,
                  padding: '4px 10px',
                  background: 'rgba(255,100,100,0.2)',
                  backdropFilter: 'blur(8px)',
                  borderRadius: 20,
                  fontSize: '10px',
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,150,150,0.9)',
                  border: '1px solid rgba(255,100,100,0.3)',
                }}>
                  🆕 New
                </div>
              )}
            </div>

            {/* Info */}
            <div style={{
              padding: '14px',
            }}>
              <h4 style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'rgba(255,255,255,0.9)',
                marginBottom: 6,
                display: '-webkit-box',
                WebkitLineClamp: 1,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {photo.title}
              </h4>

              <p style={{
                fontSize: '11px',
                color: 'rgba(255,255,255,0.4)',
                display: 'flex',
                gap: 8,
              }}>
                <span>{photo.category}</span>
                <span>•</span>
                <span>{new Date(photo.date).toLocaleDateString('en-US', { month: 'short' })}</span>
              </p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* View All Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        viewport={{ once: true }}
        style={{
          marginTop: '24px',
          textAlign: 'center',
        }}
      >
        <Link
          href="#explore-all"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 28px',
            borderRadius: 8,
            border: '1px solid rgba(255,255,255,0.2)',
            background: 'rgba(255,255,255,0.05)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '12px',
            fontWeight: 600,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            textDecoration: 'none',
            fontFamily: 'var(--font-body)',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.borderColor = 'rgba(255,255,255,0.4)'
            el.style.background = 'rgba(255,255,255,0.1)'
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLAnchorElement
            el.style.borderColor = 'rgba(255,255,255,0.2)'
            el.style.background = 'rgba(255,255,255,0.05)'
          }}
        >
          View All Memories
          <span>→</span>
        </Link>
      </motion.div>

      <style jsx>{`
        div::-webkit-scrollbar {
          height: 4px;
        }
        div::-webkit-scrollbar-track {
          background: transparent;
        }
        div::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  )
}
