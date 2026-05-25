/**
 * _components/ThermalSanctuaries.tsx — SERVER COMPONENT
 * All hover effects are pure CSS transitions.
 */

import Image from 'next/image'
import { THERMALS } from '../_data/spa-data'

export default function ThermalSanctuaries() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-20">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Bath & Heat Therapies</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            CLEANSE. DETOX.<span className="italic text-gold"> RESTORE.</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Eight distinct bath and heat experiences. Each operates at a different temperature, tradition and intensity.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          {/* Large cards */}
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-7">
            {THERMALS.slice(0, 2).map((t) => (
              <div
                key={t.name}
                data-ritual-id={t.ritualId}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700"
              >
                <div className="relative h-[480px]">
                  <Image
                    src={t.image} alt={t.name} fill
                    sizes="(max-width:768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                    style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <p className="text-[8px] uppercase tracking-[0.35em] text-gold/60 mb-2">{t.spec}</p>
                    <h3 className="font-display text-4xl leading-none mb-3">{t.name}</h3>
                    <p className="text-white/42 text-sm leading-relaxed mb-5">{t.description}</p>
                    <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/22 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all inline-block">
                      Book Now →
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Smaller cards */}
          <div className="flex flex-col gap-7">
            {THERMALS.slice(2).map((t) => (
              <div
                key={t.name}
                data-ritual-id={t.ritualId}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 flex-1"
              >
                <div className="relative h-[220px]">
                  <Image
                    src={t.image} alt={t.name} fill
                    sizes="(max-width:1024px) 100vw, 25vw"
                    className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                    style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                  />
                </div>
                <div className="p-6 bg-[#0a0a0a]">
                  <p className="text-[8px] uppercase tracking-[0.35em] text-gold/55 mb-1.5">{t.spec}</p>
                  <h3 className="font-display text-2xl md:text-3xl leading-none mb-2">{t.name}</h3>
                  <p className="text-white/38 text-sm leading-relaxed line-clamp-3">{t.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}