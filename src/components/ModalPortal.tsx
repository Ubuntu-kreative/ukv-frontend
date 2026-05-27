'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

interface ModalPortalProps {
  children: ReactNode
}

export function ModalPortal({ children }: ModalPortalProps) {
  const [hostElement, setHostElement] = useState<HTMLDivElement | null>(null)

  useEffect(() => {
    const host = document.createElement('div')
    host.className = 'modal-portal-root'
    document.body.appendChild(host)
    setHostElement(host)

    return () => {
      document.body.removeChild(host)
    }
  }, [])

  if (!hostElement) return null
  return createPortal(children, hostElement)
}
