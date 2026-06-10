'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — CartPanel  (production v1.4)
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useCartStore, BOARD_PLAN_LABELS, buildEditUrl } from '@/context/cartStore'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
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

// ─────────────────────────────────────────────────────────────────────────────
// DEFENSIVE ITEM ACCESSORS
// ─────────────────────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeKey(item: any): string {
  return (item.cartKey && item.cartKey !== 'undefined')
    ? item.cartKey
    : (item.id || `item-${Math.random()}`)
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safeQty(item: any): number {
  const q = item.qty ?? item.quantity ?? 1
  const n = Number(q)
  return isFinite(n) && n > 0 ? n : 1
}
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function safePrice(p: any): number {
  const n = Number(p)
  return isFinite(n) ? n : 0
}

// ─────────────────────────────────────────────────────────────────────────────
// VALIDATION
// ─────────────────────────────────────────────────────────────────────────────
function normalisePhone(raw: string): string {
  const d = raw.replace(/\D/g, '')
  if (d.startsWith('0')   && d.length === 10) return `254${d.slice(1)}`
  if (d.startsWith('254') && d.length === 12) return d
  if (d.startsWith('7')   && d.length ===  9) return `254${d}`
  if (d.startsWith('1')   && d.length ===  9) return `254${d}`
  return d
}
function isValidPhone(raw: string): boolean {
  return /^254[17]\d{8}$/.test(normalisePhone(raw))
}
function isValidEmail(v: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
}
function formatCardNumber(v: string): string {
  return v.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim()
}
function formatExpiry(v: string): string {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
function isValidExpiry(v: string): boolean {
  const m = v.match(/^(\d{2})\/(\d{2})$/)
  if (!m) return false
  const mm = parseInt(m[1], 10)
  const yy = parseInt(m[2], 10) + 2000
  if (mm < 1 || mm > 12) return false
  const now = new Date()
  return new Date(yy, mm - 1) >= new Date(now.getFullYear(), now.getMonth())
}
function isValidCard(v: string): boolean {
  const d = v.replace(/\D/g, '')
  if (d.length < 13 || d.length > 19) return false
  let sum = 0; let alt = false
  for (let i = d.length - 1; i >= 0; i--) {
    let n = parseInt(d[i], 10)
    if (alt) { n *= 2; if (n > 9) n -= 9 }
    sum += n; alt = !alt
  }
  return sum % 10 === 0
}
function isValidCvv(v: string): boolean {
  return /^\d{3,4}$/.test(v.trim())
}

// ─────────────────────────────────────────────────────────────────────────────
// BLOCKED DATES
// ─────────────────────────────────────────────────────────────────────────────
const BLOCKED_DATES: Record<string, string[]> = {
  'warbugia':               ['2025-06-14','2025-06-15','2025-07-01','2025-07-02'],
  'locust-bean':            ['2025-06-20','2025-06-21','2025-07-10'],
  'tamarind':               ['2025-06-28','2025-06-29','2025-07-04','2025-07-05'],
  'acacia-penthouse':       ['2025-07-03','2025-07-04','2025-07-05'],
  'sycamore':               ['2025-06-18','2025-06-19'],
  'mugumo':                 ['2025-06-25','2025-06-26'],
  'ironwood-penthouse':     ['2025-07-07','2025-07-08'],
  'baobab':                 ['2025-06-22','2025-06-23'],
  'inko':                   ['2025-07-12','2025-07-13'],
  'buffalo-thorn':          ['2025-06-30','2025-07-01'],
  'neem-penthouse':         ['2025-07-15','2025-07-16'],
  'marula':                 ['2025-06-14','2025-06-15','2025-07-20'],
  'shea':                   ['2025-06-21','2025-06-22'],
  'milk-wood':              ['2025-07-04','2025-07-05','2025-07-06'],
  'ebony':                  ['2025-07-10','2025-07-11'],
  'acacia-glass-villa':     ['2025-07-20','2025-07-21','2025-07-22'],
  'forest-canopy-house':    ['2025-06-25'],
  'mara-sky-suite':         ['2025-07-05','2025-07-06'],
  'sol-sanctuary':          ['2025-07-15'],
  'earth-nest':             ['2025-06-18'],
  'quiet-stone-villa':      ['2025-07-08','2025-07-09'],
  'highland-retreat':       ['2025-07-04','2025-07-05'],
  'savanna-family-lodge':   ['2025-06-30','2025-07-01'],
  'ubuntu-signature-villa': ['2025-07-20','2025-07-21','2025-07-22','2025-07-23'],
}
const GLOBALLY_BLOCKED: string[] = [
  '2025-12-24','2025-12-25','2025-12-26','2025-12-31','2026-01-01',
]

// ─────────────────────────────────────────────────────────────────────────────
// UPSELLS
// ─────────────────────────────────────────────────────────────────────────────
interface UpsellSuggestion {
  id: string; name: string; price: number; category: string
  tag: string; unit: string; emoji: string; reason: string
}
const UPSELL_MAP: Record<string, UpsellSuggestion[]> = {
  cottage: [
    { id:'upsell-spa-day',        name:'Arohamai Spa Day',      price:8500,  category:'spa',             tag:'Spa',               unit:'/ person',      emoji:'🌿', reason:'Most guests add a spa day to their cottage stay' },
    { id:'upsell-farm-walk',      name:'Sunrise Farm Walk',     price:2800,  category:'event',           tag:'Farm Experience',   unit:'/ person',      emoji:'🌅', reason:'Start your mornings with a guided harvest walk'  },
    { id:'upsell-harvest-dinner', name:'Harvest Dinner',        price:12500, category:'event',           tag:'Dining Experience', unit:'/ person',      emoji:'🍽', reason:'Our most celebrated evening experience'           },
  ],
  restaurant: [
    { id:'upsell-fire-circle',    name:'New Moon Fire Circle',  price:1500,  category:'event',           tag:'Community',         unit:'/ person',      emoji:'🔥', reason:'A perfect evening after dinner'                  },
    { id:'upsell-cold-brew',      name:'Garden Cold Brew',      price:750,   category:'restaurant',      tag:'Drinks',            unit:'/ portion',     emoji:'☕', reason:'Pairs perfectly with your meal'                  },
  ],
  event: [
    { id:'upsell-cottage-night',  name:'Pokomo Marula Cottage', price:5000,  category:'cottage',         tag:'Cottage',           unit:'/ person · BO', emoji:'🏡', reason:'Stay the night after your event'                 },
    { id:'upsell-spa-ritual',     name:'Arohamai Spa Ritual',   price:6500,  category:'spa',             tag:'Spa',               unit:'/ person',      emoji:'✨', reason:'Unwind before or after your event'               },
  ],
  'event-package': [
    { id:'upsell-farm-tour',      name:'Private Farm Tour',     price:4500,  category:'event',           tag:'Farm Experience',   unit:'/ group',       emoji:'🌾', reason:'A unique addition to any gathering'               },
  ],
  spa: [
    { id:'upsell-cottage-upgrade',name:'Pokomo Cottage Stay',   price:5000,  category:'cottage',         tag:'Cottage',           unit:'/ person · BO', emoji:'🏡', reason:'Extend your wellness day into a full overnight'   },
    { id:'upsell-herbal-tea',     name:'Farm Herbal Infusions', price:350,   category:'village-kitchen', tag:'Beverages',         unit:'/ cup',         emoji:'🍵', reason:'Complement your spa ritual naturally'             },
  ],
  'village-kitchen': [
    { id:'upsell-farm-walk-vk',   name:'Sunrise Farm Walk',     price:2800,  category:'event',           tag:'Farm Experience',   unit:'/ person',      emoji:'🌅', reason:'See where your food comes from'                  },
  ],
}

// ─────────────────────────────────────────────────────────────────────────────
// CATEGORY META
// ─────────────────────────────────────────────────────────────────────────────
const CATEGORY_META: Record<string, { label:string; icon:string; accent:string }> = {
  cottage:           { label:'Accommodation',    icon:'🏡', accent:'var(--gold)'  },
  restaurant:        { label:'Dining',           icon:'🍽', accent:'#D4A853'      },
  'village-kitchen': { label:'Village Kitchen',  icon:'🌿', accent:'#A8F0D8'      },
  event:             { label:'Experiences',      icon:'✨', accent:'#F0A8B8'      },
  'event-package':   { label:'Events',           icon:'🎪', accent:'#B8A9F0'      },
  spa:               { label:'Wellness',         icon:'🌸', accent:'#F0A8B8'      },
  farm:              { label:'Farm Experiences', icon:'🌾', accent:'var(--neon)'  },
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB-COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg: string }) {
  if (!msg) return null
  return (
    <p style={{ fontSize:'9px', color:'#F0A8B8', marginTop:3, fontFamily:'var(--font-body)', letterSpacing:'0.06em' }}>
      ⚠ {msg}
    </p>
  )
}

function FormField({ label, error, children }: { label:string; error?:string; children:React.ReactNode }) {
  return (
    <div>
      <label className="block text-[9px] tracking-[0.14em] uppercase mb-1.5"
        style={{ color:'var(--muted)', fontFamily:'var(--font-body)' }}>
        {label}
      </label>
      {children}
      {error && <FieldError msg={error} />}
    </div>
  )
}

function QtyControl({ qty, onIncrease, onDecrease }: { qty:number; onIncrease:()=>void; onDecrease:()=>void }) {
  return (
    <div className="flex items-center"
      style={{ border:'0.5px solid var(--border2)', background:'var(--bg3)', borderRadius:4 }}>
      <button onClick={onDecrease}
        className="w-7 h-7 flex items-center justify-center text-[13px] leading-none"
        style={{ color:'var(--muted)', background:'none', border:'none', cursor:'pointer', borderRight:'0.5px solid var(--border2)', transition:'color 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='var(--gold)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='var(--muted)' }}
        aria-label="Decrease quantity">−
      </button>
      <span className="w-8 text-center text-[12px] font-mono" style={{ color:'var(--cream)' }}>{qty}</span>
      <button onClick={onIncrease}
        className="w-7 h-7 flex items-center justify-center text-[13px] leading-none"
        style={{ color:'var(--muted)', background:'none', border:'none', cursor:'pointer', borderLeft:'0.5px solid var(--border2)', transition:'color 0.15s' }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='var(--gold)' }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='var(--muted)' }}
        aria-label="Increase quantity">+
      </button>
    </div>
  )
}

function AnimatedTotal({ value }: { value:number }) {
  const [display, setDisplay] = useState(value)
  const prev = useRef(value)
  useEffect(() => {
    if (prev.current === value) return
    const diff = value - prev.current; const steps = 24; let i = 0
    const iv = setInterval(() => {
      i++; setDisplay(Math.round(prev.current + (diff * i) / steps))
      if (i >= steps) { clearInterval(iv); prev.current = value }
    }, 14)
    return () => clearInterval(iv)
  }, [value])
  return <>{`KES ${display.toLocaleString()}`}</>
}

function BlockedDateInput({ label, value, onChange, min, roomIds, otherDate, isArrival }: {
  label:string; value:string; onChange:(v:string)=>void
  min?:string; roomIds:string[]; otherDate?:string; isArrival?:boolean
}) {
  const [warning, setWarning] = useState('')
  const blocked = useMemo(() => {
    const s = new Set<string>(GLOBALLY_BLOCKED)
    roomIds.forEach(id => (BLOCKED_DATES[id] || []).forEach(d => s.add(d)))
    return s
  }, [roomIds])
  function handleChange(v: string) {
    if (!v) { onChange(v); setWarning(''); return }
    if (blocked.has(v)) { setWarning('This date is unavailable — please choose another.'); return }
    if (!isArrival && otherDate && v <= otherDate) { setWarning('Check-out must be after check-in.'); return }
    if (isArrival  && otherDate && v >= otherDate) { setWarning('Check-in must be before check-out.'); return }
    setWarning(''); onChange(v)
  }
  return (
    <div>
      <label className="block text-[9px] tracking-[0.14em] uppercase mb-1.5"
        style={{ color:'var(--muted)', fontFamily:'var(--font-body)' }}>{label}</label>
      <div style={{ position:'relative' }}>
        <input type="date" className="input-dark" value={value}
          min={min || new Date().toISOString().split('T')[0]}
          onChange={e => handleChange(e.target.value)}
          style={{ width:'100%', colorScheme:'dark' }} />
        {blocked.size > 0 && (
          <p style={{ fontSize:'8px', color:'rgba(255,255,255,0.2)', marginTop:3, fontFamily:'var(--font-body)', letterSpacing:'0.06em' }}>
            {blocked.size} date{blocked.size > 1 ? 's' : ''} unavailable for selected rooms
          </p>
        )}
      </div>
      {warning && <FieldError msg={warning} />}
    </div>
  )
}

function UpsellRow({ suggestion, onAdd }: { suggestion:UpsellSuggestion; onAdd:(s:UpsellSuggestion)=>void }) {
  const { items } = useCartStore()
  const [hov, setHov] = useState(false)
  const already = items.some(i => i.cartKey === suggestion.id || i.id === suggestion.id)
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', background:hov?'rgba(212,168,83,0.06)':'rgba(255,255,255,0.02)', border:`0.5px solid ${hov?'rgba(212,168,83,0.25)':'rgba(255,255,255,0.06)'}`, borderRadius:8, transition:'all 0.2s', marginBottom:6 }}>
      <span style={{ fontSize:20, flexShrink:0 }}>{suggestion.emoji}</span>
      <div style={{ flex:1, minWidth:0 }}>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'0.9rem', fontWeight:300, color:'var(--cream)', marginBottom:1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{suggestion.name}</p>
        <p style={{ fontFamily:'var(--font-body)', fontSize:'8px', color:'rgba(255,255,255,0.3)', letterSpacing:'0.06em' }}>{suggestion.reason}</p>
      </div>
      <div style={{ textAlign:'right', flexShrink:0 }}>
        <p style={{ fontFamily:'var(--font-display)', fontSize:'0.85rem', color:'var(--gold)', marginBottom:4 }}>KES {suggestion.price.toLocaleString()}</p>
        <button onClick={() => onAdd(suggestion)} disabled={already}
          style={{ padding:'3px 10px', borderRadius:4, border:'none', cursor:already?'default':'pointer', background:already?'rgba(0,255,65,0.08)':'var(--gold)', color:already?'var(--neon)':'var(--obsidian)', fontFamily:'var(--font-body)', fontSize:'8px', letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:700, transition:'all 0.2s' }}>
          {already ? '✓' : '+ Add'}
        </button>
      </div>
    </div>
  )
}

function StepBar({ step }: { step:CheckoutStep }) {
  const steps: { key:CheckoutStep; label:string }[] = [
    { key:'cart',    label:'1 Review'  },
    { key:'details', label:'2 Details' },
    { key:'pay',     label:'3 Pay'     },
  ]
  const currentIdx = steps.findIndex(s => s.key === step)
  return (
    <div className="flex px-7 py-2 shrink-0" style={{ borderBottom:'0.5px solid var(--border)' }}>
      {steps.map((s, i) => {
        const sIdx = steps.findIndex(x => x.key === s.key)
        const done = sIdx < currentIdx; const active = sIdx === currentIdx
        return (
          <div key={s.key} className="flex items-center flex-1">
            <div className="flex flex-col items-center w-full">
              <span className="text-[8px] uppercase tracking-[0.15em] transition-all"
                style={{ fontFamily:'var(--font-body)', padding:'4px 0', display:'block', color:active?'var(--gold)':done?'var(--cream)':'var(--muted)' }}>
                {done ? `✓ ${s.label.slice(2)}` : s.label}
              </span>
              <div style={{ height:'1.5px', width:'100%', transition:'background 0.4s', background:active||done?'var(--gold)':'var(--border2)' }} />
            </div>
            {i < steps.length - 1 && <div style={{ width:'4px', flexShrink:0 }} />}
          </div>
        )
      })}
    </div>
  )
}

function StkWaitingScreen({ phone, amount, onSuccess, onTimeout }: {
  phone:string; amount:number; onSuccess:()=>void; onTimeout:()=>void
}) {
  const [seconds, setSeconds] = useState(90)
  const [dots,    setDots]    = useState('.')
  useEffect(() => {
    const iv = setInterval(() => setSeconds(s => {
      if (s <= 1) { clearInterval(iv); onTimeout(); return 0 }
      return s - 1
    }), 1000)
    return () => clearInterval(iv)
  }, [onTimeout])
  useEffect(() => {
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(iv)
  }, [])
  
  // SIMULATION: In production, this would poll an API for the real transaction status.
  // We've added a 4.2s delay to simulate the user receiving and approving the STK push.
  useEffect(() => { 
    const t = setTimeout(onSuccess, 4200); 
    return () => clearTimeout(t) 
  }, [onSuccess])

  const pct = Math.round(((90 - seconds) / 90) * 100)
  return (
    <div className="flex flex-col items-center justify-center py-10 px-5 text-center">
      <div className="relative w-20 h-20 mb-7">
        <div className="absolute inset-0 rounded-full border-2 border-[var(--gold)]/20 animate-ping" style={{ animationDuration:'1.8s' }} />
        <div className="absolute inset-0 rounded-full border border-[var(--gold)]/40" />
        <div className="absolute inset-0 flex items-center justify-center text-[28px]">📱</div>
      </div>
      <h3 className="text-[22px] font-light mb-2" style={{ fontFamily:'var(--font-display)', color:'var(--cream)' }}>
        Simulating STK Push{dots}
      </h3>
      <p className="text-[12px] mb-1" style={{ color:'var(--muted)' }}>Check your phone for the M-Pesa prompt simulation</p>
      <p className="text-[14px] mb-5 tracking-[0.08em]" style={{ color:'var(--gold)', fontFamily:'var(--font-body)' }}>{phone}</p>
      
      <div className="flex flex-col items-center gap-4 p-6 border border-[var(--gold)]/20 rounded-xl bg-[var(--gold)]/5 mb-8">
        <div className="animate-pulse flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[var(--gold)]" />
          <span className="text-[10px] uppercase tracking-widest text-[var(--gold)]">Waiting for simulation approval...</span>
        </div>
      </div>

      <div className="w-full h-1 bg-white/5 mb-2 overflow-hidden">
        <div className="h-full bg-[var(--gold)] transition-all duration-1000" style={{ width:`${pct}%` }} />
      </div>
      <p className="text-[9px] tracking-widest uppercase mb-8" style={{ color:'var(--muted)' }}>Prompt expires in {seconds}s</p>
      
      <div className="w-full p-4 text-left" style={{ background:'var(--bg3)', border:'0.5px solid rgba(200,168,75,0.2)' }}>
        <p className="text-[8px] tracking-[0.18em] uppercase mb-3" style={{ color:'var(--gold)', fontFamily:'var(--font-body)' }}>
          Real-world Paybill details:
        </p>
        <div className="space-y-1.5">
          {[['M-Pesa → Lipa na M-Pesa','Pay Bill'],['Paybill Number',MPESA_PAYBILL],['Account Number',MPESA_ACCOUNT],['Business Name',MPESA_NAME],['Amount',`KES ${amount.toLocaleString()}`]].map(([k,v]) => (
            <div key={k} className="flex justify-between text-[11px]">
              <span style={{ color:'var(--muted)', fontFamily:'var(--font-body)' }}>{k}</span>
              <span style={{ color:k==='Paybill Number'||k==='Account Number'?'var(--gold2)':'var(--cream)', fontWeight:k==='Paybill Number'||k==='Account Number'?500:300, fontFamily:'var(--font-body)' }}>{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN CART PANEL
// ALL hooks declared before `if (!isOpen) return null` — React Rules of Hooks
// ─────────────────────────────────────────────────────────────────────────────
export function CartPanel() {
  const router = useRouter()
  const {
    items, isOpen, closeCart,
    checkIn, checkOut, guests,
    setDates, setGuests,
    removeItem, increaseQty, decreaseQty, updateNote, clearCart,
    subtotal,
  } = useCartStore()

  // ── Checkout state ────────────────────────────────────────────────────────
  const [step,      setStep]      = useState<CheckoutStep>('cart')
  const [tab,       setTab]       = useState<CheckoutTab>('pay')
  const [payMethod, setPayMethod] = useState<PayMethod>('mpesa')
  const [confirmed, setConfirmed] = useState<{ ref:string; type:string } | null>(null)
  const [loading,   setLoading]   = useState(false)

  // ── Contact fields ────────────────────────────────────────────────────────
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
  const [errs,       setErrs]       = useState<Record<string,string>>({})

  // ── UI ────────────────────────────────────────────────────────────────────
  const [activeNoteKey, setActiveNoteKey] = useState<string | null>(null)
  const [showUpsells,   setShowUpsells]   = useState(true)
  const [,              setPanelHov]      = useState(false)

  // ── ALL useMemo before early return ───────────────────────────────────────
  const sub = useMemo(() => {
    const raw = subtotal()
    return isFinite(raw) ? raw : items.reduce((s, i) => s + safePrice(i.price) * safeQty(i), 0)
  }, [subtotal, items])

  const svc    = useMemo(() => Math.round(sub * SERVICE_RATE), [sub])
  const vatAmt = useMemo(() => Math.round(sub * VAT_RATE),     [sub])
  const grand  = useMemo(() => sub + svc + vatAmt,             [sub, svc, vatAmt])

  const totalQty = useMemo(() => items.reduce((s, i) => s + safeQty(i), 0), [items])

  const roomIds = useMemo(() => items.filter(i => i.category === 'cottage').map(i => i.id), [items])

  const upsells = useMemo(() => {
    const cats = [...new Set(items.map(i => i.category))]
    const result: UpsellSuggestion[] = []
    const inCart = new Set([...items.map(i => i.cartKey), ...items.map(i => i.id)])
    cats.forEach(cat => {
      ;(UPSELL_MAP[cat] || []).forEach(s => {
        if (!inCart.has(s.id) && !result.find(x => x.id === s.id)) result.push(s)
      })
    })
    return result.slice(0, 3)
  }, [items])

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof items> = {}
    items.forEach(item => {
      const cat = item.category || 'other'
      if (!groups[cat]) groups[cat] = []
      groups[cat].push(item)
    })
    return groups
  }, [items])

  // ── ALL useEffect before early return ─────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') closeCart() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [closeCart])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── ALL useCallback before early return ───────────────────────────────────
  const setErr   = useCallback((f:string, m:string) => setErrs(p => ({...p,[f]:m})), [])
  const clearErr = useCallback((f:string) => setErrs(p => { const n={...p}; delete n[f]; return n }), [])

  const resetForm = useCallback(() => {
    setStep('cart'); setTab('pay'); setPayMethod('mpesa'); setConfirmed(null)
    setName(''); setEmail(''); setPhone(''); setMpPhone(''); setStkPhone('')
    setMessage(''); setSpecialReq(''); setCardNum(''); setExpiry(''); setCvv('')
    setErrs({}); setLoading(false)
  }, [])

  const resetAndClose = useCallback(() => { resetForm(); closeCart() }, [resetForm, closeCart])

  const handleAddUpsell = useCallback((s: UpsellSuggestion) => {
    const { addItem } = useCartStore.getState()
    addItem({ id:s.id, cartKey:s.id, name:s.name, price:s.price, tag:s.tag, category:s.category, unit:s.unit })
    toast.success(`${s.name} added to your booking`)
  }, [])

  const validateDetails = useCallback((): boolean => {
    const e: Record<string,string> = {}
    if (!name.trim())         e.name  = 'Please enter your full name'
    if (!isValidEmail(email)) e.email = 'Please enter a valid email address'
    if (phone && !isValidPhone(phone)) e.phone = 'Enter a valid Kenyan phone number'
    if (Object.keys(e).length) { setErrs(e); return false }
    setErrs({}); return true
  }, [name, email, phone])

  const validatePayment = useCallback((): boolean => {
    const e: Record<string,string> = {}
    if (payMethod === 'mpesa') {
      if (!mpPhone.trim())             e.mpPhone = 'M-Pesa number is required'
      else if (!isValidPhone(mpPhone)) e.mpPhone = 'Enter a valid Safaricom number (07xx or 01xx)'
    }
    if (payMethod === 'card') {
      if (!isValidCard(cardNum))  e.cardNum = 'Enter a valid card number'
      if (!isValidExpiry(expiry)) e.expiry  = 'Enter a valid future expiry (MM/YY)'
      if (!isValidCvv(cvv))       e.cvv     = '3 or 4 digit security code required'
    }
    if (Object.keys(e).length) { setErrs(e); return false }
    setErrs({}); return true
  }, [payMethod, mpPhone, cardNum, expiry, cvv])

  const handleConfirmBooking = useCallback(async (type: 'booking'|'inquiry') => {
    setLoading(true)
    try {
      const endpoint = type === 'booking' ? '/api/bookings' : '/api/inquiries'
      const res = await fetch(endpoint, {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          contact:{ name, email, phone },
          items:  items.map(i => ({ ...i, qty:safeQty(i), price:safePrice(i.price) })),
          checkIn, checkOut, guests,
          specialRequests:specialReq, message,
          payment:
            payMethod==='mpesa' ? { method:'mpesa', phone:stkPhone||normalisePhone(mpPhone) } :
            payMethod==='card'  ? { method:'card' } :
                                  { method:'room' },
          subtotal:sub, serviceCharge:svc, vat:vatAmt, totalAmount:grand,
        }),
      })
      const data = await res.json()
      const ref  = data.referenceNumber || generateRef(type==='booking'?'UKV':'INQ')
      setConfirmed({ ref, type }); clearCart()
    } catch {
      const ref = generateRef(type==='booking'?'UKV':'INQ')
      setConfirmed({ ref, type }); clearCart()
    } finally { setLoading(false) }
  }, [name,email,phone,items,checkIn,checkOut,guests,specialReq,message,payMethod,stkPhone,mpPhone,sub,svc,vatAmt,grand,clearCart])

  const handleStkPush = useCallback(async () => {
    if (!validatePayment()) return
    const normalised = normalisePhone(mpPhone)
    setStkPhone(normalised); setLoading(true)
    try {
      const res = await fetch('/api/mpesa/stkpush', {
        method:'POST', headers:{ 'Content-Type':'application/json' },
        body: JSON.stringify({
          phone:            normalised,
          amount:           Math.ceil(grand),
          accountReference: MPESA_ACCOUNT,
          transactionDesc:  `Ubuntu Booking – ${items.map(i=>i.name).join(', ').slice(0,80)}`,
          guestName:        name,
          guestEmail:       email,
          items:            items.map(i=>({ name:i.name, qty:safeQty(i), price:safePrice(i.price) })),
          subtotal:         sub,
          serviceCharge:    svc,
          vat:              vatAmt,
          totalAmount:      grand,
          checkIn, checkOut, guests,
        }),
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        toast.error(err.message || 'M-Pesa request failed — please try again')
        setLoading(false)
        return
      }
    } catch {
      toast.error('Could not reach payment server — check your connection')
      setLoading(false)
      return
    }
    setLoading(false)
    setStep('stk_waiting')
  }, [validatePayment, mpPhone, grand, items, name, email, sub, svc, vatAmt, checkIn, checkOut, guests])

  const handlePayNow = useCallback(async () => {
    if (!validateDetails()) return
    if (!validatePayment()) return
    if (payMethod === 'mpesa') { await handleStkPush() }
    else { await handleConfirmBooking('booking') }
  }, [validateDetails, validatePayment, payMethod, handleStkPush, handleConfirmBooking])

  const handleInquiry = useCallback(async () => {
    if (!validateDetails()) return
    if (!message.trim()) { setErr('message','Please describe your inquiry'); return }
    await handleConfirmBooking('inquiry')
  }, [validateDetails, message, handleConfirmBooking, setErr])

  const handleBack = useCallback(() => {
    if (step === 'pay')     { setStep('details'); return }
    if (step === 'details') { setStep('cart');    return }
  }, [step])

  // ── EARLY RETURN — after ALL hooks ────────────────────────────────────────
  if (!isOpen) return null

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <>
      <style suppressHydrationWarning>{`
        @keyframes cartBounce {
          0%,100%{transform:translateY(0) scale(1);}20%{transform:translateY(-4px) scale(1.01);}
          40%{transform:translateY(2px) scale(0.99);}60%{transform:translateY(-2px) scale(1.005);}
          80%{transform:translateY(1px) scale(0.998);}
        }
        .cart-panel-bounce{animation:none;}.cart-panel-bounce:hover{animation:cartBounce 0.55s ease;}
        .input-dark{width:100%;padding:9px 12px;background:var(--bg3,rgba(255,255,255,0.04));border:0.5px solid var(--border2,rgba(255,255,255,0.1));color:var(--cream,#f0ece0);font-family:var(--font-body);font-size:12px;outline:none;transition:border-color 0.2s;}
        .input-dark:focus{border-color:rgba(212,168,83,0.4);}
        .input-dark::placeholder{color:var(--muted,rgba(255,255,255,0.3));}
        .input-dark.err{border-color:rgba(240,168,184,0.5);}
        input[type="date"].input-dark::-webkit-calendar-picker-indicator{filter:invert(0.6);cursor:pointer;}
        .item-action-btn{display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border-radius:4px;border:none;font-family:var(--font-body);font-size:8px;letter-spacing:0.1em;text-transform:uppercase;cursor:pointer;transition:all 0.2s;}
      `}</style>

      {/* BACKDROP */}
      <div className="fixed inset-0 z-[200]" onClick={closeCart}
        style={{ background:'rgba(0,0,0,0.7)', backdropFilter:'blur(8px)' }} />

      {/* PANEL */}
      <div
        className="cart-panel-bounce fixed top-0 right-0 bottom-0 z-[201] flex flex-col"
        style={{ width:'min(500px,100vw)', background:'var(--bg2,#0e0e0c)', borderLeft:'0.5px solid var(--border,rgba(255,255,255,0.08))', boxShadow:'-20px 0 80px rgba(0,0,0,0.6)' }}
        onMouseEnter={() => setPanelHov(true)}
        onMouseLeave={() => setPanelHov(false)}
      >
        {/* ════ CONFIRMED ════ */}
        {confirmed ? (
          <div className="flex flex-col items-center justify-center flex-1 p-10 text-center">
            <div className="w-16 h-16 flex items-center justify-center mb-7"
              style={{ border:'0.5px solid var(--gold)', color:'var(--gold)', fontSize:'24px' }}>✦</div>
            <h2 className="text-[38px] font-light mb-3 leading-tight" style={{ fontFamily:'var(--font-display)' }}>
              {confirmed.type==='booking'
                ? <>Booking <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Confirmed</em></>
                : <>Inquiry <em style={{ color:'var(--gold)', fontStyle:'italic' }}>Received</em></>}
            </h2>
            <p className="text-[13px] leading-[1.8] mb-6" style={{ color:'var(--muted)' }}>
              {confirmed.type==='booking'
                ? 'Your reservation is secured at Ubuntu Kreative Village. A confirmation will reach you within the hour.'
                : 'Our team will be in touch within 24 hours to curate your experience. Welcome to the village.'}
            </p>
            <div className="text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 mb-8"
              style={{ background:'var(--gold-dim)', border:'0.5px solid rgba(200,168,75,0.3)', color:'var(--gold)', fontFamily:'var(--font-body)' }}>
              Ref # {confirmed.ref}
            </div>
            {confirmed.type==='booking' && payMethod==='mpesa' && (
              <div className="w-full p-4 mb-6 text-left" style={{ background:'var(--bg3)', border:'0.5px solid rgba(200,168,75,0.2)' }}>
                <p className="text-[9px] tracking-[0.18em] uppercase mb-3" style={{ color:'var(--gold)', fontFamily:'var(--font-body)' }}>Complete your M-Pesa payment</p>
                <div className="space-y-1.5">
                  {[['Paybill',MPESA_PAYBILL],['Account',MPESA_ACCOUNT],['Name',MPESA_NAME],['Amount',`KES ${grand.toLocaleString()}`],['Reference',confirmed.ref]].map(([l,v]) => (
                    <div key={l} className="flex justify-between text-[12px]">
                      <span style={{ color:'var(--muted)' }}>{l}</span>
                      <span style={{ color:l==='Paybill'||l==='Account'?'var(--gold2)':'var(--cream)', fontWeight:l==='Paybill'||l==='Account'?500:300, fontFamily:'var(--font-body)' }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className="btn-gold w-full" onClick={resetAndClose}>Back to the Village</button>
          </div>

        ) : step === 'stk_waiting' ? (
          <div className="flex flex-col flex-1 overflow-hidden">
            <div className="flex items-center px-7 py-5 shrink-0" style={{ borderBottom:'0.5px solid var(--border)' }}>
              <h2 className="text-[22px] font-light" style={{ fontFamily:'var(--font-display)' }}>M-Pesa Prompt Sent</h2>
            </div>
            <div className="flex-1 overflow-y-auto">
              <StkWaitingScreen phone={`+${stkPhone}`} amount={grand}
                onSuccess={async () => {
                  setStep('processing')
                  await handleConfirmBooking('booking')
                }}
                onTimeout={() => { toast.error('M-Pesa prompt expired — please try again or use Paybill'); setStep('pay') }}
              />
            </div>
          </div>

        ) : step === 'processing' ? (
          <div className="flex flex-col items-center justify-center flex-1 gap-6 px-8">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 border-2 border-[var(--gold)]/20 rounded-full" />
              <div className="absolute inset-0 border-2 border-transparent border-t-[var(--gold)] rounded-full animate-spin" />
            </div>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em]" style={{ color:'var(--gold)' }}>Confirming Booking…</p>
            <p className="text-[11px] text-center" style={{ color:'var(--muted)' }}>Please do not close this panel</p>
          </div>

        ) : (
          <>
            {/* ── HEADER ── */}
            <div className="flex items-center px-7 py-5 shrink-0" style={{ borderBottom:'0.5px solid var(--border)', gap:8 }}>
              {(step==='details' || step==='pay') && (
                <button onClick={handleBack} className="shrink-0 text-[11px] transition-colors"
                  style={{ color:'var(--muted)', background:'none', border:'0.5px solid rgba(255,255,255,0.08)', cursor:'pointer', padding:'4px 8px', borderRadius:4 }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color='var(--cream)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color='var(--muted)' }}>
                  ← Back
                </button>
              )}
              <h2 className="text-[26px] font-light flex-1" style={{ fontFamily:'var(--font-display)' }}>
                {step==='cart'?'Your Booking':step==='details'?'Your Details':'Payment'}
              </h2>
              {items.length > 0 && step === 'cart' && totalQty > 0 && (
                <span style={{ display:'inline-flex', alignItems:'center', justifyContent:'center', width:24, height:24, borderRadius:'50%', flexShrink:0, background:'var(--gold)', color:'var(--obsidian)', fontSize:'10px', fontWeight:700, fontFamily:'var(--font-body)' }}>
                  {totalQty}
                </span>
              )}
              <button onClick={closeCart} className="text-[20px] leading-none shrink-0"
                style={{ color:'var(--muted)', background:'none', border:'none', cursor:'pointer' }}>✕</button>
            </div>

            {items.length > 0 && <StepBar step={step} />}

            <div className="flex-1 overflow-y-auto" style={{ scrollbarWidth:'none' }}>

              {items.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full px-7 py-16 text-center">
                  <div style={{ fontSize:48, marginBottom:16, opacity:0.3 }}>🛒</div>
                  <p className="text-[26px] font-light mb-2" style={{ fontFamily:'var(--font-display)', color:'var(--muted)' }}>Nothing here yet</p>
                  <p className="text-[12px] leading-[1.7]" style={{ color:'var(--muted)' }}>Browse cottages, spa, farm walks, dining, or events — add anything to build your stay.</p>
                </div>
              )}

              {/* ════ STEP 1 — CART REVIEW ════ */}
              {step === 'cart' && items.length > 0 && (
                <>
                  <div className="px-7 pt-5 pb-3" style={{ borderBottom:'0.5px solid rgba(255,255,255,0.04)' }}>
                    <p className="text-[9px] tracking-[0.18em] uppercase mb-3" style={{ color:'var(--muted)', fontFamily:'var(--font-body)' }}>
                      {roomIds.length > 0 ? 'Stay Dates' : 'Your Dates'}
                    </p>
                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <BlockedDateInput label="Check-in" value={checkIn} onChange={v => setDates(v, checkOut)} roomIds={roomIds} otherDate={checkOut} isArrival />
                      <BlockedDateInput label="Check-out" value={checkOut} onChange={v => setDates(checkIn, v)} min={checkIn||undefined} roomIds={roomIds} otherDate={checkIn} />
                    </div>
                    {roomIds.length > 0 && (
                      <p style={{ fontSize:'8px', color:'rgba(212,168,83,0.5)', fontFamily:'var(--font-body)', letterSpacing:'0.08em', marginBottom:8 }}>
                        ◈ Dates marked unavailable are already reserved for your selected rooms
                      </p>
                    )}
                    <div className="flex items-center gap-2">
                      <label className="text-[9px] tracking-[0.12em] uppercase shrink-0" style={{ color:'var(--muted)', fontFamily:'var(--font-body)' }}>Guests</label>
                      <select className="input-dark flex-1" value={guests} onChange={e => setGuests(Number(e.target.value))}>
                        {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n===1?'guest':'guests'}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="px-7 py-3">
                    {Object.entries(groupedItems).map(([cat, catItems]) => {
                      const meta = CATEGORY_META[cat] || { label:cat, icon:'◈', accent:'var(--gold)' }
                      return (
                        <div key={cat} style={{ marginBottom:20 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, paddingBottom:6, borderBottom:`0.5px solid ${meta.accent}22` }}>
                            <span style={{ fontSize:14 }}>{meta.icon}</span>
                            <span style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.18em', textTransform:'uppercase', color:meta.accent }}>{meta.label}</span>
                            <span style={{ fontFamily:'var(--font-body)', fontSize:'8px', color:'rgba(255,255,255,0.2)', marginLeft:'auto' }}>
                              {catItems.length} line{catItems.length>1?'s':''}
                            </span>
                          </div>

                          {catItems.map(item => {
                            const key      = safeKey(item)
                            const qty      = safeQty(item)
                            const price    = safePrice(item.price)
                            const lineAmt  = price * qty
                            const noteVal  = item.note || ''
                            return (
                              <div key={`${cat}-${key}`} className="py-4" style={{ borderBottom:'0.5px solid rgba(255,255,255,0.04)' }}>
                                <div className="flex gap-3 items-start">
                                  <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'center', gap:6 }}>
                                    <div style={{ width:40, height:40, display:'flex', alignItems:'center', justifyContent:'center', borderRadius:6, background:`${meta.accent}15`, border:`0.5px solid ${meta.accent}30` }}>
                                      <span style={{ fontFamily:'var(--font-display)', fontSize:qty>9?'0.75rem':'1rem', fontWeight:300, color:meta.accent }}>×{qty}</span>
                                    </div>
                                    <QtyControl qty={qty}
                                      onIncrease={() => increaseQty(key)}
                                      onDecrease={() => decreaseQty(key)}
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-[8px] tracking-[0.14em] uppercase mb-0.5" style={{ color:'var(--sage2)', fontFamily:'var(--font-body)' }}>
                                      {item.boardPlan ? `${item.tag} · ${BOARD_PLAN_LABELS[item.boardPlan] ?? item.boardPlan}` : (item.tag || '')}
                                    </p>
                                    <p className="text-[16px] font-light leading-tight mb-1" style={{ fontFamily:'var(--font-display)', wordBreak:'break-word' }}>
                                      {item.name}
                                    </p>
                                    <p className="text-[11px]" style={{ color:'var(--muted)', fontFamily:'var(--font-body)' }}>
                                      {qty > 1
                                        ? <>KES {price.toLocaleString()}<span style={{ color:'rgba(255,255,255,0.3)' }}> × {qty}</span>{item.unit && <span style={{ color:'rgba(255,255,255,0.2)' }}> {item.unit}</span>}</>
                                        : <>KES {price.toLocaleString()}{item.unit && <span style={{ color:'rgba(255,255,255,0.2)' }}> {item.unit}</span>}</>}
                                    </p>
                                  </div>
                                  <div className="flex flex-col items-end gap-2 shrink-0">
                                    <p className="text-[18px] font-light" style={{ fontFamily:'var(--font-display)', color:meta.accent }}>
                                      KES {lineAmt.toLocaleString()}
                                    </p>
                                    {item.sourcePath && (
                                      <button
                                        onClick={() => { closeCart(); router.push(buildEditUrl(item.sourcePath!, item.id)) }}
                                        className="item-action-btn"
                                        style={{ background:'rgba(200,168,75,0.06)', border:'0.5px solid rgba(200,168,75,0.2)', color:'rgba(200,168,75,0.7)' }}
                                        onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(200,168,75,0.14)'; el.style.color='var(--gold)' }}
                                        onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(200,168,75,0.06)'; el.style.color='rgba(200,168,75,0.7)' }}>
                                        ✎ Edit
                                      </button>
                                    )}
                                    <button
                                      onClick={() => { removeItem(key); toast(`${item.name} removed`, { icon:'✕' }) }}
                                      className="item-action-btn"
                                      style={{ background:'rgba(255,80,80,0.06)', border:'0.5px solid rgba(255,80,80,0.18)', color:'rgba(255,130,130,0.7)' }}
                                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,80,80,0.14)'; el.style.color='#ff8080' }}
                                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.background='rgba(255,80,80,0.06)'; el.style.color='rgba(255,130,130,0.7)' }}>
                                      ✕ Remove
                                    </button>
                                  </div>
                                </div>
                                <div className="mt-2 ml-[52px]">
                                  {activeNoteKey === key ? (
                                    <input autoFocus type="text"
                                      placeholder="e.g. Dietary needs, arrival time, special setup…"
                                      value={noteVal}
                                      onChange={e => updateNote(key, e.target.value)}
                                      onBlur={() => setActiveNoteKey(null)}
                                      className="w-full text-[9px] px-3 py-1.5 font-mono outline-none"
                                      style={{ background:'var(--bg3)', border:'0.5px solid rgba(200,168,75,0.25)', color:'var(--cream)' }} />
                                  ) : (
                                    <button onClick={() => setActiveNoteKey(key)}
                                      className="text-[8px] uppercase tracking-wider font-mono"
                                      style={{ color:noteVal?'var(--gold)':'rgba(255,255,255,0.22)', background:'none', border:'none', cursor:'pointer' }}>
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

                  {/* UPSELLS */}
                  {showUpsells && upsells.length > 0 && (
                    <div className="px-7 py-4" style={{ borderTop:'0.5px solid rgba(255,255,255,0.04)', background:'rgba(255,255,255,0.01)' }}>
                      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:12 }}>
                        <div>
                          <p style={{ fontFamily:'var(--font-body)', fontSize:'9px', letterSpacing:'0.18em', textTransform:'uppercase', color:'var(--gold)', marginBottom:2 }}>◈ You might also enjoy</p>
                          <p style={{ fontFamily:'var(--font-body)', fontSize:'10px', color:'rgba(255,255,255,0.3)' }}>Curated to complement your booking</p>
                        </div>
                        <button onClick={() => setShowUpsells(false)} style={{ fontSize:'10px', color:'rgba(255,255,255,0.2)', background:'none', border:'none', cursor:'pointer' }}>Hide</button>
                      </div>
                      {upsells.map(s => <UpsellRow key={s.id} suggestion={s} onAdd={handleAddUpsell} />)}
                    </div>
                  )}

                  {/* TOTALS */}
                  <div className="px-7 py-4" style={{ borderTop:'0.5px solid var(--border)' }}>
                    {[
                      { label:`Subtotal (${totalQty} item${totalQty!==1?'s':''})`, value:`KES ${sub.toLocaleString()}` },
                      { label:'Village service charge (10%)', value:`KES ${svc.toLocaleString()}` },
                      { label:'VAT (16%)', value:`KES ${vatAmt.toLocaleString()}` },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between text-[12px] py-1.5" style={{ color:'var(--muted)' }}>
                        <span>{r.label}</span><span>{r.value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-3.5 mt-1" style={{ borderTop:'0.5px solid var(--border)' }}>
                      <span className="text-[11px] tracking-[0.1em] uppercase" style={{ color:'var(--cream)', fontFamily:'var(--font-body)' }}>Total</span>
                      <span className="text-[28px] font-light" style={{ fontFamily:'var(--font-display)', color:'var(--gold)' }}>
                        <AnimatedTotal value={grand} />
                      </span>
                    </div>
                  </div>
                </>
              )}

              {/* ════ STEP 2 — DETAILS ════ */}
              {step === 'details' && (
                <div className="px-7 py-6 space-y-4 pb-8">
                  <p className="text-[12px] leading-[1.7]" style={{ color:'var(--muted)' }}>Tell us about yourself so we can prepare everything perfectly.</p>
                  <FormField label="Full Name *" error={errs.name}>
                    <input className={`input-dark${errs.name?' err':''}`} placeholder="Jane Kamau" value={name}
                      onChange={e => { setName(e.target.value); clearErr('name') }} />
                  </FormField>
                  <FormField label="Email *" error={errs.email}>
                    <input className={`input-dark${errs.email?' err':''}`} type="email" placeholder="jane@example.com" value={email}
                      onChange={e => { setEmail(e.target.value); clearErr('email') }}
                      onBlur={() => { if (email && !isValidEmail(email)) setErr('email','Enter a valid email address') }} />
                  </FormField>
                  <FormField label="Phone / WhatsApp" error={errs.phone}>
                    <input className={`input-dark${errs.phone?' err':''}`} type="tel" placeholder="0712 345 678" value={phone}
                      onChange={e => { setPhone(e.target.value); clearErr('phone') }}
                      onBlur={() => { if (phone && !isValidPhone(phone)) setErr('phone','Enter a valid Kenyan phone number') }} />
                  </FormField>
                  <FormField label="Special Requests or Notes">
                    <textarea className="input-dark" style={{ minHeight:'90px', resize:'vertical' }} maxLength={500}
                      placeholder="Dietary requirements, accessibility needs, celebration setup, arrival time, allergies…"
                      value={specialReq} onChange={e => setSpecialReq(e.target.value)} />
                    <p style={{ fontSize:'8px', color:'rgba(255,255,255,0.2)', marginTop:3, fontFamily:'var(--font-body)', textAlign:'right' }}>{specialReq.length}/500</p>
                  </FormField>
                </div>
              )}

              {/* ════ STEP 3 — PAYMENT ════ */}
              {step === 'pay' && (
                <div className="px-7 py-5 space-y-5 pb-8">
                  <div className="flex" style={{ borderBottom:'0.5px solid var(--border2)' }}>
                    {([{ key:'pay' as CheckoutTab, label:'Pay Now' },{ key:'inquiry' as CheckoutTab, label:'Send Inquiry' }]).map(t => (
                      <button key={t.key} onClick={() => setTab(t.key)}
                        className="flex-1 py-2.5 text-[9px] tracking-[0.12em] uppercase"
                        style={{ fontFamily:'var(--font-body)', background:'none', border:'none', borderBottom:tab===t.key?'1.5px solid var(--gold)':'1.5px solid transparent', color:tab===t.key?'var(--gold)':'var(--muted)', marginBottom:'-0.5px', cursor:'pointer' }}>
                        {t.label}
                      </button>
                    ))}
                  </div>

                  {tab === 'pay' && (
                    <div className="space-y-4">
                      <div className="px-4 py-3 flex justify-between items-center" style={{ background:'var(--bg3)', border:'0.5px solid var(--border2)' }}>
                        <span className="text-[10px] uppercase tracking-widest" style={{ color:'var(--muted)' }}>Total to pay</span>
                        <span className="text-[22px] font-light" style={{ fontFamily:'var(--font-display)', color:'var(--gold)' }}>KES {grand.toLocaleString()}</span>
                      </div>
                      <div>
                        <p className="text-[9px] tracking-[0.16em] uppercase mb-2" style={{ color:'var(--muted)', fontFamily:'var(--font-body)' }}>Payment Method</p>
                        <div className="grid grid-cols-3 gap-2">
                          {(['mpesa','card','room'] as PayMethod[]).map(m => (
                            <button key={m} onClick={() => { setPayMethod(m); setErrs({}) }}
                              className="py-3 text-[9px] tracking-[0.08em] uppercase"
                              style={{ background:payMethod===m?'var(--gold-dim)':'var(--bg3)', border:payMethod===m?'0.5px solid var(--gold)':'0.5px solid var(--border2)', color:payMethod===m?'var(--gold)':'var(--muted)', fontFamily:'var(--font-body)', cursor:'pointer' }}>
                              {m==='mpesa'?'M-Pesa':m==='card'?'Card':'Room'}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ── M-PESA ── */}
                      {payMethod === 'mpesa' && (
                        <div className="p-4 space-y-3" style={{ background:'var(--bg3)', border:'0.5px solid rgba(200,168,75,0.25)' }}>
                          <p className="text-[9px] tracking-[0.18em] uppercase" style={{ color:'var(--gold)', fontFamily:'var(--font-body)' }}>M-Pesa Express (STK Push)</p>
                          <p className="text-[11px] leading-[1.6]" style={{ color:'var(--muted)' }}>Enter your Safaricom number. You will receive a PIN prompt on your phone.</p>
                          <FormField label="Your M-Pesa Number *" error={errs.mpPhone}>
                            <input className={`input-dark${errs.mpPhone?' err':''}`} type="tel" placeholder="0712 345 678" value={mpPhone}
                              onChange={e => { setMpPhone(e.target.value); clearErr('mpPhone') }}
                              onBlur={() => {
                                if (mpPhone && !isValidPhone(mpPhone)) setErr('mpPhone','Enter a valid Safaricom number (07xx or 01xx)')
                                else if (mpPhone && isValidPhone(mpPhone)) setMpPhone(`+${normalisePhone(mpPhone)}`)
                              }} />
                          </FormField>
                          <details>
                            <summary className="text-[9px] uppercase tracking-widest cursor-pointer list-none" style={{ color:'var(--muted)', fontFamily:'var(--font-body)' }}>Prefer to pay via Paybill? ▾</summary>
                            <div className="mt-3 space-y-1.5 pt-3" style={{ borderTop:'0.5px solid var(--border2)' }}>
                              {[['Go to','M-Pesa → Lipa na M-Pesa → Pay Bill'],['Paybill Number',MPESA_PAYBILL],['Account Number',MPESA_ACCOUNT],['Business Name',MPESA_NAME],['Amount',`KES ${grand.toLocaleString()}`]].map(([k,v]) => (
                                <div key={k} className="flex justify-between">
                                  <span className="text-[10px]" style={{ color:'var(--muted)' }}>{k}</span>
                                  <span className="text-[10px] text-right max-w-[55%]" style={{ color:k==='Paybill Number'||k==='Account Number'?'var(--gold2)':'var(--cream)', fontWeight:k==='Paybill Number'||k==='Account Number'?500:300 }}>{v}</span>
                                </div>
                              ))}
                            </div>
                          </details>
                        </div>
                      )}

                      {/* ── CARD (coming soon) ── */}
                      {payMethod === 'card' && (
                        <div className="p-4" style={{ background:'var(--bg3)', border:'0.5px solid var(--border2)' }}>
                          <p className="text-[9px] tracking-[0.18em] uppercase mb-3" style={{ color:'var(--gold)', fontFamily:'var(--font-body)' }}>
                            Pay by Card
                          </p>
                          <p className="text-[11px] leading-[1.65] mb-4" style={{ color:'var(--muted)' }}>
                            Card payments are coming soon. Please use M-Pesa or Room Charge in the meantime.
                          </p>
                          <p style={{ fontSize:'8px', color:'rgba(255,255,255,0.18)', fontFamily:'var(--font-body)', letterSpacing:'0.06em' }}>
                            🔒 When available: Encrypted · PCI-DSS compliant · Powered by Stripe
                          </p>
                        </div>
                      )}

                      {/* ── ROOM CHARGE ── */}
                      {payMethod === 'room' && (
                        <div className="p-4" style={{ background:'var(--bg3)', border:'0.5px solid var(--border2)' }}>
                          <p className="text-[11px] leading-[1.65]" style={{ color:'var(--muted)' }}>
                            Your booking total will be charged to your room account and settled at checkout. Available to in-house guests only.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {tab === 'inquiry' && (
                    <div className="space-y-4">
                      <p className="text-[12px] leading-[1.7]" style={{ color:'var(--muted)' }}>Send your cart as an inquiry — our team will reach out within 24 hours to tailor your experience.</p>
                      <FormField label="Notes or Special Requests *" error={errs.message}>
                        <textarea className={`input-dark${errs.message?' err':''}`} style={{ minHeight:'90px', resize:'vertical' }} maxLength={500}
                          placeholder="Tell us about your group, any special requirements, or questions…"
                          value={message} onChange={e => { setMessage(e.target.value); clearErr('message') }} />
                        <p style={{ fontSize:'8px', color:'rgba(255,255,255,0.2)', marginTop:3, fontFamily:'var(--font-body)', textAlign:'right' }}>{message.length}/500</p>
                      </FormField>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ── STICKY FOOTER ── */}
            {items.length > 0 && (
              <div className="px-7 py-5 shrink-0 space-y-3" style={{ borderTop:'0.5px solid var(--border)', background:'var(--bg2)' }}>
                {step === 'cart' && (
                  <>
                    <button onClick={() => setStep('details')} className="btn-gold w-full"
                      style={{ padding:'14px 28px', fontSize:'10px', letterSpacing:'0.22em' }}>
                      Continue to Details →
                    </button>
                    <button onClick={() => clearCart()} className="w-full text-center text-[9px] uppercase tracking-widest"
                      style={{ color:'var(--muted)', background:'none', border:'none', cursor:'pointer', fontFamily:'var(--font-body)' }}>
                      Clear cart
                    </button>
                  </>
                )}
                {step === 'details' && (
                  <>
                    <button onClick={() => { if (validateDetails()) setStep('pay') }} className="btn-gold w-full"
                      style={{ padding:'14px 28px', fontSize:'10px', letterSpacing:'0.22em' }}>
                      Continue to Payment →
                    </button>
                    <button onClick={() => { if (validateDetails()) { setTab('inquiry'); setStep('pay') } }} className="btn-outline-cream w-full"
                      style={{ padding:'12px 28px', fontSize:'10px' }}>
                      Send as Inquiry Instead
                    </button>
                  </>
                )}
                {step === 'pay' && tab === 'pay' && payMethod !== 'card' && (
                  <button onClick={handlePayNow} disabled={loading} className="btn-gold w-full"
                    style={{ padding:'14px 28px', fontSize:'10px', letterSpacing:'0.22em', opacity:loading?0.6:1 }}>
                    {loading ? 'Processing…'
                      : payMethod==='mpesa' ? `Send M-Pesa Prompt · KES ${grand.toLocaleString()}`
                      :                      `Confirm Room Charge · KES ${grand.toLocaleString()}`}
                  </button>
                )}
                {step === 'pay' && tab === 'pay' && payMethod === 'card' && (
                  <button disabled className="btn-gold w-full"
                    style={{ padding:'14px 28px', fontSize:'10px', letterSpacing:'0.22em', opacity:0.4, cursor:'not-allowed' }}>
                    Card Payments Coming Soon
                  </button>
                )}
                {step === 'pay' && tab === 'inquiry' && (
                  <button onClick={handleInquiry} disabled={loading} className="btn-gold w-full"
                    style={{ padding:'14px 28px', fontSize:'10px', letterSpacing:'0.22em', opacity:loading?0.6:1 }}>
                    {loading?'Sending…':'Send Inquiry to Ubuntu Team'}
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