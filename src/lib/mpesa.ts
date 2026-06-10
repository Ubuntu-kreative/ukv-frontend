import crypto from 'crypto'

/**
 * Verify M-Pesa callback signature (optional but recommended)
 *
 * M-Pesa does not provide signature in the callback by default.
 * This function can be used if you implement certificate pinning or
 * custom signature validation with Safaricom.
 *
 * For now, we rely on:
 * 1. Validating payload structure
 * 2. Validating CheckoutRequestID matches a pending payment
 * 3. HTTPS/TLS transport security
 */
export function verifyMpesaSignature(
  payload: string,
  signature: string,
  certificatePath?: string,
): boolean {
  // If no certificate provided, signature verification is skipped
  // Implement only if you have Safaricom's public certificate
  if (!certificatePath) {
    console.warn('[M-Pesa] Signature verification skipped (no certificate provided)')
    return true
  }

  try {
    // Load Safaricom's public certificate
    const cert = require('fs').readFileSync(certificatePath, 'utf8')

    // Verify the signature
    const verifier = crypto.createVerify('sha256')
    verifier.update(payload)
    return verifier.verify(cert, Buffer.from(signature, 'base64'))
  } catch (err) {
    console.error('[M-Pesa] Signature verification failed:', err)
    return false
  }
}

/**
 * Generate M-Pesa Basic Auth token
 *
 * Used for STK push and other M-Pesa API calls.
 * Combines Consumer Key and Consumer Secret.
 */
export function generateMpesaBasicAuth(consumerKey: string, consumerSecret: string): string {
  const credentials = `${consumerKey}:${consumerSecret}`
  return Buffer.from(credentials).toString('base64')
}

/**
 * Calculate M-Pesa Passkey hash
 *
 * Used in STK push requests to generate the password field.
 * Combines BusinessShortCode + Passkey + Timestamp.
 */
export function generateMpesaPassword(
  businessShortCode: string,
  passkey: string,
  timestamp: string,
): string {
  const str = businessShortCode + passkey + timestamp
  return Buffer.from(str).toString('base64')
}

/**
 * Get current timestamp in M-Pesa format (YYYYMMDDHHmmss)
 */
export function getMpesaTimestamp(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hour = String(now.getHours()).padStart(2, '0')
  const minute = String(now.getMinutes()).padStart(2, '0')
  const second = String(now.getSeconds()).padStart(2, '0')

  return `${year}${month}${day}${hour}${minute}${second}`
}
