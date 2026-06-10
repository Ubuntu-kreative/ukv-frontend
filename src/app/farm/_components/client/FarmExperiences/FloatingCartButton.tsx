'use client'
/**
 * FarmExperiences/FloatingCartButton.tsx
 *
 * Isolated subscriber — only re-renders when the farm-item COUNT changes.
 *
 * This component is kept completely separate from the main tree so that
 * its re-renders (triggered by cart mutations) do NOT cascade up or sideways
 * into ExperienceGrid or TabSection.
 *
 * The selector `s.items.filter(...)` runs on every store update but is cheap
 * (Array.filter over ≤20 items), and the result is compared by value (length),
 * so React only commits a DOM update when the number actually changes.
 */

import { useCartStore } from '@/context/cartStore'

interface FloatingCartButtonProps {
  openCart: () => void
}

export function FloatingCartButton({ openCart }: FloatingCartButtonProps) {
  // Single-field selector: component re-renders ONLY when count changes
  const farmCount = useCartStore(
    (s) => s.items.filter((i) => i.category === 'farm').length
  )

  if (farmCount === 0) return null

  return (
    <button
      onClick={openCart}
      className="farm-floating-cart"
      aria-label={`View cart — ${farmCount} farm experiences booked`}
      aria-live="polite"
    >
      <span>🌱 {farmCount} Booked</span>
      <span className="farm-floating-cart__divider" aria-hidden="true" />
      <span>View Cart →</span>
    </button>
  )
}