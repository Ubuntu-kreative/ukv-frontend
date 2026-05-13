'use client'

/**
 * ── Hero Component ────────────────────────────────────────────
 * Features: 
 * - Ambient video background with Live Status (Weather + Pulse).
 * - High-end visual overlays: Earth-tone grading & HUD Scanlines.
 * - Magnetic Button logic using Framer Motion for tactile interaction.
 * - Corner bracket HUD elements for a "high-tech/low-life" aesthetic.
 * ──────────────────────────────────────────────────────────────
 */

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Hero() {
  const [loaded, setLoaded]         = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [weather, setWeather]       = useState<string>('24°C')
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 150)
    // Optional: Real weather fetch logic can be added here in Phase 3
    return () => clearTimeout(t)
  }, [])

  // ── Magnetic Button Logic ──
  const useMagnetic = () => {
    const [pos, setPos] = useState({ x: 0, y: 0 });
    
    const handleMouse = (e: React.MouseEvent<HTMLDivElement>) => {
      const { clientX, clientY, currentTarget } = e;
      const { width, height, left, top } = currentTarget.getBoundingClientRect();
      
      // Calculate distance from center of the button
      const x = clientX - (left + width / 2);
      const y = clientY - (top + height / 2);
      
      // 0.25 multiplier for a responsive "magnetic" pull
      setPos({ x: x * 0.25, y: y * 0.25 });
    };
    
    const reset = () => setPos({ x: 0, y: 0 });
    
    return { pos, handleMouse, reset };
  };

  const mag1 = useMagnetic();
  const mag2 = useMagnetic();

  return (
    <section
      className="relative flex items-end overflow-hidden"
      style={{ minHeight: '100svh' }}
    >
      {/* ── VIDEO LAYER ── */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        onCanPlay={() => setVideoReady(true)}
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity:    videoReady ? 1 : 0,
          transition: 'opacity 1.5s ease',
          zIndex:     0,
        }}
      >
        <source
          src="https://videos.pexels.com/video-files/3571264/3571264-uhd_2560_1440_30fps.mp4"
          type="video/mp4"
        />
        <source
          src="https://videos.pexels.com/video-files/2499611/2499611-uhd_2560_1440_25fps.mp4"
          type="video/mp4"
        />
      </video>

      {/* ── FALLBACK GRADIENT (shows while video loads) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0A0A0A 0%, #1A1208 50%, #0A0A0A 100%)',
          zIndex:     0,
          opacity:    videoReady ? 0 : 1,
          transition: 'opacity 1.2s ease',
        }}
      />

      {/* ── DARK OVERLAY (Text Readability) ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            linear-gradient(
              to bottom,
              rgba(0,0,0,0.35) 0%,
              rgba(0,0,0,0.15) 40%,
              rgba(0,0,0,0.60) 75%,
              rgba(0,0,0,0.90) 100%
            )
          `,
          zIndex: 1,
        }}
      />

      {/* ── EARTH TONE COLOUR GRADE ── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 60% at 15% 85%, rgba(44,24,16,0.55) 0%, transparent 55%),
            radial-gradient(ellipse 50% 40% at 80% 15%, rgba(0,255,65,0.03) 0%, transparent 50%)
          `,
          zIndex: 2,
        }}
      />

      {/* ── SCAN LINES ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
          zIndex: 3,
        }}
      />

      {/* ── CORNER HUD BRACKETS ── */}
      {[
        { top: '88px',    left:  '24px', borderTop: '1px solid var(--neon)', borderLeft:   '1px solid var(--neon)' },
        { top: '88px',    right: '24px', borderTop: '1px solid var(--neon)', borderRight:  '1px solid var(--neon)' },
        { bottom: '32px', left:  '24px', borderBottom: '1px solid var(--neon)', borderLeft: '1px solid var(--neon)' },
        { bottom: '32px', right: '24px', borderBottom: '1px solid var(--neon)', borderRight:'1px solid var(--neon)' },
      ].map((s, i) => (
        <div
          key={i}
          className="absolute pointer-events-none opacity-30"
          style={{ ...s, width: 24, height: 24, zIndex: 4 }}
        />
      ))}

      {/* ── HERO CONTENT ── */}
      <div
        className="relative z-10 w-full max-w-8xl mx-auto px-6 md:px-10 pt-43 md:pb-45"
        style={{ zIndex: 5 }}
      >
        
        {/* Status Label + Weather */}
        <div
          className="flex items-center gap-4 mb-8"
          style={{
            opacity:    loaded ? 1 : 0,
            transform:  loaded ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 0.8s ease, transform 0.8s ease',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00FF41] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00FF41]"></span>
            </span>
            <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/80">
              Farm Online • {weather}
            </span>
          </div>
          <span className="h-[1px] w-12 bg-white/20" />
          <span className="font-body text-[10px] tracking-[0.2em] uppercase text-white/40">
            Kenya · Est. 2024
          </span>
        </div>

        {/* Main headline */}
        <h1
          className="font-display leading-[0.88] mb-6"
          style={{
            fontSize:   'clamp(3.2rem, 10vw, 8.5rem)',
            fontWeight: 300,
            color:      '#FFFFFF',
            textShadow: '0 2px 40px rgba(0,0,0,0.5)',
            opacity:    loaded ? 1 : 0,
            transform:  loaded ? 'translateY(0)' : 'translateY(28px)',
            transition: 'opacity 1s ease 0.1s, transform 1s ease 0.1s',
          }}
        >
          <em style={{ fontStyle: 'italic' }}>I am</em>
          <br />
          because{' '}
          <span style={{ color: 'var(--gold)', textShadow: '0 0 60px rgba(212,168,83,0.4)' }}>
            we are.
          </span>
        </h1>

        {/* Sub-copy */}
        <p
          className="font-body max-w-lg mb-10 text-white/60"
          style={{
            fontSize:      'clamp(0.75rem, 1.5vw, 0.875rem)',
            lineHeight:    1.9,
            letterSpacing: '0.02em',
            opacity:       loaded ? 1 : 0,
            transform:     loaded ? 'translateY(0)' : 'translateY(16px)',
            transition:    'opacity 1s ease 0.25s, transform 1s ease 0.25s',
          }}
        >
          A living farm retreat in Kenya — where Pokomo Cottages,
          Arohamai Spa, and farm-to-fork dining converge in one
          immersive village experience.
        </p>

        {/* Magnetic Buttons */}
        <div
          className="flex flex-wrap items-center gap-6"
          style={{
            opacity:    loaded ? 1 : 0,
            transform:  loaded ? 'translateY(0)' : 'translateY(16px)',
            transition: 'opacity 1s ease 0.4s, transform 1s ease 0.4s',
          }}
        >
          <motion.div
            onMouseMove={mag1.handleMouse}
            onMouseLeave={mag1.reset}
            animate={{ x: mag1.pos.x, y: mag1.pos.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
          >
            <Link href="/contact" className="btn-gold">
              <span>Reserve Your Stay</span>
            </Link>
          </motion.div>

          <motion.div
            onMouseMove={mag2.handleMouse}
            onMouseLeave={mag2.reset}
            animate={{ x: mag2.pos.x, y: mag2.pos.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
          >
            <Link href="/cottages" className="btn-neon">
              <span>Explore cottages</span>
            </Link>
          </motion.div>
        </div>

        {/* Footer Meta */}
        <p
          className="font-body text-[8px] tracking-wider mt-8"
          style={{
            color:      'rgba(255,255,255,0.2)',
            opacity:    loaded ? 1 : 0,
            transition: 'opacity 1s ease 1s',
          }}
        >
          Kenya Highlands · Sustainable Luxury · Living Architecture
        </p>
      </div>

      {/* ── SCROLL INDICATOR ── */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{
          zIndex:     5,
          opacity:    loaded ? 1 : 0,
          transition: 'opacity 1s ease 1s',
        }}
      >
        <span
          className="font-body text-[8px] tracking-[0.35em] uppercase"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Scroll
        </span>
        <div
          style={{
            width:      '1px',
            height:     '48px',
            background: 'linear-gradient(to bottom, rgba(0,255,65,0.6), transparent)',
            animation:  'float 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  )
}