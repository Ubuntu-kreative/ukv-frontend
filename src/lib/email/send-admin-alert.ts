// src/lib/email/send-admin-alert.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Admin Alert Email
//
// Use for internal notifications:
//   - New booking received
//   - Payment confirmed or failed
//   - Booking cancelled
//   - New restaurant/spa reservation
//   - System errors
//
// Usage:
//   await sendAdminAlert({
//     alertType: 'new_booking',
//     title:     'New Booking — Neem Penthouse',
//     message:   'James Kamau just confirmed a 3-night stay.',
//     severity:  'success',
//     details: {
//       guest_name:   'James Kamau',
//       booking_ref:  'UKV-2025-0042',
//       check_in:     '14 June 2025',
//       total_amount: 'KES 27,000',
//     },
//   })
// ─────────────────────────────────────────────────────────────────────────────

import { getResendClient, SENDER, ADMIN_EMAIL, EmailResult } from './client'
import { adminAlertTemplate, AdminAlertData }                 from './templates'

export type { AdminAlertData }

export async function sendAdminAlert(data: AdminAlertData): Promise<EmailResult> {
  try {
    const resend = getResendClient()

    const html = adminAlertTemplate(data)

    const severityEmoji: Record<string, string> = {
      info:    'ℹ️',
      success: '✅',
      warning: '⚠️',
      error:   '🚨',
    }
    const emoji = severityEmoji[data.severity ?? 'info']

    const { data: result, error } = await resend.emails.send({
      from:    SENDER.admin,
      to:      ADMIN_EMAIL,
      subject: `${emoji} ${data.title} — Ubuntu Kreative Village`,
      html,
    })

    if (error) {
      console.error('[Email] Admin alert failed:', error)
      return { success: false, error: error.message }
    }

    console.log(`[Email] Admin alert sent — id: ${result?.id}`)
    return { success: true, id: result?.id }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Email] sendAdminAlert threw:', message)
    return { success: false, error: message }
  }
}

// ── Convenience wrappers ──────────────────────────────────────────────────────

export async function alertNewBooking(details: Record<string, string | number>): Promise<EmailResult> {
  return sendAdminAlert({
    alertType: 'new_booking',
    title:     `New Booking — ${details.room_name ?? 'Accommodation'}`,
    message:   `A new booking has been received and confirmed at Ubuntu Kreative Village.`,
    severity:  'success',
    details,
  })
}

export async function alertPaymentReceived(details: Record<string, string | number>): Promise<EmailResult> {
  return sendAdminAlert({
    alertType: 'payment_received',
    title:     `Payment Received — KES ${Number(details.amount ?? 0).toLocaleString()}`,
    message:   `An M-Pesa payment has been successfully processed.`,
    severity:  'success',
    details,
  })
}

export async function alertPaymentFailed(details: Record<string, string | number | null>): Promise<EmailResult> {
  return sendAdminAlert({
    alertType: 'payment_failed',
    title:     'Payment Failed',
    message:   `An M-Pesa STK push payment was not completed. The guest may need to be contacted.`,
    severity:  'error',
    details:   details as Record<string, string | number>,
  })
}

export async function alertBookingCancelled(details: Record<string, string | number>): Promise<EmailResult> {
  return sendAdminAlert({
    alertType: 'booking_cancelled',
    title:     `Booking Cancelled — ${details.booking_ref ?? ''}`,
    message:   `A booking has been cancelled. Review the record and check for any refund obligations.`,
    severity:  'warning',
    details,
  })
}

export async function alertSystemError(error: string, context?: Record<string, string>): Promise<EmailResult> {
  return sendAdminAlert({
    alertType: 'system_error',
    title:     'System Error',
    message:   error,
    severity:  'error',
    details:   context,
  })
}
