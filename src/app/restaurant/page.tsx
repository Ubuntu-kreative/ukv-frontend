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

import NavWrapper     from '@/components/NavWrapper'
import Footer         from '@/components/Footer'
import RestaurantHero from './_components/Hero'
import MenuTicker     from './_components/MenuTicker'
import MenuGrid       from './_components/MenuGrid'
import ReservationCTA from './_components/ReservationCTA'

// ── ISR CONFIGURATION — revalidate every 6 hours for menu updates ──
export const revalidate = 21600

export const metadata: Metadata = {
  title:       'Ubuntu Feast | Farm-to-Fork Editorial Dining',
  description: 'Farm-to-fork dining rooted in Ubuntu philosophy. Every dish traced from field to fire in our living farm.',
  openGraph: {
    title:       'Ubuntu Feast | Farm-to-Fork Editorial Dining',
    description: 'Cinematic farm-to-fork dining in the heart of the living estate.',
    type:        'website',
    url:         'https://ubuntuecolodge.com/restaurant',
    images: [
      {
        url:    'https://ubuntuecolodge.com/images/restaurant-hero1.jpeg',
        width:  1200,
        height: 630,
        alt:    'Ubuntu Feast - Farm-to-Fork Dining',
      },
    ],
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Ubuntu Feast | Farm-to-Fork Editorial Dining',
    description: 'Farm-to-fork dining rooted in Ubuntu philosophy.',
  },
  alternates: {
    canonical: 'https://ubuntuecolodge.com/restaurant',
  },
}

export default function RestaurantPage() {
  return (
    <main className="min-h-screen text-white selection:bg-[var(--gold)]/20" style={{ background: 'var(--bg)' }}>
      <NavWrapper />

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

      {/* 5. Chef profile — follows the About page's initials-based team style */}
      <section className="mx-auto mb-24 max-w-3xl px-6" aria-labelledby="about-the-chef">
        <div className="glass relative overflow-hidden p-8 md:p-10">
          <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[var(--gold)] to-transparent opacity-60" />
          <div className="mb-6 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--gold)]/30 bg-[var(--gold)]/10 font-display text-2xl font-light text-[var(--gold)]" aria-label="Chef photo placeholder">
              M
            </div>
            <div>
              <div className="mb-1 font-body text-[9px] uppercase tracking-wider text-[var(--gold)]">Farm-to-Fork Kitchen</div>
              <h2 id="about-the-chef" className="font-display text-3xl font-light text-[var(--cream)]">About the Chef</h2>
              <p className="mt-1 font-body text-[9px] uppercase tracking-wider text-white/35">Chef photo needed</p>
            </div>
          </div>
          <p className="font-body text-sm leading-loose text-white/60">
            Chef M. Wamalwa has a deep connection to the land, crafting dishes with the freshest ingredients. Each meal reflects a blend of tradition and contemporary flair, offering a warm, inviting dining experience.
          </p>
        </div>
      </section>

      {/* 6. Reservation CTA — server rendered */}
      <ReservationCTA />

      <Footer />
    </main>
  )
}