/**
 * components/ReservationCTA.tsx
 *
 * PURE SERVER COMPONENT — static HTML CTA section.
 * No JS needed; links are plain anchors.
 */

export default function ReservationCTA() {
  return (
    <section className="ukv-res-cta" aria-labelledby="res-cta-heading">
      <div className="ukv-res-cta__inner">

        <div className="ukv-res-cta__eyebrow">
          <span className="ukv-res-cta__line" aria-hidden="true" />
          <span>Reserve Your Table</span>
          <span className="ukv-res-cta__line" aria-hidden="true" />
        </div>

        <h2 id="res-cta-heading" className="ukv-res-cta__heading">
          Dine Under the Acacia
        </h2>

        <p className="ukv-res-cta__body">
          Join us for an evening where the farm becomes your table.
          Private boma dinners, harvest celebrations, and sunset feasts
          available for groups. All ingredients harvested the same day.
        </p>

        <div className="ukv-res-cta__actions">
          <a href="/reservations" className="ukv-hero__cta ukv-hero__cta--primary">
            Book a Table
          </a>
          <a href="/contact" className="ukv-hero__cta ukv-hero__cta--secondary">
            Private Events
          </a>
        </div>

        <p className="ukv-res-cta__footnote">
          Walk-ins welcome when space allows · +254 700 000 000
        </p>
      </div>
    </section>
  )
}