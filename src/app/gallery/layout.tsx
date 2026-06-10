// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Gallery Layout
// SERVER COMPONENT — SEO metadata only, no interactivity
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Gallery & Art Culture | Ubuntu Kreative Village',
  description:
    'Immersive art exhibitions, creative workshops, and artisan craft markets celebrating African contemporary art and heritage crafts at Ubuntu Eco Lodge, Kenya.',
  openGraph: {
    title: 'Gallery & Art Culture | Ubuntu Kreative Village',
    description:
      'Immersive art exhibitions, creative workshops, and artisan craft markets celebrating African contemporary art.',
    type: 'website',
    images: [
      {
        url: 'https://ubuntuecolodge.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ubuntu Kreative Village Gallery & Art',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Gallery & Art Culture | Ubuntu Kreative Village',
    description:
      'Immersive art exhibitions, creative workshops, and artisan craft markets celebrating African contemporary art.',
  },
  alternates: {
    canonical: 'https://ubuntuecolodge.com/gallery',
  },
}

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}