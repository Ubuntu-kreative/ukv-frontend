// src/lib/moxie/reservations.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Reservation Service
//
// Handles creation, storage, and retrieval of reservations.
// Currently persists to /api/reservations (Next.js API route).
// Swap the fetch calls for direct Supabase SDK calls when ready.
//
// Reservation types:
//   restaurant — table booking (time, guests, dietary notes)
//   cottage    — room stay (check-in, check-out, board plan)
//   spa        — treatment booking (ritual, time)
//   event      — experience booking (event name, guests)
// ─────────────────────────────────────────────────────────────────────

export type ReservationType = 'restaurant' | 'cottage' | 'spa' | 'event'
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Reservation {
  id:        string
  type:      ReservationType
  status:    ReservationStatus
  ref:       string        // human-readable ref e.g. UKV-48291
  createdAt: string

  // Guest
  guestName:  string
  guestPhone: string
  guestEmail?: string

  // Booking specifics (type-dependent fields)
  time?:       string   // restaurant: "7:30 PM"
  date?:       string   // ISO date string
  guests:      number
  checkIn?:    string   // cottage: ISO date
  checkOut?:   string   // cottage: ISO date
  roomName?:   string   // cottage: room/cottage name
  boardPlan?:  string   // cottage: BO/BB/HB/FB
  ritual?:     string   // spa: treatment name
  eventName?:  string   // event: event name

  // Cart & payment
  totalAmount?: number
  notes?:       string
  cartItems?:   CartLineItem[]
}

export interface CartLineItem {
  id:    string
  name:  string
  price: number
  qty:   number
}

// ─────────────────────────────────────────────────────────────────────
// REF GENERATOR
// ─────────────────────────────────────────────────────────────────────
function generateRef(): string {
  return `UKV-${Math.floor(10000 + Math.random() * 90000)}`
}

// ─────────────────────────────────────────────────────────────────────
// CREATE RESERVATION
//
// Sends to /api/reservations for persistence.
// Falls back to an optimistic local reference if the API fails
// (the guest still gets a reference number; staff follow up).
// ─────────────────────────────────────────────────────────────────────
export async function createReservation(
  data: Omit<Reservation, 'id' | 'ref' | 'createdAt' | 'status'>
): Promise<Reservation> {
  const reservation: Reservation = {
    ...data,
    id:        `res-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    ref:       generateRef(),
    createdAt: new Date().toISOString(),
    status:    'pending',
  }

  try {
    const res = await fetch('/api/reservations', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(reservation),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const saved = await res.json()
    return saved.reservation || reservation
  } catch (err) {
    console.warn('[Reservations] API unavailable, using optimistic ref:', err)
    // Return the local reservation — staff will reconcile
    return reservation
  }
}

// ─────────────────────────────────────────────────────────────────────
// CART ITEM BUILDER — converts a reservation into a CartPanel-ready item
// ─────────────────────────────────────────────────────────────────────
export function reservationToCartItem(res: Reservation) {
  const typeLabels: Record<ReservationType, string> = {
    restaurant: 'Dining',
    cottage:    'Accommodation',
    spa:        'Wellness',
    event:      'Experiences',
  }

  let name = ''
  let price = 0
  let unit = '/ booking'

  switch (res.type) {
    case 'restaurant':
      name  = `Restaurant Table — ${res.time}, ${res.guests} guest${res.guests > 1 ? 's' : ''}`
      price = 0   // settled at the restaurant; set a cover charge here if needed
      unit  = '/ table'
      break
    case 'cottage':
      name  = `${res.roomName || 'Room'} — ${res.checkIn} to ${res.checkOut}`
      price = res.totalAmount || 0
      unit  = '/ person per night'
      break
    case 'spa':
      name  = `${res.ritual || 'Spa Ritual'} — ${res.time || 'Time TBC'}`
      price = res.totalAmount || 0
      unit  = '/ person'
      break
    case 'event':
      name  = `${res.eventName || 'Event'} — ${res.guests} guest${res.guests > 1 ? 's' : ''}`
      price = res.totalAmount || 0
      unit  = '/ person'
      break
  }

  return {
    id:       res.id,
    cartKey:  res.id,          // stable, unique — fixes the cartKey-undefined error
    name,
    price,
    qty:      1,
    tag:      typeLabels[res.type],
    category: res.type === 'restaurant' ? 'restaurant' as const
              : res.type === 'cottage'  ? 'cottage' as const
              : res.type === 'spa'      ? 'spa' as const
              : 'event' as const,
    unit,
    note:     `Ref: ${res.ref} | Contact: ${res.guestPhone}${res.notes ? ` | ${res.notes}` : ''}`,
  }
}

// ─────────────────────────────────────────────────────────────────────
// BOOKING FLOW STATE MACHINE HELPERS
//
// Used by MoxieChat to manage multi-step booking conversations.
// All state lives in the React component — never in edge functions.
// ─────────────────────────────────────────────────────────────────────

export type BookingStep =
  | 'idle'
  | 'ask_type'      // What are you booking? (restaurant/spa/cottage)
  | 'ask_time'      // What time?
  | 'ask_date'      // What date?
  | 'ask_guests'    // How many guests?
  | 'ask_name'      // Your name?
  | 'ask_phone'     // Your phone number?
  | 'ask_notes'     // Any special requests?
  | 'confirming'    // Moxie summarises — guest confirms
  | 'complete'      // Done — cart item added

export interface BookingFlowState {
  step:       BookingStep
  type?:      ReservationType
  time?:      string
  date?:      string
  guests?:    number
  name?:      string
  phone?:     string
  email?:     string
  notes?:     string
  ritual?:    string
  roomName?:  string
  eventName?: string
  totalAmount?: number
}

export function getNextBookingStep(current: BookingFlowState): BookingStep {
  switch (current.step) {
    case 'idle':         return 'ask_type'
    case 'ask_type':     return 'ask_time'
    case 'ask_time':
      // Cottages need a date, restaurant just needs a time
      return current.type === 'restaurant' ? 'ask_guests' : 'ask_date'
    case 'ask_date':     return 'ask_guests'
    case 'ask_guests':   return 'ask_name'
    case 'ask_name':     return 'ask_phone'
    case 'ask_phone':    return 'confirming'
    case 'confirming':   return 'complete'
    default:             return 'idle'
  }
}

export function bookingFlowToPrompt(state: BookingFlowState): string {
  switch (state.step) {
    case 'ask_time':
      if (state.type === 'restaurant') return 'What time would you like to dine tonight? 🌙'
      if (state.type === 'spa')        return 'What time would you like your treatment?'
      return 'What time works for you?'
    case 'ask_date':
      return 'And what date? (e.g. tomorrow, or the 28th)'
    case 'ask_guests':
      return `For how many guests?`
    case 'ask_name':
      return `May I have your name?`
    case 'ask_phone':
      return (name: string) => `Thank you, ${name} 🌿 And your phone number so we can confirm?`
    case 'confirming':
      return buildConfirmationSummary(state)
    default:
      return ''
  }
}

function buildConfirmationSummary(state: BookingFlowState): string {
  const lines: string[] = []
  if (state.type === 'restaurant') {
    lines.push(`Table for ${state.guests} at ${state.time}`)
  } else if (state.type === 'spa') {
    lines.push(`${state.ritual || 'Spa ritual'} at ${state.time}`)
  } else if (state.type === 'cottage') {
    lines.push(`${state.roomName || 'Room'} — ${state.date}`)
  }
  lines.push(`Name: ${state.name}`)
  lines.push(`Phone: ${state.phone}`)
  if (state.notes) lines.push(`Notes: ${state.notes}`)

  return `Here's your booking summary:\n${lines.map(l => `  • ${l}`).join('\n')}\n\nShall I confirm this and add it to your cart?`
}