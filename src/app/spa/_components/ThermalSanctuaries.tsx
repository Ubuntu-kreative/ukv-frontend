/**
 * _components/ThermalSanctuaries.tsx — SERVER COMPONENT
 * All hover effects are pure CSS transitions.
 *
 * LAYOUT FIX:
 *  - Switched from nested sub-grids to a single flat 3-col grid
 *  - Large cards each occupy 1 col and span 2 rows (row-span-2)
 *  - Small cards each occupy col-3, 1 row each
 *  - CTA card occupies col-3, row 3 — naturally fills remaining space
 *  - This eliminates ALL height mismatch; CSS grid handles alignment exactly
 */

import Image from 'next/image'
import { THERMALS } from '../_data/spa-data'

export default function ThermalSanctuaries() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="max-w-3xl mb-20">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Bath &amp; Heat Therapies</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            CLEANSE. DETOX.<span className="italic text-gold"> RESTORE.</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Eight distinct bath and heat experiences. Each operates at a different temperature, tradition and intensity.
          </p>
        </div>

        {/*
          ── FLAT 3-COLUMN GRID ──────────────────────────────────────────────
          col 1: Moroccan Bath   (row 1–2)
          col 2: Mud Bath        (row 1–2)
          col 3 row 1: Sauna & Steam
          col 3 row 2: Herbal Soak
          col 3 row 3: Private CTA  ← fills whatever remains
        */}
        <div className="grid lg:grid-cols-3 lg:grid-rows-[auto_auto] gap-7">

          {/* ── Large card 1: Moroccan Bath — spans 2 rows ── */}
          {THERMALS.slice(0, 1).map((t) => (
            <div
              key={t.name}
              data-ritual-id={t.ritualId}
              className="lg:row-span-2 group overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 flex flex-col bg-[#0a0a0a]"
            >
              <div className="relative h-[340px] lg:flex-1 flex-shrink-0 overflow-hidden rounded-t-[2.5rem]">
                <Image
                  src={t.image} alt={t.name} fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                  style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                />
              </div>
              <div className="p-8 flex flex-col">
                <p className="text-[8px] uppercase tracking-[0.35em] text-gold/60 mb-2">{t.spec}</p>
                <h3 className="font-display text-4xl leading-none mb-3">{t.name}</h3>
                <p className="text-white/42 text-sm leading-relaxed mb-6">{t.description}</p>
                <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/22 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all inline-block self-start">
                  Book Now →
                </span>
              </div>
            </div>
          ))}

          {/* ── Large card 2: Mud Bath — spans 2 rows ── */}
          {THERMALS.slice(1, 2).map((t) => (
            <div
              key={t.name}
              data-ritual-id={t.ritualId}
              className="lg:row-span-2 group overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 flex flex-col bg-[#0a0a0a]"
            >
              <div className="relative h-[340px] lg:flex-1 flex-shrink-0 overflow-hidden rounded-t-[2.5rem]">
                <Image
                  src={t.image} alt={t.name} fill
                  sizes="(max-width:768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                  style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                />
              </div>
              <div className="p-8 flex flex-col">
                <p className="text-[8px] uppercase tracking-[0.35em] text-gold/60 mb-2">{t.spec}</p>
                <h3 className="font-display text-4xl leading-none mb-3">{t.name}</h3>
                <p className="text-white/65 text-sm leading-relaxed mb-6">{t.description}</p>
                <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/22 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all inline-block self-start">
                  Book Now →
                </span>
              </div>
            </div>
          ))}

          {/* ── Small card: Sauna & Steam — col 3, row 1 ── */}
          {THERMALS.slice(2, 3).map((t) => (
            <div
              key={t.name}
              data-ritual-id={t.ritualId}
              className="group overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 flex flex-col bg-[#0a0a0a]"
            >
              <div className="relative h-[160px] flex-shrink-0 overflow-hidden rounded-t-[2.5rem]">
                <Image
                  src={t.image} alt={t.name} fill
                  sizes="25vw"
                  className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                  style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                />
              </div>
              <div className="p-6">
                <p className="text-[8px] uppercase tracking-[0.35em] text-gold/55 mb-1.5">{t.spec}</p>
                <h3 className="font-display text-2xl md:text-3xl leading-none mb-2">{t.name}</h3>
                <p className="text-white/65 text-sm leading-relaxed line-clamp-2">{t.description}</p>
              </div>
            </div>
          ))}

          {/* ── Small card: Herbal Soak — col 3, row 2 ── */}
          {THERMALS.slice(3, 4).map((t) => (
            <div
              key={t.name}
              data-ritual-id={t.ritualId}
              className="group overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 flex flex-col bg-[#0a0a0a]"
            >
              <div className="relative h-[160px] flex-shrink-0 overflow-hidden rounded-t-[2.5rem]">
                <Image
                  src={t.image} alt={t.name} fill
                  sizes="25vw"
                  className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                  style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                />
              </div>
              <div className="p-6">
                <p className="text-[8px] uppercase tracking-[0.35em] text-gold/55 mb-1.5">{t.spec}</p>
                <h3 className="font-display text-2xl md:text-3xl leading-none mb-2">{t.name}</h3>
                <p className="text-white/65 text-sm leading-relaxed line-clamp-2">{t.description}</p>
              </div>
            </div>
          ))}



        </div>
      </div>
    </section>
  )
}