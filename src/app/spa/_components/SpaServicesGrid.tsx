/**
 * _components/SpaServicesGrid.tsx — SERVER COMPONENT
 *
 * Static HTML. Cards carry `data-ritual-id` attributes.
 * ModalController (client) listens for clicks on these via event delegation —
 * zero per-card JS handlers on first load.
 *
 * Hover effects: pure CSS transitions — no Framer Motion.
 */

import Image from 'next/image'
import { SPA_SERVICES } from '../_data/spa-data'

export default function SpaServicesGrid() {
  return (
    <section id="services" className="py-28 px-6 md:px-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-20">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Arohamai Spa · Full Service Suite</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            THE FULL<span className="italic text-gold"> SANCTUARY</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Every space inside Arohamai Spa is designed to be entered, experienced, and remembered.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          {SPA_SERVICES.map((service) => (
            <div
              key={service.title}
              data-ritual-id={service.ritualId}
              className="group relative overflow-hidden rounded-[2rem] border border-white/5 hover:border-gold/18 bg-[#0a0a0a] transition-all duration-700 cursor-pointer"
            >
              <div className="relative h-[380px] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover grayscale-[0.15] group-hover:scale-[1.045] group-hover:grayscale-0 transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/25 to-transparent" />
                {/* Accent glow on hover — CSS opacity transition, GPU-only */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1400ms]"
                  style={{ background: `radial-gradient(circle at 50% 65%, ${service.accent}, transparent 70%)` }}
                />
                <div className="absolute top-5 left-5 z-10">
                  <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.3em] border border-gold/22 bg-black/50 backdrop-blur-xl text-gold rounded-full">
                    {service.tag}
                  </span>
                </div>
                <div className="absolute top-5 right-5 z-10">
                  <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] border border-white/10 bg-black/40 backdrop-blur-xl text-white/48 rounded-full">
                    {service.subtitle}
                  </span>
                </div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-3xl md:text-4xl leading-none mb-3">{service.title}</h3>
                <p className="text-white/42 text-sm leading-relaxed mb-6">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/20 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all duration-400">
                    {service.cta} →
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/25 text-xs group-hover:border-gold/28 group-hover:text-gold transition-all duration-500">
                    ↗
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}