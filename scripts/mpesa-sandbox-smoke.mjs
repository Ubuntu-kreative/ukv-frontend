const [bookingId, phone, appUrl = 'http://localhost:3000'] = process.argv.slice(2)

if (process.env.MPESA_ENV !== 'sandbox') {
  throw new Error('Set MPESA_ENV=sandbox before running this smoke test')
}
if (process.env.MPESA_SHORTCODE !== '174379') {
  throw new Error('Set MPESA_SHORTCODE=174379 for the Safaricom sandbox')
}
if (!bookingId || !phone) {
  throw new Error('Usage: node scripts/mpesa-sandbox-smoke.mjs <booking-id> <phone> [app-url]')
}

const response = await fetch(new URL('/api/mpesa/stkpush', appUrl), {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ bookingId, phone }),
})
const result = await response.json()

console.log(JSON.stringify({
  httpStatus: response.status,
  success: result.success === true,
  bookingReference: result.bookingReference,
  checkoutRequestId: result.checkoutRequestId,
  customerMessage: result.customerMessage,
  error: result.error,
}, null, 2))

if (!response.ok) process.exitCode = 1
