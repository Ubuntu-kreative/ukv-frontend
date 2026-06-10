/**
 * app/restaurant/components/Hero.tsx
 *
 * PURE SERVER COMPONENT — zero client JS, zero hydration cost.
 * Rendered once at build/request time; ships as static HTML.
 *
 * Architecture decisions:
 * - No 'use client' — nothing here is interactive
 * - CSS-only animations (fade-in, slide-up via @keyframes in restaurant.css)
 * - next/image with priority + sizes prevents LCP regression
 * - Navbar offset via padding-top: var(--nav-height) — no hacky fixes
 * - Scroll CTA is a plain <a href="#menu"> — zero JS needed
 */

import Image from 'next/image'

// Module-level — allocated once at build time, never recreated
const HERO_DETAILS = [
  { icon: '🐟', text: 'Fresh Lake Victoria fish' },
  { icon: '🌿', text: 'Farm harvested produce'   },
  { icon: '🔥', text: 'Slow cooked Tumbukiza'    },
] as const

export default function RestaurantHero() {
  return (
    <section
      className="ukv-hero"
      aria-label="Ubuntu Kreative Village Restaurant"
    >
      {/* ── Background image ── */}
      <div className="ukv-hero__image-wrap" aria-hidden="true">
        <Image
          src="/images/restaurant-hero1.jpeg"
          alt=""           /* decorative — screen readers skip */
          fill
          priority         /* LCP image — load immediately     */
          sizes="100vw"
          quality={85}
          className="ukv-hero__image"
          style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
          /*
           * placeholder="blur" requires blurDataURL.
           * Replace the string below with a real base64 LQIP from your pipeline.
           * Generate with: npx plaiceholder ./public/images/restaurant/hero.jpg
           */
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAgGBgcGBQgHBwcJCQgKDBQNDAsLDBkSEw8UHRofHh0aHBwgJC4nICIsIxwcKDcpLDAxNDQ0Hyc5PTgyPC4zNDL/2wBDAQkJCQwLDBgNDRgyIRwhMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjIyMjL/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAABgUEB//EAB8QAAICAQUBAAAAAAAAAAAAAAECAAMEERIhMf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AqLs2vJakBkL7TqNxhYLX0xygRERM2EjdtYb6SoiIH//Z"
        />

        {/* Layered overlays — warm cinematic depth, compositor-safe */}
        <div className="ukv-hero__overlay ukv-hero__overlay--base"     aria-hidden="true" />
        <div className="ukv-hero__overlay ukv-hero__overlay--vignette" aria-hidden="true" />
        <div className="ukv-hero__overlay ukv-hero__overlay--smoke"    aria-hidden="true" />
      </div>

      {/* ── Content ── */}
      <div className="ukv-hero__content">

        {/* Eyebrow label */}
        <div
          className="ukv-hero__eyebrow ukv-anim-fade-up"
          style={{ animationDelay: '0ms' }}
        >
          <span className="ukv-hero__eyebrow-line" aria-hidden="true" />
          <span>Ubuntu Kreative Village — Farm-to-Fork Dining</span>
          <span className="ukv-hero__eyebrow-line" aria-hidden="true" />
        </div>

        {/* Headline */}
        <h1
          className="ukv-hero__headline ukv-anim-fade-up"
          style={{ animationDelay: '120ms' }}
        >
          Where the Farm
          <br />
          <em className="ukv-hero__headline-accent">Becomes the Feast</em>
        </h1>

        {/* Supporting copy */}
        <p
          className="ukv-hero__body ukv-anim-fade-up"
          style={{ animationDelay: '240ms' }}
        >
          Every dish begins in soil we tend ourselves. Traced from field to fire,
          your plate carries the story of this land — slow, intentional, alive.
        </p>

        {/* CTAs — plain anchors, zero JS */}
        <div
          className="ukv-hero__ctas ukv-anim-fade-up"
          style={{ animationDelay: '360ms' }}
        >
          {/* Smooth-scrolls to #menu — the id set on MenuGrid's root div */}
          <a href="#menu" className="ukv-hero__cta ukv-hero__cta--primary">
            Explore the Menu
          </a>
          <a href="/reservations" className="ukv-hero__cta ukv-hero__cta--secondary">
            Reserve a Table
          </a>
        </div>

        {/* Floating micro-details */}
        <ul
          className="ukv-hero__details ukv-anim-fade-up"
          style={{ animationDelay: '480ms' }}
          aria-label="Today's highlights"
        >
          {HERO_DETAILS.map((d) => (
            <li key={d.text} className="ukv-hero__detail-item">
              <span className="ukv-hero__detail-icon" aria-hidden="true">{d.icon}</span>
              <span className="ukv-hero__detail-text">{d.text}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scroll indicator — CSS animation only */}
      <div className="ukv-hero__scroll-indicator" aria-hidden="true">
        <span className="ukv-hero__scroll-dot" />
      </div>
    </section>
  )
}