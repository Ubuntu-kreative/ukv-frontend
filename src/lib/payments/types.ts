/**
 * Payment Domain — Types
 *
 * Covers: M-Pesa · Visa · Mastercard · Refunds
 * All monetary values are stored in the smallest currency unit (cents / KES subunits)
 * to avoid floating-point errors. Use `formatAmount()` for display.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Primitive Branded Types
// ─────────────────────────────────────────────────────────────────────────────

declare const __brand: unique symbol
type Brand<T, B> = T & { [__brand]: B }

/** Integer minor-unit amount, e.g. 1050 = KES 10.50 or USD 10.50 */
export type MinorAmount = Brand<number, 'MinorAmount'>

/** ISO 4217 currency code */
export type CurrencyCode = 'KES' | 'USD' | 'EUR' | 'GBP' | 'TZS' | 'UGX'

/** Opaque database UUID */
export type PaymentId   = Brand<string, 'PaymentId'>
export type RefundId    = Brand<string, 'RefundId'>
export type BookingId   = Brand<string, 'BookingId'>
export type GuestId     = Brand<string, 'GuestId'>

// ─────────────────────────────────────────────────────────────────────────────
// Payment Method Enums
// ─────────────────────────────────────────────────────────────────────────────

export const PAYMENT_METHODS = {
  MPESA:       'mpesa',
  VISA:        'visa',
  MASTERCARD:  'mastercard',
} as const

export type PaymentMethod = (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS]

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  mpesa:      'M-Pesa',
  visa:       'Visa',
  mastercard: 'Mastercard',
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment Status Enums
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Core payment lifecycle:
 *
 *  initiated → processing → completed
 *                        ↘ failed
 *                        ↘ cancelled
 *  completed → partially_refunded → fully_refunded
 *  completed → fully_refunded
 */
export const PAYMENT_STATUSES = {
  INITIATED:          'initiated',
  PROCESSING:         'processing',
  COMPLETED:          'completed',
  FAILED:             'failed',
  CANCELLED:          'cancelled',
  PARTIALLY_REFUNDED: 'partially_refunded',
  FULLY_REFUNDED:     'fully_refunded',
  PENDING_REVIEW:     'pending_review',   // fraud/compliance hold
} as const

export type PaymentStatus = (typeof PAYMENT_STATUSES)[keyof typeof PAYMENT_STATUSES]

/** Terminal statuses — no further transitions allowed */
export const TERMINAL_PAYMENT_STATUSES: ReadonlySet<PaymentStatus> = new Set([
  'failed',
  'cancelled',
  'fully_refunded',
])

/** Statuses that are eligible for refund */
export const REFUNDABLE_STATUSES: ReadonlySet<PaymentStatus> = new Set([
  'completed',
  'partially_refunded',
])

export const PAYMENT_STATUS_TRANSITIONS: Record<PaymentStatus, PaymentStatus[]> = {
  initiated:          ['processing', 'cancelled', 'failed'],
  processing:         ['completed', 'failed', 'pending_review'],
  completed:          ['partially_refunded', 'fully_refunded'],
  failed:             [],
  cancelled:          [],
  partially_refunded: ['partially_refunded', 'fully_refunded'],
  fully_refunded:     [],
  pending_review:     ['processing', 'cancelled', 'failed'],
}

// ─────────────────────────────────────────────────────────────────────────────
// Refund Status Enums
// ─────────────────────────────────────────────────────────────────────────────

export const REFUND_STATUSES = {
  REQUESTED:  'requested',
  PROCESSING: 'processing',
  COMPLETED:  'completed',
  FAILED:     'failed',
  REJECTED:   'rejected',
} as const

export type RefundStatus = (typeof REFUND_STATUSES)[keyof typeof REFUND_STATUSES]

export const REFUND_STATUS_TRANSITIONS: Record<RefundStatus, RefundStatus[]> = {
  requested:  ['processing', 'rejected'],
  processing: ['completed', 'failed'],
  completed:  [],
  failed:     ['processing'],   // allow retry
  rejected:   [],
}

// ─────────────────────────────────────────────────────────────────────────────
// Provider-Specific Detail Interfaces
// ─────────────────────────────────────────────────────────────────────────────

/** M-Pesa STK Push / Paybill details */
export interface MpesaPaymentDetails {
  method:               'mpesa'
  phone_number:         string          // E.164, e.g. +254712345678
  checkout_request_id?: string          // Safaricom STK push request ID
  merchant_request_id?: string
  mpesa_receipt_number?: string         // confirmed M-Pesa transaction code
  account_reference:    string          // shown on customer's phone
  transaction_desc?:    string
  result_code?:         number          // Safaricom result code
  result_desc?:         string
}

/** Visa / Mastercard (card) details — never store raw PAN; only last4 + token */
export interface CardPaymentDetails {
  method:          'visa' | 'mastercard'
  last_four:       string               // last 4 digits of PAN
  expiry_month:    number               // 1–12
  expiry_year:     number               // 4-digit year
  cardholder_name: string
  card_token:      string               // processor vault token (e.g. Stripe pm_xxx)
  fingerprint?:    string               // processor card fingerprint for dedup
  brand:           'visa' | 'mastercard'
  funding?:        'credit' | 'debit' | 'prepaid' | 'unknown'
  country?:        string               // issuer country (ISO 3166-1 alpha-2)
  three_ds?: {
    version:       string
    authenticated: boolean
    eci?:          string
  }
}

export type PaymentMethodDetails = MpesaPaymentDetails | CardPaymentDetails

// ─────────────────────────────────────────────────────────────────────────────
// Core Payment Record (maps to `payments` table)
// ─────────────────────────────────────────────────────────────────────────────

export interface Payment {
  id:                 PaymentId
  booking_id:         BookingId
  guest_id:           GuestId

  /** Processor-assigned transaction / charge ID */
  provider_payment_id?: string

  method:             PaymentMethod
  status:             PaymentStatus
  currency:           CurrencyCode

  /** Amount attempted (minor units) */
  amount:             MinorAmount

  /** Amount actually captured — may differ from `amount` on partial captures */
  amount_captured:    MinorAmount

  /** Sum of all completed refunds for this payment (minor units) */
  amount_refunded:    MinorAmount

  /** Processor fee charged (minor units) */
  fee_amount:         MinorAmount

  /** Net received: amount_captured - fee_amount - amount_refunded */
  net_amount:         MinorAmount

  /** Provider-specific data (union-typed) */
  method_details:     PaymentMethodDetails

  /** Free-form metadata from the initiating system */
  metadata:           Record<string, unknown>

  failure_code?:      string
  failure_message?:   string

  /** When the processor confirmed capture */
  paid_at?:           string            // ISO 8601

  created_at:         string
  updated_at:         string
}

// ─────────────────────────────────────────────────────────────────────────────
// Refund Record (maps to `refunds` table)
// ─────────────────────────────────────────────────────────────────────────────

export type RefundReason =
  | 'customer_request'
  | 'duplicate_payment'
  | 'fraudulent'
  | 'booking_cancelled'
  | 'service_not_provided'
  | 'partial_service'
  | 'other'

export interface Refund {
  id:                 RefundId
  payment_id:         PaymentId
  booking_id:         BookingId

  /** Processor refund transaction ID */
  provider_refund_id?: string

  status:             RefundStatus
  amount:             MinorAmount       // minor units, must be ≤ payment.amount_captured
  currency:           CurrencyCode

  reason:             RefundReason
  notes?:             string

  /** Who approved this refund */
  approved_by?:       string
  approved_at?:       string

  failure_code?:      string
  failure_message?:   string

  completed_at?:      string
  created_at:         string
  updated_at:         string
}

// ─────────────────────────────────────────────────────────────────────────────
// Payment Audit Log (maps to `payment_audit_logs` table)
// ─────────────────────────────────────────────────────────────────────────────

export type PaymentAuditAction =
  | 'payment.initiated'
  | 'payment.processing'
  | 'payment.completed'
  | 'payment.failed'
  | 'payment.cancelled'
  | 'payment.status_changed'
  | 'refund.requested'
  | 'refund.processing'
  | 'refund.completed'
  | 'refund.failed'
  | 'refund.rejected'
  | 'payment.webhook_received'
  | 'payment.manual_review'

export interface PaymentAuditLog {
  id:           string
  action:       PaymentAuditAction
  payment_id?:  PaymentId
  refund_id?:   RefundId
  booking_id?:  BookingId
  actor_id?:    string
  ip_address?:  string
  user_agent?:  string
  before_state?: Partial<Payment | Refund>
  after_state?:  Partial<Payment | Refund>
  metadata:     Record<string, unknown>
  created_at:   string
}

// ─────────────────────────────────────────────────────────────────────────────
// Service Input / Output DTOs
// ─────────────────────────────────────────────────────────────────────────────

export interface InitiatePaymentInput {
  booking_id:      BookingId
  guest_id:        GuestId
  amount:          MinorAmount
  currency:        CurrencyCode
  method:          PaymentMethod
  method_details:  PaymentMethodDetails
  metadata?:       Record<string, unknown>
}

export interface InitiatePaymentResult {
  payment:            Payment
  /** For M-Pesa: customer must approve STK push. For cards: payment may be immediate. */
  requires_action:    boolean
  action_type?:       'stk_push_pending' | 'redirect' | 'none'
  client_secret?:     string   // Stripe PaymentIntent client secret (card flows)
  stk_push_prompt?:  string   // Human-readable "Check your phone…" message
}

export interface ConfirmPaymentInput {
  payment_id:          PaymentId
  provider_payment_id: string
  /** Raw webhook payload from processor — stored verbatim */
  raw_webhook?:        Record<string, unknown>
}

export interface RequestRefundInput {
  payment_id:    PaymentId
  amount:        MinorAmount         // must be ≤ remaining refundable amount
  reason:        RefundReason
  notes?:        string
  requested_by:  string              // actor user ID
}

export interface RefundResult {
  refund:          Refund
  payment:         Payment           // updated payment record
  amount_remaining: MinorAmount      // how much more can still be refunded
}

// ─────────────────────────────────────────────────────────────────────────────
// Database Schema Representation (for generated Supabase types reference)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Describes the shape of each table row as stored in Postgres.
 * Monetary values are stored as integers (minor units).
 * method_details is a JSONB column.
 *
 * Relationships:
 *   bookings (1) ──< payments (1) ──< refunds
 *   guests   (1) ──< payments
 *   payments (1) ──< payment_audit_logs
 *   refunds  (1) ──< payment_audit_logs
 */
export interface DatabasePayment {
  id:                  string
  booking_id:          string
  guest_id:            string
  provider_payment_id: string | null
  method:              PaymentMethod
  status:              PaymentStatus
  currency:            CurrencyCode
  amount:              number
  amount_captured:     number
  amount_refunded:     number
  fee_amount:          number
  net_amount:          number
  method_details:      Record<string, unknown>   // JSONB
  metadata:            Record<string, unknown>   // JSONB
  failure_code:        string | null
  failure_message:     string | null
  paid_at:             string | null
  created_at:          string
  updated_at:          string
}

export interface DatabaseRefund {
  id:                  string
  payment_id:          string
  booking_id:          string
  provider_refund_id:  string | null
  status:              RefundStatus
  amount:              number
  currency:            CurrencyCode
  reason:              RefundReason
  notes:               string | null
  approved_by:         string | null
  approved_at:         string | null
  failure_code:        string | null
  failure_message:     string | null
  completed_at:        string | null
  created_at:          string
  updated_at:          string
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility
// ─────────────────────────────────────────────────────────────────────────────

/** Safely cast a plain number to MinorAmount after validating it's a safe integer */
export function toMinorAmount(value: number): MinorAmount {
  if (!Number.isInteger(value) || value < 0 || value > Number.MAX_SAFE_INTEGER) {
    throw new RangeError(`Invalid minor-unit amount: ${value}`)
  }
  return value as MinorAmount
}

/** Display helper: convert minor units → decimal string ("1050 KES" → "10.50") */
export function formatAmount(amount: MinorAmount, currency: CurrencyCode): string {
  const divisor = ZERO_DECIMAL_CURRENCIES.has(currency) ? 1 : 100
  return (amount / divisor).toFixed(divisor === 1 ? 0 : 2)
}

/** Currencies that do not use a sub-unit (stored as-is, no division by 100) */
export const ZERO_DECIMAL_CURRENCIES: ReadonlySet<CurrencyCode> = new Set([
  'KES', 'TZS', 'UGX',
])

/** Type-guard: is the payment card-based? */
export function isCardPayment(details: PaymentMethodDetails): details is CardPaymentDetails {
  return details.method === 'visa' || details.method === 'mastercard'
}

/** Type-guard: is the payment M-Pesa? */
export function isMpesaPayment(details: PaymentMethodDetails): details is MpesaPaymentDetails {
  return details.method === 'mpesa'
}
