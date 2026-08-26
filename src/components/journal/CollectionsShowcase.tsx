/**
 * src/components/journal/CollectionsShowcase.tsx
 *
 * Featured collections section on homepage
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { getSlug } from '@/lib/journal/utils'

interface Collection {
  _id: string
  title: string
  slug: string
  description: string
  collectionImage?: {
    asset?: {
      url: string
    }
  }
  articles?: Array<{
    _id: string
    title: string
    slug: string
  }>
}

interface CollectionsShowcaseProps {
  collections: Collection[]
}

export default function CollectionsShowcase({ collections }: CollectionsShowcaseProps) {
  if (!collections || collections.length === 0) {
    return null
  }

  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.section
      className="py-20 px-6 md:px-12 bg-gradient-to-b from-white to-gray-50"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Curated</p>
          <h2 className="text-4xl font-serif text-gray-900">Featured Collections</h2>
        </motion.div>

        {/* Collections Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {collections.map((collection) => (
            <motion.article key={collection._id} variants={item} className="group">
              <Link href={`/journal/collection/${getSlug(collection.slug)}`} className="flex flex-col h-full">
                {/* Image */}
                <div className="relative h-48 md:h-56 w-full overflow-hidden rounded-lg mb-4 bg-gray-200">
                  {collection.collectionImage?.asset?.url ? (
                    <Image
                      src={collection.collectionImage.asset.url}
                      alt={collection.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-blue-100" />
                  )}

                  {/* Article count badge */}
                  {collection.articles && (
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-gray-900">
                      {collection.articles.length} stories
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-2xl md:text-3xl font-serif text-gray-900 mb-3 group-hover:underline transition-all line-clamp-2">
                    {collection.title}
                  </h3>

                  <p className="text-gray-600 text-sm md:text-base line-clamp-2">
                    {collection.description}
                  </p>
                </div>

                {/* CTA */}
                <div className="pt-4 mt-4 border-t border-gray-200">
                  <span className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors flex items-center gap-1">
                    Explore Collection
                    <svg
                      className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  )
}
