'use client'
/**
 * app/spa/error.tsx — App Router error boundary
 *
 * Must be 'use client' — required by Next.js (error boundaries use
 * React class component semantics internally).
 */

import { useEffect } from 'react'
import Link from 'next/link'

export default function SpaError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log to your error reporting service here
    console.error('[Arohamai Spa Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg space-y-6">
        <p className="text-[9px] uppercase tracking-[0.38em] text-gold/60">
          Arohamai Spa
        </p>
        <h1 className="font-display text-5xl leading-none">
          Something Interrupted<br />
          <span className="italic text-gold">the Ritual</span>
        </h1>
        <p className="text-white/38 text-sm leading-relaxed">
          A quiet disturbance has crossed the sanctuary. Please try again — your healing journey continues.
        </p>
        <div className="flex flex-wrap gap-4 justify-center pt-2">
          <button
            onClick={reset}
            className="px-8 py-3.5 bg-gold text-black text-[9px] uppercase tracking-[0.28em] rounded-full hover:bg-gold/90 transition-colors"
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-8 py-3.5 border border-white/15 text-[9px] uppercase tracking-[0.28em] rounded-full hover:border-gold/30 hover:text-gold transition-all"
          >
            Return Home
          </Link>
        </div>
      </div>
    </div>
  )
}