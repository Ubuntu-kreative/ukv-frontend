'use client'

import { useEffect, useRef, useState } from 'react'

const STATS_TARGETS = [6, 24, 6, 50] as const

const STATS_META = [
  { label: 'Accommodation options', suffix: '',    color: 'var(--neon)' },
  { label: 'Animals tracked live',  suffix: '+',   color: 'var(--gold)' },
  { label: 'Master logs connected', suffix: '',    color: 'var(--neon)' },
  { label: 'Year audit retention',  suffix: 'yr',  color: 'var(--gold)' },
] as const

// FIX-16: typed tuple avoids per-tick heap allocation from .map()
type Counts = [number, number, number, number]
const ZERO_COUNTS: Counts = [0, 0, 0, 0]

export default function StatsStrip() {
  const [counts, setCounts] = useState<Counts>(ZERO_COUNTS)
  const elRef  = useRef<HTMLDivElement>(null)
  const fired  = useRef(false)
  const rafRef = useRef<number>(0)

  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || fired.current) return
        fired.current = true
        io.disconnect()

        const start    = performance.now()
        const DURATION = 1200

        const tick = (now: number) => {
          const t    = Math.min((now - start) / DURATION, 1)
          const ease = 1 - Math.pow(1 - t, 3) // ease-out-cubic

          // FIX-16: construct tuple directly — no .map() allocation per frame
          setCounts([
            Math.floor(STATS_TARGETS[0] * ease),
            Math.floor(STATS_TARGETS[1] * ease),
            Math.floor(STATS_TARGETS[2] * ease),
            Math.floor(STATS_TARGETS[3] * ease),
          ])
          if (t < 1) rafRef.current = requestAnimationFrame(tick)
        }

        rafRef.current = requestAnimationFrame(tick)
      },
      { threshold: 0.3 }
    )

    io.observe(el)
    // FIX-08: cancelAnimationFrame always has a valid ref when cleanup runs
    return () => {
      io.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return (
    <div ref={elRef} className="relative py-16 px-6 md:px-10 border-b border-white/5">
      <div className="max-w-8xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS_META.map((s, i) => (
          <div key={s.label} className="flex flex-col items-center md:items-start">
            <span
              className="font-display leading-none mb-2 font-light"
              style={{ fontSize: 'clamp(3rem,6vw,5rem)', color: s.color }}
            >
              {counts[i]}{s.suffix}
            </span>
            <span className="font-body text-[9px] tracking-[0.2em] uppercase text-white/30 text-center md:text-left">
              {s.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}