'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import Image from 'next/image'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────
const MPESA_PAYBILL = '880100'
const MPESA_ACCOUNT = '101497'
const MPESA_NAME    = 'Ubuntu Eco Lodge'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

function generateRef(prefix: string) {
  return `${prefix}-${Math.floor(10000 + Math.random() * 90000)}`
}

// ─────────────────────────────────────────────────────────────────────
// SERVICE CATALOGUE — everything Ubuntu offers
// ─────────────────────────────────────────────────────────────────────
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

type ServiceCategory =
  | 'accommodation'
  | 'dining'
  | 'spa'
  | 'farm'
  | 'events'
  | 'experiences'

const SERVICE_CATEGORIES: { id: ServiceCategory; label: string; icon: string; color: string }[] = [
  { id: 'accommodation', label: 'Cottages',     icon: '⌂', color: 'var(--gold)'  },
  { id: 'dining',        label: 'Restaurant',   icon: '◆', color: '#D4906A'       },
  { id: 'spa',           label: 'Arohamai Spa', icon: '✦', color: '#F0A8B8'       },
  { id: 'farm',          label: 'Farm',         icon: '⬡', color: 'var(--neon)'  },
  { id: 'events',        label: 'Events',       icon: '⬢', color: '#B8A9F0'       },
  { id: 'experiences',   label: 'Experiences',  icon: '◈', color: '#A8D4B4'       },
]

const UKV_SERVICES: UKVService[] = [
  // ── ACCOMMODATION ──
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
    description: 'Two bedrooms, a shared living room and a private kitchen garden. Designed for families or small groups who want space without losing intimacy.',
    price: 24000, priceNote: '/ night', duration: 'Min. 2 nights',
    image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?q=80&w=800',
    tag: 'Cottage', unit: '/ night', requiresDate: true, requiresGuests: true,
    color: 'var(--gold)', accent: 'rgba(200,168,75,0.15)',
  },
  {
    id: 'farmhouse-suite-a', category: 'accommodation',
    name: 'Farmhouse Suite A', tagline: 'Heritage architecture, modern luxury',
    description: 'The original farmhouse restored. Exposed timber, handwoven textiles, an inglenook fireplace and a private terrace overlooking the working farm.',
    price: 28000, priceNote: '/ night', duration: 'Min. 2 nights',
    image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800',
    tag: 'Suite', unit: '/ night', requiresDate: true, requiresGuests: true,
    badge: 'Signature', color: 'var(--gold)', accent: 'rgba(200,168,75,0.2)',
  },
  // ── DINING ──
  {
    id: 'dinner-farm-table', category: 'dining',
    name: 'Farm to Fork Dinner', tagline: 'The full harvest experience',
    description: '7-course tasting menu composed entirely from today\'s harvest. Served at the communal farm table under the acacia canopy. Chef\'s menu changes nightly.',
    price: 6500, priceNote: '/ person',
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?q=80&w=800',
    tag: 'Dining', unit: '/ person', requiresDate: true, requiresGuests: true,
    badge: 'Chef\'s Table', color: '#D4906A', accent: 'rgba(212,144,106,0.15)',
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
    description: 'Signature cocktails from the Ubuntu bar — The Ubuntu, Smoked Tamarind Old Fashioned, Golden Baobab — paired with fire-pit bites as the valley turns amber.',
    price: 3500, priceNote: '/ person',
    image: 'https://images.unsplash.com/photo-1470337458703-46ad1756a187?q=80&w=800',
    tag: 'Dining', unit: '/ person', requiresDate: true, requiresGuests: true,
    color: '#D4906A', accent: 'rgba(212,144,106,0.15)',
  },
  // ── SPA ──
  {
    id: 'spa-volcanic-mud', category: 'spa',
    name: 'Volcanic Mud Ritual', tagline: '90 minutes of deep earth restoration',
    description: 'Warm volcanic mud sourced from the Rift Valley applied in a full-body wrap. The heat draws impurities while mineral-rich clay remineralises tired skin. Followed by a forest-herb steam and cool rinse.',
    price: 9500, priceNote: '/ person', duration: '90 min',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=800',
    tag: 'Spa', unit: '/ session', requiresDate: true, requiresGuests: false,
    badge: 'Signature', color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-forest-massage', category: 'spa',
    name: 'Forest Massage', tagline: 'Rhythmic and grounding',
    description: 'A 75-minute full-body massage using oils cold-pressed from our herb garden — rosemary, eucalyptus, and African black seed. Performed in the open-air treatment pavilion.',
    price: 7500, priceNote: '/ person', duration: '75 min',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=800',
    tag: 'Spa', unit: '/ session', requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  {
    id: 'spa-ubuntu-couples', category: 'spa',
    name: 'Ubuntu Couples Ritual', tagline: 'Shared restoration',
    description: 'Two-hour experience designed for two. Side-by-side volcanic mud wraps, synchronised massage, followed by a private honey and herb bath drawn in the outdoor stone tub.',
    price: 18000, priceNote: '/ couple', duration: '120 min',
    image: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?q=80&w=800',
    tag: 'Spa', unit: '/ couple', requiresDate: true, requiresGuests: false,
    badge: 'Couples', color: '#F0A8B8', accent: 'rgba(240,168,184,0.2)',
  },
  {
    id: 'spa-honey-facial', category: 'spa',
    name: 'African Honey Facial', tagline: 'Raw apiary intelligence',
    description: 'Raw North Apiary honey combined with baobab vitamin C and African shea. A 60-minute facial that brightens, firms, and leaves skin with a true glow.',
    price: 6000, priceNote: '/ person', duration: '60 min',
    image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=800',
    tag: 'Spa', unit: '/ session', requiresDate: true, requiresGuests: false,
    color: '#F0A8B8', accent: 'rgba(240,168,184,0.15)',
  },
  // ── FARM ──
  {
    id: 'farm-walk-dawn', category: 'farm',
    name: 'Dawn Farm Walk', tagline: 'The farm waking up',
    description: 'A guided 90-minute walk through the working farm at first light. Feed the Boma herd, harvest herbs with the kitchen team, and collect eggs from the aviary. Includes farm breakfast.',
    price: 3500, priceNote: '/ person', duration: '90 min',
    image: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=800',
    tag: 'Farm', unit: '/ person', requiresDate: true, requiresGuests: true,
    badge: 'Popular', color: 'var(--neon)', accent: 'rgba(0,255,65,0.08)',
  },
  {
    id: 'farm-beekeeping', category: 'farm',
    name: 'Beekeeping Experience', tagline: 'Inside the North Apiary',
    description: 'Don a suit and enter the hive with our apiarist. Learn to read bee behaviour, extract raw honey and taste directly from the comb. Take home your own jar.',
    price: 4500, priceNote: '/ person', duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?q=80&w=800',
    tag: 'Farm', unit: '/ person', requiresDate: true, requiresGuests: true,
    color: 'var(--neon)', accent: 'rgba(0,255,65,0.08)',
  },
  {
    id: 'farm-planting-workshop', category: 'farm',
    name: 'Seed-to-Soil Workshop', tagline: 'Learn the language of the land',
    description: 'A 3-hour hands-on workshop in the kitchen garden. Understand soil health, plant a seasonal crop, and take away seedlings. Guided by the farm\'s head agronomist.',
    price: 5000, priceNote: '/ person', duration: '3 hours',
    image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=800',
    tag: 'Farm', unit: '/ person', requiresDate: true, requiresGuests: true,
    color: 'var(--neon)', accent: 'rgba(0,255,65,0.08)',
  },
  // ── EVENTS ──
  {
    id: 'event-wedding', category: 'events',
    name: 'Wedding at the Village', tagline: 'A ceremony the land remembers',
    description: 'Full-property wedding packages for up to 120 guests. Includes ceremony under the acacia canopy, farm-to-fork reception, bridal accommodation and décor consultation.',
    price: 350000, priceNote: '/ event',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800',
    tag: 'Events', unit: '/ event', requiresDate: true, requiresGuests: true,
    badge: 'Full Package', color: '#B8A9F0', accent: 'rgba(184,169,240,0.15)',
  },
  {
    id: 'event-corporate', category: 'events',
    name: 'Corporate Retreat', tagline: 'Reconnect your team to what matters',
    description: 'Tailored corporate retreats for groups of 10–60. Includes facilitated workshops, team farm experiences, accommodation and all meals. 2-day minimum.',
    price: 180000, priceNote: '/ group',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=800',
    tag: 'Events', unit: '/ group', requiresDate: true, requiresGuests: true,
    color: '#B8A9F0', accent: 'rgba(184,169,240,0.15)',
  },
  {
    id: 'event-private-dining', category: 'events',
    name: 'Private Farm Dinner', tagline: 'Your table, your menu, your evening',
    description: 'Exclusive use of the farm dining table for up to 14 guests. Custom 5-course menu designed with the head chef the week before. Includes cocktail welcome and wine pairing.',
    price: 65000, priceNote: '/ event',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=800',
    tag: 'Events', unit: '/ event', requiresDate: true, requiresGuests: true,
    badge: 'Exclusive', color: '#B8A9F0', accent: 'rgba(184,169,240,0.2)',
  },
  // ── EXPERIENCES ──
  {
    id: 'exp-sunrise-forest', category: 'experiences',
    name: 'Sunrise Forest Meditation', tagline: 'Before the farm wakes',
    description: 'A guided 45-minute forest meditation at first light. Barefoot on the forest floor, guided breathwork, and a silent walk back to the farm in time for breakfast.',
    price: 2500, priceNote: '/ person', duration: '45 min',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800',
    tag: 'Experience', unit: '/ person', requiresDate: true, requiresGuests: false,
    color: '#A8D4B4', accent: 'rgba(168,212,180,0.15)',
  },
  {
    id: 'exp-village-walk', category: 'experiences',
    name: 'Village Cultural Walk', tagline: 'The human story of this land',
    description: 'A 2-hour guided walk through the village with a local historian. Covers the Pokomo heritage, traditional building methods, the village well, and seasonal rituals.',
    price: 3000, priceNote: '/ person', duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?q=80&w=800',
    tag: 'Experience', unit: '/ person', requiresDate: true, requiresGuests: true,
    badge: 'Community', color: '#A8D4B4', accent: 'rgba(168,212,180,0.15)',
  },
  {
    id: 'exp-stargazing', category: 'experiences',
    name: 'Rift Valley Stargazing', tagline: 'The clearest skies in East Africa',
    description: 'A 2-hour guided stargazing session with a telescope and expert narrator. Held in the upper field, away from all light. Includes warm baobab drink and fire-pit blankets.',
    price: 4000, priceNote: '/ person', duration: '2 hours',
    image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?q=80&w=800',
    tag: 'Experience', unit: '/ person', requiresDate: true, requiresGuests: false,
    badge: 'After Dark', color: '#A8D4B4', accent: 'rgba(168,212,180,0.15)',
  },
]

// ─────────────────────────────────────────────────────────────────────
// CALENDAR EVENTS — village schedule (preserved exactly)
// ─────────────────────────────────────────────────────────────────────
interface CalendarEvent {
  id: string
  day: number
  month: number
  year: number
  name: string
  type: 'public' | 'corporate' | 'seasonal' | 'private'
  description: string
  price: number
  spotsLeft?: number
  serviceId?: string
  color: string
}

const CALENDAR_EVENTS: CalendarEvent[] = [
  { id: 'ce-1',  day: 3,  month: 4, year: 2026, name: 'Dawn Farm Walk',             type: 'public',    description: 'Guided harvest morning with breakfast.',       price: 3500,   spotsLeft: 6,  serviceId: 'farm-walk-dawn',         color: 'var(--neon)' },
  { id: 'ce-2',  day: 7,  month: 4, year: 2026, name: 'Corporate Retreat',           type: 'corporate', description: 'Exclusive venue buyout.',                      price: 180000, spotsLeft: 0,  serviceId: 'event-corporate',        color: 'var(--gold)' },
  { id: 'ce-3',  day: 10, month: 4, year: 2026, name: 'Apiary Open Day',             type: 'public',    description: 'Meet the bees. Taste raw honey.',              price: 4500,   spotsLeft: 8,  serviceId: 'farm-beekeeping',        color: 'var(--neon)' },
  { id: 'ce-4',  day: 14, month: 4, year: 2026, name: 'Full Moon Dinner',            type: 'seasonal',  description: '7-course farm table under the moon.',          price: 8500,   spotsLeft: 4,  serviceId: 'dinner-farm-table',      color: '#D4906A'     },
  { id: 'ce-5',  day: 17, month: 4, year: 2026, name: 'Private Wedding',             type: 'private',   description: 'Full venue — private booking.',                price: 350000,                serviceId: 'event-wedding',          color: '#F0A8B8'     },
  { id: 'ce-6',  day: 21, month: 4, year: 2026, name: 'Seed-to-Soil Workshop',       type: 'public',    description: 'Hands-on kitchen garden session.',             price: 5000,   spotsLeft: 10, serviceId: 'farm-planting-workshop', color: 'var(--neon)' },
  { id: 'ce-7',  day: 24, month: 4, year: 2026, name: 'Sunset Cocktail Night',       type: 'public',    description: 'Firepit sundowners, signature cocktails.',     price: 3500,   spotsLeft: 12, serviceId: 'cocktail-fire-evening',  color: '#D4906A'     },
  { id: 'ce-8',  day: 28, month: 4, year: 2026, name: 'Ubuntu Couples Retreat',      type: 'seasonal',  description: 'Spa, dinner, stargazing for two.',             price: 28000,  spotsLeft: 3,  serviceId: 'spa-ubuntu-couples',     color: '#F0A8B8'     },
  { id: 'ce-9',  day: 2,  month: 5, year: 2026, name: 'Farm Breakfast Club',         type: 'public',    description: 'Weekly harvest breakfast.',                    price: 2800,   spotsLeft: 14, serviceId: 'breakfast-farm',         color: '#D4906A'     },
  { id: 'ce-10', day: 8,  month: 5, year: 2026, name: 'Stargazing Evening',          type: 'public',    description: 'Rift Valley night sky session.',               price: 4000,   spotsLeft: 9,  serviceId: 'exp-stargazing',         color: '#A8D4B4'     },
  { id: 'ce-11', day: 11, month: 5, year: 2026, name: 'Corporate Day',               type: 'corporate', description: 'Team facilitation & farm experience.',         price: 180000, spotsLeft: 0,  serviceId: 'event-corporate',        color: 'var(--gold)' },
  { id: 'ce-12', day: 15, month: 5, year: 2026, name: 'Cultural Walk',               type: 'public',    description: 'Village heritage guided tour.',                price: 3000,   spotsLeft: 16, serviceId: 'exp-village-walk',       color: '#A8D4B4'     },
  { id: 'ce-13', day: 20, month: 5, year: 2026, name: 'Forest Meditation',           type: 'seasonal',  description: 'Barefoot sunrise session.',                    price: 2500,   spotsLeft: 7,  serviceId: 'exp-sunrise-forest',     color: '#A8D4B4'     },
  { id: 'ce-14', day: 25, month: 5, year: 2026, name: "Farm-to-Fork Chef's Table",   type: 'public',    description: 'Exclusive 7-course dining experience.',        price: 6500,   spotsLeft: 6,  serviceId: 'dinner-farm-table',      color: '#D4906A'     },
]

// ─────────────────────────────────────────────────────────────────────
// SERVICE MODAL
//
// CHANGE v4 — Reserve & Pay Now is now a two-state button:
//
//   State A (item NOT in cart):
//     Label  → "Reserve & Pay Now"
//     Action → addItem to main cart + close modal + openCart
//     Result → guest lands in CartPanel with item ready for checkout
//
//   State B (item already in cart):
//     Label  → "View in Cart & Pay"
//     Action → close modal + openCart
//     Result → guest goes straight to CartPanel to complete payment
//
// Everything else in the modal — inquiry flow, date picker,
// guest counter, notes, all data — is preserved exactly.
// The internal payment steps (mpesa-stk, processing, confirmed)
// are removed because payment now lives in CartPanel.
// The "Add to Cart — Checkout Later" button is also kept, unchanged.
// ─────────────────────────────────────────────────────────────────────
interface ServiceModalProps {
  service: UKVService | null
  prefillDate?: string
  onClose: () => void
}

// Inquiry-only modal steps (payment steps removed — CartPanel handles those)
type ModalStep = 'detail' | 'inquire' | 'inquiry-confirmed'

function ServiceModal({ service, prefillDate, onClose }: ServiceModalProps) {
  const { addItem, items, openCart } = useCartStore()

  const [step, setStep]               = useState<ModalStep>('detail')
  const [checkIn, setCheckIn]         = useState(prefillDate || '')
  const [checkOut, setCheckOut]       = useState('')
  const [guests, setGuests]           = useState(2)
  const [name, setName]               = useState('')
  const [email, setEmail]             = useState('')
  const [phone, setPhone]             = useState('')
  const [notes, setNotes]             = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading]         = useState(false)
  const [confirmed, setConfirmed]     = useState<string | null>(null)   // inquiry ref
  const [imgErr, setImgErr]           = useState(false)

  useEffect(() => {
    if (prefillDate) setCheckIn(prefillDate)
  }, [prefillDate])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  if (!service) return null

  const alreadyInCart = items.some(i => i.id === service.id)
  const catColor      = SERVICE_CATEGORIES.find(c => c.id === service.category)?.color || 'var(--gold)'
  const totalPrice    = service.requiresGuests ? service.price * guests : service.price

  // ─────────────────────────────────────────────────────────────────
  // handleReserveAndPay
  //
  // State A — not yet in cart:
  //   1. addItem to global cartStore (Nav count updates instantly)
  //   2. Toast confirms the add
  //   3. Close this modal
  //   4. openCart → CartPanel slides in with item ready for checkout
  //
  // State B — already in cart:
  //   1. Close modal
  //   2. openCart → CartPanel where they can complete payment
  // ─────────────────────────────────────────────────────────────────
  const handleReserveAndPay = () => {
    if (!alreadyInCart) {
      addItem({
        id:       service.id,
        name:     service.name,
        tag:      service.tag,
        category: service.category,
        price:    service.price,
        unit:     service.unit,
        // Pass guest count and check-in so CartPanel can display them
        quantity: service.requiresGuests ? guests : 1,
        checkIn:  checkIn  || undefined,
        guests:   service.requiresGuests ? guests : undefined,
      } as Parameters<typeof addItem>[0])
      toast.success(`${service.name} added — completing checkout in your cart`, { duration: 3000 })
    }
    onClose()
    openCart()
  }

  // ─────────────────────────────────────────────────────────────────
  // handleAddToCart — "Add to Cart — Checkout Later" (preserved exactly)
  // ─────────────────────────────────────────────────────────────────
  const handleAddToCart = () => {
    if (alreadyInCart) {
      toast('Already in your booking cart', { icon: '✦' })
      openCart()
      return
    }
    addItem({
      id:       service.id,
      name:     service.name,
      tag:      service.tag,
      category: service.category,
      price:    service.price,
      unit:     service.unit,
      quantity: service.requiresGuests ? guests : 1,
      checkIn:  checkIn || undefined,
      guests:   service.requiresGuests ? guests : undefined,
    } as Parameters<typeof addItem>[0])
    toast.success(`${service.name} added to your booking`)
    onClose()
  }

  // ─────────────────────────────────────────────────────────────────
  // handleInquiry — preserved exactly from original
  // ─────────────────────────────────────────────────────────────────
  const handleInquiry = async () => {
    if (!name || !email) { toast.error('Enter your name and email'); return }
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    const ref = generateRef('INQ')
    setConfirmed(ref)
    setStep('inquiry-confirmed')
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-end md:items-center justify-center bg-black/95 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose} />

      <div
        className="relative w-full max-w-5xl max-h-[96vh] md:max-h-[92vh] flex flex-col md:flex-row overflow-hidden z-10"
        style={{
          background: 'var(--bg2, #0a0a0a)',
          border: `0.5px solid ${catColor}33`,
          boxShadow: `0 0 80px rgba(0,0,0,0.9), 0 0 40px ${catColor}08`,
        }}
      >
        {/* ── LEFT IMAGE ── */}
        <div className="relative md:w-[42%] h-52 md:h-auto flex-shrink-0 overflow-hidden">
          <Image
            src={imgErr ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' : service.image}
            alt={service.name}
            fill
            className="object-cover"
            onError={() => setImgErr(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

          {service.badge && (
            <div
              className="absolute top-5 left-5 px-3 py-1 text-[8px] uppercase tracking-[0.25em] font-body"
              style={{ background: `${catColor}20`, border: `0.5px solid ${catColor}60`, color: catColor }}
            >
              {service.badge}
            </div>
          )}

          {/* "In Cart" indicator — shows as soon as item is in cart */}
          {alreadyInCart && (
            <div className="absolute top-5 right-5 z-10">
              <span
                className="flex items-center gap-1.5 px-2.5 py-1 font-body text-[8px] uppercase tracking-widest"
                style={{
                  background: 'rgba(212,168,55,0.18)',
                  border: '0.5px solid rgba(212,168,55,0.5)',
                  color: 'var(--gold, #c8a84b)',
                }}
              >
                <span style={{ fontSize: '6px' }}>●</span>
                In Cart
              </span>
            </div>
          )}

          <div className="absolute bottom-5 left-5">
            <p className="font-display text-3xl" style={{ color: catColor }}>
              KES {service.price.toLocaleString()}
            </p>
            <p className="font-body text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {service.priceNote}{service.duration && ` · ${service.duration}`}
            </p>
          </div>
        </div>

        {/* ── RIGHT CONTENT ── */}
        <div className="flex-1 flex flex-col overflow-hidden">

          {/* Header */}
          <div
            className="flex items-start justify-between px-8 py-6 flex-shrink-0"
            style={{ borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}
          >
            <div>
              <div className="text-[8px] uppercase tracking-[0.3em] mb-1 font-body" style={{ color: catColor }}>
                {service.tag}
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-light" style={{ color: 'var(--cream, #EDE6D3)' }}>
                {service.name}
              </h2>
              <p className="font-body text-[11px] mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                {service.tagline}
              </p>
            </div>
            <button
              onClick={onClose}
              className="font-body text-[9px] uppercase tracking-widest transition-colors ml-4 flex-shrink-0 mt-1"
              style={{ color: 'rgba(255,255,255,0.2)', background: 'none', border: 'none', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.color = 'white')}
              onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
            >
              [ Close ]
            </button>
          </div>

          {/* Scrollable body */}
          <div className="flex-1 overflow-y-auto px-8 py-6" style={{ scrollbarWidth: 'none' }}>

            {/* ════════════════════════════════════════
                DETAIL STEP
            ════════════════════════════════════════ */}
            {step === 'detail' && (
              <div className="space-y-6">
                <p className="font-body text-[13px] leading-[1.85]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {service.description}
                </p>

                {/* Guest selector — preserved exactly */}
                {service.requiresGuests && (
                  <div>
                    <label className="block text-[8px] uppercase tracking-[0.25em] mb-2 font-body" style={{ color: 'rgba(255,255,255,0.3)' }}>
                      Number of Guests
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setGuests(g => Math.max(1, g - 1))}
                        className="w-8 h-8 flex items-center justify-center transition-colors"
                        style={{ border: '0.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', background: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = catColor)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                      >−</button>
                      <span className="font-display text-2xl w-8 text-center" style={{ color: 'var(--cream, #EDE6D3)' }}>{guests}</span>
                      <button
                        onClick={() => setGuests(g => g + 1)}
                        className="w-8 h-8 flex items-center justify-center transition-colors"
                        style={{ border: '0.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.5)', background: 'none', cursor: 'pointer' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = catColor)}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)')}
                      >+</button>
                      <span className="font-body text-[10px]" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        guest{guests !== 1 ? 's' : ''} · KES {totalPrice.toLocaleString()} total
                      </span>
                    </div>
                  </div>
                )}

                {/* Date fields — preserved exactly */}
                {service.requiresDate && (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[8px] uppercase tracking-[0.25em] mb-2 font-body" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {service.category === 'accommodation' ? 'Check-in' : 'Date'}
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={e => setCheckIn(e.target.value)}
                        style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', padding: '8px 12px', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '12px', outline: 'none' }}
                      />
                    </div>
                    {service.category === 'accommodation' && (
                      <div>
                        <label className="block text-[8px] uppercase tracking-[0.25em] mb-2 font-body" style={{ color: 'rgba(255,255,255,0.3)' }}>
                          Check-out
                        </label>
                        <input
                          type="date"
                          value={checkOut}
                          onChange={e => setCheckOut(e.target.value)}
                          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '0.5px solid rgba(255,255,255,0.12)', padding: '8px 12px', color: 'var(--cream)', fontFamily: 'var(--font-body)', fontSize: '12px', outline: 'none' }}
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* Notes — preserved exactly */}
                <div>
                  <label className="block text-[8px] uppercase tracking-[0.25em] mb-2 font-body" style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Special requests or notes
                  </label>
                  <textarea
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    rows={3}
                    placeholder="Dietary requirements, accessibility needs, anniversary celebration, preferred time..."
                    style={{ width: '100%', background: 'rgba(255,255,255,0.03)', border: '0.5px solid rgba(255,255,255,0.1)', padding: '10px 14px', color: 'var(--cream, #EDE6D3)', fontFamily: 'var(--font-body)', fontSize: '12px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {/* ── CTA ROW ─────────────────────────────────────────────
                    Three actions:
                    1. "Reserve & Pay Now" / "View in Cart & Pay"
                       → adds to cart (if not already) + closes + opens CartPanel
                    2. "Send Inquiry" → no cart, opens inquiry form
                    3. "+ Add to Cart — Checkout Later" → cart only, closes modal
                ──────────────────────────────────────────────────────── */}
                <div className="flex flex-col gap-3 pt-2">
                  <div className="grid grid-cols-2 gap-3">

                    {/* PRIMARY CTA — Reserve & Pay Now / View in Cart & Pay */}
                    <button
                      onClick={handleReserveAndPay}
                      className="relative py-4 font-body text-[10px] uppercase tracking-[0.25em] transition-all overflow-hidden"
                      style={{
                        background: catColor,
                        color: '#0a0a0a',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                      onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
                    >
                      {alreadyInCart ? 'View in Cart & Pay' : 'Reserve & Pay Now'}
                    </button>

                    {/* SECONDARY — Send Inquiry */}
                    <button
                      onClick={() => setStep('inquire')}
                      className="py-4 font-body text-[10px] uppercase tracking-[0.25em] transition-all"
                      style={{ border: `0.5px solid ${catColor}50`, color: catColor, background: 'transparent', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = `${catColor}10`)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Send Inquiry
                    </button>
                  </div>

                  {/* TERTIARY — Add to Cart, Checkout Later */}
                  <button
                    onClick={handleAddToCart}
                    className="py-3 font-body text-[9px] uppercase tracking-[0.2em] transition-all"
                    style={{
                      border: '0.5px solid rgba(255,255,255,0.12)',
                      color: alreadyInCart ? catColor : 'rgba(255,255,255,0.5)',
                      background: alreadyInCart ? `${catColor}08` : 'transparent',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={e => { if (!alreadyInCart) (e.currentTarget as HTMLElement).style.borderColor = `${catColor}40` }}
                    onMouseLeave={e => { if (!alreadyInCart) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)' }}
                  >
                    {alreadyInCart ? '✓ In Your Booking Cart' : '+ Add to Cart — Checkout Later'}
                  </button>

                  {/* Cart shortcut — only when item is already in cart */}
                  {alreadyInCart && (
                    <button
                      onClick={() => { onClose(); openCart() }}
                      className="py-2 font-body text-[8px] uppercase tracking-widest text-center transition-colors"
                      style={{ color: 'rgba(212,168,55,0.6)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold, #c8a84b)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'rgba(212,168,55,0.6)')}
                    >
                      Open Cart →
                    </button>
                  )}
                </div>

                {/* ── Payment context note ──────────────────────────────
                    Explains to the guest that payment happens in the
                    main cart — one consistent checkout for everything.
                ──────────────────────────────────────────────────────── */}
                <div
                  className="flex items-start gap-3 px-4 py-3"
                  style={{ background: 'rgba(255,255,255,0.02)', border: '0.5px solid rgba(255,255,255,0.06)' }}
                >
                  <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px', flexShrink: 0, marginTop: '1px' }}>ℹ</span>
                  <p className="font-body text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.28)' }}>
                    Payment is completed in your cart — pay by M-Pesa, card, or room charge.
                    You can add multiple services and check out together.
                  </p>
                </div>
              </div>
            )}

            {/* ════════════════════════════════════════
                INQUIRE STEP — preserved exactly
            ════════════════════════════════════════ */}
            {step === 'inquire' && (
              <div className="space-y-4">
                <button
                  onClick={() => setStep('detail')}
                  className="font-body text-[9px] uppercase tracking-widest transition-colors"
                  style={{ color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer' }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'white')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.25)')}
                >
                  ← Back
                </button>
                <p className="font-body text-[12px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  No commitment needed. Send us your interest and our team will reach out within 24 hours with availability, custom pricing, and any other details you need.
                </p>
                <MField label="Full Name *">
                  <input className="ukv-input" placeholder="Jane Kamau" value={name} onChange={e => setName(e.target.value)} />
                </MField>
                <MField label="Email *">
                  <input className="ukv-input" type="email" placeholder="jane@example.com" value={email} onChange={e => setEmail(e.target.value)} />
                </MField>
                <MField label="Phone / WhatsApp">
                  <input className="ukv-input" placeholder="+254 7xx xxx xxx" value={phone} onChange={e => setPhone(e.target.value)} />
                </MField>
                <MField label="Description">
                  <textarea
                    className="ukv-input"
                    style={{ minHeight: '80px', resize: 'vertical' }}
                    placeholder="Describe your group, dates in mind, what you're planning, any specific questions..."
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                  />
                </MField>
                <MField label="Special Requests or Notes">
                  <textarea
                    className="ukv-input"
                    style={{ minHeight: '60px', resize: 'vertical' }}
                    placeholder="Dietary requirements, accessibility, occasion details..."
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                  />
                </MField>
                <button
                  onClick={handleInquiry}
                  disabled={loading}
                  className="w-full py-4 font-body text-[10px] uppercase tracking-[0.25em] transition-all"
                  style={{
                    border: `0.5px solid ${catColor}`,
                    color: catColor,
                    background: `${catColor}0a`,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? 'wait' : 'pointer',
                  }}
                >
                  {loading ? 'Sending...' : 'Send Inquiry — No Payment Required'}
                </button>
              </div>
            )}

            {/* ════════════════════════════════════════
                INQUIRY CONFIRMED — preserved exactly
            ════════════════════════════════════════ */}
            {step === 'inquiry-confirmed' && confirmed && (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-5">
                <div
                  className="w-14 h-14 flex items-center justify-center"
                  style={{ border: `0.5px solid ${catColor}`, color: catColor, fontSize: '24px' }}
                >
                  ✦
                </div>
                <div>
                  <h3 className="font-display text-2xl font-light" style={{ color: 'var(--cream, #EDE6D3)' }}>
                    Inquiry <em style={{ color: catColor, fontStyle: 'italic' }}>Received</em>
                  </h3>
                  <p className="font-body text-[12px] mt-2 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Our team will be in touch within 24 hours to curate your experience.
                  </p>
                </div>
                <div
                  className="px-5 py-2.5 font-body text-[10px] uppercase tracking-[0.2em]"
                  style={{ background: `${catColor}15`, border: `0.5px solid ${catColor}40`, color: catColor }}
                >
                  Ref # {confirmed}
                </div>
                <button
                  onClick={onClose}
                  className="btn-gold w-full"
                  style={{ padding: '14px 28px', border: 'none', cursor: 'pointer' }}
                >
                  Back to the Village
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .ukv-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 0.5px solid rgba(255,255,255,0.12);
          padding: 10px 14px;
          color: var(--cream, #EDE6D3);
          font-family: var(--font-body);
          font-size: 12px;
          outline: none;
          transition: border-color 0.2s;
        }
        .ukv-input:focus { border-color: rgba(200,168,75,0.4); }
        .ukv-input::placeholder { color: rgba(255,255,255,0.2); }
      `}</style>
    </div>
  )
}

function MField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-[8px] uppercase tracking-[0.2em] mb-1.5 font-body"
        style={{ color: 'rgba(255,255,255,0.3)' }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// CALENDAR COMPONENT — preserved exactly from document 14
// ─────────────────────────────────────────────────────────────────────
function VillageCalendar({
  onDateClick,
  onEventClick,
}: {
  onDateClick: (date: string) => void
  onEventClick: (event: CalendarEvent) => void
}) {
  const today = new Date()
  const [year,     setYear]     = useState(today.getFullYear())
  const [month,    setMonth]    = useState(today.getMonth())
  const [selected, setSelected] = useState<number | null>(null)

  const shiftMonth = (d: number) => {
    let m = month + d, y = year
    if (m > 11) { m = 0; y++ }
    if (m < 0)  { m = 11; y-- }
    setMonth(m); setYear(y); setSelected(null)
  }

  const firstDay    = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const eventsThisMonth = CALENDAR_EVENTS.filter(e => e.month === month && e.year === year)
  const eventsByDay = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {}
    eventsThisMonth.forEach(e => {
      if (!map[e.day]) map[e.day] = []
      map[e.day].push(e)
    })
    return map
  }, [eventsThisMonth])

  const selectedEvents = selected ? (eventsByDay[selected] || []) : []

  const handleDayClick = (d: number) => {
    setSelected(d === selected ? null : d)
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    if (!eventsByDay[d]?.length) onDateClick(dateStr)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5">
      <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', padding: '28px' }}>
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => shiftMonth(-1)}
            className="px-4 py-2 text-[13px] font-body transition-all"
            style={{ border: '0.5px solid var(--border2)', color: 'var(--cream)', background: 'none', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
          >←</button>
          <div className="text-center">
            <h3 className="font-display text-2xl font-light">{MONTHS[month]}</h3>
            <span className="font-body text-[10px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>{year}</span>
          </div>
          <button
            onClick={() => shiftMonth(1)}
            className="px-4 py-2 text-[13px] font-body transition-all"
            style={{ border: '0.5px solid var(--border2)', color: 'var(--cream)', background: 'none', cursor: 'pointer' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--gold)'; (e.currentTarget as HTMLElement).style.color = 'var(--gold)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border2)'; (e.currentTarget as HTMLElement).style.color = 'var(--cream)' }}
          >→</button>
        </div>

        <div className="grid grid-cols-7 mb-3">
          {DAYS.map(d => (
            <div key={d} className="text-center text-[9px] uppercase tracking-widest py-1 font-body" style={{ color: 'var(--muted)' }}>{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-[2px]">
          {Array.from({ length: firstDay }).map((_, i) => <div key={`e-${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const d         = i + 1
            const isToday   = d === today.getDate() && month === today.getMonth() && year === today.getFullYear()
            const dayEvents = eventsByDay[d] || []
            const hasEvents = dayEvents.length > 0
            const isSel     = selected === d
            const isPast    = new Date(year, month, d) < new Date(today.getFullYear(), today.getMonth(), today.getDate())

            return (
              <button
                key={d}
                onClick={() => handleDayClick(d)}
                className="relative flex flex-col items-center justify-start pt-2 pb-1 text-[12px] font-body transition-all duration-150 group"
                style={{
                  aspectRatio: '1',
                  border: isSel ? '0.5px solid var(--gold)' : '0.5px solid transparent',
                  background: isSel ? 'var(--gold-dim)' : 'transparent',
                  color: isPast ? 'rgba(255,255,255,0.15)' : isSel || isToday ? 'var(--gold)' : 'var(--cream)',
                  cursor: 'pointer',
                  opacity: isPast && !hasEvents ? 0.4 : 1,
                }}
                onMouseEnter={e => { if (!isSel) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(200,168,75,0.3)' } }}
                onMouseLeave={e => { if (!isSel) { (e.currentTarget as HTMLElement).style.borderColor = 'transparent' } }}
              >
                <span className="leading-none">{d}</span>
                {hasEvents && (
                  <div className="flex gap-0.5 mt-1 justify-center">
                    {dayEvents.slice(0, 3).map((ev, idx) => (
                      <span key={idx} className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: ev.color }} />
                    ))}
                  </div>
                )}
                {!hasEvents && !isPast && (
                  <span
                    className="absolute bottom-0.5 left-0 right-0 text-center font-body opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ fontSize: '6px', color: 'var(--gold)', letterSpacing: '0.05em' }}
                  >
                    Plan
                  </span>
                )}
              </button>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-4 mt-5 pt-4" style={{ borderTop: '0.5px solid var(--border2)' }}>
          {[
            { color: 'var(--neon)',  label: 'Farm / Experience'   },
            { color: '#D4906A',      label: 'Dining Event'        },
            { color: '#F0A8B8',      label: 'Spa / Wellness'      },
            { color: 'var(--gold)',  label: 'Corporate / Private' },
            { color: '#B8A9F0',      label: 'Venue Event'         },
          ].map(l => (
            <div key={l.label} className="flex items-center gap-1.5">
              <span className="w-[5px] h-[5px] rounded-full flex-shrink-0" style={{ background: l.color }} />
              <span className="font-body text-[9px]" style={{ color: 'var(--muted)' }}>{l.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Calendar sidebar */}
      <div className="flex flex-col gap-3">
        {selectedEvents.length > 0 && (
          <div>
            <p className="font-body text-[8px] uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--muted)' }}>
              {MONTHS[month]} {selected}, {year}
            </p>
            {selectedEvents.map(ev => {
              const isBooked = ev.type === 'corporate' || ev.type === 'private' || ev.spotsLeft === 0
              return (
                <div key={ev.id} className="p-4 mb-2" style={{ background: 'var(--bg2)', border: `0.5px solid ${ev.color}60` }}>
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-display text-[17px] font-light leading-tight">{ev.name}</h4>
                    {ev.spotsLeft !== undefined && ev.spotsLeft <= 5 && ev.spotsLeft > 0 && (
                      <span className="font-body text-[8px] uppercase tracking-widest px-2 py-0.5 flex-shrink-0"
                        style={{ background: 'rgba(255,80,80,0.1)', border: '0.5px solid rgba(255,80,80,0.3)', color: 'rgba(255,120,120,0.9)' }}>
                        {ev.spotsLeft} left
                      </span>
                    )}
                  </div>
                  <p className="font-body text-[11px] mb-2" style={{ color: 'var(--muted)' }}>{ev.description}</p>
                  <p className="font-display text-lg mb-3" style={{ color: ev.color }}>KES {ev.price.toLocaleString()}</p>
                  {isBooked ? (
                    <p className="font-body text-[10px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                      {ev.spotsLeft === 0 ? 'Fully Booked' : 'Private Venue'}
                    </p>
                  ) : (
                    <button
                      onClick={() => onEventClick(ev)}
                      className="w-full py-2.5 font-body text-[9px] uppercase tracking-[0.2em] transition-all"
                      style={{ border: `0.5px solid ${ev.color}60`, color: ev.color, background: 'transparent', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.background = `${ev.color}10`)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      Book This →
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {selected && selectedEvents.length === 0 && (
          <div className="p-5" style={{ background: 'var(--bg2)', border: '0.5px solid rgba(200,168,75,0.3)' }}>
            <p className="font-body text-[8px] uppercase tracking-widest mb-2" style={{ color: 'var(--muted)' }}>
              {MONTHS[month]} {selected}, {year}
            </p>
            <h4 className="font-display text-xl font-light mb-2">Plan Your Visit</h4>
            <p className="font-body text-[12px] leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>
              This date is open. Book a cottage, arrange a spa day, plan a private dinner, or bring your group.
            </p>
            <button
              onClick={() => {
                const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selected).padStart(2, '0')}`
                onDateClick(dateStr)
              }}
              className="w-full py-3 btn-gold font-body text-[9px] uppercase tracking-[0.2em]"
            >
              Explore Services →
            </button>
          </div>
        )}

        <div>
          <p className="font-body text-[8px] uppercase tracking-[0.25em] mb-2" style={{ color: 'var(--muted)' }}>
            Upcoming in {MONTHS[month]}
          </p>
          {eventsThisMonth.length === 0 ? (
            <p className="font-body text-[12px]" style={{ color: 'var(--muted)' }}>
              No events this month. Navigate to find upcoming dates.
            </p>
          ) : (
            eventsThisMonth.slice(0, 5).map(ev => (
              <button
                key={ev.id}
                onClick={() => { setSelected(ev.day); onEventClick(ev) }}
                className="w-full text-left p-3 mb-2 transition-all font-body"
                style={{ background: 'var(--bg2)', border: '0.5px solid var(--border2)', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = ev.color)}
                onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest mb-0.5" style={{ color: ev.color }}>{MONTHS[month].slice(0,3)} {ev.day}</p>
                    <p className="font-display text-[15px] font-light leading-tight">{ev.name}</p>
                    <p className="text-[10px] mt-0.5" style={{ color: 'var(--muted)' }}>
                      KES {ev.price.toLocaleString()} · {ev.spotsLeft !== undefined ? (ev.spotsLeft === 0 ? 'Full' : `${ev.spotsLeft} spots`) : 'Contact us'}
                    </p>
                  </div>
                  <span style={{ color: ev.color, fontSize: '10px' }}>→</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// SERVICE GRID — preserved exactly from document 14
// ─────────────────────────────────────────────────────────────────────
function ServiceGrid({
  prefillDate,
  onSelectService,
}: {
  prefillDate: string
  onSelectService: (service: UKVService) => void
}) {
  const [activeCategory, setActiveCategory] = useState<ServiceCategory | 'all'>('all')
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})
  const { items } = useCartStore()

  const filtered = activeCategory === 'all'
    ? UKV_SERVICES
    : UKV_SERVICES.filter(s => s.category === activeCategory)

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-8">
        <button
          onClick={() => setActiveCategory('all')}
          className="px-4 py-2 font-body text-[9px] uppercase tracking-[0.2em] transition-all"
          style={{
            background: activeCategory === 'all' ? 'rgba(200,168,75,0.15)' : 'transparent',
            border: `0.5px solid ${activeCategory === 'all' ? 'var(--gold)' : 'var(--border2)'}`,
            color: activeCategory === 'all' ? 'var(--gold)' : 'var(--muted)',
            cursor: 'pointer',
          }}
        >
          All Services
        </button>
        {SERVICE_CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            className="px-4 py-2 font-body text-[9px] uppercase tracking-[0.2em] transition-all flex items-center gap-1.5"
            style={{
              background: activeCategory === cat.id ? `${cat.color}18` : 'transparent',
              border: `0.5px solid ${activeCategory === cat.id ? cat.color : 'var(--border2)'}`,
              color: activeCategory === cat.id ? cat.color : 'var(--muted)',
              cursor: 'pointer',
            }}
          >
            <span>{cat.icon}</span>
            {cat.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {filtered.map(service => {
          const catColor = SERVICE_CATEGORIES.find(c => c.id === service.category)?.color || 'var(--gold)'
          const inCart   = items.some(i => i.id === service.id)

          return (
            <div
              key={service.id}
              className="group flex flex-col overflow-hidden cursor-pointer transition-all duration-500"
              style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${catColor}50`; (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 30px ${catColor}08` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'; (e.currentTarget as HTMLElement).style.boxShadow = 'none' }}
              onClick={() => onSelectService(service)}
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={imgErrors[service.id] ? 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800' : service.image}
                  alt={service.name}
                  fill
                  className="object-cover transition-transform duration-[2s] group-hover:scale-105"
                  loading="lazy"
                  onError={() => setImgErrors(prev => ({ ...prev, [service.id]: true }))}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                <div
                  className="absolute top-3 left-3 px-2 py-0.5 font-body text-[7px] uppercase tracking-widest"
                  style={{ background: `${catColor}20`, border: `0.5px solid ${catColor}50`, color: catColor }}
                >
                  {service.tag}
                </div>
                {service.badge && (
                  <div
                    className="absolute top-3 right-3 px-2 py-0.5 font-body text-[7px] uppercase tracking-widest"
                    style={{ background: 'rgba(0,0,0,0.6)', border: '0.5px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)' }}
                  >
                    {service.badge}
                  </div>
                )}
                {inCart && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <span
                      className="px-3 py-1.5 font-body text-[9px] uppercase tracking-widest"
                      style={{ background: `${catColor}20`, border: `0.5px solid ${catColor}`, color: catColor }}
                    >
                      ✓ In Your Cart
                    </span>
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="font-display text-[18px] font-light mb-0.5 group-hover:text-[var(--gold)] transition-colors">
                  {service.name}
                </h3>
                <p className="font-body text-[10px] mb-3" style={{ color: 'var(--muted)' }}>
                  {service.tagline}
                </p>
                <p className="font-body text-[11px] leading-relaxed mb-4 line-clamp-2" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  {service.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <div>
                    <p className="font-display text-[20px] font-light" style={{ color: catColor }}>
                      KES {service.price.toLocaleString()}
                    </p>
                    <p className="font-body text-[9px] uppercase tracking-widest" style={{ color: 'var(--muted)' }}>
                      {service.priceNote}{service.duration ? ` · ${service.duration}` : ''}
                    </p>
                  </div>
                  <div
                    className="w-9 h-9 flex items-center justify-center transition-all"
                    style={{ border: `0.5px solid ${catColor}50`, color: catColor }}
                  >
                    →
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// CONTACT FORM — preserved exactly from document 14
// ─────────────────────────────────────────────────────────────────────
type FormType = 'accommodation' | 'spa' | 'events' | 'general'

const FORM_TYPES: { id: FormType; label: string; accent: string }[] = [
  { id: 'accommodation', label: 'Book a Stay',     accent: 'var(--gold)'  },
  { id: 'spa',           label: 'Book the Spa',    accent: '#F0A8B8'      },
  { id: 'events',        label: 'Plan an Event',   accent: '#B8A9F0'      },
  { id: 'general',       label: 'General Enquiry', accent: 'var(--neon)'  },
]

const COTTAGES = [
  'Pokomo Cottage 1', 'Pokomo Cottage 2', 'Pokomo Cottage 3', 'Pokomo Cottage 4',
  'Farmhouse Suite A', 'Farmhouse Suite B', 'No preference',
]

const SPA_TREATMENTS = [
  'Volcanic Mud Ritual', 'Forest Massage', 'Botanical Wrap',
  'Sunrise Forest Meditation', 'African Honey Facial', 'Ubuntu Couples Ritual', 'Not sure yet',
]

function ContactForm() {
  const [formType,  setFormType]  = useState<FormType>('accommodation')
  const [submitted, setSubmitted] = useState(false)
  const [loading,   setLoading]   = useState(false)
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    checkIn: '', checkOut: '', guests: '2', cottage: 'No preference',
    treatment: 'Not sure yet', eventType: '', eventGuests: '', message: '',
    dietary: '', consent: false,
  })

  const accent = FORM_TYPES.find(f => f.id === formType)?.accent || 'var(--neon)'
  const update = (field: string, value: string | boolean) => setForm(p => ({ ...p, [field]: value }))

  const inputStyle = {
    width: '100%', background: 'rgba(255,255,255,0.04)',
    border: '0.5px solid rgba(255,255,255,0.12)', padding: '10px 14px',
    color: 'var(--cream, #EDE6D3)', fontFamily: 'var(--font-body)',
    fontSize: '12px', outline: 'none',
  }
  const labelStyle = {
    display: 'block', fontFamily: 'var(--font-body)', fontSize: '9px',
    letterSpacing: '0.2em', textTransform: 'uppercase' as const,
    color: 'rgba(255,255,255,0.3)', marginBottom: '6px',
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="text-center py-16">
        <div
          className="w-14 h-14 flex items-center justify-center mx-auto mb-6"
          style={{ background: 'rgba(0,255,65,0.08)', border: '0.5px solid rgba(0,255,65,0.3)', color: 'var(--neon)', fontSize: '22px' }}
        >
          ✓
        </div>
        <h3 className="font-display text-2xl font-light mb-3">Message Received</h3>
        <p className="font-body text-[12px] leading-loose mb-6" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Thank you, {form.firstName}. The Ubuntu team will be in touch within 24 hours.
        </p>
        <button onClick={() => setSubmitted(false)} className="btn-neon text-[10px]">
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {FORM_TYPES.map(ft => (
          <button
            key={ft.id}
            onClick={() => setFormType(ft.id)}
            className="font-body text-[9px] tracking-wider uppercase py-3 px-3 transition-all"
            style={{
              border: `0.5px solid ${formType === ft.id ? ft.accent : 'rgba(255,255,255,0.1)'}`,
              background: formType === ft.id ? `${ft.accent}15` : 'transparent',
              color: formType === ft.id ? ft.accent : 'rgba(255,255,255,0.35)',
              cursor: 'pointer',
            }}
          >
            {ft.label}
          </button>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ background: 'var(--bg2)', border: `0.5px solid ${accent}20`, padding: '28px' }}>
          <div className="h-px mb-6" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)`, opacity: 0.35 }} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label style={labelStyle}>First Name *</label><input required type="text" value={form.firstName} onChange={e => update('firstName', e.target.value)} style={inputStyle} placeholder="Your first name" /></div>
            <div><label style={labelStyle}>Last Name *</label><input required type="text" value={form.lastName} onChange={e => update('lastName', e.target.value)} style={inputStyle} placeholder="Your last name" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div><label style={labelStyle}>Email *</label><input required type="email" value={form.email} onChange={e => update('email', e.target.value)} style={inputStyle} placeholder="your@email.com" /></div>
            <div><label style={labelStyle}>Phone / WhatsApp</label><input type="tel" value={form.phone} onChange={e => update('phone', e.target.value)} style={inputStyle} placeholder="+254 700 000 000" /></div>
          </div>

          {formType === 'accommodation' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div><label style={labelStyle}>Check-in *</label><input required type="date" value={form.checkIn} onChange={e => update('checkIn', e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Check-out *</label><input required type="date" value={form.checkOut} onChange={e => update('checkOut', e.target.value)} style={inputStyle} /></div>
                <div><label style={labelStyle}>Guests</label>
                  <select value={form.guests} onChange={e => update('guests', e.target.value)} style={inputStyle}>
                    {['1','2','3','4','5','6'].map(n => <option key={n} value={n} style={{ background: '#1A1A1A' }}>{n} guest{+n > 1 ? 's' : ''}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-4"><label style={labelStyle}>Preferred Accommodation</label>
                <select value={form.cottage} onChange={e => update('cottage', e.target.value)} style={inputStyle}>
                  {COTTAGES.map(c => <option key={c} value={c} style={{ background: '#1A1A1A' }}>{c}</option>)}
                </select>
              </div>
              <div className="mb-4"><label style={labelStyle}>Dietary Requirements / Allergies</label><input type="text" value={form.dietary} onChange={e => update('dietary', e.target.value)} style={inputStyle} placeholder="Vegetarian, nut allergy, gluten-free..." /></div>
            </>
          )}
          {formType === 'spa' && (
            <div className="mb-4"><label style={labelStyle}>Preferred Treatment</label>
              <select value={form.treatment} onChange={e => update('treatment', e.target.value)} style={inputStyle}>
                {SPA_TREATMENTS.map(t => <option key={t} value={t} style={{ background: '#1A1A1A' }}>{t}</option>)}
              </select>
            </div>
          )}
          {formType === 'events' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div><label style={labelStyle}>Event Type</label><input type="text" value={form.eventType} onChange={e => update('eventType', e.target.value)} style={inputStyle} placeholder="Wedding, Corporate retreat..." /></div>
              <div><label style={labelStyle}>Guest Count</label><input type="number" value={form.eventGuests} onChange={e => update('eventGuests', e.target.value)} style={inputStyle} placeholder="e.g. 40" /></div>
            </div>
          )}

          <div className="mb-4"><label style={labelStyle}>Your Message</label>
            <textarea value={form.message} onChange={e => update('message', e.target.value)} rows={3} style={{ ...inputStyle, resize: 'vertical' }} placeholder="Tell us more about what you are looking for..." />
          </div>

          <div className="flex items-start gap-3 mb-6">
            <input required type="checkbox" id="consent" checked={form.consent} onChange={e => update('consent', e.target.checked)} style={{ marginTop: 2, accentColor: 'var(--neon)', flexShrink: 0 }} />
            <label htmlFor="consent" className="font-body text-[10px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.3)' }}>
              I consent to Ubuntu Kreative Village storing my data in accordance with the Kenya Data Protection Act 2019.
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-gold w-full justify-center flex" style={{ opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Sending…' : 'Send Enquiry →'}
          </button>
        </div>
      </form>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────
// MAIN PAGE — preserved exactly from document 14
// ─────────────────────────────────────────────────────────────────────
type PageTab = 'calendar' | 'services' | 'contact'

export default function ContactPage() {
  const [activeTab,       setActiveTab]       = useState<PageTab>('calendar')
  const [selectedService, setSelectedService] = useState<UKVService | null>(null)
  const [prefillDate,     setPrefillDate]     = useState('')
  const [heroBg,          setHeroBg]          = useState(0)

  const { items, openCart } = useCartStore()

  const heroBgs = [
    'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600',
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1600',
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600',
  ]

  useEffect(() => {
    const t = setInterval(() => setHeroBg(b => (b + 1) % heroBgs.length), 6000)
    return () => clearInterval(t)
  }, [])

  const handleDateClick = useCallback((date: string) => {
    setPrefillDate(date)
    setActiveTab('services')
  }, [])

  const handleEventClick = useCallback((event: CalendarEvent) => {
    if (event.serviceId) {
      const svc = UKV_SERVICES.find(s => s.id === event.serviceId)
      if (svc) {
        setPrefillDate(`${event.year}-${String(event.month + 1).padStart(2, '0')}-${String(event.day).padStart(2, '0')}`)
        setSelectedService(svc)
      }
    }
  }, [])

  const handleSelectService = useCallback((service: UKVService) => {
    setSelectedService(service)
  }, [])

  const TABS: { id: PageTab; label: string; desc: string }[] = [
    { id: 'calendar', label: 'Village Calendar', desc: 'Browse availability & events' },
    { id: 'services', label: 'All Services',     desc: 'Everything we offer'          },
    { id: 'contact',  label: 'Send Enquiry',     desc: 'No payment required'          },
  ]

  return (
    <main style={{ background: 'var(--obsidian)', minHeight: '100vh' }}>
      <Nav />

      {/* ── CINEMATIC HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ paddingTop: '120px', paddingBottom: '80px', minHeight: '60vh', display: 'flex', alignItems: 'flex-end' }}
      >
        {heroBgs.map((bg, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-[2000ms]"
            style={{ opacity: heroBg === i ? 0.25 : 0, zIndex: 0 }}
          >
            <Image src={bg} alt="" fill className="object-cover" priority={i === 0} />
          </div>
        ))}
        <div className="absolute inset-0" style={{ zIndex: 1, background: 'radial-gradient(ellipse 80% 60% at 20% 100%, rgba(44,24,16,0.8) 0%, transparent 60%)' }} />
        <div className="absolute inset-0" style={{ zIndex: 1, background: 'linear-gradient(to top, var(--obsidian) 0%, transparent 60%)' }} />
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 1, opacity: 0.03, backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(255,255,255,0.12) 2px,rgba(255,255,255,0.12) 4px)' }} />

        <div className="relative w-full max-w-8xl mx-auto px-6 md:px-10 pb-2" style={{ zIndex: 2 }}>
          <div className="flex items-center gap-3 mb-5">
            <span style={{ width: 40, height: '1px', background: 'var(--gold)', opacity: 0.6, display: 'block' }} />
            <span className="font-body text-[9px] tracking-[0.35em] uppercase" style={{ color: 'var(--gold)' }}>
              Reservations · Enquiries · Village Calendar
            </span>
          </div>

          <h1
            className="font-display leading-[0.85] mb-5"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 6rem)', fontWeight: 300, color: 'var(--cream)' }}
          >
            Plan Your<br />
            <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Ubuntu</em> Experience
          </h1>

          <p className="font-body max-w-xl mb-8" style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.45)', lineHeight: 1.9 }}>
            Browse upcoming events, book a stay, reserve a spa day, plan a private dinner, or simply ask Moxie. Every experience at Ubuntu Kreative Village starts with a single click.
          </p>

          <div className="flex flex-wrap gap-6 mb-8">
            {[
              { value: UKV_SERVICES.length.toString(),                                                  label: 'Services Available' },
              { value: CALENDAR_EVENTS.filter(e => e.spotsLeft && e.spotsLeft > 0).length.toString(), label: 'Upcoming Events'    },
              { value: '< 24h',                                                                        label: 'Response Time'     },
              { value: 'M-Pesa',                                                                       label: 'Instant Payment'   },
            ].map(s => (
              <div key={s.label}>
                <p className="font-display text-2xl" style={{ color: 'var(--gold)' }}>{s.value}</p>
                <p className="font-body text-[9px] uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>{s.label}</p>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <button
              onClick={openCart}
              className="flex items-center gap-3 px-5 py-3 transition-all"
              style={{ background: 'rgba(200,168,75,0.1)', border: '0.5px solid rgba(200,168,75,0.3)', cursor: 'pointer' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,168,75,0.18)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,168,75,0.1)')}
            >
              <span className="w-6 h-6 rounded-full bg-[var(--gold)] text-black text-[10px] font-bold flex items-center justify-center flex-shrink-0">{items.length}</span>
              <span className="font-body text-[10px] uppercase tracking-widest" style={{ color: 'var(--gold)' }}>
                {items.length} item{items.length !== 1 ? 's' : ''} in your booking cart
              </span>
              <span style={{ color: 'var(--gold)', fontSize: '12px' }}>→</span>
            </button>
          )}
        </div>
      </section>

      {/* ── TAB NAVIGATION ── */}
      <div
        className="sticky z-30 px-6 md:px-10"
        style={{ top: '56px', background: 'rgba(6,6,6,0.97)', backdropFilter: 'blur(24px)', borderBottom: '0.5px solid var(--border)' }}
      >
        <div className="max-w-8xl mx-auto flex items-center gap-0 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-start py-4 pr-8 transition-all shrink-0 font-body"
              style={{
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--gold)' : 'transparent'}`,
                marginBottom: '-0.5px',
                background: 'none',
                cursor: 'pointer',
                border: 'none',
                borderBottom: `2px solid ${activeTab === tab.id ? 'var(--gold)' : 'transparent'}`,
              } as React.CSSProperties}
            >
              <span className="text-[10px] uppercase tracking-[0.2em]" style={{ color: activeTab === tab.id ? 'var(--gold)' : 'rgba(255,255,255,0.5)' }}>
                {tab.label}
              </span>
              <span className="text-[8px] mt-0.5 uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {tab.desc}
              </span>
            </button>
          ))}

          <div className="ml-auto flex items-center gap-3 pl-6" style={{ borderLeft: '0.5px solid var(--border)' }}>
            {items.length > 0 && (
              <button
                onClick={openCart}
                className="flex items-center gap-2 py-2 px-3 transition-all font-body"
                style={{ background: 'rgba(200,168,75,0.1)', border: '0.5px solid rgba(200,168,75,0.25)', cursor: 'pointer' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(200,168,75,0.18)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'rgba(200,168,75,0.1)')}
              >
                <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-black text-[8px] font-bold flex items-center justify-center">{items.length}</span>
                <span className="text-[9px] uppercase tracking-widest" style={{ color: 'var(--gold)' }}>Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ── */}
      <section className="px-6 md:px-10 py-14">
        <div className="max-w-8xl mx-auto">

          {activeTab === 'calendar' && (
            <div>
              <div className="mb-8">
                <h2 className="font-display text-[32px] font-light mb-1">
                  Village <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Schedule</em>
                </h2>
                <p className="font-body text-[13px]" style={{ color: 'var(--muted)' }}>
                  Highlighted dates have events. Click any open date to plan your own visit.
                </p>
              </div>
              <VillageCalendar onDateClick={handleDateClick} onEventClick={handleEventClick} />
            </div>
          )}

          {activeTab === 'services' && (
            <div>
              <div className="mb-8">
                <h2 className="font-display text-[32px] font-light mb-1">
                  Everything at <em style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Ubuntu</em>
                </h2>
                <p className="font-body text-[13px]" style={{ color: 'var(--muted)' }}>
                  {prefillDate && (
                    <span style={{ color: 'var(--gold)' }}>
                      Planning for {new Date(prefillDate).toLocaleDateString('en-KE', { month: 'long', day: 'numeric', year: 'numeric' })} ·{' '}
                    </span>
                  )}
                  Click any service to book directly, add to your cart, or send an inquiry.
                </p>
              </div>
              <ServiceGrid prefillDate={prefillDate} onSelectService={handleSelectService} />
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-1 space-y-5">
                <div className="glass p-6">
                  <h3 className="font-display text-[22px] font-light mb-5">Get in Touch</h3>
                  <div className="space-y-5">
                    {[
                      { label: 'Location',       value: 'Ubuntu Kreative Village\nKenya, East Africa',     accent: 'var(--neon)' },
                      { label: 'Email',          value: 'hello@ubuntuecolodge.com',                        accent: 'var(--gold)' },
                      { label: 'WhatsApp',       value: '+254 700 000 000',                                 accent: 'var(--neon)' },
                      { label: 'M-Pesa Paybill', value: `${MPESA_PAYBILL} · Account ${MPESA_ACCOUNT}`,     accent: 'var(--gold)' },
                    ].map(item => (
                      <div key={item.label}>
                        <div className="font-body text-[8px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.25)' }}>{item.label}</div>
                        <div className="font-body text-[11px] leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.55)' }}>{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-5" style={{ background: 'rgba(0,255,65,0.04)', border: '0.5px solid rgba(0,255,65,0.15)' }}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="status-dot" />
                    <span className="font-body text-[9px] tracking-widest uppercase" style={{ color: 'var(--neon)' }}>Moxie is online</span>
                  </div>
                  <p className="font-body text-[11px] leading-relaxed mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                    Skip the form. Ask Moxie to check availability, describe the cottages, or tell you what&apos;s on the menu this week.
                  </p>
                  <button
                    className="btn-neon w-full justify-center flex text-[9px]"
                    style={{ padding: '8px 16px', cursor: 'pointer' }}
                    onClick={() => { const b = document.querySelector('.moxie-bubble') as HTMLElement; if (b) b.click() }}
                  >
                    Chat with Moxie →
                  </button>
                </div>

                <div style={{ background: 'var(--bg2)', border: '0.5px solid var(--border)', padding: '20px' }}>
                  <p className="font-body text-[8px] uppercase tracking-widest mb-3" style={{ color: 'var(--muted)' }}>
                    Quick Add to Cart
                  </p>
                  <div className="space-y-2">
                    {UKV_SERVICES.slice(0, 4).map(s => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedService(s)}
                        className="w-full text-left flex items-center justify-between py-2 px-3 transition-all font-body"
                        style={{ border: '0.5px solid var(--border2)', cursor: 'pointer', background: 'none' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = 'var(--gold)')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = 'var(--border2)')}
                      >
                        <span className="text-[11px]" style={{ color: 'var(--cream)' }}>{s.name}</span>
                        <span className="text-[10px]" style={{ color: 'var(--gold)' }}>KES {s.price.toLocaleString()}</span>
                      </button>
                    ))}
                    <button
                      onClick={() => setActiveTab('services')}
                      className="w-full py-2 font-body text-[9px] uppercase tracking-widest transition-colors text-center"
                      style={{ color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer' }}
                      onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold)')}
                      onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                    >
                      View all services →
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-2">
                <ContactForm />
              </div>
            </div>
          )}
        </div>
      </section>

      {selectedService && (
        <ServiceModal
          service={selectedService}
          prefillDate={prefillDate}
          onClose={() => setSelectedService(null)}
        />
      )}

      <Footer />
      <MoxieChat />
    </main>
  )
}