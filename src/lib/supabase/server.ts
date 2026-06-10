// src/lib/supabase/server.ts
// Typed server client — rename import to avoid conflict with exported function name

import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

export async function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key) {
    throw new Error('[Server] Missing Supabase env vars')
  }
  return createSupabaseClient<Database>(url, key)
}