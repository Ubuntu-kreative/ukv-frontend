// ─────────────────────────────────────────────────────────────
// src/app/book/_data/booking-data.ts
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
  { id: 'dining',        label: 'Dining',      icon: '◆', color: '#D4906A'      },
  { id: 'spa',           label: 'Spa',         icon: '✦', color: '#F0A8B8'      },
  { id: 'farm',          label: 'Farm',        icon: '⬡', color: 'var(--neon)'  },
  { id: 'events',        label: 'Events',      icon: '⬢', color: '#B8A9F0'      },
  { id: 'experiences',   label: 'Experiences', icon: '◈', color: '#A8D4B4'      },
]

export const UKV_SERVICES: UKVService[] = [
  // ── ACCOMMODATION ──────────────────────────────────────────
  {
    id: 'cottage-pokomo-1', category: 'accommodation',
    name: 'Pokomo Cottage 1', tagline: 'Forest edge solitude',
    description: 'A handcrafted hideaway nestled at the forest perimeter. King bed, outdoor copper shower, private veranda overlooking the Boma herd at dusk.',
    price: 18500, priceNote: '/ night', duration: 'Min. 1 night',
    image: 'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=800',
    tag: 'Cottage', unit: '/ night', requiresDate: true, requiresGuests: true,
    badge: 'Most Booked', color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
  },
  {
    id: 'cottage-pokomo-2', category: 'accommodation',
    name: 'Pokomo Cottage 2', tagline: 'Valley view, total stillness',
    description: 'Open-plan stone-and-timber cottage with floor-to-ceiling views of the Rift Valley escarpment. Fireplace. Double copper soaking tub.',
    price: 18500, priceNote: '/ night', duration: 'Min. 1 night',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800',
    tag: 'Cottage', unit: '/ night', requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
  },
  {
    id: 'cottage-pokomo-3', category: 'accommodation',
    name: 'Pokomo Cottage 3', tagline: 'The family sanctuary',
    description: 'Two bedrooms, shared living room and private kitchen garden. Designed for families or small groups who want space without losing intimacy.',
    price: 24000, priceNote: '/ night', duration: 'Min. 2 nights',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800',
    tag: 'Cottage', unit: '/ night', requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
  },
  {
    id: 'farmhouse-suite-a', category: 'accommodation',
    name: 'Farmhouse Suite A', tagline: 'Heritage architecture, modern luxury',
    description: 'The original farmhouse restored. Exposed timber, handwoven textiles, inglenook fireplace and private terrace overlooking the working farm.',
    price: 28000, priceNote: '/ night', duration: 'Min. 2 nights',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800',
    tag: 'Suite', unit: '/ night', requiresDate: true, requiresGuests: true,
    badge: 'Signature', color: 'var(--gold)', accent: 'rgba(200,168,75,0.2)',
  },
  // ── DINING ─────────────────────────────────────────────────
  {
    id: 'dinner-farm-table', category: 'dining',
    name: 'Farm to Fork Dinner', tagline: 'The full harvest experience',
    description: "7-course tasting menu composed entirely from today's harvest. Served at the communal farm table under the acacia canopy. Chef's menu changes nightly.",
    price: 6500, priceNote: '/ person',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
    tag: 'Dining', unit: '/ person', requiresDate: true, requiresGuests: true,
    badge: "Chef's Table", color: '#D4906A', accent: 'rgba(212,144,106,0.15)',
  },
  {
    id: 'breakfast-farm', category: 'dining',
    name: 'Farm Breakfast', tagline: 'Dawn harvest on your plate',
    description: 'Foraged, picked and prepared the same morning. Eggs from the aviary, sourdough from the village oven, honey from the North Apiary.',
    price: 2800, priceNote: '/ person',
    image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?q=80&w=800',
    tag: 'Dining', unit: '/ person', requiresDate: true, requiresGuests: true,
    color: '#D4906A', accent: 'rgba(212,144,106,0.15)',
  },
  {
    id: 'cocktail-fire-evening', category: 'dining',
    name: 'Firepit Cocktail Evening', tagline: 'Sundowners by the ember pit',
    description: 'Signature cocktails from the Ubuntu bar paired with fire-pit bites as the valley turns amber.',
    price: 3500, priceNote: '/ person',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800',
    tag: 'Dining', unit: '/ person', requiresDate: true, requiresGuests: true,
    color: '#D4906A', accent: 'rgba(212,144,106,0.15)',
  },
  // ── SPA ────────────────────────────────────────────────────
  {
    id: 'spa-volcanic-mud', category: 'spa',
    name: 'Volcanic Mud Ritual', tagline: '90 minutes of deep earth restoration',
    description: 'Warm volcanic mud from the Rift Valley applied full-body. Mineral-rich clay remineralises tired skin. Followed by a forest-herb steam and cool rinse.',
    price: 9500, priceNote: '/ person', duration: '90 min',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
    tag: 'Spa', unit: '/ session', requiresDate: true, requiresGuests: false,
    badge: 'Signature', color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-forest-massage', category: 'spa',
    name: 'Forest Massage', tagline: 'Rhythmic and grounding',
    description: '75-minute full-body massage using oils cold-pressed from our herb garden. Performed in the open-air treatment pavilion.',
    price: 7500, priceNote: '/ person', duration: '75 min',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
    tag: 'Spa', unit: '/ session', requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-ubuntu-couples', category: 'spa',
    name: 'Ubuntu Couples Ritual', tagline: 'Shared restoration',
    description: 'Two-hour experience for two. Side-by-side volcanic mud wraps, synchronised massage, private honey and herb bath in the outdoor stone tub.',
    price: 18000, priceNote: '/ couple', duration: '120 min',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800',
    tag: 'Spa', unit: '/ couple', requiresDate: true, requiresGuests: false,
    badge: 'Couples', color: '#F0A8B8', accent: 'rgba(240,168,184,0.2)',
  },
  // ── FARM ───────────────────────────────────────────────────
  {
    id: 'farm-walk-dawn', category: 'farm',
    name: 'Dawn Farm Walk', tagline: 'The farm waking up',
    description: '90-minute walk through the working farm at first light. Feed the Boma herd, harvest herbs, collect eggs from the aviary. Includes farm breakfast.',
    price: 3500, priceNote: '/ person', duration: '90 min',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800',
    tag: 'Farm', unit: '/ person', requiresDate: true, requiresGuests: true,
    badge: 'Popular', color: 'var(--neon)', accent: 'rgba(0,255,65,0.08)',
  },
  {
    id: 'farm-beekeeping', category: 'farm',
    name: 'Beekeeping Experience', tagline: 'Inside the North Apiary',
    description: "Don a suit and enter the hive with our apiarist. Extract raw honey and taste directly from the comb. Take home your own jar.",
    price: 4500, priceNote: '/ person', duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800',
    tag: 'Farm', unit: '/ person', requiresDate: true, requiresGuests: true,
    color: 'var(--neon)', accent: 'rgba(0,255,65,0.08)',
  },
  // ── EVENTS ─────────────────────────────────────────────────
  {
    id: 'event-wedding', category: 'events',
    name: 'Wedding at the Village', tagline: 'A ceremony the land remembers',
    description: 'Full-property wedding packages for up to 120 guests. Includes ceremony, farm-to-fork reception, bridal accommodation and décor consultation.',
    price: 350000, priceNote: '/ event',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    tag: 'Events', unit: '/ event', requiresDate: true, requiresGuests: true,
    badge: 'Full Package', color: '#B8A9F0', accent: 'rgba(184,169,240,0.15)',
  },
  {
    id: 'event-corporate', category: 'events',
    name: 'Corporate Retreat', tagline: 'Reconnect your team to what matters',
    description: 'Tailored corporate retreats for groups of 10–60. Facilitated workshops, team farm experiences, accommodation and all meals. 2-day minimum.',
    price: 180000, priceNote: '/ group',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800',
    tag: 'Events', unit: '/ group', requiresDate: true, requiresGuests: true,
    color: '#B8A9F0', accent: 'rgba(184,169,240,0.15)',
  },
  // ── EXPERIENCES ────────────────────────────────────────────
  {
    id: 'exp-stargazing', category: 'experiences',
    name: 'Rift Valley Stargazing', tagline: 'The clearest skies in East Africa',
    description: '2-hour guided stargazing session with telescope and expert narrator. Held in the upper field. Includes warm baobab drink and fire-pit blankets.',
    price: 4000, priceNote: '/ person', duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=800',
    tag: 'Experience', unit: '/ person', requiresDate: true, requiresGuests: false,
    badge: 'After Dark', color: '#A8D4B4', accent: 'rgba(168,212,180,0.15)',
  },
]

// ── CALENDAR EVENTS ─────────────────────────────────────────
export const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ce-1',  day: 3,  month: 5, year: 2026, name: 'Dawn Farm Walk',           type: 'public',    description: 'Guided harvest morning with breakfast.',  price: 3500,   spotsLeft: 6,  serviceId: 'farm-walk-dawn',        color: 'var(--neon)' },
  { id: 'ce-2',  day: 7,  month: 5, year: 2026, name: 'Corporate Retreat',         type: 'corporate', description: 'Exclusive venue buyout.',                 price: 180000, spotsLeft: 0,  serviceId: 'event-corporate',       color: 'var(--gold)' },
  { id: 'ce-3',  day: 10, month: 5, year: 2026, name: 'Apiary Open Day',           type: 'public',    description: 'Meet the bees. Taste raw honey.',         price: 4500,   spotsLeft: 8,  serviceId: 'farm-beekeeping',       color: 'var(--neon)' },
  { id: 'ce-4',  day: 14, month: 5, year: 2026, name: 'Full Moon Dinner',          type: 'seasonal',  description: '7-course farm table under the moon.',     price: 8500,   spotsLeft: 4,  serviceId: 'dinner-farm-table',     color: '#D4906A'     },
  { id: 'ce-5',  day: 17, month: 5, year: 2026, name: 'Private Wedding',           type: 'private',   description: 'Full venue — private booking.',           price: 350000,                serviceId: 'event-wedding',         color: '#F0A8B8'     },
  { id: 'ce-6',  day: 21, month: 5, year: 2026, name: 'Seed-to-Soil Workshop',     type: 'public',    description: 'Hands-on kitchen garden session.',        price: 5000,   spotsLeft: 10,                              color: 'var(--neon)' },
  { id: 'ce-7',  day: 24, month: 5, year: 2026, name: 'Sunset Cocktail Night',     type: 'public',    description: 'Firepit sundowners, signature cocktails.', price: 3500,   spotsLeft: 12, serviceId: 'cocktail-fire-evening', color: '#D4906A'     },
  { id: 'ce-8',  day: 28, month: 5, year: 2026, name: 'Couples Retreat',           type: 'seasonal',  description: 'Spa, dinner, stargazing for two.',        price: 28000,  spotsLeft: 3,  serviceId: 'spa-ubuntu-couples',    color: '#F0A8B8'     },
  { id: 'ce-9',  day: 3,  month: 6, year: 2026, name: 'Farm Breakfast Club',       type: 'public',    description: 'Weekly harvest breakfast.',               price: 2800,   spotsLeft: 14, serviceId: 'breakfast-farm',        color: '#D4906A'     },
  { id: 'ce-10', day: 8,  month: 6, year: 2026, name: 'Stargazing Evening',        type: 'public',    description: 'Rift Valley night sky session.',          price: 4000,   spotsLeft: 9,  serviceId: 'exp-stargazing',        color: '#A8D4B4'     },
  { id: 'ce-11', day: 15, month: 6, year: 2026, name: 'Cultural Walk',             type: 'public',    description: 'Village heritage guided tour.',           price: 3000,   spotsLeft: 16,                              color: '#A8D4B4'     },
  { id: 'ce-12', day: 25, month: 6, year: 2026, name: "Farm-to-Fork Chef's Table", type: 'public',    description: 'Exclusive 7-course dining experience.',  price: 6500,   spotsLeft: 6,  serviceId: 'dinner-farm-table',     color: '#D4906A'     },
]

export const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
export const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']