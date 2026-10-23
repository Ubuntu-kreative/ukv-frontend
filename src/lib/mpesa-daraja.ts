import {
  generateMpesaBasicAuth,
  generateMpesaPassword,
  getMpesaTimestamp,
} from '@/lib/mpesa'

type MpesaEnvironment = 'sandbox' | 'production'

interface DarajaConfig {
  baseUrl: string
  shortcode: string
  passkey: string
  callbackUrl: string
}

interface DarajaResponse {
  ResponseCode?: string
  ResponseDescription?: string
  MerchantRequestID?: string
  CheckoutRequestID?: string
  CustomerMessage?: string
  ResultCode?: string | number
  ResultDesc?: string
}

interface AccessTokenResponse {
  access_token?: string
  expires_in?: string
}

let cachedAccessToken: { baseUrl: string; token: string; expiresAt: number } | undefined

function requiredEnv(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`Missing required environment variable: ${name}`)
  return value
}

export function getDarajaConfig(): DarajaConfig {
  const environment = requiredEnv('MPESA_ENV') as MpesaEnvironment
  if (environment !== 'sandbox' && environment !== 'production') {
    throw new Error('MPESA_ENV must be sandbox or production')
  }

  const callbackBaseUrl = requiredEnv('MPESA_CALLBACK_BASE_URL')
  const parsedCallbackUrl = new URL(callbackBaseUrl)
  if (
    parsedCallbackUrl.protocol !== 'https:' ||
    parsedCallbackUrl.pathname !== '/' ||
    parsedCallbackUrl.search ||
    parsedCallbackUrl.hash
  ) {
    throw new Error('MPESA_CALLBACK_BASE_URL must be an HTTPS origin without a path')
  }

  const callbackToken = requiredEnv('MPESA_CALLBACK_TOKEN')
  const callbackUrl = new URL('/api/mpesa/callback', parsedCallbackUrl)
  callbackUrl.searchParams.set('token', callbackToken)

  return {
    baseUrl: environment === 'sandbox'
      ? 'https://sandbox.safaricom.co.ke'
      : 'https://api.safaricom.co.ke',
    shortcode: requiredEnv('MPESA_SHORTCODE'),
    passkey: requiredEnv('MPESA_PASSKEY'),
    callbackUrl: callbackUrl.toString(),
  }
}

async function getAccessToken(baseUrl: string): Promise<string> {
  if (
    cachedAccessToken?.baseUrl === baseUrl &&
    cachedAccessToken.expiresAt > Date.now() + 60_000
  ) {
    return cachedAccessToken.token
  }

  const credentials = generateMpesaBasicAuth(
    requiredEnv('MPESA_CONSUMER_KEY'),
    requiredEnv('MPESA_CONSUMER_SECRET'),
  )
  const response = await fetch(
    `${baseUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: { Authorization: `Basic ${credentials}` },
      cache: 'no-store',
      signal: AbortSignal.timeout(15_000),
    },
  )
  if (!response.ok) throw new Error(`Daraja OAuth request failed (${response.status})`)

  const tokenResponse = await response.json() as AccessTokenResponse
  if (!tokenResponse.access_token) throw new Error('Daraja OAuth response omitted access token')

  const expiresInSeconds = Number(tokenResponse.expires_in)
  cachedAccessToken = {
    baseUrl,
    token: tokenResponse.access_token,
    expiresAt: Date.now() + (Number.isFinite(expiresInSeconds) ? expiresInSeconds : 3600) * 1000,
  }
  return cachedAccessToken.token
}

async function postDaraja<T extends DarajaResponse>(
  baseUrl: string,
  path: string,
  payload: Record<string, string | number>,
): Promise<T> {
  const token = await getAccessToken(baseUrl)
  const response = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
    cache: 'no-store',
    signal: AbortSignal.timeout(20_000),
  })
  const responseBody = await response.json().catch(() => ({})) as T
  if (!response.ok) {
    throw new Error(`Daraja request failed (${response.status})`)
  }
  return responseBody
}

export function normalizeMpesaPhone(raw: unknown): string {
  if (typeof raw !== 'string') throw new Error('A valid M-Pesa phone number is required')
  const digits = raw.replace(/\D/g, '')
  let normalized: string

  if (digits.length === 10 && /^[01]/.test(digits)) {
    normalized = `254${digits.slice(1)}`
  } else if (digits.length === 12 && digits.startsWith('254')) {
    normalized = digits
  } else {
    throw new Error('Phone number must be 07xxxxxxxx, 01xxxxxxxx, +254…, or 254…')
  }

  if (!/^254[17]\d{8}$/.test(normalized)) {
    throw new Error('Phone number must be a valid Kenyan Safaricom number')
  }
  return normalized
}

export async function initiateStkPush(input: {
  phone: string
  amount: number
  accountReference: string
  transactionDesc: string
}): Promise<DarajaResponse> {
  const config = getDarajaConfig()
  const timestamp = getMpesaTimestamp()
  const password = generateMpesaPassword(config.shortcode, config.passkey, timestamp)

  return postDaraja(config.baseUrl, '/mpesa/stkpush/v1/processrequest', {
    BusinessShortCode: config.shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: input.amount,
    PartyA: input.phone,
    PartyB: config.shortcode,
    PhoneNumber: input.phone,
    CallBackURL: config.callbackUrl,
    AccountReference: input.accountReference.slice(0, 12),
    TransactionDesc: input.transactionDesc.slice(0, 13),
  })
}

export async function queryStkPush(checkoutRequestId: string): Promise<DarajaResponse> {
  const config = getDarajaConfig()
  const timestamp = getMpesaTimestamp()
  const password = generateMpesaPassword(config.shortcode, config.passkey, timestamp)

  return postDaraja(config.baseUrl, '/mpesa/stkpushquery/v1/query', {
    BusinessShortCode: config.shortcode,
    Password: password,
    Timestamp: timestamp,
    CheckoutRequestID: checkoutRequestId,
  })
}

export function isSuccessfulDarajaResult(result: DarajaResponse): boolean {
  return Number(result.ResultCode) === 0
}
