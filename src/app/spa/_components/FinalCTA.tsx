/**
 * _components/FinalCTA.tsx — SERVER COMPONENT
 * Particles use the same CSS class injected by SpaHero — no re-injection.
 */

import Link from 'next/link'

const PARTICLES = Array.from({ length: 12 }, (_, i) => ({
  left:     `${i * (100 / 12)}%`,
  duration: `${14 + i * 0.7}s`,
  delay:    `${i * 0.6}s`,
}))

export default function FinalCTA() {
  return (
    <section className="relative py-40 px-6 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.055),transparent_65%)]" aria-hidden="true" />

      {/* Particles reuse the .arohamai-particle CSS from SpaHero */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {PARTICLES.map((p, i) => (
          <div
            key={i}
            className="arohamai-particle"
            style={{ left: p.left, animationDuration: p.duration, animationDelay: p.delay }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Restoration Awaits</p>
        <h2 className="font-display text-5xl md:text-8xl leading-[0.88] mb-10">
          YOUR BODY HAS BEEN
          <span className="italic text-gold"> ASKING FOR THIS</span>
        </h2>
        <p className="max-w-xl mx-auto text-base text-white/32 leading-relaxed mb-12 italic">
          &ldquo;Healing is not a luxury. It is your right.&rdquo;
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center bg-gold text-black px-14 py-6 text-[10px] uppercase tracking-[0.25em] rounded-full hover:bg-gold/90 transition-colors duration-300 font-semibold"
        >
          BEGIN YOUR RESTORATION
        </Link>
      </div>
    </section>
  )
}