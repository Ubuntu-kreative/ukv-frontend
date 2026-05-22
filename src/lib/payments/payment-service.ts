// src/lib/payments/payment-service.ts

import { getAdminClient } from '@/lib/supabase/admin'
// ... other imports (e.g., DatabasePayment, rowToPayment, etc.)

// ─────────────────────────────────────────────────────────────────────────────
// STEP 1: Explicit abstract proxy wrapper for Supabase service routines
// ─────────────────────────────────────────────────────────────────────────────
function getAdmin(): any {
  return getAdminClient() as any
}

// Example internal utility function
async function audit(logData: any) {
  // STEP 2: Replaced getAdminClient() with getAdmin()
  await getAdmin().from('payment_audit_logs').insert(logData)
}

export class PaymentService {
  
  static async initiatePayment(params: any) {
    // STEP 3: Replaced const admin = getAdminClient()
    const admin = getAdmin()
    
    // ... execution logic ...
    
    // STEP 4: Double Type Assertion (fixes strict layout matching errors)
    // Find lines around 235, 253, 270, 282, 318 and apply:
    const paymentResult = rowToPayment(updated as unknown as DatabasePayment)
    
    return paymentResult
  }

  static async processRefund(params: any) {
    const admin = getAdmin() // Replaced
    
    const { data: refundRow, error } = await admin
      .from('payment_refunds')
      .insert(params)
      .single()

    // STEP 5: refundRow.id will no longer throw an error because 
    // getAdmin() returns `any`, breaking the `never` inference loop.
    if (refundRow) {
      const logId = refundRow.id
    }
  }
}