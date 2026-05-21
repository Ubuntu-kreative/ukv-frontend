import type { Experience, RetreatType } from '@/types/moxie'

export const experiences: Experience[] = [
  {
    id: 'spa-hydrotherapy',
    title: 'Arohamai Spa',
    description:
      'Hot hydrotherapy, grounding rituals, herbal treatments, and slow healing in the highland sanctuary.',
    icon: '💧',
    category: 'wellness',
    duration: '60–180 min',
    featured: true,
  },
  {
    id: 'farm-dining',
    title: 'Farm-to-Table Dining',
    description:
      'Fresh harvest meals prepared daily from the living land surrounding your cottage.',
    icon: '🌾',
    category: 'culinary',
    featured: true,
  },
  {
    id: 'moonlight-cinema',
    title: 'Moonlight Cinema',
    description:
      'Open-air film nights beneath the Kenyan highland sky — curated for stillness and wonder.',
    icon: '🌙',
    category: 'evening',
    featured: true,
  },
  {
    id: 'farm-tour',
    title: 'Guided Farm Tours',
    description:
      'Walk through the living ecological systems that power and nourish the entire village.',
    icon: '🌿',
    category: 'nature',
    duration: '2 hours',
    featured: true,
  },
  {
    id: 'sound-healing',
    title: 'Sound Healing',
    description:
      'Crystal bowl and percussion ceremonies for deep nervous system restoration.',
    icon: '🎵',
    category: 'wellness',
    duration: '75 min',
  },
  {
    id: 'fire-circle',
    title: 'Fire Circle Evenings',
    description:
      'Ancestral fireside gatherings — stories, silence, warm drinks, community.',
    icon: '🔥',
    category: 'cultural',
  },
  {
    id: 'sunrise-yoga',
    title: 'Rooftop Sunrise Yoga',
    description:
      'Begin each morning above the valley mist with open-sky movement and breath.',
    icon: '☀️',
    category: 'wellness',
    duration: '60 min',
  },
  {
    id: 'private-dining',
    title: 'Private Valley Dinners',
    description:
      'Candlelit clifftop dining over the highland valley — by arrangement.',
    icon: '🕯️',
    category: 'culinary',
  },
]

export const retreatTypes: RetreatType[] = [
  {
    id: 'creative',
    title: 'Creative Retreat',
    description:
      'For writers, designers, founders, artists, and deep thinkers seeking stillness and expansive creative space.',
    recommendation: 'Neem Penthouse',
    cottageId: 'neem-penthouse',
    vibe: 'Silence · Rooftop · Open Sky',
    duration: '3–7 nights',
    tags: ['writing', 'design', 'silence', 'focus', 'rooftop'],
  },
  {
    id: 'romantic',
    title: 'Romantic Escape',
    description:
      'Slow mornings, golden sunsets, private dinners, and deep emotional reconnection.',
    recommendation: 'Buffalo Thorn',
    cottageId: 'buffalo-thorn',
    vibe: 'Sunrise Valley Views · Privacy',
    duration: '2–5 nights',
    tags: ['romance', 'couples', 'privacy', 'sunset', 'intimate'],
  },
  {
    id: 'digital-detox',
    title: 'Digital Detox',
    description:
      'Disconnect from the noise of the world and return to the primal rhythm of land and body.',
    recommendation: 'Inko',
    cottageId: 'inko',
    vibe: 'Stars · Firelight · Quiet',
    duration: '4–10 nights',
    tags: ['detox', 'disconnection', 'nature', 'silence', 'grounding'],
  },
  {
    id: 'wellness',
    title: 'Wellness Journey',
    description:
      'Spa rituals, grounding movement, farm meals, herbal medicine, and deep nervous system recovery.',
    recommendation: 'Marula Cottage',
    cottageId: 'marula-cottage',
    vibe: 'Nature · Calm · Recovery',
    duration: '5–14 nights',
    tags: ['spa', 'healing', 'wellness', 'rest', 'herbs'],
  },
]