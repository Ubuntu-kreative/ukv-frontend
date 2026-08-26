'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import type { GalleryCollection } from './Gallery.data'

type Props = {
  collections: GalleryCollection[]
  onCollectionClick?: (collection: GalleryCollection) => void
}

const FS = {
  label: '10px',
  bodySm: '13px',
  body: '14px',
  cta: '11px',
}

export function CollectionsSection({ collections, onCollectionClick }: Props) {
  const [hoveredId, setHoveredId] = useState<string | null>(null)

  return (
    <section
      id="collections"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(80px, 10vw, 120px) 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'linear-gradient(to bottom, transparent, rgba(200,169,110,0.015))',
      }}
    >
      {/* Header */}
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '0 clamp(24px, 5vw, 80px)',
        marginBottom: 'clamp(60px, 8vw, 100px)',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24 }}
        >
          <span style={{
            fontFamily: 'var(--font-body)',
            fontSize: FS.label,
            letterSpacing: '0.38em',
            textTransform: 'uppercase',
            color: 'rgba(212, 168, 83, 0.4)',
          }}>
            Collections
          </span>
          <div style={{ flex: 1, height: 1, background: 'rgba(212, 168, 83, 0.15)' }} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 3.8rem)',
            fontWeight: 300,
            color: 'var(--cream, #F5F0E8)',
            lineHeight: 1.1,
            marginBottom: 16,
          }}
        >
          Explore by Collection
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, margin: '-100px' }}
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: FS.body,
            color: 'rgba(255, 255, 255, 0.45)',
            lineHeight: 1.85,
            maxWidth: 600,
          }}
        >
          Seven curated collections that tell the different stories of Ubuntu Kreative Village.
          From workshops to gardens, food to guests. Click to explore each collection.
        </motion.p>
      </div>

      {/* Collections Grid */}
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '0 clamp(24px, 5vw, 80px)',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: 28,
        }}>
          {collections.map((col, idx) => (
            <motion.button
              key={col.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: idx * 0.08,
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: '-60px' }}
              onMouseEnter={(e) => {
                setHoveredId(col.id)
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = `${col.accent}40`
                el.style.boxShadow = `0 24px 60px rgba(0,0,0,0.5), 0 0 40px ${col.accent}12`
              }}
              onMouseLeave={(e) => {
                setHoveredId(null)
                const el = e.currentTarget as HTMLButtonElement
                el.style.borderColor = 'rgba(255,255,255,0.06)'
                el.style.boxShadow = 'none'
              }}
              onClick={() => onCollectionClick?.(col)}
              style={{
                position: 'relative',
                borderRadius: 16,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(10,12,9,0.88)',
                cursor: 'pointer',
                padding: 0,
                textAlign: 'left',
                transition: 'all 0.35s ease',
              }}
            >
              {/* Cover Image */}
              <div style={{
                position: 'relative',
                height: 240,
                overflow: 'hidden',
              }}>
                <Image
                  src={col.coverImage}
                  alt={col.name}
                  fill
                  quality={75}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  style={{
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={e => {
                    const img = e.currentTarget as HTMLImageElement
                    img.style.transform = 'scale(1.06)'
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
                  background: `linear-gradient(135deg, transparent 0%, ${col.accent}15 50%, rgba(0,0,0,0.4) 100%)`,
                  pointerEvents: 'none',
                }} />

                {/* Icon Badge */}
                <div style={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  fontSize: '2rem',
                  filter: hoveredId === col.id ? `drop-shadow(0 4px 12px ${col.accent}60)` : 'none',
                  transition: 'filter 0.3s ease',
                }}>
                  {col.icon}
                </div>

                {/* Photo Count Badge */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{
                    opacity: hoveredId === col.id ? 1 : 0.7,
                    scale: hoveredId === col.id ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'absolute',
                    bottom: 16,
                    left: 16,
                    padding: '8px 16px',
                    borderRadius: 20,
                    background: `${col.accent}22`,
                    border: `1px solid ${col.accent}45`,
                    fontFamily: 'var(--font-body)',
                    fontSize: FS.label,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: col.accent,
                  }}
                >
                  {col.photoCount} photos
                </motion.div>
              </div>

              {/* Content */}
              <div style={{ padding: '24px 20px 22px' }}>
                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
                  fontWeight: 300,
                  color: 'var(--cream, #F5F0E8)',
                  marginBottom: 10,
                  lineHeight: 1.2,
                }}>
                  {col.name}
                </h3>

                <p style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: FS.bodySm,
                  color: 'rgba(255, 255, 255, 0.4)',
                  lineHeight: 1.65,
                  marginBottom: 18,
                }}>
                  {col.description}
                </p>

                {/* CTA */}
                <motion.div
                  animate={{
                    opacity: hoveredId === col.id ? 1 : 0.6,
                    x: hoveredId === col.id ? 4 : 0,
                  }}
                  transition={{ duration: 0.2 }}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: FS.cta,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    color: col.accent,
                    fontWeight: 600,
                  }}
                >
                  Explore Collection →
                </motion.div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  )
}
