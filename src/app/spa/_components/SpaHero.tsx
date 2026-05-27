/**
 * _components/SpaHero.tsx — SERVER COMPONENT
 *
 * Zero JS. Renders as static HTML on the server.
 * The hero image is the LCP element — priority + sizes ensures
 * Next.js generates the correct srcset and preloads it.
 *
 * Scroll CTA: plain <a href="#services"> — no JS needed.
 * Booking CTA: plain <a href="/contact"> — no JS needed.
 *
 * Animations: CSS-only keyframes in the <style> block below.
 * These are inlined so they ship with the HTML, not deferred
 * behind a JS bundle.
 *
 * FIX: video completely removed from server render.
 * The ModalController (client) can inject the video via
 * useEffect after the hero has painted if desired.
 */

import Image from 'next/image'
import Link  from 'next/link'

// Particle positions pre-computed — never random at runtime (avoids hydration mismatch)
const PARTICLES = [0,1,2,3,4,5,6,7,8,9,10,11,12,13].map(i => ({
  left:     `${i * (100 / 14)}%`,
  duration: `${14 + i * 0.7}s`,
  delay:    `${i * 0.6}s`,
}))

export default function SpaHero() {
  return (
    <>
      {/* CSS injected once with the HTML — no JS parse cost */}
      <style>{`
        @keyframes particle-rise {
          0%   { transform: translateY(0);      opacity: 0;    }
          10%  { opacity: 0.45; }
          90%  { opacity: 0.20; }
          100% { transform: translateY(-130vh); opacity: 0;    }
        }
        .arohamai-particle {
          position: absolute; bottom: 0;
          width: 1px; height: 1px; border-radius: 9999px;
          background: rgba(212,175,55,0.25);
          animation: particle-rise linear infinite;
          will-change: transform;
        }
        @keyframes timeline-fade-in {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        .timeline-step { animation: timeline-fade-in 0.4s ease both; }
        @keyframes hero-fade-up {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        .hero-fade-up {
          animation: hero-fade-up 1.2s cubic-bezier(0.16,1,0.3,1) both;
        }
        .hero-fade-up-d1 { animation-delay: 0.12s; }
        .hero-fade-up-d2 { animation-delay: 0.28s; }
        .hero-fade-up-d3 { animation-delay: 0.44s; }
        .hero-fade-up-d4 { animation-delay: 0.60s; }
        @keyframes scroll-bounce {
          0%, 100% { transform: translateY(0); opacity: 0.4; }
          50%       { transform: translateY(8px); opacity: 0.1; }
        }
        .scroll-dot { animation: scroll-bounce 2.5s ease-in-out infinite; }
      `}</style>

      <section
        className="relative w-full min-h-screen flex flex-col overflow-hidden"
        aria-label="Arohamai Spa at Ubuntu Eco Lodge"
      >
        {/* Background image — LCP element */}
        <div className="absolute inset-0 scale-[1.05]" aria-hidden="true">
          <Image
            src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Layered overlays — compositor-only, no layout cost */}
          <div className="absolute inset-0 bg-black/55" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-[#050505]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(212,175,55,0.08),transparent)]" />
        </div>

        {/* Particles — CSS-only, no JS state, pre-computed positions */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          {PARTICLES.map((p, i) => (
            <div
              key={i}
              className="arohamai-particle"
              style={{ left: p.left, animationDuration: p.duration, animationDelay: p.delay }}
            />
          ))}
        </div>

        {/* Hero content */}
        <div className="relative flex-1 flex items-center justify-center px-6 page-hero-offset pb-16" style={{ zIndex: 10 }}>
          <div className="max-w-6xl w-full mx-auto text-center">

            <span className="hero-fade-up inline-block px-6 py-2.5 mb-10 border border-gold/20 bg-black/35 backdrop-blur-xl text-gold uppercase tracking-[0.35em] text-[10px] rounded-full">
              Arohamai Spa · Ubuntu Eco Lodge · Holistic Wellness
            </span>

            <h1 className="hero-fade-up hero-fade-up-d1 font-display text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.84] tracking-tight mb-8">
              ENTER THE<br />
              <span className="italic text-gold">HEALING SANCTUARY</span>
            </h1>

            <p className="hero-fade-up hero-fade-up-d2 max-w-2xl mx-auto text-base md:text-lg text-white/42 leading-relaxed mb-12 italic font-light">
              Holistic wellness from skin to body. Affordable luxury inspired by healing, nature, and
              restoration — mud baths, Moroccan hammam, massage therapies, facials, and signature healing packages.
            </p>

            <div className="hero-fade-up hero-fade-up-d3 flex flex-wrap justify-center gap-5">
              {/* CSS-scroll CTA — no JS */}
              <a
                href="#services"
                className="inline-flex items-center justify-center bg-gold text-black px-10 py-4 text-[10px] uppercase tracking-[0.25em] rounded-full hover:bg-gold/90 transition-colors duration-300 font-semibold"
              >
                EXPLORE SERVICES
              </a>
              <Link
                href="/contact"
                className="inline-flex items-center justify-center border border-gold/25 bg-black/20 backdrop-blur-xl px-9 py-4 uppercase tracking-[0.25em] text-[10px] text-gold hover:bg-gold/10 transition-all duration-500 rounded-full"
              >
                BOOK YOUR RITUAL
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator — CSS animation only */}
        <div className="relative flex flex-col items-center gap-2 pb-10 self-center" style={{ zIndex: 10 }} aria-hidden="true">
          <span className="text-[8px] uppercase tracking-[0.4em] text-white/18">Descend</span>
          <div className="w-px h-9 bg-gradient-to-b from-gold/25 to-transparent" />
          <div className="w-1 h-1 rounded-full bg-gold/40 scroll-dot" />
        </div>
      </section>
    </>
  )
}