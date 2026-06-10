/**
 * components/bsf/BsfFarmSection.tsx — SERVER COMPONENT
 *
 * Public-facing BSF section for the farm page.
 * Contains ZERO supply volumes, milestone dates, export references,
 * or client-confidential data. Safe on any public route.
 *
 * Design system:
 * - Uses var(--neon) and var(--gold) from farm.css — matches the farm page
 * - data-reveal="up" attributes hook into FarmScrollReveal automatically
 * - No 'use client' — renders as static HTML, zero JS cost
 * - framer-motion removed (not available in server components)
 */

import Link from 'next/link'

// ─── Public story copy — no confidential data ────────────────────────────────
// Mirrors BSF_PUBLIC_STORY from bsf-admin.data.ts but kept inline here so
// this server component has zero dependency on the admin data file.
// If you update the story copy, update it here too.

const STORY = {
  subheadline: 'Black Soldier Fly · Regenerative Protein Cycle',
  headline: 'Closing the Loop with Nature',
  body: `Ubuntu farm uses Black Soldier Fly larvae to transform organic waste into
high-quality protein and natural fertiliser — a closed-loop system that feeds
the land back into itself. No synthetic inputs. No waste. Just biology doing
what it has done for millions of years.`,
  points: [
    {
      icon: '♻',
      title: 'Waste becomes nutrition',
      body: 'Farm organic matter feeds the larvae, eliminating waste at source.',
      accent: 'var(--neon)',
    },
    {
      icon: '◎',
      title: 'Larvae become protein',
      body: 'Harvested larvae provide a sustainable protein input for the farm ecosystem.',
      accent: 'var(--gold)',
    },
    {
      icon: '✦',
      title: 'Frass becomes fertiliser',
      body: 'Larval frass returns as a rich, natural soil amendment — completing the cycle.',
      accent: 'var(--neon)',
    },
  ],
  ctaLabel: 'Interested in sustainable protein partnerships',
  ctaHref: '/contact?subject=bsf-partnership',
}

// ─── Cycle step labels ────────────────────────────────────────────────────────
const CYCLE_STEPS = [
  { icon: '♻', label: 'Organic waste',  sub: 'Farm & kitchen'      },
  { icon: '◎', label: 'BSF larvae',     sub: 'Natural processing'  },
  { icon: '✦', label: 'Protein',        sub: 'Farm input'          },
  { icon: '◉', label: 'Frass',          sub: 'Soil amendment'      },
]

// ─────────────────────────────────────────────────────────────────────────────

export default function BsfFarmSection() {
  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '80px 28px 100px',
      }}
    >

      {/* ── Section header ── */}
      <div
        style={{ marginBottom: '56px', textAlign: 'center' }}
        data-reveal="up"
      >
        {/* Eyebrow — matches farm page eyebrow style */}
        <div
          className="farm-hero__eyebrow"
          style={{ justifyContent: 'center', marginBottom: '20px' }}
        >
          <span className="farm-hero__eyebrow-line" />
          <span className="farm-hero__eyebrow-text">{STORY.subheadline}</span>
          <span className="farm-hero__eyebrow-line" />
        </div>

        <h2
          className="font-display"
          style={{
            color: 'var(--cream, rgba(255,255,255,0.9))',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 300,
            lineHeight: 1.1,
            marginBottom: '20px',
          }}
        >
          {STORY.headline}
        </h2>

        <p
          style={{
            maxWidth: '600px',
            margin: '0 auto',
            color: 'rgba(255,255,255,0.45)',
            fontSize: '14px',
            lineHeight: 1.85,
            whiteSpace: 'pre-line',
          }}
        >
          {STORY.body}
        </p>
      </div>

      {/* ── Three ecology point cards — match farm-log-card style ── */}
      <div
        className="farm-log-grid"
        style={{ marginBottom: '52px' }}
      >
        {STORY.points.map((point, i) => (
          <div
            key={point.title}
            className="farm-log-card"
            data-reveal="up"
            data-reveal-delay={String(i * 80)}
            style={{ cursor: 'default' }}
          >
            {/* Icon header — uses farm-log-card__image-wrap proportions */}
            <div
              className="farm-log-card__image-wrap"
              style={{ height: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <div
                className="farm-log-card__image-overlay"
                style={{ background: `${point.accent}08` }}
              />
              <div
                className="farm-log-card__accent-line"
                style={{
                  background: `linear-gradient(90deg, transparent, ${point.accent}, transparent)`,
                }}
                aria-hidden="true"
              />
              <span
                aria-hidden="true"
                style={{
                  fontSize: '2.5rem',
                  color: point.accent,
                  position: 'relative',
                  zIndex: 2,
                  filter: `drop-shadow(0 0 12px ${point.accent}44)`,
                }}
              >
                {point.icon}
              </span>
            </div>

            {/* Card body */}
            <div className="farm-log-card__body">
              <div className="farm-log-card__rows">
                <div className="farm-log-card__row">
                  <span
                    className="farm-log-card__row-value"
                    style={{ color: point.accent, fontSize: '13px' }}
                  >
                    {point.title}
                  </span>
                </div>
              </div>
              <p className="farm-log-card__notes">{point.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Closed loop cycle strip ── */}
      <div
        data-reveal="up"
        data-reveal-delay="200"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexWrap: 'wrap',
          gap: 0,
          marginBottom: '52px',
          padding: '32px 0',
          borderTop: '1px solid rgba(255,255,255,0.05)',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        {CYCLE_STEPS.map((step, i) => (
          <div
            key={step.label}
            style={{ display: 'flex', alignItems: 'center' }}
          >
            <div style={{ textAlign: 'center', padding: '0 16px' }}>
              <div
                className="farm-stats-bar__item"
                style={{
                  width: '72px',
                  height: '72px',
                  borderRadius: '50%',
                  border: '1px solid rgba(0,255,65,0.2)',
                  background: 'rgba(0,255,65,0.04)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 12px',
                  fontSize: '1.5rem',
                  color: 'var(--neon)',
                }}
              >
                {step.icon}
              </div>
              <p
                style={{
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '12px',
                  fontWeight: 500,
                  margin: 0,
                }}
              >
                {step.label}
              </p>
              <p
                style={{
                  color: 'rgba(255,255,255,0.28)',
                  fontSize: '10px',
                  margin: '3px 0 0',
                  letterSpacing: '0.06em',
                }}
              >
                {step.sub}
              </p>
            </div>
            {i < CYCLE_STEPS.length - 1 && (
              <span
                aria-hidden="true"
                style={{
                  color: 'rgba(0,255,65,0.3)',
                  fontSize: '16px',
                  flexShrink: 0,
                }}
              >
                →
              </span>
            )}
          </div>
        ))}

        {/* Closing loop label */}
        <div style={{ width: '100%', textAlign: 'center', marginTop: '14px' }}>
          <span
            style={{
              color: 'rgba(0,255,65,0.2)',
              fontSize: '10px',
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            ↑ ─── cycle continues indefinitely ───↑
          </span>
        </div>
      </div>

      {/* ── B2B CTA — matches farm-btn style ── */}
      <div
        data-reveal="up"
        data-reveal-delay="280"
        style={{ textAlign: 'center' }}
      >
        {/* FarmERP note style — repurposed for BSF enquiry */}
        <div
          className="farm-log-erp-note"
          style={{ maxWidth: '560px', margin: '0 auto' }}
        >
          <div className="farm-log-erp-note__header">
            <span className="farm-hero__live-dot" aria-hidden="true" />
            <span>Regenerative Protein · B2B Enquiries Welcome</span>
          </div>
          <p className="farm-log-erp-note__body">
            Ubuntu's closed-loop farming system is available to sustainable
            food businesses. If you're interested in partnering on regenerative
            protein inputs, we'd like to hear from you.
          </p>
          <Link href={STORY.ctaHref} className="farm-btn farm-btn--neon">
            {STORY.ctaLabel} →
          </Link>
        </div>
      </div>

    </div>
  )
}