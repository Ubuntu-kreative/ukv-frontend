'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'

interface ModalPortalProps {
  children: React.ReactNode
}

/**
 * Renders modals on document.body to escape overflow/transform stacking contexts.
 * The host element is created synchronously on the client so portal content
 * can render immediately and avoid an extra blank render frame.
 */
export function ModalPortal({ children }: ModalPortalProps) {
  const hostRef = useRef<HTMLDivElement | null>(null)

  if (typeof document !== 'undefined' && hostRef.current === null) {
    const host = document.createElement('div')
    host.className = 'modal-portal-root'
    hostRef.current = host
  }

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    document.body.appendChild(host)
    return () => {
      if (document.body.contains(host)) {
        document.body.removeChild(host)
      }
    }
  }, [])

  if (!hostRef.current) return null
  return createPortal(children, hostRef.current)
}
