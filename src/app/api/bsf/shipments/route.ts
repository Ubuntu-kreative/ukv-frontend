// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/bsf/shipments/route.ts
// GET  /api/bsf/shipments   — fetch all shipments (newest first)
// POST /api/bsf/shipments   — create a new shipment entry
// ─────────────────────────────────────────────────────────────────────────────
import { NextRequest, NextResponse }  from 'next/server'
import { getServerSession }           from 'next-auth'
import { authOptions }                from '@/app/api/auth/[...nextauth]/route'
import { getAdminClient }             from '@/lib/supabase/admin'
import type { Database }              from '@/types/supabase'

type ShipmentInsert =
  Database['public']['Tables']['bsf_shipments']['Insert']

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
    .from('bsf_shipments')
    .select('*')
    .order('week_of', { ascending: false })
    .limit(52)  // one year of weekly shipments

  if (error) {
    console.error('[BSF shipments GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ shipments: data })
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as {
    week_of:          string   // ISO date string e.g. '2026-06-09'
    product_id:       string
    committed_kg:     number
    actual_kg?:       number
    qc_passed?:       boolean
    tracking_number?: string
    carrier?:         string
    notes?:           string
    dispatched_at?:   string
  }

  if (!body.week_of || !body.product_id || !body.committed_kg) {
    return NextResponse.json(
      { error: 'week_of, product_id and committed_kg are required' },
      { status: 400 }
    )
  }

  const row: ShipmentInsert = {
    week_of:         body.week_of,
    product_id:      body.product_id,
    committed_kg:    body.committed_kg,
    actual_kg:       body.actual_kg       ?? null,
    qc_passed:       body.qc_passed       ?? null,
    tracking_number: body.tracking_number ?? null,
    carrier:         body.carrier         ?? null,
    notes:           body.notes           ?? null,
    dispatched_at:   body.dispatched_at   ?? null,
    created_by:      session.user.email   ?? null,
  }

  const db = getAdminClient()
  const { data, error } = await db
    .from('bsf_shipments')
    .insert(row as any)
    .select()
    .single()

  if (error) {
    console.error('[BSF shipments POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ shipment: data }, { status: 201 })
}