// src/lib/calendar/calendarService.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Calendar Service
// Fetches availability data, normalises it into a flat date-keyed map,
// and provides helpers used by hooks and components.
// ─────────────────────────────────────────────────────────────────────────────

export type DateStatus =
  | 'available'
  | 'occupied'
  | 'maintenance'
  | 'partial'      // some rooms available, some not
  | 'loading'

export interface DayInfo {
  date:        string          // ISO "YYYY-MM-DD"
  status:      DateStatus
  bookingIds?: string[]
  roomIds?:    string[]        // which rooms are booked/blocked
  note?:       string          // e.g. "Maintenance: plumbing repair"
  price?:      number          // lowest available rate that day
}

export interface AvailabilityWindow {
  roomId:    string
  roomName:  string
  checkIn:   string            // ISO date
  checkOut:  string
  status:    'booked' | 'maintenance' | 'available'
  bookingId?: string
  note?:     string
}

export interface CalendarMonth {
  year:  number
  month: number                // 0-indexed (Jan = 0)
  days:  Record<string, DayInfo>  // keyed by "YYYY-MM-DD"
}

// ── Date helpers ──────────────────────────────────────────────────────────────

export function toISO(date: Date): string {
  return date.toISOString().split('T')[0]
}

export function parseISO(s: string): Date {
  const [y, m, d] = s.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(date: Date, n: number): Date {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function isSameDay(a: Date, b: Date): boolean {
  return toISO(a) === toISO(b)
}

export function startOfMonth(year: number, month: number): Date {
  return new Date(year, month, 1)
}

export function endOfMonth(year: number, month: number): Date {
  return new Date(year, month + 1, 0)
}

export function startOfWeek(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  d.setDate(d.getDate() - day)
  return d
}

export function getDaysInMonth(year: number, month: number): Date[] {
  const days: Date[] = []
  const start = startOfMonth(year, month)
  const end   = endOfMonth(year, month)
  let cur = new Date(start)
  while (cur <= end) {
    days.push(new Date(cur))
    cur = addDays(cur, 1)
  }
  return days
}

export function getWeekDays(anchorDate: Date): Date[] {
  const start = startOfWeek(anchorDate)
  return Array.from({ length: 7 }, (_, i) => addDays(start, i))
}

export function formatMonthYear(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-KE', {
    month: 'long',
    year:  'numeric',
  })
}

export function formatWeekRange(start: Date, end: Date): string {
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short' })
  return `${fmt(start)} – ${fmt(end)}`
}

// ── API response types ────────────────────────────────────────────────────────

interface ApiBooking {
  id:         string
  room_id:    string
  room_name:  string
  check_in:   string
  check_out:  string
  status:     string
}

interface ApiMaintenanceBlock {
  id:        string
  room_id:   string
  room_name: string
  start_date: string
  end_date:   string
  note?:     string
}

interface AvailabilityApiResponse {
  bookings:     ApiBooking[]
  maintenance:  ApiMaintenanceBlock[]
  totalRooms:   number
}

// ── Core service ──────────────────────────────────────────────────────────────

export class CalendarService {
  private baseUrl: string
  private cache   = new Map<string, { data: CalendarMonth; ts: number }>()
  private TTL     = 60_000   // 1 minute cache

  constructor(baseUrl = '/api/availability') {
    this.baseUrl = baseUrl
  }

  // Expand a range of dates from start → day BEFORE end (check-out not occupied)
  private expandRange(start: string, end: string): string[] {
    const dates: string[] = []
    let cur = parseISO(start)
    const last = parseISO(end)
    while (cur < last) {
      dates.push(toISO(cur))
      cur = addDays(cur, 1)
    }
    return dates
  }

  async fetchMonth(year: number, month: number): Promise<CalendarMonth> {
    const key = `${year}-${month}`
    const cached = this.cache.get(key)
    if (cached && Date.now() - cached.ts < this.TTL) return cached.data

    const from = toISO(startOfMonth(year, month))
    const to   = toISO(endOfMonth(year, month))

    const res = await fetch(
      `${this.baseUrl}?from=${from}&to=${to}`,
      { next: { revalidate: 60 } }
    )

    if (!res.ok) throw new Error(`Availability API error: ${res.status}`)

    const json: AvailabilityApiResponse = await res.json()

    const days: Record<string, DayInfo> = {}

    // Initialise all days as available
    getDaysInMonth(year, month).forEach(d => {
      const iso = toISO(d)
      days[iso] = { date: iso, status: 'available', bookingIds: [], roomIds: [] }
    })

    // Mark booked dates
    for (const booking of json.bookings ?? []) {
      const dates = this.expandRange(booking.check_in, booking.check_out)
      for (const iso of dates) {
        if (!days[iso]) continue
        const day = days[iso]
        day.bookingIds = [...(day.bookingIds ?? []), booking.id]
        day.roomIds    = [...(day.roomIds    ?? []), booking.room_id]
        // Determine partial vs fully occupied
        const bookedCount = new Set(day.roomIds).size
        day.status = bookedCount >= json.totalRooms ? 'occupied' : 'partial'
      }
    }

    // Mark maintenance blocks (override occupied if all in maintenance)
    for (const block of json.maintenance ?? []) {
      const dates = this.expandRange(block.start_date, block.end_date)
      for (const iso of dates) {
        if (!days[iso]) continue
        days[iso].status = 'maintenance'
        days[iso].note   = block.note ?? 'Maintenance block'
        days[iso].roomIds = [...(days[iso].roomIds ?? []), block.room_id]
      }
    }

    const result: CalendarMonth = { year, month, days }
    this.cache.set(key, { data: result, ts: Date.now() })
    return result
  }

  invalidateMonth(year: number, month: number): void {
    this.cache.delete(`${year}-${month}`)
  }

  invalidateAll(): void {
    this.cache.clear()
  }
}

export const calendarService = new CalendarService()