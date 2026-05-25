/**
 * app/spa/loading.tsx — App Router loading segment
 *
 * This replaces the inline Suspense skeleton that was previously blocking
 * the entire page. App Router automatically wraps this around the page
 * during navigation, so it shows instantly on route change.
 *
 * The hero image here is the same as the SpaHero background, so the
 * transition from loading → loaded feels seamless rather than jarring.
 */

import Image from 'next/image'

export default function SpaLoading() {
  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden flex items-center justify-center">
      {/* Same hero image as SpaHero — feels continuous, not broken */}
      <Image
        src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-30"
      />

      {/* Warm gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-[#050505]/60 to-[#050505]" />

      {/* Loading content */}
      <div className="relative z-10 text-center space-y-5">
        <p className="text-[10px] uppercase tracking-[0.38em] text-gold/70">
          Arohamai Spa · Ubuntu Eco Lodge
        </p>

        <h1 className="font-display text-4xl md:text-6xl text-white leading-none">
          Preparing Your<br />
          <span className="italic text-gold">Sanctuary</span>
        </h1>

        {/* Animated line — CSS only, compositor-safe */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <div className="w-16 h-px bg-gold/20" />
          <div className="w-1 h-1 rounded-full bg-gold/40 loading-dot" />
          <div className="w-16 h-px bg-gold/20" />
        </div>
      </div>

      <style>{`
        @keyframes spa-dot-pulse {
          0%, 100% { opacity: 0.4; transform: scale(1);   }
          50%       { opacity: 1;   transform: scale(1.6); }
        }
        .loading-dot { animation: spa-dot-pulse 1.8s ease-in-out infinite; }
      `}</style>
    </div>
  )
}