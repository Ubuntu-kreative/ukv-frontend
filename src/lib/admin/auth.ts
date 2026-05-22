/**
 * Admin Auth & Role Protection
 *
 * Fix applied (error 10):
 *   - `cookies()` in Next.js 15 returns a Promise — must be `await`-ed before
 *     calling `.get()`. Without `await`, TypeScript reports:
 *     "Property 'get' does not exist on type 'Promise<ReadonlyRequestCookies>'"
 */

import { createClient } from '@supabase/supabase-js'
import { redirect }     from 'next/navigation'
import { cookies }      from 'next/headers'

export type AdminRole = 'super_admin' | 'manager' | 'front_desk' | 'finance'

export interface AdminUser {
  id:         string
  email:      string
  name:       string
  role:       AdminRole
  avatarUrl?: string
}

export const ROLE_PERMISSIONS: Record<AdminRole, string[]> = {
  super_admin: ['*'],
  manager:     [
    'bookings.read', 'bookings.write', 'bookings.cancel',
    'payments.read',
    'rooms.read', 'rooms.write',
    'inquiries.read', 'inquiries.write',
    'calendar.read',
  ],
  front_desk: [
    'bookings.read', 'bookings.write',
    'rooms.read',
    'inquiries.read', 'inquiries.write',
    'calendar.read',
  ],
  finance: [
    'bookings.read',
    'payments.read', 'payments.write', 'payments.refund',
  ],
}

function getSupabaseAdmin() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}

export async function getAdminSession(): Promise<AdminUser | null> {
  try {
    // ── Fix: await cookies() — required in Next.js 15 ─────────────────────
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return null

    const supabase = getSupabaseAdmin()
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return null

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('name, role, avatar_url')
      .eq('user_id', user.id)
      .single()

    if (!profile) return null

    return {
      id:        user.id,
      email:     user.email ?? '',
      name:      profile.name,
      role:      profile.role as AdminRole,
      avatarUrl: profile.avatar_url ?? undefined,
    }
  } catch {
    return null
  }
}

export async function requireAdmin(requiredPermission?: string): Promise<AdminUser> {
  const user = await getAdminSession()
  if (!user) redirect('/admin/login')

  if (requiredPermission) {
    const perms  = ROLE_PERMISSIONS[user.role]
    const hasAll = perms.includes('*')
    const hasPerm = perms.includes(requiredPermission)
    if (!hasAll && !hasPerm) redirect('/admin?error=forbidden')
  }

  return user
}

export function can(user: AdminUser, permission: string): boolean {
  const perms = ROLE_PERMISSIONS[user.role]
  return perms.includes('*') || perms.includes(permission)
}