/**
 * app/farm/_components/server/FarmRegenerativeStory.tsx
 *
 * Regenerative agriculture education + storytelling.
 * Server component with rich narrative.
 */

import { REGENERATIVE_PRACTICES, SUSTAINABILITY_METRICS } from '../../_data/farm-sections'

export default function FarmRegenerativeStory() {
  return (
    <>
      {/* ── PRACTICES SECTION ── */}
      <section className="farm-section">
        <div className="farm-inner">
          {/* Header */}
          <div className="farm-section-header" data-reveal="up">
            <div className="farm-eyebrow">
              <span className="farm-eyebrow__line farm-eyebrow__line--gold" />
              <span className="farm-eyebrow__text">Our Approach</span>
            </div>
            <h2 className="farm-section-title font-display">
              Regenerative{' '}
              <em className="farm-section-title-accent">Agriculture in Practice</em>
            </h2>
            <p className="farm-section-body">
              We don't just sustain. We regenerate. Every system on this farm is designed to leave the land healthier
              than we found it.
            </p>
          </div>

          {/* Practices Grid */}
          <div className="farm-practices-grid">
            {REGENERATIVE_PRACTICES.map((practice, idx) => (
              <div
                key={practice.id}
                className="farm-practice-card"
                style={{ borderColor: `${practice.accent}33` }}
                data-reveal="up"
                data-reveal-delay={`${idx * 60}`}
              >
                {/* Icon */}
                <div
                  className="farm-practice-card__icon"
                  style={{ color: practice.accent }}
                >
                  {practice.icon}
                </div>

                {/* Title */}
                <h3 className="farm-practice-card__title">{practice.name}</h3>

                {/* Description */}
                <p className="farm-practice-card__description">
                  {practice.description}
                </p>

                {/* Benefit highlight */}
                <p
                  className="farm-practice-card__benefit"
                  style={{ color: practice.accent }}
                >
                  {practice.benefit}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUSTAINABILITY METRICS SECTION ── */}
      <section className="farm-section farm-section--alt">
        <div className="farm-inner">
          {/* Header */}
          <div className="farm-section-header" data-reveal="up">
            <div className="farm-eyebrow">
              <span className="farm-eyebrow__line" />
              <span className="farm-eyebrow__text">Impact Metrics</span>
            </div>
            <h2 className="farm-section-title font-display">
              Measurable{' '}
              <em className="farm-section-title-accent">Environmental Impact</em>
            </h2>
            <p className="farm-section-body">
              Transparency through data. Every metric is independently verified and reported annually.
            </p>
          </div>

          {/* Metrics Grid */}
          <div className="farm-sustainability-grid">
            {SUSTAINABILITY_METRICS.map((metric, idx) => (
              <div
                key={metric.id}
                className="farm-metric-card"
                style={{ borderColor: `${metric.accent}33` }}
                data-reveal="up"
                data-reveal-delay={`${idx * 50}`}
              >
                {/* Icon + Title */}
                <div className="farm-metric-card__header">
                  <span
                    className="farm-metric-card__icon"
                    style={{ color: metric.accent }}
                  >
                    {metric.icon}
                  </span>
                  <h3 className="farm-metric-card__title">{metric.title}</h3>
                </div>

                {/* Value */}
                <div className="farm-metric-card__value">
                  <span style={{ color: metric.accent }}>
                    {metric.value}
                  </span>
                  <span className="farm-metric-card__unit">{metric.unit}</span>
                </div>

                {/* Description */}
                <p className="farm-metric-card__description">
                  {metric.description}
                </p>

                {/* Progress */}
                {metric.progress !== undefined && (
                  <div className="farm-metric-card__progress-section">
                    <div
                      className="farm-metric-card__progress-bar"
                      style={{ backgroundColor: `${metric.accent}22` }}
                    >
                      <div
                        style={{
                          width: `${metric.progress}%`,
                          backgroundColor: metric.accent,
                          height: '4px',
                          transition: 'width 1s ease',
                        }}
                      />
                    </div>
                    <span className="farm-metric-card__progress-label">
                      {metric.progress}% progress
                    </span>
                  </div>
                )}

                {/* Target */}
                {metric.target && (
                  <p className="farm-metric-card__target">
                    Target: {metric.target} {metric.unit}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
