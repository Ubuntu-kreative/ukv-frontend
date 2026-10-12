import { NextRequest, NextResponse } from 'next/server'
import { createClient }              from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) throw new Error('Missing Supabase env vars')
  return createClient(url, key, { auth: { persistSession: false } })
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const from = searchParams.get('from')
  const to   = searchParams.get('to')

  if (!from || !to) {
    return NextResponse.json(
      { error: 'Missing required params: from, to' },
      { status: 400 },
    )
  }

  // Basic ISO date validation
  const dateRe = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRe.test(from) || !dateRe.test(to)) {
    return NextResponse.json({ error: 'Dates must be YYYY-MM-DD' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    // Fetch total cottage count
    const { data: roomsData, error: roomsError } = await supabase
      .from('resources')
      .select('id')
      .eq('resource_type', 'cottage')

    if (roomsError) {
      console.error('[Availability API] rooms count error:', roomsError)
      return NextResponse.json({ error: 'Failed to fetch room count' }, { status: 500 })
    }

    const totalRooms = roomsData?.length ?? 0

    // Fetch active cottage bookings overlapping the window
    const { data: bookings, error: bErr } = await supabase
      .from('bookings')
      .select('id, resource_id, check_in_date, check_out_date, status')
      .in('status', ['confirmed', 'checked_in'])
      .lt('check_in_date', to)
      .gt('check_out_date', from)
      .in('resource_id', (roomsData ?? []).map(room => room.id))

    if (bErr) {
      console.error('[Availability API] bookings error:', bErr)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json(
      {
        bookings:    bookings    ?? [],
        maintenance: [],
        totalRooms,
        from,
        to,
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
        },
      },
    )

  } catch (err) {
    console.error('[Availability API] unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}