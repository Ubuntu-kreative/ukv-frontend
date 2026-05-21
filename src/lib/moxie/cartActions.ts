// src/lib/moxie/cartActions.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Moxie Cart Actions
//
// All items added to the cart by Moxie MUST have a stable, unique
// `cartKey`. This is the source of the "restaurant-undefined" duplicate
// key error — items were added without cartKey set.
//
// RULE: Every item created here sets:
//   id:      unique string (used by cart store for lookup)
//   cartKey: SAME as id — always set, never undefined
//
// This file is the single place Moxie creates cart items, ensuring
// the cartKey contract is never violated.
// ─────────────────────────────────────────────────────────────────────

import type { MenuItem }     from './menu'
import type { Reservation }  from './reservations'
import { menuItemToCartItem } from './menu'
import { reservationToCartItem } from './reservations'

// ─────────────────────────────────────────────────────────────────────
// CART ITEM TYPE (must match your cartStore's CartItem type)
// ─────────────────────────────────────────────────────────────────────
export interface MoxieCartItem {
  id:        string   // stable unique identifier
  cartKey:   string   // MUST equal id — never undefined
  name:      string
  price:     number
  qty:       number
  tag:       string
  category:  'restaurant' | 'cottage' | 'spa' | 'event' | 'event-package' | 'farm' | 'village-kitchen'
  unit:      string
  note?:     string
  boardPlan?: string
}

// ─────────────────────────────────────────────────────────────────────
// STABLE ID GENERATOR
// Returns a string that is unique and safe for use as a React key
// and as a cart store identifier.
// ─────────────────────────────────────────────────────────────────────
function stableId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
}

// ─────────────────────────────────────────────────────────────────────
// TABLE RESERVATION → CART ITEM
//
// Used when Moxie completes a restaurant booking flow.
// Price is 0 — settled at the restaurant.
// CartKey is always set from the reservation's stable id.
// ─────────────────────────────────────────────────────────────────────
export function tableReservationToCartItem(params: {
  time:    string
  guests:  number
  name:    string
  phone:   string
  notes?:  string
  date?:   string
}): MoxieCartItem {
  const id = stableId('moxie-table')
  const guestLabel = `${params.guests} guest${params.guests > 1 ? 's' : ''}`
  const timeLabel  = params.date ? `${params.date}, ${params.time}` : params.time

  return {
    id,
    cartKey:  id,      // ← ALWAYS SET — fixes the cartKey-undefined error
    name:     `Restaurant Table — ${timeLabel}, ${guestLabel}`,
    price:    0,
    qty:      1,
    tag:      'Dining',
    category: 'restaurant',
    unit:     '/ table',
    note:     [
      `Guest: ${params.name}`,
      `Phone: ${params.phone}`,
      params.notes ? `Notes: ${params.notes}` : '',
    ].filter(Boolean).join(' | '),
  }
}

// ─────────────────────────────────────────────────────────────────────
// MENU ITEM → CART ITEM
//
// Used when Moxie adds a specific dish to the cart.
// Re-exports menuItemToCartItem with the cartKey guarantee.
// ─────────────────────────────────────────────────────────────────────
export function addMenuItemToCart(item: MenuItem, qty = 1): MoxieCartItem {
  const base = menuItemToCartItem(item, qty)
  return {
    ...base,
    cartKey: base.id,    // ensure cartKey === id
    qty,
  }
}

// ─────────────────────────────────────────────────────────────────────
// RESERVATION → CART ITEM
//
// Used when Moxie creates any other type of reservation (spa, event, cottage).
// ─────────────────────────────────────────────────────────────────────
export function addReservationToCart(res: Reservation): MoxieCartItem {
  const base = reservationToCartItem(res)
  return {
    ...base,
    cartKey: base.id,    // ensure cartKey === id
  }
}

// ─────────────────────────────────────────────────────────────────────
// SPA BOOKING → CART ITEM
// ─────────────────────────────────────────────────────────────────────
export function spaBookingToCartItem(params: {
  ritual:  string
  time:    string
  guests:  number
  name:    string
  phone:   string
  price?:  number
  notes?:  string
}): MoxieCartItem {
  const id = stableId('moxie-spa')
  return {
    id,
    cartKey:  id,
    name:     `${params.ritual} — ${params.time}`,
    price:    params.price || 0,
    qty:      params.guests,
    tag:      'Arohamai Spa',
    category: 'spa',
    unit:     '/ person',
    note:     [
      `Guest: ${params.name}`,
      `Phone: ${params.phone}`,
      params.notes ? `Notes: ${params.notes}` : '',
    ].filter(Boolean).join(' | '),
  }
}

// ─────────────────────────────────────────────────────────────────────
// EVENT BOOKING → CART ITEM
// ─────────────────────────────────────────────────────────────────────
export function eventBookingToCartItem(params: {
  eventName: string
  date?:     string
  guests:    number
  price:     number
  name:      string
  phone:     string
  notes?:    string
}): MoxieCartItem {
  const id = stableId('moxie-event')
  const guestLabel = `${params.guests} guest${params.guests > 1 ? 's' : ''}`

  return {
    id,
    cartKey:  id,
    name:     `${params.eventName}${params.date ? ` — ${params.date}` : ''}, ${guestLabel}`,
    price:    params.price,
    qty:      params.guests,
    tag:      'Experiences',
    category: 'event',
    unit:     '/ person',
    note:     [
      `Guest: ${params.name}`,
      `Phone: ${params.phone}`,
      params.notes ? `Notes: ${params.notes}` : '',
    ].filter(Boolean).join(' | '),
  }
}

// ─────────────────────────────────────────────────────────────────────
// FARM WALK → CART ITEM
// ─────────────────────────────────────────────────────────────────────
export function farmWalkToCartItem(params: {
  date:    string
  guests:  number
  name:    string
  phone:   string
}): MoxieCartItem {
  const id = stableId('moxie-farm')
  const FARM_WALK_PRICE = 2800

  return {
    id,
    cartKey:  id,
    name:     `Sunrise Farm Walk — ${params.date}`,
    price:    FARM_WALK_PRICE,
    qty:      params.guests,
    tag:      'Farm Experience',
    category: 'farm',
    unit:     '/ person',
    note:     `Guest: ${params.name} | Phone: ${params.phone} | 6:00 AM start`,
  }
}

// ─────────────────────────────────────────────────────────────────────
// UPSELL ITEMS
//
// Pre-built cart items for Moxie's upsell suggestions.
// All have stable cartKey values.
// ─────────────────────────────────────────────────────────────────────
export const MOXIE_UPSELLS: MoxieCartItem[] = [
  {
    id:       'upsell-spa-day',
    cartKey:  'upsell-spa-day',
    name:     'Arohamai Spa Day',
    price:    8500,
    qty:      1,
    tag:      'Wellness',
    category: 'spa',
    unit:     '/ person',
  },
  {
    id:       'upsell-farm-walk',
    cartKey:  'upsell-farm-walk',
    name:     'Sunrise Farm Walk',
    price:    2800,
    qty:      1,
    tag:      'Farm Experience',
    category: 'farm',
    unit:     '/ person',
  },
  {
    id:       'upsell-harvest-dinner',
    cartKey:  'upsell-harvest-dinner',
    name:     'Harvest Dinner',
    price:    12500,
    qty:      1,
    tag:      'Dining Experience',
    category: 'event',
    unit:     '/ person',
  },
  {
    id:       'upsell-fire-circle',
    cartKey:  'upsell-fire-circle',
    name:     'New Moon Fire Circle',
    price:    1500,
    qty:      1,
    tag:      'Community',
    category: 'event',
    unit:     '/ person',
  },
]