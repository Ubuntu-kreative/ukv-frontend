/**
 * app/farm/_components/server/FarmLivingDashboard.tsx
 *
 * Real-time farm metrics dashboard. Server component — no JS cost.
 * Renders 6 key metrics animating in via Intersection Observer.
 */

import { FARM_DASHBOARD_METRICS } from '../../_data/farm-sections'

export default function FarmLivingDashboard() {
  return (
    <section className="farm-section farm-section--dashboard">
      <div className="farm-inner">
        {/* Header */}
        <div className="farm-section-header" data-reveal="up">
          <div className="farm-eyebrow">
            <span className="farm-eyebrow__line" />
            <span className="farm-eyebrow__text">Live Farm Status</span>
          </div>
          <h2 className="farm-section-title font-display">
            What The Land Is{' '}
            <em className="farm-section-title-accent">Doing Right Now</em>
          </h2>
          <p className="farm-section-body">
            Real-time metrics from our regenerative farm. This data refreshes every 5 minutes via FarmERP integration.
          </p>
        </div>

        {/* Metrics Grid */}
        <div className="farm-dashboard-grid">
          {FARM_DASHBOARD_METRICS.map((metric, idx) => (
            <div
              key={metric.id}
              className="farm-dashboard-card"
              style={{
                borderColor: `${metric.accent}33`,
                backgroundColor: `${metric.accent}08`,
              } as React.CSSProperties}
              data-reveal="up"
              data-reveal-delay={`${idx * 60}`}
            >
              {/* Icon */}
              <div
                className="farm-dashboard-card__icon"
                style={{ color: metric.accent }}
              >
                {metric.icon}
              </div>

              {/* Value */}
              <div className="farm-dashboard-card__value">
                <span className="farm-dashboard-card__number">
                  {metric.value}
                </span>
                {metric.unit && (
                  <span className="farm-dashboard-card__unit">
                    {metric.unit}
                  </span>
                )}
              </div>

              {/* Label */}
              <p className="farm-dashboard-card__label">{metric.label}</p>

              {/* Trend */}
              {metric.trend && (
                <div
                  className={`farm-dashboard-card__trend farm-dashboard-card__trend--${metric.trend}`}
                  style={{ color: metric.accent }}
                >
                  {metric.trend === 'up' && '↗ Increasing'}
                  {metric.trend === 'down' && '↘ Declining'}
                  {metric.trend === 'stable' && '→ Stable'}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
