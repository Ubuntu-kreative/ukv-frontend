import type { Metadata, Viewport } from 'next'
import './globals.css'
import ClientLayout from '@/components/ClientLayout'
import { CartProvider } from '@/context/CartContext' // ✅ Cart context provider
import { CartPanel } from '@/components/cart/CartPanel'
import { Toaster } from 'react-hot-toast'
import { Cormorant_Garamond, Outfit } from 'next/font/google'
import StatusBar from '@/components/StatusBar'


// ── Fonts ─────────────────────────────────────────────────────
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

// ── Metadata ──────────────────────────────────────────────────
export const metadata: Metadata = {
  title: {
    default: 'Ubuntu Kreative Village | Eco Lodge & Farm Retreat · Kenya',
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
  authors: [{ name: 'Ubuntu Kreative Village', url: 'https://ubuntuecolodge.com' }],
  creator: 'Ubuntu Kreative Village',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://ubuntuecolodge.com'
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
    description: 'Where nature heals & traditions revive. Kenya eco lodge.',
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

// ── Extra metadata from second snippet ─────────────────────────
export const simpleMetadata: Metadata = {
  title: 'Ubuntu Kreative Village — Kenya Eco Lodge',
  description:
    'A living farm retreat in Kenya where Pokomo Cottages, Arohamai Spa, and farm-to-fork dining converge in one immersive village experience.',
  keywords: 'eco lodge Kenya, farm retreat, Pokomo cottages, Arohamai Spa, Ubuntu Kreative Village',
}

// ── Viewport ──────────────────────────────────────────────────
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0A0A0A',
}

// ── Root Layout ───────────────────────────────────────────────
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`} suppressHydrationWarning>
      <head>
        {/* Preconnect to Google Fonts for faster load */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* Preconnect to Mux for video streaming */}
        <link rel="preconnect" href="https://stream.mux.com" />
      </head>
      <body className="bg-[#0d0c09] text-[#ede6d3] font-body antialiased overflow-x-hidden noise-overlay">
        {/* Ambient grain overlay */}
        <div
          className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '256px 256px',
          }}
        />

        {/* ✅ CartProvider added here to provide context to Nav + children */}
        <CartProvider>
          {/* ✅ Wrap children in ClientLayout so global effects + cursor run */}
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>

        {/* Cart panel + toaster notifications */}
        <CartPanel />
        <Toaster
          position="bottom-center"
          toastOptions={{
            style: {
              background: '#1c1a14',
              color: '#ede6d3',
              border: '0.5px solid rgba(200,168,75,0.35)',
              borderRadius: '0',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              letterSpacing: '0.05em',
              padding: '10px 20px',
            },
          }}
        />
      </body>
    </html>
  )
}
