'use client'

import { memo, useEffect, useState } from 'react'
import styles from './MoxieChat.module.css'

interface MoxiePresenceProps {
  onActivate: () => void
  attentive?: boolean
}

function MoxiePresenceInner({ onActivate, attentive = true }: MoxiePresenceProps) {
  const [wave, setWave] = useState(false)
  const [hint, setHint] = useState(false)

  useEffect(() => {
    if (!attentive) return
    const waveTimer = window.setTimeout(() => setWave(true), 3200)
    const hintTimer = window.setTimeout(() => setHint(true), 4800)
    return () => {
      clearTimeout(waveTimer)
      clearTimeout(hintTimer)
    }
  }, [attentive])

  return (
    <div className={styles.presenceWrap}>
      {hint && attentive && (
        <div className={styles.presenceHint} role="status">
          <span>Ask Moxie</span>
        </div>
      )}

      <button
        type="button"
        data-moxie-trigger
        className={`${styles.presenceButton} ${wave ? styles.presenceWave : ''}`}
        onClick={onActivate}
        aria-label="Open Moxie concierge"
      >
        <span className={styles.presenceGlow} aria-hidden />
        <span className={styles.presenceAvatar} aria-hidden>
          <svg viewBox="0 0 64 64" className={styles.presenceSvg} role="img" aria-label="">
            <defs>
              <linearGradient id="moxieFace" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f0e6d3" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#c8a84b" stopOpacity="0.85" />
              </linearGradient>
            </defs>
            <circle cx="32" cy="34" r="18" fill="url(#moxieFace)" opacity="0.92" />
            <ellipse cx="32" cy="58" rx="14" ry="6" fill="rgba(200,168,75,0.12)" />
            <path
              className={styles.presenceHand}
              d="M46 28 C52 22 56 26 54 34 C53 38 50 36 48 32"
              fill="none"
              stroke="rgba(237,230,211,0.75)"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <circle cx="26" cy="32" r="1.8" fill="#1a1814" />
            <circle cx="38" cy="32" r="1.8" fill="#1a1814" />
            <path d="M27 38 Q32 41 37 38" fill="none" stroke="#1a1814" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
        </span>
        <span className={styles.presenceRing} aria-hidden />
      </button>
    </div>
  )
}

export default memo(MoxiePresenceInner)
