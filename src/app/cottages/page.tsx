'use client'

import { useState, useEffect, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
} from 'framer-motion'

import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import MoxieChat from '@/components/MoxieChat'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'

// ── JSON LD SEO ───────────────────────────────────────────────────────
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'LodgingBusiness',
  name: 'Ubuntu Kreative Village',
  description: 'Off-grid sanctuaries powered by the sun.',
  telephone: '+254700000000',
  priceRange: '$$',
  image:
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Nairobi',
    addressCountry: 'KE',
  },
  amenityFeature: [
    { '@type': 'LocationFeatureSpecification', name: 'Solar Powered', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Farm Breakfast', value: true },
    { '@type': 'LocationFeatureSpecification', name: 'Off Grid', value: true },
  ],
}

// ── IMPROVED TYPES ────────────────────────────────────────────────────
// Improvement #1: Structured data with proper typing
export type StayCategory = 'Cottage' | 'Villa' | 'Suite' | 'Family Lodge' | 'Signature'
export type StayStatus = 'available' | 'reserved'

export interface Stay {
  id: string
  name: string
  category: StayCategory
  guests: number
  bedrooms: number
  bathrooms: number
  size: number
  price: number
  priceNote: string
  status: StayStatus
  featured?: boolean
  accent: string
  images: string[]
  features: string[]
  // Improvement #11: Real amenities
  amenities: string[]
  description: string
  // Improvement #18: Emotional storytelling copy
  storyLine: string
  specs: Record<string, string>
  // Improvement #14: Booking realism
  bookingDetails: {
    minNights: number
    cleaningFee: number
    taxRate: number
    breakfastIncluded: boolean
    cancellationPolicy: string
    maxOccupancy: number
  }
}

// ── IMPROVED DATA ─────────────────────────────────────────────────────
// Improvement #2: Diverse house types
// Improvement #3: Realistic house names (no plain numbering)
// Improvement #4 & #5: Better, consistent imagery
const stays: Stay[] = [
  // ── POKOMO COTTAGES ───────────────────────────────────────────────
  {
    id: 'pokomo-sunrise',
    name: 'Pokomo Sunrise Cottage',
    category: 'Cottage',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 42,
    price: 18500,
    priceNote: 'per night · 2 guests',
    status: 'available',
    accent: 'var(--neon)',
    images: [
      'https://images.unsplash.com/photo-1587061949733-5d6932edcfbf?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Private veranda', 'Garden view', 'Outdoor shower', 'Solar-powered'],
    amenities: [
      'Organic farm breakfast',
      'Solar heated showers',
      'Private fire pit',
      'Cedar veranda',
      'Stargazing deck',
      'Hand-woven linens',
    ],
    description: 'Nestled among indigenous trees, Pokomo Sunrise Cottage offers an intimate connection with the living farm.',
    storyLine: 'Wake to birdsong over dew-covered fields from your private cedar veranda. The first light finds you before the rest of the world does.',
    specs: {
      power: '2.5kW Solar Array / Tesla Powerwall',
      water: 'Borehole Filtered / Solar Heated',
      connectivity: 'Weak (Digital Detox Zone)',
      structure: 'Recycled Timber & Earth-Rendered Walls',
      insulation: 'Natural Wool & Hemp',
      lighting: 'CRI 95+ Warm LED System',
    },
    bookingDetails: {
      minNights: 2,
      cleaningFee: 2500,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 7 days before arrival',
      maxOccupancy: 2,
    },
  },
  {
    id: 'pokomo-river',
    name: 'Pokomo River Cottage',
    category: 'Cottage',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 44,
    price: 18500,
    priceNote: 'per night · 2 guests',
    status: 'available',
    accent: 'var(--neon)',
    images: [
      'https://images.unsplash.com/photo-1542718610-a1d656d1884c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Crop field view', 'Outdoor shower', 'Sunrise deck', 'Farm access'],
    amenities: [
      'Organic farm breakfast',
      'Solar heated showers',
      'Private sundeck',
      'Farm-to-table dinner add-on',
      'Guided sunrise walk',
      'Handmade pottery welcome set',
    ],
    description: 'Overlooking the heart of the farm, watch your breakfast ingredients grow from your private veranda.',
    storyLine: 'Sit with your morning coffee and watch the exact herbs that perfume your breakfast sway in the highland breeze below you.',
    specs: {
      power: '2.5kW Solar Array',
      water: 'Greywater Recycling System',
      connectivity: 'Minimal / Local Mesh Only',
      structure: 'Elevated Steel & Glass',
      cooling: 'Passive Cross-Ventilation',
      waste: 'Closed-Loop Bio-Digester',
    },
    bookingDetails: {
      minNights: 2,
      cleaningFee: 2500,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 7 days before arrival',
      maxOccupancy: 2,
    },
  },
  {
    id: 'pokomo-herb',
    name: 'Pokomo Herb Garden Cottage',
    category: 'Cottage',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 40,
    price: 18500,
    priceNote: 'per night · 2 guests',
    status: 'available',
    accent: 'var(--neon)',
    images: [
      'https://images.unsplash.com/photo-1510798831971-661eb04b3739?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1523413651479-597eb2da0ad6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502082553048-f009c37129b9?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Herb garden access', 'Outdoor shower', 'Farm breakfast', 'Stone paths'],
    amenities: [
      'Organic farm breakfast',
      'Private herb garden access',
      'Stone outdoor bathtub',
      'Wildcrafted welcome basket',
      'Botanical aromatherapy kit',
      'Guided herb foraging session',
    ],
    description: 'The quietest of the four cottages, tucked behind the herb garden. Ideal for couples seeking total seclusion.',
    storyLine: 'The scent of rosemary and lemon thyme drifts through your window before you open your eyes. Silence, here, is a luxury you can taste.',
    specs: {
      power: 'Full Solar Autonomy',
      water: 'Rainwater Harvest Integration',
      connectivity: 'Zero Signal Area',
      structure: 'Stone Masonry',
      thermal: 'High Thermal Mass Storage',
      flooring: 'Polished Earthen Floors',
    },
    bookingDetails: {
      minNights: 2,
      cleaningFee: 2500,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 7 days before arrival',
      maxOccupancy: 2,
    },
  },
  {
    id: 'pokomo-highland',
    name: 'Pokomo Highland Cottage',
    category: 'Cottage',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    price: 18500,
    priceNote: 'per night · 2 guests',
    size: 46,
    status: 'reserved',
    accent: 'var(--neon)',
    images: [
      'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587061949733-5d6932edcfbf?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Sunrise view', 'Highlands vista', 'Outdoor shower', 'Farm breakfast'],
    amenities: [
      'Organic farm breakfast',
      'Panoramic valley views',
      'Bamboo open-air shower',
      'Elevated sleeping platform',
      'Private fire pit',
      'Canvas stargazing roof',
    ],
    description: 'Positioned to catch the first light over the Kenyan highlands.',
    storyLine: 'The Kenyan highlands spread before you like a held breath. Your morning begins before the valley wakes — painted in amber and cool mist.',
    specs: {
      power: 'Hybrid Solar',
      water: 'Natural Spring Feed',
      connectivity: 'Weak',
      structure: 'Bamboo & Canvas',
      ventilation: '360-degree Open Mesh',
      elevation: '2.5m Above Grade',
    },
    bookingDetails: {
      minNights: 2,
      cleaningFee: 2500,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 7 days before arrival',
      maxOccupancy: 2,
    },
  },

  // ── FOREST VILLAS ─────────────────────────────────────────────────
  {
    id: 'acacia-glass-villa',
    name: 'Acacia Glass Villa',
    category: 'Villa',
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    size: 110,
    price: 32000,
    priceNote: 'per night · 4 guests',
    status: 'available',
    featured: true,
    accent: 'var(--gold)',
    images: [
      'https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Floor-to-ceiling glass', 'Private plunge pool', 'Forest canopy views', 'Butler service'],
    amenities: [
      'Private plunge pool',
      'Organic farm breakfast',
      'Personal butler on call',
      'Outdoor stone bathtub',
      'Indoor fireplace',
      'Starlink Wi-Fi',
      'Curated minibar',
      'Evening turndown service',
    ],
    description: 'A double-height glass pavilion suspended between the forest canopy and the open sky. Where architecture becomes reverence.',
    storyLine: 'Three walls of glass dissolve the boundary between shelter and wilderness. You are inside the forest. The forest is inside you.',
    specs: {
      power: '6kW Solar Array / Dual Tesla Powerwall',
      water: 'Spring-Fed / UV-Filtered',
      connectivity: 'Starlink Satellite',
      structure: 'Steel & Structural Glass Curtain Wall',
      pool: 'Solar-Heated Infinity Plunge Pool',
      flooring: 'Reclaimed Hardwood & Burnished Concrete',
    },
    bookingDetails: {
      minNights: 3,
      cleaningFee: 5000,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 14 days before arrival',
      maxOccupancy: 4,
    },
  },
  {
    id: 'forest-canopy-house',
    name: 'Forest Canopy House',
    category: 'Villa',
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    size: 95,
    price: 29500,
    priceNote: 'per night · 4 guests',
    status: 'available',
    accent: 'var(--gold)',
    images: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Treetop deck', 'Open-plan kitchen', 'Hammock garden', 'Forest trails access'],
    amenities: [
      'Organic farm breakfast',
      'Treetop hammock deck',
      'Private outdoor firepit',
      'Solar heated showers',
      'Curated book library',
      'Forest bathing guide',
      'Cast-iron outdoor kitchen',
      'Panoramic valley views',
    ],
    description: 'Perched in the upper forest, this open-plan residence breathes with the trees. The canopy is your ceiling.',
    storyLine: 'The trees hold you here. Your deck floats above the forest floor and the only alarm clock is the hadada ibis at dawn.',
    specs: {
      power: '5kW Solar Array',
      water: 'Rainwater Harvesting + Filtration',
      connectivity: 'Minimal Mesh',
      structure: 'Reclaimed Timber Post & Beam',
      elevation: '4m Above Grade on Rock Foundation',
      insulation: 'Cork Board & Rammed Earth Panels',
    },
    bookingDetails: {
      minNights: 2,
      cleaningFee: 4500,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 10 days before arrival',
      maxOccupancy: 4,
    },
  },

  // ── GLASS SUITES ─────────────────────────────────────────────────
  {
    id: 'mara-sky-suite',
    name: 'Mara Sky Suite',
    category: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 68,
    price: 24000,
    priceNote: 'per night · 2 guests',
    status: 'available',
    accent: 'var(--neon)',
    images: [
      'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1564501049412-61c2a3083791?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['360° sky views', 'Outdoor bathtub', 'Concierge service', 'Sundowner setup'],
    amenities: [
      'Organic farm breakfast',
      'Outdoor stone bathtub under stars',
      'Panoramic valley views',
      'Evening sundowner setup',
      'Private concierge',
      'Curated local spirits selection',
      'Handmade welcome hamper',
      'Daily fresh florals',
    ],
    description: 'The highest point of Ubuntu Village — a glass-and-steel eyrie that captures the full arc of the African sky.',
    storyLine: 'From here, you can see rain falling over the valley an hour before it arrives. You watch weather the way a hawk does — from above it all.',
    specs: {
      power: '4kW Solar with Battery Backup',
      water: 'Elevated Spring Tank / Solar Heated',
      connectivity: 'Starlink Satellite',
      structure: 'Weathered Steel & Structural Glass',
      views: '270° Valley & Highland Panorama',
      bathtub: 'Outdoor Volcanic Stone Soaking Tub',
    },
    bookingDetails: {
      minNights: 2,
      cleaningFee: 3500,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 10 days before arrival',
      maxOccupancy: 2,
    },
  },
  {
    id: 'sol-sanctuary',
    name: 'The Sol Sanctuary',
    category: 'Suite',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 72,
    price: 26500,
    priceNote: 'per night · 2 guests',
    status: 'available',
    accent: 'var(--neon)',
    images: [
      'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Solar-art installation', 'Meditation deck', 'Golden hour lighting', 'Spa add-on available'],
    amenities: [
      'Organic farm breakfast',
      'Private meditation deck',
      'Spa treatment add-on',
      'Indoor fireplace',
      'Sound bath on arrival',
      'Wildcrafted tea ceremony',
      'Heated floors',
      'Curated fragrance diffuser',
    ],
    description: 'Designed around the arc of the sun — a sanctuary where light itself is the primary design material.',
    storyLine: 'Light enters this room the way water enters a vessel — slowly, completely, filling every corner. By midday, you are golden. By dusk, you understand why.',
    specs: {
      power: '4.5kW Full Solar / Smart Battery Grid',
      water: 'Borehole + Carbon Filter + UV Sterilizer',
      connectivity: 'Weak (Intentional)',
      structure: 'Rammed Earth & Copper-Clad Steel',
      floors: 'Underfloor Solar Radiant Heating',
      orientation: 'Solar-Aligned East-West Axis',
    },
    bookingDetails: {
      minNights: 3,
      cleaningFee: 3500,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 10 days before arrival',
      maxOccupancy: 2,
    },
  },

  // ── EARTH HOUSES ─────────────────────────────────────────────────
  {
    id: 'earth-nest',
    name: 'The Earth Nest',
    category: 'Cottage',
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 55,
    price: 21000,
    priceNote: 'per night · 2 guests',
    status: 'available',
    accent: 'var(--gold)',
    images: [
      'https://images.unsplash.com/photo-1518780664697-55e3ad937233?q=80&w=2000&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1543489822-c49534f3271f?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Earthen walls', 'Sunken lounge', 'Courtyard garden', 'Rammed-earth floors'],
    amenities: [
      'Organic farm breakfast',
      'Private courtyard garden',
      'Sunken fire lounge',
      'Artisanal clay bathtub',
      'Locally woven textiles',
      'Botanical skin-care kit',
      'Sunrise yoga space',
      'Curated Kenyan ceramics',
    ],
    description: 'Built from the land it sits on — compressed earth walls, stone floors and a living roof that blooms in season.',
    storyLine: 'The walls breathe. The floor holds warmth from three days ago. Here, shelter is not built — it is grown from the earth that holds it.',
    specs: {
      power: '3kW Solar Array',
      water: 'Rainwater Harvest + Reed Bed Filter',
      connectivity: 'Zero (Analogue Sanctuary)',
      structure: 'CSEB Compressed Earth Block + Living Roof',
      thermal: 'Passive Thermal Mass — no mechanical cooling',
      walls: '600mm Rammed Earth — R-value 3.4',
    },
    bookingDetails: {
      minNights: 2,
      cleaningFee: 3000,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 7 days before arrival',
      maxOccupancy: 2,
    },
  },
  {
    id: 'quiet-stone-villa',
    name: 'The Quiet Stone Villa',
    category: 'Villa',
    guests: 4,
    bedrooms: 2,
    bathrooms: 2,
    size: 120,
    price: 34000,
    priceNote: 'per night · 4 guests',
    status: 'available',
    accent: 'var(--gold)',
    images: [
      'https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Dry-stone walls', 'Private library', 'Outdoor soaking pool', 'Mountain views'],
    amenities: [
      'Organic farm breakfast',
      'Private outdoor soaking pool',
      'Indoor fireplace',
      'Curated library of 200+ books',
      'Evening turndown & warming service',
      'Starlink Wi-Fi',
      'Farm-to-table dinner experience',
      'Sommelier-curated wine list',
    ],
    description: 'Heavy stone walls. Profound quiet. A library. Two long baths. This is what "off-grid luxury" actually means.',
    storyLine: 'There is a particular silence that stone buildings hold — older than conversation, deeper than sleep. This is where you find it.',
    specs: {
      power: '7kW Solar Array / Dual Battery Storage',
      water: 'Natural Spring + Reverse Osmosis',
      connectivity: 'Starlink Satellite',
      structure: 'Dry-Stack Granite Masonry + Slate Roof',
      pool: 'Solar-Heated Stone Soaking Pool',
      library: 'Climate-Controlled Reading Room',
    },
    bookingDetails: {
      minNights: 3,
      cleaningFee: 6000,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 14 days before arrival',
      maxOccupancy: 4,
    },
  },

  // ── FAMILY LODGES ─────────────────────────────────────────────────
  {
    id: 'highland-retreat',
    name: 'Highland Retreat Lodge',
    category: 'Family Lodge',
    guests: 6,
    bedrooms: 3,
    bathrooms: 2,
    size: 160,
    price: 42000,
    priceNote: 'per night · 6 guests',
    status: 'available',
    accent: 'var(--gold)',
    images: [
      'https://images.unsplash.com/photo-1568605114967-8130f3a36994?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1559827260-dc66d52bef19?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['3 bedrooms', 'Large communal kitchen', 'Children welcome', 'Farm activities'],
    amenities: [
      'Organic farm breakfast for all guests',
      'Children\'s farm activity program',
      'Communal outdoor fire pit',
      'Large outdoor dining terrace',
      'Private farm-to-table chef add-on',
      'Guided nature walks',
      'Animal feeding experience',
      'Stargazing telescope',
    ],
    description: 'Three bedrooms, an open farmhouse kitchen, and a terrace made for long evenings. Designed for families who want to share something real.',
    storyLine: 'The table here is long enough for everyone. In the morning, children collect eggs. In the evening, the fire is where stories grow.',
    specs: {
      power: '10kW Solar Array / Whole-home Battery',
      water: 'Borehole + 3-stage Filtration',
      connectivity: 'Starlink Available',
      structure: 'Timber Frame + Stone Chimney Breast',
      kitchen: 'Fully Equipped Farm Kitchen',
      outdoor: 'Covered 60sqm Terrace',
    },
    bookingDetails: {
      minNights: 3,
      cleaningFee: 8000,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 14 days before arrival',
      maxOccupancy: 6,
    },
  },
  {
    id: 'savanna-family-lodge',
    name: 'Savanna Family Lodge',
    category: 'Family Lodge',
    guests: 8,
    bedrooms: 4,
    bathrooms: 3,
    size: 210,
    price: 55000,
    priceNote: 'per night · 8 guests',
    status: 'available',
    accent: 'var(--gold)',
    images: [
      'https://images.unsplash.com/photo-1575517111839-3a3843ee7f5d?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1531971589569-0d9370cbe1e5?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['4 bedrooms', 'Swimming pond', 'Private chef kitchen', 'Event-ready terrace'],
    amenities: [
      'Full farm breakfast service',
      'Private chef (on request)',
      'Natural swimming pond',
      'Outdoor clay pizza oven',
      'Event terrace (up to 30 pax)',
      'Children\'s treehouse',
      'Guided safari day trips',
      'Full household staff',
    ],
    description: 'Ubuntu\'s largest residence — for gatherings, celebrations, and families who arrive with intention.',
    storyLine: 'This is the house that holds the memory of the trip. Years later, you will still feel the warmth of that terrace fire and the sound of eight people laughing under the stars.',
    specs: {
      power: '15kW Solar Micro-grid',
      water: 'Borehole + Full Purification Plant',
      connectivity: 'Starlink Business Plan',
      structure: 'Stone + Reclaimed Timber Compound',
      kitchen: 'Commercial-Grade Farm Kitchen',
      events: 'Licensed Outdoor Event Space',
    },
    bookingDetails: {
      minNights: 4,
      cleaningFee: 12000,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Free cancellation up to 21 days before arrival',
      maxOccupancy: 8,
    },
  },

  // ── SIGNATURE VILLA ───────────────────────────────────────────────
  {
    id: 'ubuntu-signature-villa',
    name: 'The Ubuntu Signature Villa',
    category: 'Signature',
    guests: 6,
    bedrooms: 3,
    bathrooms: 3,
    size: 280,
    price: 85000,
    priceNote: 'per night · exclusive use',
    status: 'available',
    featured: true,
    accent: 'var(--gold)',
    images: [
      'https://images.unsplash.com/photo-1613977257592-4a9a32f9141b?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1614596485013-64efb44a0843?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578645510447-e20b4311e3ce?q=80&w=2070&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1600607688969-a5bfcd646154?q=80&w=2070&auto=format&fit=crop',
    ],
    features: ['Infinity pool', 'Private chef', 'Concierge 24/7', 'Helicopter access'],
    amenities: [
      'Private infinity pool',
      'Dedicated 24/7 concierge',
      'Resident private chef',
      'All meals & beverages included',
      'Daily spa treatments',
      'Helipad access',
      'Tesla transfer from Nairobi',
      'Fully stocked wine cellar',
      'Private screening room',
      'In-villa art collection',
    ],
    description: 'The pinnacle of Ubuntu Kreative Village — a private estate designed for those who seek the extraordinary.',
    storyLine: 'You do not book the Signature Villa. You appoint it. From the moment your Tesla reaches the gates, until your final dawn over the valley, every detail exists for exactly this.',
    specs: {
      power: '20kW Solar Estate Grid / Tesla Megapack',
      water: 'Private Spring + Full Reverse Osmosis Plant',
      connectivity: 'Starlink Business Priority + Backup Fibre',
      structure: 'Architect-Designed Steel, Glass & Stone Estate',
      pool: 'Heated Infinity Pool with Valley Views',
      security: 'Smart Security + 24hr On-site Team',
    },
    bookingDetails: {
      minNights: 5,
      cleaningFee: 0,
      taxRate: 0.16,
      breakfastIncluded: true,
      cancellationPolicy: 'Non-refundable. Full rebooking flexibility within 12 months.',
      maxOccupancy: 6,
    },
  },
]

// ── FILTER CONFIG ──────────────────────────────────────────────────────
// Improvement #6 & #7: Filtering and Sorting
const FILTER_TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Cottages', value: 'Cottage' },
  { label: 'Villas', value: 'Villa' },
  { label: 'Suites', value: 'Suite' },
  { label: 'Family', value: 'Family Lodge' },
  { label: 'Signature', value: 'Signature' },
]

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low', value: 'price-asc' },
  { label: 'Price: High', value: 'price-desc' },
  { label: 'Guests', value: 'guests' },
]

// ── GALLERY IMAGE ─────────────────────────────────────────────────────
function GalleryImage({
  src,
  alt,
  index,
  onClick,
}: {
  src: string
  alt: string
  index: number
  onClick?: () => void
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7deg', '-7deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7deg', '7deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }

  const handleMouseLeave = () => { x.set(0); y.set(0) }

  const spanClass =
    index === 0
      ? 'col-span-2 row-span-2 h-[600px]'
      : 'col-span-1 row-span-1 h-[300px]'

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`relative overflow-hidden border border-white/5 group cursor-crosshair ${spanClass}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        loading="lazy"
        className="object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.2] group-hover:grayscale-0"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-black/60 opacity-60" />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <div className="absolute top-4 left-4 font-mono text-[8px] text-[var(--neon)] bg-black/80 px-2 py-1 border border-[var(--neon)]/30">
          {String(index + 1).padStart(2, '0')}
        </div>
      </div>
    </motion.div>
  )
}

// ── MODAL ──────────────────────────────────────────────────────────────
// Improvement #8: More premium modal layout
// Improvement #9: Refined language
// Improvement #14: Booking realism display
function StayModal({ c, onClose }: { c: Stay; onClose: () => void }) {
  const { addItem, items, openCart } = useCartStore()
  const [zoomedImg, setZoomedImg] = useState<string | null>(null)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  const inCart = items.some((i) => i.id === c.id)

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (zoomedImg) setZoomedImg(null)
        else onClose()
      }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [zoomedImg, onClose])

  const handleAddToCart = () => {
    if (c.status === 'reserved') return
    if (inCart) { openCart(); return }
    addItem({ id: c.id, name: c.name, tag: c.category, category: 'cottage', price: c.price, unit: '/ night' })
    toast.success(`${c.name} added to Reservation`)
  }

  // Improvement #14: Calculate booking costs
  const cleaningFee = c.bookingDetails.cleaningFee
  const baseTax = Math.round(c.price * c.bookingDetails.taxRate)

  const accordionSections = [
    {
      id: 'amenities',
      label: 'Amenities & Inclusions',
      content: (
        <div className="grid grid-cols-1 gap-2 pt-4">
          {c.amenities.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-[11px] text-white/60 uppercase tracking-wider">
              <span className="text-[var(--gold)] text-[10px]">◈</span>
              {a}
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'sustainability',
      label: 'Sustainability',
      content: (
        <div className="pt-4 space-y-3">
          {Object.entries(c.specs).map(([key, val]) => (
            <div key={key} className="flex justify-between items-start gap-4">
              <p className="text-[9px] uppercase tracking-widest text-white/30 w-28 flex-shrink-0">{key}</p>
              <p className="font-mono text-[11px] text-white/80 text-right leading-tight">{val}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'booking',
      label: 'Booking Details',
      content: (
        <div className="pt-4 space-y-3">
          {[
            ['Min nights', `${c.bookingDetails.minNights} nights`],
            ['Cleaning fee', cleaningFee === 0 ? 'Included' : `KES ${cleaningFee.toLocaleString()}`],
            ['Taxes (VAT 16%)', `KES ${baseTax.toLocaleString()}`],
            ['Breakfast', c.bookingDetails.breakfastIncluded ? 'Included for all guests' : 'Not included'],
            ['Max occupancy', `${c.bookingDetails.maxOccupancy} guests`],
            ['Cancellation', c.bookingDetails.cancellationPolicy],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-start gap-4 py-2 border-b border-white/5">
              <p className="text-[9px] uppercase tracking-widest text-white/30">{k}</p>
              <p className="text-[11px] text-white/70 text-right leading-snug max-w-[200px]">{v}</p>
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-6"
      >
        <div className="absolute inset-0 bg-black/98 backdrop-blur-3xl" onClick={onClose} />

        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-[1600px] h-full md:h-[90vh] bg-[#050505] border border-white/10 overflow-hidden"
        >
          <button
            onClick={onClose}
            className="absolute top-0 right-0 z-[110] px-8 py-6 bg-white/5 hover:bg-red-500/20 transition-all font-mono text-xs border-l border-b border-white/10"
          >
            [ Close ]
          </button>

          <div className="flex flex-col lg:flex-row h-full">
            {/* LEFT — Gallery */}
            <div className="w-full lg:w-[60%] h-[50vh] lg:h-full overflow-y-auto custom-scrollbar bg-black">
              <div className="grid grid-cols-2 gap-0">
                {c.images.map((img, i) => (
                  <GalleryImage key={i} src={img} alt={`${c.name}-${i}`} index={i} onClick={() => setZoomedImg(img)} />
                ))}
              </div>
            </div>

            {/* RIGHT — Details */}
            <div className="w-full lg:w-[40%] h-full flex flex-col bg-[#080808] border-l border-white/10">
              <div className="p-8 md:p-14 overflow-y-auto custom-scrollbar flex-1">
                {/* Improvement #10: Calmer header hierarchy */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-8 h-[1px] bg-[var(--gold)]" />
                  <span className="text-[var(--gold)] font-mono text-[9px] tracking-[0.4em] uppercase opacity-60">
                    Ubuntu {c.category}
                  </span>
                </div>

                <h2 className="font-display text-4xl md:text-6xl mb-4 tracking-tight leading-[0.9] uppercase">
                  {c.name}
                </h2>

                {/* Improvement #18: Emotional storytelling */}
                <p className="font-body text-base text-white/50 leading-relaxed italic mb-4">
                  "{c.storyLine}"
                </p>

                <p className="font-body text-sm text-white/30 leading-relaxed mb-10">
                  {c.description}
                </p>

                {/* Quick stats */}
                <div className="grid grid-cols-3 gap-4 mb-10 p-4 border border-white/5 bg-white/[0.02]">
                  {[
                    { label: 'Guests', value: `${c.guests}` },
                    { label: 'Bedrooms', value: `${c.bedrooms}` },
                    { label: 'Size', value: `${c.size}m²` },
                  ].map(({ label, value }) => (
                    <div key={label} className="text-center">
                      <p className="font-display text-2xl text-[var(--gold)]">{value}</p>
                      <p className="text-[8px] uppercase tracking-widest text-white/30 mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Improvement #8: Accordion sections */}
                <div className="space-y-px mb-10">
                  {accordionSections.map((section) => (
                    <div key={section.id} className="border border-white/5">
                      <button
                        onClick={() => setActiveAccordion(activeAccordion === section.id ? null : section.id)}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/50">{section.label}</span>
                        <span className="text-white/30 font-mono text-xs ml-4">
                          {activeAccordion === section.id ? '−' : '+'}
                        </span>
                      </button>
                      <AnimatePresence>
                        {activeAccordion === section.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden px-4 pb-4"
                          >
                            {section.content}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </div>
              </div>

              {/* Footer CTA */}
              <div className="p-8 md:p-10 bg-black border-t border-white/10">
                <div className="flex justify-between items-end mb-6">
                  <div>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest mb-1">
                      From
                    </p>
                    <p className="font-display text-4xl text-[var(--gold)]">
                      KES {c.price.toLocaleString()}
                    </p>
                    <p className="text-[9px] text-white/20 mt-1">{c.priceNote}</p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`block text-[9px] font-mono uppercase tracking-wider mb-1 ${
                        c.status === 'available' ? 'text-[var(--neon)]' : 'text-white/30'
                      }`}
                    >
                      {c.status === 'available' ? '● Available' : '○ Reserved'}
                    </span>
                    <span className="text-[9px] text-white/20 uppercase">
                      Breakfast & VAT Incl.
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={handleAddToCart}
                    disabled={c.status === 'reserved'}
                    className={`group relative overflow-hidden py-5 text-[11px] uppercase tracking-[0.3em] font-bold transition-all ${
                      inCart
                        ? 'bg-[var(--gold)] text-black'
                        : 'border border-[var(--gold)]/50 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black'
                    } ${c.status === 'reserved' ? 'opacity-30 pointer-events-none' : ''}`}
                  >
                    {inCart ? '✓ View Reservation' : 'Reserve Stay'}
                  </button>

                  <button
                    onClick={openCart}
                    className="py-5 text-[11px] border border-white/10 uppercase tracking-[0.3em] hover:bg-white/5 transition-all"
                  >
                    Reservation [{items.length}]
                  </button>
                </div>

                <Link
                  href="/contact"
                  className="block mt-4 text-center py-4 text-[10px] uppercase tracking-[0.25em] border border-white/5 hover:bg-white/5 transition-all text-white/30"
                >
                  Contact Our Concierge
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* LIGHTBOX */}
      <AnimatePresence>
        {zoomedImg && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setZoomedImg(null)}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-6 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="relative w-full max-w-7xl h-[90vh]"
            >
              <Image src={zoomedImg} alt="Expanded view" fill className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── CARD ──────────────────────────────────────────────────────────────
// Improvement #13: Staggered, editorial card compositions
// Improvement #18: Emotional storytelling in descriptions
function StayCard({
  c,
  index,
  onOpenSpecs,
  featured = false,
}: {
  c: Stay
  index: number
  onOpenSpecs: (c: Stay) => void
  featured?: boolean
}) {
  const { items, addItem, openCart } = useCartStore()
  const inCart = items.some((i) => i.id === c.id)

  const handleAddToCart = () => {
    if (c.status === 'reserved') return
    if (inCart) { toast('Already in your Reservation', { icon: '✦' }); openCart(); return }
    addItem({ id: c.id, name: c.name, tag: c.category, category: 'cottage', price: c.price, unit: '/ night' })
    toast.success(`${c.name} added to Reservation`)
  }

  // Improvement #13: Featured cards span full row
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="col-span-full group relative overflow-hidden flex flex-col md:flex-row bg-[#0a0a0a] border border-white/5 hover:border-[var(--gold)]/30 transition-all duration-700"
      >
        {/* Large image */}
        <div
          className="relative md:w-[60%] h-72 md:h-[500px] overflow-hidden cursor-pointer flex-shrink-0"
          onClick={() => onOpenSpecs(c)}
        >
          <Image
            src={c.images[0]}
            alt={c.name}
            fill
            priority
            sizes="60vw"
            className="object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a] opacity-40" />
          <div className="absolute top-6 left-6 flex gap-2 z-10">
            <span className="log-badge backdrop-blur-md bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)]">
              {c.category}
            </span>
            <span className="log-badge backdrop-blur-md bg-black/40 border-white/10 text-white/50">
              ★ Featured
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between p-10 md:p-16">
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--gold)]/60 mb-4">
              Ubuntu {c.category} · Exclusive
            </p>
            <h3 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight leading-[0.9] mb-6">
              {c.name}
            </h3>
            {/* Improvement #18 */}
            <p className="font-body text-base text-white/40 italic leading-relaxed mb-8">
              "{c.storyLine}"
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'Guests', value: `${c.guests}` },
                { label: 'Bedrooms', value: `${c.bedrooms}` },
                { label: 'Size', value: `${c.size}m²` },
                { label: 'Min stay', value: `${c.bookingDetails.minNights}n` },
              ].map(({ label, value }) => (
                <div key={label} className="border border-white/5 p-3 text-center">
                  <p className="font-display text-xl text-[var(--gold)]">{value}</p>
                  <p className="text-[8px] uppercase tracking-widest text-white/25 mt-1">{label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2 mb-8">
              {c.amenities.slice(0, 4).map((a, i) => (
                <span key={i} className="px-3 py-1 border border-white/10 text-[9px] uppercase tracking-wider text-white/40">
                  {a}
                </span>
              ))}
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">From</p>
              <p className="font-display text-3xl text-[var(--gold)]">KES {c.price.toLocaleString()}</p>
              <p className="text-[8px] text-white/20">{c.priceNote}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={c.status === 'reserved'}
                className={`font-body text-[10px] uppercase tracking-[0.2em] py-4 px-8 border transition-all duration-300 ${
                  inCart ? 'bg-[var(--gold)] border-[var(--gold)] text-black' : 'border-[var(--gold)]/40 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black'
                } ${c.status === 'reserved' ? 'opacity-30 pointer-events-none' : ''}`}
              >
                {inCart ? '✓ Reserved' : 'Reserve Stay'}
              </button>
              <button
                onClick={() => onOpenSpecs(c)}
                className="font-body text-[10px] uppercase tracking-[0.2em] py-4 px-6 border border-white/10 hover:border-[var(--gold)]/30 text-white/40 hover:text-white/70 transition-all"
              >
                Explore →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      className="group relative overflow-hidden flex flex-col bg-[#0a0a0a] border border-white/5 hover:border-[var(--gold)]/20 transition-all duration-700"
    >
      <div
        className="relative h-72 w-full overflow-hidden cursor-pointer"
        onClick={() => onOpenSpecs(c)}
      >
        <Image
          src={c.images[0]}
          alt={c.name}
          fill
          loading="lazy"
          sizes="(max-width:768px) 100vw, 33vw"
          className="object-cover grayscale-[0.35] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />

        <div className="absolute top-4 left-4 flex gap-2 z-10">
          <span
            className="log-badge backdrop-blur-md border-[var(--gold)]/30 bg-black/50"
            style={{ color: c.accent, borderColor: `${c.accent}44` }}
          >
            {c.category}
          </span>
          <span className="log-badge backdrop-blur-md bg-black/40 border-white/10 text-white/50">
            {c.status === 'available' ? '● Available' : '○ Reserved'}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10">
          <div className="backdrop-blur-md bg-black/40 border border-white/10 px-3 py-2">
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/30">Guests</p>
            <p className="font-mono text-xs text-[var(--gold)]">{c.guests} People</p>
          </div>
          <div className="backdrop-blur-md bg-black/40 border border-white/10 px-3 py-2">
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/30">Beds</p>
            <p className="font-mono text-xs text-[var(--gold)]">{c.bedrooms} Bed{c.bedrooms > 1 ? 's' : ''}</p>
          </div>
          {/* Improvement #14: Min nights shown on card */}
          <div className="backdrop-blur-md bg-black/40 border border-white/10 px-3 py-2">
            <p className="text-[8px] uppercase tracking-[0.3em] text-white/30">Min Stay</p>
            <p className="font-mono text-xs text-[var(--gold)]">{c.bookingDetails.minNights}n</p>
          </div>
        </div>

        <AnimatePresence>
          {inCart && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 flex items-center justify-center z-20"
            >
              <span className="font-body text-[10px] tracking-[0.25em] uppercase px-4 py-2 border border-[var(--gold)] bg-[var(--gold)]/10 text-[var(--gold)]">
                ✓ In Reservation
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-3">
          <h3 className="font-display text-2xl text-white uppercase tracking-tight leading-none">
            {c.name}
          </h3>
          <div className="text-right flex-shrink-0">
            <span className="font-display text-xl text-[var(--gold)]">
              KES {c.price.toLocaleString()}
            </span>
            <span className="block text-[8px] tracking-[0.2em] uppercase text-white/20">
              per night
            </span>
          </div>
        </div>

        {/* Improvement #18: Story line instead of plain description */}
        <p className="font-body text-xs text-white/40 italic leading-relaxed mb-6 line-clamp-2">
          "{c.storyLine}"
        </p>

        {/* Improvement #11: Real amenities preview */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          {c.amenities.slice(0, 4).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[9px] text-white/40 uppercase tracking-widest">
              <span className="text-[var(--gold)] text-[10px]">◈</span>
              {feat}
            </div>
          ))}
        </div>

        <div className="mt-auto flex flex-col gap-3">
          <div className="flex gap-2">
            <button
              onClick={handleAddToCart}
              disabled={c.status === 'reserved'}
              className={`flex-1 font-body text-[10px] uppercase tracking-[0.2em] py-4 border transition-all duration-300 ${
                inCart
                  ? 'bg-[var(--gold)] border-[var(--gold)] text-black'
                  : 'border-white/10 text-white/60 hover:border-[var(--gold)] hover:text-[var(--gold)]'
              } ${c.status === 'reserved' ? 'opacity-30 pointer-events-none' : ''}`}
            >
              {inCart ? '✓ In Reservation' : '+ Reserve Stay'}
            </button>

            <button
              onClick={() => toast(`Moxie is curating ${c.name}...`, { icon: '✦' })}
              className="px-5 border border-white/10 hover:border-[var(--neon)] text-white/30 hover:text-[var(--neon)] transition-all"
            >
              <span className="font-mono text-xs">M.</span>
            </button>
          </div>

          <button
            onClick={() => onOpenSpecs(c)}
            className={`text-center text-[9px] uppercase tracking-[0.3em] py-3 border border-white/5 hover:border-[var(--gold)]/30 hover:text-[var(--gold)] transition-all ${
              c.status === 'reserved' ? 'opacity-30 pointer-events-none text-white/20' : 'text-white/30'
            }`}
          >
            {c.status === 'available' ? 'Explore Residence →' : 'Currently Reserved'}
          </button>

          {inCart && (
            <button
              onClick={openCart}
              className="font-body text-[9px] tracking-[0.2em] uppercase text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors py-2"
            >
              View Reservation →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── FEATURED SIGNATURE SHOWCASE ────────────────────────────────────────
// Improvement #12: Dedicated featured property section
function SignatureShowcase({ stay, onOpen }: { stay: Stay; onOpen: () => void }) {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      className="relative py-24 px-6 md:px-10 overflow-hidden border-y border-white/5"
    >
      <div className="absolute inset-0">
        <Image src={stay.images[0]} alt={stay.name} fill className="object-cover opacity-15 grayscale" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]" />
      </div>

      <div className="relative max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-[var(--gold)]" />
            <span className="text-[var(--gold)] font-mono text-[9px] tracking-[0.5em] uppercase">
              The Signature Experience
            </span>
          </div>

          <h2 className="font-display text-5xl md:text-7xl font-light mb-6 leading-[0.85] uppercase">
            {stay.name}
          </h2>

          <p className="font-body text-lg text-white/50 italic leading-relaxed mb-8">
            "{stay.storyLine}"
          </p>

          <div className="flex flex-wrap gap-2 mb-10">
            {stay.amenities.slice(0, 6).map((a, i) => (
              <span key={i} className="px-3 py-1 border border-[var(--gold)]/20 text-[9px] uppercase tracking-wider text-white/40">
                {a}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-8">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">From</p>
              <p className="font-display text-3xl text-[var(--gold)]">KES {stay.price.toLocaleString()}</p>
              <p className="text-[8px] text-white/20">{stay.priceNote}</p>
            </div>
            <button
              onClick={onOpen}
              className="btn-gold !px-10 !py-4 !text-[10px]"
            >
              View Estate →
            </button>
          </div>
        </div>

        {/* Mini gallery */}
        <div className="grid grid-cols-2 gap-3">
          {stay.images.map((img, i) => (
            <motion.div
              key={i}
              whileHover={{ scale: 1.02 }}
              onClick={onOpen}
              className="relative overflow-hidden cursor-pointer border border-white/5"
              style={{ height: i === 0 ? '260px' : '120px' }}
            >
              <Image src={img} alt={`${stay.name} ${i}`} fill loading="lazy" className="object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700" />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}

// ── MAIN PAGE ──────────────────────────────────────────────────────────
export default function CottagesPage() {
  const { items, openCart } = useCartStore()

  const [selectedStay, setSelectedStay] = useState<Stay | null>(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [activeSort, setActiveSort] = useState('featured')
  const [stayDates, setStayDates] = useState({ checkIn: '', checkOut: '' })
  const [guestFilter, setGuestFilter] = useState(0)

  const cottagesInCart = items.filter((i) => i.category === 'cottage').length

  // Improvement #6 & #7: Filter + sort logic
  const filteredStays = useMemo(() => {
    let result = stays.filter((s) => {
      const categoryMatch = activeFilter === 'All' || s.category === activeFilter
      const guestMatch = guestFilter === 0 || s.guests >= guestFilter
      return categoryMatch && guestMatch
    })

    switch (activeSort) {
      case 'price-asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'guests':
        result = [...result].sort((a, b) => b.guests - a.guests)
        break
      default:
        // featured first
        result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return result
  }, [activeFilter, activeSort, guestFilter])

  const signatureVilla = stays.find((s) => s.category === 'Signature')

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white overflow-hidden">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Nav />

      {/* ── HERO ────────────────────────────────────────────────────── */}
      {/* Improvement #19: Video hero (with image fallback) */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 px-6">
        <div className="absolute inset-0 z-0">
          {/* Video hero — replace /hero-video.mp4 with your drone footage */}
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-35"
            poster="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
            {/* Fallback image if video not found */}
            <Image
              src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop"
              alt="Ubuntu Village Farm"
              fill
              priority
              className="object-cover opacity-40 grayscale"
            />
          </video>

          <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] bg-[size:80px_80px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-transparent to-[#0a0a0a]" />
        </div>

        <div className="relative z-10 text-center max-w-5xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-6 inline-block"
          >
            <span className="log-badge border-[var(--gold)]/30 text-[var(--gold)] bg-[var(--gold)]/5 px-6 py-2 uppercase tracking-widest">
              Est. 2024 · The Living Village
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-[clamp(3rem,10vw,8rem)] leading-[0.85] font-light mb-8"
          >
            Sleep inside
the <br />
            <span className="text-[var(--gold)] italic">living village</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-body text-white/50 max-w-2xl mx-auto text-sm leading-relaxed mb-12"
          >
            Experience the lovely off-grid sanctuaries designed for deep rest — powered by the sun, and
            fed by the very land you sleep on. Choose silence. Choose wildness. Choose
            yourself.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <a href="#stays" className="btn-gold !px-12 !py-5">
              Explore The Residences
            </a>
            <div className="flex items-center gap-4 text-xs font-body tracking-[0.2em] text-white/40">
              <span className="w-8 h-px bg-white/20" />
              {stays.filter(s => s.status === 'available').length} of {stays.length} Residences Available
              <span className="w-8 h-px bg-white/20" />
            </div>
          </motion.div>

          {cottagesInCart > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={openCart}
              className="mt-12 flex items-center gap-3 font-body text-[10px] tracking-[0.15em] uppercase border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold)] px-6 py-3 rounded hover:bg-[var(--gold)]/20 transition-all mx-auto"
            >
              <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-black flex items-center justify-center text-[10px] font-bold">
                {cottagesInCart}
              </span>
              {cottagesInCart === 1 ? '1 stay' : `${cottagesInCart} stays`} in Reservation — view →
            </motion.button>
          )}
        </div>
      </section>

      {/* ── STICKY DATE BAR ─────────────────────────────────────────── */}
      {/* Improvement #17: Better mobile sticky bar */}
      <div className="sticky top-[80px] z-30 px-6 md:px-10 py-4 bg-black/80 backdrop-blur-md border-y border-white/5">
        <div className="max-w-8xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">Arrival</span>
              <input
                type="date"
                className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer"
                onChange={(e) => setStayDates((p) => ({ ...p, checkIn: e.target.value }))}
              />
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">Departure</span>
              <input
                type="date"
                className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer"
                onChange={(e) => setStayDates((p) => ({ ...p, checkOut: e.target.value }))}
              />
            </div>
            <div className="w-px h-8 bg-white/10 hidden md:block" />
            {/* Improvement #6: Guest filter in bar */}
            <div className="flex flex-col hidden md:flex">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">Guests</span>
              <select
                className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer"
                onChange={(e) => setGuestFilter(Number(e.target.value))}
              >
                <option value={0}>Any</option>
                <option value={2}>2+</option>
                <option value={4}>4+</option>
                <option value={6}>6+</option>
                <option value={8}>8+</option>
              </select>
            </div>
          </div>

          {cottagesInCart > 0 && (
            <button onClick={openCart} className="btn-neon !py-2 !px-4 !text-[9px]">
              View Reservation ({cottagesInCart})
            </button>
          )}
        </div>
      </div>

      {/* ── PRICING STRIP ───────────────────────────────────────────── */}
      {/* Improvement #20: More breathing room, calmer */}
      <div className="px-6 md:px-10 py-16 border-b border-white/5 bg-[#0d0d0d]">
        <div className="max-w-8xl mx-auto flex flex-wrap items-center justify-between gap-8 text-center sm:text-left">
          {[
            { label: 'Cottages from', value: 'KES 18,500', note: 'per night · 2 guests' },
            { label: 'Suites from', value: 'KES 24,000', note: 'per night · 2 guests' },
            { label: 'Villas from', value: 'KES 29,500', note: 'per night · 4 guests' },
            { label: '3+ night stay', value: '15% off', note: 'applied automatically' },
            { label: 'Farm breakfast', value: 'Included', note: 'all residences' },
          ].map((s, i) => (
            <div key={i} className="flex-1 min-w-[160px]">
              <div className="font-body text-[9px] tracking-widest uppercase text-white/25 mb-2">{s.label}</div>
              <div className="font-display text-2xl font-light" style={{ color: i % 2 === 0 ? 'var(--neon)' : 'var(--gold)' }}>
                {s.value}
              </div>
              <div className="font-body text-[9px] text-white/20 mt-1">{s.note}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SIGNATURE SHOWCASE ──────────────────────────────────────── */}
      {/* Improvement #12: Featured property spotlight */}
      {signatureVilla && (
        <SignatureShowcase
          stay={signatureVilla}
          onOpen={() => setSelectedStay(signatureVilla)}
        />
      )}

      {/* ── FILTER + SORT BAR ────────────────────────────────────────── */}
      {/* Improvement #6 & #7 */}
      <section id="stays" className="pt-24 pb-4 px-6 md:px-10">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
            <div className="max-w-xl">
              {/* Improvement #10: Calmer typography */}
              <span className="text-[var(--gold)] text-[10px] tracking-[0.4em] uppercase mb-4 block opacity-60">
                Our Residences
              </span>
              <h2 className="font-display text-5xl font-light">
                CHOOSE YOUR <span className="italic">SANCTUARY</span>
              </h2>
              <p className="font-body text-sm text-white/30 mt-4 leading-relaxed">
                {filteredStays.length} residence{filteredStays.length !== 1 ? 's' : ''} · all solar-powered · farm breakfast included
              </p>
            </div>

            {/* Sort */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[8px] uppercase tracking-widest text-white/25 mr-2">Sort</span>
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setActiveSort(opt.value)}
                  className={`px-4 py-2 text-[9px] uppercase tracking-wider border transition-all ${
                    activeSort === opt.value
                      ? 'border-[var(--gold)]/50 text-[var(--gold)] bg-[var(--gold)]/5'
                      : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 flex-wrap mb-12">
            {FILTER_TABS.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-6 py-3 text-[10px] uppercase tracking-[0.2em] border transition-all duration-300 ${
                  activeFilter === tab.value
                    ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5'
                    : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'
                }`}
              >
                {tab.label}
                <span className="ml-2 font-mono text-[8px] opacity-50">
                  ({stays.filter(s => tab.value === 'All' || s.category === tab.value).length})
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── GRID ─────────────────────────────────────────────────────── */}
      {/* Improvement #13: Staggered asymmetric grid */}
      <section className="pb-32 px-6 md:px-10">
        <div className="max-w-8xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeFilter + activeSort}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredStays.map((c, index) => (
                <StayCard
                  key={c.id}
                  c={c}
                  index={index}
                  onOpenSpecs={setSelectedStay}
                  featured={c.featured && index === 0}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredStays.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-32 text-center"
            >
              <p className="font-display text-4xl text-white/20 mb-4">No residences found</p>
              <button
                onClick={() => { setActiveFilter('All'); setGuestFilter(0) }}
                className="text-[10px] uppercase tracking-widest text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors"
              >
                Clear filters →
              </button>
            </motion.div>
          )}

          {/* Improvement #20: Visual breathing room — calmer CTA */}
          {cottagesInCart > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 p-12 border border-[var(--gold)]/20 bg-[var(--gold)]/5"
            >
              <div>
                <p className="font-display text-3xl mb-2 text-white font-light">
                  Ready to confirm your stay?
                </p>
                <p className="font-body text-sm text-white/30 leading-relaxed">
                  {cottagesInCart} {cottagesInCart === 1 ? 'residence' : 'residences'} selected —
                  complete your reservation and we will be in touch within 2 hours.
                </p>
              </div>
              <button onClick={openCart} className="btn-gold !px-12 !py-4 !text-xs flex-shrink-0">
                Review Reservation →
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── MODAL ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {selectedStay && (
          <StayModal c={selectedStay} onClose={() => setSelectedStay(null)} />
        )}
      </AnimatePresence>

      <Footer />
      <MoxieChat />
    </main>
  )
}