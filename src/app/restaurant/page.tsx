/**
 * app/restaurant/page.tsx
 *
 * SERVER COMPONENT ROOT — pure orchestration, zero client JS.
 *
 * Architecture:
 *   page.tsx        (server) — renders static shell
 *     Hero          (server) — zero JS, CSS-only animations
 *     MenuTicker    (server) — pure CSS marquee
 *     MenuGrid      (client) — ALL interactivity isolated here
 *     ReservationCTA (server) — static HTML CTA
 *
 * JS sent to browser: ONLY MenuGrid + MenuCard chunks.
 * Everything else is zero-JS static HTML.
 */

import type { Metadata } from 'next'

import Nav            from '@/components/Nav'
import Footer         from '@/components/Footer'
import RestaurantHero from './_components/Hero'
import MenuTicker     from './_components/MenuTicker'
import MenuGrid       from './_components/MenuGrid'
import ReservationCTA from './_components/ReservationCTA'

export const metadata: Metadata = {
  title:       'Ubuntu Feast | Farm-to-Fork Editorial Dining',
  description: 'Farm-to-fork dining rooted in Ubuntu philosophy. Every dish traced from field to fire in our living farm.',
  openGraph: {
    title:       'Ubuntu Kreative Village Restaurant',
    description: 'Cinematic farm-to-fork dining in the heart of the living estate.',
    type:        'website',
  },
}

export default function RestaurantPage() {
  return (
    <main className="bg-black min-h-screen text-white selection:bg-[var(--gold)]/20">
      <Nav />

      {/* 1. Cinematic Hero — server rendered, zero JS */}
      <RestaurantHero />

      {/* 2. Story section — server rendered */}
      <section className="py-24 px-6 text-center max-w-2xl mx-auto">
        <h2 className="font-display text-4xl mb-6">
          From our farm to your firelit table
        </h2>
        <p className="text-white/60 font-body leading-relaxed">
          Harvested at sunrise. Served under the stars. Experience slow food,
          open-fire cooking, and the riverside serenity of the Ubuntu village.
        </p>
      </section>

      {/* 3. Announcement ticker — server rendered, pure CSS scroll */}
      <MenuTicker />

      {/* 4. Interactive menu — single client island, hydrates only this section */}
      <MenuGrid />

      {/* 5. Reservation CTA — server rendered */}
      <ReservationCTA />

      <Footer />
    </main>
  )
}