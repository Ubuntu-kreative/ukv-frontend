// src/app/api/mpesa/callback/route.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — M-Pesa STK Push Callback Handler
//
// Flow:
//   1. Safaricom POST → this endpoint after STK push completes
//   2. Verify the payload structure is valid
//   3. Parse CallbackMetadata (Amount, MpesaReceiptNumber, PhoneNumber, etc.)
//   4. Update `payments` table  → status paid / failed
//   5. Update `bookings` table  → status confirmed / payment_failed
//   6. Insert `receipts` table  → permanent receipt record
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'

// ── Supabase admin client (service role — never expose to browser) ────────────
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !key) {
    throw new Error('Missing Supabase env vars: NEXT_PUBLIC_SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY')
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  })
}

// ── M-Pesa payload types ──────────────────────────────────────────────────────
interface CallbackMetadataItem {
  Name:  string
  Value?: string | number
}

interface StkCallback {
  MerchantRequestID: string
  CheckoutRequestID: string
  ResultCode:        number   // 0 = success, anything else = failure
  ResultDesc:        string
  CallbackMetadata?: {
    Item: CallbackMetadataItem[]
  }
}

interface MpesaCallbackPayload {
  Body: {
    stkCallback: StkCallback
  }
}

// ── Helper: extract a value from CallbackMetadata by name ────────────────────
function getMeta(
  items: CallbackMetadataItem[],
  name:  string,
): string | number | undefined {
  return items.find(i => i.Name === name)?.Value
}

// ── POST handler ──────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  let payload: MpesaCallbackPayload

  // 1. Parse & validate JSON payload
  try {
    payload = await req.json()
  } catch {
    console.error('[M-Pesa Callback] Invalid JSON')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const callback = payload?.Body?.stkCallback

  if (
    !callback ||
    typeof callback.MerchantRequestID !== 'string' ||
    typeof callback.CheckoutRequestID !== 'string' ||
    typeof callback.ResultCode        !== 'number'
  ) {
    console.error('[M-Pesa Callback] Malformed payload:', payload)
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 })
  }

  const {
    MerchantRequestID: merchantRequestId,
    CheckoutRequestID: checkoutRequestId,
    ResultCode:        resultCode,
    ResultDesc:        resultDesc,
    CallbackMetadata,
  } = callback

  const isSuccess = resultCode === 0
  console.log(`[M-Pesa Callback] ${checkoutRequestId} — ${isSuccess ? 'SUCCESS' : 'FAILED'} (${resultDesc})`)

  // 2. Parse metadata (only present on success)
  const items = CallbackMetadata?.Item ?? []

  const amount        = getMeta(items, 'Amount')        as number | undefined
  const receiptNumber = getMeta(items, 'MpesaReceiptNumber') as string | undefined
  const transactionDate = getMeta(items, 'TransactionDate')  as string | undefined
  const phoneNumber   = getMeta(items, 'PhoneNumber')   as string | undefined

  let supabase: ReturnType<typeof getSupabase>
  try {
    supabase = getSupabase()
  } catch (err) {
    console.error('[M-Pesa Callback] Supabase init failed:', err)
    return NextResponse.json({ error: 'Server config error' }, { status: 500 })
  }

  // 3. Find the payment record by CheckoutRequestID
  const { data: payment, error: paymentFetchError } = await supabase
    .from('payments')
    .select('id, booking_id, amount')
    .eq('checkout_request_id', checkoutRequestId)
    .single()

  if (paymentFetchError || !payment) {
    console.error('[M-Pesa Callback] Payment not found for CheckoutRequestID:', checkoutRequestId)
    // Still return 200 so Safaricom doesn't retry endlessly
    return NextResponse.json({ message: 'Payment record not found' }, { status: 200 })
  }

  // 4. Update payment record
  const paymentUpdate = isSuccess
    ? {
        status:           'paid',
        mpesa_receipt:    receiptNumber   ?? null,
        phone_number:     phoneNumber     ?? null,
        paid_amount:      amount          ?? payment.amount,
        transaction_date: transactionDate ?? null,
        merchant_request_id: merchantRequestId,
        result_desc:      resultDesc,
        updated_at:       new Date().toISOString(),
      }
    : {
        status:           'failed',
        result_code:      resultCode,
        result_desc:      resultDesc,
        merchant_request_id: merchantRequestId,
        updated_at:       new Date().toISOString(),
      }

  const { error: paymentUpdateError } = await supabase
    .from('payments')
    .update(paymentUpdate)
    .eq('id', payment.id)

  if (paymentUpdateError) {
    console.error('[M-Pesa Callback] Failed to update payment:', paymentUpdateError)
  }

  // 5. Update booking record
  if (payment.booking_id) {
    const bookingUpdate = isSuccess
      ? {
          status:     'confirmed',
          updated_at: new Date().toISOString(),
        }
      : {
          status:     'payment_failed',
          updated_at: new Date().toISOString(),
        }

    const { error: bookingUpdateError } = await supabase
      .from('bookings')
      .update(bookingUpdate)
      .eq('id', payment.booking_id)

    if (bookingUpdateError) {
      console.error('[M-Pesa Callback] Failed to update booking:', bookingUpdateError)
    }
  }

  // 6. Generate receipt record (success only)
  if (isSuccess && receiptNumber) {
    const receipt = {
      payment_id:       payment.id,
      booking_id:       payment.booking_id ?? null,
      mpesa_receipt:    receiptNumber,
      amount:           amount ?? payment.amount,
      phone_number:     phoneNumber ?? null,
      transaction_date: transactionDate ?? null,
      checkout_request_id: checkoutRequestId,
      merchant_request_id: merchantRequestId,
      issued_at:        new Date().toISOString(),
    }

    const { error: receiptError } = await supabase
      .from('receipts')
      .insert(receipt)

    if (receiptError) {
      // Non-fatal — payment is already marked paid
      console.error('[M-Pesa Callback] Failed to insert receipt:', receiptError)
    } else {
      console.log(`[M-Pesa Callback] Receipt generated: ${receiptNumber}`)
    }
  }

  // Always return 200 — Safaricom retries on non-200
  return NextResponse.json({
    ResultCode: 0,
    ResultDesc: 'Callback processed successfully',
  })
}