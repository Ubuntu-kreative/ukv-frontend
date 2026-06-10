/**
 * app/farm/_data/farm-data.ts
 *
 * ALL static data for the farm route.
 * Pure TypeScript — no JSX, no hooks, no React imports.
 *
 * WHY THIS FILE EXISTS:
 * The original FarmPage had all data declared inside the component body.
 * Inside 'use client', every array was re-allocated on every render.
 * Here they are module-level constants — allocated once at module load,
 * never recreated. Server components can also import from this file
 * with zero client JS cost.
 */

// ─── TYPES ────────────────────────────────────────────────────────────────────

export type FarmTab = 'walks' | 'animals' | 'workshops' | 'harvest'

export interface ExperienceItem {
  id:          string
  name:        string
  category:    string
  price:       number
  duration:    string
  groupSize:   string
  image:       string
  blurDataURL?: string
  badge?:      string
  badgeColor?: string
  description: string
  storyLine:   string
  includes:    string[]
  highlights:  string[]
}

export interface TabItem {
  id:          string
  name:        string
  description: string
  image:       string
  blurDataURL?: string
  price?:      number
  duration?:   string
  capacity?:   string
  tag:         string
  accentColor: string
  highlights:  string[]
}

export interface LivestockItem {
  id:      string
  species: string
  breed:   string
  unit:    string
  status:  string
  field:   string
  notes:   string
  accent:  string
  image:   string
}

export interface CropItem {
  name:          string
  field:         string
  status:        string
  soilMoisture:  number
  daysToHarvest: number
  lastWatered:   string
  accent:        string
  usedIn:        string[]
  image:         string
}

export interface FieldItem {
  id:       string
  size:     string
  crops:    string
  moisture: number
  status:   string
  image:    string
}

// ─── EXPERIENCES ─────────────────────────────────────────────────────────────

export const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'exp-001', name: 'Sunrise Farm Walk',
    category: 'Farm Walks', price: 2800, duration: '2 hrs', groupSize: '1–6 guests',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80',
    badge: 'Most Popular', badgeColor: 'var(--neon)',
    description: 'Rise with the land. Walk all six fields at golden hour with your farm guide, learning the story of every crop, animal, and soil bed that feeds the Kreative Village kitchen.',
    storyLine: 'The light breaks over Field D before the rest of the world wakes. Your guide has already been here an hour — checking the soil, reading the morning. Now you walk beside them.',
    includes: ['Guided 2-hour walk', 'Morning herb tea', 'Field journal', 'Provenance certificate'],
    highlights: ['Visit all 6 active fields', 'Meet the livestock', 'Harvest herbs fresh', 'Moxie integration — ask live questions'],
  },
  {
    id: 'exp-002', name: 'Boma Animal Encounter',
    category: 'Animal Encounters', price: 1800, duration: '1.5 hrs', groupSize: '1–4 guests',
    image: 'images/goat.jpg',
    badge: 'Family Favourite', badgeColor: 'var(--gold)',
    description: 'Get close with our Boran cattle, Galla goats, and Kenbro chickens. Your guide explains breed selection, ethical rearing, and the farm-to-fork journey from boma to bowl.',
    storyLine: 'UKV-031 has been with us since the beginning. The Galla goat does not hurry for anyone. You feed her by hand and understand, for the first time, where dinner actually comes from.',
    includes: ['Guided boma tour', 'Feeding session', 'Breed story cards', 'Photo opportunity'],
    highlights: ['Feed the goats', 'Collect fresh eggs', 'Learn breed histories', 'Full boma access'],
  },
  {
    id: 'exp-003', name: 'Farm-to-Table Workshop',
    category: 'Workshops', price: 4500, duration: '4 hrs', groupSize: '2–8 guests',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80',
    badge: 'Signature', badgeColor: '#B8A9F0',
    description: 'Harvest what you cook. Pick kale from Field B, herbs from the garden, then move into our outdoor kitchen to prepare a full Kreative Village meal under chef guidance.',
    storyLine: 'You harvest the kale yourself. Twenty minutes later it is in the pan. This is the meal you will talk about for years — because you built it from the soil up.',
    includes: ['Field harvest session', 'Cooking class', 'Full farm meal', 'Recipe cards', 'Apron & tools'],
    highlights: ['Pick your own ingredients', 'Chef-led cooking', 'Eat what you make', 'Take recipes home'],
  },
  {
    id: 'exp-004', name: 'Harvest & Field Session',
    category: 'Harvest & Field', price: 2200, duration: '2.5 hrs', groupSize: '1–10 guests',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80',
    description: 'Roll up your sleeves. Work alongside our farm team harvesting ready crops — currently sukuma wiki, lemongrass, and rosemary. Leave with a basket of what you picked.',
    storyLine: 'The farm team do not slow down for guests. You join their rhythm. Hands in the soil. The smell of cut lemongrass. A basket that gets heavier. This is the real thing.',
    includes: ['Hands-on harvest', 'Farm tools provided', 'Harvest basket to keep', 'Farmer Q&A'],
    highlights: ['Real working farm experience', 'Seasonal crops', 'Take home your harvest', 'Learn soil & crop cycles'],
  },
  {
    id: 'exp-005', name: 'Herb Garden & Spa Pairing',
    category: 'Workshops', price: 3600, duration: '3 hrs', groupSize: '1–4 guests',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    badge: 'New', badgeColor: '#A8D8F0',
    description: "Our herb garden feeds the kitchen and the spa. In this session you'll distill lemongrass and rosemary oils, blend your own spa infusion, then enjoy a 30-min treatment using your blend.",
    storyLine: 'The oil you distill this morning will be pressed into your skin this afternoon. There is no shorter distance between garden and body than this.',
    includes: ['Garden tour & harvest', 'Distillation session', 'Custom blend bottle', '30-min spa treatment'],
    highlights: ['Distill your own essential oils', 'Spa treatment included', 'Take home your blend', 'Expert herbalist guide'],
  },
  {
    id: 'exp-006', name: 'Full Day Farm Immersion',
    category: 'Farm Walks', price: 7500, duration: 'Full day', groupSize: '1–6 guests',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    badge: 'Premium', badgeColor: 'var(--gold)',
    description: 'The complete Kreative Village farm story — sunrise walk, animal encounter, herb workshop, harvest session, and a long farm lunch all in one immersive day.',
    storyLine: 'You arrive when the mist is still on Field D. You leave when the last dish is cleared and the fire is low. In between, you will have touched every part of this farm.',
    includes: ['All four farm experiences', 'Farm lunch for 2', 'Harvest basket', 'Photo set', 'Provenance booklet'],
    highlights: ['Every field & boma visited', 'Full day with farm team', 'Lunch from the farm', 'Best value package'],
  },
]

// ─── TAB DATA ─────────────────────────────────────────────────────────────────

export const TAB_DATA: Record<FarmTab, { label: string; items: TabItem[] }> = {
  walks: {
    label: 'Farm Walks',
    items: [
      { id: 'walk-001', name: 'Golden Hour Walk', tag: 'Sunrise', accentColor: 'var(--gold)', price: 1800, duration: '90 MIN', capacity: '1–8', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80', description: 'A guided walk through all six fields at first light. The air carries dew and lemongrass. Nothing else is required of you.', highlights: ['All 6 fields', 'Herb tasting', 'Morning tea', 'Field journal'] },
      { id: 'walk-002', name: 'Soil & Root Walk', tag: 'Education', accentColor: 'var(--neon)', price: 1400, duration: '60 MIN', capacity: '2–12', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80', description: 'An agronomist-led session focused on soil science, composting, and sustainable cropping as practised on the Ubuntu farm.', highlights: ['Soil sampling', 'Compost tour', 'Crop calendar', 'Seed library access'] },
      { id: 'walk-003', name: 'Evening Fields Walk', tag: 'Sunset', accentColor: '#F0A8B8', price: 1600, duration: '75 MIN', capacity: '1–6', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', description: 'The fields slow down as the sun drops. Walk with a guide while the kitchen prepares what you helped grow earlier in the day.', highlights: ['Sunset light', 'Pre-dinner herbs', 'Private guide', 'Sundowner drink'] },
    ],
  },
  animals: {
    label: 'Animal Encounters',
    items: [
      { id: 'anim-001', name: 'Boma Morning Session', tag: 'Cattle & Goats', accentColor: 'var(--neon)', price: 1800, duration: '90 MIN', capacity: '1–4', image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=1200&q=80', description: 'Feed UKV-031 and her Galla herd by hand. Learn why we chose Boran cattle and how ethical rearing changes the flavour of everything on the menu.', highlights: ['Hand-feed goats', 'Breed story cards', 'Boran cattle', 'Photo session'] },
      { id: 'anim-002', name: 'Egg Collection', tag: 'Poultry House', accentColor: 'var(--gold)', price: 900, duration: '45 MIN', capacity: '1–8', image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', description: 'Collect eggs from our 34-hen Kenbro flock at the morning count. A grounding, tactile experience that reconnects you with where breakfast begins.', highlights: ['34 free-range hens', 'Collect fresh eggs', 'Take home a dozen', 'Feeding session'] },
      { id: 'anim-003', name: 'Dairy Paddock Visit', tag: 'Friesian Herd', accentColor: '#A8D8F0', price: 1200, duration: '60 MIN', capacity: '1–6', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80', description: 'Visit our Friesian dairy herd whose milk goes directly into the spa and kitchen. Watch the milking process and taste the difference.', highlights: ['Dairy herd access', 'Milking demo', 'Fresh milk tasting', 'Spa connection'] },
    ],
  },
  workshops: {
    label: 'Workshops',
    items: [
      { id: 'wksp-001', name: 'Composting Masterclass', tag: 'Soil Science', accentColor: 'var(--neon)', price: 2200, duration: '2.5 HRS', capacity: '2–10', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80', description: 'Learn the full closed-loop composting system that feeds our fields. Take home a kit to start your own at home.', highlights: ['Compost science', 'Worm farm visit', 'Take-home kit', 'Soil testing'] },
      { id: 'wksp-002', name: 'Seed Saving Workshop', tag: 'Heritage Seeds', accentColor: 'var(--gold)', price: 1900, duration: '2 HRS', capacity: '2–8', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80', description: 'Learn to harvest, dry, and store heritage seed varieties from our open-pollinated collection.', highlights: ['Heritage varieties', 'Drying techniques', 'Seed envelopes', 'Planting guide'] },
      { id: 'wksp-003', name: 'Natural Fermentation', tag: 'Kitchen Science', accentColor: '#B8A9F0', price: 3200, duration: '3 HRS', capacity: '2–8', image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80', description: 'From the farm vegetable patch to a fermentation jar — learn lacto-fermentation using produce we harvest together at the session start.', highlights: ['Farm-sourced veg', 'Lacto-fermentation', 'Take home your jars', 'Recipe cards'] },
    ],
  },
  harvest: {
    label: 'Harvest & Field',
    items: [
      { id: 'harv-001', name: 'Kale Harvest', tag: 'Field B', accentColor: 'var(--neon)', price: 1400, duration: '90 MIN', capacity: '1–12', image: 'https://images.unsplash.com/photo-1621447508323-270a444d481d?w=800&q=80', description: 'Field B kale at peak harvest. Work alongside the farm team cutting sukuma wiki that goes directly into the kitchen that afternoon.', highlights: ['Real harvest work', 'Field B access', 'Kitchen handover', 'Take-home basket'] },
      { id: 'harv-002', name: 'Herb Harvest & Bundle', tag: 'Herb Garden', accentColor: '#A8F0D8', price: 1200, duration: '60 MIN', capacity: '1–8', image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80', description: 'Harvest lemongrass, rosemary, and mint from the herb garden. Bundle and dry your own herbs or take them home fresh.', highlights: ['3 herb varieties', 'Drying & bundling', 'Take home bundle', 'Recipe pairing cards'] },
      { id: 'harv-003', name: 'Orchard Fruit Pick', tag: 'Orchard', accentColor: 'var(--gold)', price: 1600, duration: '90 MIN', capacity: '1–8', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80', description: 'Seasonal fruit picking from our orchard of mango, avocado, pawpaw, and passion fruit. Whatever is ripe, is yours to take.', highlights: ['Seasonal variety', 'Ripe on the day', 'Full basket to keep', 'Jam recipe card'] },
    ],
  },
}

// ─── LIVESTOCK ────────────────────────────────────────────────────────────────

export const LIVESTOCK: LivestockItem[] = [
  { id: 'UKV-047', species: 'Cattle', breed: 'Boran', unit: 'Boma Unit 3', status: 'Healthy', field: 'Field A', notes: 'Primary beef source. Last health check 2 days ago.', accent: 'var(--neon)', image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&q=80' },
  { id: 'UKV-031', species: 'Goat', breed: 'Galla', unit: 'Boma Unit 1', status: 'Healthy', field: 'Field B', notes: "Featured in tonight's stew. Free-range grazing.", accent: 'var(--gold)', image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=400&q=80' },
  { id: 'UKV-088', species: 'Chicken', breed: 'Kenbro', unit: 'Poultry House', status: 'Healthy', field: 'Free Range', notes: 'Eggs collected daily. Current count: 34 hens.', accent: '#F0D8A8', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80' },
  { id: 'UKV-012', species: 'Cattle', breed: 'Friesian', unit: 'Dairy Unit', status: 'Healthy', field: 'Dairy Paddock', notes: 'Dairy herd. Milk used in spa treatments and kitchen.', accent: '#A8D8F0', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
]

// ─── CROPS ────────────────────────────────────────────────────────────────────

export const CROPS: CropItem[] = [
  { name: 'Sukuma Wiki (Kale)', field: 'Field B', status: 'Harvest Ready', soilMoisture: 68, daysToHarvest: 0, lastWatered: '6 hours ago', accent: 'var(--neon)', usedIn: ['Field B Kale Salad', 'Farm Beef Tenderloin', 'Harvest Vegetable Plate'], image: '/images/SukumaWiki.jpg' },
  { name: 'Tomatoes', field: 'Field A', status: 'Growing', soilMoisture: 72, daysToHarvest: 8, lastWatered: '4 hours ago', accent: '#F0A8B8', usedIn: ['Harvest Vegetable Plate', 'Herb Garden Soup'], image: '/images/tomatoes.jpg' },
  { name: 'Sweet Potatoes', field: 'Field C', status: 'Growing', soilMoisture: 55, daysToHarvest: 21, lastWatered: '12 hours ago', accent: 'var(--gold)', usedIn: ['Harvest Vegetable Plate'], image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&q=80' },
  { name: 'Lemongrass', field: 'Herb Garden', status: 'Harvest Ready', soilMoisture: 60, daysToHarvest: 0, lastWatered: '8 hours ago', accent: '#A8F0D8', usedIn: ['Herb Garden Infusion', 'Forest Massage oil', 'Spa treatments'], image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80' },
  { name: 'Rosemary', field: 'Herb Garden', status: 'Harvest Ready', soilMoisture: 48, daysToHarvest: 0, lastWatered: '8 hours ago', accent: '#B8A9F0', usedIn: ['Herb Garden Infusion', 'Boma Bone Broth', 'Spa treatments'], image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=80' },
  { name: 'Maize', field: 'Field D', status: 'Planted', soilMoisture: 80, daysToHarvest: 45, lastWatered: '2 hours ago', accent: '#F0D8A8', usedIn: ['Ugali', 'Animal feed'], image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
]

// ─── FIELDS ───────────────────────────────────────────────────────────────────

export const FIELDS: FieldItem[] = [
  { id: 'Field A', size: '2.4 acres', crops: 'Tomatoes, Root vegetables', moisture: 72, status: 'Active', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80' },
  { id: 'Field B', size: '1.8 acres', crops: 'Kale, Spinach, Leafy greens', moisture: 68, status: 'Active', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80' },
  { id: 'Field C', size: '3.1 acres', crops: 'Sweet potatoes, Cassava', moisture: 55, status: 'Active', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
  { id: 'Field D', size: '4.0 acres', crops: 'Maize, Sorghum', moisture: 80, status: 'Active', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80' },
  { id: 'Herb Garden', size: '0.4 acres', crops: 'Lemongrass, Rosemary, Mint, Turmeric', moisture: 58, status: 'Active', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
  { id: 'Orchard', size: '1.2 acres', crops: 'Mango, Avocado, Pawpaw, Passion fruit', moisture: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=80' },
]

// ─── FARM STATS ───────────────────────────────────────────────────────────────

export const FARM_STATS = [
  { value: '24', label: 'Animals tracked', color: 'var(--neon)'  },
  { value: '6',  label: 'Active fields',   color: 'var(--gold)'  },
  { value: '3',  label: 'Harvest ready',   color: 'var(--neon)'  },
  { value: '13.5', label: 'Total farm acres', color: 'var(--gold)' },
] as const