'use client'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function MoxieError({
  error,
  reset,
}: ErrorProps) {
  console.error('[Moxie Route Error]', error)

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <div className="mb-6">
          <span className="text-xs tracking-[0.3em] uppercase text-[#D4A853]">
            Moxie Sanctuary System
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-light mb-6">
          Sanctuary
          <span className="text-[#D4A853]"> Interrupted</span>
        </h1>

        <p className="text-white/60 leading-relaxed mb-10">
          Moxie encountered a temporary disturbance while
          synchronizing the village systems.
          The sanctuary is already attempting recovery.
        </p>

        <button
          onClick={() => reset()}
          className="px-8 py-4 rounded-full border border-[#D4A853]/30 hover:border-[#D4A853] transition-all duration-300 hover:scale-[1.02]"
        >
          Restore Sanctuary
        </button>

        <div className="mt-12 text-xs text-white/30 tracking-[0.2em] uppercase">
          Ubuntu Kreative Village · Kenya
        </div>
      </div>
    </div>
  )
}