'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────

const MPESA_PAYBILL  = '880100'
const MPESA_ACCOUNT  = '101497'
const MPESA_NAME     = 'Ubuntu Eco Lodge'
const SERVICE_CHARGE = 0.10   // 10% village service charge
const VAT_RATE       = 0.16   // 16% VAT

function generateRef(prefix: string) {
  return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`
}

// Formats a phone number to +254 format for STK push
function normalisePhone(raw: string): string {
  const digits = raw.replace(/\D/g, '')
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`
  if (digits.startsWith('254') && digits.length === 12) return digits
  if (digits.startsWith('7') && digits.length === 9) return `254${digits}`
  return digits
}

type CheckoutTab = 'pay' | 'inquiry'
type PayMethod   = 'mpesa' | 'card' | 'room'
type CheckoutStep = 'cart' | 'details' | 'pay' | 'stk_waiting' | 'processing' | 'confirmed'

// ─────────────────────────────────────────────────────────────────────
// SMALL HELPERS
// ─────────────────────────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <label
      className="block text-[8px] tracking-[0.18em] uppercase mb-1.5"
      style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
    >
      {children}
    </label>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function InputDark(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="input-dark w-full"
      style={{ fontFamily: 'var(--font-body)', ...(props.style ?? {}) }}
    />
  )
}

function TextareaDark(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className="input-dark w-full"
      style={{ minHeight: '80px', resize: 'vertical', fontFamily: 'var(--font-body)', ...(props.style ?? {}) }}
    />
  )
}

// ─────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────────────

function AnimatedTotal({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)

  useEffect(() => {
    if (prev.current === value) return
    const diff = value - prev.current
    const steps = 24
    let i = 0
    const iv = setInterval(() => {
      i++
      setDisplay(Math.round(prev.current + (diff * i) / steps))
      if (i >= steps) { clearInterval(iv); prev.current = value }
    }, 16)
    return () => clearInterval(iv)
  }, [value])

  return <>{`KES ${display.toLocaleString()}`}</>
}

// ─────────────────────────────────────────────────────────────────────
// STK PUSH WAITING SCREEN
// Simulates the Safaricom STK push flow with a countdown
// In production: poll /api/mpesa/status?ref=xxx every 3s
// ─────────────────────────────────────────────────────────────────────

function StkWaitingScreen({
  phone,
  amount,
  onSuccess,
  onTimeout,
}: {
  phone: string
  amount: number
  onSuccess: () => void
  onTimeout: () => void
}) {
  const [seconds, setSeconds] = useState(90)   // STK prompt expires after 90s
  const [dots,    setDots]    = useState('.')

  // Countdown timer
  useEffect(() => {
    const iv = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(iv); onTimeout(); return 0 }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(iv)
  }, [onTimeout])

  // Animated dots
  useEffect(() => {
    const iv = setInterval(() => setDots((d) => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(iv)
  }, [])

  // Simulate successful payment after ~4s (remove in production, use polling)
  useEffect(() => {
    const t = setTimeout(onSuccess, 4200)
    return () => clearTimeout(t)
  }, [onSuccess])

  const pct = Math.round(((90 - seconds) / 90) * 100)

  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center animate-fade-up">
      {/* Pulse ring */}
      <div className="relative w-20 h-20 mb-7">
        <div
          className="absolute inset-0 rounded-full border-2 border-[var(--gold)]/20 animate-ping"
          style={{ animationDuration: '1.8s' }}
        />
        <div className="absolute inset-0 rounded-full border border-[var(--gold)]/40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontSize: '28px' }}>📱</span>
        </div>
      </div>

      <h3
        className="text-[22px] font-light mb-2 leading-tight"
        style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
      >
        Check your phone{dots}
      </h3>
      <p className="text-[12px] leading-[1.75] mb-2" style={{ color: 'var(--muted)' }}>
        A Safaricom M-Pesa prompt has been sent to
      </p>
      <p
        className="text-[14px] mb-6 tracking-[0.1em]"
        style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}
      >
        {phone}
      </p>
      <p className="text-[11px] mb-6" style={{ color: 'var(--muted)' }}>
        Enter your <strong style={{ color: 'var(--cream)' }}>M-Pesa PIN</strong> to pay{' '}
        <strong style={{ color: 'var(--gold)' }}>KES {amount.toLocaleString()}</strong>
      </p>

      {/* Progress bar */}
      <div className="w-full h-1 bg-white/5 mb-2 overflow-hidden">
        <div
          className="h-full bg-[var(--gold)] transition-all duration-1000"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-[9px] tracking-widest uppercase" style={{ color: 'var(--muted)' }}>
        Prompt expires in {seconds}s
      </p>

      {/* Paybill fallback */}
      <div
        className="w-full mt-8 p-4 text-left"
        style={{ background: 'var(--bg3)', border: '0.5px solid rgba(200,168,75,0.15)' }}
      >
        <p
          className="text-[8px] tracking-[0.18em] uppercase mb-3"
          style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}
        >
          Didn&apos;t receive a prompt? Pay via Paybill:
        </p>
        <div className="space-y-1.5">
          {[
            ['M-Pesa → Lipa na M-Pesa', 'Pay Bill'],
            ['Paybill Number', MPESA_PAYBILL],
            ['Account Number', MPESA_ACCOUNT],
            ['Business Name', MPESA_NAME],
            ['Amount', `KES ${amount.toLocaleString()}`],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between text-[11px]">
              <span style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}>{k}</span>
              <span
                style={{
                  color: k === 'Paybill Number' || k === 'Account Number' ? 'var(--gold2)' : 'var(--cream)',
                  fontWeight: k === 'Paybill Number' || k === 'Account Number' ? 500 : 300,
                  fontFamily: 'var(--font-body)',
                }}
              >
                {v}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// CART PANEL — main component
// ─────────────────────────────────────────────────────────────────────

export function CartPanel() {
  const {
    items,
    isOpen,
    closeCart,
    openCart,
    checkIn,
    checkOut,
    guests,
    setDates,
    setGuests,
    removeItem,
    clearCart,
    subtotal,
    serviceCharge,
    total,
  } = useCartStore()

  // ── Per-item notes (keyed by item.id) ──
  const [notes,         setNotes]         = useState<Record<string, string>>({})
  const [activeNoteId,  setActiveNoteId]  = useState<string | null>(null)

  // ── Checkout flow ──
  const [tab,       setTab]       = useState<CheckoutTab>('pay')
  const [payMethod, setPayMethod] = useState<PayMethod>('mpesa')
  const [step,      setStep]      = useState<CheckoutStep>('cart')
  const [confirmed, setConfirmed] = useState<{ ref: string; type: string } | null>(null)
  const [loading,   setLoading]   = useState(false)

  // ── Contact fields ──
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [mpPhone,  setMpPhone]  = useState('')
  const [message,  setMessage]  = useState('')
  const [specialReq, setSpecialReq] = useState('')   // new: special requests / description

  // ── Card fields ──
  const [cardNum, setCardNum] = useState('')
  const [expiry,  setExpiry]  = useState('')
  const [cvv,     setCvv]     = useState('')

  // ── STK push ──
  const [stkPhone, setStkPhone] = useState('')

  // Derived totals
  const sub    = subtotal()
  const svc    = serviceCharge()
  const vatAmt = Math.round(sub * VAT_RATE)
  const grand  = sub + svc + vatAmt     // subtotal + 10% service + 16% VAT

  // ── Keyboard / scroll lock ──
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [closeCart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Helpers ──
  const updateNote = (id: string, val: string) =>
    setNotes((prev) => ({ ...prev, [id]: val }))

  const resetForm = useCallback(() => {
    setStep('cart')
    setTab('pay')
    setPayMethod('mpesa')
    setConfirmed(null)
    setName(''); setEmail(''); setPhone(''); setMpPhone(''); setStkPhone('')
    setMessage(''); setSpecialReq(''); setCardNum(''); setExpiry(''); setCvv('')
    setLoading(false)
  }, [])

  const resetAndClose = () => { resetForm(); closeCart() }

  // ── STK push ──
  const handleStkPush = async () => {
    if (!mpPhone) { toast.error('Enter your M-Pesa number'); return }
    const normalised = normalisePhone(mpPhone)
    setStkPhone(normalised)

    setLoading(true)
    try {
      // In production: POST /api/mpesa/stk with { phone: normalised, amount: grand, ref, items }
      // For now we set step and let the StkWaitingScreen handle simulation
      await fetch('/api/mpesa/stk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone: normalised,
          amount: grand,
          accountRef: MPESA_ACCOUNT,
          description: `Ubuntu Booking – ${items.map(i => i.name).join(', ').slice(0, 80)}`,
        }),
      }).catch(() => {}) // Silently fail — simulation handles it
    } finally {
      setLoading(false)
    }
    setStep('stk_waiting')
  }

  // ── Payment confirm (card / room / post-STK) ──
  const handleConfirmBooking = async (type: 'booking' | 'inquiry') => {
    setLoading(true)
    try {
      const endpoint = type === 'booking' ? '/api/bookings' : '/api/inquiries'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: { name, email, phone },
          items: items.map(i => ({
            ...i,
            note: notes[i.id] || '',
          })),
          checkIn, checkOut, guests,
          specialRequests: specialReq,
          message,
          payment: payMethod === 'mpesa'
            ? { method: 'mpesa', phone: stkPhone || mpPhone }
            : payMethod === 'card'
            ? { method: 'card', cardNumber: cardNum, expiry, cvv }
            : { method: 'room' },
          subtotal: sub,
          serviceCharge: svc,
          vat: vatAmt,
          totalAmount: grand,
        }),
      })
      const data = await res.json()
      const ref = data.referenceNumber || generateRef(type === 'booking' ? 'UKV' : 'INQ')
      setConfirmed({ ref, type })
      clearCart()
    } catch {
      // API not yet wired — still confirm gracefully
      const ref = generateRef(type === 'booking' ? 'UKV' : 'INQ')
      setConfirmed({ ref, type })
      clearCart()
    } finally {
      setLoading(false)
    }
  }

  const handlePayNow = async () => {
    if (!name || !email) { toast.error('Please enter your name and email'); return }
    if (payMethod === 'mpesa') {
      await handleStkPush()
    } else if (payMethod === 'card') {
      if (!cardNum || !expiry || !cvv) { toast.error('Complete your card details'); return }
      setStep('processing')
      // Simulate card processing
      setTimeout(async () => {
        await handleConfirmBooking('booking')
        setStep('cart') // confirmed state takes over
      }, 2200)
    } else {
      // Room charge — instant
      await handleConfirmBooking('booking')
    }
  }

  const handleInquiry = async () => {
    if (!name || !email) { toast.error('Please enter your name and email'); return }
    await handleConfirmBooking('inquiry')
  }

  if (!isOpen) return null

  return (
    <>
      {/* ── BACKDROP ── */}
      <div className="fixed inset-0 z-[100] overlay-backdrop" onClick={closeCart} />

      {/* ── PANEL ── */}
      <div
        className="fixed top-0 right-0 bottom-0 z-[101] flex flex-col animate-slide-in"
        style={{
          width: 'min(480px, 100vw)',
          background: 'var(--bg2)',
          borderLeft: '0.5px solid var(--border)',
        }}
      >

        {/* ════════════════════════════════════════════
            CONFIRMATION STATE
        ════════════════════════════════════════════ */}
        {confirmed ? (
          <div className="flex flex-col items-center justify-center flex-1 p-10 text-center animate-fade-up">
            <div
              className="w-16 h-16 flex items-center justify-center mb-7"
              style={{ border: '0.5px solid var(--gold)', color: 'var(--gold)', fontSize: '24px' }}
            >
              ✦
            </div>

            <h2
              className="text-[38px] font-light mb-3 leading-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              {confirmed.type === 'booking' ? (
                <>Booking <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Confirmed</em></>
              ) : (
                <>Inquiry <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Received</em></>
              )}
            </h2>

            <p className="text-[13px] leading-[1.8] mb-5" style={{ color: 'var(--muted)' }}>
              {confirmed.type === 'booking'
                ? 'Your reservation is secured at Ubuntu Kreative Village. A confirmation will reach you within the hour.'
                : 'Our team will be in touch within 24 hours to curate your experience. Welcome to the village.'}
            </p>

            {/* Reference pill */}
            <div
              className="text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 mb-7"
              style={{
                background: 'var(--gold-dim)',
                border: '0.5px solid rgba(200,168,75,0.3)',
                color: 'var(--gold)',
                fontFamily: 'var(--font-body)',
              }}
            >
              Ref # {confirmed.ref}
            </div>

            {/* M-Pesa paybill reminder */}
            {confirmed.type === 'booking' && payMethod === 'mpesa' && (
              <div
                className="w-full p-5 mb-6 text-left"
                style={{ background: 'var(--bg3)', border: '0.5px solid rgba(200,168,75,0.2)' }}
              >
                <p
                  className="text-[9px] tracking-[0.18em] uppercase mb-3"
                  style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}
                >
                  Complete your M-Pesa payment
                </p>
                <div className="space-y-2">
                  {[
                    ['Paybill', MPESA_PAYBILL],
                    ['Account', MPESA_ACCOUNT],
                    ['Name', MPESA_NAME],
                    ['Amount', `KES ${grand.toLocaleString()}`],
                    ['Reference', confirmed.ref],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between text-[12px]">
                      <span style={{ color: 'var(--muted)' }}>{label}</span>
                      <span
                        style={{
                          color: label === 'Paybill' || label === 'Account' ? 'var(--gold2)' : 'var(--cream)',
                          fontWeight: label === 'Paybill' || label === 'Account' ? 500 : 300,
                          fontFamily: 'var(--font-body)',
                        }}
                      >
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button className="btn-gold w-full" onClick={resetAndClose}>
              Back to the Village
            </button>
          </div>

        ) : step === 'stk_waiting' ? (
          /* ════════════════════════════════════════════
              STK WAITING STATE
          ════════════════════════════════════════════ */
          <div className="flex flex-col flex-1 overflow-hidden">
            <div
              className="flex items-center justify-between px-7 py-5 shrink-0"
              style={{ borderBottom: '0.5px solid var(--border)' }}
            >
              <h2 className="text-[22px] font-light" style={{ fontFamily: 'var(--font-display)' }}>
                M-Pesa Prompt Sent
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              <StkWaitingScreen
                phone={`+${stkPhone}`}
                amount={grand}
                onSuccess={async () => {
                  setStep('processing')
                  await handleConfirmBooking('booking')
                }}
                onTimeout={() => {
                  toast.error('M-Pesa prompt expired — please try again or use Paybill')
                  setStep('pay')
                }}
              />
            </div>
          </div>

        ) : step === 'processing' ? (
          /* ════════════════════════════════════════════
              PROCESSING STATE
          ════════════════════════════════════════════ */
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-[var(--gold)]/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-[var(--gold)] rounded-full animate-spin" />
              <div className="absolute inset-2 border border-[var(--gold)]/10 rounded-full" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color: 'var(--gold)' }}>
              Confirming Booking…
            </p>
            <p className="text-[11px] text-center" style={{ color: 'var(--muted)' }}>
              Please do not close this panel
            </p>
          </div>

        ) : (
          /* ════════════════════════════════════════════
              MAIN CART + CHECKOUT
          ════════════════════════════════════════════ */
          <>
            {/* ── HEADER ── */}
            <div
              className="flex items-center justify-between px-7 py-5 shrink-0"
              style={{ borderBottom: '0.5px solid var(--border)' }}
            >
              {/* Back arrow when in checkout steps */}
              {step !== 'cart' && (
                <button
                  onClick={() => setStep(step === 'pay' ? 'details' : 'cart')}
                  className="text-[11px] mr-3 transition-colors"
                  style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
                >
                  ← Back
                </button>
              )}
              <h2
                className="text-[26px] font-light flex-1"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                {step === 'cart'    ? 'Your Booking'      :
                 step === 'details' ? 'Your Details'      :
                 step === 'pay'     ? 'Payment'           : 'Complete'}
              </h2>
              <button
                onClick={closeCart}
                className="text-[20px] leading-none transition-colors ml-2"
                style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
              >
                ✕
              </button>
            </div>

            {/* ── STEP INDICATOR ── */}
            {items.length > 0 && (
              <div
                className="flex px-7 py-2 gap-0 shrink-0"
                style={{ borderBottom: '0.5px solid var(--border)' }}
              >
                {[
                  { key: 'cart',    label: '1 Review'  },
                  { key: 'details', label: '2 Details' },
                  { key: 'pay',     label: '3 Pay'     },
                ].map((s, i) => {
                  const steps: CheckoutStep[] = ['cart', 'details', 'pay']
                  const currentIdx = steps.indexOf(step)
                  const sIdx = steps.indexOf(s.key as CheckoutStep)
                  const done   = sIdx < currentIdx
                  const active = sIdx === currentIdx
                  return (
                    <div key={s.key} className="flex items-center flex-1">
                      <div className="flex flex-col items-center w-full">
                        <button
                          onClick={() => {
                            if (done) setStep(s.key as CheckoutStep)
                          }}
                          className="text-[8px] uppercase tracking-[0.15em] transition-all"
                          style={{
                            fontFamily: 'var(--font-body)',
                            color: active ? 'var(--gold)' : done ? 'var(--cream)' : 'var(--muted)',
                            background: 'none',
                            border: 'none',
                            cursor: done ? 'pointer' : 'default',
                            padding: '4px 0',
                          }}
                        >
                          {done ? `✓ ${s.label.slice(2)}` : s.label}
                        </button>
                        <div
                          style={{
                            height: '1.5px',
                            width: '100%',
                            background: active ? 'var(--gold)' : done ? 'var(--gold)' : 'var(--border2)',
                            transition: 'background 0.4s',
                          }}
                        />
                      </div>
                      {i < 2 && <div style={{ width: '4px', flexShrink: 0 }} />}
                    </div>
                  )
                })}
              </div>
            )}

            {/* ── SCROLLABLE BODY ── */}
            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>

              {/* ── EMPTY STATE ── */}
              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full px-7 py-16 text-center">
                  <p
                    className="text-[26px] font-light mb-2"
                    style={{ fontFamily: 'var(--font-display)', color: 'var(--muted)' }}
                  >
                    Nothing here yet
                  </p>
                  <p className="text-[12px] leading-[1.7]" style={{ color: 'var(--muted2)' }}>
                    Browse cottages, spa, farm walks, dining, or events — add anything to build your stay.
                  </p>
                </div>
              )}

              {/* ════════════════════════════
                  STEP 1 — CART REVIEW
              ════════════════════════════ */}
              {step === 'cart' && items.length > 0 && (
                <>
                  {/* Dates & guests */}
                  <div className="px-7 pt-6 pb-3">
                    <p
                      className="text-[8px] tracking-[0.18em] uppercase mb-2.5"
                      style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
                    >
                      Your Dates
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <input
                        type="date"
                        className="input-dark"
                        value={checkIn}
                        onChange={(e) => setDates(e.target.value, checkOut)}
                      />
                      <input
                        type="date"
                        className="input-dark"
                        value={checkOut}
                        onChange={(e) => setDates(checkIn, e.target.value)}
                      />
                    </div>
                    <div className="flex items-center gap-3">
                      <label
                        className="text-[8px] tracking-[0.12em] uppercase shrink-0"
                        style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
                      >
                        Guests
                      </label>
                      <select
                        className="input-dark flex-1"
                        value={guests}
                        onChange={(e) => setGuests(Number(e.target.value))}
                      >
                        {[1,2,3,4,5,6,7,8].map((n) => (
                          <option key={n} value={n}>{n} {n === 1 ? 'guest' : 'guests'}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Cart items with per-item notes */}
                  <div className="px-7 py-2">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="py-4"
                        style={{ borderBottom: '0.5px solid var(--muted2)' }}
                      >
                        <div className="flex gap-3 items-start">
                          <div className="flex-1 min-w-0">
                            {/* Category tag */}
                            <p
                              className="text-[8px] tracking-[0.14em] uppercase mb-0.5"
                              style={{ color: 'var(--sage2)', fontFamily: 'var(--font-body)' }}
                            >
                              {item.tag || item.category}
                            </p>
                            {/* Item name */}
                            <p
                              className="text-[16px] font-light leading-tight mb-0.5 truncate"
                              style={{ fontFamily: 'var(--font-display)' }}
                            >
                              {item.name}
                            </p>
                            {/* Qty × price */}
                            <p
                              className="text-[11px]"
                              style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
                            >
                              {item.quantity ?? 1} × KES {item.price.toLocaleString()} {item.unit ? `${item.unit}` : ''}
                            </p>
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <p
                              className="text-[17px] font-light"
                              style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
                            >
                              KES {(item.price * (item.quantity ?? 1)).toLocaleString()}
                            </p>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-[10px] transition-colors"
                              style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--rust, #c05a3a)' }}
                              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
                            >
                              Remove
                            </button>
                          </div>
                        </div>

                        {/* Per-item note */}
                        <div className="mt-2 ml-0">
                          {activeNoteId === item.id ? (
                            <input
                              autoFocus
                              type="text"
                              placeholder="e.g. Dietary needs, arrival time, special setup…"
                              value={notes[item.id] || ''}
                              onChange={(e) => updateNote(item.id, e.target.value)}
                              onBlur={() => setActiveNoteId(null)}
                              className="w-full text-[9px] px-3 py-1.5 font-mono outline-none transition-colors"
                              style={{
                                background: 'var(--bg3)',
                                border: '0.5px solid rgba(200,168,75,0.25)',
                                color: 'var(--cream)',
                                placeholder: 'var(--muted)',
                              }}
                            />
                          ) : (
                            <button
                              onClick={() => setActiveNoteId(item.id)}
                              className="text-[8px] uppercase tracking-wider transition-colors font-mono"
                              style={{ color: notes[item.id] ? 'var(--gold)' : 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                            >
                              {notes[item.id] ? `✎ ${notes[item.id]}` : '+ Add note'}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="px-7 py-4" style={{ borderTop: '0.5px solid var(--border)' }}>
                    {[
                      { label: `Subtotal (${items.length} item${items.length > 1 ? 's' : ''})`, value: `KES ${sub.toLocaleString()}` },
                      { label: 'Village service charge (10%)', value: `KES ${svc.toLocaleString()}` },
                      { label: 'VAT (16%)', value: `KES ${vatAmt.toLocaleString()}` },
                    ].map((r) => (
                      <div key={r.label} className="flex justify-between text-[11px] py-1.5" style={{ color: 'var(--muted)' }}>
                        <span>{r.label}</span><span>{r.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3.5 mt-1" style={{ borderTop: '0.5px solid var(--border)' }}>
                      <span
                        className="text-[11px] tracking-[0.1em] uppercase"
                        style={{ color: 'var(--cream)', fontFamily: 'var(--font-body)' }}
                      >
                        Total
                      </span>
                      <span
                        className="text-[26px] font-light"
                        style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
                      >
                        <AnimatedTotal value={grand} />
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ════════════════════════════
                  STEP 2 — DETAILS
              ════════════════════════════ */}
              {step === 'details' && (
                <div className="px-7 py-6 space-y-4 pb-8">
                  <p className="text-[11px] leading-[1.7]" style={{ color: 'var(--muted)' }}>
                    Tell us a little about yourself and your stay so we can prepare everything perfectly.
                  </p>

                  <Field label="Full Name *">
                    <InputDark
                      placeholder="Jane Kamau"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </Field>
                  <Field label="Email *">
                    <InputDark
                      type="email"
                      placeholder="jane@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Field>
                  <Field label="Phone / WhatsApp">
                    <InputDark
                      placeholder="+254 7xx xxx xxx"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </Field>

                  {/* ── Description / special requests ── */}
                  <Field label="Special Requests or Notes">
                    <TextareaDark
                      placeholder="Dietary requirements, accessibility needs, celebration setup, arrival time, allergies, group details — tell us anything that will help us prepare…"
                      value={specialReq}
                      onChange={(e) => setSpecialReq(e.target.value)}
                      style={{ minHeight: '100px' }}
                    />
                  </Field>

                  {/* Inquiry message — only shown in inquiry tab */}
                  {tab === 'inquiry' && (
                    <Field label="Message for Our Team">
                      <TextareaDark
                        placeholder="What are you looking to experience at Ubuntu Kreative Village? Any questions for our team?"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                      />
                    </Field>
                  )}
                </div>
              )}

              {/* ════════════════════════════
                  STEP 3 — PAYMENT
              ════════════════════════════ */}
              {step === 'pay' && (
                <div className="px-7 py-6 space-y-5 pb-8">

                  {/* Tabs: Pay Now / Inquiry */}
                  <div className="flex" style={{ borderBottom: '0.5px solid var(--border2)' }}>
                    {([
                      { key: 'pay'     as CheckoutTab, label: 'Pay Now'      },
                      { key: 'inquiry' as CheckoutTab, label: 'Send Inquiry'  },
                    ]).map((t) => (
                      <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className="flex-1 py-2.5 text-[9px] tracking-[0.12em] uppercase transition-all"
                        style={{
                          fontFamily: 'var(--font-body)',
                          background: 'none',
                          border: 'none',
                          borderBottom: tab === t.key ? '1.5px solid var(--gold)' : '1.5px solid transparent',
                          color: tab === t.key ? 'var(--gold)' : 'var(--muted)',
                          marginBottom: '-0.5px',
                          cursor: 'pointer',
                        }}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {/* ── PAY NOW ── */}
                  {tab === 'pay' && (
                    <div className="space-y-4 animate-fade-up">

                      {/* Order summary recap */}
                      <div
                        className="px-4 py-3 flex justify-between items-center"
                        style={{ background: 'var(--bg3)', border: '0.5px solid var(--border2)' }}
                      >
                        <span className="text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                          Total to pay
                        </span>
                        <span
                          className="text-[20px] font-light"
                          style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
                        >
                          KES {grand.toLocaleString()}
                        </span>
                      </div>

                      {/* Payment method selector */}
                      <div>
                        <p
                          className="text-[8px] tracking-[0.16em] uppercase mb-2"
                          style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
                        >
                          Payment Method
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['mpesa', 'card', 'room'] as PayMethod[]).map((m) => (
                            <button
                              key={m}
                              onClick={() => setPayMethod(m)}
                              className="py-3 text-[10px] tracking-[0.08em] uppercase transition-all"
                              style={{
                                background: payMethod === m ? 'var(--gold-dim)' : 'var(--bg3)',
                                border: payMethod === m ? '0.5px solid var(--gold)' : '0.5px solid var(--border2)',
                                color: payMethod === m ? 'var(--gold)' : 'var(--muted)',
                                fontFamily: 'var(--font-body)',
                                cursor: 'pointer',
                              }}
                            >
                              {m === 'mpesa' ? 'M-Pesa' : m === 'card' ? 'Card' : 'Room'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* M-PESA — STK Push */}
                      {payMethod === 'mpesa' && (
                        <div
                          className="p-4 animate-fade-up space-y-3"
                          style={{ background: 'var(--bg3)', border: '0.5px solid rgba(200,168,75,0.25)' }}
                        >
                          <p
                            className="text-[8px] tracking-[0.18em] uppercase"
                            style={{ color: 'var(--gold)', fontFamily: 'var(--font-body)' }}
                          >
                            M-Pesa Express (STK Push)
                          </p>
                          <p className="text-[11px] leading-[1.6]" style={{ color: 'var(--muted)' }}>
                            Enter your phone number below. You will receive a prompt on your phone — enter your M-Pesa PIN to complete payment instantly.
                          </p>

                          <Field label="Your M-Pesa Number">
                            <InputDark
                              type="tel"
                              placeholder="+254 7xx xxx xxx"
                              value={mpPhone}
                              onChange={(e) => setMpPhone(e.target.value)}
                            />
                          </Field>

                          {/* Paybill fallback instructions */}
                          <details className="group">
                            <summary
                              className="text-[9px] uppercase tracking-widest cursor-pointer list-none"
                              style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
                            >
                              Prefer to pay via Paybill? ▾
                            </summary>
                            <div className="mt-3 space-y-1.5 pt-3" style={{ borderTop: '0.5px solid var(--border2)' }}>
                              {[
                                ['Go to', 'M-Pesa → Lipa na M-Pesa → Pay Bill'],
                                ['Paybill Number', MPESA_PAYBILL],
                                ['Account Number', MPESA_ACCOUNT],
                                ['Business Name', MPESA_NAME],
                                ['Amount', `KES ${grand.toLocaleString()}`],
                              ].map(([label, value]) => (
                                <div key={label} className="flex justify-between">
                                  <span className="text-[10px]" style={{ color: 'var(--muted)' }}>{label}</span>
                                  <span
                                    className="text-[10px] text-right max-w-[55%]"
                                    style={{
                                      color: label === 'Paybill Number' || label === 'Account Number'
                                        ? 'var(--gold2)'
                                        : 'var(--cream)',
                                      fontWeight: label === 'Paybill Number' || label === 'Account Number' ? 500 : 300,
                                    }}
                                  >
                                    {value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}

                      {/* CARD */}
                      {payMethod === 'card' && (
                        <div className="space-y-3 animate-fade-up">
                          <Field label="Card Number">
                            <InputDark
                              placeholder="4242 4242 4242 4242"
                              value={cardNum}
                              onChange={(e) => setCardNum(e.target.value)}
                              maxLength={19}
                            />
                          </Field>
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="Expiry">
                              <InputDark
                                placeholder="MM / YY"
                                value={expiry}
                                onChange={(e) => setExpiry(e.target.value)}
                                maxLength={7}
                              />
                            </Field>
                            <Field label="CVV">
                              <InputDark
                                placeholder="123"
                                value={cvv}
                                onChange={(e) => setCvv(e.target.value)}
                                maxLength={4}
                                type="password"
                              />
                            </Field>
                          </div>
                        </div>
                      )}

                      {/* ROOM */}
                      {payMethod === 'room' && (
                        <div
                          className="p-4 animate-fade-up"
                          style={{ background: 'var(--bg3)', border: '0.5px solid var(--border2)' }}
                        >
                          <p className="text-[11px] leading-[1.65]" style={{ color: 'var(--muted)' }}>
                            Your booking total will be charged to your room account and settled at checkout.
                            Our team will confirm the arrangement with you.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── SEND INQUIRY ── */}
                  {tab === 'inquiry' && (
                    <div className="space-y-4 animate-fade-up">
                      <p className="text-[11px] leading-[1.7]" style={{ color: 'var(--muted)' }}>
                        Prefer a conversation first? Send your cart as an inquiry and our team will reach out within 24 hours to tailor your experience.
                      </p>
                      <Field label="Message for Our Team">
                        <TextareaDark
                          placeholder="Tell us about your group, any special requirements, or questions about your stay…"
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                        />
                      </Field>
                    </div>
                  )}

                </div>
              )}

            </div>

            {/* ── STICKY FOOTER CTA ── */}
            {items.length > 0 && (
              <div
                className="px-7 py-5 shrink-0 space-y-3"
                style={{ borderTop: '0.5px solid var(--border)', background: 'var(--bg2)' }}
              >
                {step === 'cart' && (
                  <button
                    onClick={() => setStep('details')}
                    className="btn-gold w-full"
                    style={{ padding: '14px 28px', fontSize: '10px', letterSpacing: '0.22em' }}
                  >
                    Continue to Details →
                  </button>
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
                     payMethod === 'card'  ? `Confirm & Pay · KES ${grand.toLocaleString()}`      :
                                            `Confirm Room Charge · KES ${grand.toLocaleString()}`  }
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

                {/* Clear cart link */}
                {step === 'cart' && (
                  <button
                    onClick={() => { clearCart(); setNotes({}) }}
                    className="w-full text-center text-[9px] uppercase tracking-widest transition-colors"
                    style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)' }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--rust, #c05a3a)' }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}
                  >
                    Clear cart
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