/**
 * lib/moxie/weather.ts
 * Centralized weather intelligence for Ubuntu Kreative Village
 * Handles fetching, caching, fallbacks, and telemetry-safe formatting
 */

export type WeatherCondition =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'thunderstorm'
  | 'mist'
  | 'harmattan'
  | 'overcast'

export interface WeatherData {
  condition: WeatherCondition
  temperatureC: number
  humidity: number
  windSpeedKph: number
  uvIndex: number
  feelsLikeC: number
  description: string
  sanctuaryNote: string
  timestamp: number
}

export interface WeatherContext {
  greeting: string
  ambientMood: string
  suggestedExperiences: string[]
  clothingNote: string
}

// Ubuntu Village coordinates — Nairobi highlands region
const VILLAGE_LAT = -0.3476
const VILLAGE_LNG = 36.9137
const CACHE_TTL = 15 * 60 * 1000 // 15 minutes

let weatherCache: { data: WeatherData; expiresAt: number } | null = null

/**
 * Returns sanctuary-aware fallback weather
 * Used when API is unavailable
 */
function getFallbackWeather(): WeatherData {
  const hour = new Date().getHours()
  const isMorning = hour >= 5 && hour < 11
  const isEvening = hour >= 17 && hour < 20

  return {
    condition: isMorning ? 'clear' : isEvening ? 'partly_cloudy' : 'clear',
    temperatureC: isMorning ? 19 : isEvening ? 22 : 25,
    humidity: 58,
    windSpeedKph: 12,
    uvIndex: isMorning ? 3 : isEvening ? 1 : 7,
    feelsLikeC: isMorning ? 18 : 24,
    description: isMorning
      ? 'Cool highland morning with clear skies'
      : isEvening
      ? 'Warm dusk with scattered clouds'
      : 'Bright equatorial afternoon',
    sanctuaryNote: isMorning
      ? 'Perfect conditions for dawn walks and forest bathing.'
      : isEvening
      ? 'The light is golden — ideal for sundowner rituals.'
      : 'The canopy provides natural shade. Hydration recommended.',
    timestamp: Date.now(),
  }
}

/**
 * Fetch live weather from Open-Meteo (free, no API key required)
 */
async function fetchLiveWeather(): Promise<WeatherData> {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${VILLAGE_LAT}&longitude=${VILLAGE_LNG}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,uv_index&timezone=Africa%2FNairobi&forecast_days=1`

  const response = await fetch(url, {
    next: { revalidate: 900 }, // 15 min ISR cache
  })

  if (!response.ok) {
    throw new Error(`Weather fetch failed: ${response.status}`)
  }

  const json = await response.json()
  const current = json.current

  const condition = weatherCodeToCondition(current.weather_code)
  const temperatureC = Math.round(current.temperature_2m)
  const feelsLikeC = Math.round(current.apparent_temperature)
  const humidity = current.relative_humidity_2m
  const windSpeedKph = Math.round(current.wind_speed_10m)
  const uvIndex = Math.round(current.uv_index ?? 0)

  return {
    condition,
    temperatureC,
    feelsLikeC,
    humidity,
    windSpeedKph,
    uvIndex,
    description: conditionToDescription(condition, temperatureC),
    sanctuaryNote: buildSanctuaryNote(condition, temperatureC, uvIndex),
    timestamp: Date.now(),
  }
}

/**
 * Map WMO weather codes to internal condition types
 */
function weatherCodeToCondition(code: number): WeatherCondition {
  if (code === 0) return 'clear'
  if (code <= 2) return 'partly_cloudy'
  if (code === 3) return 'cloudy'
  if (code <= 49) return 'mist'
  if (code <= 67) return 'rain'
  if (code <= 77) return 'overcast'
  if (code <= 82) return 'rain'
  if (code <= 99) return 'thunderstorm'
  return 'clear'
}

function conditionToDescription(condition: WeatherCondition, temp: number): string {
  const tempStr = `${temp}°C`
  const descriptions: Record<WeatherCondition, string> = {
    clear: `Crystal clear skies, ${tempStr}`,
    partly_cloudy: `Partly cloudy highland air, ${tempStr}`,
    cloudy: `Overcast with soft cloud cover, ${tempStr}`,
    rain: `Gentle rains across the valley, ${tempStr}`,
    thunderstorm: `Storm systems rolling through, ${tempStr}`,
    mist: `Morning mist in the canopy, ${tempStr}`,
    harmattan: `Harmattan haze drifting through, ${tempStr}`,
    overcast: `Dense cloud layer, ${tempStr}`,
  }
  return descriptions[condition]
}

function buildSanctuaryNote(
  condition: WeatherCondition,
  temp: number,
  uvIndex: number
): string {
  if (condition === 'clear' && uvIndex >= 7) {
    return 'UV is elevated — the forest canopy walks are recommended over open grounds.'
  }
  if (condition === 'rain') {
    return 'Rain rituals are active. The spa and indoor sanctuaries are fully prepared.'
  }
  if (condition === 'mist') {
    return 'The valley mist creates rare forest bathing conditions. Walk slowly. Breathe deeply.'
  }
  if (condition === 'thunderstorm') {
    return 'Storm sanctuary protocols are in place. All outdoor events moved indoors.'
  }
  if (temp <= 17) {
    return 'Highland cool has settled. Warm beverages and fire lounges are available at the lodge.'
  }
  if (temp >= 28) {
    return 'Warm afternoon on the grounds. The spring-fed plunge pool offers immediate sanctuary.'
  }
  return 'Conditions are ideal. The entire village is yours to explore.'
}

/**
 * Primary export — weather with caching + fallback
 */
export async function getWeather(): Promise<WeatherData> {
  // Serve from cache if fresh
  if (weatherCache && Date.now() < weatherCache.expiresAt) {
    return weatherCache.data
  }

  try {
    const data = await fetchLiveWeather()
    weatherCache = { data, expiresAt: Date.now() + CACHE_TTL }
    return data
  } catch {
    console.warn('[Moxie Weather] Using fallback weather data')
    return getFallbackWeather()
  }
}

/**
 * Build contextual intelligence from weather state
 */
export function buildWeatherContext(weather: WeatherData): WeatherContext {
  const hour = new Date().getHours()
  const isMorning = hour >= 5 && hour < 12
  const isAfternoon = hour >= 12 && hour < 17
  const isEvening = hour >= 17 && hour < 21

  const greetings: Record<WeatherCondition, string> = {
    clear: isMorning ? 'A luminous morning awaits you.' : isEvening ? 'Golden hour is upon the sanctuary.' : 'The skies are open and generous today.',
    partly_cloudy: 'The sky holds both light and shadow — perfect balance.',
    cloudy: 'Soft cloud light wraps the village in a gentle embrace.',
    rain: 'The rains have arrived. The earth is grateful.',
    thunderstorm: 'A powerful storm moves through. Sanctuary awaits.',
    mist: 'The valley breathes in mist. Something rare is possible today.',
    harmattan: 'The harmattan carries ancient dust across the highlands.',
    overcast: 'The sky is low and intimate. A day for inward journeys.',
  }

  const moods: Record<WeatherCondition, string> = {
    clear: 'vibrant',
    partly_cloudy: 'balanced',
    cloudy: 'contemplative',
    rain: 'intimate',
    thunderstorm: 'electric',
    mist: 'mystical',
    harmattan: 'ancient',
    overcast: 'meditative',
  }

  const experienceMap: Record<WeatherCondition, string[]> = {
    clear: isMorning
      ? ['Dawn Forest Walk', 'Sunrise Yoga', 'Outdoor Breakfast']
      : isAfternoon
      ? ['Canopy Trail', 'Farm Foraging', 'Solar Terrace Lounge']
      : ['Sundowner Ritual', 'Stargazing Session', 'Bonfire Circle'],
    partly_cloudy: ['Forest Bathing', 'Garden Meditation', 'Cottage Retreat'],
    cloudy: ['Spa Journey', 'Culinary Workshop', 'Living Archive Session'],
    rain: ['Rain Ritual Spa', 'Indoor Fireside Dining', 'Sound Bath'],
    thunderstorm: ['Storm Sound Bath', 'Fireplace Lounge', 'Deep Rest Ritual'],
    mist: ['Mist Walk', 'Forest Bathing', 'Photography Walk'],
    harmattan: ['Dust Cleanse Ritual', 'Clay Spa', 'Warm Tea Ceremony'],
    overcast: ['Breathwork Session', 'Writing Retreat', 'Plant Medicine Journey'],
  }

  return {
    greeting: greetings[weather.condition],
    ambientMood: moods[weather.condition],
    suggestedExperiences: experienceMap[weather.condition] ?? ['Sanctuary Exploration'],
    clothingNote:
      weather.temperatureC <= 17
        ? 'Warm layers recommended for outdoor exploration.'
        : weather.temperatureC >= 27
        ? 'Light breathable fabrics ideal today.'
        : 'Comfortable in light layers — bring a wrap for evening.',
  }
}

/**
 * Format temperature for display
 */
export function formatTemp(celsius: number): string {
  return `${celsius}°C`
}

/**
 * Map condition to emoji/icon label for UI use
 */
export function conditionToIcon(condition: WeatherCondition): string {
  const icons: Record<WeatherCondition, string> = {
    clear: '☀',
    partly_cloudy: '⛅',
    cloudy: '☁',
    rain: '🌧',
    thunderstorm: '⛈',
    mist: '🌫',
    harmattan: '🌾',
    overcast: '☁',
  }
  return icons[condition] ?? '☀'
}