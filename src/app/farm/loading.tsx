/**
 * app/farm/loading.tsx
 * 
 * Loading state for the farm route.
 * Provides a elegant skeleton UI while the page loads.
 */

import './farm.css'

export default function FarmLoading() {
  return (
    <main className="bg-[#0a0a0a] text-white min-h-screen overflow-x-hidden">
      
      {/* Hero Skeleton */}
      <section className="relative w-full h-[85vh] max-h-[900px] overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/35 via-[#0a0a0a]/10 to-[#0a0a0a]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_20%_80%,rgba(16,44,16,0.55),transparent_60%)]" />
        
        <div className="relative z-2 max-w-1400 mx-auto w-full px-10 py-20 h-full flex flex-col justify-end">
          <div className="h-8 w-40 bg-white/10 rounded animate-pulse mb-6" />
          <div className="h-20 w-3/4 bg-white/10 rounded animate-pulse mb-4" />
          <div className="h-4 w-1/2 bg-white/10 rounded animate-pulse mb-8" />
          <div className="flex gap-4">
            <div className="h-12 w-40 bg-white/10 rounded animate-pulse" />
            <div className="h-12 w-40 bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Bar Skeleton */}
      <section className="relative z-10 bg-[#0a0a0a] py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col gap-2">
                <div className="h-16 w-20 bg-white/10 rounded animate-pulse" />
                <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experiences Skeleton */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-8 w-32 bg-white/10 rounded animate-pulse mb-8" />
          <div className="grid grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      </section>

    </main>
  )
}
