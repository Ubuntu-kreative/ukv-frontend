import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAdminClient } from '@/lib/supabase/admin'
import { calculateBookingPrice } from '@/lib/booking-pricing'

// ─────────────────────────────────────────────────────────────────────────────
// AUTHORIZATION HELPER
// ─────────────────────────────────────────────────────────────────────────────

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) {
    return null
  }
  return session
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE ROUTING HTTP CONTROLLER IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const db = getAdminClient()
    const { searchParams } = new URL(request.url)
    const guestId = searchParams.get('guestId')
    const status = searchParams.get('status')

    let query = db.from('bookings').select('*, guests(first_name, last_name, email)')
    if (guestId) {
      query = query.eq('guest_id', guestId)
    }
    if (status) {
      query = query.eq('status', status)
    }

    const { data: bookings, error } = await query

    if (error) throw error
    return NextResponse.json({ success: true, data: bookings })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const input = await request.json()
    const db = getAdminClient()
    const contact = input.contact
    const bookingInput = input.booking ?? {}
    const checkIn = bookingInput.checkIn ?? input.checkIn
    const checkOut = bookingInput.checkOut ?? input.checkOut
    const paymentReference = String(input.paymentReference ?? '').trim().toUpperCase()
    const mpesaEnabled = process.env.MPESA_ENABLED === 'true'
    const isMpesaStk = input.payment?.method === 'mpesa' && mpesaEnabled

    if (!contact?.name?.trim() || !contact?.email?.trim() || !checkIn || !checkOut || (!isMpesaStk && !paymentReference)) {
      return NextResponse.json({ error: 'Guest details, booking dates, and an M-Pesa confirmation code are required.' }, { status: 400 })
    }

    let pricing: ReturnType<typeof calculateBookingPrice>
    try {
      pricing = calculateBookingPrice({
        items: input.items,
        checkIn,
        checkOut,
        guests: input.guests ?? 1,
      })
    } catch (error) {
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Could not calculate booking total' },
        { status: 400 },
      )
    }

    const clientTotal = Number(input.totalAmount)
    if (!Number.isSafeInteger(clientTotal) || clientTotal <= 0) {
      return NextResponse.json({ error: 'A valid cart total is required.' }, { status: 400 })
    }

    const priceDifference = Math.abs(clientTotal - pricing.totalAmount)
    if (mpesaEnabled && priceDifference > 1) {
      return NextResponse.json({
        error: `Your cart total (KES ${clientTotal.toLocaleString()}) does not match the current server total (KES ${pricing.totalAmount.toLocaleString()}). Refresh your cart and try again.`,
      }, { status: 400 })
    }
    if (!mpesaEnabled) {
      console.info('[Bookings] Cart/server price comparison', {
        serverTotal: pricing.totalAmount,
        ...(priceDifference > 0 ? { clientTotal, difference: priceDifference } : {}),
      })
    }
    const bookingTotal = mpesaEnabled ? pricing.totalAmount : clientTotal

    if (!pricing.resourceKey) {
      return NextResponse.json({ error: 'A cottage booking is required.' }, { status: 400 })
    }

    const { data: resource, error: resourceError } = await db
      .from('resources')
      .select('id')
      .or(`id.eq.${pricing.resourceKey},resource_key.eq.${pricing.resourceKey}`)
      .eq('resource_type', 'cottage')
      .eq('is_active', true)
      .maybeSingle()

    if (resourceError || !resource) {
      return NextResponse.json({ error: 'The selected cottage is not available for booking.' }, { status: 409 })
    }
    const resolvedResourceId = (resource as unknown as { id: string }).id

    const { data: guestRecord, error: guestError } = await db
      .from('guests')
      .upsert(
        {
          email: contact.email.toLowerCase(),
          first_name: contact.name.trim().split(/\s+/)[0],
          last_name: contact.name.trim().split(/\s+/).slice(1).join(' ') || 'Guest',
          phone: contact.phone || null,
        } as any,
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (guestError) throw guestError

    const bookingReference = `UKV-${Date.now()}`
    const bookingPayload = {
      booking_reference: bookingReference,
      guest_id: (guestRecord as any)?.id,
      resource_id: resolvedResourceId,
      check_in_date: checkIn,
      check_out_date: checkOut,
      adults: input.guests ?? 1,
      children: 0,
      rate_per_night: pricing.ratePerNight,
      total_amount: bookingTotal,
      currency: 'KES',
      payment_reference: paymentReference || null,
      submitted_at: new Date().toISOString(),
      notes: input.specialRequests || null,
      status: isMpesaStk ? 'pending' : 'pending_verification',
    }

    const { data: booking, error: bookingError } = await db
      .from('bookings')
      .insert(bookingPayload as any)
      .select()
      .single()

    if (bookingError) throw bookingError

    return NextResponse.json({
      success: true,
      data: booking,
      referenceNumber: bookingReference,
      message: isMpesaStk
        ? 'Your booking is pending M-Pesa payment.'
        : 'Your booking request has been received and is pending payment verification. We\'ll confirm your reservation shortly.',
    }, { status: 201 })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { id, updatePayload, action } = await request.json()
    const db = getAdminClient()

    if (!id) {
      return NextResponse.json({ error: 'Missing booking ID' }, { status: 400 })
    }

    if (action === 'cancel') {
      const { data: cancelledBooking, error: cancelError } = await (db as any)
        .from('bookings')
        .update({
          status: 'cancelled' as string,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single()

      if (cancelError) throw cancelError
      return NextResponse.json({ success: true, data: cancelledBooking })
    }

    if (action === 'confirm_payment' || action === 'reject_payment') {
      const updatePayload = action === 'confirm_payment'
        ? { status: 'confirmed' }
        : { status: 'payment_rejected', cancellation_reason: 'M-Pesa payment could not be verified.' }
      const { data: reviewedBooking, error: reviewError } = await (db as any)
        .from('bookings')
        .update({ ...updatePayload, updated_at: new Date().toISOString() })
        .eq('id', id)
        .eq('status', 'pending_verification')
        .select()
        .single()

      if (reviewError) throw reviewError
      return NextResponse.json({ success: true, data: reviewedBooking })
    }

    const { data: updatedBooking, error: updateError } = await (db as any)
      .from('bookings')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError
    return NextResponse.json({ success: true, data: updatedBooking })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}