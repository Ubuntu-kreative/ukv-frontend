// src/lib/admin/service.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Admin Data Service
// All Supabase queries used by admin pages, centralised here.
// ─────────────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

function db() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type BookingStatus   = 'pending' | 'pending_verification' | 'payment_rejected' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show' | 'payment_failed'
export type InquiryStatus   = 'new' | 'in_progress' | 'resolved' | 'spam'
export type InquiryPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Booking {
  id:                 string
  booking_reference:  string
  resource_id:        string
  guest_id:           string
  status:             BookingStatus
  check_in_date:      string
  check_out_date:     string
  nights:             number
  adults:             number
  children:           number
  rate_per_night:     number
  total_amount:       number
  currency:           string
  payment_reference?: string | null
  submitted_at?:      string | null
  special_requests?:  string | null
  source:             string
  cancellation_reason?: string | null
  notes?:             string | null
  created_at:      string
  updated_at:      string
}

export interface Room {
  id:            string
  resource_key?: string | null
  name:          string
  description?:  string | null
  resource_type: 'cottage' | 'spa' | 'event'
  capacity?:     number | null
  min_stay?:     number
  is_active:     boolean
  created_at?:   string
  updated_at?:   string
}

export interface Inquiry {
  id:          string
  name:        string
  email:       string
  phone?:      string
  subject:     string
  message:     string
  status:      InquiryStatus
  priority:    InquiryPriority
  source:      string
  assigned_to?: string
  reply?:      string
  created_at:  string
  updated_at:  string
}

export interface DashboardStats {
  bookings_today:     number
  bookings_month:     number
  revenue_today:      number
  revenue_month:      number
  occupancy_rate:     number
  pending_inquiries:  number
  pending_payments:   number
  checked_in_today:   number
}

// ── Filters ───────────────────────────────────────────────────────────────────

export interface BookingFilters {
  search?:    string
  status?:    BookingStatus | 'all'
  from?:      string
  to?:        string
  resource_id?: string
  page?:      number
  per_page?:  number
}

export interface InquiryFilters {
  search?:    string
  status?:    InquiryStatus | 'all'
  priority?:  InquiryPriority | 'all'
  page?:      number
  per_page?:  number
}

// ── Bookings ──────────────────────────────────────────────────────────────────

export async function getBookings(filters: BookingFilters = {}) {
  const supabase = db()
  const { search, status, from, to, resource_id, page = 1, per_page = 20 } = filters
  const offset = (page - 1) * per_page

  let query = supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + per_page - 1)

  if (search) query = query.or(`booking_reference.ilike.%${search}%,payment_reference.ilike.%${search}%`)
  if (status && status !== 'all') query = query.eq('status', status)
  if (resource_id) query = query.eq('resource_id', resource_id)
  if (from) query = query.gte('check_in_date', from)
  if (to)   query = query.lte('check_in_date', to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as Booking[], count: count ?? 0 }
}

export async function getBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await db()
    .from('bookings').select('*').eq('id', id).single()
  if (error) return null
  return data as Booking
}

export async function updateBookingStatus(id: string, status: BookingStatus, note?: string) {
  const { error } = await db()
    .from('bookings')
    .update({ status, updated_at: new Date().toISOString(), ...(note ? { notes: note } : {}) })
    .eq('id', id)
  if (error) throw error
}

export async function updateBooking(id: string, updates: Partial<Booking>) {
  const { error } = await db()
    .from('bookings')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

// ── Resources ────────────────────────────────────────────────────────────────

export async function getRooms(search?: string): Promise<Room[]> {
  let query = db().from('resources').select('*').eq('resource_type', 'cottage').order('name')
  if (search) query = query.ilike('name', `%${search}%`)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Room[]
}

export async function updateRoom(id: string, updates: Partial<Room>) {
  const { error } = await db()
    .from('resources')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

// ── Inquiries ─────────────────────────────────────────────────────────────────

export async function getInquiries(filters: InquiryFilters = {}) {
  const supabase = db()
  const { search, status, priority, page = 1, per_page = 20 } = filters
  const offset = (page - 1) * per_page

  let query = supabase
    .from('inquiries')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + per_page - 1)

  if (search) {
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,subject.ilike.%${search}%`)
  }
  if (status   && status   !== 'all') query = query.eq('status',   status)
  if (priority && priority !== 'all') query = query.eq('priority', priority)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as Inquiry[], count: count ?? 0 }
}

export async function updateInquiry(id: string, updates: Partial<Inquiry>) {
  const { error } = await db()
    .from('inquiries')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function replyToInquiry(id: string, reply: string) {
  await updateInquiry(id, { reply, status: 'in_progress' })
}

// ── Dashboard stats ───────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = db()
  const today = new Date().toISOString().split('T')[0]
  const monthStart = today.slice(0, 7) + '-01'

  const [bToday, bMonth, revToday, revMonth, resources, inquiries, pendingPay, checkedIn] =
    await Promise.allSettled([
      supabase.from('bookings').select('id', { count: 'exact' }).gte('created_at', today),
      supabase.from('bookings').select('id', { count: 'exact' }).gte('created_at', monthStart),
      supabase.from('bookings').select('total_amount').eq('status', 'confirmed').gte('created_at', today),
      supabase.from('bookings').select('total_amount').eq('status', 'confirmed').gte('created_at', monthStart),
      supabase.from('resources').select('id').eq('resource_type', 'cottage').eq('is_active', true),
      supabase.from('inquiries').select('id', { count: 'exact' }).eq('status', 'new'),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'pending_verification'),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'checked_in').eq('check_in_date', today),
    ])

  const sum = (r: PromiseSettledResult<any>) =>
    r.status === 'fulfilled'
      ? (r.value.data ?? []).reduce((a: number, p: any) => a + (p.total_amount ?? 0), 0)
      : 0

  const cnt = (r: PromiseSettledResult<any>) =>
    r.status === 'fulfilled' ? (r.value.count ?? 0) : 0

  const resourcesData = resources.status === 'fulfilled' ? (resources.value.data ?? []) : []
  const total         = resourcesData.length || 1
  const occupancy     = Math.round((checkedIn.status === 'fulfilled' ? (checkedIn.value.count ?? 0) : 0) / total * 100)

  return {
    bookings_today:    cnt(bToday),
    bookings_month:    cnt(bMonth),
    revenue_today:     sum(revToday),
    revenue_month:     sum(revMonth),
    occupancy_rate:    occupancy,
    pending_inquiries: cnt(inquiries),
    pending_payments:  cnt(pendingPay),
    checked_in_today:  cnt(checkedIn),
  }
}