/**
 * components/MenuTicker.tsx
 *
 * PURE SERVER COMPONENT — pure CSS infinite marquee.
 * Zero JS. Zero state. Zero hydration cost.
 * Ships as static HTML + a single CSS animation.
 */

import { TICKER_MESSAGES } from '../_data/menu-data'

// Pre-doubled at build time — CSS animation only needs 50% translateX
const TICKER_DOUBLED = [...TICKER_MESSAGES, ...TICKER_MESSAGES]

export default function MenuTicker() {
  return (
    <div className="ukv-ticker" aria-label="Kitchen updates" role="marquee">
      {/* Fade masks */}
      <div className="ukv-ticker__fade ukv-ticker__fade--left"  aria-hidden="true" />
      <div className="ukv-ticker__fade ukv-ticker__fade--right" aria-hidden="true" />

      <div className="ukv-ticker__track" aria-hidden="true">
        {TICKER_DOUBLED.map((msg, i) => (
          <span key={`ticker-${i}`} className="ukv-ticker__item">
            {msg}
            <span className="ukv-ticker__separator" aria-hidden="true">◆</span>
          </span>
        ))}
      </div>

      {/* Screen reader only — first copy, readable */}
      <ul className="sr-only">
        {TICKER_MESSAGES.map((msg) => (
          <li key={msg}>{msg}</li>
        ))}
      </ul>
    </div>
  )
}