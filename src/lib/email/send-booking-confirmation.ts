// src/lib/email/send-booking-confirmation.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Booking Confirmation Email
//
// Call this after a booking is marked `confirmed` (M-Pesa callback success
// or manual confirmation). Sends to the guest and CC's reservations inbox.
// ─────────────────────────────────────────────────────────────────────────────

import { getResendClient, SENDER, EmailResult } from './client'
import {
  bookingConfirmationTemplate,
  BookingConfirmationData,
} from './templates'

export interface SendBookingConfirmationParams extends BookingConfirmationData {
  guestEmail: string
}

export async function sendBookingConfirmation(
  params: SendBookingConfirmationParams,
): Promise<EmailResult> {
  const { guestEmail, ...templateData } = params

  if (!guestEmail) {
    return { success: false, error: 'No guest email address provided' }
  }

  try {
    const resend = getResendClient()

    const html = bookingConfirmationTemplate(templateData)

    const { data, error } = await resend.emails.send({
      from:    SENDER.reservations,
      to:      guestEmail,
      cc:      SENDER.reservations,   // keeps reservations inbox in the loop
      subject: `Booking Confirmed — ${templateData.roomName} · Ref ${templateData.bookingRef}`,
      html,
    })

    if (error) {
      console.error('[Email] Booking confirmation failed:', error)
      return { success: false, error: error.message }
    }

    console.log(`[Email] Booking confirmation sent to ${guestEmail} — id: ${data?.id}`)
    return { success: true, id: data?.id }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Email] sendBookingConfirmation threw:', message)
    return { success: false, error: message }
  }
}
