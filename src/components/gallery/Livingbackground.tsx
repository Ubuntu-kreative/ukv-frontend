'use client'
// ─────────────────────────────────────────────────────────────────────────────
// LivingBackground — animated grain + aurora drift
// ─────────────────────────────────────────────────────────────────────────────

import { motion, useReducedMotion } from 'framer-motion'

export function LivingBackground({ accent = '#A8D8F0' }: { accent?: string }) {
  const prefersReducedMotion = useReducedMotion()

  return (
    <div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 0 }}
      aria-hidden
    >
      {/* Primary aurora orb */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { x: [0, 60, -40, 0], y: [0, -80, 40, 0], scale: [1, 1.15, 0.92, 1] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 28, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          position: 'absolute', top: '10%', left: '-10%',
          width: '55vw', height: '55vw',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}0d 0%, transparent 65%)`,
          filter: 'blur(60px)',
        }}
      />

      {/* Secondary gold orb */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { x: [0, -50, 30, 0], y: [0, 60, -30, 0], scale: [1, 0.88, 1.12, 1] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 36, repeat: Infinity, ease: 'easeInOut', delay: 8 }}
        style={{
          position: 'absolute', bottom: '5%', right: '-8%',
          width: '45vw', height: '45vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212,168,83,0.07) 0%, transparent 65%)',
          filter: 'blur(50px)',
        }}
      />

      {/* Tertiary mid orb */}
      <motion.div
        animate={prefersReducedMotion ? undefined : { x: [0, 80, -20, 0], y: [0, -40, 60, 0], scale: [1, 1.08, 0.95, 1] }}
        transition={prefersReducedMotion ? { duration: 0 } : { duration: 44, repeat: Infinity, ease: 'easeInOut', delay: 14 }}
        style={{
          position: 'absolute', top: '45%', left: '35%',
          width: '30vw', height: '30vw',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(168,209,240,0.04) 0%, transparent 65%)',
          filter: 'blur(70px)',
        }}
      />

      {/* Film grain overlay */}
      <div
        style={{
          position: 'absolute', inset: 0,
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundSize: '180px 180px',
          mixBlendMode: 'overlay',
        }}
      />

      {/* Scanline vignette */}
      <div
        style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 55%, rgba(0,0,0,0.45) 100%)',
        }}
      />
    </div>
  )
}