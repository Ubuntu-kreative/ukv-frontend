/**
 * Domain Metrics Monitoring Engine
 *
 * Fix applied (error 11):
 *   - `Sentry.metrics.increment()` was removed from the Sentry SDK.
 *     Replaced with `Sentry.captureMessage()` + structured breadcrumbs,
 *     which works across all current Sentry SDK versions (@sentry/nextjs ≥ 8).
 *   - `Sentry.startSpan` signature corrected for SDK v8 API.
 */

const Sentry: any = (() => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    // @ts-ignore
    return require('@sentry/nextjs')
  } catch {
    return {
      captureMessage: () => undefined,
      captureException: () => undefined,
      startSpan: async (_opts: any, callback: (span: any) => Promise<any>) => {
        return callback({
          finish: () => undefined,
        })
      },
    }
  }
})()

// ── Minimal logger shim ───────────────────────────────────────────────────────
// Replace with your real Logger import if it exists:
//   import { Logger } from './logger'
const Logger = {
  error:    (msg: string, ctx?: object, err?: unknown) => console.error('[ERROR]', msg, ctx, err ?? ''),
  critical: (msg: string, ctx?: object, err?: unknown) => console.error('[CRITICAL]', msg, ctx, err ?? ''),
  warn:     (msg: string, ctx?: object)               => console.warn('[WARN]', msg, ctx),
}

// ─────────────────────────────────────────────────────────────────────────────

export class Monitoring {

  /**
   * Captures HTTP API contract exceptions and performance drops.
   */
  static trackApiFailure(
    endpoint:     string,
    method:       string,
    statusCode:   number,
    errorContext: string,
    userId?:      string,
  ): void {
    Logger.error(`API Execution Fault: ${method} ${endpoint} returned Status ${statusCode}`, {
      category: 'API', userId,
      meta: { endpoint, method, statusCode, errorContext },
    })

    // Fix: Sentry.metrics removed — use captureMessage with structured context
    Sentry.captureMessage(`api.failure: ${method} ${endpoint}`, {
      level: 'error',
      tags:  { endpoint, method, status: String(statusCode) },
      extra: { errorContext, userId },
    })
  }

  /**
   * Tracks financial transaction drops across Stripe / M-Pesa STK push.
   */
  static trackPaymentFailure(
    provider:        'stripe' | 'mpesa',
    transactionType: string,
    amount:          number,
    transactionId:   string,
    alertMessage:    string,
    userId?:         string,
  ): void {
    Logger.critical(
      `Payment Processing Blocked [${provider.toUpperCase()}]: ${alertMessage}`,
      { category: 'PAYMENT', entityId: transactionId, userId,
        meta: { provider, transactionType, amount, transactionId } },
    )

    // Fix: Sentry.metrics removed
    Sentry.captureMessage(`payment.failure: ${provider} ${transactionType}`, {
      level: 'error',
      tags:  { provider, type: transactionType },
      extra: { amount, transactionId, alertMessage, userId },
    })
  }

  /**
   * Monitors validation failures, room overbooks, and inventory collisions.
   */
  static trackBookingFailure(
    reason:    'inventory_lock_failed' | 'date_conflict' | 'validation_error',
    roomIds:   string[],
    checkIn:   string,
    checkOut:  string,
    userId?:   string,
  ): void {
    Logger.error(`Booking System Exception: Allocation rejected due to [${reason}]`, {
      category: 'BOOKING', userId,
      meta: { reason, roomIds, checkIn, checkOut },
    })

    // Fix: Sentry.metrics removed
    Sentry.captureMessage(`booking.allocation.failed: ${reason}`, {
      level: 'warning',
      tags:  { reason },
      extra: { roomIds, checkIn, checkOut, userId },
    })
  }

  /**
   * Monitors raw DB transaction timeouts, connection pool drops, or Supabase limits.
   */
  static trackDatabaseError(
    table:          string,
    queryOperation: 'SELECT' | 'INSERT' | 'UPDATE' | 'DELETE',
    error:          Error,
    queryContext?:  Record<string, unknown>,
  ): void {
    Logger.critical(
      `Database Transaction Aborted on table [${table}] during ${queryOperation}`,
      { category: 'DATABASE', meta: { table, queryOperation, ...queryContext } },
      error,
    )

    // Fix: Sentry.metrics removed
    Sentry.captureException(error, {
      tags:  { table, operation: queryOperation },
      extra: { queryContext },
    })
  }

  /**
   * Measures performance execution boundaries to identify latency anomalies.
   */
  static trackExecutionLatency<T>(
    name:      string,
    operation: () => Promise<T>,
  ): Promise<T> {
    // Fix: Sentry.startSpan v8 API — callback receives span, returns its value
    return Sentry.startSpan({ name, op: 'performance.measure' }, async () => {
      const start = performance.now()
      try {
        return await operation()
      } finally {
        const duration = performance.now() - start
        if (duration > 1500) {
          Logger.warn(`Performance Bottleneck: [${name}] completed slow`, {
            category: 'SYSTEM',
            meta: { durationMs: Math.round(duration) },
          })
          Sentry.captureMessage(`performance.slow: ${name}`, {
            level: 'warning',
            extra: { durationMs: Math.round(duration) },
          })
        }
      }
    })
  }
}