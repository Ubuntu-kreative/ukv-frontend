'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'

// ─── Types ────────────────────────────────────────────────────────────────────

type FarmTab = 'walks' | 'animals' | 'workshops' | 'harvest'

interface ExperienceItem {
  id: string
  name: string
  category: string
  price: number
  duration: string
  groupSize: string
  image: string
  badge?: string
  badgeColor?: string
  description: string
  storyLine: string
  includes: string[]
  highlights: string[]
}

// ─── Experience Data ──────────────────────────────────────────────────────────

const EXPERIENCE_ITEMS: ExperienceItem[] = [
  {
    id: 'exp-001',
    name: 'Sunrise Farm Walk',
    category: 'Farm Walks',
    price: 2800,
    duration: '2 hrs',
    groupSize: '1–6 guests',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1200&q=80',
    badge: 'Most Popular',
    badgeColor: 'var(--neon)',
    description: 'Rise with the land. Walk all six fields at golden hour with your farm guide, learning the story of every crop, animal, and soil bed that feeds the Kreative Village kitchen.',
    storyLine: 'The light breaks over Field D before the rest of the world wakes. Your guide has already been here an hour — checking the soil, reading the morning. Now you walk beside them.',
    includes: ['Guided 2-hour walk', 'Morning herb tea', 'Field journal', 'Provenance certificate'],
    highlights: ['Visit all 6 active fields', 'Meet the livestock', 'Harvest herbs fresh', 'Moxie integration — ask live questions'],
  },
  {
    id: 'exp-002',
    name: 'Boma Animal Encounter',
    category: 'Animal Encounters',
    price: 1800,
    duration: '1.5 hrs',
    groupSize: '1–4 guests',
    image: 'images/goat.jpg',
    badge: 'Family Favourite',
    badgeColor: 'var(--gold)',
    description: 'Get close with our Boran cattle, Galla goats, and Kenbro chickens. Your guide explains breed selection, ethical rearing, and the farm-to-fork journey from boma to bowl.',
    storyLine: 'UKV-031 has been with us since the beginning. The Galla goat does not hurry for anyone. You feed her by hand and understand, for the first time, where dinner actually comes from.',
    includes: ['Guided boma tour', 'Feeding session', 'Breed story cards', 'Photo opportunity'],
    highlights: ['Feed the goats', 'Collect fresh eggs', 'Learn breed histories', 'Full boma access'],
  },
  {
    id: 'exp-003',
    name: 'Farm-to-Table Workshop',
    category: 'Workshops',
    price: 4500,
    duration: '4 hrs',
    groupSize: '2–8 guests',
    image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=1200&q=80',
    badge: 'Signature',
    badgeColor: '#B8A9F0',
    description: 'Harvest what you cook. Pick kale from Field B, herbs from the garden, then move into our outdoor kitchen to prepare a full Kreative Village meal under chef guidance.',
    storyLine: 'You harvest the kale yourself. Twenty minutes later it is in the pan. This is the meal you will talk about for years — because you built it from the soil up.',
    includes: ['Field harvest session', 'Cooking class', 'Full farm meal', 'Recipe cards', 'Apron & tools'],
    highlights: ['Pick your own ingredients', 'Chef-led cooking', 'Eat what you make', 'Take recipes home'],
  },
  {
    id: 'exp-004',
    name: 'Harvest & Field Session',
    category: 'Harvest & Field',
    price: 2200,
    duration: '2.5 hrs',
    groupSize: '1–10 guests',
    image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&q=80',
    description: 'Roll up your sleeves. Work alongside our farm team harvesting ready crops — currently sukuma wiki, lemongrass, and rosemary. Leave with a basket of what you picked.',
    storyLine: 'The farm team do not slow down for guests. You join their rhythm. Hands in the soil. The smell of cut lemongrass. A basket that gets heavier. This is the real thing.',
    includes: ['Hands-on harvest', 'Farm tools provided', 'Harvest basket to keep', 'Farmer Q&A'],
    highlights: ['Real working farm experience', 'Seasonal crops', 'Take home your harvest', 'Learn soil & crop cycles'],
  },
  {
    id: 'exp-005',
    name: 'Herb Garden & Spa Pairing',
    category: 'Workshops',
    price: 3600,
    duration: '3 hrs',
    groupSize: '1–4 guests',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=1200&q=80',
    badge: 'New',
    badgeColor: '#A8D8F0',
    description: "Our herb garden feeds the kitchen and the spa. In this session you'll distill lemongrass and rosemary oils, blend your own spa infusion, then enjoy a 30-min treatment using your blend.",
    storyLine: 'The oil you distill this morning will be pressed into your skin this afternoon. There is no shorter distance between garden and body than this.',
    includes: ['Garden tour & harvest', 'Distillation session', 'Custom blend bottle', '30-min spa treatment'],
    highlights: ['Distill your own essential oils', 'Spa treatment included', 'Take home your blend', 'Expert herbalist guide'],
  },
  {
    id: 'exp-006',
    name: 'Full Day Farm Immersion',
    category: 'Farm Walks',
    price: 7500,
    duration: 'Full day',
    groupSize: '1–6 guests',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
    badge: 'Premium',
    badgeColor: 'var(--gold)',
    description: 'The complete Kreative Village farm story — sunrise walk, animal encounter, herb workshop, harvest session, and a long farm lunch all in one immersive day. Nothing is left out.',
    storyLine: 'You arrive when the mist is still on Field D. You leave when the last dish is cleared and the fire is low. In between, you will have touched every part of this farm.',
    includes: ['All four farm experiences', 'Farm lunch for 2', 'Harvest basket', 'Photo set', 'Provenance booklet'],
    highlights: ['Every field & boma visited', 'Full day with farm team', 'Lunch from the farm', 'Best value package'],
  },
]

// ─── Tab Data with images ─────────────────────────────────────────────────────

interface TabItem {
  id: string
  name: string
  description: string
  image: string
  price?: number
  duration?: string
  capacity?: string
  tag: string
  accentColor: string
  highlights: string[]
}

const TAB_DATA: Record<FarmTab, { label: string; items: TabItem[] }> = {
  walks: {
    label: 'Farm Walks',
    items: [
      {
        id: 'walk-001', name: 'Golden Hour Walk', tag: 'Sunrise', accentColor: 'var(--gold)',
        price: 1800, duration: '90 MIN', capacity: '1–8',
        image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=800&q=80',
        description: 'A guided walk through all six fields at first light. The air carries dew and lemongrass. Nothing else is required of you.',
        highlights: ['All 6 fields', 'Herb tasting', 'Morning tea', 'Field journal'],
      },
      {
        id: 'walk-002', name: 'Soil & Root Walk', tag: 'Education', accentColor: 'var(--neon)',
        price: 1400, duration: '60 MIN', capacity: '2–12',
        image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&q=80',
        description: 'An agronomist-led session focused on soil science, composting, and sustainable cropping as practised on the Ubuntu farm.',
        highlights: ['Soil sampling', 'Compost tour', 'Crop calendar', 'Seed library access'],
      },
      {
        id: 'walk-003', name: 'Evening Fields Walk', tag: 'Sunset', accentColor: '#F0A8B8',
        price: 1600, duration: '75 MIN', capacity: '1–6',
        image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
        description: 'The fields slow down as the sun drops. Walk with a guide while the kitchen prepares what you helped grow earlier in the day.',
        highlights: ['Sunset light', 'Pre-dinner herbs', 'Private guide', 'Sundowner drink'],
      },
    ],
  },
  animals: {
    label: 'Animal Encounters',
    items: [
      {
        id: 'anim-001', name: 'Boma Morning Session', tag: 'Cattle & Goats', accentColor: 'var(--neon)',
        price: 1800, duration: '90 MIN', capacity: '1–4',
        image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=1200&q=80',
        description: 'Feed UKV-031 and her Galla herd by hand. Learn why we chose Boran cattle and how ethical rearing changes the flavour of everything on the menu.',
        highlights: ['Hand-feed goats', 'Breed story cards', 'Boran cattle', 'Photo session'],
      },
      {
        id: 'anim-002', name: 'Egg Collection', tag: 'Poultry House', accentColor: 'var(--gold)',
        price: 900, duration: '45 MIN', capacity: '1–8',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
        description: 'Collect eggs from our 34-hen Kenbro flock at the morning count. A grounding, tactile experience that reconnects you with where breakfast begins.',
        highlights: ['34 free-range hens', 'Collect fresh eggs', 'Take home a dozen', 'Feeding session'],
      },
      {
        id: 'anim-003', name: 'Dairy Paddock Visit', tag: 'Friesian Herd', accentColor: '#A8D8F0',
        price: 1200, duration: '60 MIN', capacity: '1–6',
        image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
        description: 'Visit our Friesian dairy herd whose milk goes directly into the spa and kitchen. Watch the milking process and taste the difference.',
        highlights: ['Dairy herd access', 'Milking demo', 'Fresh milk tasting', 'Spa connection'],
      },
    ],
  },
  workshops: {
    label: 'Workshops',
    items: [
      {
        id: 'wksp-001', name: 'Composting Masterclass', tag: 'Soil Science', accentColor: 'var(--neon)',
        price: 2200, duration: '2.5 HRS', capacity: '2–10',
        image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
        description: 'Learn the full closed-loop composting system that feeds our fields. Take home a kit to start your own at home.',
        highlights: ['Compost science', 'Worm farm visit', 'Take-home kit', 'Soil testing'],
      },
      {
        id: 'wksp-002', name: 'Seed Saving Workshop', tag: 'Heritage Seeds', accentColor: 'var(--gold)',
        price: 1900, duration: '2 HRS', capacity: '2–8',
        image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&q=80',
        description: 'Learn to harvest, dry, and store heritage seed varieties from our open-pollinated collection. Leave with seed envelopes to plant at home.',
        highlights: ['Heritage varieties', 'Drying techniques', 'Seed envelopes', 'Planting guide'],
      },
      {
        id: 'wksp-003', name: 'Natural Fermentation', tag: 'Kitchen Science', accentColor: '#B8A9F0',
        price: 3200, duration: '3 HRS', capacity: '2–8',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800&q=80',
        description: 'From the farm vegetable patch to a fermentation jar — learn lacto-fermentation using produce we harvest together at the session start.',
        highlights: ['Farm-sourced veg', 'Lacto-fermentation', 'Take home your jars', 'Recipe cards'],
      },
    ],
  },
  harvest: {
    label: 'Harvest & Field',
    items: [
      {
        id: 'harv-001', name: 'Kale Harvest', tag: 'Field B', accentColor: 'var(--neon)',
        price: 1400, duration: '90 MIN', capacity: '1–12',
        image: 'https://images.unsplash.com/photo-1621447508323-270a444d481d?w=800&q=80',
        description: 'Field B kale at peak harvest. Work alongside the farm team cutting sukuma wiki that goes directly into the kitchen that afternoon.',
        highlights: ['Real harvest work', 'Field B access', 'Kitchen handover', 'Take-home basket'],
      },
      {
        id: 'harv-002', name: 'Herb Harvest & Bundle', tag: 'Herb Garden', accentColor: '#A8F0D8',
        price: 1200, duration: '60 MIN', capacity: '1–8',
        image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=800&q=80',
        description: 'Harvest lemongrass, rosemary, and mint from the herb garden. Bundle and dry your own herbs or take them home fresh.',
        highlights: ['3 herb varieties', 'Drying & bundling', 'Take home bundle', 'Recipe pairing cards'],
      },
      {
        id: 'harv-003', name: 'Orchard Fruit Pick', tag: 'Orchard', accentColor: 'var(--gold)',
        price: 1600, duration: '90 MIN', capacity: '1–8',
        image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=800&q=80',
        description: 'Seasonal fruit picking from our orchard of mango, avocado, pawpaw, and passion fruit. Whatever is ripe, is yours to take.',
        highlights: ['Seasonal variety', 'Ripe on the day', 'Full basket to keep', 'Jam recipe card'],
      },
    ],
  },
}

// ─── Livestock / Crops / Fields Data ─────────────────────────────────────────

const LIVESTOCK = [
  { id: 'UKV-047', species: 'Cattle', breed: 'Boran', unit: 'Boma Unit 3', status: 'Healthy', field: 'Field A', notes: 'Primary beef source. Last health check 2 days ago.', accent: 'var(--neon)', image: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?w=400&q=80' },
  { id: 'UKV-031', species: 'Goat', breed: 'Galla', unit: 'Boma Unit 1', status: 'Healthy', field: 'Field B', notes: "Featured in tonight's stew. Free-range grazing.", accent: 'var(--gold)', image: 'https://images.unsplash.com/photo-1524024973431-2ad916746881?w=1200&q=80' },
  { id: 'UKV-088', species: 'Chicken', breed: 'Kenbro', unit: 'Poultry House', status: 'Healthy', field: 'Free Range', notes: 'Eggs collected daily. Current count: 34 hens.', accent: '#F0D8A8', image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&q=80' },
  { id: 'UKV-012', species: 'Cattle', breed: 'Friesian', unit: 'Dairy Unit', status: 'Healthy', field: 'Dairy Paddock', notes: 'Dairy herd. Milk used in spa treatments and kitchen.', accent: '#A8D8F0', image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400&q=80' },
]

const CROPS = [
  { name: 'Sukuma Wiki (Kale)', field: 'Field B', status: 'Harvest Ready', soilMoisture: 68, daysToHarvest: 0, lastWatered: '6 hours ago', accent: 'var(--neon)', usedIn: ['Field B Kale Salad', 'Farm Beef Tenderloin', 'Harvest Vegetable Plate'], image: '/images/SukumaWiki.jpg' },
  { name: 'Tomatoes', field: 'Field A', status: 'Growing', soilMoisture: 72, daysToHarvest: 8, lastWatered: '4 hours ago', accent: '#F0A8B8', usedIn: ['Harvest Vegetable Plate', 'Herb Garden Soup'], image: '/images/tomatoes.jpg' },
  { name: 'Sweet Potatoes', field: 'Field C', status: 'Growing', soilMoisture: 55, daysToHarvest: 21, lastWatered: '12 hours ago', accent: 'var(--gold)', usedIn: ['Harvest Vegetable Plate'], image: 'https://images.unsplash.com/photo-1620706857370-e1b9770e8bb1?w=400&q=80' },
  { name: 'Lemongrass', field: 'Herb Garden', status: 'Harvest Ready', soilMoisture: 60, daysToHarvest: 0, lastWatered: '8 hours ago', accent: '#A8F0D8', usedIn: ['Herb Garden Infusion', 'Forest Massage oil', 'Spa treatments'], image: 'https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=400&q=80' },
  { name: 'Rosemary', field: 'Herb Garden', status: 'Harvest Ready', soilMoisture: 48, daysToHarvest: 0, lastWatered: '8 hours ago', accent: '#B8A9F0', usedIn: ['Herb Garden Infusion', 'Boma Bone Broth', 'Spa treatments'], image: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=400&q=80' },
  { name: 'Maize', field: 'Field D', status: 'Planted', soilMoisture: 80, daysToHarvest: 45, lastWatered: '2 hours ago', accent: '#F0D8A8', usedIn: ['Ugali', 'Animal feed'], image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
]

const FIELDS = [
  { id: 'Field A', size: '2.4 acres', crops: 'Tomatoes, Root vegetables', moisture: 72, status: 'Active', image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=400&q=80' },
  { id: 'Field B', size: '1.8 acres', crops: 'Kale, Spinach, Leafy greens', moisture: 68, status: 'Active', image: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=80' },
  { id: 'Field C', size: '3.1 acres', crops: 'Sweet potatoes, Cassava', moisture: 55, status: 'Active', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&q=80' },
  { id: 'Field D', size: '4.0 acres', crops: 'Maize, Sorghum', moisture: 80, status: 'Active', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80' },
  { id: 'Herb Garden', size: '0.4 acres', crops: 'Lemongrass, Rosemary, Mint, Turmeric', moisture: 58, status: 'Active', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80' },
  { id: 'Orchard', size: '1.2 acres', crops: 'Mango, Avocado, Pawpaw, Passion fruit', moisture: 45, status: 'Active', image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=400&q=80' },
]

// ─── CART HOOK — connected to global useCartStore ─────────────────────────────

function useFarmCart() {
  const { addItem, items, openCart } = useCartStore()

  const isInCart = useCallback(
    (id: string) => items.some((i) => i.id === id && i.category === 'farm'),
    [items]
  )

  const getQty = useCallback(
    (id: string) => items.filter((i) => i.id === id && i.category === 'farm').length,
    [items]
  )

  const addExperience = useCallback(
    (exp: ExperienceItem, qty = 1) => {
      for (let i = 0; i < qty; i++) {
        addItem({
          id:       exp.id,
          name:     exp.name,
          category: 'farm',
          tag:      exp.category,
          price:    exp.price,
          unit:     '/ person',
        })
      }
      toast.success(`${exp.name} added to cart`, {
        style: {
          background: '#0a0a0a',
          border: '1px solid rgba(0,255,65,0.3)',
          color: 'var(--neon, #00ff41)',
          fontFamily: 'var(--font-body, sans-serif)',
          fontSize: '11px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
        iconTheme: { primary: '#00ff41', secondary: '#000' },
      })
    },
    [addItem]
  )

  const addTabItem = useCallback(
    (item: TabItem) => {
      addItem({
        id:       item.id,
        name:     item.name,
        category: 'farm',
        tag:      item.tag,
        price:    item.price ?? 0,
        unit:     '/ person',
      })
      toast.success(`${item.name} added to cart`, {
        style: {
          background: '#0a0a0a',
          border: '1px solid rgba(0,255,65,0.3)',
          color: '#00ff41',
          fontFamily: 'var(--font-body, sans-serif)',
          fontSize: '11px',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
        },
      })
    },
    [addItem]
  )

  const farmCount = useMemo(() => items.filter((i) => i.category === 'farm').length, [items])

  return { addExperience, addTabItem, isInCart, getQty, farmCount, openCart }
}

// ─── Moisture Bar ─────────────────────────────────────────────────────────────

function MoistureBar({ value, accent }: { value: number; accent: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 4, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ width: `${value}%`, height: '100%', background: accent, borderRadius: 2, transition: 'width 0.8s ease' }} />
      </div>
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: accent, minWidth: 32 }}>{value}%</span>
    </div>
  )
}

// ─── Experience Card ──────────────────────────────────────────────────────────

function ExperienceCard({
  item,
  onOpenModal,
}: {
  item: ExperienceItem
  onOpenModal: (item: ExperienceItem) => void
}) {
  const { addExperience, isInCart, openCart } = useFarmCart()
  const [hovered, setHovered] = useState(false)
  const [justAdded, setJustAdded] = useState(false)
  const inCart = isInCart(item.id)

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    if (inCart) { openCart(); return }
    addExperience(item)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div
      className="relative overflow-hidden cursor-pointer group"
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: inCart
          ? '1px solid rgba(0,255,65,0.35)'
          : hovered ? '1px solid rgba(212,168,83,0.4)' : '1px solid rgba(255,255,255,0.06)',
        borderRadius: 16,
        transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 24px 60px rgba(0,0,0,0.5)' : '0 4px 20px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onOpenModal(item)}
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(5,8,4,0.85) 100%)' }} />

        {/* In-cart indicator */}
        {inCart && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,255,65,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--neon)', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(0,255,65,0.4)', padding: '6px 14px', borderRadius: 20 }}>
              ✓ In Cart — View
            </span>
          </div>
        )}

        {item.badge && !inCart && (
          <div style={{ position: 'absolute', top: 12, left: 12, padding: '3px 10px', borderRadius: 20, background: `${item.badgeColor}22`, border: `1px solid ${item.badgeColor}55`, color: item.badgeColor, fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            {item.badge}
          </div>
        )}

        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', padding: '3px 8px', borderRadius: 20 }}>
            {item.category}
          </span>
        </div>

        <div style={{ position: 'absolute', bottom: 14, left: 14, right: 14 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', fontWeight: 300, color: 'var(--cream)', marginBottom: 4 }}>{item.name}</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>⏱ {item.duration}</span>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>👥 {item.groupSize}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 18px 16px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, marginBottom: 14, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden', fontStyle: 'italic' }}>
          "{item.storyLine}"
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', display: 'block', marginBottom: 2 }}>per person</span>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', fontWeight: 300, color: 'var(--gold)' }}>KES {item.price.toLocaleString()}</span>
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onOpenModal(item) }}
              style={{ padding: '8px 14px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.55)', fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Details
            </button>
            <button
              onClick={handleAdd}
              style={{
                padding: '8px 16px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.25s', fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', fontWeight: 600,
                background: inCart ? 'rgba(0,255,65,0.12)' : justAdded ? 'rgba(0,255,65,0.12)' : 'var(--gold)',
                color: inCart ? 'var(--neon)' : justAdded ? 'var(--neon)' : 'var(--obsidian)',
                border: (inCart || justAdded) ? '1px solid rgba(0,255,65,0.35)' : 'none',
              }}
            >
              {inCart ? '✓ View Cart' : justAdded ? '✓ Added' : '+ Cart'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Experience Modal ─────────────────────────────────────────────────────────

function ExperienceModal({
  item,
  onClose,
}: {
  item: ExperienceItem
  onClose: () => void
}) {
  const { addExperience, isInCart, getQty, openCart } = useFarmCart()
  const [qty, setQty] = useState(1)
  const [justAdded, setJustAdded] = useState(false)
  const inCart = isInCart(item.id)
  const cartQty = getQty(item.id)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc) }
  }, [onClose])

  function handleAdd() {
    addExperience(item, qty)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div
      style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,8,4,0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.25s ease' }}
      onClick={onClose}
    >
      <div
        style={{ width: '100%', maxWidth: 860, background: 'rgba(16,20,12,0.98)', border: '1px solid rgba(212,168,83,0.2)', borderRadius: 20, overflow: 'hidden', maxHeight: '90vh', overflowY: 'auto', display: 'grid', gridTemplateColumns: '1fr 1fr', animation: 'slideUp 0.3s ease', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: Image */}
        <div style={{ position: 'relative', minHeight: 480 }}>
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent 60%, rgba(16,20,12,0.9) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(16,20,12,0.6) 0%, transparent 40%)' }} />

          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, backdropFilter: 'blur(8px)' }}>✕</button>

          {item.badge && (
            <div style={{ position: 'absolute', top: 16, left: 16, padding: '4px 12px', borderRadius: 20, background: `${item.badgeColor}22`, border: `1px solid ${item.badgeColor}55`, color: item.badgeColor, fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>{item.badge}</div>
          )}

          {inCart && (
            <div style={{ position: 'absolute', top: 56, left: 16, padding: '4px 12px', borderRadius: 20, background: 'rgba(0,255,65,0.12)', border: '1px solid rgba(0,255,65,0.3)', color: 'var(--neon)', fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase' }}>✓ In Cart × {cartQty}</div>
          )}

          <div style={{ position: 'absolute', bottom: 20, left: 20, display: 'flex', gap: 10 }}>
            {[{ label: 'Duration', value: item.duration }, { label: 'Group', value: item.groupSize }].map((s) => (
              <div key={s.label} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.1)', padding: '8px 14px', borderRadius: 10 }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'var(--cream)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Content */}
        <div style={{ padding: '36px 32px', display: 'flex', flexDirection: 'column', gap: 18, overflowY: 'auto' }}>
          <div>
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', display: 'block', marginBottom: 6 }}>{item.category}</span>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.25, marginBottom: 4 }}>{item.name}</h2>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--gold)' }}>KES {item.price.toLocaleString()}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>/ person</span>
            </div>
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.4)', lineHeight: 1.85, fontStyle: 'italic', borderLeft: '2px solid rgba(212,168,83,0.2)', paddingLeft: 12 }}>"{item.storyLine}"</p>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.85 }}>{item.description}</p>

          {/* Includes */}
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 8 }}>What's Included</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {item.includes.map((inc) => (
                <div key={inc} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: 'var(--neon)', fontSize: 10, flexShrink: 0 }}>✓</span>
                  <span style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.6)' }}>{inc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 8 }}>Highlights</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {item.highlights.map((h) => (
                <span key={h} style={{ fontFamily: 'var(--font-body)', fontSize: 10, padding: '4px 12px', borderRadius: 20, background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.2)', color: 'rgba(212,168,83,0.8)' }}>{h}</span>
              ))}
            </div>
          </div>

          {/* Qty + Add — connected to global cart */}
          <div style={{ marginTop: 'auto', paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)' }}>Guests</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '4px 8px' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 28, height: 28, background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--gold)', minWidth: 24, textAlign: 'center' }}>{qty}</span>
                <button onClick={() => setQty(q => q + 1)} style={{ width: 28, height: 28, background: 'none', border: 'none', color: 'var(--cream)', cursor: 'pointer', fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
              </div>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>= KES {(item.price * qty).toLocaleString()}</span>
            </div>

            {inCart ? (
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={handleAdd} style={{ flex: 1, padding: '12px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  + Add {qty} More
                </button>
                <button onClick={openCart} style={{ flex: 1, padding: '12px 0', background: 'linear-gradient(135deg, var(--gold) 0%, #c09a3a 100%)', border: 'none', borderRadius: 10, color: 'var(--obsidian)', fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 700 }}>
                  View Cart ({cartQty}) →
                </button>
              </div>
            ) : (
              <button
                onClick={handleAdd}
                style={{ width: '100%', padding: '14px 0', background: justAdded ? 'rgba(0,255,65,0.12)' : 'linear-gradient(135deg, var(--gold) 0%, #c09a3a 100%)', border: justAdded ? '1px solid rgba(0,255,65,0.35)' : 'none', borderRadius: 10, color: justAdded ? 'var(--neon)' : 'var(--obsidian)', fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}
              >
                {justAdded ? `✓ ${qty} Added to Main Cart` : `Add ${qty} to Cart`}
              </button>
            )}

            {cartQty > 0 && (
              <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(0,255,65,0.5)', textAlign: 'center', marginTop: 8 }}>
                {cartQty} already in your cart
              </p>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}

// ─── Tab Item Modal ───────────────────────────────────────────────────────────

function TabItemModal({ item, onClose }: { item: TabItem; onClose: () => void }) {
  const { addTabItem, openCart } = useFarmCart()
  const [justAdded, setJustAdded] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', esc)
    return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', esc) }
  }, [onClose])

  function handleAdd() {
    addTabItem(item)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(5,8,4,0.92)', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, animation: 'fadeIn 0.25s ease' }} onClick={onClose}>
      <div
        style={{ width: '100%', maxWidth: 720, background: 'rgba(16,20,12,0.98)', border: `1px solid ${item.accentColor}33`, borderRadius: 20, overflow: 'hidden', maxHeight: '85vh', animation: 'slideUp 0.3s ease', boxShadow: '0 40px 120px rgba(0,0,0,0.8)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image header */}
        <div style={{ position: 'relative', height: 280 }}>
          <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(16,20,12,0.95) 100%)' }} />
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${item.accentColor}15, transparent 70%)` }} />

          <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 36, height: 36, borderRadius: '50%', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>✕</button>

          <span style={{ position: 'absolute', top: 16, left: 16, fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: item.accentColor, background: `${item.accentColor}18`, border: `1px solid ${item.accentColor}44`, padding: '4px 12px', borderRadius: 20 }}>{item.tag}</span>

          <div style={{ position: 'absolute', bottom: 20, left: 24 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 300, color: 'var(--cream)', marginBottom: 4 }}>{item.name}</h2>
            {item.price && (
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--gold)' }}>KES {item.price.toLocaleString()} <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>/ person</span></span>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '28px 32px 32px' }}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 18 }}>
            {item.duration && <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: 20 }}>⏱ {item.duration}</span>}
            {item.capacity && <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', padding: '4px 12px', borderRadius: 20 }}>👥 {item.capacity} guests</span>}
          </div>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.55)', lineHeight: 1.85, marginBottom: 20 }}>{item.description}</p>

          <div style={{ marginBottom: 24 }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)', marginBottom: 10 }}>Highlights</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {item.highlights.map((h) => (
                <span key={h} style={{ fontFamily: 'var(--font-body)', fontSize: 10, padding: '4px 12px', borderRadius: 20, background: `${item.accentColor}10`, border: `1px solid ${item.accentColor}25`, color: item.accentColor }}>{h}</span>
              ))}
            </div>
          </div>

          {item.price ? (
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleAdd} style={{ flex: 1, padding: '14px 0', background: justAdded ? 'rgba(0,255,65,0.12)' : 'linear-gradient(135deg, var(--gold) 0%, #c09a3a 100%)', border: justAdded ? '1px solid rgba(0,255,65,0.35)' : 'none', borderRadius: 10, color: justAdded ? 'var(--neon)' : 'var(--obsidian)', fontFamily: 'var(--font-body)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, cursor: 'pointer', transition: 'all 0.3s' }}>
                {justAdded ? '✓ Added to Cart' : '+ Add to Cart'}
              </button>
              {justAdded && (
                <button onClick={openCart} style={{ padding: '14px 20px', background: 'rgba(0,255,65,0.08)', border: '1px solid rgba(0,255,65,0.3)', borderRadius: 10, color: 'var(--neon)', fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>View Cart →</button>
              )}
            </div>
          ) : (
            <button onClick={onClose} style={{ width: '100%', padding: '14px 0', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer' }}>Close</button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(24px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </div>
  )
}

// ─── Tab Item Card — with image, no empty spaces ──────────────────────────────

function TabItemCard({ item, onOpen }: { item: TabItem; onOpen: (i: TabItem) => void }) {
  const { addTabItem } = useFarmCart()
  const [hovered, setHovered] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  function handleAdd(e: React.MouseEvent) {
    e.stopPropagation()
    addTabItem(item)
    setJustAdded(true)
    setTimeout(() => setJustAdded(false), 2000)
  }

  return (
    <div
      onClick={() => onOpen(item)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden', cursor: 'pointer',
        border: hovered ? `1px solid ${item.accentColor}44` : '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(255,255,255,0.02)',
        transition: 'border-color 0.3s, transform 0.3s, box-shadow 0.3s',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.2)',
      }}
      className="rounded-2xl"
    >
      {/* Image */}
      <div style={{ position: 'relative', height: 180, overflow: 'hidden' }}>
        <img
          src={item.image}
          alt={item.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.6s ease', transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(5,8,4,0.9) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(ellipse at center, ${item.accentColor}10, transparent 70%)`, opacity: hovered ? 1 : 0, transition: 'opacity 0.5s' }} />

        <span style={{ position: 'absolute', top: 10, left: 10, fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: item.accentColor, background: `${item.accentColor}18`, border: `1px solid ${item.accentColor}40`, padding: '3px 10px', borderRadius: 20 }}>{item.tag}</span>

        <div style={{ position: 'absolute', bottom: 12, left: 14, right: 14 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.2, marginBottom: 3 }}>{item.name}</h3>
          {item.duration && <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'rgba(255,255,255,0.4)' }}>⏱ {item.duration} · 👥 {item.capacity}</span>}
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px' }}>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.42)', lineHeight: 1.7, marginBottom: 12, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as const, overflow: 'hidden' }}>{item.description}</p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
          {item.highlights.slice(0, 2).map((h) => (
            <span key={h} style={{ fontFamily: 'var(--font-body)', fontSize: 9, padding: '2px 8px', borderRadius: 20, background: `${item.accentColor}0d`, border: `1px solid ${item.accentColor}25`, color: item.accentColor }}>{h}</span>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {item.price ? (
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', color: 'var(--gold)' }}>KES {item.price.toLocaleString()}</span>
          ) : (
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.25)' }}>Included in walks</span>
          )}
          <div style={{ display: 'flex', gap: 6 }}>
            <button
              onClick={(e) => { e.stopPropagation(); onOpen(item) }}
              style={{ padding: '7px 12px', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 8, background: 'rgba(255,255,255,0.03)', color: 'rgba(255,255,255,0.5)', fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer' }}
            >
              Details
            </button>
            {item.price && (
              <button
                onClick={handleAdd}
                style={{ padding: '7px 14px', borderRadius: 8, background: justAdded ? 'rgba(0,255,65,0.12)' : 'var(--gold)', border: justAdded ? '1px solid rgba(0,255,65,0.35)' : 'none', color: justAdded ? 'var(--neon)' : 'var(--obsidian)', fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: '0.12em', textTransform: 'uppercase', cursor: 'pointer', fontWeight: 600, transition: 'all 0.25s' }}
              >
                {justAdded ? '✓' : '+ Cart'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Floating Cart Button — uses global cart ──────────────────────────────────

function FloatingCartButton() {
  const { farmCount, openCart } = useFarmCart()
  if (farmCount === 0) return null

  return (
    <button
      onClick={openCart}
      style={{
        position: 'fixed', bottom: 28, right: 100, zIndex: 9990,
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '14px 22px',
        background: 'linear-gradient(135deg, var(--gold) 0%, #c09a3a 100%)',
        border: 'none', borderRadius: 50,
        boxShadow: '0 8px 32px rgba(212,168,83,0.4)',
        cursor: 'pointer',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--obsidian)', fontWeight: 700 }}>
        🌱 {farmCount} Booked
      </span>
      <span style={{ height: 16, width: 1, background: 'rgba(5,8,4,0.2)' }} />
      <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, color: 'var(--obsidian)' }}>View Cart →</span>
    </button>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function FarmPage() {
  const [modalItem, setModalItem] = useState<ExperienceItem | null>(null)
  const [tabModalItem, setTabModalItem] = useState<TabItem | null>(null)
  const [activeTab, setActiveTab] = useState<FarmTab>('walks')
  const videoRef = useRef<HTMLVideoElement>(null)
  const { farmCount } = useFarmCart()

  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh' }}>
      <Nav />

      {/* ── Hero Video ──────────────────────────────────────────────────────── */}
      <section style={{ position: 'relative', height: '100vh', overflow: 'hidden', display: 'flex', alignItems: 'flex-end' }}>
        <video
          ref={videoRef}
          autoPlay muted loop playsInline
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          poster="https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80"
        >
          {/* Your uploaded video */}
          <source src="/videos/farm-hero.mp4" type="video/mp4" />
        </video>

        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(5,8,4,0.35) 0%, rgba(5,8,4,0.1) 40%, rgba(5,8,4,0.8) 80%, var(--obsidian) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 20% 80%, rgba(16,44,16,0.55) 0%, transparent 60%)' }} />

        {/* Corner marks */}
        {[{ top: 88, left: 24, tl: true }, { top: 88, right: 24, tr: true }, { bottom: 40, left: 24, bl: true }, { bottom: 40, right: 24, br: true }].map((c, i) => (
          <div key={i} style={{ position: 'absolute', ...c, width: 24, height: 24, borderTop: c.tl || c.tr ? `1px solid rgba(0,255,65,${c.tl ? '0.35' : '0.35'})` : undefined, borderBottom: c.bl || c.br ? `1px solid rgba(0,255,65,0.2)` : undefined, borderLeft: c.tl || c.bl ? `1px solid rgba(0,255,65,${c.tl ? '0.35' : '0.2'})` : undefined, borderRight: c.tr || c.br ? `1px solid rgba(0,255,65,${c.tr ? '0.35' : '0.2'})` : undefined, pointerEvents: 'none' as const }} />
        ))}

        {/* Hero content */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 1400, margin: '0 auto', width: '100%', padding: '0 40px 80px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
            <span style={{ display: 'block', width: 40, height: 1, background: 'var(--neon)', opacity: 0.6 }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--neon)' }}>Kreative Village Farm</span>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', animation: 'pulse 2s infinite', display: 'inline-block' }} />
            <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Live · 24 Animals · 6 Fields</span>
          </div>

          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 8vw, 7.5rem)', fontWeight: 300, lineHeight: 1.05, color: 'var(--cream)', marginBottom: 16, letterSpacing: '-0.01em' }}>
            The land<br /><em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>feeds everything.</em>
          </h1>

          <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1.9, maxWidth: 480, marginBottom: 36 }}>
            Walk our fields. Meet the animals. Harvest what you eat. Every meal, every spa treatment, every drop of milk — it all begins here.
          </p>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <button
              onClick={() => document.getElementById('farm-experiences')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '14px 28px', borderRadius: 10, background: 'linear-gradient(135deg, var(--gold) 0%, #c09a3a 100%)', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--obsidian)' }}
            >
              Book an Experience
            </button>
            <button
              onClick={() => document.getElementById('farm-log')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '14px 28px', borderRadius: 10, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}
            >
              View Farm Log ↓
            </button>
          </div>
        </div>

        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, animation: 'bounce 2s infinite' }}>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.25))' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 8, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Scroll</span>
        </div>
      </section>

      {/* ── Live Stats Bar ──────────────────────────────────────────────────── */}
      <div style={{ padding: '28px 40px', borderTop: '1px solid rgba(255,255,255,0.05)', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,255,65,0.02)' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
          {[
            { value: '24', label: 'Animals tracked', color: 'var(--neon)' },
            { value: '6', label: 'Active fields', color: 'var(--gold)' },
            { value: '3', label: 'Harvest ready', color: 'var(--neon)' },
            { value: '13.5', label: 'Total farm acres', color: 'var(--gold)' },
          ].map((s) => (
            <div key={s.label} style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '2.8rem', fontWeight: 300, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</span>
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── EXPERIENCES SECTION ─────────────────────────────────────────────── */}
      <section id="farm-experiences" style={{ padding: '80px 40px 0' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: 48, display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <span style={{ width: 40, height: 1, background: 'var(--neon)', opacity: 0.5, display: 'block' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Book directly · Instant confirmation</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
              <div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 300, color: 'var(--cream)', lineHeight: 1.05 }}>
                  Walk the land. <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Know your food.</em>
                </h2>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: 12, color: 'rgba(255,255,255,0.35)', lineHeight: 1.8, maxWidth: 560, marginTop: 8 }}>
                  Pick what calls to you. Each experience is self-contained and goes directly into your cart. Everything feeds back to the same table.
                </p>
              </div>
              {farmCount > 0 && (
                <button
                  onClick={() => useCartStore.getState().openCart()}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 20px', background: 'rgba(212,168,83,0.08)', border: '1px solid rgba(212,168,83,0.25)', borderRadius: 40, cursor: 'pointer', fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)' }}
                >
                  <span style={{ width: 20, height: 20, background: 'var(--gold)', color: 'var(--obsidian)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 700 }}>{farmCount}</span>
                  View Cart
                </button>
              )}
            </div>
          </div>

          {/* Experience cards — all wired to global cart */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20, marginBottom: 80 }}>
            {EXPERIENCE_ITEMS.map((item) => (
              <ExperienceCard key={item.id} item={item} onOpenModal={setModalItem} />
            ))}
          </div>
        </div>
      </section>

      {/* ── TAB SECTION — now with images, modals, no empty space ──────────── */}
      <section style={{ padding: '0 40px 80px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          {/* Tab header */}
          <div style={{ marginBottom: 36, paddingBottom: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <span style={{ width: 40, height: 1, background: 'var(--gold)', opacity: 0.4, display: 'block' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.28)' }}>Explore by Category</span>
            </div>

            {/* Tab buttons */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid rgba(255,255,255,0.06)', overflowX: 'auto' }}>
              {(Object.keys(TAB_DATA) as FarmTab[]).map((key) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: '14px 24px', background: 'none', border: 'none', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: activeTab === key ? 'var(--gold)' : 'rgba(255,255,255,0.28)',
                    borderBottom: activeTab === key ? '1.5px solid var(--gold)' : '1.5px solid transparent',
                    marginBottom: -1, transition: 'all 0.2s', whiteSpace: 'nowrap',
                  }}
                >
                  {TAB_DATA[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab grid — images + cards, no empty spaces */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {TAB_DATA[activeTab].items.map((item) => (
              <TabItemCard key={item.id} item={item} onOpen={setTabModalItem} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Farm Log ───────────────────────────────────────────────────────── */}
      <div id="farm-log" style={{ padding: '60px 40px 0', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ width: 60, height: 1, background: 'rgba(0,255,65,0.25)' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(0,255,65,0.5)' }}>Farm Log · The Pulse</span>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', display: 'inline-block' }} />
          <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)' }}>FarmERP synced 8m ago</span>
          <div style={{ width: 60, height: 1, background: 'rgba(0,255,65,0.25)' }} />
        </div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'var(--cream)', marginBottom: 12 }}>
          What the land is doing — <em style={{ color: 'var(--neon)', fontStyle: 'normal' }}>right now.</em>
        </h2>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 13, color: 'rgba(255,255,255,0.35)', lineHeight: 1.9, maxWidth: 520, margin: '0 auto' }}>
          Every animal, crop, and field tracked in real time via FarmERP. This data powers your dinner, your spa treatments, and Moxie's provenance answers.
        </p>
      </div>

      {/* ── Livestock — with images ─────────────────────────────────────────── */}
      <section style={{ padding: '60px 40px 20px' }}>
        <div style={{ maxWidth: 1400, margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--neon)', flexShrink: 0 }}>Livestock</h2>
            <div className="neon-divider" style={{ flex: 1 }} />
            <span className="log-badge log-badge--live">● Live</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16, marginBottom: 60 }}>
            {LIVESTOCK.map(animal => (
              <div key={animal.id} className="glass" style={{ padding: 0, position: 'relative', overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                  <img src={animal.image} alt={animal.species} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 40%, rgba(5,8,4,0.9) 100%)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${animal.accent}, transparent)`, opacity: 0.7 }} />
                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span className="log-badge" style={{ color: animal.accent, borderColor: `${animal.accent}44`, background: `${animal.accent}11` }}>{animal.species}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span className="log-badge log-badge--live">● {animal.status}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 12, left: 14 }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', fontWeight: 300, color: animal.accent }}>#{animal.id}</div>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '14px 18px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                    {[{ label: 'Breed', value: animal.breed }, { label: 'Unit', value: animal.unit }, { label: 'Grazing', value: animal.field }].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>{row.label}</span>
                        <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{row.value}</span>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, lineHeight: 1.7, color: 'rgba(255,255,255,0.35)' }}>{animal.notes}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Crops — with images ─────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: 'var(--gold)', flexShrink: 0 }}>Crops</h2>
            <div className="neon-divider" style={{ flex: 1 }} />
            <span className="log-badge log-badge--sync">↻ Synced</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 60 }}>
            {CROPS.map(crop => (
              <div key={crop.name} className="glass" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                  <img src={crop.image} alt={crop.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(5,8,4,0.9) 100%)' }} />
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg, transparent, ${crop.accent}, transparent)`, opacity: 0.6 }} />

                  <div style={{ position: 'absolute', top: 10, left: 10 }}>
                    <span className="log-badge" style={{ color: crop.accent, borderColor: `${crop.accent}44`, background: `${crop.accent}11` }}>{crop.field}</span>
                  </div>
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span className="log-badge" style={
                      crop.status === 'Harvest Ready' ? { color: 'var(--neon)', borderColor: 'rgba(0,255,65,0.35)', background: 'rgba(0,255,65,0.07)' }
                      : crop.status === 'Growing' ? { color: 'var(--gold)', borderColor: 'rgba(212,168,83,0.35)', background: 'rgba(212,168,83,0.07)' }
                      : { color: 'rgba(255,255,255,0.35)', borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)' }
                    }>
                      {crop.status === 'Harvest Ready' ? '● Ready' : crop.status === 'Growing' ? '↻ Growing' : '○ Planted'}
                    </span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', fontWeight: 300, color: 'var(--cream)' }}>{crop.name}</h3>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '14px 18px 16px' }}>
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', marginBottom: 5 }}>Soil Moisture</div>
                    <MoistureBar value={crop.soilMoisture} accent={crop.accent} />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>Days to harvest</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: crop.daysToHarvest === 0 ? 'var(--neon)' : 'rgba(255,255,255,0.55)' }}>{crop.daysToHarvest === 0 ? 'Ready now' : `${crop.daysToHarvest} days`}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>Last watered</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{crop.lastWatered}</span>
                    </div>
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', marginBottom: 5 }}>Used in</div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                      {crop.usedIn.map((u, i) => (
                        <span key={i} style={{ fontFamily: 'var(--font-body)', fontSize: 9, padding: '2px 8px', borderRadius: 20, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>{u}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Fields — with images ────────────────────────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 300, color: '#A8D8F0', flexShrink: 0 }}>Fields</h2>
            <div className="neon-divider" style={{ flex: 1 }} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {FIELDS.map(field => (
              <div key={field.id} className="glass" style={{ padding: 0, overflow: 'hidden' }}>
                {/* Image */}
                <div style={{ position: 'relative', height: 140, overflow: 'hidden' }}>
                  <img src={field.image} alt={field.id} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 30%, rgba(5,8,4,0.9) 100%)' }} />
                  <div style={{ position: 'absolute', top: 10, right: 10 }}>
                    <span className="log-badge log-badge--live">● {field.status}</span>
                  </div>
                  <div style={{ position: 'absolute', bottom: 10, left: 14 }}>
                    <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.15rem', fontWeight: 300, color: 'var(--cream)' }}>{field.id}</h3>
                  </div>
                </div>

                {/* Body */}
                <div style={{ padding: '14px 18px 16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 10 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)' }}>Size</span>
                      <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, color: 'rgba(255,255,255,0.55)' }}>{field.size}</span>
                    </div>
                    <div>
                      <div style={{ fontFamily: 'var(--font-body)', fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.25)', marginBottom: 5 }}>Soil Moisture</div>
                      <MoistureBar value={field.moisture} accent="var(--neon)" />
                    </div>
                  </div>
                  <p style={{ fontFamily: 'var(--font-body)', fontSize: 10, lineHeight: 1.7, color: 'rgba(255,255,255,0.35)' }}>{field.crops}</p>
                </div>
              </div>
            ))}
          </div>

          {/* FarmERP note */}
          <div style={{ marginTop: 48, padding: 24, background: 'rgba(0,255,65,0.03)', border: '1px solid rgba(0,255,65,0.12)', borderRadius: 16, textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--neon)', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-body)', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)' }}>Powered by FarmERP · Synced every 60 minutes</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 16 }}>
              Phase 4 will connect this page to live FarmERP data. Ask Moxie about any animal or crop right now.
            </p>
            <button className="btn-neon" style={{ margin: '0 auto' }}>Ask Moxie About the Farm →</button>
          </div>
        </div>
      </section>

      <div style={{ height: 80 }} />
      <Footer />
      <MoxieChat />

      {/* ── Modals ─────────────────────────────────────────────────────────── */}
      {modalItem && (
        <ExperienceModal item={modalItem} onClose={() => setModalItem(null)} />
      )}
      {tabModalItem && (
        <TabItemModal item={tabModalItem} onClose={() => setTabModalItem(null)} />
      )}

      {/* ── Floating cart — global store ───────────────────────────────────── */}
      <FloatingCartButton />

      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
        @keyframes bounce { 0%, 100% { transform: translateX(-50%) translateY(0) } 50% { transform: translateX(-50%) translateY(6px) } }
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
      `}</style>
    </main>
  )
}