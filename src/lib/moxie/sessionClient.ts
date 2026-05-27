'use client'

const SESSION_KEY = 'ukv_moxie_session_id'
const GUEST_KEY = 'ukv_moxie_guest'

export interface MoxieGuestProfile {
  name?: string
  email?: string
  phone?: string
}

export function getMoxieSessionId(): string {
  if (typeof window === 'undefined') return 'ssr'
  let id = sessionStorage.getItem(SESSION_KEY)
  if (!id) {
    id = `moxie_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem(SESSION_KEY, id)
  }
  return id
}

export function getMoxieGuest(): MoxieGuestProfile {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(GUEST_KEY)
    return raw ? (JSON.parse(raw) as MoxieGuestProfile) : {}
  } catch {
    return {}
  }
}

export function saveMoxieGuest(patch: Partial<MoxieGuestProfile>): MoxieGuestProfile {
  const next = { ...getMoxieGuest(), ...patch }
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(GUEST_KEY, JSON.stringify(next))
  }
  return next
}
