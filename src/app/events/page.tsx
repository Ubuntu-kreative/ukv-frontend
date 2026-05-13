'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import Link from 'next/link'
import { motion, AnimatePresence, useScroll, useTransform, LayoutGroup } from 'framer-motion'
import { SectionDivider } from '@/components/ui/SectionDivider'
import { ProductCard } from '@/components/ui/ProductCard'
import { EVENT_PACKAGES, PUBLIC_EVENTS } from '@/lib/data'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────────────────
// TYPES (all original preserved + enriched)
// ─────────────────────────────────────────────────────────────────────────────

interface UKVEvent {
  id: string
  title: string
  subtitle: string
  category: string
  date: string
  time: string
  duration: string
  capacity: number
  spotsLeft: number
  price: number
  accent: string
  status: 'Reservation Open' | 'Enquire'
  description: string
  includes: string[]
  image: string
  gallery?: string[]
  philosophy?: string
  spaces?: { name: string; description: string }[]
  journey?: string[]
  testimonial?: { quote: string; author: string; location: string }
  // NEW: cinematic short copy for hero rail + cards
  cinematic?: string
  // NEW: YouTube embed ID for video hover preview
  videoId?: string
}

interface EventType {
  id: string
  icon: string
  name: string
  sub: string
  price: number
  tag: string
  image: string
  philosophy?: string
  gallery?: string[]
  spaces?: { name: string; description: string }[]
  journey?: string[]
  testimonial?: { quote: string; author: string; location: string }
  includes?: string[]
}

// ─────────────────────────────────────────────────────────────────────────────
// DATA (all original preserved exactly + cinematic copy added)
// ─────────────────────────────────────────────────────────────────────────────

const EVENTS: UKVEvent[] = [
  {
    id: 'harvest-dinner-may',
    title: 'Harvest Dinner',
    subtitle: 'A five-course farm-to-table evening',
    cinematic: 'Five courses. Open fire. One long table beneath the Rift Valley sky.',
    category: 'Dining Experience',
    date: 'Last Saturday of each month',
    time: '6:30 PM',
    duration: '4 hours',
    capacity: 24,
    spotsLeft: 8,
    price: 12500,
    accent: 'var(--gold)',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=900&q=80',
      'https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=900&q=80',
      'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=900&q=80',
      'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=900&q=80',
    ],
    philosophy: 'Food is memory. Each dish arrives not just plated but provenance-narrated — the animal ID, the field row, the farmer who tended it. This is not restaurant dining. This is communion with the land.',
    spaces: [
      { name: 'The Long Table', description: 'A single 10-metre table beneath acacia boughs, set for 24 under open sky.' },
      { name: 'The Kitchen Garden', description: 'Where guests move between courses, sampling herbs and meeting the harvest crew.' },
      { name: 'The Cellar Terrace', description: 'Post-dinner, wine and fire. Stories under the stars.' },
    ],
    journey: ['Golden hour farm walk', 'Welcome drink at The Cellar Terrace', 'Five-course dinner at The Long Table', 'Moxie provenance stories between courses', 'Fire and wine to close'],
    testimonial: { quote: 'The dinner changed how I think about food. I now know the name of the cow.', author: 'Wanjiku N.', location: 'Nairobi' },
    description: 'Once a month, our chef designs a five-course menu built entirely from what was harvested that week. Guests gather around a single long table beneath the stars, and Moxie introduces each dish with its full provenance story — the animal ID, the field, the farmer.',
    includes: ['Five-course tasting menu', 'Farm-sourced wine pairing', 'Meet the farmer session', 'Moxie provenance narration', 'Farm tour at golden hour'],
  },
  {
    id: 'sunrise-farm-walk',
    title: 'Sunrise Farm Walk',
    subtitle: 'Guided walk through all fields and boma units',
    cinematic: 'The farm at dawn. Dew. Soil readings. Truth.',
    category: 'Farm Experience',
    date: 'Every Tuesday & Saturday',
    time: '6:00 AM',
    duration: '2 hours',
    capacity: 12,
    spotsLeft: 5,
    price: 2800,
    accent: 'var(--neon)',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=900&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=80',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80',
    ],
    philosophy: 'The farm at dawn holds truths the afternoon never will. Dew-heavy rows, the first readings on the soil sensors, the crew already at work. To walk it is to understand where your food actually comes from.',
    spaces: [
      { name: 'The Six Fields', description: 'Three hectares of rotating crop rows — each mapped in FarmERP to the millimetre.' },
      { name: 'The Boma Units', description: 'Where the animals sleep, eat, and are monitored. Intimate and honest.' },
      { name: 'The Breakfast Terrace', description: "Where the walk ends — farm eggs, bread from yesterday's grain, strong coffee." },
    ],
    journey: ['Meet at the main gate at 6:00 AM', 'Field walk with farm manager', 'Boma visit and animal feeding', 'FarmERP live dashboard demo', 'Farm breakfast on the terrace'],
    testimonial: { quote: "I've been to farms before. I've never felt a farm before.", author: 'Kamau T.', location: 'Nakuru' },
    description: 'The farm at dawn is unlike any other time of day. Walk through all six fields with our farm manager, visit the boma units, check the morning soil readings, and watch the harvest crew begin their work. Ends with a farm breakfast.',
    includes: ['Guided walk through all 6 fields', 'Boma unit visit', 'Live FarmERP dashboard demo', 'Farm breakfast included', 'Small group (max 12)'],
  },
  {
    id: 'ubuntu-wedding',
    title: 'Ubuntu Weddings',
    subtitle: 'Intimate farm ceremonies for up to 80 guests',
    cinematic: 'Drums. Acacias. A ceremony the land remembers.',
    category: 'Weddings',
    date: 'By arrangement',
    time: 'Full day',
    duration: 'Full day',
    capacity: 80,
    spotsLeft: 99,
    price: 0,
    accent: '#F0A8B8',
    status: 'Enquire',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80',
      'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80',
    ],
    philosophy: 'A wedding here is not an event. It is a ceremony rooted in land, ancestry, and the African idea that no person is complete without community. The living farm, the open sky, the drumming procession — they are not amenities. They are the ceremony.',
    spaces: [
      { name: 'The Acacia Court', description: 'Ceremonies beneath the canopy of our 60-year-old acacia tree. Dappled light, ancestral shade.' },
      { name: 'The Open Field', description: 'For larger gatherings. The horizon is the backdrop. The Rift Valley light, the setting.' },
      { name: 'The Glass Pavilion', description: 'Climate-controlled, panoramic. For receptions that run into the night.' },
      { name: 'Moonfire Circle', description: 'Post-ceremony fire gathering. Storytellers. Drummers. The village comes alive.' },
    ],
    journey: ['Morning bridal spa at Arohamai', 'Drumming procession to ceremony', 'Ceremony beneath the acacias', 'Farm-to-fork reception feast', 'Moonfire circle and dancing', 'Sunrise breakfast for staying guests'],
    testimonial: { quote: 'Ubuntu felt less like a venue and more like entering another world. Our guests still talk about it three years later.', author: 'Achieng & Odhiambo', location: 'Nairobi' },
    description: "Ubuntu Kreative Village is one of Kenya's most distinctive wedding venues. The living farm, the art gallery, the Arohamai Spa, and the farm-to-fork kitchen all come together to create a ceremony that is entirely, unmistakably yours.",
    includes: ['Exclusive venue hire', 'Farm-to-fork catering', 'Arohamai Spa access for bridal party', 'Accommodation for up to 24 guests', 'Dedicated Ubuntu wedding coordinator', 'Moxie as your digital wedding host'],
  },
  {
    id: 'corporate-retreat',
    title: 'Corporate Retreats',
    subtitle: 'Leadership and strategy programmes on the farm',
    cinematic: 'Strategy sessions at sunrise. Fire circles after dark. Clarity.',
    category: 'Corporate',
    date: 'By arrangement',
    time: 'Multi-day',
    duration: '2–4 days',
    capacity: 30,
    spotsLeft: 99,
    price: 0,
    accent: '#B8A9F0',
    status: 'Enquire',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80',
      'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80',
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80',
    ],
    philosophy: 'The farm is a living system of interdependence. So is your team. Ubuntu retreats place leadership questions against the reality of the soil, the weather, and the harvest — where the abstractions fall away and what remains is clarity.',
    spaces: [
      { name: 'The Strategy Loft', description: 'Open-plan, light-filled workshop space with writable walls and farm views.' },
      { name: 'The Fire Deck', description: 'Evening facilitation around the open fire. No screens. No slides. Just thinking.' },
      { name: 'The Field', description: 'Team activities take place in the working farm. The stakes are real. The lessons too.' },
    ],
    journey: ['Arrival and farm orientation', 'Morning strategy sessions', 'Field-based team challenge', 'Arohamai Spa reset', 'Evening fire facilitation', 'Farm-to-fork communal dinner', 'Sunrise reflection walk'],
    testimonial: { quote: "Our leadership team made three major decisions on this retreat that we'd been stuck on for two years. The farm does something to you.", author: 'CEO, Fintech company', location: 'Nairobi' },
    description: 'Remove your team from the office and place them inside a living, working farm system. Ubuntu retreats are designed around the philosophy of Ubuntu — that individual performance is inseparable from collective wellbeing.',
    includes: ['Workshop and strategy spaces', 'Farm team-building activities', 'Arohamai Spa access', 'All accommodation on-site', 'Farm-to-fork all meals', 'Facilitator available on request'],
  },
  {
    id: 'new-moon-fire',
    title: 'New Moon Fire Circle',
    subtitle: 'Community gathering under the African sky',
    cinematic: 'Drums. Firelight. Storytelling beneath a moonless sky.',
    category: 'Community',
    date: 'Each new moon',
    time: '7:00 PM',
    duration: '3 hours',
    capacity: 40,
    spotsLeft: 18,
    price: 1500,
    accent: '#A8D8F0',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80',
      'https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=900&q=80',
      'https://images.unsplash.com/photo-1445375011782-2384686778a0?w=900&q=80',
    ],
    philosophy: 'The new moon marks emptiness before fullness. We gather not to perform but to listen. To storytellers, to elders, to the fire itself. This is how Ubuntu has always understood community — as something you practice, not something you attend.',
    spaces: [
      { name: 'The Moonfire Circle', description: "A permanent stone fire pit at the farm's heart. Stars overhead, nothing between you and the sky." },
      { name: 'The Story Ring', description: 'Seating arranged in concentric rings. The fire is the centre. The storyteller, the spine.' },
    ],
    journey: ['Arrival at dusk', 'Farm-made food and drink', 'Storytelling opens the circle', 'Live music from community musicians', 'Elder teaching', 'Fire closes at 10:00 PM'],
    testimonial: { quote: "I drove 3 hours. I'd do it again this month.", author: 'Njeri M.', location: 'Meru' },
    description: 'On each new moon, the Ubuntu community gathers around a fire in the open field. Storytellers, musicians, and elders from surrounding communities are invited to share.',
    includes: ['Open fire gathering', 'Live storytelling and music', 'Farm food and drink', 'Open to all — guests and public', 'Guided by community elders'],
  },
  {
    id: 'school-farm-day',
    title: 'School Farm Days',
    subtitle: 'Educational farm visits for schools and groups',
    cinematic: 'Soil. Seeds. The moment a child understands where food begins.',
    category: 'Education',
    date: 'Monday–Friday by arrangement',
    time: '9:00 AM',
    duration: '5 hours',
    capacity: 40,
    spotsLeft: 99,
    price: 800,
    accent: '#A8F0D8',
    status: 'Reservation Open',
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=900&q=80',
      'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=900&q=80',
      'https://images.unsplash.com/photo-1588072432836-e10032774350?w=900&q=80',
    ],
    philosophy: "Most children never learn where food comes from. They should. Ubuntu School Days are not a trip — they are an intervention. One morning on this farm changes the relationship a child has with the earth for the rest of their life.",
    spaces: [
      { name: 'The Learning Field', description: 'Students plant, observe, and harvest. Hands in actual soil.' },
      { name: 'The Farm Kitchen', description: 'A full cooking session using what was picked that morning.' },
      { name: 'The Tech Barn', description: 'Moxie AI demonstration — how technology and farming work together.' },
    ],
    journey: ['Arrival and farm orientation', 'Guided tour of all six fields', 'Hands-on planting activity', 'Cooking session with farm produce', 'Moxie AI demonstration', 'Farm lunch — food they helped make'],
    testimonial: { quote: "My daughter has refused to waste food since. That's worth everything.", author: 'Parent, Nakuru Primary', location: 'Nakuru' },
    description: 'A full day on the Ubuntu farm for school groups. Students learn about sustainable agriculture, animal welfare, food systems, and African ecology.',
    includes: ['Full guided farm tour', 'Hands-on planting activity', 'Cooking session with farm produce', 'Moxie AI demonstration', 'Farm lunch included', 'Per student pricing'],
  },
]

const EVENT_TYPES: EventType[] = [
  {
    id: 'ev-corp', icon: '🏢', name: 'Corporate', sub: 'Retreats · Offsites · Leadership',
    price: 320000, tag: 'Corporate Event',
    image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&q=80',
    philosophy: 'Remove your team from the office and place them inside a living, working farm system. Ubuntu retreats are built on the understanding that clarity comes from context — and that the farm is the most honest context there is.',
    gallery: ['https://images.unsplash.com/photo-1552664730-d307ca884978?w=900&q=80', 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=900&q=80', 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=900&q=80'],
    spaces: [{ name: 'The Strategy Loft', description: 'Open-plan workshop space with writable walls and farm panoramas.' }, { name: 'The Fire Deck', description: 'Evening facilitation space. No screens. Just fire and honest thinking.' }, { name: 'The Working Farm', description: 'Team activities in the real environment. Interdependence made literal.' }],
    journey: ['Arrival & orientation', 'Morning strategy sessions', 'Field-based team challenge', 'Spa reset midday', 'Fire facilitation at dusk', 'Communal farm dinner'],
    includes: ['Workshop and strategy spaces', 'Farm team-building activities', 'Arohamai Spa access', 'All accommodation on-site', 'Farm-to-fork all meals', 'Facilitator on request'],
    testimonial: { quote: "We solved two years of deadlock in three days here. The farm does something to your thinking.", author: 'CEO, Fintech', location: 'Nairobi' },
  },
  {
    id: 'ev-wed', icon: '🌿', name: 'Weddings', sub: 'Ceremonies · Receptions · Honeymoons',
    price: 480000, tag: 'Private Wedding',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80',
    philosophy: 'A wedding at Ubuntu is not an event hosted at a venue. It is a ceremony woven into living land — rooted in the Ubuntu philosophy that no person is complete without community, and no celebration is real without the earth beneath it.',
    gallery: ['https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=900&q=80', 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=900&q=80', 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=900&q=80'],
    spaces: [{ name: 'The Acacia Court', description: 'Ceremony beneath our 60-year-old acacia. Dappled light, ancestral presence.' }, { name: 'The Open Field', description: 'Vast horizon. The Rift Valley light as your backdrop.' }, { name: 'Moonfire Circle', description: 'Post-ceremony fire gathering with drummers and storytellers.' }],
    journey: ['Morning bridal spa', 'Drumming procession', 'Ceremony beneath the acacias', 'Farm-to-fork feast', 'Moonfire circle', 'Sunrise breakfast'],
    includes: ['Exclusive venue hire', 'Farm-to-fork catering', 'Arohamai Spa for bridal party', 'Accommodation for 24 guests', 'Wedding coordinator', 'Moxie as digital host'],
    testimonial: { quote: 'Ubuntu felt less like a venue and more like entering another world. Our guests still talk about it.', author: 'Achieng & Odhiambo', location: 'Nairobi' },
  },
  {
    id: 'ev-art', icon: '🎨', name: 'Creative', sub: 'Residencies · Workshops · Collabs',
    price: 85000, tag: 'Creative Residency',
    image: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=600&q=80',
    philosophy: "The farm is creative space. Something about the rhythm of the land — the seasons, the soil, the animals — resets the artist's attention. Ubuntu creative residencies are deliberately unstructured. The farm tells you what to make.",
    gallery: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=900&q=80', 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=900&q=80', 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=900&q=80'],
    spaces: [{ name: 'The Art Barn', description: 'A converted barn with north light and complete silence. For making.' }, { name: 'The Gallery', description: 'For showing. Rotating exhibitions of resident work.' }, { name: 'The Field Studio', description: 'Working outdoors. The farm as medium.' }],
    journey: ['Arrival and space orientation', 'Morning farm walk for inspiration', 'Unstructured studio time', 'Communal lunch', 'Critique or collaboration session', 'Evening farm dinner'],
    includes: ['Studio space access', 'Gallery exhibition slot', 'Farm accommodation', 'All meals on-site', 'Farm access at all hours', 'Artist cohort curation'],
    testimonial: { quote: 'I made more honest work in one week here than in a year in my studio.', author: 'Waweru A.', location: 'Nairobi' },
  },
  {
    id: 'ev-cult', icon: '🥁', name: 'Community', sub: 'Cultural Events · Rituals · Gatherings',
    price: 55000, tag: 'Community Gathering',
    image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
    philosophy: 'Ubuntu has always meant the same thing: I am because we are. Community gatherings here are not performances of culture — they are culture, practiced. With elders, storytellers, fire, and the land itself as witness.',
    gallery: ['https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=900&q=80', 'https://images.unsplash.com/photo-1543968996-ee822b8176ba?w=900&q=80', 'https://images.unsplash.com/photo-1445375011782-2384686778a0?w=900&q=80'],
    spaces: [{ name: 'The Moonfire Circle', description: "Stone fire pit at the farm's heart. Open sky. Nothing between you and the stars." }, { name: 'The Story Ring', description: 'Concentric seating around the fire. The storyteller at the centre.' }, { name: 'The Open Field', description: 'For larger gatherings — cultural festivals, community markets, music events.' }],
    journey: ['Arrival at dusk', 'Farm food and welcome drinks', 'Storytelling opens the circle', 'Music and community performance', 'Elder teaching', 'Fire closes at 10:00 PM'],
    includes: ['Moonfire Circle exclusive use', 'Community facilitator', 'Farm-made food and drink', 'Elder or storyteller curation', 'Open to guests and public', 'Sound system on request'],
    testimonial: { quote: 'I came as a stranger. I left as part of something.', author: 'Njeri M.', location: 'Meru' },
  },
]

const CATEGORY_COLORS: Record<string, string> = {
  'Dining Experience': 'var(--gold)',
  'Farm Experience':   'var(--neon)',
  'Weddings':          '#F0A8B8',
  'Corporate':         '#B8A9F0',
  'Community':         '#A8D8F0',
  'Education':         '#A8F0D8',
}

// Per-category atmosphere configs — each category has its own visual universe
const CATEGORY_ATMOSPHERE: Record<string, {
  gradient: string
  particle: string
  glow: string
  texture: string
}> = {
  'Dining Experience': {
    gradient: 'radial-gradient(ellipse 70% 50% at 30% 60%, rgba(212,168,83,0.18) 0%, transparent 65%)',
    particle: '#D4A853',
    glow: 'rgba(212,168,83,0.22)',
    texture: 'grain-gold',
  },
  'Farm Experience': {
    gradient: 'radial-gradient(ellipse 70% 50% at 30% 60%, rgba(0,255,65,0.10) 0%, transparent 65%)',
    particle: '#00FF41',
    glow: 'rgba(0,255,65,0.14)',
    texture: 'grain-neon',
  },
  'Weddings': {
    gradient: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(240,168,184,0.16) 0%, transparent 65%)',
    particle: '#F0A8B8',
    glow: 'rgba(240,168,184,0.18)',
    texture: 'grain-rose',
  },
  'Corporate': {
    gradient: 'radial-gradient(ellipse 70% 50% at 20% 50%, rgba(184,169,240,0.14) 0%, transparent 65%)',
    particle: '#B8A9F0',
    glow: 'rgba(184,169,240,0.16)',
    texture: 'grain-violet',
  },
  'Community': {
    gradient: 'radial-gradient(ellipse 70% 50% at 60% 60%, rgba(168,216,240,0.14) 0%, transparent 65%)',
    particle: '#A8D8F0',
    glow: 'rgba(168,216,240,0.16)',
    texture: 'grain-blue',
  },
  'Education': {
    gradient: 'radial-gradient(ellipse 70% 50% at 40% 50%, rgba(168,240,216,0.12) 0%, transparent 65%)',
    particle: '#A8F0D8',
    glow: 'rgba(168,240,216,0.14)',
    texture: 'grain-mint',
  },
  'All': {
    gradient: 'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(30,16,44,0.7) 0%, transparent 60%)',
    particle: '#D4A853',
    glow: 'rgba(212,168,83,0.10)',
    texture: 'grain-gold',
  },
}

// ─────────────────────────────────────────────────────────────────────────────
// CURSOR GLOW HOOK (original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function useCursorGlow() {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  useEffect(() => {
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])
  return pos
}

// ─────────────────────────────────────────────────────────────────────────────
// SCROLL WEIGHT HOOK (original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function useScrollWeight() {
  const { scrollY } = useScroll()
  const fontWeight = useTransform(scrollY, [0, 600], [300, 380])
  const letterSpacing = useTransform(scrollY, [0, 600], [-0.01, 0.02])
  return { fontWeight, letterSpacing }
}

// ─────────────────────────────────────────────────────────────────────────────
// PRIMITIVES (all original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function Eyebrow({ children, color = 'rgba(255,255,255,0.28)', style }: { children: React.ReactNode; color?: string; style?: React.CSSProperties }) {
  return (
    <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase' as const, color, ...style }}>
      {children}
    </span>
  )
}

function AccentLine({ color }: { color: string }) {
  return <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 1, background: `linear-gradient(90deg, transparent, ${color}, transparent)`, opacity: 0.55 }} />
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: MAGNETIC BUTTON — cursor-reactive luxury interaction
// ─────────────────────────────────────────────────────────────────────────────
function MagneticButton({
  children,
  onClick,
  style,
  className,
  disabled,
}: {
  children: React.ReactNode
  onClick?: (e: React.MouseEvent) => void
  style?: React.CSSProperties
  className?: string
  disabled?: boolean
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)

  function handleMove(e: React.MouseEvent<HTMLButtonElement>) {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    setOffset({
      x: (e.clientX - cx) * 0.22,
      y: (e.clientY - cy) * 0.22,
    })
  }

  return (
    <motion.button
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setOffset({ x: 0, y: 0 }) }}
      animate={{
        x: hovered ? offset.x : 0,
        y: hovered ? offset.y : 0,
        scale: hovered ? 1.04 : 1,
      }}
      transition={{ type: 'spring', stiffness: 280, damping: 22 }}
      onClick={onClick}
      disabled={disabled}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        ...style,
      }}
    >
      {/* Shimmer sweep on hover */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: '200%', opacity: [0, 0.18, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.3) 50%, transparent 60%)',
              pointerEvents: 'none',
            }}
          />
        )}
      </AnimatePresence>
      {children}
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: AMBIENT PARTICLES — per-category floating particles
// ─────────────────────────────────────────────────────────────────────────────
function AmbientParticles({ color, count = 18 }: { color: string; count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: ['0%', '-130%'], opacity: [0, 0.55, 0] }}
          transition={{
            duration: 10 + (i % 7) * 1.4,
            repeat: Infinity,
            ease: 'linear',
            delay: i * 0.48,
          }}
          style={{
            position: 'absolute',
            bottom: `${(i % 5) * 5}%`,
            left: `${(i / count) * 100}%`,
            width: i % 4 === 0 ? 2 : 1,
            height: i % 4 === 0 ? 2 : 1,
            borderRadius: '50%',
            background: color,
            boxShadow: `0 0 4px ${color}`,
          }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: CINEMATIC VIDEO PANEL — the "thinking outside the box" moment
// A fullscreen video window that slides in from the right on hero,
// with a film-strip overlay, scan lines, and a "now showing" indicator.
// Uses a nature/farm Unsplash video-style background (no external video file needed).
// ─────────────────────────────────────────────────────────────────────────────
function CinematicVideoPanel({ visible }: { visible: boolean }) {
  // We create a cinematic "video" effect using CSS animation on
  // a high-quality Unsplash image with a slow Ken Burns zoom,
  // film grain, scan lines, and a colour-shift animation.
  // This gives the feel of a video without requiring an actual file.
  const images = [
    'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=90',
    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=90',
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=1200&q=90',
  ]
  const [frame, setFrame] = useState(0)

  useEffect(() => {
    if (!visible) return
    const t = setInterval(() => setFrame(f => (f + 1) % images.length), 5000)
    return () => clearInterval(t)
  }, [visible])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ x: '100%', opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: '100%', opacity: 0 }}
          transition={{ type: 'spring', stiffness: 120, damping: 28, delay: 0.3 }}
          style={{
            position: 'absolute',
            top: '10%', right: 0,
            width: 'clamp(320px, 42vw, 620px)',
            height: '78%',
            overflow: 'hidden',
            borderRadius: '24px 0 0 24px',
            zIndex: 3,
          }}
        >
          {/* Film-strip side bars */}
          <div style={{
            position: 'absolute', top: 0, left: 0, bottom: 0, width: 20, zIndex: 10,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 12, gap: 10,
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
            ))}
          </div>
          <div style={{
            position: 'absolute', top: 0, right: 0, bottom: 0, width: 20, zIndex: 10,
            background: 'rgba(0,0,0,0.9)',
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            paddingTop: 12, gap: 10,
          }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ width: 10, height: 8, background: 'rgba(255,255,255,0.12)', borderRadius: 2 }} />
            ))}
          </div>

          {/* Main image with Ken Burns zoom */}
          <AnimatePresence mode="crossfade">
            <motion.img
              key={frame}
              src={images[frame]}
              initial={{ scale: 1.12, opacity: 0 }}
              animate={{ scale: 1.0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 5, ease: 'linear' }}
              style={{
                width: '100%', height: '100%',
                objectFit: 'cover', display: 'block',
                filter: 'saturate(0.7) contrast(1.1)',
              }}
            />
          </AnimatePresence>

          {/* Scan lines overlay */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 6,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.08) 2px, rgba(0,0,0,0.08) 4px)',
          }} />

          {/* Film grain */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 7,
            opacity: 0.045, mixBlendMode: 'overlay',
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
          }} />

          {/* Colour grade vignette */}
          <div style={{
            position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 8,
            background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)',
          }} />

          {/* "NOW SHOWING" indicator */}
          <div style={{
            position: 'absolute', top: 18, left: 28, zIndex: 12,
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <motion.span
              animate={{ opacity: [1, 0, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4444', display: 'block', boxShadow: '0 0 8px #FF4444' }}
            />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
              Now Showing
            </span>
          </div>

          {/* Frame counter */}
          <div style={{
            position: 'absolute', bottom: 18, right: 28, zIndex: 12,
            fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255,255,255,0.3)',
            letterSpacing: '0.12em',
          }}>
            {String(frame + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
          </div>

          {/* Bottom caption strip */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 12,
            padding: '20px 28px 16px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)',
          }}>
            <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, color: 'rgba(255,255,255,0.72)', fontStyle: 'italic' }}>
              Ubuntu Kreative Village
            </p>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginTop: 2 }}>
              Kenya · {new Date().getFullYear()}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// NEW: LIVE EVENT TICKER — floating rail of upcoming events
// ─────────────────────────────────────────────────────────────────────────────
function LiveEventTicker() {
  const upcoming = EVENTS.filter(e => e.status === 'Reservation Open' && e.spotsLeft < 20)

  if (upcoming.length === 0) return null

  // Duplicate for infinite marquee
  const items = [...upcoming, ...upcoming, ...upcoming]

  return (
    <div style={{
      width: '100%', overflow: 'hidden',
      background: 'rgba(0,0,0,0.4)',
      backdropFilter: 'blur(12px)',
      borderTop: '1px solid rgba(255,255,255,0.05)',
      borderBottom: '1px solid rgba(255,255,255,0.05)',
      padding: '10px 0',
    }}>
      <motion.div
        animate={{ x: ['0%', '-33.33%'] }}
        transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
        style={{ display: 'flex', gap: 0, whiteSpace: 'nowrap', width: 'max-content' }}
      >
        {items.map((event, i) => {
          const catColor = CATEGORY_COLORS[event.category] || event.accent
          const colorResolved = catColor === 'var(--gold)' ? '#D4A853' : catColor === 'var(--neon)' ? '#00FF41' : catColor
          return (
            <span key={`${event.id}-${i}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 20, padding: '0 40px' }}>
              <span style={{
                width: 5, height: 5, borderRadius: '50%', background: colorResolved,
                boxShadow: `0 0 6px ${colorResolved}`, flexShrink: 0, display: 'inline-block',
              }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', color: colorResolved }}>
                {event.category}
              </span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '12px', fontWeight: 300, color: 'rgba(255,255,255,0.75)' }}>
                {event.title}
              </span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>
                {event.date} · {event.time}
              </span>
              <span style={{
                padding: '2px 8px', borderRadius: 20,
                background: event.spotsLeft <= 3 ? 'rgba(240,168,184,0.12)' : 'rgba(255,255,255,0.05)',
                border: `1px solid ${event.spotsLeft <= 3 ? 'rgba(240,168,184,0.35)' : 'rgba(255,255,255,0.1)'}`,
                fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.1em',
                color: event.spotsLeft <= 3 ? '#F0A8B8' : 'rgba(255,255,255,0.35)',
              }}>
                {event.spotsLeft} spots
              </span>
              <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '8px' }}>◆</span>
            </span>
          )
        })}
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// LIVE SPOT COUNT (original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function LiveSpotCount({ initial, accent }: { initial: number; accent: string }) {
  const [count, setCount] = useState(initial)
  const [flash, setFlash] = useState(false)

  useEffect(() => {
    if (initial >= 20) return
    const interval = setInterval(() => {
      if (Math.random() > 0.7 && count > 1) {
        setCount(c => c - 1)
        setFlash(true)
        setTimeout(() => setFlash(false), 800)
      }
    }, 45000 + Math.random() * 30000)
    return () => clearInterval(interval)
  }, [count, initial])

  if (initial >= 20) return null

  return (
    <motion.div
      animate={{ scale: flash ? [1, 1.08, 1] : 1 }}
      transition={{ duration: 0.4 }}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 5,
        padding: '3px 9px', borderRadius: 20,
        background: count <= 3 ? 'rgba(240,168,184,0.08)' : `${accent}08`,
        border: `1px solid ${count <= 3 ? 'rgba(240,168,184,0.25)' : `${accent}22`}`,
      }}
    >
      <motion.span
        key={count}
        initial={{ y: -4, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 300, color: count <= 3 ? '#F0A8B8' : accent }}
      >
        {count}
      </motion.span>
      <Eyebrow color={count <= 3 ? '#F0A8B8' : 'rgba(255,255,255,0.3)'}>spots left</Eyebrow>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY STRIP (original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function GalleryStrip({ images, accent }: { images: string[]; accent: string }) {
  const [active, setActive] = useState(0)
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <AnimatePresence mode="wait">
        <motion.img
          key={active}
          src={images[active]}
          alt=""
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      </AnimatePresence>

      {images.length > 1 && (
        <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 6 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              style={{
                width: i === active ? 32 : 22, height: 4, borderRadius: 2, border: 'none', cursor: 'pointer',
                background: i === active ? accent : 'rgba(255,255,255,0.3)',
                transition: 'all 0.3s ease', padding: 0,
              }}
            />
          ))}
        </div>
      )}

      {images.length > 1 && <>
        <button onClick={() => setActive(a => (a - 1 + images.length) % images.length)} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, backdropFilter: 'blur(8px)' }}>‹</button>
        <button onClick={() => setActive(a => (a + 1) % images.length)} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, backdropFilter: 'blur(8px)' }}>›</button>
      </>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// RESERVATION DRAWER (original preserved + magnetic button upgrade)
// ─────────────────────────────────────────────────────────────────────────────
function ReservationDrawer({ event, onClose, catColor }: { event: UKVEvent | (EventType & { status?: string }); onClose: () => void; catColor: string }) {
  const { items, addItem } = useCartStore()
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)

  const isEvent = 'status' in event && event.status !== undefined
  const price = event.price
  const id = event.id
  const name = 'title' in event ? event.title : event.name
  const category = 'category' in event ? event.category : event.tag
  const status = 'status' in event ? (event as UKVEvent).status : 'Enquire'
  const alreadyInCart = items.some(i => i.id === id)

  function handleBook() {
    if (status === 'Enquire') { window.location.href = '/contact'; return }
    if (alreadyInCart) { toast('Already in your Reservation', { icon: '✦' }); onClose(); return }
    if ('vibrate' in navigator) navigator.vibrate(12)
    for (let i = 0; i < qty; i++) addItem({ id, name, tag: category, category: 'event', price, unit: '/person' })
    setJustAdded(true)
    setTimeout(() => { toast.success(`${name} added to your cart`); onClose() }, 600)
  }

  return (
    <div style={{
      padding: '28px',
      background: 'rgba(6,9,4,0.98)',
      borderTop: `1px solid ${catColor}18`,
      display: 'flex', flexDirection: 'column', gap: 18,
    }}>
      <div>
        <Eyebrow style={{ display: 'block', marginBottom: 6, letterSpacing: '0.18em' }}>Pricing</Eyebrow>
        {price > 0 ? (
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.2rem', fontWeight: 300, color: catColor }}>
              KES {price.toLocaleString()}
            </span>
            <Eyebrow style={{ color: 'rgba(255,255,255,0.22)' }}>/ person</Eyebrow>
          </div>
        ) : (
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'rgba(255,255,255,0.32)', fontWeight: 300 }}>
            Pricing on enquiry
          </span>
        )}
      </div>

      {status === 'Reservation Open' && price > 0 && (
        <div>
          <Eyebrow style={{ display: 'block', marginBottom: 8 }}>Number of guests</Eyebrow>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, overflow: 'hidden' }}>
              <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 38, height: 38, background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: catColor, minWidth: 32, textAlign: 'center' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} style={{ width: 38, height: 38, background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
            </div>
            <Eyebrow style={{ color: 'rgba(255,255,255,0.22)', letterSpacing: '0.1em' }}>
              Total: KES {(price * qty).toLocaleString()}
            </Eyebrow>
          </div>
        </div>
      )}

      {/* Upgraded to MagneticButton */}
      <MagneticButton
        onClick={handleBook}
        style={{
          width: '100%', padding: '15px 0', borderRadius: 10,
          background: justAdded
            ? 'rgba(0,255,65,0.12)'
            : alreadyInCart && price > 0
            ? 'rgba(0,255,65,0.1)'
            : status === 'Enquire'
            ? `linear-gradient(135deg, ${catColor}cc, ${catColor}88)`
            : 'linear-gradient(135deg, #f6d47a 0%, var(--gold) 45%, #8b6b25 100%)',
          border: (justAdded || alreadyInCart) ? '1px solid rgba(0,255,65,0.28)' : '1px solid transparent',
          color: (justAdded || alreadyInCart) ? 'var(--neon)' : 'var(--obsidian)',
          fontFamily: 'var(--font-body)', fontSize: '10px',
          letterSpacing: '0.18em', textTransform: 'uppercase' as const,
          fontWeight: 700,
          boxShadow: justAdded || alreadyInCart
            ? 'none'
            : `0 0 24px rgba(212,168,83,0.22), 0 0 80px rgba(212,168,83,0.08)`,
        }}
      >
        {justAdded ? '✓ Reserved' : status === 'Enquire' ? 'Send Enquiry →' : alreadyInCart ? '✓ Already Reserved' : `Reserve ${qty > 1 ? qty + ' Spots' : 'Your Spot'}`}
      </MagneticButton>

      {status === 'Reservation Open' && !alreadyInCart && !justAdded && (
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '9px', color: 'rgba(255,255,255,0.14)', textAlign: 'center', letterSpacing: '0.08em', lineHeight: 1.7, marginTop: -8 }}>
          Instant confirmation · Full refund up to 48 hrs before event
        </p>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EXPERIENCE MODAL (original preserved + atmosphere upgrade)
// ─────────────────────────────────────────────────────────────────────────────
function ExperienceModal({ event, onClose, accent, layoutId }: { event: UKVEvent | EventType; onClose: () => void; accent: string; layoutId?: string }) {
  const [isMobile, setIsMobile] = useState(false)
  const [activeTab, setActiveTab] = useState<'story' | 'spaces' | 'journey'>('story')

  const isUKVEvent = 'status' in event
  const name = isUKVEvent ? (event as UKVEvent).title : (event as EventType).name
  const subtitle = isUKVEvent ? (event as UKVEvent).subtitle : (event as EventType).sub
  const images = (event.gallery && event.gallery.length > 0) ? event.gallery : [event.image]
  const category = isUKVEvent ? (event as UKVEvent).category : (event as EventType).tag
  const date = isUKVEvent ? (event as UKVEvent).date : 'By arrangement'
  const duration = isUKVEvent ? (event as UKVEvent).duration : 'Multi-day'
  const capacity = isUKVEvent ? (event as UKVEvent).capacity : 80
  const spotsLeft = isUKVEvent ? (event as UKVEvent).spotsLeft : 99
  const description = isUKVEvent ? (event as UKVEvent).description : (event as EventType).philosophy || ''

  const catAtm = CATEGORY_ATMOSPHERE[category] || CATEGORY_ATMOSPHERE['All']
  const accentResolved = accent === 'var(--gold)' ? '#D4A853' : accent === 'var(--neon)' ? '#00FF41' : accent

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check(); window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc) }
  }, [onClose])

  const tabs = [
    { id: 'story' as const, label: 'Story' },
    event.spaces?.length ? { id: 'spaces' as const, label: 'Spaces' } : null,
    event.journey?.length ? { id: 'journey' as const, label: 'Journey' } : null,
  ].filter(Boolean) as { id: 'story' | 'spaces' | 'journey'; label: string }[]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(2,4,1,0.92)',
        backdropFilter: 'blur(22px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: isMobile ? 0 : '20px',
      }}
      onClick={onClose}
    >
      <motion.div
        layoutId={layoutId}
        initial={!layoutId ? { y: 24, scale: 0.98, opacity: 0 } : undefined}
        animate={{ y: 0, scale: 1, opacity: 1 }}
        exit={!layoutId ? { y: 16, scale: 0.98, opacity: 0 } : undefined}
        transition={{ type: 'spring', stiffness: 280, damping: 32 }}
        style={{
          width: '100%', maxWidth: 1100,
          borderRadius: isMobile ? 0 : 20,
          overflow: 'hidden',
          maxHeight: isMobile ? '100vh' : '94vh',
          overflowY: 'auto',
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          background: `${catAtm.gradient}, rgba(6,9,4,0.99)`,
          border: `1px solid ${accentResolved}18`,
          boxShadow: `0 60px 120px rgba(0,0,0,0.9), 0 0 0 1px ${accentResolved}0d, 0 0 80px ${catAtm.glow}`,
          position: 'relative',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Category atmosphere particles inside modal */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }} aria-hidden>
          <AmbientParticles color={catAtm.particle} count={12} />
        </div>

        {/* Left: Gallery */}
        <div style={{ position: 'relative', minHeight: isMobile ? 320 : 0, display: 'flex', flexDirection: 'column', zIndex: 1 }}>
          <div style={{ position: 'relative', flex: isMobile ? '0 0 320px' : '1', minHeight: isMobile ? 320 : 400 }}>
            <motion.div layoutId={layoutId ? `${layoutId}-img` : undefined} style={{ width: '100%', height: '100%' }}>
              <GalleryStrip images={images} accent={accentResolved} />
            </motion.div>

            <div style={{
              position: 'absolute', inset: 0, pointerEvents: 'none',
              background: isMobile
                ? 'linear-gradient(to bottom, rgba(0,0,0,0.1) 30%, rgba(6,9,4,0.95) 100%)'
                : 'linear-gradient(to bottom, rgba(0,0,0,0.08) 40%, rgba(6,9,4,0.92) 100%)',
            }} />

            <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, backdropFilter: 'blur(8px)', zIndex: 10 }}>✕</button>

            <div style={{ position: 'absolute', top: 16, left: 16, zIndex: 10, padding: '4px 12px', borderRadius: 20, background: `${accentResolved}1a`, border: `1px solid ${accentResolved}44`, color: accentResolved, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>
              {category}
            </div>

            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '28px 24px 20px', background: 'linear-gradient(to top, rgba(6,9,4,1) 0%, transparent 100%)' }}>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: isMobile ? '2rem' : '2.6rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.08, marginBottom: 5 }}>
                {name}
              </h2>
              <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.6 }}>{subtitle}</p>
            </div>
          </div>

          <div style={{ background: 'rgba(6,9,4,1)', padding: '16px 24px', display: 'flex', gap: 20, flexWrap: 'wrap', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
            {[{ label: 'Date', value: date }, { label: 'Duration', value: duration }, { label: 'Capacity', value: `${capacity} guests` }, { label: 'Availability', value: spotsLeft >= 99 ? 'Open' : `${spotsLeft} remaining` }].map(m => (
              <div key={m.label}>
                <Eyebrow style={{ display: 'block', marginBottom: 3, letterSpacing: '0.16em' }}>{m.label}</Eyebrow>
                <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.52)' }}>{m.value}</span>
              </div>
            ))}
          </div>

          {isUKVEvent && (event as UKVEvent).spotsLeft < 20 && (event as UKVEvent).status === 'Reservation Open' && (
            <div style={{ padding: '0 24px 16px' }}>
              <LiveSpotCount initial={(event as UKVEvent).spotsLeft} accent={accentResolved} />
            </div>
          )}
        </div>

        {/* Right: Story */}
        <div style={{ display: 'flex', flexDirection: 'column', borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.04)', maxHeight: isMobile ? 'none' : '94vh', overflowY: 'auto', position: 'relative', zIndex: 1 }}>

          {tabs.length > 1 && (
            <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.05)', position: 'sticky', top: 0, background: 'rgba(6,9,4,0.98)', zIndex: 2 }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ flex: 1, padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.16em', textTransform: 'uppercase', color: activeTab === tab.id ? accentResolved : 'rgba(255,255,255,0.25)', borderBottom: activeTab === tab.id ? `2px solid ${accentResolved}` : '2px solid transparent', transition: 'all 0.2s' }}>
                  {tab.label}
                </button>
              ))}
            </div>
          )}

          <div style={{ padding: '28px', flex: 1 }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22 }}
              >
                {activeTab === 'story' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                    {event.philosophy && (
                      <div>
                        <Eyebrow style={{ display: 'block', marginBottom: 12, letterSpacing: '0.2em' }}>The Philosophy</Eyebrow>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.95, fontStyle: 'italic' }}>{event.philosophy}</p>
                      </div>
                    )}
                    <div>
                      <Eyebrow style={{ display: 'block', marginBottom: 10, letterSpacing: '0.2em' }}>About This Experience</Eyebrow>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>{description}</p>
                    </div>
                    {event.includes && event.includes.length > 0 && (
                      <div>
                        <Eyebrow style={{ display: 'block', marginBottom: 12, letterSpacing: '0.2em' }}>What&apos;s Included</Eyebrow>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                          {event.includes.map((inc: string, i: number) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                              <span style={{ color: accentResolved, fontSize: 8, marginTop: 3, flexShrink: 0 }}>▸</span>
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: 'rgba(255,255,255,0.48)', lineHeight: 1.65 }}>{inc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {event.testimonial && (
                      <div style={{ padding: '20px', borderRadius: 12, background: `${accentResolved}08`, border: `1px solid ${accentResolved}18` }}>
                        <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, color: 'rgba(255,255,255,0.6)', lineHeight: 1.75, fontStyle: 'italic', marginBottom: 12 }}>
                          &ldquo;{event.testimonial.quote}&rdquo;
                        </p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <span style={{ display: 'block', width: 20, height: '1px', background: accentResolved, opacity: 0.5 }} />
                          <Eyebrow style={{ color: accentResolved }}>{event.testimonial.author}, {event.testimonial.location}</Eyebrow>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'spaces' && event.spaces && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <Eyebrow style={{ display: 'block', marginBottom: 4, letterSpacing: '0.2em' }}>Signature Spaces</Eyebrow>
                    {event.spaces.map((space, i) => (
                      <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }} style={{ padding: '16px 18px', borderRadius: 10, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                          <span style={{ color: accentResolved, fontSize: 8 }}>◆</span>
                          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 300, color: 'var(--cream)' }}>{space.name}</span>
                        </div>
                        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.38)', lineHeight: 1.75, paddingLeft: 18 }}>{space.description}</p>
                      </motion.div>
                    ))}
                  </div>
                )}

                {activeTab === 'journey' && event.journey && (
                  <div>
                    <Eyebrow style={{ display: 'block', marginBottom: 16, letterSpacing: '0.2em' }}>The Experience Journey</Eyebrow>
                    <div style={{ position: 'relative' }}>
                      <div style={{ position: 'absolute', left: 9, top: 8, bottom: 8, width: 1, background: `linear-gradient(to bottom, ${accentResolved}60, transparent)` }} />
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {event.journey.map((step, i) => (
                          <motion.div key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }} style={{ display: 'flex', gap: 16, paddingBottom: i === event.journey!.length - 1 ? 0 : 20 }}>
                            <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, background: i === 0 ? accentResolved : 'rgba(255,255,255,0.06)', border: `1px solid ${i === 0 ? accentResolved : 'rgba(255,255,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1 }}>
                              <span style={{ fontFamily: 'var(--font-body)', fontSize: '7px', color: i === 0 ? 'var(--obsidian)' : 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{i + 1}</span>
                            </div>
                            <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: i === 0 ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.38)', lineHeight: 1.65, paddingTop: 1 }}>{step}</p>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <div style={{ position: 'sticky', bottom: 0, zIndex: 5 }}>
            <ReservationDrawer event={event as UKVEvent} onClose={onClose} catColor={accentResolved} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT CARD (original preserved + atmosphere + magnetic CTA)
// ─────────────────────────────────────────────────────────────────────────────
function EventCard({ event, onOpenModal }: { event: UKVEvent; onOpenModal: (e: UKVEvent) => void }) {
  const { items, addItem } = useCartStore()
  const [hovered, setHovered] = useState(false)
  const catColor = CATEGORY_COLORS[event.category] || event.accent
  const catColorResolved = catColor === 'var(--gold)' ? '#D4A853' : catColor === 'var(--neon)' ? '#00FF41' : catColor
  const inCart = items.some(i => i.id === event.id)
  const layoutId = `event-card-${event.id}`
  const catAtm = CATEGORY_ATMOSPHERE[event.category] || CATEGORY_ATMOSPHERE['All']

  function handleQuickAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (event.status === 'Enquire') { onOpenModal(event); return }
    if (inCart) { toast('Already in your Reservation', { icon: '✦' }); return }
    if ('vibrate' in navigator) navigator.vibrate(10)
    addItem({ id: event.id, name: event.title, tag: event.category, category: 'event', price: event.price, unit: '/person' })
    toast.success(`${event.title} added`)
  }

  return (
    <motion.div
      layoutId={layoutId}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        display: 'flex', flexDirection: 'column',
        background: 'rgba(255,255,255,0.015)',
        border: inCart ? '1px solid rgba(0,255,65,0.22)' : hovered ? `1px solid ${catColorResolved}38` : '1px solid rgba(255,255,255,0.04)',
        borderRadius: 14,
        boxShadow: inCart
          ? `0 0 0 1px rgba(0,255,65,0.06), 0 12px 40px rgba(0,255,65,0.04)`
          : hovered
          ? `0 24px 56px rgba(0,0,0,0.45), 0 0 0 1px ${catColorResolved}12, 0 0 60px ${catAtm.glow}`
          : '0 4px 16px rgba(0,0,0,0.14)',
      }}
      animate={{ y: hovered ? -4 : 0, transition: { duration: 0.25 } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpenModal(event)}
    >
      <AccentLine color={catColorResolved} />

      {/* Per-category ambient atmosphere */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            style={{
              position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
              background: catAtm.gradient,
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0 }}>
        <motion.img
          layoutId={`${layoutId}-img`}
          src={event.image}
          alt={event.title}
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.06)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.23,1,0.32,1)',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.04) 0%, rgba(12,16,9,0.82) 100%)' }} />

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.35 }}
              style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse 60% 40% at 30% 70%, ${catColorResolved}0e, transparent 65%)`, pointerEvents: 'none' }}
            />
          )}
        </AnimatePresence>

        <div style={{ position: 'absolute', top: 10, left: 10 }}>
          <span style={{ padding: '3px 9px', borderRadius: 20, background: `${catColorResolved}18`, border: `1px solid ${catColorResolved}40`, color: catColorResolved, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            {event.category}
          </span>
        </div>
        <div style={{ position: 'absolute', top: 10, right: 10 }}>
          <span style={{ padding: '3px 9px', borderRadius: 20, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase', color: event.status === 'Reservation Open' ? 'var(--neon)' : 'var(--gold)', background: event.status === 'Reservation Open' ? 'rgba(0,255,65,0.08)' : 'rgba(212,168,83,0.08)', border: event.status === 'Reservation Open' ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(212,168,83,0.2)' }}>
            {event.status === 'Reservation Open' ? '● Open' : '◷ Enquire'}
          </span>
        </div>

        {inCart && (
          <div style={{ position: 'absolute', bottom: 10, left: 10, padding: '3px 9px', borderRadius: 20, background: 'rgba(0,255,65,0.1)', border: '1px solid rgba(0,255,65,0.25)', color: 'var(--neon)', fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            ✓ Added
          </div>
        )}

        {event.spotsLeft < 20 && event.status === 'Reservation Open' && (
          <div style={{ position: 'absolute', bottom: 10, right: 10 }}>
            <LiveSpotCount initial={event.spotsLeft} accent={catColorResolved} />
          </div>
        )}

        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}
            >
              <div style={{ padding: '8px 16px', borderRadius: 20, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(10px)', border: `1px solid ${catColorResolved}30`, fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: catColorResolved }}>
                View Experience ↗
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div style={{ padding: '22px 20px 18px', display: 'flex', flexDirection: 'column', flex: 1, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
          <Eyebrow>{event.date}</Eyebrow>
          <Eyebrow>· {event.time}</Eyebrow>
        </div>

        <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.15, marginBottom: 6 }}>
          {event.title}
        </h3>

        {/* Cinematic short copy replaces subtitle */}
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: catColorResolved, marginBottom: 10, lineHeight: 1.5, fontStyle: 'italic', opacity: 0.8 }}>
          {event.cinematic || event.subtitle}
        </p>

        <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, marginBottom: 18, flex: 1, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>
          {event.philosophy || event.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 14, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <div>
            {event.price > 0 ? (
              <>
                <Eyebrow style={{ display: 'block', marginBottom: 2 }}>per person</Eyebrow>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.35rem', fontWeight: 300, color: catColorResolved }}>
                  KES {event.price.toLocaleString()}
                </span>
              </>
            ) : (
              <Eyebrow style={{ color: 'rgba(255,255,255,0.28)' }}>Pricing on enquiry</Eyebrow>
            )}
          </div>
          <div style={{ display: 'flex', gap: 7 }}>
            <button onClick={e => { e.stopPropagation(); onOpenModal(event) }} style={{ padding: '8px 14px', borderRadius: 7, border: '1px solid rgba(255,255,255,0.09)', background: 'transparent', color: 'rgba(255,255,255,0.38)', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}>
              Explore
            </button>
            <MagneticButton
              onClick={handleQuickAdd}
              style={{
                padding: '8px 14px', borderRadius: 7,
                background: inCart ? 'rgba(0,255,65,0.1)' : `linear-gradient(135deg, #f6d47a 0%, var(--gold) 45%, #8b6b25 100%)`,
                border: inCart ? '1px solid rgba(0,255,65,0.26)' : '1px solid transparent',
                color: inCart ? 'var(--neon)' : 'var(--obsidian)',
                fontFamily: 'var(--font-body)', fontSize: '9px',
                letterSpacing: '0.1em', textTransform: 'uppercase' as const,
                fontWeight: 600,
                boxShadow: inCart ? 'none' : '0 0 16px rgba(212,168,83,0.18)',
              }}
            >
              {event.status === 'Enquire' ? 'Enquire' : inCart ? '✓ Added' : '+ Book'}
            </MagneticButton>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENT TYPE TILE (original preserved + atmosphere)
// ─────────────────────────────────────────────────────────────────────────────
function EventTypeTile({ ev, onOpenExperience }: { ev: EventType; onOpenExperience: (ev: EventType) => void }) {
  const { items, addItem } = useCartStore()
  const [hovered, setHovered] = useState(false)
  const inCart = items.some(i => i.id === ev.id)

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (inCart) { toast('Already in your Reservation', { icon: '✦' }); return }
    if ('vibrate' in navigator) navigator.vibrate(10)
    addItem({ id: ev.id, name: ev.name, tag: ev.tag, category: 'event-package', price: ev.price, unit: '/ event' })
    toast.success(`${ev.name} event added — our team will be in touch`)
  }

  return (
    <motion.div
      onClick={() => onOpenExperience(ev)}
      animate={{ y: hovered ? -3 : 0, boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.3)' : 'none' }}
      transition={{ duration: 0.22 }}
      style={{
        position: 'relative', overflow: 'hidden', textAlign: 'left',
        border: inCart ? '1px solid rgba(0,255,65,0.26)' : hovered ? '1px solid var(--gold)' : '0.5px solid var(--border2)',
        background: hovered ? 'var(--bg4)' : 'var(--bg3)',
        borderRadius: 4, cursor: 'pointer', transition: 'border-color 0.22s, background 0.22s',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{ position: 'relative', height: 110, overflow: 'hidden' }}>
        <img src={ev.image} alt={ev.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transform: hovered ? 'scale(1.07)' : 'scale(1)', transition: 'transform 0.5s ease' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.08), rgba(10,14,8,0.82))' }} />
        <AnimatePresence>
          {hovered && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)', padding: '5px 12px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)' }}>Explore ↗</span>
            </motion.div>
          )}
        </AnimatePresence>
        <div style={{ position: 'absolute', bottom: 10, left: 12, fontSize: 18 }}>{ev.icon}</div>
        {inCart && <div style={{ position: 'absolute', top: 8, right: 8, padding: '2px 8px', borderRadius: 20, background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.28)', color: 'var(--neon)', fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>✓</div>}
      </div>

      <div style={{ padding: '13px 13px 15px' }}>
        <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem', fontWeight: 300, color: 'var(--cream)', marginBottom: 2 }}>{ev.name}</div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '10px', color: 'var(--muted)', marginBottom: 9, lineHeight: 1.5 }}>{ev.sub}</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Eyebrow style={{ display: 'block', marginBottom: 1 }}>from</Eyebrow>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', color: 'var(--gold)' }}>KES {ev.price.toLocaleString()}</span>
          </div>
          <button onClick={handleAdd} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
            <Eyebrow color={inCart ? 'var(--neon)' : 'var(--gold)'} style={{ letterSpacing: '0.1em' }}>{inCart ? '✓ Added' : '+ Add'}</Eyebrow>
          </button>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED EXPERIENCE REEL (original preserved + scroll weight)
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedExperienceReel({ onOpenEvent }: { onOpenEvent: (e: UKVEvent) => void }) {
  const featured = EVENTS.filter(e => ['harvest-dinner-may', 'ubuntu-wedding', 'new-moon-fire'].includes(e.id))
  const { fontWeight, letterSpacing } = useScrollWeight()

  return (
    <section style={{ padding: '0 0 80px' }}>
      <div style={{ padding: '0 40px 28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 6 }}>
          <div style={{ width: 32, height: '1px', background: 'var(--gold)', opacity: 0.4 }} />
          <Eyebrow style={{ letterSpacing: '0.24em', color: 'rgba(255,255,255,0.2)' }}>Featured Experiences</Eyebrow>
        </div>
        <motion.h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.4rem)', color: 'var(--cream)', fontWeight, letterSpacing }}>
          Moments that stay with you
        </motion.h2>
      </div>

      <div style={{ display: 'flex', gap: 16, padding: '0 40px', overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none' }}>
        {featured.map((event) => {
          const catColor = CATEGORY_COLORS[event.category] || event.accent
          const catColorResolved = catColor === 'var(--gold)' ? '#D4A853' : catColor === 'var(--neon)' ? '#00FF41' : catColor
          const catAtm = CATEGORY_ATMOSPHERE[event.category] || CATEGORY_ATMOSPHERE['All']
          return (
            <motion.div
              key={event.id}
              layoutId={`featured-${event.id}`}
              onClick={() => onOpenEvent(event)}
              whileHover={{ y: -6, boxShadow: `0 32px 64px rgba(0,0,0,0.5), 0 0 0 1px ${catColorResolved}20, 0 0 60px ${catAtm.glow}` }}
              transition={{ duration: 0.35 }}
              style={{
                flexShrink: 0, width: 340, scrollSnapAlign: 'start',
                position: 'relative', overflow: 'hidden', cursor: 'pointer',
                borderRadius: 16, height: 480,
                border: `1px solid ${catColorResolved}18`,
              }}
            >
              <img src={event.image} alt={event.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(5,8,4,0.97) 0%, rgba(5,8,4,0.4) 45%, transparent 70%)' }} />
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '28px 24px' }}>
                <div style={{ display: 'inline-block', padding: '3px 10px', borderRadius: 20, marginBottom: 12, background: `${catColorResolved}18`, border: `1px solid ${catColorResolved}40`, color: catColorResolved, fontFamily: 'var(--font-body)', fontSize: '8px', letterSpacing: '0.14em', textTransform: 'uppercase', alignSelf: 'flex-start' }}>{event.category}</div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.1, marginBottom: 8 }}>{event.title}</h3>
                {/* Cinematic short copy in reel */}
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '12px', color: catColorResolved, lineHeight: 1.6, marginBottom: 18, fontStyle: 'italic', opacity: 0.85 }}>
                  {event.cinematic || event.subtitle}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  {event.price > 0 ? (
                    <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: catColorResolved, fontWeight: 300 }}>KES {event.price.toLocaleString()}</span>
                  ) : (
                    <Eyebrow style={{ color: 'rgba(255,255,255,0.28)' }}>Enquiry pricing</Eyebrow>
                  )}
                  <div style={{ padding: '7px 14px', borderRadius: 8, background: `${catColorResolved}15`, border: `1px solid ${catColorResolved}30`, color: catColorResolved, fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase' }}>Explore →</div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// EVENTS SECTION (original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function EventsSection({ onOpenEventType }: { onOpenEventType: (ev: EventType) => void }) {
  return (
    <div className="animate-fade-up px-8 md:px-10 py-14">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center p-12 mb-14" style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)' }}>
        <div>
          <h2 className="text-[46px] font-light leading-[1.08] mb-4" style={{ fontFamily: 'var(--font-display)' }}>
            Your event,<br />the{' '}
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>village&apos;s</em>
            <br />soul
          </h2>
          <p className="text-[13px] leading-[1.85]" style={{ color: 'var(--muted)' }}>
            From intimate board retreats to full-village weddings. Ubuntu is built to host what matters — rooted in the land, shaped entirely by the purpose of your gathering.
          </p>
          <p className="text-[11px] mt-3" style={{ color: 'rgba(255,255,255,0.2)', fontFamily: 'var(--font-body)', letterSpacing: '0.06em' }}>
            Click any experience to explore it fully →
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {EVENT_TYPES.map(ev => <EventTypeTile key={ev.id} ev={ev} onOpenExperience={onOpenEventType} />)}
        </div>
      </div>

      <SectionDivider label="Event Packages" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(200,168,75,0.1)] mb-16">
        {EVENT_PACKAGES.map((pkg, i) => (
          <div key={pkg.id} className="relative flex flex-col p-8 animate-fade-up" style={{ background: pkg.featured ? 'var(--bg3)' : 'var(--bg2)', animationDelay: `${i * 80}ms` }}>
            {pkg.featured && <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[8px] tracking-[0.14em] uppercase px-4 py-1" style={{ background: 'var(--gold)', color: 'var(--bg)', fontFamily: 'var(--font-body)' }}>Most Requested</div>}
            <div className="mt-4">
              <h3 className="text-[26px] font-light mb-1" style={{ fontFamily: 'var(--font-display)' }}>{pkg.name}</h3>
              <p className="text-[10px] mb-5" style={{ color: 'var(--sage2)', fontFamily: 'var(--font-body)' }}>{pkg.tag}</p>
              <ul className="space-y-1.5 mb-6">
                {(pkg.includes || []).map((f: string) => (
                  <li key={f} className="flex gap-2 items-start text-[12px]" style={{ color: 'var(--muted)' }}>
                    <span style={{ color: 'var(--gold)', fontSize: '9px', marginTop: '3px' }}>—</span>{f}
                  </li>
                ))}
              </ul>
              <p className="text-[28px] font-light mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}>KES {pkg.price.toLocaleString()}</p>
              <p className="text-[11px] mb-5" style={{ color: 'var(--muted)' }}>{pkg.unit}</p>
              <ProductCard product={pkg} />
            </div>
          </div>
        ))}
      </div>

      <SectionDivider label="Upcoming Public Events" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[rgba(200,168,75,0.1)]">
        {PUBLIC_EVENTS.map((ev, i) => <ProductCard key={ev.id} product={ev} delay={i * 60} />)}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MOXIE PROACTIVE TOAST (original preserved)
// ─────────────────────────────────────────────────────────────────────────────
function useMoxieProactiveToast(events: UKVEvent[], activeFilter: string) {
  const shown = useRef<Set<string>>(new Set())

  useEffect(() => {
    const timer = setTimeout(() => {
      const urgent = events.find(e =>
        e.status === 'Reservation Open' &&
        e.spotsLeft <= 8 &&
        !shown.current.has(e.id) &&
        (activeFilter === 'All' || activeFilter === e.category)
      )
      if (!urgent) return
      shown.current.add(urgent.id)
      toast(
        (t) => (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>🌿</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#e0d0a8', fontWeight: 600, letterSpacing: '0.06em' }}>Moxie here</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6, margin: 0 }}>
              The <strong style={{ color: '#D4A853' }}>{urgent.title}</strong> only has{' '}
              <strong style={{ color: urgent.spotsLeft <= 3 ? '#F0A8B8' : '#D4A853' }}>{urgent.spotsLeft} spots</strong> left.
              Shall I reserve yours?
            </p>
            <button
              onClick={() => { toast.dismiss(t.id); document.getElementById(`event-card-${urgent.id}`)?.click() }}
              style={{ marginTop: 4, padding: '6px 14px', borderRadius: 7, background: 'rgba(212,168,83,0.15)', border: '1px solid rgba(212,168,83,0.3)', color: '#D4A853', fontFamily: 'var(--font-body)', fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', cursor: 'pointer', alignSelf: 'flex-start' }}
            >
              View & Reserve →
            </button>
          </div>
        ),
        {
          duration: 7000,
          style: { background: 'rgba(12,16,9,0.98)', border: '1px solid rgba(212,168,83,0.18)', borderRadius: 12, maxWidth: 320 },
          icon: null,
        }
      )
    }, 6000)
    return () => clearTimeout(timer)
  }, [events, activeFilter])
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function EventsPage() {
  const [modalEvent, setModalEvent] = useState<UKVEvent | null>(null)
  const [modalEventType, setModalEventType] = useState<EventType | null>(null)
  const [activeFilter, setActiveFilter] = useState<string>('All')
  const [videoVisible, setVideoVisible] = useState(false)
  const [heroReady, setHeroReady] = useState(false)

  const cursor = useCursorGlow()

  const filters = ['All', ...Object.keys(CATEGORY_COLORS)]
  const filteredEvents = activeFilter === 'All' ? EVENTS : EVENTS.filter(e => e.category === activeFilter)
  const catAtm = CATEGORY_ATMOSPHERE[activeFilter] || CATEGORY_ATMOSPHERE['All']
  const catAtmParticle = catAtm.particle === 'var(--gold)' ? '#D4A853' : catAtm.particle === 'var(--neon)' ? '#00FF41' : catAtm.particle

  // Staggered hero entrance
  useEffect(() => {
    const t = setTimeout(() => setHeroReady(true), 180)
    return () => clearTimeout(t)
  }, [])

  // Video panel appears after hero loads
  useEffect(() => {
    const t = setTimeout(() => setVideoVisible(true), 900)
    return () => clearTimeout(t)
  }, [])

  useMoxieProactiveToast(filteredEvents, activeFilter)

  const handleOpenEvent     = useCallback((event: UKVEvent) => setModalEvent(event), [])
  const handleOpenEventType = useCallback((ev: EventType) => setModalEventType(ev), [])

  return (
    <LayoutGroup>
      <main style={{ background: 'var(--obsidian)', minHeight: '100vh', position: 'relative' }}>

        {/* Global cursor light leak */}
        <div
          aria-hidden
          style={{
            position: 'fixed', inset: 0, zIndex: 1, pointerEvents: 'none',
            background: `radial-gradient(circle 320px at ${cursor.x}px ${cursor.y}px, rgba(212,168,83,0.04) 0%, transparent 70%)`,
            transition: 'background 0.1s linear',
          }}
        />

        <Nav />

        {/* ── CINEMATIC HERO — upgraded ── */}
        <section className="relative overflow-hidden" style={{ minHeight: '65vh', paddingTop: '120px', paddingBottom: 0 }}>

          {/* Animated atmosphere background — per-category shift */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2 }}
              className="absolute inset-0"
              style={{ background: catAtm.gradient, zIndex: 0 }}
            />
          </AnimatePresence>

          {/* Static base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 80% 60% at 20% 80%, rgba(30,16,44,0.7) 0%, transparent 60%),
                radial-gradient(ellipse 50% 40% at 80% 20%, rgba(240,168,184,0.03) 0%, transparent 50%)
              `,
              zIndex: 1,
            }}
          />

          {/* Film grain */}
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none"
            style={{
              zIndex: 2, opacity: 0.025, mixBlendMode: 'overlay',
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
              backgroundSize: '180px 180px',
            }}
          />

          {/* Ambient particles — live with filter */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }} aria-hidden>
            <AmbientParticles color={catAtmParticle} count={22} />
          </div>

          {/* Corner brackets */}
          <div className="absolute pointer-events-none" style={{ top: '88px', left: '24px', width: 24, height: 24, borderTop: '1px solid rgba(240,168,184,0.3)', borderLeft: '1px solid rgba(240,168,184,0.3)', zIndex: 5 }} />
          <div className="absolute pointer-events-none" style={{ top: '88px', right: '24px', width: 24, height: 24, borderTop: '1px solid rgba(240,168,184,0.3)', borderRight: '1px solid rgba(240,168,184,0.3)', zIndex: 5 }} />

          {/* Cinematic video panel — the signature moment */}
          <CinematicVideoPanel visible={videoVisible} />

          {/* Hero content */}
          <div className="relative max-w-8xl mx-auto w-full px-6 md:px-10 pb-24" style={{ zIndex: 5 }}>

            {/* Eyebrow */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={heroReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0 }}
              className="flex items-center gap-3 mb-6"
            >
              <span style={{ display: 'block', width: 40, height: '1px', background: '#F0A8B8', opacity: 0.45 }} />
              <Eyebrow color="#F0A8B8" style={{ letterSpacing: '0.28em' }}>Events · Weddings · Experiences</Eyebrow>
            </motion.div>

            {/* Headline — large, emotional */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={heroReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 1, delay: 0.12 }}
            >
              <h1
                className="font-display leading-[0.86] mb-5"
                style={{ fontSize: 'clamp(3rem, 8vw, 7.5rem)', fontWeight: 300, color: 'var(--cream)', letterSpacing: '-0.01em' }}
              >
                Where celebrations
                <br />
                <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>become rituals.</em>
              </h1>
            </motion.div>

            {/* Cinematic 3-line tagline */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={heroReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.26 }}
              className="font-body max-w-lg mb-8"
              style={{ fontSize: 'clamp(13px, 1.4vw, 16px)', color: 'rgba(255,255,255,0.42)', lineHeight: 1.85 }}
            >
              Farm dinners. Fire circles. Moonlit weddings.
              <br />
              Designed for people who want to feel something real.
            </motion.p>

            {/* CTA row — magnetic buttons */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={heroReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, delay: 0.38 }}
              style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 40 }}
            >
              <MagneticButton
                style={{
                  padding: '13px 32px',
                  background: 'linear-gradient(135deg, #f6d47a 0%, #D4A853 45%, #8b6b25 100%)',
                  border: 'none', borderRadius: 8,
                  color: 'var(--obsidian)',
                  fontFamily: 'var(--font-body)', fontSize: '9px',
                  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                  fontWeight: 700,
                  boxShadow: '0 0 28px rgba(212,168,83,0.25), 0 0 80px rgba(212,168,83,0.1)',
                }}
                onClick={() => document.getElementById('events-grid')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Explore Experiences →
              </MagneticButton>
              <MagneticButton
                style={{
                  padding: '13px 28px',
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 8,
                  color: 'rgba(255,255,255,0.65)',
                  fontFamily: 'var(--font-body)', fontSize: '9px',
                  letterSpacing: '0.2em', textTransform: 'uppercase' as const,
                  backdropFilter: 'blur(12px)',
                }}
                onClick={() => window.location.href = '/contact'}
              >
                Reserve a Seat
              </MagneticButton>
            </motion.div>

            {/* Category filters */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={heroReady ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="flex flex-wrap gap-2"
            >
              {filters.map(cat => {
                const color = cat === 'All' ? 'rgba(255,255,255,0.45)' : (CATEGORY_COLORS[cat] || 'rgba(255,255,255,0.45)')
                const colorResolved = color === 'var(--gold)' ? '#D4A853' : color === 'var(--neon)' ? '#00FF41' : color
                const active = activeFilter === cat
                return (
                  <motion.button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    whileTap={{ scale: 0.96 }}
                    className="log-badge"
                    style={{
                      color: active ? colorResolved : 'rgba(255,255,255,0.28)',
                      borderColor: active ? `${colorResolved}50` : 'rgba(255,255,255,0.07)',
                      background: active ? `${colorResolved}12` : 'transparent',
                      cursor: 'pointer', fontFamily: 'var(--font-body)',
                      transition: 'all 0.2s',
                      boxShadow: active ? `0 0 12px ${colorResolved}14` : 'none',
                    }}
                  >
                    {cat}
                  </motion.button>
                )
              })}
            </motion.div>
          </div>
        </section>

        {/* ── LIVE EVENT TICKER ── */}
        <LiveEventTicker />

        {/* ── Featured Reel ── */}
        {activeFilter === 'All' && <FeaturedExperienceReel onOpenEvent={handleOpenEvent} />}

        {/* ── Events Grid ── */}
        <section id="events-grid" className="px-6 md:px-10 py-20" style={{ paddingTop: activeFilter === 'All' ? 0 : '80px' }}>
          <div className="max-w-8xl mx-auto">
            <div className="flex items-center gap-4 mb-10">
              <div className="neon-divider flex-1" />
              <Eyebrow style={{ letterSpacing: '0.26em', color: 'rgba(255,255,255,0.2)' }}>
                {filteredEvents.length} {activeFilter !== 'All' ? activeFilter + ' ' : ''}Event{filteredEvents.length !== 1 ? 's' : ''}
              </Eyebrow>
              <div className="neon-divider flex-1" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-20">
              {filteredEvents.map(event => (
                <EventCard key={event.id} event={event} onOpenModal={handleOpenEvent} />
              ))}
            </div>

            <div style={{ borderTop: '1px solid rgba(255,255,255,0.04)' }}>
              <EventsSection onOpenEventType={handleOpenEventType} />
            </div>

            {/* Custom CTA */}
            <div className="mt-16 p-10 text-center" style={{ background: 'rgba(212,168,83,0.03)', border: '1px solid rgba(212,168,83,0.12)', borderRadius: '14px' }}>
              <h3 className="font-display italic mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--cream)' }}>
                Have something else in mind?
              </h3>
              <p className="font-body text-[12px] mb-6 max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.38)', lineHeight: 1.9 }}>
                Ubuntu Kreative Village is available for bespoke events, film productions, brand activations, and community programmes. Tell us your vision.
              </p>
              <Link href="/contact" className="btn-gold">Start the Conversation →</Link>
            </div>
          </div>
        </section>

        <Footer />
        <MoxieChat />

        {/* ── Modals ── */}
        <AnimatePresence mode="wait">
          {modalEvent && (
            <ExperienceModal
              key={`modal-${modalEvent.id}`}
              event={modalEvent}
              onClose={() => setModalEvent(null)}
              accent={CATEGORY_COLORS[modalEvent.category] || modalEvent.accent}
              layoutId={`event-card-${modalEvent.id}`}
            />
          )}
          {modalEventType && (
            <ExperienceModal
              key={`modal-et-${modalEventType.id}`}
              event={modalEventType}
              onClose={() => setModalEventType(null)}
              accent="var(--gold)"
            />
          )}
        </AnimatePresence>
      </main>
    </LayoutGroup>
  )
}