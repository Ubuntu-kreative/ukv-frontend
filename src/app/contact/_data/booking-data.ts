// ─────────────────────────────────────────────────────────────
// src/app/contact/_data/booking-data.ts
// Pure static module — NO 'use client'
// All constants allocated once at build time
// ─────────────────────────────────────────────────────────────

export const MPESA_PAYBILL = '880100'
export const MPESA_ACCOUNT = '101497'

export type ServiceCategory =
  | 'accommodation'
  | 'dining'
  | 'spa'
  | 'farm'
  | 'events'
  | 'experiences'

export interface UKVService {
  id: string
  category: ServiceCategory
  name: string
  tagline: string
  description: string
  price: number
  priceNote: string
  duration?: string
  image: string
  tag: string
  unit: string
  requiresDate: boolean
  requiresGuests: boolean
  badge?: string
  color: string
  accent: string
  mealPlan?: 'bedOnly' | 'bedBreakfast' | 'halfBoard' | 'fullBoard'
}

export interface CalendarEvent {
  id: string
  day: number
  month: number   // 1-based
  year: number
  name: string
  type: 'public' | 'corporate' | 'seasonal' | 'private'
  description: string
  price: number
  spotsLeft?: number
  serviceId?: string
  color: string
}

export const SERVICE_CATEGORIES: {
  id: ServiceCategory; label: string; icon: string; color: string
}[] = [
  { id: 'accommodation', label: 'Stays',       icon: '⌂', color: 'var(--gold)' },
  { id: 'dining',       label: 'Dining',      icon: '🍽', color: '#C17D5C' },
  { id: 'spa',          label: 'Spa',         icon: '✦', color: '#F0A8B8' },
  { id: 'farm',         label: 'Farm',        icon: '🌾', color: '#7AB55C' },
  { id: 'events',       label: 'Events',      icon: '✨', color: '#E8A8D8' },
  { id: 'experiences',  label: 'Experiences', icon: '🗺', color: '#5DA5DA' },
]

export const UKV_SERVICES: UKVService[] = [
  // ── POKOMO COTTAGES ────────────────────────────────────────
  {
    id: 'cottage-marula', category: 'accommodation',
    name: 'Marula', tag: 'Pokomo Cottage', unit: '/ person / night',
    tagline: 'Wake to birdsong over dew-covered fields from your private cedar veranda.',
    description: 'A handcrafted Pokomo Cottage with views across the morning fields. King bed, outdoor cedar shower, private veranda. 2 guests max, 2-night minimum stay. Amenities: Gym, Swimming Pool, Conference Facilities, Farm Tours.',
    price: 6500, priceNote: 'from KES 6,500 / person / night (Bed & Breakfast)',
    image: '/images/Marula-cottage1.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'cottage-shea', category: 'accommodation',
    name: 'Shea', tag: 'Pokomo Cottage', unit: '/ person / night',
    tagline: 'Sit with your morning coffee and watch the exact herbs that perfume your breakfast sway in the highland breeze below you.',
    description: 'Cedar veranda overlooking the herb gardens. Wake to birdsong and the scent of rosemary. King bed with handwoven linens, outdoor copper shower, private garden access. 2 guests max, 2-night minimum. Amenities: Gym, Swimming Pool, Conference Facilities, Farm Tours.',
    price: 6500, priceNote: 'from KES 6,500 / person / night (Bed & Breakfast)',
    image: '/images/Shea-cottage1.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'cottage-milkwood', category: 'accommodation',
    name: 'Milk Wood', tag: 'Pokomo Cottage', unit: '/ person / night',
    tagline: 'The scent of rosemary and lemon thyme drifts through your window before you open your eyes. Silence, here, is a luxury you can taste.',
    description: 'Stone cottage with aromatic herb gardens just beyond the veranda. The scent of the farm fills your room at dawn. Copper soaking tub with highland water views, private fireplace, deep comfort. 2 guests max, 2-night minimum. Amenities: Gym, Swimming Pool, Conference Facilities, Farm Tours.',
    price: 6500, priceNote: 'from KES 6,500 / person / night (Bed & Breakfast)',
    image: '/images/Milk-Wood1.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'cottage-ebony', category: 'accommodation',
    name: 'Ebony', tag: 'Pokomo Cottage', unit: '/ person / night',
    tagline: 'The Kenyan highlands spread before you like a held breath. Your morning begins before the valley wakes — painted in amber and cool mist.',
    description: 'The signature Pokomo Cottage with unobstructed valley views. Floor-to-ceiling windows frame the escarpment. King bed, private deck, inside-outside living spaces. The morning light here is legendary. 2 guests max, 2-night minimum. Amenities: Gym, Swimming Pool, Conference Facilities, Farm Tours.',
    price: 6500, priceNote: 'from KES 6,500 / person / night (Bed & Breakfast)',
    image: '/images/Ebony-cottage2.jpeg',
    requiresDate: true, requiresGuests: true,
    badge: 'Signature', color: 'var(--gold)', accent: 'rgba(200,168,75,0.2)',
    mealPlan: 'bedBreakfast',
  },
  
  // ── FARM HOUSE ROOMS ───────────────────────────────────────
  {
    id: 'farmhouse-warbugia', category: 'accommodation',
    name: 'Warbugia', tag: 'Farm House Room', unit: '/ person / night',
    tagline: 'Wake to birdsong carried on cool highland air. The Warbugia room places you at the living heart of the farm, where the day begins slowly and beautifully.',
    description: 'The working farm surrounds you. Watch farm life unfold from your veranda. Cool stone rooms, handcrafted furnishings, direct access to farm paths. The most connected room to the land. 2 guests max, 2-night minimum stay.',
    price: 9000, priceNote: 'from KES 9,000 / person / night (Bed & Breakfast)',
    image: '/images/Warbugia-farmhouse01.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'farmhouse-locust-bean', category: 'accommodation',
    name: 'Locust Bean', tag: 'Farm House Room', unit: '/ person / night',
    tagline: 'Sit with your morning coffee and watch the exact herbs that perfume your breakfast sway in the highland breeze below you.',
    description: 'Named for the ancient tree that shades the room. Herb garden views, morning sun on the veranda, stone walls holding coolness. The herbs you smell are the ones on your breakfast plate. 2 guests max, 2-night minimum.',
    price: 9000, priceNote: 'from KES 9,000 / person / night (Bed & Breakfast)',
    image: '/images/Locust-Bean02.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'farmhouse-tamarind', category: 'accommodation',
    name: 'Tamarind', tag: 'Farm House Room', unit: '/ person / night',
    tagline: 'The scent of the farm drifts through your window before you open your eyes. Silence here is a luxury you can taste.',
    description: 'Cool, earthy, grounded. The tamarind tree outside holds the afternoon shade. Inside: timber-frame bed, woven textiles, stone shower with mountain water. The quietest room in the house. 2 guests max, 2-night minimum.',
    price: 9000, priceNote: 'from KES 9,000 / person / night (Bed & Breakfast)',
    image: '/images/Tamarind-farmhouse01.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'farmhouse-sycamore', category: 'accommodation',
    name: 'Sycamore', tag: 'Farm House Room', unit: '/ person / night',
    tagline: 'The trees hold you here. Your window floats above the farm and the only alarm clock is the hadada ibis at dawn.',
    description: 'Elevated rooms with canopy views. You sleep surrounded by acacia and wild fig. The birds here are loud and alive. Wood-frame bed, natural light, the smell of leaf and earth. 2 guests max, 2-night minimum.',
    price: 9000, priceNote: 'from KES 9,000 / person / night (Bed & Breakfast)',
    image: '/images/Sycamore-farmhouse01.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'farmhouse-mugumo', category: 'accommodation',
    name: 'Mugumo', tag: 'Farm House Room', unit: '/ person / night',
    tagline: 'From here, you can see the valley stretch and breathe. You watch weather arrive the way a hawk does — from above it all.',
    description: 'Upper terrace with horizon views. The sacred Mugumo fig inspired this room\'s name. Expansive windows, daybed for afternoon reading, the valley spreads below. You see weather systems approach from miles away. 2 guests max, 2-night minimum.',
    price: 9000, priceNote: 'from KES 9,000 / person / night (Bed & Breakfast)',
    image: '/images/Mugumo-farmhouse1.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'farmhouse-baobab', category: 'accommodation',
    name: 'Baobab', tag: 'Farm House Room', unit: '/ person / night',
    tagline: 'The walls breathe. The floor holds warmth from three days ago. Here, shelter is not built — it is grown.',
    description: 'Ancient earth building techniques. Thick walls regulate temperature naturally. No air conditioning — just the coolness of stone and mud. A room that feels alive. Natural light, handmade fixtures, the smell of earth. 2 guests max, 2-night minimum.',
    price: 9000, priceNote: 'from KES 9,000 / person / night (Bed & Breakfast)',
    image: '/images/Baobab-farmhouse1.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'farmhouse-iroko', category: 'accommodation',
    name: 'Iroko', tag: 'Farm House Room', unit: '/ person / night',
    tagline: 'The stars here are not a feature. They are furniture. Lie back and count what the city hides from you every single night.',
    description: 'Named for the sacred hardwood tree. Open-air bedroom design with retractable roof for star-gazing. The Milky Way fills your night view. Stone bed platform, firepit outside, the constellation compass above. 2 guests max, 2-night minimum.',
    price: 9000, priceNote: 'from KES 9,000 / person / night (Bed & Breakfast)',
    image: '/images/Iroko-farmhouse.jpg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'farmhouse-buffalo-thorn', category: 'accommodation',
    name: 'Buffalo Thorn', tag: 'Farm House Room', unit: '/ person / night',
    tagline: 'The Kenyan highlands spread before you like a held breath. Your morning begins before the valley wakes — painted in amber and cool mist.',
    description: 'The strongest, most sheltered room. Named for the acacia that protects it from wind. Thick timber frame, insulated walls, private courtyard. Winter sanctuary. 2 guests max, 2-night minimum stay.',
    price: 9000, priceNote: 'from KES 9,000 / person / night (Bed & Breakfast)',
    image: '/images/Buffalo-Thorn01.jpeg',
    requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  },

  // ── PENTHOUSES ─────────────────────────────────────────────
  {
    id: 'penthouse-acacia', category: 'accommodation',
    name: 'Acacia — Penthouse', tag: 'Penthouse', unit: '/ person / night',
    tagline: 'Three walls of glass dissolve the boundary between shelter and wilderness. You are inside the farm. The farm is inside you.',
    description: 'Three walls of frameless glass open onto the valley. No barrier between you and the land. Master bedroom, living area, private infinity pool overlooking the escarpment. The most immersive stay. 2 guests max, 2-night minimum.',
    price: 10500, priceNote: 'from KES 10,500 / person / night (Bed & Breakfast)',
    image: '/images/Acacia-Penthouse01.jpeg',
    requiresDate: true, requiresGuests: true,
    badge: 'Luxury', color: 'var(--gold)', accent: 'rgba(200,168,75,0.2)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'penthouse-ironwood', category: 'accommodation',
    name: 'Iron Wood — Penthouse', tag: 'Penthouse', unit: '/ person / night',
    tagline: 'Light enters this room the way water enters a vessel — slowly, completely, filling every corner. By midday, you are golden. By dusk, you understand why.',
    description: 'Architectural marvel with strategic skylights and clerestory windows. The light changes the room every hour. Open-plan living, master suite, sauna and spa bath. Golden light therapy by design. 2 guests max, 2-night minimum.',
    price: 10500, priceNote: 'from KES 10,500 / person / night (Bed & Breakfast)',
    image: '/images/Iron-Wood-Penthouse01.jpeg',
    requiresDate: true, requiresGuests: true,
    badge: 'Luxury', color: 'var(--gold)', accent: 'rgba(200,168,75,0.2)',
    mealPlan: 'bedBreakfast',
  },
  {
    id: 'penthouse-neem', category: 'accommodation',
    name: 'Neem — Penthouse', tag: 'Penthouse', unit: '/ person / night',
    tagline: 'You do not simply sleep here. You decompile. Layer by layer, the noise of your life below gives way to what the open sky has always known about you.',
    description: 'The ultimate retreat. Fully integrated with nature — living walls, open-air bedroom, infinity edge to the valley. Wellness-focused design. Meditation pavilion, cold plunge, dry sauna. Deep restoration space. 2 guests max, 3-night minimum.',
    price: 10500, priceNote: 'from KES 10,500 / person / night (Bed & Breakfast)',
    image: '/images/Neem-Penthouse011.jpeg',
    requiresDate: true, requiresGuests: true,
    badge: 'Ultimate Retreat', color: 'var(--gold)', accent: 'rgba(200,168,75,0.2)',
    mealPlan: 'bedBreakfast',
  },

  // ── SPA SERVICES — AROHAMAI SPA ────────────────────────────
  // Bath & Heat Therapies
  {
    id: 'spa-mud-bath', category: 'spa',
    name: 'Mud Bath', tag: 'Bath Therapy', unit: '/ person',
    tagline: 'Mineral-rich volcanic clay from the Great Rift Valley purifies and renews.',
    description: 'Mineral-rich volcanic clay from the Great Rift Valley. Purifies pores, relieves deep muscle tension, renews from the outside in. Full-body application with herbal steam finish.',
    price: 3500, priceNote: 'KES 3,500', duration: '45 min',
    image: '/images/Mud-Bath1.jpeg',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-salt-bath', category: 'spa',
    name: 'Salt Bath', tag: 'Bath Therapy', unit: '/ person',
    tagline: 'Therapeutic soak with natural minerals and botanicals.',
    description: 'Therapeutic salt soak infused with natural minerals and botanicals. Cleanses, softens and restores the skin while relaxing the body. Authentic mineral therapy.',
    price: 2500, priceNote: 'KES 2,500', duration: '40 min',
    image: '/images/Salt-Bath.jpeg',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-smoked-bath', category: 'spa',
    name: 'Smoked Bath', tag: 'Bath Therapy', unit: '/ person',
    tagline: 'Ancient African bathing tradition using aromatic smoke and herbal infusions.',
    description: 'An ancient African bathing tradition using aromatic smoke and herbal infusions. Deeply purifying and grounding for body and spirit. Ceremonial preparation included.',
    price: 3000, priceNote: 'KES 3,000', duration: '45 min',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-ice-bath', category: 'spa',
    name: 'Ice Bath', tag: 'Cold Therapy', unit: '/ person',
    tagline: 'Cold water immersion for muscle recovery and cellular revitalisation.',
    description: 'Cold water immersion therapy for muscle recovery, reduced inflammation, and cellular revitalisation. Guided breathing and warm recovery wrap included.',
    price: 2500, priceNote: 'KES 2,500', duration: '30 min',
    image: '/images/Ice-Bath.jpeg',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-moroccan-bath', category: 'spa',
    name: 'Moroccan Bath', tag: 'Luxury Ritual', unit: '/ person',
    tagline: 'Traditional hammam with black soap exfoliation and argan oil ritual.',
    description: 'Traditional hammam with black soap exfoliation, kessa mitt scrub, argan oil ritual, and rose water finish on heated marble. Full sensory experience. Premier spa service.',
    price: 4500, priceNote: 'KES 4,500', duration: '75 min',
    image: '/images/Moroccan-Bath1.jpeg',
    requiresDate: true, requiresGuests: false,
    badge: 'Signature', color: '#F0A8B8', accent: 'rgba(240,168,184,0.2)',
  },
  {
    id: 'spa-sauna-session', category: 'spa',
    name: 'Sauna Session', tag: 'Heat Therapy', unit: '/ person',
    tagline: 'Traditional Finnish dry sauna with birch steam rituals.',
    description: 'Traditional Finnish dry sauna with birch steam rituals, cold recovery periods and deep cellular detox. Available daily. Wellness restoration focus.',
    price: 2000, priceNote: 'KES 2,000', duration: '60 min',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-herbal-soak', category: 'spa',
    name: 'Herbal Soak', tag: 'Restorative Bath', unit: '/ person',
    tagline: 'Herb-infused warm water with locally sourced botanicals.',
    description: 'Deeply restorative soak in herb-infused warm water. Locally sourced botanicals ease tension, nourish the skin and calm the mind. Meditative experience.',
    price: 3000, priceNote: 'KES 3,000', duration: '50 min',
    image: 'https://images.unsplash.com/photo-1600334089393-b70033073432?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },

  // Massage & Body Therapies
  {
    id: 'spa-ubuntu-signature', category: 'spa',
    name: 'Ubuntu Signature Therapy', tag: 'Massage', unit: '/ person',
    tagline: 'Full-body therapeutic massage with herbal oils.',
    description: 'The signature Ubuntu massage. Full-body therapeutic treatment using cold-pressed herbal oils. Combines deep tissue, myofascial release, and energy work. 90 minutes of complete restoration.',
    price: 5500, priceNote: 'KES 5,500', duration: '90 min',
    image: '/images/Ubuntu-Signature-Therapy.jpeg',
    requiresDate: true, requiresGuests: false,
    badge: 'Signature', color: '#F0A8B8', accent: 'rgba(240,168,184,0.2)',
  },
  {
    id: 'spa-aromatherapy-massage', category: 'spa',
    name: 'Aromatherapy Massage', tag: 'Massage', unit: '/ person',
    tagline: 'Massage with essential oils for relaxation and emotional balance.',
    description: 'Therapeutic massage using essential oils. Promotes relaxation, emotional balance, and circulation. Full-body treatment with organic, ethically-sourced oils.',
    price: 4500, priceNote: 'KES 4,500', duration: '75 min',
    image: '/images/Aromatherapy-Massage.jpeg',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-deep-tissue', category: 'spa',
    name: 'Deep Tissue Massage', tag: 'Massage', unit: '/ person',
    tagline: 'Intensive muscle release for tension and recovery.',
    description: 'Deep tissue massage targeting muscle tension, knots, and chronic pain. Therapeutic pressure with focused attention on problem areas. Recovery and restoration focus.',
    price: 5000, priceNote: 'KES 5,000', duration: '80 min',
    image: 'https://images.unsplash.com/photo-1574482620811-1aa16ffe3c82?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-lymphatic-drainage', category: 'spa',
    name: 'Lymphatic Drainage', tag: 'Massage', unit: '/ person',
    tagline: 'Gentle massage to support natural detoxification.',
    description: 'Gentle lymphatic massage to support the body\'s natural detoxification and immune function. Light pressure, therapeutic movement. Recovery and wellness enhancement.',
    price: 4500, priceNote: 'KES 4,500', duration: '70 min',
    image: 'https://images.unsplash.com/photo-1555571334-ad2c2b408cf5?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-swedish-massage', category: 'spa',
    name: 'Swedish Massage', tag: 'Massage', unit: '/ person',
    tagline: 'Classic relaxation massage with flowing movements.',
    description: 'Classic Swedish massage with smooth, flowing movements. Promotes circulation, relaxation, and overall wellness. Gentle to medium pressure, full-body treatment.',
    price: 4000, priceNote: 'KES 4,000', duration: '75 min',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a5?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-shiatsu', category: 'spa',
    name: 'Shiatsu', tag: 'Massage', unit: '/ person',
    tagline: 'Japanese pressure-point massage for energy balance.',
    description: 'Japanese shiatsu massage focusing on energy meridians and pressure points. Clothed treatment, grounding and balancing. Traditional wellness practice.',
    price: 4500, priceNote: 'KES 4,500', duration: '75 min',
    image: 'https://images.unsplash.com/photo-1591785219945-b3f6e4e5b1b2?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-bamboo-stick', category: 'spa',
    name: 'Bamboo Stick Massage', tag: 'Massage', unit: '/ person',
    tagline: 'Asian-inspired massage using warm bamboo tools.',
    description: 'Asian-inspired massage using warm bamboo tools. Releases muscle tension, improves circulation, deeply relaxing. Unique sensory experience.',
    price: 4500, priceNote: 'KES 4,500', duration: '75 min',
    image: 'https://images.unsplash.com/photo-1582293488526-0903b49d2f95?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-reflexology', category: 'spa',
    name: 'Reflexology', tag: 'Massage', unit: '/ person',
    tagline: 'Foot and hand pressure therapy for holistic healing.',
    description: 'Reflexology focusing on foot and hand pressure points. Promotes whole-body healing, relaxation, and wellness. Ancient therapeutic practice.',
    price: 3500, priceNote: 'KES 3,500', duration: '60 min',
    image: 'https://images.unsplash.com/photo-1570545061562-5f3dffa03451?q=80&w=800',
    requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },

  // Signature Packages
  {
    id: 'spa-half-day-retreat', category: 'spa',
    name: 'Half Day Retreat', tag: 'Wellness Package', unit: '/ person',
    tagline: 'Herbal tea welcome, bath therapy, signature massage, facial and wellness meal. 4 hours of restoration.',
    description: 'Herbal tea welcome, bath therapy, signature massage, facial and a healthy wellness meal. 4 hours of complete restoration and rejuvenation. The perfect introduction to Arohamai.',
    price: 18000, priceNote: 'KES 18,000', duration: '4 hours',
    image: '/images/Jacuzzi.jpeg',
    requiresDate: true, requiresGuests: false,
    badge: 'Package', color: '#F0A8B8', accent: 'rgba(240,168,184,0.2)',
  },
  {
    id: 'spa-full-day-escape', category: 'spa',
    name: 'Full Day Escape', tag: 'Wellness Package', unit: '/ person',
    tagline: 'Complete day access — personalized therapy, body treatment, facial, lunch and full relaxation lounge.',
    description: 'Complete day access — personalized therapy, body treatment, facial, lunch and full relaxation lounge. The complete Arohamai experience. Sunrise to sunset wellness journey.',
    price: 30000, priceNote: 'KES 30,000', duration: 'Full day',
    image: '/images/Full-Day-Escape.jpeg',
    requiresDate: true, requiresGuests: false,
    badge: 'Premium', color: '#F0A8B8', accent: 'rgba(240,168,184,0.2)',
  },
  {
    id: 'spa-couples-sanctuary', category: 'spa',
    name: 'Couples Sanctuary', tag: 'Wellness Package', unit: '/ couple',
    tagline: 'Side-by-side rituals for two. Customise your shared healing journey.',
    description: 'Side-by-side rituals for two. Customise your shared healing journey with matching therapies, herbal soaks and private sanctuary time. Bonding and wellness together.',
    price: 10000, priceNote: 'from KES 10,000 / couple', duration: '3–4 hours',
    image: '/images/Couples-Sanctuary.jpeg',
    requiresDate: true, requiresGuests: false,
    badge: 'Couples', color: '#F0A8B8', accent: 'rgba(240,168,184,0.2)',
  },

  // ── DINING & CULINARY ──────────────────────────────────────
  {
    id: 'dining-harvest-dinner', category: 'dining',
    name: 'Harvest Dinner', tag: 'Farm-to-Table', unit: '/ person',
    tagline: 'Chef\'s monthly celebration of the seasonal harvest.',
    description: 'Monthly farm-to-table dinner celebrating the seasonal harvest. Multi-course meal prepared with produce from the farm. Live music, wine pairings, connection to the land.',
    price: 7500, priceNote: 'KES 7,500 / person', duration: '3 hours',
    image: '/images/Harvest-Dinner.jpeg',
    requiresDate: true, requiresGuests: true,
    badge: 'Monthly', color: '#C17D5C', accent: 'rgba(193,125,92,0.15)',
  },
  {
    id: 'dining-breakfast-spread', category: 'dining',
    name: 'Full Breakfast Spread', tag: 'Morning Meal', unit: '/ person',
    tagline: 'Organic eggs, fresh-baked bread, farm herbs and local honey.',
    description: 'Organic eggs, fresh-baked bread, farm herbs and local honey. Fruit from the orchard. Farm-fresh butter and preserves. Experience the morning the way it\'s meant to be.',
    price: 2200, priceNote: 'KES 2,200 / person', duration: '1 hour',
    image: '/images/Full-Breakfast-Spread.jpeg',
    requiresDate: false, requiresGuests: true,
    color: '#C17D5C', accent: 'rgba(193,125,92,0.15)',
  },
  {
    id: 'dining-lunch-platter', category: 'dining',
    name: 'Lunch Platter', tag: 'Midday Meal', unit: '/ person',
    tagline: 'Seasonal vegetables, grains, and proteins from the farm kitchen.',
    description: 'Seasonal vegetables, grains, and proteins from the farm kitchen. Salad with farm herbs, freshly pressed juices, artisan bread. Light yet satisfying.',
    price: 2800, priceNote: 'KES 2,800 / person', duration: '1.5 hours',
    image: '/images/Lunch-Platter.jpeg',
    requiresDate: false, requiresGuests: true,
    color: '#C17D5C', accent: 'rgba(193,125,92,0.15)',
  },
  {
    id: 'dining-dinner-menu', category: 'dining',
    name: 'Dinner Menu', tag: 'Evening Meal', unit: '/ person',
    tagline: 'Three-course dinner with local ingredients and creative preparation.',
    description: 'Three-course dinner highlighting local ingredients and creative preparation. Appetizer, main course with farm vegetables and proteins, dessert with local fruits and honey.',
    price: 4500, priceNote: 'KES 4,500 / person', duration: '2 hours',
    image: '/images/Dinner-Menu.jpeg',
    requiresDate: false, requiresGuests: true,
    color: '#C17D5C', accent: 'rgba(193,125,92,0.15)',
  },
  {
    id: 'dining-wine-pairing', category: 'dining',
    name: 'Wine & Cheese Pairing', tag: 'Experience', unit: '/ person',
    tagline: 'Carefully selected wines paired with artisan cheeses and charcuterie.',
    description: 'Curated wine selection paired with artisan cheeses and charcuterie. Educational tasting notes, discussion of flavor profiles, connection to terroir and craft.',
    price: 3800, priceNote: 'KES 3,800 / person', duration: '1.5 hours',
    image: '/images/Wine-Cheese-Pairing.jpeg',
    requiresDate: false, requiresGuests: true,
    color: '#C17D5C', accent: 'rgba(193,125,92,0.15)',
  },
  {
    id: 'dining-farm-brunch', category: 'dining',
    name: 'Farm Brunch', tag: 'Celebration Meal', unit: '/ person',
    tagline: 'Late morning celebration featuring fresh-pressed juices, quiches and pastries.',
    description: 'Late morning celebration featuring fresh-pressed juices, quiches and pastries baked fresh. Farm salads, bread still warm from the oven. Coffee service.',
    price: 2500, priceNote: 'KES 2,500 / person', duration: '2 hours',
    image: '/images/Farm-Brunch.jpeg',
    requiresDate: false, requiresGuests: true,
    color: '#C17D5C', accent: 'rgba(193,125,92,0.15)',
  },
  {
    id: 'dining-picnic-basket', category: 'dining',
    name: 'Farm Picnic Basket', tag: 'Field Experience', unit: '/ couple',
    tagline: 'Gourmet provisions for a farm picnic with wine and conversation.',
    description: 'Gourmet provisions prepared for a farm picnic. Charcuterie, cheeses, bread, fruit, chocolate, wine. Pack a blanket and find your spot on the land.',
    price: 6000, priceNote: 'KES 6,000 / couple', duration: 'Self-paced',
    image: '/images/Farm-Picnic-Basket.jpeg',
    requiresDate: false, requiresGuests: true,
    color: '#C17D5C', accent: 'rgba(193,125,92,0.15)',
  },
  {
    id: 'dining-cooking-class', category: 'dining',
    name: 'Farm-to-Table Cooking Class', tag: 'Workshop', unit: '/ person',
    tagline: 'Learn to cook with seasonal farm ingredients under the chef\'s guidance.',
    description: 'Learn to cook with seasonal farm ingredients under the head chef\'s guidance. Select your ingredients from the farm, prepare a meal together, enjoy what you\'ve created.',
    price: 5500, priceNote: 'KES 5,500 / person', duration: '2.5 hours',
    image: '/images/Cooking-Class.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#C17D5C', accent: 'rgba(193,125,92,0.15)',
  },

  // ── FARM EXPERIENCES ───────────────────────────────────────
  {
    id: 'farm-sunrise-walk', category: 'farm',
    name: 'Sunrise Farm Walk', tag: 'Morning Tour', unit: '/ person',
    tagline: 'Guided walk through the working farm as the land awakens.',
    description: 'Guided walk through the working farm as the land awakens. Bird watching, learn about crop rotation, herb identification, the rhythm of farm life. Led by an experienced guide.',
    price: 1500, priceNote: 'KES 1,500 / person', duration: '2 hours',
    image: '/images/Sunrise-Farm-Walk.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#7AB55C', accent: 'rgba(122,181,92,0.15)',
  },
  {
    id: 'farm-afternoon-tour', category: 'farm',
    name: 'Afternoon Farm Tour', tag: 'Guided Experience', unit: '/ person',
    tagline: 'Learn the secrets of sustainable farming and land stewardship.',
    description: 'Guided afternoon tour. Learn about composting, seed saving, pollinator gardens, water harvesting and soil health. See the farm in its working rhythm. Q&A with the farm team.',
    price: 2000, priceNote: 'KES 2,000 / person', duration: '2.5 hours',
    image: '/images/Afternoon-Farm-Tour.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#7AB55C', accent: 'rgba(122,181,92,0.15)',
  },
  {
    id: 'farm-herb-harvest', category: 'farm',
    name: 'Herb Harvest Workshop', tag: 'Hands-On Activity', unit: '/ person',
    tagline: 'Pick and process herbs for personal use or tea blending.',
    description: 'Hands-on herb picking directly from the farm gardens. Learn which herbs are ready, proper harvesting technique, drying and storage. Take home your collected herbs as a gift.',
    price: 2500, priceNote: 'KES 2,500 / person', duration: '1.5 hours',
    image: '/images/Herb-Harvest-Workshop.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#7AB55C', accent: 'rgba(122,181,92,0.15)',
  },
  {
    id: 'farm-medicinal-plants', category: 'farm',
    name: 'Medicinal Plants Walk', tag: 'Educational Tour', unit: '/ person',
    tagline: 'Discover the healing plants growing on the farm and their traditional uses.',
    description: 'Guided discovery of medicinal plants. Learn traditional and modern uses, preparation methods, conservation. Expert-led knowledge sharing rooted in both ancient wisdom and science.',
    price: 1800, priceNote: 'KES 1,800 / person', duration: '2 hours',
    image: '/images/Medicinal-Plants-Walk.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#7AB55C', accent: 'rgba(122,181,92,0.15)',
  },
  {
    id: 'farm-beekeeping-visit', category: 'farm',
    name: 'Beekeeping Experience', tag: 'Specialty Tour', unit: '/ person',
    tagline: 'Learn about honeybees, hive management, and taste fresh honey.',
    description: 'Visit the farm apiaries. Learn about bee behavior, hive management, seasonal rhythms and their role in the ecosystem. Taste freshly harvested honey, understand pollination.',
    price: 3000, priceNote: 'KES 3,000 / person', duration: '2 hours',
    image: '/images/Beekeeping-Experience.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#7AB55C', accent: 'rgba(122,181,92,0.15)',
  },
  {
    id: 'farm-soil-education', category: 'farm',
    name: 'Soil & Ecosystem Workshop', tag: 'Deep Dive', unit: '/ person',
    tagline: 'Explore soil health, microbiology and regenerative farming practices.',
    description: 'Workshop on soil health, microbiology, and regenerative farming. Hands-on soil testing, microscope exploration, composting demonstration. Understand the living earth beneath.',
    price: 2200, priceNote: 'KES 2,200 / person', duration: '2.5 hours',
    image: '/images/Soil-Ecosystem-Workshop.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#7AB55C', accent: 'rgba(122,181,92,0.15)',
  },

  // ── EVENTS ────────────────────────────────────────────────
  {
    id: 'events-wedding', category: 'events',
    name: 'Wedding Ceremony & Reception', tag: 'Private Event', unit: '/ event',
    tagline: 'Celebrate your union on the land, surrounded by nature and loved ones.',
    description: 'Host your wedding ceremony and reception at Ubuntu Kreative Village. Outdoor pavilion, farm backdrop, custom catering, spa pre-wedding packages available. Customise every detail.',
    price: 0, priceNote: 'Enquire for pricing', 
    image: '/images/Wedding-Ceremony.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#E8A8D8', accent: 'rgba(232,168,216,0.15)',
  },
  {
    id: 'events-corporate-retreat', category: 'events',
    name: 'Corporate Retreat & Team Building', tag: 'Group Event', unit: '/ event',
    tagline: 'Rejuvenate your team with farm experiences, spa treatments and farm-to-table dining.',
    description: 'Host a corporate retreat combining team building, spa wellness, farm experiences and gourmet dining. Off-grid setting encourages genuine connection. Flexible itinerary design.',
    price: 0, priceNote: 'Enquire for pricing',
    image: '/images/Corporate-Retreat.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#E8A8D8', accent: 'rgba(232,168,216,0.15)',
  },
  {
    id: 'events-creative-residency', category: 'events',
    name: 'Creative Residency Program', tag: 'Artist Program', unit: '/ month',
    tagline: 'Immersive stay for writers, artists and creators seeking deep inspiration and focus.',
    description: 'Multi-week residency program for writers, artists, designers and creators. Private accommodation, meals provided, studio space, solitude and community with other creatives.',
    price: 0, priceNote: 'Enquire for pricing',
    image: '/images/Creative-Residency.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#E8A8D8', accent: 'rgba(232,168,216,0.15)',
  },
  {
    id: 'events-family-reunion', category: 'events',
    name: 'Family Reunion Getaway', tag: 'Group Event', unit: '/ event',
    tagline: 'Multi-generational gathering space with activities and meals for all ages.',
    description: 'Host a family reunion with activities for all ages. Mix of accommodations, group meals, farm tours, games, bonfire evenings. Space to reconnect as a family.',
    price: 0, priceNote: 'Enquire for pricing',
    image: '/images/Family-Reunion.jpeg',
    requiresDate: true, requiresGuests: true,
    color: '#E8A8D8', accent: 'rgba(232,168,216,0.15)',
  },
  {
    id: 'events-anniversary-celebration', category: 'events',
    name: 'Anniversary Celebration Package', tag: 'Romantic Event', unit: '/ couple',
    tagline: 'Customised romantic package with spa treatments, private dining and farm experiences.',
    description: 'Customised romantic anniversary celebration. Private accommodation, spa treatments, farm sunset walk, farm-to-table dinner, morning champagne service. Pure romance.',
    price: 15000, priceNote: 'from KES 15,000 / couple',
    image: 'https://images.unsplash.com/photo-1537581013640-a6264e90e2aa?q=80&w=800',
    requiresDate: true, requiresGuests: true,
    color: '#E8A8D8', accent: 'rgba(232,168,216,0.2)',
  },

  // ── EXPERIENCES ────────────────────────────────────────────
  {
    id: 'experiences-guided-nature-walk', category: 'experiences',
    name: 'Guided Nature Walk', tag: 'Outdoor Experience', unit: '/ person',
    tagline: 'Explore the Kenyan highlands with an expert naturalist guide.',
    description: 'Explore the Kenyan highlands with expert guides. Bird watching, wildlife spotting, ecology education. Half-day or full-day options. Binoculars provided, water and snacks included.',
    price: 2000, priceNote: 'from KES 2,000 / person', duration: '2–4 hours',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=800',
    requiresDate: true, requiresGuests: true,
    color: '#5DA5DA', accent: 'rgba(93,165,218,0.15)',
  },
  {
    id: 'experiences-gallery-tour', category: 'experiences',
    name: 'Private Gallery Tour', tag: 'Art Experience', unit: '/ group',
    tagline: 'Intimate guided experience through original artworks and local artists.',
    description: 'Private guided tour of the on-site gallery. Meet with featured artists, discuss creative processes, learn about the work. Small groups only. Refreshments provided.',
    price: 3500, priceNote: 'KES 3,500 / group (up to 6 people)', duration: '1.5 hours',
    image: 'https://images.unsplash.com/photo-1578926078328-123456789012?q=80&w=800',
    requiresDate: true, requiresGuests: true,
    color: '#5DA5DA', accent: 'rgba(93,165,218,0.15)',
  },
  {
    id: 'experiences-stargazing', category: 'experiences',
    name: 'Stargazing & Astronomy Night', tag: 'Nighttime Experience', unit: '/ person',
    tagline: 'Explore the night sky with telescope and expert astronomer guide.',
    description: 'Evening stargazing with telescope and expert guide. Learn constellations, locate planets, understand the cosmos. Off-grid setting means pristine skies. Hot chocolate provided.',
    price: 2500, priceNote: 'KES 2,500 / person', duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1503454537688-e6baef3467b1?q=80&w=800',
    requiresDate: true, requiresGuests: true,
    color: '#5DA5DA', accent: 'rgba(93,165,218,0.15)',
  },
  {
    id: 'experiences-photography-walk', category: 'experiences',
    name: 'Photography Walk & Workshop', tag: 'Creative Experience', unit: '/ person',
    tagline: 'Guided photography walk capturing the beauty of the landscape and farm life.',
    description: 'Guided photography walk with composition tips and light discussion. Capture the beauty of the land, farm life and nature. Suited for all camera types. Digital guide provided.',
    price: 3000, priceNote: 'KES 3,000 / person', duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?q=80&w=800',
    requiresDate: true, requiresGuests: true,
    color: '#5DA5DA', accent: 'rgba(93,165,218,0.15)',
  },
]

// ── CALENDAR EVENTS ─────────────────────────────────────────
// Using current month (June 2026) and next month (July 2026)
const now = new Date()
const thisMonth = now.getMonth() + 1  // 1-based month (June = 6)
const thisYear = now.getFullYear()     // 2026
const nextMonth = thisMonth === 12 ? 1 : thisMonth + 1
const nextYear = thisMonth === 12 ? thisYear + 1 : thisYear

export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ce-1',  day: 3,  month: thisMonth, year: thisYear, name: 'Arohamai Wellness Morning',     type: 'public',    description: 'Spa opening day celebration.',                    price: 3500,  spotsLeft: 8,                  color: '#F0A8B8'     },
  { id: 'ce-2',  day: 7,  month: thisMonth, year: thisYear, name: 'Full Moon Spa Night',            type: 'seasonal',  description: 'Evening spa rituals under the moon.',             price: 5000,  spotsLeft: 6,  serviceId: 'spa-moroccan-bath', color: '#F0A8B8'     },
  { id: 'ce-3',  day: 12, month: thisMonth, year: thisYear, name: 'Couples Spa Retreat',           type: 'public',    description: 'Paired massage and bath rituals.',                price: 18000, spotsLeft: 4,  serviceId: 'spa-couples-sanctuary', color: '#F0A8B8'     },
  { id: 'ce-4',  day: 15, month: thisMonth, year: thisYear, name: 'Half Day Wellness Package',    type: 'public',    description: 'Intro to Arohamai healing.',                      price: 18000, spotsLeft: 10, serviceId: 'spa-half-day-retreat', color: '#F0A8B8'     },
  { id: 'ce-5',  day: 21, month: thisMonth, year: thisYear, name: 'Silent Retreat Begin',          type: 'seasonal',  description: '3-day wellness silence program.',                 price: 45000, spotsLeft: 3,                  color: '#F0A8B8'     },
  { id: 'ce-6',  day: 28, month: thisMonth, year: thisYear, name: 'Full Day Spa Escape',           type: 'public',    description: 'Complete Arohamai experience.',                   price: 30000, spotsLeft: 5,  serviceId: 'spa-full-day-escape', color: '#F0A8B8'     },
  { id: 'ce-7',  day: 5,  month: nextMonth, year: nextYear, name: 'Signature Massage Workshop',    type: 'public',    description: 'Learn therapeutic massage techniques.',           price: 4500,  spotsLeft: 12, serviceId: 'spa-ubuntu-signature', color: '#F0A8B8'     },
  { id: 'ce-8',  day: 10, month: nextMonth, year: nextYear, name: 'Full Moon Ceremony',            type: 'seasonal',  description: 'Evening spa ritual and dinner.',                  price: 6500,  spotsLeft: 8,                  color: '#F0A8B8'     },
  { id: 'ce-9',  day: 18, month: nextMonth, year: nextYear, name: 'Detox & Wellness Week',         type: 'public',    description: 'Full week spa and farm program.',                 price: 180000,spotsLeft: 2,                  color: '#F0A8B8'     },
  { id: 'ce-10', day: 25, month: nextMonth, year: nextYear, name: 'Moroccan Bath Evening',         type: 'public',    description: 'Luxury hammam experience.',                       price: 4500,  spotsLeft: 10, serviceId: 'spa-moroccan-bath', color: '#F0A8B8'     },
]

export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']