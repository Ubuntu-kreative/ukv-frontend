// src/lib/email/templates.ts
// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — HTML Email Templates
//
// All templates use inline styles for maximum email-client compatibility.
// Design language: earthy greens, warm cream, Ubuntu brand voice.
// ─────────────────────────────────────────────────────────────────────────────

// ── Shared design tokens ──────────────────────────────────────────────────────
const C = {
  bg:          '#FAF7F2',   // warm cream
  card:        '#FFFFFF',
  primary:     '#2D5016',   // deep forest green
  accent:      '#7A9E3B',   // leaf green
  gold:        '#C8962A',   // harvest gold
  text:        '#1A1A1A',
  muted:       '#6B6B6B',
  border:      '#E8E0D0',
  success:     '#2D5016',
  error:       '#B91C1C',
  fontFamily:  'Georgia, "Times New Roman", serif',
  fontSans:    '"Helvetica Neue", Arial, sans-serif',
} as const

// ── Base layout wrapper ───────────────────────────────────────────────────────
function layout(title: string, body: string): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:${C.bg};font-family:${C.fontSans};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:${C.bg};padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr>
          <td style="background:${C.primary};padding:32px 40px;border-radius:12px 12px 0 0;text-align:center;">
            <p style="margin:0 0 4px;color:${C.accent};font-family:${C.fontSans};font-size:11px;letter-spacing:3px;text-transform:uppercase;">Ubuntu Kreative Village</p>
            <h1 style="margin:0;color:#FFFFFF;font-family:${C.fontFamily};font-size:26px;font-weight:normal;letter-spacing:0.5px;">${title}</h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:${C.card};padding:40px;border-left:1px solid ${C.border};border-right:1px solid ${C.border};">
            ${body}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:${C.primary};padding:24px 40px;border-radius:0 0 12px 12px;text-align:center;">
            <p style="margin:0 0 6px;color:rgba(255,255,255,0.7);font-size:12px;">
              Ubuntu Kreative Village &nbsp;·&nbsp; Kenya Highlands &nbsp;·&nbsp; hello@ubuntuecolodge.com
            </p>
            <p style="margin:0;color:rgba(255,255,255,0.5);font-size:11px;font-style:italic;">
              "I am because we are."
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`.trim()
}

// ── Reusable components ───────────────────────────────────────────────────────
function infoRow(label: string, value: string): string {
  return `
  <tr>
    <td style="padding:10px 0;border-bottom:1px solid ${C.border};">
      <span style="color:${C.muted};font-size:12px;text-transform:uppercase;letter-spacing:1px;">${label}</span><br/>
      <span style="color:${C.text};font-size:15px;font-weight:600;">${value}</span>
    </td>
  </tr>`
}

function divider(): string {
  return `<tr><td style="height:1px;background:${C.border};margin:24px 0;display:block;"></td></tr>`
}

function button(text: string, href: string): string {
  return `
  <div style="text-align:center;margin:32px 0 8px;">
    <a href="${href}"
       style="display:inline-block;background:${C.accent};color:#FFFFFF;text-decoration:none;
              padding:14px 36px;border-radius:6px;font-size:15px;font-weight:600;
              font-family:${C.fontSans};letter-spacing:0.3px;">
      ${text}
    </a>
  </div>`
}

function badge(text: string, colour: string): string {
  return `<span style="display:inline-block;background:${colour};color:#FFF;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;">${text}</span>`
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 1 — Booking Confirmation (guest)
// ─────────────────────────────────────────────────────────────────────────────
export interface BookingConfirmationData {
  guestName:    string
  bookingRef:   string
  roomName:     string
  checkIn:      string   // "Saturday, 14 June 2025"
  checkOut:     string
  nights:       number
  guests:       number
  boardPlan:    string   // "Bed & Breakfast"
  totalAmount:  number
  currency?:    string   // default KES
  paymentMethod?: string
  mpesaReceipt?:  string
  specialRequests?: string
}

export function bookingConfirmationTemplate(d: BookingConfirmationData): string {
  const currency = d.currency ?? 'KES'
  const body = `
    <p style="color:${C.text};font-size:16px;margin:0 0 24px;">
      Dear <strong>${d.guestName}</strong>,
    </p>
    <p style="color:${C.text};font-size:15px;line-height:1.7;margin:0 0 28px;">
      Your stay at Ubuntu Kreative Village is confirmed. We're looking forward to welcoming you to the village.
    </p>

    <!-- Booking summary card -->
    <div style="background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:24px;margin-bottom:28px;">
      <p style="margin:0 0 16px;color:${C.primary};font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Booking Summary</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow('Booking Reference', d.bookingRef)}
        ${infoRow('Accommodation', d.roomName)}
        ${infoRow('Check-in', `${d.checkIn} &nbsp;·&nbsp; from 2:00 PM`)}
        ${infoRow('Check-out', `${d.checkOut} &nbsp;·&nbsp; by 11:00 AM`)}
        ${infoRow('Duration', `${d.nights} night${d.nights !== 1 ? 's' : ''} &nbsp;·&nbsp; ${d.guests} guest${d.guests !== 1 ? 's' : ''}`)}
        ${infoRow('Board Plan', d.boardPlan)}
        ${infoRow('Total Paid', `${currency} ${d.totalAmount.toLocaleString()}`)}
        ${d.mpesaReceipt ? infoRow('M-Pesa Receipt', d.mpesaReceipt) : ''}
      </table>
    </div>

    ${d.specialRequests ? `
    <div style="background:#F0F7E6;border-left:4px solid ${C.accent};padding:16px 20px;border-radius:0 6px 6px 0;margin-bottom:28px;">
      <p style="margin:0 0 4px;color:${C.accent};font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Special Requests Noted</p>
      <p style="margin:0;color:${C.text};font-size:14px;">${d.specialRequests}</p>
    </div>` : ''}

    <!-- What's included -->
    <p style="color:${C.primary};font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;margin:0 0 12px;">Included With Your Stay</p>
    <ul style="margin:0 0 28px;padding-left:20px;color:${C.text};font-size:14px;line-height:2;">
      <li>Pool &amp; gym access</li>
      <li>Daily farm tours</li>
      <li>Nature walks &amp; cycling</li>
      <li>Movie nights at the village</li>
      <li>Conference &amp; co-working space</li>
    </ul>

    ${button('View Your Booking', 'https://ukv-frontend.vercel.app')}

    <p style="color:${C.muted};font-size:13px;text-align:center;margin:24px 0 0;">
      Questions? Reply to this email or reach us at <strong>hello@ubuntuecolodge.com</strong><br/>
      M-Pesa Paybill: <strong>880100</strong> · Account: <strong>101497</strong>
    </p>
  `
  return layout('Booking Confirmed 🌿', body)
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 2 — Payment Receipt (guest)
// ─────────────────────────────────────────────────────────────────────────────
export interface PaymentReceiptData {
  guestName:       string
  receiptNumber:   string
  mpesaReceipt:    string
  amount:          number
  currency?:       string
  phoneNumber?:    string
  transactionDate: string   // "14 June 2025, 3:42 PM"
  bookingRef?:     string
  description?:    string
}

export function paymentReceiptTemplate(d: PaymentReceiptData): string {
  const currency = d.currency ?? 'KES'
  const body = `
    <p style="color:${C.text};font-size:16px;margin:0 0 8px;">
      Dear <strong>${d.guestName}</strong>,
    </p>
    <p style="color:${C.text};font-size:15px;line-height:1.7;margin:0 0 28px;">
      Payment received. Here is your official receipt from Ubuntu Kreative Village.
    </p>

    <!-- Amount hero -->
    <div style="background:${C.primary};border-radius:10px;padding:28px;text-align:center;margin-bottom:28px;">
      <p style="margin:0 0 4px;color:rgba(255,255,255,0.6);font-size:12px;text-transform:uppercase;letter-spacing:2px;">Amount Paid</p>
      <p style="margin:0;color:#FFFFFF;font-family:${C.fontFamily};font-size:42px;font-weight:normal;">
        ${currency} ${d.amount.toLocaleString()}
      </p>
      <div style="margin-top:12px;">${badge('Payment Confirmed', C.accent)}</div>
    </div>

    <!-- Receipt details -->
    <div style="background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:24px;margin-bottom:28px;">
      <p style="margin:0 0 16px;color:${C.primary};font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Receipt Details</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${infoRow('Receipt Number',   d.receiptNumber)}
        ${infoRow('M-Pesa Receipt',   d.mpesaReceipt)}
        ${infoRow('Transaction Date', d.transactionDate)}
        ${d.phoneNumber  ? infoRow('Phone Number',   d.phoneNumber)  : ''}
        ${d.bookingRef   ? infoRow('Booking Reference', d.bookingRef) : ''}
        ${d.description  ? infoRow('Description',    d.description)  : ''}
      </table>
    </div>

    <p style="color:${C.muted};font-size:13px;line-height:1.7;margin:0 0 8px;">
      Please keep this receipt for your records. If you have any questions about this payment,
      contact us with your receipt number.
    </p>

    ${button('View Booking Details', 'https://ukv-frontend.vercel.app')}

    <p style="color:${C.muted};font-size:13px;text-align:center;margin:24px 0 0;">
      hello@ubuntuecolodge.com &nbsp;·&nbsp; M-Pesa Paybill 880100
    </p>
  `
  return layout('Payment Receipt', body)
}

// ─────────────────────────────────────────────────────────────────────────────
// TEMPLATE 3 — Admin Alert (internal)
// ─────────────────────────────────────────────────────────────────────────────
export type AdminAlertType =
  | 'new_booking'
  | 'payment_received'
  | 'payment_failed'
  | 'booking_cancelled'
  | 'new_reservation'
  | 'system_error'

export interface AdminAlertData {
  alertType:   AdminAlertType
  title:       string
  message:     string
  details?:    Record<string, string | number | boolean | null | undefined>
  timestamp?:  string
  severity?:   'info' | 'success' | 'warning' | 'error'
}

export function adminAlertTemplate(d: AdminAlertData): string {
  const severityColour: Record<string, string> = {
    info:    '#2563EB',
    success: C.success,
    warning: C.gold,
    error:   C.error,
  }
  const severity  = d.severity ?? 'info'
  const colour    = severityColour[severity]
  const timestamp = d.timestamp ?? new Date().toLocaleString('en-KE', { timeZone: 'Africa/Nairobi' })

  const detailRows = d.details
    ? Object.entries(d.details)
        .filter(([, v]) => v !== undefined && v !== null)
        .map(([k, v]) => infoRow(k.replace(/_/g, ' '), String(v)))
        .join('')
    : ''

  const body = `
    <!-- Alert badge -->
    <div style="margin-bottom:24px;">
      ${badge(d.alertType.replace(/_/g, ' '), colour)}
      <span style="color:${C.muted};font-size:12px;margin-left:10px;">${timestamp}</span>
    </div>

    <h2 style="margin:0 0 12px;color:${C.primary};font-family:${C.fontFamily};font-size:22px;font-weight:normal;">
      ${d.title}
    </h2>

    <p style="color:${C.text};font-size:15px;line-height:1.7;margin:0 0 28px;white-space:pre-line;">
      ${d.message}
    </p>

    ${detailRows ? `
    <div style="background:${C.bg};border:1px solid ${C.border};border-radius:8px;padding:24px;margin-bottom:28px;">
      <p style="margin:0 0 16px;color:${C.primary};font-size:13px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">Details</p>
      <table width="100%" cellpadding="0" cellspacing="0">
        ${detailRows}
      </table>
    </div>` : ''}

    ${button('Open Admin Dashboard', 'https://ukv-frontend.vercel.app/admin')}
  `
  return layout(`Admin Alert — ${d.title}`, body)
}
