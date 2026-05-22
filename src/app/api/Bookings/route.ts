import { NextResponse } from 'next/server'

// ─────────────────────────────────────────────────────────────────────────────
// LOCAL INITIALIZATION CLIENT ENGINE PROXIES (Bypasses compilation generic locks)
// ─────────────────────────────────────────────────────────────────────────────

function getAuthClient() {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

function adminDb(): any {
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  ) as any
}

// ─────────────────────────────────────────────────────────────────────────────
// CORE ROUTING HTTP CONTROLLER IMPLEMENTATION
// ─────────────────────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  try {
    const supabase = getAuthClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized operational request context' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const guestId = searchParams.get('guestId')

    let query = adminDb().from('bookings').select('*')
    if (guestId) {
      query = query.eq('guest_id', guestId)
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
    const admin = adminDb()

    // Error Type 2 Override Configuration (Upsert parsing validation)
    const { data: guestRecord, error: guestError } = await admin
      .from('guests')
      .upsert(
        {
          email: input.guest.email.toLowerCase(),
          first_name: input.guest.firstName,
          last_name: input.guest.lastName,
          phone: input.guest.phone,
        } as any,
        { onConflict: 'email', ignoreDuplicates: false }
      )
      .select()
      .single()

    if (guestError) throw guestError

    const bookingPayload = {
      guest_id: guestRecord.id,
      room_id: input.booking.roomId,
      check_in: input.booking.checkIn,
      check_out: input.booking.checkOut,
      status: 'confirmed',
      total_price: input.booking.totalPrice,
    }

    const { data: booking, error: bookingError } = await admin
      .from('bookings')
      .insert(bookingPayload as any)
      .select()
      .single()

    if (bookingError) throw bookingError

    return NextResponse.json({ success: true, data: booking })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, updatePayload, action } = await request.json()
    const admin = adminDb()

    if (!id) {
      return NextResponse.json({ error: 'Missing target validation identifier mapping' }, { status: 400 })
    }

    // Error Type 3 System Overrides (Double tracking modification updates)
    if (action === 'cancel') {
      const { data: cancelledBooking, error: cancelError } = await admin
        .from('bookings')
        .update({
          status: 'cancelled' as string,
          updated_at: new Date().toISOString(),
        } as unknown as any)
        .eq('id', id)
        .select()
        .single()

      if (cancelError) throw cancelError
      return NextResponse.json({ success: true, data: cancelledBooking })
    }

    const { data: updatedBooking, error: updateError } = await admin
      .from('bookings')
      .update(updatePayload as unknown as any)
      .eq('id', id)
      .select()
      .single()

    if (updateError) throw updateError
    return NextResponse.json({ success: true, data: updatedBooking })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}