/** @type {import('next').NextConfig} */

// ─────────────────────────────────────────────────────────────────────────────
// next.config.js
//
// BUG FIXED — Root cause #1: CSP form-action 'self' was blocking Google OAuth.
//
// Google OAuth works by POSTing to accounts.google.com (the consent screen
// redirect). The CSP directive `form-action 'self'` blocks any form submission
// or redirect that targets a non-same-origin URL — which is exactly what
// NextAuth does when it redirects the browser to Google's OAuth consent page.
//
// Fix: add https://accounts.google.com to form-action.
//
// BUG FIXED — Root cause #2: connect-src was missing accounts.google.com.
// NextAuth's PKCE/state verification makes fetch() calls back to Google.
// Without accounts.google.com in connect-src, those calls are CSP-blocked.
// ─────────────────────────────────────────────────────────────────────────────

const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  // ── Images ────────────────────────────────────────────────
  images: {
    unoptimized: isDev,
    qualities: [70, 75, 85],
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 500],
    minimumCacheTTL: 31536000,
    remotePatterns: [
      { protocol: 'https', hostname: 'ubuntuecolodge.com' },
      { protocol: 'https', hostname: 'image.mux.com' },
      { protocol: 'https', hostname: 'stream.mux.com' },
      // lh3.googleusercontent.com serves Google profile photos in the session
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
    ],
  },

  // ── Security headers ──────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options',           value: 'DENY' },
          { key: 'X-Content-Type-Options',     value: 'nosniff' },
          { key: 'Referrer-Policy',            value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy',         value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control',     value: 'on' },
          { key: 'Strict-Transport-Security',  value: 'max-age=31536000; includeSubDomains' },
          { key: 'X-XSS-Protection',           value: '1; mode=block' },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // ↓ unsafe-eval kept for Turbopack HMR in dev; tighten in prod if needed
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://stream.mux.com https://cdn.jsdelivr.net",
              "style-src 'self' 'unsafe-inline'",
              // Google profile images come from lh3.googleusercontent.com
              "img-src 'self' data: https: https://lh3.googleusercontent.com",
              "font-src 'self' data:",
              // FIX #2: accounts.google.com added — NextAuth token exchange calls land here
              "connect-src 'self' https: wss: https://accounts.google.com",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              // FIX #1: accounts.google.com MUST be allowed — OAuth redirect target
              "form-action 'self' https://accounts.google.com",
            ].join('; '),
          },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control',          value: 'no-store, max-age=0' },
          { key: 'X-Content-Type-Options', value: 'application/json' },
        ],
      },
    ]
  },

  // ── Redirects ─────────────────────────────────────────────
  async redirects() {
    return [
      { source: '/home',      destination: '/',          permanent: true },
      { source: '/hideaways', destination: '/cottages',  permanent: true },
      { source: '/rooms',     destination: '/cottages',  permanent: true },
    ]
  },

  // ── Logging ───────────────────────────────────────────────
  logging: {
    fetches: { fullUrl: isDev },
  },

  // ── Performance ───────────────────────────────────────────
  reactStrictMode: true,

  experimental: {
    optimizePackageImports: [
      'framer-motion',
      'react-hot-toast',
      'lucide-react',
    ],
  },
}

module.exports = nextConfig