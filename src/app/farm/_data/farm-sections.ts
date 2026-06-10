/**
 * app/farm/_data/farm-sections.ts
 *
 * Extended farm data: intelligence dashboards, testimonials, FAQ, sustainability metrics
 * Pure data layer - no React, no hooks
 */

// ── TYPES ──────────────────────────────────────────────────────────────────

export interface DashboardMetric {
  id: string
  label: string
  value: string | number
  unit?: string
  accent: string
  icon: string
  trend?: 'up' | 'down' | 'stable'
}

export interface AnimalBreed {
  id: string
  species: 'cattle' | 'goat' | 'sheep' | 'poultry' | 'rabbit' | 'fish' | 'bee'
  breed: string
  count: number
  health: number // 0-100
  production: string
  status: 'thriving' | 'stable' | 'monitoring'
  image: string
  accent: string
}

export interface CropVariety {
  id: string
  name: string
  category: 'vegetable' | 'herb' | 'fruit' | 'medicinal' | 'greenhouse' | 'field'
  growthStage: number // 0-100
  harvestDate: string
  yieldForecast: string
  healthScore: number // 0-100
  image: string
  accent: string
}

export interface RegenerativeComponent {
  id: string
  name: string
  description: string
  icon: string
  benefit: string
  image: string
  accent: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  avatar: string
  highlight: string
  accent: string
}

export interface FAQItem {
  id: string
  question: string
  answer: string
  category: 'farm' | 'experiences' | 'bookings' | 'sustainability'
}

export interface SustainabilityMetric {
  id: string
  title: string
  value: number
  unit: string
  description: string
  icon: string
  target?: number
  progress?: number // 0-100
  accent: string
}

// ── LIVING FARM DASHBOARD ──────────────────────────────────────────────────

export const FARM_DASHBOARD_METRICS: DashboardMetric[] = [
  {
    id: 'animals-count',
    label: 'Active Animals',
    value: 47,
    accent: '#00FF41',
    icon: '🐄',
  },
  {
    id: 'crops-count',
    label: 'Varieties Growing',
    value: 23,
    accent: '#D4AF37',
    icon: '🌱',
  },
  {
    id: 'milk-production',
    label: 'Liters/Day',
    value: 185,
    unit: 'L',
    accent: '#A8D8F0',
    icon: '🥛',
    trend: 'up',
  },
  {
    id: 'soil-health',
    label: 'Soil Quality',
    value: 92,
    unit: '%',
    accent: '#F0A8B8',
    icon: '🌍',
    trend: 'stable',
  },
  {
    id: 'water-storage',
    label: 'Tanks Full',
    value: 78,
    unit: '%',
    accent: '#00E5FF',
    icon: '💧',
  },
  {
    id: 'solar-power',
    label: 'Solar Output',
    value: 42,
    unit: 'kW',
    accent: '#FFD700',
    icon: '☀️',
    trend: 'up',
  },
]

// ── LIVESTOCK INTELLIGENCE ─────────────────────────────────────────────────

export const ANIMAL_BREEDS: AnimalBreed[] = [
  {
    id: 'cattle-001',
    species: 'cattle',
    breed: 'Boran Cattle (Beef)',
    count: 8,
    health: 96,
    production: '420kg avg weight',
    status: 'thriving',
    image: 'https://images.unsplash.com/photo-1527525494913-19a4a1b2f04a?w=800&h=600&fit=crop',
    accent: '#D4AF37',
  },
  {
    id: 'cattle-002',
    species: 'cattle',
    breed: 'Friesian Cattle (Dairy)',
    count: 6,
    health: 94,
    production: '28L/day',
    status: 'thriving',
    image: 'https://images.unsplash.com/photo-1527525494913-19a4a1b2f04a?w=800&h=600&fit=crop',
    accent: '#A8D8F0',
  },
  {
    id: 'goat-001',
    species: 'goat',
    breed: 'Galla Goat',
    count: 12,
    health: 88,
    production: '3-4L/day',
    status: 'stable',
    image: 'https://images.unsplash.com/photo-1516467508483-a7212febe330?w=800&h=600&fit=crop',
    accent: '#00FF41',
  },
  {
    id: 'poultry-001',
    species: 'poultry',
    breed: 'Kenbro Chicken (Layers)',
    count: 34,
    health: 91,
    production: '28-30 eggs/day',
    status: 'thriving',
    image: 'https://images.unsplash.com/photo-1579841790211-c54c5434aeb0?w=800&h=600&fit=crop',
    accent: '#F0A8B8',
  },
  {
    id: 'rabbit-001',
    species: 'rabbit',
    breed: 'Californian Rabbit',
    count: 8,
    health: 85,
    production: '4-5 litters/year',
    status: 'stable',
    image: 'https://images.unsplash.com/photo-1585110396000-c9ffd4d4b3f4?w=800&h=600&fit=crop',
    accent: '#FFB6C1',
  },
  {
    id: 'bee-001',
    species: 'bee',
    breed: 'Apis mellifera (Honeybees)',
    count: 2,
    health: 98,
    production: '40kg honey/year',
    status: 'thriving',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=600&fit=crop',
    accent: '#FFD700',
  },
  {
    id: 'fish-001',
    species: 'fish',
    breed: 'Tilapia (Aquaculture)',
    count: 150,
    health: 92,
    production: '200kg/cycle',
    status: 'thriving',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800&h=600&fit=crop',
    accent: '#00E5FF',
  },
]

// ── CROP INTELLIGENCE ───────────────────────────────────────────────────

export const CROP_VARIETIES: CropVariety[] = [
  {
    id: 'crop-001',
    name: 'Sukuma Wiki (Kale)',
    category: 'vegetable',
    growthStage: 75,
    harvestDate: '2026-06-08',
    yieldForecast: '240kg',
    healthScore: 94,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=800&h=600&fit=crop',
    accent: '#00FF41',
  },
  {
    id: 'crop-002',
    name: 'Tomato (Beef)',
    category: 'vegetable',
    growthStage: 45,
    harvestDate: '2026-07-02',
    yieldForecast: '350kg',
    healthScore: 88,
    image: 'https://images.unsplash.com/photo-1595599810694-c7c9a6b02a81?w=800&h=600&fit=crop',
    accent: '#FF6B6B',
  },
  {
    id: 'crop-003',
    name: 'Lemongrass',
    category: 'herb',
    growthStage: 92,
    harvestDate: '2026-06-05',
    yieldForecast: '120kg',
    healthScore: 96,
    image: 'https://images.unsplash.com/photo-1545683528-f1a3be504b3f?w=800&h=600&fit=crop',
    accent: '#FFD700',
  },
  {
    id: 'crop-004',
    name: 'Basil (Genovese)',
    category: 'herb',
    growthStage: 88,
    harvestDate: '2026-06-10',
    yieldForecast: '60kg',
    healthScore: 93,
    image: 'https://images.unsplash.com/photo-1537348633046-92f582ded980?w=800&h=600&fit=crop',
    accent: '#00FF41',
  },
  {
    id: 'crop-005',
    name: 'Mango (Alphonso)',
    category: 'fruit',
    growthStage: 60,
    harvestDate: '2026-07-15',
    yieldForecast: '400kg',
    healthScore: 91,
    image: 'https://images.unsplash.com/photo-1585864387154-7a50c8007ada?w=800&h=600&fit=crop',
    accent: '#FFA500',
  },
  {
    id: 'crop-006',
    name: 'Passion Fruit',
    category: 'fruit',
    growthStage: 50,
    harvestDate: '2026-07-01',
    yieldForecast: '180kg',
    healthScore: 89,
    image: 'https://images.unsplash.com/photo-1600765065227-52087ff4f4ff?w=800&h=600&fit=crop',
    accent: '#9B59B6',
  },
  {
    id: 'crop-007',
    name: 'Ginger (Medicinal)',
    category: 'medicinal',
    growthStage: 70,
    harvestDate: '2026-08-01',
    yieldForecast: '320kg',
    healthScore: 92,
    image: 'https://images.unsplash.com/photo-1596040281271-87d6a6e34a6f?w=800&h=600&fit=crop',
    accent: '#CD7F32',
  },
]

// ── REGENERATIVE AGRICULTURE ──────────────────────────────────────────────

export const REGENERATIVE_PRACTICES: RegenerativeComponent[] = [
  {
    id: 'regen-001',
    name: 'Permaculture Design',
    description: 'Layered planting zones that mimic natural forest ecosystems. Trees, shrubs, herbaceous plants, and ground cover work together.',
    icon: '🌳',
    benefit: 'Creates biodiversity while maximizing yield',
    image: 'https://images.unsplash.com/photo-1596854407944-bf87f6fdd49e?w=800&h=600&fit=crop',
    accent: '#00FF41',
  },
  {
    id: 'regen-002',
    name: 'Soil Health & Composting',
    description: 'On-site composting from farm waste. Annual soil testing. No synthetic fertilizers. Organic matter builds every season.',
    icon: '🌱',
    benefit: 'Soil holds more water, sequesters carbon',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=800&h=600&fit=crop',
    accent: '#8B4513',
  },
  {
    id: 'regen-003',
    name: 'Water Conservation',
    description: 'Rainwater harvesting into 85,000L tanks. Drip irrigation. Mulching to retain soil moisture.',
    icon: '💧',
    benefit: 'Resilient in drought, reduces water bills 60%',
    image: 'https://images.unsplash.com/photo-1559027615-cd2628902d4a?w=800&h=600&fit=crop',
    accent: '#00E5FF',
  },
  {
    id: 'regen-004',
    name: 'Renewable Energy',
    description: 'Solar panels, wind potential. Eliminates diesel pumps. Powers irrigation, refrigeration, processing.',
    icon: '☀️',
    benefit: 'Reduces carbon footprint by 8T CO2/year',
    image: 'https://images.unsplash.com/photo-1509391366360-2e938d440220?w=800&h=600&fit=crop',
    accent: '#FFD700',
  },
  {
    id: 'regen-005',
    name: 'Agroforestry',
    description: 'Trees integrated into crop and livestock systems. Shade for animals, nitrogen fixing, windbreaks.',
    icon: '🌲',
    benefit: 'Increases farm resilience, provides multiple yields',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop',
    accent: '#228B22',
  },
  {
    id: 'regen-006',
    name: 'Biodiversity Protection',
    description: 'Native bee populations. Pollinator gardens. Bird sanctuaries. Indigenous plant preservation.',
    icon: '🦋',
    benefit: 'Pollination, pest control, ecosystem health',
    image: 'https://images.unsplash.com/photo-1490945967868-a5b595b51c47?w=800&h=600&fit=crop',
    accent: '#FF1493',
  },
]

// ── TESTIMONIALS ────────────────────────────────────────────────────────

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-001',
    name: 'Sarah & Michael',
    role: 'Farm Stay Guests',
    content:
      'Three days at Ubuntu changed how we see food. Walking fields at dawn, harvesting our lunch, eating it that evening — it\'s a spiritual experience.',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    highlight: 'Farm-to-table isn\'t marketing here. It\'s real.',
    accent: '#D4AF37',
  },
  {
    id: 'test-002',
    name: 'Dr. Patricia Mwangi',
    role: 'Agricultural Researcher',
    content:
      'The regenerative practices at Ubuntu are textbook-perfect. Carbon sequestration, soil health, biodiversity — all measurable. This is the future of agriculture.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    highlight: 'Scientific rigor meets ecological wisdom.',
    accent: '#00FF41',
  },
  {
    id: 'test-003',
    name: 'The Kipchoge Family',
    role: 'School Group Visitors',
    content:
      'Our students learned more about food systems in one day than a semester of classroom. Hands-on, joyful, and deeply educational.',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    highlight: 'Education that sticks.',
    accent: '#A8D8F0',
  },
  {
    id: 'test-004',
    name: 'Chef James',
    role: 'Ubuntu Feast Kitchen Lead',
    content:
      'Every morning I walk the fields to plan the day\'s menu. I know the soil each ingredient grew in, the hands that planted it. That love shows in every dish.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop',
    highlight: 'This is cooking with integrity.',
    accent: '#FFD700',
  },
]

// ── FAQ ────────────────────────────────────────────────────────────────

export const FAQ_ITEMS: FAQItem[] = [
  {
    id: 'faq-001',
    category: 'farm',
    question: 'What exactly is regenerative agriculture?',
    answer:
      'Regenerative agriculture actively improves soil health, increases biodiversity, and sequesters carbon. Unlike sustainable farming (which maintains), regenerative farming heals. We use permaculture design, composting, native plants, and water conservation to leave the land better than we found it.',
  },
  {
    id: 'faq-002',
    category: 'farm',
    question: 'Do you use pesticides or synthetic fertilizers?',
    answer:
      'No. We use integrated pest management — companion planting, beneficial insects, and organic practices. Soil health is our primary defense. Annual soil testing ensures we stay certified organic.',
  },
  {
    id: 'faq-003',
    category: 'farm',
    question: 'How do animals factor into regenerative farming?',
    answer:
      'Livestock are essential. Cattle and goats move through fields, fertilizing the soil while eating. This mimics natural grazing patterns. We rotate animals seasonally to avoid overgrazing and maintain grassland health.',
  },
  {
    id: 'faq-004',
    category: 'experiences',
    question: 'What should I wear on a farm experience?',
    answer:
      'Closed-toe shoes with grip (no sandals), weather-appropriate clothing, and sun protection. We provide aprons and gloves. Most experiences are 2-3 hours in open fields or under shade structures.',
  },
  {
    id: 'faq-005',
    category: 'experiences',
    question: 'Are experiences suitable for children?',
    answer:
      'Yes. We have specific family programs for ages 4+. Animal encounters, planting, harvesting, and beekeeping observation are engaging for children. Teen workshops include more responsibility and complexity.',
  },
  {
    id: 'faq-006',
    category: 'experiences',
    question: 'Can I book a private farm experience?',
    answer:
      'Absolutely. Groups of 6-10 can book private farm days. We customize itineraries around your interests — animal interaction, crop focus, soil ecology, cooking classes. Contact our team for custom packages.',
  },
  {
    id: 'faq-007',
    category: 'bookings',
    question: 'How far in advance should I book?',
    answer:
      'Peak season (June-September) requires 3-4 weeks advance booking. Off-season (Oct-May) allows shorter notice. Group experiences and workshops can be custom-scheduled with 2-3 weeks lead time.',
  },
  {
    id: 'faq-008',
    category: 'bookings',
    question: 'What\'s your cancellation policy?',
    answer:
      'Cancellations made 14+ days before experience: full refund. 7-14 days: 50% refund. Less than 7 days: no refund (but can reschedule). Extreme weather (flood, extreme heat) = automatic rescheduling.',
  },
  {
    id: 'faq-009',
    category: 'sustainability',
    question: 'What\'s the carbon footprint of a farm visit?',
    answer:
      'We offset guest transport through our reforestation program. Farm operations run 80% on renewable energy. Our goal is carbon-neutral by 2027. Every experience plants a tree in your name.',
  },
  {
    id: 'faq-010',
    category: 'sustainability',
    question: 'How much water does the farm use?',
    answer:
      'Through rainwater harvesting and drip irrigation, we use 60% less water than conventional farms. Dry season is managed through mulching and crop selection. We\'ve reduced water costs from 3,200/month to 800/month.',
  },
]

// ── SUSTAINABILITY METRICS ──────────────────────────────────────────────

export const SUSTAINABILITY_METRICS: SustainabilityMetric[] = [
  {
    id: 'sustain-001',
    title: 'Carbon Sequestered',
    value: 42,
    unit: 'metric tons/year',
    description: 'Soil regeneration + tree growth = net carbon capture',
    icon: '🌍',
    target: 50,
    progress: 84,
    accent: '#00FF41',
  },
  {
    id: 'sustain-002',
    title: 'Water Harvested',
    value: 85000,
    unit: 'liters stored',
    description: 'From seasonal rainfall + grey water recycling',
    icon: '💧',
    progress: 100,
    accent: '#00E5FF',
  },
  {
    id: 'sustain-003',
    title: 'Solar Energy',
    value: 42,
    unit: 'kW capacity',
    description: 'Powering all irrigation, processing, and facilities',
    icon: '☀️',
    target: 60,
    progress: 70,
    accent: '#FFD700',
  },
  {
    id: 'sustain-004',
    title: 'Organic Matter',
    value: 8.2,
    unit: '% in soil',
    description: 'Up from 3.1% when we started. Healthy soil stores water + carbon',
    icon: '🌱',
    target: 10,
    progress: 82,
    accent: '#8B4513',
  },
  {
    id: 'sustain-005',
    title: 'Biodiversity',
    value: 187,
    unit: 'native species',
    description: 'Plants, insects, birds. Was 34 before regeneration',
    icon: '🦋',
    progress: 100,
    accent: '#FF1493',
  },
  {
    id: 'sustain-006',
    title: 'Trees Planted',
    value: 2840,
    unit: 'agroforestry + offset',
    description: 'Shade for livestock, erosion control, carbon capture',
    icon: '🌳',
    target: 5000,
    progress: 57,
    accent: '#228B22',
  },
]
