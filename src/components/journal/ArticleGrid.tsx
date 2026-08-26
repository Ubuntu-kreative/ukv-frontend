/**
 * src/components/journal/ArticleGrid.tsx
 *
 * Magazine-style article grid with image-first design
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, User, Calendar } from 'lucide-react'
import { formatDate, getSlug } from '@/lib/journal/utils'

interface Article {
  _id: string
  title: string
  excerpt: string
  heroImage?: {
    asset?: {
      url: string
    }
    alt?: string
  }
  category?: {
    title: string
    slug: string
  }
  author?: {
    name: string
    slug: string
  }
  publishedAt: string
  readingTimeMinutes?: number
  slug: string
}

interface ArticleGridProps {
  articles: Article[]
  columns?: 2 | 3
}

export default function ArticleGrid({ articles, columns = 3 }: ArticleGridProps) {
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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  }

  const gridCols = {
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
  }

  if (!articles || articles.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-gray-500 text-lg">No articles found.</p>
      </div>
    )
  }

  return (
    <motion.div
      className={`grid grid-cols-1 ${gridCols[columns]} gap-8`}
      variants={container}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
    >
      {articles.map((article) => (
        <motion.article
          key={article._id}
          variants={item}
          className="group flex flex-col h-full hover:opacity-80 transition-opacity"
        >
          <Link href={`/journal/${getSlug(article.slug)}`} className="flex flex-col h-full">
            {/* Image Container */}
            <div className="relative h-64 md:h-72 w-full overflow-hidden rounded-lg mb-4 bg-gray-200">
              {article.heroImage?.asset?.url ? (
                <Image
                  src={article.heroImage.asset.url}
                  alt={article.heroImage?.alt || article.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-emerald-100 to-blue-100" />
              )}

              {/* Category Badge */}
              {article.category && (
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-semibold text-gray-900">
                    {article.category.title}
                  </span>
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex flex-col flex-grow">
              {/* Title */}
              <h3 className="text-xl md:text-2xl font-serif text-gray-900 mb-3 line-clamp-2 group-hover:underline transition-all">
                {article.title}
              </h3>

              {/* Excerpt */}
              <p className="text-gray-600 text-sm md:text-base mb-4 line-clamp-2 flex-grow">
                {article.excerpt}
              </p>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4 text-xs md:text-sm text-gray-500 border-t pt-4">
                {article.author && (
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    {article.author.name}
                  </div>
                )}
                {article.publishedAt && (
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    {formatDate(article.publishedAt)}
                  </div>
                )}
                {article.readingTimeMinutes && (
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    {article.readingTimeMinutes} min
                  </div>
                )}
              </div>
            </div>
          </Link>
        </motion.article>
      ))}
    </motion.div>
  )
}
