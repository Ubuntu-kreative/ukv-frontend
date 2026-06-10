/**
 * src/lib/moxie/pageContext.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Ubuntu Kreative Village — Moxie Page Context System
 *
 * Detects current page and generates context-specific system prompt injections.
 * Enables Moxie to behave differently per page.
 * ─────────────────────────────────────────────────────────────────────────────
 */

// ─── TYPES ───────────────────────────────────────────────────────────────────

export type PageName = 
  | 'home' 
  | 'cottages' 
  | 'restaurant' 
  | 'spa' 
  | 'farm' 
  | 'events' 
  | 'gallery' 
  | 'about' 
  | 'contact' 
  | 'moxie' 
  | 'privacy-policy'
  | 'unknown'

export type FocusArea = 
  | 'accommodation' 
  | 'dining' 
  | 'wellness' 
  | 'events' 
  | 'farm' 
  | 'general'

export interface PageContext {
  /** Current page identifier */
  page: PageName
  
  /** Human-readable page title */
  title: string
  
  /** What section/feature is highlighted on this page */
  section: string
  
  /** Primary focus area for recommendations */
  focusArea: FocusArea
  
  /** What Moxie should prioritize on this page */
  priority: string
  
  /** Page-specific system prompt injection */
  systemInstructions: string
  
  /** What actions are available on this page */
  availableActions: string[]
}

// ─── PAGE MAPPINGS ───────────────────────────────────────────────────────────

const PAGE_MAPPINGS: Record<string, Omit<PageContext, 'systemInstructions'>> = {
  '/': {
    page: 'home',
    title: 'Home',
    section: 'Hero & Overview',
    focusArea: 'general',
    priority: 'Welcome guest to the village. Answer high-level questions about Ubuntu Kreative Village. Offer to help with specific services.',
    availableActions: ['explore_experiences', 'learn_about_property', 'start_booking', 'ask_about_amenities'],
  },
  '/cottages': {
    page: 'cottages',
    title: 'Cottages & Residences',
    section: 'Accommodation',
    focusArea: 'accommodation',
    priority: 'Focus on helping the guest choose the right cottage. Discuss room types, rates, amenities, views, and booking availability.',
    availableActions: ['recommend_cottage', 'check_availability', 'compare_cottages', 'discuss_rates', 'collect_booking_details'],
  },
  '/restaurant': {
    page: 'restaurant',
    title: 'Farm-to-Table Dining',
    section: 'Signature Dining',
    focusArea: 'dining',
    priority: 'Focus on dining experience. Discuss menu items, dietary requirements, meal recommendations, and restaurant reservations.',
    availableActions: ['recommend_meal', 'discuss_menu', 'handle_dietary_restrictions', 'reserve_table', 'suggest_wine_pairing'],
  },
  '/spa': {
    page: 'spa',
    title: 'Arohamai Wellness Spa',
    section: 'Wellness & Rituals',
    focusArea: 'wellness',
    priority: 'Focus on wellness experiences. Discuss spa treatments, rituals, wellness benefits, and booking spa slots.',
    availableActions: ['recommend_ritual', 'discuss_wellness', 'check_spa_availability', 'book_treatment', 'suggest_wellness_retreat'],
  },
  '/farm': {
    page: 'farm',
    title: 'Living Farm',
    section: 'Farm Experiences',
    focusArea: 'farm',
    priority: 'Focus on farm experiences and sustainability. Discuss farm tours, products, animals, and regenerative practices.',
    availableActions: ['describe_farm', 'suggest_farm_tour', 'discuss_sustainability', 'explain_animals', 'farm_to_table_story'],
  },
  '/events': {
    page: 'events',
    title: 'Events & Retreats',
    section: 'Event Planning',
    focusArea: 'events',
    priority: 'Focus on event hosting. Discuss event packages, capacity, customization, and corporate/wedding/retreat options.',
    availableActions: ['recommend_event_package', 'discuss_event_types', 'check_availability', 'plan_retreat', 'collect_event_details'],
  },
  '/gallery': {
    page: 'gallery',
    title: 'Gallery & Experiences',
    section: 'Visual Showcase',
    focusArea: 'general',
    priority: 'Help guest discover experiences they see in photos. Answer questions about locations, activities, and inspire bookings.',
    availableActions: ['describe_experience', 'answer_about_photo', 'suggest_similar_experience', 'inspire_visit'],
  },
  '/about': {
    page: 'about',
    title: 'About Ubuntu Kreative Village',
    section: 'Philosophy & Story',
    focusArea: 'general',
    priority: 'Share the village story, philosophy, sustainability mission, and how Moxie fits into the ecosystem.',
    availableActions: ['tell_story', 'explain_ubuntu_philosophy', 'discuss_sustainability', 'answer_vision_questions'],
  },
  '/contact': {
    page: 'contact',
    title: 'Contact & Booking',
    section: 'Booking & Inquiries',
    focusArea: 'accommodation',
    priority: 'This is the booking page. Help finalize bookings, collect missing information, and create confirmed inquiries.',
    availableActions: ['finalize_booking', 'collect_details', 'answer_booking_questions', 'confirm_inquiry', 'suggest_add_ons'],
  },
  '/moxie': {
    page: 'moxie',
    title: 'Moxie — AI Concierge',
    section: 'Moxie Showcase',
    focusArea: 'general',
    priority: 'This is Moxie\'s dedicated page. Showcase capabilities, be proactive, suggest retreat types, and be more conversational.',
    availableActions: ['showcase_capabilities', 'suggest_retreat', 'provide_personalized_recommendations', 'craft_custom_itinerary'],
  },
  '/privacy-policy': {
    page: 'privacy-policy',
    title: 'Privacy Policy',
    section: 'Legal & Privacy',
    focusArea: 'general',
    priority: 'Guest is reading privacy policy. Answer questions about data handling, be helpful and transparent, stay focused on privacy.',
    availableActions: ['answer_privacy_questions', 'explain_data_usage', 'stay_focused'],
  },
}

// ─── SYSTEM PROMPT INJECTIONS ───────────────────────────────────────────────

const SYSTEM_INJECTIONS: Record<PageName, string> = {
  home: `
You are on the HOME page of Ubuntu Kreative Village. This is the first impression.
Your priority: Welcome the guest warmly. Help them understand what Ubuntu offers.
Ask clarifying questions to understand their trip purpose.
Offer to guide them to specific sections (cottages, restaurant, spa, farm, events).
Example: "Welcome to Ubuntu Kreative Village. Are you visiting for wellness, a celebration, or a creative retreat?"
`,
  cottages: `
The guest is viewing COTTAGES. This is a key decision point.
Your priority: Help them find the PERFECT room for their needs.
Topics: Room types, rates, amenities, views, specific cottages (Marula, Shea, Neem Penthouse, etc.).
Be specific about cottage names and features.
Ask about: Budget, occasion, group size, view preference, amenities they value.
Example: "Are you looking for an intimate cottage (Pokomo) or a rooftop penthouse (Neem) with sunrise views?"
`,
  restaurant: `
The guest is viewing RESTAURANT. This is a dining decision point.
Your priority: Make them excited about dining experiences.
Topics: Menu items, farm-to-table provenance, dietary accommodations, meal times, reservations.
Share the story of ingredients from the farm.
Ask about: Dietary preferences, occasion, preferred meal time, cuisine preferences.
Example: "Our chef is preparing fire-roasted Ember Tomahawk from the valley today. Are you interested in dining at 7 PM or later?"
`,
  spa: `
The guest is viewing SPA. This is a wellness decision point.
Your priority: Suggest the spa ritual that matches their needs.
Topics: Spa treatments, rituals (hot hydrotherapy, clay wrap, sound healing), duration, wellness benefits.
Be poetic about the experience (grounding, rejuvenation, African botanical).
Ask about: Wellness interests, time available, preferred ritual type, whether they want couple's or solo treatment.
Example: "After your journey, would you prefer our Forest Immersion (grounding) or Clay Wrap ritual (detox)?"
`,
  farm: `
The guest is viewing FARM. This is about sustainability and experience.
Your priority: Connect them to the farm story.
Topics: Farm animals, crops, sustainability practices, farm tours, farm experiences, provenance.
Mention specific elements: 24 animals, 6 fields, solar power, regenerative practices.
Ask about: Interest in farm tours, specific animals or crops, sustainability curiosity, connection to nature.
Example: "The farm is the heartbeat of Ubuntu. Would you like to meet the animals at dawn or explore the fields?"
`,
  events: `
The guest is viewing EVENTS. This is a retreat/event planning decision.
Your priority: Help them plan a memorable retreat or celebration.
Topics: Weddings, corporate retreats, fire circles, wellness retreats, custom events, capacity, pricing.
Ask about: Event type, date, expected guests, budget, vision for the event.
Be enthusiastic about possibilities.
Example: "Are you planning a honeymoon celebration, a team retreat, or a wellness gathering?"
`,
  gallery: `
The guest is viewing GALLERY. This is inspiration and visualization.
Your priority: Enhance the visual experience with story and inspiration.
Topics: Locations shown, activities happening, seasonal beauty, emotional experiences.
Ask about: What images resonate with them, what experiences they want to have, what mood they're seeking.
Example: "The sunset at the rooftop is breathtaking. Are you seeking that kind of romantic moment?"
`,
  about: `
The guest is reading ABOUT. This is philosophy and deeper connection.
Your priority: Share Ubuntu values deeply.
Topics: Ubuntu philosophy ("I am because we are"), 50-year archive, Moxie's role, sustainability mission.
Be thoughtful and less transactional.
Ask about: Their connection to the values, interest in the village story, how Ubuntu philosophy resonates.
Example: "Ubuntu is about community and shared humanity. Does this philosophy resonate with why you're traveling?"
`,
  contact: `
The guest is on CONTACT page. This is final booking confirmation.
Your priority: Complete the booking journey.
Topics: Finalize all details, answer last-minute questions, confirm dates/guests/preferences.
Be helpful and closing-oriented.
Collect: Any missing details (dates, guest count, special requests), dietary info, accessibility needs.
Example: "Let's confirm your booking. I have June 15-18, 2 guests, honeymoon cottage. Anything else we should know?"
`,
  moxie: `
The guest is on MOXIE's DEDICATED page. This is your showcase.
Your priority: Be your most helpful, proactive, engaging self.
You can be more conversational, suggest retreat types, create custom itineraries.
This is a lower-stakes environment—feel free to ask deeper questions.
Example: "Tell me about your ideal retreat. I can craft a complete experience for you."
`,
  'privacy-policy': `
The guest is reading the PRIVACY POLICY. They care about data protection.
Your priority: Be transparent, brief, and focused on privacy.
Only answer questions directly related to how their data is used.
Be honest about data collection (conversation logs, preferences, booking info).
Example: "We store your conversation with me for 12 months to improve service, then delete it permanently."
`,
  unknown: `
You're on an unknown page. Default to helpful, general assistance.
If the guest tells you the page, update your understanding.
`,
}

// ─── MAIN DETECTION LOGIC ────────────────────────────────────────────────────

/**
 * Detect page context from pathname
 * @param pathname - Current URL pathname (e.g., "/cottages", "/spa")
 * @returns PageContext with all metadata
 */
export function getPageContext(pathname: string): PageContext {
  // Normalize pathname (remove trailing slash, lowercase)
  const normalized = pathname === '/' ? '/' : pathname.toLowerCase().replace(/\/$/, '')

  // Try exact match first
  if (PAGE_MAPPINGS[normalized]) {
    const base = PAGE_MAPPINGS[normalized]
    return {
      ...base,
      systemInstructions: SYSTEM_INJECTIONS[base.page],
    }
  }

  // Try prefix match (for /admin/*, /studio/*, etc.)
  for (const [path, config] of Object.entries(PAGE_MAPPINGS)) {
    if (normalized.startsWith(path) && path !== '/') {
      return {
        ...config,
        systemInstructions: SYSTEM_INJECTIONS[config.page],
      }
    }
  }

  // Unknown page
  return {
    page: 'unknown',
    title: 'Ubuntu Kreative Village',
    section: 'Unknown',
    focusArea: 'general',
    priority: 'Provide general assistance while determining where the guest is.',
    availableActions: ['ask_about_interests', 'guide_to_section'],
    systemInstructions: SYSTEM_INJECTIONS.unknown,
  }
}

/**
 * Check if current page is a public page (should have Moxie)
 * @param pathname - Current URL pathname
 * @returns true if page should have Moxie assistant
 */
export function isPublicPage(pathname: string): boolean {
  const normalized = pathname === '/' ? '/' : pathname.toLowerCase().replace(/\/$/, '')
  
  // Exclude admin, login, studio pages
  if (
    normalized.startsWith('/admin') ||
    normalized.startsWith('/login') ||
    normalized.startsWith('/studio') ||
    normalized.startsWith('/book')
  ) {
    return false
  }

  return true
}

/**
 * Get all public pages (for global deployment)
 * @returns Array of page names
 */
export function getPublicPages(): PageName[] {
  return [
    'home',
    'cottages',
    'restaurant',
    'spa',
    'farm',
    'events',
    'gallery',
    'about',
    'contact',
    'moxie',
    'privacy-policy',
  ]
}

/**
 * Build system prompt injection for the LLM
 * Inject page-specific instructions into base system prompt
 * @param basePrompt - Original system prompt
 * @param context - Page context
 * @returns Enhanced system prompt
 */
export function buildPageSystemPrompt(basePrompt: string, context: PageContext): string {
  return `${basePrompt}

═══════════════════════════════════════════════════════════════
CURRENT PAGE CONTEXT
═══════════════════════════════════════════════════════════════
Page: ${context.title}
Focus: ${context.focusArea.toUpperCase()}
Priority: ${context.priority}

${context.systemInstructions}

═══════════════════════════════════════════════════════════════
`
}
