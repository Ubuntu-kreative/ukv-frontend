// ─────────────────────────────────────────────────────────────
// stays-data.ts  — STATIC module, never re-evaluated at runtime
// Import this in server components freely; zero client bundle cost
// ─────────────────────────────────────────────────────────────

export type StayCategory = 'Farm House' | 'Pokomo Cottage' | 'Signature'
export type StayStatus   = 'available' | 'reserved'
export type StayFloor    = 'Ground Floor' | 'First Floor' | 'Rooftop' | 'Cottage' | 'Exclusive'
export type BoardOption  = 'bedOnly' | 'bedBreakfast' | 'halfBoard' | 'fullBoard'

export interface BoardRates {
  bedOnly: number
  bedBreakfast: number
  halfBoard: number
  fullBoard: number
}

export interface Stay {
  id: string
  name: string
  category: StayCategory
  floor: StayFloor
  isPenthouse: boolean
  guests: number
  bedrooms: number
  bathrooms: number
  size: number
  rates: BoardRates
  status: StayStatus
  featured?: boolean
  accent: string
  images: string[]
  features: string[]
  amenities: string[]
  description: string
  storyLine: string
  specs: Record<string, string>
  bookingDetails: {
    minNights: number
    cleaningFee: number
    taxRate: number
    cancellationPolicy: string
    maxOccupancy: number
  }
}

export const BOARD_LABELS: Record<BoardOption, string> = {
  bedOnly:      'Bed Only',
  bedBreakfast: 'Bed & Breakfast',
  halfBoard:    'Half Board',
  fullBoard:    'Full Board',
}

export const BOARD_INCLUDES: Record<BoardOption, string> = {
  bedOnly:      'Room · Farm access · All amenities',
  bedBreakfast: 'Room · Farm breakfast · All amenities',
  halfBoard:    'Room · Breakfast · Lunch or dinner',
  fullBoard:    'Room · Breakfast · Lunch & dinner',
}

export const BOARD_OPTIONS: { label: string; value: BoardOption }[] = [
  { label: 'Bed Only',        value: 'bedOnly' },
  { label: 'Bed & Breakfast', value: 'bedBreakfast' },
  { label: 'Half Board',      value: 'halfBoard' },
  { label: 'Full Board',      value: 'fullBoard' },
]

export const FILTER_TABS = [
  { label: 'All',              value: 'All' },
  { label: 'Farm House',       value: 'Farm House' },
  { label: 'Pokomo Cottages',  value: 'Pokomo Cottage' },
  { label: 'Penthouses',       value: 'Penthouse' },
  { label: 'Rooftop',          value: 'Rooftop' },
] as const

export const SORT_OPTIONS = [
  { label: 'Featured',      value: 'featured' },
  { label: 'Price: Low',    value: 'price-asc' },
  { label: 'Price: High',   value: 'price-desc' },
  { label: 'Guests',        value: 'guests' },
] as const

const FARMHOUSE_AMENITIES = [
  'Gym', 'Swimming Pool', 'Conference Facilities', 'Farm Tours',
  'Movie Nights', 'Cycling', 'Nature Walks',
]

const POKOMO_AMENITIES = [
  'Gym', 'Swimming Pool', 'Conference Facilities', 'Farm Tours',
  'Movie Nights', 'Cycling', 'Nature Walks', 'Bonfire',
]

// ── JSON-LD (static constant — defined once, never recreated) ─────────
export const JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Ubuntu Kreative Village',
  description: 'Off-grid sanctuaries powered by the sun.',
  telephone: '+254700000000',
  priceRange: '$$',
  image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Solar Powered', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Farm Breakfast', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Off Grid',       value: true },
  ],
} as const

// ── STAYS DATA (pure static — no closures, no refs) ──────────────────
export const stays: Stay[] = [
  // ══ FARM HOUSE — GROUND FLOOR ══
  {
    id: 'warbugia',
    name: 'Warbugia',
    category: 'Farm House',
    floor: 'Ground Floor',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 38,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Warbugia-farmhouse01.jpeg', '/images/Warbugia-farmhouse02.jpeg',
      '/images/Warbugia-farmhouse03.jpeg', '/images/Warbugia-farmhouse04.jpeg',
    ],
    features: ['Ground floor access', 'Garden view', 'Solar-powered', 'Farm proximity'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Named after the indigenous Warbugia tree, this ground-floor room wraps you in the gentle energy of the farm at its most accessible — close to the earth, close to the fire, close to the morning.',
    storyLine: 'Wake to birdsong carried on cool highland air. The Warbugia room places you at the living heart of the farm, where the day begins slowly and beautifully.',
    specs: {
      power: '2.5kW Solar Array / Battery Backup',
      water: 'Borehole Filtered / Solar Heated',
      connectivity: 'Weak (Digital Detox Zone)',
      structure: 'Recycled Timber & Earth-Rendered Walls',
      insulation: 'Natural Wool & Hemp',
      lighting: 'CRI 95+ Warm LED System',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'locust-bean',
    name: 'Locust Bean',
    category: 'Farm House',
    floor: 'Ground Floor',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 38,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Locust-Bean02.jpeg', '/images/Locust-Bean01.jpeg',
      '/images/Locust-Bean3.jpeg',  '/images/Locust-Bean5.jpeg',
    ],
    features: ['Courtyard access', 'Garden view', 'Farm breakfast option', 'Solar powered'],
    amenities: FARMHOUSE_AMENITIES,
    description: "The Locust Bean room draws its character from one of Africa's most generously giving trees — a room of warmth, substance, and quiet comfort at ground level.",
    storyLine: 'Sit with your morning coffee and watch the exact herbs that perfume your breakfast sway in the highland breeze below you.',
    specs: {
      power: '2.5kW Solar Array',
      water: 'Greywater Recycling System',
      connectivity: 'Minimal / Local Mesh Only',
      structure: 'Elevated Steel & Glass',
      cooling: 'Passive Cross-Ventilation',
      waste: 'Closed-Loop Bio-Digester',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'tamarind',
    name: 'Tamarind',
    category: 'Farm House',
    floor: 'Ground Floor',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 40,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Tamarind-farmhouse01.jpeg', '/images/Tamarind-farmhouse02.jpeg',
      '/images/Tamarind-farmhouse03.jpeg', '/images/Tamarind-farmhouse04.jpeg',
    ],
    features: ['Stone paths', 'Garden access', 'Solar-powered shower', 'Farm proximity'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Named for the ancient Tamarind, whose tangy fruit has nourished travellers for centuries — this room carries that same spirit of effortless hospitality and earthy elegance.',
    storyLine: 'The scent of the farm drifts through your window before you open your eyes. Silence here is a luxury you can taste.',
    specs: {
      power: 'Full Solar Autonomy',
      water: 'Rainwater Harvest Integration',
      connectivity: 'Zero Signal Area',
      structure: 'Stone Masonry',
      thermal: 'High Thermal Mass Storage',
      flooring: 'Polished Earthen Floors',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'acacia-penthouse',
    name: 'Acacia — Penthouse',
    category: 'Farm House',
    floor: 'Ground Floor',
    isPenthouse: true,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 55,
    rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 },
    status: 'available',
    featured: true,
    accent: 'var(--gold)',
    images: [
      '/images/Acacia-Penthouse01.jpeg', '/images/Acacia-Penthouse02.jpeg',
      '/images/Acacia-Penthouse03.jpeg', '/images/Acacia-Penthouse4.jpeg',
    ],
    features: ['Penthouse level', 'Expansive views', 'Premium finishes', 'Private terrace'],
    amenities: FARMHOUSE_AMENITIES,
    description: "The Acacia Penthouse is the crown of the ground-floor wing — elevated in every sense, named for Africa's most iconic tree and designed to match its stature.",
    storyLine: 'Three walls of glass dissolve the boundary between shelter and wilderness. You are inside the farm. The farm is inside you.',
    specs: {
      power: '4kW Solar Array / Dual Battery Backup',
      water: 'Spring-Fed / UV-Filtered',
      connectivity: 'Weak Mesh',
      structure: 'Steel & Structural Glass Curtain Wall',
      terrace: 'Private Elevated Terrace',
      flooring: 'Reclaimed Hardwood & Burnished Concrete',
    },
    bookingDetails: { minNights: 2, cleaningFee: 2000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 10 days before arrival', maxOccupancy: 2 },
  },
  // ══ FARM HOUSE — FIRST FLOOR ══
  {
    id: 'sycamore',
    name: 'Sycamore',
    category: 'Farm House',
    floor: 'First Floor',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 38,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Sycamore-farmhouse01.jpeg', '/images/Sycamore-farmhouse02.jpeg',
      '/images/Sycamore-farmhouse03.jpeg', '/images/Sycamore-farmhouse04.jpeg',
    ],
    features: ['First floor elevation', 'Canopy views', 'Cross-ventilation', 'Farm access'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'The Sycamore room sits a floor above the farm floor, offering elevated views across the property. Named for the fig-family giant whose branches shelter the oldest stories.',
    storyLine: 'The trees hold you here. Your window floats above the farm and the only alarm clock is the hadada ibis at dawn.',
    specs: {
      power: '3kW Solar Array',
      water: 'Rainwater Harvesting + Filtration',
      connectivity: 'Minimal Mesh',
      structure: 'Reclaimed Timber Post & Beam',
      elevation: 'First Floor — Elevated Vista',
      insulation: 'Cork Board & Rammed Earth Panels',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'mugumo',
    name: 'Mugumo',
    category: 'Farm House',
    floor: 'First Floor',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 38,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Mugumo-farmhouse1.jpeg', '/images/Mugumo-farmhouse2.jpeg',
      '/images/Mugumo-farmhouse3.jpeg', '/images/Mugumo-farmhouse4.jpeg',
    ],
    features: ['First floor views', 'Sacred tree namesake', 'Solar shower', 'Farm access'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Mugumo — the sacred fig, the tree of meetings. This room carries the gravity of that name: a space where you arrive carrying the weight of the week and leave lighter.',
    storyLine: 'From here, you can see the valley stretch and breathe. You watch weather arrive the way a hawk does — from above it all.',
    specs: {
      power: '3kW Solar with Battery Backup',
      water: 'Elevated Spring Tank / Solar Heated',
      connectivity: 'Weak Mesh',
      structure: 'Weathered Steel & Structural Glass',
      views: 'First Floor Valley & Farm Panorama',
      cooling: 'Passive Thermal — No Mechanical Cooling',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'ironwood-penthouse',
    name: 'Iron Wood — Penthouse',
    category: 'Farm House',
    floor: 'First Floor',
    isPenthouse: true,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 55,
    rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 },
    status: 'available',
    featured: true,
    accent: 'var(--gold)',
    images: [
      '/images/Iron-Wood-Penthouse01.jpeg', '/images/Iron-Wood-Penthouse02.jpeg',
      '/images/Iron-Wood-Penthouse03.jpeg', '/images/Iron-Wood-Penthouse04.jpeg',
    ],
    features: ['Penthouse level', 'First floor views', 'Premium finishes', 'Private deck'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Iron Wood — dense, enduring, and quietly magnificent. The First Floor Penthouse carries the same character: a room that takes no shortcuts and makes no apologies for its quality.',
    storyLine: 'Light enters this room the way water enters a vessel — slowly, completely, filling every corner. By midday, you are golden. By dusk, you understand why.',
    specs: {
      power: '4.5kW Full Solar / Smart Battery Grid',
      water: 'Borehole + Carbon Filter + UV Sterilizer',
      connectivity: 'Weak (Intentional)',
      structure: 'Rammed Earth & Copper-Clad Steel',
      floors: 'Underfloor Solar Radiant Heating',
      orientation: 'Solar-Aligned East-West Axis',
    },
    bookingDetails: { minNights: 2, cleaningFee: 2000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 10 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'baobab',
    name: 'Baobab',
    category: 'Farm House',
    floor: 'First Floor',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 40,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Baobab-farmhouse1.jpeg', '/images/Baobab-farmhouse3.jpeg',
      '/images/Baobab-farmhouse4.jpeg', '/images/Baobab-farmhouse2.jpeg',
    ],
    features: ['First floor', 'Earthen walls', 'Courtyard garden', 'Sunrise aspect'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'The Baobab room is named for the tree that stores water in its trunk for a thousand years. A room of patience, depth, and unmistakable presence — built to outlast any ordinary stay.',
    storyLine: 'The walls breathe. The floor holds warmth from three days ago. Here, shelter is not built — it is grown.',
    specs: {
      power: '3kW Solar Array',
      water: 'Rainwater Harvest + Reed Bed Filter',
      connectivity: 'Zero (Analogue Sanctuary)',
      structure: 'CSEB Compressed Earth Block + Living Roof',
      thermal: 'Passive Thermal Mass — no mechanical cooling',
      walls: '600mm Rammed Earth — R-value 3.4',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  // ══ FARM HOUSE — ROOFTOP ══
  {
    id: 'iroko',
    name: 'Iroko',
    category: 'Farm House',
    floor: 'Rooftop',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 42,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Inko-farmhouse.jpg',  '/images/Inko-farmhouse2.jpg',
      '/images/Inko-farmhouse3.jpg', '/images/Inko-farmhouse4.jpg',
    ],
    features: ['Rooftop level', 'Open sky views', 'Stargazing access', 'Farm & valley panorama'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Iroko sits at the top of the world — or at least the top of the Farm House. A rooftop room where the sky is never a backdrop but a ceiling you choose to live under.',
    storyLine: 'The stars here are not a feature. They are furniture. Lie back and count what the city hides from you every single night.',
    specs: {
      power: '3kW Solar Array / Whole-home Battery',
      water: 'Borehole + 3-stage Filtration',
      connectivity: 'Weak Mesh Available',
      structure: 'Timber Frame + Insulated Roof Panel',
      kitchen: 'Rooftop Terrace Access',
      outdoor: 'Open 360° Sky Terrace',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'buffalo-thorn',
    name: 'Buffalo Thorn',
    category: 'Farm House',
    floor: 'Rooftop',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 42,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Buffalo-Thorn01.jpeg', '/images/Buffalo-Thorn02.jpeg',
      '/images/Buffalo-Thorn3.jpeg',  '/images/Buffalo-Thorn04.jpeg',
    ],
    features: ['Rooftop level', 'Open sky views', 'Sunrise aspect', 'Star access'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Buffalo Thorn — revered across Africa for guiding the spirits of the departed home. This rooftop room is where you go to find your bearings, to return to yourself.',
    storyLine: 'The Kenyan highlands spread before you like a held breath. Your morning begins before the valley wakes — painted in amber and cool mist.',
    specs: {
      power: 'Hybrid Solar',
      water: 'Natural Spring Feed',
      connectivity: 'Weak',
      structure: 'Insulated Timber & Canvas Roof',
      ventilation: '360-degree Open Sky Access',
      elevation: 'Rooftop — Maximum Vista',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'neem-penthouse',
    name: 'Neem — Penthouse',
    category: 'Farm House',
    floor: 'Rooftop',
    isPenthouse: true,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 65,
    rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 },
    status: 'available',
    featured: true,
    accent: 'var(--gold)',
    images: [
      '/images/Neem-Penthouse011.jpeg', '/images/Neem-Penthouse022.jpeg',
      '/images/Neem-Penthouse03.jpeg',  '/images/Neem-Penthouse04.jpeg',
    ],
    features: ['Rooftop Penthouse', 'Unobstructed sky views', 'Premium finishes', 'Exclusive rooftop deck'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'The Neem Penthouse is the highest point of the Farm House — a private rooftop sanctuary named for the tree whose every part heals. This room leaves you better than it found you.',
    storyLine: 'You do not simply sleep here. You decompile. Layer by layer, the noise of your life below gives way to what the open sky has always known about you.',
    specs: {
      power: '6kW Solar Estate Grid / Tesla Powerwall',
      water: 'Private Spring + Full Reverse Osmosis',
      connectivity: 'Weak Mesh + Starlink on Request',
      structure: 'Architect-Designed Steel, Glass & Stone',
      deck: 'Exclusive Private Rooftop Terrace',
      security: 'Private Keycard Access',
    },
    bookingDetails: { minNights: 3, cleaningFee: 3000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 14 days before arrival', maxOccupancy: 2 },
  },
  // ══ POKOMO COTTAGES ══
  {
    id: 'marula',
    name: 'Marula',
    category: 'Pokomo Cottage',
    floor: 'Cottage',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 42,
    rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Marula-cottage1.jpeg', '/images/Marula-cottage2.jpeg',
      '/images/Marula-cottage3.jpeg', '/images/Marula-cottage4.jpeg',
    ],
    features: ['Private veranda', 'Garden view', 'Outdoor shower', 'Bonfire access'],
    amenities: POKOMO_AMENITIES,
    description: 'Named for the beloved Marula tree — whose fruit produces the famous Amarula liqueur — this Pokomo Cottage is all warmth, sweetness, and untamed African spirit.',
    storyLine: 'Wake to birdsong over dew-covered fields from your private cedar veranda. The first light finds you before the rest of the world does.',
    specs: {
      power: '2.5kW Solar Array / Tesla Powerwall',
      water: 'Borehole Filtered / Solar Heated',
      connectivity: 'Weak (Digital Detox Zone)',
      structure: 'Recycled Timber & Earth-Rendered Walls',
      insulation: 'Natural Wool & Hemp',
      lighting: 'CRI 95+ Warm LED System',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'shea',
    name: 'Shea',
    category: 'Pokomo Cottage',
    floor: 'Cottage',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 44,
    rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Shea-cottage1.jpeg', '/images/Shea-cottage2.jpeg',
      '/images/Shea-cottage3.jpeg', '/images/Shea-cottage4.jpeg',
    ],
    features: ['Crop field view', 'Outdoor shower', 'Sunrise deck', 'Bonfire access'],
    amenities: POKOMO_AMENITIES,
    description: 'The Shea cottage takes its name from the Shea tree — provider of life-giving butter across the Sahel. A cottage of deep nourishment: quiet, generous, and profoundly restorative.',
    storyLine: 'Sit with your morning coffee and watch the exact herbs that perfume your breakfast sway in the highland breeze below you.',
    specs: {
      power: '2.5kW Solar Array',
      water: 'Greywater Recycling System',
      connectivity: 'Minimal / Local Mesh Only',
      structure: 'Elevated Steel & Glass',
      cooling: 'Passive Cross-Ventilation',
      waste: 'Closed-Loop Bio-Digester',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'milk-wood',
    name: 'Milk Wood',
    category: 'Pokomo Cottage',
    floor: 'Cottage',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 40,
    rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Milk-Wood1.jpeg', '/images/Milk-Wood2.jpeg',
      '/images/Milk-Wood3.jpeg', '/images/Milk-Wood4.jpeg',
    ],
    features: ['Garden access', 'Outdoor shower', 'Stone paths', 'Bonfire access'],
    amenities: POKOMO_AMENITIES,
    description: 'Milk Wood — the quietest of the Pokomo Cottages, tucked into its own pocket of green. A name that conjures softness, abundance, and a kind of radical stillness.',
    storyLine: 'The scent of rosemary and lemon thyme drifts through your window before you open your eyes. Silence, here, is a luxury you can taste.',
    specs: {
      power: 'Full Solar Autonomy',
      water: 'Rainwater Harvest Integration',
      connectivity: 'Zero Signal Area',
      structure: 'Stone Masonry',
      thermal: 'High Thermal Mass Storage',
      flooring: 'Polished Earthen Floors',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'ebony',
    name: 'Ebony',
    category: 'Pokomo Cottage',
    floor: 'Cottage',
    isPenthouse: false,
    guests: 2, bedrooms: 1, bathrooms: 1, size: 46,
    rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Ebony-cottage2.jpeg', '/images/Ebony-cottage1.jpeg',
      '/images/Ebony-cottage3.jpeg', '/images/Ebony-cottage4.jpeg',
    ],
    features: ['Sunrise view', 'Highlands vista', 'Outdoor shower', 'Bonfire access'],
    amenities: POKOMO_AMENITIES,
    description: 'Ebony — dense, dark, and extraordinarily beautiful. This Pokomo Cottage is for those who understand that the most valuable things are never the loudest ones in the room.',
    storyLine: 'The Kenyan highlands spread before you like a held breath. Your morning begins before the valley wakes — painted in amber and cool mist.',
    specs: {
      power: 'Hybrid Solar',
      water: 'Natural Spring Feed',
      connectivity: 'Weak',
      structure: 'Bamboo & Canvas',
      ventilation: '360-degree Open Mesh',
      elevation: '2.5m Above Grade',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
]