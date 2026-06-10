// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/bsf/production/route.ts
// GET  /api/bsf/production  — fetch weekly production log
// POST /api/bsf/production  — log a production week
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse }  from 'next/server'
import { getServerSession }           from 'next-auth'
import { authOptions }                from '@/app/api/auth/[...nextauth]/route'
import { getAdminClient }             from '@/lib/supabase/admin'
import type { Database }              from '@/types/supabase'

type ProductionInsert =
  Database['public']['Tables']['bsf_production_log']['Insert']

async function requireAdmin() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.isAdmin) return null
  return session
}

// ── GET ───────────────────────────────────────────────────────────────────────
export async function GET() {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getAdminClient()
  const { data, error } = await db
    .from('bsf_production_log')
    .select('*')
    .order('week_of', { ascending: false })
    .limit(26)  // six months of weekly logs

  if (error) {
    console.error('[BSF production GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ log: data })
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    week_of:        string
    eggs_kg:        number
    neonates_kg?:   number
    larvae_kg?:     number
    mortality_pct?: number
    feed_input_kg?: number
    notes?:         string
  }

  if (!body.week_of || body.eggs_kg == null) {
    return NextResponse.json(
      { error: 'week_of and eggs_kg are required' },
      { status: 400 }
    )
  }

  const row: ProductionInsert = {
    week_of:       body.week_of,
    eggs_kg:       body.eggs_kg,
    neonates_kg:   body.neonates_kg   ?? 0,
    larvae_kg:     body.larvae_kg     ?? 0,
    mortality_pct: body.mortality_pct ?? null,
    feed_input_kg: body.feed_input_kg ?? null,
    notes:         body.notes         ?? null,
    logged_by:     session.user.email ?? null,
  }

  const db = getAdminClient()
  const { data, error } = await db
    .from('bsf_production_log')
    .insert(row as any)
    .select()
    .single()

  if (error) {
    console.error('[BSF production POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ entry: data }, { status: 201 })
}