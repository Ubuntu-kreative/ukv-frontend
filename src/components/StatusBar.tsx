'use client'

import { useEffect, useState } from 'react'

export default function StatusBar() {
  const [temp, setTemp] = useState<number | null>(null)

  useEffect(() => {
    // Read the farm temperature from the global variable set in ClientLayout
    const currentTemp = (window as any).__FARM_TEMP
    if (currentTemp) setTemp(currentTemp)

    // Listen for updates if ClientLayout refreshes it
    const interval = setInterval(() => {
      const updatedTemp = (window as any).__FARM_TEMP
      if (updatedTemp) setTemp(updatedTemp)
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div
      className="w-full text-[10px] tracking-[0.25em] uppercase flex items-center justify-between px-6 py-2"
      style={{
        background: 'rgba(10,10,10,0.9)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      {/* Left side: heritage marker */}
      <span style={{ color: 'rgba(255,255,255,0.55)' }}>
        Kenya • Eco Lodge • Est. 2024
      </span>

      {/* Center: tagline */}
      <span style={{ color: 'var(--gold)', fontWeight: 500 }}>
        Refresh your soul, ground your spirit
      </span>

      {/* Right side: weather */}
      <span style={{ color: 'var(--neon)' }}>
        {temp !== null ? `${temp}°C Nairobi` : 'Loading…'}
      </span>
    </div>
  )
}
