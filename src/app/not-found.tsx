import Link from 'next/link'
import NavWrapper from '@/components/NavWrapper'
import Footer from '@/components/Footer'

export default function NotFound() {
  return (
    <>
      <NavWrapper />
      <main className="min-h-screen bg-[var(--obsidian)] text-white flex items-center justify-center px-6">
        <div className="text-center max-w-2xl space-y-8">
          <div className="space-y-4">
            <p className="text-[11px] uppercase tracking-[0.38em] text-[var(--neon)]">
              Page Not Found
            </p>
            <h1 className="text-7xl md:text-8xl font-display leading-tight">404</h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              The page you're looking for doesn't exist. It may have been moved or removed.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="px-8 py-4 bg-[var(--neon)] text-black font-semibold rounded-lg hover:bg-opacity-90 transition-all duration-300 inline-block min-h-[44px] flex items-center justify-center"
            >
              Return Home
            </Link>
            <Link
              href="/contact"
              className="px-8 py-4 border border-[var(--gold)] text-[var(--gold)] font-semibold rounded-lg hover:bg-[var(--gold)] hover:text-black transition-all duration-300 inline-block min-h-[44px] flex items-center justify-center"
            >
              Book a Stay
            </Link>
          </div>

          <div className="pt-8 border-t border-gray-700 space-y-2 text-sm text-gray-500">
            <p>Need help? Contact us at hello@ubuntuecolodge.com</p>
            <p>Or call +254 (0) 700 000 000</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
