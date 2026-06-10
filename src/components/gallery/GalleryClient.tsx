'use client'
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — GalleryClient v2
// A living African creative village. Not a gallery. Not a museum.
// Five experiential chapters:
//   01 Arrival        — Cinematic village entrance
//   02 The Village OS — Interactive node map of all experiences
//   03 Living Studios — Curated art in context
//   04 Makers Alive   — Workshops + moments from real days
//   05 Fire Circle    — Craft market + evening gathering
// ─────────────────────────────────────────────────────────────────────────────

import {
  useEffect, useRef, useState, useCallback, useMemo,
} from 'react'
import { createPortal } from 'react-dom'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, useSpring } from 'framer-motion'

import type { Exhibit, Workshop, CraftMarketItem } from './Gallery.data'
import { HERO_VIDEO } from './Gallery.data'
import { ExhibitVaultCard } from './Exhibitvaultcard'
import { ImmersiveExhibit } from './Immersiveexhibit'
import { LivingBackground } from './Livingbackground'
import { MagneticCursor } from './Magneticcursor'
import { VideoPlayer } from './VideoPlayer'

// ─── Soft-import optional global components ───────────────────────────────────
let NavWrapper: React.ComponentType<Record<string,unknown>> | null = null
let Footer:     React.ComponentType<Record<string,unknown>> | null = null
let MoxieChat:  React.ComponentType<{ className?: string }> | null = null

try { NavWrapper = require('@/components/NavWrapper').default } catch {}
try { Footer     = require('@/components/Footer').default     } catch {}
try { MoxieChat  = require('@/components/MoxieChat').default  } catch {}

// ─── Readable type scale (replaces 6–9px micro-type) ───────────────────────────
const FS = {
  micro:  'clamp(10px, 1vw, 12px)',
  label:  'clamp(11px, 1.1vw, 14px)',
  cta:    'clamp(12px, 1.15vw, 14px)',
  bodySm: 'clamp(13px, 1.3vw, 16px)',
  body:   'clamp(14px, 1.45vw, 18px)',
  hud:    'clamp(15px, 1.5vw, 18px)',
}

const CHAPTERS = [
  { id: 'arrival',      label: '01', title: 'Arrival',        href: '#top' },
  { id: 'village-map',  label: '02', title: 'Village Map',    href: '#village-map' },
  { id: 'living-studios', label: '03', title: 'Living Studios', href: '#living-studios' },
  { id: 'makers-alive', label: '04', title: 'Makers Alive',   href: '#makers-alive' },
  { id: 'fire-circle',  label: '05', title: 'Fire Circle',    href: '#fire-circle' },
]

// ─── Types ────────────────────────────────────────────────────────────────────
type Stat  = { value: string; label: string }
type Props = {
  exhibits:    Exhibit[]
  workshops:   Workshop[]
  craftMarket: CraftMarketItem[]
  stats:       Stat[]
}

// ─────────────────────────────────────────────────────────────────────────────
// VILLAGE NODE DATA — the OS map experiences
// ─────────────────────────────────────────────────────────────────────────────

type VillageNode = {
  id: string
  label: string
  sub: string
  icon: string
  accent: string
  angle: number     // degrees on orbit ring
  ring: 'inner' | 'outer'
  story: string
  image: string
  hours: string
  highlights: string[]
}

const FRONT_ANGLE = 90 // degrees — node closest to this faces the viewer

const VILLAGE_NODES: VillageNode[] = [
  {
    id: 'art-gallery',
    label: 'Art Gallery',
    sub: 'Main Hall',
    icon: '◈',
    accent: '#A8D8F0',
    angle: 0,
    ring: 'outer',
    story: 'Three living exhibitions of African contemporary art — rotating with the seasons of the village.',
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=600&q=80',
    hours: 'Daily · 9am – 6pm',
    highlights: ['3 rotating exhibitions', 'Guided tours on request', 'Artist talks every Saturday'],
  },
  {
    id: 'pottery',
    label: 'Pottery Studio',
    sub: 'Earth & Fire',
    icon: '◎',
    accent: '#D4A853',
    angle: 51,
    ring: 'outer',
    story: 'Wheel-thrown vessels shaped from soil found fifty metres from this studio. Clay from the Ubuntu land.',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&q=80',
    hours: 'Mon – Sat · 7am – 4pm',
    highlights: ['Live wheel demonstrations', 'Village clay source', 'Take home your piece'],
  },
  {
    id: 'bead-workshop',
    label: 'Bead Workshop',
    sub: 'Pattern & Memory',
    icon: '◉',
    accent: '#B8A9F0',
    angle: 102,
    ring: 'outer',
    story: 'Traditional Maasai beadwork. Each colour carries meaning across generations, season, and ceremony.',
    image: 'https://images.unsplash.com/photo-1573408301185-9519f94815b4?w=600&q=80',
    hours: 'Tue – Sun · 10am – 5pm',
    highlights: ['Maasai colour language', 'Beginner-friendly sessions', 'Custom pattern design'],
  },
  {
    id: 'story-circle',
    label: 'Story Circle',
    sub: 'Fire & Voice',
    icon: '✦',
    accent: '#E8956D',
    angle: 153,
    ring: 'outer',
    story: 'At dusk, the fire circle opens. Elders, artists, and guests share stories under the open sky.',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
    hours: 'Every evening · Sunset – late',
    highlights: ['Open-air gathering', 'Live music & poetry', 'All guests welcome'],
  },
  {
    id: 'market-hall',
    label: 'Market Hall',
    sub: 'Makers & Craft',
    icon: '⊞',
    accent: '#F0A8B8',
    angle: 204,
    ring: 'outer',
    story: 'Virtuoso Kreative artisans, six guilds, one hall. A living market that breathes with the morning sun.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    hours: 'Wed – Sun · 8am – 3pm',
    highlights: ['23 village artisans', '6 craft guilds', 'Direct-from-maker pricing'],
  },
  {
    id: 'farm',
    label: 'Farm Experience',
    sub: 'Harvest & Land',
    icon: '◐',
    accent: '#00C851',
    angle: 255,
    ring: 'outer',
    story: 'Walk the harvest rows at dawn. Pick herbs. Understand where your dinner begins.',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=600&q=80',
    hours: 'Daily · Dawn tours at 5:30am',
    highlights: ['Harvest walk & pick', 'Farm-to-table connection', 'Herb & spice garden'],
  },
  {
    id: 'wellness',
    label: 'Wellness Pavilion',
    sub: 'Rest & Ritual',
    icon: '◑',
    accent: '#A8F0D8',
    angle: 307,
    ring: 'outer',
    story: 'Baobab oil, shea, morning stretching in open air. Wellness as craft, not commodity.',
    image: 'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=600&q=80',
    hours: 'Daily · 6am – 8pm',
    highlights: ['Open-air yoga', 'Baobab & shea rituals', 'Quiet rest pavilion'],
  },
]

function getFocusedNodeId(orbitAngle: number): string {
  let best = VILLAGE_NODES[0]
  let bestDist = Infinity
  for (const n of VILLAGE_NODES) {
    const a = ((orbitAngle + n.angle) % 360 + 360) % 360
    const dist = Math.min(Math.abs(a - FRONT_ANGLE), 360 - Math.abs(a - FRONT_ANGLE))
    if (dist < bestDist) { bestDist = dist; best = n }
  }
  return best.id
}

function snapAngleForNode(node: VillageNode): number {
  return FRONT_ANGLE - node.angle
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 01 — ARRIVAL HERO
// ─────────────────────────────────────────────────────────────────────────────

function ArrivalHero({ exhibits }: { exhibits: Exhibit[] }) {
  const heroRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '28%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])
  const hasVideo = !!(HERO_VIDEO.directUrl || HERO_VIDEO.youtubeId)
  const current = exhibits.find(e => e.status === 'Current')

  return (
    <section
      id="top"
      ref={heroRef}
      style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}
    >
      {/* Parallax background */}
      <motion.div style={{ y, position: 'absolute', inset: '-20%', zIndex: 0 }}>
        {hasVideo ? (
          <div style={{ width: '100%', height: '100%' }}>
            <VideoPlayer
              directUrl={HERO_VIDEO.directUrl}
              youtubeId={HERO_VIDEO.youtubeId}
              poster={HERO_VIDEO.poster}
              autoplay loop ambientMode
              aspectRatio="auto"
            />
          </div>
        ) : (
          <motion.img
            initial={{ scale: 1.12 }}
            animate={{ scale: 1 }}
            transition={{ duration: 7, ease: 'easeOut' }}
            src={HERO_VIDEO.poster ?? current?.heroImage}
            alt="Ubuntu Kreative Village"
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.22 }}
          />
        )}
      </motion.div>

      {/* Cinematic gradient */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 1,
        background: `
          linear-gradient(170deg, rgba(6,9,6,0.65) 0%, rgba(6,9,6,0.25) 40%, rgba(6,9,6,0.75) 70%, rgba(6,9,6,1) 100%),
          linear-gradient(90deg, rgba(6,9,6,0.8) 0%, transparent 50%)
        `,
      }} />

      {/* Content */}
      <motion.div
        style={{ opacity, position: 'relative', zIndex: 2 }}
      >
        <div style={{
          maxWidth: 1300, margin: '0 auto',
          padding: 'clamp(90px, 10vw, 140px) clamp(28px, 6vw, 88px) clamp(100px, 12vw, 160px)',
          minHeight: '100vh',
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
        }}>

          {/* Chapter marker */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 32 }}
          >
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: FS.label,
              letterSpacing: '0.38em', textTransform: 'uppercase',
              color: 'rgba(212,168,83,0.5)',
            }}>
              01
            </span>
            <div style={{ width: 60, height: 1, background: 'rgba(212,168,83,0.25)' }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: FS.label,
              letterSpacing: '0.3em', textTransform: 'uppercase',
              color: 'rgba(212,168,83,0.5)',
            }}>
              Arrival
            </span>
          </motion.div>

          {/* Main headline — four lines, emotional */}
          <div style={{ overflow: 'hidden' }}>
            {[
              { text: 'A Village Where', delay: 0.35 },
              { text: 'Art Is', delay: 0.45, accent: true },
              { text: 'Still Made', delay: 0.55, accent: true },
              { text: 'by Hand.', delay: 0.65 },
            ].map(line => (
              <motion.div
                key={line.text}
                initial={{ y: '110%', opacity: 0 }}
                animate={{ y: '0%', opacity: 1 }}
                transition={{ duration: 0.9, delay: line.delay, ease: [0.16, 1, 0.3, 1] }}
                style={{ overflow: 'hidden', paddingBottom: '0.4em' }}
              >
                <span style={{
                  display: 'block',
                  fontFamily: 'var(--font-display)',
                  fontSize: 'clamp(3rem, 8.5vw, 8.5rem)',
                  fontWeight: 300,
                  lineHeight: 0.9,
                  letterSpacing: '-0.03em',
                  color: line.accent ? '#C8A96E' : 'var(--cream, #F5F0E8)',
                  fontStyle: line.accent ? 'italic' : 'normal',
                }}>
                  {line.text}
                </span>
              </motion.div>
            ))}
          </div>

          <TypewriterParagraph
            text="Ubuntu Kreative Village is a living creative ecosystem on the Kenyan coast — where potters, painters, weavers, farmers, storytellers and healers share one piece of earth."
            delay={0.85}
          />

          {/* CTA pair */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.0 }}
            style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}
          >
            <Link href="#village-map" style={{
              padding: '14px 32px',
              background: '#C8A96E',
              color: '#06090A',
              fontFamily: 'var(--font-body)',
              fontSize: FS.cta, letterSpacing: '0.22em',
              textTransform: 'uppercase', fontWeight: 700,
              borderRadius: 8, textDecoration: 'none',
            }}>
              Enter the Village
            </Link>
            <Link href="/contact" style={{
              padding: '14px 32px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'transparent',
              color: 'rgba(255,255,255,0.55)',
              fontFamily: 'var(--font-body)',
              fontSize: FS.cta, letterSpacing: '0.22em',
              textTransform: 'uppercase',
              borderRadius: 8, textDecoration: 'none',
            }}>
              Plan a Stay →
            </Link>
          </motion.div>

          {/* Floating "Now Open" badge */}
          {current && (
            <motion.div
              initial={{ opacity: 0, scale: 0.88 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 1.3 }}
              style={{
                position: 'absolute',
                right: 'clamp(28px, 6vw, 88px)',
                bottom: 'clamp(80px, 10vw, 120px)',
                maxWidth: 200,
                padding: '18px 20px',
                borderRadius: 14,
                background: 'rgba(6,9,6,0.72)',
                border: '1px solid rgba(200,169,110,0.18)',
                backdropFilter: 'blur(18px)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 10 }}>
                <motion.span
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  style={{ width: 5, height: 5, borderRadius: '50%', background: '#C8A96E', display: 'block' }}
                />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: FS.micro,
                  letterSpacing: '0.25em', textTransform: 'uppercase',
                  color: '#C8A96E',
                }}>Open Now</span>
              </div>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.05rem', fontWeight: 300,
                color: 'var(--cream, #F5F0E8)',
                display: 'block', lineHeight: 1.2, marginBottom: 6,
              }}>
                {current.title}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: FS.label,
                color: 'rgba(255,255,255,0.28)', letterSpacing: '0.06em',
              }}>
                {current.artist}
              </span>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Scroll cue */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        style={{
          position: 'absolute', bottom: 38, left: '50%', transform: 'translateX(-50%)',
          zIndex: 5, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: FS.micro,
          letterSpacing: '0.34em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.18)',
        }}>Step inside</span>
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ width: 1, height: 44, background: 'linear-gradient(to bottom, rgba(200,169,110,0.5), transparent)' }}
        />
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 02 — VILLAGE OS (Node Map)
// ─────────────────────────────────────────────────────────────────────────────

type NodeModalData = VillageNode & { exhibitToOpen?: Exhibit }

function VillageNodeModal({
  node, onClose, onOpenExhibit, exhibits,
}: {
  node: NodeModalData
  onClose: () => void
  onOpenExhibit?: (e: Exhibit) => void
  exhibits?: Exhibit[]
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc) }
  }, [onClose])

  const isGallery = node.id === 'art-gallery' && exhibits && exhibits.length > 0

  if (!mounted) return null

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(6,9,6,0.92)', backdropFilter: 'blur(28px)',
        padding: 'clamp(16px, 4vw, 32px)',
      }}
    >
      <motion.div
        initial={{ scale: 0.9, y: 40, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        exit={{ scale: 0.94, y: 20, opacity: 0 }}
        transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        onClick={e => e.stopPropagation()}
        style={{
          borderRadius: 24,
          overflow: 'hidden',
          width: '100%', maxWidth: 720,
          maxHeight: '90vh', overflowY: 'auto',
          background: 'rgba(10,12,9,0.98)',
          border: `1px solid ${node.accent}33`,
          boxShadow: `0 48px 140px rgba(0,0,0,0.75), 0 0 100px ${node.accent}12`,
        }}
      >
        <div style={{ position: 'relative', height: 'clamp(220px, 32vw, 300px)', overflow: 'hidden' }}>
          <motion.img
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            src={node.image}
            alt={node.label}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, rgba(10,12,9,0.05) 0%, rgba(10,12,9,0.55) 55%, rgba(10,12,9,0.98) 100%)`,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: `linear-gradient(90deg, transparent, ${node.accent}, transparent)`,
          }} />
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: 'absolute', top: 16, right: 16,
              width: 36, height: 36, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(10px)',
              color: 'rgba(255,255,255,0.6)', cursor: 'pointer',
              fontSize: '1.1rem', lineHeight: 1,
            }}
          >
            ×
          </button>
          <div style={{ position: 'absolute', bottom: 24, left: 28, right: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
              <span style={{
                fontSize: '2rem', color: node.accent,
                filter: `drop-shadow(0 0 14px ${node.accent}88)`,
              }}>
                {node.icon}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: FS.label,
                letterSpacing: '0.22em', textTransform: 'uppercase',
                color: node.accent, opacity: 0.85,
              }}>
                {node.sub}
              </span>
            </div>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', fontWeight: 300,
              color: 'var(--cream, #F5F0E8)', lineHeight: 1.05,
            }}>
              {node.label}
            </h3>
          </div>
        </div>

        <div style={{ padding: '28px clamp(24px, 4vw, 36px) 32px' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: FS.body,
            color: 'rgba(255,255,255,0.55)', lineHeight: 1.95, marginBottom: 22,
          }}>
            {node.story}
          </p>

          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24,
          }}>
            <span style={{
              padding: '6px 14px', borderRadius: 20,
              background: `${node.accent}12`, border: `1px solid ${node.accent}28`,
              fontFamily: 'var(--font-body)', fontSize: FS.label,
              letterSpacing: '0.14em', textTransform: 'uppercase', color: node.accent,
            }}>
              {node.hours}
            </span>
            {node.highlights.map(h => (
              <span key={h} style={{
                padding: '6px 14px', borderRadius: 20,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                fontFamily: 'var(--font-body)', fontSize: FS.micro,
                letterSpacing: '0.1em', color: 'rgba(255,255,255,0.45)',
              }}>
                {h}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {isGallery && onOpenExhibit ? (
              <button
                onClick={() => {
                  const cur = exhibits!.find(e => e.status === 'Current') ?? exhibits![0]
                  onClose()
                  onOpenExhibit(cur)
                }}
                style={{
                  flex: 1, minWidth: 160, padding: '14px 0', textAlign: 'center',
                  background: node.accent, color: '#06090A', border: 'none',
                  fontFamily: 'var(--font-body)', fontSize: FS.cta,
                  letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
                  borderRadius: 10, cursor: 'pointer',
                }}
              >
                View Current Exhibition
              </button>
            ) : (
              <Link href="/contact" style={{
                flex: 1, minWidth: 160, padding: '14px 0', textAlign: 'center',
                background: node.accent, color: '#06090A',
                fontFamily: 'var(--font-body)', fontSize: FS.cta,
                letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
                borderRadius: 10, textDecoration: 'none',
              }}>
                Book Experience
              </Link>
            )}
            <button onClick={onClose} style={{
              padding: '14px 28px',
              border: `1px solid ${node.accent}30`,
              background: 'transparent',
              color: 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)', fontSize: FS.cta,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              borderRadius: 10, cursor: 'pointer',
            }}>
              Keep Exploring
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

function GalleryChapterNav() {
  const [active, setActive] = useState('arrival')

  useEffect(() => {
    const ids = CHAPTERS.map(c => c.id === 'arrival' ? 'top' : c.id)
    const obs = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)
        if (visible[0]) {
          const id = visible[0].target.id || 'top'
          setActive(id === 'top' ? 'arrival' : id)
        }
      },
      { threshold: [0.2, 0.45, 0.65], rootMargin: '-20% 0px -55% 0px' },
    )
    ids.forEach(id => {
      const el = document.getElementById(id)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  return (
    <nav
      aria-label="Gallery chapters"
      style={{
        position: 'fixed', right: 'clamp(12px, 2vw, 24px)',
        top: '50%', transform: 'translateY(-50%)',
        zIndex: 8000, display: 'flex', flexDirection: 'column', gap: 10,
        padding: '14px 10px', borderRadius: 20,
        background: 'rgba(6,9,6,0.55)', backdropFilter: 'blur(14px)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}
    >
      {CHAPTERS.map(ch => {
        const isActive = active === ch.id
        return (
          <a
            key={ch.id}
            href={ch.href}
            title={ch.title}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              textDecoration: 'none', padding: '4px 6px', borderRadius: 10,
              background: isActive ? 'rgba(200,169,110,0.12)' : 'transparent',
              transition: 'background 0.3s',
            }}
          >
            <span style={{
              width: isActive ? 10 : 6, height: isActive ? 10 : 6,
              borderRadius: '50%', flexShrink: 0,
              background: isActive ? '#C8A96E' : 'rgba(255,255,255,0.2)',
              boxShadow: isActive ? '0 0 12px rgba(200,169,110,0.5)' : 'none',
              transition: 'all 0.3s',
            }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: FS.micro,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: isActive ? '#C8A96E' : 'rgba(255,255,255,0.3)',
              whiteSpace: 'nowrap',
            }}>
              {ch.label}
            </span>
          </a>
        )
      })}
    </nav>
  )
}

function VillageOS({ exhibits, onOpenExhibit }: { exhibits: Exhibit[]; onOpenExhibit: (e: Exhibit) => void }) {
  const stageRef = useRef<HTMLDivElement>(null)
  const [orbitSize, setOrbitSize] = useState({ outerR: 300, stageH: 720 })
  const [angle, setAngle] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)
  const [activeNode, setActiveNode] = useState<VillageNode | null>(null)

  const lastX = useRef(0)
  const dragDist = useRef(0)
  const stageDidDrag = useRef(false)
  const angleRef = useRef(0)
  const velRef = useRef(0)
  const snapTarget = useRef<number | null>(null)
  const coasting = useRef(false)
  const raf = useRef<number | null>(null)

  const focusedId = useMemo(() => getFocusedNodeId(angle), [angle])
  const focusedNode = useMemo(
    () => VILLAGE_NODES.find(n => n.id === focusedId) ?? VILLAGE_NODES[0],
    [focusedId],
  )

  useEffect(() => {
    const el = stageRef.current
    if (!el) return
    const update = () => {
      const w = el.clientWidth
      const outerR = Math.min(Math.max(w * 0.44, 280), 480)
      setOrbitSize({ outerR, stageH: outerR * 2 + 400 })
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const beginSnap = useCallback((node?: VillageNode) => {
    const target = node ?? VILLAGE_NODES.find(n => n.id === getFocusedNodeId(angleRef.current))!
    snapTarget.current = snapAngleForNode(target)
    coasting.current = false
    velRef.current = 0
  }, [])

  const openNode = useCallback((node: VillageNode) => {
    beginSnap(node)
    setActiveNode(node)
  }, [beginSnap])

  useEffect(() => {
    let running = true
    const tick = () => {
      if (!running) return

      if (snapTarget.current !== null && !isDragging && !activeNode) {
        let delta = snapTarget.current - angleRef.current
        delta = ((delta % 360) + 540) % 360 - 180
        if (Math.abs(delta) < 0.25) {
          angleRef.current = snapTarget.current
          snapTarget.current = null
        } else {
          angleRef.current += delta * 0.11
        }
        setAngle(angleRef.current)
      } else if (!isDragging && !activeNode) {
        if (coasting.current) {
          velRef.current *= 0.96
          angleRef.current += velRef.current
          if (Math.abs(velRef.current) < 0.12) {
            coasting.current = false
            beginSnap()
          }
        } else if (snapTarget.current === null) {
          velRef.current = velRef.current * 0.97 + 0.003
          angleRef.current += velRef.current
        }
        setAngle(angleRef.current)
      }

      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { running = false; if (raf.current) cancelAnimationFrame(raf.current) }
  }, [isDragging, activeNode, beginSnap])

  function onStagePointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest('[data-village-node]')) return
    setIsDragging(true)
    coasting.current = false
    snapTarget.current = null
    dragDist.current = 0
    stageDidDrag.current = false
    lastX.current = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }

  function onStagePointerMove(e: React.PointerEvent) {
    if (!isDragging) return
    const dx = e.clientX - lastX.current
    dragDist.current += Math.abs(dx)
    if (dragDist.current > 10) stageDidDrag.current = true
    velRef.current = dx * 0.32
    angleRef.current += velRef.current
    setAngle(angleRef.current)
    lastX.current = e.clientX
  }

  function onStagePointerUp(e: React.PointerEvent) {
    if (!isDragging) return
    setIsDragging(false)
    ;(e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId)
    if (Math.abs(velRef.current) > 0.35) {
      coasting.current = true
    } else {
      beginSnap()
    }
    setTimeout(() => { stageDidDrag.current = false }, 80)
  }

  const { outerR, stageH } = orbitSize
  const cardW = Math.round(Math.min(Math.max(outerR * 0.72, 210), 290))
  const cardH = Math.round(cardW * 1.24)
  const imgH = Math.round(cardH * 0.60)

  return (
    <>
    <section
      id="village-map"
      style={{
        position: 'relative',
        padding: 'clamp(80px, 10vw, 120px) 0 clamp(100px, 12vw, 140px)',
        overflow: 'visible',
      }}
    >
      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(90vw, 900px)', height: 'min(70vw, 700px)',
        background: 'radial-gradient(ellipse, rgba(212,168,83,0.05) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Chapter header */}
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 5, marginBottom: 'clamp(48px, 6vw, 72px)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 12 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.4)' }}>02</span>
          <div style={{ width: 36, height: 1, background: 'rgba(212,168,83,0.25)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.4)' }}>Village Map</span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.8rem)',
          fontWeight: 300, color: 'var(--cream, #F5F0E8)',
          marginBottom: 14,
        }}>
          The Living Village
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
          color: 'rgba(255,255,255,0.45)',
          letterSpacing: '0.04em', maxWidth: 520, margin: '0 auto',
          lineHeight: 1.85,
        }}>
          Seven spaces. One ecosystem. Spin the ring — tap a space or press Enter to step inside.
        </p>
        <motion.p
          animate={{ opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            fontFamily: 'var(--font-body)', fontSize: FS.label,
            color: 'rgba(200,169,110,0.55)', marginTop: 14,
            letterSpacing: '0.2em', textTransform: 'uppercase',
          }}
        >
          ← Drag to explore →
        </motion.p>
      </div>

      {/* Orbit stage */}
      <div
        ref={stageRef}
        onPointerDown={onStagePointerDown}
        onPointerMove={onStagePointerMove}
        onPointerUp={onStagePointerUp}
        onPointerCancel={onStagePointerUp}
        style={{
          height: stageH, position: 'relative',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          cursor: isDragging ? 'grabbing' : 'grab',
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        {/* Orbit tick marks */}
        {Array.from({ length: 24 }).map((_, i) => {
          const t = (i / 24) * Math.PI * 2
          const tickR = outerR + 28
          return (
            <div key={`tick-${i}`} style={{
              position: 'absolute',
              left: '50%', top: '50%',
              width: i % 6 === 0 ? 6 : 3,
              height: i % 6 === 0 ? 6 : 3,
              borderRadius: '50%',
              background: i % 6 === 0 ? 'rgba(212,168,83,0.35)' : 'rgba(212,168,83,0.12)',
              transform: `translate(calc(-50% + ${Math.cos(t) * tickR}px), calc(-50% + ${Math.sin(t) * tickR * 0.2}px))`,
              pointerEvents: 'none',
            }} />
          )
        })}

        {/* Orbit rings */}
        {[0, 1, 2].map(i => (
          <div key={i} style={{
            position: 'absolute',
            width: (outerR * 2) + 40 + i * 70,
            height: (outerR * 2) + 40 + i * 70,
            borderRadius: '50%',
            border: i === 0
              ? `1px solid rgba(212,168,83,${0.12 - i * 0.03})`
              : `1px ${i === 2 ? 'dashed' : 'solid'} rgba(212,168,83,${0.08 - i * 0.02})`,
            pointerEvents: 'none',
            boxShadow: i === 0 ? 'inset 0 0 80px rgba(212,168,83,0.03)' : 'none',
          }} />
        ))}

        {/* Radial spokes */}
        {VILLAGE_NODES.map(node => {
          const theta = (angle + node.angle) * (Math.PI / 180)
          const x = Math.cos(theta) * outerR * 0.92
          const z = Math.sin(theta) * outerR * 0.92
          const isFocused = node.id === focusedId
          return (
            <div key={`spoke-${node.id}`} style={{
              position: 'absolute',
              width: 1, height: outerR * 0.88,
              background: `linear-gradient(to top, transparent, ${node.accent}${isFocused ? '35' : '10'})`,
              transformOrigin: 'bottom center',
              transform: `translate3d(${x}px, ${z * 0.18 - outerR * 0.44}px, 0) rotate(${-(angle + node.angle) + 90}deg)`,
              pointerEvents: 'none', opacity: isFocused ? 0.9 : 0.35,
              transition: 'opacity 0.4s',
            }} />
          )
        })}

        {/* Central hub */}
        <div style={{ position: 'absolute', zIndex: 4, textAlign: 'center', pointerEvents: 'none' }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: Math.min(Math.max(outerR * 0.42, 140), 180),
              height: Math.min(Math.max(outerR * 0.42, 140), 180),
              borderRadius: '50%',
              background: 'radial-gradient(circle, rgba(212,168,83,0.28) 0%, rgba(212,168,83,0.06) 45%, transparent 72%)',
              border: '1px solid rgba(212,168,83,0.28)',
              boxShadow: '0 0 80px rgba(212,168,83,0.18), 0 0 160px rgba(212,168,83,0.06)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 6,
            }}
          >
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: FS.cta,
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: 'rgba(212,168,83,0.85)',
            }}>
              Ubuntu
            </span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: FS.micro,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.35)',
            }}>
              Village OS
            </span>
          </motion.div>
        </div>

        {/* Nodes */}
        {VILLAGE_NODES.map((node) => {
          const theta = (angle + node.angle) * (Math.PI / 180)
          const x = Math.cos(theta) * outerR
          const z = Math.sin(theta) * outerR
          const depth = (z + outerR) / (outerR * 2)
          const scale = depth * 0.38 + 0.72
          const isForward = z > 0
          const isFocused = node.id === focusedId
          const isHovered = hoveredNode === node.id
          const isActive = isFocused || isHovered

          return (
            <motion.div
              key={node.id}
              data-village-node
              role="button"
              tabIndex={0}
              aria-label={`Enter ${node.label}`}
              onPointerDown={e => e.stopPropagation()}
              onClick={e => {
                e.stopPropagation()
                if (!stageDidDrag.current) openNode(node)
              }}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openNode(node) } }}
              onMouseEnter={() => setHoveredNode(node.id)}
              onMouseLeave={() => setHoveredNode(null)}
              data-cursor-expand
              animate={{ scale: isActive ? scale * 1.12 : scale }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              style={{
                position: 'absolute',
                transform: `translate3d(${x}px, ${z * 0.2}px, 0)`,
                zIndex: Math.round(z + outerR + 10),
                cursor: 'pointer',
                filter: isForward ? 'none' : `brightness(${0.3 + depth * 0.3}) saturate(${0.5 + depth * 0.3})`,
                touchAction: 'none',
              }}
            >
              {/* Focus ring */}
              {isFocused && (
                <motion.div
                  layoutId={`node-focus-${node.id}`}
                  style={{
                    position: 'absolute', inset: -8,
                    borderRadius: 20,
                    border: `2px solid ${node.accent}55`,
                    boxShadow: `0 0 40px ${node.accent}30, inset 0 0 20px ${node.accent}10`,
                    pointerEvents: 'none',
                  }}
                />
              )}

              <div style={{
                width: cardW, height: cardH,
                borderRadius: 16,
                overflow: 'hidden',
                border: `1px solid ${isActive ? node.accent : node.accent + '22'}`,
                boxShadow: isForward
                  ? `0 16px 50px rgba(0,0,0,0.55), 0 0 ${isActive ? '40px' : '16px'} ${node.accent}${isActive ? '35' : '15'}`
                  : '0 4px 20px rgba(0,0,0,0.3)',
                background: 'rgba(8,10,7,0.94)',
                transition: 'border-color 0.35s, box-shadow 0.35s',
                position: 'relative',
              }}>
                <div style={{ position: 'relative', height: imgH, overflow: 'hidden' }}>
                  <img
                    src={node.image}
                    alt={node.label}
                    draggable={false}
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      opacity: isActive ? 1 : 0.55,
                      transition: 'opacity 0.35s',
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(to bottom, transparent 30%, rgba(8,10,7,0.85) 100%)`,
                  }} />
                  <div style={{
                    position: 'absolute', top: 10, right: 10,
                    fontSize: '1rem', color: node.accent,
                    opacity: isActive ? 1 : 0.55,
                    filter: isActive ? `drop-shadow(0 0 8px ${node.accent})` : 'none',
                  }}>
                    {node.icon}
                  </div>
                  {isFocused && (
                    <div style={{
                      position: 'absolute', top: 10, left: 10,
                      padding: '3px 9px', borderRadius: 20,
                      background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(8px)',
                      border: `1px solid ${node.accent}40`,
                      fontFamily: 'var(--font-body)', fontSize: FS.micro,
                      letterSpacing: '0.16em', textTransform: 'uppercase', color: node.accent,
                    }}>
                      Active
                    </div>
                  )}
                </div>

                <div style={{ padding: '10px 12px 12px' }}>
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
                    letterSpacing: '0.04em',
                    color: isActive ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.55)',
                    lineHeight: 1.3, transition: 'color 0.35s',
                  }}>
                    {node.label}
                  </span>
                  <span style={{
                    display: 'block',
                    fontFamily: 'var(--font-body)', fontSize: FS.micro,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: `${node.accent}${isActive ? '' : '70'}`,
                    marginTop: 3,
                  }}>
                    {node.sub}
                  </span>
                </div>

                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${node.accent}, transparent)`,
                  opacity: isActive ? 1 : 0.2,
                  transition: 'opacity 0.35s',
                }} />
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Focus HUD — works for touch + mouse */}
      <motion.div
        key={focusedNode.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        style={{
          maxWidth: 640, margin: '0 auto',
          padding: '0 clamp(24px, 5vw, 80px)',
          position: 'relative', zIndex: 6,
        }}
      >
        <motion.div
          initial={{ scale: 0.98 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          style={{
            display: 'flex', alignItems: 'center', gap: 20,
            padding: 'clamp(20px, 3vw, 28px) clamp(22px, 3.5vw, 32px)',
            borderRadius: 18,
            background: 'rgba(255,255,255,0.035)',
            border: `1px solid ${focusedNode.accent}30`,
            backdropFilter: 'blur(14px)',
            boxShadow: `0 20px 60px rgba(0,0,0,0.35), 0 0 40px ${focusedNode.accent}08`,
          }}
          >
          <span style={{
            fontSize: '2rem', color: focusedNode.accent,
            filter: `drop-shadow(0 0 12px ${focusedNode.accent}60)`,
          }}>
            {focusedNode.icon}
          </span>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{
              display: 'block', fontFamily: 'var(--font-body)', fontSize: FS.label,
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: focusedNode.accent, marginBottom: 6, opacity: 0.9,
            }}>
              Now facing · {focusedNode.sub}
            </span>
            <span style={{
              display: 'block', fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.2rem, 2.5vw, 1.6rem)', fontWeight: 300,
              color: 'var(--cream, #F5F0E8)', marginBottom: 6,
            }}>
              {focusedNode.label}
            </span>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: FS.hud,
              color: 'rgba(255,255,255,0.45)', lineHeight: 1.65,
            }}>
              {focusedNode.story}
            </span>
          </div>
          <button
            onClick={() => openNode(focusedNode)}
            style={{
              flexShrink: 0, padding: '14px 28px',
              background: `${focusedNode.accent}22`,
              border: `1px solid ${focusedNode.accent}50`,
              color: focusedNode.accent, borderRadius: 12,
              fontFamily: 'var(--font-body)', fontSize: FS.cta,
              letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 700,
              cursor: 'pointer', whiteSpace: 'nowrap',
            }}
          >
            Enter →
          </button>
        </motion.div>
      </motion.div>

      {/* Quick-jump strip */}
      <div style={{
        display: 'flex', justifyContent: 'center', flexWrap: 'wrap',
        gap: 8, marginTop: 28,
        padding: '0 clamp(24px, 5vw, 80px)',
      }}>
        {VILLAGE_NODES.map(node => (
          <button
            key={`jump-${node.id}`}
            onClick={() => beginSnap(node)}
            onDoubleClick={() => openNode(node)}
            style={{
              padding: '10px 18px', borderRadius: 22,
              background: node.id === focusedId ? `${node.accent}16` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${node.id === focusedId ? node.accent + '45' : 'rgba(255,255,255,0.08)'}`,
              color: node.id === focusedId ? node.accent : 'rgba(255,255,255,0.4)',
              fontFamily: 'var(--font-body)', fontSize: FS.label,
              letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.3s',
            }}
          >
            {node.icon} {node.label}
          </button>
        ))}
      </div>
    </section>

    {/* Portal modal — outside overflow containers */}
    <AnimatePresence>
      {activeNode && (
        <VillageNodeModal
          node={activeNode}
          exhibits={exhibits}
          onOpenExhibit={onOpenExhibit}
          onClose={() => setActiveNode(null)}
        />
      )}
    </AnimatePresence>
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DAY RHYTHM NARRATIVE STRIP (replaces stats ticker)
// ─────────────────────────────────────────────────────────────────────────────

const DAY_MOMENTS = [
  { time: '5:30', label: 'Sunrise', desc: 'The farm wakes before the artists', icon: '◐', accent: '#F0C870' },
  { time: '7:00', label: 'Morning Creation', desc: 'Studios open. Kilns lit. Clay turns.', icon: '◑', accent: '#D4A853' },
  { time: '10:00', label: 'Workshop Sessions', desc: 'Makers and guests at the same bench', icon: '◎', accent: '#B8A9F0' },
  { time: '13:00', label: 'Midday Market', desc: 'The hall opens. Voices. Colour. Trade.', icon: '⊞', accent: '#F0A8B8' },
  { time: '16:30', label: 'Golden Hour', desc: 'Artists stop. The light does the work.', icon: '✦', accent: '#E8956D' },
  { time: '20:00', label: 'Fire Circle', desc: 'Stories, song, and open sky.', icon: '◉', accent: '#A8D8F0' },
]

function DayRhythm() {
  const [active, setActive] = useState(1)

  return (
    <div style={{
      borderTop: '1px solid rgba(255,255,255,0.04)',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      background: 'rgba(255,255,255,0.015)',
      position: 'relative', zIndex: 10,
      overflowX: 'auto',
      scrollbarWidth: 'none',
    }}>
      <div style={{
        display: 'flex',
        minWidth: 'max-content',
        padding: '0 clamp(20px, 4vw, 60px)',
      }}>
        {DAY_MOMENTS.map((m, i) => (
          <button
            key={m.label}
            onClick={() => setActive(i)}
            style={{
              padding: '28px 28px',
              background: 'none',
              border: 'none',
              borderRight: '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer',
              position: 'relative',
              textAlign: 'left',
              transition: 'background 0.3s',
            }}
          >
            {/* Active indicator */}
            {active === i && (
              <motion.div
                layoutId="day-active"
                style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${m.accent}, transparent)`,
                }}
              />
            )}

            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 6 }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: active === i ? '1.5rem' : '1.2rem',
                fontWeight: 300,
                color: active === i ? m.accent : 'rgba(255,255,255,0.2)',
                transition: 'all 0.4s',
                letterSpacing: '-0.01em',
              }}>
                {m.time}
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: FS.micro,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: active === i ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.1)',
                transition: 'color 0.4s',
              }}>AM</span>
            </div>
            <div style={{
              fontFamily: 'var(--font-body)', fontSize: FS.cta,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              color: active === i ? m.accent : 'rgba(255,255,255,0.22)',
              marginBottom: 4,
              transition: 'color 0.4s',
              whiteSpace: 'nowrap',
            }}>
              {m.label}
            </div>
            {active === i && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
                  color: 'rgba(255,255,255,0.3)',
                  lineHeight: 1.6, maxWidth: 180,
                  whiteSpace: 'normal',
                }}
              >
                {m.desc}
              </motion.div>
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 03 — LIVING STUDIOS (Exhibit Grid)
// ─────────────────────────────────────────────────────────────────────────────

function LivingStudios({ exhibits, onOpen }: { exhibits: Exhibit[]; onOpen: (e: Exhibit) => void }) {
  return (
    <section id="living-studios" style={{
      maxWidth: 1300, margin: '0 auto',
      padding: '100px clamp(24px, 5vw, 80px) 80px',
      position: 'relative', zIndex: 10,
    }}>
      {/* Chapter header */}
      <div style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.4)' }}>03</span>
          <div style={{ width: 44, height: 1, background: 'rgba(212,168,83,0.22)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.4)' }}>Living Studios</span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
          fontWeight: 300, color: 'var(--cream, #F5F0E8)',
          lineHeight: 1.05, marginBottom: 16,
        }}>
          Art Rooted<br />in This Land.
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: FS.body,
          color: 'rgba(255,255,255,0.32)', lineHeight: 1.9,
          maxWidth: 480, letterSpacing: '0.01em',
        }}>
          Every exhibition at Ubuntu Kreative Village is commissioned for these walls,
          this light, this soil. Nothing arrives from elsewhere.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 28,
      }}>
        {exhibits.map((exhibit, i) => (
          <ExhibitVaultCard
            key={exhibit.id}
            exhibit={exhibit}
            onOpen={onOpen}
            delay={i * 0.14}
          />
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVING MOMENTS RAIL (replaces horizontal image strip)
// Mix of images + video moments + text stories
// ─────────────────────────────────────────────────────────────────────────────

type Moment = {
  type: 'image' | 'story' | 'video-hint'
  src?: string
  label: string
  caption: string
  time?: string
  accent: string
}

const MOMENTS: Moment[] = [
  { type: 'image', src: 'https://images.unsplash.com/photo-1531913764164-f85c52e6e654?w=700&q=80', label: 'Studio · 7am', caption: 'Grace kneads the morning\'s first batch of clay', time: '07:14', accent: '#D4A853' },
  { type: 'story', label: 'The first throw', caption: '"I learned this from my grandmother. She never used a wheel — all hand. All memory." — Grace Wanjiku, Pottery Studio', accent: '#B8A9F0' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=700&q=80', label: 'Pottery · Dawn', caption: 'Wheel-thrown vessels wait for the kiln', time: '08:30', accent: '#D4A853' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80', label: 'Dye Lab · Morning', caption: 'Turmeric, avocado seed, onion skin — slow colour', time: '09:20', accent: '#E8956D' },
  { type: 'story', label: 'A colour has a name', caption: '"This yellow comes from turmeric we grew twenty metres from this sink. That\'s the only kind of colour I trust." — Ubuntu Artisan', accent: '#F0C870' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1573408301185-9519f94815b4?w=700&q=80', label: 'Bead Workshop · 10am', caption: 'Teaching the language of colour and pattern', time: '10:15', accent: '#B8A9F0' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=700&q=80', label: 'Farm · Harvest', caption: 'The food that feeds the fire circle tonight', time: '11:00', accent: '#00C851' },
  { type: 'video-hint', label: 'Afternoon · Gallery', caption: 'The gallery in golden afternoon light — a quiet hour before visitors', accent: '#A8D8F0' },
  { type: 'image', src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=700&q=80', label: 'Golden Hour', caption: 'The farm dissolves into light at 16:30', time: '16:30', accent: '#F0C870' },
]

function LivingMomentsRail() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const startX = useRef(0)
  const scrollLeft = useRef(0)

  return (
    <section id="makers-alive" style={{ padding: '80px 0', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{
        padding: '0 clamp(24px, 5vw, 80px)', marginBottom: 36,
        display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16,
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.4)' }}>04</span>
            <div style={{ width: 36, height: 1, background: 'rgba(212,168,83,0.2)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.4)' }}>Makers Alive</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3.5vw, 2.6rem)',
            fontWeight: 300, color: 'var(--cream, #F5F0E8)',
          }}>
            One Day in the Village
          </h2>
        </div>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: FS.label,
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.18)',
        }}>
          ← Drag to follow the day →
        </span>
      </div>

      {/* Scrollable rail */}
      <div
        ref={trackRef}
        onMouseDown={e => { setIsDragging(true); startX.current = e.pageX - (trackRef.current?.offsetLeft ?? 0); scrollLeft.current = trackRef.current?.scrollLeft ?? 0 }}
        onMouseMove={e => { if (!isDragging || !trackRef.current) return; e.preventDefault(); trackRef.current.scrollLeft = scrollLeft.current - (e.pageX - (trackRef.current.offsetLeft ?? 0) - startX.current) }}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
        style={{
          display: 'flex', gap: 14,
          overflowX: 'auto', overflowY: 'hidden',
          padding: '0 clamp(24px, 5vw, 80px) 20px',
          cursor: isDragging ? 'grabbing' : 'grab',
          scrollbarWidth: 'none',
          userSelect: 'none',
          WebkitOverflowScrolling: 'touch',
          alignItems: 'center',
        } as React.CSSProperties}
      >
        {MOMENTS.map((m, i) => {
          const isStory = m.type === 'story'
          const isVideoHint = m.type === 'video-hint'

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: Math.min(i * 0.06, 0.4) }}
              viewport={{ once: true, margin: '-40px' }}
              style={{
                flexShrink: 0,
                width: isStory ? 'clamp(220px, 22vw, 300px)' : 'clamp(240px, 26vw, 340px)',
                borderRadius: 16,
                overflow: 'hidden',
                position: 'relative',
                border: `1px solid ${isStory ? m.accent + '22' : 'rgba(255,255,255,0.05)'}`,
                background: isStory ? `${m.accent}06` : 'rgba(10,12,9,0.9)',
                alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end',
                marginTop: i % 2 === 0 ? 0 : 24,
              }}
            >
              {isStory ? (
                /* Quote card */
                <div style={{ padding: '28px 24px 24px' }}>
                  <div style={{
                    fontSize: '1.8rem', color: m.accent, opacity: 0.4,
                    fontFamily: 'Georgia, serif', lineHeight: 1,
                    marginBottom: 12,
                  }}>
                    "
                  </div>
                  <p style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '11.5px',
                    color: 'rgba(255,255,255,0.55)',
                    lineHeight: 1.85,
                    letterSpacing: '0.01em',
                    marginBottom: 20,
                    fontStyle: 'italic',
                  }}>
                    {m.caption}
                  </p>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: FS.label,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: m.accent, opacity: 0.7,
                  }}>
                    {m.label}
                  </span>
                </div>
              ) : isVideoHint ? (
                /* Video hint card — placeholder for a real video */
                <div style={{
                  height: 'clamp(180px, 20vw, 240px)',
                  background: `linear-gradient(135deg, rgba(10,12,9,0.95), ${m.accent}12)`,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center', gap: 12,
                  padding: 24,
                }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: '50%',
                    background: `${m.accent}18`,
                    border: `1px solid ${m.accent}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill={m.accent}><path d="M8 5v14l11-7z"/></svg>
                  </div>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: FS.cta,
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: m.accent, textAlign: 'center',
                  }}>{m.label}</span>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
                    color: 'rgba(255,255,255,0.3)', textAlign: 'center', lineHeight: 1.6,
                  }}>{m.caption}</span>
                </div>
              ) : (
                /* Image card */
                <>
                  <div style={{ position: 'relative', height: 'clamp(160px, 18vw, 230px)', overflow: 'hidden' }}>
                    <img
                      src={m.src}
                      alt={m.label}
                      draggable={false}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
                    />
                    <div style={{
                      position: 'absolute', inset: 0,
                      background: 'linear-gradient(to bottom, transparent 40%, rgba(10,12,9,0.85) 100%)',
                    }} />
                    {m.time && (
                      <span style={{
                        position: 'absolute', top: 12, left: 14,
                        fontFamily: 'var(--font-body)', fontSize: FS.label,
                        letterSpacing: '0.12em', color: m.accent,
                        background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)',
                        padding: '3px 9px', borderRadius: 20,
                        border: `1px solid ${m.accent}30`,
                      }}>
                        {m.time}
                      </span>
                    )}
                  </div>
                  <div style={{ padding: '12px 16px 16px' }}>
                    <span style={{
                      display: 'block', fontFamily: 'var(--font-body)', fontSize: FS.label,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: m.accent, marginBottom: 5, opacity: 0.8,
                    }}>
                      {m.label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
                      color: 'rgba(255,255,255,0.35)', lineHeight: 1.65,
                    }}>
                      {m.caption}
                    </span>
                  </div>
                </>
              )}
            </motion.div>
          )
        })}
        <div style={{ flexShrink: 0, width: 'clamp(24px, 5vw, 80px)' }} />
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSHOPS — Alive, with urgency, real people
// ─────────────────────────────────────────────────────────────────────────────

function WorkshopsAlive({ workshops }: { workshops: Workshop[] }) {
  return (
    <section style={{
      maxWidth: 1300, margin: '0 auto',
      padding: '80px clamp(24px, 5vw, 80px) 100px',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      position: 'relative', zIndex: 10,
    }}>
      <div style={{ marginBottom: 60 }}>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
          fontWeight: 300, color: 'var(--cream, #F5F0E8)',
          lineHeight: 1.05, marginBottom: 16,
        }}>
          Come Make<br />Something.
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: FS.body,
          color: 'rgba(255,255,255,0.32)', lineHeight: 1.9, maxWidth: 460,
        }}>
          These are not classes. They are shared sessions between a master and a guest.
          No experience required — only willingness.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 22,
      }}>
        {workshops.map((w, idx) => {
          const spotsPercent = Math.round((w.spotsLeft / w.spots) * 100)
          const urgent = w.spotsLeft <= 2
          const almostFull = w.spotsLeft <= 4

          return (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-40px' }}
              style={{
                borderRadius: 18, overflow: 'hidden',
                background: 'rgba(10,12,8,0.88)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column',
              }}
              whileHover={{
                borderColor: `${w.accent}30`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 50px ${w.accent}08`,
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
                <motion.img
                  src={w.image}
                  alt={w.title}
                  whileHover={{ scale: 1.04 }}
                  transition={{ duration: 0.8 }}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(10,12,8,0.05) 0%, rgba(10,12,8,0.82) 100%)',
                }} />
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${w.accent}80, transparent)`,
                }} />

                {/* Live session indicator */}
                <div style={{ position: 'absolute', top: 14, left: 14 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', borderRadius: 20,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                    border: `1px solid ${urgent ? 'rgba(255,100,100,0.3)' : w.accent + '30'}`,
                  }}>
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      style={{
                        width: 4, height: 4, borderRadius: '50%', display: 'block',
                        background: urgent ? '#ff6b6b' : w.accent,
                      }}
                    />
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: FS.micro,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: urgent ? '#ff8888' : w.accent,
                    }}>
                      {urgent ? `${w.spotsLeft} left` : almostFull ? `${w.spotsLeft} spaces` : 'Open'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: FS.label,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: w.accent, marginBottom: 8, display: 'block', opacity: 0.85,
                }}>
                  {w.date}
                </span>

                <h3 style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem', fontWeight: 300,
                  color: 'var(--cream, #F5F0E8)',
                  lineHeight: 1.15, marginBottom: 10,
                }}>
                  {w.title}
                </h3>

                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
                  color: 'rgba(255,255,255,0.38)',
                  lineHeight: 1.85, flex: 1, marginBottom: 18,
                }}>
                  {w.description}
                </p>

                {/* Availability bar */}
                <div style={{ marginBottom: 18 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>
                      Availability
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: FS.label,
                      color: urgent ? '#ff8888' : w.accent,
                    }}>
                      {w.spotsLeft} of {w.spots}
                    </span>
                  </div>
                  <div style={{ height: 2.5, background: 'rgba(255,255,255,0.05)', borderRadius: 2 }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${spotsPercent}%` }}
                      transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
                      viewport={{ once: true }}
                      style={{
                        height: '100%', borderRadius: 2,
                        background: urgent ? '#ff6b6b' : w.accent,
                      }}
                    />
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.04)',
                }}>
                  <div>
                    <span style={{
                      display: 'block', fontFamily: 'var(--font-body)', fontSize: FS.label,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      color: 'rgba(255,255,255,0.18)', marginBottom: 3,
                    }}>
                      {w.facilitator} · {w.duration}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem', fontWeight: 300,
                      color: 'var(--cream, #F5F0E8)',
                    }}>
                      KES {w.price.toLocaleString()}
                    </span>
                  </div>
                  <Link href="/contact" style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: `1px solid ${w.accent}38`,
                    background: `${w.accent}0c`,
                    color: w.accent,
                    fontFamily: 'var(--font-body)',
                    fontSize: FS.label, letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                  }}>
                    Reserve →
                  </Link>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 05 — FIRE CIRCLE (Craft Market + Evening)
// ─────────────────────────────────────────────────────────────────────────────

function FireCircle({ craftMarket }: { craftMarket: CraftMarketItem[] }) {
  const [active, setActive] = useState<number | null>(null)

  return (
    <section id="fire-circle" style={{
      position: 'relative', zIndex: 10,
      borderTop: '1px solid rgba(255,255,255,0.04)',
      padding: '100px 0 120px',
      overflow: 'hidden',
    }}>
      {/* Warm ember glow from bottom */}
      <div style={{
        position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)',
        width: '80vw', height: '40vh',
        background: 'radial-gradient(ellipse at bottom, rgba(200,120,40,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      <div style={{ maxWidth: 1300, margin: '0 auto', padding: '0 clamp(24px, 5vw, 80px)' }}>
        {/* Chapter header */}
        <div style={{ marginBottom: 64, maxWidth: 680 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.38em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.4)' }}>05</span>
            <div style={{ width: 44, height: 1, background: 'rgba(212,168,83,0.2)' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.4)' }}>Fire Circle</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4.5vw, 3.5rem)',
            fontWeight: 300, color: 'var(--cream, #F5F0E8)',
            lineHeight: 1.05, marginBottom: 16,
          }}>
            Meet the<br />Makers.
        </h2>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: FS.body,
            color: 'rgba(255,255,255,0.32)', lineHeight: 1.9,
          }}>
            At the heart of Ubuntu Village is an economy of human craft. Virtuoso Kreative artisans
            who eat at the same table, share the same land, and sell by hand.
          </p>
        </div>

        {/* Guild tiles — organic masonry-feel grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))',
          gap: 14,
        }}>
          {craftMarket.map((cm, idx) => (
            <motion.div
              key={cm.category}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-30px' }}
              onMouseEnter={() => setActive(idx)}
              onMouseLeave={() => setActive(null)}
              style={{
                borderRadius: 16,
                padding: '24px 18px 22px',
                background: active === idx ? `${cm.accent}07` : 'rgba(255,255,255,0.018)',
                border: `1px solid ${active === idx ? cm.accent + '2e' : 'rgba(255,255,255,0.045)'}`,
                cursor: 'default',
                position: 'relative', overflow: 'hidden',
                transition: 'all 0.35s ease',
              }}
            >
              {/* Glow on hover */}
              <AnimatePresence>
                {active === idx && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                      position: 'absolute', inset: 0, pointerEvents: 'none',
                      background: `radial-gradient(ellipse 80% 55% at 50% -10%, ${cm.accent}10, transparent 65%)`,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <div style={{
                fontSize: '1.35rem', marginBottom: 16,
                color: cm.accent,
                filter: active === idx ? `drop-shadow(0 0 10px ${cm.accent}80)` : 'none',
                transition: 'filter 0.35s',
              }}>
                {cm.icon}
              </div>

              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem', fontWeight: 300,
                color: 'var(--cream, #F5F0E8)',
                marginBottom: 8, lineHeight: 1.2,
              }}>
                {cm.category}
              </h4>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
                color: 'rgba(255,255,255,0.35)', lineHeight: 1.75,
                marginBottom: 16,
              }}>
                {cm.description}
              </p>

              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                paddingTop: 12,
                borderTop: '1px solid rgba(255,255,255,0.04)',
              }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: FS.label,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.2)',
                }}>
                  {cm.vendors} makers
                </span>
                <span style={{
                  padding: '3px 10px', borderRadius: 20,
                  background: `${cm.accent}0e`,
                  border: `1px solid ${cm.accent}22`,
                  fontFamily: 'var(--font-body)', fontSize: FS.micro,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: cm.accent,
                }}>
                  {cm.days}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Closing invitation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, margin: '-60px' }}
          style={{
            marginTop: 80,
            padding: '52px clamp(28px, 5vw, 72px)',
            borderRadius: 20,
            background: 'rgba(200,169,110,0.04)',
            border: '1px solid rgba(200,169,110,0.1)',
            textAlign: 'center',
            position: 'relative', overflow: 'hidden',
          }}
        >
          {/* Warm gradient centre */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'radial-gradient(ellipse 60% 80% at 50% 100%, rgba(200,169,110,0.06), transparent 65%)',
          }} />

          <div style={{
            fontFamily: 'var(--font-body)', fontSize: FS.label,
            letterSpacing: '0.34em', textTransform: 'uppercase',
            color: 'rgba(200,169,110,0.5)', marginBottom: 18,
          }}>
            Every evening · Sunset until late
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.8rem, 4vw, 3rem)',
            fontWeight: 300, color: 'var(--cream, #F5F0E8)',
            lineHeight: 1.1, marginBottom: 18,
          }}>
            Join Us at the<br />Fire Circle.
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: FS.body,
            color: 'rgba(255,255,255,0.32)', lineHeight: 1.9,
            maxWidth: 460, margin: '0 auto 36px',
          }}>
            Guests, artists, villagers, and strangers gather at dusk.
            Someone tells a story. Someone plays. Someone just listens.
            The fire is always lit.
          </p>
          <Link href="/contact" style={{
            display: 'inline-block',
            padding: '15px 40px',
            background: '#C8A96E',
            color: '#06090A',
            fontFamily: 'var(--font-body)',
            fontSize: FS.cta, letterSpacing: '0.24em',
            textTransform: 'uppercase', fontWeight: 700,
            borderRadius: 8, textDecoration: 'none',
          }}>
            Plan Your Visit →
          </Link>
        </motion.div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ENHANCEMENT · Ambient Sound Toggle
// ─────────────────────────────────────────────────────────────────────────────
function AmbientSoundToggle() {
  const [isOn, setIsOn] = useState(false)
  const audioCtx = useRef<AudioContext | null>(null)
  const osc = useRef<OscillatorNode | null>(null)
  const filter = useRef<BiquadFilterNode | null>(null)
  const gain = useRef<GainNode | null>(null)

  const startAmbient = useCallback(() => {
    if (audioCtx.current) return // Already running
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
    audioCtx.current = ctx

    // Create pink noise via oscillator + filter
    const osc = ctx.createOscillator()
    const filter = ctx.createBiquadFilter()
    const gain = ctx.createGain()

    filter.type = 'lowpass'
    filter.frequency.value = 400
    gain.gain.value = 0.04

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start()
    setIsOn(true)

    audioCtx.current = ctx
  }, [])

  const stopAmbient = useCallback(() => {
    if (!audioCtx.current) return
    try {
      audioCtx.current.close()
    } catch {}
    audioCtx.current = null
    setIsOn(false)
  }, [])

  const toggle = useCallback(() => {
    if (isOn) stopAmbient()
    else startAmbient()
  }, [isOn, startAmbient, stopAmbient])

  return (
    <motion.button
      onClick={toggle}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed', bottom: 40, left: 24, zIndex: 8100,
        padding: '12px 18px',
        borderRadius: 12,
        background: isOn ? 'rgba(200,168,83,0.12)' : 'rgba(255,255,255,0.04)',
        border: `1px solid ${isOn ? 'rgba(200,168,83,0.4)' : 'rgba(255,255,255,0.08)'}`,
        color: isOn ? '#C8A96E' : 'rgba(255,255,255,0.4)',
        fontFamily: 'var(--font-body)',
        fontSize: '11px', letterSpacing: '0.15em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 8,
        backdropFilter: 'blur(12px)',
        transition: 'all 0.4s ease',
      }}
    >
      <span>{isOn ? '〰' : '🔇'}</span>
      Ambient
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ENHANCEMENT · Scroll Progress Thread
// ─────────────────────────────────────────────────────────────────────────────
function ScrollProgressThread() {
  const { scrollYProgress } = useScroll()
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 5,
        width: '1px',
        background: 'rgba(255,255,255,0.06)',
        scaleY,
        transformOrigin: 'top',
      }}
    >
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(200,168,83,0.55)',
          scaleY,
          transformOrigin: 'top',
        }}
      />
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ENHANCEMENT · Fire Circle Ember Particles
// ─────────────────────────────────────────────────────────────────────────────
function EmberParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const updateSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateSize()
    window.addEventListener('resize', updateSize)

    // Particle system
    interface Particle {
      x: number
      y: number
      vx: number
      vy: number
      alpha: number
      life: number
    }
    const particles: Particle[] = []
    const colors = ['#C8A855', '#D4A844', '#E8A566', '#F0A366']

    const spawnEmber = () => {
      // Spawn from bottom edge, particles grow upward to fill hero
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height,
        vx: (Math.random() - 0.5) * 0.6,
        vy: -2.2 - Math.random() * 1.2,
        alpha: Math.random() * 0.28 + 0.1,
        life: 1,
      })
    }

    let frameCount = 0
    let animationId: number

    const animate = () => {
      // Spawn new particles frequently to fill bottom completely
      if (frameCount % 4 === 0 && particles.length < 32) spawnEmber()
      frameCount++

      // Clear canvas
      ctx.fillStyle = 'rgba(6, 9, 10, 0)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]

        // Update position
        p.x += p.vx
        p.y += p.vy
        p.life -= 0.01
        p.alpha = Math.max(0, p.life * 0.45)

        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }

        // Draw particle
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)]
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, 2 + Math.random(), 0, Math.PI * 2)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', updateSize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ENHANCEMENT · Hero Subtitle Typewriter
// ─────────────────────────────────────────────────────────────────────────────
function TypewriterParagraph({ text, delay }: { text: string; delay: number }) {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    // First fade in the container
    const fadeTimer = setTimeout(() => {
      let index = 0
      const interval = setInterval(() => {
        if (index < text.length) {
          setDisplayedText(text.substring(0, index + 1))
          index++
        } else {
          setIsComplete(true)
          clearInterval(interval)
        }
      }, 28)
      return () => clearInterval(interval)
    }, delay * 1000)

    return () => clearTimeout(fadeTimer)
  }, [text, delay])

  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay }}
      style={{
        fontFamily: 'var(--font-display)',
        fontSize: 'clamp(18px, 2.1vw, 24px)',
        color: 'rgba(255,255,255,0.75)',
        lineHeight: 2.1,
        maxWidth: 700,
        margin: '32px 0 48px',
        letterSpacing: '0.02em',
        minHeight: '5em',
        paddingBottom: '0.25em',
        fontWeight: 300,
      }}
    >
      {displayedText}
      {!isComplete && <span style={{ animation: 'blink 0.7s infinite', marginLeft: '2px' }}>|</span>}
      <style>{`
        @keyframes blink {
          0%, 49% { opacity: 1; }
          50%, 100% { opacity: 0; }
        }
      `}</style>
    </motion.p>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export function GalleryClient({ exhibits, workshops, craftMarket, stats }: Props) {
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null)
  const [cursorAccent, setCursorAccent] = useState('#C8A96E')

  useEffect(() => {
    if (selectedExhibit) {
      const a = selectedExhibit.accent
      setCursorAccent(
        a === 'var(--gold)' ? '#D4A853'
        : a === 'var(--neon)' ? '#00C851'
        : a
      )
    } else {
      setCursorAccent('#C8A96E')
    }
  }, [selectedExhibit])

  const openExhibit  = useCallback((e: Exhibit) => setSelectedExhibit(e), [])
  const closeExhibit = useCallback(() => setSelectedExhibit(null), [])

  return (
    <main style={{
      minHeight: '100vh',
      background: '#06090A',
      color: 'var(--cream, #F5F0E8)',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Global atmosphere */}
      <LivingBackground accent={cursorAccent} />
      <MagneticCursor accentColor={cursorAccent} />
      
      {/* New enhancements */}
      <ScrollProgressThread />
      <AmbientSoundToggle />
      <EmberParticles />

      {/* Optional nav */}
      {NavWrapper && <NavWrapper />}

      <GalleryChapterNav />

      {/* ── 01 Arrival ── */}
      <ArrivalHero exhibits={exhibits} />

      {/* ── Day rhythm ── */}
      <DayRhythm />

      {/* ── 02 Village OS ── */}
      <VillageOS exhibits={exhibits} onOpenExhibit={openExhibit} />

      {/* ── 03 Living Studios ── */}
      <LivingStudios exhibits={exhibits} onOpen={openExhibit} />

      {/* ── 04 Living Moments Rail ── */}
      <LivingMomentsRail />

      {/* ── Workshops ── */}
      <WorkshopsAlive workshops={workshops} />

      {/* ── 05 Fire Circle ── */}
      <FireCircle craftMarket={craftMarket} />

      {/* Optional global components */}
      {MoxieChat && <MoxieChat className="glass-panel" />}
      {Footer && <Footer />}

      {/* Immersive exhibit modal */}
      <AnimatePresence mode="wait">
        {selectedExhibit && (
          <ImmersiveExhibit
            key={selectedExhibit.id}
            exhibit={selectedExhibit}
            onClose={closeExhibit}
          />
        )}
      </AnimatePresence>
    </main>
  )
}