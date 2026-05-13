'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Gallery & Art Culture
// PRODUCTION v2 — African Futurist Luxury Museum OS
//
// Architecture:
//   CinematicHero        → parallax, living grain, kinetic type
//   LivingBackground     → animated grain + aurora drift
//   MagneticCursor       → custom cursor with inertia + color shift
//   OrbitalCore          → "The Core" — floating artwork orbit centerpiece
//   ExhibitVault         → tilt/parallax/glow exhibit objects
//   ImmersiveExhibit     → fullscreen exhibit world (replaces modal)
//   HorizontalGalleryRail→ cinematic horizontal scroll strip
//   WorkshopsSection     → original workshops, elevated
//   CraftMarketSection   → original market, elevated
//
// All original EXHIBITS / WORKSHOPS / CRAFT_MARKET data preserved exactly.
// ─────────────────────────────────────────────────────────────────────────────

import {
  useEffect,
  useRef,
  useState,
  useCallback,
  useMemo,
} from 'react'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import Link from 'next/link'

import {
  motion,
  useMotionValue,
  useSpring,
  AnimatePresence,
  useScroll,
  useTransform,
} from 'framer-motion'

// ─────────────────────────────────────────────────────────────────────────────
// DATA — all original data preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

const EXHIBITS = [
  {
    id: 'coastal-rhythms',
    title: 'Coastal Rhythms',
    artist: 'Amina Odhiambo',
    medium: 'Mixed media on canvas',
    pieces: 12,
    status: 'Current',
    accent: '#A8D8F0',
    dates: 'April 2026 — June 2026',
    description:
      'A sweeping exploration of the Kenyan coast through texture, colour, and memory. Odhiambo layers ocean blues with earth tones harvested from the very soil of Ubuntu Village, creating works that breathe between land and sea.',
    tags: ['Mixed Media', 'Coastal', 'Kenyan Art'],
    // Atmosphere per exhibit — drives immersive world colour + mood
    atmosphere: {
      bg: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(20,55,80,0.95) 0%, rgba(5,8,12,0.99) 70%)',
      glow: 'rgba(168,216,240,0.12)',
      particle: '#A8D8F0',
      motionStyle: 'fluid',
    },
    image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=1600&q=80',
  },
  {
    id: 'roots-rising',
    title: 'Roots & Rising',
    artist: 'Kwame Njoroge',
    medium: 'Sculpture · Reclaimed wood',
    pieces: 8,
    status: 'Upcoming',
    accent: 'var(--gold)',
    dates: 'July 2026 — September 2026',
    description:
      'Njoroge transforms reclaimed wood from fallen trees across the Ubuntu farm into towering figurative sculptures. Each piece is named after a Kenyan proverb and speaks to the relationship between community and individual growth.',
    tags: ['Sculpture', 'Reclaimed', 'Proverbs'],
    atmosphere: {
      bg: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(50,30,8,0.95) 0%, rgba(5,5,3,0.99) 70%)',
      glow: 'rgba(212,168,83,0.12)',
      particle: '#D4A853',
      motionStyle: 'heavy',
    },
    image: 'https://images.unsplash.com/photo-1561839561-b13bcfe95249?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1600431521340-491eca880813?w=1600&q=80',
  },
  {
    id: 'harvest-light',
    title: 'Harvest Light',
    artist: 'Zawadi Muthoni',
    medium: 'Photography · Large format print',
    pieces: 18,
    status: 'Archived',
    accent: 'var(--neon)',
    dates: 'January 2026 — March 2026',
    description:
      'Muthoni spent three months embedded on the Ubuntu farm, photographing the arc of a single harvest season from planting to plate. The resulting 18 large-format prints document the invisible labour that feeds us all.',
    tags: ['Photography', 'Farm', 'Documentary'],
    atmosphere: {
      bg: 'radial-gradient(ellipse 80% 60% at 30% 40%, rgba(8,30,12,0.95) 0%, rgba(3,8,4,0.99) 70%)',
      glow: 'rgba(0,255,65,0.08)',
      particle: '#00FF41',
      motionStyle: 'cinematic',
    },
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=80',
    heroImage: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1600&q=80',
  },
]

const WORKSHOPS = [
  {
    title: 'Natural Dye Workshop',
    facilitator: 'Ubuntu Village Artisans',
    date: 'Every Saturday · 10:00 AM',
    duration: '3 hours',
    price: 2500,
    spots: 8,
    spotsLeft: 3,
    accent: 'var(--gold)',
    description: 'Learn to extract dyes from farm plants — turmeric, avocado seeds, onion skins — and apply them to natural fabric using traditional Kenyan techniques.',
  },
  {
    title: 'Pottery on the Farm',
    facilitator: 'Grace Wanjiku',
    date: 'Every Sunday · 9:00 AM',
    duration: '4 hours',
    price: 3200,
    spots: 6,
    spotsLeft: 2,
    accent: '#F0A8B8',
    description: 'Wheel-thrown pottery using clay sourced from the Ubuntu land. Grace guides you from raw earth to finished vessel. Your piece is kiln-fired and ready for collection the following day.',
  },
  {
    title: 'Beadwork Masterclass',
    facilitator: 'Maasai Artisan Collective',
    date: 'First Friday of month · 2:00 PM',
    duration: '2.5 hours',
    price: 1800,
    spots: 10,
    spotsLeft: 6,
    accent: '#B8A9F0',
    description: 'Traditional Maasai beadwork patterns taught by visiting artisans from the collective. Learn the symbolic language of colour and pattern carried across generations.',
  },
  {
    title: 'Farm Sketching at Dawn',
    facilitator: 'Artist in Residence',
    date: 'Tuesday & Thursday · 6:30 AM',
    duration: '2 hours',
    price: 1200,
    spots: 8,
    spotsLeft: 5,
    accent: 'var(--neon)',
    description: 'Guided observational drawing in the fields as the farm wakes up. All materials provided. No experience needed — the farm is the teacher.',
  },
]

const CRAFT_MARKET = [
  { category: 'Ceramics',          vendors: 4, days: 'Daily',    accent: 'var(--gold)'  },
  { category: 'Textiles & Weaving',vendors: 6, days: 'Daily',    accent: '#F0A8B8'      },
  { category: 'Jewellery',         vendors: 5, days: 'Daily',    accent: '#B8A9F0'      },
  { category: 'Farm Produce',      vendors: 3, days: 'Daily',    accent: 'var(--neon)'  },
  { category: 'Woodcraft',         vendors: 3, days: 'Weekends', accent: '#F0D8A8'      },
  { category: 'Natural Skincare',  vendors: 2, days: 'Daily',    accent: '#A8F0D8'      },
]

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC CURSOR — custom cursor with inertia + per-exhibit colour shift
// ─────────────────────────────────────────────────────────────────────────────

function MagneticCursor({ accentColor }: { accentColor: string }) {
  const cx = useMotionValue(-100)
  const cy = useMotionValue(-100)
  const sx = useSpring(cx, { stiffness: 80, damping: 18, mass: 0.6 })
  const sy = useSpring(cy, { stiffness: 80, damping: 18, mass: 0.6 })

  const [expanded, setExpanded] = useState(false)
  const [visible,  setVisible]  = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cx.set(e.clientX)
      cy.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const over  = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setExpanded(
        !!(t.closest('button') || t.closest('a') || t.closest('[data-cursor-expand]'))
      )
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [cx, cy, visible])

  if (typeof window === 'undefined') return null

  return (
    <motion.div
      style={{
        x: sx, y: sy,
        translateX: '-50%', translateY: '-50%',
        position: 'fixed', top: 0, left: 0,
        zIndex: 9999, pointerEvents: 'none',
        opacity: visible ? 1 : 0,
      }}
    >
      {/* Outer ring */}
      <motion.div
        animate={{
          width:  expanded ? 52 : 28,
          height: expanded ? 52 : 28,
          borderColor: accentColor,
          opacity: expanded ? 0.7 : 0.45,
        }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          borderRadius: '50%',
          border: `1px solid`,
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
      {/* Inner dot */}
      <motion.div
        animate={{ scale: expanded ? 0.4 : 1, backgroundColor: accentColor }}
        transition={{ type: 'spring', stiffness: 320, damping: 24 }}
        style={{
          width: 5, height: 5, borderRadius: '50%',
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVING BACKGROUND — aurora drift + animated grain
// ─────────────────────────────────────────────────────────────────────────────

function LivingBackground({ accent = '#A8D8F0' }: { accent?: string }) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }} aria-hidden>
      {/* Aurora blob 1 */}
      <motion.div
        animate={{ x: [0, 60, -40, 0], y: [0, -80, 40, 0], scale: [1, 1.15, 0.92, 1] }}
        transition={{ duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '10%', left: '-10%',
          width: '55vw', height: '55vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}09 0%, transparent 65%)`,
          filter: 'blur(60px)',
        }}
      />
      {/* Aurora blob 2 */}
      <motion.div
        animate={{ x: [0, -50, 30, 0], y: [0, 60, -30, 0], scale: [1, 0.88, 1.12, 1] }}
        transition={{ duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        style={{
          position: 'absolute', bottom: '5%', right: '-8%',
          width: '45vw', height: '45vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(212,168,83,0.06) 0%, transparent 65%)`,
          filter: 'blur(50px)',
        }}
      />
      {/* Film grain overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: 0.028,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          mixBlendMode: 'overlay',
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FLOATING PARTICLES — reusable ambient particles
// ─────────────────────────────────────────────────────────────────────────────

function FloatingParticles({ count = 18, color = '#A8D8F0' }: { count?: number; color?: string }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: ['0%', '-120%'], opacity: [0, 0.5, 0] }}
          transition={{
            duration: 12 + i * 0.8, repeat: Infinity,
            ease: 'linear', delay: i * 0.55,
          }}
          style={{
            position: 'absolute', bottom: 0,
            left: `${(i / count) * 100}%`,
            width: i % 3 === 0 ? 2 : 1,
            height: i % 3 === 0 ? 2 : 1,
            borderRadius: '50%',
            background: color,
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// IMMERSIVE EXHIBIT WORLD — fullscreen, replaces modal
// Each exhibit has its own atmosphere, particles, colour world
// ─────────────────────────────────────────────────────────────────────────────

function ImmersiveExhibit({
  exhibit,
  onClose,
}: {
  exhibit: typeof EXHIBITS[0]
  onClose: () => void
}) {
  const atm = exhibit.atmosphere

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', esc)
    }
  }, [onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 8000,
        background: atm.bg,
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}
    >
      {/* Ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute',
          top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
          width: '60vw', height: '60vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${atm.glow} 0%, transparent 65%)`,
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <FloatingParticles count={24} color={atm.particle} />

      {/* Hero image with cinematic fade */}
      <motion.div
        initial={{ scale: 1.08, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'absolute', inset: 0, overflow: 'hidden',
        }}
      >
        <img
          src={exhibit.heroImage}
          alt={exhibit.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            opacity: 0.22,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 0%, rgba(3,5,3,0.7) 60%, rgba(3,5,3,0.98) 100%)',
        }} />
      </motion.div>

      {/* Close */}
      <button
        onClick={onClose}
        data-cursor-expand
        style={{
          position: 'absolute', top: 28, right: 28, zIndex: 10,
          width: 44, height: 44, borderRadius: '50%',
          border: `1px solid ${exhibit.accent}33`,
          background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(12px)',
          color: 'rgba(255,255,255,0.55)',
          fontSize: 14, cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
        }}
      >
        ✕
      </button>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 5,
        display: 'flex', flexDirection: 'column',
        justifyContent: 'flex-end',
        height: '100%',
        padding: 'clamp(28px, 5vw, 64px)',
        paddingTop: '120px',
      }}>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Status */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <span style={{ display: 'block', width: 36, height: 1, background: exhibit.accent, opacity: 0.6 }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '9px',
              letterSpacing: '0.28em', textTransform: 'uppercase',
              color: exhibit.accent,
            }}>
              {exhibit.artist} · {exhibit.medium}
            </span>
            <span style={{
              padding: '3px 10px', borderRadius: 20,
              border: `1px solid ${exhibit.accent}40`,
              background: `${exhibit.accent}10`,
              color: exhibit.accent,
              fontFamily: 'var(--font-body)', fontSize: '8px',
              letterSpacing: '0.14em', textTransform: 'uppercase',
            }}>
              {exhibit.status === 'Current' ? '● Now Showing'
                : exhibit.status === 'Upcoming' ? '◷ Upcoming'
                : '○ Archived'}
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 300, color: 'var(--cream)',
            lineHeight: 0.9, marginBottom: 28,
          }}>
            {exhibit.title}
          </h2>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'clamp(280px, 40vw, 520px) 1fr',
            gap: 48, alignItems: 'start',
            maxWidth: 1100,
          }}>
            <div>
              <p style={{
                fontFamily: 'var(--font-body)',
                fontSize: 'clamp(12px, 1.4vw, 15px)',
                color: 'rgba(255,255,255,0.52)',
                lineHeight: 1.9, marginBottom: 24,
              }}>
                {exhibit.description}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
                {exhibit.tags.map(tag => (
                  <span key={tag} style={{
                    padding: '4px 12px', borderRadius: 20,
                    border: `1px solid ${exhibit.accent}33`,
                    background: `${exhibit.accent}0d`,
                    color: exhibit.accent,
                    fontFamily: 'var(--font-body)', fontSize: '9px',
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                  }}>{tag}</span>
                ))}
              </div>
              {exhibit.status === 'Current' && (
                <Link
                  href="/contact"
                  style={{
                    display: 'inline-block',
                    padding: '13px 32px',
                    background: exhibit.accent,
                    color: 'var(--obsidian)',
                    fontFamily: 'var(--font-body)',
                    fontSize: '9px', letterSpacing: '0.18em',
                    textTransform: 'uppercase', fontWeight: 700,
                    borderRadius: 6,
                    textDecoration: 'none',
                  }}
                >
                  Reserve a Guided Tour →
                </Link>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18, paddingTop: 4 }}>
              {[
                { label: 'Dates', value: exhibit.dates },
                { label: 'Pieces', value: `${exhibit.pieces} works` },
              ].map(m => (
                <div key={m.label}>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-body)',
                    fontSize: '8px', letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
                    marginBottom: 5,
                  }}>{m.label}</span>
                  <span style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.1rem', fontWeight: 300,
                    color: 'rgba(255,255,255,0.65)',
                  }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXHIBIT VAULT — tilt/parallax artifact objects
// ─────────────────────────────────────────────────────────────────────────────

function ExhibitVaultCard({
  exhibit,
  onOpen,
  delay = 0,
}: {
  exhibit: typeof EXHIBITS[0]
  onOpen: (e: typeof EXHIBITS[0]) => void
  delay?: number
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = cardRef.current!.getBoundingClientRect()
    const nx = (e.clientX - rect.left) / rect.width  - 0.5  // -0.5 to 0.5
    const ny = (e.clientY - rect.top)  / rect.height - 0.5
    setTilt({ x: ny * -10, y: nx * 10 }) // rotateX, rotateY in degrees
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 })
    setHovered(false)
  }

  const accentResolved = exhibit.accent === 'var(--gold)' ? '#D4A853'
    : exhibit.accent === 'var(--neon)' ? '#00FF41'
    : exhibit.accent

  return (
    <motion.div
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: '-60px' }}
      ref={cardRef}
      onClick={() => onOpen(exhibit)}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      data-cursor-expand
      style={{
        perspective: 1000,
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      <motion.div
        animate={{
          rotateX: tilt.x,
          rotateY: tilt.y,
          scale:   hovered ? 1.025 : 1,
          boxShadow: hovered
            ? `0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px ${accentResolved}22, 0 0 60px ${accentResolved}12`
            : `0 8px 30px rgba(0,0,0,0.28), 0 0 0 1px rgba(255,255,255,0.04)`,
        }}
        transition={{ type: 'spring', stiffness: 220, damping: 24 }}
        style={{
          borderRadius: 18,
          overflow: 'hidden',
          background: 'rgba(10,12,8,0.95)',
          transformStyle: 'preserve-3d',
          position: 'relative',
        }}
      >
        {/* Top accent line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 1,
          background: `linear-gradient(90deg, transparent, ${accentResolved}, transparent)`,
          opacity: hovered ? 0.7 : 0.35, zIndex: 5,
          transition: 'opacity 0.4s',
        }} />

        {/* Image */}
        <div style={{ position: 'relative', height: 240, overflow: 'hidden' }}>
          <motion.img
            src={exhibit.image}
            alt={exhibit.title}
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          />
          {/* Image gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(10,12,8,0.88) 100%)',
          }} />

          {/* Reactive glow on hover */}
          <motion.div
            animate={{ opacity: hovered ? 1 : 0 }}
            transition={{ duration: 0.6 }}
            style={{
              position: 'absolute', inset: 0,
              background: `radial-gradient(ellipse 70% 50% at 50% 80%, ${accentResolved}18, transparent 70%)`,
            }}
          />

          {/* Light sweep on hover */}
          {hovered && (
            <motion.div
              initial={{ x: '-100%', opacity: 0 }}
              animate={{ x: '200%', opacity: [0, 0.12, 0] }}
              transition={{ duration: 0.9, ease: 'easeInOut' }}
              style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                pointerEvents: 'none',
              }}
            />
          )}

          {/* Status pill */}
          <div style={{ position: 'absolute', top: 14, right: 14 }}>
            <span style={{
              padding: '4px 11px', borderRadius: 20,
              fontFamily: 'var(--font-body)', fontSize: '8px',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: exhibit.status === 'Current' ? 'var(--neon)'
                : exhibit.status === 'Upcoming' ? '#D4A853'
                : 'rgba(255,255,255,0.35)',
              background: exhibit.status === 'Current' ? 'rgba(0,255,65,0.08)'
                : exhibit.status === 'Upcoming' ? 'rgba(212,168,83,0.08)'
                : 'rgba(255,255,255,0.04)',
              border: exhibit.status === 'Current' ? '1px solid rgba(0,255,65,0.25)'
                : exhibit.status === 'Upcoming' ? '1px solid rgba(212,168,83,0.25)'
                : '1px solid rgba(255,255,255,0.1)',
            }}>
              {exhibit.status === 'Current' ? '● Now Showing'
                : exhibit.status === 'Upcoming' ? '◷ Upcoming'
                : '○ Archived'}
            </span>
          </div>

          {/* Piece count */}
          <div style={{ position: 'absolute', bottom: 14, left: 14 }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '9px',
              color: 'rgba(255,255,255,0.3)', letterSpacing: '0.1em',
            }}>
              {exhibit.pieces} works
            </span>
          </div>
        </div>

        {/* Card body */}
        <div style={{ padding: '22px 22px 20px' }}>
          <div style={{
            fontFamily: 'var(--font-body)', fontSize: '9px',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: accentResolved, marginBottom: 8,
          }}>
            {exhibit.artist}
          </div>
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.55rem', fontWeight: 300,
            color: 'var(--cream)', lineHeight: 1.1, marginBottom: 6,
          }}>
            {exhibit.title}
          </h3>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '9px',
            color: 'rgba(255,255,255,0.25)', marginBottom: 14,
          }}>
            {exhibit.dates}
          </p>
          <p style={{
            fontFamily: 'var(--font-body)', fontSize: '11px',
            color: 'rgba(255,255,255,0.42)', lineHeight: 1.78,
            marginBottom: 18,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical' as const,
            overflow: 'hidden',
          }}>
            {exhibit.description}
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
            {exhibit.tags.map(tag => (
              <span key={tag} style={{
                padding: '3px 10px', borderRadius: 20,
                fontFamily: 'var(--font-body)', fontSize: '8px',
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: accentResolved,
                background: `${accentResolved}10`,
                border: `1px solid ${accentResolved}28`,
              }}>{tag}</span>
            ))}
          </div>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)',
          }}>
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '9px',
              color: 'rgba(255,255,255,0.25)', letterSpacing: '0.06em',
            }}>
              {exhibit.medium}
            </span>
            <motion.span
              animate={{ color: hovered ? accentResolved : 'rgba(255,255,255,0.25)' }}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.14em', textTransform: 'uppercase',
              }}
            >
              Enter World →
            </motion.span>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// THE CORE — orbital centerpiece
// Artworks float and orbit around a central glowing orb.
// Drag to rotate. Physics-based momentum.
// ─────────────────────────────────────────────────────────────────────────────

function OrbitalCore({ onOpenExhibit }: { onOpenExhibit: (e: typeof EXHIBITS[0]) => void }) {
  const [angle, setAngle]   = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [velocity, setVelocity]     = useState(0)
  const lastX  = useRef(0)
  const raf    = useRef<number>()
  const angleRef = useRef(0)
  const velRef   = useRef(0)

  // Auto-rotate with drag physics
  useEffect(() => {
    let running = true
    const tick = () => {
      if (!running) return
      if (!isDragging) {
        velRef.current   = velRef.current * 0.96 + 0.008 // friction + base spin
        angleRef.current = angleRef.current + velRef.current
        setAngle(angleRef.current)
      }
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => { running = false; cancelAnimationFrame(raf.current!) }
  }, [isDragging])

  function onPointerDown(e: React.PointerEvent) {
    setIsDragging(true)
    lastX.current = e.clientX
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!isDragging) return
    const dx = e.clientX - lastX.current
    velRef.current   = dx * 0.28
    angleRef.current = angleRef.current + velRef.current
    setAngle(angleRef.current)
    lastX.current = e.clientX
  }
  function onPointerUp() {
    setIsDragging(false)
    // momentum preserved via velRef
  }

  const RADIUS = 210 // orbit radius px

  return (
    <section style={{
      position: 'relative', padding: '100px 0 120px',
      overflow: 'hidden',
      background: 'radial-gradient(ellipse 100% 70% at 50% 50%, rgba(10,16,10,0.99) 0%, transparent 80%)',
    }}>
      {/* Section label */}
      <div style={{
        position: 'relative', zIndex: 5,
        textAlign: 'center', marginBottom: 60,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
          <div style={{ width: 40, height: 1, background: 'rgba(212,168,83,0.35)' }} />
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '9px',
            letterSpacing: '0.3em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
          }}>The Core · Exhibition Orbit</span>
          <div style={{ width: 40, height: 1, background: 'rgba(212,168,83,0.35)' }} />
        </div>
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 4.5vw, 3.8rem)',
          fontWeight: 300, color: 'var(--cream)',
        }}>
          Drag to explore
        </h2>
      </div>

      {/* Orbital stage */}
      <div
        style={{
          position: 'relative', height: 520, userSelect: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Center orb */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 4,
          pointerEvents: 'none',
        }}>
          {/* Pulsing rings */}
          {[0, 1, 2].map(i => (
            <motion.div
              key={i}
              animate={{ scale: [1, 2.2 + i * 0.5], opacity: [0.18, 0] }}
              transition={{ duration: 3 + i * 0.8, repeat: Infinity, delay: i * 0.9 }}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%,-50%)',
                width: 72, height: 72, borderRadius: '50%',
                border: '1px solid rgba(212,168,83,0.4)',
              }}
            />
          ))}
          {/* Core sphere */}
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'radial-gradient(circle at 35% 35%, rgba(255,220,120,0.5), rgba(180,120,30,0.3) 50%, rgba(10,10,5,0.9))',
              boxShadow: '0 0 40px rgba(212,168,83,0.35), 0 0 80px rgba(212,168,83,0.12), inset 0 0 20px rgba(255,200,80,0.15)',
              border: '1px solid rgba(212,168,83,0.4)',
            }}
          />
        </div>

        {/* Orbit ring */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: `translate(-50%, -50%)`,
          width: RADIUS * 2, height: RADIUS * 2, borderRadius: '50%',
          border: '1px solid rgba(255,255,255,0.04)',
          pointerEvents: 'none',
        }} />

        {/* Orbiting exhibit nodes */}
        {EXHIBITS.map((exhibit, i) => {
          const baseAngle = (i / EXHIBITS.length) * Math.PI * 2
          const theta     = baseAngle + (angle * Math.PI) / 180
          const x         = Math.cos(theta) * RADIUS
          const y         = Math.sin(theta) * RADIUS * 0.38 // flatten to ellipse
          const depth     = Math.sin(theta) // -1 (back) to 1 (front)
          const scale     = 0.78 + (depth + 1) * 0.18
          const zIndex    = Math.round((depth + 1) * 50)
          const opacity   = 0.55 + (depth + 1) * 0.22

          const accentResolved = exhibit.accent === 'var(--gold)' ? '#D4A853'
            : exhibit.accent === 'var(--neon)' ? '#00FF41'
            : exhibit.accent

          return (
            <div
              key={exhibit.id}
              onClick={() => { if (!isDragging) onOpenExhibit(exhibit) }}
              style={{
                position: 'absolute',
                top:  '50%', left: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${scale})`,
                zIndex, opacity,
                transition: 'opacity 0.3s, transform 0.05s',
                cursor: isDragging ? 'grabbing' : 'pointer',
              }}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                style={{
                  width: 160, height: 110, borderRadius: 12, overflow: 'hidden',
                  border: `1px solid ${accentResolved}28`,
                  boxShadow: depth > 0.5 ? `0 12px 40px rgba(0,0,0,0.5), 0 0 24px ${accentResolved}18` : 'none',
                  background: '#0a0c08',
                  position: 'relative',
                }}
              >
                <img
                  src={exhibit.image}
                  alt={exhibit.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.82 }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(5,8,4,0.88) 0%, transparent 55%)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 8, left: 10, right: 10,
                }}>
                  <div style={{
                    fontFamily: 'var(--font-display)', fontSize: '0.8rem',
                    fontWeight: 300, color: 'var(--cream)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {exhibit.title}
                  </div>
                  <div style={{
                    fontFamily: 'var(--font-body)', fontSize: '7px',
                    color: accentResolved, letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                  }}>
                    {exhibit.artist}
                  </div>
                </div>
              </motion.div>
            </div>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: -12 }}>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '9px',
          letterSpacing: '0.2em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.15)',
        }}>
          Click any artwork to enter its world
        </span>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// HORIZONTAL GALLERY RAIL — cinematic scroll strip
// ─────────────────────────────────────────────────────────────────────────────

function HorizontalGalleryRail({ onOpenExhibit }: { onOpenExhibit: (e: typeof EXHIBITS[0]) => void }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft,  setCanScrollLeft]  = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function checkScroll() {
    const el = trackRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  function scroll(dir: 'left' | 'right') {
    trackRef.current?.scrollBy({ left: dir === 'left' ? -420 : 420, behavior: 'smooth' })
  }

  // Duplicate for infinite feel
  const items = [...EXHIBITS, ...EXHIBITS, ...EXHIBITS]

  return (
    <section style={{ padding: '80px 0', overflow: 'hidden', position: 'relative' }}>
      {/* Label */}
      <div style={{ padding: '0 clamp(24px, 5vw, 64px)', marginBottom: 32,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <div style={{ width: 28, height: 1, background: '#A8D8F0', opacity: 0.4 }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '9px',
              letterSpacing: '0.26em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
            }}>Gallery Rail</span>
          </div>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.6rem, 3vw, 2.6rem)',
            fontWeight: 300, color: 'var(--cream)',
          }}>
            The Collection
          </h2>
        </div>
        {/* Scroll arrows */}
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { dir: 'left' as const, label: '←', enabled: canScrollLeft },
            { dir: 'right' as const, label: '→', enabled: canScrollRight },
          ].map(a => (
            <button
              key={a.dir}
              onClick={() => scroll(a.dir)}
              data-cursor-expand
              style={{
                width: 42, height: 42, borderRadius: '50%',
                border: `1px solid ${a.enabled ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.06)'}`,
                background: 'transparent', color: a.enabled ? 'rgba(255,255,255,0.55)' : 'rgba(255,255,255,0.18)',
                fontSize: 16, cursor: a.enabled ? 'pointer' : 'default',
                transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable track */}
      <div
        ref={trackRef}
        onScroll={checkScroll}
        style={{
          display: 'flex', gap: 20,
          padding: '8px clamp(24px, 5vw, 64px) 20px',
          overflowX: 'auto', scrollSnapType: 'x mandatory',
          WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none',
          cursor: 'grab',
        }}
      >
        {items.map((exhibit, i) => {
          const accentResolved = exhibit.accent === 'var(--gold)' ? '#D4A853'
            : exhibit.accent === 'var(--neon)' ? '#00FF41'
            : exhibit.accent

          return (
            <motion.div
              key={`${exhibit.id}-${i}`}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
              onClick={() => onOpenExhibit(exhibit)}
              data-cursor-expand
              style={{
                flexShrink: 0, width: 320, scrollSnapAlign: 'start',
                cursor: 'pointer', position: 'relative', borderRadius: 14,
                overflow: 'hidden',
                border: `1px solid ${accentResolved}18`,
                background: '#0a0c08',
              }}
            >
              <div style={{ position: 'relative', height: 380 }}>
                <img
                  src={exhibit.image}
                  alt={exhibit.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                />
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(5,8,4,0.96) 0%, rgba(5,8,4,0.3) 50%, transparent 75%)',
                }} />
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px 18px',
                }}>
                  <span style={{
                    display: 'block', fontFamily: 'var(--font-body)', fontSize: '8px',
                    letterSpacing: '0.16em', textTransform: 'uppercase',
                    color: accentResolved, marginBottom: 6,
                  }}>{exhibit.artist}</span>
                  <h3 style={{
                    fontFamily: 'var(--font-display)', fontSize: '1.3rem',
                    fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: 4,
                  }}>{exhibit.title}</h3>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '9px',
                    color: 'rgba(255,255,255,0.28)',
                  }}>{exhibit.dates}</span>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      <style>{`
        div::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CINEMATIC HERO
// ─────────────────────────────────────────────────────────────────────────────

function CinematicHero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const textY  = useTransform(scrollYProgress, [0, 1], ['0%',  '12%'])
  const textOp = useTransform(scrollYProgress, [0, 0.6], [1, 0])

  return (
    <section
      ref={ref}
      style={{
        position: 'relative',
        minHeight: '58vh',
        paddingTop: '120px',
        paddingBottom: '80px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '120px clamp(24px, 5vw, 64px) 80px',
      }}
    >
      {/* Background: gradient */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 20% 80%, rgba(16,24,44,0.8) 0%, transparent 60%),
          radial-gradient(ellipse 50% 40% at 80% 20%, rgba(168,216,240,0.04) 0%, transparent 50%)
        `,
      }} />

      {/* Corner brackets — from original */}
      <div style={{ position: 'absolute', top: 88, left: 24, width: 24, height: 24, borderTop: '1px solid rgba(168,216,240,0.35)', borderLeft: '1px solid rgba(168,216,240,0.35)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', top: 88, right: 24, width: 24, height: 24, borderTop: '1px solid rgba(168,216,240,0.35)', borderRight: '1px solid rgba(168,216,240,0.35)', pointerEvents: 'none' }} />

      <motion.div
        style={{ y: textY, opacity: textOp, position: 'relative', zIndex: 2, width: '100%', maxWidth: 1400 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
            <span style={{ display: 'block', width: 40, height: 1, background: '#A8D8F0', opacity: 0.5 }} />
            <span style={{
              fontFamily: 'var(--font-body)', fontSize: '9px',
              letterSpacing: '0.3em', textTransform: 'uppercase', color: '#A8D8F0',
            }}>
              System Log · Art + Culture
            </span>
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 300, color: 'var(--cream)',
            lineHeight: 0.88, marginBottom: 28,
            letterSpacing: '-0.01em',
          }}>
            Gallery
          </h1>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'clamp(12px, 1.3vw, 15px)',
            color: 'rgba(255,255,255,0.45)', lineHeight: 1.9,
            maxWidth: 520, marginBottom: 36,
          }}>
            A rotating exhibition space, a craft market, and a workshop programme
            rooted in Kenyan artistic tradition. Culture is not decoration here
            — it is infrastructure.
          </p>

          {/* Status dots — preserved from original */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            style={{ display: 'flex', flexWrap: 'wrap', gap: 24 }}
          >
            {[
              { dot: '#A8D8F0', text: 'Coastal Rhythms — Now showing' },
              { dot: 'var(--gold)', text: 'Craft market open daily' },
              { dot: 'var(--neon)', text: '4 workshops this week' },
            ].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%',
                  background: s.dot,
                  boxShadow: `0 0 6px ${s.dot}`,
                  display: 'inline-block', flexShrink: 0,
                }} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '10px',
                  letterSpacing: '0.1em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.35)',
                }}>
                  {s.text}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// WORKSHOPS SECTION — original data, elevated visual
// ─────────────────────────────────────────────────────────────────────────────

function WorkshopsSection() {
  return (
    <section style={{ padding: '80px clamp(24px, 5vw, 64px)' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
            fontWeight: 300, color: 'var(--gold)',
            whiteSpace: 'nowrap',
          }}>
            Workshops
          </h2>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(212,168,83,0.35), transparent)' }} />
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 460px), 1fr))',
          gap: 20,
        }}>
          {WORKSHOPS.map((w, i) => {
            const accentResolved = w.accent === 'var(--gold)' ? '#D4A853'
              : w.accent === 'var(--neon)' ? '#00FF41'
              : w.accent

            return (
              <motion.div
                key={w.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.75, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -4 }}
                style={{
                  position: 'relative', overflow: 'hidden',
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 14, padding: 26,
                }}
              >
                {/* Top accent */}
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${accentResolved}, transparent)`,
                  opacity: 0.55,
                }} />

                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 14 }}>
                  <div>
                    <span style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 20,
                      marginBottom: 10,
                      fontFamily: 'var(--font-body)', fontSize: '8px',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      color: accentResolved,
                      background: `${accentResolved}10`,
                      border: `1px solid ${accentResolved}28`,
                    }}>
                      {w.duration}
                    </span>
                    <h3 style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.35rem', fontWeight: 300,
                      color: 'var(--cream)', lineHeight: 1.15,
                    }}>
                      {w.title}
                    </h3>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '9px',
                      color: 'rgba(255,255,255,0.28)', marginTop: 5,
                      letterSpacing: '0.05em',
                    }}>
                      {w.facilitator} · {w.date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: '1.5rem', fontWeight: 300, color: accentResolved,
                    }}>
                      {w.price.toLocaleString()}
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-body)', fontSize: '9px',
                      color: 'rgba(255,255,255,0.22)',
                    }}>KES/person</div>
                  </div>
                </div>

                <p style={{
                  fontFamily: 'var(--font-body)', fontSize: '11px',
                  color: 'rgba(255,255,255,0.42)', lineHeight: 1.8, marginBottom: 18,
                }}>
                  {w.description}
                </p>

                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)',
                }}>
                  <span style={{
                    fontFamily: 'var(--font-body)', fontSize: '10px',
                    color: w.spotsLeft <= 2 ? '#F0A8B8' : 'rgba(255,255,255,0.32)',
                  }}>
                    {w.spotsLeft} of {w.spots} spots left
                    {w.spotsLeft <= 2 && ' · Almost full'}
                  </span>
                  <Link
                    href="/contact"
                    data-cursor-expand
                    style={{
                      padding: '7px 18px', borderRadius: 6,
                      border: `1px solid ${accentResolved}40`,
                      color: accentResolved, background: `${accentResolved}0a`,
                      fontFamily: 'var(--font-body)', fontSize: '9px',
                      letterSpacing: '0.14em', textTransform: 'uppercase',
                      textDecoration: 'none', transition: 'all 0.2s',
                    }}
                  >
                    Reserve Spot →
                  </Link>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CRAFT MARKET SECTION — original data, elevated visual
// ─────────────────────────────────────────────────────────────────────────────

function CraftMarketSection() {
  return (
    <section style={{ padding: '60px clamp(24px, 5vw, 64px) 100px' }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
          <h2 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
            fontWeight: 300, color: 'var(--neon)',
            whiteSpace: 'nowrap',
          }}>
            Craft Market
          </h2>
          <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(0,255,65,0.3), transparent)' }} />
          <span style={{
            padding: '4px 12px', borderRadius: 20,
            border: '1px solid rgba(0,255,65,0.3)',
            background: 'rgba(0,255,65,0.06)',
            fontFamily: 'var(--font-body)', fontSize: '8px',
            letterSpacing: '0.16em', textTransform: 'uppercase',
            color: 'var(--neon)',
            whiteSpace: 'nowrap',
          }}>
            ● Open Daily
          </span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 200px), 1fr))',
          gap: 16,
        }}>
          {CRAFT_MARKET.map((c, i) => {
            const accentResolved = c.accent === 'var(--gold)' ? '#D4A853'
              : c.accent === 'var(--neon)' ? '#00FF41'
              : c.accent

            return (
              <motion.div
                key={c.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: i * 0.07 }}
                whileHover={{ y: -4, borderColor: `${accentResolved}30` }}
                style={{
                  position: 'relative', overflow: 'hidden',
                  textAlign: 'center', padding: '28px 16px 24px',
                  background: 'rgba(255,255,255,0.015)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  borderRadius: 12,
                  transition: 'border-color 0.3s',
                }}
              >
                <div style={{
                  position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                  background: `linear-gradient(90deg, transparent, ${accentResolved}, transparent)`,
                  opacity: 0.45,
                }} />
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '2.4rem', fontWeight: 300,
                  color: accentResolved, marginBottom: 8, lineHeight: 1,
                }}>
                  {c.vendors}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '9px',
                  letterSpacing: '0.14em', textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.48)', marginBottom: 6,
                }}>
                  {c.category}
                </div>
                <div style={{
                  fontFamily: 'var(--font-body)', fontSize: '8px',
                  color: 'rgba(255,255,255,0.22)', letterSpacing: '0.08em',
                }}>
                  {c.days}
                </div>
              </motion.div>
            )
          })}
        </div>

      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE — GalleryPage
// ─────────────────────────────────────────────────────────────────────────────

export default function GalleryPage() {
  const [activeExhibit, setActiveExhibit] = useState<typeof EXHIBITS[0] | null>(null)
  const [cursorAccent, setCursorAccent]   = useState('#A8D8F0')

  const handleOpenExhibit = useCallback((exhibit: typeof EXHIBITS[0]) => {
    setActiveExhibit(exhibit)
    const resolved = exhibit.accent === 'var(--gold)' ? '#D4A853'
      : exhibit.accent === 'var(--neon)' ? '#00FF41'
      : exhibit.accent
    setCursorAccent(resolved)
  }, [])

  const handleCloseExhibit = useCallback(() => {
    setActiveExhibit(null)
    setCursorAccent('#A8D8F0')
  }, [])

  return (
    <>
      {/* Custom cursor — desktop only */}
      <div className="hidden md:block">
        <MagneticCursor accentColor={cursorAccent} />
      </div>

      <LivingBackground accent={cursorAccent} />

      <main style={{ background: 'var(--obsidian)', minHeight: '100vh', position: 'relative', zIndex: 1 }}>
        <Nav />

        {/* ── PHASE 1: ARRIVAL ── */}
        <CinematicHero />

        {/* ── PHASE 2: THE CORE — orbital centerpiece ── */}
        <OrbitalCore onOpenExhibit={handleOpenExhibit} />

        {/* ── PHASE 3: EXHIBIT VAULT — tilt artifact cards ── */}
        <section style={{ padding: '60px clamp(24px, 5vw, 64px) 80px' }}>
          <div style={{ maxWidth: 1400, margin: '0 auto' }}>
            {/* Section header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 48 }}>
              <h2 style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(1.5rem, 3vw, 2.4rem)',
                fontWeight: 300, color: '#A8D8F0',
                whiteSpace: 'nowrap',
              }}>
                Exhibitions
              </h2>
              <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(168,216,240,0.35), transparent)' }} />
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 380px), 1fr))',
              gap: 24,
            }}>
              {EXHIBITS.map((exhibit, i) => (
                <ExhibitVaultCard
                  key={exhibit.id}
                  exhibit={exhibit}
                  onOpen={handleOpenExhibit}
                  delay={i * 0.12}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── PHASE 4: HORIZONTAL GALLERY RAIL ── */}
        <HorizontalGalleryRail onOpenExhibit={handleOpenExhibit} />

        {/* ── PHASE 5: WORKSHOPS ── */}
        <WorkshopsSection />

        {/* ── PHASE 6: CRAFT MARKET ── */}
        <CraftMarketSection />

        <Footer />
        <MoxieChat />
      </main>

      {/* ── IMMERSIVE EXHIBIT WORLD ── */}
      <AnimatePresence>
        {activeExhibit && (
          <ImmersiveExhibit
            exhibit={activeExhibit}
            onClose={handleCloseExhibit}
          />
        )}
      </AnimatePresence>
    </>
  )
}