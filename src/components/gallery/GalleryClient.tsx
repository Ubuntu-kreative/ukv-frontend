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
import Image from 'next/image'
import { motion, AnimatePresence, MotionConfig, useReducedMotion, useScroll, useTransform, useSpring } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade } from 'swiper/modules'
import type { Swiper as SwiperType } from 'swiper'
import 'swiper/css'
import 'swiper/css/effect-fade'

import type { Exhibit, Workshop, CraftMarketItem, GalleryPhoto } from './Gallery.data'
import { HERO_VIDEO, HERO_SLIDES, PHOTOS_BY_CHAPTER } from './Gallery.data'
import { ExhibitVaultCard } from './Exhibitvaultcard'
import { ImmersiveExhibit } from './Immersiveexhibit'
import { LivingBackground } from './Livingbackground'
import { MagneticCursor } from './Magneticcursor'
import { VideoPlayer } from './VideoPlayer'

// Phase 1: Photo-first storytelling components
import { ImageLightbox } from './ImageLightbox'
import { LatestMemoriesChapter } from './LatestMemoriesChapter'
import { PhotoCluster } from './PhotoCluster'
import { GalleryHighlights } from './GalleryHighlights'

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
  photos?:     GalleryPhoto[]  // Phase 1: Optional photos for gallery chapters
}

function useHasFinePointer() {
  const [hasFinePointer, setHasFinePointer] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(pointer: fine)')
    const update = () => setHasFinePointer(mediaQuery.matches)
    update()
    mediaQuery.addEventListener('change', update)
    window.addEventListener('resize', update)
    return () => {
      mediaQuery.removeEventListener('change', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  return hasFinePointer
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
  ring: 'inner' | 'outer'
  story: string
  image: string
  hours: string
  highlights: string[]
}

const VILLAGE_NODES: VillageNode[] = [
  {
    id: 'art-gallery',
    label: 'Art Gallery',
    sub: 'Main Hall',
    icon: '◈',
    accent: '#A8D8F0',
    ring: 'outer',
    story: 'Three living exhibitions of African contemporary art — rotating with the seasons of the village.',
    image: '/images/Tropical-Art-Gallery.jpeg',
    hours: 'Daily · 9am – 6pm',
    highlights: ['3 rotating exhibitions', 'Guided tours on request', 'Artist talks every Saturday'],
  },
  {
    id: 'pottery',
    label: 'Pottery Studio',
    sub: 'Earth & Fire',
    icon: '◎',
    accent: '#D4A853',
    ring: 'outer',
    story: 'Wheel-thrown vessels shaped from soil found fifty metres from this studio. Clay from the Ubuntu land.',
    image: '/images/Wheel-Pottery-&-Wood-Firing.jpeg',
    hours: 'Mon – Sat · 7am – 4pm',
    highlights: ['Live wheel demonstrations', 'Village clay source', 'Take home your piece'],
  },
  {
    id: 'bead-workshop',
    label: 'Bead Workshop',
    sub: 'Pattern & Memory',
    icon: '◉',
    accent: '#B8A9F0',
    ring: 'outer',
    story: 'Traditional Maasai beadwork. Each colour carries meaning across generations, season, and ceremony.',
    image: '/images/Maasai-Beadwork-Intensive.jpeg',
    hours: 'Tue – Sun · 10am – 5pm',
    highlights: ['Maasai colour language', 'Beginner-friendly sessions', 'Custom pattern design'],
  },
  {
    id: 'story-circle',
    label: 'Story Circle',
    sub: 'Fire & Voice',
    icon: '✦',
    accent: '#E8956D',
    ring: 'outer',
    story: 'At dusk, the fire circle opens. Elders, artists, and guests share stories under the open sky.',
    image: '/images/Story-Circle.jpeg',
    hours: 'Every evening · Sunset – late',
    highlights: ['Open-air gathering', 'Live music & poetry', 'All guests welcome'],
  },
  {
    id: 'market-hall',
    label: 'Market Hall',
    sub: 'Makers & Craft',
    icon: '⊞',
    accent: '#F0A8B8',
    ring: 'outer',
    story: 'Virtuoso Kreative artisans, six guilds, one hall. A living market that breathes with the morning sun.',
    image: '/images/Garden-Gathering-Oasis.jpeg',
    hours: 'Wed – Sun · 8am – 3pm',
    highlights: ['23 village artisans', '6 craft guilds', 'Direct-from-maker pricing'],
  },
  {
    id: 'farm',
    label: 'Farm Experience',
    sub: 'Harvest & Land',
    icon: '◐',
    accent: '#00C851',
    ring: 'outer',
    story: 'Walk the harvest rows at dawn. Pick herbs. Understand where your dinner begins.',
    image: '/images/First-Light-Walk.jpeg',
    hours: 'Daily · Dawn tours at 5:30am',
    highlights: ['Harvest walk & pick', 'Farm-to-table connection', 'Herb & spice garden'],
  },
  {
    id: 'wellness',
    label: 'Wellness Pavilion',
    sub: 'Rest & Ritual',
    icon: '◑',
    accent: '#A8F0D8',
    ring: 'outer',
    story: 'Baobab oil, shea, morning stretching in open air. Wellness as craft, not commodity.',
    image: '/images/Arohamai-Signature-Healing-Package.jpeg',
    hours: 'Daily · 6am – 8pm',
    highlights: ['Open-air yoga', 'Baobab & shea rituals', 'Quiet rest pavilion'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER 01 — ARRIVAL HERO
// ─────────────────────────────────────────────────────────────────────────────

// ─────────────────────────────────────────────────────────────────────────────
// HERO BACKGROUND CAROUSEL — 7 images, autoplay + manual swipe/scroll.
// Fade transition (matches the cinematic dissolve feel of the rest of the
// hero). Pauses autoplay while the user is actively dragging/touching and
// resumes shortly after they let go (Swiper's disableOnInteraction:false +
// pauseOnMouseEnter handles this without extra wiring).
// ─────────────────────────────────────────────────────────────────────────────

function HeroBackgroundCarousel({
  fallback,
  onSwiper,
  onSlideChange,
}: {
  fallback?: string
  onSwiper?: (swiper: SwiperType) => void
  onSlideChange?: (index: number) => void
}) {
  const slides = HERO_SLIDES.length > 0
    ? HERO_SLIDES
    : [{ id: 'fallback', image: fallback ?? '', alt: 'Ubuntu Kreative Village' }]

  return (
    <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
      <Swiper
        modules={[Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        speed={1200}
        allowTouchMove
        grabCursor
        onSwiper={onSwiper}
        onSlideChange={(s) => onSlideChange?.(s.realIndex)}
        style={{ width: '100%', height: '100%' }}
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <Image
              src={slide.image}
              alt={slide.alt}
              fill
              priority={i === 0}
              loading={i === 0 ? undefined : 'lazy'}
              sizes="100vw"
              style={{ objectFit: 'cover', opacity: 1, display: 'block' }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}

function ArrivalHero({ exhibits }: { exhibits: Exhibit[] }) {
  const prefersReducedMotion = useReducedMotion()
  const heroRef = useRef<HTMLDivElement>(null)
  const heroSwiperRef = useRef<SwiperType | null>(null)
  const [activeSlide, setActiveSlide] = useState(0)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const y = useTransform(scrollYProgress, [0, 1], prefersReducedMotion ? ['0%', '0%'] : ['0%', '28%'])
  const opacity = useTransform(scrollYProgress, [0, 0.7], prefersReducedMotion ? [1, 1] : [1, 0])
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
          <HeroBackgroundCarousel
            fallback={current?.heroImage}
            onSwiper={(s) => { heroSwiperRef.current = s }}
            onSlideChange={setActiveSlide}
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

      {/* Hero carousel dot indicators — bottom-left, clear of the centered scroll cue */}
      {!hasVideo && HERO_SLIDES.length > 1 && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 1 }}
          role="tablist"
          aria-label="Hero image navigation"
          style={{
            position: 'absolute', bottom: 40, left: 'clamp(28px, 6vw, 88px)',
            zIndex: 5, display: 'flex', alignItems: 'center', gap: 8,
          }}
        >
          {HERO_SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Show slide ${i + 1} of ${HERO_SLIDES.length}`}
              aria-selected={activeSlide === i}
              role="tab"
              onClick={() => heroSwiperRef.current?.slideToLoop(i)}
              style={{
                width: activeSlide === i ? 20 : 6, height: 6, borderRadius: 3,
                border: 'none', padding: 0, cursor: 'pointer',
                background: activeSlide === i ? '#C8A96E' : 'rgba(255,255,255,0.25)',
                transition: 'all 0.35s ease',
              }}
            />
          ))}
        </motion.div>
      )}
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
          <motion.div
            initial={{ scale: 1.08 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ position: 'absolute', inset: 0 }}
          >
            <Image
              src={node.image}
              alt={node.label}
              fill
              sizes="(max-width: 767px) 90vw, 720px"
              style={{ objectFit: 'cover' }}
            />
          </motion.div>
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
                  flex: 1, minWidth: 0, padding: '14px 0', textAlign: 'center',
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
                flex: 1, minWidth: 0, padding: '14px 0', textAlign: 'center',
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
  const rowRef = useRef<HTMLDivElement>(null)
  const [activeNode, setActiveNode] = useState<VillageNode | null>(null)

  const openNode = useCallback((node: VillageNode) => {
    setActiveNode(node)
  }, [])

  useEffect(() => {
    const row = rowRef.current
    if (!row) return
    const updateProgress = () => {
      const maxScroll = row.scrollWidth - row.clientWidth
      setScrollProgress(maxScroll > 0 ? row.scrollLeft / maxScroll : 0)
    }
    updateProgress()
    row.addEventListener('scroll', updateProgress, { passive: true })
    return () => row.removeEventListener('scroll', updateProgress)
  }, [])

  const [scrollProgress, setScrollProgress] = useState(0)
  const scrollByCard = (direction: number) => {
    rowRef.current?.scrollBy({ left: direction * 378, behavior: 'smooth' })
  }

  return (
    <>
    <section
      id="village-map"
      style={{
        position: 'relative',
        padding: 'clamp(50px, 7vw, 80px) 0 clamp(65px, 8vw, 90px)',
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
      <div style={{ textAlign: 'center', position: 'relative', zIndex: 5, marginBottom: 'clamp(32px, 4vw, 48px)' }}>
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
          Seven spaces, one ecosystem.
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
          Scroll to explore →
        </motion.p>
      </div>

      {/* Scroll-snap gallery */}
      <div
        style={{ position: 'relative' }}
      >
        <button
          type="button"
          aria-label="Scroll village spaces left"
          className="village-map-arrow village-map-arrow-left"
          onClick={() => scrollByCard(-1)}
        >
          ←
        </button>
        <button
          type="button"
          aria-label="Scroll village spaces right"
          className="village-map-arrow village-map-arrow-right"
          onClick={() => scrollByCard(1)}
        >
          →
        </button>
        <div
          ref={rowRef}
          aria-label="Village spaces"
        style={{
            display: 'flex', gap: 18, overflowX: 'auto', overflowY: 'visible',
            scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', padding: '10px clamp(24px, 7vw, 110px) 28px',
          }}
        >
          {VILLAGE_NODES.map((node, index) => (
            <motion.button
              key={node.id}
              type="button"
              className="village-map-card"
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.7, delay: Math.min(index * 0.06, 0.35), ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ scale: 1.025, boxShadow: `0 24px 70px rgba(0,0,0,0.5), 0 0 46px ${node.accent}24` }}
              onClick={() => openNode(node)}
              aria-label={`Enter ${node.label}`}
              data-cursor-expand
              style={{
                flex: '0 0 clamp(320px, 36vw, 380px)', height: 560,
                scrollSnapAlign: 'center', textAlign: 'left', padding: 0,
                borderRadius: 18, overflow: 'hidden', cursor: 'pointer',
                background: 'rgba(10,12,9,0.88)', border: `1px solid ${node.accent}38`,
                color: 'var(--cream, #F5F0E8)',
                boxShadow: `0 16px 50px rgba(0,0,0,0.4), 0 0 24px ${node.accent}12`,
                transition: 'border-color 0.35s, box-shadow 0.35s',
                '--node-accent': node.accent,
              } as React.CSSProperties}
            >
              <div style={{ height: '60%', position: 'relative', overflow: 'hidden' }}>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <Image
                    src={node.image}
                    alt={node.label}
                    fill
                    sizes="(max-width: 767px) 90vw, 380px"
                    draggable={false}
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                </motion.div>
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(10,12,9,0.02) 35%, rgba(10,12,9,0.9) 100%)' }} />
                <span style={{ position: 'absolute', top: 18, right: 18, fontSize: '1.6rem', color: node.accent, filter: `drop-shadow(0 0 10px ${node.accent}88)` }}>{node.icon}</span>
                <span style={{ position: 'absolute', top: 18, left: 18, fontFamily: 'var(--font-body)', fontSize: FS.micro, letterSpacing: '0.18em', textTransform: 'uppercase', color: node.accent }}>0{index + 1}</span>
              </div>
              <div style={{ height: '40%', padding: '18px 20px 20px', display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.2em', textTransform: 'uppercase', color: node.accent, marginBottom: 7 }}>{node.sub}</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 300, lineHeight: 1.1, marginBottom: 8 }}>{node.label}</span>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.bodySm, color: 'rgba(255,255,255,0.48)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{node.story}</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 'auto', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.micro, letterSpacing: '0.08em', color: 'rgba(255,255,255,0.35)' }}>{node.hours}</span>
                  <span style={{ flexShrink: 0, fontFamily: 'var(--font-body)', fontSize: FS.cta, letterSpacing: '0.14em', textTransform: 'uppercase', color: node.accent, fontWeight: 700 }}>Enter →</span>
                </div>
              </div>
            </motion.button>
          ))}
          <div aria-hidden="true" style={{ flex: '0 0 clamp(24px, 7vw, 110px)' }} />
        </div>
        <div aria-label="Village map progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(scrollProgress * 100)} style={{ height: 2, margin: '0 clamp(24px, 7vw, 110px)', background: 'rgba(255,255,255,0.08)', position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, transformOrigin: 'left', transform: `scaleX(${Math.max(scrollProgress, 0.08)})`, background: '#D4A853', transition: 'transform 0.2s ease' }} />
        </div>
      </div>
      <style jsx>{`
        .village-map-arrow {
          position: absolute; top: 50%; z-index: 3; width: 44px; height: 44px;
          border: 1px solid rgba(255,255,255,0.14); border-radius: 50%;
          background: rgba(255,255,255,0.1); color: rgba(255,255,255,0.8);
          backdrop-filter: blur(14px); cursor: pointer; font-size: 1.25rem;
          transform: translateY(-50%); transition: background 0.25s, color 0.25s;
        }
        .village-map-arrow:hover { background: rgba(255,255,255,0.18); color: #D4A853; }
        .village-map-arrow-left { left: 24px; }
        .village-map-arrow-right { right: 24px; }
        @media (max-width: 767px) { .village-map-arrow { display: none; } }
        div[aria-label="Village spaces"]::-webkit-scrollbar { display: none; }
        .village-map-card:focus-visible { outline: 2px solid var(--node-accent); outline-offset: 4px; }
      `}</style>
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

    {/* Phase 1: Photo cluster — Village scenes */}
    {PHOTOS_BY_CHAPTER?.villageOS && PHOTOS_BY_CHAPTER.villageOS.length > 0 && (
      <section style={{
        maxWidth: 1300, margin: '0 auto',
        padding: '50px clamp(24px, 5vw, 80px)',
        position: 'relative', zIndex: 10,
      }}>
        <PhotoCluster
          photos={PHOTOS_BY_CHAPTER.villageOS}
          title="Explore the Living Village"
          description="Step inside the spaces that make Ubuntu alive. From pottery studios to market halls, each moment captures our creative spirit."
          maxItems={8}
          columnCount={4}
        />
      </section>
    )}
    </>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPLORE LIFE AT UBUNTU — WOW Gallery Section (Premium Photo Discovery)
// ─────────────────────────────────────────────────────────────────────────────

function ExploreLifeAtUbuntu({ photos }: { photos: GalleryPhoto[] }) {
  if (!photos || photos.length === 0) return null

  // Create a mixed-layout masonry with strategic hero sizes
  // Logic: Every ~8 photos, insert a larger card to break monotony
  const arrangedPhotos = useMemo(() => {
    const arranged: Array<GalleryPhoto & { heroSize?: boolean }> = []
    for (let i = 0; i < photos.length; i++) {
      const photo = photos[i]
      // Make photos at positions 0, 8, 16, 24, etc. larger
      if (i === 0 || (i > 0 && i % 7 === 0)) {
        arranged.push({ ...photo, heroSize: true })
      } else {
        arranged.push(photo)
      }
    }
    return arranged
  }, [photos])

  return (
    <section
      style={{
        maxWidth: 1320, margin: '0 auto',
        padding: '60px clamp(20px, 4vw, 80px)',
        position: 'relative', zIndex: 10,
      }}
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-100px' }}
        style={{ textAlign: 'center', marginBottom: 50 }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, marginBottom: 12 }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: FS.label,
            letterSpacing: '0.38em', textTransform: 'uppercase',
            color: 'rgba(200,169,110,0.5)',
          }}>
            Gallery
          </span>
          <div style={{ width: 36, height: 1, background: 'rgba(200,169,110,0.25)' }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: FS.label,
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(200,169,110,0.5)',
          }}>
            Moments
          </span>
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 3.6rem)',
          fontWeight: 300, color: 'var(--cream, #F5F0E8)',
          lineHeight: 1.1, marginBottom: 14,
        }}>
          Explore Life at Ubuntu
        </h2>
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: FS.body,
          color: 'rgba(255,255,255,0.45)',
          lineHeight: 1.85, maxWidth: 600, margin: '0 auto',
        }}>
          A collection of moments from our creative village. Workshops, gatherings, art-making, and the everyday magic
          that defines our community.
        </p>
      </motion.div>

      {/* Premium masonry grid with mixed sizes */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(clamp(150px, 20vw, 240px), 1fr))',
          gap: '12px',
          gridAutoRows: 'auto',
        }}
      >
        {arrangedPhotos.map((photo, idx) => {
          const isHero = (photo as any).heroSize
          const colSpan = isHero ? 2 : 1
          const rowSpan = isHero ? 2 : 1

          return (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                delay: Math.min(idx * 0.03, 0.4),
                ease: [0.16, 1, 0.3, 1],
              }}
              viewport={{ once: true, margin: '-50px' }}
              whileHover={{ scale: 1.02 }}
              style={{
                gridColumn: `span ${colSpan}`,
                gridRow: `span ${rowSpan}`,
                borderRadius: 12,
                overflow: 'hidden',
                position: 'relative',
                cursor: 'pointer',
              }}
              onClick={() => {
                // Trigger lightbox (needs parent handler)
                const evt = new CustomEvent('openLightbox', { detail: { photo, allPhotos: arrangedPhotos } })
                window.dispatchEvent(evt)
              }}
            >
              {/* Image container */}
              <div
                style={{
                  width: '100%',
                  height: isHero ? 'clamp(280px, 35vw, 400px)' : 'clamp(140px, 20vw, 240px)',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <motion.div
                  transition={{ duration: 0.8 }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <Image
                    src={photo.image}
                    alt={photo.title}
                    fill
                    sizes={isHero ? '(max-width: 767px) 100vw, 700px' : '(max-width: 767px) 50vw, 300px'}
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                </motion.div>

                {/* Overlay gradient */}
                <div
                  style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(10,12,9,0) 0%, rgba(10,12,9,0.3) 50%, rgba(10,12,9,0.6) 100%)',
                    opacity: 0,
                    transition: 'opacity 0.5s ease',
                    pointerEvents: 'none',
                  }}
                  className="group-hover:opacity-100"
                />

                {/* Content overlay */}
                <motion.div
                  initial={{ opacity: 0, y: 12 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    position: 'absolute', inset: 0,
                    display: 'flex', flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: isHero ? 24 : 14,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                  }}
                >
                  <h4 style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: isHero ? FS.body : FS.bodySm,
                    fontWeight: 600,
                    color: 'var(--cream, #F5F0E8)',
                    marginBottom: isHero ? 6 : 3,
                    lineHeight: 1.3,
                  }}>
                    {photo.title}
                  </h4>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    opacity: isHero ? 1 : 0.7,
                  }}>
                    <span style={{
                      fontSize: '1.2rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      🔍
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: FS.micro,
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'rgba(200,169,110,0.8)',
                    }}>
                      {isHero ? 'View Gallery' : 'View'}
                    </span>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Call to action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        viewport={{ once: true, margin: '-100px' }}
        style={{ textAlign: 'center', marginTop: 48 }}
      >
        <p style={{
          fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
          color: 'rgba(255,255,255,0.35)', marginBottom: 20,
        }}>
          Every image tells a story. Tap any photo to enter the gallery and explore deeper.
        </p>
      </motion.div>
    </section>
  )
}

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
      padding: '65px clamp(24px, 5vw, 80px) 50px',
      position: 'relative', zIndex: 10,
    }}>
      {/* Chapter header */}
      <div style={{ marginBottom: 40 }}>
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

      {/* Phase 1: Photo cluster — Studio scenes */}
      {PHOTOS_BY_CHAPTER?.livingStudios && PHOTOS_BY_CHAPTER.livingStudios.length > 0 && (
        <div style={{ marginTop: 50 }}>
          <PhotoCluster
            photos={PHOTOS_BY_CHAPTER.livingStudios}
            title="Behind the Scenes at Ubuntu Studios"
            description="Artists at work, creative processes, and the hands that shape our exhibitions."
            maxItems={8}
            columnCount={4}
          />
        </div>
      )}
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
  { type: 'image', src: '/images/Pottery-Workshop.jpeg', label: 'Studio · 7am', caption: 'Grace kneads the morning\'s first batch of clay', time: '07:14', accent: '#D4A853' },
  { type: 'story', label: 'The first throw', caption: '"I learned this from my grandmother. She never used a wheel — all hand. All memory." — Grace Wanjiku, Pottery Studio', accent: '#B8A9F0' },
  { type: 'image', src: '/images/Hands-Clay-&-Heritage.jpeg', label: 'Pottery · Dawn', caption: 'Wheel-thrown vessels wait for the kiln', time: '08:30', accent: '#D4A853' },
  { type: 'image', src: '/images/hero4.jpeg', label: 'Dye Lab · Morning', caption: 'Turmeric, avocado seed, onion skin — slow colour', time: '09:20', accent: '#E8956D' },
  { type: 'story', label: 'A colour has a name', caption: '"This yellow comes from turmeric we grew twenty metres from this sink. That\'s the only kind of colour I trust." — Ubuntu Artisan', accent: '#F0C870' },
  { type: 'image', src: '/images/Maasai-Beadwork-Intensive.jpeg', label: 'Bead Workshop · 10am', caption: 'Teaching the language of colour and pattern', time: '10:15', accent: '#B8A9F0' },
  { type: 'image', src: '/images/Garden-Feast.jpeg', label: 'Farm · Harvest', caption: 'The food that feeds the fire circle tonight', time: '11:00', accent: '#00C851' },
  { type: 'video-hint', label: 'Afternoon · Gallery', caption: 'The gallery in golden afternoon light — a quiet hour before visitors', accent: '#A8D8F0' },
  { type: 'image', src: '/images/hero6.jpeg', label: 'Golden Hour', caption: 'The farm dissolves into light at 16:30', time: '16:30', accent: '#F0C870' },
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
                    <Image
                      src={m.src}
                      alt={m.label}
                      fill
                      sizes="(max-width: 767px) 85vw, 340px"
                      draggable={false}
                      style={{ objectFit: 'cover', display: 'block', pointerEvents: 'none' }}
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

      {/* Phase 1: Photo cluster — Evening moments */}
      {PHOTOS_BY_CHAPTER?.makersAlive && PHOTOS_BY_CHAPTER.makersAlive.length > 0 && (
        <div style={{
          maxWidth: 1300, margin: '50px auto 0',
          padding: '0 clamp(24px, 5vw, 80px)',
        }}>
          <PhotoCluster
            photos={PHOTOS_BY_CHAPTER.makersAlive}
            title="Evening Memories"
            description="As daylight fades, the village reveals its evening magic. Community, connection, and candlelight."
            maxItems={8}
            columnCount={4}
          />
        </div>
      )}
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSHOPS — Alive, with urgency, real people
// ─────────────────────────────────────────────────────────────────────────────

// ─── Workshop detail modal — same portal/ESC pattern as ImmersiveExhibit ──────

function WorkshopModal({ workshop, onClose }: { workshop: Workshop; onClose: () => void }) {
  const [mounted, setMounted] = useState(false)
  const accent = workshop.accent ?? '#A8D8F0'
  const spots = workshop.spots ?? 10
  const spotsLeft = workshop.spotsLeft ?? 0
  const spotsPercent = Math.round((spotsLeft / spots) * 100)
  const urgent = spotsLeft <= 2

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc) }
  }, [onClose])

  if (!mounted) return null

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9000,
        background: 'rgba(4,5,4,0.78)', backdropFilter: 'blur(10px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 40px)',
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.98 }}
        transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 560, maxHeight: '88vh', overflowY: 'auto',
          borderRadius: 22, background: '#0A0C08',
          border: `1px solid ${accent}28`,
          boxShadow: `0 40px 120px rgba(0,0,0,0.6), 0 0 80px ${accent}10`,
        }}
      >
        {/* Header image */}
        <div style={{ position: 'relative', height: 260, overflow: 'hidden' }}>
          <Image
            src={workshop.image}
            alt={workshop.title}
            fill
            sizes="(max-width: 767px) 100vw, 560px"
            style={{ objectFit: 'cover', display: 'block' }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(to bottom, rgba(10,12,8,0.1) 0%, rgba(10,12,8,0.96) 100%)`,
          }} />
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 2,
            background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
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
          <div style={{ position: 'absolute', bottom: 22, left: 26, right: 26 }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: FS.label,
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: accent, opacity: 0.9, display: 'block', marginBottom: 8,
            }}>
              {workshop.date ?? 'TBD'} · {workshop.duration ?? 'Time TBD'}
            </span>
            <h3 style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.5rem, 4vw, 2.1rem)', fontWeight: 300,
              color: 'var(--cream, #F5F0E8)', lineHeight: 1.08,
            }}>
              {workshop.title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '26px clamp(22px, 4vw, 32px) 30px' }}>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: FS.body,
            color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, marginBottom: 24,
          }}>
            {workshop.description}
          </p>

          {/* Facilitator + price */}
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '16px 18px', borderRadius: 12,
            background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
            marginBottom: 18,
          }}>
            <div>
              <span style={{
                display: 'block', fontFamily: 'var(--font-body)', fontSize: FS.label,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 4,
              }}>
                Facilitator
              </span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 300,
                color: 'var(--cream, #F5F0E8)',
              }}>
                {workshop.facilitator ?? 'Guide'}
              </span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={{
                display: 'block', fontFamily: 'var(--font-body)', fontSize: FS.label,
                letterSpacing: '0.14em', textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)', marginBottom: 4,
              }}>
                Price
              </span>
              <span style={{
                fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 300,
                color: accent,
              }}>
                {workshop.price ? `KES ${workshop.price.toLocaleString()}` : 'On Request'}
              </span>
            </div>
          </div>

          {/* Availability */}
          <div style={{ marginBottom: 26 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 7 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: FS.label, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>
                Availability
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: FS.label,
                color: urgent ? '#ff8888' : accent,
              }}>
                {spotsLeft} of {spots} spots left
              </span>
            </div>
            <div style={{ height: 3, background: 'rgba(255,255,255,0.06)', borderRadius: 2 }}>
              <div style={{
                width: `${spotsPercent}%`, height: '100%', borderRadius: 2,
                background: urgent ? '#ff6b6b' : accent,
              }} />
            </div>
          </div>

          {/* CTA */}
          <Link
            href="/contact"
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              padding: '15px 0', width: '100%',
              background: accent, color: '#06080A',
              fontFamily: 'var(--font-body)', fontSize: FS.cta,
              letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 700,
              borderRadius: 10, textDecoration: 'none',
            }}
          >
            Reserve Your Spot →
          </Link>
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}

function WorkshopsAlive({
  workshops,
  onOpenWorkshop,
}: {
  workshops: Workshop[]
  onOpenWorkshop: (w: Workshop) => void
}) {
  return (
    <section style={{
      maxWidth: 1300, margin: '0 auto',
      padding: '50px clamp(24px, 5vw, 80px) 65px',
      borderTop: '1px solid rgba(255,255,255,0.04)',
      position: 'relative', zIndex: 10,
    }}>
      <div style={{ marginBottom: 40 }}>
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
          const spots = w.spots ?? 10
          const spotsLeft = w.spotsLeft ?? 0
          const spotsPercent = Math.round((spotsLeft / spots) * 100)
          const urgent = spotsLeft <= 2
          const almostFull = spotsLeft <= 4

          return (
            <motion.div
              key={w.title}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.85, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-40px' }}
              onClick={() => onOpenWorkshop(w)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenWorkshop(w) } }}
              aria-label={`View details for ${w.title}`}
              style={{
                borderRadius: 18, overflow: 'hidden',
                background: 'rgba(10,12,8,0.88)',
                border: '1px solid rgba(255,255,255,0.05)',
                display: 'flex', flexDirection: 'column',
                cursor: 'pointer',
              }}
              whileHover={{
                borderColor: `${w.accent ?? '#A8D8F0'}30`,
                boxShadow: `0 20px 60px rgba(0,0,0,0.4), 0 0 50px ${w.accent ?? '#A8D8F0'}08`,
              }}
            >
              {/* Image */}
              <div style={{ position: 'relative', height: 180, overflow: 'hidden', cursor: 'pointer' }}>
                <motion.div
                  whileHover={{ scale: 1.06 }}
                  transition={{ duration: 0.8 }}
                  style={{ position: 'absolute', inset: 0 }}
                >
                  <Image
                    src={w.image}
                    alt={w.title}
                    fill
                    sizes="(max-width: 767px) 90vw, 380px"
                    style={{ objectFit: 'cover', display: 'block' }}
                  />
                </motion.div>
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(10,12,8,0.05) 0%, rgba(10,12,8,0.82) 100%)',
                }} />
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 2,
                  background: `linear-gradient(90deg, transparent, ${w.accent ?? '#A8D8F0'}80, transparent)`,
                }} />

                {/* Live session indicator */}
                <div style={{ position: 'absolute', top: 14, left: 14 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', borderRadius: 20,
                    background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
                    border: `1px solid ${urgent ? 'rgba(255,100,100,0.3)' : (w.accent ?? '#A8D8F0') + '30'}`,
                  }}>
                    <motion.span
                      animate={{ opacity: [1, 0.3, 1] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                      style={{
                        width: 4, height: 4, borderRadius: '50%', display: 'block',
                        background: urgent ? '#ff6b6b' : (w.accent ?? '#A8D8F0'),
                      }}
                    />
                    <span style={{
                      fontFamily: 'var(--font-body)', fontSize: FS.micro,
                      letterSpacing: '0.18em', textTransform: 'uppercase',
                      color: urgent ? '#ff8888' : (w.accent ?? '#A8D8F0'),
                    }}>
                      {urgent ? `${spotsLeft} left` : almostFull ? `${spotsLeft} spaces` : 'Open'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: '20px 20px 18px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: FS.label,
                  letterSpacing: '0.2em', textTransform: 'uppercase',
                  color: w.accent ?? '#A8D8F0', marginBottom: 8, display: 'block', opacity: 0.85,
                }}>
                  {w.date ?? 'TBD'}
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
                      color: urgent ? '#ff8888' : (w.accent ?? '#A8D8F0'),
                    }}>
                      {spotsLeft} of {spots}
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
                        background: urgent ? '#ff6b6b' : (w.accent ?? '#A8D8F0'),
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
                      {w.facilitator ?? 'Guide'} · {w.duration ?? 'Time TBD'}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.1rem', fontWeight: 300,
                      color: 'var(--cream, #F5F0E8)',
                    }}>
                      {w.price ? `KES ${w.price.toLocaleString()}` : 'Price on Request'}
                    </span>
                  </div>
                  <Link
                    href="/contact"
                    onClick={(e) => e.stopPropagation()}
                    style={{
                    padding: '10px 18px',
                    borderRadius: 8,
                    border: `1px solid ${(w.accent ?? '#A8D8F0')}38`,
                    background: `${(w.accent ?? '#A8D8F0')}0c`,
                    color: w.accent ?? '#A8D8F0',
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
              key={cm.id}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, delay: idx * 0.07, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, margin: '-30px' }}
              onMouseEnter={() => setActive(idx)}
              onMouseLeave={() => setActive(null)}
              style={{
                borderRadius: 16,
                padding: '24px 18px 22px',
                background: active === idx ? `${cm.accent ?? '#D4A853'}07` : 'rgba(255,255,255,0.018)',
                border: `1px solid ${active === idx ? (cm.accent ?? '#D4A853') + '2e' : 'rgba(255,255,255,0.045)'}`,
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
                      background: `radial-gradient(ellipse 80% 55% at 50% -10%, ${cm.accent ?? '#D4A853'}10, transparent 65%)`,
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Icon */}
              <div style={{
                fontSize: '1.35rem', marginBottom: 16,
                color: cm.accent ?? '#D4A853',
                filter: active === idx ? `drop-shadow(0 0 10px ${(cm.accent ?? '#D4A853')}80)` : 'none',
                transition: 'filter 0.35s',
              }}>
                {cm.icon ?? '✨'}
              </div>

              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1rem', fontWeight: 300,
                color: 'var(--cream, #F5F0E8)',
                marginBottom: 8, lineHeight: 1.2,
              }}>
                {cm.category ?? 'Craft'}
              </h4>

              <p style={{
                fontFamily: 'var(--font-body)', fontSize: FS.bodySm,
                color: 'rgba(255,255,255,0.35)', lineHeight: 1.75,
                marginBottom: 16,
              }}>
                {cm.description ?? 'Handcrafted artisan work'}
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
                  {cm.vendors ?? 1} maker{(cm.vendors ?? 1) !== 1 ? 's' : ''}
                </span>
                <span style={{
                  padding: '3px 10px', borderRadius: 20,
                  background: `${(cm.accent ?? '#D4A853')}0e`,
                  border: `1px solid ${(cm.accent ?? '#D4A853')}22`,
                  fontFamily: 'var(--font-body)', fontSize: FS.micro,
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: cm.accent ?? '#D4A853',
                }}>
                  {cm.days ?? 'Schedule TBD'}
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
            marginTop: 50,
            padding: '36px clamp(28px, 5vw, 56px)',
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

        {/* Phase 1: Photo cluster — Fire circle marketplace */}
        {PHOTOS_BY_CHAPTER?.fireCircle && PHOTOS_BY_CHAPTER.fireCircle.length > 0 && (
          <div style={{
            marginTop: 50,
          }}>
            <PhotoCluster
              photos={PHOTOS_BY_CHAPTER.fireCircle}
              title="Around the Fire"
              description="Stories, song, light, and the warmth of gathering. The magic of Ubuntu at night."
              maxItems={10}
              columnCount={4}
            />
          </div>
        )}
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
      aria-label={isOn ? 'Mute ambient sound' : 'Play ambient sound'}
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
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleY = useTransform(scrollYProgress, [0, 1], [0, 1])

  return (
    <motion.div
      style={{
        position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 5,
        width: '1px',
        background: 'rgba(255,255,255,0.06)',
        scaleY: prefersReducedMotion ? 1 : scaleY,
        transformOrigin: 'top',
      }}
    >
      <motion.div
        style={{
          position: 'absolute', inset: 0,
          background: 'rgba(200,168,83,0.55)',
          scaleY: prefersReducedMotion ? 1 : scaleY,
          transformOrigin: 'top',
        }}
      />
    </motion.div>
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

export function GalleryClient({ exhibits, workshops, craftMarket, stats, photos }: Props) {
  const hasFinePointer = useHasFinePointer()
  const [selectedExhibit, setSelectedExhibit] = useState<Exhibit | null>(null)
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(null)
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
  const openWorkshop  = useCallback((w: Workshop) => setSelectedWorkshop(w), [])
  const closeWorkshop = useCallback(() => setSelectedWorkshop(null), [])

  return (
    <MotionConfig reducedMotion="user">
    <main style={{
      minHeight: '100vh',
      background: '#06090A',
      color: 'var(--cream, #F5F0E8)',
      position: 'relative',
      overflowX: 'hidden',
    }}>
      {/* Global atmosphere */}
      <LivingBackground accent={cursorAccent} />
      {hasFinePointer && <MagneticCursor accentColor={cursorAccent} />}
      
      {/* New enhancements */}
      <ScrollProgressThread />
      <AmbientSoundToggle />

      {/* Optional nav */}
      {NavWrapper && <NavWrapper />}

      <GalleryChapterNav />

      {/* ── 01 Arrival ── */}
      <ArrivalHero exhibits={exhibits} />

      {/* ── 02 Latest Memories (Phase 1) ── */}
      {photos && photos.length > 0 && (
        <LatestMemoriesChapter photos={photos} maxItems={20} />
      )}

      {/* ── Day rhythm ── */}
      <DayRhythm />

      {/* ── 02 Village OS ── */}
      <VillageOS exhibits={exhibits} onOpenExhibit={openExhibit} />

      {/* ── Gallery Highlights ── */}
      {photos && photos.length > 0 && <GalleryHighlights photos={photos} />}

      {/* ── 03 Living Studios ── */}
      <LivingStudios exhibits={exhibits} onOpen={openExhibit} />

      {/* ── 04 Living Moments Rail ── */}
      <LivingMomentsRail />

      {/* ── Workshops ── */}
      <WorkshopsAlive workshops={workshops} onOpenWorkshop={openWorkshop} />

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

      {/* Workshop detail modal */}
      <AnimatePresence mode="wait">
        {selectedWorkshop && (
          <WorkshopModal
            key={selectedWorkshop.id}
            workshop={selectedWorkshop}
            onClose={closeWorkshop}
          />
        )}
      </AnimatePresence>
    </main>
    </MotionConfig>
  )
}