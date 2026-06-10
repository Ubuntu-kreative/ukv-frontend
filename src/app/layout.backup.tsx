import type { Metadata, Viewport } from 'next'
import './globals.css'
import Script from 'next/script'
import ClientLayout from '@/components/ClientLayout'
import { CartProvider } from '@/context/CartContext'
import { CartPanel } from '@/components/cart/CartPanel'
import { Toaster } from 'react-hot-toast'
import {
  Cormorant_Garamond,
  Jost,
  Playfair_Display,
} from 'next/font/google'

// ── Fonts ──────────────────────────────────────────────────────────────────────

const cormorant = Cormorant_Garamond({
  subsets:  ['latin'],
  weight:   ['300', '400', '600'],
  style:    ['normal', 'italic'],
  variable: '--font-display',
  display:  'swap',
  preload:  true,
})

const jost = Jost({
  subsets:  ['latin'],
  weight:   ['200', '300', '400', '500'],
  variable: '--font-body',
  display:  'swap',
  preload:  true,
})

const playfair = Playfair_Display({
  subsets:  ['latin'],
  weight:   ['400', '700'],
  style:    ['italic'],
  variable: '--font-accent',
  display:  'swap',
  preload:  false,
})

// ── Metadata ───────────────────────────────────────────────────────────────────

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
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://ubuntuecolodge.com'
  ),
  manifest: '/manifest.json',
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

// ── Viewport ───────────────────────────────────────────────────────────────────

export const viewport: Viewport = {
  width:        'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor:   '#0A0A0A',
}

// ── Root Layout ────────────────────────────────────────────────────────────────

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${jost.variable} ${playfair.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://stream.mux.com" />
      </head>

      {/*
        suppressHydrationWarning: Grammarly and other browser extensions inject
        data-* attributes onto <body> before React hydrates — this suppresses
        that false-positive warning without hiding real hydration errors.
      */}
      <body
        className="bg-[#0d0c09] text-[#ede6d3] font-body antialiased overflow-x-hidden noise-overlay"
        suppressHydrationWarning
      >
        {/*
          Custom cursor — inline script injected after interactive so it runs
          immediately without waiting for the React bundle. Using a Script tag
          keeps it out of the server HTML and prevents hydration mismatches.
          The cursor attaches its own DOM nodes and RAF loop independently.
        */}
        <Script
          id="ukv-cursor"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function () {
                // Skip on touch/mobile devices — cursor is desktop-only
                if (window.matchMedia('(hover: none)').matches) return;
                // Guard against double-init (hot reload, StrictMode)
                if (document.getElementById('ukv-cursor-dot')) return;

                // Inject cursor-none rule for all elements
                var style = document.createElement('style');
                style.textContent = '*,*::before,*::after{cursor:none!important}';
                document.head.appendChild(style);

                // Create dot
                var dot = document.createElement('div');
                dot.id = 'ukv-cursor-dot';
                dot.style.cssText = [
                  'position:fixed',
                  'top:-100px',
                  'left:-100px',
                  'width:8px',
                  'height:8px',
                  'background:#00FF41',
                  'border-radius:50%',
                  'pointer-events:none',
                  'z-index:2147483647',
                  'transition:width .22s ease,height .22s ease,background .22s ease',
                  'will-change:transform',
                ].join(';');

                // Create ring
                var ring = document.createElement('div');
                ring.id = 'ukv-cursor-ring';
                ring.style.cssText = [
                  'position:fixed',
                  'top:-100px',
                  'left:-100px',
                  'width:36px',
                  'height:36px',
                  'border:1.5px solid rgba(0,255,65,0.5)',
                  'border-radius:50%',
                  'pointer-events:none',
                  'z-index:2147483646',
                  'transition:width .32s ease,height .32s ease,border-color .28s ease',
                  'will-change:transform',
                ].join(';');

                document.body.appendChild(dot);
                document.body.appendChild(ring);

                // Position tracking
                var mx = 0, my = 0, rx = 0, ry = 0;

                window.addEventListener('mousemove', function (e) {
                  mx = e.clientX;
                  my = e.clientY;
                  // Dot snaps instantly
                  dot.style.left = (mx - 4) + 'px';
                  dot.style.top  = (my - 4) + 'px';
                }, { passive: true });

                // Ring follows with lerp (elastic lag)
                (function tick() {
                  rx += (mx - rx) * 0.12;
                  ry += (my - ry) * 0.12;
                  ring.style.left = (rx - 18) + 'px';
                  ring.style.top  = (ry - 18) + 'px';
                  requestAnimationFrame(tick);
                })();

                // Hover state — gold dot, larger ring
                var HOVER = 'a,button,input,select,textarea,label,[role="button"],[data-cursor="hover"]';

                document.addEventListener('mouseover', function (e) {
                  if (!e.target || !e.target.closest) return;
                  if (!e.target.closest(HOVER)) return;
                  dot.style.width      = '5px';
                  dot.style.height     = '5px';
                  dot.style.background = '#D4A853';
                  ring.style.width     = '48px';
                  ring.style.height    = '48px';
                  ring.style.borderColor = 'rgba(212,168,83,0.6)';
                }, { passive: true });

                document.addEventListener('mouseout', function (e) {
                  if (!e.target || !e.target.closest) return;
                  if (!e.target.closest(HOVER)) return;
                  dot.style.width      = '8px';
                  dot.style.height     = '8px';
                  dot.style.background = '#00FF41';
                  ring.style.width     = '36px';
                  ring.style.height    = '36px';
                  ring.style.borderColor = 'rgba(0,255,65,0.5)';
                }, { passive: true });

                // Hide when cursor leaves the window
                document.addEventListener('mouseleave', function () {
                  dot.style.opacity  = '0';
                  ring.style.opacity = '0';
                }, { passive: true });

                document.addEventListener('mouseenter', function () {
                  dot.style.opacity  = '1';
                  ring.style.opacity = '1';
                }, { passive: true });
              })();
            `,
          }}
        />

        {/* Ambient grain overlay */}
        <div
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-[1] opacity-[0.025]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize:  '256px 256px',
          }}
        />

        {/* Cart context + client effects */}
        <CartProvider>
          <ClientLayout>{children}</ClientLayout>
        </CartProvider>

        {/*
          CartPanel is outside CartProvider because it reads from the Zustand
          store directly (useCartStore), not from CartContext. Keeping it outside
          avoids unnecessary re-renders when CartContext updates.
        */}
        <CartPanel />

        {/* Toast notifications */}
        <Toaster
          position="bottom-center"
          toastOptions={{
            duration: 3500,
            style: {
              background:    '#1c1a14',
              color:         '#ede6d3',
              border:        '0.5px solid rgba(200,168,75,0.35)',
              borderRadius:  '0',
              fontFamily:    'var(--font-body)',
              fontSize:      '12px',
              letterSpacing: '0.06em',
              padding:       '10px 20px',
              boxShadow:     '0 8px 32px rgba(0,0,0,0.6)',
            },
            success: {
              iconTheme: {
                primary:   'rgba(200,168,75,0.9)',
                secondary: '#1c1a14',
              },
            },
            error: {
              iconTheme: {
                primary:   '#c05a3a',
                secondary: '#1c1a14',
              },
            },
          }}
        />
      </body>
    </html>
  )
}