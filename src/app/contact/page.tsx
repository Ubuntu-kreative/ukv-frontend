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
import Nav    from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import { BookingShell } from './_components/BookingShell'

export const metadata: Metadata = {
  title: 'Book a Stay | Ubuntu Kreative Village',
  description: 'Reserve your cottage, spa treatment, farm experience or private event at Ubuntu Kreative Village — Kenya\'s premier off-grid eco lodge.',
  openGraph: { images: ['/images/Cottages-front.jpeg'] },
}

export default function BookPage() {
  return (
    <main className="bg-[var(--obsidian)] min-h-screen text-white">
      <Nav />
      <BookingShell />
      <Footer />
      <MoxieChat />
    </main>
  )
}