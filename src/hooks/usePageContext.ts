/**
 * src/hooks/usePageContext.ts
 * ─────────────────────────────────────────────────────────────────────────────
 * Ubuntu Kreative Village — Moxie usePageContext Hook
 *
 * React hook to get and monitor page context in client components.
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { getPageContext, type PageContext } from '@/lib/moxie/pageContext'

/**
 * Hook to get current page context
 * Automatically detects pathname changes and updates context
 * @returns Current PageContext
 */
export function usePageContext(): PageContext {
  const pathname = usePathname()
  
  // Memoize context based on pathname changes only
  // Prevents unnecessary recalculations
  const context = useMemo(() => {
    return getPageContext(pathname)
  }, [pathname])
  
  return context
}

export type { PageContext } from '@/lib/moxie/pageContext'
