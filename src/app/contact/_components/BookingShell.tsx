'use client'

// ─────────────────────────────────────────────────────────────
// BookingShell.tsx — Main client island for /book page
//
// Contains: tab navigation · calendar · service grid · contact form
//
// PREMIUM BUILD v2:
//  ✓ Edge-to-edge layout with max-w-[1400px] + responsive padding
//  ✓ Fixed-width BookTab calendar (380px) on lg+
//  ✓ ServicesTab: lg:grid-cols-3 xl:grid-cols-4
//  ✓ Premium modal: scale(0.94)→scale(1), full-screen padding
//  ✓ Proper close button (36x36 circle with SVG)
//  ✓ Real contact details + social links
//  ✓ Tab underline animation, ring effects, grain overlay
//  ✓ Focus traps, aria-live, smooth animations
// ─────────────────────────────────────────────────────────────

import {
  useState, useCallback, useRef, useEffect, memo, useMemo,
} from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { useCartStore } from '@/context/cartStore'
import {
  UKV_SERVICES, SERVICE_CATEGORIES, MPESA_PAYBILL, MPESA_ACCOUNT,
  type UKVService, type ServiceCategory,
} from '@/lib/services-aggregator'
import type { CalendarEvent } from '../_data/booking-data'

// Lazy-load the calendar — saves ~18kB from initial bundle
const MiniCalendar = dynamic(
  () => import('./MiniCalendar').then(m => ({ default: m.MiniCalendar })),
  { ssr: false, loading: () => <div className="h-64 w-full max-w-sm animate-pulse bg-white/5 rounded-xl" /> }
)

// ── Inject modal styles once ────────────────────────────────────
function injectModalStyles() {
  if (typeof document === 'undefined') return
  if (document.getElementById('ukv-modal-styles')) return
  
  const style = document.createElement('style')
  style.id = 'ukv-modal-styles'
  style.textContent = `
    @keyframes modal-scale-in {
      from { opacity: 0; transform: scale(0.94); }
      to { opacity: 1; transform: scale(1); }
    }
    .ukv-modal-panel {
      animation: modal-scale-in 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .ukv-modal-scroll::-webkit-scrollbar {
      width: 3px;
    }
    .ukv-modal-scroll::-webkit-scrollbar-track {
      background: transparent;
    }
    .ukv-modal-scroll::-webkit-scrollbar-thumb {
      background: rgba(255,255,255,0.1);
      border-radius: 99px;
    }
    @keyframes grain-shimmer {
      0%, 100% { opacity: 0.03; }
      50% { opacity: 0.05; }
    }
    .grain-overlay {
      position: absolute;
      inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' seed='1' /%3E%3C/filter%3E%3Crect width='100' height='100' filter='url(%23noise)' /%3E%3C/svg%3E");
      animation: grain-shimmer 8s ease-in-out infinite;
      pointer-events: none;
    }
    @keyframes pop-in {
      from { transform: scale(0.4); opacity: 0; }
      to { transform: scale(1); opacity: 1; }
    }
    .pop-in {
      animation: pop-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    }
    @keyframes arrow-slide {
      from { transform: translateX(0); }
      to { transform: translateX(4px); }
    }
    .arrow-animate:hover .arrow-icon {
      animation: arrow-slide 0.3s ease-out forwards;
    }
  `
  document.head.appendChild(style)
}

type TabId = 'book' | 'services' | 'contact'

const TABS: { id: TabId; label: string; desc: string }[] = [
  { id: 'book',     label: 'Book a Stay',   desc: 'Availability & Calendar' },
  { id: 'services', label: 'All Services',  desc: 'Browse & Reserve'        },
  { id: 'contact',  label: 'Get in Touch',  desc: 'Enquiries & Info'        },
]

// ── MAIN SHELL ────────────────────────────────────────────────
export function BookingShell() {
  const [activeTab,       setActiveTab]       = useState<TabId>('book')
  const [selectedService, setSelectedService] = useState<UKVService | null>(null)
  const [prefillDate,     setPrefillDate]     = useState<string>('')
  const [tabUnderlinePos, setTabUnderlinePos] = useState({ left: 0, width: 0 })
  const openCart = useCartStore(s => s.openCart)
  const cartCount = useCartStore(s => s.items.length)
  const tabBarRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    injectModalStyles()
  }, [])

  useEffect(() => {
    if (!tabBarRef.current) return
    const tabIndex = TABS.findIndex(t => t.id === activeTab)
    if (tabIndex === -1) return
    
    const buttons = Array.from(tabBarRef.current.querySelectorAll('button'))
    const activeButton = buttons[tabIndex]
    
    if (activeButton) {
      setTabUnderlinePos({
        left: activeButton.offsetLeft,
        width: activeButton.offsetWidth,
      })
    }
  }, [activeTab])

  const handleDateClick = useCallback((dateStr: string) => {
    setPrefillDate(dateStr)
    setActiveTab('services')
  }, [])

  const handleEventClick = useCallback((ev: CalendarEvent) => {
    if (ev.serviceId) {
      const svc = UKV_SERVICES.find(s => s.id === ev.serviceId)
      if (svc) setSelectedService(svc)
    }
  }, [])

  const handleSelectService = useCallback((svc: UKVService) => {
    setSelectedService(svc)
  }, [])

  return (
    <>
      {/* ── PAGE HERO ── */}
      <section className="relative pt-28 pb-16 px-6 md:px-12 lg:px-20 overflow-hidden">
        {/* Grain overlay */}
        <div className="grain-overlay" />
        
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,168,75,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,65,0.03),transparent_50%)]" />
        </div>

        <div className="relative max-w-[1400px] mx-auto">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-8 h-px bg-[var(--gold)]/60" />
            <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--gold)]/50">
              Ubuntu Kreative Village · Reservations
            </span>
          </div>

          <h1 className="font-display text-[clamp(2.5rem,7vw,5.5rem)] font-light leading-[0.88] mb-5">
            Book your<br />
            <em className="not-italic text-[var(--gold)]">stay at the village</em>
          </h1>

          <p className="font-body text-sm text-white/40 max-w-lg leading-relaxed">
            Reserve a Pokomo Cottage, Farmhouse Suite or Penthouse. Book Arohamai Spa,
            farm experiences and private events. Enquiries confirmed within 2–4 hours.
          </p>
        </div>
      </section>

      {/* ── TAB BAR ── */}
      <div
        className="sticky top-[64px] sm:top-[72px] z-30 border-y border-white/5 px-6 md:px-12 lg:px-20"
        style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-[1400px] mx-auto flex items-center relative">
          <div className="flex items-center flex-1 overflow-x-auto scrollbar-hide" ref={tabBarRef}>
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex flex-col py-4 pr-8 transition-colors duration-200 flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none rounded-sm"
              >
                <span className={[
                  'font-body text-xs uppercase tracking-[0.15em] transition-colors',
                  activeTab === tab.id ? 'text-[var(--gold)]' : 'text-white/40 hover:text-white/60',
                ].join(' ')}>
                  {tab.label}
                </span>
                <span className="font-body text-[10px] text-white/20 mt-0.5 uppercase tracking-widest">
                  {tab.desc}
                </span>
              </button>
            ))}
          </div>

          {/* Animated underline */}
          <div
            className="absolute bottom-0 left-0 h-[2px] bg-[var(--gold)] transition-all duration-300"
            style={{
              left: `${tabUnderlinePos.left}px`,
              width: `${tabUnderlinePos.width}px`,
            }}
          />

          {cartCount > 0 && (
            <button
              onClick={openCart}
              className="ml-auto flex items-center gap-2 py-2 px-3 transition-all font-body flex-shrink-0 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none rounded-lg"
              style={{
                background: 'rgba(200,168,75,0.1)',
                border: '0.5px solid rgba(200,168,75,0.25)',
              }}
              aria-live="polite"
            >
              <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-black text-[8px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
              <span className="text-[9px] uppercase tracking-widest text-[var(--gold)]">Cart</span>
            </button>
          )}
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="px-6 md:px-12 lg:px-20 py-12">
        <div className="max-w-[1400px] mx-auto">

          {/* ── BOOK TAB ── */}
          <div className={activeTab === 'book' ? 'block' : 'hidden'}>
            <BookTab
              onDateClick={handleDateClick}
              onEventClick={handleEventClick}
              onSelectService={handleSelectService}
            />
          </div>

          {/* ── SERVICES TAB ── */}
          <div className={activeTab === 'services' ? 'block' : 'hidden'}>
            <ServicesTab
              prefillDate={prefillDate}
              onSelectService={handleSelectService}
            />
          </div>

          {/* ── CONTACT TAB ── */}
          <div className={activeTab === 'contact' ? 'block' : 'hidden'}>
            <ContactTab onSelectService={handleSelectService} />
          </div>
        </div>
      </div>

      {/* ── SERVICE MODAL ── */}
      {selectedService && (
        <ServiceModal
          service={selectedService}
          prefillDate={prefillDate}
          onClose={() => setSelectedService(null)}
        />
      )}
    </>
  )
}

// ── BOOK TAB — calendar + quick picks ────────────────────────
function BookTab({ onDateClick, onEventClick, onSelectService }: {
  onDateClick: (d: string) => void
  onEventClick: (ev: CalendarEvent) => void
  onSelectService: (s: UKVService) => void
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-10 items-start">
      {/* Left: compact calendar (fixed 380px width on lg+) */}
      <div
        className="p-6 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-body text-xs uppercase tracking-[0.3em] text-white/30 mb-4">
          Village Schedule
        </p>
        <MiniCalendar onDateClick={onDateClick} onEventClick={onEventClick} />
      </div>

      {/* Right: quick book cards */}
      <div>
        <div className="mb-5">
          <p className="font-body text-xs uppercase tracking-[0.3em] text-white/30">
            Quick Reserve
          </p>
          <p className="font-body text-[10px] text-white/20 mt-1 uppercase tracking-wider">
            Click any card to open the booking modal
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {UKV_SERVICES.filter(s =>
            ['marula', 'acacia-penthouse', 'exp-001',
             'mud-bath', 'bk-3', 'stress-relief-package'].includes(s.id)
          ).map(svc => (
            <QuickBookCard key={svc.id} svc={svc} onSelect={onSelectService} />
          ))}
        </div>
      </div>
    </div>
  )
}

// Memoized quick book card — only re-renders if svc changes (it never does)
const QuickBookCard = memo(function QuickBookCard({
  svc, onSelect,
}: { svc: UKVService; onSelect: (s: UKVService) => void }) {
  const catColor = SERVICE_CATEGORIES.find(c => c.id === svc.category)?.color ?? 'var(--gold)'
  const handleClick = useCallback(() => onSelect(svc), [svc, onSelect])

  return (
    <button
      onClick={handleClick}
      className="group w-full text-left p-4 rounded-xl transition-all duration-200"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '0.5px solid rgba(255,255,255,0.07)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${catColor}40, 0 8px 32px rgba(0,0,0,0.4)`
        e.currentTarget.style.transform = 'scale(1.005)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      aria-label={svc.name}
    >
      <div className="flex flex-col gap-4">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {svc.badge && (
              <span
                className="inline-block font-body text-xs uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5"
                style={{ background: `${catColor}15`, color: catColor, border: `0.5px solid ${catColor}40` }}
              >
                {svc.badge}
              </span>
            )}
            <p className="font-body text-sm text-white/80 group-hover:text-white transition-colors truncate">
              {svc.name}
            </p>
            <p className="font-body text-xs text-white/35 mt-0.5 truncate">{svc.tagline}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="font-display text-base" style={{ color: catColor }}>
              {svc.price === 0 ? 'Enquire' : `KES ${svc.price.toLocaleString()}`}
            </p>
            <p className="font-body text-[9px] text-white/25">{svc.priceNote}</p>
          </div>
        </div>

        {/* Affordance row — makes clear it opens a booking modal */}
        <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
          <span className="font-body uppercase tracking-widest text-white/30" style={{ color: `${catColor}60` }}>
            {svc.tag}
          </span>
          <span className="font-body uppercase tracking-wider font-semibold" style={{ color: catColor }}>
            Reserve →
          </span>
        </div>
      </div>
    </button>
  )
})

// ── SERVICES TAB ─────────────────────────────────────────────
function ServicesTab({ prefillDate, onSelectService }: {
  prefillDate: string
  onSelectService: (s: UKVService) => void
}) {
  const [activeCategory, setActiveCategory] = useState<'all' | ServiceCategory>('all')

  const filtered = useMemo(() =>
    activeCategory === 'all'
      ? UKV_SERVICES
      : UKV_SERVICES.filter(s => s.category === activeCategory),
  [activeCategory])

  return (
    <div>
      {prefillDate && (
        <div
          className="mb-6 px-4 py-3 rounded-lg flex items-center gap-3"
          style={{ background: 'rgba(200,168,75,0.06)', border: '0.5px solid rgba(200,168,75,0.2)' }}
        >
          <span className="text-[var(--gold)] text-sm">📅</span>
          <p className="font-body text-xs text-white/50">
            Planning for{' '}
            <span className="text-[var(--gold)]">
              {new Date(prefillDate).toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {' '}— select any service to pre-fill the date
          </p>
        </div>
      )}

      {/* Category filter — scrollable on mobile without scrollbar */}
      <div className="flex gap-2 mb-7 overflow-x-auto scrollbar-hide pb-2">
        <CategoryPill
          label="All"
          active={activeCategory === 'all'}
          color="var(--gold)"
          onClick={() => setActiveCategory('all')}
        />
        {SERVICE_CATEGORIES.map(cat => (
          <CategoryPill
            key={cat.id}
            label={cat.label}
            icon={cat.icon}
            active={activeCategory === cat.id}
            color={cat.color}
            onClick={() => setActiveCategory(cat.id)}
          />
        ))}
      </div>

      {/* Service grid: 4 columns on xl+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(svc => (
          <ServiceCard key={svc.id} svc={svc} onSelect={onSelectService} />
        ))}
      </div>
    </div>
  )
}

// Pure CSS pill — with active state bottom border
function CategoryPill({ label, icon, active, color, onClick }: {
  label: string; icon?: string; active: boolean; color: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={[
        'flex items-center gap-1.5 px-4 py-2 rounded-lg font-body text-xs uppercase tracking-wider transition-all duration-200 flex-shrink-0',
        'focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none',
      ].join(' ')}
      style={{
        background: active ? `${color}15` : 'rgba(255,255,255,0.03)',
        border: `0.5px solid ${active ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
        color: active ? color : 'rgba(255,255,255,0.35)',
        borderBottom: active ? `2px solid ${color}` : `0.5px solid ${active ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  )
}

// Memoized service card with ring effect on hover
const ServiceCard = memo(function ServiceCard({
  svc, onSelect,
}: { svc: UKVService; onSelect: (s: UKVService) => void }) {
  const [imgErr, setImgErr] = useState(false)
  const catColor = SERVICE_CATEGORIES.find(c => c.id === svc.category)?.color ?? 'var(--gold)'
  const handleClick = useCallback(() => onSelect(svc), [svc, onSelect])
  const handleImgErr = useCallback(() => setImgErr(true), [])

  return (
    <button
      onClick={handleClick}
      className="group w-full text-left rounded-xl overflow-hidden transition-all duration-300"
      style={{ background: 'rgba(255,255,255,0.025)', border: '0.5px solid rgba(255,255,255,0.07)' }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = `0 0 0 1px ${catColor}40, 0 8px 32px rgba(0,0,0,0.4)`
        e.currentTarget.style.transform = 'scale(1.005)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = 'none'
        e.currentTarget.style.transform = 'scale(1)'
      }}
      aria-label={svc.name}
      role="link"
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={imgErr
            ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600'
            : svc.image}
          alt={svc.name}
          fill
          sizes="(max-width:640px) 100vw, (max-width:1024px) 50vw, (max-width:1280px) 33vw, 25vw"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={handleImgErr}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {svc.badge && (
          <span
            className="absolute top-3 left-3 font-body text-xs uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: `${catColor}20`, border: `0.5px solid ${catColor}60`, color: catColor }}
          >
            {svc.badge}
          </span>
        )}

        <div className="absolute bottom-3 left-3">
          <p className="font-display text-xl leading-none" style={{ color: catColor }}>
            {svc.price === 0 ? 'Enquire' : `KES ${svc.price.toLocaleString()}`}
          </p>
          <p className="font-body text-[10px] text-white/40 mt-0.5">{svc.priceNote}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: catColor }}>
          {svc.tag}
        </p>
        <p className="font-body text-base text-white/80 group-hover:text-white transition-colors mb-0.5">
          {svc.name}
        </p>
        <p className="font-body text-xs text-white/35 line-clamp-2 leading-relaxed">
          {svc.tagline}
        </p>
      </div>
    </button>
  )
})

// ── CONTACT TAB ──────────────────────────────────────────────
function ContactTab({ onSelectService }: { onSelectService: (s: UKVService) => void }) {
  return (
    <div className="space-y-10">
      {/* Contact Info Section — 6 columns on xl */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {[
          {
            icon: '📍',
            label: 'Address',
            value: 'Tuala, Kajiado County\nNairobi – Kenya',
            accent: 'var(--neon)',
            href: 'https://maps.google.com/?q=Ubuntu+Kreative+Village+Nairobi+Kenya',
          },
          {
            icon: '☎',
            label: 'Phone & WhatsApp',
            value: '0111 541 911',
            accent: 'var(--gold)',
            href: 'https://wa.me/254111541911',
          },
          {
            icon: '✉',
            label: 'Email',
            value: 'ubuntukreativevillage@gmail.com',
            accent: '#F0A8B8',
            href: 'mailto:ubuntukreativevillage@gmail.com',
          },
          {
            icon: 'ₘ',
            label: 'M-Pesa Pay',
            value: `Paybill ${MPESA_PAYBILL}\nAccount ${MPESA_ACCOUNT}`,
            accent: 'var(--gold)',
          },
          {
            icon: '🕐',
            label: 'Hours',
            value: '24/7 Reservations\n8 AM – 8 PM Spa',
            accent: '#A8D4B4',
          },
          {
            icon: '📱',
            label: 'Social',
            value: 'Instagram · Facebook · Twitter\n@Ubuntu_eco_lodge',
            accent: 'var(--neon)',
            href: 'https://www.instagram.com/Ubuntu_eco_lodge',
          },
        ].map((contact, idx) => (
          <a
            key={idx}
            href={contact.href}
            target={contact.href?.startsWith('http') ? '_blank' : undefined}
            rel={contact.href?.startsWith('http') ? 'noopener noreferrer' : undefined}
            className="group p-4 rounded-xl transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
            style={{
              background: 'rgba(255,255,255,0.02)',
              border: '0.5px solid rgba(255,255,255,0.07)',
              cursor: contact.href ? 'pointer' : 'default',
            }}
            onMouseEnter={(e) => {
              if (contact.href) {
                e.currentTarget.style.transform = 'scale(1.02)'
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)'
            }}
          >
            <div className="flex items-start gap-3">
              <span className="text-lg flex-shrink-0">{contact.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="font-body text-xs uppercase tracking-widest mb-1" style={{ color: contact.accent }}>
                  {contact.label}
                </p>
                <p className="font-body text-xs text-white/70 group-hover:text-white transition-colors whitespace-pre-line leading-relaxed">
                  {contact.value}
                </p>
              </div>
            </div>
          </a>
        ))}
      </div>

      {/* Social Links Pills */}
      <div className="flex gap-3 flex-wrap">
        {[
          { label: 'Instagram', icon: '📷', href: 'https://www.instagram.com/Ubuntu_eco_lodge' },
          { label: 'Facebook', icon: 'f', href: 'https://www.facebook.com/Ubuntu_eco_lodge' },
          { label: 'WhatsApp', icon: '💬', href: 'https://wa.me/254111541911' },
        ].map((social, idx) => (
          <a
            key={idx}
            href={social.href}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-200 font-body text-xs uppercase tracking-widest focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
            style={{
              border: '0.5px solid rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.4)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.color = 'rgba(255,255,255,1)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'
              e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
            }}
          >
            <span>{social.icon}</span>
            <span>{social.label}</span>
          </a>
        ))}
      </div>

      {/* Opening Hours & Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          className="p-6 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}
        >
          <h4 className="font-display text-lg font-light mb-4">Hours of Operation</h4>
          <div className="space-y-3 font-body text-sm text-white/60">
            <div className="flex justify-between">
              <span>Village & Reservations</span>
              <span className="text-white/40">Open 24 hours</span>
            </div>
            <div className="flex justify-between">
              <span>Arohamai Spa</span>
              <span className="text-white/40">8 AM – 8 PM Daily</span>
            </div>
            <div className="flex justify-between">
              <span>Restaurant Breakfast</span>
              <span className="text-white/40">6:30 – 10 AM</span>
            </div>
            <div className="flex justify-between">
              <span>Restaurant Lunch</span>
              <span className="text-white/40">12 – 3 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Restaurant Dinner</span>
              <span className="text-white/40">6:30 – 10 PM</span>
            </div>
            <div className="flex justify-between">
              <span>Farm Tours</span>
              <span className="text-white/40">Daily from 6 AM</span>
            </div>
          </div>
        </div>

        <div
          className="p-6 rounded-xl"
          style={{ background: 'rgba(0,255,65,0.04)', border: '0.5px solid rgba(0,255,65,0.15)' }}
        >
          <h4 className="font-display text-lg font-light mb-4">Moxie — Chat with Us</h4>
          <p className="font-body text-sm text-white/50 mb-4 leading-relaxed">
            Skip the form. Ask Moxie to check availability, describe the cottages, suggest meals, or answer questions about the village. Available 24/7.
          </p>
          <button
            className="w-full py-3 rounded-lg font-body text-sm uppercase tracking-[0.15em] transition-all focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
            style={{
              background: 'var(--neon)',
              color: 'var(--obsidian)',
              cursor: 'pointer',
            }}
            onClick={() => {
              const b = document.querySelector('.moxie-bubble') as HTMLElement
              b?.click()
            }}
          >
            Start Chat →
          </button>
        </div>
      </div>

      {/* Inquiry Form */}
      <div className="max-w-2xl">
        <ContactForm />
      </div>
    </div>
  )
}

// ── CONTACT FORM ─────────────────────────────────────────────
// Isolated component — form state lives here, never causes
// parent re-renders while typing
function ContactForm() {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', subject: '', source: '', contactMethod: 'email', message: '',
  })
  const [loading,   setLoading]   = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const update = useCallback((field: string, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }))
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Please fill in name, email, and message')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast.error('Please enter a valid email address')
      return
    }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setSubmitted(true)
    setLoading(false)
    toast.success('Message sent — we respond within 2–4 hours')
  }, [form])

  if (submitted) {
    return (
      <div
        className="min-h-96 flex flex-col items-center justify-center rounded-xl p-10 text-center pop-in"
        style={{ background: 'rgba(0,255,65,0.03)', border: '0.5px solid rgba(0,255,65,0.15)' }}
      >
        <div className="text-5xl mb-4 pop-in">✓</div>
        <p className="font-display text-3xl font-light mb-3">Message Received</p>
        <p className="font-body text-base text-white/50 max-w-sm mb-6">
          Thank you for reaching out. We respond to all enquiries within 2–4 hours. For urgent matters, WhatsApp us at <strong>0111 541 911</strong>.
        </p>
        <button
          className="font-body text-xs uppercase tracking-widest text-white/40 hover:text-white/70 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none rounded-sm"
          onClick={() => { setSubmitted(false); setForm({ name:'', email:'', phone:'', subject:'', source:'', contactMethod: 'email', message:'' }) }}
        >
          Send another message →
        </button>
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    padding: '12px 16px',
    color: 'var(--cream, #EDE6D3)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    borderRadius: '8px',
  } as React.CSSProperties

  const labelStyle = {
    display: 'block',
    fontSize: '11px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.25em',
    color: 'rgba(255,255,255,0.35)',
    marginBottom: '8px',
    fontFamily: 'var(--font-body)',
    fontWeight: '500',
  }

  return (
    <div
      className="p-8 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}
    >
      <h3 className="font-display text-2xl font-light mb-8">Send an Enquiry</h3>
      <div className="space-y-6">
        
        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Your Name *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Full name"
              className="focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
              onFocus={(e) => (e.target.style.borderColor = 'rgba(200,168,75,0.4)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>
          <div>
            <label style={labelStyle}>Email *</label>
            <input
              type="email"
              style={inputStyle}
              value={form.email}
              onChange={e => update('email', e.target.value)}
              placeholder="your@email.com"
              className="focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
              onFocus={(e) => (e.target.style.borderColor = 'rgba(200,168,75,0.4)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>
        </div>

        {/* Phone & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>Phone / WhatsApp</label>
            <input
              style={inputStyle}
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="0711 123 456 or +254711123456"
              className="focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
              onFocus={(e) => (e.target.style.borderColor = 'rgba(200,168,75,0.4)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            />
          </div>
          <div>
            <label style={labelStyle}>Subject *</label>
            <select
              style={inputStyle}
              value={form.subject}
              onChange={e => update('subject', e.target.value)}
              className="focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
              onFocus={(e) => (e.target.style.borderColor = 'rgba(200,168,75,0.4)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <option value="">— Select a subject —</option>
              <option value="cottage-booking">Cottage or Room Booking</option>
              <option value="spa-treatment">Arohamai Spa Treatment</option>
              <option value="event-wedding">Wedding or Private Event</option>
              <option value="corporate-retreat">Corporate Retreat</option>
              <option value="farm-experience">Farm Experience or Tour</option>
              <option value="restaurant">Restaurant Reservation</option>
              <option value="general">General Enquiry</option>
            </select>
          </div>
        </div>

        {/* Source & Contact Method */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label style={labelStyle}>How Did You Hear About Us?</label>
            <select
              style={inputStyle}
              value={form.source}
              onChange={e => update('source', e.target.value)}
              className="focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
              onFocus={(e) => (e.target.style.borderColor = 'rgba(200,168,75,0.4)')}
              onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
            >
              <option value="">— Optional —</option>
              <option value="google">Google Search</option>
              <option value="social">Instagram or Social Media</option>
              <option value="word-of-mouth">Word of Mouth</option>
              <option value="booking-site">Booking.com or Travel Site</option>
              <option value="repeat-guest">Repeat Guest</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Preferred Contact Method</label>
            <div className="flex gap-4 pt-2">
              {['email', 'whatsapp', 'phone'].map(method => (
                <label key={method} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="radio"
                    name="contactMethod"
                    value={method}
                    checked={form.contactMethod === method}
                    onChange={e => update('contactMethod', e.target.value)}
                    className="w-4 h-4 cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
                  />
                  <span className="font-body text-sm text-white/60 group-hover:text-white/80 transition-colors capitalize">
                    {method}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Message */}
        <div>
          <label style={labelStyle}>Message *</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical', minHeight: '140px' }}
            value={form.message}
            onChange={e => update('message', e.target.value)}
            rows={6}
            placeholder="Tell us about your visit — dates, group size, special requests, dietary needs, or any questions..."
            className="focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
            onFocus={(e) => (e.target.style.borderColor = 'rgba(200,168,75,0.4)')}
            onBlur={(e) => (e.target.style.borderColor = 'rgba(255,255,255,0.12)')}
          />
        </div>

        {/* Submit Button with animated arrow and spinner */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-lg font-body text-sm uppercase tracking-[0.2em] transition-all duration-300 font-semibold arrow-animate flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
          style={{
            background: loading ? 'rgba(200,168,75,0.3)' : 'var(--gold)',
            color: 'var(--obsidian)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
          }}
        >
          {loading ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              <span>Sending...</span>
            </>
          ) : (
            <>
              <span>Send Enquiry</span>
              <span className="arrow-icon">→</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}

// ── SERVICE MODAL ─────────────────────────────────────────────
function ServiceModal({ service, prefillDate, onClose }: {
  service: UKVService
  prefillDate?: string
  onClose: () => void
}) {
  const addItem  = useCartStore(s => s.addItem)
  const openCart = useCartStore(s => s.openCart)
  const inCart   = useCartStore(s => s.items.some(i => i.id === service.id))
  const modalRef = useRef<HTMLDivElement>(null)
  const firstFocusableRef = useRef<HTMLElement>(null)

  const [checkIn,  setCheckIn]  = useState(prefillDate ?? '')
  const [checkOut, setCheckOut] = useState('')
  const [guests,   setGuests]   = useState(2)
  const [notes,    setNotes]    = useState('')
  const [imgErr,   setImgErr]   = useState(false)

  const catColor   = SERVICE_CATEGORIES.find(c => c.id === service.category)?.color ?? 'var(--gold)'
  const totalPrice = service.requiresGuests ? service.price * guests : service.price

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  // ESC to close
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  // Focus trap
  useEffect(() => {
    if (!modalRef.current) return

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements[0] as HTMLElement
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

    firstElement?.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus()
          e.preventDefault()
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus()
          e.preventDefault()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [modalRef])

  // Update checkIn if prefillDate changes
  useEffect(() => {
    if (prefillDate) setCheckIn(prefillDate)
  }, [prefillDate])

  const handleReserve = useCallback(() => {
    if (!inCart) {
      addItem({
        id:       service.id,
        name:     service.name,
        tag:      service.tag,
        category: service.category,
        price:    totalPrice,
        unit:     service.unit,
        checkIn:  checkIn || undefined,
        guests:   service.requiresGuests ? guests : undefined,
      } as Parameters<typeof addItem>[0])
      toast.success(`${service.name} added to cart`)
    }
    onClose()
    openCart()
  }, [inCart, addItem, service, totalPrice, checkIn, guests, onClose, openCart])

  const handleAddLater = useCallback(() => {
    if (inCart) { toast('Already in cart', { icon: '✦' }); openCart(); return }
    addItem({
      id: service.id, name: service.name, tag: service.tag,
      category: service.category, price: totalPrice, unit: service.unit,
      checkIn: checkIn || undefined,
      guests:  service.requiresGuests ? guests : undefined,
    } as Parameters<typeof addItem>[0])
    toast.success(`${service.name} added`)
    onClose()
  }, [inCart, addItem, service, totalPrice, checkIn, guests, openCart, onClose])

  const modalContent = (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 99999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        background: 'rgba(0,0,0,0.75)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
      onClick={onClose}
    >
        <div
          ref={modalRef}
          style={{
            position: 'relative',
            width: 'min(900px, 95vw)',
            height: 'min(88vh, 680px)',
            display: 'flex',
            flexDirection: 'row',
            overflow: 'hidden',
            borderRadius: '16px',
            background: 'var(--bg2, #141310)',
            border: `0.5px solid ${catColor}44`,
            flexShrink: 0,
          }}
          className="ukv-modal-panel"
          role="dialog"
          aria-modal="true"
          aria-labelledby="service-modal-title"
          onClick={e => e.stopPropagation()}
        >
        {/* Image — responsive height */}
        <div className="relative md:w-[40%] h-44 md:h-auto md:max-h-full flex-shrink-0 overflow-hidden">
          <Image
            src={imgErr
              ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600'
              : service.image}
            alt={service.name}
            fill
            className="object-cover"
            onError={() => setImgErr(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          {service.badge && (
            <div
              className="absolute top-4 left-4 px-3 py-1.5 text-xs uppercase tracking-[0.25em] font-body rounded-full"
              style={{ background: `${catColor}20`, border: `0.5px solid ${catColor}60`, color: catColor }}
            >
              {service.badge}
            </div>
          )}
          {inCart && (
            <div className="absolute top-4 right-4">
              <span className="font-body text-xs uppercase tracking-widest px-3 py-1.5 rounded-full"
                style={{ background: 'rgba(212,168,55,0.18)', border: '0.5px solid rgba(212,168,55,0.5)', color: 'var(--gold)' }}>
                ✓ In Cart
              </span>
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            {service.price === 0 ? (
              <div>
                <p className="font-display text-3xl" style={{ color: catColor }}>
                  Enquire for Pricing
                </p>
              </div>
            ) : (
              <>
                <p className="font-display text-3xl" style={{ color: catColor }}>
                  KES {totalPrice.toLocaleString()}
                </p>
                <p className="font-body text-xs text-white/40 mt-1">
                  {service.priceNote}{service.duration && ` · ${service.duration}`}
                </p>
              </>
            )}
          </div>
        </div>

        {/* Content — flex-1 with min-h-0 prevents overflow */}
        <div className="flex-1 flex flex-col overflow-hidden min-h-0">
          <div
            className="flex items-start justify-between px-6 py-5 flex-shrink-0"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <p className="font-body text-xs uppercase tracking-[0.3em] mb-2" style={{ color: catColor }}>
                {service.tag}
              </p>
              <h2 id="service-modal-title" className="font-display text-3xl font-light text-white/90">{service.name}</h2>
              <p className="font-body text-sm text-white/40 mt-1">{service.tagline}</p>
            </div>
            
            {/* Proper close button — 36x36 circle with SVG */}
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all ml-4 mt-1 focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
              style={{
                background: 'rgba(255,255,255,0.07)',
                border: '0.5px solid rgba(255,255,255,0.15)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.14)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" color="rgba(255,255,255,0.7)">
                <path d="M1 1l14 14M15 1L1 15" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 ukv-modal-scroll min-h-0">
            <p className="font-body text-base text-white/60 leading-relaxed">{service.description}</p>

            {service.requiresGuests && (
              <div>
                <label className="block font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-3">
                  Number of Guests
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-10 h-10 flex items-center justify-center rounded transition-colors text-white/50 hover:text-white text-lg font-semibold focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
                    style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                  >−</button>
                  <span className="font-display text-3xl w-12 text-center text-white/90">{guests}</span>
                  <button
                    onClick={() => setGuests(g => g + 1)}
                    className="w-10 h-10 flex items-center justify-center rounded transition-colors text-white/50 hover:text-white text-lg font-semibold focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
                    style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                  >+</button>
                  <span className="font-body text-sm text-white/40 ml-2">
                    KES {totalPrice.toLocaleString()} total
                  </span>
                </div>
              </div>
            )}

            {service.requiresDate && (
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-2">
                    {service.category === 'accommodation' ? 'Check-in' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full bg-white/5 rounded-lg px-3 py-3 font-body text-sm text-white/70 outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60"
                    style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                  />
                </div>
                {service.category === 'accommodation' && (
                  <div>
                    <label className="block font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full bg-white/5 rounded-lg px-3 py-3 font-body text-sm text-white/70 outline-none focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60"
                      style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block font-body text-xs uppercase tracking-[0.25em] text-white/40 mb-2">
                Notes / Special Requests
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Dietary requirements, accessibility needs, celebration, special occasion..."
                className="w-full bg-white/[0.03] rounded-lg px-3 py-3 font-body text-sm text-white/70 outline-none resize-vertical focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60"
                style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* CTA row */}
          <div
            className="px-6 py-4 space-y-3 flex-shrink-0"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}
          >
            {service.price === 0 ? (
              // Enquire-only services — send inquiry instead of reserve
              <button
                onClick={() => {
                  onClose()
                  // This would switch to contact tab and auto-fill the form
                  // For now, just close the modal
                }}
                className="w-full py-4 rounded-lg font-body text-sm uppercase tracking-widest font-semibold transition-all focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
                style={{ background: catColor, color: 'var(--obsidian)' }}
              >
                Send an Enquiry →
              </button>
            ) : (
              <>
                <button
                  onClick={handleReserve}
                  className="w-full py-4 rounded-lg font-body text-sm uppercase tracking-widest transition-all font-semibold focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
                  style={{
                    background: inCart ? 'rgba(200,168,75,0.15)' : 'var(--gold)',
                    color: inCart ? 'var(--gold)' : 'var(--obsidian)',
                    border: inCart ? '0.5px solid rgba(200,168,75,0.4)' : 'none',
                  }}
                >
                  {inCart ? '✓ View in Cart & Pay' : 'Reserve & Pay Now'}
                </button>
                <button
                  onClick={handleAddLater}
                  className="w-full py-3 rounded-lg font-body text-xs uppercase tracking-widest text-white/40 hover:text-white/60 transition-colors focus-visible:ring-2 focus-visible:ring-[var(--gold)]/60 focus-visible:outline-none"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}
                >
                  Add to Cart — Checkout Later
                </button>
              </>
            )}
          </div>
        </div>
        </div>
      </div>
  )

  return createPortal(modalContent, document.body)
}