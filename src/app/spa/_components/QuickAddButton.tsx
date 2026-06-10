'use client'
/**
 * _components/QuickAddButton.tsx — CLIENT COMPONENT (leaf)
 *
 * This is the ONLY interactive piece inside each RitualCard.
 * Isolating it here means the card itself is a server component
 * and the cart interaction JS is only loaded once, not per-card.
 */

import { useCallback } from 'react'
import { useCartStore } from '@/context/cartStore'
import toast from 'react-hot-toast'
import type { Ritual } from '../_data/spa-data'

interface Props { ritual: Ritual }

export default function QuickAddButton({ ritual }: Props) {
  // FIX: only subscribe to addItem — not openCart — so this component
  // doesn't re-render when the cart open/close state changes.
  const addItem  = useCartStore((s) => s.addItem)
  const openCart = useCartStore((s) => s.openCart)

  const addToCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    addItem({
      id:       ritual.id,
      name:     ritual.name,
      category: 'spa',
      tag:      ritual.categoryTag,
      price:    ritual.price,
      unit:     '/ session',
    })
    toast.success(`${ritual.name} added to Wellness Cart`)
  }, [addItem, ritual])

  const handleOpenCart = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    openCart()
  }, [openCart])

  return (
    <div className="flex gap-3 w-full">
      <button
        onClick={addToCart}
        className="flex-1 border border-gold/20 bg-gold/8 hover:bg-gold/18 text-gold py-3 text-[9px] uppercase tracking-[0.28em] transition-all duration-500 rounded-xl"
      >
        Add to Cart
      </button>
      <button
        onClick={handleOpenCart}
        className="px-5 border border-white/10 hover:border-gold/28 text-[9px] uppercase tracking-[0.22em] transition-all duration-500 rounded-xl"
      >
        Cart
      </button>
    </div>
  )
}