import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Events & Gatherings | Ubuntu Kreative Village',
  description: 'Farm-to-table dinners, full moon ceremonies, corporate retreats, and celebrations at Ubuntu Kreative Village. Book your next gathering in Kenya.',
  openGraph: {
    title: 'Events & Gatherings | Ubuntu Kreative Village',
    description: 'Farm-to-table dinners, full moon ceremonies, corporate retreats, and celebrations in the Kenyan highlands.',
    type: 'website',
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

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
