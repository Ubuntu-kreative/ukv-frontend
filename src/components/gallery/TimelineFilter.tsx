'use client'

import React, { useCallback } from 'react'
import { motion } from 'framer-motion'

type Props = {
  years: number[]
  activeYear: number | null
  onYearChange: (year: number | null) => void
}

const FS = {
  label: '10px',
  cta: '11px',
}

export function TimelineFilter({ years, activeYear, onYearChange }: Props) {
  const sortedYears = [...years].sort((a, b) => b - a)

  const handleYearClick = useCallback((year: number | null) => {
    onYearChange(year)
  }, [onYearChange])

  return (
    <section
      id="timeline-filter"
      style={{
        position: 'relative',
        zIndex: 10,
        padding: 'clamp(60px, 8vw, 100px) 0',
        borderTop: '1px solid rgba(255,255,255,0.04)',
        background: 'rgba(255,255,255,0.008)',
      }}
    >
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        padding: '0 clamp(24px, 5vw, 80px)',
      }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: '-80px' }}
          style={{ marginBottom: 'clamp(36px, 5vw, 52px)' }}
        >
          <h3 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.3rem, 3vw, 1.8rem)',
            fontWeight: 300,
            color: 'var(--cream, #F5F0E8)',
            marginBottom: 12,
            lineHeight: 1.1,
          }}>
            Browse by Year
          </h3>

          <p style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: 'rgba(255, 255, 255, 0.4)',
            lineHeight: 1.6,
          }}>
            Filter gallery photos by year to see Ubuntu's journey through time.
          </p>
        </motion.div>

        {/* Year Filter Buttons */}
        <div style={{
          display: 'flex',
          gap: 12,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}>
          {/* "All Years" button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            viewport={{ once: true, margin: '-80px' }}
            onClick={() => handleYearClick(null)}
            style={{
              padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2vw, 24px)',
              borderRadius: 10,
              border: activeYear === null
                ? '1px solid rgba(200, 169, 110, 0.5)'
                : '1px solid rgba(255, 255, 255, 0.1)',
              background: activeYear === null
                ? 'rgba(200, 169, 110, 0.12)'
                : 'rgba(255, 255, 255, 0.04)',
              color: activeYear === null
                ? '#C8A96E'
                : 'rgba(255, 255, 255, 0.4)',
              fontFamily: 'var(--font-body)',
              fontSize: FS.cta,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={e => {
              const btn = e.currentTarget as HTMLButtonElement
              if (activeYear !== null) {
                btn.style.background = 'rgba(255, 255, 255, 0.08)'
                btn.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              }
            }}
            onMouseLeave={e => {
              const btn = e.currentTarget as HTMLButtonElement
              if (activeYear !== null) {
                btn.style.background = 'rgba(255, 255, 255, 0.04)'
                btn.style.borderColor = 'rgba(255, 255, 255, 0.1)'
              }
            }}
          >
            All
          </motion.button>

          {/* Year buttons */}
          {sortedYears.map((year, idx) => (
            <motion.button
              key={year}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: (idx + 1) * 0.05 }}
              viewport={{ once: true, margin: '-80px' }}
              onClick={() => handleYearClick(year)}
              style={{
                padding: 'clamp(8px, 1.5vw, 12px) clamp(16px, 2vw, 24px)',
                borderRadius: 10,
                border: activeYear === year
                  ? '1px solid rgba(200, 169, 110, 0.5)'
                  : '1px solid rgba(255, 255, 255, 0.1)',
                background: activeYear === year
                  ? 'rgba(200, 169, 110, 0.12)'
                  : 'rgba(255, 255, 255, 0.04)',
                color: activeYear === year
                  ? '#C8A96E'
                  : 'rgba(255, 255, 255, 0.4)',
                fontFamily: 'var(--font-body)',
                fontSize: FS.cta,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={e => {
                const btn = e.currentTarget as HTMLButtonElement
                if (activeYear !== year) {
                  btn.style.background = 'rgba(255, 255, 255, 0.08)'
                  btn.style.borderColor = 'rgba(255, 255, 255, 0.2)'
                }
              }}
              onMouseLeave={e => {
                const btn = e.currentTarget as HTMLButtonElement
                if (activeYear !== year) {
                  btn.style.background = 'rgba(255, 255, 255, 0.04)'
                  btn.style.borderColor = 'rgba(255, 255, 255, 0.1)'
                }
              }}
            >
              {year}
            </motion.button>
          ))}
        </div>

        {/* Filter Info */}
        {activeYear && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              marginTop: 'clamp(16px, 2vw, 24px)',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.3)',
              letterSpacing: '0.06em',
            }}
          >
            Showing photos from {activeYear}
          </motion.p>
        )}
      </div>
    </section>
  )
}
