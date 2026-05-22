/**
 * Ubuntu Kreative Village — Inquiry Management API
 * Fixed for Zod v4 compatibility
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'
import { z }                         from 'zod'

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars.')
  return createClient(url, key, { auth: { persistSession: false } })
}

const INQUIRY_TYPES    = ['contact', 'spa', 'restaurant', 'retreat', 'events'] as const
type  InquiryType      = typeof INQUIRY_TYPES[number]
const INQUIRY_STATUSES = ['new', 'read', 'replied', 'converted', 'spam', 'archived'] as const

const MIN_FILL_SECONDS     = 3
const RATE_LIMIT_MAX       = 5
const RATE_LIMIT_WINDOW    = 60 * 60 * 1000
const DUPLICATE_WINDOW_MIN = 10
const SPAM_SCORE_THRESHOLD = 4

// ── Rate limiter ──────────────────────────────────────────────────────────────

interface RateRecord { count: number; windowStart: number }
const rateLimitStore = new Map<string, RateRecord>()

function checkRateLimit(ip: string): { allowed: boolean; remaining: number; resetAt: number } {
  const now    = Date.now()
  const record = rateLimitStore.get(ip)

  if (!record || now - record.windowStart > RATE_LIMIT_WINDOW) {
    rateLimitStore.set(ip, { count: 1, windowStart: now })
    return { allowed: true, remaining: RATE_LIMIT_MAX - 1, resetAt: now + RATE_LIMIT_WINDOW }
  }

  if (record.count >= RATE_LIMIT_MAX) {
    return { allowed: false, remaining: 0, resetAt: record.windowStart + RATE_LIMIT_WINDOW }
  }

  record.count++
  return {
    allowed:   true,
    remaining: RATE_LIMIT_MAX - record.count,
    resetAt:   record.windowStart + RATE_LIMIT_WINDOW,
  }
}

let pruneCounter = 0
function maybePruneRateLimitStore() {
  if (++pruneCounter % 100 !== 0) return
  const cutoff = Date.now() - RATE_LIMIT_WINDOW
  for (const [ip, rec] of rateLimitStore.entries()) {
    if (rec.windowStart < cutoff) rateLimitStore.delete(ip)
  }
}

// ── Spam detector ─────────────────────────────────────────────────────────────

const SPAM_KEYWORDS = [
  'casino', 'crypto', 'bitcoin', 'forex', 'loan', 'cheap viagra',
  'click here', 'make money', 'work from home', 'seo service',
  'buy followers', 'instagram followers', 'whatsapp hack',
  'nigerian prince', 'wire transfer', 'money transfer',
  'free gift', 'you have been selected', 'congratulations you',
]

const SPAM_PATTERNS = [
  /https?:\/\//gi,
  /\b[A-Z]{5,}\b/g,
  /(.)\1{4,}/g,
  /\b\d{10,}\b/g,
]

interface SpamResult { isSpam: boolean; score: number; flags: string[] }

function scoreSpam(message: string, name: string, email: string): SpamResult {
  let score = 0
  const flags: string[] = []
  const combined = `${name} ${email} ${message}`.toLowerCase()

  for (const kw of SPAM_KEYWORDS) {
    if (combined.includes(kw)) { score += 2; flags.push(`keyword:${kw}`) }
  }

  for (const pattern of SPAM_PATTERNS) {
    const matches = message.match(pattern)
    if (matches?.length) { score += matches.length; flags.push(`pattern:${pattern.source}`) }
  }

  if (message.trim().length < 10) { score += 1; flags.push('short_message') }
  if (/\.(xyz|top|click|loan|work|gdn)$/i.test(email)) { score += 2; flags.push('suspicious_tld') }

  const upperRatio = (message.match(/[A-Z]/g) ?? []).length / Math.max(message.length, 1)
  if (upperRatio > 0.7 && message.length > 20) { score += 2; flags.push('all_caps_message') }

  return { isSpam: score >= SPAM_SCORE_THRESHOLD, score, flags }
}

// ── Type-specific meta schemas ────────────────────────────────────────────────

const SpaMetaSchema = z.object({
  treatmentInterest: z.string().max(100).optional(),
  preferredDate:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  sessionDuration:   z.enum(['60min', '90min', '120min', 'full_day']).optional(),
  guestCount:        z.number().int().min(1).max(10).optional(),
})

const RestaurantMetaSchema = z.object({
  diningDate:   z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  partySize:    z.number().int().min(1).max(100).optional(),
  occasion:     z.string().max(100).optional(),
  dietaryNeeds: z.string().max(300).optional(),
  mealType:     z.enum(['breakfast', 'lunch', 'dinner', 'private_dining']).optional(),
})

const RetreatMetaSchema = z.object({
  checkIn:      z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  checkOut:     z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  guestCount:   z.number().int().min(1).max(50).optional(),
  retreatFocus: z.string().max(200).optional(),
  budgetRange:  z.enum(['budget', 'mid', 'premium', 'ultra']).optional(),
  roomCategory: z.enum(['Pokomo Cottages', 'Farm House', 'Penthouses']).optional(),
})

const EventsMetaSchema = z.object({
  eventDate:        z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  eventType:        z.enum(['wedding', 'corporate', 'birthday', 'retreat', 'other']).optional(),
  guestCount:       z.number().int().min(1).max(500).optional(),
  venuePreference:  z.string().max(200).optional(),
  budgetRange:      z.enum(['under_100k', '100k_500k', '500k_1m', 'above_1m']).optional(),
  cateringRequired: z.boolean().optional(),
})

const ContactMetaSchema = z.object({
  subject: z.string().max(200).optional(),
  urgency: z.enum(['low', 'normal', 'high']).optional().default('normal'),
})

// satisfies gives us the per-type narrowing without ZodObject<any>
const META_SCHEMAS = {
  contact:    ContactMetaSchema,
  spa:        SpaMetaSchema,
  restaurant: RestaurantMetaSchema,
  retreat:    RetreatMetaSchema,
  events:     EventsMetaSchema,
} satisfies Record<InquiryType, z.ZodObject<z.ZodRawShape>>

// ── Main request schema ───────────────────────────────────────────────────────
//
// Zod v4 breaking change: z.enum() second argument no longer accepts
// { errorMap }. Use { message: string } instead.
//
const InquirySchema = z.object({
  name: z
    .string()
    .min(2,   'Name must be at least 2 characters')
    .max(100, 'Name must be under 100 characters')
    .regex(/^[\p{L}\p{M}'\- ]+$/u, 'Name contains invalid characters'),

  email: z
    .string()
    .email('Invalid email address')
    .max(254, 'Email too long')
    .transform((e) => e.toLowerCase().trim()),

  phone: z
    .string()
    .regex(/^\+?[\d\s\-().]{7,20}$/, 'Invalid phone number')
    .optional()
    .transform((p) => p?.replace(/\s+/g, '') ?? undefined),

  country: z.string().min(2).max(100).optional(),

  // FIX: { message } not { errorMap } in Zod v4
  type: z.enum(INQUIRY_TYPES, {
    message: `type must be one of: ${INQUIRY_TYPES.join(', ')}`,
  }),

  message: z
    .string()
    .min(10,   'Message must be at least 10 characters')
    .max(2000, 'Message must be under 2000 characters')
    .transform((m) => m.trim()),

  // FIX: z.record() in Zod v4 requires explicit key schema
  meta: z.record(z.string(), z.unknown()).optional(),

  website:     z.string().max(0, 'Validation failed.').optional(),
  formLoadedAt: z.number().int().positive().optional(),
})

type InquiryInput = z.infer<typeof InquirySchema>

// ── Helpers ───────────────────────────────────────────────────────────────────

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-real-ip') ??
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '0.0.0.0'
  )
}

function sanitizeString(s: string): string {
  return s.replace(/[<>]/g, '').replace(/javascript:/gi, '').replace(/on\w+=/gi, '').trim()
}

function validateMeta(
  type: InquiryType,
  meta: Record<string, unknown> | undefined
): { valid: boolean; parsed: unknown; errors: Record<string, string[]> } {
  if (!meta) return { valid: true, parsed: {}, errors: {} }

  const result = META_SCHEMAS[type].safeParse(meta)
  if (!result.success) {
    return {
      valid:  false,
      parsed: null,
      errors: result.error.flatten().fieldErrors as Record<string, string[]>,
    }
  }
  return { valid: true, parsed: result.data, errors: {} }
}

// ── POST — Submit inquiry ─────────────────────────────────────────────────────

export async function POST(req: NextRequest): Promise<NextResponse> {
  const ip        = getClientIp(req)
  const userAgent = req.headers.get('user-agent') ?? null

  // 1. Rate limit
  maybePruneRateLimitStore()
  const rateResult = checkRateLimit(ip)

  if (!rateResult.allowed) {
    const retryAfter = Math.ceil((rateResult.resetAt - Date.now()) / 1000)
    return NextResponse.json(
      { error: 'Too many requests. Please wait before submitting again.', retryAfter },
      {
        status: 429,
        headers: {
          'Retry-After':           String(retryAfter),
          'X-RateLimit-Limit':     String(RATE_LIMIT_MAX),
          'X-RateLimit-Remaining': '0',
          'X-RateLimit-Reset':     String(Math.ceil(rateResult.resetAt / 1000)),
        },
      }
    )
  }

  // 2. Parse body
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Invalid JSON in request body.' }, { status: 400 })
  }

  // 3. Zod validation
  const parsed = InquirySchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed.', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const data: InquiryInput = parsed.data

  // 4. Honeypot — silently accept so bots don't know they're blocked
  if (data.website && data.website.length > 0) {
    return NextResponse.json({ success: true, id: crypto.randomUUID() }, { status: 201 })
  }

  // 5. Timing check
  if (data.formLoadedAt) {
    const elapsed = (Date.now() - data.formLoadedAt) / 1000
    if (elapsed < MIN_FILL_SECONDS) {
      return NextResponse.json({ success: true, id: crypto.randomUUID() }, { status: 201 })
    }
  }

  // 6. Sanitize
  const safeName    = sanitizeString(data.name)
  const safeMessage = sanitizeString(data.message)
  const safeCountry = data.country ? sanitizeString(data.country) : null

  // 7. Spam score
  const spam = scoreSpam(safeMessage, safeName, data.email)

  // 8. Meta validation
  const metaResult = validateMeta(data.type, data.meta as Record<string, unknown>)
  if (!metaResult.valid) {
    return NextResponse.json(
      { error: 'Invalid metadata for inquiry type.', details: metaResult.errors },
      { status: 422 }
    )
  }

  // 9. Duplicate check
  const supabase   = getSupabase()
  const windowTime = new Date(Date.now() - DUPLICATE_WINDOW_MIN * 60 * 1000).toISOString()

  const { data: existing } = await supabase
    .from('inquiries')
    .select('id')
    .eq('email', data.email)
    .eq('type',  data.type)
    .gte('created_at', windowTime)
    .not('status', 'eq', 'spam')
    .maybeSingle()

  if (existing) {
    return NextResponse.json(
      {
        error: `We already received your ${data.type} inquiry. We'll be in touch shortly.`,
        code:  'DUPLICATE_INQUIRY',
      },
      { status: 409 }
    )
  }

  // 10. Persist
  const status = spam.isSpam ? 'spam' : 'new'

  const { data: inquiry, error: insertError } = await supabase
    .from('inquiries')
    .insert({
      type:       data.type,
      status,
      name:       safeName,
      email:      data.email,
      phone:      data.phone ?? null,
      country:    safeCountry,
      message:    safeMessage,
      meta:       metaResult.parsed ?? {},
      spam_score: spam.score,
      spam_flags: spam.flags,
      ip_address: ip,
      user_agent: userAgent,
    })
    .select('id, type, status, created_at')
    .single()

  if (insertError) {
    console.error('[Inquiries] Insert error:', insertError.message)
    return NextResponse.json(
      { error: 'Failed to submit inquiry. Please try again.' },
      { status: 500 }
    )
  }

  // 11. Fire-and-forget notification
  if (!spam.isSpam) {
    queueNotification(inquiry.id, data.type, safeName, data.email).catch((e) =>
      console.error('[Inquiries] Notification error:', e)
    )
  }

  // 12. Respond
  return NextResponse.json(
    {
      success:   true,
      id:        inquiry.id,
      type:      inquiry.type,
      message:   confirmationMessage(data.type, safeName),
      createdAt: inquiry.created_at,
    },
    {
      status: 201,
      headers: {
        'X-RateLimit-Limit':     String(RATE_LIMIT_MAX),
        'X-RateLimit-Remaining': String(rateResult.remaining),
        'X-RateLimit-Reset':     String(Math.ceil(rateResult.resetAt / 1000)),
      },
    }
  )
}

// ── GET — List inquiries (staff only) ────────────────────────────────────────

const ListQuerySchema = z.object({
  type:   z.enum(INQUIRY_TYPES).optional(),
  status: z.enum(INQUIRY_STATUSES).optional(),
  page:   z.coerce.number().int().min(1).optional().default(1),
  limit:  z.coerce.number().int().min(1).max(100).optional().default(20),
  search: z.string().max(100).optional(),
})

export async function GET(req: NextRequest): Promise<NextResponse> {
  const staffKey    = req.headers.get('x-staff-key')
  const expectedKey = process.env.STAFF_API_KEY

  if (!expectedKey || staffKey !== expectedKey) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 })
  }

  const searchParams = Object.fromEntries(req.nextUrl.searchParams.entries())
  const parsed       = ListQuerySchema.safeParse(searchParams)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid query parameters.', details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    )
  }

  const { type, status, page, limit, search } = parsed.data
  const offset = (page - 1) * limit

  const supabase = getSupabase()

  let query = supabase
    .from('inquiries')
    .select(
      'id, type, status, name, email, phone, country, message, meta, spam_score, created_at, replied_at, staff_notes',
      { count: 'exact' }
    )
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (type)   query = query.eq('type', type)
  if (status) query = query.eq('status', status)
  if (search) {
    query = query.or(
      `name.ilike.%${search}%,email.ilike.%${search}%,message.ilike.%${search}%`
    )
  }

  const { data, error, count } = await query

  if (error) {
    console.error('[Inquiries] List error:', error.message)
    return NextResponse.json({ error: 'Failed to fetch inquiries.' }, { status: 500 })
  }

  return NextResponse.json({
    data,
    pagination: {
      page,
      limit,
      total:      count ?? 0,
      totalPages: Math.ceil((count ?? 0) / limit),
    },
  })
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function confirmationMessage(type: InquiryType, name: string): string {
  const first = name.split(' ')[0]
  const msgs: Record<InquiryType, string> = {
    contact:    `Thank you, ${first}. We've received your message and will respond within 24 hours.`,
    spa:        `Thank you, ${first}. Your Arohamai Spa inquiry is with us. We'll confirm your treatment details shortly.`,
    restaurant: `Thank you, ${first}. Our farm-to-fork team will confirm your dining reservation soon.`,
    retreat:    `Thank you, ${first}. We're reviewing your retreat request and will send a personalised proposal.`,
    events:     `Thank you, ${first}. Our events team will reach out within 48 hours to begin planning.`,
  }
  return msgs[type]
}

async function queueNotification(
  inquiryId: string,
  type:      InquiryType,
  name:      string,
  email:     string
): Promise<void> {
  const webhookUrl = process.env.INQUIRY_WEBHOOK_URL
  if (!webhookUrl) return

  await fetch(webhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text:      `🌿 New ${type} inquiry from *${name}* (${email})`,
      inquiryId,
      type,
    }),
  })
}