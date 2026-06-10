/**
 * app/farm/_components/client/AskMoxieButton.tsx
 * 
 * Client component that opens Moxie when clicked
 * Used in the FarmLog section to trigger the chat
 */

'use client'

import { useMoxieStore } from '@/context/moxieStore'

export default function AskMoxieButton() {
  const openMoxie = useMoxieStore((s) => s.openMoxie)

  return (
    <button
      onClick={() => openMoxie()}
      className="farm-btn farm-btn--neon"
      type="button"
      aria-label="Ask Moxie about the farm"
    >
      Ask Moxie About the Farm →
    </button>
  )
}
