/**
 * _components/FarmToRitual.tsx — SERVER COMPONENT
 */

import { FARM_INGREDIENTS } from '../_data/spa-data'

export default function FarmToRitual() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">From Earth to Skin</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            200 METRES<span className="italic text-gold"> FROM SOIL TO SKIN</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed max-w-2xl">
            Every ingredient in your Arohamai ritual is grown, harvested, or sourced within 200 metres of the treatment room.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {FARM_INGREDIENTS.map((ingredient) => (
            <div
              key={ingredient.name}
              className="group border border-white/5 hover:border-gold/18 bg-[#0a0a0a] rounded-[2rem] p-7 transition-all duration-700"
            >
              <div className="text-3xl mb-4" aria-hidden="true">{ingredient.icon}</div>
              <h3 className="font-display text-2xl mb-1.5 leading-none">{ingredient.name}</h3>
              <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-3">{ingredient.origin}</p>
              <p className="text-white/48 text-sm leading-relaxed mb-4">{ingredient.benefit}</p>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[8px] tracking-[0.18em] text-white/18 italic">{ingredient.note}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}