// app/events/page.tsx  — SERVER COMPONENT (no 'use client')
// All static data and metadata live here; only the interactive shell is client.

import type { Metadata } from 'next'
import { EventsShell } from './EventsShell'
import { EVENTS, EVENT_TYPES, CATEGORY_COLORS, CONFERENCE_RATES, BUFFET_MENUS, CANCELLATION_POLICY } from './eventsData'

export const metadata: Metadata = {
  title: 'Events & Gatherings | Ubuntu Kreative Village',
  description:
    'Farm-to-table dinners, full moon ceremonies, corporate retreats, conferences and celebrations at Ubuntu Kreative Village.',
  openGraph: {
    title: 'Events & Gatherings | Ubuntu Kreative Village',
    description: 'Farm-to-table dinners, full moon ceremonies, corporate retreats, and celebrations.',
    type: 'website',
    url: 'https://ubuntuecolodge.com/events',
    images: [
      {
        url: 'https://ubuntuecolodge.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ubuntu Kreative Village Events',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Events & Gatherings | Ubuntu Kreative Village',
    description: 'Farm-to-table dinners, full moon ceremonies, corporate retreats, and celebrations.',
  },
  alternates: {
    canonical: 'https://ubuntuecolodge.com/events',
  },
}

export default function EventsPage() {
  return (
    <EventsShell
      events={EVENTS}
      eventTypes={EVENT_TYPES}
      categoryColors={CATEGORY_COLORS}
      conferenceRates={CONFERENCE_RATES}
      buffetMenus={BUFFET_MENUS}
      cancellationPolicy={CANCELLATION_POLICY}
    />
  )
}