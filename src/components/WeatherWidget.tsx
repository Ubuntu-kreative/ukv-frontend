'use client'

import { useEffect, useState } from 'react'
import { getWeather } from '@/lib/moxie/weather'

export default function WeatherWidget() {
  const [weather, setWeather] = useState<string>('Loading...')

  useEffect(() => {
    const loadWeather = async () => {
      try {
        const data = await getWeather()

        // adjust this depending on your API shape
        setWeather(`🌤️ ${data?.current?.temperature_2m ?? 24}°C Nairobi`)
      } catch (err) {
        console.error('Weather error:', err)
        setWeather('🌤️ 24°C Nairobi')
      }
    }

    loadWeather()
  }, [])

  return <div className="text-sm text-cream">{weather}</div>
}