// src/app/api/webhooks/stripe/route.ts
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-02-24' as any,
})

export async function POST(req: Request) {
  const body = await req.text() // Extract raw payload string for signature hashing validation
  const signature = req.headers.get('stripe-signature') || ''
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || ''

  let event: Stripe.Event

  try {
    // Perform strict secure cryptographic payload verification
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (err: any) {
    console.error(`[STRIPE_WEBHOOK_SIGNATURE_FAILED]: ${err.message}`)
    return NextResponse.json({ error: 'Signature verification failure' }, { status: 400 })
  }

  const transactionId = event.id
  console.log(`[STRIPE_WEBHOOK]: Processing validated event type: ${event.type} (${transactionId})`)

  try {
    switch (event.type) {
      // ── RECONCILIATION: ASYNCHRONOUS TRANSACTION SUCCESS ────────────────
      case 'payment_intent.succeeded': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const metadata = paymentIntent.metadata
        const finalChargeCollected = paymentIntent.amount_received / 100

        console.log(`[RECONCILIATION SUCCESS]: Intent ${paymentIntent.id} cleared KES ${finalChargeCollected}`)
        
        // TODO: Execute your secure backend fulfillment database transactions here:
        // await supabase.from('bookings').insert({
        //   stripe_payment_id: paymentIntent.id,
        //   status: 'confirmed_paid',
        //   guest_name: metadata.customerName,
        //   total_paid: finalChargeCollected
        // })
        break
      }

      // ── ERROR PROTECTION: ASYNCHRONOUS TRANSACTION FAILED ────────────────
      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object as Stripe.PaymentIntent
        const failureReason = paymentIntent.last_payment_error?.message || 'Unknown network friction'
        
        console.error(`[RECONCILIATION CRITICAL]: Intent ${paymentIntent.id} failed. Reason: ${failureReason}`)
        // TODO: Update database reservation status line to 'failed_payment' or send recovery email alert
        break
      }

      // ── AUDIT LINE: HANDLING REFUNDS VIA DASHBOARD OR API ────────────────
      case 'charge.refunded': {
        const charge = event.data.object as Stripe.Charge
        const totalRefunded = charge.amount_refunded / 100
        const paymentIntentId = typeof charge.payment_intent === 'string' ? charge.payment_intent : ''

        console.log(`[AUDIT LINE - REFUND DISPATCHED]: Charge ${charge.id} issued refund of KES ${totalRefunded}`)
        
        // TODO: Update tracking lines in your database to flag inventory recovery or booking cancellation
        // await supabase.from('bookings').update({ status: 'refunded', amount_returned: totalRefunded }).eq('stripe_payment_id', paymentIntentId)
        break
      }

      default:
        console.log(`[STRIPE_WEBHOOK]: Unhandled structured event notification trace: ${event.type}`)
    }

    return NextResponse.json({ received: true, processedId: transactionId })
  } catch (error: any) {
    console.error('[STRIPE_WEBHOOK_EXECUTION_FAULT]:', error)
    return NextResponse.json({ error: 'Webhook processing exception occurred' }, { status: 500 })
  }
}