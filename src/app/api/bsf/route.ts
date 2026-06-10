// ─────────────────────────────────────────────────────────────────────────────
// src/app/api/bsf/checklist/route.ts
// GET  /api/bsf/checklist        — fetch all checklist states
// POST /api/bsf/checklist        — toggle a single item { id, completed }
// ─────────────────────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession }          from 'next-auth'
import { authOptions }               from '@/app/api/auth/[...nextauth]/route'
import { getAdminClient }            from '@/lib/supabase/admin'

// ── Auth guard ────────────────────────────────────────────────────────────────
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
    .from('bsf_checklist_items')
    .select('id, completed, completed_by, completed_at')
    .order('id')

  if (error) {
    console.error('[BSF checklist GET]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ items: data })
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const session = await requireAdmin()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json() as { id: string; completed: boolean }
  if (!body.id || typeof body.completed !== 'boolean') {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  const db = getAdminClient()
  const { error } = await db
    .from('bsf_checklist_items')
    .upsert({
      id:           body.id,
      completed:    body.completed,
      completed_by: body.completed ? (session.user.email ?? null) : null,
      completed_at: body.completed ? new Date().toISOString() : null,
      updated_at:   new Date().toISOString(),
    } as any)

  if (error) {
    console.error('[BSF checklist POST]', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}