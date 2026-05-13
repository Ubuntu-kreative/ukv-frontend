'use client'

import { useEffect, useState } from 'react'

export default function WeatherWidget() {
  const [weather, setWeather] = useState<string>('Loading...')

  useEffect(() => {
    // For now, static Nairobi weather placeholder
    setWeather('🌤️ 24°C Nairobi')
    // Later you can fetch from an API like OpenWeatherMap
  }, [])

  return (
    <div className="text-sm text-cream">
      {weather}
    </div>
  )
}
