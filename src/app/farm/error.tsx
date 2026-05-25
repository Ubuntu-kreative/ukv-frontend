/**
 * app/farm/error.tsx
 * 
 * Error boundary for the farm route.
 * Provides a graceful error UI with recovery options.
 */

'use client'

import { useEffect } from 'react'

export default function FarmError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log error to error reporting service
    console.error('Farm route error:', error)
  }, [error])

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-6">
      <div className="max-w-2xl text-center">
        {/* Error Icon */}
        <div className="mb-8 flex justify-center">
          <div className="w-20 h-20 rounded-full border-2 border-[#00ff41]/30 flex items-center justify-center bg-[#00ff41]/5">
            <span className="text-4xl text-[#00ff41]">⚠</span>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="font-display text-4xl md:text-5xl text-[#ede6d3] mb-4">
          Something went wrong
        </h1>
        
        <p className="text-[#ede6d3]/60 text-lg mb-8 leading-relaxed">
          We couldn't load the farm experience. This might be a temporary issue.
          Please try again or contact us if the problem persists.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={reset}
            className="px-8 py-4 bg-gradient-to-r from-[#c8a84b] to-[#c09a3a] rounded-lg text-[#0a0a0a] font-body font-bold text-sm tracking-widest uppercase hover:shadow-lg hover:shadow-[#c8a84b]/30 transition-all"
          >
            Try Again
          </button>
          
          <a
            href="/"
            className="px-8 py-4 border border-white/12 rounded-lg text-white/60 font-body text-sm tracking-widest uppercase hover:bg-white/4 hover:border-white/20 transition-all"
          >
            Return Home
          </a>
        </div>

        {/* Technical Details (for development) */}
        {process.env.NODE_ENV === 'development' && (
          <details className="mt-12 text-left">
            <summary className="cursor-pointer text-white/30 text-sm mb-4">
              Technical Details
            </summary>
            <div className="bg-white/5 rounded-lg p-4 overflow-auto max-h-64">
              <p className="text-[#00ff41] font-mono text-sm">{error.message}</p>
              {error.digest && (
                <p className="text-white/30 font-mono text-xs mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          </details>
        )}
      </div>
    </main>
  )
}
