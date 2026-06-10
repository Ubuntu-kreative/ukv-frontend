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
 * BUGS FIXED (from previous version):
 * BUG 1 — onClose infinite scroll thrash: fixed via useRef stable pattern
 * BUG 3 — RecoveryMeter never animating: fixed via scrollRef as viewport root
 * BUG 4 — FloatingParticles style accumulation: fixed via singleton guard
 * BUG 5 — JS timer stagger on timeline: replaced with CSS animation-delay
 *
 * TYPOGRAPHY FIX:
 * All text sizes scaled to readable proportions:
 *   • Labels/eyebrows: text-xs (12px) — was 7–9px
 *   • Body copy: text-sm (14px) — was 11–12px
 *   • Subheadings: text-base / text-lg — was 10–11px
 *   • Headings: text-3xl / text-4xl — unchanged (already good)
 *   • Prices: text-4xl / text-5xl — unchanged
 * Font families:
 *   • All headings: font-display (your brand display font)
 *   • All body/labels: font-sans with proper weight
 *   • Mono elements (mood, soundscape, timeline): font-mono
 *
 * ANIMATION FIX:
 * Modal entry changed from scale(0.97)+fade to a cinematic upward reveal
 * with a staggered content fade — feels professional and seamless.
 */

import { useState, useEffect, useRef, useCallback } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'

import { useCartStore } from '@/context/cartStore'
import { RITUAL_ACCENTS, DEFAULT_ACCENT, type Ritual } from '../_data/spa-data'

// ─── ANIMATION CONSTANTS — module-level, never recreated ─────────────────────
const SLOW_EASE: [number, number, number, number] = [0.16, 1, 0.3, 1]

// Cinematic upward reveal — more professional than a plain scale
const BACKDROP_VARIANTS = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25 } },
}

const PANEL_VARIANTS = {
  hidden:  { opacity: 0, y: 48, scale: 0.98 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { duration: 0.55, ease: SLOW_EASE },
  },
  exit: {
    opacity: 0, y: 24, scale: 0.97,
    transition: { duration: 0.3, ease: [0.4, 0, 1, 1] as [number, number, number, number] },
  },
}

// Stagger children inside the content panel
const CONTENT_VARIANTS = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.18 } },
}

const ITEM_VARIANTS = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: SLOW_EASE } },
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
      <div className="flex justify-between mb-2 text-xs uppercase tracking-[0.2em] text-white/50 font-sans">
        <span>{label}</span>
        <span className="text-gold font-medium">{value}%</span>
      </div>
      <div className="h-[3px] bg-white/8 overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          viewport={{ once: true, root: containerRef }}
          className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full"
        />
      </div>
    </div>
  )
}

// ─── MAGNETIC BUTTON ─────────────────────────────────────────────────────────
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

// ─── STAT PILL ───────────────────────────────────────────────────────────────
function StatPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/8 rounded-2xl p-4 flex flex-col gap-1.5 bg-white/[0.02]">
      <p className="text-xs uppercase tracking-[0.25em] text-white/30 font-sans">{label}</p>
      <p className="text-gold text-sm font-mono font-medium leading-tight">{value}</p>
    </div>
  )
}

// ─── MODAL ───────────────────────────────────────────────────────────────────

interface RitualModalProps {
  ritual:  Ritual
  onClose: () => void
}

export default function RitualModal({ ritual, onClose }: RitualModalProps) {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  const accent    = RITUAL_ACCENTS[ritual.id] ?? DEFAULT_ACCENT
  const addItem   = useCartStore((s) => s.addItem)
  const scrollRef = useRef<HTMLDivElement>(null)

  // BUG 1 FIX: stable ref pattern — effect runs ONCE (empty deps []).
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
  }, [])

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

  if (!mounted) return null

  return createPortal(
    <AnimatePresence mode="wait">
      <motion.div
        key="ritual-modal-backdrop"
        variants={BACKDROP_VARIANTS}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center sm:p-4 md:p-6"
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={ritual.name}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/88 backdrop-blur-2xl" />

        {/* ── Panel ── */}
        <motion.div
          variants={PANEL_VARIANTS}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden border border-white/10 bg-[#080808] shadow-[0_40px_120px_rgba(0,0,0,0.9)]"
          style={{ maxHeight: 'min(calc(100vh - 2rem), 90vh)' }}
        >

          {/* ── LEFT: image panel ── */}
          <div className="relative lg:w-[40%] min-h-[240px] sm:min-h-[320px] lg:min-h-0 flex-shrink-0 overflow-hidden">
            <Image
              src={ritual.image}
              alt={ritual.name}
              fill
              sizes="(max-width:1024px) 100vw, 40vw"
              className="object-cover"
              priority
            />
            {/* Layered overlays */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/60 lg:bg-gradient-to-r lg:from-transparent lg:to-[#080808]" />
            <div
              className="absolute inset-0 opacity-60"
              style={{ background: `radial-gradient(circle at 50% 50%, ${accent.glow}, transparent 68%)` }}
            />
            {/* Floating particles */}
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
            {/* Badges */}
            <div className="absolute top-5 left-5 flex flex-wrap gap-2 z-10">
              <span className="px-3.5 py-1.5 text-xs uppercase tracking-[0.22em] border border-gold/30 bg-black/55 backdrop-blur-xl text-gold rounded-full font-medium">
                {ritual.categoryTag}
              </span>
              <span className="px-3.5 py-1.5 text-xs uppercase tracking-[0.22em] border border-white/12 bg-black/45 backdrop-blur-xl text-white/65 rounded-full">
                {ritual.status}
              </span>
            </div>
            {/* Accent label bottom */}
            <div className="absolute bottom-5 left-5 z-10">
              <p className="text-xs uppercase tracking-[0.28em] text-gold/50 font-sans">{accent.label}</p>
            </div>
          </div>

          {/* ── RIGHT: content panel ── */}
          <motion.div
            ref={scrollRef}
            variants={CONTENT_VARIANTS}
            initial="hidden"
            animate="visible"
            className="lg:w-[60%] overflow-y-auto p-7 md:p-10 flex flex-col gap-7"
          >

            {/* Header row */}
            <motion.div variants={ITEM_VARIANTS} className="flex justify-between items-start gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-gold mb-2.5 font-sans font-medium">
                  Arohamai Spa
                </p>
                <h2 className="font-display text-4xl md:text-5xl leading-[0.9] text-white">
                  {ritual.name}
                </h2>
              </div>
              <button
                onClick={onClose}
                aria-label="Close modal"
                className="w-10 h-10 rounded-full border border-white/12 flex items-center justify-center text-white/35 hover:text-white hover:border-white/30 transition-all flex-shrink-0 mt-1 ml-2 text-sm"
              >
                ✕
              </button>
            </motion.div>

            {/* Description */}
            <motion.p variants={ITEM_VARIANTS} className="text-white/55 leading-relaxed italic text-[15px] font-light border-l-2 border-gold/20 pl-4">
              &ldquo;{ritual.description}&rdquo;
            </motion.p>

            {/* Stats grid */}
            <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-3 gap-3">
              <StatPill label="Duration" value={ritual.duration} />
              <StatPill label="Heat"     value={ritual.heatLevel} />
              <StatPill label="Pressure" value={ritual.pressure} />
            </motion.div>

            {/* Mood + Soundscape row */}
            <motion.div variants={ITEM_VARIANTS} className="grid grid-cols-2 gap-3">
              <div className="border border-white/5 rounded-2xl p-4 bg-white/[0.02]">
                <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-1.5 font-sans">Mood</p>
                <p className="text-gold text-sm font-mono">{ritual.mood}</p>
              </div>
              <div className="border border-white/5 rounded-2xl p-4 bg-white/[0.02] flex items-start gap-3">
                <div className="w-8 h-8 rounded-full border border-gold/20 flex items-center justify-center text-gold text-sm flex-shrink-0 mt-0.5">♪</div>
                <div>
                  <p className="text-xs uppercase tracking-[0.25em] text-white/30 mb-1.5 font-sans">Soundscape</p>
                  <p className="text-white/60 text-sm font-sans leading-snug">{ritual.soundscape}</p>
                </div>
              </div>
            </motion.div>

            {/* Aroma profile */}
            {ritual.aromaNotes && ritual.aromaNotes.length > 0 && (
              <motion.div variants={ITEM_VARIANTS}>
                <p className="text-xs uppercase tracking-[0.28em] text-white/30 mb-3 font-sans">Aroma Profile</p>
                <div className="flex flex-wrap gap-2">
                  {ritual.aromaNotes.map((note) => (
                    <span key={note} className="px-4 py-1.5 border border-gold/22 text-gold text-xs uppercase tracking-[0.18em] rounded-full font-medium">
                      {note}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Ritual timeline */}
            {ritual.timeline && ritual.timeline.length > 0 && (
              <motion.div variants={ITEM_VARIANTS}>
                <p className="text-xs uppercase tracking-[0.28em] text-white/30 mb-4 font-sans">Ritual Timeline</p>
                <div className="space-y-3">
                  {ritual.timeline.map((step, i) => (
                    <div
                      key={i}
                      className="timeline-step flex gap-3 items-start"
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-gold/45 mt-[5px] flex-shrink-0" />
                      <p className="text-white/55 text-sm font-sans leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Recovery intelligence — BUG 3 FIX: scrollRef as viewport root */}
            <motion.div variants={ITEM_VARIANTS}>
              <p className="text-xs uppercase tracking-[0.28em] text-white/30 mb-4 font-sans">Recovery Intelligence</p>
              <div className="space-y-4">
                <RecoveryMeter label="Stress Recovery"    value={ritual.recovery.stress}    containerRef={scrollRef} />
                <RecoveryMeter label="Sleep Quality"      value={ritual.recovery.sleep}     containerRef={scrollRef} />
                <RecoveryMeter label="Energy Restoration" value={ritual.recovery.energy}    containerRef={scrollRef} />
                <RecoveryMeter label="Emotional Reset"    value={ritual.recovery.emotional} containerRef={scrollRef} />
              </div>
            </motion.div>

            {/* Add-ons */}
            {ritual.addOns && ritual.addOns.length > 0 && (
              <motion.div variants={ITEM_VARIANTS}>
                <p className="text-xs uppercase tracking-[0.28em] text-white/30 mb-3 font-sans">Enhancements</p>
                <div className="flex flex-wrap gap-2">
                  {ritual.addOns.map((addon) => (
                    <span
                      key={addon}
                      className="px-4 py-2 border border-white/10 text-white/45 text-xs uppercase tracking-[0.15em] rounded-full hover:border-gold/25 hover:text-gold transition-all duration-300 cursor-pointer font-sans"
                    >
                      + {addon}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Footer CTA */}
            <motion.div variants={ITEM_VARIANTS} className="border-t border-white/8 pt-7 mt-auto">
              <div className="flex items-end justify-between mb-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-white/22 mb-1.5 font-sans">Investment</p>
                  <p className="font-display text-4xl md:text-5xl text-gold leading-none">
                    KES {ritual.price.toLocaleString()}
                  </p>
                  <p className="text-xs uppercase tracking-[0.18em] text-white/22 mt-1.5 font-sans">
                    {ritual.duration} · Per Session
                  </p>
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-white/20 font-sans">Arohamai Spa</span>
              </div>
              <div className="flex gap-3">
                <MagneticButton
                  className="flex-1 btn-gold !py-4 !text-[11px] !tracking-[0.2em]"
                  onClick={addToCart}
                >
                  ADD TO WELLNESS CART
                </MagneticButton>
                <Link
                  href="/contact"
                  className="px-7 py-4 border border-white/12 hover:border-gold/30 text-sm uppercase tracking-[0.2em] transition-all duration-500 rounded-full text-center whitespace-nowrap text-white/55 hover:text-gold"
                >
                  BOOK NOW
                </Link>
              </div>
            </motion.div>

          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  )
}