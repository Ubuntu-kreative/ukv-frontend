/**
 * Ubuntu Kreative Village — Availability Engine Types
 * Import these in your frontend booking components.
 */

// ─────────────────────────────────────────────────────────────────────────────
// REQUEST
// ─────────────────────────────────────────────────────────────────────────────

export type MealPlan =
  | 'bed_only'
  | 'bed_and_breakfast'
  | 'half_board'
  | 'full_board'

export interface AvailabilityRequest {
  checkIn:    string      // YYYY-MM-DD
  checkOut:   string      // YYYY-MM-DD
  guestCount: number
  category?:  string      // optional category filter
  mealPlan?:  MealPlan    // defaults to 'bed_only'
}

// ─────────────────────────────────────────────────────────────────────────────
// RESPONSE
// ─────────────────────────────────────────────────────────────────────────────

export interface RoomPricing {
  mealPlan:            MealPlan
  pricePerGuestNight:  number
  totalNights:         number
  totalGuests:         number
  subtotal:            number
  currency:            'KES'
}

export interface AvailableRoom {
  id:         string
  name:       string
  slug:       string
  category:   string
  floor:      string | null
  capacity:   number
  minStay:    number
  pricing:    RoomPricing                    // pricing for the requested meal plan
  allPricing: Record<MealPlan, RoomPricing>  // all four plans for UI comparison
}

export type UnavailableReason =
  | 'booking'
  | 'maintenance'
  | 'owner_block'
  | 'capacity'
  | 'min_stay'

export interface UnavailableRoom {
  id:      string
  name:    string
  reason:  UnavailableReason
  details: string
}

export interface AvailabilitySummary {
  checkIn:        string
  checkOut:       string
  nights:         number
  guestCount:     number
  totalAvailable: number
  requestedAt:    string
}

export interface AvailabilityResponse {
  available:   AvailableRoom[]
  unavailable: UnavailableRoom[]
  summary:     AvailabilitySummary
}

export interface AvailabilityErrorResponse {
  error:    string
  details?: Record<string, string[]>
}

// ─────────────────────────────────────────────────────────────────────────────
// CLIENT HELPER
// Use this in your React components / server actions.
// ─────────────────────────────────────────────────────────────────────────────

export async function fetchAvailability(
  params: AvailabilityRequest
): Promise<AvailabilityResponse> {
  const res = await fetch('/api/check-availability', {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(params),
    cache:   'no-store',
  })

  if (!res.ok) {
    const err: AvailabilityErrorResponse = await res.json()
    throw new Error(err.error ?? `HTTP ${res.status}`)
  }

  return res.json() as Promise<AvailabilityResponse>
}

// ─────────────────────────────────────────────────────────────────────────────
// MEAL PLAN LABELS (for UI)
// ─────────────────────────────────────────────────────────────────────────────

export const MEAL_PLAN_LABELS: Record<MealPlan, string> = {
  bed_only:          'Bed Only',
  bed_and_breakfast: 'Bed & Breakfast',
  half_board:        'Half Board',
  full_board:        'Full Board',
}
