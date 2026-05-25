/**
 * _components/server/FarmLog.tsx — SERVER COMPONENT
 *
 * Changes from previous version:
 * • data-reveal attributes on every card and section header
 * • All className strings match the unified farm.css design system
 * • next/image with proper sizes on all 14 card images
 * • SectionHeader component now handles id prop correctly
 * • No inline styles except dynamic accent colors (unavoidable)
 */

import Image from 'next/image'
import { LIVESTOCK, CROPS, FIELDS } from '../../_data/farm-data'
import type { LivestockItem, CropItem, FieldItem } from '../../_data/farm-data'

// ─── MOISTURE BAR — server-rendered at final width (no JS animation) ──────────
function MoistureBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div className="farm-moisture">
      <div className="farm-moisture__track">
        <div
          className="farm-moisture__fill"
          style={{ width: `${value}%`, background: accent }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Soil moisture ${value}%`}
        />
      </div>
      <span className="farm-moisture__value" style={{ color: accent }}>{value}%</span>
    </div>
  )
}

// ─── LIVESTOCK CARD ───────────────────────────────────────────────────────────
function LivestockCard({ animal, index }: { animal: LivestockItem; index: number }) {
  return (
    <div
      className="farm-log-card"
      data-reveal="up"
      data-reveal-delay={String(index * 80)}
    >
      <div className="farm-log-card__image-wrap">
        <Image
          src={animal.image}
          alt={`${animal.breed} ${animal.species}`}
          fill
          loading="lazy"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 300px"
          className="farm-log-card__image"
          style={{ objectFit: 'cover' }}
        />
        <div className="farm-log-card__image-overlay" />
        <div
          className="farm-log-card__accent-line"
          style={{ background: `linear-gradient(90deg, transparent, ${animal.accent}, transparent)` }}
          aria-hidden="true"
        />
        <span
          className="farm-log-badge"
          style={{ color: animal.accent, borderColor: `${animal.accent}44`, background: `${animal.accent}11` }}
        >
          {animal.species}
        </span>
        <span className="farm-log-badge farm-log-badge--live farm-log-badge--tr">
          ● {animal.status}
        </span>
        <div className="farm-log-card__id" style={{ color: animal.accent }}>
          #{animal.id}
        </div>
      </div>

      <div className="farm-log-card__body">
        <div className="farm-log-card__rows">
          {([
            ['Breed',   animal.breed],
            ['Unit',    animal.unit ],
            ['Grazing', animal.field],
          ] as const).map(([label, value]) => (
            <div key={label} className="farm-log-card__row">
              <span className="farm-log-card__row-label">{label}</span>
              <span className="farm-log-card__row-value">{value}</span>
            </div>
          ))}
        </div>
        <p className="farm-log-card__notes">{animal.notes}</p>
      </div>
    </div>
  )
}

// ─── CROP CARD ────────────────────────────────────────────────────────────────
function CropCard({ crop, index }: { crop: CropItem; index: number }) {
  const statusClass =
    crop.status === 'Harvest Ready' ? 'farm-log-badge--ready'   :
    crop.status === 'Growing'       ? 'farm-log-badge--growing' :
                                      'farm-log-badge--planted'

  const statusLabel =
    crop.status === 'Harvest Ready' ? '● Ready'   :
    crop.status === 'Growing'       ? '↻ Growing' : '○ Planted'

  return (
    <div
      className="farm-log-card"
      data-reveal="up"
      data-reveal-delay={String(index * 80)}
    >
      <div className="farm-log-card__image-wrap">
        <Image
          src={crop.image}
          alt={crop.name}
          fill
          loading="lazy"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 320px"
          className="farm-log-card__image"
          style={{ objectFit: 'cover' }}
        />
        <div className="farm-log-card__image-overlay" />
        <div
          className="farm-log-card__accent-line"
          style={{ background: `linear-gradient(90deg, transparent, ${crop.accent}, transparent)` }}
          aria-hidden="true"
        />
        <span
          className="farm-log-badge"
          style={{ color: crop.accent, borderColor: `${crop.accent}44`, background: `${crop.accent}11` }}
        >
          {crop.field}
        </span>
        <span className={`farm-log-badge farm-log-badge--tr ${statusClass}`}>
          {statusLabel}
        </span>
        <h3 className="farm-log-card__title">{crop.name}</h3>
      </div>

      <div className="farm-log-card__body">
        <div className="farm-log-card__section-label">Soil Moisture</div>
        <MoistureBar value={crop.soilMoisture} accent={crop.accent} />

        <div className="farm-log-card__rows">
          <div className="farm-log-card__row">
            <span className="farm-log-card__row-label">Days to harvest</span>
            <span
              className="farm-log-card__row-value"
              style={{ color: crop.daysToHarvest === 0 ? 'var(--neon)' : undefined }}
            >
              {crop.daysToHarvest === 0 ? 'Ready now' : `${crop.daysToHarvest} days`}
            </span>
          </div>
          <div className="farm-log-card__row">
            <span className="farm-log-card__row-label">Last watered</span>
            <span className="farm-log-card__row-value">{crop.lastWatered}</span>
          </div>
        </div>

        <div className="farm-log-card__section-label">Used in</div>
        <div className="farm-log-card__tags">
          {crop.usedIn.map((u) => (
            <span key={u} className="farm-log-tag">{u}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── FIELD CARD ───────────────────────────────────────────────────────────────
function FieldCard({ field, index }: { field: FieldItem; index: number }) {
  return (
    <div
      className="farm-log-card"
      data-reveal="up"
      data-reveal-delay={String(index * 80)}
    >
      <div className="farm-log-card__image-wrap">
        <Image
          src={field.image}
          alt={field.id}
          fill
          loading="lazy"
          sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 300px"
          className="farm-log-card__image"
          style={{ objectFit: 'cover' }}
        />
        <div className="farm-log-card__image-overlay" />
        <span className="farm-log-badge farm-log-badge--live farm-log-badge--tr">
          ● {field.status}
        </span>
        <h3 className="farm-log-card__title">{field.id}</h3>
      </div>

      <div className="farm-log-card__body">
        <div className="farm-log-card__row" style={{ marginBottom: 10 }}>
          <span className="farm-log-card__row-label">Size</span>
          <span className="farm-log-card__row-value">{field.size}</span>
        </div>
        <div className="farm-log-card__section-label">Soil Moisture</div>
        <MoistureBar value={field.moisture} accent="var(--neon)" />
        <p className="farm-log-card__notes" style={{ marginTop: 8 }}>{field.crops}</p>
      </div>
    </div>
  )
}

// ─── SECTION HEADER ───────────────────────────────────────────────────────────
function SectionHeader({
  id, title, color, badge, badgeClass,
}: {
  id?: string
  title: string
  color: string
  badge?: string
  badgeClass?: string
}) {
  return (
    <div className="farm-log-section-header" data-reveal="left">
      <h2
        id={id}
        className="farm-log-section-title font-display"
        style={{ color }}
      >
        {title}
      </h2>
      <div className="farm-log-section-divider" />
      {badge && (
        <span className={`farm-log-badge ${badgeClass ?? ''}`}>{badge}</span>
      )}
    </div>
  )
}

// ─── MAIN EXPORT ─────────────────────────────────────────────────────────────
export default function FarmLog() {
  return (
    <div id="farm-log">

      {/* ── Intro ── */}
      <div className="farm-log-intro">
        <div className="farm-log-intro__eyebrow" data-reveal="up">
          <div className="farm-log-intro__line" />
          <span>Farm Log · The Pulse</span>
          <span className="farm-hero__live-dot" aria-hidden="true" />
          <span className="farm-log-intro__sync">FarmERP synced 8m ago</span>
          <div className="farm-log-intro__line" />
        </div>
        <h2 className="farm-log-intro__heading font-display" data-reveal="up" data-reveal-delay="80">
          What the land is doing —{' '}
          <em className="farm-log-intro__heading-accent">right now.</em>
        </h2>
        <p className="farm-log-intro__body" data-reveal="up" data-reveal-delay="160">
          Every animal, crop, and field tracked in real time via FarmERP. This data powers your dinner,
          your spa treatments, and Moxie's provenance answers.
        </p>
      </div>

      {/* ── Livestock ── */}
      <section className="farm-log-section" aria-labelledby="log-livestock">
        <SectionHeader id="log-livestock" title="Livestock" color="var(--neon)" badge="● Live" badgeClass="farm-log-badge--live" />
        <div className="farm-log-grid">
          {LIVESTOCK.map((animal, i) => (
            <LivestockCard key={animal.id} animal={animal} index={i} />
          ))}
        </div>
      </section>

      {/* ── Crops ── */}
      <section className="farm-log-section" aria-labelledby="log-crops">
        <SectionHeader id="log-crops" title="Crops" color="var(--gold)" badge="↻ Synced" badgeClass="farm-log-badge--sync" />
        <div className="farm-log-grid farm-log-grid--crops">
          {CROPS.map((crop, i) => (
            <CropCard key={crop.name} crop={crop} index={i} />
          ))}
        </div>
      </section>

      {/* ── Fields ── */}
      <section className="farm-log-section" aria-labelledby="log-fields">
        <SectionHeader id="log-fields" title="Fields" color="#A8D8F0" />
        <div className="farm-log-grid">
          {FIELDS.map((field, i) => (
            <FieldCard key={field.id} field={field} index={i} />
          ))}
        </div>
      </section>

      {/* ── FarmERP note ── */}
      <div className="farm-log-erp-note" data-reveal="up">
        <div className="farm-log-erp-note__header">
          <span className="farm-hero__live-dot" aria-hidden="true" />
          <span>Powered by FarmERP · Synced every 60 minutes</span>
        </div>
        <p className="farm-log-erp-note__body">
          Phase 4 will connect this page to live FarmERP data. Ask Moxie about any animal or crop right now.
        </p>
        <a href="#" className="farm-btn farm-btn--neon">
          Ask Moxie About the Farm →
        </a>
      </div>
    </div>
  )
}