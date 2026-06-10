'use client'
/**
 * _components/AmbientWellnessLayer.tsx — CLIENT COMPONENT
 *
 * Responsibility: audio system only.
 *
 * CHANGES FROM ORIGINAL:
 *   • framer-motion removed entirely — no motion.button, no motion.span
 *   • Entry animation replaced with CSS @keyframes (zero JS cost)
 *   • Pulse ring replaced with CSS animation class
 *   • Label crossfade replaced with CSS transition on opacity/transform
 *   • ALL audio logic preserved byte-for-byte:
 *       – Audio element created once in useEffect, cleaned up on unmount
 *       – AudioContext fallback (396 Hz binaural tone)
 *       – toggle: mp3 first → fallback on error
 *       – stopAudio suspends ctx so it can resume later
 *   • 3.5 s appearance delay handled by CSS animation-delay
 *
 * WHAT STAYS IDENTICAL:
 *   • useState/useRef/useCallback shape
 *   • All audio initialisation and teardown
 *   • All class names / Tailwind tokens
 *   • aria-label, disabled logic
 */

import { useState, useCallback, useEffect, useRef } from 'react'

// ── Inject CSS once at module level — no <style> tags in render ─────────────
// This avoids duplicating keyframe declarations if the module is ever imported
// more than once (HMR, Strict Mode double-invoke, etc.).
if (typeof document !== 'undefined') {
  const ID = 'ambient-wellness-styles'
  if (!document.getElementById(ID)) {
    const el = document.createElement('style')
    el.id = ID
    el.textContent = `
@keyframes ambient-slide-in {
  from { opacity: 0; transform: translateX(-14px); }
  to   { opacity: 1; transform: translateX(0); }
}
@keyframes ambient-pulse-ring {
  0%,100% { transform: scale(1);    opacity: 0.4; }
  50%      { transform: scale(1.35); opacity: 0;   }
}
@keyframes ambient-label-in {
  from { opacity: 0; transform: translateY(4px); }
  to   { opacity: 1; transform: translateY(0);   }
}
.ambient-btn {
  /* Appears after 3.5 s — matches original Framer Motion delay */
  animation: ambient-slide-in 0.5s cubic-bezier(0.16,1,0.3,1) 3.5s both;
}
.ambient-pulse-ring {
  animation: ambient-pulse-ring 3.5s ease-in-out infinite;
}
.ambient-label {
  animation: ambient-label-in 0.2s ease both;
}`
    document.head.appendChild(el)
  }
}

export default function AmbientWellnessLayer() {
  const [enabled, setEnabled] = useState(false)
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'playing' | 'error'>('idle')

  // Refs — intentionally NOT state; changing them must not trigger re-renders
  const audioRef         = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef      = useRef<AudioContext | null>(null)
  const usingFallbackRef = useRef(false)

  // ── Create audio element once, clean up on unmount ──────────────────────────
  // UNCHANGED from original
  useEffect(() => {
    const audio = new Audio()
    audioRef.current = audio
    return () => {
      audio.pause()
      audioCtxRef.current?.close()
    }
  }, []) // intentionally empty — runs exactly once

  // ── Audio helpers — UNCHANGED from original ─────────────────────────────────
  const stopAudio = useCallback(() => {
    audioRef.current?.pause()
    audioCtxRef.current?.suspend()
    setEnabled(false)
    setStatus('idle')
  }, [])

  const createAmbientTone = useCallback((ctx: AudioContext) => {
    // 396 Hz binaural — grounding / earth frequency
    const osc1 = ctx.createOscillator()
    osc1.type  = 'sine'
    osc1.frequency.setValueAtTime(396, ctx.currentTime)

    const osc2 = ctx.createOscillator()
    osc2.type  = 'sine'
    osc2.frequency.setValueAtTime(396.5, ctx.currentTime)   // slight detune → beat

    const gain = ctx.createGain()
    gain.gain.setValueAtTime(0.04, ctx.currentTime)         // very quiet

    osc1.connect(gain)
    osc2.connect(gain)
    gain.connect(ctx.destination)

    osc1.start()
    osc2.start()
    setStatus('playing')
  }, [])

  const startFallback = useCallback(() => {
    try {
      const ctx = new AudioContext()
      audioCtxRef.current = ctx
      createAmbientTone(ctx)
      setEnabled(true)
      setStatus('playing')
    } catch {
      setEnabled(false)
      setStatus('error')
    }
  }, [createAmbientTone])

  const toggle = useCallback(() => {
    if (enabled) { stopAudio(); return }

    setStatus('loading')

    // Already failed mp3 path — go straight to fallback
    if (usingFallbackRef.current) { startFallback(); return }

    if (audioRef.current) {
      audioRef.current.src = '/audio/kalsstockmedia-native-american-style-flute-music-324301.mp3'
      const p = audioRef.current.play()
      if (p !== undefined) {
        p
          .then(() => { setEnabled(true); setStatus('playing') })
          .catch(() => {
            usingFallbackRef.current = true
            audioRef.current?.pause()
            startFallback()
          })
      } else {
        // Legacy API — synchronous play
        setEnabled(true)
        setStatus('playing')
      }
    } else {
      startFallback()
    }
  }, [enabled, stopAudio, startFallback])

  // ── Labels — UNCHANGED ──────────────────────────────────────────────────────
  const LABELS: Record<typeof status, string> = {
    idle:    '○ Sanctuary Audio',
    loading: '◌ Loading…',
    playing: '◉ Ambient On',
    error:   '○ Audio Unavailable',
  }

  return (
    /*
      Replaced: <motion.button initial={{opacity:0,x:-14}} animate={{opacity:1,x:0}} transition={{delay:3.5}}>
      With:     <button className="ambient-btn"> + CSS keyframe with animation-delay:3.5s
      Result:   identical visual behaviour, zero framer-motion import
    */
    <button
      onClick={toggle}
      disabled={status === 'loading' || status === 'error'}
      aria-label={enabled ? 'Turn off ambient sound' : 'Turn on ambient sound'}
      className={[
        'ambient-btn',
        'fixed left-6 bottom-8 z-50 px-5 py-3',
        'border border-gold/20 bg-black/55 backdrop-blur-2xl rounded-full',
        'text-[9px] uppercase tracking-[0.28em] text-gold',
        'hover:bg-gold/8 transition-all duration-500',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        'relative',                             // needed for absolute pulse ring child
        enabled
          ? 'shadow-[0_0_0_1px_rgba(212,175,55,0.15),0_0_16px_rgba(212,175,55,0.08)]'
          : '',
      ].join(' ')}
    >
      {/*
        Replaced: <motion.span key={status} initial/animate/exit>
        With:     <span key={status} className="ambient-label">
        The key prop still triggers a remount (and therefore re-animation)
        whenever status changes — same crossfade behaviour without Framer Motion.
      */}
      <span key={status} className="ambient-label block">
        {LABELS[status]}
      </span>

      {/*
        Replaced: <motion.span animate={{scale:[1,1.35,1], opacity:[0.4,0,0.4]}} transition={{repeat:Infinity}}>
        With:     <span className="ambient-pulse-ring"> + CSS keyframe
        Only mounted when enabled, same as original.
      */}
      {enabled && (
        <span
          aria-hidden="true"
          className="ambient-pulse-ring absolute inset-0 rounded-full border border-gold/20 pointer-events-none"
        />
      )}
    </button>
  )
}