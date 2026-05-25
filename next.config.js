/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development'

const nextConfig = {
  // ── Images ────────────────────────────────────────────────
  images: {
    // Disable heavy optimization in dev (huge RAM win)
    unoptimized: isDev,

    // Keep only useful quality levels
    qualities: [70, 75, 85],

    // Optimised formats + device sizes for Next Image
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 320, 500],
    minimumCacheTTL: 31536000, // 1 year for immutable images

    // Allow only required remote sources
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ubuntuecolodge.com',
      },
      {
        protocol: 'https',
        hostname: 'image.mux.com',
      },
      {
        protocol: 'https',
        hostname: 'stream.mux.com',
      },

      // ❗ DO NOT re-enable Unsplash unless absolutely necessary
      // It will destroy dev performance
    ],
  },

  // ── Security headers ──────────────────────────────────────
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
        ],
      },
      {
        source: '/api/(.*)',
        headers: [
          { key: 'Cache-Control', value: 'no-store, max-age=0' },
        ],
      },
    ]
  },

  // ── Redirects ─────────────────────────────────────────────
  async redirects() {
    return [
      {
        source: '/home',
        destination: '/',
        permanent: true,
      },
      {
        source: '/hideaways',
        destination: '/cottages',
        permanent: true,
      },
      {
        source: '/rooms',
        destination: '/cottages',
        permanent: true,
      },
    ]
  },

  // ── Logging (keep light in dev) ────────────────────────────
  logging: {
    fetches: {
      fullUrl: isDev, // only verbose in dev
    },
  },

  // ── Performance flags (safe defaults) ──────────────────────
  reactStrictMode: true,

  experimental: {
    // Helps reduce memory pressure in large apps
    optimizePackageImports: [
      'framer-motion',
      'react-hot-toast',
      'lucide-react',
    ],
  },
}

module.exports = nextConfig