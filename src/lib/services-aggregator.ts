// ─────────────────────────────────────────────────────────────
// src/lib/services-aggregator.ts
// 
// Unified service aggregator for the booking shell / contact page
// Imports from actual page data sources and converts to unified format
// NO DUPLICATE DATA — all changes on main pages auto-sync to contact
// ─────────────────────────────────────────────────────────────

import { stays } from '@/app/cottages/_data/stays-data'
import { RITUALS } from '@/app/spa/_data/spa-data'
import { DISHES, CATEGORIES as RESTAURANT_CATEGORIES } from '@/app/restaurant/_data/menu-data'
import { EXPERIENCE_ITEMS } from '@/app/farm/_data/farm-data'

export type ServiceCategory =
  | 'accommodation'
  | 'dining'
  | 'spa'
  | 'farm'
  | 'events'
  | 'experiences'

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
  mealPlan?: 'bedOnly' | 'bedBreakfast' | 'halfBoard' | 'fullBoard'
}

export const SERVICE_CATEGORIES: {
  id: ServiceCategory; label: string; icon: string; color: string
}[] = [
  { id: 'accommodation', label: 'Stays',       icon: '⌂', color: 'var(--gold)' },
  { id: 'dining',       label: 'Dining',      icon: '🍽', color: '#C17D5C' },
  { id: 'spa',          label: 'Spa',         icon: '✦', color: '#F0A8B8' },
  { id: 'farm',         label: 'Farm',        icon: '🌾', color: '#7AB55C' },
  { id: 'events',       label: 'Events',      icon: '✨', color: '#E8A8D8' },
  { id: 'experiences',  label: 'Experiences', icon: '🗺', color: '#5DA5DA' },
]

// ── Convert Stays → UKVService ────────────────────────────
function convertStayToService(stay: typeof stays[0]): UKVService {
  const basePrice = stay.rates.bedBreakfast // Default to B&B rate
  const isPenthouse = stay.isPenthouse
  
  return {
    id: stay.id,
    category: 'accommodation',
    name: stay.name,
    tagline: stay.storyLine,
    description: stay.description,
    price: basePrice,
    priceNote: `from KES ${basePrice.toLocaleString()} / person / night (Bed & Breakfast)`,
    image: stay.images[0],
    tag: stay.category,
    unit: '/ person / night',
    requiresDate: true,
    requiresGuests: true,
    badge: isPenthouse ? 'Luxury' : stay.featured ? 'Featured' : undefined,
    color: 'var(--gold)',
    accent: 'rgba(200,168,75,0.15)',
    mealPlan: 'bedBreakfast',
  }
}

// ── Convert Rituals → UKVService (Spa) ────────────────────
function convertRitualToService(ritual: typeof RITUALS[0]): UKVService {
  return {
    id: ritual.id,
    category: 'spa',
    name: ritual.name,
    tagline: ritual.description.substring(0, 80) + '...',
    description: ritual.description,
    price: ritual.price,
    priceNote: `KES ${ritual.price.toLocaleString()}`,
    duration: ritual.duration,
    image: ritual.image,
    tag: ritual.categoryTag,
    unit: '/ person',
    requiresDate: true,
    requiresGuests: false,
    badge: ritual.status === 'Signature' ? 'Signature' : undefined,
    color: '#F0A8B8',
    accent: 'rgba(240,168,184,0.15)',
  }
}

// ── Convert Dishes → UKVService (Restaurant) ──────────────
function convertDishToService(dish: typeof DISHES[0]): UKVService {
  const categoryLabel = RESTAURANT_CATEGORIES.find(c => c.id === dish.category)?.label || 'Main Course'
  
  return {
    id: dish.id,
    category: 'dining',
    name: dish.name,
    tagline: dish.description.substring(0, 80) + '...',
    description: dish.description,
    price: dish.price,
    priceNote: `KES ${dish.price.toLocaleString()}`,
    duration: dish.prepTime ? `${dish.prepTime} min` : '20-30 min',
    image: dish.image,
    tag: categoryLabel,
    unit: '/ plate',
    requiresDate: false,
    requiresGuests: false,
    badge: dish.signature ? 'Signature' : dish.chefChoice ? 'Chef\'s Choice' : undefined,
    color: '#C17D5C',
    accent: 'rgba(193,125,92,0.15)',
  }
}

// ── Convert Farm Experiences → UKVService ─────────────────
function convertExperienceToService(experience: typeof EXPERIENCE_ITEMS[0]): UKVService {
  return {
    id: experience.id,
    category: 'farm',
    name: experience.name,
    tagline: experience.storyLine.substring(0, 80),
    description: experience.description,
    price: experience.price,
    priceNote: `KES ${experience.price.toLocaleString()}`,
    duration: experience.duration,
    image: experience.image,
    tag: experience.category,
    unit: '/ person',
    requiresDate: true,
    requiresGuests: false,
    badge: experience.badge,
    color: '#7AB55C',
    accent: 'rgba(122,181,92,0.15)',
  }
}

// ── Aggregate all services ────────────────────────────────
function aggregateAllServices(): UKVService[] {
  const allServices: UKVService[] = []

  // Add accommodation (stays)
  if (stays && Array.isArray(stays)) {
    allServices.push(...stays.map(convertStayToService))
  }

  // Add spa services (rituals)
  if (RITUALS && Array.isArray(RITUALS)) {
    allServices.push(...RITUALS.map(convertRitualToService))
  }

  // Add restaurant (dishes)
  if (DISHES && Array.isArray(DISHES)) {
    allServices.push(...DISHES.map(convertDishToService))
  }

  // Add farm experiences
  if (EXPERIENCE_ITEMS && Array.isArray(EXPERIENCE_ITEMS)) {
    allServices.push(...EXPERIENCE_ITEMS.map(convertExperienceToService))
  }

  return allServices
}

// ── Export unified services ───────────────────────────────
export const UKV_SERVICES = aggregateAllServices()

// ── Export constants for backward compatibility ──────────
export const MPESA_PAYBILL = '880100'
export const MPESA_ACCOUNT = '101497'
