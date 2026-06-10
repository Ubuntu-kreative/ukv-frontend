// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { getAdminClient } from '@/lib/supabase/admin'

function getStripeClient() {
  const secretKey = process.env.STRIPE_SECRET_KEY
  if (!secretKey) return null

  return new Stripe(secretKey, {
    apiVersion: '2025-02-24' as any,
  })
}

export async function POST(req: Request) {
  const stripe = getStripeClient()
  if (!stripe) {
    console.error('[STRIPE_WEBHOOK_ERROR] Missing STRIPE_SECRET_KEY')
    return NextResponse.json(
      { error: 'Stripe is not configured' },
      { status: 500 }
    )
  }

  const body = await req.text()
  const signature = req.headers.get('stripe-signature') || ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK_SIGNATURE_FAILED]: ${err.message}`)
    return NextResponse.json({ error: 'Signature verification failed' }, { status: 400 })
  }

  const transactionId = event.id
  console.log(`[STRIPE_WEBHOOK]: Processing event: ${event.type} (${transactionId})`)

  try {
    const db = getAdminClient()

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const metadata = paymentIntent.metadata
        const amountReceived = paymentIntent.amount_received / 100

        console.log(`[PAYMENT_SUCCESS]: Intent ${paymentIntent.id} for KES ${amountReceived}`)

        if (metadata?.bookingId) {
          const { error } = await (db as any)
            .from('bookings')
            .update({
              status: 'confirmed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', metadata.bookingId)

          if (error) {
            console.error('[PAYMENT_UPDATE_ERROR]:', error)
            return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
          }
        }
        break
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const failureReason = paymentIntent.last_payment_error?.message || 'Unknown error'

        console.error(`[PAYMENT_FAILED]: Intent ${paymentIntent.id}: ${failureReason}`)

        if (paymentIntent.metadata?.bookingId) {
          const { error } = await (db as any)
            .from('bookings')
            .update({
              status: 'payment_failed',
              updated_at: new Date().toISOString(),
            })
            .eq('id', paymentIntent.metadata.bookingId)

          if (error) {
            console.error('[PAYMENT_FAILURE_UPDATE_ERROR]:', error)
          }
        }
        break
      }

      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const amountRefunded = charge.amount_refunded / 100
        const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : ''

        console.log(`[REFUND_PROCESSED]: Charge ${charge.id} refunded KES ${amountRefunded}`)

        if (paymentIntentId) {
          const { error } = await (db as any)
            .from('bookings')
            .update({
              status: 'refunded',
              updated_at: new Date().toISOString(),
            })
            .eq('stripe_payment_id', paymentIntentId)

          if (error) {
            console.error('[REFUND_UPDATE_ERROR]:', error)
          }
        }
        break
      }

      default:
        console.log(`[STRIPE_WEBHOOK]: Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true, processedId: transactionId })
  } catch (error: any) {
    console.error('[STRIPE_WEBHOOK_ERROR]:', error)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}