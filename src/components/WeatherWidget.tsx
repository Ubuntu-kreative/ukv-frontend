'use client'

import { useEffect, useState } from 'react'
import { getWeather } from '@/lib/moxie/weather'

export default function WeatherWidget() {
  const [weather, setWeather] = useState<string>('🌤️ --°C Nairobi')

  useEffect(() => {
    let isMounted = true

    const loadWeather = async () => {
      try {
        const data = await getWeather()
        if (!isMounted) return

        // Formats response based on Open-Meteo style structure
        if (data?.current?.temperature_2m !== undefined) {
          const temp = Math.round(data.current.temperature_2m)
          setWeather(`🌤️ ${temp}°C Nairobi`)
        } else {
          setWeather('🌤️ 24°C Nairobi')
        }
      } catch (err) {
        console.error('Weather fetching exception:', err)
        if (isMounted) {
          setWeather('🌤️ 24°C Nairobi')
        }
      }
    }

    loadWeather()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div 
      className="text-xs tracking-wider font-mono text-cream/70 bg-black/20 backdrop-blur-md border border-white/5 px-3 py-1.5 rounded-full select-none inline-flex items-center gap-1.5"
      style={{ transition: 'opacity 0.3s ease' }}
    >
      <span className="w-1.5 height-1.5 rounded-full bg-emerald-500 inline-block animate-pulse" />
      {weather}
    </div>
  )
}