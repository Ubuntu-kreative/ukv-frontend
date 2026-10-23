import { DISHES } from '@/app/restaurant/_data/menu-data'
import { RITUALS } from '@/app/spa/_data/spa-data'
import { stays } from '@/app/cottages/_data/stays-data'
import { EXPERIENCE_ITEMS, TAB_DATA } from '@/app/farm/_data/farm-data'
import { EVENTS, EVENT_TYPES } from '@/app/events/eventsData'
import {
  CALENDAR_EVENTS,
  DINING,
  EVENT_PACKAGES,
  FARM_ANIMALS,
  FARM_HARVEST,
  FARM_WALKS,
  FARM_WORKSHOPS,
  PUBLIC_EVENTS,
  SPA_TREATMENTS,
} from '@/lib/data'
import { ALL_MENU_ITEMS } from '@/lib/moxie/menu'

const SERVICE_CHARGE_RATE = 0.10
const VAT_RATE = 0.16
const BOARD_PLANS = ['bedOnly', 'bedBreakfast', 'halfBoard', 'fullBoard'] as const

interface CartLine {
  id?: unknown
  price?: unknown
  resourceId?: unknown
  boardPlan?: unknown
  name?: unknown
  category?: unknown
  qty?: unknown
  quantity?: unknown
  guests?: unknown
}

interface PriceableItem {
  id: string
  name: string
  price: number
  unit: string
}

export interface BookingPrice {
  totalAmount: number
  ratePerNight: number
  resourceKey: string
}

const serviceCatalog: PriceableItem[] = [
  ...EXPERIENCE_ITEMS.map(item => ({ id: item.id, name: item.name, price: item.price, unit: '/ person' })),
  ...Object.values(TAB_DATA).flatMap(tab =>
    tab.items.flatMap(item => {
      const price = item.price
      return typeof price === 'number' && price > 0
        ? [{ id: item.id, name: item.name, price, unit: '/ person' }]
        : []
    }),
  ),
  ...RITUALS.map(item => ({ id: item.id, name: item.name, price: item.price, unit: '/ session' })),
  ...SPA_TREATMENTS.map(item => ({ id: item.id, name: item.name, price: item.price, unit: item.unit })),
  ...DISHES.map(item => ({ id: item.id, name: item.name, price: item.price, unit: '/ portion' })),
  ...DINING.map(item => ({ id: item.id, name: item.name, price: item.price, unit: item.unit })),
  ...ALL_MENU_ITEMS.map(item => ({ id: item.id, name: item.name, price: item.price, unit: '/ portion' })),
  ...EVENTS.map(item => ({ id: item.id, name: item.title, price: item.price, unit: '/ person' })),
  ...EVENT_TYPES.map(item => ({ id: item.id, name: item.name, price: item.price, unit: '/ event' })),
  ...EVENT_PACKAGES.map(item => ({ id: item.id, name: item.name, price: item.price, unit: item.unit })),
  ...PUBLIC_EVENTS.map(item => ({ id: item.id, name: item.name, price: item.price, unit: item.unit })),
  ...CALENDAR_EVENTS.map(item => ({ id: `cal-${item.id}`, name: item.name, price: item.price, unit: '/ person' })),
  ...FARM_WALKS.map(item => ({ id: item.id, name: item.name, price: item.price, unit: item.unit })),
  ...FARM_ANIMALS.map(item => ({ id: item.id, name: item.name, price: item.price, unit: item.unit })),
  ...FARM_WORKSHOPS.map(item => ({ id: item.id, name: item.name, price: item.price, unit: item.unit })),
  ...FARM_HARVEST.map(item => ({ id: item.id, name: item.name, price: item.price, unit: item.unit })),
  { id: 'upsell-spa-day', name: 'Arohamai Spa Day', price: 8500, unit: '/ person' },
  { id: 'upsell-farm-walk', name: 'Sunrise Farm Walk', price: 2800, unit: '/ person' },
  { id: 'upsell-harvest-dinner', name: 'Harvest Dinner', price: 12500, unit: '/ person' },
  { id: 'upsell-fire-circle', name: 'New Moon Fire Circle', price: 1500, unit: '/ person' },
  { id: 'upsell-cold-brew', name: 'Garden Cold Brew', price: 750, unit: '/ portion' },
  { id: 'upsell-cottage-night', name: 'Pokomo Marula Cottage', price: 5000, unit: '/ person · BO' },
  { id: 'upsell-spa-ritual', name: 'Arohamai Spa Ritual', price: 6500, unit: '/ person' },
  { id: 'upsell-farm-tour', name: 'Private Farm Tour', price: 4500, unit: '/ group' },
  { id: 'upsell-cottage-upgrade', name: 'Pokomo Cottage Stay', price: 5000, unit: '/ person · BO' },
  { id: 'upsell-herbal-tea', name: 'Farm Herbal Infusions', price: 350, unit: '/ cup' },
  { id: 'upsell-farm-walk-vk', name: 'Sunrise Farm Walk', price: 2800, unit: '/ person' },
]

function validDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
}

function parseQuantity(item: CartLine): number {
  const quantity = Number(item.qty ?? item.quantity ?? 1)
  if (!Number.isSafeInteger(quantity) || quantity < 1 || quantity > 100) {
    throw new Error('Cart item quantity is invalid')
  }
  return quantity
}

function parseBoardPlan(item: CartLine, stayId: string): typeof BOARD_PLANS[number] {
  if (typeof item.boardPlan === 'string' && BOARD_PLANS.includes(item.boardPlan as typeof BOARD_PLANS[number])) {
    return item.boardPlan as typeof BOARD_PLANS[number]
  }
  const itemId = typeof item.id === 'string' ? item.id : ''
  const plan = BOARD_PLANS.find(candidate => itemId === `${stayId}-${candidate}`)
  if (!plan) throw new Error('Select a valid cottage board plan')
  return plan
}

function findCatalogItem(item: CartLine, price: number): PriceableItem | undefined {
  const itemId = typeof item.id === 'string' ? item.id : ''
  const itemName = typeof item.name === 'string' ? item.name.trim() : ''
  const matchesName = (product: PriceableItem) =>
    itemName === product.name || itemName.startsWith(`${product.name} —`)

  return serviceCatalog.find(product =>
    product.id === itemId && product.price === price && matchesName(product),
  ) ?? serviceCatalog.find(product =>
    product.id === itemId && product.price === price,
  ) ?? serviceCatalog.find(product =>
    product.price === price && matchesName(product),
  )
}

function cartLinePrice(item: CartLine): number {
  const quantity = parseQuantity(item)
  const category = typeof item.category === 'string' ? item.category : ''
  const name = typeof item.name === 'string' ? item.name : ''

  if (category === 'restaurant' && name.startsWith('Restaurant Table —')) return 0

  const price = Number(item.price)
  if (!Number.isSafeInteger(price) || price <= 0) {
    throw new Error(`Cart contains an unavailable or unpriced item: ${name || 'unknown item'}`)
  }

  const catalogItem = findCatalogItem(item, price)
  if (!catalogItem) {
    throw new Error(`Cart contains an unavailable or unpriced item: ${name || 'unknown item'}`)
  }

  return price * quantity
}

export function calculateBookingPrice(input: {
  items: unknown
  checkIn: unknown
  checkOut: unknown
  guests: unknown
}): BookingPrice {
  if (!Array.isArray(input.items) || input.items.length === 0) {
    throw new Error('Booking must contain at least one priced item')
  }
  if (!validDate(input.checkIn) || !validDate(input.checkOut)) {
    throw new Error('Valid booking dates are required')
  }
  const nights = (Date.parse(`${input.checkOut}T00:00:00Z`) - Date.parse(`${input.checkIn}T00:00:00Z`)) / 86_400_000
  if (!Number.isSafeInteger(nights) || nights < 1 || nights > 365) {
    throw new Error('Booking dates must span between 1 and 365 nights')
  }
  const guests = Number(input.guests)
  if (!Number.isSafeInteger(guests) || guests < 1 || guests > 100) {
    throw new Error('Guest count must be between 1 and 100')
  }

  let subtotal = 0
  let nightlyRate = 0
  let resourceKey = ''

  for (const value of input.items) {
    if (!value || typeof value !== 'object') throw new Error('Cart item is invalid')
    const item = value as CartLine
    const category = typeof item.category === 'string' ? item.category : ''

    const itemId = typeof item.id === 'string' ? item.id : ''
    const requestedStayId = typeof item.resourceId === 'string' ? item.resourceId : ''
    const stay = category === 'cottage'
      ? stays.find(candidate =>
          candidate.id === requestedStayId ||
          BOARD_PLANS.some(plan => itemId === `${candidate.id}-${plan}`),
        )
      : undefined

    if (stay) {
      if (resourceKey && resourceKey !== stay.id) {
        throw new Error('A booking can include only one cottage')
      }
      const quantity = parseQuantity(item)
      if (quantity !== 1) throw new Error('A cottage booking must have quantity one')
      const plan = parseBoardPlan(item, stay.id)
      const price = Number(item.price)
      const rateForNight = stay.rates[plan]
      if (
        !Number.isSafeInteger(price) ||
        price < rateForNight ||
        price % rateForNight !== 0 ||
        price / rateForNight > stay.bookingDetails.maxOccupancy
      ) {
        throw new Error(`Cart contains an unavailable or unpriced cottage: ${typeof item.name === 'string' ? item.name : 'unknown cottage'}`)
      }
      nightlyRate += price
      subtotal += price * quantity
      resourceKey = stay.id
      continue
    }

    subtotal += cartLinePrice(item)
  }

  if (!Number.isSafeInteger(subtotal) || subtotal <= 0) {
    throw new Error('Booking total is invalid')
  }

  const serviceCharge = Math.round(subtotal * SERVICE_CHARGE_RATE)
  const vat = Math.round(subtotal * VAT_RATE)
  const totalAmount = subtotal + serviceCharge + vat
  if (!Number.isSafeInteger(totalAmount) || totalAmount <= 0) {
    throw new Error('Booking total is invalid')
  }

  return {
    totalAmount,
    ratePerNight: nightlyRate,
    resourceKey,
  }
}
