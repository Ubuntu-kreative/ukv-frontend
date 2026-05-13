'use client'

import { useCartStore } from '@/context/cartStore'
import type { Product } from '@/types'
import toast from 'react-hot-toast'

interface ProductCardProps {
  product: Product
  delay?: number
}

export function ProductCard({ product, delay = 0 }: ProductCardProps) {
  const { items, addItem } = useCartStore()
  const inCart = items.some((i) => i.id === product.id)

  const handleAdd = () => {
    if (inCart) {
      toast('Already in your booking', { icon: '✦' })
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      tag: product.tag,
      category: product.category,
      price: product.price,
      unit: product.unit,
    })
    toast.success(`${product.name} added`)
  }

  return (
    <div
      className="bracket-card relative flex flex-col animate-fade-up"
      style={{
        background: 'var(--bg2)',
        animationDelay: `${delay}ms`,
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = 'var(--bg3)'
      }}
      onMouseLeave={(e) => {
        ;(e.currentTarget as HTMLElement).style.background = 'var(--bg2)'
      }}
    >
      {/* Sticker */}
      {product.sticker && (
        <div
          className="absolute top-3.5 right-3.5 text-[8px] tracking-[0.1em] uppercase px-2 py-0.5"
          style={{ background: 'var(--rust)', color: 'var(--cream)', fontFamily: 'var(--font-body)' }}
        >
          {product.sticker}
        </div>
      )}

      <div className="flex flex-col flex-1 p-7">
        {/* Tag */}
        <p
          className="text-[9px] tracking-[0.2em] uppercase mb-3"
          style={{ color: 'var(--sage2)', fontFamily: 'var(--font-body)' }}
        >
          {product.tag}
        </p>

        {/* Name */}
        <h3
          className="text-[22px] font-light leading-tight mb-2"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--cream)' }}
        >
          {product.name}
        </h3>

        {/* Description */}
        <p
          className="text-[12px] leading-relaxed flex-1 mb-5"
          style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
        >
          {product.description}
        </p>

        {/* Includes (if any) */}
        {product.includes && product.includes.length > 0 && (
          <ul className="mb-5 space-y-1">
            {product.includes.slice(0, 3).map((inc) => (
              <li
                key={inc}
                className="text-[11px] flex items-center gap-2"
                style={{ color: 'var(--muted2)', fontFamily: 'var(--font-body)' }}
              >
                <span style={{ color: 'var(--gold)', fontSize: '8px' }}>—</span>
                {inc}
              </li>
            ))}
          </ul>
        )}

        {/* Footer */}
        <div className="flex items-end justify-between gap-3 mt-auto">
          {/* Price */}
          <div>
            <p
              className="text-[22px] font-light leading-none"
              style={{ fontFamily: 'var(--font-display)', color: 'var(--gold)' }}
            >
              KES {product.price.toLocaleString()}
            </p>
            <p
              className="text-[11px] mt-0.5"
              style={{ color: 'var(--muted)', fontFamily: 'var(--font-body)' }}
            >
              {product.unit}
            </p>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAdd}
            className="btn-outline-gold shrink-0"
            style={inCart ? { color: 'var(--gold2)', borderColor: 'var(--gold2)', background: 'var(--gold-dim)' } : {}}
          >
            {inCart ? '✓ Added' : '+ Add'}
          </button>
        </div>
      </div>
    </div>
  )
}
