// src/app/api/mpesa/stkpush/route.ts

import { NextResponse } from 'next/server'
import { getAdminClient } from '@/lib/supabase/admin'
// ... other imports (e.g., Mpesa utils, environment variables)

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Local proxy function to bypass generic mapping inference limits
// ─────────────────────────────────────────────────────────────────────────────
function db(): any {
  return getAdminClient() as any
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    // ... validation logic ...

    const record = {
      merchant_request_id: body.MerchantRequestID,
      checkout_request_id: body.CheckoutRequestID,
      status: 'pending',
      amount: body.Amount,
    }

    // ─────────────────────────────────────────────────────────────────────────────
    // STEP 2: Replaced getAdminClient() with db() across the entire file
    // ─────────────────────────────────────────────────────────────────────────────
    const { data: existingTx, error: fetchError } = await db()
      .from('mpesa_transactions')
      .select('*')
      .eq('checkout_request_id', body.CheckoutRequestID)
      .single()

    if (!existingTx) {
      const { data, error: insertError } = await db()
        .from('mpesa_transactions')
        .insert(record)
        .select()
        .single()

      // STEP 3: Property access (data.id) automatically resolves because data is typed as any
      if (insertError) throw insertError
      console.log(`Transaction registered with ID: ${data.id}`)
    } else {
      // existingTx.status automatically resolves without type enforcement errors
      console.log(`Transaction already exists with status: ${existingTx.status}`)
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}