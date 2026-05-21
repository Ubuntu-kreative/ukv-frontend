// ─── Core Domain Types ─────────────────────────────────────────────────────

export interface Ritual {
  id: string
  title: string
  time: string
  location: string
  icon: string
  description: string
  season?: Season
}

export interface WellnessExperience {
  id: string
  title: string
  category: WellnessCategory
  duration: string
  description: string
  price?: number
  available: boolean
  featured?: boolean
}

export interface ArchiveEntry {
  id: string
  year: number
  title: string
  description: string
  category: ArchiveCategory
  milestone?: boolean
}

export interface Experience {
  id: string
  title: string
  description: string
  icon: string
  category: ExperienceCategory
  duration?: string
  price?: number
  featured?: boolean
}

// ─── Sanctuary Intelligence Types ──────────────────────────────────────────

export interface SanctuaryMetric {
  id: string
  label: string
  value: string
  unit?: string
  status: MetricStatus
  icon?: string
}

export interface SanctuaryStatus {
  solarGrid: number
  spaWaterTemp: number
  farmHarvest: HarvestStatus
  sunsetIndex: SunsetIndex
  moonPhase: string
  moonPhaseIcon: string
  airQuality: AirQualityLevel
  silenceLevel: SilenceLevel
  fireplaceStatus: FireplaceStatus
  teaOfDay: string
  updatedAt: Date
}

// ─── Retreat & Recommendation Types ────────────────────────────────────────

export interface RetreatType {
  id: string
  title: string
  description: string
  recommendation: string
  cottageId: string
  vibe: string
  duration?: string
  tags: string[]
}

export interface RetreatItinerary {
  title: string
  subtitle: string
  duration: number
  days: ItineraryDay[]
  theme: RetreatTheme
  wellness?: string[]
  dining?: string[]
}

export interface ItineraryDay {
  day: number
  title: string
  activities: DayActivity[]
}

export interface DayActivity {
  time: string
  title: string
  description: string
  location?: string
}

// ─── Seasonal Intelligence Types ───────────────────────────────────────────

export interface SeasonalMood {
  season: Season
  title: string
  description: string
  highlights: string[]
  gradient: string
  recommendation: string
  bestFor: string[]
}

export interface MoodConfig {
  timeOfDay: TimeOfDay
  gradient: string
  accentColor: string
  greeting: string
  ambience: string
}

// ─── Guest & Memory Types ───────────────────────────────────────────────────

export interface GuestPreferences {
  retreatType?: string
  visitPurpose?: VisitPurpose
  stayDuration?: number
  previousCottage?: string
  wellnessInterests?: string[]
}

export interface GuestMemory {
  id: string
  guestName?: string
  preferences: GuestPreferences
  previousVisits: number
  lastVisit?: Date
  savedItineraries: string[]
}

// ─── Enums & Unions ────────────────────────────────────────────────────────

export type Season = 'dry' | 'short-rains' | 'long-rains' | 'harvest'
export type TimeOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night'
export type MetricStatus = 'active' | 'optimal' | 'standby' | 'offline'
export type HarvestStatus = 'active' | 'resting' | 'planting'
export type SunsetIndex = 'golden' | 'crimson' | 'pale' | 'overcast'
export type AirQualityLevel = 'excellent' | 'good' | 'moderate'
export type SilenceLevel = 'high' | 'moderate' | 'low'
export type FireplaceStatus = 'ready' | 'lit' | 'cooling'
export type WellnessCategory = 'spa' | 'movement' | 'nutrition' | 'mindfulness'
export type ExperienceCategory = 'nature' | 'culinary' | 'wellness' | 'cultural' | 'evening'
export type ArchiveCategory = 'ecology' | 'construction' | 'community' | 'culture' | 'technology'
export type RetreatTheme = 'restoration' | 'creativity' | 'romance' | 'adventure' | 'detox'
export type VisitPurpose = 'rest' | 'healing' | 'romance' | 'creativity' | 'silence' | 'reconnection' | 'celebration'

// ─── Chat Types ────────────────────────────────────────────────────────────

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface MoxieChatState {
  messages: ChatMessage[]
  isLoading: boolean
  sessionId: string
}

// ─── Feature Flags ─────────────────────────────────────────────────────────

export interface FeatureFlags {
  seasonalIntelligence: boolean
  ambientAudio: boolean
  memorySystem: boolean
  retreatGenerator: boolean
  villageIntelligence: boolean
  moodEngine: boolean
}