// src/lib/audit.ts
// ─────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Unified Operations Audit Ledger
// Production v1.0.0
// ─────────────────────────────────────────────────────────────────────

import { createClient } from '@supabase/supabase-js'

// Initialize server-side administrative Supabase context to bypass RLS policies on log appending
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '', // Must utilize service-role key to prevent ledger manipulation
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  }
)

export type AuditCategory = 'BOOKING_CHANGE' | 'PAYMENT_CHANGE' | 'ADMIN_ACTION'

export type AuditActionType =
  // Booking Changes
  | 'BOOKING_CREATE'
  | 'BOOKING_DATE_AMEND'
  | 'BOOKING_ROOM_SWAP'
  | 'BOOKING_CANCEL'
  | 'BOOKING_UPGRADE'
  // Payment Changes
  | 'PAYMENT_INTENT_INIT'
  | 'PAYMENT_STK_PUSH_DISPATCH'
  | 'PAYMENT_RECONCILED'
  | 'PAYMENT_REFUND_ISSUED'
  | 'PAYMENT_CHARGE_REVERSED'
  // Admin Actions
  | 'ADMIN_INVENTORY_OVERRIDE'
  | 'ADMIN_RATE_MUTATION'
  | 'ADMIN_USER_BAN'
  | 'ADMIN_METADATA_PURGE'

export interface AuditUserContext {
  id: string
  email: string
  role: 'admin' | 'manager' | 'guest' | 'system_node'
  ipAddress?: string
  userAgent?: string
}

export interface AuditLogPayload {
  category: AuditCategory
  action: AuditActionType
  user: AuditUserContext
  entityId: string          // e.g., booking_id, payment_intent_id, cottage_id
  before: Record<string, any> | null
  after: Record<string, any> | null
  meta?: Record<string, any> // Flexible secondary contextual properties (e.g. tracking references)
}

/**
 * AuditTrailManager
 * Core pipeline to write tracking data directly to your remote state engine.
 */
export class AuditTrailManager {
  /**
   * Dispatches an immutable log trace record directly to the data lake table.
   */
  static async log(payload: AuditLogPayload): Promise<{ success: boolean; logId?: string; error?: string }> {
    const timestamp = new Date().toISOString()

    try {
      // 1. Structural Sanity Verification & Compaction
      const formattedEntry = {
        category: payload.category,
        action: payload.action,
        entity_id: payload.entityId,
        actor_id: payload.user.id,
        actor_email: payload.user.email,
        actor_role: payload.user.role,
        state_before: payload.before ? JSON.stringify(payload.before) : null,
        state_after: payload.after ? JSON.stringify(payload.after) : null,
        ip_address: payload.user.ipAddress || null,
        user_agent: payload.user.userAgent || null,
        metadata: payload.meta ? { ...payload.meta } : {},
        timestamp: timestamp,
      }

      // 2. Transmit to data layer utilizing security-defended connection bypass
      const { data, error } = await supabaseAdmin
        .from('operation_audit_ledger')
        .insert([formattedEntry])
        .select('id')
        .single()

      if (error) {
        console.error(`[AUDIT_CRITICAL_FAILURE]: Data write failed for action ${payload.action}:`, error.message)
        // Fault tolerance fallback: Pipe logs to stdout stream to maintain data persistence
        this.backupToStdout(formattedEntry, error.message)
        return { success: false, error: error.message }
      }

      return { success: true, logId: data?.id }
    } catch (err: any) {
      console.error(`[AUDIT_UNHANDLED_EXCEPTION]: Execution blocked during pipeline runtime:`, err)
      return { success: false, error: err.message || 'Unknown pipeline compilation fault' }
    }
  }

  /**
   * Helper utility to calculate structural diffing states automatically
   * passes only the properties modified into the metadata block for clean reviews.
   */
  static computeDelta(before: Record<string, any> | null, after: Record<string, any> | null): Record<string, any> {
    if (!before || !after) return {}
    const deltas: Record<string, { old: any; new: any }> = {}

    Object.keys({ ...before, ...after }).forEach((key) => {
      if (JSON.stringify(before[key]) !== JSON.stringify(after[key])) {
        deltas[key] = {
          old: before[key],
          new: after[key],
        }
      }
    })

    return deltas
  }

  /**
   * Standard output backup stream wrapper for orchestration failures.
   */
  private static backupToStdout(entry: Record<string, any>, dbError: string) {
    console.warn(JSON.stringify({
      _fallback_flag: true,
      db_error_context: dbError,
      record: entry,
    }))
  }
}