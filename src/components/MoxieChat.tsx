'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Moxie AI Concierge  (production FINAL v2)
//
// KEY FIXES from previous version:
//
// 1. DOUBLE MESSAGES — fixed by NOT using a setState callback to fire the
//    fetch. The previous pattern called setMessages() then launched an async
//    IIFE inside the updater, causing React to run it twice in StrictMode and
//    on fast re-renders. New pattern: build the next state in a local variable,
//    call setMessages(nextState) once, then fire fetch separately.
//
// 2. BOOKING FLOW STATE — moved entirely to the frontend. The edge runtime
//    Map() in route.ts resets on cold starts, which is why steps jumped.
//    Moxie now owns a simple bookingFlow state machine here in the component.
//    When complete, she calls useCartStore.getState().addItem() directly —
//    adding the reservation to the cart just like any other page would.
//
// 3. CART INTEGRATION — completed bookings are added to the cart via
//    useCartStore. Moxie tells the guest and invites them to open the cart
//    to complete checkout (M-Pesa, card, or room charge) using the existing
//    CartPanel flow they already have.
//
// 4. RESPONSE ACCURACY — Moxie no longer falls through to the GPT fallback
//    mid-booking. The flow is handled entirely client-side so there's no
//    state mismatch between edge function invocations.
//
// FULL CAPABILITIES:
//   ✓ Conversational chat via /api/moxie (GPT-4o fallback for general Q&A)
//   ✓ Menu enquiry → booking flow → cart handoff
//   ✓ Spa / cottage / farm / events suggestions
//   ✓ Add to cart: restaurant table reservations
//   ✓ Cart open notification with M-Pesa handoff message
//   ✓ Optimistic UI — single message, no duplicates
//   ✓ Typing indicator
//   ✓ Page-aware suggestions
//   ✓ Time-aware greeting
//   ✓ 18s proactive message per page
//   ✓ Speech bubble preview
//   ✓ Idle attention wave
//   ✓ MoxieAvatar SVG
//   ✓ Session persistence
//   ✓ ESC, auto-scroll, focus
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback, type FormEvent } from 'react'
import { usePathname } from 'next/navigation'

// Cart store — Moxie adds items directly when booking is complete
import { useCartStore } from '@/context/cartStore'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface ChatMessage {
  id:      string
  role:    'user' | 'assistant'
  content: string
  ts:      string
}

// Booking flow steps owned entirely by the frontend
type BookingStep = 'idle' | 'ask_time' | 'ask_guests' | 'ask_name' | 'ask_phone' | 'complete'

interface BookingFlow {
  step:   BookingStep
  time?:  string
  guests?: number
  name?:  string
  phone?: string
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getTime(): string {
  return new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}
function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}
function getSessionId(): string {
  if (typeof window === 'undefined') return makeId()
  const k = 'moxie-session-id'
  let id = sessionStorage.getItem(k)
  if (!id) { id = makeId(); sessionStorage.setItem(k, id) }
  return id
}
function getGreeting(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning ☀️'
  if (h < 18) return 'Good afternoon 🌿'
  return 'Good evening 🌙'
}
function welcomeText(): string {
  return `${getGreeting()} I'm Moxie, your Ubuntu AI concierge. Ask me about the spa, cottages, farm, events, or tonight's menu — or I can help you make a reservation.`
}
function isYes(t: string) {
  return /^(yes|yeah|y|ok|okay|sure|please|yep|yup|absolutely)$/i.test(t.trim())
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE-AWARE CONTENT
// ─────────────────────────────────────────────────────────────────────────────
function getSuggestions(pathname: string): string[] {
  if (pathname.includes('spa'))        return ['What spa treatments are available?', 'Book a mud ritual', 'Couples spa options?', 'Forest massage duration?']
  if (pathname.includes('cottages'))   return ['Which cottage has the best view?', "What's included in the price?", 'Pokomo vs Farmhouse?', 'What meal plans are available?']
  if (pathname.includes('restaurant')) return ["What's on the menu tonight?", 'Is the chicken from your farm?', 'Vegetarian options?', 'Can I book a table?']
  if (pathname.includes('farm'))       return ["What's growing right now?", 'Can I join the farm walk?', 'Beekeeping experience?', 'How does the farm work?']
  if (pathname.includes('events'))     return ['What events are coming up?', 'How do I book a wedding?', 'Corporate retreat packages?', 'New moon fire circle?']
  return ["What's on the menu tonight?", 'Show me the cottage options', 'Any spa slots today?', 'Can I book a table?']
}
function getProactive(pathname: string): string | null {
  const g = getGreeting()
  if (pathname.includes('spa'))        return `${g} The Arohamai Spa has treatments available today. May I help you find the perfect ritual for your stay?`
  if (pathname.includes('cottages'))   return `${g} Each cottage at Ubuntu is named after an African tree — shall I help you find the one that calls to you?`
  if (pathname.includes('restaurant')) return `${g} Our kitchen just updated the specials for tonight. Would you like to know what's fresh from the farm?`
  if (pathname.includes('farm'))       return `${g} The farm is alive right now. Dawn walks, beekeeping, and soil-to-plate tours are all available this week.`
  if (pathname.includes('events'))     return `${g} Ubuntu hosts extraordinary gatherings — from moon circles to village weddings. What brings you here?`
  if (pathname === '/')                return `${g} I'm Moxie, your Ubuntu AI concierge. What shall we plan for your stay?`
  return null
}

// ─────────────────────────────────────────────────────────────────────────────
// MOXIE AVATAR
// ─────────────────────────────────────────────────────────────────────────────
function MoxieAvatar({ waving, pulsing }: { waving: boolean; pulsing: boolean }) {
  return (
    <svg viewBox="0 0 72 96" fill="none" xmlns="http://www.w3.org/2000/svg"
      style={{ width: 72, height: 96, overflow: 'visible', display: 'block' }} aria-hidden="true">
      {pulsing && <ellipse cx="36" cy="88" rx="28" ry="6" fill="rgba(0,255,65,0.18)" style={{ animation: 'moxieGlow 2s ease-in-out infinite' }} />}
      <ellipse cx="36" cy="90" rx="18" ry="4" fill="rgba(0,0,0,0.4)" />
      <path d="M22 58 Q20 72 18 84 Q28 88 36 88 Q44 88 54 84 Q52 72 50 58 Q43 55 36 55 Q29 55 22 58Z" fill="rgba(200,168,75,0.85)" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }} />
      <path d="M30 58 Q36 62 42 58" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
      <rect x="28" y="65" width="16" height="2" rx="1" fill="rgba(0,0,0,0.2)" />
      <path d="M22 60 Q16 66 15 72" stroke="rgba(210,160,100,1)" strokeWidth="5" strokeLinecap="round" style={waving ? { animation: 'moxieWaveLeft 0.6s ease-in-out infinite alternate' } : {}} />
      <circle cx="15" cy="72" r="3" fill="rgba(210,160,100,1)" />
      <path d={waving ? 'M50 60 Q60 50 65 42' : 'M50 60 Q56 66 57 72'} stroke="rgba(210,160,100,1)" strokeWidth="5" strokeLinecap="round" style={{ transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
      <circle cx={waving ? 65 : 57} cy={waving ? 42 : 72} r="3" fill="rgba(210,160,100,1)" style={{ transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }} />
      <rect x="33" y="45" width="6" height="10" rx="3" fill="rgba(210,160,100,1)" />
      <circle cx="36" cy="36" r="16" fill="rgba(210,160,100,1)" style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }} />
      <path d="M20 30 Q18 18 24 12 Q30 6 36 6 Q42 6 48 12 Q54 18 52 30 Q48 22 44 20 Q40 18 36 18 Q32 18 28 20 Q24 22 20 30Z" fill="rgba(40,25,15,0.9)" />
      <path d="M20 30 Q16 34 18 40" stroke="rgba(40,25,15,0.9)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <path d="M52 30 Q56 34 54 40" stroke="rgba(40,25,15,0.9)" strokeWidth="6" strokeLinecap="round" fill="none" />
      <ellipse cx="30" cy="35" rx="2.5" ry="3" fill="rgba(30,20,10,0.9)" />
      <ellipse cx="42" cy="35" rx="2.5" ry="3" fill="rgba(30,20,10,0.9)" />
      <circle cx="31" cy="34" r="0.8" fill="white" opacity="0.8" />
      <circle cx="43" cy="34" r="0.8" fill="white" opacity="0.8" />
      <path d="M30 42 Q36 47 42 42" stroke="rgba(180,100,80,0.9)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M35 38 Q36 40 37 38" stroke="rgba(180,120,80,0.6)" strokeWidth="1" fill="none" />
      <circle cx="20" cy="36" r="2" fill="rgba(200,168,75,0.9)" />
      <circle cx="52" cy="36" r="2" fill="rgba(200,168,75,0.9)" />
      <path d="M21 28 Q18 32 20 36" stroke="rgba(0,255,65,0.7)" strokeWidth="1.5" fill="none" />
      <circle cx="20" cy="37" r="2.5" fill="rgba(0,255,65,0.85)" />
      <path d="M21 28 Q24 20 36 20 Q48 20 51 28" stroke="rgba(60,60,60,0.6)" strokeWidth="1.5" fill="none" />
      <circle cx="56" cy="18" r="4" fill="rgba(0,255,65,0.9)" style={{ filter: 'drop-shadow(0 0 4px #00FF41)' }}>
        <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SPEECH BUBBLE
// ─────────────────────────────────────────────────────────────────────────────
function SpeechBubble({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div style={{ position: 'absolute', bottom: '100%', right: 8, marginBottom: '8px', width: 220, padding: '10px 13px', background: 'rgba(8,7,5,0.97)', border: '0.5px solid rgba(200,168,75,0.35)', borderRadius: '12px 12px 4px 12px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', fontFamily: 'var(--font-body)', fontSize: '11px', lineHeight: 1.65, color: 'rgba(255,255,255,0.75)', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)', transition: 'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)', pointerEvents: visible ? 'all' : 'none', backdropFilter: 'blur(12px)' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)', borderRadius: '12px 12px 0 0' }} />
      <span style={{ color: 'var(--neon, #00FF41)', marginRight: 6, fontSize: '10px' }}>✦</span>
      {text}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CART NOTIFICATION BANNER — shown inside chat after booking is added
// ─────────────────────────────────────────────────────────────────────────────
function CartBanner({ onOpen }: { onOpen: () => void }) {
  return (
    <div style={{ margin: '4px 0', padding: '12px 14px', background: 'rgba(212,168,83,0.08)', border: '0.5px solid rgba(212,168,83,0.3)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
      <div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--gold, #D4A853)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Added to your cart ✓</p>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>Complete checkout to pay via M-Pesa, card, or room charge.</p>
      </div>
      <button
        onClick={onOpen}
        style={{ flexShrink: 0, padding: '7px 14px', background: 'var(--gold, #D4A853)', border: 'none', borderRadius: 6, fontFamily: 'var(--font-body)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#0a0a0a', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'opacity 0.2s' }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '0.85' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}>
        Open Cart →
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function MoxieChat() {
  const pathname = usePathname()

  // ── CART STORE ────────────────────────────────────────────────────────────
  const { openCart } = useCartStore()

  // ── UI STATE ──────────────────────────────────────────────────────────────
  const [mounted,        setMounted]        = useState(false)
  const [open,           setOpen]           = useState(false)
  const [sessionId,      setSessionId]      = useState('')
  const [input,          setInput]          = useState('')
  const [isTyping,       setIsTyping]       = useState(false)
  const [hasGreeted,     setHasGreeted]     = useState(false)
  const [proactiveShown, setProactiveShown] = useState(false)
  const [proactiveText,  setProactiveText]  = useState('')
  const [bubbleVisible,  setBubbleVisible]  = useState(false)
  const [waving,         setWaving]         = useState(false)
  const [showCartBanner, setShowCartBanner] = useState(false)

  // ── BOOKING FLOW STATE (frontend-owned, no edge state) ────────────────────
  const [booking, setBooking] = useState<BookingFlow>({ step: 'idle' })

  // ── MESSAGES ──────────────────────────────────────────────────────────────
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 'welcome', role: 'assistant', content: welcomeText(), ts: getTime() },
  ])

  // ── REFS ──────────────────────────────────────────────────────────────────
  const bottomRef         = useRef<HTMLDivElement>(null)
  const inputRef          = useRef<HTMLInputElement>(null)
  const attentionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── MOUNT ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    setSessionId(getSessionId())
  }, [])

  // ── AUTO-SCROLL ───────────────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping, showCartBanner])

  // ── FOCUS ON OPEN ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setBubbleVisible(false)
      setTimeout(() => inputRef.current?.focus(), 280)
    }
  }, [open])

  // ── ESC ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) setOpen(false) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open])

  // ── PROACTIVE (18s) ───────────────────────────────────────────────────────
  useEffect(() => {
    if (!mounted || open || hasGreeted) return
    const proactive = getProactive(pathname)
    if (!proactive) return
    const t = setTimeout(() => {
      const msg: ChatMessage = { id: makeId(), role: 'assistant', content: proactive, ts: getTime() }
      setMessages(prev => [...prev, msg])
      setProactiveText(proactive)
      setProactiveShown(true)
      setBubbleVisible(true)
      setHasGreeted(true)
      setWaving(true)
      setTimeout(() => setWaving(false), 3200)
      setTimeout(() => setBubbleVisible(false), 9000)
    }, 18000)
    return () => clearTimeout(t)
  }, [pathname, open, mounted, hasGreeted])

  // ── IDLE WAVE ─────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return
    attentionTimerRef.current = setTimeout(() => {
      setWaving(true)
      setTimeout(() => setWaving(false), 2800)
    }, 35000)
    return () => { if (attentionTimerRef.current) clearTimeout(attentionTimerRef.current) }
  }, [open])

  // ── ADD ASSISTANT MESSAGE ─────────────────────────────────────────────────
  const addMsg = useCallback((content: string) => {
    setMessages(prev => [...prev, { id: makeId(), role: 'assistant', content, ts: getTime() }])
  }, [])

  // ─────────────────────────────────────────────────────────────────────────
  // BOOKING FLOW — entirely frontend-owned
  // Steps: idle → ask_time → ask_guests → ask_name → ask_phone → complete
  //
  // When complete: calls useCartStore.addItem() to add the reservation
  // to the cart, then opens the cart panel so the guest can pay.
  // ─────────────────────────────────────────────────────────────────────────
  const handleBookingStep = useCallback((userText: string): boolean => {
    const trimmed = userText.trim()

    // ── Starting a booking ──
    if (booking.step === 'idle') {
      // Triggered by "yes" after Moxie asks about reserving a table
      // or any direct booking intent
      const wantsBooking =
        isYes(trimmed) ||
        /\b(book|reserve|table|reservation)\b/i.test(trimmed)

      if (!wantsBooking) return false // Not a booking trigger — pass to API

      setBooking({ step: 'ask_time' })
      setTimeout(() => addMsg('Perfect 🌿 What time would you like to dine tonight?'), 400)
      return true
    }

    // ── Collecting time ──
    if (booking.step === 'ask_time') {
      const newBooking = { ...booking, step: 'ask_guests' as BookingStep, time: trimmed }
      setBooking(newBooking)
      setTimeout(() => addMsg('Lovely. For how many guests?'), 400)
      return true
    }

    // ── Collecting guests ──
    if (booking.step === 'ask_guests') {
      const n = parseInt(trimmed)
      const guests = isNaN(n) ? 2 : Math.min(Math.max(n, 1), 20)
      const newBooking = { ...booking, step: 'ask_name' as BookingStep, guests }
      setBooking(newBooking)
      setTimeout(() => addMsg(`${guests} guest${guests > 1 ? 's' : ''} — noted. May I have your name?`), 400)
      return true
    }

    // ── Collecting name ──
    if (booking.step === 'ask_name') {
      // Accept the whole text as the name (could be "Emmanuel" or "My name is Emmanuel")
      const name = trimmed
        .replace(/^(my name is|i('m| am)|call me)\s*/i, '')
        .replace(/[^a-zA-Z\s'-]/g, '')
        .trim() || trimmed
      const newBooking = { ...booking, step: 'ask_phone' as BookingStep, name }
      setBooking(newBooking)
      setTimeout(() => addMsg(`Thank you, ${name} 🌿 And your phone number so we can confirm?`), 400)
      return true
    }

    // ── Collecting phone ──
    if (booking.step === 'ask_phone') {
      const phone = trimmed.replace(/\s/g, '')
      const newBooking = { ...booking, step: 'complete' as BookingStep, phone }
      setBooking({ step: 'idle' }) // Reset flow

      // Build the cart item
      const { addItem, openCart: openCartFn } = useCartStore.getState()
      const guests = newBooking.guests || 1
      const itemName = `Restaurant Table — ${newBooking.time}, ${guests} guest${guests > 1 ? 's' : ''}`

      addItem({
        id:       `moxie-table-${makeId()}`,
        name:     itemName,
        price:    0,           // Price confirmed at the restaurant; set to 0 or a cover charge
        tag:      'Dining',
        category: 'restaurant',
        unit:     '/ table',
        qty:      1,
        quantity: 1,
        note:     `Booked via Moxie. Contact: ${phone}`,
      })

      // Show confirmation + cart banner
      const confirmMsg = `You're all set, ${newBooking.name} 🌙\n\nTable for ${guests} at ${newBooking.time} tonight has been added to your cart.\n\nYou can complete the reservation from your cart — pay via M-Pesa, card, or room charge. We'll have everything ready for you.`
      setTimeout(() => {
        addMsg(confirmMsg)
        setShowCartBanner(true)
        // Auto-open cart after a beat
        setTimeout(() => openCartFn(), 1200)
      }, 500)

      return true
    }

    return false
  }, [booking, addMsg])

  // ─────────────────────────────────────────────────────────────────────────
  // CORE SEND
  //
  // 1. Add user message to state once (no duplicates)
  // 2. Check if this is a booking flow step (handled client-side)
  // 3. If not booking → send to /api/moxie for GPT-4o response
  //
  // The key fix for double messages: we build nextMessages as a local
  // const, call setMessages(nextMessages) exactly ONCE, then run the
  // async logic separately — never inside a setState callback.
  // ─────────────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isTyping) return

    setInput('')
    setShowCartBanner(false)

    // 1. Add user message — exactly once
    const userMsg: ChatMessage = { id: makeId(), role: 'user', content: trimmed, ts: getTime() }
    const nextMessages = [...messages, userMsg]
    setMessages(nextMessages)

    // 2. Check if booking flow handles it
    const handledByBooking = handleBookingStep(trimmed)
    if (handledByBooking) return

    // 3. Check for booking trigger words that start the flow
    // (handled here before API so we don't waste a round-trip)
    const menuTrigger    = /\b(menu|food|eat|tonight|dish|dining)\b/i.test(trimmed)
    const bookingTrigger = /\b(book|reserve|table|reservation)\b/i.test(trimmed)

    if (bookingTrigger && booking.step === 'idle') {
      setBooking({ step: 'ask_time' })
      setTimeout(() => addMsg('Of course 🌿 What time would you like to dine tonight?'), 400)
      return
    }

    // 4. Send to /api/moxie for all other queries
    setIsTyping(true)
    try {
      const res = await fetch('/api/moxie', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          messages: nextMessages.map(m => ({ role: m.role, content: m.content })),
          sessionId,
          pathname,
        }),
      })

      if (!res.ok) throw new Error(`HTTP ${res.status}`)

      const data = await res.json()
      const reply: string =
        typeof data.content === 'string' && data.content.trim()
          ? data.content
          : "I'm here to help 🌿 Ask me about the menu, spa, cottages, farm, or events — or say 'book a table' to make a reservation."

      // If the API response asks about a table reservation, prime the flow
      const apiWantsToBook = /reserve a table|book a table|shall i reserve/i.test(reply)

      addMsg(reply)

      // If menu query and API replied — prime booking step so next "yes" works
      if (menuTrigger || apiWantsToBook) {
        setBooking({ step: 'idle' }) // Will catch next "yes" as booking trigger
      }

    } catch (err) {
      console.error('[Moxie] fetch error:', err)
      addMsg("I'm having a small hiccup — please try again in a moment 🌿 Or reach us at hello@ubuntuecolodge.com")
    } finally {
      setIsTyping(false)
    }
  }, [isTyping, messages, sessionId, pathname, booking, handleBookingStep, addMsg])

  // ── FORM SUBMIT ───────────────────────────────────────────────────────────
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    sendMessage(input)
  }, [input, sendMessage])

  // ── ENTER KEY ─────────────────────────────────────────────────────────────
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(input) }
  }, [input, sendMessage])

  // ── SUGGESTION ────────────────────────────────────────────────────────────
  const sendSuggestion = useCallback((text: string) => { sendMessage(text) }, [sendMessage])

  if (!mounted) return null

  const suggestions     = getSuggestions(pathname)
  const showSuggestions = messages.length <= 2 && !isTyping

  // Booking step prompt so the guest knows what to type
  const bookingHint: Record<BookingStep, string> = {
    idle:       '',
    ask_time:   'e.g. 7:30 PM',
    ask_guests: 'e.g. 2',
    ask_name:   'Your name',
    ask_phone:  'e.g. 0712 345 678',
    complete:   '',
  }
  const inputPlaceholder = booking.step !== 'idle'
    ? bookingHint[booking.step] || 'Reply to Moxie…'
    : 'Ask Moxie anything…'

  return (
    <>
      {/* ══════════════════════════════════════════════════════════
          CHAT PANEL
      ══════════════════════════════════════════════════════════ */}
      <div
        aria-label="Moxie AI Concierge"
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed', zIndex: 200, bottom: '110px', right: '24px',
          width: 'min(390px, calc(100vw - 36px))', maxHeight: '600px',
          display: 'flex', flexDirection: 'column', overflow: 'hidden',
          background: 'rgba(8,7,5,0.97)',
          border: '0.5px solid rgba(200,168,75,0.22)',
          boxShadow: '0 40px 100px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(200,168,75,0.07), inset 0 1px 0 rgba(255,255,255,0.04)',
          backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)',
          opacity: open ? 1 : 0,
          transform: open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          pointerEvents: open ? 'all' : 'none',
          transition: 'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Top accent */}
        <div style={{ height: '1px', background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.55) 40%, rgba(0,255,65,0.35) 70%, transparent)', flexShrink: 0 }} />

        {/* ── HEADER ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '0.5px solid rgba(255,255,255,0.05)', flexShrink: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.25), rgba(0,0,0,0.1))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
              <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle at 38% 38%, rgba(100,255,130,0.4), rgba(0,180,60,0.18) 55%, rgba(3,10,3,0.92))', boxShadow: '0 0 14px rgba(0,255,65,0.18)', border: '0.5px solid rgba(0,255,65,0.28)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-body)', fontSize: '13px', fontWeight: 700, color: '#00FF41' }}>M</div>
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--neon, #00FF41)', lineHeight: 1, marginBottom: '3px' }}>Moxie</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', flexShrink: 0, background: '#00FF41', boxShadow: '0 0 5px rgba(0,255,65,0.7)' }} />
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.09em', color: 'rgba(255,255,255,0.28)' }}>
                  {isTyping ? 'Moxie is typing…'
                    : booking.step !== 'idle' ? 'Taking your reservation…'
                    : 'AI Concierge · Live'}
                </span>
              </div>
            </div>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close Moxie"
            style={{ width: 28, height: 28, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: 11, transition: 'all 0.2s' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)' }}>
            ✕
          </button>
        </div>

        {/* ── BOOKING PROGRESS ── */}
        {booking.step !== 'idle' && (
          <div style={{ padding: '8px 16px', background: 'rgba(212,168,83,0.06)', borderBottom: '0.5px solid rgba(212,168,83,0.15)', display: 'flex', gap: 6, alignItems: 'center', flexShrink: 0 }}>
            {(['ask_time', 'ask_guests', 'ask_name', 'ask_phone'] as BookingStep[]).map((s, i) => {
              const steps: BookingStep[] = ['ask_time', 'ask_guests', 'ask_name', 'ask_phone']
              const ci = steps.indexOf(booking.step)
              const done = i < ci; const active = i === ci
              return (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 4, flex: 1 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: done ? 'var(--gold, #D4A853)' : active ? 'rgba(212,168,83,0.8)' : 'rgba(255,255,255,0.12)', transition: 'background 0.3s' }} />
                  {i < 3 && <div style={{ flex: 1, height: '0.5px', background: done ? 'rgba(212,168,83,0.5)' : 'rgba(255,255,255,0.08)' }} />}
                </div>
              )
            })}
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(212,168,83,0.6)', marginLeft: 4, whiteSpace: 'nowrap' }}>
              Reserving
            </span>
          </div>
        )}

        {/* ── MESSAGES ── */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '14px 13px', display: 'flex', flexDirection: 'column', gap: '9px', minHeight: 0, scrollbarWidth: 'none' }}>
          {messages.map(m => (
            <div key={m.id} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', animation: 'moxieMsgIn 0.28s cubic-bezier(0.16,1,0.3,1)' }}>
              <div style={{
                maxWidth: '84%', padding: '9px 13px',
                fontFamily: 'var(--font-body)', fontSize: '12px', lineHeight: 1.8,
                borderRadius: m.role === 'assistant' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                background:   m.role === 'assistant' ? 'rgba(0,255,65,0.05)'    : 'rgba(200,168,75,0.11)',
                color:        m.role === 'assistant' ? 'rgba(255,255,255,0.82)' : 'rgba(255,255,255,0.9)',
                border:       m.role === 'assistant' ? '0.5px solid rgba(0,255,65,0.14)' : '0.5px solid rgba(200,168,75,0.22)',
                boxShadow: '0 2px 10px rgba(0,0,0,0.28)', wordBreak: 'break-word', whiteSpace: 'pre-wrap',
              }}>
                {m.content}
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '7.5px', color: 'rgba(255,255,255,0.17)', marginTop: '3px', paddingLeft: m.role === 'assistant' ? '4px' : 0, paddingRight: m.role === 'user' ? '4px' : 0, letterSpacing: '0.04em' }}>
                {m.ts}
              </span>
            </div>
          ))}

          {/* Typing dots */}
          {isTyping && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', animation: 'moxieMsgIn 0.28s cubic-bezier(0.16,1,0.3,1)' }}>
              <div style={{ padding: '11px 16px', borderRadius: '4px 14px 14px 14px', background: 'rgba(0,255,65,0.05)', border: '0.5px solid rgba(0,255,65,0.14)', display: 'flex', alignItems: 'center', gap: '5px' }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{ width: 6, height: 6, borderRadius: '50%', background: 'rgba(0,255,65,0.65)', animation: `moxieDot 1.2s ease-in-out ${i * 0.18}s infinite` }} />
                ))}
              </div>
            </div>
          )}

          {/* Cart banner — shown after booking added to cart */}
          {showCartBanner && (
            <CartBanner onOpen={() => { setOpen(false); openCart() }} />
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── SUGGESTION CHIPS ── */}
        {showSuggestions && (
          <div style={{ padding: '9px 13px', display: 'flex', flexWrap: 'wrap', gap: '5px', borderTop: '0.5px solid rgba(255,255,255,0.04)', flexShrink: 0, background: 'rgba(0,0,0,0.12)' }}>
            <span style={{ width: '100%', fontFamily: 'var(--font-body)', fontSize: '7.5px', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.18)', marginBottom: '2px' }}>Suggestions</span>
            {suggestions.map((s, i) => (
              <button key={s} onClick={() => sendSuggestion(s)} disabled={isTyping}
                style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.03em', padding: '5px 10px', border: '0.5px solid rgba(0,255,65,0.2)', borderRadius: '20px', background: 'rgba(0,255,65,0.04)', color: 'rgba(0,255,65,0.6)', cursor: isTyping ? 'not-allowed' : 'pointer', transition: 'all 0.18s', whiteSpace: 'nowrap', opacity: isTyping ? 0.45 : 1, lineHeight: 1.3, animation: `moxieMsgIn 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.06}s both` }}
                onMouseEnter={e => { if (!isTyping) { e.currentTarget.style.background = 'rgba(0,255,65,0.1)'; e.currentTarget.style.borderColor = 'rgba(0,255,65,0.4)'; e.currentTarget.style.color = 'rgba(0,255,65,0.9)' } }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,255,65,0.04)'; e.currentTarget.style.borderColor = 'rgba(0,255,65,0.2)'; e.currentTarget.style.color = 'rgba(0,255,65,0.6)' }}>
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── INPUT ROW ── */}
        <form onSubmit={onSubmit} style={{ padding: '11px 13px', display: 'flex', gap: '7px', borderTop: '0.5px solid rgba(255,255,255,0.06)', flexShrink: 0, background: 'rgba(0,0,0,0.15)' }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={inputPlaceholder}
            disabled={isTyping}
            aria-label="Message Moxie"
            style={{ flex: 1, fontFamily: 'var(--font-body)', fontSize: '12px', padding: '9px 12px', background: 'rgba(255,255,255,0.04)', border: `0.5px solid ${booking.step !== 'idle' ? 'rgba(212,168,83,0.25)' : 'rgba(255,255,255,0.08)'}`, borderRadius: '8px', color: 'var(--cream, #f0ece0)', outline: 'none', transition: 'border-color 0.2s', opacity: isTyping ? 0.6 : 1 }}
            onFocus={e => { e.target.style.borderColor = booking.step !== 'idle' ? 'rgba(212,168,83,0.5)' : 'rgba(0,255,65,0.35)' }}
            onBlur={e  => { e.target.style.borderColor = booking.step !== 'idle' ? 'rgba(212,168,83,0.25)' : 'rgba(255,255,255,0.08)' }}
          />
          <button type="submit" disabled={!input.trim() || isTyping} aria-label="Send message"
            style={{ width: 36, height: 36, flexShrink: 0, borderRadius: '8px', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, cursor: input.trim() && !isTyping ? 'pointer' : 'not-allowed', background: input.trim() && !isTyping ? (booking.step !== 'idle' ? 'linear-gradient(135deg, #D4A853, #c49840)' : 'linear-gradient(135deg, #00FF41, #00cc33)') : 'rgba(0,255,65,0.1)', color: input.trim() && !isTyping ? '#0a0a0a' : 'rgba(0,255,65,0.3)', transition: 'all 0.2s', boxShadow: input.trim() && !isTyping ? '0 2px 10px rgba(0,255,65,0.28)' : 'none' }}>
            {isTyping
              ? <div style={{ width: 13, height: 13, border: '2px solid rgba(0,255,65,0.3)', borderTop: '2px solid rgba(0,255,65,0.8)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
              : booking.step !== 'idle' ? '✓' : '→'}
          </button>
        </form>

        {/* Badge */}
        <div style={{ padding: '5px 13px', display: 'flex', justifyContent: 'center', background: 'rgba(0,0,0,0.2)', flexShrink: 0 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.12em', color: 'rgba(255,255,255,0.1)', textTransform: 'uppercase' }}>
            Ubuntu AI · GPT-4o · Memory enabled
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          LAUNCHER
      ══════════════════════════════════════════════════════════ */}
      <div style={{ position: 'fixed', zIndex: 200, bottom: '16px', right: '20px', width: 80, display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        {proactiveText && <SpeechBubble text={proactiveText} visible={bubbleVisible && !open} />}
        <button
          onClick={() => setOpen(prev => !prev)}
          aria-label={open ? 'Close Moxie' : 'Open Moxie AI Concierge'}
          className="moxie-bubble"
          style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', outline: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', animation: !open ? 'moxieBreathe 3.5s ease-in-out infinite' : 'none', transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)', transform: open ? 'scale(0.88)' : 'scale(1)' }}
          onMouseEnter={e => { if (!open) e.currentTarget.style.transform = 'scale(1.07)' }}
          onMouseLeave={e => { if (!open) e.currentTarget.style.transform = 'scale(1)' }}>
          <MoxieAvatar waving={waving} pulsing={proactiveShown && !open} />
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.2em', textTransform: 'uppercase', color: open ? 'rgba(200,168,75,0.5)' : 'rgba(0,255,65,0.65)', background: 'rgba(8,7,5,0.85)', border: `0.5px solid ${open ? 'rgba(200,168,75,0.2)' : 'rgba(0,255,65,0.2)'}`, padding: '2px 8px', borderRadius: '10px', transition: 'all 0.25s', backdropFilter: 'blur(8px)' }}>
            {open ? 'close' : 'Moxie'}
          </div>
        </button>
      </div>

      {/* ── KEYFRAMES ── */}
      <style suppressHydrationWarning>{`
        @keyframes moxieGlow    { 0%,100%{opacity:.5;transform:scaleX(1)} 50%{opacity:1;transform:scaleX(1.15)} }
        @keyframes moxieBreathe { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-4px)} }
        @keyframes moxieWaveLeft{ 0%{transform:rotate(0deg)} 100%{transform:rotate(-20deg)} }
        @keyframes moxieDot     { 0%,60%,100%{transform:translateY(0);opacity:.4} 30%{transform:translateY(-5px);opacity:1} }
        @keyframes moxieMsgIn   { from{opacity:0;transform:translateY(8px) scale(0.97)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin         { to{transform:rotate(360deg)} }
        .moxie-bubble:active    { transform:scale(0.88) !important }
      `}</style>
    </>
  )
}