import { timingSafeEqual } from 'node:crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
import { isSuccessfulDarajaResult, queryStkPush } from '@/lib/mpesa-daraja'

interface CallbackMetadataItem {
  Name: string
  Value?: string | number
}

interface MpesaCallbackPayload {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string
      CheckoutRequestID?: string
      ResultCode?: number
      ResultDesc?: string
      CallbackMetadata?: { Item?: CallbackMetadataItem[] }
    }
  }
}

function validCallbackToken(receivedToken: string | null): boolean {
  const expectedToken = process.env.MPESA_CALLBACK_TOKEN
  if (!expectedToken || !receivedToken) return false
  const expected = Buffer.from(expectedToken)
  const received = Buffer.from(receivedToken)
  return expected.length === received.length && timingSafeEqual(expected, received)
}

function metadataValue(items: CallbackMetadataItem[], name: string): string | number | undefined {
  return items.find(item => item.Name === name)?.Value
}

function parseAmount(value: string | number | undefined): number | null {
  if (typeof value === 'number' && Number.isSafeInteger(value)) return value
  if (typeof value === 'string' && /^\d+$/.test(value)) {
    const parsed = Number(value)
    return Number.isSafeInteger(parsed) ? parsed : null
  }
  return null
}

function accepted() {
  return NextResponse.json({ ResultCode: 0, ResultDesc: 'Callback received' })
}

export async function POST(req: NextRequest) {
  if (process.env.MPESA_ENABLED !== 'true') return accepted()

  if (!validCallbackToken(req.nextUrl.searchParams.get('token'))) {
    console.warn('[M-Pesa Callback] Rejected callback with invalid token')
    return accepted()
  }

  let payload: MpesaCallbackPayload
  try {
    payload = await req.json()
  } catch {
    console.error('[M-Pesa Callback] Invalid JSON')
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const callback = payload?.Body?.stkCallback
  const checkoutRequestId = callback?.CheckoutRequestID
  if (
    !callback ||
    typeof callback.MerchantRequestID !== 'string' ||
    typeof checkoutRequestId !== 'string' ||
    typeof callback.ResultCode !== 'number'
  ) {
    console.error('[M-Pesa Callback] Malformed payload')
    return NextResponse.json({ error: 'Malformed payload' }, { status: 400 })
  }

  const db = getAdminClient()
  const { data: payment, error: paymentFetchError } = await db
    .from('payments')
    .select('id, booking_id, amount, status, query_attempts')
    .eq('checkout_request_id', checkoutRequestId)
    .maybeSingle()

  if (paymentFetchError) {
    console.error('[M-Pesa Callback] Payment lookup failed:', paymentFetchError)
    return accepted()
  }
  if (!payment || payment.status !== 'pending') return accepted()

  if (callback.ResultCode !== 0) {
    const { error } = await db
      .from('payments')
      .update({
        status: 'failed',
        result_code: String(callback.ResultCode),
        result_desc: callback.ResultDesc ?? null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', payment.id)
      .eq('status', 'pending')
    if (error) console.error('[M-Pesa Callback] Failed to record unsuccessful result:', error)
    return accepted()
  }

  const items = callback.CallbackMetadata?.Item ?? []
  const paidAmount = parseAmount(metadataValue(items, 'Amount'))
  const receiptNumber = metadataValue(items, 'MpesaReceiptNumber')
  const normalizedReceipt = typeof receiptNumber === 'string' ? receiptNumber.trim() : ''
  const phoneNumber = metadataValue(items, 'PhoneNumber')
  const transactionDate = metadataValue(items, 'TransactionDate')

  const manualReviewReason = paidAmount !== payment.amount
    ? `Callback amount mismatch: expected ${payment.amount}, received ${paidAmount ?? 'missing'}`
    : !normalizedReceipt
      ? 'Successful callback omitted MpesaReceiptNumber'
      : null

  if (manualReviewReason) {
    const { error } = await db
      .from('payments')
      .update({ status: 'pending_review', manual_review_reason: manualReviewReason })
      .eq('id', payment.id)
      .eq('status', 'pending')
    if (error) console.error('[M-Pesa Callback] Failed to flag payment for review:', error)
    return accepted()
  }

  if (payment.query_attempts >= 5) {
    const { error } = await db
      .from('payments')
      .update({ manual_review_reason: 'STK Query attempt limit reached' })
      .eq('id', payment.id)
      .eq('status', 'pending')
    if (error) console.error('[M-Pesa Callback] Could not flag query limit:', error)
    return accepted()
  }

  const { data: queryAttempt, error: attemptError } = await db
    .from('payments')
    .update({
      query_attempts: payment.query_attempts + 1,
      query_last_attempt_at: new Date().toISOString(),
    })
    .eq('id', payment.id)
    .eq('status', 'pending')
    .eq('query_attempts', payment.query_attempts)
    .select('id')
    .maybeSingle()

  if (attemptError) {
    console.error('[M-Pesa Callback] Could not reserve query attempt:', attemptError)
    return accepted()
  }
  if (!queryAttempt) return accepted()

  let queryResult
  try {
    queryResult = await queryStkPush(checkoutRequestId)
  } catch (error) {
    console.error('[M-Pesa Callback] STK Query failed:', error)
    return accepted()
  }
  if (!isSuccessfulDarajaResult(queryResult)) {
    if (queryResult.ResultCode !== undefined && Number(queryResult.ResultCode) !== 0) {
      const { error } = await db
        .from('payments')
        .update({
          status: 'pending_review',
          result_code: String(queryResult.ResultCode),
          result_desc: queryResult.ResultDesc ?? 'STK Query did not confirm success',
          manual_review_reason: 'STK Query did not confirm a successful payment',
        })
        .eq('id', payment.id)
        .eq('status', 'pending')
      if (error) console.error('[M-Pesa Callback] Could not flag query result:', error)
    }
    return accepted()
  }

  const paidAt = new Date().toISOString()
  const { data: completedPayment, error: completeError } = await db
    .from('payments')
    .update({
      status: 'completed',
      amount_captured: paidAmount,
      provider_payment_id: normalizedReceipt,
      mpesa_receipt_number: normalizedReceipt,
      phone_number: phoneNumber === undefined ? null : String(phoneNumber),
      transaction_date: transactionDate === undefined ? null : String(transactionDate),
      result_code: '0',
      result_desc: callback.ResultDesc ?? queryResult.ResultDesc ?? null,
      manual_review_reason: null,
      paid_at: paidAt,
      updated_at: paidAt,
    })
    .eq('id', payment.id)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()

  if (completeError || !completedPayment) {
    if (completeError) console.error('[M-Pesa Callback] Could not complete payment:', completeError)
    return accepted()
  }

  const { error: receiptError } = await db
    .from('receipts')
    .insert({
      payment_id: payment.id,
      booking_id: payment.booking_id,
      mpesa_receipt: normalizedReceipt,
      amount: paidAmount,
      phone_number: phoneNumber === undefined ? null : String(phoneNumber),
      transaction_date: transactionDate === undefined ? null : String(transactionDate),
      checkout_request_id: checkoutRequestId,
      merchant_request_id: callback.MerchantRequestID,
      issued_at: paidAt,
    })

  if (receiptError) {
    console.error('[M-Pesa Callback] Receipt insertion failed:', receiptError)
    const { error } = await db
      .from('payments')
      .update({ status: 'pending_review', manual_review_reason: 'Payment succeeded but receipt persistence failed' })
      .eq('id', payment.id)
      .eq('status', 'completed')
    if (error) console.error('[M-Pesa Callback] Could not flag receipt failure:', error)
    return accepted()
  }

  const { data: confirmedBooking, error: bookingError } = await db
    .from('bookings')
    .update({ status: 'confirmed', updated_at: paidAt })
    .eq('id', payment.booking_id)
    .in('status', ['pending', 'pending_verification'])
    .select('id')
    .maybeSingle()

  if (bookingError || !confirmedBooking) {
    if (bookingError) console.error('[M-Pesa Callback] Booking confirmation failed:', bookingError)
    const { error } = await db
      .from('payments')
      .update({ status: 'pending_review', manual_review_reason: 'Payment succeeded but booking confirmation failed' })
      .eq('id', payment.id)
      .eq('status', 'completed')
    if (error) console.error('[M-Pesa Callback] Could not flag booking failure:', error)
  }

  return accepted()
}
