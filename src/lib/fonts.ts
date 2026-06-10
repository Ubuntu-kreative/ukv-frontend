/**
 * src/lib/fonts.ts — Font configuration using next/font
 * 
 * This file exports font variable objects that are automatically
 * injected into CSS and can be used in classNames or style props.
 * 
 * Fonts are:
 * - Hosted on Vercel CDN (no external request to Google)
 * - Pre-loaded and subsetted (only Latin characters used)
 * - Font-display: swap (prevents FOUT, allows FOIT)
 * 
 * Usage in layout.tsx:
 *   <html className={`${cormorant.variable} ${dmSans.variable} ${playfair.variable} ${dmMono.variable}`}>
 */

import { Cormorant_Garamond, DM_Sans, Playfair_Display, DM_Mono } from 'next/font/google'

// ── Cormorant Garamond: Editorial luxury (headings, room names, pull-quotes) ──
export const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-display',
  preload: true,
})

// ── DM Sans: Precise humanist sans (body, nav, labels, CTAs) ──
export const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['200', '300', '400', '500', '600'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-body',
  preload: true,
})

// ── Playfair Display: Italic luxury (pull-quotes, ritual names) ──
export const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  style: ['italic'],
  display: 'swap',
  variable: '--font-accent',
  preload: true,
})

// ── DM Mono: Monospace for prices and telemetry ──
export const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-mono',
  preload: true,
})
