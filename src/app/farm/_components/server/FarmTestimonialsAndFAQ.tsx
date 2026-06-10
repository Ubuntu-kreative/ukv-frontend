/**
 * app/farm/_components/server/FarmTestimonialsAndFAQ.tsx
 *
 * Testimonials carousel + FAQ accordion.
 * Server component.
 */

import { TESTIMONIALS, FAQ_ITEMS } from '../../_data/farm-sections'

export default function FarmTestimonialsAndFAQ() {
  return (
    <>
      {/* ── TESTIMONIALS SECTION ── */}
      <section className="farm-section">
        <div className="farm-inner">
          {/* Header */}
          <div className="farm-section-header" data-reveal="up">
            <div className="farm-eyebrow">
              <span className="farm-eyebrow__line farm-eyebrow__line--gold" />
              <span className="farm-eyebrow__text">Guest Stories</span>
            </div>
            <h2 className="farm-section-title font-display">
              What Our{' '}
              <em className="farm-section-title-accent">Guests Are Saying</em>
            </h2>
          </div>

          {/* Testimonials Grid */}
          <div className="farm-testimonials-grid">
            {TESTIMONIALS.map((testimonial, idx) => (
              <div
                key={testimonial.id}
                className="farm-testimonial-card"
                style={{ borderColor: `${testimonial.accent}33` }}
                data-reveal="up"
                data-reveal-delay={`${idx * 60}`}
              >
                {/* Quote Mark */}
                <div
                  className="farm-testimonial-card__quote"
                  style={{ color: `${testimonial.accent}44` }}
                >
                  "
                </div>

                {/* Content */}
                <p className="farm-testimonial-card__content">
                  {testimonial.content}
                </p>

                {/* Highlight */}
                <p
                  className="farm-testimonial-card__highlight"
                  style={{ color: testimonial.accent }}
                >
                  {testimonial.highlight}
                </p>

                {/* Author */}
                <div className="farm-testimonial-card__author">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="farm-testimonial-card__avatar"
                  />
                  <div>
                    <p className="farm-testimonial-card__name">
                      {testimonial.name}
                    </p>
                    <p className="farm-testimonial-card__role">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ SECTION ── */}
      <section className="farm-section farm-section--alt">
        <div className="farm-inner">
          {/* Header */}
          <div className="farm-section-header" data-reveal="up">
            <div className="farm-eyebrow">
              <span className="farm-eyebrow__line" />
              <span className="farm-eyebrow__text">Questions</span>
            </div>
            <h2 className="farm-section-title font-display">
              Frequently Asked{' '}
              <em className="farm-section-title-accent">Questions</em>
            </h2>
          </div>

          {/* FAQ Grid - 2 columns */}
          <div className="farm-faq-grid">
            {FAQ_ITEMS.map((faq, idx) => (
              <details
                key={faq.id}
                className="farm-faq-item"
                data-reveal="left"
                data-reveal-delay={`${idx * 30}`}
              >
                <summary className="farm-faq-item__summary">
                  <span className="farm-faq-item__question">
                    {faq.question}
                  </span>
                  <span className="farm-faq-item__icon">+</span>
                </summary>

                <div className="farm-faq-item__answer">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
