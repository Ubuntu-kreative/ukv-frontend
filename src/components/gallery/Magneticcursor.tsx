'use client'
// ─────────────────────────────────────────────────────────────────────────────
// MagneticCursor — inertia cursor with accent colour shift
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion'

export function MagneticCursor({ accentColor }: { accentColor: string }) {
  const prefersReducedMotion = useReducedMotion()
  const cx = useMotionValue(-200)
  const cy = useMotionValue(-200)
  const sx = useSpring(cx, { stiffness: prefersReducedMotion ? 1000 : 80, damping: prefersReducedMotion ? 100 : 18, mass: 0.6 })
  const sy = useSpring(cy, { stiffness: prefersReducedMotion ? 1000 : 80, damping: prefersReducedMotion ? 100 : 18, mass: 0.6 })
  const [expanded, setExpanded] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const move = (e: MouseEvent) => {
      cx.set(e.clientX)
      cy.set(e.clientY)
      if (!visible) setVisible(true)
    }
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement
      setExpanded(!!(t.closest('button') || t.closest('a') || t.closest('[data-cursor-expand]')))
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mouseover', over)
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mouseover', over)
    }
  }, [cx, cy, visible])

  return (
    <motion.div
      style={{
        x: sx, y: sy,
        translateX: '-50%', translateY: '-50%',
        position: 'fixed', top: 0, left: 0,
        zIndex: 9999, pointerEvents: 'none',
        opacity: visible ? 1 : 0,
      }}
    >
      <motion.div
        animate={{
          width: expanded ? 56 : 28,
          height: expanded ? 56 : 28,
          borderColor: accentColor,
          opacity: expanded ? 0.7 : 0.45,
        }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 260, damping: 22 }}
        style={{
          borderRadius: '50%',
          border: '1px solid',
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
      <motion.div
        animate={{ scale: expanded ? 0.4 : 1, backgroundColor: accentColor }}
        transition={prefersReducedMotion ? { duration: 0 } : { type: 'spring', stiffness: 320, damping: 24 }}
        style={{
          width: 5, height: 5, borderRadius: '50%',
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
        }}
      />
    </motion.div>
  )
}