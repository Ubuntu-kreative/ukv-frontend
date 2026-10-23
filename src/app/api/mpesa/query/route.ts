import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAdminClient } from '@/lib/supabase/admin'
import { isSuccessfulDarajaResult, queryStkPush } from '@/lib/mpesa-daraja'

const MAX_QUERY_ATTEMPTS = 5

export async function POST(request: Request) {
  if (process.env.MPESA_ENABLED !== 'true') {
    return NextResponse.json({ error: 'M-Pesa STK Push is disabled' }, { status: 404 })
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const paymentId = typeof body.paymentId === 'string' ? body.paymentId : ''
    if (!paymentId) {
      return NextResponse.json({ error: 'A payment ID is required' }, { status: 400 })
    }

    const db = getAdminClient()
    const { data: payment, error: paymentError } = await db
      .from('payments')
      .select('id, checkout_request_id, status, query_attempts')
      .eq('id', paymentId)
      .maybeSingle()

    if (paymentError) throw paymentError
    if (!payment || payment.status !== 'pending' || !payment.checkout_request_id) {
      return NextResponse.json({ error: 'Pending payment with a CheckoutRequestID not found' }, { status: 404 })
    }
    if (payment.query_attempts >= MAX_QUERY_ATTEMPTS) {
      return NextResponse.json({ error: 'STK Query attempt limit reached' }, { status: 429 })
    }

    const { data: reservedAttempt, error: attemptError } = await db
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

    if (attemptError) throw attemptError
    if (!reservedAttempt) {
      return NextResponse.json({ error: 'Payment changed or another query is in progress' }, { status: 409 })
    }

    const result = await queryStkPush(payment.checkout_request_id)
    const success = isSuccessfulDarajaResult(result)
    const manualReviewReason = success
      ? 'STK Query reports success; callback amount and receipt are still required before confirmation'
      : result.ResultCode === undefined
        ? 'STK Query did not return a transaction result'
        : 'STK Query did not confirm success'

    const { error: resultUpdateError } = await db
      .from('payments')
      .update({
        result_code: result.ResultCode === undefined ? null : String(result.ResultCode),
        result_desc: result.ResultDesc ?? result.ResponseDescription ?? null,
        manual_review_reason: manualReviewReason,
      })
      .eq('id', payment.id)
      .eq('status', 'pending')

    if (resultUpdateError) throw resultUpdateError

    return NextResponse.json({
      success,
      status: 'pending',
      attemptsRemaining: MAX_QUERY_ATTEMPTS - payment.query_attempts - 1,
      message: success
        ? 'Safaricom reports success, but confirmation requires the callback receipt and amount.'
        : 'Safaricom has not confirmed a successful transaction.',
    })
  } catch (error) {
    console.error('[M-Pesa Query] Request failed:', error)
    return NextResponse.json({ error: 'Could not query the M-Pesa payment' }, { status: 500 })
  }
}
