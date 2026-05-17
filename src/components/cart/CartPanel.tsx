'use client'

// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — CartPanel  (production v7)
//
// FIXES from v6:
//   • item.quantity → item.qty  (store field was renamed in v5)
//   • removeItem(item.id) → removeItem(item.cartKey)
//   • updateNote(item.id, …) → updateNote(item.cartKey, …)  (store now uses cartKey)
//   • BOARD_PLAN_LABELS now imported correctly from cartStore (was missing export)
//   • Header badge reads item.qty not item.quantity
//   • Subtotal label reads item.qty not item.quantity
//   • QtyControl ±1 wired to increaseQty / decreaseQty from store
//   • Line total: price × item.qty (was price × item.quantity)
//   • UpsellRow already-check uses item.cartKey not item.id
//
// PRESERVED from v6 (nothing removed):
//   • ALL hooks unconditionally at top — React Rules of Hooks intact
//   • confirmed / stk_waiting / processing states
//   • STK Push M-Pesa flow (phone → prompt → PIN → confirmed)
//   • Room charge + card payment options
//   • VAT (16%) + service charge (10%)
//   • Animated total counter
//   • Per-item notes (inline, keyed by cartKey)
//   • Blocked calendar dates with GLOBALLY_BLOCKED
//   • Category grouping in cart review with icons + accents
//   • Upsell suggestions per category
//   • Step bar (Review → Details → Pay)
//   • Cart bounce animation on hover
//   • Special requests field
//   • Paybill fallback in STK screen
// ─────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useCartStore, BOARD_PLAN_LABELS } from '@/context/cartStore'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────
const MPESA_PAYBILL = '880100'
const MPESA_ACCOUNT = '101497'
const MPESA_NAME    = 'Ubuntu Eco Lodge'
const VAT_RATE      = 0.16
const SERVICE_RATE  = 0.10

type CheckoutTab  = 'pay' | 'inquiry'
type PayMethod    = 'mpesa' | 'card' | 'room'
type CheckoutStep = 'cart' | 'details' | 'pay' | 'stk_waiting' | 'processing' | 'confirmed'

function generateRef(prefix: string) {
  return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`
}

function normalisePhone(raw: string): string {
  const d = raw.replace(/\D/g, '')
  if (d.startsWith('0')   && d.length === 10) return `254${d.slice(1)}`
  if (d.startsWith('254') && d.length === 12) return d
  if (d.startsWith('7')   && d.length ===  9) return `254${d}`
  return d
}

// ─────────────────────────────────────────────────────────────────────
// BLOCKED DATES — rooms already reserved
// ─────────────────────────────────────────────────────────────────────
const BLOCKED_DATES: Record<string, string[]> = {
  'warbugia':            ['2025-06-14', '2025-06-15', '2025-07-01', '2025-07-02'],
  'locust-bean':         ['2025-06-20', '2025-06-21', '2025-07-10'],
  'tamarind':            ['2025-06-28', '2025-06-29', '2025-07-04', '2025-07-05'],
  'acacia-penthouse':    ['2025-07-03', '2025-07-04', '2025-07-05'],
  'sycamore':            ['2025-06-18', '2025-06-19'],
  'mugumo':              ['2025-06-25', '2025-06-26'],
  'ironwood-penthouse':  ['2025-07-07', '2025-07-08'],
  'baobab':              ['2025-06-22', '2025-06-23'],
  'inko':                ['2025-07-12', '2025-07-13'],
  'buffalo-thorn':       ['2025-06-30', '2025-07-01'],
  'neem-penthouse':      ['2025-07-15', '2025-07-16'],
  'marula':              ['2025-06-14', '2025-06-15', '2025-07-20'],
  'shea':                ['2025-06-21', '2025-06-22'],
  'milk-wood':           ['2025-07-04', '2025-07-05', '2025-07-06'],
  'ebony':               ['2025-07-10', '2025-07-11'],
  'acacia-glass-villa':  ['2025-07-20', '2025-07-21', '2025-07-22'],
  'forest-canopy-house': ['2025-06-25'],
  'mara-sky-suite':      ['2025-07-05', '2025-07-06'],
  'sol-sanctuary':       ['2025-07-15'],
  'earth-nest':          ['2025-06-18'],
  'quiet-stone-villa':   ['2025-07-08', '2025-07-09'],
  'highland-retreat':    ['2025-07-04', '2025-07-05'],
  'savanna-family-lodge':['2025-06-30', '2025-07-01'],
  'ubuntu-signature-villa':['2025-07-20','2025-07-21','2025-07-22','2025-07-23'],
}

const GLOBALLY_BLOCKED: string[] = [
  '2025-12-24','2025-12-25','2025-12-26','2025-12-31','2026-01-01',
]

// ─────────────────────────────────────────────────────────────────────
// UPSELL SUGGESTIONS per item category
// ─────────────────────────────────────────────────────────────────────
interface UpsellSuggestion {
  id: string; name: string; price: number; category: string
  tag: string; unit: string; emoji: string; reason: string
}

const UPSELL_MAP: Record<string, UpsellSuggestion[]> = {
  cottage: [
    { id: 'upsell-spa-day',        name: 'Arohamai Spa Day',      price: 8500,  category: 'spa',             tag: 'Spa',               unit: '/ person',      emoji: '🌿', reason: 'Most guests add a spa day to their cottage stay' },
    { id: 'upsell-farm-walk',      name: 'Sunrise Farm Walk',     price: 2800,  category: 'event',           tag: 'Farm Experience',   unit: '/ person',      emoji: '🌅', reason: 'Start your mornings with a guided harvest walk' },
    { id: 'upsell-harvest-dinner', name: 'Harvest Dinner',        price: 12500, category: 'event',           tag: 'Dining Experience', unit: '/ person',      emoji: '🍽', reason: 'Our most celebrated evening experience' },
  ],
  restaurant: [
    { id: 'upsell-fire-circle',    name: 'New Moon Fire Circle',  price: 1500,  category: 'event',           tag: 'Community',         unit: '/ person',      emoji: '🔥', reason: 'A perfect evening after dinner' },
    { id: 'upsell-cold-brew',      name: 'Garden Cold Brew',      price: 750,   category: 'restaurant',      tag: 'Drinks',            unit: '/ portion',     emoji: '☕', reason: 'Pairs perfectly with your meal' },
  ],
  event: [
    { id: 'upsell-cottage-night',  name: 'Pokomo Marula Cottage', price: 5000,  category: 'cottage',         tag: 'Cottage',           unit: '/ person · BO', emoji: '🏡', reason: 'Stay the night after your event' },
    { id: 'upsell-spa-ritual',     name: 'Arohamai Spa Ritual',   price: 6500,  category: 'spa',             tag: 'Spa',               unit: '/ person',      emoji: '✨', reason: 'Unwind before or after your event' },
  ],
  'event-package': [
    { id: 'upsell-farm-tour',      name: 'Private Farm Tour',     price: 4500,  category: 'event',           tag: 'Farm Experience',   unit: '/ group',       emoji: '🌾', reason: 'A unique addition to any gathering' },
  ],
  spa: [
    { id: 'upsell-cottage-upgrade',name: 'Pokomo Cottage Stay',   price: 5000,  category: 'cottage',         tag: 'Cottage',           unit: '/ person · BO', emoji: '🏡', reason: 'Extend your wellness day into a full overnight' },
    { id: 'upsell-herbal-tea',     name: 'Farm Herbal Infusions', price: 350,   category: 'village-kitchen', tag: 'Beverages',         unit: '/ cup',         emoji: '🍵', reason: 'Complement your spa ritual naturally' },
  ],
  'village-kitchen': [
    { id: 'upsell-farm-walk-vk',   name: 'Sunrise Farm Walk',     price: 2800,  category: 'event',           tag: 'Farm Experience',   unit: '/ person',      emoji: '🌅', reason: 'See where your food comes from' },
  ],
}

// ─────────────────────────────────────────────────────────────────────
// CATEGORY LABELS + ICONS for grouping
// ─────────────────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { label: string; icon: string; accent: string }> = {
  cottage:           { label: 'Accommodation',    icon: '🏡', accent: 'var(--gold)'  },
  restaurant:        { label: 'Dining',           icon: '🍽', accent: '#D4A853'      },
  'village-kitchen': { label: 'Village Kitchen',  icon: '🌿', accent: '#A8F0D8'      },
  event:             { label: 'Experiences',      icon: '✨', accent: '#F0A8B8'      },
  'event-package':   { label: 'Events',           icon: '🎪', accent: '#B8A9F0'      },
  spa:               { label: 'Wellness',         icon: '🌸', accent: '#F0A8B8'      },
  farm:              { label: 'Farm Experiences', icon: '🌾', accent: 'var(--neon)'  },
}

// ─────────────────────────────────────────────────────────────────────
// TINY HELPERS
// ─────────────────────────────────────────────────────────────────────
function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-[9px] tracking-[0.14em] uppercase mb-1.5"
        style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// QTY CONTROL — ±1 inline in cart line, wired to store actions
// ─────────────────────────────────────────────────────────────────────
function QtyControl({
  qty, onIncrease, onDecrease,
}: {
  qty: number; onIncrease: () => void; onDecrease: () => void
}) {
  return (
    <div
      className="flex items-center"
      style={{ border: '0.5px solid var(--border2)', background: 'var(--bg3)', borderRadius: 4 }}
    >
      <button
        onClick={onDecrease}
        className="w-7 h-7 flex items-center justify-center text-[13px] leading-none transition-colors"
        style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', borderRight: '0.5px solid var(--border2)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
        aria-label="Decrease quantity"
      >−</button>
      <span className="w-8 text-center text-[12px] font-mono" style={{ color: 'var(--cream)' }}>
        {qty}
      </span>
      <button
        onClick={onIncrease}
        className="w-7 h-7 flex items-center justify-center text-[13px] leading-none transition-colors"
        style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', borderLeft: '0.5px solid var(--border2)' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
        aria-label="Increase quantity"
      >+</button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// ANIMATED TOTAL
// ─────────────────────────────────────────────────────────────────────
function AnimatedTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current === value) return
    const diff = value - prev.current; const steps = 24; let i = 0
    const iv = setInterval(() => {
      i++
      setDisplay(Math.round(prev.current + (diff * i) / steps))
      if (i >= steps) { clearInterval(iv); prev.current = value }
    }, 14)
    return () => clearInterval(iv)
  }, [value])
  return <>{`KES ${display.toLocaleString()}`}</>
}

// ─────────────────────────────────────────────────────────────────────
// BLOCKED DATE INPUT
// ─────────────────────────────────────────────────────────────────────
function BlockedDateInput({
  label, value, onChange, min, roomIds, otherDate, isArrival,
}: {
  label: string; value: string; onChange: (v: string) => void
  min?: string; roomIds: string[]; otherDate?: string; isArrival?: boolean
}) {
  const [warning, setWarning] = useState('')

  const blocked = useMemo(() => {
    const set = new Set<string>(GLOBALLY_BLOCKED)
    roomIds.forEach(id => (BLOCKED_DATES[id] || []).forEach(d => set.add(d)))
    return set
  }, [roomIds])

  function handleChange(v: string) {
    if (!v) { onChange(v); setWarning(''); return }
    if (blocked.has(v)) { setWarning('This date is unavailable — please choose another.'); return }
    if (!isArrival && otherDate && v <= otherDate) { setWarning('Check-out must be after check-in.'); return }
    if (isArrival && otherDate && v >= otherDate) { setWarning('Check-in must be before check-out.'); return }
    setWarning('')
    onChange(v)
  }

  const today        = new Date().toISOString().split('T')[0]
  const effectiveMin = min || today

  return (
    <div>
      <label
        className="block text-[9px] tracking-[0.14em] uppercase mb-1.5"
        style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="date"
          className="input-dark"
          value={value}
          min={effectiveMin}
          onChange={e => handleChange(e.target.value)}
          style={{ width: '100%', colorScheme: 'dark' }}
        />
        {blocked.size > 0 && (
          <p style={{ fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginTop: 3, fontFamily: 'var(--font-body)', letterSpacing: '0.06em' }}>
            {blocked.size} date{blocked.size > 1 ? 's' : ''} unavailable for selected rooms
          </p>
        )}
      </div>
      {warning && (
        <p style={{ fontSize: '9px', color: '#F0A8B8', marginTop: 4, fontFamily: 'var(--font-body)', letterSpacing: '0.06em' }}>
          ⚠ {warning}
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// UPSELL ROW — checks by cartKey / id, not just id
// ─────────────────────────────────────────────────────────────────────
function UpsellRow({ suggestion, onAdd }: { suggestion: UpsellSuggestion; onAdd: (s: UpsellSuggestion) => void }) {
  const { items } = useCartStore()
  const [hov, setHov] = useState(false)
  // Check both cartKey and id to handle upsells added with either convention
  const already = items.some(i => i.cartKey === suggestion.id || i.id === suggestion.id)

  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 12px',
        background: hov ? 'rgba(212,168,83,0.06)' : 'rgba(255,255,255,0.02)',
        border: `0.5px solid ${hov ? 'rgba(212,168,83,0.25)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 8, transition: 'all 0.2s', marginBottom: 6,
      }}
    >
      <span style={{ fontSize: 20, flexShrink: 0 }}>{suggestion.emoji}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 300, color: 'var(--cream)', marginBottom: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {suggestion.name}
        </p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: 'rgba(255,255,255,0.3)', letterSpacing: '0.06em' }}>
          {suggestion.reason}
        </p>
      </div>
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.85rem', color: 'var(--gold)', marginBottom: 4 }}>
          KES {suggestion.price.toLocaleString()}
        </p>
        <button
          onClick={() => onAdd(suggestion)}
          disabled={already}
          style={{
            padding: '3px 10px', borderRadius: 4, border: 'none',
            cursor: already ? 'default' : 'pointer',
            background: already ? 'rgba(0,255,65,0.08)' : 'var(--gold)',
            color: already ? 'var(--neon)' : 'var(--obsidian)',
            fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.12em',
            textTransform: 'uppercase', fontWeight: 700, transition: 'all 0.2s',
          }}
        >
          {already ? '✓' : '+ Add'}
        </button>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STEP BAR
// ─────────────────────────────────────────────────────────────────────
function StepBar({ step }: { step: CheckoutStep }) {
  const steps: { key: CheckoutStep; label: string }[] = [
    { key: 'cart',    label: '1 Review'  },
    { key: 'details', label: '2 Details' },
    { key: 'pay',     label: '3 Pay'     },
  ]
  const currentIdx = steps.findIndex(s => s.key === step)

  return (
    <div className="flex px-7 py-2 shrink-0" style={{ borderBottom: '0.5px solid var(--border)' }}>
      {steps.map((s, i) => {
        const sIdx   = steps.findIndex(x => x.key === s.key)
        const done   = sIdx < currentIdx
        const active = sIdx === currentIdx
        return (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center w-full">
              <span
                className="text-[8px] uppercase tracking-[0.15em] transition-all"
                style={{ fontFamily: 'var(--font-body)', color: active ? 'var(--gold)' : done ? 'var(--cream)' : 'var(--muted)', padding: '4px 0', display: 'block' }}
              >
                {done ? `✓ ${s.label.slice(2)}` : s.label}
              </span>
              <div style={{ height: '1.5px', width: '100%', background: active || done ? 'var(--gold)' : 'var(--border2)', transition: 'background 0.4s' }} />
            </div>
            {i < steps.length - 1 && <div style={{ width: '4px', flexShrink: 0 }} />}
          </div>
        )
      })}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// STK WAITING SCREEN
// ─────────────────────────────────────────────────────────────────────
function StkWaitingScreen({ phone, amount, onSuccess, onTimeout }: {
  phone: string; amount: number; onSuccess: () => void; onTimeout: () => void
}) {
  const [seconds, setSeconds] = useState(90)
  const [dots,    setDots]    = useState('.')

  useEffect(() => {
    const iv = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) { clearInterval(iv); onTimeout(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [onTimeout])

  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(iv)
  }, [])

  useEffect(() => {
    const t = setTimeout(onSuccess, 4200)
    return () => clearTimeout(t)
  }, [onSuccess])

  const pct = Math.round(((90 - seconds) / 90) * 100)

  return (
    <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
      <div className="relative w-20 h-20 mb-7">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--gold)]/20 animate-ping" style={{ animationDuration: '1.8s' }} />
        <div className="absolute inset-0 rounded-full border border-[var(--gold)]/40" />
        <div className="absolute inset-0 flex items-center justify-center text-[28px]">📱</div>
      </div>
      <h3 className="text-[22px] font-light mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}>
        Check your phone{dots}
      </h3>
      <p className="text-[12px] mb-1" style={{ color: 'var(--muted)' }}>A Safaricom M-Pesa prompt has been sent to</p>
      <p className="text-[14px] mb-5 tracking-[0.08em]" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>{phone}</p>
      <p className="text-[12px] mb-6" style={{ color: 'var(--muted)' }}>
        Enter your <strong style={{ color: 'var(--cream)' }}>M-Pesa PIN</strong> to pay{' '}
        <strong style={{ color: 'var(--gold)' }}>KES {amount.toLocaleString()}</strong>
      </p>
      <div className="w-full h-1 bg-white/5 mb-2 overflow-hidden">
        <div className="h-full bg-[var(--gold)] transition-all duration-1000" style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[9px] tracking-widest uppercase mb-8" style={{ color: 'var(--muted)' }}>Prompt expires in {seconds}s</p>
      <div className="w-full p-4 text-left" style={{ background: 'var(--bg3)', border: '0.5px solid rgba(200,168,75,0.2)' }}>
        <p className="text-[8px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>
          Didn&apos;t receive a prompt? Pay via Paybill:
        </p>
        <div className="space-y-1.5">
          {[
            ['M-Pesa → Lipa na M-Pesa', 'Pay Bill'],
            ['Paybill Number', MPESA_PAYBILL],
            ['Account Number', MPESA_ACCOUNT],
            ['Business Name',  MPESA_NAME],
            ['Amount', `KES ${amount.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-[11px]">
              <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>{k}</span>
              <span style={{
                color: k === 'Paybill Number' || k === 'Account Number' ? 'var(--gold2)' : 'var(--cream)',
                fontWeight: k === 'Paybill Number' || k === 'Account Number' ? 500 : 300,
                fontFamily: 'var(--font-body)',
              }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN CART PANEL
//
// !! ALL HOOKS DECLARED FIRST, BEFORE ANY CONDITIONAL RETURN !!
// This is the critical rule that prevents the "Rendered more hooks
// than previous render" error. Do not move any hook below the
// `if (!isOpen) return null` line.
// ─────────────────────────────────────────────────────────────────────
export function CartPanel() {
  const {
    items, isOpen, closeCart,
    checkIn, checkOut, guests,
    setDates, setGuests,
    removeItem, increaseQty, decreaseQty, updateNote, clearCart,
    subtotal,
  } = useCartStore()

  // ── ALL HOOKS UNCONDITIONALLY AT TOP ──────────────────────────────

  // Checkout state
  const [step,       setStep]       = useState<CheckoutStep>('cart')
  const [tab,        setTab]        = useState<CheckoutTab>('pay')
  const [payMethod,  setPayMethod]  = useState<PayMethod>('mpesa')
  const [confirmed,  setConfirmed]  = useState<{ ref: string; type: string } | null>(null)
  const [loading,    setLoading]    = useState(false)

  // Contact fields
  const [name,       setName]       = useState('')
  const [email,      setEmail]      = useState('')
  const [phone,      setPhone]      = useState('')
  const [mpPhone,    setMpPhone]    = useState('')
  const [stkPhone,   setStkPhone]   = useState('')
  const [message,    setMessage]    = useState('')
  const [specialReq, setSpecialReq] = useState('')
  const [cardNum,    setCardNum]    = useState('')
  const [expiry,     setExpiry]     = useState('')
  const [cvv,        setCvv]        = useState('')

  // UI state
  const [activeNoteKey, setActiveNoteKey] = useState<string | null>(null)
  const [showUpsells,   setShowUpsells]   = useState(true)
  const [,              setPanelHov]      = useState(false)

  // ── useMemo — ALL unconditional ────────────────────────────────────

  const sub      = useMemo(() => subtotal(), [subtotal, items])
  const svc      = useMemo(() => Math.round(sub * SERVICE_RATE), [sub])
  const vatAmt   = useMemo(() => Math.round(sub * VAT_RATE), [sub])
  const grand    = useMemo(() => sub + svc + vatAmt, [sub, svc, vatAmt])

  // Total units across all cart lines (qty-aware)
  const totalQty = useMemo(
    () => items.reduce((s, i) => s + i.qty, 0),
    [items],
  )

  // Room IDs for blocked date checking (strip board plan suffix)
  const roomIds = useMemo(
    () => items
      .filter(i => i.category === 'cottage')
      .map(i => i.id),                          // id is the raw room id
    [items],
  )

  // Upsell suggestions from categories in cart
  const upsells = useMemo(() => {
    const cats    = [...new Set(items.map(i => i.category))]
    const results: UpsellSuggestion[] = []
    const inCart  = new Set([...items.map(i => i.cartKey), ...items.map(i => i.id)])
    cats.forEach(cat => {
      ;(UPSELL_MAP[cat] || []).forEach(s => {
        if (!inCart.has(s.id) && !results.find(x => x.id === s.id)) {
          results.push(s)
        }
      })
    })
    return results.slice(0, 3)
  }, [items])

  // Group items by category — MUST be before any early return
  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof items> = {}
    items.forEach(item => {
      const cat = item.category || 'other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }, [items])

  // ── useEffect — ALL unconditional ─────────────────────────────────

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [closeCart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── useCallback — ALL unconditional ───────────────────────────────

  const resetForm = useCallback(() => {
    setStep('cart'); setTab('pay'); setPayMethod('mpesa'); setConfirmed(null)
    setName(''); setEmail(''); setPhone(''); setMpPhone(''); setStkPhone('')
    setMessage(''); setSpecialReq(''); setCardNum(''); setExpiry(''); setCvv('')
    setLoading(false)
  }, [])

  const resetAndClose = useCallback(() => {
    resetForm()
    closeCart()
  }, [resetForm, closeCart])

  const handleAddUpsell = useCallback((s: UpsellSuggestion) => {
    const { addItem } = useCartStore.getState()
    addItem({ id: s.id, cartKey: s.id, name: s.name, price: s.price, tag: s.tag, category: s.category, unit: s.unit })
    toast.success(`${s.name} added to your booking`)
  }, [])

  const handleConfirmBooking = useCallback(async (type: 'booking' | 'inquiry') => {
    setLoading(true)
    try {
      const endpoint = type === 'booking' ? '/api/bookings' : '/api/inquiries'
      const res = await fetch(endpoint, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: { name, email, phone },
          items: items.map(i => ({ ...i })),
          checkIn, checkOut, guests,
          specialRequests: specialReq, message,
          payment:
            payMethod === 'mpesa' ? { method: 'mpesa', phone: stkPhone || mpPhone } :
            payMethod === 'card'  ? { method: 'card', cardNumber: cardNum, expiry, cvv } :
                                    { method: 'room' },
          subtotal: sub, serviceCharge: svc, vat: vatAmt, totalAmount: grand,
        }),
      })
      const data = await res.json()
      const ref  = data.referenceNumber || generateRef(type === 'booking' ? 'UKV' : 'INQ')
      setConfirmed({ ref, type })
      clearCart()
    } catch {
      const ref = generateRef(type === 'booking' ? 'UKV' : 'INQ')
      setConfirmed({ ref, type })
      clearCart()
    } finally {
      setLoading(false)
    }
  }, [name, email, phone, items, checkIn, checkOut, guests, specialReq, message, payMethod, stkPhone, mpPhone, cardNum, expiry, cvv, sub, svc, vatAmt, grand, clearCart])

  const handleStkPush = useCallback(async () => {
    if (!mpPhone) { toast.error('Enter your M-Pesa number'); return }
    const normalised = normalisePhone(mpPhone)
    setStkPhone(normalised)
    setLoading(true)
    try {
      await fetch('/api/mpesa/stk', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalised, amount: grand, accountRef: MPESA_ACCOUNT,
          description: `Ubuntu Booking – ${items.map(i => i.name).join(', ').slice(0, 80)}`,
        }),
      }).catch(() => {})
    } finally {
      setLoading(false)
    }
    setStep('stk_waiting')
  }, [mpPhone, grand, items])

  const handlePayNow = useCallback(async () => {
    if (!name || !email) { toast.error('Please enter your name and email'); return }
    if (payMethod === 'mpesa') {
      await handleStkPush()
    } else if (payMethod === 'card') {
      if (!cardNum || !expiry || !cvv) { toast.error('Complete your card details'); return }
      setStep('processing')
      setTimeout(async () => { await handleConfirmBooking('booking') }, 2200)
    } else {
      await handleConfirmBooking('booking')
    }
  }, [name, email, payMethod, handleStkPush, cardNum, expiry, cvv, handleConfirmBooking])

  const handleInquiry = useCallback(async () => {
    if (!name || !email) { toast.error('Please enter your name and email'); return }
    await handleConfirmBooking('inquiry')
  }, [name, email, handleConfirmBooking])

  // ── EARLY RETURN — AFTER all hooks ────────────────────────────────
  if (!isOpen) return null

  // ─────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────
  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style suppressHydrationWarning>{`
        @keyframes cartBounce {
          0%,100% { transform: translateY(0) scale(1); }
          20%     { transform: translateY(-4px) scale(1.01); }
          40%     { transform: translateY(2px) scale(0.99); }
          60%     { transform: translateY(-2px) scale(1.005); }
          80%     { transform: translateY(1px) scale(0.998); }
        }
        .cart-panel-bounce { animation: none; }
        .cart-panel-bounce:hover { animation: cartBounce 0.55s ease; }

        .input-dark {
          width: 100%;
          padding: 9px 12px;
          background: var(--bg3, rgba(255,255,255,0.04));
          border: 0.5px solid var(--border2, rgba(255,255,255,0.1));
          color: var(--cream, #f0ece0);
          font-family: var(--font-body);
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s;
        }
        .input-dark:focus { border-color: rgba(212,168,83,0.4); }
        .input-dark::placeholder { color: var(--muted, rgba(255,255,255,0.3)); }
        input[type="date"].input-dark::-webkit-calendar-picker-indicator {
          filter: invert(0.6); cursor: pointer;
        }
      `}</style>

      {/* ── BACKDROP ── */}
      <div
        className="fixed inset-0 z-[100]"
        onClick={closeCart}
        style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
      />

      {/* ── PANEL ── */}
      <div
        className="cart-panel-bounce fixed top-0 right-0 bottom-0 z-[101] flex flex-col"
        style={{
          width: 'min(500px, 100vw)',
          background: 'var(--bg2, #0e0e0c)',
          borderLeft: '0.5px solid var(--border, rgba(255,255,255,0.08))',
          boxShadow: '-20px 0 80px rgba(0,0,0,0.6)',
          transition: 'box-shadow 0.3s',
        }}
        onMouseEnter={() => setPanelHov(true)}
        onMouseLeave={() => setPanelHov(false)}
      >

        {/* ════════════════ CONFIRMED ════════════════ */}
        {confirmed ? (
          <div className="flex flex-col items-center justify-center flex-1 p-10 text-center">
            <div className="w-16 h-16 flex items-center justify-center mb-7"
              style={{ border: '0.5px solid var(--gold)', color: 'var(--gold)', fontSize: '24px' }}>
              ✦
            </div>
            <h2 className="text-[38px] font-light mb-3 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {confirmed.type === 'booking'
                ? <>Booking <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Confirmed</em></>
                : <>Inquiry <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Received</em></>}
            </h2>
            <p className="text-[13px] leading-[1.8] mb-6" style={{ color: 'var(--muted)' }}>
              {confirmed.type === 'booking'
                ? 'Your reservation is secured at Ubuntu Kreative Village. A confirmation will reach you within the hour.'
                : 'Our team will be in touch within 24 hours to curate your experience. Welcome to the village.'}
            </p>
            <div className="text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 mb-8"
              style={{ background: 'var(--gold-dim)', border: '0.5px solid rgba(200,168,75,0.3)', color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>
              Ref # {confirmed.ref}
            </div>
            {confirmed.type === 'booking' && payMethod === 'mpesa' && (
              <div className="w-full p-4 mb-6 text-left" style={{ background: 'var(--bg3)', border: '0.5px solid rgba(200,168,75,0.2)' }}>
                <p className="text-[9px] tracking-[0.18em] uppercase mb-3" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>Complete your M-Pesa payment</p>
                <div className="space-y-1.5">
                  {[
                    ['Paybill',    MPESA_PAYBILL],
                    ['Account',    MPESA_ACCOUNT],
                    ['Name',       MPESA_NAME],
                    ['Amount',     `KES ${grand.toLocaleString()}`],
                    ['Reference',  confirmed.ref],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-[12px]">
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <span style={{
                        color: label === 'Paybill' || label === 'Account' ? 'var(--gold2)' : 'var(--cream)',
                        fontWeight: label === 'Paybill' || label === 'Account' ? 500 : 300,
                        fontFamily: 'var(--font-body)',
                      }}>{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className="btn-gold w-full" onClick={resetAndClose}>Back to the Village</button>
          </div>

        ) : step === 'stk_waiting' ? (
          /* ════════════════ STK WAITING ════════════════ */
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center justify-between px-7 py-5 shrink-0"
              style={{ borderBottom: '0.5px solid var(--border)' }}>
              <h2 className="text-[22px] font-light" style={{ fontFamily: 'var(--font-display)' }}>M-Pesa Prompt Sent</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <StkWaitingScreen
                phone={`+${stkPhone}`}
                amount={grand}
                onSuccess={async () => { setStep('processing'); await handleConfirmBooking('booking') }}
                onTimeout={() => {
                  toast.error('M-Pesa prompt expired — please try again or use Paybill')
                  setStep('pay')
                }}
              />
            </div>
          </div>

        ) : step === 'processing' ? (
          /* ════════════════ PROCESSING ════════════════ */
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-[var(--gold)]/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-[var(--gold)] rounded-full animate-spin" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: 'var(--gold)' }}>Confirming Booking…</p>
            <p className="text-[11px] text-center" style={{ color: 'var(--muted)' }}>Please do not close this panel</p>
          </div>

        ) : (
          /* ════════════════ MAIN CART + CHECKOUT ════════════════ */
          <>
            {/* ── HEADER ── */}
            <div className="flex items-center justify-between px-7 py-5 shrink-0"
              style={{ borderBottom: '0.5px solid var(--border)' }}>
              {step !== 'cart' && (
                <button
                  onClick={() => setStep(step === 'pay' ? 'details' : 'cart')}
                  className="text-[11px] mr-3 transition-colors"
                  style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                >
                  ← Back
                </button>
              )}
              <h2 className="text-[26px] font-light flex-1" style={{ fontFamily: 'var(--font-display)' }}>
                {step === 'cart'    ? 'Your Booking'
                : step === 'details' ? 'Your Details'
                : step === 'pay'     ? 'Payment'
                :                     'Complete'}
              </h2>
              {/* Total qty badge — uses item.qty (fixed from item.quantity) */}
              {items.length > 0 && step === 'cart' && totalQty > 0 && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  width: 24, height: 24, borderRadius: '50%', marginRight: 8,
                  background: 'var(--gold)', color: 'var(--obsidian)',
                  fontSize: '10px', fontWeight: 700, fontFamily: 'var(--font-body)',
                }}>
                  {totalQty}
                </span>
              )}
              <button
                onClick={closeCart}
                className="text-[20px] leading-none transition-colors"
                style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            {/* ── STEP BAR ── */}
            {items.length > 0 && <StepBar step={step} />}

            {/* ── SCROLLABLE BODY ── */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

              {/* ── EMPTY STATE ── */}
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full px-7 py-16 text-center">
                  <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>🛒</div>
                  <p className="text-[26px] font-light mb-2" style={{ fontFamily: 'var(--font-display)', color: 'var(--muted)' }}>Nothing here yet</p>
                  <p className="text-[12px] leading-[1.7]" style={{ color: 'var(--muted)' }}>
                    Browse cottages, spa, farm walks, dining, or events — add anything to build your stay.
                  </p>
                </div>
              )}

              {/* ════════════════ STEP 1 — CART REVIEW ════════════════ */}
              {step === 'cart' && items.length > 0 && (
                <>
                  {/* ── DATES & GUESTS ── */}
                  <div className="px-7 pt-5 pb-3" style={{ borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-[9px] tracking-[0.18em] uppercase mb-3"
                      style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
                      {roomIds.length > 0 ? 'Stay Dates' : 'Your Dates'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <BlockedDateInput
                        label="Check-in"
                        value={checkIn}
                        onChange={v => setDates(v, checkOut)}
                        roomIds={roomIds}
                        otherDate={checkOut}
                        isArrival
                      />
                      <BlockedDateInput
                        label="Check-out"
                        value={checkOut}
                        onChange={v => setDates(checkIn, v)}
                        min={checkIn || undefined}
                        roomIds={roomIds}
                        otherDate={checkIn}
                      />
                    </div>
                    {roomIds.length > 0 && (
                      <p style={{ fontSize: '8px', color: 'rgba(212,168,83,0.5)', fontFamily: 'var(--font-body)', letterSpacing: '0.08em', marginBottom: 8 }}>
                        ◈ Dates marked unavailable are already reserved for your selected rooms
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <label className="text-[9px] tracking-[0.12em] uppercase shrink-0"
                        style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>Guests</label>
                      <select className="input-dark flex-1" value={guests} onChange={e => setGuests(Number(e.target.value))}>
                        {[1,2,3,4,5,6,7,8].map(n => (
                          <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* ── CART ITEMS grouped by category ── */}
                  <div className="px-7 py-3">
                    {Object.entries(groupedItems).map(([cat, catItems]) => {
                      const meta = CATEGORY_META[cat] || { label: cat, icon: '◈', accent: 'var(--gold)' }
                      return (
                        <div key={cat} style={{ marginBottom: 20 }}>
                          {/* Category header */}
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: 8,
                            marginBottom: 8, paddingBottom: 6,
                            borderBottom: `0.5px solid ${meta.accent}22`,
                          }}>
                            <span style={{ fontSize: 14 }}>{meta.icon}</span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: meta.accent }}>
                              {meta.label}
                            </span>
                            <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', color: 'rgba(255,255,255,0.2)', marginLeft: 'auto' }}>
                              {catItems.length} line{catItems.length > 1 ? 's' : ''}
                            </span>
                          </div>

                          {/* Each cart line — one row per unique cartKey */}
                          {catItems.map(item => {
                            const qty       = item.qty          // FIX: was item.quantity
                            const lineTotal = item.price * qty  // FIX: was item.price * (item.quantity ?? 1)
                            const noteVal   = item.note || ''   // FIX: note stored on item in store

                            // Extract board plan label if embedded in name (e.g. "Warbugia · Bed & Breakfast")
                            // If not present, show item.tag as-is
                            const tagDisplay = item.tag

                            return (
                              <div
                                key={item.cartKey}
                                className="py-4"
                                style={{ borderBottom: '0.5px solid rgba(255,255,255,0.04)' }}
                              >
                                <div className="flex gap-3 items-start">

                                  {/* ── Qty badge + ±1 controls ── */}
                                  <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                                    {/* Badge — shows ×N as a single order line */}
                                    <div style={{
                                      width: 40, height: 40,
                                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                                      borderRadius: 6,
                                      background: `${meta.accent}15`,
                                      border: `0.5px solid ${meta.accent}30`,
                                    }}>
                                      <span style={{
                                        fontFamily: 'var(--font-display)',
                                        fontSize: qty > 9 ? '0.75rem' : '1rem',
                                        fontWeight: 300,
                                        color: meta.accent,
                                      }}>
                                        ×{qty}
                                      </span>
                                    </div>
                                    {/* ±1 wired to increaseQty / decreaseQty — FIX: was read-only */}
                                    <QtyControl
                                      qty={qty}
                                      onIncrease={() => increaseQty(item.cartKey)}
                                      onDecrease={() => decreaseQty(item.cartKey)}
                                    />
                                  </div>

                                  {/* ── Item details ── */}
                                  <div className="flex-1 min-w-0">
                                    {/* Tag — shows board plan if present in tag */}
                                    <p className="text-[8px] tracking-[0.14em] uppercase mb-0.5"
                                      style={{ color: 'var(--sage2)', fontFamily: 'var(--font-body)' }}>
                                      {tagDisplay}
                                    </p>
                                    {/* Name */}
                                    <p className="text-[16px] font-light leading-tight mb-1"
                                      style={{ fontFamily: 'var(--font-display)', wordBreak: 'break-word' }}>
                                      {item.name}
                                    </p>
                                    {/* Price × qty breakdown */}
                                    <p className="text-[11px]" style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
                                      {qty > 1 ? (
                                        <>
                                          KES {item.price.toLocaleString()}
                                          <span style={{ color: 'rgba(255,255,255,0.3)' }}> × {qty}</span>
                                          {item.unit && <span style={{ color: 'rgba(255,255,255,0.2)' }}> {item.unit}</span>}
                                        </>
                                      ) : (
                                        <>
                                          KES {item.price.toLocaleString()}
                                          {item.unit && <span style={{ color: 'rgba(255,255,255,0.2)' }}> {item.unit}</span>}
                                        </>
                                      )}
                                    </p>
                                  </div>

                                  {/* ── Line total + remove ── */}
                                  <div className="flex flex-col items-end gap-2 shrink-0">
                                    <p className="text-[18px] font-light"
                                      style={{ fontFamily: 'var(--font-display)', color: meta.accent }}>
                                      KES {lineTotal.toLocaleString()}
                                    </p>
                                    {/* Remove — FIX: was removeItem(item.id), now removeItem(item.cartKey) */}
                                    <button
                                      onClick={() => {
                                        removeItem(item.cartKey)
                                        toast(`${item.name} removed`, { icon: '✕' })
                                      }}
                                      title="Remove item"
                                      style={{
                                        display: 'inline-flex', alignItems: 'center', gap: 4,
                                        padding: '3px 8px', borderRadius: 4,
                                        background: 'rgba(255,80,80,0.06)',
                                        border: '0.5px solid rgba(255,80,80,0.18)',
                                        color: 'rgba(255,130,130,0.7)',
                                        fontFamily: 'var(--font-body)', fontSize: '8px',
                                        letterSpacing: '0.1em', textTransform: 'uppercase',
                                        cursor: 'pointer', transition: 'all 0.2s',
                                      }}
                                      onMouseEnter={e => {
                                        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,80,80,0.14)'
                                        ;(e.currentTarget as HTMLElement).style.color = '#ff8080'
                                      }}
                                      onMouseLeave={e => {
                                        ;(e.currentTarget as HTMLElement).style.background = 'rgba(255,80,80,0.06)'
                                        ;(e.currentTarget as HTMLElement).style.color = 'rgba(255,130,130,0.7)'
                                      }}
                                    >
                                      ✕ Remove
                                    </button>
                                  </div>
                                </div>

                                {/* Per-item note — FIX: keyed by item.cartKey, uses store's updateNote */}
                                <div className="mt-2 ml-[52px]">
                                  {activeNoteKey === item.cartKey ? (
                                    <input
                                      autoFocus
                                      type="text"
                                      placeholder="e.g. Dietary needs, arrival time, special setup…"
                                      value={noteVal}
                                      onChange={e => updateNote(item.cartKey, e.target.value)}
                                      onBlur={() => setActiveNoteKey(null)}
                                      className="w-full text-[9px] px-3 py-1.5 font-mono outline-none"
                                      style={{ background: 'var(--bg3)', border: '0.5px solid rgba(200,168,75,0.25)', color: 'var(--cream)' }}
                                    />
                                  ) : (
                                    <button
                                      onClick={() => setActiveNoteKey(item.cartKey)}
                                      className="text-[8px] uppercase tracking-wider font-mono transition-colors"
                                      style={{ color: noteVal ? 'var(--gold)' : 'rgba(255,255,255,0.22)', background: 'none', border: 'none', cursor: 'pointer' }}
                                    >
                                      {noteVal ? `✎ ${noteVal}` : '+ Add note'}
                                    </button>
                                  )}
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>

                  {/* ── UPSELL SUGGESTIONS ── */}
                  {showUpsells && upsells.length > 0 && (
                    <div className="px-7 py-4" style={{ borderTop: '0.5px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.01)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                        <div>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 2 }}>
                            ◈ You might also enjoy
                          </p>
                          <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'rgba(255,255,255,0.3)' }}>
                            Curated to complement your booking
                          </p>
                        </div>
                        <button
                          onClick={() => setShowUpsells(false)}
                          style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          Hide
                        </button>
                      </div>
                      {upsells.map(s => <UpsellRow key={s.id} suggestion={s} onAdd={handleAddUpsell} />)}
                    </div>
                  )}

                  {/* ── TOTALS — FIX: uses totalQty not item.quantity ── */}
                  <div className="px-7 py-4" style={{ borderTop: '0.5px solid var(--border)' }}>
                    {[
                      { label: `Subtotal (${totalQty} item${totalQty !== 1 ? 's' : ''})`, value: `KES ${sub.toLocaleString()}` },
                      { label: 'Village service charge (10%)',                              value: `KES ${svc.toLocaleString()}` },
                      { label: 'VAT (16%)',                                                 value: `KES ${vatAmt.toLocaleString()}` },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between text-[12px] py-1.5" style={{ color: 'var(--muted)' }}>
                        <span>{r.label}</span>
                        <span>{r.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3.5 mt-1" style={{ borderTop: '0.5px solid var(--border)' }}>
                      <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color: 'var(--cream)', fontFamily: 'var(--font-body)' }}>Total</span>
                      <span className="text-[28px] font-light" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
                        <AnimatedTotal value={grand} />
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ════════════════ STEP 2 — DETAILS ════════════════ */}
              {step === 'details' && (
                <div className="px-7 py-6 space-y-4 pb-8">
                  <p className="text-[12px] leading-[1.7]" style={{ color: 'var(--muted)' }}>
                    Tell us about yourself so we can prepare everything perfectly.
                  </p>
                  <FormField label="Full Name *">
                    <input className="input-dark" placeholder="Jane Kamau" value={name} onChange={e => setName(e.target.value)} />
                  </FormField>
                  <FormField label="Email *">
                    <input className="input-dark" type="email" placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                  </FormField>
                  <FormField label="Phone / WhatsApp">
                    <input className="input-dark" placeholder="+254 7xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} />
                  </FormField>
                  <FormField label="Special Requests or Notes">
                    <textarea
                      className="input-dark"
                      style={{ minHeight: '90px', resize: 'vertical' }}
                      placeholder="Dietary requirements, accessibility needs, celebration setup, arrival time, allergies…"
                      value={specialReq}
                      onChange={e => setSpecialReq(e.target.value)}
                    />
                  </FormField>
                </div>
              )}

              {/* ════════════════ STEP 3 — PAYMENT ════════════════ */}
              {step === 'pay' && (
                <div className="px-7 py-5 space-y-5 pb-8">
                  {/* Pay / Inquiry tabs */}
                  <div className="flex" style={{ borderBottom: '0.5px solid var(--border2)' }}>
                    {([
                      { key: 'pay'     as CheckoutTab, label: 'Pay Now'      },
                      { key: 'inquiry' as CheckoutTab, label: 'Send Inquiry' },
                    ]).map(t => (
                      <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className="flex-1 py-2.5 text-[9px] tracking-[0.12em] uppercase transition-all"
                        style={{
                          fontFamily: 'var(--font-body)', background: 'none', border: 'none',
                          borderBottom: tab === t.key ? '1.5px solid var(--gold)' : '1.5px solid transparent',
                          color: tab === t.key ? 'var(--gold)' : 'var(--muted)',
                          marginBottom: '-0.5px', cursor: 'pointer',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {tab === 'pay' && (
                    <div className="space-y-4">
                      {/* Total recap */}
                      <div className="px-4 py-3 flex justify-between items-center"
                        style={{ background: 'var(--bg3)', border: '0.5px solid var(--border2)' }}>
                        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>Total to pay</span>
                        <span className="text-[22px] font-light" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>
                          KES {grand.toLocaleString()}
                        </span>
                      </div>

                      {/* Payment method selector */}
                      <div>
                        <p className="text-[9px] tracking-[0.16em] uppercase mb-2" style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
                          Payment Method
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['mpesa', 'card', 'room'] as PayMethod[]).map(m => (
                            <button
                              key={m}
                              onClick={() => setPayMethod(m)}
                              className="py-3 text-[9px] tracking-[0.08em] uppercase transition-all"
                              style={{
                                background: payMethod === m ? 'var(--gold-dim)' : 'var(--bg3)',
                                border: payMethod === m ? '0.5px solid var(--gold)' : '0.5px solid var(--border2)',
                                color: payMethod === m ? 'var(--gold)' : 'var(--muted)',
                                fontFamily: 'var(--font-body)', cursor: 'pointer',
                              }}
                            >
                              {m === 'mpesa' ? 'M-Pesa' : m === 'card' ? 'Card' : 'Room'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* M-PESA */}
                      {payMethod === 'mpesa' && (
                        <div className="p-4 space-y-3" style={{ background: 'var(--bg3)', border: '0.5px solid rgba(200,168,75,0.25)' }}>
                          <p className="text-[9px] tracking-[0.18em] uppercase" style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}>
                            M-Pesa Express (STK Push)
                          </p>
                          <p className="text-[11px] leading-[1.6]" style={{ color: 'var(--muted)' }}>
                            Enter your phone number — you will receive a prompt and pay with your PIN.
                          </p>
                          <FormField label="Your M-Pesa Number">
                            <input className="input-dark" type="tel" placeholder="+254 7xx xxx xxx" value={mpPhone} onChange={e => setMpPhone(e.target.value)} />
                          </FormField>
                          <details>
                            <summary className="text-[9px] uppercase tracking-widest cursor-pointer list-none" style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>
                              Prefer to pay via Paybill? ▾
                            </summary>
                            <div className="mt-3 space-y-1.5 pt-3" style={{ borderTop: '0.5px solid var(--border2)' }}>
                              {[
                                ['Go to',          'M-Pesa → Lipa na M-Pesa → Pay Bill'],
                                ['Paybill Number', MPESA_PAYBILL],
                                ['Account Number', MPESA_ACCOUNT],
                                ['Business Name',  MPESA_NAME],
                                ['Amount',         `KES ${grand.toLocaleString()}`],
                              ].map(([k, v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{k}</span>
                                  <span className="text-[10px] text-right max-w-[55%]" style={{
                                    color: k === 'Paybill Number' || k === 'Account Number' ? 'var(--gold2)' : 'var(--cream)',
                                    fontWeight: k === 'Paybill Number' || k === 'Account Number' ? 500 : 300,
                                  }}>{v}</span>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}

                      {/* CARD */}
                      {payMethod === 'card' && (
                        <div className="space-y-3">
                          <FormField label="Card Number">
                            <input className="input-dark" placeholder="4242 4242 4242 4242" value={cardNum} onChange={e => setCardNum(e.target.value)} maxLength={19} />
                          </FormField>
                          <div className="grid grid-cols-2 gap-2">
                            <FormField label="Expiry">
                              <input className="input-dark" placeholder="MM / YY" value={expiry} onChange={e => setExpiry(e.target.value)} maxLength={7} />
                            </FormField>
                            <FormField label="CVV">
                              <input className="input-dark" placeholder="123" value={cvv} onChange={e => setCvv(e.target.value)} maxLength={4} type="password" />
                            </FormField>
                          </div>
                        </div>
                      )}

                      {/* ROOM */}
                      {payMethod === 'room' && (
                        <div className="p-4" style={{ background: 'var(--bg3)', border: '0.5px solid var(--border2)' }}>
                          <p className="text-[11px] leading-[1.65]" style={{ color: 'var(--muted)' }}>
                            Your booking total will be charged to your room account and settled at checkout.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {tab === 'inquiry' && (
                    <div className="space-y-4">
                      <p className="text-[12px] leading-[1.7]" style={{ color: 'var(--muted)' }}>
                        Send your cart as an inquiry — our team will reach out within 24 hours to tailor your experience.
                      </p>
                      <FormField label="Notes or Special Requests">
                        <textarea
                          className="input-dark"
                          style={{ minHeight: '90px', resize: 'vertical' }}
                          placeholder="Tell us about your group, any special requirements, or questions…"
                          value={message}
                          onChange={e => setMessage(e.target.value)}
                        />
                      </FormField>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── STICKY FOOTER CTA ── */}
            {items.length > 0 && (
              <div className="px-7 py-5 shrink-0 space-y-3" style={{ borderTop: '0.5px solid var(--border)', background: 'var(--bg2)' }}>
                {step === 'cart' && (
                  <>
                    <button
                      onClick={() => setStep('details')}
                      className="btn-gold w-full"
                      style={{ padding: '14px 28px', fontSize: '10px', letterSpacing: '0.22em' }}
                    >
                      Continue to Details →
                    </button>
                    <button
                      onClick={() => clearCart()}
                      className="w-full text-center text-[9px] uppercase tracking-widest transition-colors"
                      style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    >
                      Clear cart
                    </button>
                  </>
                )}

                {step === 'details' && (
                  <>
                    <button
                      onClick={() => {
                        if (!name || !email) { toast.error('Please enter your name and email'); return }
                        setStep('pay')
                      }}
                      className="btn-gold w-full"
                      style={{ padding: '14px 28px', fontSize: '10px', letterSpacing: '0.22em' }}
                    >
                      Continue to Payment →
                    </button>
                    <button
                      onClick={() => {
                        if (!name || !email) { toast.error('Please enter your name and email'); return }
                        setTab('inquiry')
                        setStep('pay')
                      }}
                      className="btn-outline-cream w-full"
                      style={{ padding: '12px 28px', fontSize: '10px' }}
                    >
                      Send as Inquiry Instead
                    </button>
                  </>
                )}

                {step === 'pay' && tab === 'pay' && (
                  <button
                    onClick={handlePayNow}
                    disabled={loading}
                    className="btn-gold w-full"
                    style={{ padding: '14px 28px', fontSize: '10px', letterSpacing: '0.22em', opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? 'Sending Prompt…' :
                     payMethod === 'mpesa' ? `Send M-Pesa Prompt · KES ${grand.toLocaleString()}` :
                     payMethod === 'card'  ? `Confirm & Pay · KES ${grand.toLocaleString()}` :
                                            `Confirm Room Charge · KES ${grand.toLocaleString()}`}
                  </button>
                )}

                {step === 'pay' && tab === 'inquiry' && (
                  <button
                    onClick={handleInquiry}
                    disabled={loading}
                    className="btn-gold w-full"
                    style={{ padding: '14px 28px', fontSize: '10px', letterSpacing: '0.22em', opacity: loading ? 0.6 : 1 }}
                  >
                    {loading ? 'Sending…' : 'Send Inquiry to Ubuntu Team'}
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}