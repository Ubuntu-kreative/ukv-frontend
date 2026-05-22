// src/lib/email/send-payment-receipt.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Payment Receipt Email
//
// Call this after a payment is confirmed (M-Pesa callback ResultCode === 0).
// Sends an official receipt to the guest with all transaction details.
// ─────────────────────────────────────────────────────────────────────────────

import { getResendClient, SENDER, EmailResult } from './client'
import {
  paymentReceiptTemplate,
  PaymentReceiptData,
} from './templates'

export interface SendPaymentReceiptParams extends PaymentReceiptData {
  guestEmail: string
}

export async function sendPaymentReceipt(
  params: SendPaymentReceiptParams,
): Promise<EmailResult> {
  const { guestEmail, ...templateData } = params

  if (!guestEmail) {
    return { success: false, error: 'No guest email address provided' }
  }

  try {
    const resend = getResendClient()

    const html = paymentReceiptTemplate(templateData)

    const { data, error } = await resend.emails.send({
      from:    SENDER.noreply,
      to:      guestEmail,
      subject: `Payment Receipt — ${templateData.mpesaReceipt} · KES ${templateData.amount.toLocaleString()}`,
      html,
    })

    if (error) {
      console.error('[Email] Payment receipt failed:', error)
      return { success: false, error: error.message }
    }

    console.log(`[Email] Receipt sent to ${guestEmail} — id: ${data?.id}`)
    return { success: true, id: data?.id }

  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[Email] sendPaymentReceipt threw:', message)
    return { success: false, error: message }
  }
}
