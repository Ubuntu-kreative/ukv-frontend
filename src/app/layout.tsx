/**
 * layout.tsx — Ubuntu Kreative Village Root Layout
 *
 * FIXES vs original:
 *
 * 1. CartPanel authority
 *    This is the SINGLE authoritative mount point for <CartPanel />.
 *    It was also mounted in page.tsx (HomePage), causing two panels,
 *    double Zustand subscriptions, and React tree conflicts.
 *    Fix: removed CartPanel from page.tsx. Do NOT add it to any child page.
 *
 * 2. Cursor mount
 *    Cursor.tsx is mounted here (inside ClientLayout → or directly).
 *    The fixed Cursor.tsx handles HMR/StrictMode double-invocation safely
 *    via getElementById guards and proper RAF cleanup.
 *
 * UNCHANGED: All metadata, viewport, SEO, Toaster config, font links.
 */

import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import { CartProvider } from '@/context/CartContext'
import { CartPanel } from '@/components/cart/CartPanel'
import { Toaster } from 'react-hot-toast'
import Cursor from '@/components/Cursor'

// ─────────────────────────────────────────────────────────────────────
// METADATA CONFIGURATION
// ─────────────────────────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default:  'Ubuntu Kreative Village | Eco Lodge & Farm Retreat · Kenya',
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
  authors:      [{ name: 'Ubuntu Kreative Village', url: 'https://ubuntuecolodge.com' }],
  creator:      'Ubuntu Kreative Village',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://ubuntuecolodge.com'),
  manifest:     '/manifest.json',
  openGraph: {
    title:       'Ubuntu Kreative Village',
    description: 'Where nature heals & traditions revive. A living farm retreat in Kenya.',
    url:         'https://ubuntuecolodge.com',
    siteName:    'Ubuntu Kreative Village',
    locale:      'en_KE',
    type:        'website',
  },
  twitter: {
    card:        'summary_large_image',
    title:       'Ubuntu Kreative Village',
    description: 'Where nature heals & traditions revive. Kenya eco lodge.',
    creator:     '@ubuntukreative',
  },
  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:               true,
      follow:              true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet':       -1,
    },
  },
  icons: {
    icon:  '/icons/icon-192.png',
    apple: '/icons/icon-192.png',
  },
}

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor:   '#0A0A0A',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://stream.mux.com" />
      </head>

      <body
        className="bg-[#0d0c09] text-[#ede6d3] font-body antialiased overflow-x-hidden noise-overlay"
        suppressHydrationWarning
      >
        {/* Ambient grain overlay */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        <CartProvider>
          <ClientLayout>
            {/*
              Cursor is mounted here, inside ClientLayout.
              The fixed Cursor.tsx handles:
              - Touch/hybrid device detection via (hover: hover) and (pointer: fine)
              - StrictMode double-invoke via getElementById guards
              - RAF lifecycle via cancelAnimationFrame in cleanup
              - Tab backgrounding via visibilitychange pause
            */}
            <Cursor />
            {children}
            {/*
              CartPanel is the SINGLE authoritative instance.
              Do NOT render CartPanel in any child page (page.tsx, etc.)
              Doing so creates duplicate panels, duplicate store subscriptions,
              and React reconciliation conflicts.
            */}
            <CartPanel />
          </ClientLayout>
        </CartProvider>

        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3500,
            style: {
              background:    '#1c1a14',
              color:         '#ede6d3',
              border:        '0.5px solid rgba(200,168,75,0.35)',
              borderRadius:  '10px',
              fontFamily:    'var(--font-body)',
              fontSize:      '11px',
              letterSpacing: '0.04em',
              padding:       '10px 20px',
              boxShadow:     '0 8px 32px rgba(0,0,0,0.6)',
            },
            success: {
              iconTheme: { primary: 'rgba(200,168,75,0.9)', secondary: '#1c1a14' },
            },
            error: {
              iconTheme: { primary: '#c05a3a', secondary: '#1c1a14' },
            },
          }}
        />
      </body>
    </html>
  )
}