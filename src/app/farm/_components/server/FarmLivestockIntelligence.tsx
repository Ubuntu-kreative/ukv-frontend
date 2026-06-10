/**
 * app/farm/_components/server/FarmLivestockIntelligence.tsx
 *
 * Livestock dashboard showing species, health, production.
 * Server component — all data pre-rendered.
 */

import { ANIMAL_BREEDS } from '../../_data/farm-sections'

export default function FarmLivestockIntelligence() {
  // Group by species
  const speciesGroups = ANIMAL_BREEDS.reduce(
    (acc, animal) => {
      if (!acc[animal.species]) acc[animal.species] = []
      acc[animal.species].push(animal)
      return acc
    },
    {} as Record<string, typeof ANIMAL_BREEDS>
  )

  return (
    <section className="farm-section">
      <div className="farm-inner">
        {/* Header */}
        <div className="farm-section-header" data-reveal="up">
          <div className="farm-eyebrow">
            <span className="farm-eyebrow__line farm-eyebrow__line--gold" />
            <span className="farm-eyebrow__text">Livestock Intelligence</span>
          </div>
          <h2 className="farm-section-title font-display">
            Meet Our{' '}
            <em className="farm-section-title-accent">Animal Community</em>
          </h2>
          <p className="farm-section-body">
            Each animal is tracked for health, production, and wellbeing. We practice rotational grazing and regenerative animal husbandry.
          </p>
        </div>

        {/* Grid */}
        <div className="farm-livestock-grid">
          {ANIMAL_BREEDS.map((animal, idx) => (
            <div
              key={animal.id}
              className="farm-livestock-card"
              style={{ borderColor: `${animal.accent}44` }}
              data-reveal="up"
              data-reveal-delay={`${idx * 50}`}
            >
              {/* Image */}
              <div className="farm-livestock-card__image">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={animal.image}
                  alt={animal.breed}
                  style={{ objectFit: 'cover' }}
                />
                <div className="farm-livestock-card__overlay" />
              </div>

              {/* Content */}
              <div className="farm-livestock-card__content">
                <div className="farm-livestock-card__header">
                  <h3 className="farm-livestock-card__name">{animal.breed}</h3>
                  <span
                    className="farm-livestock-card__count"
                    style={{ backgroundColor: `${animal.accent}22`, color: animal.accent }}
                  >
                    {animal.count}
                  </span>
                </div>

                {/* Health */}
                <div className="farm-livestock-card__stat">
                  <span className="farm-livestock-card__stat-label">Health</span>
                  <div
                    className="farm-livestock-card__progress"
                    style={{ backgroundColor: `${animal.accent}22` }}
                  >
                    <div
                      style={{
                        width: `${animal.health}%`,
                        backgroundColor: animal.accent,
                        height: '4px',
                      }}
                    />
                  </div>
                  <span className="farm-livestock-card__stat-value">
                    {animal.health}%
                  </span>
                </div>

                {/* Production */}
                <p className="farm-livestock-card__production">
                  {animal.production}
                </p>

                {/* Status */}
                <div className="farm-livestock-card__status">
                  <span
                    style={{
                      display: 'inline-block',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: animal.accent,
                      marginRight: '6px',
                    }}
                  />
                  <span
                    style={{
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.1em',
                      color: animal.accent,
                    }}
                  >
                    {animal.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
