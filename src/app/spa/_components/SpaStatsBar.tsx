/**
 * _components/SpaStatsBar.tsx — SERVER COMPONENT
 * Static stats — no interactivity, no JS.
 */

import { SPA_STATS } from '../_data/spa-data'

export default function SpaStatsBar() {
  return (
    <section className="w-full bg-[#080808] border-b border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
        {SPA_STATS.map(({ label, value, sub }) => (
          <div key={label} className="px-6 py-8">
            <p className="text-[8px] uppercase tracking-[0.35em] text-white/22 mb-2">{label}</p>
            <p className="font-display text-lg md:text-xl text-gold leading-tight mb-1">{value}</p>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/18">{sub}</p>
          </div>
        ))}
      </div>
    </section>
  )
}