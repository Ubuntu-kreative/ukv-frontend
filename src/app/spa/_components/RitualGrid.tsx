/**
 * _components/RitualGrid.tsx — SERVER COMPONENT
 *
 * 13 ritual cards rendered as static HTML.
 * Each card carries `data-ritual-id` — ModalController listens for
 * clicks on this attribute via a single delegated event listener.
 *
 * ZERO per-card JS handlers. ZERO IntersectionObservers on first load.
 *
 * The QuickAddButton (cart) is the only interactive element per card.
 * It's rendered as a client island via QuickAddButton.tsx.
 */

import Image from 'next/image'
import { RITUALS, RITUAL_ACCENTS, DEFAULT_ACCENT } from '../_data/spa-data'
import QuickAddButton from './QuickAddButton'

export default function RitualGrid() {
  return (
    <section id="rituals" className="py-28 px-6 md:px-10 bg-[#050505] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Full Treatment Collection</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-5">
            EVERY<span className="italic text-gold"> RITUAL</span>
          </h2>
          <p className="text-white/35 leading-relaxed text-lg max-w-2xl">
            From a KES 2,000 steam session to a KES 30,000 full-day escape —
            every body, every budget, every intention is welcome at Arohamai.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-7">
          {RITUALS.map((ritual) => {
            const accent = RITUAL_ACCENTS[ritual.id] ?? DEFAULT_ACCENT
            return (
              <div
                key={ritual.id}
                data-ritual-id={ritual.id}
                className="group relative overflow-hidden border border-white/5 bg-[#0a0a0a] hover:border-gold/18 transition-all duration-700 rounded-[2rem] cursor-pointer hover:-translate-y-1"
              >
                <div className="relative h-[600px] overflow-hidden">
                  <Image
                    src={ritual.image}
                    alt={ritual.name}
                    fill
                    sizes="(max-width:1024px) 100vw, 50vw"
                    className="object-cover grayscale-[0.20] group-hover:scale-[1.055] group-hover:grayscale-0 transition-all duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms]"
                    style={{ background: `radial-gradient(circle at center, ${accent.glow}, transparent 70%)` }}
                  />

                  {/* Badges */}
                  <div className="absolute top-5 left-5 flex gap-2 flex-wrap z-10">
                    <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-gold/20 bg-black/42 backdrop-blur-xl text-gold rounded-full">
                      {ritual.categoryTag}
                    </span>
                    <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-white/10 bg-black/38 backdrop-blur-xl text-white/52 rounded-full">
                      {ritual.status}
                    </span>
                  </div>
                  <div className="absolute top-5 right-5 z-10">
                    <span className="text-[7px] uppercase tracking-[0.25em] text-gold/32">{accent.label}</span>
                  </div>

                  {/* Card body */}
                  <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
                    <p className="text-[9px] uppercase tracking-[0.38em] text-gold mb-3">Arohamai Spa</p>
                    <h3 className="font-display text-4xl leading-none mb-3">{ritual.name}</h3>
                    <p className="text-white/38 text-sm leading-relaxed mb-5 line-clamp-2 italic">
                      &ldquo;{ritual.description}&rdquo;
                    </p>
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      <div>
                        <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Mood</p>
                        <p className="font-mono text-[10px] text-gold/72">{ritual.mood}</p>
                      </div>
                      <div>
                        <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Soundscape</p>
                        <p className="font-mono text-[10px] text-white/48">{ritual.soundscape}</p>
                      </div>
                    </div>

                    {/* QuickAddButton is the ONLY client island per card */}
                    <div className="mb-5">
                      <QuickAddButton ritual={ritual} />
                    </div>

                    <div className="flex justify-between items-end">
                      <div>
                        <p className="font-display text-3xl text-gold">KES {ritual.price.toLocaleString()}</p>
                        <p className="text-[7px] uppercase tracking-[0.22em] text-white/18">{ritual.duration}</p>
                      </div>
                      <span className="px-6 py-3 border border-white/10 text-[9px] uppercase tracking-[0.22em] hover:border-gold hover:text-gold transition-all duration-500 rounded-full bg-black/18">
                        Enter →
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}