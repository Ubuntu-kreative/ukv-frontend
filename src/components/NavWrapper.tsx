'use client'

/**
 * NavWrapper.tsx — Ubuntu Kreative Village · Exact Nav Replica
 *
 * Pixel-perfect match to the design videos. Every dropdown, every link,
 * every animation, every colour and font size as seen on screen.
 *
 * LAYERS (top to bottom on the page):
 *   1. Top utility bar  — 34px, dark #111, status dots · tagline · harvest ticker
 *   2. Main nav bar     — 72px, fully transparent over hero, backdrop-blur only
 *   3. Mega dropdown    — semi-transparent dark, shows hero behind it
 *
 * INTERACTIONS:
 *   • Hover nav item → gold ring scales in (spring cubic-bezier)
 *   • Gold dot persists under active page item
 *   • Dropdown: fade + translateY(-6px→0) on enter, reverse on leave
 *   • 150ms close-delay so user can move mouse into dropdown safely
 *   • Cart button: ring glows gold + count badge when items present
 *   • RESERVE: outlined pill, gold on hover
 *   • Scroll >30px: top bar hides, nav gains stronger blur
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useCartStore } from '@/context/cartStore'

// ─── EXACT DROPDOWN DATA (from video) ────────────────────────────────────────

const NAV = [
  {
    label: 'OUR COTTAGES',
    href:  '/cottages',
    cols: [
      {
        heading: 'ACCOMMODATIONS',
        links: [
          { label: 'Pokomo Cottage',   href: '/cottages/pokomo',    gold: true  },
          { label: 'The Farmhouse',    href: '/cottages/farmhouse', gold: true  },
          { label: 'Family Suite',     href: '/cottages/family',    gold: false },
          { label: 'View All Options', href: '/cottages',           gold: false },
          { label: 'Gallery',          href: '/cottages/gallery',   gold: false },
        ],
      },
      {
        heading: 'EXPERIENCES',
        links: [
          { label: 'Riverside Dining', href: '/restaurant', gold: false },
          { label: 'Spa Wellness',     href: '/spa',        gold: false },
          { label: 'Farm Activities',  href: '/farm',       gold: false },
          { label: 'Event Hosting',    href: '/events',     gold: false },
        ],
      },
    ],
    ticker: '2 COTTAGES AVAILABLE TONIGHT',
  },
  {
    label: 'RESTAURANT',
    href:  '/restaurant',
    cols: [
      {
        heading: 'DINING EXPERIENCES',
        links: [
          { label: 'Full Moon Dinner',   href: '/restaurant#events',   gold: true  },
          { label: 'Farm Breakfast',     href: '/restaurant#breakfast', gold: false },
          { label: 'Lunch on the Lawn',  href: '/restaurant#lunch',    gold: false },
          { label: 'Sundowner Dinner',   href: '/restaurant#sundowner', gold: false },
          { label: "Chef's Table",       href: '/restaurant#chefs',    gold: false },
          { label: 'Private Dining',     href: '/restaurant#private',  gold: false },
        ],
      },
      {
        heading: 'PHILOSOPHY',
        links: [
          { label: 'Farm-to-Fork', href: '/restaurant#philosophy', gold: false },
          { label: 'Our Story',    href: '/restaurant#story',      gold: false },
        ],
      },
    ],
    ticker: 'TONIGHT: FULL MOON FIRE DINNER',
  },
  {
    label: 'SPA',
    href:  '/spa',
    cols: [
      {
        heading: 'HEALING RITUALS',
        links: [
          { label: 'Forest Therapy',   href: '/spa#rituals',  gold: true  },
          { label: 'Sound Healing',    href: '/spa#rituals',  gold: false },
          { label: 'Botanical Baths',  href: '/spa#services', gold: false },
          { label: 'Massage Rituals',  href: '/spa#services', gold: false },
          { label: 'Aromatherapy',     href: '/spa#services', gold: false },
        ],
      },
      {
        heading: 'WELLNESS',
        links: [
          { label: 'Yoga at Dawn', href: '/spa#wellness',    gold: false },
          { label: 'Meditation',   href: '/spa#wellness',    gold: false },
          { label: 'Breathwork',   href: '/spa#wellness',    gold: false },
        ],
      },
    ],
    ticker: '3 SESSIONS AVAILABLE TODAY',
  },
  {
    label: 'FARM',
    href:  '/farm',
    cols: [
      {
        heading: 'FARM EXPERIENCES',
        links: [
          { label: 'Dawn Farm Walk', href: '/farm#experiences', gold: true  },
          { label: 'Harvest Day',    href: '/farm#experiences', gold: false },
          { label: 'Apiary Tour',    href: '/farm#experiences', gold: false },
          { label: 'Learn More',     href: '/farm',             gold: false },
        ],
      },
      {
        heading: 'TASTE THE FARM',
        links: [
          { label: 'Farm Breakfast', href: '/restaurant', gold: false },
          { label: 'Honey Tasting',  href: '/farm#taste', gold: false },
          { label: 'Cook with Us',   href: '/farm#taste', gold: false },
        ],
      },
    ],
    ticker: "TODAY'S HARVEST: SUKUMA WIKI · LEMONGRASS · MANAGU",
  },
  {
    label: 'EVENTS',
    href:  '/events',
    cols: [
      {
        heading: 'HOST YOUR EVENT',
        links: [
          { label: 'Weddings',     href: '/events#weddings',  gold: true  },
          { label: 'Retreats',     href: '/events#retreats',  gold: true  },
          { label: 'Corporate',    href: '/events#corporate', gold: false },
          { label: 'Celebrations', href: '/events#private',   gold: false },
        ],
      },
      {
        heading: 'UPCOMING',
        links: [
          { label: 'Full Moon Dinner',    href: '/events', gold: false },
          { label: 'Yoga & Farm Retreat', href: '/events', gold: false },
          { label: 'View All Events',     href: '/events', gold: false },
        ],
      },
    ],
    ticker: 'EVENTS & PRIVATE HIRE AVAILABLE',
  },
  {
    label: 'GALLERY',
    href:  '/gallery',
    cols: [
      {
        heading: 'VISUAL STORIES',
        links: [
          { label: 'The Lodge',      href: '/gallery#lodge', gold: true  },
          { label: 'Farm Life',      href: '/gallery#farm',  gold: false },
          { label: 'Spa & Wellness', href: '/gallery#spa',   gold: false },
        ],
      },
      {
        heading: 'MEMORIES',
        links: [
          { label: 'Guest Experiences', href: '/gallery#guests',  gold: false },
          { label: 'Harvest Diary',     href: '/gallery#harvest', gold: false },
          { label: 'Event Moments',     href: '/gallery#events',  gold: false },
          { label: 'About Ubuntu',      href: '/about',           gold: false },
        ],
      },
    ],
    ticker: '12 GUESTS CURRENTLY ON FARM',
  },
]

// ─── COMPONENT ───────────────────────────────────────────────────────────────

export default function NavWrapper() {
  const pathname  = usePathname()
  const [scrolled, setScrolled]       = useState(false)
  const [openMenu, setOpenMenu]       = useState<string | null>(null)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [mobileOpen, setMobileOpen]   = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const cartCount  = useCartStore((s) => s.items.reduce((n, i) => n + (i.quantity ?? 1), 0))
  const openCart   = useCartStore((s) => s.openCart)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  // Close mobile menu with Escape and lock body scroll when open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileOpen(false) }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const open = useCallback((label: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    setOpenMenu(label)
    setHoveredItem(label)
  }, [])

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => {
      setOpenMenu(null)
      setHoveredItem(null)
    }, 150)
  }, [])

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
  }, [])

  const isActive = useCallback((href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }, [pathname])

  const activeData = NAV.find(n => n.label === openMenu)

  return (
    <>
      <style>{`
        @keyframes utick {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .u-ticker { animation: utick 26s linear infinite; white-space: nowrap; display: inline-flex; }
        .u-ticker:hover { animation-play-state: paused; }
        @keyframes u-dot {
          0%,100% { opacity: 1; transform: scale(1); }
          50%      { opacity: .35; transform: scale(1.5); }
        }
        .u-status-dot { animation: u-dot 2.8s ease-in-out infinite; }
        @keyframes u-logo-zoom {
          from { transform: scale(1); }
          to   { transform: scale(1.32); }
        }
        @keyframes u-cart-bounce {
          0% { transform: scale(1); }
          40% { transform: scale(1.25); }
          60% { transform: scale(0.93); }
          100% { transform: scale(1); }
        }
        @keyframes glowingRing {
          0% { box-shadow: 4px 0 8px rgba(212,175,55,0.12), 0 0 5px rgba(212,175,55,0.06), inset 0 0 4px rgba(212,175,55,0.03); }
          25% { box-shadow: 0 4px 8px rgba(212,175,55,0.12), 0 0 5px rgba(212,175,55,0.06), inset 0 0 4px rgba(212,175,55,0.03); }
          50% { box-shadow: -4px 0 8px rgba(212,175,55,0.12), 0 0 5px rgba(212,175,55,0.06), inset 0 0 4px rgba(212,175,55,0.03); }
          75% { box-shadow: 0 -4px 8px rgba(212,175,55,0.12), 0 0 5px rgba(212,175,55,0.06), inset 0 0 4px rgba(212,175,55,0.03); }
          100% { box-shadow: 4px 0 8px rgba(212,175,55,0.12), 0 0 5px rgba(212,175,55,0.06), inset 0 0 4px rgba(212,175,55,0.03); }
        }
        .u-logo:hover { animation: u-logo-zoom 380ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .u-cart-btn:hover { animation: u-cart-bounce 420ms cubic-bezier(0.34, 1.56, 0.64, 1); }
        .u-ring {
          position: absolute;
          inset: -12px;
          border-radius: 50%;
          border: 1px solid rgba(212,175,55,0.75);
          pointer-events: none;
          transition: opacity .22s ease, transform .3s cubic-bezier(.34,1.56,.64,1);
          display: none;
        }
        .u-ring-on  { opacity: 1; transform: scale(1); }
        .u-ring-off { opacity: 0; transform: scale(.6); }
        .u-navlink {
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: 14px;
          font-weight: 500;
          letter-spacing: .16em;
          text-transform: uppercase;
          text-decoration: none;
          color: rgba(255,255,255,0.82);
          transition: color .18s ease;
          display: block;
          padding: 6px 0;
          line-height: 1.4;
        }
        .u-navlink:hover { color: #D4AF37; }
        .u-navlink.gold { color: #D4AF37; font-style: italic; font-weight: 400; }
        .u-dropdown {
          transition: opacity .2s ease, transform .26s cubic-bezier(.16,1,.3,1);
        }
        .u-dropdown-on  { opacity: 1; transform: translateY(0);   pointer-events: auto; }
        .u-dropdown-off { opacity: 0; transform: translateY(-8px); pointer-events: none; }
        .u-reserve {
          font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
          font-size: 12px;
          font-weight: 500;
          letter-spacing: .18em;
          text-transform: uppercase;
          color: #D4AF37;
          border: 2px solid #D4AF37;
          border-radius: 50px;
          padding: 12px 28px;
          background: transparent;
          cursor: pointer;
          text-decoration: none;
          transition: all .22s ease;
          white-space: nowrap;
          display: inline-flex;
          align-items: center;
          animation: glowingRing 18s ease-in-out infinite;
        }
        .u-reserve:hover {
          background: rgba(212,175,55,0.08);
        }
        .u-mobile-submenu {
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          transition: max-height 300ms ease, opacity 300ms ease;
        }
        .u-mobile-submenu.open {
          max-height: 500px;
          opacity: 1;
        }
        @media (prefers-reduced-motion: reduce) {
          .u-logo:hover { animation: none; transform: scale(1.16); }
          .u-cart-btn:hover { animation: none; transform: scale(1) !important; }
          .u-mobile-submenu { transition: none; }
        }
        @media (max-width: 1023px) {
          .u-nav-header > div { padding-left: 16px !important; padding-right: 16px !important; gap: 12px !important; min-width: 0; }
          .u-nav-brand { gap: 0 !important; }
          .u-nav-divider,
          .u-nav-wordmark { display: none !important; }
          .u-nav-header > div > nav { display: none !important; }
          .u-nav-header .md\:hidden { display: flex !important; }
          .u-nav-actions { gap: 6px !important; }
          .u-cart-btn { width: 42px !important; height: 42px !important; }
          .u-reserve { padding: 8px 14px; font-size: 8px; }
        }
        @media (max-width: 375px) {
          .u-nav-header > div { padding-left: 12px !important; padding-right: 12px !important; gap: 8px !important; }
          .u-reserve { padding-left: 11px; padding-right: 11px; font-size: 7px; }
        }
      `}</style>

      {/* ══ 1. TOP UTILITY BAR ══════════════════════════════════════════════ */}
      <div style={{
        position:    'fixed',
        top:          0,
        left:         0,
        right:        0,
        zIndex:       1001,
        height:       scrolled ? '0' : '48px',
        overflow:     'hidden',
        background:   'rgba(10,10,10,0.08)',
        backdropFilter: 'blur(15px)',
        WebkitBackdropFilter: 'blur(15px)',
        borderBottom: scrolled ? 'none' : '1px solid rgba(255,255,255,0.05)',
        transition:   'height .35s ease, background .3s ease',
      }}>
        <div style={{
          height:               '48px',
          maxWidth:             '1440px',
          margin:               '0 auto',
          width:               '100%',
          padding:              '0 40px',
          display:              'grid',
          gridTemplateColumns:  '1fr auto 1fr',
          alignItems:           'center',
          gap:                  '24px',
        }}>

          {/* Left — status pills */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
            {['VILLAGE OPEN', 'KENYA', 'GUESTS WELCOME'].map((s, i) => (
              <span key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span className="u-status-dot" style={{
                  width: '5px', height: '5px', borderRadius: '50%',
                  background: '#D4AF37', display: 'inline-block', flexShrink: 0,
                  animationDelay: `${i * 0.9}s`,
                }} />
                <span style={{
                  fontFamily:    "'Cormorant Garamond', Georgia, serif",
                  fontSize:      '11px',
                  letterSpacing: '.3em',
                  textTransform: 'uppercase',
                  color:         'rgba(255,255,255,0.58)',
                }}>{s}</span>
              </span>
            ))}
          </div>

          {/* Centre — italic tagline */}
          <p style={{
            fontFamily:    "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
            fontSize:      '15px',
            fontStyle:     'italic',
            fontWeight:    400,
            color:         'rgba(212,175,55,0.95)',
            letterSpacing: '.04em',
            whiteSpace:    'nowrap',
          }}>
            "Refresh your soul, ground your spirit"
          </p>

          {/* Right — scrolling harvest ticker */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', overflow: 'hidden' }}>
            <div className="u-ticker">
              {[0, 1].map(i => (
                <span key={i} style={{
                  fontFamily:    "'Cormorant Garamond', Georgia, serif",
                  fontSize:      '11px',
                  letterSpacing: '.22em',
                  textTransform: 'uppercase',
                  color:         'rgba(255,255,255,0.45)',
                  paddingRight:  '60px',
                }}>
                  TODAY'S HARVEST — SUKUMA WIKI · LEMONGRASS · MANAGU
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══ 2. MAIN NAV BAR ════════════════════════════════════════════════ */}
      <header
        className="u-nav-header"
        onMouseLeave={scheduleClose}
        style={{
          position:             'fixed',
          top:                   scrolled ? 0 : '48px',
          left:                  0,
          right:                 0,
          zIndex:                1000,
          height:               '92px',
          display:              'flex',
          alignItems:           'center',
          // Glassmorphism — ultra-light transparent with maximum blur
          background:            'rgba(255,255,255,0.02)',
          backdropFilter:       'blur(25px)',
          WebkitBackdropFilter: 'blur(25px)',
          borderBottom:         '1px solid rgba(255,255,255,0.05)',
          transition:           'top .35s ease, background .3s ease, backdrop-filter .3s ease',
        }}
      >
        <div style={{
          maxWidth:            '1440px',
          margin:              '0 auto',
          width:               '100%',
          padding:             '0 40px',
          display:             'grid',
          gridTemplateColumns: 'auto 1fr auto',
          alignItems:          'center',
          gap:                 '32px',
        }}>

          {/* LOGO */}
          <Link href="/" className="u-nav-brand" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Ubuntu mark — smaller with transparent background */}
            <div style={{
              width:         '32px',
              height:        '32px',
              borderRadius:  '4px',
              flexShrink:    0,
              overflow:      'hidden',
              position:      'relative',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              background:    'transparent',
            }}>
              <Image
                src="/branding/ubuntu-mark2.png"
                alt="Ubuntu Mark"
                width={32}
                height={32}
                quality={95}
                priority
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>

            {/* Divider */}
            <span className="u-nav-divider" style={{
              width: '1px',
              height: '40px',
              background: 'rgba(255,255,255,0.15)',
            }} />

            {/* Ubuntu logo — larger with zoom on hover */}
            <div className="u-logo u-nav-wordmark" style={{
              width:         '110px',
              height:        '110px',
              borderRadius:  '4px',
              flexShrink:    0,
              overflow:      'hidden',
              position:      'relative',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              transformOrigin: 'center',
              marginLeft:    '20px',
              marginRight:   '12px',
            }}>
              <Image
                src="/branding/ubuntu-logo-primary.png"
                alt="Ubuntu Kreative Village Logo"
                width={110}
                height={110}
                quality={95}
                priority
                style={{ objectFit: 'contain', width: '100%', height: '100%' }}
              />
            </div>
          </Link>

          {/* NAV LINKS */}
          <nav className="hidden md:flex" style={{ alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
            {NAV.map((item) => {
              const active  = isActive(item.href)
              const ring    = hoveredItem === item.label

              return (
                <div
                  key={item.label}
                  onMouseEnter={() => open(item.label)}
                  style={{ position: 'relative', flexShrink: 0 }}
                >
                  <Link
                    href={item.href}
                    style={{
                      fontFamily:    "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                      fontSize:      '16px',
                      fontWeight:    600,
                      letterSpacing: '.12em',
                      textTransform: 'uppercase',
                      textDecoration:'none',
                      color:          hoveredItem === item.label
                        ? '#D4AF37'
                        : 'rgba(255,255,255,0.9)',
                      padding:        '14px 22px',
                      display:        'flex',
                      alignItems:     'center',
                      position:       'relative',
                      transition:     'color .18s ease, border-bottom .2s ease',
                      whiteSpace:     'nowrap',
                      borderBottom:   hoveredItem === item.label
                        ? '3px solid #D4AF37'
                        : 'none',
                    }}
                  >
                    {/* Animated ring */}
                    <span className={`u-ring ${ring ? 'u-ring-on' : 'u-ring-off'}`} aria-hidden="true" />
                    {item.label}
                  </Link>
                </div>
              )
            })}
          </nav>

          {/* RIGHT ACTIONS */}
          <div className="u-nav-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
            {/* Mobile hamburger (visible on small screens only) */}
            <button
              aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileOpen}
              aria-controls="mobile-menu"
              onClick={() => setMobileOpen(o => !o)}
              className="md:hidden flex items-center justify-center"
              style={{
                width: '42px', height: '42px', borderRadius: '50%', border: '1px solid rgba(255,255,255,0.12)',
                background: 'transparent', cursor: 'pointer', color: 'rgba(255,255,255,0.85)'
              }}
            >
              <span aria-hidden="true" style={{ fontSize: 18, lineHeight: 1 }}>{mobileOpen ? '✕' : '☰'}</span>
            </button>
            {/* Cart icon — permanent gold border with bounce on hover */}
            <button
              onClick={openCart}
              onMouseEnter={(e) => e.currentTarget.style.animation = 'u-cart-bounce 420ms cubic-bezier(0.34, 1.56, 0.64, 1)'}
              aria-label={`Open cart${cartCount > 0 ? ` (${cartCount} items)` : ''}`}
              className="u-cart-btn"
              style={{
                position:      'relative',
                width:          '48px',
                height:         '48px',
                borderRadius:   '50%',
                border:         '2px solid #D4AF37',
                background:    'transparent',
                display:       'flex',
                alignItems:    'center',
                justifyContent:'center',
                cursor:        'pointer',
                color:         '#D4AF37',
                fontSize:      '20px',
                transition:    'all .22s ease',
                flexShrink:    0,
                animation:     'glowingRing 18s ease-in-out infinite',
              }}
            >
              🛒
              {cartCount > 0 && (
                <span aria-hidden="true" style={{
                  position:      'absolute',
                  top:            '-4px',
                  right:          '-4px',
                  width:          '18px',
                  height:         '18px',
                  borderRadius:   '50%',
                  background:     '#D4AF37',
                  color:          '#000',
                  fontSize:       '9px',
                  fontWeight:     700,
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontFamily:     'Georgia, serif',
                }}>
                  {cartCount}
                </span>
              )}
            </button>

            {/* Reserve */}
            <Link href="/contact" className="u-reserve">
              RESERVE
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile menu slide-over (small screens only) */}
      {mobileOpen && (
        <div id="mobile-menu" className="md:hidden" style={{ position: 'fixed', inset: 0, zIndex: 1102, display: 'flex' }}>
          {/* overlay */}
          <div
            onClick={() => setMobileOpen(false)}
            aria-hidden="true"
            style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.2)' }}
          />

          {/* panel */}
          <nav
            role="dialog"
            aria-modal="true"
            aria-label="Main menu"
            style={{
              position: 'relative',
              background: 'rgba(8,8,8,0.35)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              width: '85%',
              maxWidth: '480px',
              height: '100%',
              padding: '24px',
              overflowY: 'auto',
              borderRight: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/branding/ubuntu-mark2.png" alt="Ubuntu Mark" width={40} height={40} style={{ objectFit: 'contain' }} />
                </div>
                <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.15)' }} />
                <div style={{ width: 48, height: 48, borderRadius: '4px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Image src="/branding/ubuntu-logo-primary.png" alt="Logo" width={48} height={48} style={{ objectFit: 'contain' }} />
                </div>
              </div>
              <button aria-label="Close menu" onClick={() => setMobileOpen(false)} style={{ background: 'transparent', border: 'none', color: 'rgba(255,255,255,0.9)', fontSize: 24, cursor: 'pointer' }}>✕</button>
            </div>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {NAV.map((item) => {
                const isExpanded = mobileExpanded === item.label
                return (
                  <li key={item.label}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Link
                        href={item.href}
                        onClick={() => { setMobileOpen(false); setOpenMenu(null); setHoveredItem(null) }}
                        style={{
                          flex: 1,
                          display: 'block',
                          padding: '16px 0',
                          color: 'rgba(255,255,255,0.9)',
                          textDecoration: 'none',
                          fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                          fontSize: 16,
                          letterSpacing: '.14em',
                          textTransform: 'uppercase',
                          fontWeight: 500,
                          borderBottom: '1px solid rgba(255,255,255,0.08)',
                        }}
                      >
                        {item.label}
                      </Link>
                      <button
                        onClick={() => setMobileExpanded(isExpanded ? null : item.label)}
                        aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.label} submenu`}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#D4AF37',
                          fontSize: 18,
                          cursor: 'pointer',
                          padding: '0 12px',
                          transition: 'transform .3s ease',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        }}
                      >
                        ▼
                      </button>
                    </div>

                    {/* Submenu */}
                    <div className="u-mobile-submenu" style={{
                      maxHeight: isExpanded ? '600px' : '0',
                      overflow: 'hidden',
                      opacity: isExpanded ? 1 : 0,
                      transition: 'max-height 300ms ease, opacity 300ms ease',
                    }}>
                      <div style={{ paddingBottom: '12px', display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {item.cols.map((col) => (
                          <div key={col.heading} style={{ paddingTop: '16px', paddingLeft: '12px' }}>
                            <p style={{
                              fontFamily: "'Cormorant Garamond', Georgia, serif",
                              fontSize: '11px',
                              letterSpacing: '.35em',
                              textTransform: 'uppercase',
                              color: 'rgba(212,175,55,0.7)',
                              marginBottom: '12px',
                              fontWeight: 500,
                            }}>
                              {col.heading}
                            </p>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              {col.links.map((link) => (
                                <Link
                                  key={link.href + link.label}
                                  href={link.href}
                                  onClick={() => { setMobileOpen(false); setMobileExpanded(null) }}
                                  style={{
                                    fontFamily: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
                                    fontSize: link.gold ? '13px' : '12px',
                                    fontWeight: link.gold ? 400 : 400,
                                    letterSpacing: '.1em',
                                    textTransform: 'uppercase',
                                    textDecoration: 'none',
                                    color: link.gold ? '#D4AF37' : 'rgba(255,255,255,0.65)',
                                    display: 'block',
                                    padding: '8px 0',
                                    fontStyle: link.gold ? 'italic' : 'normal',
                                    transition: 'color .2s ease',
                                  }}
                                  onMouseEnter={(e) => e.currentTarget.style.color = '#D4AF37'}
                                  onMouseLeave={(e) => e.currentTarget.style.color = link.gold ? '#D4AF37' : 'rgba(255,255,255,0.65)'}
                                >
                                  {link.label}
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                        <div style={{ paddingTop: '16px', paddingLeft: '12px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: '12px' }}>
                          <span style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '9px',
                            letterSpacing: '.25em',
                            textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.35)',
                            display: 'block',
                            paddingTop: '12px',
                          }}>
                            {item.ticker}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>

            <div style={{ marginTop: 32, borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 24 }}>
              <Link href="/contact" onClick={() => setMobileOpen(false)} className="u-reserve" style={{ display: 'inline-block' }}>
                RESERVE
              </Link>
            </div>
          </nav>
        </div>
      )}

      {/* ══ 3. MEGA DROPDOWN ═══════════════════════════════════════════════ */}
      {activeData && (
        <div
          onMouseEnter={cancelClose}
          onMouseLeave={scheduleClose}
          className={`u-dropdown ${openMenu ? 'u-dropdown-on' : 'u-dropdown-off'}`}
          style={{
            position:             'fixed',
            // sits directly below the main nav bar
            top:                   scrolled ? '92px' : '140px',
            left:                  0,
            right:                 0,
            zIndex:                1001,
            minHeight:             '280px',
            maxHeight:             'calc(100vh - 200px)',
            overflowY:             'auto',
            // Ultra-transparent glass effect — hero image clearly visible behind
            background:            'rgba(6,6,6,0.28)',
            backdropFilter:        'blur(18px)',
            WebkitBackdropFilter:  'blur(18px)',
            borderBottom:          '1px solid rgba(255,255,255,0.06)',
          }}
        >
          {/* Two-column link area */}
          <div style={{
            maxWidth:            '1440px',
            margin:              '0 auto',
            padding:             '36px 40px 28px',
            display:             'grid',
            gridTemplateColumns: '1fr 1fr',
            gap:                 '0 80px',
          }}>
            {activeData.cols.map((col) => (
              <div key={col.heading}>
                <p style={{
                  fontFamily:    "'Cormorant Garamond', Georgia, serif",
                  fontSize:      '9px',
                  letterSpacing: '.35em',
                  textTransform: 'uppercase',
                  color:         'rgba(212,175,55,0.6)',
                  marginBottom:  '20px',
                  fontWeight:    500,
                }}>
                  {col.heading}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {col.links.map((link) => (
                    <Link
                      key={link.href + link.label}
                      href={link.href}
                      className={`u-navlink${link.gold ? ' gold' : ''}`}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom ticker strip */}
          <div style={{
            borderTop:  '1px solid rgba(255,255,255,0.05)',
            padding:    '10px 40px',
            display:    'flex',
            alignItems: 'center',
            gap:        '8px',
          }}>
            <span aria-hidden="true" style={{
              width: '5px', height: '5px', borderRadius: '50%',
              background: '#D4AF37', display: 'inline-block', flexShrink: 0,
            }} />
            <span style={{
              fontFamily:    "'Cormorant Garamond', Georgia, serif",
              fontSize:      '9px',
              letterSpacing: '.28em',
              textTransform: 'uppercase',
              color:         'rgba(255,255,255,0.3)',
            }}>
              {activeData.ticker}
            </span>
          </div>
        </div>
      )}

      {/* Click-away to close dropdown */}
      {openMenu && (
        <div
          onClick={() => { setOpenMenu(null); setHoveredItem(null) }}
          style={{ position: 'fixed', inset: 0, zIndex: 998 }}
        />
      )}

      {/* Page spacer — pushes content below fixed nav */}
      <div style={{
        height:     scrolled ? '92px' : '140px',
        transition: 'height .35s ease',
        flexShrink: 0,
      }} />
    </>
  )
}