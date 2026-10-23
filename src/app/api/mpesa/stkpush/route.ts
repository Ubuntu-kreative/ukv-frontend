import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { initiateStkPush, normalizeMpesaPhone } from '@/lib/mpesa-daraja'

export async function GET() {
  return NextResponse.json({ enabled: process.env.MPESA_ENABLED === 'true' })
}

export async function POST(request: Request) {
  if (process.env.MPESA_ENABLED !== 'true') {
    return NextResponse.json({ error: 'M-Pesa STK Push is disabled' }, { status: 404 })
  }

  try {
    const body = await request.json()
    const bookingId = typeof body.bookingId === 'string' ? body.bookingId : ''
    if (!bookingId) {
      return NextResponse.json({ error: 'A booking ID is required' }, { status: 400 })
    }

    let phone: string
    try {
      phone = normalizeMpesaPhone(body.phone)
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Invalid phone number' },
        { status: 400 },
      )
    }

    const db = getAdminClient()
    const { data: booking, error: bookingError } = await db
      .from('bookings')
      .select('id, booking_reference, guest_id, total_amount, currency, status')
      .eq('id', bookingId)
      .maybeSingle()

    if (bookingError) throw bookingError
    if (!booking || !['pending', 'pending_verification'].includes(booking.status)) {
      return NextResponse.json({ error: 'Booking is unavailable for payment' }, { status: 404 })
    }

    const bookingAmount = Number(booking.total_amount)
    if (!Number.isFinite(bookingAmount) || bookingAmount <= 0 || booking.currency !== 'KES') {
      return NextResponse.json({ error: 'Booking has an invalid M-Pesa amount or currency' }, { status: 400 })
    }
    const amount = Math.ceil(bookingAmount)

    const rateLimitSince = new Date(Date.now() - 10 * 60 * 1000).toISOString()
    const { count: recentPaymentCount, error: rateLimitError } = await db
      .from('payments')
      .select('id', { count: 'exact', head: true })
      .eq('booking_id', booking.id)
      .gte('created_at', rateLimitSince)

    if (rateLimitError) throw rateLimitError
    if ((recentPaymentCount ?? 0) >= 3) {
      return NextResponse.json(
        { error: 'Too many M-Pesa prompts for this booking. Please wait 10 minutes before retrying.' },
        { status: 429 },
      )
    }

    const { data: existingPayment, error: existingPaymentError } = await db
      .from('payments')
      .select('id, checkout_request_id, phone_number, status')
      .eq('booking_id', booking.id)
      .eq('method', 'mpesa')
      .in('status', ['pending', 'pending_review'])
      .maybeSingle()

    if (existingPaymentError) throw existingPaymentError
    if (existingPayment) {
      if (
        existingPayment.status === 'pending' &&
        existingPayment.checkout_request_id &&
        existingPayment.phone_number === phone
      ) {
        return NextResponse.json({
          success: true,
          bookingReference: booking.booking_reference,
          checkoutRequestId: existingPayment.checkout_request_id,
          customerMessage: 'Check your phone for the M-Pesa prompt.',
        })
      }
      return NextResponse.json({ error: 'A payment request is already pending for this booking' }, { status: 409 })
    }

    const { data: payment, error: paymentInsertError } = await db
      .from('payments')
      .insert({
        booking_id: booking.id,
        guest_id: booking.guest_id,
        method: 'mpesa',
        status: 'pending',
        currency: 'KES',
        amount,
        method_details: { method: 'mpesa', phone_number: phone, account_reference: booking.booking_reference },
      })
      .select('id')
      .single()

    if (paymentInsertError) throw paymentInsertError

    let stkResponse: Awaited<ReturnType<typeof initiateStkPush>>
    try {
      stkResponse = await initiateStkPush({
        phone,
        amount,
        accountReference: booking.booking_reference,
        transactionDesc: `Booking ${booking.booking_reference}`,
      })
    } catch (error) {
      const { error: paymentFailError } = await db
        .from('payments')
        .update({
          status: 'pending_review',
          manual_review_reason: 'STK request outcome is unknown; verify with Safaricom before retrying',
        })
        .eq('id', payment.id)
        .eq('status', 'pending')
      if (paymentFailError) {
        console.error('[M-Pesa STK] Could not mark failed payment:', paymentFailError)
      }
      console.error('[M-Pesa STK] Daraja request failed:', error)
      return NextResponse.json({ error: 'Could not start the M-Pesa payment request' }, { status: 502 })
    }

    if (
      stkResponse.ResponseCode !== '0' ||
      !stkResponse.CheckoutRequestID ||
      !stkResponse.MerchantRequestID
    ) {
      const { error: paymentFailError } = await db
        .from('payments')
        .update({
          status: 'failed',
          failure_code: stkResponse.ResponseCode ?? 'invalid_daraja_response',
          failure_message: stkResponse.ResponseDescription ?? 'Daraja did not accept the STK request',
        })
        .eq('id', payment.id)
        .eq('status', 'pending')
      if (paymentFailError) throw paymentFailError
      return NextResponse.json({ error: 'Safaricom did not accept the M-Pesa request' }, { status: 502 })
    }

    const { data: storedPayment, error: paymentUpdateError } = await db
      .from('payments')
      .update({
        checkout_request_id: stkResponse.CheckoutRequestID,
        merchant_request_id: stkResponse.MerchantRequestID,
        phone_number: phone,
      })
      .eq('id', payment.id)
      .eq('status', 'pending')
      .select('id')
      .maybeSingle()

    if (paymentUpdateError || !storedPayment) {
      if (paymentUpdateError) console.error('[M-Pesa STK] Could not store Safaricom request IDs:', paymentUpdateError)
      const { error: reviewError } = await db
        .from('payments')
        .update({
          status: 'pending_review',
          manual_review_reason: 'Safaricom accepted STK request but request IDs could not be stored',
        })
        .eq('id', payment.id)
        .eq('status', 'pending')
      if (reviewError) console.error('[M-Pesa STK] Could not flag unsaved request:', reviewError)
      return NextResponse.json({ error: 'Payment request needs manual verification' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      bookingReference: booking.booking_reference,
      checkoutRequestId: stkResponse.CheckoutRequestID,
      customerMessage: stkResponse.CustomerMessage ?? 'Check your phone for the M-Pesa prompt.',
    })
  } catch (error) {
    console.error('[M-Pesa STK] Request failed:', error)
    return NextResponse.json({ error: 'Could not start the M-Pesa payment request' }, { status: 500 })
  }
}
