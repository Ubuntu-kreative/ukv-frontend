'use client'

import { motion } from 'framer-motion'
import type { GalleryCategory } from './Gallery.data'

interface CategoryFilterProps {
  categories: GalleryCategory[]
  active: GalleryCategory
  onChange: (category: GalleryCategory) => void
  counts: Record<string, number>
}

export function CategoryFilter({ categories, active, onChange, counts }: CategoryFilterProps) {
  return (
    <div
      role="tablist"
      aria-label="Filter gallery by category"
      className="scrollbar-none -mx-6 flex gap-2 overflow-x-auto px-6 pb-2 sm:mx-0 sm:flex-wrap sm:px-0 sm:pb-0"
    >
      {categories.map((category) => {
        const isActive = active === category
        return (
          <button
            key={category}
            role="tab"
            aria-selected={isActive}
            type="button"
            onClick={() => onChange(category)}
            className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500 ${
              isActive ? 'text-stone-900' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            {isActive && (
              <motion.span
                layoutId="category-pill"
                transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                className="absolute inset-0 rounded-full bg-amber-300"
              />
            )}
            <span className="relative z-10 flex items-center gap-1.5">
              {category}
              <span className={`text-xs ${isActive ? 'text-stone-700' : 'text-stone-400'}`}>
                {counts[category] ?? 0}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}