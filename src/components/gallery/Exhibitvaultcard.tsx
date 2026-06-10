'use client'
// ─────────────────────────────────────────────────────────────────────────────
// ExhibitVaultCard — organic luxury tilt card
// Village energy: earthy, warm, cinematic, alive
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import type { Exhibit } from './Gallery.data'

type Props = {
  exhibit: Exhibit
  onOpen: (e: Exhibit) => void
  delay?: number
}

export function ExhibitVaultCard({ exhibit, onOpen, delay = 0 }: Props) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })

  const accent =
    exhibit.accent === 'var(--gold)' ? '#D4A853'
    : exhibit.accent === 'var(--neon)' ? '#00FF41'
    : exhibit.accent

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width
    const ny = (e.clientY - rect.top) / rect.height
    setTilt({ x: (ny - 0.5) * -12, y: (nx - 0.5) * 16 })
    setMousePos({ x: nx, y: ny })
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
    setMousePos({ x: 0.5, y: 0.5 })
  }

  const statusColor = exhibit.status === 'Current' ? '#C8A96E'
    : exhibit.status === 'Upcoming' ? '#8B7355' : 'rgba(255,255,255,0.2)'
  const statusLabel = exhibit.status === 'Current' ? 'Open Now'
    : exhibit.status === 'Upcoming' ? 'Opening Soon' : 'In Archive'

  return (
    <motion.div
      initial={{ opacity: 0, y: 56 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-80px' }}
      ref={cardRef}
      onClick={() => onOpen(exhibit)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor-expand
      style={{ perspective: 800, cursor: 'pointer' }}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale: hovered ? 1.02 : 1,
        }}
        transition={hovered ? { type: 'spring', stiffness: 200, damping: 28 } : { duration: 0.5, ease: 'easeOut' }}
        style={{
          borderRadius: 20,
          overflow: 'hidden',
          background: 'rgba(12,10,7,0.96)',
          transformStyle: 'preserve-3d',
          position: 'relative',
          boxShadow: hovered
            ? `0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px ${accent}20, 0 0 80px ${accent}0a`
            : '0 4px 24px rgba(0,0,0,0.3), 0 0 0 1px rgba(255,255,255,0.03)',
        }}
      >
        {/* Organic texture layer */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.015'/%3E%3C/svg%3E")`,
          backgroundSize: '120px',
          mixBlendMode: 'overlay',
        }} />

        {/* Dynamic light following mouse */}
        <motion.div
          animate={{
            opacity: hovered ? 1 : 0,
            background: `radial-gradient(ellipse 55% 40% at ${mousePos.x * 100}% ${mousePos.y * 100}%, ${accent}18, transparent 65%)`,
          }}
          transition={{ duration: 0.15 }}
          style={{ position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none' }}
        />

        {/* Image */}
        <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
          <motion.img
            src={exhibit.image}
            alt={exhibit.title}
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Multi-layer gradient: rich cinematic fade */}
          <div style={{
            position: 'absolute', inset: 0,
            background: `
              linear-gradient(to bottom, rgba(12,10,7,0) 20%, rgba(12,10,7,0.95) 100%),
              linear-gradient(to right, rgba(12,10,7,0.4) 0%, transparent 40%)
            `,
          }} />

          {/* Status — organic pill */}
          <div style={{ position: 'absolute', top: 16, left: 16 }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '5px 12px 5px 10px', borderRadius: 30,
              background: 'rgba(0,0,0,0.55)',
              border: `1px solid ${statusColor}40`,
              backdropFilter: 'blur(12px)',
            }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%',
                background: statusColor, display: 'block',
                boxShadow: exhibit.status === 'Current' ? `0 0 6px ${statusColor}` : 'none',
              }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1.1vw, 13px)',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: statusColor,
              }}>
                {statusLabel}
              </span>
            </div>
          </div>

          {/* Piece count corner */}
          <div style={{ position: 'absolute', bottom: 14, right: 14 }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1.1vw, 13px)',
              color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em',
            }}>
              {exhibit.pieces} works
            </span>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '20px 22px 22px' }}>
          {/* Artist line */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10,
          }}>
            <div style={{ width: 20, height: 1, background: accent, opacity: 0.5 }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1.1vw, 13px)',
              letterSpacing: '0.22em', textTransform: 'uppercase',
              color: accent, opacity: 0.9,
            }}>
              {exhibit.artist}
            </span>
          </div>

          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.6rem', fontWeight: 300,
            color: 'var(--cream, #F5F0E8)',
            lineHeight: 1.05, marginBottom: 8,
            letterSpacing: '-0.01em',
          }}>
            {exhibit.title}
          </h3>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1.1vw, 13px)',
            color: 'rgba(255,255,255,0.22)', marginBottom: 14,
            letterSpacing: '0.08em',
          }}>
            {exhibit.dates}
          </p>

          <p style={{
            fontFamily: 'var(--font-body)', fontSize: 'clamp(14px, 1.4vw, 17px)',
            color: 'rgba(255,255,255,0.4)', lineHeight: 1.85,
            marginBottom: 20,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {exhibit.description}
          </p>

          {/* Tags */}
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
            {exhibit.tags.map(tag => (
              <span key={tag} style={{
                padding: '3px 10px', borderRadius: 20,
                fontFamily: 'var(--font-body)', fontSize: 'clamp(10px, 1vw, 12px)',
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: `${accent}cc`,
                background: `${accent}0c`,
                border: `1px solid ${accent}22`,
              }}>
                {tag}
              </span>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 16,
            borderTop: '1px solid rgba(255,255,255,0.04)',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1.1vw, 13px)',
              color: 'rgba(255,255,255,0.18)', letterSpacing: '0.06em',
            }}>
              {exhibit.medium}
            </span>
            <motion.div
              animate={{
                gap: hovered ? '8px' : '4px',
                color: hovered ? accent : 'rgba(255,255,255,0.2)',
              }}
              style={{
                display: 'flex', alignItems: 'center',
                fontFamily: 'var(--font-body)', fontSize: 'clamp(11px, 1.1vw, 13px)',
                letterSpacing: '0.18em', textTransform: 'uppercase',
              }}
            >
              Enter
              <motion.span animate={{ x: hovered ? 3 : 0 }} transition={{ duration: 0.3 }}>
                →
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Bottom accent bar — breath animation */}
        <motion.div
          animate={{ scaleX: hovered ? 1 : 0.3, opacity: hovered ? 0.8 : 0.2 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          style={{
            height: 1,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
            transformOrigin: 'center',
          }}
        />
      </motion.div>
    </motion.div>
  )
}
