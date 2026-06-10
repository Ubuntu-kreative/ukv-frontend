/**
 * _components/server/FarmHero.tsx — SERVER COMPONENT
 *
 * Changes from previous version:
 * • data-reveal attributes added for cinematic scroll system
 * • CSS class names unified to farm.css design system
 * • Video fade-in: JS (FarmVideoLoader) adds .farm-hero__video--playing class
 *   which triggers the CSS opacity transition — no layout shift, no FOUC
 * • All inline styles removed — pure className usage
 * • Scroll indicator uses CSS animation (farm-scroll-bounce keyframe)
 */

import Image from 'next/image'

export default function FarmHero() {
  return (
<section className="farm-hero relative w-full h-[85vh] max-h-[900px] overflow-hidden">
      {/* ── Background layers ── */}
      <div className="farm-hero__bg" aria-hidden="true">
        <Image
          src="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80"
          alt="Farm Hero"
          fill
          priority
         className="object-cover"
        />
        {/*
          Video element: no src. FarmVideoLoader (client island) injects
          src via requestIdleCallback after LCP, then adds
          .farm-hero__video--playing which triggers the CSS opacity transition.
        */}
        <video
          id="farm-hero-video"
          muted
          loop
          playsInline
          className="farm-hero__video"
          aria-hidden="true"
        />
        <div className="farm-hero__overlay farm-hero__overlay--gradient" />
        <div className="farm-hero__overlay farm-hero__overlay--radial"   />
      </div>

      {/* ── Decorative corner marks ── */}
      <span className="farm-hero__corner farm-hero__corner--tl" aria-hidden="true" />
      <span className="farm-hero__corner farm-hero__corner--tr" aria-hidden="true" />
      <span className="farm-hero__corner farm-hero__corner--bl" aria-hidden="true" />
      <span className="farm-hero__corner farm-hero__corner--br" aria-hidden="true" />

      {/* ── Content ── */}
      <div className="farm-hero__content">

        <div className="farm-hero__eyebrow" data-reveal="up" data-reveal-delay="0">
          <span className="farm-hero__eyebrow-line" />
          <span className="farm-hero__eyebrow-text">Kreative Village Farm</span>
          <span className="farm-hero__live-dot" />
          <span className="farm-hero__live-label">Live · 24 Animals · 6 Fields</span>
        </div>

        <h1 className="farm-hero__headline font-display" data-reveal="up" data-reveal-delay="80">
          The land<br />
          <em className="farm-hero__headline-accent">feeds everything.</em>
        </h1>

        <p className="farm-hero__body" data-reveal="up" data-reveal-delay="160">
          Walk our fields. Meet the animals. Harvest what you eat.
          Every meal, every spa treatment, every drop of milk — it all begins here.
        </p>

        <div className="farm-hero__ctas" data-reveal="up" data-reveal-delay="240">
          <a href="#farm-experiences" className="farm-btn farm-btn--gold">
            Book an Experience
          </a>
          <a href="#farm-log" className="farm-btn farm-btn--ghost">
            View Farm Log ↓
          </a>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="farm-hero__scroll" aria-hidden="true">
        <div className="farm-hero__scroll-line" />
        <span className="farm-hero__scroll-label">Scroll</span>
      </div>
    </section>
  )
}