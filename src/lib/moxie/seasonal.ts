import type { SeasonalMood, MoodConfig, Season, TimeOfDay } from '@/types/moxie'

// ─── Season Detection ───────────────────────────────────────────────────────

export function detectSeason(date: Date = new Date()): Season {
  const month = date.getMonth() + 1
  // Kenya seasons
  if (month >= 6 && month <= 9) return 'dry'
  if (month >= 10 && month <= 11) return 'short-rains'
  if (month >= 3 && month <= 5) return 'long-rains'
  return 'harvest' // Dec–Feb
}

export function detectTimeOfDay(date: Date = new Date()): TimeOfDay {
  const hour = date.getHours()
  if (hour >= 5 && hour < 7) return 'dawn'
  if (hour >= 7 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 17) return 'afternoon'
  if (hour >= 17 && hour < 20) return 'evening'
  return 'night'
}

// ─── Seasonal Moods ─────────────────────────────────────────────────────────

export const seasonalMoods: Record<Season, SeasonalMood> = {
  dry: {
    season: 'dry',
    title: 'The Golden Dry Season',
    description:
      'The highland air is crisp and clear. Long golden days stretch into firelit nights. The land breathes openly.',
    highlights: [
      'Clear highland skies perfect for stargazing',
      'Golden hour lasts nearly two hours',
      'Outdoor dining until late in the evening',
      'Optimal hiking and farm walking conditions',
    ],
    gradient: 'from-amber-950 via-stone-900 to-black',
    recommendation: 'Neem Penthouse — for rooftop stargazing and open-sky writing.',
    bestFor: ['creativity', 'romance', 'stargazing', 'hiking'],
  },
  'short-rains': {
    season: 'short-rains',
    title: 'The Short Rain Season',
    description:
      'Afternoon showers refresh the land. The air fills with petrichor and life. Everything becomes intensely green.',
    highlights: [
      'Jacaranda trees begin to bloom',
      'Afternoon rain creates natural white noise',
      'Tea and cocoa rituals by the fire',
      'The farm reaches peak lushness',
    ],
    gradient: 'from-emerald-950 via-slate-900 to-black',
    recommendation: 'Marula Cottage — nestled in the deepening green, close to the spa.',
    bestFor: ['rest', 'healing', 'reading', 'spa'],
  },
  'long-rains': {
    season: 'long-rains',
    title: 'The Long Rain Season',
    description:
      'Deep, sustained rains transform the village into an immersive green sanctuary. The rhythm slows beautifully.',
    highlights: [
      'Dramatic cloud formations over the valley',
      'Waterfalls appear in the surrounding hills',
      'Deeply restorative spa conditions',
      'Best season for deep writing and creative retreat',
    ],
    gradient: 'from-slate-900 via-zinc-900 to-black',
    recommendation: 'Inko Cottage — for deep solitude, firelight, and rain-sound sleeping.',
    bestFor: ['writing', 'detox', 'deep rest', 'creativity'],
  },
  harvest: {
    season: 'harvest',
    title: 'The Harvest Season',
    description:
      'The farm yields its abundance. Long warm days and cool highland nights. The table is at its richest.',
    highlights: [
      'Peak farm-to-table dining experience',
      'Harvest moon illuminates the valley',
      'Community gathering and fire circle season',
      'The clearest night skies of the year',
    ],
    gradient: 'from-orange-950 via-stone-900 to-black',
    recommendation: 'Buffalo Thorn — for valley views and harvest sunset watching.',
    bestFor: ['romance', 'community', 'dining', 'celebration'],
  },
}

// ─── Time-of-Day Mood Configs ───────────────────────────────────────────────

export const moodConfigs: Record<TimeOfDay, MoodConfig> = {
  dawn: {
    timeOfDay: 'dawn',
    gradient: 'from-rose-950 via-stone-900 to-black',
    accentColor: '#f4a261',
    greeting: 'The village stirs at dawn.',
    ambience: 'Dew on leaves. First light over the valley.',
  },
  morning: {
    timeOfDay: 'morning',
    gradient: 'from-amber-950 via-zinc-900 to-black',
    accentColor: '#d9c7a2',
    greeting: 'Good morning from Ubuntu.',
    ambience: 'Birdsong and farm warmth.',
  },
  afternoon: {
    timeOfDay: 'afternoon',
    gradient: 'from-stone-900 via-zinc-900 to-black',
    accentColor: '#a3b899',
    greeting: 'The village is alive this afternoon.',
    ambience: 'Warm highland air. The farm hums.',
  },
  evening: {
    timeOfDay: 'evening',
    gradient: 'from-orange-950 via-stone-900 to-black',
    accentColor: '#e76f51',
    greeting: 'Golden hour descends over Ubuntu.',
    ambience: 'The horizon glows. The fire awaits.',
  },
  night: {
    timeOfDay: 'night',
    gradient: 'from-slate-950 via-zinc-950 to-black',
    accentColor: '#9bb3d4',
    greeting: 'The village breathes under the stars.',
    ambience: 'Night insects. Firelight. Infinite sky.',
  },
}

// ─── Current Seasonal Message ───────────────────────────────────────────────

export function getSeasonalGreeting(date: Date = new Date()): string {
  const season = detectSeason(date)
  const mood = seasonalMoods[season]
  return mood.description
}

export function getCurrentMood(date: Date = new Date()): MoodConfig {
  const timeOfDay = detectTimeOfDay(date)
  return moodConfigs[timeOfDay]
}