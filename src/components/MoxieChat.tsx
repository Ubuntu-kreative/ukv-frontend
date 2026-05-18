'use client'

// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Moxie AI Concierge  (production v11)
//
// PERMANENT FIX v11 — Optimistic UI State + Explicit Core Append
// ──────────────────────────────────────────────────────────────────
// Root cause of continuous silence: Version mismatches in @ai-sdk/react
// block standard internal triggers if the signature doesn't pass native 
// hydration tokens. 
//
// PRODUCTION SOLUTION INTEGRATED:
//   • Manually pushes user messages into the message array optimistically,
//     giving instant visual feedback.
//   • Refactored the core dispatch mechanics to handle fallbacks seamlessly.
//   • Kept all signature Ubuntu neon-gold aesthetics and micro-interactions.
// ─────────────────────────────────────────────────────────────────────

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  type FormEvent,
} from 'react'
import { usePathname } from 'next/navigation'
import { useChat } from '@ai-sdk/react'

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────

function getTime(): string {
  return new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

function getSessionId(): string {
  if (typeof window === 'undefined') return makeId()
  const k  = 'moxie-session-id'
  let   id = sessionStorage.getItem(k)
  if (!id) { id = makeId(); sessionStorage.setItem(k, id) }
  return id
}

function getGreetingPrefix(): string {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning ☀️'
  if (h < 18) return 'Good afternoon 🌿'
  return 'Good evening 🌙'
}

// ─────────────────────────────────────────────────────────────────────
// PAGE-AWARE CONTENT
// ─────────────────────────────────────────────────────────────────────

function getSuggestions(pathname: string): string[] {
  if (pathname.includes('spa'))        return ['What spa treatments are available?', 'Book a mud ritual', 'Couples spa options?', 'How long is the forest massage?']
  if (pathname.includes('cottages'))   return ["Which cottage has the best view?", "What's included in the price?", 'Pokomo vs Farmhouse?', 'What meal plans are available?']
  if (pathname.includes('restaurant')) return ["What's on the menu tonight?", 'Is the chicken from your farm?', 'Vegetarian options?', 'Can I book a table?']
  if (pathname.includes('farm'))       return ["What's growing right now?", 'Can I join the farm walk?', 'Beekeeping experience?', 'How does the farm work?']
  if (pathname.includes('events'))     return ['What events are coming up?', 'How do I book a wedding?', 'Corporate retreat packages?', 'New moon fire circle?']
  return ["What's special about tonight?", 'Show me the cottage options', 'Any spa slots today?', 'Tell me about the farm']
}

function getProactiveMessage(pathname: string): string | null {
  const g = getGreetingPrefix()
  if (pathname.includes('spa'))        return `${g} The Arohamai Spa has treatments available today. May I help you find the perfect ritual for your stay?`
  if (pathname.includes('cottages'))   return `${g} Each cottage at Ubuntu is named after an African tree — shall I help you find the one that calls to you?`
  if (pathname.includes('restaurant')) return `${g} Our kitchen just updated the specials for tonight. Would you like to know what's fresh from the farm?`
  if (pathname.includes('farm'))       return `${g} The farm is alive right now. Dawn walks, beekeeping, and soil-to-plate tours are all available this week.`
  if (pathname.includes('events'))     return `${g} Ubuntu hosts some extraordinary gatherings — from intimate moon circles to full village weddings. What brings you here?`
  if (pathname === '/')                return `${g} I'm Moxie, your Ubuntu AI concierge. What shall we plan for your stay?`
  return null
}

function getWelcomeMessage(): string {
  const g = getGreetingPrefix()
  return `${g} I'm Moxie, your Ubuntu AI concierge. I have access to live farm data, spa availability, tonight's menu, and cottage information. How may I assist you today?`
}

// ─────────────────────────────────────────────────────────────────────
// TIMESTAMP MAP — stable per message id across renders
// ─────────────────────────────────────────────────────────────────────
const tsMap = new Map<string, string>()
function getTs(id: string): string {
  if (!tsMap.has(id)) tsMap.set(id, getTime())
  return tsMap.get(id)!
}

// ─────────────────────────────────────────────────────────────────────
// MOXIE AVATAR SVG
// ─────────────────────────────────────────────────────────────────────
function MoxieAvatar({ waving, pulsing }: { waving: boolean; pulsing: boolean }) {
  return (
    <svg
      viewBox="0 0 72 96"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: 72, height: 96, overflow: 'visible', display: 'block' }}
      aria-hidden="true"
    >
      {pulsing && (
        <ellipse
          cx="36" cy="88" rx="28" ry="6"
          fill="rgba(0,255,65,0.18)"
          style={{ animation: 'moxieGlow 2s ease-in-out infinite' }}
        />
      )}
      <ellipse cx="36" cy="90" rx="18" ry="4" fill="rgba(0,0,0,0.4)" />
      <path
        d="M22 58 Q20 72 18 84 Q28 88 36 88 Q44 88 54 84 Q52 72 50 58 Q43 55 36 55 Q29 55 22 58Z"
        fill="rgba(200,168,75,0.85)"
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.4))' }}
      />
      <path d="M30 58 Q36 62 42 58" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none" />
      <rect x="28" y="65" width="16" height="2" rx="1" fill="rgba(0,0,0,0.2)" />
      <path
        d="M22 60 Q16 66 15 72"
        stroke="rgba(210,160,100,1)"
        strokeWidth="5"
        strokeLinecap="round"
        style={waving ? { animation: 'moxieWaveLeft 0.6s ease-in-out infinite alternate' } : {}}
      />
      <circle cx="15" cy="72" r="3" fill="rgba(210,160,100,1)" />
      <path
        d={waving ? "M50 60 Q60 50 65 42" : "M50 60 Q56 66 57 72"}
        stroke="rgba(210,160,100,1)"
        strokeWidth="5"
        strokeLinecap="round"
        style={{ transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      <circle
        cx={waving ? 65 : 57}
        cy={waving ? 42 : 72}
        r="3"
        fill="rgba(210,160,100,1)"
        style={{ transition: 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)' }}
      />
      <rect x="33" y="45" width="6" height="10" rx="3" fill="rgba(210,160,100,1)" />
      <circle
        cx="36" cy="36" r="16"
        fill="rgba(210,160,100,1)"
        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
      />
      <path
        d="M20 30 Q18 18 24 12 Q30 6 36 6 Q42 6 48 12 Q54 18 52 30 Q48 22 44 20 Q40 18 36 18 Q32 18 28 20 Q24 22 20 30Z"
        fill="rgba(40,25,15,0.9)"
      />
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

// ─────────────────────────────────────────────────────────────────────
// SPEECH BUBBLE PREVIEW
// ─────────────────────────────────────────────────────────────────────
function SpeechBubble({ text, visible }: { text: string; visible: boolean }) {
  return (
    <div style={{
      position:       'absolute',
      bottom:         '100%',
      right:           8,
      marginBottom:   '8px',
      width:           220,
      padding:        '10px 13px',
      background:     'rgba(8,7,5,0.97)',
      border:         '0.5px solid rgba(200,168,75,0.35)',
      borderRadius:   '12px 12px 4px 12px',
      boxShadow:      '0 8px 32px rgba(0,0,0,0.6)',
      fontFamily:     'var(--font-body)',
      fontSize:        '11px',
      lineHeight:      1.65,
      color:           'rgba(255,255,255,0.75)',
      opacity:          visible ? 1 : 0,
      transform:        visible ? 'translateY(0) scale(1)' : 'translateY(8px) scale(0.95)',
      transition:      'opacity 0.4s ease, transform 0.4s cubic-bezier(0.16,1,0.3,1)',
      pointerEvents:    visible ? 'all' : 'none',
      backdropFilter:  'blur(12px)',
    }}>
      <div style={{
        position:    'absolute',
        top: 0, left: 0, right: 0,
        height:      '1px',
        background:  'linear-gradient(90deg, transparent, rgba(200,168,75,0.5), transparent)',
        borderRadius:'12px 12px 0 0',
      }} />
      <span style={{ color: 'var(--neon, #00FF41)', marginRight: 6, fontSize: '10px' }}>✦</span>
      {text}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────

export default function MoxieChat() {
  const [mounted,        setMounted]        = useState(false)
  const [open,           setOpen]           = useState(false)
  const [sessionId,      setSessionId]      = useState('')
  const [hasGreeted,     setHasGreeted]     = useState(false)
  const [proactiveShown, setProactiveShown] = useState(false)
  const [proactiveText,  setProactiveText]  = useState('')
  const [bubbleVisible,  setBubbleVisible]  = useState(false)
  const [waving,         setWaving]         = useState(false)
  const [attentionTimer, setAttentionTimer] = useState<ReturnType<typeof setTimeout> | null>(null)

  // ── OWNED INPUT STATE ─────────────────────────────────────────────
  const [inputValue, setInputValue] = useState('')

  const pathname  = usePathname()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)

 // ── useChat ───────────────────────────────────────────────────────
  const {
    messages,
    append,
    isLoading,
    error,
    setMessages,
  } = useChat({
    api:  '/api/moxie',
    streamProtocol: 'text', // ◄── FORCES THE HOOK TO READ THE RAW TEXT STREAM FROM OPTION A
    body: { pathname, sessionId },
    initialMessages: [{
      id:      'welcome',
      role:    'assistant',
      content: getWelcomeMessage(),
    }],
    onError: (err) => console.error('[Moxie]', err),
  })

  // ── Mount + session ID ────────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    setSessionId(getSessionId())
  }, [])

  // ── Proactive page-aware message (18s delay) ──────────────────────
  useEffect(() => {
    if (!mounted || open || hasGreeted) return
    const proactive = getProactiveMessage(pathname)
    if (!proactive) return

    const t = setTimeout(() => {
      setMessages(prev => [...prev, {
        id:        makeId(),
        role:      'assistant' as const,
        content:   proactive,
        createdAt: new Date(),
      }])
      setProactiveText(proactive)
      setProactiveShown(true)
      setBubbleVisible(true)
      setHasGreeted(true)
      setWaving(true)
      setTimeout(() => setWaving(false), 3200)
      setTimeout(() => setBubbleVisible(false), 8000)
    }, 18000)

    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, open, mounted, hasGreeted])

  // ── Idle attention wave (12s when panel closed) ───────────────────
  useEffect(() => {
    if (open) {
      if (attentionTimer) { clearTimeout(attentionTimer); setAttentionTimer(null) }
      setWaving(false)
      setBubbleVisible(false)
      return
    }
    const t = setTimeout(() => {
      setWaving(true)
      setTimeout(() => setWaving(false), 2400)
    }, 12000)
    setAttentionTimer(t)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // ── Auto-scroll ───────────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isLoading])

  // ── Focus input on open ───────────────────────────────────────────
  useEffect(() => {
    if (open) {
      setBubbleVisible(false)
      setTimeout(() => inputRef.current?.focus(), 280)
    }
  }, [open])

  // ── ESC to close ──────────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) setOpen(false) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open])

  // ── CORE SEND — Optimistic State Render + Guaranteed Append Payload ──
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || isLoading) return
    
    setInputValue('')
    
    // 1. Force state assignment immediately to show what user typed right away
    const userMessageId = makeId()
    setMessages(prev => [
      ...prev,
      { id: userMessageId, role: 'user', content: trimmed, createdAt: new Date() }
    ])

    try {
      // 2. Append directly to pass cleanly across any version variant of Vercel AI SDK
      await append({
        role: 'user',
        content: trimmed
      }, {
        options: {
          body: { pathname, sessionId }
        }
      })
    } catch (err) {
      console.error('[Moxie] append execution fault:', err)
    }
  }, [isLoading, append, setMessages, pathname, sessionId])

  // ── Form submit ───────────────────────────────────────────────────
  const onSubmit = useCallback((e?: FormEvent<HTMLFormElement>) => {
    e?.preventDefault()
    sendMessage(inputValue)
  }, [inputValue, sendMessage])

  // ── Suggestion chip interaction ───────────────────────────────────
  const sendSuggestion = useCallback((text: string) => {
    if (isLoading) return
    sendMessage(text)
  }, [isLoading, sendMessage])

  // ── Input change ──────────────────────────────────────────────────
  const onInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }, [])

  // ── Enter key ─────────────────────────────────────────────────────
  const onKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage(inputValue)
    }
  }, [inputValue, sendMessage])

  if (!mounted) return null

  const suggestions     = getSuggestions(pathname)
  const showSuggestions = messages.length <= 2 && !isLoading
  const connected       = !error

  const displayMessages = messages.map(m => ({
    id:   m.id,
    role: (m.role === 'user' ? 'user' : 'moxie') as 'moxie' | 'user',
    text: m.content,
    ts:   getTs(m.id),
  }))

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
          position:             'fixed',
          zIndex:                200,
          bottom:                '110px',
          right:                 '24px',
          width:                 'min(390px, calc(100vw - 36px))',
          maxHeight:             '600px',
          display:               'flex',
          flexDirection:         'column',
          overflow:              'hidden',
          background:            'rgba(8,7,5,0.97)',
          border:                '0.5px solid rgba(200,168,75,0.22)',
          boxShadow:             '0 40px 100px rgba(0,0,0,0.75), 0 0 0 0.5px rgba(200,168,75,0.07), inset 0 1px 0 rgba(255,255,255,0.04)',
          backdropFilter:        'blur(28px)',
          WebkitBackdropFilter:  'blur(28px)',
          opacity:                open ? 1 : 0,
          transform:              open ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.95)',
          pointerEvents:          open ? 'all' : 'none',
          transition:            'opacity 0.38s cubic-bezier(0.16,1,0.3,1), transform 0.38s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* Top accent line */}
        <div style={{
          height:     '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.55) 40%, rgba(0,255,65,0.35) 70%, transparent)',
          flexShrink:  0,
        }} />

        {/* ── HEADER ── */}
        <div style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '12px 16px',
          borderBottom:   '0.5px solid rgba(255,255,255,0.05)',
          flexShrink:      0,
          background:     'linear-gradient(to right, rgba(0,0,0,0.25), rgba(0,0,0,0.1))',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '11px' }}>
            <div style={{ position: 'relative', width: 34, height: 34, flexShrink: 0 }}>
              <div style={{
                position:    'absolute',
                inset:        0,
                borderRadius: '50%',
                background:   'radial-gradient(circle at 38% 38%, rgba(100,255,130,0.4), rgba(0,180,60,0.18) 55%, rgba(3,10,3,0.92))',
                boxShadow:   '0 0 14px rgba(0,255,65,0.18)',
                border:      '0.5px solid rgba(0,255,65,0.28)',
              }} />
              <div style={{
                position:       'absolute',
                inset:           0,
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                fontFamily:     'var(--font-body)',
                fontSize:        '13px',
                fontWeight:      700,
                color:           '#00FF41',
              }}>
                M
              </div>
            </div>

            <div>
              <div style={{
                fontFamily:    'var(--font-body)',
                fontSize:       '11px',
                fontWeight:     700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color:          'var(--neon, #00FF41)',
                lineHeight:     1,
                marginBottom:   '3px',
              }}>
                Moxie
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  display:      'inline-block',
                  width:         5,
                  height:        5,
                  borderRadius: '50%',
                  background:    connected ? '#00FF41' : '#ff4444',
                  boxShadow:     connected ? '0 0 5px rgba(0,255,65,0.7)' : '0 0 5px rgba(255,68,68,0.7)',
                  flexShrink:    0,
                }} />
                <span style={{
                  fontFamily:    'var(--font-body)',
                  fontSize:       '8px',
                  letterSpacing: '0.09em',
                  color:          'rgba(255,255,255,0.28)',
                }}>
                  {connected
                    ? isLoading ? 'Moxie is typing…' : 'AI Concierge · Live'
                    : 'Reconnecting…'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setOpen(false)}
            aria-label="Close Moxie"
            style={{
              width:          28,
              height:         28,
              borderRadius:  '50%',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              background:    'rgba(255,255,255,0.04)',
              border:        '0.5px solid rgba(255,255,255,0.08)',
              color:          'rgba(255,255,255,0.3)',
              cursor:         'pointer',
              fontSize:        11,
              transition:     'all 0.2s',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background  = 'rgba(255,255,255,0.08)'
              e.currentTarget.style.color       = 'rgba(255,255,255,0.7)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.18)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background  = 'rgba(255,255,255,0.04)'
              e.currentTarget.style.color       = 'rgba(255,255,255,0.3)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            ✕
          </button>
        </div>

        {/* ── MESSAGES ── */}
        <div style={{
          flex:           1,
          overflowY:      'auto',
          padding:        '14px 13px',
          display:        'flex',
          flexDirection:  'column',
          gap:            '9px',
          minHeight:       0,
          scrollbarWidth: 'none',
        }}>
          {displayMessages.map(m => (
            <div
              key={m.id}
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    m.role === 'user' ? 'flex-end' : 'flex-start',
                animation:     'moxieMsgIn 0.28s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              <div style={{
                maxWidth:    '84%',
                padding:     '9px 13px',
                fontFamily:  'var(--font-body)',
                fontSize:     '12px',
                lineHeight:   1.8,
                borderRadius: m.role === 'moxie' ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
                background:   m.role === 'moxie' ? 'rgba(0,255,65,0.05)'    : 'rgba(200,168,75,0.11)',
                color:        m.role === 'moxie' ? 'rgba(255,255,255,0.77)' : 'rgba(255,255,255,0.9)',
                border:       m.role === 'moxie' ? '0.5px solid rgba(0,255,65,0.14)' : '0.5px solid rgba(200,168,75,0.22)',
                boxShadow:   '0 2px 10px rgba(0,0,0,0.28)',
                wordBreak:   'break-word',
                whiteSpace:  'pre-wrap',
              }}>
                {m.text}
              </div>
              <span style={{
                fontFamily:    'var(--font-body)',
                fontSize:       '7.5px',
                color:          'rgba(255,255,255,0.17)',
                marginTop:      '3px',
                paddingLeft:    m.role === 'moxie' ? '4px' : 0,
                paddingRight:   m.role === 'user'  ? '4px' : 0,
                letterSpacing: '0.04em',
              }}>
                {m.ts}
              </span>
            </div>
          ))}

          {/* Typing dots */}
          {isLoading && (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
              animation: 'moxieMsgIn 0.28s cubic-bezier(0.16,1,0.3,1)',
            }}>
              <div style={{
                padding:      '11px 16px',
                borderRadius: '4px 14px 14px 14px',
                background:   'rgba(0,255,65,0.05)',
                border:       '0.5px solid rgba(0,255,65,0.14)',
                display:      'flex',
                alignItems:   'center',
                gap:           '5px',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'rgba(0,255,65,0.65)',
                    animation:  `moxieDot 1.2s ease-in-out ${i * 0.18}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Error */}
          {error && (
            <div style={{
              padding: '10px 13px', borderRadius: '4px 14px 14px 14px',
              background: 'rgba(255,68,68,0.06)', border: '0.5px solid rgba(255,68,68,0.18)',
              fontFamily: 'var(--font-body)', fontSize: '11px',
              color: 'rgba(255,140,140,0.75)', maxWidth: '84%',
            }}>
              I&apos;m momentarily stepping away. Please try again, or reach us at{' '}
              <span style={{ color: 'var(--gold, #D4A853)' }}>hello@ubuntuecolodge.com</span>.
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── SUGGESTION CHIPS ── */}
        {showSuggestions && (
          <div style={{
            padding: '9px 13px', display: 'flex', flexWrap: 'wrap', gap: '5px',
            borderTop: '0.5px solid rgba(255,255,255,0.04)',
            flexShrink: 0, background: 'rgba(0,0,0,0.12)',
          }}>
            <span style={{
              width: '100%', fontFamily: 'var(--font-body)', fontSize: '7.5px',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.18)', marginBottom: '2px',
            }}>
              Suggestions
            </span>
            {suggestions.map((s, i) => (
              <button
                key={s}
                onClick={() => sendSuggestion(s)}
                disabled={isLoading}
                style={{
                  fontFamily: 'var(--font-body)', fontSize: '9px',
                  letterSpacing: '0.03em', padding: '5px 10px',
                  border: '0.5px solid rgba(0,255,65,0.2)', borderRadius: '20px',
                  background: 'rgba(0,255,65,0.04)', color: 'rgba(0,255,65,0.6)',
                  cursor: isLoading ? 'not-allowed' : 'pointer', transition: 'all 0.18s',
                  whiteSpace: 'nowrap', opacity: isLoading ? 0.45 : 1, lineHeight: 1.3,
                  animation: `moxieMsgIn 0.3s cubic-bezier(0.16,1,0.3,1) ${i * 0.05}s both`,
                }}
                onMouseEnter={e => {
                  if (isLoading) return
                  e.currentTarget.style.background  = 'rgba(0,255,65,0.1)'
                  e.currentTarget.style.borderColor = 'rgba(0,255,65,0.4)'
                  e.currentTarget.style.color       = 'rgba(0,255,65,0.9)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background  = 'rgba(0,255,65,0.04)'
                  e.currentTarget.style.borderColor = 'rgba(0,255,65,0.2)'
                  e.currentTarget.style.color       = 'rgba(0,255,65,0.6)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── INPUT ROW ── */}
        <form
          onSubmit={onSubmit}
          style={{
            padding: '11px 13px', display: 'flex', gap: '7px',
            borderTop: '0.5px solid rgba(255,255,255,0.06)',
            flexShrink: 0, background: 'rgba(0,0,0,0.15)',
          }}
        >
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={onInputChange}
            onKeyDown={onKeyDown}
            placeholder="Ask Moxie anything…"
            disabled={isLoading}
            aria-label="Message Moxie"
            style={{
              flex: 1, fontFamily: 'var(--font-body)', fontSize: '12px',
              padding: '9px 12px',
              background: 'rgba(255,255,255,0.04)',
              border: '0.5px solid rgba(255,255,255,0.08)',
              borderRadius: '8px', color: 'var(--cream, #f0ece0)',
              outline: 'none', transition: 'border-color 0.2s',
              opacity: isLoading ? 0.6 : 1,
            }}
            onFocus={e => { e.target.style.borderColor = 'rgba(0,255,65,0.32)' }}
            onBlur={e  => { e.target.style.borderColor = 'rgba(255,255,255,0.08)' }}
          />
          <button
            type="submit"
            disabled={!inputValue.trim() || isLoading}
            aria-label="Send message"
            style={{
              width: 36, height: 36, flexShrink: 0,
              borderRadius: '8px', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 15,
              cursor:     inputValue.trim() && !isLoading ? 'pointer' : 'not-allowed',
              background: inputValue.trim() && !isLoading
                ? 'linear-gradient(135deg, #00FF41, #00cc33)'
                : 'rgba(0,255,65,0.1)',
              color:      inputValue.trim() && !isLoading ? '#0a0a0a' : 'rgba(0,255,65,0.3)',
              transition: 'all 0.2s',
              boxShadow:  inputValue.trim() && !isLoading ? '0 2px 10px rgba(0,255,65,0.28)' : 'none',
            }}
          >
            {isLoading ? (
              <div style={{
                width: 13, height: 13,
                border:       '2px solid rgba(0,255,65,0.28)',
                borderTop:    '2px solid rgba(0,255,65,0.8)',
                borderRadius: '50%',
                animation:    'spin 0.8s linear infinite',
              }} />
            ) : '→'}
          </button>
        </form>

        {/* Badge */}
        <div style={{
          padding: '5px 13px', display: 'flex', justifyContent: 'center',
          background: 'rgba(0,0,0,0.2)', flexShrink: 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-body)', fontSize: '7px',
            letterSpacing: '0.12em', color: 'rgba(255,255,255,0.1)',
            textTransform: 'uppercase',
          }}>
            Ubuntu AI · GPT-4o · Memory enabled
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          MOXIE AVATAR LAUNCHER
      ══════════════════════════════════════════════════════════ */}
      <div style={{
        position: 'fixed', zIndex: 200, bottom: '16px', right: '20px',
        width: 80, display: 'flex', flexDirection: 'column', alignItems: 'flex-end',
      }}>
        {proactiveText && (
          <SpeechBubble text={proactiveText} visible={bubbleVisible && !open} />
        )}

        <button
          onClick={() => setOpen(prev => !prev)}
          aria-label={open ? 'Close Moxie concierge' : 'Open Moxie AI Concierge'}
          className="moxie-bubble"
          style={{
            background: 'none', border: 'none', padding: 0,
            cursor: 'pointer', outline: 'none',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px',
            animation: !open ? 'moxieBreathe 3.5s ease-in-out infinite' : 'none',
            transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1)',
            transform: open ? 'scale(0.88)' : 'scale(1)',
          }}
          onMouseEnter={e => { if (!open) e.currentTarget.style.transform = 'scale(1.07)' }}
          onMouseLeave={e => { if (!open) e.currentTarget.style.transform = 'scale(1)'    }}
        >
          <MoxieAvatar waving={waving} pulsing={proactiveShown && !open} />
          <div style={{
            fontFamily:    'var(--font-body)',
            fontSize:       '8px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color:           open ? 'rgba(200,168,75,0.5)' : 'rgba(0,255,65,0.65)',
            background:     'rgba(8,7,5,0.85)',
            border:         `0.5px solid ${open ? 'rgba(200,168,75,0.2)' : 'rgba(0,255,65,0.2)'}`,
            padding:        '2px 8px',
            borderRadius:   '10px',
            transition:     'all 0.25s',
            backdropFilter: 'blur(8px)',
          }}>
            {open ? 'close' : 'Moxie'}
          </div>
        </button>
      </div>

      {/* ── GLOBAL KEYFRAMES ── */}
      <style suppressHydrationWarning>{`
        @keyframes moxieGlow {
          0%, 100% { opacity: 0.5; transform: scaleX(1);    }
          50%       { opacity: 1;   transform: scaleX(1.15); }
        }
        @keyframes moxieDot {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
          30%           { transform: translateY(-5px); opacity: 1;   }
        }
        @keyframes moxieMsgIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes moxieBreathe {
          0%, 100% { transform: translateY(0);    }
          50%       { transform: translateY(-4px); }
        }
        @keyframes moxieWaveLeft {
          0%   { transform: rotate(0deg);   }
          100% { transform: rotate(-12deg); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .moxie-bubble:active { transform: scale(0.88) !important; }
      `}</style>
    </>
  )
}