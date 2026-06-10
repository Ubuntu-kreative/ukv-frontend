'use client'
// ─────────────────────────────────────────────────────────────────────────────
// ImmersiveExhibit — luxury fullscreen world
// Rebuilt as a progressive-reveal storytelling experience
// ESC to close | scroll inside the modal | keyboard nav
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState, useRef } from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import type { Exhibit } from './Gallery.data'
import { VideoPlayer } from './VideoPlayer'

// ─── Ambient particle field ───────────────────────────────────────────────────

function ParticleField({ color, count = 30 }: { color: string; count?: number }) {
  return (
    <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden>
      {Array.from({ length: count }).map((_, i) => {
        const size = i % 4 === 0 ? 2.5 : 1
        const left = ((i * 37 + 13) % 100)
        const dur = 14 + (i * 1.1) % 18
        const delay = (i * 0.6) % 12
        return (
          <motion.div
            key={i}
            animate={{ y: ['0vh', '-110vh'], opacity: [0, 0.6, 0] }}
            transition={{ duration: dur, repeat: Infinity, ease: 'linear', delay }}
            style={{
              position: 'absolute',
              bottom: `-${(i * 7) % 30}%`,
              left: `${left}%`,
              width: size, height: size,
              borderRadius: '50%',
              background: color,
              filter: size > 1.5 ? `blur(0.5px)` : 'none',
            }}
          />
        )
      })}
    </div>
  )
}

// ─── Gallery lightbox strip ───────────────────────────────────────────────────

function GalleryStrip({ images, accent }: { images: string[]; accent: string }) {
  const [active, setActive] = useState(0)

  function prev() { setActive(i => (i - 1 + images.length) % images.length) }
  function next() { setActive(i => (i + 1) % images.length) }

  return (
    <div style={{ marginBottom: 36 }}>
      {/* Main image with navigation */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, scale: 1.03 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            style={{
              width: '100%', height: 240,
              borderRadius: 12, overflow: 'hidden',
              border: `1px solid ${accent}18`,
            }}
          >
            <img
              src={images[active]}
              alt={`Gallery ${active + 1}`}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
          </motion.div>
        </AnimatePresence>

        {/* Nav arrows */}
        {images.length > 1 && (
          <>
            <button onClick={prev} style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', border: `1px solid ${accent}30`,
              color: accent, cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}>‹</button>
            <button onClick={next} style={{
              position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
              width: 34, height: 34, borderRadius: '50%',
              background: 'rgba(0,0,0,0.6)', border: `1px solid ${accent}30`,
              color: accent, cursor: 'pointer', fontSize: 14,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}>›</button>
          </>
        )}

        {/* Counter */}
        <div style={{
          position: 'absolute', bottom: 10, right: 14,
          fontFamily: 'var(--font-body)', fontSize: '8px',
          letterSpacing: '0.12em', color: 'rgba(255,255,255,0.4)',
        }}>
          {active + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div style={{ display: 'flex', gap: 7 }}>
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{
              flex: 1, height: 52, borderRadius: 7,
              overflow: 'hidden', padding: 0, cursor: 'pointer',
              border: i === active ? `1.5px solid ${accent}` : '1.5px solid rgba(255,255,255,0.06)',
              opacity: i === active ? 1 : 0.38,
              transition: 'all 0.3s',
              transform: i === active ? 'scale(1.04)' : 'scale(1)',
            }}
          >
            <img src={src} alt={`Exhibit carousel thumbnail ${i + 1}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span style={{ display: 'block', width: 20, height: 1, background: accent, opacity: 0.5 }} />
      <span style={{
        fontFamily: 'var(--font-body)', fontSize: '8px',
        letterSpacing: '0.28em', textTransform: 'uppercase',
        color: accent, opacity: 0.75,
      }}>
        {children}
      </span>
    </div>
  )
}

// ─── Metadata card ────────────────────────────────────────────────────────────

function MetaCard({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div style={{
      padding: '16px 18px',
      borderRadius: 10,
      border: '1px solid rgba(255,255,255,0.04)',
      background: 'rgba(0,0,0,0.22)',
    }}>
      <span style={{
        display: 'block',
        fontFamily: 'var(--font-body)', fontSize: '8px',
        letterSpacing: '0.24em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.2)', marginBottom: 6,
      }}>
        {label}
      </span>
      <span style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.95rem', fontWeight: 300,
        color: 'rgba(255,255,255,0.65)',
        lineHeight: 1.3,
      }}>
        {value}
      </span>
    </div>
  )
}

// ─── Inner fullscreen modal ───────────────────────────────────────────────────

type Props = { exhibit: Exhibit; onClose: () => void }

function ImmersiveExhibitInner({ exhibit, onClose }: Props) {
  const atm = exhibit.atmosphere
  const hasVideo = !!(exhibit.video?.directUrl || exhibit.video?.youtubeId)
  const [revealed, setRevealed] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const accent = exhibit.accent

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Progressive reveal: content appears after hero settles
    const t = setTimeout(() => setRevealed(true), 600)
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => {
      document.body.style.overflow = ''
      clearTimeout(t)
      window.removeEventListener('keydown', esc)
    }
  }, [onClose])

  const statusLabel = exhibit.status === 'Current' ? 'Open Now'
    : exhibit.status === 'Upcoming' ? 'Opening Soon' : 'In Archive'
  const statusColor = exhibit.status === 'Current' ? '#C8A96E'
    : exhibit.status === 'Upcoming' ? '#8B7355' : 'rgba(255,255,255,0.3)'

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: '#06080A',
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* ── Full-bleed hero image with dramatic reveal ── */}
      <motion.div
        initial={{ scale: 1.12, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
        }}
      >
        <img
          src={exhibit.heroImage}
          alt={exhibit.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22 }}
        />
        {/* Cinematic grade: three-layer depth */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `
            linear-gradient(to bottom, rgba(6,8,10,0.3) 0%, rgba(6,8,10,0.5) 30%, rgba(6,8,10,0.96) 68%, rgba(6,8,10,1) 100%),
            linear-gradient(to right, rgba(6,8,10,0.7) 0%, rgba(6,8,10,0.2) 35%, transparent 60%)
          `,
        }} />
        {/* Atmospheric colour bleed from exhibit accent */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse 90% 60% at 70% 30%, ${accent}08 0%, transparent 60%)`,
        }} />
      </motion.div>

      {/* Ambient glow pulse */}
      <motion.div
        animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '15%', left: '55%',
          width: '50vw', height: '50vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${atm.glow} 0%, transparent 65%)`,
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <ParticleField color={atm.particle} count={28} />

      {/* ── Close ── */}
      <button
        onClick={onClose}
        data-cursor-expand
        aria-label="Close exhibit"
        style={{
          position: 'absolute', top: 28, right: 28, zIndex: 20,
          width: 44, height: 44, borderRadius: '50%',
          border: `1px solid rgba(255,255,255,0.1)`,
          background: 'rgba(6,8,10,0.7)', backdropFilter: 'blur(16px)',
          color: 'rgba(255,255,255,0.45)',
          fontSize: 15, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.25s',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = accent
          ;(e.currentTarget as HTMLButtonElement).style.color = accent
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255,255,255,0.1)'
          ;(e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.45)'
        }}
      >
        ✕
      </button>

      {/* ── Scrollable content ── */}
      <div
        ref={scrollRef}
        style={{
          position: 'relative', zIndex: 10,
          height: '100%', overflowY: 'auto', overflowX: 'hidden',
          scrollbarWidth: 'thin',
          scrollbarColor: `${accent}22 transparent`,
          paddingTop: 0,
        }}
      >
        {/* ── Act 1: Hero title block ── */}
        <div style={{
          minHeight: '70vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 'clamp(28px, 6vw, 72px)',
          paddingBottom: 'clamp(40px, 6vw, 80px)',
        }}>
          <motion.div
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Status + artist line */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 22, flexWrap: 'wrap' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                <span style={{
                  width: 5, height: 5, borderRadius: '50%',
                  background: statusColor, display: 'block',
                  boxShadow: exhibit.status === 'Current' ? `0 0 8px ${statusColor}` : 'none',
                }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '8px',
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  color: statusColor,
                }}>
                  {statusLabel}
                </span>
              </div>
              <span style={{ width: 20, height: 1, background: 'rgba(255,255,255,0.15)', display: 'block' }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '8px',
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
              }}>
                {exhibit.artist}
              </span>
            </div>

            {/* Title — massive cinematic */}
            <h2 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(3.2rem, 7.5vw, 7rem)',
              fontWeight: 300,
              color: 'var(--cream, #F5F0E8)',
              lineHeight: 0.88,
              letterSpacing: '-0.025em',
              marginBottom: 28,
            }}>
              {exhibit.title}
            </h2>

            {/* Date + medium row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)',
              }}>
                {exhibit.dates}
              </span>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: `${accent}60` }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)',
              }}>
                {exhibit.medium}
              </span>
              <div style={{ width: 3, height: 3, borderRadius: '50%', background: `${accent}60` }} />
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.14em', color: 'rgba(255,255,255,0.28)',
              }}>
                {exhibit.pieces} works
              </span>
            </div>
          </motion.div>
        </div>

        {/* ── Act 2: Story + content ── */}
        <AnimatePresence>
          {revealed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
              style={{
                background: 'linear-gradient(to bottom, transparent, rgba(6,8,10,0.98) 80px)',
                padding: 'clamp(28px, 6vw, 72px)',
                paddingTop: 0,
              }}
            >
              {/* Divider */}
              <div style={{
                display: 'flex', alignItems: 'center', gap: 16, marginBottom: 52,
              }}>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to right, ${accent}40, transparent)` }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '8px',
                  letterSpacing: '0.3em', textTransform: 'uppercase',
                  color: `${accent}60`,
                }}>The Work</span>
                <div style={{ flex: 1, height: 1, background: `linear-gradient(to left, ${accent}40, transparent)` }} />
              </div>

              {/* Two-column layout */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
                gap: 'clamp(32px, 5vw, 64px)',
                alignItems: 'start',
                maxWidth: 1200,
              }}>
                {/* ── Left: Narrative ── */}
                <motion.div
                  initial={{ opacity: 0, x: -24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Description — generous leading */}
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'clamp(13px, 1.5vw, 16px)',
                    color: 'rgba(255,255,255,0.5)',
                    lineHeight: 2,
                    marginBottom: 28,
                    letterSpacing: '0.01em',
                  }}>
                    {exhibit.description}
                  </p>

                  {/* Tags */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 36 }}>
                    {exhibit.tags.map(tag => (
                      <span key={tag} style={{
                        padding: '5px 14px', borderRadius: 30,
                        border: `1px solid ${accent}28`,
                        background: `${accent}08`,
                        color: `${accent}cc`,
                        fontFamily: 'var(--font-body)', fontSize: '8px',
                        letterSpacing: '0.14em', textTransform: 'uppercase',
                      }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Video */}
                  {hasVideo && (
                    <div style={{ marginBottom: 36 }}>
                      <SectionLabel accent={accent}>
                        {exhibit.video?.youtubeId ? 'Exhibition Film' : 'Exhibition Video'}
                      </SectionLabel>
                      <VideoPlayer
                        directUrl={exhibit.video?.directUrl}
                        youtubeId={exhibit.video?.youtubeId}
                        poster={exhibit.video?.poster ?? exhibit.heroImage}
                        label={exhibit.video?.label}
                        accent={accent}
                      />
                    </div>
                  )}

                  {/* Gallery images */}
                  {exhibit.galleryImages && exhibit.galleryImages.length > 0 && (
                    <>
                      <SectionLabel accent={accent}>Selected Works</SectionLabel>
                      <GalleryStrip images={exhibit.galleryImages} accent={accent} />
                    </>
                  )}

                  {/* CTA */}
                  {exhibit.status === 'Current' && (
                    <Link
                      href="/contact"
                      style={{
                        display: 'inline-flex', alignItems: 'center', gap: 10,
                        padding: '15px 36px',
                        background: accent,
                        color: '#06080A',
                        fontFamily: 'var(--font-body)',
                        fontSize: '9px', letterSpacing: '0.22em',
                        textTransform: 'uppercase', fontWeight: 700,
                        borderRadius: 8, textDecoration: 'none',
                        transition: 'opacity 0.2s',
                      }}
                    >
                      Book a Guided Experience →
                    </Link>
                  )}
                </motion.div>

                {/* ── Right: Metadata ── */}
                <motion.div
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  style={{ display: 'flex', flexDirection: 'column', gap: 12 }}
                >
                  <MetaCard label="Exhibition Dates" value={exhibit.dates} accent={accent} />
                  <MetaCard label="Works in Show" value={`${exhibit.pieces} pieces`} accent={accent} />
                  <MetaCard label="Medium" value={exhibit.medium} accent={accent} />
                  <MetaCard label="Status" value={statusLabel} accent={accent} />

                  {hasVideo && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      style={{
                        padding: '18px 20px',
                        borderRadius: 10,
                        border: `1px solid ${accent}22`,
                        background: `${accent}06`,
                        display: 'flex', alignItems: 'center', gap: 14,
                      }}
                    >
                      <div style={{
                        width: 38, height: 38, borderRadius: '50%',
                        background: `${accent}18`, border: `1px solid ${accent}33`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill={accent}>
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                      <div>
                        <span style={{
                          display: 'block', fontFamily: 'var(--font-body)',
                          fontSize: '7px', letterSpacing: '0.24em',
                          textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
                          marginBottom: 4,
                        }}>
                          Exhibition Film
                        </span>
                        <span style={{
                          fontFamily: 'var(--font-body)', fontSize: '11px',
                          color: accent,
                        }}>
                          {exhibit.video?.label ?? 'Watch the film'}
                        </span>
                      </div>
                    </motion.div>
                  )}

                  {/* Accent rule */}
                  <div style={{
                    height: 2, borderRadius: 2, marginTop: 8,
                    background: `linear-gradient(90deg, ${accent}60, ${accent}08)`,
                  }} />
                </motion.div>
              </div>

              {/* Bottom breathing space */}
              <div style={{ height: 80 }} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}

// ─── Portal wrapper ───────────────────────────────────────────────────────────

export function ImmersiveExhibit({ exhibit, onClose }: Props) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])
  if (!mounted) return null

  return createPortal(
    <AnimatePresence mode="wait">
      {exhibit && (
        <ImmersiveExhibitInner key={exhibit.id} exhibit={exhibit} onClose={onClose} />
      )}
    </AnimatePresence>,
    document.body
  )
}
