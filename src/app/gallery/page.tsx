// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Gallery Page
// SERVER COMPONENT — renders static HTML shell + passes serialised data
// No 'use client', no hooks, no browser APIs here.
// ─────────────────────────────────────────────────────────────────────────────

import type { Metadata } from 'next'
import { EXHIBITS, WORKSHOPS, CRAFT_MARKET, GALLERY_STATS } from '@/components/gallery/Gallery.data'
import { GalleryClient } from '@/components/gallery/GalleryClient'

export const metadata: Metadata = {
  title: 'Art Gallery & Exhibitions | Ubuntu Kreative Village',
  description:
    'Contemporary art gallery, cultural exhibitions, craft markets, and workshops showcasing African artists and artisanal traditions.',
  openGraph: {
    title: 'Art Gallery & Exhibitions | Ubuntu Kreative Village',
    description: 'Contemporary art, exhibitions, craft markets, and cultural workshops.',
    type: 'website',
    url: 'https://ubuntuecolodge.com/gallery',
    images: [
      {
        url: 'https://ubuntuecolodge.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Ubuntu Kreative Village Gallery',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Art Gallery & Exhibitions | Ubuntu Kreative Village',
    description: 'Contemporary art, exhibitions, craft markets, and cultural workshops.',
  },
  alternates: {
    canonical: 'https://ubuntuecolodge.com/gallery',
  },
}

// Static hero content rendered server-side for instant LCP paint
export default function GalleryPage() {
  return (
    <GalleryClient
      exhibits={EXHIBITS}
      workshops={WORKSHOPS}
      craftMarket={CRAFT_MARKET}
      stats={GALLERY_STATS}
    />
  )
}