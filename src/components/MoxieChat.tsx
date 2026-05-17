'use client'

// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Moxie AI Concierge
// Production v3
//
// Changes from v2:
//   • Real OpenAI streaming via /api/moxie (no more regex responses)
//   • Supabase session memory — Moxie remembers across the session
//   • Cinematic panel redesign — African futurist luxury aesthetic
//   • Word-by-word streaming animation (live typing feel)
//   • Proactive page-aware contextual awareness preserved + improved
//   • Suggestions update per page context
//   • Connection status indicator (online / connecting)
//   • Error recovery with graceful fallback message
//   • Session ID generated once per browser session
//   • All original UX behaviors preserved (ESC close, auto-scroll, etc.)
// ─────────────────────────────────────────────────────────────────────

import { useState, useRef, useEffect, useCallback, useId } from 'react'
import { usePathname } from 'next/navigation'

// ─────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────

interface Message {
  id: string
  role: 'moxie' | 'user'
  text: string
  time: string
  streaming?: boolean
}

// ─────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────

function getTime(): string {
  return new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

function makeId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

/** Get or create a persistent session ID for Supabase memory */
function getSessionId(): string {
  if (typeof window === 'undefined') return makeId()
  const key = 'moxie-session-id'
  let id = sessionStorage.getItem(key)
  if (!id) { id = makeId(); sessionStorage.setItem(key, id) }
  return id
}

// ─────────────────────────────────────────────────────────────────────
// PAGE-AWARE SUGGESTIONS
// ─────────────────────────────────────────────────────────────────────

function getSuggestions(pathname: string): string[] {
  if (pathname.includes('spa'))        return ['What spa treatments are available?', 'Book a mud ritual', 'Couples spa options?', 'How long is the forest massage?']
  if (pathname.includes('cottages'))   return ['Which cottage has the best view?', 'What\'s included in the price?', 'Pokomo vs Farmhouse?', 'What meal plans are available?']
  if (pathname.includes('restaurant')) return ['What\'s on the menu tonight?', 'Is the chicken from your farm?', 'Vegetarian options?', 'Can I book a table?']
  if (pathname.includes('farm'))       return ['What\'s growing right now?', 'Can I join the farm walk?', 'Beekeeping experience?', 'How does the farm work?']
  if (pathname.includes('events'))     return ['What events are coming up?', 'How do I book a wedding?', 'Corporate retreat packages?', 'New moon fire circle?']
  return [
    'What\'s special about tonight?',
    'Show me the cottage options',
    'Any spa slots today?',
    'Tell me about the farm',
  ]
}

function getProactiveMessage(pathname: string): string | null {
  if (pathname.includes('spa'))        return 'The Arohamai Spa has treatments available today. Can I help you find the perfect ritual for your stay?'
  if (pathname.includes('cottages'))   return 'Each cottage at Ubuntu is named after an African tree — shall I help you find the one that calls to you?'
  if (pathname.includes('restaurant')) return 'Our kitchen just updated the specials for tonight. Would you like to know what\'s fresh from the farm?'
  if (pathname.includes('farm'))       return 'The farm is alive right now. Dawn walks, beekeeping, and soil-to-plate tours are all available this week.'
  if (pathname.includes('events'))     return 'Ubuntu hosts some extraordinary gatherings — from intimate moon circles to full village weddings. What brings you here?'
  if (pathname === '/')                return 'Karibu! Welcome to Ubuntu Kreative Village. I\'m Moxie, your AI concierge. What shall we plan for your stay?'
  return null
}

// ─────────────────────────────────────────────────────────────────────
// MOXIE CHAT COMPONENT
// ─────────────────────────────────────────────────────────────────────

export default function MoxieChat() {
  const [mounted,    setMounted]    = useState(false)
  const [open,       setOpen]       = useState(false)
  const [input,      setInput]      = useState('')
  const [messages,   setMessages]   = useState<Message[]>([])
  const [streaming,  setStreaming]   = useState(false)
  const [connected,  setConnected]  = useState(true)
  const [sessionId,  setSessionId]  = useState('')
  const [hasGreeted, setHasGreeted] = useState(false)

  const pathname  = usePathname()
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef  = useRef<HTMLInputElement>(null)
  const abortRef  = useRef<AbortController | null>(null)

  // ── Mount + session ───────────────────────────────────────────
  useEffect(() => {
    setMounted(true)
    setSessionId(getSessionId())

    const welcomeText = 'Karibu! I\'m Moxie, your Ubuntu AI concierge. I have access to live farm data, spa availability, tonight\'s menu, and cottage information. Ask me anything — or tap a suggestion below.'
    setMessages([{
      id:   makeId(),
      role: 'moxie',
      text: welcomeText,
      time: getTime(),
    }])
  }, [])

  // ── Proactive awareness ───────────────────────────────────────
  useEffect(() => {
    if (!mounted || open || hasGreeted || messages.length > 1) return

    const proactive = getProactiveMessage(pathname)
    if (!proactive) return

    const t = setTimeout(() => {
      setMessages((prev) => [...prev, {
        id:   makeId(),
        role: 'moxie',
        text: proactive,
        time: getTime(),
      }])
      setOpen(true)
      setHasGreeted(true)
    }, 18000)

    return () => clearTimeout(t)
  }, [pathname, open, messages.length, mounted, hasGreeted])

  // ── Auto-scroll ───────────────────────────────────────────────
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streaming])

  // ── Focus input ───────────────────────────────────────────────
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 280)
  }, [open])

  // ── ESC to close ──────────────────────────────────────────────
  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape' && open) setOpen(false) }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open])

  // ── Send message + stream response ───────────────────────────
  const send = useCallback(async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || streaming) return

    // Cancel any in-flight stream
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    // Add user message
    const userMsg: Message = { id: makeId(), role: 'user', text: msg, time: getTime() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setStreaming(true)
    setConnected(true)

    // Build conversation history for API
    const history = messages
      .filter((m) => !m.streaming)
      .map((m) => ({
        role:    m.role === 'user' ? 'user' : 'assistant',
        content: m.text,
      }))

    // Add current user message
    const apiMessages = [...history, { role: 'user', content: msg }]

    // Create streaming placeholder for Moxie's response
    const moxieId = makeId()
    setMessages((prev) => [...prev, {
      id:        moxieId,
      role:      'moxie',
      text:      '',
      time:      getTime(),
      streaming: true,
    }])

    try {
      const res = await fetch('/api/moxie', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        signal:  abortRef.current.signal,
        body:    JSON.stringify({
          messages:  apiMessages,
          pathname:  pathname,
          sessionId: sessionId,
        }),
      })

      if (!res.ok) throw new Error(`API error: ${res.status}`)

      const reader  = res.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response body')

      let fullText = ''

      // Read the stream — Vercel AI SDK sends data: prefixed SSE
      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          // AI SDK data stream format: '0:"token"'
          if (line.startsWith('0:')) {
            try {
              const token = JSON.parse(line.slice(2))
              if (typeof token === 'string') {
                fullText += token
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === moxieId
                      ? { ...m, text: fullText }
                      : m
                  )
                )
              }
            } catch {
              // Ignore parse errors on partial chunks
            }
          }
        }
      }

      // Mark streaming complete
      setMessages((prev) =>
        prev.map((m) =>
          m.id === moxieId
            ? { ...m, streaming: false, text: fullText || 'Asante for your patience — could you rephrase that for me?' }
            : m
        )
      )

    } catch (err: unknown) {
      const isAbort = err instanceof Error && err.name === 'AbortError'

      if (!isAbort) {
        setConnected(false)
        // Replace streaming placeholder with error message
        setMessages((prev) =>
          prev.map((m) =>
            m.id === moxieId
              ? {
                  ...m,
                  streaming: false,
                  text: 'I\'m momentarily stepping away from the system. Please try again in a moment, or reach us at hello@ubuntuecolodge.com.',
                }
              : m
          )
        )
      }
    } finally {
      setStreaming(false)
    }
  }, [input, messages, pathname, sessionId, streaming])

  if (!mounted) return null

  const suggestions = getSuggestions(pathname)
  const showSuggestions = messages.length <= 2 && !streaming

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
          position:       'fixed',
          zIndex:          200,
          bottom:          '96px',
          right:           '28px',
          width:           'min(380px, calc(100vw - 40px))',
          maxHeight:       '580px',
          display:         'flex',
          flexDirection:   'column',
          overflow:        'hidden',
          // Glass morphism with warm obsidian base
          background:      'rgba(8, 7, 5, 0.97)',
          border:          '0.5px solid rgba(200, 168, 75, 0.2)',
          boxShadow:       `
            0 32px 80px rgba(0, 0, 0, 0.7),
            0 0 0 0.5px rgba(200, 168, 75, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.04)
          `,
          backdropFilter:  'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          opacity:         open ? 1 : 0,
          transform:       open ? 'translateY(0) scale(1)' : 'translateY(16px) scale(0.96)',
          pointerEvents:   open ? 'all' : 'none',
          transition:      'opacity 0.35s cubic-bezier(0.16,1,0.3,1), transform 0.35s cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        {/* ── Ambient top accent line ── */}
        <div style={{
          height:     '1px',
          background: 'linear-gradient(90deg, transparent, rgba(200,168,75,0.5) 40%, rgba(0,255,65,0.3) 70%, transparent)',
          flexShrink: 0,
        }} />

        {/* ── HEADER ── */}
        <div style={{
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'space-between',
          padding:         '14px 18px',
          borderBottom:    '0.5px solid rgba(255, 255, 255, 0.05)',
          flexShrink:       0,
          background:      'rgba(0, 0, 0, 0.2)',
        }}>
          {/* Identity */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Avatar orb */}
            <div style={{ position: 'relative', width: 36, height: 36, flexShrink: 0 }}>
              {/* Pulse rings */}
              <div style={{
                position:   'absolute',
                inset:       0,
                borderRadius:'50%',
                background:  'radial-gradient(circle at 38% 38%, rgba(100,255,130,0.45), rgba(0,180,60,0.2) 50%, rgba(3,10,3,0.9))',
                boxShadow:   '0 0 16px rgba(0,255,65,0.2)',
                border:      '0.5px solid rgba(0,255,65,0.3)',
              }} />
              <div style={{
                position:        'absolute',
                inset:           '-4px',
                borderRadius:    '50%',
                border:          '0.5px solid rgba(0,255,65,0.15)',
                animation:       'moxiePulse 2.5s ease-in-out infinite',
              }} />
              <div style={{
                position:     'absolute',
                inset:         0,
                borderRadius: '50%',
                display:      'flex',
                alignItems:   'center',
                justifyContent:'center',
                fontFamily:   'var(--font-body)',
                fontSize:     '14px',
                fontWeight:    700,
                color:         '#00FF41',
                letterSpacing: '0',
              }}>
                M
              </div>
            </div>

            <div>
              <div style={{
                fontFamily:    'var(--font-body)',
                fontSize:       '11px',
                fontWeight:     700,
                letterSpacing:  '0.22em',
                textTransform:  'uppercase',
                color:          'var(--neon)',
                lineHeight:     1,
                marginBottom:   '3px',
              }}>
                Moxie
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  display:       'inline-block',
                  width:          5,
                  height:         5,
                  borderRadius:  '50%',
                  background:     connected ? '#00FF41' : '#ff4444',
                  boxShadow:      connected ? '0 0 6px rgba(0,255,65,0.7)' : '0 0 6px rgba(255,68,68,0.7)',
                  flexShrink:     0,
                }} />
                <span style={{
                  fontFamily:   'var(--font-body)',
                  fontSize:      '8.5px',
                  letterSpacing: '0.1em',
                  color:         'rgba(255,255,255,0.3)',
                }}>
                  {connected
                    ? streaming ? 'responding…' : 'AI Concierge · Live'
                    : 'Reconnecting…'
                  }
                </span>
              </div>
            </div>
          </div>

          {/* Close */}
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
              color:         'rgba(255,255,255,0.3)',
              cursor:        'pointer',
              fontSize:       12,
              transition:    'all 0.2s',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background   = 'rgba(255,255,255,0.08)'
              el.style.color        = 'rgba(255,255,255,0.7)'
              el.style.borderColor  = 'rgba(255,255,255,0.18)'
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background  = 'rgba(255,255,255,0.04)'
              el.style.color       = 'rgba(255,255,255,0.3)'
              el.style.borderColor = 'rgba(255,255,255,0.08)'
            }}
          >
            ✕
          </button>
        </div>

        {/* ── MESSAGES ── */}
        <div style={{
          flex:       1,
          overflowY:  'auto',
          padding:    '16px 14px',
          display:    'flex',
          flexDirection:'column',
          gap:        '10px',
          minHeight:   0,
          scrollbarWidth: 'none',
        }}>
          {messages.map((m) => (
            <div
              key={m.id}
              style={{
                display:       'flex',
                flexDirection: 'column',
                alignItems:    m.role === 'user' ? 'flex-end' : 'flex-start',
                animation:     'moxieMsgIn 0.28s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              {/* Bubble */}
              <div style={{
                maxWidth:      '85%',
                padding:       '10px 13px',
                fontFamily:    'var(--font-body)',
                fontSize:       '12px',
                lineHeight:     1.75,
                borderRadius:   m.role === 'moxie'
                  ? '4px 14px 14px 14px'
                  : '14px 4px 14px 14px',
                background:    m.role === 'moxie'
                  ? 'rgba(0, 255, 65, 0.05)'
                  : 'rgba(200, 168, 75, 0.12)',
                color:         m.role === 'moxie'
                  ? 'rgba(255,255,255,0.75)'
                  : 'rgba(255,255,255,0.88)',
                border:        m.role === 'moxie'
                  ? '0.5px solid rgba(0,255,65,0.15)'
                  : '0.5px solid rgba(200,168,75,0.25)',
                boxShadow:     m.role === 'moxie'
                  ? '0 2px 12px rgba(0,0,0,0.3)'
                  : '0 2px 12px rgba(0,0,0,0.3)',
                wordBreak:     'break-word',
              }}>
                {m.text}
                {/* Streaming cursor */}
                {m.streaming && (
                  <span style={{
                    display:         'inline-block',
                    width:            8,
                    height:           14,
                    background:      'rgba(0,255,65,0.7)',
                    marginLeft:       4,
                    verticalAlign:   'middle',
                    animation:       'moxieCursor 0.7s step-end infinite',
                    borderRadius:     1,
                  }} />
                )}
              </div>

              {/* Timestamp */}
              <span style={{
                fontFamily:   'var(--font-body)',
                fontSize:      '8px',
                color:         'rgba(255,255,255,0.18)',
                marginTop:     '3px',
                paddingLeft:   m.role === 'moxie' ? '4px' : 0,
                paddingRight:  m.role === 'user'  ? '4px' : 0,
                letterSpacing: '0.05em',
              }}>
                {m.time}
              </span>
            </div>
          ))}

          {/* Typing indicator when Moxie hasn't started streaming yet */}
          {streaming && messages[messages.length - 1]?.text === '' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 13px', opacity: 0.6 }}>
              {[0, 1, 2].map((i) => (
                <div key={i} style={{
                  width:        6,
                  height:       6,
                  borderRadius: '50%',
                  background:  'var(--neon)',
                  animation:   `moxieDot 1.2s ease-in-out ${i * 0.18}s infinite`,
                }} />
              ))}
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* ── SUGGESTIONS ── */}
        {showSuggestions && (
          <div style={{
            padding:       '10px 14px',
            display:       'flex',
            flexWrap:      'wrap',
            gap:            '6px',
            borderTop:     '0.5px solid rgba(255,255,255,0.04)',
            flexShrink:     0,
            background:    'rgba(0,0,0,0.1)',
          }}>
            <span style={{
              width:         '100%',
              fontFamily:    'var(--font-body)',
              fontSize:       '8px',
              letterSpacing:  '0.18em',
              textTransform: 'uppercase',
              color:          'rgba(255,255,255,0.2)',
              marginBottom:   '2px',
            }}>
              Suggestions
            </span>
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                style={{
                  fontFamily:     'var(--font-body)',
                  fontSize:        '9.5px',
                  letterSpacing:   '0.04em',
                  padding:         '5px 10px',
                  border:          '0.5px solid rgba(0,255,65,0.2)',
                  borderRadius:    '20px',
                  background:      'rgba(0,255,65,0.04)',
                  color:           'rgba(0,255,65,0.65)',
                  cursor:          'pointer',
                  transition:      'all 0.2s ease',
                  whiteSpace:      'nowrap',
                  lineHeight:       1.3,
                }}
                onMouseEnter={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background   = 'rgba(0,255,65,0.1)'
                  el.style.borderColor  = 'rgba(0,255,65,0.4)'
                  el.style.color        = 'rgba(0,255,65,0.9)'
                }}
                onMouseLeave={(e) => {
                  const el = e.currentTarget as HTMLButtonElement
                  el.style.background  = 'rgba(0,255,65,0.04)'
                  el.style.borderColor = 'rgba(0,255,65,0.2)'
                  el.style.color       = 'rgba(0,255,65,0.65)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* ── INPUT ROW ── */}
        <div style={{
          padding:       '12px 14px',
          display:       'flex',
          gap:            '8px',
          borderTop:     '0.5px solid rgba(255,255,255,0.06)',
          flexShrink:     0,
          background:    'rgba(0,0,0,0.15)',
        }}>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Ask Moxie anything…"
            disabled={streaming}
            aria-label="Message Moxie"
            style={{
              flex:         1,
              fontFamily:   'var(--font-body)',
              fontSize:      '12px',
              padding:       '9px 13px',
              background:   'rgba(255,255,255,0.04)',
              border:       '0.5px solid rgba(255,255,255,0.08)',
              borderRadius:  '8px',
              color:         'var(--cream)',
              outline:       'none',
              transition:    'border-color 0.2s',
              opacity:        streaming ? 0.6 : 1,
            }}
            onFocus={(e)  => { (e.target as HTMLInputElement).style.borderColor = 'rgba(0,255,65,0.35)' }}
            onBlur={(e)   => { (e.target as HTMLInputElement).style.borderColor = 'rgba(255,255,255,0.08)' }}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || streaming}
            aria-label="Send message"
            style={{
              width:         38,
              height:        38,
              flexShrink:    0,
              borderRadius:  '8px',
              border:        'none',
              display:       'flex',
              alignItems:    'center',
              justifyContent:'center',
              fontSize:       16,
              cursor:         input.trim() && !streaming ? 'pointer' : 'not-allowed',
              background:     input.trim() && !streaming
                ? 'linear-gradient(135deg, #00FF41, #00cc33)'
                : 'rgba(0,255,65,0.12)',
              color:          input.trim() && !streaming ? '#0a0a0a' : 'rgba(0,255,65,0.35)',
              transition:    'all 0.2s',
              boxShadow:      input.trim() && !streaming
                ? '0 2px 12px rgba(0,255,65,0.3)'
                : 'none',
            }}
          >
            {streaming ? (
              <div style={{
                width:        14,
                height:       14,
                border:       '2px solid rgba(0,255,65,0.3)',
                borderTop:    '2px solid rgba(0,255,65,0.8)',
                borderRadius: '50%',
                animation:    'spin 0.8s linear infinite',
              }} />
            ) : '→'}
          </button>
        </div>

        {/* ── Powered by badge ── */}
        <div style={{
          padding:        '6px 14px',
          display:        'flex',
          justifyContent: 'center',
          background:     'rgba(0,0,0,0.2)',
          flexShrink:      0,
        }}>
          <span style={{
            fontFamily:   'var(--font-body)',
            fontSize:      '7.5px',
            letterSpacing: '0.12em',
            color:         'rgba(255,255,255,0.12)',
            textTransform: 'uppercase',
          }}>
            Ubuntu AI · GPT-4o · Memory enabled
          </span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════
          FLOATING BUBBLE
      ══════════════════════════════════════════════════════════ */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        aria-label={open ? 'Close Moxie concierge' : 'Open Moxie AI Concierge'}
        className="moxie-bubble"
        style={{
          position:       'fixed',
          zIndex:          200,
          bottom:          '28px',
          right:           '28px',
          width:           52,
          height:          52,
          borderRadius:   '50%',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          cursor:         'pointer',
          background:     '#090807',
          border:         '0.5px solid rgba(200,168,75,0.35)',
          boxShadow:       open
            ? '0 0 0 4px rgba(200,168,75,0.1), 0 8px 32px rgba(0,0,0,0.5)'
            : '0 0 0 0px rgba(200,168,75,0), 0 8px 32px rgba(0,0,0,0.5)',
          transition:     'all 0.3s cubic-bezier(0.16,1,0.3,1)',
          transform:       open ? 'scale(0.92)' : 'scale(1)',
        }}
        onMouseEnter={(e) => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.06)'
        }}
        onMouseLeave={(e) => {
          if (!open) (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)'
        }}
      >
        {/* Outer pulse ring — only when closed */}
        {!open && (
          <div style={{
            position:     'absolute',
            inset:        '-6px',
            borderRadius: '50%',
            border:       '0.5px solid rgba(200,168,75,0.15)',
            animation:    'moxieRing 3s ease-out infinite',
            pointerEvents: 'none',
          }} />
        )}

        {/* Unread dot — shows when proactive message appeared */}
        {!open && messages.length > 1 && (
          <div style={{
            position:     'absolute',
            top:           2,
            right:         2,
            width:         10,
            height:        10,
            borderRadius: '50%',
            background:   '#00FF41',
            border:        '1.5px solid #090807',
            boxShadow:    '0 0 8px rgba(0,255,65,0.7)',
          }} />
        )}

        {/* Icon */}
        <div style={{
          fontFamily:   'var(--font-body)',
          fontSize:      open ? '14px' : '18px',
          fontWeight:    700,
          color:          open ? 'rgba(200,168,75,0.6)' : 'var(--gold)',
          transition:    'all 0.25s',
          letterSpacing: '0',
          lineHeight:     1,
        }}>
          {open ? '✕' : 'M'}
        </div>
      </button>

      {/* ── GLOBAL KEYFRAMES ── */}
      <style suppressHydrationWarning>{`
        @keyframes moxiePulse {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50%       { opacity: 0.8; transform: scale(1.12); }
        }
        @keyframes moxieRing {
          0%   { transform: scale(1);   opacity: 0.5; }
          100% { transform: scale(1.6); opacity: 0;   }
        }
        @keyframes moxieDot {
          0%, 60%, 100% { transform: translateY(0);    opacity: 0.4; }
          30%           { transform: translateY(-5px); opacity: 1;   }
        }
        @keyframes moxieMsgIn {
          from { opacity: 0; transform: translateY(8px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
        @keyframes moxieCursor {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        .moxie-bubble:active {
          transform: scale(0.9) !important;
        }
      `}</style>
    </>
  )
}