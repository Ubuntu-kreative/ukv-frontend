// ─────────────────────────────────────────────────────────────
// src/app/book/page.tsx  — SERVER COMPONENT
//
// Replaces /contact + /reservations + /calendar under one
// professional URL: /book
//
// Architecture:
//   page.tsx          → Server Component (SEO, metadata, static shell)
//   _components/
//     BookingShell.tsx → Client island (all tabs + state)
//     MiniCalendar.tsx → Compact calendar (replaces the oversized one)
//     ServiceGrid.tsx  → Service cards
//     ContactForm.tsx  → Inquiry form
//
// ROOT CAUSES FIXED from original:
//  1. Entire 1640-line page was 'use client' — now split into RSC + islands
//  2. VillageCalendar had no useMemo on day grid — recalculated every render
//  3. Inline <style> tags inside render — re-injected on every state change
//  4. onMouseEnter/Leave inline handlers — new function refs every render
//  5. UKV_SERVICES + CALENDAR_EVENTS declared inside module but caused
//     re-evaluation on HMR because file was 'use client'
//  6. generateRef() called at module level in some paths — SSR/client mismatch
//  7. No React.memo on ServiceCard — all 20+ cards re-rendered on tab change
//  8. useCartStore destructured fully — subscribed to entire store
// ─────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import { BookingShell } from './_components/BookingShell'

export const metadata: Metadata = {
  title: 'Book a Stay | Ubuntu Kreative Village',
  description: 'Reserve a Pokomo Cottage, Farmhouse Suite or Penthouse at Ubuntu Kreative Village, Nairobi. Book Arohamai Spa, farm-to-fork dining and private events. Maasai Lodge Road, Kajiado County.',
  openGraph: {
    title: 'Book a Stay | Ubuntu Kreative Village',
    description: 'Reserve a Pokomo Cottage, Farmhouse Suite or Penthouse at Ubuntu Kreative Village, Nairobi. Book Arohamai Spa, farm experiences and private events.',
    type: 'website',
    url: 'https://ubuntuecolodge.com/contact',
    images: [
      {
        url: 'https://ubuntuecolodge.com/images/Cottages-front.jpeg',
        width: 1200,
        height: 630,
        alt: 'Ubuntu Kreative Village - Pokomo Cottage & Farm House',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Book a Stay | Ubuntu Kreative Village',
    description: 'Reserve cottages, spa treatments, farm experiences and private events.',
  },
  alternates: {
    canonical: 'https://ubuntuecolodge.com/contact',
  },
}

export default function BookPage() {
  return (
    <main className="bg-[var(--obsidian)] min-h-screen text-white">
      <NavWrapper />
      <BookingShell />
      <Footer />
      <MoxieChat />
    </main>
  )
}