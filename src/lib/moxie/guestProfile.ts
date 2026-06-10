/**
 * src/lib/moxie/guestProfile.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Ubuntu Kreative Village — Moxie Guest Profile System
 *
 * Builds and maintains guest profile from conversation facts.
 * Enables smart matching for recommendations.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type Occasion = 
  | 'honeymoon' 
  | 'anniversary' 
  | 'family' 
  | 'corporate' 
  | 'wellness' 
  | 'creative' 
  | 'general'

export type BudgetTier = 'budget' | 'moderate' | 'luxury' | 'premium'

export type RoomPreference = 'rooftop' | 'garden' | 'penthouse' | 'cottage' | 'any'

export interface GuestProfile {
  // Identity
  name?: string
  email?: string
  phone?: string

  // Stay Details
  checkInDate?: string // YYYY-MM-DD
  checkOutDate?: string // YYYY-MM-DD
  numberOfGuests?: number
  numberOfChildren?: number

  // Preferences
  occasion?: Occasion
  budget?: BudgetTier
  vibes?: string[] // ['quiet', 'romantic', 'active', 'spiritual', 'cultural']

  // Dietary & Wellness
  dietary?: string[] // ['vegetarian', 'vegan', 'gluten-free', 'halal']
  allergies?: string[]
  wellnessInterests?: string[] // ['spa', 'yoga', 'meditation', 'farm', 'nature']

  // Room Preferences
  roomPreference?: RoomPreference
  viewPreference?: 'sunrise' | 'sunset' | 'valley' | 'forest' | 'any'

  // Communication
  timezone?: string
  language?: string

  // Tracking
  createdAt: number
  updatedAt: number
  sourcePage?: string // Where profile was initiated
  conversationMessages?: number
}

/**
 * Create a new empty guest profile
 * @returns Empty GuestProfile with timestamps
 */
export function createEmptyProfile(): GuestProfile {
  const now = Date.now()
  return {
    createdAt: now,
    updatedAt: now,
  }
}

/**
 * Extract key facts from text using pattern matching
 * @param text - Conversation text to scan for facts
 * @returns Extracted facts object
 */
function extractFactsFromText(text: string): Partial<GuestProfile> {
  const lower = text.toLowerCase()
  const facts: Partial<GuestProfile> = {}

  // Name patterns: "my name is X", "I'm X", "call me X"
  const nameMatch = text.match(/(?:my name is|i'm|i am|call me)\s+([A-Z][a-z]+)(?:\s+([A-Z][a-z]+))?/i)
  if (nameMatch) {
    facts.name = nameMatch[0].split(/(?:is|'m|am|me)\s+/i)[1]?.trim()
  }

  // Email pattern
  const emailMatch = text.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/i)
  if (emailMatch) {
    facts.email = emailMatch[1]
  }

  // Phone pattern (basic)
  const phoneMatch = text.match(/(?:phone|call me at|reach me at|number is)\s*(\+?[\d\s\-\(\)]{10,})/i)
  if (phoneMatch) {
    facts.phone = phoneMatch[1]?.trim()
  }

  // Date patterns: "June 15", "15-20", "next week", etc.
  const datePatterns = [
    /(?:arriving|checking in|coming)\s+(?:on\s+)?([A-Z][a-z]+\s+\d{1,2})/i,
    /(\d{1,2})\s*(?:to|-|through)\s*(\d{1,2})/,
  ]
  for (const pattern of datePatterns) {
    const match = text.match(pattern)
    if (match && !facts.checkInDate) {
      // This is a simplified extraction - in production use date-fns
      facts.checkInDate = match[1]
    }
  }

  // Number of guests
  if (/\b(two|2)\s+(?:of us|guests|people)/i.test(lower)) {
    facts.numberOfGuests = 2
  } else if (/\b(three|3)\s+(?:of us|guests|people)/i.test(lower)) {
    facts.numberOfGuests = 3
  } else if (/\b(four|4)\s+(?:of us|guests|people)/i.test(lower)) {
    facts.numberOfGuests = 4
  }

  // Occasion detection
  if (/honeymoon|newlywed|just married/i.test(lower)) facts.occasion = 'honeymoon'
  if (/anniversary/i.test(lower)) facts.occasion = 'anniversary'
  if (/family|kids|children/i.test(lower)) facts.occasion = 'family'
  if (/corporate|team|work|business/i.test(lower)) facts.occasion = 'corporate'
  if (/wellness|spa|retreat|healing/i.test(lower)) facts.occasion = 'wellness'
  if (/creative|artist|writer|escape|quiet/i.test(lower)) facts.occasion = 'creative'

  // Dietary
  if (/vegetarian/i.test(lower)) facts.dietary = ['vegetarian']
  if (/vegan/i.test(lower)) facts.dietary = ['vegan']
  if (/gluten.?free|coeliac|celiac/i.test(lower)) {
    facts.dietary = facts.dietary ? [...facts.dietary, 'gluten-free'] : ['gluten-free']
  }

  // Allergies
  if (/allerg/i.test(lower)) {
    // Mark that allergies were mentioned for follow-up
    facts.allergies = ['mentioned - needs confirmation']
  }

  // Wellness interests
  if (/spa|massage|treatment/i.test(lower)) {
    facts.wellnessInterests = ['spa']
  }
  if (/yoga|meditation/i.test(lower)) {
    facts.wellnessInterests = facts.wellnessInterests || []
    facts.wellnessInterests.push('meditation')
  }
  if (/farm|animals|nature|walk/i.test(lower)) {
    facts.wellnessInterests = facts.wellnessInterests || []
    facts.wellnessInterests.push('farm')
  }

  // Budget signals
  if (/budget|affordable|cheap|inexpensive|under/i.test(lower)) {
    facts.budget = 'budget'
  }
  if (/luxury|premium|high.end|expensive/i.test(lower)) {
    facts.budget = 'luxury'
  }

  // Room preference
  if (/rooftop|penthouse|upstairs/i.test(lower)) facts.roomPreference = 'rooftop'
  if (/cottage|cozy|intimate/i.test(lower)) facts.roomPreference = 'cottage'

  // View preference
  if (/sunrise|morning|dawn/i.test(lower)) facts.viewPreference = 'sunrise'
  if (/sunset|evening|dusk/i.test(lower)) facts.viewPreference = 'sunset'

  return facts
}

/**
 * Update guest profile with new facts
 * Merges new facts intelligently (doesn't overwrite existing data)
 * @param profile - Existing profile
 * @param facts - New facts to merge
 * @returns Updated profile
 */
export function updateProfileWithFacts(
  profile: GuestProfile,
  facts: Partial<GuestProfile>,
): GuestProfile {
  const updated: GuestProfile = { ...profile }

  // Identity (only fill if empty)
  if (facts.name && !updated.name) updated.name = facts.name
  if (facts.email && !updated.email) updated.email = facts.email
  if (facts.phone && !updated.phone) updated.phone = facts.phone

  // Stay details
  if (facts.checkInDate && !updated.checkInDate) updated.checkInDate = facts.checkInDate
  if (facts.checkOutDate && !updated.checkOutDate) updated.checkOutDate = facts.checkOutDate
  if (facts.numberOfGuests && !updated.numberOfGuests) updated.numberOfGuests = facts.numberOfGuests
  if (facts.numberOfChildren && !updated.numberOfChildren) updated.numberOfChildren = facts.numberOfChildren

  // Preferences (set if more specific or first time)
  if (facts.occasion && (!updated.occasion || facts.occasion !== 'general'))
    updated.occasion = facts.occasion

  if (facts.budget && (!updated.budget || facts.budget === 'luxury' || facts.budget === 'budget'))
    updated.budget = facts.budget

  // Arrays (merge, don't replace)
  if (facts.vibes && facts.vibes.length > 0) {
    updated.vibes = [...new Set([...(updated.vibes || []), ...facts.vibes])]
  }

  if (facts.dietary && facts.dietary.length > 0) {
    updated.dietary = [...new Set([...(updated.dietary || []), ...facts.dietary])]
  }

  if (facts.allergies && facts.allergies.length > 0) {
    updated.allergies = [...new Set([...(updated.allergies || []), ...facts.allergies])]
  }

  if (facts.wellnessInterests && facts.wellnessInterests.length > 0) {
    updated.wellnessInterests = [...new Set([...(updated.wellnessInterests || []), ...facts.wellnessInterests])]
  }

  // Room preferences
  if (facts.roomPreference && !updated.roomPreference) updated.roomPreference = facts.roomPreference
  if (facts.viewPreference && !updated.viewPreference) updated.viewPreference = facts.viewPreference

  // Communication
  if (facts.timezone && !updated.timezone) updated.timezone = facts.timezone
  if (facts.language && !updated.language) updated.language = facts.language

  // Update timestamp
  updated.updatedAt = Date.now()

  return updated
}

/**
 * Build guest profile from conversation message
 * Extracts facts and builds/updates profile
 * @param profile - Existing profile (or new one if null)
 * @param message - New message to extract facts from
 * @returns Updated profile
 */
export function buildProfileFromMessage(
  profile: GuestProfile | null,
  message: string,
): GuestProfile {
  const current = profile || createEmptyProfile()
  const facts = extractFactsFromText(message)
  return updateProfileWithFacts(current, facts)
}

/**
 * Format profile as readable context for system prompt
 * @param profile - Guest profile
 * @returns Formatted string for LLM context
 */
export function profileToSystemContext(profile: GuestProfile): string {
  const parts: string[] = []

  if (profile.name) parts.push(`Guest Name: ${profile.name}`)
  if (profile.numberOfGuests) {
    const withChildren = profile.numberOfChildren 
      ? ` (${profile.numberOfChildren} children)` 
      : ''
    parts.push(`Guests: ${profile.numberOfGuests}${withChildren}`)
  }
  if (profile.checkInDate) parts.push(`Check-in: ${profile.checkInDate}`)
  if (profile.checkOutDate) parts.push(`Check-out: ${profile.checkOutDate}`)
  if (profile.occasion) parts.push(`Occasion: ${profile.occasion}`)
  if (profile.budget) parts.push(`Budget Preference: ${profile.budget}`)
  if (profile.dietary && profile.dietary.length > 0) {
    parts.push(`Dietary: ${profile.dietary.join(', ')}`)
  }
  if (profile.allergies && profile.allergies.length > 0) {
    parts.push(`Allergies: ${profile.allergies.join(', ')}`)
  }
  if (profile.wellnessInterests && profile.wellnessInterests.length > 0) {
    parts.push(`Wellness Interests: ${profile.wellnessInterests.join(', ')}`)
  }
  if (profile.roomPreference && profile.roomPreference !== 'any') {
    parts.push(`Room Preference: ${profile.roomPreference}`)
  }
  if (profile.viewPreference && profile.viewPreference !== 'any') {
    parts.push(`View Preference: ${profile.viewPreference}`)
  }

  if (parts.length === 0) return 'No guest information collected yet.'

  return `Guest Profile:\n${parts.map(p => `  • ${p}`).join('\n')}`
}

/**
 * Check if profile is complete enough for booking
 * @param profile - Guest profile
 * @returns true if profile has minimum booking info
 */
export function isProfileCompleteForBooking(profile: GuestProfile): boolean {
  return !!(
    profile.name &&
    profile.email &&
    profile.phone &&
    profile.checkInDate &&
    profile.checkOutDate &&
    profile.numberOfGuests
  )
}
