// src/lib/moxie/recommendations.ts
// Ubuntu Kreative Village — Recommendation Intelligence Engine
// Mood → Cottage + Spa + Activity + Dining mapping
// Fixed: all contraction apostrophes in single-quoted strings → template literals

export type GuestIntent =
  | 'burnout'
  | 'romance'
  | 'creative'
  | 'healing'
  | 'digital-detox'
  | 'family'
  | 'adventure'
  | 'spiritual'
  | 'celebration'
  | 'workation'

export type ExperienceCategory = 'cottage' | 'spa' | 'activity' | 'dining' | 'package'

export interface RecommendedExperience {
  id: string
  category: ExperienceCategory
  name: string
  tagline: string
  description: string
  priceRange: string
  duration?: string
  tags: string[]
  bookingUrl?: string
  imageAlt: string
  urgency?: string
}

export interface RecommendationBundle {
  intent: GuestIntent
  headline: string
  narrative: string
  primary: RecommendedExperience
  supporting: RecommendedExperience[]
  package?: RecommendedExperience
  moxieMessage: string
}

// ─── Cottages ─────────────────────────────────────────────────────────────────

const COTTAGES: Record<string, RecommendedExperience> = {
  neemPenthouse: {
    id: 'neem-penthouse',
    category: 'cottage',
    name: 'Neem Penthouse',
    tagline: 'Suspended above the canopy',
    description:
      'Our highest sanctuary — floor-to-ceiling glass, a rooftop soaking tub, and uninterrupted views of the Rift Valley escarpment. Designed for those who need space to breathe again.',
    priceRange: 'KES 38,000 / night',
    tags: ['couples', 'panoramic', 'premium', 'restoration'],
    bookingUrl: '/book/neem-penthouse',
    imageAlt: 'Neem Penthouse rooftop view at dusk',
    urgency: 'Fully booked next 3 weekends — 2 weekday slots remain',
  },
  baobabCottage: {
    id: 'baobab-cottage',
    category: 'cottage',
    name: 'Baobab Cottage',
    tagline: 'Rooted in ancient stillness',
    description:
      'Built around a 200-year-old baobab. Stone floors, hand-carved furniture, a private garden bath. The slowest place on our property — deliberately.',
    priceRange: 'KES 24,000 / night',
    tags: ['solo', 'healing', 'spiritual', 'garden'],
    bookingUrl: '/book/baobab-cottage',
    imageAlt: 'Baobab Cottage garden at sunrise',
  },
  riverCabin: {
    id: 'river-cabin',
    category: 'cottage',
    name: 'River Cabin',
    tagline: 'Where the water does the thinking',
    description:
      'Perched 4 metres above the seasonal stream. Wooden deck, hammock, and the constant sound of moving water. Artists, writers, and wanderers find home here.',
    priceRange: 'KES 19,500 / night',
    tags: ['creative', 'solo', 'nature', 'writers'],
    bookingUrl: '/book/river-cabin',
    imageAlt: 'River Cabin deck overlooking the stream',
  },
  familyLodge: {
    id: 'family-lodge',
    category: 'cottage',
    name: 'Ubuntu Family Lodge',
    tagline: 'Space for everyone you love',
    description: `Three interconnected rooms opening onto a shared courtyard, fire pit, and children's nature garden. The whole family arrives strangers and leaves as a village.`,
    priceRange: 'KES 52,000 / night',
    tags: ['family', 'groups', 'courtyard', 'children'],
    bookingUrl: '/book/family-lodge',
    imageAlt: 'Family Lodge courtyard with fire pit at twilight',
  },
  honeymoonVilla: {
    id: 'honeymoon-villa',
    category: 'cottage',
    name: 'Jacaranda Villa',
    tagline: 'Where love finds its language',
    description:
      'A private villa with plunge pool, outdoor rain shower, canopy bed under a glass ceiling, and a personal butler. Love deserves architecture.',
    priceRange: 'KES 65,000 / night',
    tags: ['romance', 'couples', 'luxury', 'honeymoon'],
    bookingUrl: '/book/jacaranda-villa',
    imageAlt: 'Jacaranda Villa plunge pool at night with candlelight',
    urgency: '3 bookings this month — book early',
  },
}

// ─── Spa & Rituals ────────────────────────────────────────────────────────────

const SPA: Record<string, RecommendedExperience> = {
  soundBath: {
    id: 'sound-bath',
    category: 'spa',
    name: 'Rift Valley Sound Bath',
    tagline: 'Let frequency do what words cannot',
    description:
      'Tibetan singing bowls and indigenous instruments guide you through 90 minutes of cellular restoration. Performed outdoors at sunset on the escarpment terrace.',
    priceRange: 'KES 6,500 / session',
    duration: '90 minutes',
    tags: ['healing', 'burnout', 'spiritual', 'relaxation'],
    bookingUrl: '/book/sound-bath',
    imageAlt: 'Sound bath ceremony on the escarpment terrace at sunset',
  },
  herbalCeremony: {
    id: 'herbal-ceremony',
    category: 'spa',
    name: 'Forest Herbal Ceremony',
    tagline: 'Ancient plants. Modern nervous system.',
    description:
      'Our herbalist guides you through a personalised ritual — steaming, compresses, and a herbal elixir blended from our gardens. Deeply restorative.',
    priceRange: 'KES 4,800 / session',
    duration: '75 minutes',
    tags: ['healing', 'burnout', 'solo', 'natural'],
    bookingUrl: '/book/herbal-ceremony',
    imageAlt: 'Herbal steam ritual in forest spa',
  },
  coupleMassage: {
    id: 'couple-massage',
    category: 'spa',
    name: 'Couples Ubuntu Massage',
    tagline: 'Synchronised healing for two',
    description:
      'Two therapists, one rhythm. An 80-minute deep tissue and aromatherapy experience designed for couples. Ends with a shared cacao ceremony.',
    priceRange: 'KES 12,000 / couple',
    duration: '80 minutes',
    tags: ['romance', 'couples', 'honeymoon', 'celebration'],
    bookingUrl: '/book/couple-massage',
    imageAlt: 'Couples massage in open-air pavilion',
  },
  digitalDetoxRitual: {
    id: 'digital-detox-ritual',
    category: 'spa',
    name: 'Unplugged Reset Ritual',
    tagline: 'Your body remembers how to rest',
    description:
      'A 3-hour guided offline experience: forest bathing, breathwork, a tech-free massage, and a journaling session with our resident contemplative. Leave lighter.',
    priceRange: 'KES 9,500 / person',
    duration: '3 hours',
    tags: ['digital-detox', 'burnout', 'healing', 'solo'],
    bookingUrl: '/book/unplugged-reset',
    imageAlt: 'Forest bathing path through the village gardens',
  },
  moonCeremony: {
    id: 'moon-ceremony',
    category: 'spa',
    name: 'Full Moon Ceremony',
    tagline: 'Ancient rhythm. Present body.',
    description:
      'Held monthly at the stone circle. Fire, movement, intention-setting, sound, and community. One of our most requested experiences — and never the same twice.',
    priceRange: 'KES 3,500 / person',
    duration: '2.5 hours',
    tags: ['spiritual', 'community', 'celebration', 'healing'],
    bookingUrl: '/book/moon-ceremony',
    imageAlt: 'Moon ceremony fire circle at Ubuntu Kreative Village',
  },
}

// ─── Activities ───────────────────────────────────────────────────────────────

const ACTIVITIES: Record<string, RecommendedExperience> = {
  sunriseCycle: {
    id: 'sunrise-cycle',
    category: 'activity',
    name: 'Escarpment Sunrise Cycle',
    tagline: 'The best alarm clock in Kenya',
    description:
      'A guided 28km cycle along the escarpment rim at dawn. Expert guide, quality bikes, and a hot breakfast waiting at the viewpoint. Energising without being punishing.',
    priceRange: 'KES 3,200 / person',
    duration: '3.5 hours',
    tags: ['adventure', 'active', 'sunrise', 'nature'],
    bookingUrl: '/book/sunrise-cycle',
    imageAlt: 'Cyclists on Rift Valley escarpment at sunrise',
  },
  farmBreakfast: {
    id: 'farm-breakfast',
    category: 'dining',
    name: 'Farm-to-Table Sunrise Breakfast',
    tagline: 'Your first meal, unhurried',
    description:
      'Harvested at 5am, plated by 7am. Eggs from our chickens, honey from our hives, bread from our oven. Served in the kitchen garden with birdsong and no agenda.',
    priceRange: 'KES 2,800 / person',
    duration: 'Open until 10am',
    tags: ['family', 'all', 'slow-morning', 'farm'],
    bookingUrl: '/book/farm-breakfast',
    imageAlt: 'Farm breakfast spread in the kitchen garden',
  },
  fireDinner: {
    id: 'fire-dinner',
    category: 'dining',
    name: 'Fire & Feast Dinner',
    tagline: 'Food as ceremony',
    description:
      'A 7-course dinner cooked over open fire in our central boma. Indigenous ingredients, live music, and a storyteller weaving the meal together. Unforgettable.',
    priceRange: 'KES 8,500 / person',
    duration: 'Evenings from 7pm',
    tags: ['romance', 'celebration', 'groups', 'luxury'],
    bookingUrl: '/book/fire-dinner',
    imageAlt: 'Fire and feast dinner under the stars in the village boma',
    urgency: 'Limited to 14 guests — book 48 hours ahead',
  },
  stargaze: {
    id: 'stargaze',
    category: 'activity',
    name: 'Stargazing Deck Experience',
    tagline: 'The oldest ceiling in the world',
    description:
      'Our resident astronomer guides you through the southern sky from our elevated deck. Telescope, blankets, warm drinks. No light pollution. Pure wonder.',
    priceRange: 'KES 2,200 / person',
    duration: '2 hours',
    tags: ['digital-detox', 'romance', 'spiritual', 'family'],
    bookingUrl: '/book/stargaze',
    imageAlt: 'Stargazing deck at Ubuntu Kreative Village at night',
  },
  creativeWorkshop: {
    id: 'creative-workshop',
    category: 'activity',
    name: 'Artist-in-Residence Workshop',
    tagline: `Create something that didn't exist before`,
    description: `Daily workshops with our resident artists — ceramics, natural dye, print-making, nature journaling. Open to all skill levels. The point is making, not mastery.`,
    priceRange: 'KES 4,500 / workshop',
    duration: '3 hours',
    tags: ['creative', 'solo', 'workation', 'mindful'],
    bookingUrl: '/book/creative-workshop',
    imageAlt: 'Ceramics workshop in the Ubuntu creative studio',
  },
}

// ─── Packages ─────────────────────────────────────────────────────────────────

const PACKAGES: Record<string, RecommendedExperience> = {
  restorePackage: {
    id: 'restore-package',
    category: 'package',
    name: 'The Restore Package',
    tagline: '3 nights of serious recovery',
    description:
      'Baobab Cottage (3 nights) + daily herbal ceremony + sound bath + forest bathing + farm breakfasts. Designed for people running on empty.',
    priceRange: 'KES 98,000 for 2 (saves KES 14,000)',
    duration: '3 nights',
    tags: ['burnout', 'healing', 'solo', 'digital-detox'],
    bookingUrl: '/book/restore-package',
    imageAlt: 'Restore package — baobab cottage and spa ritual',
    urgency: 'Best value — limited availability',
  },
  romancePackage: {
    id: 'romance-package',
    category: 'package',
    name: `The Lovers' Escape`,
    tagline: `Two nights you'll keep returning to`,
    description:
      'Jacaranda Villa (2 nights) + couples massage + fire dinner + champagne on arrival + sunrise private hike. Built for connection.',
    priceRange: 'KES 145,000 for 2 (saves KES 22,000)',
    duration: '2 nights',
    tags: ['romance', 'honeymoon', 'couples', 'celebration'],
    bookingUrl: '/book/romance-package',
    imageAlt: `Lovers escape package at Jacaranda Villa`,
    urgency: 'Only 4 available per month',
  },
  creativeRetreat: {
    id: 'creative-retreat',
    category: 'package',
    name: 'The Creative Residency',
    tagline: '5 days to make your best work',
    description: `River Cabin (5 nights) + daily workshops + high-speed studio WiFi + artist mentorship sessions + all meals. The creative reset you've been postponing.`,
    priceRange: 'KES 165,000 solo (saves KES 28,000)',
    duration: '5 nights',
    tags: ['creative', 'workation', 'solo', 'writers'],
    bookingUrl: '/book/creative-residency',
    imageAlt: 'Creative residency at River Cabin with studio access',
  },
}

// ─── Recommendation Map ───────────────────────────────────────────────────────

const RECOMMENDATION_MAP: Record<GuestIntent, RecommendationBundle> = {
  burnout: {
    intent: 'burnout',
    headline: `You've earned this rest`,
    narrative: `When the body has been running too long, it needs more than a weekend. It needs permission to stop — and a place that holds that permission with care.`,
    primary: COTTAGES.baobabCottage,
    supporting: [SPA.digitalDetoxRitual, SPA.herbalCeremony, ACTIVITIES.stargaze],
    package: PACKAGES.restorePackage,
    moxieMessage:
      `I can feel how much you need this. Let me build you a 3-day reset — no agenda, no hustle. Just the kind of quiet that actually restores. Shall I check availability?`,
  },
  romance: {
    intent: 'romance',
    headline: 'Love deserves proper architecture',
    narrative: `We've designed spaces where connection deepens, where time slows, and where the setting does half the work for you. Come and let the village hold your love story.`,
    primary: COTTAGES.honeymoonVilla,
    supporting: [SPA.coupleMassage, ACTIVITIES.fireDinner, ACTIVITIES.stargaze],
    package: PACKAGES.romancePackage,
    moxieMessage:
      `The Jacaranda Villa has two evenings open next weekend — and the Fire & Feast dinner on Saturday is still bookable. Want me to hold them while you decide?`,
  },
  creative: {
    intent: 'creative',
    headline: 'Make something real here',
    narrative:
      'The river has a way of unsticking ideas. The forest has a way of silencing the inner critic. Ubuntu was built partly for people who need space to make their best work.',
    primary: COTTAGES.riverCabin,
    supporting: [ACTIVITIES.creativeWorkshop, SPA.soundBath, ACTIVITIES.farmBreakfast],
    package: PACKAGES.creativeRetreat,
    moxieMessage:
      `Our current Artist-in-Residence is a ceramicist from Nairobi. She leads workshops Tuesday and Thursday mornings. Want me to check if the River Cabin is free around that?`,
  },
  healing: {
    intent: 'healing',
    headline: 'The land here has always known how to heal',
    narrative:
      'Ubuntu was built on principles of ecological restoration — and that philosophy extends to guests. The plants, the air, the rituals, and the people here are all oriented toward your return to wholeness.',
    primary: COTTAGES.baobabCottage,
    supporting: [SPA.herbalCeremony, SPA.soundBath, SPA.moonCeremony],
    package: PACKAGES.restorePackage,
    moxieMessage:
      `Our herbalist Maria has two sessions available this week. She works with each guest individually. Would you like me to include a consultation in your itinerary?`,
  },
  'digital-detox': {
    intent: 'digital-detox',
    headline: 'Your phone can wait. Your body cannot.',
    narrative: `We have strong WiFi here — and strong reasons not to use it. The most common guest experience at Ubuntu is arriving distracted and leaving present. We've designed for that arc deliberately.`,
    primary: COTTAGES.baobabCottage,
    supporting: [SPA.digitalDetoxRitual, ACTIVITIES.stargaze, SPA.soundBath],
    package: PACKAGES.restorePackage,
    moxieMessage:
      `I can build you a fully offline itinerary — forest, spa, stargazing, silence. No screens needed. Would you like 2 nights or 3? The deeper rest usually happens on night 3.`,
  },
  family: {
    intent: 'family',
    headline: 'Room for everyone. Space for everyone.',
    narrative:
      'Ubuntu is a Bantu word for the philosophy that we are who we are through each other. The Family Lodge was built around that idea — literally.',
    primary: COTTAGES.familyLodge,
    supporting: [ACTIVITIES.farmBreakfast, ACTIVITIES.sunriseCycle, ACTIVITIES.fireDinner],
    moxieMessage: `The Family Lodge sleeps up to 8 and has its own kitchen garden for children's activities. Do you have little ones coming? I'll make sure the team is ready.`,
  },
  adventure: {
    intent: 'adventure',
    headline: `The escarpment doesn't disappoint`,
    narrative:
      `Kenya's Rift Valley is one of the most dramatic landscapes on Earth. Our property sits at the rim. We've built experiences that let you feel that without compromise.`,
    primary: COTTAGES.neemPenthouse,
    supporting: [ACTIVITIES.sunriseCycle, ACTIVITIES.fireDinner, ACTIVITIES.stargaze],
    moxieMessage:
      `The sunrise cycle goes right along the rim — you're 900m above the valley floor. I'd recommend pairing it with a fire dinner the night before to fuel up. Shall I book both?`,
  },
  spiritual: {
    intent: 'spiritual',
    headline: 'The land here is listening',
    narrative:
      `Ubuntu was founded on the belief that land, community, and practice are inseparable. Our spiritual offerings aren't performances — they're continuations of a living tradition.`,
    primary: COTTAGES.baobabCottage,
    supporting: [SPA.moonCeremony, SPA.soundBath, SPA.herbalCeremony],
    moxieMessage:
      `The next full moon ceremony is in 11 days. It's one of our most sought-after experiences. I can hold your spot alongside the Baobab Cottage if you'd like to plan around it.`,
  },
  celebration: {
    intent: 'celebration',
    headline: `You've earned a celebration worthy of the moment`,
    narrative:
      `Birthdays, anniversaries, promotions, completions — Ubuntu is where milestone moments become milestone memories. We build celebrations that feel personal, not catered.`,
    primary: COTTAGES.honeymoonVilla,
    supporting: [ACTIVITIES.fireDinner, SPA.moonCeremony, SPA.coupleMassage],
    package: PACKAGES.romancePackage,
    moxieMessage:
      `Tell me a bit about what you're celebrating and who's coming. I'll build you a bespoke evening — flowers, fire, music, the works. It would be my pleasure.`,
  },
  workation: {
    intent: 'workation',
    headline: 'Work better. Finish stronger. Rest fully.',
    narrative:
      'Ubuntu has gigabit fibre in every cottage, dedicated desk spaces, and a culture of deep work. It is also surrounded by forest, ritual, and silence. That tension is the point.',
    primary: COTTAGES.riverCabin,
    supporting: [ACTIVITIES.farmBreakfast, ACTIVITIES.creativeWorkshop, SPA.soundBath],
    package: PACKAGES.creativeRetreat,
    moxieMessage:
      `Our workation guests typically structure mornings for deep work, afternoons for nature, and evenings for village experiences. Want me to draft a sample week for you?`,
  },
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getRecommendationByIntent(intent: GuestIntent): RecommendationBundle {
  return RECOMMENDATION_MAP[intent]
}

export function getRecommendationByMood(mood: string): RecommendationBundle {
  const normalized = mood.toLowerCase().trim()

  const moodMap: Record<string, GuestIntent> = {
    tired:        'burnout',
    exhausted:    'burnout',
    stressed:     'burnout',
    burned:       'burnout',
    'burnt out':  'burnout',
    overwhelmed:  'burnout',
    love:         'romance',
    honeymoon:    'romance',
    anniversary:  'romance',
    romantic:     'romance',
    partner:      'romance',
    wedding:      'romance',
    create:       'creative',
    write:        'creative',
    art:          'creative',
    artist:       'creative',
    creative:     'creative',
    inspiration:  'creative',
    writer:       'creative',
    heal:         'healing',
    healing:      'healing',
    grief:        'healing',
    recover:      'healing',
    trauma:       'healing',
    offline:      'digital-detox',
    detox:        'digital-detox',
    unplug:       'digital-detox',
    disconnect:   'digital-detox',
    family:       'family',
    kids:         'family',
    children:     'family',
    parents:      'family',
    hike:         'adventure',
    cycle:        'adventure',
    active:       'adventure',
    explore:      'adventure',
    adventure:    'adventure',
    spirit:       'spiritual',
    meditate:     'spiritual',
    pray:         'spiritual',
    ceremony:     'spiritual',
    ritual:       'spiritual',
    birthday:     'celebration',
    celebrate:    'celebration',
    promotion:    'celebration',
    work:         'workation',
    remote:       'workation',
    deadline:     'workation',
    focus:        'workation',
  }

  for (const [key, intent] of Object.entries(moodMap)) {
    if (normalized.includes(key)) {
      return RECOMMENDATION_MAP[intent]
    }
  }

  return RECOMMENDATION_MAP['burnout']
}

export function getAllIntents(): GuestIntent[] {
  return Object.keys(RECOMMENDATION_MAP) as GuestIntent[]
}

export function getIntentLabel(intent: GuestIntent): string {
  const labels: Record<GuestIntent, string> = {
    burnout:        'Deep Rest',
    romance:        'Romance',
    creative:       'Creative Retreat',
    healing:        'Healing Journey',
    'digital-detox':'Digital Detox',
    family:         'Family Escape',
    adventure:      'Adventure',
    spiritual:      'Spiritual Practice',
    celebration:    'Celebration',
    workation:      'Workation',
  }
  return labels[intent]
}

export function getIntentIcon(intent: GuestIntent): string {
  const icons: Record<GuestIntent, string> = {
    burnout:        '🌿',
    romance:        '✨',
    creative:       '🎨',
    healing:        '🌸',
    'digital-detox':'🌲',
    family:         '🏡',
    adventure:      '🦅',
    spiritual:      '🌙',
    celebration:    '🔥',
    workation:      '⚡',
  }
  return icons[intent]
}