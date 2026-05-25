'use client'

/**
 * _components/RitualModal.tsx
 *
 * ISOLATED CLIENT COMPONENT — renders ONE modal for ONE ritual.
 *
 * WHY ISOLATED:
 * In the original file, the modal lived inside a 1400-line component.
 * Every state change anywhere on the page could potentially affect it.
 * Now it's a leaf — it only re-renders when `ritual` or `onClose` changes.
 *
 * BUGS FIXED (from original):
 * BUG 1 — onClose infinite scroll thrash: fixed via useRef stable pattern
 * BUG 3 — RecoveryMeter never animating: fixed via scrollRef as viewport root
 * BUG 4 — FloatingParticles style accumulation: fixed via singleton guard
 * BUG 5 — JS timer stagger on timeline: replaced with CSS animation-delay
 */

import { useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

import { useCartStore } from '@/context/cartStore'
import { RITUAL_ACCENTS, DEFAULT_ACCENT, type Ritual } from '../_data/spa-data'

// ─── ANIMATION CONSTANTS — module-level, never recreated ─────────────────────
const SLOW_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

const MODAL_VARIANTS = {
  hidden:  { opacity: 0, scale: 0.97, y: 8  },
  visible: { opacity: 1, scale: 1,    y: 0  },
  exit:    { opacity: 0, scale: 0.96, y: 6  },
}

// ─── RECOVERY METER ──────────────────────────────────────────────────────────
// BUG 3 FIX: containerRef passed as viewport.root so IntersectionObserver
// watches the scroll panel, not the browser viewport. Without this, meters
// inside overflow-y-auto are never "in view" from the viewport's perspective.
function RecoveryMeter({
  label, value, containerRef,
}: {
  label:        string
  value:        number
  containerRef: React.RefObject<HTMLDivElement | null>
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5 text-[9px] uppercase tracking-[0.25em] text-white/35">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          viewport={{ once: true, root: containerRef }}
          className="h-full bg-gradient-to-r from-gold/40 to-gold rounded-full"
        />
      </div>
    </div>
  )
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
// Module-level component so springs are stable. Springs created once on mount,
// Framer Motion cleans them up on unmount via its internal subscription system.
import { useMotionValue, useSpring } from 'framer-motion'

function MagneticButton({ children, className, onClick }: {
  children:  React.ReactNode
  className?: string
  onClick?:  () => void
}) {
  const x       = useMotionValue(0)
  const y       = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 20 })
  const springY = useSpring(y, { stiffness: 180, damping: 20 })

  return (
    <motion.button
      style={{ x: springX, y: springY }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - r.left - r.width  / 2) * 0.10)
        y.set((e.clientY - r.top  - r.height / 2) * 0.10)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

interface RitualModalProps {
  ritual:  Ritual
  onClose: () => void
}

export default function RitualModal({ ritual, onClose }: RitualModalProps) {
  const accent    = RITUAL_ACCENTS[ritual.id] ?? DEFAULT_ACCENT
  const addItem   = useCartStore((s) => s.addItem)
  const scrollRef = useRef<HTMLDivElement>(null)

  // BUG 1 FIX: stable ref pattern — effect runs ONCE (empty deps []).
  // The ref always holds the latest onClose without re-running the effect.
  const onCloseRef = useRef(onClose)
  useEffect(() => { onCloseRef.current = onClose })

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', handler)
    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', handler)
    }
  }, []) // ← intentionally empty — runs exactly once on mount/unmount

  const addToCart = useCallback(() => {
    addItem({
      id:       ritual.id,
      name:     ritual.name,
      category: 'spa',
      tag:      ritual.categoryTag,
      price:    ritual.price,
      unit:     '/ session',
    })
    toast.success(`${ritual.name} added to Wellness Cart`)
    onClose()
  }, [addItem, ritual, onClose])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={ritual.name}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

      {/* Panel */}
      <motion.div
        variants={MODAL_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.5, ease: SLOW_EASE }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row rounded-[2.5rem] overflow-hidden border border-white/8 bg-[#080808] shadow-2xl"
        style={{ maxHeight: 'calc(100svh - 48px)' }}
      >
        {/* ── Left: image panel ── */}
        <div className="relative lg:w-[42%] min-h-[260px] lg:min-h-0 flex-shrink-0 overflow-hidden">
          <Image
            src={ritual.image}
            alt={ritual.name}
            fill
            sizes="(max-width:1024px) 100vw, 42vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-transparent to-black/55 lg:bg-gradient-to-r lg:from-transparent lg:to-[#080808]" />
          <div
            className="absolute inset-0 opacity-65"
            style={{ background: `radial-gradient(circle at 50% 50%, ${accent.glow}, transparent 70%)` }}
          />

          {/* Particles — CSS only, no JS state */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="arohamai-particle"
                style={{
                  left:              `${i * (100 / 6)}%`,
                  animationDuration: `${14 + i * 0.7}s`,
                  animationDelay:    `${i * 0.6}s`,
                }}
              />
            ))}
          </div>

          <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-gold/25 bg-black/52 backdrop-blur-xl text-gold rounded-full">
              {ritual.categoryTag}
            </span>
            <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-white/10 bg-black/42 backdrop-blur-xl text-white/52 rounded-full">
              {ritual.status}
            </span>
          </div>
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-[8px] uppercase tracking-[0.32em] text-gold/45">{accent.label}</p>
          </div>
        </div>

        {/* ── Right: content panel ── */}
        <div
          ref={scrollRef}
          className="lg:w-[58%] overflow-y-auto p-7 md:p-10 flex flex-col gap-6"
        >
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] uppercase tracking-[0.38em] text-gold mb-2">Arohamai Spa</p>
              <h2 className="font-display text-4xl md:text-5xl leading-none">{ritual.name}</h2>
            </div>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/25 transition-all flex-shrink-0 mt-1 ml-4"
            >
              ✕
            </button>
          </div>

          <p className="text-white/42 leading-relaxed italic text-sm">"{ritual.description}"</p>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-3">
            {([['Duration', ritual.duration], ['Heat', ritual.heatLevel], ['Pressure', ritual.pressure]] as const).map(([l, v]) => (
              <div key={l} className="border border-white/5 rounded-2xl p-3.5">
                <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1.5">{l}</p>
                <p className="text-gold text-[10px] font-mono leading-tight">{v}</p>
              </div>
            ))}
          </div>

          {/* Aroma profile */}
          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-3">Aroma Profile</p>
            <div className="flex flex-wrap gap-2">
              {ritual.aromaNotes.map((note) => (
                <span key={note} className="px-4 py-1.5 border border-gold/20 text-gold text-[8px] uppercase tracking-[0.22em] rounded-full">
                  {note}
                </span>
              ))}
            </div>
          </div>

          {/* BUG 5 FIX: CSS animation-delay, no JS timers */}
          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-4">Ritual Timeline</p>
            <div className="space-y-2">
              {ritual.timeline.map((step, i) => (
                <div
                  key={i}
                  className="timeline-step flex gap-3 items-start"
                  style={{ animationDelay: `${i * 60}ms` }}
                >
                  <div className="w-1 h-1 rounded-full bg-gold/38 mt-1.5 flex-shrink-0" />
                  <p className="text-white/42 text-xs font-mono">{step}</p>
                </div>
              ))}
            </div>
          </div>

          {/* BUG 3 FIX: scrollRef as viewport root */}
          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-4">Recovery Intelligence</p>
            <div className="space-y-3">
              <RecoveryMeter label="Stress Recovery"    value={ritual.recovery.stress}    containerRef={scrollRef} />
              <RecoveryMeter label="Sleep Quality"      value={ritual.recovery.sleep}     containerRef={scrollRef} />
              <RecoveryMeter label="Energy Restoration" value={ritual.recovery.energy}    containerRef={scrollRef} />
              <RecoveryMeter label="Emotional Reset"    value={ritual.recovery.emotional} containerRef={scrollRef} />
            </div>
          </div>

          {/* Add-ons */}
          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-3">Enhancements</p>
            <div className="flex flex-wrap gap-2">
              {ritual.addOns.map((addon) => (
                <span key={addon} className="px-3.5 py-1.5 border border-white/8 text-white/38 text-[8px] uppercase tracking-[0.18em] rounded-full hover:border-gold/22 hover:text-gold transition-all duration-300 cursor-pointer">
                  + {addon}
                </span>
              ))}
            </div>
          </div>

          {/* Soundscape */}
          <div className="border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-gold/18 flex items-center justify-center text-gold text-xs flex-shrink-0">♪</div>
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Soundscape</p>
              <p className="text-white/55 text-xs">{ritual.soundscape}</p>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="border-t border-white/5 pt-6">
            <div className="mb-5">
              <p className="text-[8px] uppercase tracking-[0.22em] text-white/18 mb-1">Investment</p>
              <p className="font-display text-4xl text-gold">KES {ritual.price.toLocaleString()}</p>
              <p className="text-[7px] uppercase tracking-[0.18em] text-white/18">{ritual.duration} · Per Session</p>
            </div>
            <div className="flex gap-3">
              <MagneticButton
                className="flex-1 btn-gold !py-4 !text-[10px]"
                onClick={addToCart}
              >
                ADD TO WELLNESS CART
              </MagneticButton>
              <Link
                href="/contact"
                className="px-7 py-4 border border-white/10 hover:border-gold/28 text-[9px] uppercase tracking-[0.22em] transition-all duration-500 rounded-full text-center whitespace-nowrap"
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}