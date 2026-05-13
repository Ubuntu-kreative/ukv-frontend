'use client'

import { SectionDivider } from '@/components/ui/SectionDivider'
import { ProductCard } from '@/components/ui/ProductCard'
import { EVENT_PACKAGES, PUBLIC_EVENTS } from '@/lib/data'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'

const EVENT_TYPES = [
  { id: 'ev-corp', icon: '🏢', name: 'Corporate',  sub: 'Retreats · Offsites · Leadership',      price: 320000, tag: 'Corporate Event' },
  { id: 'ev-wed',  icon: '🌿', name: 'Weddings',   sub: 'Ceremonies · Receptions · Honeymoons',  price: 480000, tag: 'Private Wedding' },
  { id: 'ev-art',  icon: '🎨', name: 'Creative',   sub: 'Residencies · Workshops · Collabs',     price: 85000,  tag: 'Creative Residency' },
  { id: 'ev-cult', icon: '🥁', name: 'Community',  sub: 'Cultural Events · Rituals · Gatherings',price: 55000,  tag: 'Community Gathering' },
]

export function EventsSection() {
  const { items, addItem } = useCartStore()

  const handleTypeAdd = (ev: typeof EVENT_TYPES[0]) => {
    if (items.some((i) => i.id === ev.id)) {
      toast('Already in your booking', { icon: '✦' })
      return
    }
    addItem({ id: ev.id, name: ev.name, tag: ev.tag, category: 'event-package', price: ev.price, unit: '/ event' })
    toast.success(`${ev.name} event added — our team will be in touch`)
  }

  return (
    <div className="animate-fade-up px-8 md:px-10 py-14">

      {/* ── Events Banner ── */}
      <div
        className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-12 mb-14"
        style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)' }}
      >
        <div>
          <h2
            className="text-[46px] font-light leading-[1.08] mb-4"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Your event,<br />
            the{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>village&apos;s</em>
            <br />soul
          </h2>
          <p className="text-[13px] leading-[1.85]" style={{ color: 'var(--muted)' }}>
            From intimate board retreats to full-village weddings. Ubuntu is built to host what matters
            — rooted in the land, shaped entirely by the purpose of your gathering.
          </p>
        </div>

        {/* Event type tiles */}
        <div className="grid grid-cols-2 gap-3">
          {EVENT_TYPES.map((ev) => (
            <button
              key={ev.id}
              onClick={() => handleTypeAdd(ev)}
              className="text-left p-5 transition-all duration-200 group"
              style={{
                background: 'var(--bg3)',
                border: '0.5px solid var(--border2)',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--gold)'
                el.style.background = 'var(--bg4)'
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.borderColor = 'var(--border2)'
                el.style.background = 'var(--bg3)'
              }}
            >
              <div className="text-[22px] mb-2">{ev.icon}</div>
              <div
                className="text-[17px] font-light mb-1"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
              >
                {ev.name}
              </div>
              <div className="text-[11px]" style={{ color: 'var(--muted)' }}>
                {ev.sub}
              </div>
              <div
                className="text-[9px] tracking-[0.12em] uppercase mt-3"
                style={{ color: 'var(--gold)' }}
              >
                + Add to cart
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Packages ── */}
      <SectionDivider label="Event Packages" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(200,168,75,0.1)] mb-16">
        {EVENT_PACKAGES.map((pkg, i) => (
          <div
            key={pkg.id}
            className="relative flex flex-col p-8 animate-fade-up"
            style={{
              background: pkg.featured ? 'var(--bg3)' : 'var(--bg2)',
              animationDelay: `${i * 80}ms`,
            }}
          >
            {pkg.featured && (
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.14em] uppercase px-4 py-1"
                style={{ background: 'var(--gold)', color: 'var(--bg)', fontFamily: 'var(--font-body)' }}
              >
                Most Requested
              </div>
            )}
            <div className="mt-4">
              <h3
                className="text-[26px] font-light mb-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {pkg.name}
              </h3>
              <p className="text-[10px] mb-5" style={{ color: 'var(--sage2)', fontFamily: 'var(--font-body)' }}>
                {pkg.tag}
              </p>
              <ul className="space-y-1.5 mb-6">
                {(pkg.includes || []).map((f) => (
                  <li key={f} className="flex gap-2 items-start text-[12px]" style={{ color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '9px', marginTop: '3px' }}>—</span>
                    {f}
                  </li>
                ))}
              </ul>
              <p
                className="text-[28px] font-light mb-1"
                style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
              >
                KES {pkg.price.toLocaleString()}
              </p>
              <p className="text-[11px] mb-5" style={{ color: 'var(--muted)' }}>
                {pkg.unit}
              </p>
              <ProductCard product={pkg} />
            </div>
          </div>
        ))}
      </div>

      {/* ── Public Events ── */}
      <SectionDivider label="Upcoming Public Events" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(200,168,75,0.1)]">
        {PUBLIC_EVENTS.map((ev, i) => (
          <ProductCard key={ev.id} product={ev} delay={i * 60} />
        ))}
      </div>
    </div>
  )
}
