import type { Ritual } from '@/types/moxie'

export const dailyRituals: Ritual[] = [
  {
    id: 'sunrise-tea',
    title: 'Sunrise Tea Ritual',
    time: '06:00',
    location: 'Eastern Garden Terrace',
    icon: '☀️',
    description: 'Begin the day in stillness with wildcrafted lemongrass and mint harvested at dawn.',
    season: 'dry',
  },
  {
    id: 'farm-breakfast',
    title: 'Farm Harvest Breakfast',
    time: '08:30',
    location: 'Open-Air Dining Pavilion',
    icon: '🌾',
    description: 'A slow breakfast built entirely from what the land offered this morning.',
  },
  {
    id: 'herbal-walk',
    title: 'Herbal Harvest Walk',
    time: '11:00',
    location: 'The Living Farm',
    icon: '🌿',
    description: 'A guided wander through the medicinal gardens with our village herbalist.',
  },
  {
    id: 'midday-silence',
    title: 'Midday Silence Hour',
    time: '13:00',
    location: 'Neem Shade Grove',
    icon: '🍃',
    description: 'An optional hour of complete silence under the neem canopy.',
  },
  {
    id: 'hydrotherapy',
    title: 'Spa Hydrotherapy',
    time: '16:00',
    location: 'Arohamai Spa',
    icon: '💧',
    description: 'Hot and cold water rituals to reset the nervous system before evening.',
  },
  {
    id: 'fire-circle',
    title: 'Fire Circle Gathering',
    time: '19:00',
    location: 'Central Fire Pit',
    icon: '🔥',
    description: 'Stories, warm drinks, and shared silence around the ancestral fire.',
  },
  {
    id: 'moonlight-cinema',
    title: 'Moonlight Cinema',
    time: '21:00',
    location: 'Open Sky Amphitheatre',
    icon: '🌙',
    description: 'Curated film screenings beneath the highland stars.',
  },
]

export const weekendRituals: Ritual[] = [
  {
    id: 'sound-healing',
    title: 'Sound Healing Session',
    time: '09:00',
    location: 'Bamboo Meditation Space',
    icon: '🎵',
    description: 'Crystal bowls and African percussion for deep nervous system restoration.',
  },
  {
    id: 'farm-tour',
    title: 'Living Farm Tour',
    time: '10:30',
    location: 'Ubuntu Farm',
    icon: '🌱',
    description: 'Understand the ecological systems that sustain the village.',
  },
  {
    id: 'private-dinner',
    title: 'Private Valley Dinner',
    time: '19:30',
    location: 'Clifftop Dining Terrace',
    icon: '🕯️',
    description: 'An intimate candlelit dinner over the valley, by arrangement.',
  },
]