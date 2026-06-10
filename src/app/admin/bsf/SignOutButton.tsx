'use client'

// ─────────────────────────────────────────────────────────────────────────────
// src/app/admin/bsf/SignOutButton.tsx
// Must be a separate 'use client' file — layout.tsx is a Server Component.
// ─────────────────────────────────────────────────────────────────────────────

import { signOut } from 'next-auth/react'

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/admin/login' })}
      style={{
        background: 'transparent',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 8,
        color: 'rgba(255,255,255,0.3)',
        fontSize: 11,
        padding: '6px 14px',
        cursor: 'pointer',
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        transition: 'color 0.2s',
      }}
      onMouseEnter={e =>
        ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.7)')
      }
      onMouseLeave={e =>
        ((e.currentTarget as HTMLButtonElement).style.color = 'rgba(255,255,255,0.3)')
      }
    >
      Sign out
    </button>
  )
}