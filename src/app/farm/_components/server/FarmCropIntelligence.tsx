/**
 * app/farm/_components/server/FarmCropIntelligence.tsx
 *
 * Crop dashboard showing varieties, growth, yield forecast.
 * Server component.
 */

import { CROP_VARIETIES } from '../../_data/farm-sections'

export default function FarmCropIntelligence() {
  return (
    <section className="farm-section farm-section--alt">
      <div className="farm-inner">
        {/* Header */}
        <div className="farm-section-header" data-reveal="up">
          <div className="farm-eyebrow">
            <span className="farm-eyebrow__line" />
            <span className="farm-eyebrow__text">Crop Intelligence</span>
          </div>
          <h2 className="farm-section-title font-display">
            Growing{' '}
            <em className="farm-section-title-accent">23 Crop Varieties</em>
          </h2>
          <p className="farm-section-body">
            From companion plantings to medicinal herbs. Every crop is tracked for growth, health, and harvest readiness.
          </p>
        </div>

        {/* Grid */}
        <div className="farm-crops-grid">
          {CROP_VARIETIES.map((crop, idx) => (
            <div
              key={crop.id}
              className="farm-crop-card"
              style={{ borderColor: `${crop.accent}33` }}
              data-reveal="left"
              data-reveal-delay={`${idx * 40}`}
            >
              {/* Image */}
              <div className="farm-crop-card__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={crop.image}
                  alt={crop.name}
                  style={{ objectFit: 'cover' }}
                />
              </div>

              {/* Content */}
              <div className="farm-crop-card__content">
                <div className="farm-crop-card__category">
                  {crop.category.charAt(0).toUpperCase() + crop.category.slice(1)}
                </div>

                <h3 className="farm-crop-card__name">{crop.name}</h3>

                {/* Growth Stage */}
                <div className="farm-crop-card__stat">
                  <label>Growth Stage</label>
                  <div
                    className="farm-crop-card__progress"
                    style={{ backgroundColor: `${crop.accent}22` }}
                  >
                    <div
                      style={{
                        width: `${crop.growthStage}%`,
                        backgroundColor: crop.accent,
                        height: '6px',
                      }}
                    />
                  </div>
                  <span>{crop.growthStage}%</span>
                </div>

                {/* Harvest Date */}
                <div className="farm-crop-card__meta">
                  <span>Ready: {new Date(crop.harvestDate).toLocaleDateString()}</span>
                </div>

                {/* Health Score */}
                <div className="farm-crop-card__health">
                  <span style={{ color: crop.accent }}>
                    ✓ Health Score: {crop.healthScore}%
                  </span>
                </div>

                {/* Yield Forecast */}
                <p
                  className="farm-crop-card__yield"
                  style={{ color: crop.accent }}
                >
                  Est. Yield: {crop.yieldForecast}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
