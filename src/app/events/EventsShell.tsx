'use client'

// app/events/EventsShell.tsx — MERGED CLIENT COMPONENT
// Base: redesigned v2 (FeaturedEvent, QuickFact, category counts, StickyBookingSummary, expandable cards)
// Restored: full EventDrawer modal from v1 (gallery slideshow, swipe, keyboard nav, scroll lock)

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { motion, AnimatePresence, useScroll, useTransform, LayoutGroup } from 'framer-motion'
import Link from 'next/link'
import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import type { UKVEvent, EventType, ConferenceRate, BuffetMenu, CancellationTier } from './eventsData'

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  events: UKVEvent[]
  eventTypes: EventType[]
  categoryColors: Record<string, string>
  conferenceRates: ConferenceRate[]
  buffetMenus: BuffetMenu[]
  cancellationPolicy: CancellationTier[]
}

// ─── Badge definitions ────────────────────────────────────────────────────────

const EVENT_BADGES: Record<string, string> = {
  'harvest-dinner-may': 'Signature Experience',
  'sunrise-farm-walk': 'Most Popular',
  'ubuntu-wedding': 'Private Booking',
  'day-conference': 'Corporate Favourite',
  'corporate-retreat': 'Limited Availability',
  'new-moon-fire': 'Seasonal',
  'school-farm-day': 'Family Friendly',
}

// ─── Small atoms ──────────────────────────────────────────────────────────────

function Eyebrow({
  children,
  color = 'rgba(255,255,255,0.28)',
  className = '',
}: {
  children: React.ReactNode
  color?: string
  className?: string
}) {
  return (
    <span
      className={`font-body text-[9px] uppercase tracking-[0.14em] ${className}`}
      style={{ color }}
    >
      {children}
    </span>
  )
}

function AccentLine({ color }: { color: string }) {
  return (
    <div
      aria-hidden
      style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 1,
        background: `linear-gradient(90deg, transparent, ${color}, transparent)`,
        opacity: 0.6,
      }}
    />
  )
}

function QuickFact({
  icon,
  label,
  value,
  accent,
}: {
  icon: string
  label: string
  value: string
  accent: string
}) {
  return (
    <div className="flex items-start gap-2">
      <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: accent }}>{icon}</span>
      <div>
        <span className="block text-[8px] uppercase tracking-widest font-body mb-0.5" style={{ color: 'rgba(255,255,255,0.28)' }}>
          {label}
        </span>
        <span className="block font-body text-[11px] text-cream leading-snug">{value}</span>
      </div>
    </div>
  )
}

// ─── Ambient background ───────────────────────────────────────────────────────

const ATMOSPHERES: Record<string, string> = {
  'Dining Experience': 'radial-gradient(ellipse 70% 50% at 30% 60%, rgba(212,168,83,0.18) 0%, transparent 65%)',
  'Farm Experience':   'radial-gradient(ellipse 70% 50% at 30% 60%, rgba(0,255,65,0.10) 0%, transparent 65%)',
  'Weddings':          'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(240,168,184,0.16) 0%, transparent 65%)',
  'Corporate':         'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(184,169,240,0.14) 0%, transparent 65%)',
  'Community':         'radial-gradient(ellipse 70% 50% at 60% 60%, rgba(168,216,240,0.14) 0%, transparent 65%)',
  'Education':         'radial-gradient(ellipse 70% 50% at 40% 50%, rgba(168,240,216,0.12) 0%, transparent 65%)',
  'All':               'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(30,16,44,0.7) 0%, transparent 60%)',
}

// ─── Cinematic hero reel ──────────────────────────────────────────────────────

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=90',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90',
  'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=90',
]

function CinematicReel({ visible }: { visible: boolean }) {
  const [frame, setFrame] = useState(0)
  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => setFrame(f => (f + 1) % HERO_IMAGES.length), 5000)
    return () => clearInterval(t)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 28, delay: 0.2 }}
          className="absolute top-[8%] right-0 w-[clamp(300px,42vw,600px)] h-[78%] overflow-hidden rounded-tl-3xl rounded-bl-3xl"
          style={{ zIndex: 3 }}
        >
          <AnimatePresence mode="wait">
            <motion.img
              key={frame}
              src={HERO_IMAGES[frame]}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="w-full h-full object-cover"
              style={{ filter: 'saturate(0.75) contrast(1.1)' }}
              alt="Ubuntu Kreative Village Events"
            />
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─── Gallery Hook ─────────────────────────────────────────────────────────────

function useGallery(images: string[], autoAdvanceMs = 4500) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  const touchStartX = useRef<number | null>(null)
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = images.length

  const go = useCallback((newIndex: number, dir: 1 | -1) => {
    setDirection(dir)
    setIndex((newIndex + total) % total)
  }, [total])

  const next = useCallback(() => go(index + 1, 1), [index, go])
  const prev = useCallback(() => go(index - 1, -1), [index, go])

  useEffect(() => {
    if (total <= 1) return
    autoRef.current = setInterval(next, autoAdvanceMs)
    return () => { if (autoRef.current) clearInterval(autoRef.current) }
  }, [next, total, autoAdvanceMs])

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current)
    if (total > 1) autoRef.current = setInterval(next, autoAdvanceMs)
  }, [next, total, autoAdvanceMs])

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }, [])

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const dx = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(dx) < 40) return
    if (dx < 0) { go(index + 1, 1); resetAuto() }
    else { go(index - 1, -1); resetAuto() }
  }, [index, go, resetAuto])

  const goTo = useCallback((i: number) => {
    setDirection(i > index ? 1 : -1)
    setIndex(i)
    resetAuto()
  }, [index, resetAuto])

  return { index, direction, next, prev, goTo, onTouchStart, onTouchEnd }
}

// ─── Slide variants ───────────────────────────────────────────────────────────

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? '100%' : '-100%', opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit:  (dir: number) => ({ x: dir > 0 ? '-100%' : '100%', opacity: 0 }),
}

// ─── Event Detail Drawer ──────────────────────────────────────────────────────

function EventDrawer({
  event,
  onClose,
  accent,
}: {
  event: UKVEvent | null
  onClose: () => void
  accent: string
}) {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  const images = event ? (event.gallery ?? [event.image]) : []
  const gallery = useGallery(images)

  useEffect(() => {
    setPortalTarget(document.body)
  }, [])

  useEffect(() => {
    gallery.goTo(0)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event?.id])

  useEffect(() => {
    if (!event) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') gallery.next()
      if (e.key === 'ArrowLeft')  gallery.prev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [event, onClose, gallery.next, gallery.prev])

  useEffect(() => {
    if (event && drawerRef.current) drawerRef.current.focus()
  }, [event])

  if (!portalTarget) return null

  return createPortal(
    <AnimatePresence>
      {event && (
        <motion.div
          key="drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[2000] bg-black/80 backdrop-blur-sm flex justify-end"
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-label={event.title}
        >
          {/* Drawer panel */}
          <motion.div
            key="drawer-panel"
            ref={drawerRef}
            tabIndex={-1}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            onClick={e => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-[#0c0c0e] border-l border-white/8 h-full overflow-y-auto outline-none"
            style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(255,255,255,0.08) transparent' }}
          >
            {/* Accent strip */}
            <div
              className="absolute top-0 left-0 right-0 h-[2px]"
              style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
            />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full border border-white/10 bg-black/50 flex items-center justify-center text-white/50 hover:text-cream hover:border-white/25 transition-colors duration-200"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </button>

            {/* ── Hero image slideshow ── */}
            <div
              className="relative h-72 overflow-hidden select-none"
              onTouchStart={gallery.onTouchStart}
              onTouchEnd={gallery.onTouchEnd}
            >
              <AnimatePresence initial={false} custom={gallery.direction}>
                <motion.img
                  key={gallery.index}
                  src={images[gallery.index]}
                  custom={gallery.direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.45, ease: [0.32, 0, 0.67, 0] }}
                  className="absolute inset-0 w-full h-full object-cover"
                  alt={`${event.title} — image ${gallery.index + 1}`}
                  style={{ filter: 'saturate(0.8)' }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Gradient fade */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] via-transparent to-transparent pointer-events-none" />

              {/* Arrow buttons */}
              {images.length > 1 && (
                <>
                  <button
                    onClick={e => { e.stopPropagation(); gallery.prev() }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/55 border border-white/12 flex items-center justify-center text-white/70 hover:text-cream hover:bg-black/80 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Previous image"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M8.5 2.5L4 7l4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                  <button
                    onClick={e => { e.stopPropagation(); gallery.next() }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/55 border border-white/12 flex items-center justify-center text-white/70 hover:text-cream hover:bg-black/80 hover:border-white/30 transition-all duration-200 backdrop-blur-sm"
                    aria-label="Next image"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M5.5 2.5L10 7l-4.5 4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </button>
                </>
              )}

              {/* Progress bar + dot indicators */}
              {images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none">
                  <div className="w-28 h-[2px] rounded-full bg-white/15 overflow-hidden">
                    <motion.div
                      key={gallery.index}
                      className="h-full rounded-full"
                      style={{ background: accent }}
                      initial={{ width: '0%' }}
                      animate={{ width: '100%' }}
                      transition={{ duration: 4.5, ease: 'linear' }}
                    />
                  </div>
                  <div className="flex gap-1.5 pointer-events-auto">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        onClick={e => { e.stopPropagation(); gallery.goTo(i) }}
                        className="transition-all duration-200"
                        style={{
                          width: i === gallery.index ? 20 : 6,
                          height: 6,
                          borderRadius: 3,
                          background: i === gallery.index ? accent : 'rgba(255,255,255,0.25)',
                        }}
                        aria-label={`Go to image ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Image counter */}
              {images.length > 1 && (
                <span className="absolute top-4 left-4 text-[10px] font-mono text-white/40 bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {gallery.index + 1} / {images.length}
                </span>
              )}
            </div>

            {/* ── Content ── */}
            <div className="px-8 md:px-10 pb-16 pt-6">

              {/* Header */}
              <Eyebrow color={accent} className="mb-2">{event.category}</Eyebrow>
              <h2 className="font-display text-4xl md:text-5xl font-light text-cream mt-1 mb-1">
                {event.title}
              </h2>
              <p className="font-body text-sm text-white/40 italic mb-6">{event.cinematic}</p>

              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-3 mb-8 p-5 rounded-xl bg-white/[0.03] border border-white/5">
                {([
                  ['When', event.date],
                  ['Time', `${event.time} · ${event.duration}`],
                  ['Capacity', `${event.capacity} guests`],
                  ['Availability', event.spotsLeft < 20 ? `${event.spotsLeft} spots remaining` : 'Open'],
                ] as [string, string][]).map(([label, value]) => (
                  <div key={label}>
                    <span className="block text-[9px] uppercase tracking-widest text-white/25 font-body mb-0.5">{label}</span>
                    <span className="font-body text-sm text-cream font-medium">{value}</span>
                  </div>
                ))}
              </div>

              {/* Description */}
              <p className="font-body text-sm text-white/60 leading-relaxed mb-8">
                {event.description}
              </p>

              {/* Philosophy */}
              {event.philosophy && (
                <div className="mb-8 pl-5 border-l-2" style={{ borderColor: accent }}>
                  <Eyebrow color={accent} className="mb-2">The Philosophy</Eyebrow>
                  <p className="font-body text-sm text-white/50 leading-relaxed italic">
                    {event.philosophy}
                  </p>
                </div>
              )}

              {/* The Journey */}
              {event.journey && event.journey.length > 0 && (
                <div className="mb-8">
                  <Eyebrow color="rgba(255,255,255,0.3)" className="mb-4">The Journey</Eyebrow>
                  <ol className="space-y-3">
                    {event.journey.map((step, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span
                          className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-mono mt-0.5"
                          style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                        >
                          {i + 1}
                        </span>
                        <span className="font-body text-sm text-white/60 leading-relaxed">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}

              {/* Spaces */}
              {event.spaces && event.spaces.length > 0 && (
                <div className="mb-8">
                  <Eyebrow color="rgba(255,255,255,0.3)" className="mb-4">The Spaces</Eyebrow>
                  <div className="space-y-3">
                    {event.spaces.map(s => (
                      <div key={s.name} className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                        <p className="font-body text-xs font-semibold text-cream mb-1">{s.name}</p>
                        <p className="font-body text-xs text-white/40 leading-relaxed">{s.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* What's included */}
              <div className="mb-8">
                <Eyebrow color="rgba(255,255,255,0.3)" className="mb-4">What's Included</Eyebrow>
                <ul className="space-y-2">
                  {event.includes.map((inc, i) => (
                    <li key={i} className="flex items-center gap-3 font-body text-sm text-white/55">
                      <span style={{ color: accent }} className="text-xs">✦</span>
                      {inc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Testimonial */}
              {event.testimonial && (
                <figure className="mb-10 p-5 rounded-2xl bg-white/[0.03] border border-white/5">
                  <blockquote className="font-display text-lg font-light text-cream/80 leading-snug mb-3">
                    "{event.testimonial.quote}"
                  </blockquote>
                  <figcaption className="font-body text-xs text-white/30">
                    — {event.testimonial.author}, {event.testimonial.location}
                  </figcaption>
                </figure>
              )}

              {/* Sticky CTA */}
              <div
                className="sticky bottom-0 -mx-8 md:-mx-10 px-8 md:px-10 pt-5 pb-6 border-t border-white/8 flex items-center justify-between gap-4"
                style={{ background: '#0c0c0e' }}
              >
                <div>
                  <span className="block text-[9px] uppercase tracking-widest text-white/25 font-body mb-0.5">Investment</span>
                  <span className="font-mono text-2xl text-cream">
                    {event.price > 0 ? `KES ${event.price.toLocaleString()}` : 'Price on request'}
                  </span>
                  {event.price > 0 && (
                    <span className="block text-[9px] text-white/30 font-body">per person</span>
                  )}
                </div>
                <Link
                  href="/contact"
                  onClick={onClose}
                  className="px-7 py-3.5 rounded-xl font-body text-xs uppercase tracking-widest font-semibold transition-colors duration-200 hover:opacity-90"
                  style={{ background: accent, color: '#0c0c0e' }}
                >
                  {event.status === 'Enquire' ? 'Begin Enquiry' : 'Reserve Your Place'}
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget,
  )
}

// ─── Improved Event Card ──────────────────────────────────────────────────────

function EventCard({
  ev,
  accent,
  isExpanded,
  onToggle,
  onBook,
}: {
  ev: UKVEvent
  accent: string
  isExpanded: boolean
  onToggle: () => void
  onBook: () => void
}) {
  const badge = EVENT_BADGES[ev.id]
  const availabilityLabel = ev.spotsLeft <= 5
    ? `Only ${ev.spotsLeft} left`
    : ev.spotsLeft <= 10
    ? `${ev.spotsLeft} spots`
    : ev.status === 'Enquire' ? 'By enquiry' : 'Open'
  const availabilityColor = ev.spotsLeft <= 5 ? '#ff8080'
    : ev.spotsLeft <= 10 ? '#ffbb55'
    : 'var(--neon)'

  return (
    <motion.div
      layout
      className="relative flex flex-col bg-black/30 border border-white/5 rounded-2xl overflow-hidden group hover:bg-white/[0.015] transition-colors duration-500"
    >
      <AccentLine color={accent} />

      {/* ── Image — clicking anywhere here opens the drawer ── */}
      <div
        className="h-44 overflow-hidden relative flex-shrink-0 cursor-pointer"
        onClick={onBook}
        role="button"
        tabIndex={0}
        aria-label={`Open details for ${ev.title}`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onBook()
          }
        }}
      >
        <img
          src={ev.image}
          alt={ev.title}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <span
          className="absolute top-3 left-3 text-[8px] font-body uppercase tracking-widest px-2.5 py-1 rounded-full bg-black/60 border border-white/10"
          style={{ color: accent }}
        >
          {ev.category}
        </span>

        <span
          className="absolute top-3 right-3 text-[8px] font-mono tracking-widest px-2.5 py-1 rounded-full bg-black/70 border"
          style={{ color: availabilityColor, borderColor: `${availabilityColor}40` }}
        >
          {availabilityLabel}
        </span>

        {badge && (
          <span
            className="absolute bottom-3 left-3 text-[8px] font-body uppercase tracking-widest px-2.5 py-1 rounded-full"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}35` }}
          >
            {badge}
          </span>
        )}
      </div>

      {/* Card body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-display text-xl font-light text-cream mb-0.5 group-hover:text-gold transition-colors duration-300">
          {ev.title}
        </h3>
        <p className="font-body text-[10px] text-white/40 italic mb-4 leading-relaxed">{ev.cinematic}</p>

        {/* Quick facts — always visible */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4 pb-4 border-b border-white/5">
          <QuickFact icon="📅" label="Schedule" value={ev.date} accent={accent} />
          <QuickFact icon="⏱" label="Duration" value={ev.duration} accent={accent} />
          <QuickFact icon="👥" label="Capacity" value={`${ev.capacity} guests`} accent={accent} />
          <QuickFact icon="🕐" label="Starts" value={ev.time} accent={accent} />
        </div>

        {/* Expandable details */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.35, ease: [0.32, 0, 0.67, 0] }}
              className="overflow-hidden"
            >
              <div className="pb-4 space-y-5">
                <p className="font-body text-xs text-white/55 leading-relaxed">{ev.description}</p>

                {ev.philosophy && (
                  <div className="pl-4 border-l-2" style={{ borderColor: accent }}>
                    <Eyebrow color={accent} className="mb-1.5">The Philosophy</Eyebrow>
                    <p className="font-body text-xs text-white/45 leading-relaxed italic">{ev.philosophy}</p>
                  </div>
                )}

                {ev.journey && ev.journey.length > 0 && (
                  <div>
                    <Eyebrow color="rgba(255,255,255,0.3)" className="mb-3">The Journey</Eyebrow>
                    <ol className="space-y-2">
                      {ev.journey.map((step, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span
                            className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-mono mt-0.5"
                            style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                          >
                            {i + 1}
                          </span>
                          <span className="font-body text-xs text-white/55 leading-relaxed">{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}

                {ev.spaces && ev.spaces.length > 0 && (
                  <div>
                    <Eyebrow color="rgba(255,255,255,0.3)" className="mb-3">The Spaces</Eyebrow>
                    <div className="space-y-2">
                      {ev.spaces.map(s => (
                        <div key={s.name} className="p-3 rounded-xl bg-white/[0.03] border border-white/5">
                          <p className="font-body text-[10px] font-semibold text-cream mb-0.5">{s.name}</p>
                          <p className="font-body text-[10px] text-white/40 leading-relaxed">{s.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <Eyebrow color="rgba(255,255,255,0.3)" className="mb-3">What's Included</Eyebrow>
                  <ul className="space-y-1.5">
                    {ev.includes.map((inc, i) => (
                      <li key={i} className="flex items-center gap-2.5 font-body text-xs text-white/55">
                        <span style={{ color: accent }} className="text-[9px]">✦</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>

                {ev.testimonial && (
                  <figure className="p-4 rounded-xl bg-white/[0.03] border border-white/5">
                    <blockquote className="font-display text-base font-light text-cream/80 leading-snug mb-2">
                      "{ev.testimonial.quote}"
                    </blockquote>
                    <figcaption className="font-body text-[10px] text-white/30">
                      — {ev.testimonial.author}, {ev.testimonial.location}
                    </figcaption>
                  </figure>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle expand */}
        <button
          onClick={onToggle}
          className="self-start flex items-center gap-1.5 text-[10px] font-body uppercase tracking-widest text-white/30 hover:text-cream transition-colors duration-200 mt-auto pt-1"
          aria-expanded={isExpanded}
        >
          <motion.span
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
            className="inline-block"
          >
            ▾
          </motion.span>
          {isExpanded ? 'Collapse' : 'Full Experience'}
        </button>
      </div>

      {/* Card footer */}
      <div className="px-5 pb-5 pt-3 border-t border-white/5 flex items-center justify-between gap-3">
        <div>
          <span className="block text-[8px] uppercase tracking-widest text-white/25 font-body mb-0.5">Investment</span>
          <span className="font-mono text-lg text-cream">
            {ev.price > 0 ? `KES ${ev.price.toLocaleString()}` : 'Price on request'}
          </span>
          {ev.price > 0 && (
            <span className="block text-[8px] text-white/25 font-body">per person</span>
          )}
        </div>
        <button
          onClick={onBook}
          className="px-5 py-2.5 rounded-xl font-body text-[10px] uppercase tracking-widest font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 flex-shrink-0"
          style={{ background: accent, color: '#0c0c0e' }}
        >
          {ev.status === 'Enquire' ? 'Enquire' : 'Reserve'}
        </button>
      </div>
    </motion.div>
  )
}

// ─── Featured Event ───────────────────────────────────────────────────────────

function FeaturedEvent({
  ev,
  accent,
  onBook,
}: {
  ev: UKVEvent
  accent: string
  onBook: () => void
}) {
  const badge = EVENT_BADGES[ev.id]
  const availabilityLabel = ev.spotsLeft <= 10 ? `${ev.spotsLeft} spots remaining` : 'Open'
  const availabilityColor = ev.spotsLeft <= 5 ? '#ff8080' : ev.spotsLeft <= 10 ? '#ffbb55' : 'var(--neon)'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="relative rounded-3xl overflow-hidden border border-white/8 mb-7"
      style={{ background: 'rgba(0,0,0,0.35)' }}
    >
      <AccentLine color={accent} />

      <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[340px]">
        {/* Image */}
        <div className="lg:col-span-3 relative h-56 lg:h-auto overflow-hidden">
          <img
            src={ev.image}
            alt={ev.title}
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.8) contrast(1.05)' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/90 hidden lg:block" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent lg:hidden" />

          <div
            className="absolute top-5 left-5 flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: `${accent}22`, border: `1px solid ${accent}40` }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: accent }} />
            <span className="font-body text-[9px] uppercase tracking-widest" style={{ color: accent }}>
              Featured Experience
            </span>
          </div>

          {badge && (
            <span
              className="absolute bottom-5 left-5 text-[8px] font-body uppercase tracking-widest px-2.5 py-1 rounded-full"
              style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}35` }}
            >
              {badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="lg:col-span-2 p-7 flex flex-col justify-between">
          <div>
            <Eyebrow color={accent} className="mb-2">{ev.category}</Eyebrow>
            <h3 className="font-display text-3xl md:text-4xl font-light text-cream mt-1 mb-1">
              {ev.title}
            </h3>
            <p className="font-body text-xs text-white/40 italic mb-5">{ev.cinematic}</p>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <QuickFact icon="📅" label="Schedule" value={ev.date} accent={accent} />
              <QuickFact icon="⏱" label="Duration" value={ev.duration} accent={accent} />
              <QuickFact icon="👥" label="Capacity" value={`${ev.capacity} guests`} accent={accent} />
              <div className="flex items-start gap-2">
                <span className="text-xs mt-0.5 flex-shrink-0" style={{ color: availabilityColor }}>◉</span>
                <div>
                  <span className="block text-[8px] uppercase tracking-widest font-body mb-0.5 text-white/28">
                    Availability
                  </span>
                  <span className="block font-body text-[11px] leading-snug" style={{ color: availabilityColor }}>
                    {availabilityLabel}
                  </span>
                </div>
              </div>
            </div>

            <p className="font-body text-xs text-white/50 leading-relaxed line-clamp-3 mb-5">
              {ev.description}
            </p>
          </div>

          <div className="flex items-center justify-between gap-4 pt-4 border-t border-white/5">
            <div>
              <span className="block text-[8px] uppercase tracking-widest text-white/25 font-body mb-0.5">Investment</span>
              <span className="font-mono text-2xl text-cream">
                {ev.price > 0 ? `KES ${ev.price.toLocaleString()}` : 'Price on request'}
              </span>
              {ev.price > 0 && (
                <span className="block text-[8px] text-white/25 font-body">per person</span>
              )}
            </div>
            <button
              onClick={onBook}
              className="px-6 py-3 rounded-xl font-body text-[10px] uppercase tracking-widest font-semibold transition-all duration-200 hover:opacity-90 active:scale-95 flex-shrink-0"
              style={{ background: accent, color: '#0c0c0e' }}
            >
              {ev.status === 'Enquire' ? 'Begin Enquiry' : 'Reserve a Place'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─── Sticky Booking Summary ───────────────────────────────────────────────────

function StickyBookingSummary({
  event,
  accent,
  onDismiss,
}: {
  event: UKVEvent | null
  accent: string
  onDismiss: () => void
}) {
  const [portalTarget, setPortalTarget] = useState<Element | null>(null)
  useEffect(() => { setPortalTarget(document.body) }, [])
  if (!portalTarget) return null

  return createPortal(
    <AnimatePresence>
      {event && (
        <motion.div
          key="sticky-booking"
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: 'spring', damping: 28, stiffness: 220 }}
          className="fixed bottom-6 right-6 z-[900] w-72 rounded-2xl border border-white/10 overflow-hidden shadow-2xl"
          style={{ background: '#0e0e10' }}
        >
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }}
          />

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <Eyebrow color={accent} className="mb-1">Selected Event</Eyebrow>
                <h4 className="font-display text-lg font-light text-cream leading-tight">{event.title}</h4>
              </div>
              <button
                onClick={onDismiss}
                className="w-7 h-7 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-cream transition-colors duration-200 flex-shrink-0 mt-0.5"
                aria-label="Dismiss"
              >
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <path d="M1 1l8 8M9 1L1 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </button>
            </div>

            <div className="space-y-1.5 mb-4 pb-4 border-b border-white/5">
              <div className="flex items-center justify-between text-[10px] font-body">
                <span className="text-white/35">Date / Time</span>
                <span className="text-cream">{event.date} · {event.time}</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-body">
                <span className="text-white/35">Capacity</span>
                <span className="text-cream">{event.capacity} guests</span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-body">
                <span className="text-white/35">Availability</span>
                <span className="text-cream">
                  {event.spotsLeft <= 10 ? `${event.spotsLeft} spots` : 'Open'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-xl text-cream">
                {event.price > 0 ? `KES ${event.price.toLocaleString()}` : 'POA'}
              </span>
              <Link
                href="/contact"
                className="px-4 py-2.5 rounded-xl font-body text-[9px] uppercase tracking-widest font-semibold transition-all duration-200 hover:opacity-90"
                style={{ background: accent, color: '#0c0c0e' }}
              >
                {event.status === 'Enquire' ? 'Enquire Now' : 'Reserve Now'}
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalTarget,
  )
}

// ─── Conference Pricing Section ───────────────────────────────────────────────

function ConferencePricingSection({
  rates,
  buffets,
  policy,
}: {
  rates: ConferenceRate[]
  buffets: BuffetMenu[]
  policy: CancellationTier[]
}) {
  const [tab, setTab] = useState<'packages' | 'buffet' | 'cancellation'>('packages')
  const accent = '#B8A9F0'

  const buffetRows = buffets.filter(b => ['buffet-1','buffet-2','buffet-3'].includes(b.id))
  const INCLUSIONS = ['Soup','Salads','Protein','Carbs','Veggies','Dessert','Soft Drinks','Tea / Coffee']
  const BUFFET_MAP: Record<string, Record<string, string>> = {
    'buffet-1': { Soup: '✓', Salads: '1', Protein: '1', Carbs: '2', Veggies: '1', Dessert: '1', 'Soft Drinks': '—', 'Tea / Coffee': '✓' },
    'buffet-2': { Soup: '✓', Salads: '2', Protein: '2', Carbs: '2', Veggies: '1', Dessert: '1', 'Soft Drinks': '—', 'Tea / Coffee': '✓' },
    'buffet-3': { Soup: '✓', Salads: '2', Protein: '2', Carbs: '3', Veggies: '2', Dessert: '2', 'Soft Drinks': '✓', 'Tea / Coffee': '✓' },
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/5">
      <div className="mb-14">
        <Eyebrow color="var(--gold)" className="mb-2">Conference & Events</Eyebrow>
        <h2 className="font-display text-4xl md:text-5xl font-light text-cream mt-2">
          Rates & Menus
        </h2>
        <p className="font-body text-xs text-white/30 mt-4 max-w-lg leading-relaxed">
          All conference packages include projector, HDMI, flipchart, stationeries and drinking water.
          Minimum 8 persons for buffet service. Prices per person.
        </p>
      </div>

      {/* Tab switcher */}
      <div className="flex gap-1 mb-10 p-1 rounded-xl bg-white/[0.04] border border-white/5 w-fit">
        {([
          { key: 'packages',     label: 'Day Packages' },
          { key: 'buffet',       label: 'Buffet Comparison' },
          { key: 'cancellation', label: 'Cancellation Policy' },
        ] as const).map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-2.5 rounded-lg text-[11px] font-body tracking-wider transition-all duration-200 ${
              tab === t.key
                ? 'text-obsidian font-semibold'
                : 'text-white/35 hover:text-white/60'
            }`}
            style={tab === t.key ? { background: accent } : {}}
          >
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* Day Packages */}
        {tab === 'packages' && (
          <motion.div
            key="packages"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {rates.map(rate => (
              <div
                key={rate.id}
                className="relative p-6 rounded-2xl bg-black/25 border border-white/5 hover:border-white/12 transition-colors duration-300 flex flex-col"
              >
                <AccentLine color={accent} />
                {rate.tag && (
                  <span
                    className="self-start text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full mb-3"
                    style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                  >
                    {rate.tag}
                  </span>
                )}
                <h3 className="font-display text-xl font-light text-cream mb-2">{rate.label}</h3>
                <p className="font-body text-xs text-white/40 leading-relaxed flex-1 mb-4">{rate.description}</p>
                <div className="border-t border-white/5 pt-4 flex items-end justify-between">
                  <span className="block text-[9px] uppercase tracking-widest text-white/25 font-body">Per person</span>
                  <span className="font-mono text-2xl text-cream">KES {rate.price.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* Buffet Comparison */}
        {tab === 'buffet' && (
          <motion.div
            key="buffet"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
          >
            <div className="overflow-x-auto mb-8">
              <table className="w-full text-xs font-body border-collapse">
                <thead>
                  <tr className="border-b border-white/8">
                    <th className="text-left py-3 pr-6 text-white/30 uppercase tracking-widest text-[9px] font-normal w-36">Includes</th>
                    {buffetRows.map(b => (
                      <th key={b.id} className="py-3 px-4 text-center">
                        <div className="font-display text-base font-light text-cream mb-0.5">{b.label}</div>
                        <div className="font-mono text-sm" style={{ color: accent }}>KES {b.price.toLocaleString()}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {INCLUSIONS.map((inc, i) => (
                    <tr
                      key={inc}
                      className={`border-b border-white/5 transition-colors duration-150 hover:bg-white/[0.02] ${i % 2 === 0 ? '' : 'bg-white/[0.015]'}`}
                    >
                      <td className="py-2.5 pr-6 text-white/45">{inc}</td>
                      {buffetRows.map(b => {
                        const val = BUFFET_MAP[b.id]?.[inc] ?? '—'
                        const isCheck = val === '✓'
                        const isDash = val === '—'
                        return (
                          <td key={b.id} className="py-2.5 px-4 text-center">
                            <span style={{
                              color: isCheck ? accent : isDash ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.7)',
                              fontWeight: isCheck ? 500 : 400,
                            }}>
                              {val}
                            </span>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="font-body text-[10px] uppercase tracking-widest text-white/25 mb-5">All menu options</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {buffets.map(menu => (
                <div
                  key={menu.id}
                  className={`relative p-5 rounded-2xl border flex flex-col transition-colors duration-300 ${
                    menu.highlight
                      ? 'bg-white/[0.06] border-white/12'
                      : 'bg-black/25 border-white/5 hover:border-white/10'
                  }`}
                >
                  {menu.highlight && <AccentLine color={accent} />}
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-display text-lg font-light text-cream">{menu.label}</h3>
                    {menu.highlight && (
                      <span
                        className="shrink-0 text-[9px] font-mono tracking-widest uppercase px-2.5 py-1 rounded-full"
                        style={{ background: `${accent}18`, color: accent, border: `1px solid ${accent}30` }}
                      >
                        Full Spread
                      </span>
                    )}
                  </div>
                  <p className="font-body text-xs text-white/40 leading-relaxed flex-1 mb-3">{menu.courses}</p>
                  <div className="border-t border-white/5 pt-3 flex items-end justify-between">
                    <span className="block text-[9px] uppercase tracking-widest text-white/25 font-body">Per person</span>
                    <span className="font-mono text-xl text-cream">KES {menu.price.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Cancellation Policy */}
        {tab === 'cancellation' && (
          <motion.div
            key="cancellation"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="max-w-2xl"
          >
            <p className="font-body text-sm text-white/45 leading-relaxed mb-8">
              Penalties are calculated on the full reservation value and are subject to management discretion.
              Reservations cancelled within 48 hours of booking incur no penalty.
            </p>
            <div className="space-y-2">
              {policy.map((tier, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 p-4 rounded-xl bg-black/20 border border-white/5 hover:border-white/10 transition-colors duration-200"
                >
                  <div className="w-28 flex-shrink-0">
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <motion.div
                        className="h-full rounded-full"
                        style={{
                          background: tier.pct === 0
                            ? 'var(--neon)'
                            : tier.pct <= 30
                            ? accent
                            : tier.pct <= 60
                            ? '#F0A8B8'
                            : '#ff6b6b',
                        }}
                        initial={{ width: 0 }}
                        animate={{ width: `${tier.pct === 0 ? 100 : tier.pct}%` }}
                        transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-body text-xs text-white/45">{tier.weeks}</span>
                  </div>
                  <span
                    className="font-mono text-sm font-medium shrink-0"
                    style={{
                      color: tier.pct === 0 ? 'var(--neon)' : tier.pct <= 30 ? accent : tier.pct <= 60 ? '#F0A8B8' : '#ff8080',
                    }}
                  >
                    {tier.penalty}
                  </span>
                </div>
              ))}
            </div>
            <p className="font-body text-[10px] text-white/20 mt-6 leading-relaxed">
              All cancellation penalties are subject to the discretion of management. Please contact us directly for special circumstances.
            </p>
          </motion.div>
        )}

      </AnimatePresence>
    </section>
  )
}

// ─── Main Shell ───────────────────────────────────────────────────────────────

export function EventsShell({ events, eventTypes, categoryColors, conferenceRates, buffetMenus, cancellationPolicy }: Props) {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [drawerEvent, setDrawerEvent]   = useState<UKVEvent | null>(null)
  const [bookingEvent, setBookingEvent] = useState<UKVEvent | null>(null)

  const { scrollY } = useScroll()
  const titleWeight  = useTransform(scrollY, [0, 500], [300, 400])
  const titleSpacing = useTransform(scrollY, [0, 500], [-0.01, 0.02])

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: events.length }
    events.forEach(e => { counts[e.category] = (counts[e.category] ?? 0) + 1 })
    return counts
  }, [events])

  const filteredEvents = useMemo(
    () => selectedCategory === 'All' ? events : events.filter(e => e.category === selectedCategory),
    [events, selectedCategory]
  )

  const featuredEvent = useMemo(() => {
    const popular = filteredEvents.find(e => EVENT_BADGES[e.id] === 'Most Popular')
    return popular ?? filteredEvents[0] ?? null
  }, [filteredEvents])

  const remainingEvents = useMemo(
    () => featuredEvent ? filteredEvents.filter(e => e.id !== featuredEvent.id) : filteredEvents,
    [filteredEvents, featuredEvent]
  )

  const categories = ['All', ...Object.keys(categoryColors)]

  const handleToggle = useCallback((id: string) => {
    setExpandedId(prev => prev === id ? null : id)
  }, [])

  const handleBook = useCallback((ev: UKVEvent) => {
    setDrawerEvent(ev)
    setBookingEvent(ev)
  }, [])

  const handleCloseDrawer = useCallback(() => setDrawerEvent(null), [])
  const handleDismissBooking = useCallback(() => setBookingEvent(null), [])

  const drawerAccent  = drawerEvent  ? (categoryColors[drawerEvent.category]  ?? 'var(--gold)') : 'var(--gold)'
  const bookingAccent = bookingEvent ? (categoryColors[bookingEvent.category] ?? 'var(--gold)') : 'var(--gold)'

  return (
    <main className="min-h-screen bg-obsidian text-cream relative overflow-x-hidden">
      <NavWrapper />

      {/* Ambient Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{ background: ATMOSPHERES[selectedCategory] ?? ATMOSPHERES['All'] }}
        />
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* ── Hero ── */}
      <section className="relative pt-32 pb-20 px-6 max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <Eyebrow color="var(--gold)">Ubuntu Kreative Village · Gatherings</Eyebrow>

          <motion.h1
            style={{ fontWeight: titleWeight, letterSpacing: titleSpacing }}
            className="font-display text-5xl md:text-7xl xl:text-8xl font-light leading-[0.95] tracking-tight text-cream mt-4 mb-6"
          >
            Memories Carved
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-white/30">
              Into Raw Earth.
            </span>
          </motion.h1>

          <p className="font-body text-white/45 text-base md:text-lg max-w-lg leading-relaxed">
            From candlelit harvest communions beneath the Rift Valley sky to high-stakes
            leadership retreats on the living farm — gather here.
          </p>

          {/* Category filter with counts */}
          <div className="flex flex-wrap gap-2 mt-10">
            {categories.map(cat => (
              <motion.button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat)
                  setExpandedId(null)
                }}
                whileTap={{ scale: 0.96 }}
                className={`px-4 py-2 rounded-full border text-[11px] font-body tracking-wider transition-all duration-300 ${
                  selectedCategory === cat
                    ? 'bg-cream text-obsidian border-cream font-semibold shadow-md'
                    : 'bg-transparent text-white/35 border-white/8 hover:border-white/25 hover:text-cream'
                }`}
              >
                {cat}
                <span className={`ml-1.5 text-[9px] font-mono ${selectedCategory === cat ? 'text-obsidian/50' : 'text-white/20'}`}>
                  {categoryCounts[cat] ?? 0}
                </span>
              </motion.button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative h-[420px] hidden lg:block">
          <CinematicReel visible={selectedCategory !== 'All'} />
        </div>
      </section>

      {/* ── Events ── */}
      <section className="max-w-7xl mx-auto px-6 pb-12 relative z-10">

        {/* Featured event */}
        <AnimatePresence mode="wait">
          {featuredEvent && (
            <FeaturedEvent
              key={featuredEvent.id}
              ev={featuredEvent}
              accent={categoryColors[featuredEvent.category] ?? 'var(--gold)'}
              onBook={() => handleBook(featuredEvent)}
            />
          )}
        </AnimatePresence>

        {/* Remaining events grid */}
        <LayoutGroup>
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {remainingEvents.map(ev => (
                <motion.div
                  key={ev.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                >
                  <EventCard
                    ev={ev}
                    accent={categoryColors[ev.category] ?? 'var(--gold)'}
                    isExpanded={expandedId === ev.id}
                    onToggle={() => handleToggle(ev.id)}
                    onBook={() => handleBook(ev)}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </LayoutGroup>
      </section>

      {/* ── Bespoke Production Packages ── */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="mb-14">
          <Eyebrow color="var(--gold)" className="mb-2">Tailored Curations</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl font-light text-cream mt-2">
            Bespoke Production Packages
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {eventTypes.map(pkg => (
            <div
              key={pkg.id}
              className="bg-black/20 border border-white/5 rounded-2xl p-8 backdrop-blur-md flex flex-col md:flex-row gap-7 items-start hover:border-white/10 transition-colors duration-300"
            >
              <img
                src={pkg.image}
                alt={pkg.name}
                className="w-full md:w-36 h-36 object-cover rounded-xl border border-white/8 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[9px] font-mono tracking-widest uppercase text-gold bg-gold/10 px-2 py-1 rounded">
                  {pkg.tag}
                </span>
                <h3 className="font-display text-2xl font-light text-cream mt-3 mb-1">{pkg.name}</h3>
                <p className="text-xs text-white/35 font-body mb-4">{pkg.sub}</p>
                <p className="text-sm text-white/55 font-body leading-relaxed mb-6 line-clamp-3">{pkg.philosophy}</p>
                <Link
                  href="/contact"
                  className="text-xs font-body tracking-wider uppercase text-cream/70 border-b border-cream/30 pb-0.5 hover:text-gold hover:border-gold transition-colors duration-200"
                >
                  Begin a conversation →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Conference Pricing ── */}
      <ConferencePricingSection
        rates={conferenceRates}
        buffets={buffetMenus}
        policy={cancellationPolicy}
      />

      {/* ── Enquiry CTA ── */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-white/5">
        <div className="rounded-3xl border border-white/8 bg-black/25 p-12 text-center">
          <Eyebrow color="var(--gold)" className="mb-4">Start a Conversation</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl font-light text-cream mt-2 mb-4">
            Ready to Gather?
          </h2>
          <p className="font-body text-white/40 text-sm max-w-md mx-auto leading-relaxed mb-8">
            Every event at Ubuntu begins with a conversation. Tell us what you're dreaming of.
          </p>
          <Link
            href="/contact"
            className="inline-block px-8 py-4 rounded-xl font-body text-xs uppercase tracking-widest font-semibold bg-gold text-obsidian hover:opacity-90 transition-opacity duration-200"
          >
            Begin an Enquiry
          </Link>
        </div>
      </section>

      {/* ── EventDrawer (full modal) — opens on Reserve/Enquire ── */}
      <EventDrawer
        event={drawerEvent}
        accent={drawerAccent}
        onClose={handleCloseDrawer}
      />

      {/* ── StickyBookingSummary — persists after drawer closes ── */}
      <StickyBookingSummary
        event={bookingEvent}
        accent={bookingAccent}
        onDismiss={handleDismissBooking}
      />

      <MoxieChat className="glass-panel" />
      <Footer />
    </main>
  )
}