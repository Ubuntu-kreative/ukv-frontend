// ── Product Types ──────────────────────────────────────────────────────
export type ProductCategory =
  | 'cottage'
  | 'spa'
  | 'dining'
  | 'farm-walk'
  | 'farm-animal'
  | 'farm-workshop'
  | 'farm-harvest'
  | 'event-package'
  | 'event-public'
  | 'day-pass'

export interface Product {
  id: string
  name: string
  tag: string
  category: ProductCategory
  description: string
  longDescription?: string
  price: number
  unit: string
  sticker?: string
  featured?: boolean
  capacity?: number
  duration?: string
  includes?: string[]
  images?: string[]
  available?: boolean
}

// ── Cart Types ─────────────────────────────────────────────────────────
export interface CartItem {
  id: string
  productId: string
  name: string
  category: ProductCategory
  tag: string
  price: number
  unit: string
  quantity: number
  checkIn?: string
  checkOut?: string
  guests?: number
  notes?: string
}

export interface CartState {
  items: CartItem[]
  checkIn: string
  checkOut: string
  guests: number
  isOpen: boolean
}

// ── Booking / Inquiry ─────────────────────────────────────────────────
export type PaymentMethod = 'mpesa' | 'card'
export type CheckoutMode = 'payment' | 'inquiry'

export interface BookingContact {
  name: string
  email: string
  phone: string
}

export interface MpesaPayment {
  method: 'mpesa'
  phone: string
}

export interface CardPayment {
  method: 'card'
  cardNumber: string
  expiry: string
  cvv: string
  cardName: string
}

export type PaymentDetails = MpesaPayment | CardPayment

export interface BookingPayload {
  contact: BookingContact
  items: CartItem[]
  checkIn: string
  checkOut: string
  guests: number
  payment: PaymentDetails
  totalAmount: number
  specialRequests?: string
}

export interface InquiryPayload {
  contact: BookingContact
  items: CartItem[]
  checkIn?: string
  checkOut?: string
  guests?: number
  message: string
  totalEstimate: number
  eventType?: string
}

export interface BookingResponse {
  success: boolean
  referenceNumber: string
  message: string
  booking?: {
    id: string
    status: 'confirmed' | 'pending' | 'failed'
    mpesaPromptSent?: boolean
  }
}

// ── Events ────────────────────────────────────────────────────────────
export type EventType = 'corporate' | 'wedding' | 'creative' | 'community' | 'public'

export interface VillageEvent {
  id: string
  name: string
  type: EventType
  date: string
  day: number
  month: number
  year: number
  price: number
  description: string
  capacity: number
  spotsLeft?: number
}

// ── Calendar ──────────────────────────────────────────────────────────
export interface CalendarDay {
  date: number
  hasEvent: boolean
  isPrivateBooking: boolean
  isAvailable: boolean
  events: VillageEvent[]
}
