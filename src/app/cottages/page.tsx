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
  image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=2070&auto=format&fit=crop',
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

// ── TYPES ─────────────────────────────────────────────────────────────
export type StayCategory = 'Farm House' | 'Pokomo Cottage' | 'Signature'
export type StayStatus = 'available' | 'reserved'
export type StayFloor = 'Ground Floor' | 'First Floor' | 'Rooftop' | 'Cottage' | 'Exclusive'

export interface BoardRates {
  bedOnly: number
  bedBreakfast: number
  halfBoard: number
  fullBoard: number
}

export type BoardOption = 'bedOnly' | 'bedBreakfast' | 'halfBoard' | 'fullBoard'

export interface Stay {
  id: string
  name: string
  category: StayCategory
  floor: StayFloor
  isPenthouse: boolean
  guests: number
  bedrooms: number
  bathrooms: number
  size: number
  rates: BoardRates
  status: StayStatus
  featured?: boolean
  accent: string
  images: string[]
  features: string[]
  amenities: string[]
  description: string
  storyLine: string
  specs: Record<string, string>
  bookingDetails: {
    minNights: number
    cleaningFee: number
    taxRate: number
    cancellationPolicy: string
    maxOccupancy: number
  }
}

// ── BOARD OPTION LABELS ────────────────────────────────────────────────
const BOARD_LABELS: Record<BoardOption, string> = {
  bedOnly: 'Bed Only',
  bedBreakfast: 'Bed & Breakfast',
  halfBoard: 'Half Board',
  fullBoard: 'Full Board',
}

const BOARD_INCLUDES: Record<BoardOption, string> = {
  bedOnly: 'Room · Farm access · All amenities',
  bedBreakfast: 'Room · Farm breakfast · All amenities',
  halfBoard: 'Room · Breakfast · Lunch or dinner',
  fullBoard: 'Room · Breakfast · Lunch & dinner',
}

// ── SHARED AMENITIES ──────────────────────────────────────────────────
const FARMHOUSE_AMENITIES = [
  'Gym', 'Swimming Pool', 'Conference Facilities', 'Farm Tours',
  'Movie Nights', 'Cycling', 'Nature Walks',
]

const POKOMO_AMENITIES = [
  'Gym', 'Swimming Pool', 'Conference Facilities', 'Farm Tours',
  'Movie Nights', 'Cycling', 'Nature Walks', 'Bonfire',
]

// ── STAYS DATA ────────────────────────────────────────────────────────
const stays: Stay[] = [
  // ══ FARM HOUSE — GROUND FLOOR ══
  {
    id: 'warbugia',
    name: 'Warbugia',
    category: 'Farm House',
    floor: 'Ground Floor',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 38,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Warbugia-farmhouse01.jpeg',
      '/images/Warbugia-farmhouse02.jpeg',
      '/images/Warbugia-farmhouse03.jpeg',
      '/images/Warbugia-farmhouse04.jpeg',
    ],
    features: ['Ground floor access', 'Garden view', 'Solar-powered', 'Farm proximity'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Named after the indigenous Warbugia tree, this ground-floor room wraps you in the gentle energy of the farm at its most accessible — close to the earth, close to the fire, close to the morning.',
    storyLine: 'Wake to birdsong carried on cool highland air. The Warbugia room places you at the living heart of the farm, where the day begins slowly and beautifully.',
    specs: {
      power: '2.5kW Solar Array / Battery Backup',
      water: 'Borehole Filtered / Solar Heated',
      connectivity: 'Weak (Digital Detox Zone)',
      structure: 'Recycled Timber & Earth-Rendered Walls',
      insulation: 'Natural Wool & Hemp',
      lighting: 'CRI 95+ Warm LED System',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'locust-bean',
    name: 'Locust Bean',
    category: 'Farm House',
    floor: 'Ground Floor',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 38,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Locust-Bean02.jpeg',
      '/images/Locust-Bean01.jpeg',
      '/images/Locust-Bean3.jpeg',
      '/images/Locust-Bean5.jpeg',
    ],
    features: ['Courtyard access', 'Garden view', 'Farm breakfast option', 'Solar powered'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'The Locust Bean room draws its character from one of Africa\'s most generously giving trees — a room of warmth, substance, and quiet comfort at ground level.',
    storyLine: 'Sit with your morning coffee and watch the exact herbs that perfume your breakfast sway in the highland breeze below you.',
    specs: {
      power: '2.5kW Solar Array',
      water: 'Greywater Recycling System',
      connectivity: 'Minimal / Local Mesh Only',
      structure: 'Elevated Steel & Glass',
      cooling: 'Passive Cross-Ventilation',
      waste: 'Closed-Loop Bio-Digester',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'tamarind',
    name: 'Tamarind',
    category: 'Farm House',
    floor: 'Ground Floor',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 40,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Tamarind-farmhouse01.jpeg',
      '/images/Tamarind-farmhouse02.jpeg',
      '/images/Tamarind-farmhouse03.jpeg',
      '/images/Tamarind-farmhouse04.jpeg',
    ],
    features: ['Stone paths', 'Garden access', 'Solar-powered shower', 'Farm proximity'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Named for the ancient Tamarind, whose tangy fruit has nourished travellers for centuries — this room carries that same spirit of effortless hospitality and earthy elegance.',
    storyLine: 'The scent of the farm drifts through your window before you open your eyes. Silence here is a luxury you can taste.',
    specs: {
      power: 'Full Solar Autonomy',
      water: 'Rainwater Harvest Integration',
      connectivity: 'Zero Signal Area',
      structure: 'Stone Masonry',
      thermal: 'High Thermal Mass Storage',
      flooring: 'Polished Earthen Floors',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'acacia-penthouse',
    name: 'Acacia — Penthouse',
    category: 'Farm House',
    floor: 'Ground Floor',
    isPenthouse: true,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 55,
    rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 },
    status: 'available',
    featured: true,
    accent: 'var(--gold)',
    images: [
      '/images/Acacia-Penthouse01.jpeg',
      '/images/Acacia-Penthouse02.jpeg',
      '/images/Acacia-Penthouse03.jpeg',
      '/images/Acacia-Penthouse4.jpeg',
    ],
    features: ['Penthouse level', 'Expansive views', 'Premium finishes', 'Private terrace'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'The Acacia Penthouse is the crown of the ground-floor wing — elevated in every sense, named for Africa\'s most iconic tree and designed to match its stature.',
    storyLine: 'Three walls of glass dissolve the boundary between shelter and wilderness. You are inside the farm. The farm is inside you.',
    specs: {
      power: '4kW Solar Array / Dual Battery Backup',
      water: 'Spring-Fed / UV-Filtered',
      connectivity: 'Weak Mesh',
      structure: 'Steel & Structural Glass Curtain Wall',
      terrace: 'Private Elevated Terrace',
      flooring: 'Reclaimed Hardwood & Burnished Concrete',
    },
    bookingDetails: { minNights: 2, cleaningFee: 2000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 10 days before arrival', maxOccupancy: 2 },
  },
  // ══ FARM HOUSE — FIRST FLOOR ══
  {
    id: 'sycamore',
    name: 'Sycamore',
    category: 'Farm House',
    floor: 'First Floor',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 38,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Sycamore-farmhouse01.jpeg',
      '/images/Sycamore-farmhouse02.jpeg',
      '/images/Sycamore-farmhouse03.jpeg',
      '/images/Sycamore-farmhouse04.jpeg',
    ],
    features: ['First floor elevation', 'Canopy views', 'Cross-ventilation', 'Farm access'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'The Sycamore room sits a floor above the farm floor, offering elevated views across the property. Named for the fig-family giant whose branches shelter the oldest stories.',
    storyLine: 'The trees hold you here. Your window floats above the farm and the only alarm clock is the hadada ibis at dawn.',
    specs: {
      power: '3kW Solar Array',
      water: 'Rainwater Harvesting + Filtration',
      connectivity: 'Minimal Mesh',
      structure: 'Reclaimed Timber Post & Beam',
      elevation: 'First Floor — Elevated Vista',
      insulation: 'Cork Board & Rammed Earth Panels',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'mugumo',
    name: 'Mugumo',
    category: 'Farm House',
    floor: 'First Floor',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 38,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Mugumo-farmhouse1.jpeg',
      '/images/Mugumo-farmhouse2.jpeg',
      '/images/Mugumo-farmhouse3.jpeg',
      '/images/Mugumo-farmhouse4.jpeg',
    ],
    features: ['First floor views', 'Sacred tree namesake', 'Solar shower', 'Farm access'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Mugumo — the sacred fig, the tree of meetings. This room carries the gravity of that name: a space where you arrive carrying the weight of the week and leave lighter.',
    storyLine: 'From here, you can see the valley stretch and breathe. You watch weather arrive the way a hawk does — from above it all.',
    specs: {
      power: '3kW Solar with Battery Backup',
      water: 'Elevated Spring Tank / Solar Heated',
      connectivity: 'Weak Mesh',
      structure: 'Weathered Steel & Structural Glass',
      views: 'First Floor Valley & Farm Panorama',
      cooling: 'Passive Thermal — No Mechanical Cooling',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'ironwood-penthouse',
    name: 'Iron Wood — Penthouse',
    category: 'Farm House',
    floor: 'First Floor',
    isPenthouse: true,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 55,
    rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 },
    status: 'available',
    featured: true,
    accent: 'var(--gold)',
    images: [
      '/images/Iron-Wood-Penthouse01.jpeg',
      '/images/Iron-Wood-Penthouse02.jpeg',
      '/images/Iron-Wood-Penthouse03.jpeg',
      '/images/Iron-Wood-Penthouse04.jpeg',
    ],
    features: ['Penthouse level', 'First floor views', 'Premium finishes', 'Private deck'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Iron Wood — dense, enduring, and quietly magnificent. The First Floor Penthouse carries the same character: a room that takes no shortcuts and makes no apologies for its quality.',
    storyLine: 'Light enters this room the way water enters a vessel — slowly, completely, filling every corner. By midday, you are golden. By dusk, you understand why.',
    specs: {
      power: '4.5kW Full Solar / Smart Battery Grid',
      water: 'Borehole + Carbon Filter + UV Sterilizer',
      connectivity: 'Weak (Intentional)',
      structure: 'Rammed Earth & Copper-Clad Steel',
      floors: 'Underfloor Solar Radiant Heating',
      orientation: 'Solar-Aligned East-West Axis',
    },
    bookingDetails: { minNights: 2, cleaningFee: 2000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 10 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'baobab',
    name: 'Baobab',
    category: 'Farm House',
    floor: 'First Floor',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 40,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Baobab-farmhouse1.jpeg',
      '/images/Baobab-farmhouse3.jpeg',
      '/images/Baobab-farmhouse4.jpeg',
      '/images/Baobab-farmhouse2.jpeg',
    ],
    features: ['First floor', 'Earthen walls', 'Courtyard garden', 'Sunrise aspect'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'The Baobab room is named for the tree that stores water in its trunk for a thousand years. A room of patience, depth, and unmistakable presence — built to outlast any ordinary stay.',
    storyLine: 'The walls breathe. The floor holds warmth from three days ago. Here, shelter is not built — it is grown.',
    specs: {
      power: '3kW Solar Array',
      water: 'Rainwater Harvest + Reed Bed Filter',
      connectivity: 'Zero (Analogue Sanctuary)',
      structure: 'CSEB Compressed Earth Block + Living Roof',
      thermal: 'Passive Thermal Mass — no mechanical cooling',
      walls: '600mm Rammed Earth — R-value 3.4',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  // ══ FARM HOUSE — ROOFTOP ══
  {
    id: 'iroko',
    name: 'Iroko',
    category: 'Farm House',
    floor: 'Rooftop',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 42,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Inko-farmhouse.jpg',
      '/images/Inko-farmhouse2.jpg',
      '/images/Inko-farmhouse3.jpg',
      '/images/Inko-farmhouse4.jpg',
    ],
    features: ['Rooftop level', 'Open sky views', 'Stargazing access', 'Farm & valley panorama'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Iroko sits at the top of the world — or at least the top of the Farm House. A rooftop room where the sky is never a backdrop but a ceiling you choose to live under.',
    storyLine: 'The stars here are not a feature. They are furniture. Lie back and count what the city hides from you every single night.',
    specs: {
      power: '3kW Solar Array / Whole-home Battery',
      water: 'Borehole + 3-stage Filtration',
      connectivity: 'Weak Mesh Available',
      structure: 'Timber Frame + Insulated Roof Panel',
      kitchen: 'Rooftop Terrace Access',
      outdoor: 'Open 360° Sky Terrace',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'buffalo-thorn',
    name: 'Buffalo Thorn',
    category: 'Farm House',
    floor: 'Rooftop',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 42,
    rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Buffalo-Thorn01.jpeg',
      '/images/Buffalo-Thorn02.jpeg',
      '/images/Buffalo-Thorn3.jpeg',
      '/images/Buffalo-Thorn04.jpeg',
    ],
    features: ['Rooftop level', 'Open sky views', 'Sunrise aspect', 'Star access'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'Buffalo Thorn — revered across Africa for guiding the spirits of the departed home. This rooftop room is where you go to find your bearings, to return to yourself.',
    storyLine: 'The Kenyan highlands spread before you like a held breath. Your morning begins before the valley wakes — painted in amber and cool mist.',
    specs: {
      power: 'Hybrid Solar',
      water: 'Natural Spring Feed',
      connectivity: 'Weak',
      structure: 'Insulated Timber & Canvas Roof',
      ventilation: '360-degree Open Sky Access',
      elevation: 'Rooftop — Maximum Vista',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1500, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'neem-penthouse',
    name: 'Neem — Penthouse',
    category: 'Farm House',
    floor: 'Rooftop',
    isPenthouse: true,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 65,
    rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 },
    status: 'available',
    featured: true,
    accent: 'var(--gold)',
    images: [
      '/images/Neem-Penthouse011.jpeg',
      '/images/Neem-Penthouse022.jpeg',
      '/images/Neem-Penthouse03.jpeg',
      '/images/Neem-Penthouse04.jpeg',
    ],
    features: ['Rooftop Penthouse', 'Unobstructed sky views', 'Premium finishes', 'Exclusive rooftop deck'],
    amenities: FARMHOUSE_AMENITIES,
    description: 'The Neem Penthouse is the highest point of the Farm House — a private rooftop sanctuary named for the tree whose every part heals. This room leaves you better than it found you.',
    storyLine: 'You do not simply sleep here. You decompile. Layer by layer, the noise of your life below gives way to what the open sky has always known about you.',
    specs: {
      power: '6kW Solar Estate Grid / Tesla Powerwall',
      water: 'Private Spring + Full Reverse Osmosis',
      connectivity: 'Weak Mesh + Starlink on Request',
      structure: 'Architect-Designed Steel, Glass & Stone',
      deck: 'Exclusive Private Rooftop Terrace',
      security: 'Private Keycard Access',
    },
    bookingDetails: { minNights: 3, cleaningFee: 3000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 14 days before arrival', maxOccupancy: 2 },
  },
  // ══ POKOMO COTTAGES ══
  {
    id: 'marula',
    name: 'Marula',
    category: 'Pokomo Cottage',
    floor: 'Cottage',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 42,
    rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Marula-cottage1.jpeg',
      '/images/Marula-cottage2.jpeg',
      '/images/Marula-cottage3.jpeg',
      '/images/Marula-cottage4.jpeg',
    ],
    features: ['Private veranda', 'Garden view', 'Outdoor shower', 'Bonfire access'],
    amenities: POKOMO_AMENITIES,
    description: 'Named for the beloved Marula tree — whose fruit produces the famous Amarula liqueur — this Pokomo Cottage is all warmth, sweetness, and untamed African spirit.',
    storyLine: 'Wake to birdsong over dew-covered fields from your private cedar veranda. The first light finds you before the rest of the world does.',
    specs: {
      power: '2.5kW Solar Array / Tesla Powerwall',
      water: 'Borehole Filtered / Solar Heated',
      connectivity: 'Weak (Digital Detox Zone)',
      structure: 'Recycled Timber & Earth-Rendered Walls',
      insulation: 'Natural Wool & Hemp',
      lighting: 'CRI 95+ Warm LED System',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'shea',
    name: 'Shea',
    category: 'Pokomo Cottage',
    floor: 'Cottage',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 44,
    rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/shea-cottage1.jpeg',
      '/images/shea-cottage2.jpeg',
      '/images/shea-cottage3.jpeg',
      '/images/shea-cottage4.jpeg',
    ],
    features: ['Crop field view', 'Outdoor shower', 'Sunrise deck', 'Bonfire access'],
    amenities: POKOMO_AMENITIES,
    description: 'The Shea cottage takes its name from the Shea tree — provider of life-giving butter across the Sahel. A cottage of deep nourishment: quiet, generous, and profoundly restorative.',
    storyLine: 'Sit with your morning coffee and watch the exact herbs that perfume your breakfast sway in the highland breeze below you.',
    specs: {
      power: '2.5kW Solar Array',
      water: 'Greywater Recycling System',
      connectivity: 'Minimal / Local Mesh Only',
      structure: 'Elevated Steel & Glass',
      cooling: 'Passive Cross-Ventilation',
      waste: 'Closed-Loop Bio-Digester',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'milk-wood',
    name: 'Milk Wood',
    category: 'Pokomo Cottage',
    floor: 'Cottage',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 40,
    rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Milk-Wood1.jpeg',
      '/images/Milk-Wood2.jpeg',
      '/images/Milk-Wood3.jpeg',
      '/images/Milk-Wood4.jpeg',
    ],
    features: ['Garden access', 'Outdoor shower', 'Stone paths', 'Bonfire access'],
    amenities: POKOMO_AMENITIES,
    description: 'Milk Wood — the quietest of the Pokomo Cottages, tucked into its own pocket of green. A name that conjures softness, abundance, and a kind of radical stillness.',
    storyLine: 'The scent of rosemary and lemon thyme drifts through your window before you open your eyes. Silence, here, is a luxury you can taste.',
    specs: {
      power: 'Full Solar Autonomy',
      water: 'Rainwater Harvest Integration',
      connectivity: 'Zero Signal Area',
      structure: 'Stone Masonry',
      thermal: 'High Thermal Mass Storage',
      flooring: 'Polished Earthen Floors',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
  {
    id: 'ebony',
    name: 'Ebony',
    category: 'Pokomo Cottage',
    floor: 'Cottage',
    isPenthouse: false,
    guests: 2,
    bedrooms: 1,
    bathrooms: 1,
    size: 46,
    rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 },
    status: 'available',
    accent: 'var(--neon)',
    images: [
      '/images/Ebony-cottage2.jpeg',
      '/images/Ebony-cottage1.jpeg',
      '/images/Ebony-cottage3.jpeg',
      '/images/Ebony-cottage4.jpeg',
    ],
    features: ['Sunrise view', 'Highlands vista', 'Outdoor shower', 'Bonfire access'],
    amenities: POKOMO_AMENITIES,
    description: 'Ebony — dense, dark, and extraordinarily beautiful. This Pokomo Cottage is for those who understand that the most valuable things are never the loudest ones in the room.',
    storyLine: 'The Kenyan highlands spread before you like a held breath. Your morning begins before the valley wakes — painted in amber and cool mist.',
    specs: {
      power: 'Hybrid Solar',
      water: 'Natural Spring Feed',
      connectivity: 'Weak',
      structure: 'Bamboo & Canvas',
      ventilation: '360-degree Open Mesh',
      elevation: '2.5m Above Grade',
    },
    bookingDetails: { minNights: 2, cleaningFee: 1000, taxRate: 0.16, cancellationPolicy: 'Free cancellation up to 7 days before arrival', maxOccupancy: 2 },
  },
]

// ── FILTER CONFIG ──────────────────────────────────────────────────────
const FILTER_TABS: { label: string; value: string }[] = [
  { label: 'All', value: 'All' },
  { label: 'Farm House', value: 'Farm House' },
  { label: 'Pokomo Cottages', value: 'Pokomo Cottage' },
  { label: 'Penthouses', value: 'Penthouse' },
  { label: 'Rooftop', value: 'Rooftop' },
]

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low', value: 'price-asc' },
  { label: 'Price: High', value: 'price-desc' },
  { label: 'Guests', value: 'guests' },
]

const BOARD_OPTIONS: { label: string; value: BoardOption }[] = [
  { label: 'Bed Only', value: 'bedOnly' },
  { label: 'Bed & Breakfast', value: 'bedBreakfast' },
  { label: 'Half Board', value: 'halfBoard' },
  { label: 'Full Board', value: 'fullBoard' },
]

// ── RATES & PACKAGES SECTION ──────────────────────────────────────────
function RatesSection() {
  const [activeTab, setActiveTab] = useState<'standard' | 'honeymoon' | 'children' | 'latecheckout' | 'holidays'>('standard')

  const tabs = [
    { id: 'standard',     label: 'Standard Rates' },
    { id: 'honeymoon',    label: 'Honeymoon' },
    { id: 'children',     label: "Children's Rates" },
    { id: 'latecheckout', label: 'Late Check-Out' },
    { id: 'holidays',     label: 'Holidays' },
  ] as const

  return (
    <section id="rates" className="py-24 px-4 sm:px-6 md:px-10 border-t border-white/5 bg-[#080808]">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-4 mb-4">
            <div className="w-8 h-px bg-[var(--gold)]" />
            <span className="text-[var(--gold)] font-mono text-[9px] tracking-[0.4em] uppercase opacity-60">
              2026 – 2027 Season
            </span>
            <div className="w-8 h-px bg-[var(--gold)]" />
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-light leading-[0.9] mb-4">
            RATES &amp; <span className="italic text-[var(--gold)]">PACKAGES</span>
          </h2>
          <p className="font-body text-sm text-white/35 max-w-xl mx-auto md:mx-0">
            All rates are in Kenya Shillings (KES) · per person · per night · VAT 16% not included
          </p>
        </div>

        {/* Tab Nav */}
        <div className="flex flex-wrap gap-2 mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 text-[10px] uppercase tracking-[0.18em] border rounded-lg transition-all duration-200 ${
                activeTab === tab.id
                  ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/[0.06]'
                  : 'border-white/[0.08] text-white/30 hover:border-white/20 hover:text-white/55'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Panels */}
        <AnimatePresence mode="wait">
          {activeTab === 'standard' && (
            <motion.div key="standard" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-4 px-5 text-[9px] uppercase tracking-[0.3em] text-white/25 font-normal">Accommodation</th>
                      {BOARD_OPTIONS.map(o => (
                        <th key={o.value} className="text-right py-4 px-5 text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]/60 font-normal">{o.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Pokomo Cottages', rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 } },
                      { label: 'Farm House', rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 } },
                      { label: 'Pent Houses', rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 } },
                    ].map((row, i) => (
                      <tr key={row.label} className={`rate-row border-b border-white/[0.04] transition-colors ${i === 2 ? 'text-[var(--gold)]' : ''}`}>
                        <td className={`py-4 px-5 font-body text-sm ${i === 2 ? 'text-[var(--gold)]' : 'text-white/60'}`}>{row.label}</td>
                        {BOARD_OPTIONS.map(o => (
                          <td key={o.value} className={`text-right py-4 px-5 font-mono text-sm tabular-nums ${i === 2 ? 'text-[var(--gold)]' : 'text-white/50'}`}>
                            KES {row.rates[o.value].toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile cards */}
              <div className="md:hidden space-y-4">
                {[
                  { label: 'Pokomo Cottages', rates: { bedOnly: 5000, bedBreakfast: 6500, halfBoard: 8500, fullBoard: 10500 } },
                  { label: 'Farm House', rates: { bedOnly: 7500, bedBreakfast: 9000, halfBoard: 10500, fullBoard: 12500 } },
                  { label: 'Pent Houses', rates: { bedOnly: 9000, bedBreakfast: 10500, halfBoard: 12000, fullBoard: 14000 } },
                ].map((row) => (
                  <div key={row.label} className="border border-white/[0.06] rounded-xl p-5">
                    <p className="font-display text-base text-[var(--gold)] mb-4">{row.label}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {BOARD_OPTIONS.map(o => (
                        <div key={o.value} className="bg-white/[0.02] rounded-lg p-3">
                          <p className="text-[8px] uppercase tracking-widest text-white/25 mb-1">{o.label}</p>
                          <p className="font-mono text-sm text-white/60 tabular-nums">KES {row.rates[o.value].toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-5 text-[9px] text-white/20 font-body">
                * All rates per person · per night · VAT 16% added at checkout
              </p>
            </motion.div>
          )}

          {activeTab === 'honeymoon' && (
            <motion.div key="honeymoon" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <div className="mb-6 p-4 border border-[var(--gold)]/20 rounded-xl bg-[var(--gold)]/[0.03]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/60 mb-1">Honeymooners Package</p>
                <p className="text-sm text-white/40 font-body">Special rates for couples celebrating their honeymoon. Please mention at time of booking to qualify.</p>
              </div>
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-white/[0.08]">
                      <th className="text-left py-4 px-5 text-[9px] uppercase tracking-[0.3em] text-white/25 font-normal">Accommodation</th>
                      {BOARD_OPTIONS.map(o => (
                        <th key={o.value} className="text-right py-4 px-5 text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]/60 font-normal">{o.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { label: 'Pokomo Cottages', rates: { bedOnly: 7000, bedBreakfast: 8500, halfBoard: 10500, fullBoard: 12500 } },
                      { label: 'Farm House', rates: { bedOnly: 9000, bedBreakfast: 11000, halfBoard: 12500, fullBoard: 14500 } },
                    ].map((row) => (
                      <tr key={row.label} className="rate-row border-b border-white/[0.04] transition-colors">
                        <td className="py-4 px-5 font-body text-sm text-white/60">{row.label}</td>
                        {BOARD_OPTIONS.map(o => (
                          <td key={o.value} className="text-right py-4 px-5 font-mono text-sm text-white/50 tabular-nums">
                            KES {row.rates[o.value].toLocaleString()}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile */}
              <div className="md:hidden space-y-4">
                {[
                  { label: 'Pokomo Cottages', rates: { bedOnly: 7000, bedBreakfast: 8500, halfBoard: 10500, fullBoard: 12500 } },
                  { label: 'Farm House', rates: { bedOnly: 9000, bedBreakfast: 11000, halfBoard: 12500, fullBoard: 14500 } },
                ].map((row) => (
                  <div key={row.label} className="border border-white/[0.06] rounded-xl p-5">
                    <p className="font-display text-base text-[var(--gold)] mb-4">{row.label}</p>
                    <div className="grid grid-cols-2 gap-3">
                      {BOARD_OPTIONS.map(o => (
                        <div key={o.value} className="bg-white/[0.02] rounded-lg p-3">
                          <p className="text-[8px] uppercase tracking-widest text-white/25 mb-1">{o.label}</p>
                          <p className="font-mono text-sm text-white/60 tabular-nums">KES {row.rates[o.value].toLocaleString()}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'children' && (
            <motion.div key="children" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <div className="space-y-3">
                {[
                  { age: '0 – 4 Years', rate: 'Free of charge', note: 'Sharing bed with parent' },
                  { age: '5 – 11 Years', rate: '30% of adult rate', note: 'Based on applicable room rate' },
                  { age: '12 Years & above', rate: 'Full adult rate', note: 'Standard room rate applies' },
                ].map((row) => (
                  <div key={row.age} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/[0.05] rounded-xl px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-body text-sm text-white/60">{row.age}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{row.note}</p>
                    </div>
                    <p className="font-mono text-sm text-[var(--gold)] flex-shrink-0">{row.rate}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'latecheckout' && (
            <motion.div key="latecheckout" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <div className="space-y-3">
                {[
                  { time: 'Up to 12:00 Noon', rate: 'Complimentary', note: 'Subject to availability' },
                  { time: '12:00 Noon – 5:00 PM', rate: '50% of day\'s rack rate', note: 'Half-day charge applies' },
                  { time: 'From 5:00 PM', rate: 'Full room rate', note: 'Full night rate charged' },
                ].map((row) => (
                  <div key={row.time} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border border-white/[0.05] rounded-xl px-5 py-4 hover:bg-white/[0.02] transition-colors">
                    <div>
                      <p className="font-body text-sm text-white/60">{row.time}</p>
                      <p className="text-[10px] text-white/25 mt-0.5">{row.note}</p>
                    </div>
                    <p className="font-mono text-sm text-[var(--gold)] flex-shrink-0">{row.rate}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'holidays' && (
            <motion.div key="holidays" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.22 }}>
              <div className="border border-[var(--gold)]/20 rounded-xl bg-[var(--gold)]/[0.03] p-6 mb-6">
                <p className="text-[10px] uppercase tracking-[0.2em] text-[var(--gold)]/60 mb-3">Holiday Surcharge</p>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-3 mb-3">
                  <p className="font-display text-3xl text-[var(--gold)]">KES 1,000</p>
                  <p className="font-body text-sm text-white/40">extra per person · per night during public holidays</p>
                </div>
                <p className="text-sm text-white/35 font-body leading-relaxed">
                  An additional surcharge of KES 1,000 per person per night applies during all public holidays and peak festive periods.
                </p>
              </div>
              <div className="border border-white/[0.05] rounded-xl px-5 py-4 bg-white/[0.01]">
                <p className="text-[10px] uppercase tracking-widest text-white/25 mb-2">Exemption</p>
                <p className="text-sm text-white/45 font-body">Children below 5 years of age are exempt from the holiday surcharge.</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}

// ── GALLERY IMAGE ─────────────────────────────────────────────────────
function GalleryImage({ src, alt, index, onClick }: { src: string; alt: string; index: number; onClick?: () => void }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left) / rect.width - 0.5)
    y.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const handleMouseLeave = () => { x.set(0); y.set(0) }

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className="relative overflow-hidden group cursor-zoom-in w-full h-full"
    >
      <Image src={src} alt={alt} fill loading="lazy" sizes="(max-width: 768px) 100vw, 35vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
      <div className="absolute top-3 left-3 font-mono text-[8px] text-white/40 bg-black/50 px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {String(index + 1).padStart(2, '0')} / 04
      </div>
    </motion.div>
  )
}

// ── STAY MODAL ─────────────────────────────────────────────────────────
function StayModal({ c, onClose, selectedBoard, onBoardChange, guests, onGuestsChange }: {
  c: Stay; onClose: () => void; selectedBoard: BoardOption; onBoardChange: (b: BoardOption) => void; guests: number; onGuestsChange: (n: number) => void
}) {
  const { addItem, items, openCart } = useCartStore()
  const [zoomedImg, setZoomedImg] = useState<string | null>(null)
  const [activeAccordion, setActiveAccordion] = useState<string | null>(null)

  const inCart = items.some((i) => i.id === `${c.id}-${selectedBoard}`)
  const pricePerPerson = c.rates[selectedBoard]
  const totalPrice = pricePerPerson * guests
  const baseTax = Math.round(totalPrice * c.bookingDetails.taxRate)

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [])

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { if (zoomedImg) setZoomedImg(null); else onClose() }
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [zoomedImg, onClose])

  const handleAddToCart = () => {
    if (c.status === 'reserved') return
    if (inCart) { openCart(); return }
    addItem({ id: `${c.id}-${selectedBoard}`, name: `${c.name} · ${BOARD_LABELS[selectedBoard]}`, tag: c.category, category: 'cottage', price: totalPrice, unit: `/ night · ${guests} guest${guests > 1 ? 's' : ''}` })
    toast.success(`${c.name} added to Reservation`)
  }

  const collapsibleSections = [
    {
      id: 'sustainability', label: 'Sustainability & Infrastructure',
      content: (
        <div className="pt-4 space-y-3">
          {Object.entries(c.specs).map(([key, val]) => (
            <div key={key} className="flex justify-between items-start gap-6">
              <p className="text-xs text-white/30 capitalize w-28 flex-shrink-0">{key}</p>
              <p className="text-sm text-white/60 text-right leading-snug">{val}</p>
            </div>
          ))}
        </div>
      ),
    },
    {
      id: 'booking', label: 'Booking Policies',
      content: (
        <div className="pt-4 space-y-0">
          {[
            ['Minimum stay', `${c.bookingDetails.minNights} nights`],
            ['Cleaning fee', c.bookingDetails.cleaningFee === 0 ? 'Included' : `KES ${c.bookingDetails.cleaningFee.toLocaleString()}`],
            ['VAT (16%)', 'Calculated at checkout'],
            ['Max occupancy', `${c.bookingDetails.maxOccupancy} guests`],
            ['Pricing model', 'Per person, per night'],
            ['Cancellation', c.bookingDetails.cancellationPolicy],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between items-start gap-4 py-3 border-b border-white/[0.04] last:border-0">
              <p className="text-xs text-white/30">{k}</p>
              <p className="text-sm text-white/55 text-right leading-snug max-w-[200px]">{v}</p>
            </div>
          ))}
        </div>
      ),
    },
  ]

  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[9999] flex items-center justify-center p-0 md:p-4 lg:p-6" style={{ isolation: 'isolate' }}>
        <div className="absolute inset-0 bg-black/92" style={{ pointerEvents: 'auto' }} onClick={onClose} />
        <motion.div
          initial={{ scale: 0.97, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.97, opacity: 0, y: 16 }}
          transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-[1520px] h-[100dvh] md:h-[92vh] bg-[#060606] flex flex-col lg:flex-row overflow-hidden md:rounded-2xl"
          style={{ zIndex: 1 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.025),transparent_55%)] pointer-events-none" style={{ zIndex: 0 }} />
          <button onClick={onClose} className="absolute top-0 right-0 z-20 px-5 py-3.5 text-[10px] tracking-[0.2em] uppercase text-white/30 hover:text-white/70 border-l border-b border-white/[0.06] hover:border-white/10 bg-transparent hover:bg-white/[0.03] transition-all duration-200 md:rounded-tr-2xl" style={{ pointerEvents: 'auto' }}>
            ✕ close
          </button>

          {/* LEFT COLUMN */}
          <div className="modal-scroll w-full lg:w-[62%] flex-shrink-0 flex flex-col overflow-y-auto min-h-0" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,168,75,0.18) transparent', position: 'relative', zIndex: 1 }}>
            <div className="w-full flex-shrink-0" style={{ height: 'clamp(260px, 42vh, 420px)', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '2px', background: '#111' }}>
              {c.images.map((img, i) => (
                <GalleryImage key={i} src={img} alt={`${c.name} ${i + 1}`} index={i} onClick={() => setZoomedImg(img)} />
              ))}
            </div>
            <div className="px-6 sm:px-8 md:px-12 lg:px-14 pt-10 pb-16 flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-5 h-px bg-[var(--gold)]/60" />
                <span className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--gold)]/50">
                  {c.category}{c.isPenthouse ? ' · Penthouse' : ` · ${c.floor}`}
                </span>
              </div>
              <h2 className="font-display text-[clamp(2rem,5vw,4rem)] font-light leading-[0.88] uppercase tracking-tight text-white mb-2">{c.name}</h2>
              <p className={`text-xs mb-8 ${c.status === 'available' ? 'text-[var(--neon)]' : 'text-white/25'}`}>{c.status === 'available' ? '● Available' : '○ Currently Reserved'}</p>
              <blockquote className="relative py-6 pl-5 border-l-2 border-[var(--gold)]/35 mb-8">
                <p className="font-body text-[clamp(1rem,2vw,1.2rem)] font-light italic leading-[1.7] text-white/80 max-w-[640px]">"{c.storyLine}"</p>
              </blockquote>
              <p className="font-body text-[15px] text-white/55 leading-[1.85] mb-10 max-w-[640px]">{c.description}</p>
              <div className="grid grid-cols-3 gap-3 mb-10 p-5 bg-white/[0.02] border border-white/[0.05] rounded-xl">
                {[{ label: 'Guests', value: `${c.guests}` }, { label: 'Bedrooms', value: `${c.bedrooms}` }, { label: 'Size', value: `${c.size}m²` }].map(({ label, value }) => (
                  <div key={label} className="text-center">
                    <p className="font-display text-3xl font-light text-[var(--gold)]">{value}</p>
                    <p className="text-[9px] uppercase tracking-wider text-white/25 mt-1.5">{label}</p>
                  </div>
                ))}
              </div>
              <div className="mb-10">
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-4">Amenities & Inclusions</p>
                <div className="flex flex-wrap gap-2">
                  {c.amenities.map((a, i) => (
                    <span key={i} className="px-3 py-1.5 text-xs text-white/50 bg-white/[0.035] rounded-full border border-white/[0.04] hover:text-white/70 transition-colors">{a}</span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                {collapsibleSections.map((section) => (
                  <div key={section.id} className="accordion-item border border-white/[0.05]">
                    <button onClick={() => setActiveAccordion(activeAccordion === section.id ? null : section.id)} className="w-full flex justify-between items-center px-5 py-4 text-left hover:bg-white/[0.02] transition-colors" style={{ pointerEvents: 'auto' }}>
                      <span className="text-[13px] text-white/40">{section.label}</span>
                      <span className="text-white/20 text-base ml-4 flex-shrink-0 font-light">{activeAccordion === section.id ? '−' : '+'}</span>
                    </button>
                    <AnimatePresence>
                      {activeAccordion === section.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden px-5 pb-5">
                          {section.content}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="modal-scroll w-full lg:w-[38%] flex-shrink-0 flex flex-col bg-[#080808]/95 border-l border-white/[0.05] overflow-y-auto" style={{ scrollbarWidth: 'thin', scrollbarColor: 'rgba(200,168,75,0.18) transparent', position: 'relative', zIndex: 1, pointerEvents: 'auto' }}>
            <div className="px-6 sm:px-8 md:px-10 pt-12 pb-8 flex flex-col gap-8 flex-1">
              <div>
                <p className="text-[9px] uppercase tracking-[0.35em] text-white/25 mb-1">{BOARD_LABELS[selectedBoard]} · per guest / night</p>
                <div className="flex items-baseline gap-3 mb-1">
                  <p className="font-display text-3xl font-light text-[var(--gold)]">KES {pricePerPerson.toLocaleString()}</p>
                </div>
                <p className="text-[10px] text-white/20">VAT not included · taxes calculated at checkout</p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-4">Guests</p>
                <div className="flex items-center gap-5">
                  <button onClick={() => onGuestsChange(Math.max(1, guests - 1))} className="w-10 h-10 border border-white/[0.08] hover:border-[var(--gold)]/40 text-white/40 hover:text-[var(--gold)] transition-all text-xl leading-none rounded-lg" style={{ pointerEvents: 'auto' }}>−</button>
                  <span className="font-display text-3xl font-light text-[var(--gold)] w-8 text-center tabular-nums">{guests}</span>
                  <button onClick={() => onGuestsChange(Math.min(c.bookingDetails.maxOccupancy, guests + 1))} className="w-10 h-10 border border-white/[0.08] hover:border-[var(--gold)]/40 text-white/40 hover:text-[var(--gold)] transition-all text-xl leading-none rounded-lg" style={{ pointerEvents: 'auto' }}>+</button>
                  <span className="text-xs text-white/20">max {c.bookingDetails.maxOccupancy}</span>
                </div>
                <p className="text-[10px] text-white/25 mt-3 leading-relaxed">
                  KES {pricePerPerson.toLocaleString()} × {guests} guest{guests > 1 ? 's' : ''}
                  <span className="text-white/15 mx-2">·</span>
                  <span className="text-white/40">KES {totalPrice.toLocaleString()} / night</span>
                </p>
              </div>
              <div>
                <p className="text-[9px] uppercase tracking-[0.3em] text-white/25 mb-4">Meal Plan</p>
                <div className="space-y-2">
                  {BOARD_OPTIONS.map((opt) => {
                    const isSelected = selectedBoard === opt.value
                    return (
                      <button key={opt.value} onClick={() => onBoardChange(opt.value)} style={{ pointerEvents: 'auto' }}
                        className={`w-full flex justify-between items-center px-4 py-3 text-left transition-all duration-200 border rounded-xl ${isSelected ? 'border-[var(--gold)]/30 bg-[var(--gold)]/[0.06] text-[var(--gold)]' : 'border-white/[0.06] bg-white/[0.01] text-white/35 hover:border-white/10 hover:text-white/55 hover:bg-white/[0.025]'}`}
                      >
                        <div>
                          <span className="text-[13px] font-medium block">{opt.label}</span>
                          {isSelected && <span className="text-[10px] text-[var(--gold)]/50 mt-0.5 block font-normal">{BOARD_INCLUDES[opt.value]}</span>}
                        </div>
                        <span className="text-[13px] font-medium ml-4 flex-shrink-0 tabular-nums">{c.rates[opt.value].toLocaleString()}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
              <div className="price-summary-card space-y-2.5">
                <div className="flex justify-between text-xs text-white/35">
                  <span>KES {pricePerPerson.toLocaleString()} × {guests} guest{guests > 1 ? 's' : ''}</span>
                  <span className="tabular-nums text-white/50">KES {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-xs text-white/25">
                  <span>VAT (16%)</span>
                  <span className="tabular-nums">KES {baseTax.toLocaleString()}</span>
                </div>
                <div className="h-px bg-white/[0.06] my-1" />
                <div className="flex justify-between items-baseline">
                  <span className="text-[9px] uppercase tracking-wider text-white/25">Total / night</span>
                  <span className="font-display text-lg font-light text-[var(--gold)] tabular-nums">KES {(totalPrice + baseTax).toLocaleString()}</span>
                </div>
                <p className="text-[9px] text-white/15 pt-1">Cleaning fee (KES {c.bookingDetails.cleaningFee.toLocaleString()}) added at checkout</p>
              </div>
              <div className="space-y-3">
                <button onClick={handleAddToCart} disabled={c.status === 'reserved'} style={{ pointerEvents: 'auto' }}
                  className={`w-full h-12 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 ${inCart ? 'bg-[var(--gold)] text-black' : c.status === 'reserved' ? 'bg-white/[0.04] border border-white/[0.06] text-white/20 pointer-events-none' : 'bg-white text-black hover:bg-[#f0ece4] active:scale-[0.98]'}`}
                >
                  {c.status === 'reserved' ? 'Currently Reserved' : inCart ? '✓ View Reservation' : 'Reserve Stay'}
                </button>
                <Link href="/contact" className="block text-center w-full h-12 flex items-center justify-center text-xs border border-white/[0.06] hover:border-white/10 hover:bg-white/[0.025] transition-all text-white/30 hover:text-white/50 rounded-xl">
                  Speak with our concierge
                </Link>
                {inCart && (
                  <button onClick={openCart} style={{ pointerEvents: 'auto' }} className="w-full text-center text-[10px] tracking-[0.2em] uppercase text-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors py-2">
                    View Reservation →
                  </button>
                )}
              </div>
              <p className="text-[9px] text-white/20 text-center leading-relaxed">
                Minimum {c.bookingDetails.minNights} nights · {c.bookingDetails.cancellationPolicy.includes('Free cancellation') ? 'Free cancellation policy applies' : c.bookingDetails.cancellationPolicy}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {zoomedImg && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setZoomedImg(null)} className="fixed inset-0 z-[99999] bg-black/96 flex items-center justify-center p-6 cursor-zoom-out" style={{ isolation: 'isolate' }}>
            <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }} className="relative w-full max-w-7xl h-[90vh]">
              <Image src={zoomedImg} alt="Expanded view" fill sizes="100vw" className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

// ── STAY CARD ──────────────────────────────────────────────────────────
function StayCard({ c, index, onOpenSpecs, featured = false, selectedBoard, guests }: { c: Stay; index: number; onOpenSpecs: (c: Stay) => void; featured?: boolean; selectedBoard: BoardOption; guests: number }) {
  const { items, addItem, openCart } = useCartStore()
  const inCart = items.some((i) => i.id === `${c.id}-${selectedBoard}`)
  const pricePerPerson = c.rates[selectedBoard]
  const totalPrice = pricePerPerson * guests

  const handleAddToCart = () => {
    if (c.status === 'reserved') return
    if (inCart) { toast('Already in your Reservation', { icon: '✦' }); openCart(); return }
    addItem({ id: `${c.id}-${selectedBoard}`, name: `${c.name} · ${BOARD_LABELS[selectedBoard]}`, tag: c.category, category: 'cottage', price: totalPrice, unit: `/ night · ${guests} guest${guests > 1 ? 's' : ''}` })
    toast.success(`${c.name} added to Reservation`)
  }

  if (featured) {
    return (
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="col-span-full stay-card-shadow group relative overflow-hidden flex flex-col md:flex-row bg-[#0a0a0a] border border-white/5 hover:border-[var(--gold)]/30 transition-all duration-700 rounded-2xl">
        <div className="relative md:w-[60%] h-72 md:h-[500px] overflow-hidden cursor-pointer flex-shrink-0 rounded-t-2xl md:rounded-t-none md:rounded-l-2xl" onClick={() => onOpenSpecs(c)}>
          <Image src={c.images[0]} alt={c.name} fill priority sizes="(max-width: 768px) 100vw, 60vw" className="object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#0a0a0a] opacity-40 pointer-events-none" />
          <div className="absolute top-6 left-6 flex gap-2 z-10 pointer-events-none">
            <span className="log-badge backdrop-blur-md bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)]">{c.category}</span>
            {c.isPenthouse && <span className="log-badge backdrop-blur-md bg-black/40 border-white/10 text-white/50">★ Penthouse</span>}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-between p-8 md:p-16">
          <div>
            <p className="font-mono text-[9px] tracking-[0.4em] uppercase text-[var(--gold)]/60 mb-4">Ubuntu {c.category} · {c.floor}</p>
            <h3 className="font-display text-4xl md:text-5xl text-white uppercase tracking-tight leading-[0.9] mb-6">{c.name}</h3>
            <p className="story-quote font-body text-base text-white/40 italic leading-relaxed mb-8 pl-1">"{c.storyLine}"</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {[{ label: 'Guests', value: `${c.guests}` }, { label: 'Bedrooms', value: `${c.bedrooms}` }, { label: 'Size', value: `${c.size}m²` }, { label: 'Min stay', value: `${c.bookingDetails.minNights}n` }].map(({ label, value }) => (
                <div key={label} className="border border-white/5 rounded-lg p-3 text-center">
                  <p className="font-display text-xl text-[var(--gold)]">{value}</p>
                  <p className="text-[8px] uppercase tracking-widest text-white/25 mt-1">{label}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {c.amenities.slice(0, 4).map((a, i) => (
                <span key={i} className="px-3 py-1 border border-white/10 rounded-full text-[9px] uppercase tracking-wider text-white/40">{a}</span>
              ))}
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">{BOARD_LABELS[selectedBoard]} · per guest / night</p>
              <p className="font-display text-3xl text-[var(--gold)]">KES {pricePerPerson.toLocaleString()}</p>
              {guests > 1 && <p className="text-[10px] text-white/30 mt-1">KES {totalPrice.toLocaleString()} for {guests} guests / night</p>}
            </div>
            <div className="flex gap-3 flex-wrap">
              <button onClick={handleAddToCart} disabled={c.status === 'reserved'}
                className={`font-body text-[10px] uppercase tracking-[0.2em] py-4 px-8 border rounded-xl transition-all duration-300 ${inCart ? 'bg-[var(--gold)] border-[var(--gold)] text-black' : 'border-[var(--gold)]/40 text-[var(--gold)] hover:bg-[var(--gold)] hover:text-black'} ${c.status === 'reserved' ? 'opacity-30 pointer-events-none' : ''}`}
              >
                {inCart ? '✓ Reserved' : 'Reserve Stay'}
              </button>
              <button onClick={() => onOpenSpecs(c)} className="font-body text-[10px] uppercase tracking-[0.2em] py-4 px-6 border rounded-xl border-white/10 hover:border-[var(--gold)]/30 text-white/40 hover:text-white/70 transition-all">
                Explore →
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: index * 0.08 }} className="stay-card-shadow group relative overflow-hidden flex flex-col bg-[#0a0a0a] border border-white/5 hover:border-[var(--gold)]/20 transition-all duration-700 rounded-2xl">
      <div className="relative h-64 sm:h-72 w-full overflow-hidden cursor-pointer rounded-t-2xl" onClick={() => onOpenSpecs(c)}>
        <Image src={c.images[0]} alt={c.name} fill loading="lazy" sizes="(max-width:768px) 100vw, 33vw" className="object-cover grayscale-[0.35] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-4 left-4 flex gap-2 z-10 flex-wrap pointer-events-none">
          <span className="log-badge backdrop-blur-md border-[var(--gold)]/30 bg-black/50" style={{ color: c.accent, borderColor: `${c.accent}44` }}>{c.category}</span>
          {c.isPenthouse && <span className="log-badge backdrop-blur-md bg-[var(--gold)]/10 border-[var(--gold)]/30 text-[var(--gold)]">Penthouse</span>}
          <span className="log-badge backdrop-blur-md bg-black/40 border-white/10 text-white/50">{c.status === 'available' ? '● Available' : '○ Reserved'}</span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between z-10 pointer-events-none gap-2">
          {[{ label: 'Floor', value: c.floor }, { label: 'Guests', value: `${c.guests} Max` }, { label: 'Min Stay', value: `${c.bookingDetails.minNights}n` }].map(({ label, value }) => (
            <div key={label} className="backdrop-blur-md bg-black/40 border border-white/10 rounded-lg px-2 sm:px-3 py-2 flex-1 text-center">
              <p className="text-[7px] sm:text-[8px] uppercase tracking-[0.3em] text-white/30">{label}</p>
              <p className="font-mono text-[10px] sm:text-xs text-[var(--gold)] truncate">{value}</p>
            </div>
          ))}
        </div>
        <AnimatePresence>
          {inCart && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/50 flex items-center justify-center z-20 pointer-events-none">
              <span className="font-body text-[10px] tracking-[0.25em] uppercase px-4 py-2 border border-[var(--gold)] rounded-full bg-[var(--gold)]/10 text-[var(--gold)]">✓ In Reservation</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="p-7 sm:p-9 flex flex-col flex-1">
        <div className="flex justify-between items-start gap-4 mb-1">
          <h3 className="font-display text-xl sm:text-2xl text-white uppercase tracking-tight leading-none">{c.name}</h3>
          {c.isPenthouse && <span className="text-[8px] font-mono text-[var(--gold)] border border-[var(--gold)]/30 rounded-md px-2 py-1 flex-shrink-0">PENTHOUSE</span>}
        </div>
        <div className="flex items-baseline gap-2 mb-4">
          <span className="font-display text-xl text-[var(--gold)]">KES {pricePerPerson.toLocaleString()}</span>
          <span className="text-[9px] tracking-[0.2em] uppercase text-white/30">/guest · {BOARD_LABELS[selectedBoard]}</span>
        </div>
        <p className="story-quote font-body text-xs text-white/40 italic leading-relaxed mb-6 line-clamp-2 pl-1">"{c.storyLine}"</p>
        <div className="grid grid-cols-2 gap-2 mb-6">
          {c.amenities.slice(0, 4).map((feat, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[9px] text-white/40 uppercase tracking-widest">
              <span className="text-[var(--gold)] text-[10px] flex-shrink-0">◈</span>
              <span className="truncate">{feat}</span>
            </div>
          ))}
        </div>
        <div className="mt-auto flex flex-col gap-3">
          {guests > 1 && (
            <div className="text-center text-[9px] text-white/30 py-2 border border-white/5 rounded-lg font-mono">
              KES {totalPrice.toLocaleString()} total for {guests} guests / night
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={handleAddToCart} disabled={c.status === 'reserved'}
              className={`flex-1 font-body text-[10px] uppercase tracking-[0.2em] py-4 border rounded-xl transition-all duration-300 ${inCart ? 'bg-[var(--gold)] border-[var(--gold)] text-black' : 'border-white/10 text-white/60 hover:border-[var(--gold)] hover:text-[var(--gold)]'} ${c.status === 'reserved' ? 'opacity-30 pointer-events-none' : ''}`}
            >
              {inCart ? '✓ In Reservation' : '+ Reserve Stay'}
            </button>
            <button onClick={() => toast(`Moxie is curating ${c.name}...`, { icon: '✦' })} className="px-4 sm:px-5 border border-white/10 rounded-xl hover:border-[var(--neon)] text-white/30 hover:text-[var(--neon)] transition-all">
              <span className="font-mono text-xs">M.</span>
            </button>
          </div>
          <button onClick={() => onOpenSpecs(c)} style={{ pointerEvents: c.status === 'available' ? 'auto' : 'none' }}
            className={`relative z-10 text-center text-[9px] uppercase tracking-[0.3em] py-3 border rounded-lg border-white/5 hover:border-[var(--gold)]/30 hover:text-[var(--gold)] transition-all ${c.status === 'reserved' ? 'opacity-30 text-white/20' : 'text-white/30'}`}
          >
            {c.status === 'available' ? 'Explore Room →' : 'Currently Reserved'}
          </button>
          {inCart && (
            <button onClick={openCart} className="font-body text-[9px] tracking-[0.2em] uppercase text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors py-2">
              View Reservation →
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}

// ── PENTHOUSE SHOWCASE ─────────────────────────────────────────────────
function PenthouseShowcase({ stay, onOpen }: { stay: Stay; onOpen: () => void }) {
  return (
    <motion.section initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="relative py-24 px-4 sm:px-6 md:px-10 overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 pointer-events-none">
        <Image src={stay.images[0]} alt={stay.name} fill sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]" />
      </div>
      <div className="relative max-w-8xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
        <div>
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-[1px] bg-[var(--gold)]" />
            <span className="text-[var(--gold)] font-mono text-[9px] tracking-[0.5em] uppercase">The Penthouse Experience · {stay.floor}</span>
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-light mb-6 leading-[0.85] uppercase">{stay.name}</h2>
          <p className="story-quote font-body text-lg text-white/50 italic leading-relaxed mb-8 pl-1">"{stay.storyLine}"</p>
          <div className="flex flex-wrap gap-2 mb-10">
            {stay.amenities.slice(0, 6).map((a, i) => (
              <span key={i} className="px-3 py-1 border border-[var(--gold)]/20 rounded-full text-[9px] uppercase tracking-wider text-white/40">{a}</span>
            ))}
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
            <div>
              <p className="text-[9px] text-white/25 uppercase tracking-widest mb-1">From · per guest / night</p>
              <p className="font-display text-3xl text-[var(--gold)]">KES {stay.rates.bedOnly.toLocaleString()}</p>
              <p className="text-[8px] text-white/20 mt-1">Bed Only · per night</p>
            </div>
            <button onClick={onOpen} className="btn-gold !px-10 !py-4 !text-[10px] !rounded-2xl">View Penthouse →</button>
          </div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '12px', height: 'clamp(280px, 40vw, 420px)' }}>
          {stay.images.map((img, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} onClick={onOpen} className="relative overflow-hidden cursor-pointer border border-white/5 rounded-2xl" style={i === 0 ? { gridRow: '1 / 3' } : {}}>
              <Image src={img} alt={`${stay.name} ${i + 1}`} fill loading="lazy" sizes="(max-width: 768px) 50vw, 25vw" className="object-cover grayscale-[0.3] hover:grayscale-0 transition-all duration-700" />
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
  const [guestFilter] = useState(0)

  const [globalBoard, setGlobalBoard] = useState<BoardOption>('bedBreakfast')
  const [globalGuests, setGlobalGuests] = useState(1)
  const [modalGuests, setModalGuests] = useState(1)

  const cottagesInCart = items.filter((i) => i.category === 'cottage').length

  const filteredStays = useMemo(() => {
    let result = stays.filter((s) => {
      if (activeFilter === 'Penthouse') return s.isPenthouse
      if (activeFilter === 'Rooftop') return s.floor === 'Rooftop'
      const categoryMatch = activeFilter === 'All' || s.category === activeFilter
      const guestMatch = guestFilter === 0 || s.guests >= guestFilter
      return categoryMatch && guestMatch
    })
    switch (activeSort) {
      case 'price-asc': result = [...result].sort((a, b) => a.rates[globalBoard] - b.rates[globalBoard]); break
      case 'price-desc': result = [...result].sort((a, b) => b.rates[globalBoard] - a.rates[globalBoard]); break
      case 'guests': result = [...result].sort((a, b) => b.guests - a.guests); break
      default: result = [...result].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0))
    }
    return result
  }, [activeFilter, activeSort, guestFilter, globalBoard])

  const featuredPenthouse = stays.find((s) => s.isPenthouse && s.floor === 'Rooftop')

  const handleOpenStay = (stay: Stay) => { setModalGuests(globalGuests); setSelectedStay(stay) }

  return (
    <main className="bg-[#0a0a0a] min-h-screen text-white overflow-hidden">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Nav />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center pt-24 md:pt-28 pb-16 px-4 sm:px-6">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="/images/Cottages-front.jpeg"
            alt="Ubuntu Kreative Village"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover scale-[1.03] opacity-65 brightness-[0.82] contrast-[1.05] saturate-[1.08] transition-transform duration-[8000ms] ease-out"
          />
          <div className="absolute inset-0 bg-black/30 z-10 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-gradient-to-b from-black/25 via-transparent to-black/70 pointer-events-none" />
          <div className="absolute inset-0 z-20 bg-[radial-gradient(circle_at_center,rgba(212,168,83,0.08),transparent_65%)] pointer-events-none" />
          <div className="absolute inset-0 z-20 shadow-[inset_0_0_160px_rgba(0,0,0,0.7)] pointer-events-none" />
        </div>

        <div className="relative z-10 text-center max-w-5xl w-full">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mb-6 inline-block">
            <span className="log-badge border-[var(--gold)]/30 text-[var(--gold)] bg-[var(--gold)]/5 px-6 py-2 uppercase tracking-widest shadow-[0_0_28px_rgba(200,168,75,0.10)]">
              Est. 2024 · The Living Village
            </span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="font-display text-[clamp(2.8rem,10vw,8rem)] leading-[0.85] font-light mb-8">
            Sleep inside
            the <br />
            <span className="hero-word-accent italic">living village</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="font-body text-white/55 max-w-2xl mx-auto text-sm sm:text-base leading-relaxed mb-12">
            Experience lovely off-grid sanctuaries designed for deep rest — powered by the sun, and
            fed by the very land you sleep on. Choose silence. Choose wildness. Choose yourself.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            <a href="#stays" className="btn-gold !px-10 sm:!px-12 !py-4 sm:!py-5 !rounded-2xl w-full sm:w-auto text-center">
              Explore The Residences
            </a>
            <div className="flex items-center gap-4 text-xs font-body tracking-[0.2em] text-white/40">
              <span className="w-6 sm:w-8 h-px bg-white/20" />
              {stays.filter(s => s.status === 'available').length} of {stays.length} Residences Available
              <span className="w-6 sm:w-8 h-px bg-white/20" />
            </div>
          </motion.div>

          {cottagesInCart > 0 && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={openCart}
              className="mt-10 flex items-center gap-3 font-body text-[10px] tracking-[0.15em] uppercase border border-[var(--gold)]/30 bg-[var(--gold)]/10 text-[var(--gold)] px-5 sm:px-6 py-3 hover:bg-[var(--gold)]/20 transition-all mx-auto rounded-2xl shadow-[0_4px_24px_-8px_rgba(200,168,75,0.25)]"
            >
              <span className="w-5 h-5 rounded-full bg-[var(--gold)] text-black flex items-center justify-center text-[10px] font-bold">{cottagesInCart}</span>
              {cottagesInCart === 1 ? '1 stay' : `${cottagesInCart} stays`} in Reservation — view →
            </motion.button>
          )}
        </div>

        {/* Floating cart pill */}
        {cottagesInCart > 0 && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={openCart}
            className="cart-float fixed bottom-24 right-4 sm:right-6 z-40 flex items-center gap-2 bg-[var(--gold)] text-black text-[10px] font-medium tracking-[0.12em] uppercase px-4 py-3 hover:bg-[#E0B96A] transition-all"
          >
            <span className="w-4 h-4 rounded-full bg-black/20 flex items-center justify-center text-[9px] font-bold">{cottagesInCart}</span>
            Reservation
          </motion.button>
        )}
      </section>

      {/* ── STICKY CONFIG BAR ── */}
      <div className="sticky-glass sticky top-[64px] sm:top-[72px] z-30 px-4 sm:px-6 md:px-10 py-3 border-y border-white/5">
        <div className="max-w-8xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-white/30">Arrival</span>
              <input type="date" className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer" onChange={(e) => setStayDates((p) => ({ ...p, checkIn: e.target.value }))} />
            </div>
            <div className="w-px h-7 bg-white/10" />
            <div className="flex flex-col">
              <span className="text-[7px] sm:text-[8px] uppercase tracking-[0.2em] text-white/30">Departure</span>
              <input type="date" className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer" onChange={(e) => setStayDates((p) => ({ ...p, checkOut: e.target.value }))} />
            </div>
            <div className="w-px h-7 bg-white/10 hidden sm:block" />
            <div className="flex-col hidden sm:flex">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">Meal Plan</span>
              <select value={globalBoard} onChange={(e) => setGlobalBoard(e.target.value as BoardOption)} className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer">
                {BOARD_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>)}
              </select>
            </div>
            <div className="w-px h-7 bg-white/10 hidden sm:block" />
            <div className="flex-col hidden sm:flex">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30">Guests</span>
              <select value={globalGuests} onChange={(e) => setGlobalGuests(Number(e.target.value))} className="bg-transparent text-[var(--gold)] font-mono text-xs border-none focus:ring-0 cursor-pointer">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n} className="bg-black text-white">{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
              </select>
            </div>
          </div>
          {cottagesInCart > 0 && (
            <button onClick={openCart} className="btn-neon !py-2 !px-4 !text-[9px] !rounded-xl">View Reservation ({cottagesInCart})</button>
          )}
        </div>
      </div>

      {/* ── PRICING STRIP ── */}
      <div className="px-4 sm:px-6 md:px-10 py-12 sm:py-16 border-b border-white/5 bg-[#0d0d0d]">
        <div className="max-w-8xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5 sm:gap-8 text-center">
            {[
              { label: 'Pokomo Cottages from', value: 'KES 5,000', note: 'Bed Only · per guest / night' },
              { label: 'Farm House Rooms from', value: 'KES 7,500', note: 'Bed Only · per guest / night' },
              { label: 'Penthouses from', value: 'KES 9,000', note: 'Bed Only · per guest / night' },
              { label: 'Full Board option', value: 'KES 14,000', note: 'Penthouse · per guest / night' },
              { label: 'Bed & Breakfast from', value: 'KES 6,500', note: 'Pokomo Cottage · per guest / night' },
            ].map((s, i) => (
              <div key={i} className="flex-1 min-w-0 relative price-col">
                <div className="font-body text-[8px] sm:text-[9px] tracking-widest uppercase text-white/25 mb-2">{s.label}</div>
                <div className="font-display text-xl sm:text-2xl font-light" style={{ color: i % 2 === 0 ? 'var(--neon)' : 'var(--gold)' }}>{s.value}</div>
                <div className="font-body text-[8px] sm:text-[9px] text-white/20 mt-1">{s.note}</div>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <a href="#rates" className="text-[9px] uppercase tracking-[0.3em] text-[var(--gold)]/50 hover:text-[var(--gold)] transition-colors border-b border-[var(--gold)]/20 hover:border-[var(--gold)]/50 pb-0.5">
              View full rates & packages ↓
            </a>
          </div>
        </div>
      </div>

      {/* ── PENTHOUSE SHOWCASE ── */}
      {featuredPenthouse && <PenthouseShowcase stay={featuredPenthouse} onOpen={() => handleOpenStay(featuredPenthouse)} />}

      {/* ── FILTER + SORT BAR ── */}
      <section id="stays" className="pt-16 sm:pt-24 pb-4 px-4 sm:px-6 md:px-10">
        <div className="max-w-8xl mx-auto">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 sm:gap-8 mb-12 sm:mb-16">
            <div className="max-w-xl">
              <span className="text-[var(--gold)] text-[10px] tracking-[0.4em] uppercase mb-4 block opacity-60">Our Residences</span>
              <h2 className="font-display text-4xl sm:text-5xl font-light">CHOOSE YOUR <span className="italic">SANCTUARY</span></h2>
              <p className="font-body text-sm text-white/30 mt-4 leading-relaxed">{filteredStays.length} residence{filteredStays.length !== 1 ? 's' : ''} · all solar-powered · farm breakfast available</p>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[8px] uppercase tracking-widest text-white/25 mr-2">Sort</span>
              {SORT_OPTIONS.map((opt) => (
                <button key={opt.value} onClick={() => setActiveSort(opt.value)}
                  className={`px-3 sm:px-4 py-2 text-[9px] uppercase tracking-wider border rounded-lg transition-all ${activeSort === opt.value ? 'border-[var(--gold)]/50 text-[var(--gold)] bg-[var(--gold)]/5' : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-2 flex-wrap mb-4">
            {FILTER_TABS.map((tab) => {
              const count = tab.value === 'All' ? stays.length : tab.value === 'Penthouse' ? stays.filter(s => s.isPenthouse).length : tab.value === 'Rooftop' ? stays.filter(s => s.floor === 'Rooftop').length : stays.filter(s => s.category === tab.value).length
              return (
                <button key={tab.value} onClick={() => setActiveFilter(tab.value)}
                  className={`px-4 sm:px-6 py-2.5 sm:py-3 text-[9px] sm:text-[10px] uppercase tracking-[0.2em] border rounded-xl transition-all duration-300 ${activeFilter === tab.value ? 'border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/5' : 'border-white/10 text-white/30 hover:border-white/20 hover:text-white/50'}`}
                >
                  {tab.label}<span className="ml-1 sm:ml-2 font-mono text-[8px] opacity-50">({count})</span>
                </button>
              )
            })}
          </div>

          {/* Mobile meal plan / guest controls */}
          <div className="flex sm:hidden gap-4 mb-6 flex-wrap">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Meal Plan</span>
              <select value={globalBoard} onChange={(e) => setGlobalBoard(e.target.value as BoardOption)} className="bg-black border border-white/10 rounded-lg text-[var(--gold)] font-mono text-xs px-3 py-2 focus:ring-0">
                {BOARD_OPTIONS.map(opt => <option key={opt.value} value={opt.value} className="bg-black text-white">{opt.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-[0.2em] text-white/30 mb-1">Guests</span>
              <select value={globalGuests} onChange={(e) => setGlobalGuests(Number(e.target.value))} className="bg-black border border-white/10 rounded-lg text-[var(--gold)] font-mono text-xs px-3 py-2 focus:ring-0">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n} className="bg-black text-white">{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
              </select>
            </div>
          </div>

          <div className="mb-8 sm:mb-12 p-3 sm:p-4 border border-white/5 rounded-xl bg-white/[0.01] flex flex-wrap items-center gap-3 sm:gap-6">
            <p className="text-[9px] uppercase tracking-widest text-white/25">Showing prices for:</p>
            <span className="text-[var(--gold)] font-mono text-xs">{BOARD_LABELS[globalBoard]}</span>
            <span className="text-white/30 text-[10px]">·</span>
            <span className="text-white/50 text-xs font-mono">{globalGuests} guest{globalGuests > 1 ? 's' : ''}</span>
            <span className="text-white/30 text-[10px]">·</span>
            <span className="text-white/30 text-[9px]">per guest · per night</span>
          </div>
        </div>
      </section>

      {/* ── GRID ── */}
      <section className="pb-24 sm:pb-32 px-4 sm:px-6 md:px-10">
        <div className="max-w-8xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div key={activeFilter + activeSort + globalBoard} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {filteredStays.map((c, index) => (
                <StayCard key={c.id} c={c} index={index} onOpenSpecs={handleOpenStay} featured={c.featured && index === 0} selectedBoard={globalBoard} guests={globalGuests} />
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredStays.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-32 text-center">
              <p className="font-display text-4xl text-white/20 mb-4">No residences found</p>
              <button onClick={() => setActiveFilter('All')} className="text-[10px] uppercase tracking-widest text-[var(--gold)]/60 hover:text-[var(--gold)] transition-colors">Clear filters →</button>
            </motion.div>
          )}

          {cottagesInCart > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} className="mt-16 sm:mt-24 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 sm:p-12 border border-[var(--gold)]/20 bg-[var(--gold)]/5 rounded-2xl">
              <div>
                <p className="font-display text-2xl sm:text-3xl mb-2 text-white font-light">Ready to confirm your stay?</p>
                <p className="font-body text-sm text-white/30 leading-relaxed">
                  {cottagesInCart} {cottagesInCart === 1 ? 'residence' : 'residences'} selected — complete your reservation and we will be in touch within 2 hours.
                </p>
              </div>
              <button onClick={openCart} className="btn-gold !px-10 sm:!px-12 !py-4 !text-xs !rounded-2xl flex-shrink-0 w-full sm:w-auto text-center">
                Review Reservation →
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ── RATES & PACKAGES ── */}
      <RatesSection />

      {/* ── MODAL ── */}
      <AnimatePresence>
        {selectedStay && (
          <StayModal
            c={selectedStay}
            onClose={() => setSelectedStay(null)}
            selectedBoard={globalBoard}
            onBoardChange={setGlobalBoard}
            guests={modalGuests}
            onGuestsChange={setModalGuests}
          />
        )}
      </AnimatePresence>

      <Footer />
      <MoxieChat />
    </main>
  )
}