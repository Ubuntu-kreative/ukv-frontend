/**
 * Supabase Browser Client
 *
 * Singleton browser client for use in Client Components.
 * Safe to call multiple times — always returns the same instance.
 *
 * Usage:
 *   'use client'
 *   import { createClient } from '@/lib/supabase/client'
 *   const supabase = createClient()
 */

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase' // generated types — adjust path as needed

// ---------------------------------------------------------------------------
// Environment validation
// ---------------------------------------------------------------------------

function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(
      `[Supabase Client] Missing required environment variable: "${key}". ` +
        `Ensure it is defined in your .env.local file and exposed to the browser ` +
        `with the NEXT_PUBLIC_ prefix.`,
    )
  }
  return value
}

const SUPABASE_URL = getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL')
const SUPABASE_ANON_KEY = getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY')

// ---------------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------------

let browserClient: SupabaseClient<Database> | undefined

/**
 * Returns (or lazily creates) a typed Supabase browser client.
 * Idempotent: calling this function multiple times returns the same instance.
 */
export function createClient(): SupabaseClient<Database> {
  if (browserClient) return browserClient

  browserClient = createBrowserClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

  return browserClient
}