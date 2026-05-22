// src/lib/supabase/admin.ts
// Typed admin client — fixes all `never` errors from untyped .from() calls

import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/supabase'

let _adminClient: ReturnType<typeof createClient<Database>> | null = null

export function getAdminClient() {
  if (!_adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!url || !key) {
      throw new Error('[Admin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
    }
    _adminClient = createClient<Database>(url, key, {
      auth: { persistSession: false },
    })
  }
  return _adminClient
}