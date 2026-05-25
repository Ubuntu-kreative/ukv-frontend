'use client'
/**
 * _components/WellnessAssistant.tsx — CLIENT COMPONENT
 *
 * Responsibility: floating wellness assistant panel (UI only).
 *
 * Design rules:
 *   • Zero external libraries — no framer-motion, no zustand, no axios
 *   • No dependency on AmbientWellnessLayer or any other client island
 *   • Appears after a 5 s CSS delay (matches page.tsx intent)
 *   • Full open/close toggle with smooth CSS transitions
 *   • Consistent with design system: gold (#D4AF37), dark bg, uppercase tracking
 *   • Accessible: keyboard-dismissable via Escape, focus-managed
 */

import { useState, useEffect, useCallback, useRef } from 'react'

// ── Inject CSS once at module level ─────────────────────────────────────────
// Same pattern as AmbientWellnessLayer — prevents duplication across HMR cycles.
if (typeof document !== 'undefined') {
  const ID = 'wellness-assistant-styles'
  if (!document.getElementById(ID)) {
    const el = document.createElement('style')
    el.id = ID
    el.textContent = `
@keyframes wa-slide-up {
  from { opacity: 0; transform: translateY(14px) scale(0.97); }
  to   { opacity: 1; transform: translateY(0)    scale(1);    }
}
@keyframes wa-btn-in {
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0);   }
}
@keyframes wa-dot-pulse {
  0%,100% { opacity: 1;   }
  50%      { opacity: 0.3; }
}
.wa-container {
  /* Appears after 5 s — matches original intent */
  animation: wa-btn-in 0.6s cubic-bezier(0.16,1,0.3,1) 5s both;
}
.wa-panel {
  transition: opacity 0.25s ease, transform 0.3s cubic-bezier(0.16,1,0.3,1),
              visibility 0s linear 0s;
  transform-origin: bottom right;
}
.wa-panel[data-open="true"] {
  opacity: 1;
  transform: scale(1) translateY(0);
  visibility: visible;
}
.wa-panel[data-open="false"] {
  opacity: 0;
  transform: scale(0.96) translateY(6px);
  visibility: hidden;
  /* delay visibility change until after opacity transition */
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0s linear 0.2s;
}
.wa-status-dot {
  animation: wa-dot-pulse 2s ease-in-out infinite;
}
`
    document.head.appendChild(el)
  }
}

// ── Suggestion content — pure data, never fetched at runtime ─────────────────
const SUGGESTIONS = [
  {
    title:   'Ubuntu Signature Therapy',
    detail:  'Maasai warm oil · grounding stone · 90 MIN · KES 7,500',
    href:    '#rituals',
  },
  {
    title:   'Moroccan Bath',
    detail:  'Black soap · kessa exfoliation · 75 MIN · KES 4,500',
    href:    '#rituals',
  },
  {
    title:   'Stress Relief Package',
    detail:  'Herbal soak + aromatherapy + facial · 3 HRS · KES 14,000',
    href:    '#rituals',
  },
]

export default function WellnessAssistant() {
  const [open,      setOpen]      = useState(false)
  const [dismissed, setDismissed] = useState(false)

  // Ref for focus management — focus the close button when panel opens
  const closeBtnRef = useRef<HTMLButtonElement>(null)

  // Dismiss on Escape when panel is open
  useEffect(() => {
    if (!open) return
    const fn = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [open])

  // Move focus into panel when it opens
  useEffect(() => {
    if (open) closeBtnRef.current?.focus()
  }, [open])

  const handleDismiss = useCallback(() => {
    setOpen(false)
    // Short delay so panel close animation finishes before the whole widget vanishes
    setTimeout(() => setDismissed(true), 300)
  }, [])

  if (dismissed) return null

  return (
    /*
      wa-container: CSS animation-delay:5s — matches page intent.
      Fixed position bottom-right; z-40 to sit below modal (z-[100]) and
      audio button (z-50) but above page content.
    */
    <div
      className="wa-container fixed bottom-8 right-8 z-40 hidden lg:flex flex-col items-end gap-3"
      role="complementary"
      aria-label="Moxie Wellness Assistant"
    >
      {/* ── EXPANDABLE PANEL ── */}
      <div
        className="wa-panel w-[300px] rounded-[1.75rem] border border-white/8 bg-black/80 backdrop-blur-3xl shadow-[0_0_40px_rgba(212,175,55,0.06)] overflow-hidden"
        data-open={open ? 'true' : 'false'}
        aria-hidden={!open}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-white/5">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="wa-status-dot w-[5px] h-[5px] rounded-full bg-[#00ff41] inline-block" />
              <p className="text-[7px] uppercase tracking-[0.35em] text-[#00ff41]">Moxie Online</p>
            </div>
            <h4 className="font-display text-[1.1rem] leading-tight text-white">
              Wellness Intelligence
            </h4>
          </div>
          <button
            ref={closeBtnRef}
            onClick={() => setOpen(false)}
            aria-label="Close wellness assistant"
            className="text-white/20 hover:text-white/60 transition-colors text-sm leading-none mt-0.5 flex-shrink-0 ml-3"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          <p className="text-white/35 text-[11px] leading-relaxed mb-5">
            Based on your signals, Moxie suggests these rituals to restore your body today.
          </p>

          <div className="space-y-3 mb-5">
            {SUGGESTIONS.map((s) => (
              <a
                key={s.title}
                href={s.href}
                onClick={() => setOpen(false)}
                className="block border border-white/5 rounded-[1rem] px-4 py-3 hover:border-[rgba(212,175,55,0.3)] hover:bg-[rgba(212,175,55,0.04)] transition-all duration-300 group"
              >
                <p className="text-white/75 text-[11px] leading-tight mb-0.5 group-hover:text-white transition-colors">
                  {s.title}
                </p>
                <p className="text-[8px] uppercase tracking-[0.18em] text-[rgba(212,175,55,0.5)]">
                  {s.detail}
                </p>
              </a>
            ))}
          </div>

          <div className="flex gap-2">
            <a
              href="#rituals"
              onClick={() => setOpen(false)}
              className="flex-1 py-2.5 text-center text-[8px] uppercase tracking-[0.22em] font-medium transition-all duration-400 rounded-full"
              style={{
                background: 'rgba(212,175,55,1)',
                color: '#0a0a0a',
              }}
            >
              View All Rituals
            </a>
            <button
              onClick={handleDismiss}
              className="px-4 py-2.5 border border-white/10 text-[8px] uppercase tracking-[0.18em] text-white/30 hover:text-white/60 hover:border-white/20 transition-all duration-300 rounded-full"
            >
              Dismiss
            </button>
          </div>
        </div>
      </div>

      {/* ── TOGGLE BUTTON — always visible ── */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={open ? 'Close Moxie wellness assistant' : 'Open Moxie wellness assistant'}
        className="flex items-center gap-2.5 px-5 py-3 rounded-full border border-white/10 bg-black/60 backdrop-blur-2xl text-[9px] uppercase tracking-[0.28em] transition-all duration-500 hover:border-[rgba(212,175,55,0.3)] group"
        style={{
          color: open ? 'rgba(212,175,55,1)' : 'rgba(255,255,255,0.45)',
          borderColor: open ? 'rgba(212,175,55,0.25)' : undefined,
          boxShadow: open
            ? '0 0 0 1px rgba(212,175,55,0.12), 0 0 18px rgba(212,175,55,0.06)'
            : 'none',
        }}
      >
        {/* Pulsing dot */}
        <span
          className="w-[5px] h-[5px] rounded-full flex-shrink-0"
          style={{
            background: open ? 'rgba(212,175,55,1)' : '#00ff41',
            animation: open ? 'none' : 'wa-dot-pulse 2s ease-in-out infinite',
          }}
          aria-hidden="true"
        />
        Moxie{open ? ' ✕' : ' Wellness'}
      </button>
    </div>
  )
}