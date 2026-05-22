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

export type BookingStatus   = 'pending' | 'confirmed' | 'cancelled' | 'checked_in' | 'checked_out' | 'payment_failed' | 'no_show'
export type PaymentStatus   = 'pending' | 'paid' | 'failed' | 'refunded' | 'partial_refund'
export type RoomStatus      = 'available' | 'occupied' | 'maintenance' | 'cleaning'
export type InquiryStatus   = 'new' | 'in_progress' | 'resolved' | 'spam'
export type InquiryPriority = 'low' | 'normal' | 'high' | 'urgent'

export interface Booking {
  id:              string
  ref:             string
  guest_name:      string
  guest_email:     string
  guest_phone:     string
  room_id:         string
  room_name:       string
  check_in:        string
  check_out:       string
  nights:          number
  guests:          number
  board_plan:      string
  total_amount:    number
  paid_amount:     number
  status:          BookingStatus
  source:          string
  special_requests?: string
  created_at:      string
  updated_at:      string
}

export interface Payment {
  id:              string
  booking_id:      string
  booking_ref:     string
  guest_name:      string
  guest_email:     string
  amount:          number
  currency:        string
  status:          PaymentStatus
  method:          string
  mpesa_receipt?:  string
  phone_number?:   string
  transaction_date?: string
  refund_amount?:  number
  refund_reason?:  string
  created_at:      string
}

export interface Room {
  id:           string
  name:         string
  type:         string
  floor:        string
  capacity:     number
  status:       RoomStatus
  rate_bo:      number
  rate_bb:      number
  rate_hb:      number
  rate_fb:      number
  amenities:    string[]
  notes?:       string
  last_cleaned?: string
  current_booking_id?: string
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
  room_id?:   string
  page?:      number
  per_page?:  number
}

export interface PaymentFilters {
  search?:    string
  status?:    PaymentStatus | 'all'
  from?:      string
  to?:        string
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
  const { search, status, from, to, page = 1, per_page = 20 } = filters
  const offset = (page - 1) * per_page

  let query = supabase
    .from('bookings')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + per_page - 1)

  if (search) {
    query = query.or(`guest_name.ilike.%${search}%,guest_email.ilike.%${search}%,ref.ilike.%${search}%,room_name.ilike.%${search}%`)
  }
  if (status && status !== 'all') query = query.eq('status', status)
  if (from) query = query.gte('check_in', from)
  if (to)   query = query.lte('check_in', to)

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

// ── Payments ──────────────────────────────────────────────────────────────────

export async function getPayments(filters: PaymentFilters = {}) {
  const supabase = db()
  const { search, status, from, to, page = 1, per_page = 20 } = filters
  const offset = (page - 1) * per_page

  let query = supabase
    .from('payments')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + per_page - 1)

  if (search) {
    query = query.or(`guest_name.ilike.%${search}%,booking_ref.ilike.%${search}%,mpesa_receipt.ilike.%${search}%`)
  }
  if (status && status !== 'all') query = query.eq('status', status)
  if (from) query = query.gte('created_at', from)
  if (to)   query = query.lte('created_at', to)

  const { data, count, error } = await query
  if (error) throw error
  return { data: (data ?? []) as Payment[], count: count ?? 0 }
}

export async function processRefund(paymentId: string, amount: number, reason: string) {
  const supabase = db()
  const { data: payment } = await supabase
    .from('payments').select('amount').eq('id', paymentId).single()
  if (!payment) throw new Error('Payment not found')

  const isPartial = amount < payment.amount
  const { error } = await supabase
    .from('payments')
    .update({
      status:        isPartial ? 'partial_refund' : 'refunded',
      refund_amount: amount,
      refund_reason: reason,
      updated_at:    new Date().toISOString(),
    })
    .eq('id', paymentId)
  if (error) throw error
}

// ── Rooms ─────────────────────────────────────────────────────────────────────

export async function getRooms(search?: string): Promise<Room[]> {
  let query = db().from('rooms').select('*').order('name')
  if (search) query = query.ilike('name', `%${search}%`)
  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as Room[]
}

export async function updateRoom(id: string, updates: Partial<Room>) {
  const { error } = await db()
    .from('rooms')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function setMaintenanceBlock(
  roomId: string,
  startDate: string,
  endDate: string,
  note: string,
) {
  const supabase = db()
  const { error: re } = await supabase
    .from('rooms').update({ status: 'maintenance' }).eq('id', roomId)
  if (re) throw re

  const { error: me } = await supabase
    .from('maintenance_blocks')
    .insert({ room_id: roomId, start_date: startDate, end_date: endDate, note })
  if (me) throw me
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

  const [bToday, bMonth, revToday, revMonth, rooms, inquiries, pendingPay, checkedIn] =
    await Promise.allSettled([
      supabase.from('bookings').select('id', { count: 'exact' }).gte('created_at', today),
      supabase.from('bookings').select('id', { count: 'exact' }).gte('created_at', monthStart),
      supabase.from('payments').select('amount').eq('status', 'paid').gte('created_at', today),
      supabase.from('payments').select('amount').eq('status', 'paid').gte('created_at', monthStart),
      supabase.from('rooms').select('status'),
      supabase.from('inquiries').select('id', { count: 'exact' }).eq('status', 'new'),
      supabase.from('payments').select('id', { count: 'exact' }).eq('status', 'pending'),
      supabase.from('bookings').select('id', { count: 'exact' }).eq('status', 'checked_in').eq('check_in', today),
    ])

  const sum = (r: PromiseSettledResult<any>) =>
    r.status === 'fulfilled'
      ? (r.value.data ?? []).reduce((a: number, p: any) => a + (p.amount ?? 0), 0)
      : 0

  const cnt = (r: PromiseSettledResult<any>) =>
    r.status === 'fulfilled' ? (r.value.count ?? 0) : 0

  const roomsData  = rooms.status === 'fulfilled' ? (rooms.value.data ?? []) : []
  const total      = roomsData.length || 1
  const occupied   = roomsData.filter((r: any) => r.status === 'occupied').length
  const occupancy  = Math.round((occupied / total) * 100)

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