/**
 * FarmExperiences/hooks.ts
 *
 * Shared hooks used across the FarmExperiences subtree.
 * Isolated here so each hook is independently tree-shakeable.
 */

import { useState, useCallback, useRef, useEffect } from 'react'
import { JUST_ADDED_DURATION } from './constants'

/**
 * useJustAdded
 *
 * Manages the ephemeral "just added" button-highlight state.
 * Handles its own timer cleanup on unmount (PERF-04 FIX).
 *
 * Returns [justAdded, triggerJustAdded]
 */
export function useJustAdded(): [boolean, () => void] {
  const [justAdded, setJustAdded] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Cleanup on unmount — prevents setState on unmounted component
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  const trigger = useCallback(() => {
    setJustAdded(true)
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setJustAdded(false), JUST_ADDED_DURATION)
  }, [])

  return [justAdded, trigger]
}

/**
 * useModalScrollLock
 *
 * Locks body scroll while a modal is open and restores it on close.
 * Attaches Escape-key handler via a ref so it never needs to re-register.
 */
export function useModalScrollLock(onClose: () => void) {
  const onCloseRef = useRef(onClose)

  // Keep ref current without re-running the effect
  useEffect(() => { onCloseRef.current = onClose })

  useEffect(() => {
    const original = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCloseRef.current()
    }
    window.addEventListener('keydown', handler, { passive: true })

    return () => {
      document.body.style.overflow = original
      window.removeEventListener('keydown', handler)
    }
  }, []) // intentionally empty — onClose tracked via ref
}