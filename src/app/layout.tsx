/**
 * layout.tsx — Ubuntu Kreative Village Root Layout
 * OPTIMIZED + WARNING-FREE VERSION
 */

import type { Metadata, Viewport } from 'next'
import './globals.css'

import ClientLayout from '@/components/ClientLayout'
import Cursor from '@/components/Cursor'
import PageTransition from '@/components/PageTransition'

import { CartProvider } from '@/context/CartContext'
import { CartPanel } from '@/components/cart/CartPanel'

import { Toaster } from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────────
// METADATA
// ─────────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: {
    default:
      'Ubuntu Kreative Village | Eco Lodge & Farm Retreat · Kenya',
    template: '%s | Ubuntu Kreative Village',
  },

  description:
    'A living, breathing farm retreat rooted in the African philosophy of Ubuntu — Refresh your soul, ground your spirit. Pokomo Cottages, Arohamai Spa, farm-to-fork dining, and the Moxie AI concierge. Kenya.',

  keywords: [
    'Ubuntu Kreative Village',
    'eco lodge Kenya',
    'farm retreat Kenya',
    'Arohamai Spa',
    'farm to fork Kenya',
    'Pokomo Cottages',
    'Moxie AI concierge',
    'sustainable lodge Africa',
    'ubuntu ecolodge',
  ],

  authors: [
    {
      name: 'Ubuntu Kreative Village',
      url: 'https://ubuntuecolodge.com',
    },
  ],

  creator: 'Ubuntu Kreative Village',

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      'https://ubuntuecolodge.com'
  ),

  manifest: '/manifest.json',

  openGraph: {
    title: 'Ubuntu Kreative Village',

    description:
      'Where nature heals & traditions revive. A living farm retreat in Kenya.',

    url: 'https://ubuntuecolodge.com',

    siteName: 'Ubuntu Kreative Village',

    locale: 'en_KE',

    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'Ubuntu Kreative Village',

    description:
      'Where nature heals & traditions revive. Kenya eco lodge.',

    creator: '@ubuntukreative',
  },

  robots: {
    index: true,
    follow: true,

    googleBot: {
      index: true,
      follow: true,

      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  icons: {
    icon: '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

// ─────────────────────────────────────────────────────────────────────
// VIEWPORT
// ─────────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A0A',
}

// ─────────────────────────────────────────────────────────────────────
// ROOT LAYOUT
// ─────────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
    >
      <head>
        {/* Performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link rel="preconnect" href="https://stream.mux.com" />
      </head>

      <body
        suppressHydrationWarning
        className="
          bg-[#0d0c09]
          text-[#ede6d3]
          font-body
          antialiased
          overflow-x-hidden
          selection:bg-[#c8a84b]/30
        "
      >
        {/* Ambient Grain Overlay */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            fixed
            inset-0
            z-[1]
            opacity-[0.025]
          "
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        <CartProvider>
          <ClientLayout>
            {/* Cursor */}
            <Cursor />

            {/* Main App */}
            <main className="relative z-[2] min-h-screen">
              <PageTransition>
                {children}
              </PageTransition>
            </main>

            {/* SINGLE authoritative cart panel */}
            <CartPanel />
          </ClientLayout>
        </CartProvider>

        {/* Toast System */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3500,

            style: {
              background: '#1c1a14',
              color: '#ede6d3',

              border:
                '0.5px solid rgba(200,168,75,0.35)',

              borderRadius: '12px',

              fontFamily: 'var(--font-body)',

              fontSize: '11px',

              letterSpacing: '0.04em',

              padding: '10px 18px',

              boxShadow:
                '0 8px 32px rgba(0,0,0,0.55)',
            },

            success: {
              iconTheme: {
                primary: 'rgba(200,168,75,0.9)',
                secondary: '#1c1a14',
              },
            },

            error: {
              iconTheme: {
                primary: '#c05a3a',
                secondary: '#1c1a14',
              },
            },
          }}
        />
      </body>
    </html>
  )
}