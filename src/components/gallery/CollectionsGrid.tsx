'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, cubicBezier } from 'framer-motion'
import type { GalleryCollection } from './Gallery.data'

interface CollectionsGridProps {
  collections: GalleryCollection[]
  onCollectionClick?: (collection: GalleryCollection) => void
}

/**
 * Featured Collections Grid
 * - 7 themed photo collections
 * - Cover image + description
 * - Photo count
 * - Hover animations
 */
export function CollectionsGrid({
  collections,
  onCollectionClick,
}: CollectionsGridProps) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
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
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '24px',
      }}
    >
      {collections.map((collection) => (
        <motion.div
          key={collection.id}
          variants={itemVariants}
          onHoverStart={() => setHoveredId(collection.id)}
          onHoverEnd={() => setHoveredId(null)}
          onClick={() => onCollectionClick?.(collection)}
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            cursor: onCollectionClick ? 'pointer' : 'default',
            background: 'rgba(10,12,8,0.88)',
            border: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          {/* Image Container */}
          <div style={{
            position: 'relative',
            width: '100%',
            paddingBottom: '66.67%',
            overflow: 'hidden',
            background: 'rgba(0,0,0,0.2)',
          }}>
            <motion.div
              animate={{ scale: hoveredId === collection.id ? 1.08 : 1 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              style={{
                position: 'absolute',
                inset: 0,
              }}
            >
              <Image
                src={collection.coverImage}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 33vw"
                quality={80}
                className="object-cover"
              />
            </motion.div>

            {/* Overlay */}
            <motion.div
              animate={{
                background: hoveredId === collection.id
                  ? 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
              }}
              transition={{ duration: 0.3 }}
              style={{
                position: 'absolute',
                inset: 0,
              }}
            />

            {/* Icon Badge */}
            <div style={{
              position: 'absolute',
              top: 16,
              left: 16,
              fontSize: '32px',
              textShadow: '0 2px 8px rgba(0,0,0,0.3)',
            }}>
              {collection.icon}
            </div>

            {/* Photo Count */}
            <div style={{
              position: 'absolute',
              bottom: 16,
              right: 16,
              padding: '6px 12px',
              background: 'rgba(0,0,0,0.5)',
              backdropFilter: 'blur(8px)',
              borderRadius: 20,
              fontSize: '12px',
              fontWeight: 600,
              color: collection.accent,
              border: `1px solid ${collection.accent}40`,
            }}>
              {collection.photoCount} photos
            </div>
          </div>

          {/* Content */}
          <div style={{
            padding: '20px',
          }}>
            <h3 style={{
              fontSize: '1.1rem',
              fontWeight: 400,
              color: 'rgba(255,255,255,0.95)',
              marginBottom: 8,
              fontFamily: 'var(--font-display)',
            }}>
              {collection.name}
            </h3>

            <p style={{
              fontSize: '13px',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: 1.5,
              marginBottom: 16,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}>
              {collection.description}
            </p>

            {/* Action */}
            <motion.div
              animate={{ x: hoveredId === collection.id ? 4 : 0 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: collection.accent,
              }}
            >
              Explore
              <motion.span animate={{ x: hoveredId === collection.id ? 4 : 0 }}>
                →
              </motion.span>
            </motion.div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  )
}
