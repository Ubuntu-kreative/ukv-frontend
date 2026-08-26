'use client'

import Image from 'next/image'
import { useState } from 'react'
import { motion, cubicBezier } from 'framer-motion'
import type { GalleryPhoto } from './Gallery.data'
import { PhotoCardHoverOverlay } from './PhotoCardHoverOverlay'

interface PhotoCardProps {
  photo: GalleryPhoto
  onClick?: (photo: GalleryPhoto) => void
  index?: number
}

/**
 * Individual photo tile for masonry gallery
 * - Lazy loading via next/image
 * - Hover zoom effect
 * - Metadata overlay on hover
 * - Aspect ratio preserved
 */
export function PhotoCard({
  photo,
  onClick,
  index = 0,
}: PhotoCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  // Calculate height based on aspect ratio for masonry
  const getHeight = () => {
    switch (photo.aspect) {
      case 'portrait': return 'h-96'
      case 'square': return 'h-64'
      case 'landscape':
      default: return 'h-48'
    }
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        delay: (index ?? 0) * 0.05,
        ease: cubicBezier(0.16, 1, 0.3, 1),
      },
    },
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => onClick?.(photo)}
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
        cursor: onClick ? 'pointer' : 'default',
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.04)',
      }}
    >
      {/* Image Container */}
      <div style={{
        position: 'relative',
        width: '100%',
        paddingBottom: photo.aspect === 'portrait' ? '133%' : photo.aspect === 'square' ? '100%' : '66.67%',
        overflow: 'hidden',
        background: 'rgba(0,0,0,0.1)',
      }}>
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{
            position: 'absolute',
            inset: 0,
            transformOrigin: 'center',
          }}
        >
          <Image
            src={photo.image}
            alt={photo.title}
            fill
            sizes="(max-width: 480px) 100vw,
                   (max-width: 768px) 50vw,
                   (max-width: 1024px) 33vw,
                   (max-width: 1400px) 33vw,
                   25vw"
            quality={75}
            loading="lazy"
            className="object-cover"
            onLoadingComplete={() => setIsLoaded(true)}
          />
        </motion.div>

        {/* Loading Skeleton */}
        {!isLoaded && (
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.05) 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }} />
        )}

        {/* Overlay Gradient */}
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)',
        }} />

        {/* Featured Badge */}
        {photo.featured && (
          <div style={{
            position: 'absolute',
            top: 8,
            left: 8,
            padding: '4px 10px',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            borderRadius: 20,
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.8)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            ★ Featured
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <PhotoCardHoverOverlay photo={photo} />
        )}
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </motion.div>
  )
}
