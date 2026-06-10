// src/app/api/checkout/stripe-intent/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

// Initialize Stripe lazily if the secret key is available.
// This prevents build-time collection from failing when env vars are not present.
const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-02-24' as any,
    })
  : null

const SERVICE_CHARGE_RATE = 0.10
const VAT_RATE = 0.16

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: 'Stripe is not configured. STRIPE_SECRET_KEY is missing.' },
      { status: 500 }
    )
  }
  try {
    const { items, checkIn, checkOut, guests, customerInfo } = await req.json()

    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart selection is empty' }, { status: 400 })
    }

    // Server-side financial total recalculation to block client mutation attacks
    const subtotal = items.reduce((sum: number, item: any) => {
      const price = typeof item.price === 'number' && isFinite(item.price) ? item.price : 0
      return sum + price * item.qty
    }, 0)

    const serviceCharge = Math.round(subtotal * SERVICE_CHARGE_RATE)
    const vat = Math.round(subtotal * VAT_RATE)
    const grandTotalKES = subtotal + serviceCharge + vat

    if (grandTotalKES <= 0) {
      return NextResponse.json({ error: 'Invalid transactional amount calculated' }, { status: 400 })
    }

    // Stripe processes minimum fractional units. Convert KES explicitly to cents/subunits.
    const fractionalAmount = Math.round(grandTotalKES * 100)

    // Create a Payment Intent configured to collect automated payment methods
    const paymentIntent = await stripe.paymentIntents.create({
      amount: fractionalAmount,
      currency: 'kes',
      automatic_payment_methods: {
        enabled: true, // Auto-activates Cards, Apple Pay, Google Pay based on Stripe Dashboard config
      },
      receipt_email: customerInfo.email,
      metadata: {
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone || 'N/A',
        checkIn: checkIn || 'N/A',
        checkOut: checkOut || 'N/A',
        guests: String(guests || 2),
        // Compress inventory line items mapping for webhook visibility
        manifestSummary: items.map((i: any) => `${i.name} (x${i.qty})`).join(', ').slice(0, 480),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
      amount: grandTotalKES,
    })
  } catch (error: any) {
    console.error('[STRIPE_INTENT_ERROR]:', error)
    return NextResponse.json(
      { error: error.message || 'Internal payment configuration failure' },
      { status: 500 }
    )
  }
}