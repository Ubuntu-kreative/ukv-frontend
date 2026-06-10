import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { getAdminClient } from '@/lib/supabase/admin'

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

    let query = db.from('bookings').select('*')
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
    const session = await requireAdmin()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const input = await request.json()
    const db = getAdminClient()

    const { data: guestRecord, error: guestError } = await db
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
      guest_id: (guestRecord as any)?.id,
      room_id: input.booking.roomId,
      check_in: input.booking.checkIn,
      check_out: input.booking.checkOut,
      status: 'confirmed',
      total_price: input.booking.totalPrice,
    }

    const { data: booking, error: bookingError } = await db
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