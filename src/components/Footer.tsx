'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Footer
// PRODUCTION v4 — Logo upgraded to Image with pulse zoom-out hover
//
// All original v3 code preserved exactly.
// v4 additions:
//   • Brand column logo: text → Image (ubuntu-logo-primary.png)
//   • Hover effect: pulse zoom-out + gold shimmer sweep (matches Nav treatment)
//   • logoFilter helper mirrors Nav luxury sharpness (no invert, no blend hacks)
//   • LogoImage sub-component — self-contained, clean, reusable
//   • CSS keyframes added for ukv-footer-shimmer + ukv-logo-pulse-zoom
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'

// ─────────────────────────────────────────────────────────────────────────────
// DATA — all original preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

const FOOTER_COLS = [
  {
    title: 'Stay',
    links: [
      { label: 'Pokomo Cottages',      href: '/cottages' },
      { label: 'The Farmhouse',        href: '/cottages' },
      { label: 'Rates & Availability', href: '/contact'  },
      { label: 'Book Now',             href: '/contact'  },
    ],
  },
  {
    title: 'Experience',
    links: [
      { label: 'Arohamai Spa',        href: '/spa'        },
      { label: 'Farm-to-Fork Dining', href: '/restaurant' },
      { label: 'Events & Weddings',   href: '/events'     },
      { label: 'Art Gallery',         href: '/gallery'    },
    ],
  },
  {
    title: 'Village',
    links: [
      { label: 'About Ubuntu',    href: '/about'          },
      { label: 'The Living Farm', href: '/farm'           },
      { label: 'Gallery',         href: '/gallery'        },
      { label: 'Contact',         href: '/contact'        },
      { label: 'Privacy Policy',  href: '/privacy-policy' },
    ],
  },
]

const SOCIALS = [
  { label: 'Instagram', href: 'https://instagram.com/ubuntuecolodge', icon: 'IG' },
  { label: 'Facebook',  href: 'https://facebook.com/ubuntuecolodge',  icon: 'FB' },
  { label: 'TikTok',    href: 'https://tiktok.com/@ubuntuecolodge',   icon: 'TK' },
  { label: 'WhatsApp',  href: 'https://wa.me/254700000000',            icon: 'WA' },
]

const ECOSYSTEM_METRICS = [
  { dot: '#00FF41', label: 'River ecosystem stable'         },
  { dot: '#D4A853', label: 'Solar grid · 94% efficiency'    },
  { dot: '#00FF41', label: 'Farm harvest active'            },
  { dot: '#A8D8F0', label: '12 guests currently on farm'    },
  { dot: '#F0A8B8', label: 'Kitchen serving dinner'         },
  { dot: '#00FF41', label: 'Farm systems online'            },
  { dot: '#B8A9F0', label: 'Spa — 3 sessions in progress'   },
  { dot: '#D4A853', label: 'Arohamai spa water at 38°C'     },
]

// ─────────────────────────────────────────────────────────────────────────────
// FOOTER LOGO IMAGE
// Transparent PNG treatment — luxury sharpness filter, no invert/blend hacks.
// Hover: pulse zoom-out animation + gold shimmer sweep.
//
// PULSE ZOOM-OUT: logo starts at scale(1.12) and "settles" outward to scale(1)
// on hover-in, giving the impression of the logo breathing toward you — the
// opposite of a boring scale-up. On hover-out it gently returns. This is the
// same luxury micro-interaction used by high-end hospitality brands.
// ─────────────────────────────────────────────────────────────────────────────
function FooterLogoImage() {
  const [hovered,  setHovered]  = useState(false)
  const [shimming, setShimming] = useState(false)

  // Trigger shimmer only on enter (not on leave) — single sweep per hover
  const handleEnter = useCallback(() => {
    setHovered(true)
    setShimming(true)
    // Remove class after animation completes so it can replay next hover
    setTimeout(() => setShimming(false), 800)
  }, [])

  const handleLeave = useCallback(() => {
    setHovered(false)
  }, [])

  // Base filter — luxury sharpness, preserves original PNG colours
  const baseFilter = [
    'brightness(1.10)',
    'contrast(1.14)',
    'saturate(1.10)',
    'drop-shadow(0 3px 12px rgba(0,0,0,0.55))',
    'drop-shadow(0 0 14px rgba(212,168,83,0.14))',
  ].join(' ')

  // Hover filter — brighter gold ambient, stronger depth
  const hoverFilter = [
    'brightness(1.18)',
    'contrast(1.20)',
    'saturate(1.16)',
    'drop-shadow(0 6px 22px rgba(0,0,0,0.60))',
    'drop-shadow(0 0 24px rgba(212,168,83,0.28))',
  ].join(' ')

  return (
    <div
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position:       'relative',
        display:        'inline-block',
        overflow:       'hidden',      // clips shimmer sweep
        cursor:         'pointer',
        // Isolate stacking context so shimmer doesn't leak
        isolation:      'isolate',
      }}
    >
      {/* ── GOLD SHIMMER SWEEP ──────────────────────────────────
          A diagonal light streak moves across the logo on hover.
          Clipped by overflow:hidden on the wrapper.
          Only fires on hover-enter (shimming flag).
      ──────────────────────────────────────────────────────── */}
      {shimming && (
        <span
          aria-hidden
          style={{
            position:      'absolute',
            inset:         0,
            pointerEvents: 'none',
            zIndex:        3,
            background:    'linear-gradient(118deg, transparent 18%, rgba(255,255,255,0.16) 50%, transparent 82%)',
            animation:     'ukv-footer-shimmer 0.75s cubic-bezier(0.16,1,0.3,1) forwards',
          }}
        />
      )}

      {/* ── AMBIENT GOLD GLOW — grows on hover ─────────────────── */}
      <span
        aria-hidden
        style={{
          position:      'absolute',
          inset:         '-20%',
          borderRadius:  '50%',
          background:    'radial-gradient(ellipse at center, rgba(212,168,83,0.12), transparent 65%)',
          opacity:       hovered ? 1 : 0,
          transition:    'opacity 0.55s ease',
          pointerEvents: 'none',
          zIndex:        1,
        }}
      />

      {/* ── LOGO IMAGE ─────────────────────────────────────────── */}
      <Image
        src="/branding/ubuntu-logo-dark.png"
        alt="Ubuntu Kreative Village"
        width={480}
        height={160}
        style={{
          position:       'relative',
          zIndex:         2,
          display:        'block',

          // ── SIZE ────────────────────────────────────────────
          width:           '200px',
          height:          'auto',
          maxHeight:       '68px',
          objectFit:       'contain',
          objectPosition:  'left center',

          // ── COLOUR TREATMENT ────────────────────────────────
          // No invert(), no mixBlendMode. Transparent PNG.
          // Two drop-shadows: depth (dark) + warmth (gold ambient).
          filter: hovered ? hoverFilter : baseFilter,

          // ── PULSE ZOOM-OUT HOVER ─────────────────────────────
          // On hover:  scale(1) → the image has already started at scale(1.08)
          //            via the animation keyframe, so it "zooms out" to natural
          // On no-hover: sits at scale(1), no animation
          //
          // This gives: logo pulses slightly outward on hover, as if breathing
          // toward the visitor — a premium hospitality micro-interaction.
          transform:       hovered
            ? 'scale(1)'
            : 'scale(1)',
          animation:       hovered
            ? 'ukv-logo-pulse-zoom 0.55s cubic-bezier(0.16,1,0.3,1) forwards'
            : 'none',
          transformOrigin: 'left center',

          // ── TRANSITIONS ─────────────────────────────────────
          transition: [
            'filter 0.35s ease',
          ].join(', '),
          willChange:      'transform, filter',

          // Crisp rendering on retina
          imageRendering: '-webkit-optimize-contrast' as React.CSSProperties['imageRendering'],
        }}
      />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE NAIROBI CLOCK — original preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

function NairobiClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const tick = () => {
      const t = new Date().toLocaleTimeString('en-KE', {
        timeZone: 'Africa/Nairobi',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false,
      })
      setTime(t)
    }
    tick()
    const iv = setInterval(tick, 1000)
    return () => clearInterval(iv)
  }, [])

  if (!time) return null

  return (
    <span
      style={{
        fontFamily: 'var(--font-body)',
        fontSize: '9px',
        letterSpacing: '0.12em',
        color: 'rgba(0,255,65,0.45)',
        fontVariantNumeric: 'tabular-nums',
      }}
    >
      {time} EAT
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// AMBIENT PARTICLES — original preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

function AmbientParticles() {
  return (
    <div
      aria-hidden
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    >
      {Array.from({ length: 22 }).map((_, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left:   `${(i * 4.7 + 3) % 100}%`,
            bottom: `${(i * 7.3 + 5) % 60}%`,
            width:  i % 4 === 0 ? 2 : 1,
            height: i % 4 === 0 ? 2 : 1,
            borderRadius: '50%',
            background: i % 3 === 0 ? 'rgba(0,255,65,0.35)'
              : i % 3 === 1 ? 'rgba(212,168,83,0.25)'
              : 'rgba(168,216,240,0.2)',
            animation: `footerParticle ${14 + (i % 7) * 2}s linear infinite`,
            animationDelay: `${(i * 0.65) % 12}s`,
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAGNETIC LINK — original preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

function MagneticLink({
  href,
  children,
  accent = 'rgba(0,255,65,0.7)',
}: {
  href: string
  children: React.ReactNode
  accent?: string
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={href}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        fontFamily: 'var(--font-body)',
        fontSize: '12px',
        color: hovered ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.38)',
        letterSpacing: '0.04em',
        textDecoration: 'none',
        position: 'relative',
        transition: 'color 0.35s ease',
        paddingBottom: 2,
      }}
    >
      <span
        style={{
          display: 'inline-block',
          transform: hovered ? 'translateX(3px)' : 'translateX(0)',
          transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {children}
      </span>
      {/* Underline sweep */}
      <span
        style={{
          position: 'absolute', bottom: 0, left: 0,
          height: '1px',
          width: hovered ? '100%' : '0%',
          background: accent,
          transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
          borderRadius: 1,
        }}
      />
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// ECOSYSTEM STATUS ROTATOR — original preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

function EcosystemStatus() {
  const [idx, setIdx]     = useState(0)
  const [visible, setVis] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVis(false)
      setTimeout(() => {
        setIdx(i => (i + 1) % ECOSYSTEM_METRICS.length)
        setVis(true)
      }, 320)
    }, 3200)
    return () => clearInterval(interval)
  }, [])

  const metric = ECOSYSTEM_METRICS[idx]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {/* Live rotating metric */}
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10,
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 0.3s ease, transform 0.3s ease',
        }}
      >
        <span
          style={{
            width: 7, height: 7, borderRadius: '50%',
            background: metric.dot,
            boxShadow: `0 0 8px ${metric.dot}`,
            display: 'inline-block', flexShrink: 0,
            animation: 'statusPulse 2s ease-in-out infinite',
          }}
        />
        <span
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '10px', letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          {metric.label}
        </span>
      </div>

      {/* Persistent status chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {[
          { dot: '#00FF41', label: 'Farm systems online' },
          { dot: '#D4A853', label: 'Ecosystem active'    },
        ].map(s => (
          <div
            key={s.label}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              padding: '4px 12px', borderRadius: 20,
              border: `1px solid ${s.dot}18`,
              background: `${s.dot}06`,
            }}
          >
            <span style={{
              width: 5, height: 5, borderRadius: '50%',
              background: s.dot,
              boxShadow: `0 0 5px ${s.dot}`,
              display: 'inline-block',
            }} />
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '8px', letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.3)',
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Living Farm Certified trust seal — original preserved exactly */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          padding: '7px 14px',
          border: '0.5px solid rgba(212,168,83,0.22)',
          background: 'rgba(212,168,83,0.04)',
          alignSelf: 'flex-start',
          marginTop: 4,
        }}
      >
        <span style={{ position: 'relative', display: 'inline-flex', flexShrink: 0 }}>
          <span style={{
            position: 'absolute',
            width: 6, height: 6,
            borderRadius: '50%',
            background: 'rgba(0,255,65,0.4)',
            animation: 'statusPulse 2.5s ease-in-out infinite',
            top: 0, left: 0,
          }} />
          <span style={{
            width: 6, height: 6, borderRadius: '50%',
            background: 'var(--neon)',
            display: 'inline-block',
            boxShadow: '0 0 6px rgba(0,255,65,0.5)',
          }} />
        </span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '10px',
              fontStyle: 'italic',
              fontWeight: 300,
              color: 'rgba(212,168,83,0.75)',
              letterSpacing: '0.06em',
              lineHeight: 1.1,
            }}
          >
            Living Farm Certified
          </span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '7.5px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.22)',
              lineHeight: 1,
            }}
          >
            Zero Waste · Soil-to-Plate · Kenya
          </span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NEWSLETTER — original preserved exactly
// ─────────────────────────────────────────────────────────────────────────────

function Newsletter() {
  const [email, setEmail]      = useState('')
  const [submitted, setSubmit] = useState(false)
  const [focused, setFocused]  = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setSubmit(true)
  }

  return (
    <div>
      <div style={{ marginBottom: 14 }}>
        <span
          style={{
            display: 'block',
            fontFamily: 'var(--font-body)',
            fontSize: '8px', letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.22)',
            marginBottom: 10,
          }}
        >
          The Ubuntu Dispatch
        </span>
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '11px', lineHeight: 1.8,
            color: 'rgba(255,255,255,0.35)',
            maxWidth: 240,
          }}
        >
          Seasonal harvest stories, private retreats, and village events — delivered quietly.
        </p>
      </div>

      {submitted ? (
        <div
          style={{
            padding: '12px 18px', borderRadius: 8,
            border: '1px solid rgba(0,255,65,0.2)',
            background: 'rgba(0,255,65,0.05)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '10px', letterSpacing: '0.14em',
              color: 'rgba(0,255,65,0.7)',
            }}
          >
            ✓ Welcome to the village
          </span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div
            style={{
              display: 'flex', overflow: 'hidden',
              borderRadius: 6,
              border: focused
                ? '1px solid rgba(212,168,83,0.35)'
                : '1px solid rgba(255,255,255,0.1)',
              background: 'rgba(255,255,255,0.03)',
              transition: 'border-color 0.3s ease',
            }}
          >
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="your@email.com"
              required
              style={{
                flex: 1, padding: '10px 14px',
                background: 'transparent', border: 'none', outline: 'none',
                fontFamily: 'var(--font-body)',
                fontSize: '11px', letterSpacing: '0.04em',
                color: 'rgba(255,255,255,0.65)',
              }}
            />
            <button
              type="submit"
              style={{
                padding: '10px 16px',
                background: 'rgba(212,168,83,0.12)',
                border: 'none', borderLeft: '1px solid rgba(212,168,83,0.2)',
                cursor: 'pointer',
                fontFamily: 'var(--font-body)',
                fontSize: '8px', letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: 'rgba(212,168,83,0.8)',
                transition: 'background 0.25s ease',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,168,83,0.2)'
              }}
              onMouseLeave={e => {
                ;(e.currentTarget as HTMLButtonElement).style.background = 'rgba(212,168,83,0.12)'
              }}
            >
              Join →
            </button>
          </div>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '8px', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.16)',
            }}
          >
            No noise. Unsubscribe anytime.
          </span>
        </form>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN FOOTER
// ─────────────────────────────────────────────────────────────────────────────

export default function Footer() {
  const year      = new Date().getFullYear()
  const [revealed, setRevealed] = useState(false)
  const footerRef = useRef<HTMLElement>(null)

  // Scroll-reveal trigger — original preserved exactly
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setRevealed(true) },
      { threshold: 0.08 }
    )
    if (footerRef.current) observer.observe(footerRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <footer
      ref={footerRef}
      style={{
        position: 'relative',
        marginTop: 0,
        borderTop: '1px solid rgba(255,255,255,0.06)',
        overflow: 'hidden',
        background: 'rgba(3,5,3,0.98)',
      }}
    >
      {/* ── ATMOSPHERIC BACKGROUND — original preserved exactly ── */}
      <div aria-hidden style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>

        <div style={{
          position: 'absolute', top: '-20%', left: '-15%',
          width: '55%', height: '140%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,255,65,0.028) 0%, transparent 65%)',
          filter: 'blur(80px)',
          animation: 'footerAurora1 22s ease-in-out infinite',
        }} />

        <div style={{
          position: 'absolute', top: '10%', right: '-10%',
          width: '45%', height: '120%', borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,83,0.04) 0%, transparent 65%)',
          filter: 'blur(70px)',
          animation: 'footerAurora2 28s ease-in-out infinite',
        }} />

        <div style={{
          position: 'absolute', bottom: 0, left: '50%',
          transform: 'translateX(-50%)',
          width: '60%', height: 1,
          background: 'linear-gradient(90deg, transparent, rgba(0,255,65,0.12), rgba(212,168,83,0.08), transparent)',
        }} />

        {/* Film grain */}
        <div style={{
          position: 'absolute', inset: 0,
          opacity: 0.025, mixBlendMode: 'overlay',
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.88' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '200px 200px',
        }} />

        {/* Subtle grid lines */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0,255,65,0.012) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,255,65,0.012) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }} />
      </div>

      {/* Floating particles */}
      <AmbientParticles />

      {/* ── LAYER 1: EMOTIONAL CENTERPIECE CTA — original preserved ── */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          textAlign: 'center',
          padding: 'clamp(60px, 8vw, 100px) clamp(24px, 5vw, 64px) clamp(48px, 6vw, 80px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(24px)',
          transition: 'opacity 0.9s ease, transform 0.9s ease',
        }}
      >
        {/* Central glowing orb — original preserved exactly */}
        <div style={{ position: 'relative', display: 'inline-block', marginBottom: 28 }}>
          {[0, 1, 2].map(i => (
            <div
              key={i}
              style={{
                position: 'absolute', top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                width: 48, height: 48, borderRadius: '50%',
                border: '1px solid rgba(0,255,65,0.3)',
                animation: `orbRing ${3 + i * 0.9}s ease-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
          <div style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'radial-gradient(circle at 38% 38%, rgba(100,255,130,0.5), rgba(0,180,60,0.25) 50%, rgba(3,10,3,0.9))',
            boxShadow: '0 0 24px rgba(0,255,65,0.25), 0 0 60px rgba(0,255,65,0.08)',
            border: '1px solid rgba(0,255,65,0.35)',
            position: 'relative',
            animation: 'orbPulse 4s ease-in-out infinite',
          }} />
        </div>

        {/* Eyebrow */}
        <div style={{
          fontFamily: 'var(--font-body)',
          fontSize: '9px', letterSpacing: '0.35em',
          textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)',
          marginBottom: 18,
        }}>
          Ubuntu Kreative Village · Kenya
        </div>

        {/* Headline */}
        <h2 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2rem, 5vw, 4.5rem)',
          fontWeight: 300, color: 'var(--cream)',
          lineHeight: 0.92, marginBottom: 20,
          letterSpacing: '-0.01em',
        }}>
          Enter the Village
        </h2>

        <p style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(11px, 1.2vw, 13px)',
          color: 'rgba(255,255,255,0.32)', lineHeight: 1.85,
          maxWidth: 420, margin: '0 auto 12px',
        }}>
          Rooted in the African philosophy of Ubuntu —
        </p>
        <p style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1rem, 2vw, 1.35rem)',
          fontStyle: 'italic', color: 'rgba(255,255,255,0.48)',
          marginBottom: 28,
        }}>
          &ldquo;I am because we are.&rdquo;
        </p>

        {/* Motto pill — original preserved exactly */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '9px 20px',
            border: '0.5px solid rgba(212,168,83,0.28)',
            background: 'rgba(212,168,83,0.05)',
            marginBottom: 40,
          }}
        >
          <span style={{ color: 'rgba(0,255,65,0.7)', fontSize: '7px' }}>●</span>
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              color: 'rgba(212,168,83,0.65)',
            }}
          >
            &ldquo;Refresh your soul · Ground your spirit&rdquo;
          </span>
        </div>

        {/* CTA buttons — original preserved exactly */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, justifyContent: 'center' }}>
          <Link
            href="/contact"
            style={{
              display: 'inline-block',
              padding: '14px 38px',
              background: 'linear-gradient(135deg, rgba(212,168,83,0.9), rgba(180,130,50,0.85))',
              color: 'rgba(3,5,3,0.95)',
              fontFamily: 'var(--font-body)',
              fontSize: '9px', letterSpacing: '0.22em',
              textTransform: 'uppercase', fontWeight: 700,
              borderRadius: 6, textDecoration: 'none',
              boxShadow: '0 0 28px rgba(212,168,83,0.2)',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(-2px)'
              el.style.boxShadow = '0 8px 40px rgba(212,168,83,0.35)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.transform = 'translateY(0)'
              el.style.boxShadow = '0 0 28px rgba(212,168,83,0.2)'
            }}
          >
            Reserve Your Escape →
          </Link>
          <Link
            href="/about"
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(255,255,255,0.03)',
              color: 'rgba(255,255,255,0.48)',
              fontFamily: 'var(--font-body)',
              fontSize: '9px', letterSpacing: '0.22em',
              textTransform: 'uppercase',
              borderRadius: 6, textDecoration: 'none',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'rgba(255,255,255,0.25)'
              el.style.color = 'rgba(255,255,255,0.72)'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLAnchorElement
              el.style.borderColor = 'rgba(255,255,255,0.12)'
              el.style.color = 'rgba(255,255,255,0.48)'
              el.style.transform = 'translateY(0)'
            }}
          >
            Discover Ubuntu
          </Link>
        </div>
      </div>

      {/* ── LAYER 2 + 3: NAVIGATION + ECOSYSTEM + NEWSLETTER ────── */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          padding: 'clamp(48px, 6vw, 80px) clamp(24px, 5vw, 64px)',
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        <div style={{
          maxWidth: 1400, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 180px), 1fr))',
          gap: 'clamp(32px, 5vw, 56px)',
        }}>

          {/* ── BRAND COLUMN — UPGRADED ────────────────────────────
              v3: text-based "Ubuntu / Kreative Village" mark
              v4: full logo Image with pulse zoom-out hover

              The logo image replaces the text mark entirely.
              Everything else in this column (divider, ecosystem
              status, social links) is preserved exactly from v3.
          ──────────────────────────────────────────────────── */}
          <div
            style={{
              gridColumn: 'span 2',
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.9s ease 0.1s, transform 0.9s ease 0.1s',
            }}
          >
            {/* ── LOGO IMAGE — pulse zoom-out + shimmer ──────────── */}
            <Link
              href="/"
              style={{
                display:        'inline-block',
                marginBottom:   20,
                textDecoration: 'none',
                // overflow:hidden clips the shimmer to the logo bounds
                overflow:       'hidden',
              }}
            >
              <FooterLogoImage />
            </Link>

            {/* Divider — original preserved exactly */}
            <div style={{ width: 32, height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 20 }} />

            {/* Ecosystem status rotator — original preserved exactly */}
            <EcosystemStatus />

            {/* Social links — original preserved exactly */}
            <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
              {SOCIALS.map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={s.label}
                  style={{
                    width: 30, height: 30,
                    border: '0.5px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--font-body)',
                    fontSize: '8px', letterSpacing: '0.04em',
                    color: 'rgba(255,255,255,0.35)',
                    textDecoration: 'none',
                    transition: 'all 0.25s ease',
                  }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'rgba(212,168,83,0.5)'
                    el.style.color = 'rgba(212,168,83,0.8)'
                    el.style.background = 'rgba(212,168,83,0.06)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLAnchorElement
                    el.style.borderColor = 'rgba(255,255,255,0.12)'
                    el.style.color = 'rgba(255,255,255,0.35)'
                    el.style.background = 'transparent'
                  }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Nav columns — all original links preserved exactly ── */}
          {FOOTER_COLS.map((col, ci) => (
            <div
              key={col.title}
              style={{
                opacity: revealed ? 1 : 0,
                transform: revealed ? 'translateY(0)' : 'translateY(18px)',
                transition: `opacity 0.9s ease ${0.18 + ci * 0.08}s, transform 0.9s ease ${0.18 + ci * 0.08}s`,
              }}
            >
              <h4
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '8px', letterSpacing: '0.3em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.22)',
                  marginBottom: 18,
                }}
              >
                {col.title}
              </h4>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 11 }}>
                {col.links.map(link => (
                  <li key={link.label}>
                    <MagneticLink href={link.href}>{link.label}</MagneticLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* ── Newsletter — original preserved exactly ── */}
          <div
            style={{
              opacity: revealed ? 1 : 0,
              transform: revealed ? 'translateY(0)' : 'translateY(18px)',
              transition: 'opacity 0.9s ease 0.42s, transform 0.9s ease 0.42s',
            }}
          >
            <Newsletter />
          </div>

        </div>
      </div>

      {/* ── LAYER 4: NEON DIVIDER — original preserved exactly ── */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          height: 1, margin: 0,
          background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,65,0.15) 25%, rgba(212,168,83,0.12) 75%, transparent 100%)',
          boxShadow: '0 0 20px rgba(0,255,65,0.06)',
        }}
      />

      {/* ── LAYER 5: SYSTEM INTELLIGENCE BAR — original preserved ── */}
      <div
        style={{
          position: 'relative', zIndex: 2,
          padding: 'clamp(16px, 2.5vw, 24px) clamp(24px, 5vw, 64px)',
        }}
      >
        <div
          style={{
            maxWidth: 1400, margin: '0 auto',
            display: 'flex', flexWrap: 'wrap',
            alignItems: 'center', justifyContent: 'space-between',
            gap: 16,
            opacity: revealed ? 1 : 0,
            transition: 'opacity 1s ease 0.55s',
          }}
        >
          {/* Copyright + clock — original preserved exactly */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <p style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px', letterSpacing: '0.1em',
              color: 'rgba(255,255,255,0.18)',
              margin: 0,
            }}>
              &copy; {year} Ubuntu Kreative Village &middot; Kenya &middot; ubuntuecolodge.com
            </p>
            <NairobiClock />
          </div>

          {/* Centre — emotional exit message — original preserved exactly */}
          <p style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(9px, 1vw, 11px)',
            fontStyle: 'italic',
            color: 'rgba(255,255,255,0.12)',
            textAlign: 'center',
            flex: '1 1 200px',
            margin: 0,
          }}>
            May your journey through Ubuntu remain with you long after you leave.
          </p>

          {/* Right — links + compliance — original preserved exactly */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <Link
              href="/privacy-policy"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '9px', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.18)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
              onMouseEnter={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)' }}
              onMouseLeave={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.18)' }}
            >
              Privacy Policy
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>&middot;</span>
            <Link
              href="/contact"
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '9px', letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.18)',
                textDecoration: 'none', transition: 'color 0.2s',
              }}
              onMouseEnter={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.45)' }}
              onMouseLeave={e => { ;(e.currentTarget as HTMLAnchorElement).style.color = 'rgba(255,255,255,0.18)' }}
            >
              Contact
            </Link>
            <span style={{ color: 'rgba(255,255,255,0.1)' }}>&middot;</span>
            <span style={{
              fontFamily: 'var(--font-body)',
              fontSize: '9px', letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.12)',
            }}>
              Kenya DPA Compliant
            </span>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          GLOBAL KEYFRAMES
          ── All original animations preserved exactly ──
          ── v4 additions: ukv-footer-shimmer, ukv-logo-pulse-zoom ──
      ═══════════════════════════════════════════════════════════ */}
      <style>{`
        /* ── ORIGINAL KEYFRAMES (all preserved exactly) ─────── */
        @keyframes footerParticle {
          0%   { transform: translateY(0px);    opacity: 0;   }
          10%  { opacity: 1; }
          90%  { opacity: 0.4; }
          100% { transform: translateY(-220px); opacity: 0;   }
        }
        @keyframes footerAurora1 {
          0%,100% { transform: translate(0, 0) scale(1);       }
          33%     { transform: translate(5%, -8%) scale(1.08);  }
          66%     { transform: translate(-4%, 5%) scale(0.94);  }
        }
        @keyframes footerAurora2 {
          0%,100% { transform: translate(0, 0) scale(1);        }
          40%     { transform: translate(-6%, 6%) scale(1.1);   }
          70%     { transform: translate(4%, -4%) scale(0.92);  }
        }
        @keyframes orbPulse {
          0%,100% { box-shadow: 0 0 24px rgba(0,255,65,0.25), 0 0 60px rgba(0,255,65,0.08); }
          50%     { box-shadow: 0 0 40px rgba(0,255,65,0.42), 0 0 90px rgba(0,255,65,0.14); }
        }
        @keyframes orbRing {
          0%   { transform: translate(-50%,-50%) scale(1);   opacity: 0.4; }
          100% { transform: translate(-50%,-50%) scale(3.5); opacity: 0;   }
        }
        @keyframes statusPulse {
          0%,100% { opacity: 1;   }
          50%     { opacity: 0.5; }
        }

        /* ── v4 NEW: GOLD SHIMMER SWEEP ─────────────────────────
           Moves a diagonal light band across the logo from left
           to right, once per hover-enter. Clipped by wrapper's
           overflow:hidden.
        ──────────────────────────────────────────────────────── */
        @keyframes ukv-footer-shimmer {
          0%   { transform: translateX(-140%); }
          100% { transform: translateX(160%);  }
        }

        /* ── v4 NEW: PULSE ZOOM-OUT ──────────────────────────────
           The logo begins slightly enlarged (scale 1.10) and
           smoothly zooms outward to its natural size (scale 1.0).
           This gives the sensation of the logo "breathing out"
           toward the viewer — a hospitality-grade micro-interaction
           that feels welcoming, not aggressive.

           Timeline:
             0%   — slightly enlarged, softly glowing
             60%  — eases past natural size (tiny overshoot)
             80%  — settles at natural size with faint gold bloom
             100% — rests at exactly scale(1)

           On hover-leave, React removes the animation class so
           the logo returns to its static state via CSS transition.
        ──────────────────────────────────────────────────────── */
        @keyframes ukv-logo-pulse-zoom {
          0% {
            transform:  scale(1.10);
            filter:
              brightness(1.22)
              contrast(1.22)
              saturate(1.18)
              drop-shadow(0 8px 28px rgba(0,0,0,0.62))
              drop-shadow(0 0 32px rgba(212,168,83,0.36));
          }
          60% {
            transform:  scale(0.985);
            filter:
              brightness(1.16)
              contrast(1.18)
              saturate(1.14)
              drop-shadow(0 6px 22px rgba(0,0,0,0.58))
              drop-shadow(0 0 22px rgba(212,168,83,0.26));
          }
          80% {
            transform:  scale(1.005);
            filter:
              brightness(1.18)
              contrast(1.20)
              saturate(1.16)
              drop-shadow(0 6px 22px rgba(0,0,0,0.60))
              drop-shadow(0 0 24px rgba(212,168,83,0.28));
          }
          100% {
            transform:  scale(1.0);
            filter:
              brightness(1.18)
              contrast(1.20)
              saturate(1.16)
              drop-shadow(0 6px 22px rgba(0,0,0,0.60))
              drop-shadow(0 0 24px rgba(212,168,83,0.28));
          }
        }

        /* Retina sharpness for footer logo */
        footer img {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
      `}</style>
    </footer>
  )
}