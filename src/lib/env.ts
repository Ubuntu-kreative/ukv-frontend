/**
 * Environment variable validation
 *
 * Ensures critical environment variables are set at runtime.
 * This prevents silent failures and provides early error detection.
 */

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] || fallback
  if (!value) {
    throw new Error(`❌ Missing required environment variable: ${key}`)
  }
  return value
}

function getEnvOptional(key: string, fallback?: string): string | undefined {
  return process.env[key] || fallback
}

/**
 * Validate all required environment variables on startup
 * Call this in layout.tsx or a root API route to fail early
 */
export function validateEnvironment() {
  const required = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_SECRET_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'MPESA_CONSUMER_KEY',
    'MPESA_CONSUMER_SECRET',
    'MPESA_BUSINESS_SHORTCODE',
    'MPESA_PASSKEY',
  ]

  const missing: string[] = []

  for (const key of required) {
    if (!process.env[key]) {
      missing.push(key)
    }
  }

  if (missing.length > 0) {
    const list = missing.map(k => `  - ${k}`).join('\n')
    throw new Error(
      `❌ Missing required environment variables:\n${list}\n\nPlease update .env.local and restart.`,
    )
  }

  console.log('✓ Environment validation passed')
}

/**
 * Export typed environment object
 * Use this for type-safe access to environment variables
 */
export const env = {
  // Supabase
  NEXT_PUBLIC_SUPABASE_URL: getEnv('NEXT_PUBLIC_SUPABASE_URL'),
  SUPABASE_SERVICE_ROLE_KEY: getEnv('SUPABASE_SERVICE_ROLE_KEY'),

  // Stripe
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: getEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  STRIPE_SECRET_KEY: getEnv('STRIPE_SECRET_KEY'),
  STRIPE_WEBHOOK_SECRET: getEnv('STRIPE_WEBHOOK_SECRET'),

  // M-Pesa
  MPESA_CONSUMER_KEY: getEnv('MPESA_CONSUMER_KEY'),
  MPESA_CONSUMER_SECRET: getEnv('MPESA_CONSUMER_SECRET'),
  MPESA_BUSINESS_SHORTCODE: getEnv('MPESA_BUSINESS_SHORTCODE'),
  MPESA_PASSKEY: getEnv('MPESA_PASSKEY'),

  // Optional
  NODE_ENV: getEnvOptional('NODE_ENV', 'development'),
  MOXIE_API_URL: getEnvOptional('MOXIE_API_URL'),
  SENTRY_DSN: getEnvOptional('SENTRY_DSN'),
}
