'use client'

import { useState, useEffect } from 'react'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('ukv_cookie_consent')
    if (!consent) {
      const t = setTimeout(() => setVisible(true), 2000)
      return () => clearTimeout(t)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('ukv_cookie_consent', 'accepted')
    localStorage.setItem('ukv_cookie_date', new Date().toISOString())
    setVisible(false)
  }

  const decline = () => {
    localStorage.setItem('ukv_cookie_consent', 'declined')
    localStorage.setItem('ukv_cookie_date', new Date().toISOString())
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="cookie-banner" role="dialog" aria-label="Cookie consent" aria-live="polite">
      <div className="flex-1 min-w-0">
        <p className="font-body text-[11px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
          <span className="font-bold mr-1" style={{ color: 'var(--neon)' }}>
            Ubuntu Kreative Village
          </span>
          uses cookies to personalise your experience and power the Moxie AI concierge.
          By continuing, you consent in accordance with the{' '}
          <a href="/privacy-policy" style={{ color: 'var(--gold)', textDecoration: 'underline' }}>
            Kenya Data Protection Act 2019
          </a>
          .
        </p>
      </div>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={decline}
          className="font-body text-[10px] tracking-wider uppercase px-3 py-2"
          style={{ color: 'rgba(255,255,255,0.35)' }}
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="btn-neon"
          style={{ padding: '8px 20px', fontSize: '10px' }}
        >
          Accept
        </button>
      </div>
    </div>
  )
}