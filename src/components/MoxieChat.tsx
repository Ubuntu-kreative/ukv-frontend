'use client';

/**
 * ── MoxieChat ─────────────────────────────────────────────────
 * Floating AI concierge chat bubble + panel.
 * Updated: Added "Predictive Awareness" and Client-side Mounting.
 * ──────────────────────────────────────────────────────────────
 */

import { useState, useRef, useEffect } from 'react'
import { usePathname } from 'next/navigation'

// ── Types ─────────────────────────────────────────────────────
interface Message {
  role: 'moxie' | 'user'
  text: string
  time: string
}

// ── Mock response logic ─────────────────
const RESPONSES: Record<string, string> = {
  steak:
    'Your steak tonight comes from Boma Cattle Unit 3 — Animal ID #UKV-047, raised on our Field A pasture. Processed 48 hours ago. Clean, traceable, entirely ours.',
  spa:
    'Arohamai Spa has 3 open slots today: 2PM Volcanic Mud Ritual, 4PM Forest Massage, and 6PM Botanical Wrap. Shall I reserve one for you?',
  book:
    'Our Pokomo Cottages sleep 2 guests each, and The Farmhouse has two suite options. What dates are you considering? I will check live availability.',
  farm:
    'The farm is live right now. Soil moisture in Field A: 68%. Field B kale is harvest-ready in 3 days. All 24 tracked animals are healthy as of this morning.',
  menu:
    'Tonight\'s menu features farm-sourced goat stew, Field B kale sauté, and our signature African honey dessert. The kitchen opens at 6PM. Shall I reserve a table?',
  hello:
    'Karibu! Welcome to Ubuntu Kreative Village. I have read access to the Farm Log, Restaurant Log, Spa Log, and your Guest Passport. How can I help you today?',
  default:
    'I am Moxie, your Ubuntu AI concierge. I can help with bookings, spa slots, tonight\'s menu, or farm provenance. What would you like to know?',
}

function getMoxieResponse(input: string): string {
  const t = input.toLowerCase()
  if (/steak|beef|cow|animal|meat|provenance/.test(t))   return RESPONSES.steak
  if (/spa|massage|treatment|ritual|mud|botanical/.test(t)) return RESPONSES.spa
  if (/book|reserve|stay|cottage|room|cabin|check/.test(t)) return RESPONSES.book
  if (/farm|crop|field|harvest|soil|livestock/.test(t))  return RESPONSES.farm
  if (/menu|food|eat|restaurant|dinner|lunch/.test(t))   return RESPONSES.menu
  if (/hello|hi|hey|karibu|jambo/.test(t))               return RESPONSES.hello
  return RESPONSES.default
}

// Helper to get time safely on client
function getTime(): string {
  return new Date().toLocaleTimeString('en-KE', {
    hour:   '2-digit',
    minute: '2-digit',
  })
}

// ── Suggested prompts ─────────────────────────────────────────
const SUGGESTIONS = [
  'Is my steak from your farm?',
  'Any spa slots today?',
  "What's on the menu tonight?",
  'Check cottage availability',
]

export default function MoxieChat() {
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])

  const pathname = usePathname()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // ── FIX: Client-Side Mounting ──
  useEffect(() => {
    setMounted(true)
    // Initialize the first message only on client to avoid time mismatch
    setMessages([
      {
        role: 'moxie',
        text: 'Karibu! I am Moxie, your Ubuntu AI concierge. I have access to the Farm Log, Restaurant Log, Spa Log, and Guest Passport. Ask me anything — or try a suggestion below.',
        time: getTime(),
      },
    ])
  }, [])

  // ── Predictive Awareness: Proactive Contextual logic ──
  useEffect(() => {
    if (!mounted || open || messages.length > 1) return;

    const timer = setTimeout(() => {
      let proactiveText = "";
      
      if (pathname.includes('spa')) {
        proactiveText = "The forest air is perfect for a treatment today. Would you like to see our Spa menu?";
      } else if (pathname.includes('cottages')) {
        proactiveText = "I can check which cottages have the best sunrise views for your dates. Shall we?";
      } else if (pathname.includes('restaurant')) {
        proactiveText = "Our chef just updated the specials for tonight. Would you like to see the farm-to-table menu?";
      }

      if (proactiveText) {
        setMessages(prev => [...prev, { role: 'moxie', text: proactiveText, time: getTime() }]);
        setOpen(true);
      }
    }, 20000);

    return () => clearTimeout(timer);
  }, [pathname, open, messages.length, mounted]);

  // Auto-scroll to latest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300)
    }
  }, [open])

  const send = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg) return

    setMessages(prev => [...prev, { role: 'user', text: msg, time: getTime() }])
    setInput('')
    setTyping(true)

    setTimeout(() => {
      setTyping(false)
      setMessages(prev => [
        ...prev,
        {
          role: 'moxie',
          text: getMoxieResponse(msg),
          time: getTime(),
        },
      ])
    }, 1100 + Math.random() * 400)
  }

  // Prevent hydration mismatch by not rendering anything until mounted
  if (!mounted) return null;

  return (
    <>
      {/* ── Chat panel ── */}
      <div
        className="fixed z-[200]"
        style={{
          bottom:        '100px',
          right:         '28px',
          width:         '340px',
          maxHeight:     '520px',
          display:       'flex',
          flexDirection: 'column',
          borderRadius:  '16px',
          overflow:      'hidden',
          background:    'rgba(12,12,12,0.97)',
          border:        '1px solid rgba(0,255,65,0.2)',
          boxShadow:     '0 24px 64px rgba(0,0,0,0.6)',
          opacity:       open ? 1 : 0,
          transform:     open
            ? 'translateY(0) scale(1)'
            : 'translateY(12px) scale(0.97)',
          pointerEvents:  open ? 'all' : 'none',
          transition:    'opacity 0.3s ease, transform 0.3s ease',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 shrink-0"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}
        >
          <div className="flex items-center gap-3">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]"></span>
            </span>
            <div>
              <div
                className="font-body text-[11px] font-bold tracking-[0.12em]"
                style={{ color: 'var(--neon)' }}
              >
                MOXIE
              </div>
              <div
                className="font-body text-[9px]"
                style={{ color: 'rgba(255,255,255,0.3)' }}
              >
                AI Concierge · All 6 logs · JWT aware
              </div>
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="font-body text-[11px] transition-colors duration-200"
            style={{ color: 'rgba(255,255,255,0.3)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--neon)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3"
          style={{ minHeight: 0 }}
        >
          {messages.map((m, i) => (
            <div
              key={i}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className="font-body text-[11px] leading-relaxed px-3 py-2 max-w-[85%]"
                style={{
                  borderRadius: '10px',
                  background:   m.role === 'moxie'
                    ? 'rgba(0,255,65,0.06)'
                    : 'rgba(212,168,83,0.10)',
                  color: m.role === 'moxie'
                    ? 'rgba(255,255,255,0.78)'
                    : 'var(--gold-light)',
                  border: m.role === 'moxie'
                    ? '1px solid rgba(0,255,65,0.14)'
                    : '1px solid rgba(212,168,83,0.2)',
                }}
              >
                {m.text}
              </div>
              <span
                className="font-body text-[8px] mt-1 px-1"
                style={{ color: 'rgba(255,255,255,0.2)' }}
              >
                {m.time}
              </span>
            </div>
          ))}

          {typing && (
            <div className="flex">
              <div
                className="font-body px-3 py-2 text-[13px]"
                style={{
                  borderRadius: '10px',
                  background:   'rgba(0,255,65,0.06)',
                  border:       '1px solid rgba(0,255,65,0.14)',
                  color:        'var(--neon)',
                  letterSpacing:'0.2em',
                }}
              >
                ···
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Suggestions */}
        {messages.length <= 1 && !typing && (
          <div
            className="px-4 pb-3 flex flex-wrap gap-2 shrink-0"
            style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}
          >
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="font-body text-[9px] tracking-wide px-2 py-1 transition-all duration-200"
                style={{
                  borderRadius: '4px',
                  border:       '1px solid rgba(0,255,65,0.2)',
                  color:        'rgba(0,255,65,0.7)',
                  background:   'rgba(0,255,65,0.04)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background   = 'rgba(0,255,65,0.10)'
                  e.currentTarget.style.borderColor  = 'rgba(0,255,65,0.4)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background   = 'rgba(0,255,65,0.04)'
                  e.currentTarget.style.borderColor  = 'rgba(0,255,65,0.2)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div
          className="px-4 py-3 flex gap-2 shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Ask Moxie anything…"
            className="flex-1 font-body text-[11px] px-3 py-2 outline-none"
            style={{
              background:   'rgba(255,255,255,0.04)',
              border:       '1px solid rgba(255,255,255,0.08)',
              borderRadius: '6px',
              color:        'var(--cream)',
            }}
            onFocus={e => (e.currentTarget.style.borderColor = 'rgba(0,255,65,0.3)')}
            onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)')}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim()}
            className="font-body text-[11px] font-bold px-3 py-2 transition-all duration-200"
            style={{
              background:   input.trim() ? 'var(--neon)' : 'rgba(0,255,65,0.2)',
              color:        'var(--obsidian)',
              borderRadius: '6px',
              border:       'none',
              cursor:       input.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            →
          </button>
        </div>
      </div>

      {/* ── Floating bubble ── */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed z-[200] w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-all duration-300"
        style={{
          bottom: '28px',
          right: '28px',
          background: '#0d0c09',
          border: '1px solid rgba(0,255,65,0.3)',
        }}
        aria-label="Open Moxie AI Concierge"
      >
        <div className="relative flex items-center justify-center w-full h-full">
          {!open && (
            <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-[#00FF41] opacity-20"></span>
          )}
          <span
            style={{
              fontFamily: 'var(--font-body)',
              fontSize:   '18px',
              fontWeight: 700,
              color:      '#00FF41',
            }}
          >
            {open ? '✕' : 'M'}
          </span>
        </div>
      </button>
    </>
  )
}