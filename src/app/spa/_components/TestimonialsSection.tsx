/**
 * _components/TestimonialsSection.tsx — SERVER COMPONENT
 */

import { TESTIMONIALS } from '../_data/spa-data'

export default function TestimonialsSection() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">What Guests Say</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none">
            WITNESSED<span className="italic text-gold"> RESTORATIONS</span>
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="border border-white/5 bg-[#0a0a0a] rounded-[2rem] p-8 flex flex-col"
            >
              <div className="flex gap-1 mb-6" aria-label="5 stars">
                {Array(5).fill(null).map((_, j) => (
                  <span key={j} className="text-gold text-xs" aria-hidden="true">★</span>
                ))}
              </div>
              <p className="text-white/55 text-sm leading-relaxed mb-8 flex-1 italic">&ldquo;{t.quote}&rdquo;</p>
              <div>
                <p className="text-[8px] uppercase tracking-[0.25em] text-gold mb-1">{t.ritual} · {t.duration}</p>
                <p className="font-display text-lg leading-none mb-0.5">{t.name}</p>
                <p className="text-white/25 text-[9px]">{t.title}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}