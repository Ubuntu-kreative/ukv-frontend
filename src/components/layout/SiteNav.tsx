'use client'

import { useCartStore } from '@/context/cartStore'
import type { NavSection } from '@/app/page'

const NAV_ITEMS: { key: NavSection; label: string }[] = [
  { key: 'cottages',   label: 'Our Cottages' },
  { key: 'restaurant', label: 'Restaurant' },
  { key: 'spa',        label: 'Spa' },
  { key: 'farm',       label: 'Farm' },
  { key: 'events',     label: 'Events' },
  { key: 'calendar',   label: 'Calendar' },
]

interface SiteNavProps {
  activeSection: NavSection
  onNavigate: (s: NavSection) => void
}

export function SiteNav({ activeSection, onNavigate }: SiteNavProps) {
  const { items, openCart } = useCartStore()

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: 'rgba(13,12,9,0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '0.5px solid rgba(200,168,75,0.14)',
      }}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between px-8 md:px-10 h-14">
        {/* Logo */}
        <button
          onClick={() => onNavigate('cottages')}
          className="text-left leading-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          <span className="text-[20px] font-light tracking-wide text-[#ede6d3]">
            Ubuntu{' '}
            <em className="text-[#c8a84b]">Kreative</em>
          </span>
          <span
            className="block text-[9px] tracking-[0.2em] uppercase mt-0.5"
            style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
          >
            Kenya · Eco Lodge · Est. 2024
          </span>
        </button>

        {/* Cart */}
        <button
          onClick={openCart}
          className="flex items-center gap-2.5 transition-all duration-200 group"
          style={{ color: 'var(--muted)' }}
        >
          {/* Cart icon */}
          <svg
            width="18" height="16" viewBox="0 0 18 16" fill="none"
            className="group-hover:stroke-[#c8a84b] transition-colors"
            stroke="currentColor" strokeWidth="1"
          >
            <path d="M1 1h2.5l1.8 8h8.4l1.8-6H4.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="7.5" cy="14" r="1" fill="currentColor" stroke="none" />
            <circle cx="12.5" cy="14" r="1" fill="currentColor" stroke="none" />
          </svg>
          <span
            className="text-[10px] tracking-[0.18em] uppercase group-hover:text-[#c8a84b] transition-colors"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Cart
          </span>
          {/* Badge */}
          <span
            className="flex items-center justify-center w-[22px] h-[22px] rounded-full text-[10px] font-medium transition-all"
            style={{
              background: items.length > 0 ? 'var(--gold)' : 'rgba(200,168,75,0.15)',
              color: items.length > 0 ? 'var(--bg)' : 'var(--muted)',
              border: '0.5px solid rgba(200,168,75,0.3)',
            }}
          >
            {items.length}
          </span>
        </button>
      </div>

      {/* Nav links */}
      <div
        className="flex overflow-x-auto"
        style={{ borderTop: '0.5px solid rgba(237,230,211,0.07)', scrollbarWidth: 'none' }}
      >
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            onClick={() => onNavigate(item.key)}
            className="relative px-6 py-2.5 text-[10px] tracking-[0.16em] uppercase whitespace-nowrap transition-all duration-200"
            style={{
              fontFamily: 'var(--font-body)',
              color: activeSection === item.key ? 'var(--gold)' : 'var(--muted)',
              borderBottom: activeSection === item.key
                ? '1.5px solid var(--gold)'
                : '1.5px solid transparent',
              marginBottom: '-0.5px',
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </nav>
  )
}
