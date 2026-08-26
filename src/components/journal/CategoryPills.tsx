/**
 * src/components/journal/CategoryPills.tsx
 *
 * Horizontal scrollable category navigation with animations
 */

'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface Category {
  _id: string
  title: string
  slug: string
  categoryIcon?: string
  categoryColor?: string
}

interface CategoryPillsProps {
  categories: Category[]
  activeCategory?: string
}

const colorMap: Record<string, string> = {
  emerald: 'from-emerald-500 to-emerald-600',
  amber: 'from-amber-500 to-amber-600',
  blue: 'from-blue-500 to-blue-600',
  purple: 'from-purple-500 to-purple-600',
  rose: 'from-rose-500 to-rose-600',
  green: 'from-green-500 to-green-600',
  indigo: 'from-indigo-500 to-indigo-600',
  orange: 'from-orange-500 to-orange-600',
}

export default function CategoryPills({ categories, activeCategory }: CategoryPillsProps) {
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <section className="py-12 px-6 md:px-12 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <p className="text-sm text-gray-600 uppercase tracking-wider font-semibold mb-6">Explore Topics</p>

        <motion.div
          className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* All Articles Pill */}
          <motion.div variants={item}>
            <Link href="/journal">
              <button
                className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${
                  !activeCategory
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Articles
              </button>
            </Link>
          </motion.div>

          {/* Category Pills */}
          {categories.map((category) => {
            const isActive = activeCategory === category.slug
            const gradientClass = colorMap[category.categoryColor || 'emerald']

            return (
              <motion.div key={category._id} variants={item}>
                <Link href={`/journal/category/${category.slug}`}>
                  <button
                    className={`px-6 py-2 rounded-full font-semibold whitespace-nowrap transition-all text-sm ${
                      isActive
                        ? `bg-gradient-to-r ${gradientClass} text-white shadow-lg`
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category.title}
                  </button>
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </section>
  )
}
