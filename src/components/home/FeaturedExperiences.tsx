'use client'

import { useCallback, useRef, type CSSProperties } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Experience {
  title:  string
  sub:    string
  href:   string
  accent: string
  emoji:  string
  desc:   string
  cta:    string
}

// FIX-10: module-level — allocated once, never re-created on render
const EXPERIENCES: Experience[] = [
  {
    title:  'Our Cottages',
    sub:    'Pokomo Cottages · Farmhouse Suites',
    href:   '/cottages',
    accent: '#B8A9F0',
    emoji:  '🌿',
    desc:   '6 exclusive accommodations inside the living farm.',
    cta:    'Enter Estate',
  },
  {
    title:  'Arohamai Spa',
    sub:    'Ancient African therapies',
    href:   '/spa',
    accent: '#F0A8B8',
    emoji:  '✦',
    desc:   'Farm-sourced botanicals. 200m from field to treatment.',
    cta:    'Explore Rituals',
  },
  {
    title:  'Farm-to-Fork',
    sub:    'Live provenance dining',
    href:   '/restaurant',
    accent: 'var(--gold)',
    emoji:  '◉',
    desc:   'Every dish traced to a specific animal or field.',
    cta:    'View the Harvest',
  },
  {
    title:  'Living Farm',
    sub:    'Live Farm · Real-time data',
    href:   '/farm',
    accent: 'var(--neon)',
    emoji:  '⬡',
    desc:   '24 animals. 6 fields. All tracked in real time.',
    cta:    'Open the Farm Log',
  },
]

// FIX-22: explicit semi-transparent values replace color-mix() for broad
// browser support (color-mix only ships in browsers from 2023+)
const CORNER_COLOURS: Record<string, string> = {
  '#B8A9F0':       '#B8A9F055',
  '#F0A8B8':       '#F0A8B855',
  'var(--gold)':   'rgba(212,168,83,0.33)',
  'var(--neon)':   'rgba(0,255,65,0.33)',
}

export default function FeaturedExperiences() {
  const router     = useRouter()
  const prefetched = useRef(new Set<string>())

  // FIX-17: single stable handler reads href from data attribute —
  // avoids 4 new closure allocations per render
  const handlePointerEnter = useCallback(
    (e: React.PointerEvent<HTMLAnchorElement>) => {
      const href = e.currentTarget.dataset.href
      if (href && !prefetched.current.has(href)) {
        prefetched.current.add(href)
        router.prefetch(href)
      }
    },
    [router]
  )

  return (
    // FIX-20: content-visibility:auto skips layout+paint until scrolled into view
    <section className="px-6 md:px-10 py-32 cv-auto">
      <div className="max-w-8xl mx-auto">
        <div className="flex items-center gap-4 mb-20">
          <div className="h-[1px] flex-1 bg-white/5" />
          <span className="font-body text-[9px] tracking-[0.3em] uppercase text-white/25">
            Featured Experiences
          </span>
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {EXPERIENCES.map((exp) => (
            <Link
              key={exp.href}
              href={exp.href}
              data-href={exp.href}
              prefetch={false}
              onPointerEnter={handlePointerEnter}
              className="glass group relative overflow-hidden flex flex-col no-underline transition-all duration-300 hover:-translate-y-1"
              style={{ minHeight: 300, '--accent': exp.accent } as CSSProperties}
            >
              {/* Top accent line */}
              <div
                className="absolute top-0 inset-x-0 h-[1px] opacity-55"
                style={{ background: 'linear-gradient(90deg,transparent,var(--accent),transparent)' }}
              />

              {/* Corner decorations */}
              <span
                className="corner-tl"
                style={{ borderColor: CORNER_COLOURS[exp.accent] ?? 'rgba(255,255,255,0.2)' }}
              />
              <span
                className="corner-br"
                style={{ borderColor: CORNER_COLOURS[exp.accent] ?? 'rgba(255,255,255,0.2)' }}
              />

              <div className="p-8 flex flex-col flex-1">
                <span
                  className="font-display mb-5 text-[2.8rem] opacity-30"
                  style={{ color: 'var(--accent)' }}
                >
                  {exp.emoji}
                </span>
                <h3 className="font-display text-white font-light text-2xl mb-1">
                  {exp.title}
                </h3>
                <p
                  className="font-body text-[9px] tracking-wider uppercase mb-4"
                  style={{ color: 'var(--accent)' }}
                >
                  {exp.sub}
                </p>
                <p className="font-body text-[11px] leading-relaxed flex-1 text-white/40">
                  {exp.desc}
                </p>
                <div
                  className="flex items-center gap-2 mt-7 font-body text-[10px] tracking-wider uppercase"
                  style={{ color: 'var(--accent)' }}
                >
                  <span>{exp.cta}</span>
                  <span>→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}