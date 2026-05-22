// src/lib/email/client.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Resend Email Client
// Single initialisation point. Import `resend` anywhere email is needed.
// ─────────────────────────────────────────────────────────────────────────────

import { Resend } from 'resend'

// Lazy-initialised so Next.js build doesn't fail when env var is absent
let _resend: Resend | null = null

export function getResendClient(): Resend {
  if (!_resend) {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      throw new Error(
        '[Email] Missing RESEND_API_KEY environment variable. ' +
        'Add it to your .env.local and Vercel environment settings.'
      )
    }
    _resend = new Resend(apiKey)
  }
  return _resend
}

// ── Shared sender addresses ───────────────────────────────────────────────────
export const SENDER = {
  default:       'Ubuntu Kreative Village <hello@ubuntuecolodge.com>',
  noreply:       'Ubuntu Kreative Village <noreply@ubuntuecolodge.com>',
  reservations:  'Ubuntu Reservations <reservations@ubuntuecolodge.com>',
  admin:         'Ubuntu Admin <admin@ubuntuecolodge.com>',
} as const

// ── Admin alert recipient ─────────────────────────────────────────────────────
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? 'hello@ubuntuecolodge.com'

// ── Result type returned by all send-* helpers ────────────────────────────────
export interface EmailResult {
  success: boolean
  id?:     string
  error?:  string
}
