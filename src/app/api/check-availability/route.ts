/**
 * ─────────────────────────────────────────────────────────────────────────────
 * Ubuntu Kreative Village — Availability Engine
 * POST /api/check-availability
 *
 * Checks room availability against:
 *   • Confirmed and pending bookings  (prevents double-booking)
 *   • Maintenance blocks              (room out of service)
 *   • Owner blocks                    (owner/private hold)
 *   • Cancelled bookings              (excluded — seat is free again)
 *
 * Returns: available rooms with pricing, capacity, and block metadata.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'
import { z }                         from 'zod'

// ─────────────────────────────────────────────────────────────────────────────
// SUPABASE CLIENT
// Uses service-role key — never exposed to the browser.
// ─────────────────────────────────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error(
      'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables.'
    )
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const MAX_ADVANCE_DAYS   = 730  // 2 years
const MIN_STAY_NIGHTS    = 1
const MAX_STAY_NIGHTS    = 90
const MAX_GUEST_COUNT    = 20   // sanity ceiling across all room types

/** Booking statuses that actually occupy a room */
const BLOCKING_STATUSES = ['confirmed', 'pending', 'checked_in'] as const

/** Block types from the blocks table */
const BLOCK_TYPES = ['maintenance', 'owner', 'seasonal_closure'] as const

// ─────────────────────────────────────────────────────────────────────────────
// ZOD SCHEMA — request validation
// ─────────────────────────────────────────────────────────────────────────────

const AvailabilityRequestSchema = z.object({
  checkIn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'checkIn must be YYYY-MM-DD')
    .refine(
      (d) => !isNaN(Date.parse(d)),
      'checkIn is not a valid date'
    ),

  checkOut: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'checkOut must be YYYY-MM-DD')
    .refine(
      (d) => !isNaN(Date.parse(d)),
      'checkOut is not a valid date'
    ),

 guestCount: z
  .coerce
  .number()
  .int('guestCount must be an integer')
  .min(1, 'At least 1 guest required')
  .max(MAX_GUEST_COUNT, `Maximum ${MAX_GUEST_COUNT} guests supported`),

  /** Optional: filter by room category (e.g. "Pokomo Cottages") */
  category: z.string().optional(),

  /** Optional: preferred meal plan for pricing */
  mealPlan: z
    .enum(['bed_only', 'bed_and_breakfast', 'half_board', 'full_board'])
    .optional()
    .default('bed_only'),
})

type AvailabilityRequest = z.infer<typeof AvailabilityRequestSchema>

// ─────────────────────────────────────────────────────────────────────────────
// DATABASE TYPES
// Match your Supabase schema exactly.
// ─────────────────────────────────────────────────────────────────────────────

interface Room {
  id:           string
  name:         string
  slug:         string
  category:     string
  floor:        string | null
  capacity:     number       // max guests
  min_stay:     number       // minimum nights
  bed_only:     number       // price per guest per night
  bed_breakfast: number
  half_board:   number
  full_board:   number
  is_active:    boolean
  sort_order:   number
}

interface Booking {
  id:         string
  room_id:    string
  check_in:   string    // YYYY-MM-DD
  check_out:  string    // YYYY-MM-DD
  status:     string
  guest_count: number
}

interface Block {
  id:         string
  room_id:    string   // null means ALL rooms
  block_type: string
  start_date: string   // YYYY-MM-DD
  end_date:   string   // YYYY-MM-DD
  reason:     string | null
}

// ─────────────────────────────────────────────────────────────────────────────
// TYPES — response
// ─────────────────────────────────────────────────────────────────────────────

interface RoomPricing {
  mealPlan:          string
  pricePerGuestNight: number
  totalNights:       number
  totalGuests:       number
  subtotal:          number
  currency:          'KES'
}

interface AvailableRoom {
  id:          string
  name:        string
  slug:        string
  category:    string
  floor:       string | null
  capacity:    number
  minStay:     number
  pricing:     RoomPricing
  allPricing:  Record<string, RoomPricing>
}

interface UnavailableRoom {
  id:      string
  name:    string
  reason:  'booking' | 'maintenance' | 'owner_block' | 'capacity' | 'min_stay'
  details: string
}

interface AvailabilityResponse {
  available:    AvailableRoom[]
  unavailable:  UnavailableRoom[]
  summary: {
    checkIn:        string
    checkOut:       string
    nights:         number
    guestCount:     number
    totalAvailable: number
    requestedAt:    string
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────

/** Parse YYYY-MM-DD into midnight UTC Date */
function parseDate(s: string): Date {
  return new Date(`${s}T00:00:00.000Z`)
}

/** Inclusive night count between two dates */
function nightsBetween(checkIn: string, checkOut: string): number {
  const ms = parseDate(checkOut).getTime() - parseDate(checkIn).getTime()
  return Math.round(ms / 86_400_000)
}

/**
 * Do two date ranges overlap?
 * Range A: [aStart, aEnd)  — check_in inclusive, check_out exclusive
 * Range B: [bStart, bEnd)
 *
 * Overlap iff aStart < bEnd && bStart < aEnd
 */
function datesOverlap(
  aStart: string, aEnd: string,
  bStart: string, bEnd: string
): boolean {
  return aStart < bEnd && bStart < aEnd
}

/** Build pricing for one room + one meal plan */
function buildPricing(
  room:       Room,
  mealPlan:   string,
  nights:     number,
  guests:     number
): RoomPricing {
  const planMap: Record<string, keyof Room> = {
    bed_only:          'bed_only',
    bed_and_breakfast: 'bed_breakfast',
    half_board:        'half_board',
    full_board:        'full_board',
  }

  const col = planMap[mealPlan] ?? 'bed_only'
  const pricePerGuestNight = room[col] as number

  return {
    mealPlan,
    pricePerGuestNight,
    totalNights: nights,
    totalGuests: guests,
    subtotal:    pricePerGuestNight * guests * nights,
    currency:    'KES',
  }
}

/** Build all four meal plan pricings */
function buildAllPricing(
  room:   Room,
  nights: number,
  guests: number
): Record<string, RoomPricing> {
  const plans = ['bed_only', 'bed_and_breakfast', 'half_board', 'full_board']
  return Object.fromEntries(
    plans.map((p) => [p, buildPricing(room, p, nights, guests)])
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE AVAILABILITY CHECK
// ─────────────────────────────────────────────────────────────────────────────

async function checkAvailability(
  params: AvailabilityRequest
): Promise<AvailabilityResponse> {
  const supabase = getSupabase()
  const { checkIn, checkOut, guestCount, category, mealPlan } = params
  const nights = nightsBetween(checkIn, checkOut)

  // ── 1. Fetch all active rooms ────────────────────────────────────────────

  let roomsQuery = supabase
    .from('rooms')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (category) {
    roomsQuery = roomsQuery.eq('category', category)
  }

  const { data: rooms, error: roomsError } = await roomsQuery

  if (roomsError) {
    throw new Error(`Failed to fetch rooms: ${roomsError.message}`)
  }

  if (!rooms || rooms.length === 0) {
    return {
      available:   [],
      unavailable: [],
      summary: {
        checkIn,
        checkOut,
        nights,
        guestCount,
        totalAvailable: 0,
        requestedAt:    new Date().toISOString(),
      },
    }
  }

  const roomIds = (rooms as Room[]).map((r) => r.id)

  // ── 2. Fetch overlapping bookings for these rooms ────────────────────────
  //
  // We fetch any booking whose window overlaps [checkIn, checkOut).
  // Cancelled bookings are excluded at the query level.
  //
  // Overlap condition (see datesOverlap):
  //   booking.check_in  < requested.checkOut
  //   booking.check_out > requested.checkIn

  const { data: bookings, error: bookingsError } = await supabase
    .from('bookings')
    .select('id, room_id, check_in, check_out, status, guest_count')
    .in('room_id', roomIds)
    .in('status', [...BLOCKING_STATUSES])
    .lt('check_in', checkOut)   // booking starts before our checkout
    .gt('check_out', checkIn)   // booking ends after our checkin

  if (bookingsError) {
    throw new Error(`Failed to fetch bookings: ${bookingsError.message}`)
  }

  // ── 3. Fetch overlapping blocks ──────────────────────────────────────────
  //
  // Blocks can be:
  //   - room-specific (room_id IS NOT NULL)
  //   - property-wide (room_id IS NULL → affects all rooms)

  const { data: blocks, error: blocksError } = await supabase
    .from('room_blocks')
    .select('id, room_id, block_type, start_date, end_date, reason')
    .in('block_type', [...BLOCK_TYPES])
    .lt('start_date', checkOut)
    .gt('end_date', checkIn)

  if (blocksError) {
    throw new Error(`Failed to fetch blocks: ${blocksError.message}`)
  }

  // ── 4. Build lookup sets for O(1) checks ─────────────────────────────────

  const bookedRoomIds = new Set<string>()
  for (const b of (bookings ?? []) as Booking[]) {
    if (datesOverlap(b.check_in, b.check_out, checkIn, checkOut)) {
      bookedRoomIds.add(b.room_id)
    }
  }

  // Rooms blocked by maintenance or owner
  const blockedRoomIds     = new Set<string>()
  const blockReasonMap     = new Map<string, string>()
  let   propertyWideBlock  = false
  let   propertyBlockReason = ''

  for (const blk of (blocks ?? []) as Block[]) {
    if (!datesOverlap(blk.start_date, blk.end_date, checkIn, checkOut)) continue

    if (!blk.room_id) {
      // Affects every room
      propertyWideBlock  = true
      propertyBlockReason = blk.reason ?? blk.block_type
    } else {
      blockedRoomIds.add(blk.room_id)
      blockReasonMap.set(blk.room_id, blk.reason ?? blk.block_type)
    }
  }

  // ── 5. Classify each room ────────────────────────────────────────────────

  const available:   AvailableRoom[]   = []
  const unavailable: UnavailableRoom[] = []

  for (const room of rooms as Room[]) {
    // 5a. Property-wide block
    if (propertyWideBlock) {
      unavailable.push({
        id:      room.id,
        name:    room.name,
        reason:  'maintenance',
        details: `Property unavailable: ${propertyBlockReason}`,
      })
      continue
    }

    // 5b. Room-specific block
    if (blockedRoomIds.has(room.id)) {
      const reason   = blockReasonMap.get(room.id) ?? 'blocked'
      const isOwner  = reason.toLowerCase().includes('owner')
      unavailable.push({
        id:      room.id,
        name:    room.name,
        reason:  isOwner ? 'owner_block' : 'maintenance',
        details: reason,
      })
      continue
    }

    // 5c. Existing booking overlap
    if (bookedRoomIds.has(room.id)) {
      unavailable.push({
        id:      room.id,
        name:    room.name,
        reason:  'booking',
        details: `${room.name} is already booked for the selected dates.`,
      })
      continue
    }

    // 5d. Capacity check
    if (guestCount > room.capacity) {
      unavailable.push({
        id:      room.id,
        name:    room.name,
        reason:  'capacity',
        details: `${room.name} holds up to ${room.capacity} guests. Requested: ${guestCount}.`,
      })
      continue
    }

    // 5e. Minimum stay check
    if (nights < room.min_stay) {
      unavailable.push({
        id:      room.id,
        name:    room.name,
        reason:  'min_stay',
        details: `${room.name} requires a minimum of ${room.min_stay} nights. Requested: ${nights}.`,
      })
      continue
    }

    // 5f. Available ✓
    available.push({
      id:         room.id,
      name:       room.name,
      slug:       room.slug,
      category:   room.category,
      floor:      room.floor,
      capacity:   room.capacity,
      minStay:    room.min_stay,
      pricing:    buildPricing(room, mealPlan, nights, guestCount),
      allPricing: buildAllPricing(room, nights, guestCount),
    })
  }

  return {
    available,
    unavailable,
    summary: {
      checkIn,
      checkOut,
      nights,
      guestCount,
      totalAvailable: available.length,
      requestedAt:    new Date().toISOString(),
    },
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ROUTE HANDLER
// ─────────────────────────────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  // ── Parse body ────────────────────────────────────────────────────────────

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON in request body.' },
      { status: 400 }
    )
  }

  // ── Validate with Zod ─────────────────────────────────────────────────────

  const parsed = AvailabilityRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        error:   'Validation failed.',
        details: parsed.error.flatten().fieldErrors,
      },
      { status: 422 }
    )
  }

  const params = parsed.data

  // ── Business-logic date validations ──────────────────────────────────────

  const today    = new Date()
  today.setUTCHours(0, 0, 0, 0)
  const checkInD  = parseDate(params.checkIn)
  const checkOutD = parseDate(params.checkOut)

  // checkIn must not be in the past
  if (checkInD < today) {
    return NextResponse.json(
      { error: 'checkIn cannot be in the past.' },
      { status: 422 }
    )
  }

  // checkOut must be after checkIn
  if (checkOutD <= checkInD) {
    return NextResponse.json(
      { error: 'checkOut must be after checkIn.' },
      { status: 422 }
    )
  }

  const nights = nightsBetween(params.checkIn, params.checkOut)

  // Minimum stay
  if (nights < MIN_STAY_NIGHTS) {
    return NextResponse.json(
      { error: `Minimum stay is ${MIN_STAY_NIGHTS} night(s).` },
      { status: 422 }
    )
  }

  // Maximum stay
  if (nights > MAX_STAY_NIGHTS) {
    return NextResponse.json(
      { error: `Maximum stay is ${MAX_STAY_NIGHTS} nights.` },
      { status: 422 }
    )
  }

  // Advance booking window
  const maxDate = new Date(today)
  maxDate.setDate(maxDate.getDate() + MAX_ADVANCE_DAYS)
  if (checkInD > maxDate) {
    return NextResponse.json(
      { error: `Bookings can only be made up to ${MAX_ADVANCE_DAYS} days in advance.` },
      { status: 422 }
    )
  }

  // ── Run availability check ────────────────────────────────────────────────

  try {
    const result = await checkAvailability(params)

    return NextResponse.json(result, {
      status: 200,
      headers: {
        // Availability is time-sensitive — short cache, always revalidate
        'Cache-Control': 'no-store, max-age=0',
        'X-UKV-Engine':  'availability-v1',
      },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown server error'
    console.error('[AvailabilityEngine]', message)

    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    )
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GET — reject with helpful message
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    {
      error:   'Method not allowed. Use POST.',
      example: {
        checkIn:    '2025-09-01',
        checkOut:   '2025-09-05',
        guestCount: 2,
        mealPlan:   'bed_and_breakfast',
        category:   'Pokomo Cottages',   // optional
      },
    },
    { status: 405 }
  )
}
