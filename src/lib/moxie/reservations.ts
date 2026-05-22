/**
 * Ubuntu Kreative Village — Reservation Service
 *
 * Fix applied (error 12):
 *   - `bookingFlowToPrompt` returned an arrow function `(name: string) => string`
 *     for the 'ask_phone' case instead of a plain string. TypeScript reports:
 *     "Type '(name: string) => string' is not assignable to type 'string'."
 *   - Fixed by returning a static string. The caller already has the name in
 *     BookingFlowState, so MoxieChat should interpolate it from state directly.
 *
 * All other logic preserved exactly.
 */

export type ReservationType = 'restaurant' | 'cottage' | 'spa' | 'event'
export type ReservationStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'

export interface Reservation {
  id:        string
  type:      ReservationType
  status:    ReservationStatus
  ref:       string
  createdAt: string
  guestName:  string
  guestPhone: string
  guestEmail?: string
  time?:       string
  date?:       string
  guests:      number
  checkIn?:    string
  checkOut?:   string
  roomName?:   string
  boardPlan?:  string
  ritual?:     string
  eventName?:  string
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

function generateRef(): string {
  return `UKV-${Math.floor(10000 + Math.random() * 90000)}`
}

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
    return reservation
  }
}

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
      price = 0
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
    cartKey:  res.id,
    name,
    price,
    qty:      1,
    tag:      typeLabels[res.type],
    category: res.type === 'restaurant' ? 'restaurant' as const
              : res.type === 'cottage'  ? 'cottage' as const
              : res.type === 'spa'      ? 'spa' as const
              : 'event' as const,
    unit,
    note: `Ref: ${res.ref} | Contact: ${res.guestPhone}${res.notes ? ` | ${res.notes}` : ''}`,
  }
}

export type BookingStep =
  | 'idle'
  | 'ask_type'
  | 'ask_time'
  | 'ask_date'
  | 'ask_guests'
  | 'ask_name'
  | 'ask_phone'
  | 'ask_notes'
  | 'confirming'
  | 'complete'

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
    case 'idle':       return 'ask_type'
    case 'ask_type':   return 'ask_time'
    case 'ask_time':   return current.type === 'restaurant' ? 'ask_guests' : 'ask_date'
    case 'ask_date':   return 'ask_guests'
    case 'ask_guests': return 'ask_name'
    case 'ask_name':   return 'ask_phone'
    case 'ask_phone':  return 'confirming'
    case 'confirming': return 'complete'
    default:           return 'idle'
  }
}

/**
 * Returns a prompt string for the current booking step.
 *
 * Fix (error 12): The 'ask_phone' case previously returned an arrow function
 * `(name: string) => string` instead of a `string`, which is a type mismatch.
 * The name is available in `state` — callers should interpolate it themselves,
 * or use the name from state directly in the MoxieChat component.
 */
export function bookingFlowToPrompt(state: BookingFlowState): string {
  switch (state.step) {
    case 'ask_time':
      if (state.type === 'restaurant') return 'What time would you like to dine tonight? 🌙'
      if (state.type === 'spa')        return 'What time would you like your treatment?'
      return 'What time works for you?'

    case 'ask_date':
      return 'And what date? (e.g. tomorrow, or the 28th)'

    case 'ask_guests':
      return 'For how many guests?'

    case 'ask_name':
      return 'May I have your name?'

    case 'ask_phone':
      // Fix: was `(name: string) => string` — now returns the string directly,
      // interpolating name from state (which is already available to the caller).
      return `Thank you${state.name ? `, ${state.name}` : ''} 🌿 And your phone number so we can confirm?`

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