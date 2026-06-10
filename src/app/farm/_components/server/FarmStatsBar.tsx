/**
 * _components/server/FarmStatsBar.tsx — SERVER COMPONENT
 *
 * Changes: data-reveal="scale" added to each stat for cinematic entrance.
 * No other changes — data already comes from farm-data.ts.
 */

import { FARM_STATS } from '../../_data/farm-data'

export default function FarmStatsBar() {
  return (
    <div className="farm-stats-bar" aria-label="Farm overview">
      <div className="farm-stats-bar__inner">
        {FARM_STATS.map((s, i) => (
          <div
            key={s.label}
            className="farm-stats-bar__item"
            data-reveal="scale"
            data-reveal-delay={String(i * 80)}
          >
            <span
              className="farm-stats-bar__value font-display"
              style={{ color: s.color }}
            >
              {s.value}
            </span>
            <span className="farm-stats-bar__label">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}