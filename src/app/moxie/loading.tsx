export default function Loading() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden">
      <div className="text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative h-20 w-20">
            <div className="absolute inset-0 rounded-full border border-[#D4A853]/20" />

            <div className="absolute inset-2 rounded-full border border-[#D4A853]/40 animate-pulse" />

            <div className="absolute inset-4 rounded-full border border-[#D4A853] animate-spin" />
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-xs tracking-[0.35em] uppercase text-[#D4A853]">
            Moxie Sanctuary Intelligence
          </p>

          <h1 className="text-3xl md:text-5xl font-light">
            Synchronizing
            <span className="text-[#D4A853]"> Village Systems</span>
          </h1>

          <p className="text-white/50 max-w-md mx-auto leading-relaxed">
            Connecting ecological telemetry, wellness rituals,
            sanctuary intelligence, and living archive systems.
          </p>
        </div>

        <div className="mt-10 flex justify-center gap-2">
          <span className="h-2 w-2 rounded-full bg-[#D4A853] animate-bounce" />
          <span
            className="h-2 w-2 rounded-full bg-[#D4A853] animate-bounce"
            style={{ animationDelay: '0.15s' }}
          />
          <span
            className="h-2 w-2 rounded-full bg-[#D4A853] animate-bounce"
            style={{ animationDelay: '0.3s' }}
          />
        </div>

        <div className="mt-12 text-[10px] uppercase tracking-[0.3em] text-white/30">
          Ubuntu Kreative Village · Kenya
        </div>
      </div>
    </div>
  )
}