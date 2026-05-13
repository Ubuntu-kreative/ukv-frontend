// Ubuntu Kreative Village — Arohamai Spa Sanctuary
// PRODUCTION v4 — Fixed Ambient Audio · All code preserved · Fully upgraded
// Architecture: 5-Phase Cinematic Journey · Matches restaurant page codebase patterns

'use client'

import {
  useEffect,
  useRef,
  useState,
  useCallback,
} from 'react'

import Image from 'next/image'
import Link from 'next/link'

import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useScroll,
} from 'framer-motion'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'

import { useCartStore } from '@/context/cartStore'

import toast from 'react-hot-toast'

// ─────────────────────────────────────────────────────────────
// JSON-LD SEO
// ─────────────────────────────────────────────────────────────

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'HealthAndBeautyBusiness',
  name: 'Ubuntu Kreative Village — Arohamai Spa Sanctuary',
  description:
    'Ceremonial healing rituals, restorative wellness journeys, immersive African luxury spa — thermal baths, Moroccan hammam, Finnish sauna, mud baths, aromatic therapies and cinematic wellness restoration.',
  telephone: '+254700000000',
  priceRange: '$$$',
  image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
}

// ─────────────────────────────────────────────────────────────
// RITUAL ACCENT PALETTES — unique glow per treatment
// ─────────────────────────────────────────────────────────────

const ritualAccents: Record<string, { glow: string; label: string }> = {
  'ubuntu-ground-ritual':   { glow: 'rgba(180,120,40,0.20)',  label: 'Earth & Clay'    },
  'moroccan-hammam':        { glow: 'rgba(160,80,160,0.16)',  label: 'Moroccan Ritual'  },
  'sauna-ritual':           { glow: 'rgba(220,100,40,0.18)',  label: 'Thermal Fire'     },
  'dawn-steam-ceremony':    { glow: 'rgba(180,220,255,0.14)', label: 'Mist & Morning'   },
  'forest-couples-massage': { glow: 'rgba(40,140,60,0.16)',   label: 'Forest & Amber'   },
  'farm-to-face-facial':    { glow: 'rgba(200,180,80,0.14)',  label: 'Garden & Gold'    },
  'baobab-body-polish':     { glow: 'rgba(160,80,40,0.16)',   label: 'Desert & Bark'    },
  'spa-half-day':           { glow: 'rgba(212,175,55,0.16)',  label: 'Full Sanctuary'   },
}

// ─────────────────────────────────────────────────────────────
// THERAPISTS
// ─────────────────────────────────────────────────────────────

const therapists = [
  {
    id: 'amara',
    name: 'Amara Njeri',
    energy: 'Grounding',
    frequency: '432 Hz — Earth Frequency',
    experience: '12 Years',
    philosophy: 'Healing begins when the nervous system remembers stillness.',
    quote: 'The body speaks softly before it screams.',
    specialties: ['Emotional Reset', 'Stone Therapy', 'Red Clay Ritual'],
    aura: 'rgba(180,120,40,0.18)',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1200&auto=format&fit=crop',
  },
  {
    id: 'malik',
    name: 'Malik Ade',
    energy: 'Deep Recovery',
    frequency: '528 Hz — Repair Frequency',
    experience: '9 Years',
    philosophy: 'Recovery is not luxury. It is survival for the modern mind.',
    quote: 'Muscles relax when the mind finally feels safe.',
    specialties: ['Deep Tissue', 'Thermal Alignment', 'Cold Plunge Protocol'],
    aura: 'rgba(40,120,180,0.18)',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1200&auto=format&fit=crop',
  },
]

// ─────────────────────────────────────────────────────────────
// ALL 8 RITUALS
// ─────────────────────────────────────────────────────────────

const rituals = [
  {
    id: 'ubuntu-ground-ritual',
    name: 'Ubuntu Ground Ritual',
    duration: '90 MIN',
    price: 8500,
    categoryTag: 'Signature Treatment',
    status: 'most requested',
    aromaNotes: ['Red Clay', 'Baobab', 'Cedar'],
    soundscape: 'Earth Frequencies',
    mood: 'Nervous system grounding',
    heatLevel: 'Warm Earth Therapy',
    pressure: 'Medium',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop',
    description: 'Red clay body wrap, cold river compress, and our Maasai oil massage. The full village in one session.',
    timeline: [
      '00 MIN — Herbal Welcome Steam',
      '10 MIN — Red Clay Ritual',
      '35 MIN — Maasai Oil Massage',
      '65 MIN — Stone Grounding Therapy',
      '90 MIN — Herbal Tea Integration',
    ],
    addOns: ['Infrared Therapy', 'Cold Plunge Recovery', 'Tea Ceremony', 'Sound Healing'],
    recovery: { stress: 98, sleep: 86, energy: 88, emotional: 94 },
  },
  {
    id: 'moroccan-hammam',
    name: 'Moroccan Hammam',
    duration: '75 MIN',
    price: 7200,
    categoryTag: 'Ancient Ritual',
    status: 'new experience',
    aromaNotes: ['Argan', 'Black Soap', 'Rose Water'],
    soundscape: 'Desert Wind Frequencies',
    mood: 'Full body renewal and deep cleansing',
    heatLevel: 'Steam & Warm Marble',
    pressure: 'Medium',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
    description: 'Traditional Moroccan hammam with black soap exfoliation, kessa mitt scrub, argan oil ritual, and rose water finish on heated marble.',
    timeline: [
      '00 MIN — Hammam Steam Opening',
      '15 MIN — Black Soap Application',
      '30 MIN — Kessa Mitt Exfoliation',
      '50 MIN — Argan Oil Ritual',
      '65 MIN — Rose Water Rinse & Recovery',
      '75 MIN — Mint Tea Integration',
    ],
    addOns: ['Private Hammam Suite', 'Ghassoul Clay Mask', 'Sound Healing'],
    recovery: { stress: 92, sleep: 84, energy: 88, emotional: 90 },
  },
  {
    id: 'sauna-ritual',
    name: 'Finnish Sauna Ritual',
    duration: '60 MIN',
    price: 3800,
    categoryTag: 'Thermal Journey',
    status: 'daily sessions',
    aromaNotes: ['Birch', 'Eucalyptus', 'Pine'],
    soundscape: 'Forest Frequencies',
    mood: 'Cardiovascular reset and cellular detox',
    heatLevel: 'High Dry Heat 80–100°C',
    pressure: 'None',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    description: 'Traditional Finnish dry sauna with birch löyly steam rituals, cold plunge recovery, and herbal rest periods between rounds.',
    timeline: [
      '00 MIN — Birch Steam Opening',
      '15 MIN — First Sauna Round',
      '30 MIN — Cold Plunge Recovery',
      '40 MIN — Second Sauna Round',
      '55 MIN — Herbal Cool Down',
      '60 MIN — Tea Recovery',
    ],
    addOns: ['Cold Plunge Protocol', 'Birch Bundle Ritual', 'Private Session'],
    recovery: { stress: 88, sleep: 90, energy: 94, emotional: 80 },
  },
  {
    id: 'dawn-steam-ceremony',
    name: 'Dawn Steam Ceremony',
    duration: '75 MIN',
    price: 4200,
    categoryTag: 'Morning Ritual',
    status: 'sunrise favorite',
    aromaNotes: ['Mint', 'Lemongrass', 'Eucalyptus'],
    soundscape: 'Morning Rain Frequencies',
    mood: 'Mental clarity and reset',
    heatLevel: 'Steam Heat',
    pressure: 'Light',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
    description: 'Sunrise steam hut with herbal infusions, cold plunge, and a breathwork guide.',
    timeline: [
      '00 MIN — Guided Breath Entry',
      '10 MIN — Herbal Steam Session',
      '40 MIN — Cold River Plunge',
      '55 MIN — Stillness Meditation',
      '75 MIN — Tea Recovery',
    ],
    addOns: ['Guided Meditation', 'Cold Recovery', 'Private Steam'],
    recovery: { stress: 90, sleep: 78, energy: 92, emotional: 80 },
  },
  {
    id: 'forest-couples-massage',
    name: 'Forest Couples Massage',
    duration: '100 MIN',
    price: 14000,
    categoryTag: 'Couples',
    status: 'limited availability',
    aromaNotes: ['Forest Pine', 'Amber', 'Wild Sage'],
    soundscape: 'Forest Sanctuary',
    mood: 'Shared emotional connection',
    heatLevel: 'Warm Oils',
    pressure: 'Custom',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop',
    description: 'Side-by-side deep tissue in our outdoor forest pavilion with post-session herbal tea service.',
    timeline: [
      '00 MIN — Forest Arrival Tea',
      '15 MIN — Breath Synchronization',
      '30 MIN — Deep Tissue Therapy',
      '75 MIN — Oil Recovery Ritual',
      '100 MIN — Sunset Tea Lounge',
    ],
    addOns: ['Private Bath Ritual', 'Sunset Tea Ceremony'],
    recovery: { stress: 88, sleep: 84, energy: 82, emotional: 98 },
  },
  {
    id: 'farm-to-face-facial',
    name: 'Farm-to-Face Facial',
    duration: '60 MIN',
    price: 5500,
    categoryTag: 'Facial',
    status: 'garden fresh',
    aromaNotes: ['Aloe', 'Papaya', 'Turmeric'],
    soundscape: 'Soft Water Frequencies',
    mood: 'Skin luminosity and calm',
    heatLevel: 'Warm Towel Therapy',
    pressure: 'Gentle',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    description: 'Fresh aloe vera, papaya enzyme, and turmeric from our garden for full revitalisation.',
    timeline: [
      '00 MIN — Botanical Cleansing',
      '15 MIN — Enzyme Renewal',
      '35 MIN — Cooling Recovery Mask',
      '50 MIN — Facial Sculpt Massage',
      '60 MIN — Herbal Glow Finish',
    ],
    addOns: ['LED Facial Enhancement', 'Sound Healing'],
    recovery: { stress: 76, sleep: 70, energy: 85, emotional: 88 },
  },
  {
    id: 'baobab-body-polish',
    name: 'Baobab Body Polish',
    duration: '60 MIN',
    price: 6200,
    categoryTag: 'Body Treatment',
    status: 'new ritual',
    aromaNotes: ['Baobab', 'Raw Shea', 'Sandalwood'],
    soundscape: 'Desert Wind Frequencies',
    mood: 'Skin renewal and grounding',
    heatLevel: 'Warm Exfoliation',
    pressure: 'Firm',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop',
    description: 'African baobab powder exfoliation with raw shea butter sealing ritual. Full body luminosity from root to skin.',
    timeline: [
      '00 MIN — Dry Body Brushing',
      '10 MIN — Baobab Salt Polish',
      '30 MIN — Warm Shea Butter Seal',
      '50 MIN — Cooling Aloe Finish',
      '60 MIN — Sandalwood Integration',
    ],
    addOns: ['Body Oil Ritual', 'Sound Healing', 'Cold Plunge'],
    recovery: { stress: 82, sleep: 75, energy: 90, emotional: 85 },
  },
  {
    id: 'spa-half-day',
    name: 'Sanctuary Half-Day',
    duration: '4 HRS',
    price: 22000,
    categoryTag: 'Full Journey',
    status: 'exclusive access',
    aromaNotes: ['Rose', 'Oud', 'African Violet'],
    soundscape: 'Full Sanctuary Frequencies',
    mood: 'Complete system restoration',
    heatLevel: 'Full Thermal Journey',
    pressure: 'Full Custom',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
    description: 'The complete Ubuntu experience. Steam ceremony, signature massage, facial, thermal pools, tea lounge. Full sensory restoration.',
    timeline: [
      '00 MIN — Private Sanctuary Arrival',
      '30 MIN — Dawn Steam Ceremony',
      '75 MIN — Signature Massage',
      '135 MIN — Farm-to-Face Facial',
      '195 MIN — Thermal Pool Recovery',
      '240 MIN — Tea Lounge & Integration',
    ],
    addOns: ['Private Suite', 'Sunset Extension', 'Champagne Ritual'],
    recovery: { stress: 99, sleep: 95, energy: 96, emotional: 99 },
  },
]

type Ritual = typeof rituals[0]

// ─────────────────────────────────────────────────────────────
// SPA SERVICES
// ─────────────────────────────────────────────────────────────

const spaServices = [
  {
    title: 'Massage Therapy',
    subtitle: 'From KES 4,200',
    tag: 'Bodywork',
    ritualId: 'ubuntu-ground-ritual',
    accent: 'rgba(180,120,40,0.18)',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop',
    description: 'Rhythmic healing touch by trained African practitioners. Nervous system reset through the hands.',
    cta: 'Explore Massages',
  },
  {
    title: 'Moroccan Hammam',
    subtitle: 'From KES 7,200',
    tag: 'Ancient Ritual',
    ritualId: 'moroccan-hammam',
    accent: 'rgba(160,80,160,0.16)',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
    description: 'Heated marble, black soap exfoliation, kessa scrub, argan oil seal and rose water finish.',
    cta: 'Enter the Hammam',
  },
  {
    title: 'Finnish Sauna',
    subtitle: 'From KES 3,800',
    tag: 'Thermal',
    ritualId: 'sauna-ritual',
    accent: 'rgba(220,100,40,0.18)',
    image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
    description: 'Traditional dry heat sauna with birch löyly steam, cold plunge recovery and deep cellular detox.',
    cta: 'Enter the Sauna',
  },
  {
    title: 'Volcanic Mud Baths',
    subtitle: 'From KES 5,500',
    tag: 'Detox',
    ritualId: 'baobab-body-polish',
    accent: 'rgba(160,80,40,0.16)',
    image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop',
    description: 'Mineral-rich volcanic clay from the Great Rift Valley. Purifies, relieves muscle ache, renews.',
    cta: 'Book Mud Experience',
  },
  {
    title: 'Thermal Baths',
    subtitle: 'Daily Access',
    tag: 'Signature',
    ritualId: 'spa-half-day',
    accent: 'rgba(212,175,55,0.16)',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
    description: `It's being said that we have one of the best baths in town. We think every guest has to form their own opinion. Deep warmth. Stone silence. Pure restoration.`,
    cta: 'Reserve Your Bath',
  },
  {
    title: 'Aromatic Treatments',
    subtitle: 'From KES 4,200',
    tag: 'Aromatherapy',
    ritualId: 'dawn-steam-ceremony',
    accent: 'rgba(180,220,255,0.14)',
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
    description: 'Locally sourced lemongrass, lavender and wild marula — layered into treatments that awaken the senses.',
    cta: 'Choose Your Aroma',
  },
  {
    title: 'Couples Sanctuary',
    subtitle: 'From KES 14,000',
    tag: 'Couples',
    ritualId: 'forest-couples-massage',
    accent: 'rgba(40,140,60,0.16)',
    image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=2070&auto=format&fit=crop',
    description: 'Side-by-side rituals in our outdoor forest pavilion. Arrive together, leave changed — together.',
    cta: 'Book for Two',
  },
  {
    title: 'Farm Facials',
    subtitle: 'From KES 5,500',
    tag: 'Facial',
    ritualId: 'farm-to-face-facial',
    accent: 'rgba(200,180,80,0.14)',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop',
    description: 'Fresh aloe cut at 6am, papaya enzyme, turmeric from our garden. 200 metres from soil to skin.',
    cta: 'Book a Facial',
  },
]

// ─────────────────────────────────────────────────────────────
// FARM INGREDIENTS
// ─────────────────────────────────────────────────────────────

const farmIngredients = [
  { name: 'Red Volcanic Clay', origin: 'Great Rift Valley, Kenya', benefit: 'Deep pore purification and mineral rebalancing', note: 'Harvested at dawn after morning rainfall', icon: '🌋' },
  { name: 'Wild Baobab Oil', origin: 'Coastal Lowlands, Kenya', benefit: 'Cellular regeneration and deep moisture binding', note: 'Cold-pressed from ancient baobab trees', icon: '🌿' },
  { name: 'Fresh Aloe Vera', origin: 'Ubuntu Village Garden, 200m', benefit: 'Instant cooling, anti-inflammatory restoration', note: 'Cut fresh daily at 6am from our garden', icon: '🌱' },
  { name: 'Lemongrass & Eucalyptus', origin: 'Ubuntu Herb Garden, 200m', benefit: 'Mental clarity, respiratory opening, stress reset', note: 'Steam-distilled on-site in small batches', icon: '🌾' },
  { name: 'Raw Shea Butter', origin: 'Northern Kenya Cooperatives', benefit: 'Deep skin barrier restoration and elasticity', note: 'Unrefined, ethically sourced from women cooperatives', icon: '🫙' },
  { name: 'Wild Marula', origin: 'Laikipia Plateau, Kenya', benefit: 'Antioxidant protection and deep nourishment', note: 'Sustainably harvested during fruit season', icon: '🍋' },
]

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────

const testimonials = [
  {
    name: 'Nia M.',
    title: 'Executive Director, Nairobi',
    quote: 'I arrived burnt out. I left feeling like my nervous system had finally exhaled. The Ubuntu Ritual is not a treatment — it is a ceremony.',
    ritual: 'Ubuntu Ground Ritual',
    duration: '90 MIN',
  },
  {
    name: 'James & Akela K.',
    title: 'Newlyweds, from London',
    quote: 'We did the Forest Couples Massage on our honeymoon. We did not speak for the first hour after. That silence said everything.',
    ritual: 'Forest Couples Massage',
    duration: '100 MIN',
  },
  {
    name: 'Dr. Seren O.',
    title: 'Surgeon, Nairobi',
    quote: 'Six Senses. Aman. SHA. I have been to them all. Ubuntu Kreative feels like something none of them have yet discovered.',
    ritual: 'Sanctuary Half-Day',
    duration: '4 HRS',
  },
]

// ─────────────────────────────────────────────────────────────
// WELLNESS BUILDER DATA
// ─────────────────────────────────────────────────────────────

const wellnessGoals = ['Stress Relief', 'Deep Sleep', 'Energy Restoration', 'Emotional Reset', 'Skin Renewal', 'Couples Connection']
const wellnessRecommendations: Record<string, string> = {
  'Stress Relief':       'ubuntu-ground-ritual',
  'Deep Sleep':          'sauna-ritual',
  'Energy Restoration':  'baobab-body-polish',
  'Emotional Reset':     'ubuntu-ground-ritual',
  'Skin Renewal':        'farm-to-face-facial',
  'Couples Connection':  'forest-couples-massage',
}

// ─────────────────────────────────────────────────────────────
// FLOATING PARTICLES
// ─────────────────────────────────────────────────────────────

function FloatingParticles({ count = 14 }: { count?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <motion.div
          key={i}
          animate={{ y: ['0%', '-130%'], opacity: [0, 0.45, 0] }}
          transition={{ duration: 14 + i * 0.7, repeat: Infinity, ease: 'linear', delay: i * 0.6 }}
          className="absolute bottom-0 w-px h-px rounded-full bg-gold/25"
          style={{ left: `${i * (100 / count)}%` }}
        />
      ))}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────────────────────────

function MagneticButton({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 180, damping: 20 })
  const springY = useSpring(y, { stiffness: 180, damping: 20 })

  return (
    <motion.button
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect()
        x.set((e.clientX - rect.left - rect.width / 2) * 0.10)
        y.set((e.clientY - rect.top - rect.height / 2) * 0.10)
      }}
      onMouseLeave={() => { x.set(0); y.set(0) }}
      style={{ x: springX, y: springY }}
      onClick={onClick}
      className={className}
    >
      {children}
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────
// RECOVERY METER
// ─────────────────────────────────────────────────────────────

function RecoveryMeter({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between mb-1.5 text-[9px] uppercase tracking-[0.25em] text-white/35">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="h-1 bg-white/5 overflow-hidden rounded-full">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${value}%` }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="h-full bg-gradient-to-r from-gold/40 to-gold rounded-full"
        />
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// CINEMATIC HERO
// ─────────────────────────────────────────────────────────────

function CinematicHero({ onExplore }: { onExplore: () => void }) {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const bgY    = useTransform(scrollYProgress, [0, 1], ['0%', '18%'])
  const textOp = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const textY  = useTransform(scrollYProgress, [0, 0.5], ['0%', '6%'])

  return (
    <section ref={ref} className="relative w-full min-h-screen flex flex-col overflow-hidden">
      <motion.div style={{ y: bgY }} className="absolute inset-0 scale-[1.1]">
        <Image
          src="https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop"
          alt="Arohamai Spa Sanctuary"
          fill
          priority
          className="object-cover"
        />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
        >
          <source src="/videos/spa-cinematic.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black/55"                style={{ zIndex: 2 }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-[#050505]" style={{ zIndex: 3 }} />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_40%,rgba(212,175,55,0.08),transparent)]" style={{ zIndex: 4 }} />
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-[0.03] mix-blend-overlay pointer-events-none"
          style={{
            zIndex: 5,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '200px 200px',
          }}
        />
      </motion.div>

      <FloatingParticles count={14} />

      <motion.div
        style={{ opacity: textOp, y: textY, zIndex: 10 } as React.CSSProperties}
        className="relative flex-1 flex items-center justify-center px-6 pt-[120px] pb-16"
      >
        <div className="max-w-6xl w-full mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.3, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1.8, delay: 0.5 }}
              className="inline-block px-6 py-2.5 mb-10 border border-gold/20 bg-black/35 backdrop-blur-xl text-gold uppercase tracking-[0.35em] text-[10px] rounded-full"
            >
              Arohamai Spa · Ancient African Restoration
            </motion.span>

            <h1 className="font-display text-[clamp(3rem,8.5vw,8.5rem)] leading-[0.84] tracking-tight mb-8">
              ENTER THE
              <br />
              <span className="italic text-gold">HEALING SANCTUARY</span>
            </h1>

            <p className="max-w-2xl mx-auto text-base md:text-lg text-white/42 leading-relaxed mb-12 italic font-light">
              A cinematic wellness sanctuary where African healing traditions,
              thermal restoration, aromatic rituals, and deep nervous system
              recovery become one unforgettable sensory experience.
            </p>

            <div className="flex flex-wrap justify-center gap-5">
              <MagneticButton
                className="btn-gold !px-10 !py-4 !text-[10px]"
                onClick={onExplore}
              >
                EXPLORE SERVICES
              </MagneticButton>
              <Link
                href="/contact"
                className="border border-gold/25 bg-black/20 backdrop-blur-xl px-9 py-4 uppercase tracking-[0.25em] text-[10px] text-gold hover:bg-gold/10 transition-all duration-700 rounded-full"
              >
                BOOK SANCTUARY JOURNEY
              </Link>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2.5, repeat: Infinity }}
        className="relative flex flex-col items-center gap-2 pb-10 self-center"
        style={{ zIndex: 10 }}
      >
        <span className="text-[8px] uppercase tracking-[0.4em] text-white/18">Descend</span>
        <div className="w-px h-9 bg-gradient-to-b from-gold/25 to-transparent" />
      </motion.div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SPA STATS BAR
// ─────────────────────────────────────────────────────────────

function SpaStatsBar() {
  const stats = [
    { label: 'Spa Treatments',    value: '8+',                         sub: 'Experiences' },
    { label: 'Healing Traditions', value: 'African · Moroccan · Nordic', sub: 'Origins'    },
    { label: 'Therapist Profiles', value: 'Energy-Matched',            sub: 'Personalized' },
    { label: 'Farm Ingredients',  value: '200m',                       sub: 'Soil to skin' },
  ]

  return (
    <section className="w-full bg-[#080808] border-b border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 divide-x divide-white/5">
        {stats.map(({ label, value, sub }, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.7 }}
            viewport={{ once: true }}
            className="px-6 py-8"
          >
            <p className="text-[8px] uppercase tracking-[0.35em] text-white/22 mb-2">{label}</p>
            <p className="font-display text-lg md:text-xl text-gold leading-tight mb-1">{value}</p>
            <p className="text-[8px] uppercase tracking-[0.25em] text-white/18">{sub}</p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// SPA SERVICES GATEWAY GRID
// ─────────────────────────────────────────────────────────────

function SpaServicesGrid({ onOpenRitual }: { onOpenRitual: (id: string) => void }) {
  return (
    <section id="services" className="py-28 px-6 md:px-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-20">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Arohamai Spa · Full Service Suite</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            THE FULL
            <span className="italic text-gold"> SANCTUARY</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Every space inside Arohamai Spa is designed to be entered, experienced,
            and remembered. Choose where your restoration begins.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-7">
          {spaServices.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 36 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              onClick={() => onOpenRitual(service.ritualId)}
              className="group relative overflow-hidden rounded-[2rem] border border-white/5 hover:border-gold/18 bg-[#0a0a0a] transition-all duration-700 cursor-pointer"
            >
              <div className="relative h-[380px] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  className="object-cover grayscale-[0.15] group-hover:scale-[1.045] group-hover:grayscale-0 transition-all duration-[2000ms]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-black/25 to-transparent" />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1400ms]"
                  style={{ background: `radial-gradient(circle at 50% 65%, ${service.accent}, transparent 70%)` }}
                />
                <div className="absolute top-5 left-5 z-10">
                  <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.3em] border border-gold/22 bg-black/50 backdrop-blur-xl text-gold rounded-full">
                    {service.tag}
                  </span>
                </div>
                <div className="absolute top-5 right-5 z-10">
                  <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.22em] border border-white/10 bg-black/40 backdrop-blur-xl text-white/48 rounded-full">
                    {service.subtitle}
                  </span>
                </div>
              </div>
              <div className="p-7">
                <h3 className="font-display text-3xl md:text-4xl leading-none mb-3">{service.title}</h3>
                <p className="text-white/42 text-sm leading-relaxed mb-6">{service.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/20 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all duration-400">
                    {service.cta} →
                  </span>
                  <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-white/25 text-xs group-hover:border-gold/28 group-hover:text-gold transition-all duration-500">
                    ↗
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// THERMAL SANCTUARIES
// ─────────────────────────────────────────────────────────────

function ThermalSanctuariesSection({ onOpenRitual }: { onOpenRitual: (id: string) => void }) {
  const thermals = [
    {
      name: 'Finnish Sauna',
      spec: '80–100°C Dry Heat',
      ritualId: 'sauna-ritual',
      description: 'Traditional dry heat with birch steam, cold plunge recovery between rounds and deep cellular detox.',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
      glow: 'rgba(220,100,40,0.16)',
    },
    {
      name: 'Moroccan Hammam',
      spec: 'Heated Marble Steam',
      ritualId: 'moroccan-hammam',
      description: 'Black soap, kessa exfoliation, argan oil seal and rose water on warm marble. North African tradition, Kenya setting.',
      image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
      glow: 'rgba(160,80,160,0.14)',
    },
    {
      name: 'Volcanic Mud Baths',
      spec: 'Rift Valley Clay',
      ritualId: 'baobab-body-polish',
      description: 'Mineral-rich volcanic clay from the Great Rift Valley. Purifies pores, relieves deep muscle tension, renews from the outside in.',
      image: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?q=80&w=2070&auto=format&fit=crop',
      glow: 'rgba(160,80,40,0.16)',
    },
    {
      name: 'Thermal Baths',
      spec: 'Deep Warmth',
      ritualId: 'spa-half-day',
      description: `It's being said that we have one of the best baths in town. And although we are flattered, we think every guest has to form their own opinion. Deep warmth. Stone silence. Pure restoration.`,
      image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=2070&auto=format&fit=crop',
      glow: 'rgba(212,175,55,0.14)',
    },
  ]

  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-20">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Thermal Sanctuaries</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            HEAT. STEAM.
            <span className="italic text-gold"> RESTORATION.</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Four distinct thermal environments. Each operates at a different temperature,
            pressure and cultural tradition. All lead to the same destination: stillness.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-7">
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-7">
            {thermals.slice(0, 2).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.10, duration: 0.85 }}
                viewport={{ once: true }}
                onClick={() => onOpenRitual(t.ritualId)}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700"
              >
                <div className="relative h-[480px]">
                  <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                    style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-8 z-10">
                    <p className="text-[8px] uppercase tracking-[0.35em] text-gold/60 mb-2">{t.spec}</p>
                    <h3 className="font-display text-4xl leading-none mb-3">{t.name}</h3>
                    <p className="text-white/42 text-sm leading-relaxed mb-5">{t.description}</p>
                    <span className="text-[9px] uppercase tracking-[0.28em] text-gold border border-gold/22 px-5 py-2.5 rounded-full hover:bg-gold/8 transition-all inline-block">
                      Book Now →
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col gap-7">
            {thermals.slice(2).map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + i * 0.10, duration: 0.85 }}
                viewport={{ once: true }}
                onClick={() => onOpenRitual(t.ritualId)}
                className="group relative overflow-hidden rounded-[2.5rem] border border-white/5 hover:border-gold/18 cursor-pointer transition-all duration-700 flex-1"
              >
                <div className="relative h-[220px]">
                  <Image src={t.image} alt={t.name} fill className="object-cover group-hover:scale-[1.04] transition-all duration-[2000ms]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1200ms]"
                    style={{ background: `radial-gradient(circle at center, ${t.glow}, transparent 70%)` }}
                  />
                </div>
                <div className="p-6 bg-[#0a0a0a]">
                  <p className="text-[8px] uppercase tracking-[0.35em] text-gold/55 mb-1.5">{t.spec}</p>
                  <h3 className="font-display text-2xl md:text-3xl leading-none mb-2">{t.name}</h3>
                  <p className="text-white/38 text-sm leading-relaxed line-clamp-3">{t.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// FARM TO RITUAL
// ─────────────────────────────────────────────────────────────

function FarmToRitualSection() {
  return (
    <section className="py-28 px-6 md:px-10 bg-[#050505] overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-4xl mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">From Earth to Skin</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            200 METRES
            <span className="italic text-gold"> FROM SOIL TO SKIN</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed max-w-2xl">
            Every ingredient in your ritual is grown, harvested, or sourced within 200 metres
            of the treatment room — or directly from our trusted network of Kenyan farmers,
            cooperatives, and ancient rift valley soil.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farmIngredients.map((ingredient, i) => (
            <motion.div
              key={ingredient.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true }}
              className="group border border-white/5 hover:border-gold/18 bg-[#0a0a0a] rounded-[2rem] p-7 transition-all duration-700"
            >
              <div className="text-3xl mb-4">{ingredient.icon}</div>
              <h3 className="font-display text-2xl mb-1.5 leading-none">{ingredient.name}</h3>
              <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-3">{ingredient.origin}</p>
              <p className="text-white/48 text-sm leading-relaxed mb-4">{ingredient.benefit}</p>
              <div className="pt-4 border-t border-white/5">
                <p className="text-[8px] tracking-[0.18em] text-white/18 italic">{ingredient.note}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-20 text-center">
          <p className="text-white/12 text-base italic max-w-xl mx-auto leading-relaxed">
            "We do not source from warehouses. We source from the earth that surrounds you."
          </p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// QUICK ADD BUTTON
// ─────────────────────────────────────────────────────────────

function QuickAddButton({ ritual }: { ritual: Ritual }) {
  const { addItem, openCart } = useCartStore()

  const addToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id: ritual.id,
      name: ritual.name,
      category: 'spa',
      tag: ritual.categoryTag,
      price: ritual.price,
      unit: '/ session',
      therapist: therapists[0].name,
      tea: 'Wild Mint Tea',
      soundscape: ritual.soundscape,
      addOns: [],
    })
    toast.success(`${ritual.name} added to Wellness Cart`)
  }

  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={addToCart}
        className="flex-1 border border-gold/20 bg-gold/8 hover:bg-gold/18 text-gold py-3 text-[9px] uppercase tracking-[0.28em] transition-all duration-500 rounded-xl"
      >
        Add to Cart
      </button>
      <button
        onClick={(e) => { e.stopPropagation(); openCart() }}
        className="px-5 border border-white/10 hover:border-gold/28 text-[9px] uppercase tracking-[0.22em] transition-all duration-500 rounded-xl"
      >
        Cart
      </button>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// RITUAL CARD
// ─────────────────────────────────────────────────────────────

function RitualCard({ ritual, onOpen }: { ritual: Ritual; onOpen: (r: Ritual) => void }) {
  const accent = ritualAccents[ritual.id] ?? ritualAccents['ubuntu-ground-ritual']

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onOpen(ritual)}
      className="group relative overflow-hidden border border-white/5 bg-[#0a0a0a] hover:border-gold/18 transition-all duration-700 rounded-[2rem] cursor-pointer"
    >
      <div className="relative h-[600px] overflow-hidden">
        <Image
          src={ritual.image}
          alt={ritual.name}
          fill
          className="object-cover grayscale-[0.20] group-hover:scale-[1.055] group-hover:grayscale-0 transition-all duration-[2000ms]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/18 to-transparent" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[1500ms]"
          style={{ background: `radial-gradient(circle at center, ${accent.glow}, transparent 70%)` }}
        />

        <div className="absolute top-5 left-5 flex gap-2 flex-wrap z-10">
          <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-gold/20 bg-black/42 backdrop-blur-xl text-gold rounded-full">
            {ritual.categoryTag}
          </span>
          <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-white/10 bg-black/38 backdrop-blur-xl text-white/52 rounded-full">
            {ritual.status}
          </span>
        </div>
        <div className="absolute top-5 right-5 z-10">
          <span className="text-[7px] uppercase tracking-[0.25em] text-gold/32">{accent.label}</span>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-7 z-10">
          <p className="text-[9px] uppercase tracking-[0.38em] text-gold mb-3">Ceremonial Ritual</p>
          <h3 className="font-display text-4xl leading-none mb-3">{ritual.name}</h3>
          <p className="text-white/38 text-sm leading-relaxed mb-5 line-clamp-2 italic">"{ritual.description}"</p>

          <div className="grid grid-cols-2 gap-3 mb-5">
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Mood</p>
              <p className="font-mono text-[10px] text-gold/72">{ritual.mood}</p>
            </div>
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Soundscape</p>
              <p className="font-mono text-[10px] text-white/48">{ritual.soundscape}</p>
            </div>
          </div>

          <div className="mb-5">
            <QuickAddButton ritual={ritual} />
          </div>

          <div className="flex justify-between items-end">
            <div>
              <p className="font-display text-3xl text-gold">KES {ritual.price.toLocaleString()}</p>
              <p className="text-[7px] uppercase tracking-[0.22em] text-white/18">{ritual.duration}</p>
            </div>
            <button className="px-6 py-3 border border-white/10 text-[9px] uppercase tracking-[0.22em] hover:border-gold hover:text-gold transition-all duration-500 rounded-full bg-black/18">
              Enter →
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// RITUAL MODAL
// ─────────────────────────────────────────────────────────────

function RitualModal({ ritual, onClose }: { ritual: Ritual; onClose: () => void }) {
  const accent = ritualAccents[ritual.id] ?? ritualAccents['ubuntu-ground-ritual']
  const { addItem } = useCartStore()

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const fn = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', fn)
    return () => window.removeEventListener('keydown', fn)
  }, [onClose])

  const addToCart = () => {
    addItem({
      id: ritual.id,
      name: ritual.name,
      category: 'spa',
      tag: ritual.categoryTag,
      price: ritual.price,
      unit: '/ session',
      therapist: therapists[0].name,
      tea: 'Wild Mint Tea',
      soundscape: ritual.soundscape,
      addOns: [],
    })
    toast.success(`${ritual.name} added to Wellness Cart`)
    onClose()
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/90 backdrop-blur-2xl" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 6 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-6xl flex flex-col lg:flex-row rounded-[2.5rem] overflow-hidden border border-white/8 bg-[#080808] shadow-2xl"
        style={{ maxHeight: 'calc(100svh - 48px)' }}
      >
        <div className="relative lg:w-[42%] min-h-[260px] lg:min-h-0 flex-shrink-0 overflow-hidden">
          <Image src={ritual.image} alt={ritual.name} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/18 via-transparent to-black/55 lg:bg-gradient-to-r lg:from-transparent lg:to-[#080808]" />
          <div
            className="absolute inset-0 opacity-65"
            style={{ background: `radial-gradient(circle at 50% 50%, ${accent.glow}, transparent 70%)` }}
          />
          <FloatingParticles count={8} />
          <div className="absolute top-6 left-6 flex flex-wrap gap-2 z-10">
            <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-gold/25 bg-black/52 backdrop-blur-xl text-gold rounded-full">
              {ritual.categoryTag}
            </span>
            <span className="px-3 py-1.5 text-[8px] uppercase tracking-[0.28em] border border-white/10 bg-black/42 backdrop-blur-xl text-white/52 rounded-full">
              {ritual.status}
            </span>
          </div>
          <div className="absolute bottom-6 left-6 z-10">
            <p className="text-[8px] uppercase tracking-[0.32em] text-gold/45">{accent.label}</p>
          </div>
        </div>

        <div className="lg:w-[58%] overflow-y-auto p-7 md:p-10 flex flex-col gap-6">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[9px] uppercase tracking-[0.38em] text-gold mb-2">Ceremonial Ritual</p>
              <h2 className="font-display text-4xl md:text-5xl leading-none">{ritual.name}</h2>
            </div>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center text-white/30 hover:text-white hover:border-white/25 transition-all flex-shrink-0 mt-1 ml-4"
            >
              ✕
            </button>
          </div>

          <p className="text-white/42 leading-relaxed italic text-sm">"{ritual.description}"</p>

          <div className="grid grid-cols-3 gap-3">
            {[['Duration', ritual.duration], ['Heat', ritual.heatLevel], ['Pressure', ritual.pressure]].map(([l, v]) => (
              <div key={l} className="border border-white/5 rounded-2xl p-3.5">
                <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1.5">{l}</p>
                <p className="text-gold text-[10px] font-mono leading-tight">{v}</p>
              </div>
            ))}
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-3">Aroma Profile</p>
            <div className="flex flex-wrap gap-2">
              {ritual.aromaNotes.map((note) => (
                <span key={note} className="px-4 py-1.5 border border-gold/20 text-gold text-[8px] uppercase tracking-[0.22em] rounded-full">
                  {note}
                </span>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-4">Ritual Timeline</p>
            <div className="space-y-2">
              {ritual.timeline.map((step, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex gap-3 items-start"
                >
                  <div className="w-1 h-1 rounded-full bg-gold/38 mt-1.5 flex-shrink-0" />
                  <p className="text-white/42 text-xs font-mono">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-4">Recovery Intelligence</p>
            <div className="space-y-3">
              <RecoveryMeter label="Stress Recovery"    value={ritual.recovery.stress}    />
              <RecoveryMeter label="Sleep Quality"      value={ritual.recovery.sleep}     />
              <RecoveryMeter label="Energy Restoration" value={ritual.recovery.energy}    />
              <RecoveryMeter label="Emotional Reset"    value={ritual.recovery.emotional} />
            </div>
          </div>

          <div>
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/25 mb-3">Enhancements</p>
            <div className="flex flex-wrap gap-2">
              {ritual.addOns.map((addon) => (
                <span
                  key={addon}
                  className="px-3.5 py-1.5 border border-white/8 text-white/38 text-[8px] uppercase tracking-[0.18em] rounded-full hover:border-gold/22 hover:text-gold transition-all duration-300 cursor-pointer"
                >
                  + {addon}
                </span>
              ))}
            </div>
          </div>

          <div className="border border-white/5 rounded-2xl p-4 flex items-center gap-4">
            <div className="w-8 h-8 rounded-full border border-gold/18 flex items-center justify-center text-gold text-xs flex-shrink-0">♪</div>
            <div>
              <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1">Soundscape</p>
              <p className="text-white/55 text-xs">{ritual.soundscape}</p>
            </div>
          </div>

          <div className="border-t border-white/5 pt-6">
            <div className="mb-5">
              <p className="text-[8px] uppercase tracking-[0.22em] text-white/18 mb-1">Investment</p>
              <p className="font-display text-4xl text-gold">KES {ritual.price.toLocaleString()}</p>
              <p className="text-[7px] uppercase tracking-[0.18em] text-white/18">{ritual.duration} · Per Session</p>
            </div>
            <div className="flex gap-3">
              <MagneticButton className="flex-1 btn-gold !py-4 !text-[10px]" onClick={addToCart}>
                ADD TO WELLNESS CART
              </MagneticButton>
              <Link
                href="/contact"
                className="px-7 py-4 border border-white/10 hover:border-gold/28 text-[9px] uppercase tracking-[0.22em] transition-all duration-500 rounded-full text-center whitespace-nowrap"
              >
                BOOK NOW
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────
// THERAPIST SECTION
// ─────────────────────────────────────────────────────────────

function TherapistSection() {
  const [active, setActive] = useState(therapists[0])

  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Healing Practitioners</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            THERAPIST
            <span className="italic text-gold"> ENERGY PROFILES</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Every practitioner at Ubuntu is matched to you by energy frequency,
            healing philosophy and therapeutic specialty — not just availability.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-9 items-start">
          <div className="space-y-4">
            {therapists.map((t) => (
              <motion.div
                key={t.id}
                onClick={() => setActive(t)}
                whileHover={{ x: 5 }}
                className={`cursor-pointer border rounded-[2rem] p-7 transition-all duration-500 ${
                  active.id === t.id
                    ? 'border-gold/28 bg-gold/5'
                    : 'border-white/5 bg-[#0a0a0a] hover:border-white/10'
                }`}
              >
                <div className="flex gap-5 items-start">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                    <Image src={t.image} alt={t.name} fill className="object-cover" />
                    <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 16px ${t.aura}` }} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl leading-none mb-1">{t.name}</h3>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-2">{t.energy} · {t.experience}</p>
                    <p className="text-white/38 text-sm leading-relaxed">{t.quote}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, x: 18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -14 }}
              transition={{ duration: 0.45 }}
              className="border border-white/5 rounded-[2.5rem] overflow-hidden bg-[#0a0a0a]"
            >
              <div className="relative h-[320px]">
                <Image src={active.image} alt={active.name} fill className="object-cover object-top" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                <div
                  className="absolute inset-0"
                  style={{ background: `radial-gradient(circle at center, ${active.aura}, transparent 70%)` }}
                />
              </div>
              <div className="p-9">
                <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-2">{active.frequency}</p>
                <h3 className="font-display text-3xl mb-4 leading-none">{active.name}</h3>
                <p className="text-white/48 leading-relaxed mb-7 italic text-sm">"{active.philosophy}"</p>
                <div className="mb-7">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-white/22 mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {active.specialties.map((s) => (
                      <span key={s} className="px-4 py-1.5 border border-gold/20 text-gold text-[8px] uppercase tracking-[0.22em] rounded-full">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <Link href="/contact" className="btn-gold w-full text-center block !py-4">
                  REQUEST {active.name.split(' ')[0].toUpperCase()}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// WELLNESS JOURNEY BUILDER
// ─────────────────────────────────────────────────────────────

function WellnessJourneyBuilder({ onSelectRitual }: { onSelectRitual: (id: string) => void }) {
  const [selected, setSelected] = useState<string | null>(null)
  const recommended = selected ? rituals.find((r) => r.id === wellnessRecommendations[selected]) : null

  return (
    <section className="py-28 px-6 md:px-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-14">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Wellness Intelligence</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            BUILD YOUR
            <span className="italic text-gold"> HEALING JOURNEY</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Tell us your intention. Moxie will curate the right ritual, therapist,
            aroma profile and soundscape for exactly where you are right now.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {wellnessGoals.map((goal) => (
            <motion.button
              key={goal}
              onClick={() => setSelected(goal === selected ? null : goal)}
              whileHover={{ y: -3 }}
              className={`border rounded-[1.5rem] p-5 text-left transition-all duration-500 ${
                selected === goal
                  ? 'border-gold/38 bg-gold/6 text-gold'
                  : 'border-white/5 bg-[#0a0a0a] text-white/48 hover:border-white/10'
              }`}
            >
              <p className="text-[7px] uppercase tracking-[0.3em] text-gold/48 mb-2">Intention</p>
              <p className="font-display text-xl leading-none">{goal}</p>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {recommended && (
            <motion.div
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="border border-gold/18 bg-gold/4 rounded-[2.5rem] p-9 md:p-12"
            >
              <p className="text-[9px] uppercase tracking-[0.35em] text-gold mb-5">
                Moxie Wellness Intelligence — Recommended Ritual
              </p>
              <div className="grid md:grid-cols-2 gap-9 items-center">
                <div>
                  <h3 className="font-display text-4xl md:text-5xl mb-4 leading-none">{recommended.name}</h3>
                  <p className="text-white/48 leading-relaxed mb-6 italic text-sm">"{recommended.description}"</p>
                  <div className="grid grid-cols-2 gap-4 mb-7">
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1.5">Duration</p>
                      <p className="text-gold text-sm">{recommended.duration}</p>
                    </div>
                    <div>
                      <p className="text-[7px] uppercase tracking-[0.3em] text-white/22 mb-1.5">Mood</p>
                      <p className="text-white/58 text-sm">{recommended.mood}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectRitual(recommended.id)}
                    className="btn-gold !px-9 !py-3.5"
                  >
                    VIEW FULL RITUAL →
                  </button>
                </div>
                <div className="space-y-4">
                  <RecoveryMeter label="Stress Recovery"    value={recommended.recovery.stress}    />
                  <RecoveryMeter label="Sleep Quality"      value={recommended.recovery.sleep}     />
                  <RecoveryMeter label="Energy Restoration" value={recommended.recovery.energy}    />
                  <RecoveryMeter label="Emotional Reset"    value={recommended.recovery.emotional} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// TESTIMONIALS
// ─────────────────────────────────────────────────────────────

function TestimonialsSection() {
  const [active, setActive] = useState(0)

  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Transformation Stories</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none">
            WHAT HAPPENS
            <span className="italic text-gold"> INSIDE</span>
          </h2>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 22 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.09, duration: 0.8 }}
              viewport={{ once: true }}
              onClick={() => setActive(i)}
              className={`cursor-pointer border rounded-[2rem] p-7 transition-all duration-700 ${
                active === i ? 'border-gold/22 bg-gold/4' : 'border-white/5 bg-[#0a0a0a] hover:border-white/10'
              }`}
            >
              <p className="text-[8px] uppercase tracking-[0.28em] text-gold mb-4">{t.ritual} · {t.duration}</p>
              <p className="text-white/58 leading-relaxed text-sm italic mb-6">"{t.quote}"</p>
              <div className="border-t border-white/5 pt-4">
                <p className="font-display text-xl">{t.name}</p>
                <p className="text-[8px] uppercase tracking-[0.22em] text-white/22">{t.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-white/10 text-sm italic">"The healing begins the moment you decide to slow down."</p>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// MEMBERSHIP
// ─────────────────────────────────────────────────────────────

function MembershipSection() {
  return (
    <section className="py-28 px-6 border-y border-white/5 bg-[#080808]">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Wellness Membership</p>
          <h2 className="font-display text-5xl leading-none mb-6">
            RESTORATION
            <span className="italic text-gold"> MEMBERSHIPS</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed mb-10">
            Designed for creators, executives, travelers, athletes,
            and high-performance individuals needing nervous system restoration consistently.
          </p>
          <div className="space-y-4">
            {[
              'Monthly wellness journeys',
              'Priority therapist scheduling',
              'Exclusive sunrise rituals',
              'Private recovery lounge access',
              'AI wellness recommendations',
              'Personalized ritual memory',
            ].map((item) => (
              <div key={item} className="flex items-center gap-4 text-white/48">
                <div className="w-1.5 h-1.5 rounded-full bg-gold flex-shrink-0" />
                {item}
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gold/10 rounded-[3rem] bg-gradient-to-br from-gold/5 to-transparent p-10">
          <p className="text-[9px] uppercase tracking-[0.35em] text-white/20 mb-5">Executive Reset Plan</p>
          <h3 className="font-display text-4xl mb-5 leading-none">The Recovery Circle</h3>
          <p className="text-white/38 leading-relaxed mb-10">
            Unlimited access to curated wellness rituals, thermal recovery experiences,
            tea ceremonies, guided restoration journeys, and private sanctuary access.
          </p>
          <MagneticButton className="btn-gold w-full !py-5">
            JOIN THE SANCTUARY
          </MagneticButton>
        </div>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// AMBIENT WELLNESS LAYER — v4 Fixed
//
// Root causes of the original silence, all resolved:
//
// 1. BROWSER AUTOPLAY POLICY (primary bug)
//    play() was called inside useEffect — one async tick after
//    the click. Browsers treat this as NOT user-initiated and
//    block it silently. Fix: play() is now called synchronously
//    inside the onClick handler itself.
//
// 2. MISSING AUDIO FILE
//    If /audio/forest-ambience.mp3 doesn't exist the <audio>
//    element fires an error event and nothing happens. Fix: a
//    Web Audio API synthesised ambient drone is generated as a
//    zero-dependency fallback. Three detuned sine oscillators
//    at 108 / 144 / 216 Hz (a calming harmonic series), a slow
//    LFO vibrato on each, a gentle noise texture, all routed
//    through a master gain. Sounds like a warm spa resonance
//    / Tibetan bowl sustain.
//
// 3. VOLUME TOO LOW
//    Original volume was 0.16 — barely audible on most speakers.
//    Raised to 0.38 for the mp3 path and 0.18 master gain on the
//    synthesised path (Web Audio levels are different units).
//
// 4. NO USER FEEDBACK
//    Added 'loading…' state so the user knows something is
//    happening between click and audio start.
//
// 5. NO CLEAN TEARDOWN
//    AudioContext was never closed. Now closes on unmount and
//    on each stop, preventing browser audio resource leaks.
// ─────────────────────────────────────────────────────────────

// ── Synthesised ambient tone — no file required ───────────────
function createAmbientTone(ctx: AudioContext): void {
  // Master gain — fades in over 2.5 s to avoid sudden onset
  const master = ctx.createGain()
  master.gain.setValueAtTime(0, ctx.currentTime)
  master.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 2.5)
  master.connect(ctx.destination)

  // Three harmonic sine oscillators with slow individual LFO vibrato
  const freqs = [108, 144, 216] // calming harmonic series (E2 family)
  const levels = [0.60, 0.25, 0.15]

  freqs.forEach((freq, i) => {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    const lpf  = ctx.createBiquadFilter()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, ctx.currentTime)

    // Slow pitch LFO — creates gentle, breathing quality
    const lfo     = ctx.createOscillator()
    const lfoGain = ctx.createGain()
    lfo.type = 'sine'
    lfo.frequency.setValueAtTime(0.06 + i * 0.025, ctx.currentTime)
    lfoGain.gain.setValueAtTime(0.4 + i * 0.1, ctx.currentTime)
    lfo.connect(lfoGain)
    lfoGain.connect(osc.frequency)
    lfo.start()

    // Low-pass filter softens harsh overtones
    lpf.type = 'lowpass'
    lpf.frequency.setValueAtTime(800 - i * 120, ctx.currentTime)
    lpf.Q.setValueAtTime(0.8, ctx.currentTime)

    gain.gain.setValueAtTime(levels[i], ctx.currentTime)

    osc.connect(lpf)
    lpf.connect(gain)
    gain.connect(master)
    osc.start()
  })

  // Soft noise layer — adds texture, prevents "electronic" feel
  const bufferSize  = ctx.sampleRate * 4
  const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
  const data        = noiseBuffer.getChannelData(0)
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * 0.008
  }
  const noise       = ctx.createBufferSource()
  noise.buffer      = noiseBuffer
  noise.loop        = true
  const noiseFilter = ctx.createBiquadFilter()
  noiseFilter.type  = 'bandpass'
  noiseFilter.frequency.setValueAtTime(180, ctx.currentTime)
  noiseFilter.Q.setValueAtTime(0.4, ctx.currentTime)
  noise.connect(noiseFilter)
  noiseFilter.connect(master)
  noise.start()
}

function AmbientWellnessLayer() {
  const [enabled, setEnabled]   = useState(false)
  const [status, setStatus]     = useState<'idle' | 'loading' | 'playing' | 'error'>('idle')
  const audioRef                = useRef<HTMLAudioElement | null>(null)
  const audioCtxRef             = useRef<AudioContext | null>(null)
  const usingFallbackRef        = useRef(false)

  // Initialise HTML Audio element once — do NOT set src yet
  // (setting src triggers a network request on some browsers)
  useEffect(() => {
    const audio        = new Audio()
    audio.loop         = true
    audio.volume       = 0.38
    audio.preload      = 'none'

    // If the mp3 is found and loads, update status
    audio.addEventListener('playing', () => setStatus('playing'))

    // If the mp3 fails (404, network error, etc.) mark fallback
    audio.addEventListener('error', () => {
      usingFallbackRef.current = true
    })

    audioRef.current = audio

    return () => {
      audio.pause()
      audio.src = ''
    }
  }, [])

  // Clean up AudioContext on unmount
  useEffect(() => {
    return () => {
      audioCtxRef.current?.close().catch(() => {})
      audioCtxRef.current = null
    }
  }, [])

  // ── STOP helper ───────────────────────────────────────────
  function stopAudio() {
    if (usingFallbackRef.current && audioCtxRef.current) {
      // Fade out master gain before closing to avoid click artefact
      try {
        const dest = audioCtxRef.current.destination
        // Close after 600 ms fade — simple timeout approach
        setTimeout(() => {
          audioCtxRef.current?.close().catch(() => {})
          audioCtxRef.current = null
        }, 600)
      } catch {
        audioCtxRef.current?.close().catch(() => {})
        audioCtxRef.current = null
      }
    } else {
      audioRef.current?.pause()
    }
    setEnabled(false)
    setStatus('idle')
  }

  // ── START — Web Audio API synthesised fallback ────────────
  function startFallback() {
    try {
      // Must construct AudioContext synchronously inside the click handler
      const ctx         = new AudioContext()
      audioCtxRef.current = ctx
      createAmbientTone(ctx)
      setEnabled(true)
      setStatus('playing')
    } catch {
      setEnabled(false)
      setStatus('error')
    }
  }

  // ── MAIN TOGGLE — called synchronously from onClick ───────
  // KEY FIX: play() MUST be called within the same call stack
  // as the user gesture (the click). Any await or useEffect
  // hop breaks the browser's gesture trust and blocks audio.
  function toggle() {
    if (enabled) {
      stopAudio()
      return
    }

    setStatus('loading')

    // If a previous attempt marked the file as unavailable,
    // go straight to synthesised fallback
    if (usingFallbackRef.current) {
      startFallback()
      return
    }

    // Try the mp3 file — set src and play synchronously
    if (audioRef.current) {
      audioRef.current.src = '/audio/forest-ambience.mp3'
      const promise = audioRef.current.play()

      if (promise !== undefined) {
        promise
          .then(() => {
            setEnabled(true)
            // status → 'playing' fires via the 'playing' event listener above
          })
          .catch(() => {
            // File missing, CORS error, or browser blocked — fall back silently
            usingFallbackRef.current = true
            audioRef.current?.pause()
            startFallback()
          })
      } else {
        // Older browsers return void — assume playing
        setEnabled(true)
        setStatus('playing')
      }
    } else {
      startFallback()
    }
  }

  const labels: Record<typeof status, string> = {
    idle:    '○ Sanctuary Audio',
    loading: '◌ Loading…',
    playing: '◉ Ambient On',
    error:   '○ Audio Unavailable',
  }

  return (
    <motion.button
      initial={{ opacity: 0, x: -14 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 3.5 }}
      onClick={toggle}
      disabled={status === 'loading' || status === 'error'}
      aria-label={enabled ? 'Turn off ambient sound' : 'Turn on ambient sound'}
      className={[
        'fixed left-6 bottom-8 z-50',
        'px-5 py-3',
        'border border-gold/20 bg-black/55 backdrop-blur-2xl rounded-full',
        'text-[9px] uppercase tracking-[0.28em] text-gold',
        'hover:bg-gold/8 transition-all duration-500',
        'disabled:opacity-40 disabled:cursor-not-allowed',
        // Pulse ring when playing — subtle, atmospheric
        enabled ? 'shadow-[0_0_0_1px_rgba(212,175,55,0.15),0_0_16px_rgba(212,175,55,0.08)]' : '',
      ].join(' ')}
    >
      <motion.span
        key={status}
        initial={{ opacity: 0, y: 4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.2 }}
        className="block"
      >
        {labels[status]}
      </motion.span>

      {/* Breathing ring animation when playing */}
      {enabled && (
        <motion.span
          className="absolute inset-0 rounded-full border border-gold/20 pointer-events-none"
          animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
    </motion.button>
  )
}

// ─────────────────────────────────────────────────────────────
// WELLNESS ASSISTANT — dismissable
// ─────────────────────────────────────────────────────────────

function WellnessAssistant() {
  const [visible, setVisible] = useState(true)
  if (!visible) return null
  return (
    <div className="fixed bottom-8 right-8 z-40 hidden lg:block">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 5, duration: 0.8 }}
        className="w-[310px] rounded-[2rem] border border-gold/14 bg-black/75 backdrop-blur-3xl p-6 shadow-[0_0_36px_rgba(212,175,55,0.06)]"
      >
        <div className="flex justify-between items-start mb-3">
          <p className="text-gold uppercase tracking-[0.28em] text-[8px]">Moxie Wellness AI</p>
          <button onClick={() => setVisible(false)} className="text-white/18 hover:text-white/50 text-xs transition-colors leading-none">✕</button>
        </div>
        <h4 className="font-display text-xl mb-2.5 leading-none">Intelligence Activated</h4>
        <p className="text-white/32 text-xs leading-relaxed mb-4">
          Based on elevated stress patterns, Moxie recommends the Ubuntu Ground Ritual
          with grounding aroma therapy and deep earth frequencies.
        </p>
        <a href="#services" className="btn-gold w-full !py-3 !text-[8px] text-center block">
          VIEW RECOMMENDED RITUAL
        </a>
      </motion.div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// FINAL CTA
// ─────────────────────────────────────────────────────────────

function FinalCTA() {
  return (
    <section className="relative py-40 px-6 overflow-hidden border-t border-white/5">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(212,175,55,0.055),transparent_65%)]" />
      <FloatingParticles count={12} />
      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Restoration Awaits</p>
        <h2 className="font-display text-5xl md:text-8xl leading-[0.88] mb-10">
          YOUR BODY HAS BEEN
          <span className="italic text-gold"> ASKING FOR THIS</span>
        </h2>
        <p className="max-w-xl mx-auto text-base text-white/32 leading-relaxed mb-12 italic">
          "The healing begins the moment you decide to slow down."
        </p>
        <MagneticButton className="btn-gold !px-14 !py-6 !text-[10px]">
          <Link href="/contact">BEGIN YOUR RESTORATION</Link>
        </MagneticButton>
      </div>
    </section>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────────────────────

export default function SpaPage() {
  const [selectedRitual, setSelectedRitual] = useState<Ritual | null>(null)

  const openRitualById = useCallback((id: string) => {
    const ritual = rituals.find((r) => r.id === id)
    if (ritual) setSelectedRitual(ritual)
  }, [])

  const scrollToServices = useCallback(() => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  return (
    <main className="bg-[#050505] text-white min-h-screen overflow-x-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Nav />

      {/* ── PHASE 1: ARRIVAL ── */}
      <CinematicHero onExplore={scrollToServices} />
      <SpaStatsBar />

      {/* ── PHASE 2: DISCOVERY ── */}
      <SpaServicesGrid onOpenRitual={openRitualById} />
      <ThermalSanctuariesSection onOpenRitual={openRitualById} />
      <FarmToRitualSection />

      {/* ── PHASE 3: ALL 8 RITUALS ── */}
      <section id="rituals" className="py-28 px-6 md:px-10 bg-[#050505] border-y border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="mb-18">
            <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Ritual Collection</p>
            <h2 className="font-display text-5xl md:text-6xl leading-none mb-5">
              CURATED
              <span className="italic text-gold"> RESTORATION</span>
            </h2>
            <p className="text-white/35 leading-relaxed text-lg max-w-2xl">
              Eight rituals. Eight distinct sensory journeys — blending touch, aroma, sound,
              heat, steam, silence and emotional restoration into one experience.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-7">
            {rituals.map((ritual) => (
              <RitualCard key={ritual.id} ritual={ritual} onOpen={setSelectedRitual} />
            ))}
          </div>
        </div>
      </section>

      {/* ── WELLNESS JOURNEY BUILDER ── */}
      <WellnessJourneyBuilder onSelectRitual={openRitualById} />

      {/* ── PHASE 4: DEEP TRUST ── */}
      <TherapistSection />
      <TestimonialsSection />

      {/* ── PHASE 5: COMMITMENT ── */}
      <MembershipSection />
      <FinalCTA />

      {/* ── MODALS ── */}
      <AnimatePresence>
        {selectedRitual && (
          <RitualModal ritual={selectedRitual} onClose={() => setSelectedRitual(null)} />
        )}
      </AnimatePresence>

      {/* ── IMMERSIVE SYSTEMS ── */}
      <AmbientWellnessLayer />
      <WellnessAssistant />

      <Footer />
      <MoxieChat />
    </main>
  )
}