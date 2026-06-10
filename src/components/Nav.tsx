'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Navigation  (production)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore } from '@/context/cartStore'
import WeatherWidget from '@/components/WeatherWidget'

// ─────────────────────────────────────────────────────────────────────────────
// NAV LINKS — Calendar removed; Reserve button handles /contact
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: 'Our Cottages', href: '/cottages'   },
  { label: 'Restaurant',   href: '/restaurant' },
  { label: 'Spa',          href: '/spa'        },
  { label: 'Farm',         href: '/farm'       },
  { label: 'Events',       href: '/events'     },
  { label: 'Gallery',      href: '/gallery'    },
]

// ─────────────────────────────────────────────────────────────────────────────
// STATUS BAR — rotating today's harvest items (right side)
// ─────────────────────────────────────────────────────────────────────────────
const HARVEST_ITEMS = [
  'Sukuma Wiki',
  'Lemongrass',
  'Managu',
  'Terere',
  'Coriander',
  'Rosemary',
]

// ─────────────────────────────────────────────────────────────────────────────
// LIVE DOT
// ─────────────────────────────────────────────────────────────────────────────
function LiveDot({ size = 6 }: { size?: number }) {
  return (
    <span className="relative flex shrink-0" style={{ height: size, width: size }}>
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41]"
        style={{ opacity: 0.52 }}
      />
      <span
        className="relative inline-flex rounded-full bg-[#00FF41]"
        style={{ width: size, height: size }}
      />
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CART ICON SVG
// ─────────────────────────────────────────────────────────────────────────────
function CartIcon({ color = 'currentColor' }: { color?: string }) {
  return (
    <svg width="17" height="15" viewBox="0 0 18 16" fill="none" stroke={color} strokeWidth="1.2">
      <path d="M1 1h2.5l1.8 8h8.4l1.8-6H4.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="7.5" cy="14" r="1" fill={color} stroke="none" />
      <circle cx="12.5" cy="14" r="1" fill={color} stroke="none" />
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CART BADGE
// ─────────────────────────────────────────────────────────────────────────────
function CartBadge({ count }: { count: number }) {
  return (
    <span
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        minWidth:       '44px',
        height:         '44px',
        borderRadius:   '50%',
        background:     count > 0 ? '#D4A853' : 'rgba(212,168,83,0.08)',
        color:          count > 0 ? '#060806' : 'rgba(255,255,255,0.26)',
        border:         '1px solid rgba(212,168,83,0.20)',
        fontSize:       '11px',
        fontWeight:     700,
        letterSpacing:  0,
        transition:     'all 0.3s ease',
      }}
    >
      {count}
    </span>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RESERVE BUTTON — pill, shimmer, glass
// ─────────────────────────────────────────────────────────────────────────────
function ReserveButton({ onClick }: { onClick?: () => void }) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      href="/contact"
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        padding:        '9px 22px',
        borderRadius:   '100px',
        border:         `1px solid ${hov ? 'rgba(212,168,83,0.52)' : 'rgba(212,168,83,0.26)'}`,
        background:     hov ? 'rgba(212,168,83,0.11)' : 'rgba(212,168,83,0.05)',
        backdropFilter: 'blur(10px)',
        display:        'inline-block',
        textDecoration: 'none',
        boxShadow:      hov ? '0 0 18px rgba(212,168,83,0.09)' : 'none',
        transition:     'border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease',
        position:       'relative',
        overflow:       'hidden',
        flexShrink:     0,
      }}
    >
      {hov && (
        <span
          aria-hidden
          style={{
            position:      'absolute',
            inset:         0,
            background:    'linear-gradient(120deg, transparent 25%, rgba(255,255,255,0.10) 50%, transparent 75%)',
            animation:     'ukvShimmerSweep 0.65s ease forwards',
            pointerEvents: 'none',
          }}
        />
      )}
      <span
        style={{
          position:      'relative',
          fontFamily:    'var(--font-body)',
          fontSize:      '8px',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          color:         '#E7D7A5',
          whiteSpace:    'nowrap',
        }}
      >
        Reserve
      </span>
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// DESKTOP NAV LINK
// ─────────────────────────────────────────────────────────────────────────────
function DesktopNavLink({
  href, label, active,
}: {
  href: string; label: string; active: boolean
}) {
  const [hov, setHov] = useState(false)
  return (
    <Link
      href={href}
      className="relative"
      style={{ whiteSpace: 'nowrap' }}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
    >
      <span
        style={{
          fontFamily:    'var(--font-body)',
          fontSize:      '8px',
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          fontWeight:    500,
          display:       'block',
          transition:    'color 0.3s ease, text-shadow 0.35s ease',
          color:  active ? '#D4A853' : hov ? 'rgba(255,255,255,0.72)' : 'rgba(255,255,255,0.44)',
          textShadow: active
            ? '0 0 14px rgba(212,168,83,0.38), 0 0 28px rgba(212,168,83,0.14)'
            : 'none',
        }}
      >
        {label}
      </span>
      <span
        style={{
          position:   'absolute',
          bottom:     '-2px',
          left:       0,
          height:     '1px',
          width:      active ? '100%' : '0%',
          background: '#D4A853',
          transition: 'width 0.4s ease',
          display:    'block',
        }}
      />
      {!active && (
        <span
          style={{
            position:   'absolute',
            bottom:     '-2px',
            left:       0,
            height:     '1px',
            width:      hov ? '100%' : '0%',
            background: 'rgba(0,255,65,0.38)',
            transition: 'width 0.4s cubic-bezier(0.16,1,0.3,1)',
            display:    'block',
          }}
        />
      )}
    </Link>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LOGO
// ─────────────────────────────────────────────────────────────────────────────
function LogoImage({ scrolled }: { scrolled: boolean }) {
  const [hovered, setHovered] = useState(false)

  const baseFilter = [
    'brightness(1.08)', 'contrast(1.12)', 'saturate(1.08)',
    'drop-shadow(0 2px 10px rgba(0,0,0,0.45))',
    'drop-shadow(0 0 10px rgba(212,168,83,0.10))',
  ].join(' ')

  const hoverFilter = [
    'brightness(1.14)', 'contrast(1.18)', 'saturate(1.14)',
    'drop-shadow(0 4px 18px rgba(0,0,0,0.52))',
    'drop-shadow(0 0 18px rgba(212,168,83,0.20))',
  ].join(' ')

  return (
    <div
      className="ukv-logo-wrapper"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position:        'relative',
        display:         'inline-flex',
        alignItems:      'center',
        overflow:        'hidden',
        transform:       scrolled ? 'translateY(-1px) scale(0.97)' : 'translateY(0px) scale(1)',
        transformOrigin: 'left center',
        transition:      'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
      }}
    >
      <span
        aria-hidden
        className={hovered ? 'ukv-shimmer ukv-shimmer--active' : 'ukv-shimmer'}
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 2 }}
      />
      <Image
        src="/branding/ubuntu-logo-primary.png"
        alt="Ubuntu Kreative Village"
        width={480}
        height={160}
        priority
        style={{
          width:           scrolled ? '190px' : '240px',
          height:          'auto',
          maxHeight:       scrolled ? '56px' : '72px',
          objectFit:       'contain',
          objectPosition:  'left center',
          filter:          hovered ? hoverFilter : baseFilter,
          transform:       hovered ? 'scale(1.05)' : 'scale(1)',
          transformOrigin: 'left center',
          transition: [
            'width 0.45s cubic-bezier(0.16,1,0.3,1)',
            'max-height 0.45s cubic-bezier(0.16,1,0.3,1)',
            'transform 0.45s cubic-bezier(0.16,1,0.3,1)',
            'filter 0.35s ease',
          ].join(', '),
          willChange:     'width, max-height, transform, filter',
          imageRendering: '-webkit-optimize-contrast' as React.CSSProperties['imageRendering'],
        }}
      />
    </div>
  )
}

function MobileLogoMark() {
  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300,
        color: 'var(--cream)', letterSpacing: '0.12em', textTransform: 'uppercase',
      }}>
        Ubuntu<span style={{ color: 'var(--gold)' }}>.</span>
      </p>
      <p style={{
        fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '0.7rem',
        color: 'rgba(212,168,83,0.55)', letterSpacing: '0.08em', marginTop: 4,
      }}>
        Kreative Village
      </p>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN NAV COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Nav() {
  const pathname = usePathname()

  const [scrolled,  setScrolled]  = useState(false)
  const [menuOpen,  setMenuOpen]  = useState(false)
  const [mounted,   setMounted]   = useState(false)
  const [harvestIdx, setHarvestIdx] = useState(0)
  const [harvestVis, setHarvestVis] = useState(true)

  const { items, openCart } = useCartStore()

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  // Rotate through today's harvest items
  useEffect(() => {
    const interval = setInterval(() => {
      setHarvestVis(false)
      setTimeout(() => {
        setHarvestIdx(i => (i + 1) % HARVEST_ITEMS.length)
        setHarvestVis(true)
      }, 300)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const navBg = scrolled
    ? 'rgba(5,7,5,0.94)'
    : 'linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.0) 100%)'

  const navBorder = scrolled
    ? '1px solid rgba(212,168,83,0.10)'
    : '1px solid transparent'

  return (
    <>
      <style>{`
        @keyframes ukvShimmerSweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(140%); }
        }
        .ukv-shimmer {
          background: linear-gradient(118deg, transparent 20%, rgba(255,255,255,0.13) 50%, transparent 80%);
          transform: translateX(-140%);
          pointer-events: none;
        }
        .ukv-shimmer--active {
          animation: ukvShimmerSweep 0.75s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .ukv-logo-wrapper img {
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* ── TOP STATUS BAR ── */}
      <div
        className="fixed top-0 left-0 right-0 z-[120] flex items-center justify-between"
        style={{
          height:               '28px',
          background:           scrolled ? 'rgba(0,0,0,0.98)' : 'rgba(0,0,0,0.75)',
          backdropFilter:       'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom:         scrolled
            ? '1px solid rgba(0,255,65,0.08)'
            : '1px solid rgba(255,255,255,0.04)',
          padding:    '0 24px',
          transition: 'background 0.4s ease, border-color 0.4s ease',
        }}
      >
        {/* Subtle radial glow overlay */}
        <div
          aria-hidden
          style={{
            position: 'absolute', inset: 0,
            background: 'radial-gradient(ellipse 60% 100% at 50% 50%, rgba(212,168,83,0.04), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* LEFT: Village Open · Kenya · Guests Welcome */}
        <div className="relative flex items-center gap-3">
          <div className="flex items-center gap-2">
            <LiveDot size={5} />
            <span style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '8px',
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color:         'rgba(0,255,65,0.55)',
              whiteSpace:    'nowrap',
            }}>
              Village Open
            </span>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '8px', userSelect: 'none' }}>·</span>
          <span style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '8px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.22)',
            whiteSpace:    'nowrap',
          }}>
            Kenya
          </span>
          <span style={{ color: 'rgba(255,255,255,0.15)', fontSize: '8px', userSelect: 'none' }}>·</span>
          <span style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '8px',
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color:         'rgba(255,255,255,0.22)',
            whiteSpace:    'nowrap',
          }}>
            Guests Welcome
          </span>
        </div>

        {/* RIGHT: Today's Harvest — [rotating item] */}
        <div className="relative hidden md:flex items-center gap-2">
          <span style={{
            fontFamily:    'var(--font-body)',
            fontSize:      '8px',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color:         'rgba(212,168,83,0.45)',
            whiteSpace:    'nowrap',
          }}>
            Today&apos;s Harvest —
          </span>
          <span
            style={{
              fontFamily:    'var(--font-body)',
              fontSize:      '8px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              color:         'rgba(212,168,83,0.80)',
              whiteSpace:    'nowrap',
              opacity:       harvestVis ? 1 : 0,
              transition:    'opacity 0.28s ease',
            }}
          >
            {HARVEST_ITEMS[harvestIdx]}
          </span>
        </div>
      </div>

      {/* ── MAIN NAVIGATION ── */}
      <motion.nav
        initial={false}
        animate={{ paddingTop: scrolled ? '8px' : '14px', paddingBottom: scrolled ? '8px' : '14px' }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="fixed left-0 right-0 z-[110] px-6 md:px-10"
        style={{
          top:                  '28px',
          background:           navBg,
          borderBottom:         navBorder,
          backdropFilter:       scrolled ? 'blur(24px)' : 'blur(0px)',
          WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'blur(0px)',
          boxShadow:            scrolled ? '0 4px 32px rgba(0,0,0,0.6), 0 1px 0 rgba(0,255,65,0.05)' : 'none',
          transition:           'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, backdrop-filter 0.4s ease',
        }}
      >
        <div aria-hidden style={{
          position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
          background: scrolled
            ? 'linear-gradient(90deg, transparent, rgba(212,168,83,0.28), transparent)'
            : 'linear-gradient(90deg, transparent, rgba(212,168,83,0.08), transparent)',
          transition: 'opacity 0.4s ease', pointerEvents: 'none',
        }} />

        <div className="max-w-8xl mx-auto flex items-center justify-between gap-4">

          {/* LEFT: LOGO */}
          <div className="flex items-center gap-6 xl:gap-10 min-w-0">
            <Link
              href="/"
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'relative', display: 'inline-flex', alignItems: 'center',
                height: scrolled ? '56px' : '72px', overflow: 'hidden', flexShrink: 0,
                transition: 'height 0.45s cubic-bezier(0.16,1,0.3,1)', textDecoration: 'none',
              }}
            >
              <LogoImage scrolled={scrolled} />
            </Link>

            <div className="hidden xl:flex items-center gap-3 border-l border-white/10 pl-6 h-8">
              <div className="flex items-center gap-2">
                <LiveDot size={6} />
                <span style={{
                  fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.18em',
                  textTransform: 'uppercase', color: 'rgba(255,255,255,0.22)', whiteSpace: 'nowrap',
                }}>
                  Farm Online
                </span>
              </div>
              <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.06)' }} />
              <WeatherWidget />
            </div>
          </div>

          {/* CENTRE + RIGHT: NAV LINKS + ACTIONS */}
          <div className="hidden lg:flex items-center gap-5 xl:gap-7">
            <nav className="flex items-center gap-4 xl:gap-5 overflow-x-auto no-scrollbar">
              {NAV_LINKS.map(link => (
                <DesktopNavLink
                  key={link.href}
                  href={link.href}
                  label={link.label}
                  active={pathname === link.href}
                />
              ))}
            </nav>

            <div style={{ width: 1, height: 16, background: 'rgba(255,255,255,0.10)', flexShrink: 0 }} />

            {/* CART */}
            <button
              onClick={openCart}
              className="group flex items-center gap-2.5"
              aria-label="Open cart"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0 }}
            >
              <span style={{ color: 'rgba(255,255,255,0.34)', transition: 'color 0.3s ease', display: 'flex' }}>
                <CartIcon />
              </span>
              <span style={{
                fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.22em',
                textTransform: 'uppercase', color: 'rgba(255,255,255,0.40)',
                transition: 'color 0.3s ease', whiteSpace: 'nowrap',
              }}>
                Cart
              </span>
              {mounted && <CartBadge count={items.length} />}
            </button>

            {/* RESERVE → /contact */}
            <ReserveButton />
          </div>

          {/* MOBILE ACTIONS */}
          <div className="flex lg:hidden items-center gap-4">
            <div className="flex items-center gap-2">
              <LiveDot size={5} />
              <WeatherWidget />
            </div>

            {mounted && items.length > 0 && (
              <button
                onClick={openCart}
                aria-label="Open cart"
                style={{
                  position: 'relative', width: 32, height: 32, display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                }}
              >
                <CartIcon color="rgba(255,255,255,0.48)" />
                <span style={{
                  position: 'absolute', top: 0, right: 0, width: 14, height: 14,
                  borderRadius: '50%', background: '#D4A853', color: '#060806',
                  fontSize: '7px', fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  {items.length}
                </span>
              </button>
            )}

            {/* Hamburger */}
            <button
              className="flex flex-col justify-center gap-[5px] p-2 z-[130] relative"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle Menu"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              {[0, 1, 2].map(i => (
                <span
                  key={i}
                  className="block w-6 h-[1px] transition-all duration-300"
                  style={{
                    background: menuOpen ? '#D4A853' : '#00FF41',
                    transform:  menuOpen
                      ? i === 0 ? 'rotate(45deg) translate(4px, 4px)'
                        : i === 2 ? 'rotate(-45deg) translate(4px, -4px)'
                        : 'scaleX(0)'
                      : 'none',
                    opacity:    menuOpen && i === 1 ? 0 : 1,
                    transition: 'transform 0.35s ease, opacity 0.25s ease, background 0.3s ease',
                  }}
                />
              ))}
            </button>
          </div>

        </div>
      </motion.nav>

      {/* ── MOBILE FULL-SCREEN MENU ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className="fixed inset-0 z-[100] lg:hidden flex flex-col justify-center items-center"
            style={{
              background:           'rgba(4,6,4,0.97)',
              backdropFilter:       'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
            }}
          >
            <div aria-hidden style={{
              position: 'absolute', inset: 0,
              background: 'radial-gradient(ellipse 70% 35% at 50% 8%, rgba(212,168,83,0.06), transparent 60%)',
              pointerEvents: 'none',
            }} />
            <div aria-hidden style={{
              position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(0,255,65,0.14), transparent)',
              pointerEvents: 'none',
            }} />

            <div className="relative h-full flex flex-col justify-center items-center px-8 py-20 overflow-hidden w-full">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.06, duration: 0.5 }}
                style={{ marginBottom: 36 }}
              >
                <MobileLogoMark />
              </motion.div>

              <nav className="flex flex-col items-center gap-5 mb-10">
                {NAV_LINKS.map((link, i) => {
                  const active = pathname === link.href
                  return (
                    <motion.div
                      key={link.href}
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.10 + i * 0.05, duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Link
                        href={link.href}
                        onClick={() => setMenuOpen(false)}
                        style={{
                          fontFamily:     'var(--font-display)',
                          fontSize:       'clamp(1.55rem, 6vw, 2.1rem)',
                          fontWeight:     300,
                          color:          active ? '#D4A853' : 'rgba(255,255,255,0.72)',
                          textDecoration: 'none',
                          letterSpacing:  '-0.01em',
                          textShadow:     active ? '0 0 20px rgba(212,168,83,0.32)' : 'none',
                          transition:     'color 0.25s ease, text-shadow 0.35s ease',
                          display:        'block',
                          textAlign:      'center',
                        }}
                      >
                        {link.label}
                      </Link>
                    </motion.div>
                  )
                })}
              </nav>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.58, duration: 0.55 }}
                style={{ width: 36, height: 1, background: 'rgba(212,168,83,0.22)', marginBottom: 24 }}
              />

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.62, duration: 0.45 }}
                className="flex flex-col items-center gap-4"
              >
                <button
                  onClick={() => { setMenuOpen(false); openCart() }}
                  style={{
                    fontFamily: 'var(--font-body)', fontSize: '10px', letterSpacing: '0.22em',
                    textTransform: 'uppercase', color: 'rgba(0,255,65,0.72)',
                    background: 'none', border: 'none', cursor: 'pointer', padding: 0,
                  }}
                >
                  View Cart ({mounted ? items.length : 0})
                </button>

                <ReserveButton onClick={() => setMenuOpen(false)} />

                <p className="font-display italic text-center mt-2" style={{
                  color: 'rgba(212,168,83,0.40)', fontSize: '0.88rem', letterSpacing: '0.04em',
                }}>
                  &ldquo;Refresh your soul, ground your spirit&rdquo;
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}