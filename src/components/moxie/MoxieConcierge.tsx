'use client'

import dynamic from 'next/dynamic'
import { memo, useCallback, useState } from 'react'
import { usePathname } from 'next/navigation'
import MoxiePresence from './MoxiePresence'
import styles from './MoxieChat.module.css'

const MoxieChatPanel = dynamic(() => import('./MoxieChat'), {
  ssr: false,
  loading: () => null,
})

interface MoxieConciergeProps {
  className?: string
  /** Embedded full panel (e.g. /moxie page) — no floating presence */
  inline?: boolean
}

function MoxieConciergeInner({ className, inline = false }: MoxieConciergeProps) {
  const pathname = usePathname()
  const [open, setOpen] = useState(inline)

  const handleOpen = useCallback(() => setOpen(true), [])
  const handleClose = useCallback(() => setOpen(false), [])

  // Dedicated /moxie page uses inline panel only
  if (!inline && pathname === '/moxie') return null

  if (inline) {
    return (
      <div className={`${styles.moxieRoot} ${styles.moxieInline} ${className ?? ''}`.trim()}>
        <MoxieChatPanel inline onClose={undefined} />
      </div>
    )
  }

  return (
    <div className={`${styles.moxieRoot} ${className ?? ''}`.trim()} data-moxie-concierge>
      {open && <MoxieChatPanel onClose={handleClose} />}
      {!open && <MoxiePresence onActivate={handleOpen} attentive />}
    </div>
  )
}

export default memo(MoxieConciergeInner)
