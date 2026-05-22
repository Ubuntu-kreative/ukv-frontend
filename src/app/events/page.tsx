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
  cinematic?: string
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
// UI COMPONENT PRIMITIVES
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

function useScrollWeight() {
  const { scrollY } = useScroll()
  const fontWeight = useTransform(scrollY, [0, 600], [300, 380])
  const letterSpacing = useTransform(scrollY, [0, 600], [-0.01, 0.02])
  return { fontWeight, letterSpacing }
}

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

function CinematicVideoPanel({ visible }: { visible: boolean }) {
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

          <AnimatePresence mode="wait">
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
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INTERACTIVE SYSTEM ENGINE EXPORT
// ─────────────────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [activeEvent, setActiveEvent] = useState<UKVEvent | null>(null)
  const cursor = useCursorGlow()
  const scrollWeight = useScrollWeight()

  const filteredEvents = selectedCategory === 'All' 
    ? EVENTS 
    : EVENTS.filter(e => e.category === selectedCategory)

  return (
    <main className="bg-obsidian min-h-screen text-cream relative overflow-x-hidden">
      <Nav />

      {/* Dynamic Ambient Background Canvas */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div 
          className="absolute inset-0 transition-all duration-1000 ease-out"
          style={{ background: CATEGORY_ATMOSPHERE[selectedCategory]?.gradient || CATEGORY_ATMOSPHERE['All'].gradient }}
        />
        <div
          style={{
            position: 'absolute', inset: 0, opacity: 0.015,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Luxury Immersive Hero Segment */}
      <section className="relative pt-32 pb-24 px-6 max-w-7xl mx-auto z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-7">
          <Eyebrow color="var(--gold)">Ubuntu Command Center // Gatherings Matrix</Eyebrow>
          <motion.h1 
            style={{ fontWeight: scrollWeight.fontWeight, letterSpacing: scrollWeight.letterSpacing }}
            className="font-display text-5xl md:text-8xl font-light leading-none tracking-tight text-cream mt-4 mb-6"
          >
            Memories Carved <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cream via-gold to-white/30">
              Into Raw Earth.
            </span>
          </motion.h1>
          <p className="font-body text-white/50 text-base md:text-lg max-w-xl leading-relaxed">
            From candlelit harvest communions under the Rift Valley twilight to high-stakes executive alignment retreats, we structure spaces where individual boundaries fade into tribal clarity.
          </p>

          {/* Filtering Engine Controller Matrix */}
          <div className="flex flex-wrap gap-2 mt-12">
            {['All', ...Object.keys(CATEGORY_COLORS)].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full border text-xs font-body tracking-wider transition-all duration-300 ${
                  selectedCategory === cat 
                    ? 'bg-cream text-obsidian border-cream font-medium shadow-lg' 
                    : 'bg-transparent text-white/40 border-white/10 hover:border-white/30 hover:text-cream'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5 relative h-[450px] hidden lg:block">
          <CinematicVideoPanel visible={selectedCategory !== 'All'} />
        </div>
      </section>

      {/* Main Events Display Grid Layout */}
      <section className="max-w-7xl mx-auto px-6 py-12 relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <LayoutGroup>
          {filteredEvents.map(ev => {
            const currentAccent = CATEGORY_COLORS[ev.category] || 'var(--gold)'
            return (
              <motion.div
                layout
                key={ev.id}
                onClick={() => setActiveEvent(ev)}
                className="bg-black/30 border border-white/5 rounded-2xl overflow-hidden cursor-pointer group hover:border-white/20 transition-all duration-500 relative flex flex-col justify-between h-[520px]"
                whileHover={{ y: -8 }}
              >
                <AccentLine color={currentAccent} />
                
                {/* Upper Card Module */}
                <div>
                  <div className="h-48 overflow-hidden relative">
                    <img 
                      src={ev.image} 
                      alt={ev.title} 
                      className="w-100 h-100 object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span className="absolute top-4 left-4 text-[10px] font-body uppercase tracking-widest px-3 py-1 rounded-full bg-black/60 border border-white/10" style={{ color: currentAccent }}>
                      {ev.category}
                    </span>
                  </div>

                  <div className="p-6">
                    <Eyebrow color="rgba(255,255,255,0.4)">{ev.date} · {ev.time}</Eyebrow>
                    <h3 className="font-display text-2xl font-light text-cream mt-2 mb-3 group-hover:text-gold transition-colors">
                      {ev.title}
                    </h3>
                    <p className="font-body text-xs text-white/50 leading-relaxed line-clamp-3">
                      {ev.description}
                    </p>
                  </div>
                </div>

                {/* Bottom Action Footer Module */}
                <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between bg-black/10">
                  <span className="font-mono text-sm text-cream">
                    {ev.price > 0 ? `KES ${ev.price.toLocaleString()}` : 'Enquire'}
                  </span>
                  <span className="text-xs font-body uppercase tracking-wider text-white/30 group-hover:text-cream transition-colors">
                    Explore Journey →
                  </span>
                </div>
              </motion.div>
            )
          })}
        </LayoutGroup>
      </section>

      {/* Bespoke Structural Package Solutions */}
      <section className="max-w-7xl mx-auto px-6 py-24 relative z-10 border-t border-white/5">
        <div className="text-center mb-16">
          <Eyebrow color="var(--gold)">Tailored Curations</Eyebrow>
          <h2 className="font-display text-4xl md:text-5xl font-light text-cream mt-2">Bespoke Production Packages</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {EVENT_TYPES.map(pkg => (
            <div key={pkg.id} className="bg-black/20 border border-white/5 rounded-2xl p-8 backdrop-blur-md flex flex-col md:flex-row gap-8 items-start">
              <img src={pkg.image} alt={pkg.name} className="w-full md:w-40 h-40 object-cover rounded-xl border border-white/10" />
              <div className="flex-1">
                <span className="text-[10px] font-mono tracking-widest uppercase text-gold bg-gold/10 px-2 py-1 rounded">{pkg.tag}</span>
                <h3 className="font-display text-2xl font-light text-cream mt-3 mb-1">{pkg.name}</h3>
                <p className="text-xs text-white/40 font-body mb-4">{pkg.sub}</p>
                <p className="text-sm text-white/60 font-body leading-relaxed mb-6">{pkg.philosophy}</p>
                <Link href="/contact" className="text-xs font-body tracking-wider uppercase text-cream border-b border-cream pb-1 hover:text-gold hover:border-gold transition-colors">
                  Initiate Alignment Curation →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Immersive Event Overlay Vault Screen Modal Drawer */}
      <AnimatePresence>
        {activeEvent && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl overflow-y-auto flex justify-end"
          >
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 150 }}
              className="w-full max-w-3xl bg-obsidian border-l border-white/10 min-h-screen relative p-8 md:p-12"
            >
              <button 
                onClick={() => setActiveEvent(null)}
                className="absolute top-6 right-6 w-10 h-10 rounded-full border border-white/10 bg-black/40 flex items-center justify-center text-white/60 hover:text-cream hover:border-white/30 transition-colors"
              >
                ✕
              </button>

              <div className="mt-8">
                <span className="text-xs font-mono tracking-widest text-gold uppercase">{activeEvent.category}</span>
                <h2 className="font-display text-4xl md:text-5xl font-light text-cream mt-2 mb-4">{activeEvent.title}</h2>
                <p className="font-body text-base text-white/70 leading-relaxed mb-8">{activeEvent.description}</p>

                <div className="grid grid-cols-2 gap-4 mb-8 bg-white/5 p-6 rounded-xl border border-white/5">
                  <div>
                    <span className="block text-[10px] uppercase text-white/30 tracking-wider">Date Mapping</span>
                    <span className="font-body text-sm text-cream font-medium">{activeEvent.date}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] uppercase text-white/30 tracking-wider">Timeline Window</span>
                    <span className="font-body text-sm text-cream font-medium">{activeEvent.time} ({activeEvent.duration})</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-light text-cream mb-4">What's Encompassed:</h3>
                <ul className="space-y-2 mb-12">
                  {activeEvent.includes.map((inc, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/60 font-body">
                      <span className="text-gold">✦</span> {inc}
                    </li>
                  ))}
                </ul>

                <div className="border-t border-white/10 pt-8 flex items-center justify-between">
                  <div>
                    <span className="block text-[10px] uppercase text-white/30 tracking-wider">Financial Vector</span>
                    <span className="font-mono text-2xl text-cream">{activeEvent.price > 0 ? `KES ${activeEvent.price.toLocaleString()}` : 'Enquire'}</span>
                  </div>
                  <Link 
                    href="/contact"
                    className="px-8 py-4 bg-cream text-obsidian rounded-xl font-body text-xs uppercase font-bold tracking-widest hover:bg-gold transition-colors"
                  >
                    Lock Secure Booking Matrix
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <MoxieChat className="glass-panel" />
      <Footer />
    </main>
  )
}