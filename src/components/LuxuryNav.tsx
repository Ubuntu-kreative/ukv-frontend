'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import { useCartStore } from '@/context/cartStore'

// ─────────────────────────────────────────────────────────────────────────────
// LUXURY NAVIGATION DATA — Editorial storytelling & ecosystem hierarchy
// ─────────────────────────────────────────────────────────────────────────────

interface EditorialContent {
  heroTitle: string
  heroSubtitle: string
  heroImage: string
  heroCta: string
  heroCtaLink: string
}

interface NavSection {
  title: string
  primary: { label: string; href: string; featured?: boolean }[]
  secondary: { label: string; href: string }[]
}

interface MegaMenuData {
  editorial: EditorialContent
  sections: NavSection[]
  ecosystemStatus: string
}

const LUXURY_NAV_DATA: Record<string, MegaMenuData> = {
  cottages: {
    editorial: {
      heroTitle: "Riverside Stays",
      heroSubtitle: "Thatched retreats woven into nature along the flowing river.",
      heroImage: "/images/Inko-farmhouse.jpg",
      heroCta: "Explore Stays",
      heroCtaLink: "/cottages"
    },
    sections: [
      {
        title: "ACCOMMODATIONS",
        primary: [
          { label: "Pokomo Cottage", href: "/cottages", featured: true },
          { label: "The Farmhouse", href: "/cottages", featured: true },
          { label: "Family Suite", href: "/cottages" }
        ],
        secondary: [
          { label: "View All Options", href: "/cottages" },
          { label: "Gallery", href: "/gallery" }
        ]
      },
      {
        title: "EXPERIENCES",
        primary: [
          { label: "Riverside Dining", href: "/restaurant" },
          { label: "Spa Wellness", href: "/spa" },
          { label: "Farm Activities", href: "/farm" }
        ],
        secondary: [
          { label: "Event Hosting", href: "/events" }
        ]
      }
    ],
    ecosystemStatus: "2 Cottages Available Tonight"
  },
  restaurant: {
    editorial: {
      heroTitle: "Full Moon Dinners",
      heroSubtitle: "Communal fire-lit dining beneath the stars with harvest-to-table cuisine.",
      heroImage: "/images/tomatoes.jpg",
      heroCta: "View Dining",
      heroCtaLink: "/restaurant"
    },
    sections: [
      {
        title: "DINING EXPERIENCES",
        primary: [
          { label: "Full Moon Dinner", href: "/restaurant", featured: true },
          { label: "Farm Breakfast", href: "/restaurant" },
          { label: "Lunch on the Lawn", href: "/restaurant" },
          { label: "Sundowner Dinner", href: "/restaurant" },
          { label: "Chef's Table", href: "/restaurant" },
          { label: "Private Dining", href: "/contact" }
        ],
        secondary: []
      },
      {
        title: "PHILOSOPHY",
        primary: [],
        secondary: [
          { label: "Farm-to-Fork", href: "/farm" },
          { label: "Our Story", href: "/about" }
        ]
      }
    ],
    ecosystemStatus: "Tonight: Full Moon Fire Dinner"
  },
  spa: {
    editorial: {
      heroTitle: "African Healing Rituals",
      heroSubtitle: "Rooted in botanical traditions and slow wellness practices.",
      heroImage: "/images/SukumaWiki.jpg",
      heroCta: "Explore Spa",
      heroCtaLink: "/spa"
    },
    sections: [
      {
        title: "HEALING RITUALS",
        primary: [
          { label: "Forest Therapy", href: "/spa", featured: true },
          { label: "Sound Healing", href: "/spa" },
          { label: "Botanical Baths", href: "/spa" },
          { label: "Massage Rituals", href: "/spa" }
        ],
        secondary: [
          { label: "Aromatherapy", href: "/spa" }
        ]
      },
      {
        title: "WELLNESS",
        primary: [
          { label: "Yoga at Dawn", href: "/spa" },
          { label: "Meditation", href: "/spa" },
          { label: "Breathwork", href: "/spa" }
        ],
        secondary: []
      }
    ],
    ecosystemStatus: "3 Sessions Available Today"
  },
  farm: {
    editorial: {
      heroTitle: "Harvest & Soil",
      heroSubtitle: "Walk the growing beds and eat what is picked, moments after harvest.",
      heroImage: "/images/Inko-farmhouse4.jpg",
      heroCta: "Visit Farm",
      heroCtaLink: "/farm"
    },
    sections: [
      {
        title: "FARM EXPERIENCES",
        primary: [
          { label: "Dawn Farm Walk", href: "/farm", featured: true },
          { label: "Harvest Day", href: "/farm" },
          { label: "Apiary Tour", href: "/farm" }
        ],
        secondary: [
          { label: "Learn More", href: "/farm" }
        ]
      },
      {
        title: "TASTE THE FARM",
        primary: [
          { label: "Farm Breakfast", href: "/restaurant" },
          { label: "Honey Tasting", href: "/farm" },
          { label: "Cook with Us", href: "/restaurant" }
        ],
        secondary: []
      }
    ],
    ecosystemStatus: "Today's Harvest: Sukuma Wiki · Lemongrass · Managu"
  },
  events: {
    editorial: {
      heroTitle: "Gather Beneath the Stars",
      heroSubtitle: "Celebrations, music, ritual, and connection in our enchanted village.",
      heroImage: "/images/goat.jpg",
      heroCta: "View Events",
      heroCtaLink: "/events"
    },
    sections: [
      {
        title: "CELEBRATIONS",
        primary: [
          { label: "Weddings", href: "/events", featured: true },
          { label: "Anniversaries", href: "/events" },
          { label: "Birthdays", href: "/events" }
        ],
        secondary: []
      },
      {
        title: "GATHERINGS",
        primary: [
          { label: "Full Moon Dinner", href: "/restaurant" },
          { label: "Seasonal Festival", href: "/events" },
          { label: "Art Night", href: "/events" }
        ],
        secondary: [
          { label: "Corporate Retreats", href: "/contact" }
        ]
      }
    ],
    ecosystemStatus: "Upcoming: Summer Solstice Celebration"
  },
  gallery: {
    editorial: {
      heroTitle: "Life at Ubuntu",
      heroSubtitle: "Stories, textures, harvests, and memories from our village.",
      heroImage: "/images/Inko-farmhouse.jpg",
      heroCta: "View Gallery",
      heroCtaLink: "/gallery"
    },
    sections: [
      {
        title: "VISUAL STORIES",
        primary: [
          { label: "The Lodge", href: "/gallery", featured: true },
          { label: "Farm Life", href: "/farm" },
          { label: "Spa & Wellness", href: "/spa" }
        ],
        secondary: []
      },
      {
        title: "MEMORIES",
        primary: [
          { label: "Guest Experiences", href: "/about" },
          { label: "Harvest Diary", href: "/farm" },
          { label: "Event Moments", href: "/events" }
        ],
        secondary: [
          { label: "About Ubuntu", href: "/about" }
        ]
      }
    ],
    ecosystemStatus: "12 Guests Currently on Farm"
  }
}

const TOP_NAV_ITEMS = [
  { label: 'Our Cottages', key: 'cottages', href: '/cottages' },
  { label: 'Restaurant', key: 'restaurant', href: '/restaurant' },
  { label: 'Spa', key: 'spa', href: '/spa' },
  { label: 'Farm', key: 'farm', href: '/farm' },
  { label: 'Events', key: 'events', href: '/events' },
  { label: 'Gallery', key: 'gallery', href: '/gallery' },
]

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATION VARIANTS — Cinematic, slow, atmospheric motion
// ─────────────────────────────────────────────────────────────────────────────

const LUXURY_EASE = [0.16, 1, 0.3, 1] as const

const dropdownVariants = {
  closed: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.4,
      ease: LUXURY_EASE,
    },
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: LUXURY_EASE,
      staggerChildren: 0.08,
    },
  },
} satisfies Variants

const contentVariants = {
  closed: {
    opacity: 0,
    y: 12,
  },
  open: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: LUXURY_EASE,
    },
  },
} satisfies Variants

const linkVariants = {
  closed: {
    opacity: 0,
    x: -8,
  },
  open: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: LUXURY_EASE,
    },
  },
} satisfies Variants

// ─────────────────────────────────────────────────────────────────────────────
// LUXURY NAVIGATION COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

export default function LuxuryNav() {
  const pathname = usePathname()
  const { items, openCart } = useCartStore()
  const [scrolled, setScrolled] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll effect for subtle nav transformation
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Dropdown timing — calm, not reactive
  const handleDropdownEnter = (key: string) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setActiveDropdown(key)
  }

  const handleDropdownLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null)
    }, 200)
  }

  const activeData = activeDropdown ? LUXURY_NAV_DATA[activeDropdown] : null

  return (
    <nav className={`luxury-nav ${scrolled ? 'scrolled' : ''}`}>
      {/* ── ATMOSPHERIC TOP BAR (collapse on scroll) ───────────────────────────────────────── */}
      <div className={`luxury-top-bar ${scrolled ? 'luxury-top-bar--collapsed' : ''}`}>
        <div className="luxury-top-bar-content">
          <div className="luxury-status-left">
            <div className="luxury-status-item">
              <span className="luxury-status-dot"></span>
              <span>Village Open</span>
            </div>
            <div className="luxury-status-item">
              <span>·</span>
              <span>Kenya</span>
            </div>
            <div className="luxury-status-item">
              <span>·</span>
              <span>Guests Welcome</span>
            </div>
          </div>
          
          {/* CENTER MOTTO */}
          <div className="luxury-top-bar-motto">
            <em>Refresh your soul, ground your spirit</em>
          </div>
          
          <div className="luxury-status-right">
            <span>Today's Harvest —</span>
            <span className="luxury-harvest-items">Sukuma Wiki · Lemongrass · Managu</span>
          </div>
        </div>
      </div>

      {/* ── MAIN NAVIGATION ──────────────────────────────────────────────── */}
      <div className={`luxury-main-nav ${scrolled ? 'scrolled' : ''}`}>
        <div className="luxury-nav-container">
          
          {/* Logo — Minimal luxury */}
          <Link href="/" className="luxury-logo">
            <img 
              src="/branding/ubuntu-mark2.png" 
              alt="Ubuntu"
              className="luxury-logo-mark"
            />
            <div className="luxury-logo-divider" />
            <img 
              src="/branding/ubuntu-logo-primary1.png" 
              alt="Kreative Village"
              className="luxury-logo-type"
            />
          </Link>

          {/* Navigation Links — Editorial spacing */}
          <div className="luxury-nav-links">
            {TOP_NAV_ITEMS.map((item) => (
              <div
                key={item.key}
                className="luxury-nav-item-wrapper"
                onMouseEnter={() => handleDropdownEnter(item.key)}
                onMouseLeave={handleDropdownLeave}
              >
                <Link
                  href={item.href}
                  className={`luxury-nav-link ${pathname.startsWith(item.href) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Cart + Reserve CTAs */}
          <div className="luxury-actions">
            {/* Cart with bounce animation */}
            <button 
              className="luxury-cart-button"
              onClick={openCart}
              aria-label="Open cart"
            >
              <svg 
                className="luxury-cart-icon" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5"
              >
                <path d="M9 20a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-7-3h7a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2a2 2 0 0 00-2 2v4a2 2 0 0 01-2 2h-2a2 2 0 0 00-2 2v4a2 2 0 0 002 2h2a2 2 0 0 012-2V8a2 2 0 0 012-2h4a2 2 0 0 012 2v4a2 2 0 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {items.length > 0 && (
                <span className="luxury-cart-badge">{items.length}</span>
              )}
            </button>

            {/* Reserve CTA — Cute, rounded, tilted */}
            <Link href="/contact" className="luxury-cta">
              Reserve
            </Link>
          </div>

        </div>
      </div>

      {/* ── EDITORIAL MEGA DROPDOWN ───────────────────────────────────────── */}
      <AnimatePresence>
        {activeDropdown && activeData && (
          <div
            ref={dropdownRef}
            className="luxury-dropdown-overlay"
            onMouseEnter={() => {
              if (timeoutRef.current) clearTimeout(timeoutRef.current)
            }}
            onMouseLeave={handleDropdownLeave}
          >
            <motion.div
              className="luxury-dropdown"
              variants={dropdownVariants}
              initial="closed"
              animate="open"
              exit="closed"
            >
              <div className="luxury-dropdown-content">
                
                {/* LEFT SIDE — Editorial Hero */}
                <motion.div 
                  className="luxury-dropdown-hero"
                  variants={contentVariants}
                >
                  <div className="luxury-hero-image-wrapper">
                    <img 
                      src={activeData.editorial.heroImage} 
                      alt={activeData.editorial.heroTitle}
                      className="luxury-hero-image"
                    />
                  </div>
                  <div className="luxury-hero-content">
                    <h2 className="luxury-hero-title">{activeData.editorial.heroTitle}</h2>
                    <p className="luxury-hero-subtitle">{activeData.editorial.heroSubtitle}</p>
                    <Link href={activeData.editorial.heroCtaLink} className="luxury-hero-cta">
                      {activeData.editorial.heroCta}
                    </Link>
                  </div>
                </motion.div>

                {/* RIGHT SIDE — Navigation Columns */}
                <motion.div 
                  className="luxury-dropdown-navigation"
                  variants={contentVariants}
                >
                  {activeData.sections.map((section, sectionIndex) => (
                    <div key={section.title} className="luxury-nav-section">
                      <h3 className="luxury-section-title">{section.title}</h3>
                      
                      {/* Primary Links */}
                      {section.primary.length > 0 && (
                        <div className="luxury-link-group luxury-link-group-primary">
                          {section.primary.map((link, linkIndex) => (
                            <motion.div
                              key={link.label}
                              variants={linkVariants}
                              custom={linkIndex}
                            >
                              <Link
                                href={link.href}
                                className={`luxury-nav-link-item ${link.featured ? 'featured' : ''}`}
                                onClick={(event) => {
                                  if (link.href.includes('#')) {
                                    event.preventDefault()
                                    const [, hash] = link.href.split('#')
                                    const element = document.getElementById(hash)
                                    if (element) {
                                      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
                                    }
                                    setActiveDropdown(null)
                                    window.history.pushState({}, '', link.href)
                                  }
                                }}
                              >
                                {link.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}

                      {/* Secondary Links */}
                      {section.secondary.length > 0 && (
                        <div className="luxury-link-group luxury-link-group-secondary">
                          {section.secondary.map((link, linkIndex) => (
                            <motion.div
                              key={link.label}
                              variants={linkVariants}
                              custom={linkIndex}
                            >
                              <Link 
                                href={link.href} 
                                className="luxury-nav-link-item secondary"
                              >
                                {link.label}
                              </Link>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </motion.div>

              </div>

              {/* BOTTOM STRIP — Living Ecosystem */}
              <motion.div 
                className="luxury-dropdown-ecosystem"
                variants={contentVariants}
              >
                <span className="luxury-ecosystem-pulse"></span>
                <span className="luxury-ecosystem-text">{activeData.ecosystemStatus}</span>
              </motion.div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── CINEMATIC STYLES ───────────────────────────────────────────────── */}
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Jost:wght@300;400;500&display=swap');

        :root {
          --luxury-charcoal: #1a1a1a;
          --luxury-warm-black: #0d0d0d;
          --luxury-muted-olive: #6b705c;
          --luxury-antique-gold: #c4a76c;
          --luxury-cream: #f5f0e8;
          --luxury-cream-muted: rgba(245, 240, 232, 0.7);
          --luxury-cream-subtle: rgba(245, 240, 232, 0.45);
          --luxury-gold-subtle: rgba(196, 167, 108, 0.15);
          --luxury-gold-glow: rgba(196, 167, 108, 0.3);
        }

        .luxury-nav {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: linear-gradient(180deg, rgba(13, 13, 13, 0.75) 0%, rgba(26, 26, 26, 0.65) 100%);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 1px 0 rgba(196, 167, 108, 0.04), 0 2px 12px rgba(0, 0, 0, 0.2);
          transition: background 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-nav.scrolled {
          background: linear-gradient(180deg, rgba(13, 13, 13, 0.95) 0%, rgba(13, 13, 13, 0.92) 100%);
          box-shadow: 0 1px 0 rgba(196, 167, 108, 0.02), 0 4px 16px rgba(0, 0, 0, 0.4);
        }

        /* TOP BAR */
        .luxury-top-bar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 32px;
          border-bottom: 1px solid rgba(196, 167, 108, 0.06);
          background: linear-gradient(180deg, rgba(196, 167, 108, 0.02) 0%, transparent 100%);
          position: relative;
          overflow: hidden;
          transform: translateY(0);
          opacity: 1;
          transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-top-bar--collapsed {
          transform: translateY(-100%);
          opacity: 0;
          pointer-events: none;
        }

        .luxury-top-bar::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(196, 167, 108, 0.2), transparent);
        }

        .luxury-top-bar-content {
          display: flex;
          align-items: center;
          gap: 32px;
          width: 100%;
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(237, 230, 211, 0.55);
          font-weight: 400;
        }

        .luxury-status-left {
          display: flex;
          align-items: center;
          gap: 20px;
          flex: 0 0 auto;
        }

        .luxury-status-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
        }

        .luxury-status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: #7cb07c;
          animation: luxury-pulse 3s ease-in-out infinite;
          box-shadow: 0 0 8px rgba(124, 176, 124, 0.5);
        }

        .luxury-top-bar-motto {
          flex: 1;
          text-align: center;
          font-style: italic;
          font-size: 12px;
          letter-spacing: 0.08em;
          color: rgba(212, 168, 83, 0.65);
          font-weight: 300;
          text-transform: none;
        }

        .luxury-status-right {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 0 0 auto;
          margin-left: auto;
        }

        .luxury-harvest-items {
          color: rgba(212, 168, 83, 0.75);
          font-weight: 400;
          font-size: 10px;
        }

        @keyframes luxury-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.6); }
        }


        /* MAIN NAV */
        .luxury-main-nav {
          padding: 16px 32px;
          transition: padding 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-main-nav.scrolled {
          padding: 12px 32px;
        }

        .luxury-nav-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 48px;
          max-width: 1600px;
          margin: 0 auto;
        }

        /* LOGO */
        .luxury-logo {
          display: flex;
          align-items: center;
          gap: 18px;
          text-decoration: none;
          position: relative;
          overflow: visible;
          z-index: 1;
          flex-shrink: 0;
        }

        .luxury-logo-divider {
          width: 1px;
          height: 48px;
          background: rgba(255, 255, 255, 0.15);
        }

        .luxury-logo-mark {
          height: 34px;
          width: auto;
          opacity: 0.95;
          transition: opacity 0.3s ease;
          flex-shrink: 0;
        }

        .luxury-logo:hover .luxury-logo-mark {
          opacity: 1;
        }

        .luxury-logo-type {
          height: 58px;
          width: auto;
          transform-origin: left center;
          transform: scale(1);
          transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }

        .luxury-logo:hover .luxury-logo-type {
          transform: scale(1.7);
        }

        .luxury-logo-text {
          display: none;
        }


        /* NAV LINKS */
        .luxury-nav-links {
          display: flex;
          align-items: center;
          gap: 42px;
          flex: 1;
          justify-content: center;
        }

        .luxury-nav-item-wrapper {
          position: relative;
        }

        .luxury-nav-link {
          font-size: 13px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(237, 230, 211, 0.65);
          text-decoration: none;
          position: relative;
          padding: 8px 0;
          transition: color 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }

        .luxury-nav-link::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212, 168, 83, 0.8), transparent);
          transition: width 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .luxury-nav-link:hover {
          color: rgba(237, 230, 211, 0.95);
        }

        .luxury-nav-link:hover::after {
          width: calc(100% + 20px);
        }

        .luxury-nav-link.active {
          color: rgba(212, 168, 83, 0.85);
          font-weight: 600;
        }

        .luxury-nav-link.active::after {
          width: calc(100% + 20px);
        }


        /* ACTIONS */
        .luxury-actions {
          display: flex;
          align-items: center;
          gap: 18px;
        }

        /* Cart Button */
        .luxury-cart-button {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          border: 1px solid rgba(212, 168, 83, 0.25);
          background: transparent;
          border-radius: 50%;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          color: rgba(237, 230, 211, 0.65);
        }

        .luxury-cart-button:hover {
          transform: translateY(-4px) scale(1.08);
          border-color: rgba(212, 168, 83, 0.6);
          color: rgba(212, 168, 83, 0.85);
          box-shadow: 0 8px 20px rgba(212, 168, 83, 0.15);
          animation: luxury-bounce 0.4s ease;
        }

        .luxury-cart-icon {
          transition: transform 0.3s ease;
        }

        .luxury-cart-button:hover .luxury-cart-icon {
          transform: scale(1.1);
        }

        .luxury-cart-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          min-width: 18px;
          height: 18px;
          border-radius: 50%;
          background: rgba(212, 168, 83, 0.8);
          color: var(--luxury-warm-black);
          font-size: 9px;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--luxury-warm-black);
          animation: luxury-pulse 2s ease-in-out infinite;
        }

        @keyframes luxury-bounce {
          0%, 100% { transform: translateY(-4px) scale(1.08); }
          50% { transform: translateY(-8px) scale(1.12); }
        }

        /* Reserve CTA — Cute, rounded, tilted */
        .luxury-cta {
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(212, 168, 83, 0.85);
          text-decoration: none;
          padding: 12px 28px;
          border: 1px solid rgba(212, 168, 83, 0.35);
          background: transparent;
          border-radius: 50px;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          position: relative;
          overflow: hidden;
          font-weight: 500;
          transform: rotate(-1deg);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }

        .luxury-cta:hover {
          transform: rotate(0deg) translateY(-2px);
          border-color: rgba(212, 168, 83, 0.6);
          background: rgba(212, 168, 83, 0.08);
          box-shadow: 0 12px 28px rgba(212, 168, 83, 0.12);
        }


        /* DROPDOWN OVERLAY */
        .luxury-dropdown-overlay {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: transparent;
          z-index: 999;
        }

        .luxury-dropdown {
          background: linear-gradient(180deg, rgba(13, 13, 13, 0.85) 0%, rgba(26, 26, 26, 0.75) 100%);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-top: none;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.03);
          margin-top: 4px;
        }

        .luxury-dropdown-content {
          display: grid;
          grid-template-columns: 1fr;
          gap: 72px;
          padding: 48px 64px;
          max-width: 1400px;
          margin: 0 auto;
        }

        /* DROPDOWN HERO */
        .luxury-dropdown-hero {
          display: none;
          flex-direction: column;
          gap: 28px;
        }

        .luxury-hero-image-wrapper {
          width: 100%;
          aspect-ratio: 16/10;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
          background: linear-gradient(135deg, rgba(212, 168, 83, 0.08) 0%, rgba(107, 112, 92, 0.06) 100%);
          border: 1px solid rgba(212, 168, 83, 0.1);
        }

        .luxury-hero-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
        }

        .luxury-hero-content {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .luxury-hero-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 32px;
          font-weight: 400;
          letter-spacing: 0.08em;
          color: rgba(237, 230, 211, 0.95);
          line-height: 1.2;
        }

        .luxury-hero-subtitle {
          font-size: 14px;
          line-height: 1.7;
          color: rgba(237, 230, 211, 0.6);
          font-weight: 300;
          letter-spacing: 0.02em;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }

        .luxury-hero-cta {
          font-size: 12px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(212, 168, 83, 0.8);
          text-decoration: none;
          padding: 12px 28px;
          border: 1px solid rgba(212, 168, 83, 0.3);
          background: rgba(212, 168, 83, 0.06);
          align-self: flex-start;
          transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
          font-weight: 500;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }

        .luxury-hero-cta:hover {
          background: rgba(212, 168, 83, 0.12);
          border-color: rgba(212, 168, 83, 0.6);
          box-shadow: 0 0 20px rgba(212, 168, 83, 0.15);
        }

        /* DROPDOWN NAVIGATION */
        .luxury-dropdown-navigation {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 48px;
        }

        .luxury-nav-section {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .luxury-section-title {
          font-size: 11px;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: rgba(212, 168, 83, 0.75);
          font-weight: 600;
          padding-bottom: 12px;
          border-bottom: 1px solid rgba(212, 168, 83, 0.1);
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }

        .luxury-link-group {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .luxury-link-group-secondary {
          gap: 10px;
        }

        .luxury-nav-link-item {
          font-size: 13px;
          letter-spacing: 0.05em;
          color: rgba(237, 230, 211, 0.65);
          text-decoration: none;
          transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          padding: 6px 0;
          position: relative;
          font-weight: 400;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }

        .luxury-nav-link-item:hover {
          color: rgba(237, 230, 211, 0.95);
          transform: translateX(4px);
        }

        .luxury-nav-link-item.featured {
          color: rgba(212, 168, 83, 0.75);
          font-weight: 500;
          font-style: italic;
        }

        .luxury-nav-link-item.secondary {
          font-size: 12px;
          color: rgba(237, 230, 211, 0.45);
          letter-spacing: 0.04em;
        }

        /* DROPDOWN ECOSYSTEM STRIP */
        .luxury-dropdown-ecosystem {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px 64px;
          border-top: 1px solid rgba(212, 168, 83, 0.08);
          background: linear-gradient(180deg, rgba(212, 168, 83, 0.02) 0%, transparent 100%);
        }

        .luxury-ecosystem-pulse {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #7cb07c;
          animation: luxury-pulse 2.5s ease-in-out infinite;
        }

        .luxury-ecosystem-text {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(237, 230, 211, 0.45);
          font-weight: 400;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
        }


        /* RESPONSIVE */
        @media (max-width: 1024px) {
          .luxury-nav-links {
            gap: 24px;
          }
          
          .luxury-nav-link {
            font-size: 11px;
            letter-spacing: 0.14em;
          }
          
          .luxury-dropdown-content {
            grid-template-columns: 1fr;
            gap: 40px;
            padding: 32px 40px;
          }
          
          .luxury-dropdown-navigation {
            grid-template-columns: repeat(2, 1fr);
            gap: 32px;
          }
        }

        @media (max-width: 768px) {
          .luxury-top-bar {
            display: none;
          }
          
          .luxury-main-nav {
            padding: 16px 20px;
          }
          
          .luxury-nav-container {
            gap: 24px;
          }
          
          .luxury-nav-links {
            display: none;
          }
          
          .luxury-logo-mark,
          .luxury-logo-type {
            height: 36px;
          }
          
          .luxury-cta {
            padding: 10px 20px;
            font-size: 10px;
          }
          
          .luxury-dropdown-navigation {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </nav>
  )
}
