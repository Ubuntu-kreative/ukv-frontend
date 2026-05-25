'use client'

// ─────────────────────────────────────────────────────────────
// BookingShell.tsx — Main client island for /book page
//
// Contains: tab navigation · calendar · service grid · contact form
//
// PERFORMANCE FIXES:
//  1. onMouseEnter/Leave → CSS classes only (no inline handlers)
//  2. ServiceCard wrapped in React.memo with stable comparator
//  3. useCartStore uses granular selectors, not full destructure
//  4. generateRef moved out of render into a stable util
//  5. No <style> tags injected inside render
//  6. Tab content conditionally rendered but NOT unmounted
//     (display:none) so form state survives tab switch
//  7. ServiceModal uses useCallback on all handlers
// ─────────────────────────────────────────────────────────────

import {
  useState, useCallback, useRef, useEffect, memo, useMemo,
} from 'react'
import Image from 'next/image'
import dynamic from 'next/dynamic'
import toast from 'react-hot-toast'
import { useCartStore } from '@/context/cartStore'
import {
  UKV_SERVICES, SERVICE_CATEGORIES, MPESA_PAYBILL, MPESA_ACCOUNT,
  type UKVService, type CalendarEvent, type ServiceCategory,
} from '../_data/booking-data'

// Lazy-load the calendar — saves ~18kB from initial bundle
const MiniCalendar = dynamic(
  () => import('./MiniCalendar').then(m => ({ default: m.MiniCalendar })),
  { ssr: false, loading: () => <div className="h-64 w-full max-w-sm animate-pulse bg-white/5 rounded-xl" /> }
)

// ── Stable ref generator — never inside render ────────────────
function generateRef(prefix: string) {
  return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`
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
  const openCart = useCartStore(s => s.openCart)
  const cartCount = useCartStore(s => s.items.length)

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
      <section className="relative pt-28 pb-16 px-6 md:px-10 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,168,75,0.06),transparent_60%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(0,255,65,0.03),transparent_50%)]" />
        </div>

        <div className="relative max-w-5xl mx-auto">
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
            Choose dates, browse what the village offers, or send us a message.
            Every reservation is confirmed within 2 hours.
          </p>
        </div>
      </section>

      {/* ── TAB BAR ── */}
      <div
        className="sticky top-[64px] sm:top-[72px] z-30 border-y border-white/5 px-6 md:px-10"
        style={{ background: 'rgba(10,10,10,0.92)', backdropFilter: 'blur(20px)' }}
      >
        <div className="max-w-5xl mx-auto flex items-center">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={[
                'flex flex-col py-4 pr-8 transition-all duration-200 border-b-2 -mb-px',
                activeTab === tab.id
                  ? 'border-[var(--gold)]'
                  : 'border-transparent hover:border-white/10',
              ].join(' ')}
            >
              <span className={[
                'font-body text-[10px] uppercase tracking-[0.2em] transition-colors',
                activeTab === tab.id ? 'text-[var(--gold)]' : 'text-white/40 hover:text-white/60',
              ].join(' ')}>
                {tab.label}
              </span>
              <span className="font-body text-[8px] text-white/20 mt-0.5 uppercase tracking-widest">
                {tab.desc}
              </span>
            </button>
          ))}

          {cartCount > 0 && (
            <button
              onClick={openCart}
              className="ml-auto flex items-center gap-2 py-2 px-3 transition-all font-body"
              style={{
                background: 'rgba(200,168,75,0.1)',
                border: '0.5px solid rgba(200,168,75,0.25)',
              }}
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
      <div className="px-6 md:px-10 py-12">
        <div className="max-w-5xl mx-auto">

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
    <div className="grid grid-cols-1 lg:grid-cols-[auto_1fr] gap-10 items-start">
      {/* Left: compact calendar */}
      <div
        className="p-6 rounded-2xl"
        style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}
      >
        <p className="font-body text-[9px] uppercase tracking-[0.3em] text-white/30 mb-4">
          Village Schedule
        </p>
        <MiniCalendar onDateClick={onDateClick} onEventClick={onEventClick} />
      </div>

      {/* Right: quick book cards */}
      <div>
        <p className="font-body text-[9px] uppercase tracking-[0.3em] text-white/30 mb-5">
          Quick Reserve
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {UKV_SERVICES.filter(s =>
            ['cottage-pokomo-1', 'farmhouse-suite-a', 'dinner-farm-table',
             'spa-volcanic-mud', 'farm-walk-dawn', 'event-corporate'].includes(s.id)
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
      className="group w-full text-left p-4 rounded-xl transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '0.5px solid rgba(255,255,255,0.07)',
      }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          {svc.badge && (
            <span
              className="inline-block font-body text-[8px] uppercase tracking-widest px-2 py-0.5 rounded-full mb-1.5"
              style={{ background: `${catColor}15`, color: catColor, border: `0.5px solid ${catColor}40` }}
            >
              {svc.badge}
            </span>
          )}
          <p className="font-body text-sm text-white/80 group-hover:text-white transition-colors truncate">
            {svc.name}
          </p>
          <p className="font-body text-[10px] text-white/35 mt-0.5 truncate">{svc.tagline}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className="font-display text-base" style={{ color: catColor }}>
            KES {svc.price.toLocaleString()}
          </p>
          <p className="font-body text-[9px] text-white/25">{svc.priceNote}</p>
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

      {/* Category filter */}
      <div className="flex gap-2 flex-wrap mb-7">
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

      {/* Service grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(svc => (
          <ServiceCard key={svc.id} svc={svc} onSelect={onSelectService} />
        ))}
      </div>
    </div>
  )
}

// Pure CSS pill — no inline handlers
function CategoryPill({ label, icon, active, color, onClick }: {
  label: string; icon?: string; active: boolean; color: string; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-body text-[9px] uppercase tracking-wider transition-all duration-200"
      style={{
        background: active ? `${color}15` : 'rgba(255,255,255,0.03)',
        border: `0.5px solid ${active ? `${color}50` : 'rgba(255,255,255,0.08)'}`,
        color: active ? color : 'rgba(255,255,255,0.35)',
      }}
    >
      {icon && <span>{icon}</span>}
      {label}
    </button>
  )
}

// Memoized service card
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
      className="group w-full text-left rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.01]"
      style={{ background: 'rgba(255,255,255,0.025)', border: '0.5px solid rgba(255,255,255,0.07)' }}
    >
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <Image
          src={imgErr
            ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=600'
            : svc.image}
          alt={svc.name}
          fill
          sizes="(max-width:640px) 100vw, 33vw"
          loading="lazy"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          onError={handleImgErr}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

        {svc.badge && (
          <span
            className="absolute top-3 left-3 font-body text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: `${catColor}20`, border: `0.5px solid ${catColor}60`, color: catColor }}
          >
            {svc.badge}
          </span>
        )}

        <div className="absolute bottom-3 left-3">
          <p className="font-display text-lg leading-none" style={{ color: catColor }}>
            KES {svc.price.toLocaleString()}
          </p>
          <p className="font-body text-[9px] text-white/40 mt-0.5">{svc.priceNote}</p>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="font-body text-[8px] uppercase tracking-widest mb-1" style={{ color: catColor }}>
          {svc.tag}
        </p>
        <p className="font-body text-sm text-white/80 group-hover:text-white transition-colors mb-0.5">
          {svc.name}
        </p>
        <p className="font-body text-[10px] text-white/35 line-clamp-2 leading-relaxed">
          {svc.tagline}
        </p>
      </div>
    </button>
  )
})

// ── CONTACT TAB ──────────────────────────────────────────────
function ContactTab({ onSelectService }: { onSelectService: (s: UKVService) => void }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
      {/* Left panel */}
      <div className="space-y-5">
        {/* Contact info */}
        <div
          className="p-5 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}
        >
          <h3 className="font-display text-xl font-light mb-5">Get in Touch</h3>
          <div className="space-y-4">
            {[
              { label: 'Location',       value: 'Ubuntu Kreative Village\nKenya, East Africa',  accent: 'var(--neon)' },
              { label: 'Email',          value: 'hello@ubuntuecolodge.com',                     accent: 'var(--gold)' },
              { label: 'WhatsApp',       value: '+254 700 000 000',                              accent: 'var(--neon)' },
              { label: 'M-Pesa Paybill', value: `${MPESA_PAYBILL} · Account ${MPESA_ACCOUNT}`,  accent: 'var(--gold)' },
            ].map(item => (
              <div key={item.label}>
                <p className="font-body text-[8px] uppercase tracking-wider text-white/25 mb-1">
                  {item.label}
                </p>
                <p className="font-body text-[11px] leading-relaxed whitespace-pre-line text-white/55">
                  {item.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Moxie shortcut */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(0,255,65,0.04)', border: '0.5px solid rgba(0,255,65,0.15)' }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--neon)] animate-pulse" />
            <span className="font-body text-[9px] tracking-widest uppercase text-[var(--neon)]">
              Moxie is online
            </span>
          </div>
          <p className="font-body text-[11px] leading-relaxed text-white/35 mb-3">
            Skip the form. Ask Moxie to check availability, describe the cottages,
            or tell you what&apos;s on the menu this week.
          </p>
          <button
            className="btn-neon w-full flex items-center justify-center text-[9px]"
            style={{ padding: '8px 16px', cursor: 'pointer' }}
            onClick={() => {
              const b = document.querySelector('.moxie-bubble') as HTMLElement
              b?.click()
            }}
          >
            Chat with Moxie →
          </button>
        </div>

        {/* Quick add */}
        <div
          className="p-4 rounded-xl"
          style={{ background: 'rgba(255,255,255,0.015)', border: '0.5px solid rgba(255,255,255,0.06)' }}
        >
          <p className="font-body text-[8px] uppercase tracking-widest text-white/25 mb-3">
            Quick Book
          </p>
          <div className="space-y-1.5">
            {UKV_SERVICES.slice(0, 4).map(s => (
              <button
                key={s.id}
                onClick={() => onSelectService(s)}
                className="w-full text-left flex items-center justify-between py-2 px-2.5 rounded transition-all hover:bg-white/5 group"
              >
                <span className="text-[11px] text-white/60 group-hover:text-white/80 transition-colors truncate">
                  {s.name}
                </span>
                <span className="text-[10px] text-[var(--gold)] flex-shrink-0 ml-2">
                  KES {s.price.toLocaleString()}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Right: inquiry form */}
      <div className="lg:col-span-2">
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
    name: '', email: '', phone: '', subject: '', message: '',
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
    setLoading(true)
    await new Promise(r => setTimeout(r, 1400))
    setSubmitted(true)
    setLoading(false)
    toast.success('Message sent — we\'ll reply within 24 hours')
  }, [form])

  if (submitted) {
    return (
      <div
        className="h-full min-h-64 flex flex-col items-center justify-center rounded-xl p-10 text-center"
        style={{ background: 'rgba(0,255,65,0.03)', border: '0.5px solid rgba(0,255,65,0.15)' }}
      >
        <div className="text-3xl mb-4">✓</div>
        <p className="font-display text-2xl font-light mb-2">Message sent</p>
        <p className="font-body text-sm text-white/40">We&apos;ll be in touch within 24 hours.</p>
        <button
          className="mt-6 font-body text-[9px] uppercase tracking-widest text-white/30 hover:text-white/60 transition-colors"
          onClick={() => { setSubmitted(false); setForm({ name:'', email:'', phone:'', subject:'', message:'' }) }}
        >
          Send another →
        </button>
      </div>
    )
  }

  const inputStyle = {
    width: '100%',
    background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.12)',
    padding: '10px 14px',
    color: 'var(--cream, #EDE6D3)',
    fontFamily: 'var(--font-body)',
    fontSize: '12px',
    outline: 'none',
    borderRadius: '8px',
  } as React.CSSProperties

  const labelStyle = {
    display: 'block',
    fontSize: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.25em',
    color: 'rgba(255,255,255,0.28)',
    marginBottom: '6px',
    fontFamily: 'var(--font-body)',
  }

  return (
    <div
      className="p-6 rounded-xl"
      style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.07)' }}
    >
      <h3 className="font-display text-xl font-light mb-6">Send an Enquiry</h3>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Your Name *</label>
            <input
              style={inputStyle}
              value={form.name}
              onChange={e => update('name', e.target.value)}
              placeholder="Full name"
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
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label style={labelStyle}>Phone / WhatsApp</label>
            <input
              style={inputStyle}
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              placeholder="+254 ..."
            />
          </div>
          <div>
            <label style={labelStyle}>Subject</label>
            <input
              style={inputStyle}
              value={form.subject}
              onChange={e => update('subject', e.target.value)}
              placeholder="Cottage booking, Wedding, Spa..."
            />
          </div>
        </div>
        <div>
          <label style={labelStyle}>Message *</label>
          <textarea
            style={{ ...inputStyle, resize: 'vertical' }}
            value={form.message}
            onChange={e => update('message', e.target.value)}
            rows={5}
            placeholder="Tell us about your visit — dates, group size, any special requirements..."
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-3.5 rounded-lg font-body text-[10px] uppercase tracking-[0.2em] transition-all duration-300"
          style={{
            background: loading ? 'rgba(200,168,75,0.3)' : 'var(--gold)',
            color: 'var(--obsidian)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          {loading ? 'Sending...' : 'Send Message →'}
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

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-xl">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-4xl max-h-[94vh] md:max-h-[88vh] flex flex-col md:flex-row overflow-hidden z-10 md:rounded-2xl"
        style={{
          background: 'var(--bg2, #0a0a0a)',
          border: `0.5px solid ${catColor}33`,
        }}
      >
        {/* Image */}
        <div className="relative md:w-[40%] h-52 md:h-auto flex-shrink-0 overflow-hidden">
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
              className="absolute top-4 left-4 px-3 py-1 text-[8px] uppercase tracking-[0.25em] font-body rounded-full"
              style={{ background: `${catColor}20`, border: `0.5px solid ${catColor}60`, color: catColor }}
            >
              {service.badge}
            </div>
          )}
          {inCart && (
            <div className="absolute top-4 right-4">
              <span className="font-body text-[8px] uppercase tracking-widest px-2.5 py-1 rounded-full"
                style={{ background: 'rgba(212,168,55,0.18)', border: '0.5px solid rgba(212,168,55,0.5)', color: 'var(--gold)' }}>
                ● In Cart
              </span>
            </div>
          )}
          <div className="absolute bottom-4 left-4">
            <p className="font-display text-2xl" style={{ color: catColor }}>
              KES {totalPrice.toLocaleString()}
            </p>
            <p className="font-body text-[10px] text-white/40">
              {service.priceNote}{service.duration && ` · ${service.duration}`}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div
            className="flex items-start justify-between px-6 py-5 flex-shrink-0"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <p className="font-body text-[8px] uppercase tracking-[0.3em] mb-1" style={{ color: catColor }}>
                {service.tag}
              </p>
              <h2 className="font-display text-2xl font-light text-white/90">{service.name}</h2>
              <p className="font-body text-[11px] text-white/40 mt-0.5">{service.tagline}</p>
            </div>
            <button
              onClick={onClose}
              className="font-body text-[9px] uppercase tracking-widest text-white/25 hover:text-white transition-colors ml-4 mt-1"
            >
              [ Close ]
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5" style={{ scrollbarWidth: 'none' }}>
            <p className="font-body text-sm text-white/50 leading-relaxed">{service.description}</p>

            {service.requiresGuests && (
              <div>
                <label className="block font-body text-[8px] uppercase tracking-[0.25em] text-white/30 mb-2">
                  Guests
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setGuests(g => Math.max(1, g - 1))}
                    className="w-8 h-8 flex items-center justify-center rounded transition-colors text-white/50 hover:text-white"
                    style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                  >−</button>
                  <span className="font-display text-2xl w-8 text-center text-white/90">{guests}</span>
                  <button
                    onClick={() => setGuests(g => g + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded transition-colors text-white/50 hover:text-white"
                    style={{ border: '0.5px solid rgba(255,255,255,0.15)' }}
                  >+</button>
                  <span className="font-body text-[10px] text-white/30">
                    KES {totalPrice.toLocaleString()} total
                  </span>
                </div>
              </div>
            )}

            {service.requiresDate && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-[8px] uppercase tracking-[0.25em] text-white/30 mb-2">
                    {service.category === 'accommodation' ? 'Check-in' : 'Date'}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={e => setCheckIn(e.target.value)}
                    className="w-full bg-white/5 rounded-lg px-3 py-2 font-body text-xs text-white/70 outline-none"
                    style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                  />
                </div>
                {service.category === 'accommodation' && (
                  <div>
                    <label className="block font-body text-[8px] uppercase tracking-[0.25em] text-white/30 mb-2">
                      Check-out
                    </label>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={e => setCheckOut(e.target.value)}
                      className="w-full bg-white/5 rounded-lg px-3 py-2 font-body text-xs text-white/70 outline-none"
                      style={{ border: '0.5px solid rgba(255,255,255,0.12)' }}
                    />
                  </div>
                )}
              </div>
            )}

            <div>
              <label className="block font-body text-[8px] uppercase tracking-[0.25em] text-white/30 mb-2">
                Notes / Special requests
              </label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                rows={3}
                placeholder="Dietary requirements, accessibility needs, celebration..."
                className="w-full bg-white/[0.03] rounded-lg px-3 py-2.5 font-body text-xs text-white/70 outline-none resize-vertical"
                style={{ border: '0.5px solid rgba(255,255,255,0.1)' }}
              />
            </div>
          </div>

          {/* CTA row */}
          <div
            className="px-6 py-4 space-y-2 flex-shrink-0"
            style={{ borderTop: '0.5px solid rgba(255,255,255,0.06)' }}
          >
            <button
              onClick={handleReserve}
              className="w-full py-3 rounded-lg font-body text-[10px] uppercase tracking-widest transition-all"
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
              className="w-full py-2.5 rounded-lg font-body text-[9px] uppercase tracking-widest text-white/30 hover:text-white/50 transition-colors"
              style={{ background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.08)' }}
            >
              Add to Cart — Checkout Later
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}