/**
 * src/components/journal/FeaturedArticle.tsx
 *
 * Magazine-style featured article component
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, User, Calendar } from 'lucide-react'
import { formatDate, getSlug } from '@/lib/journal/utils'

interface FeaturedArticleProps {
  article: any
}

export default function FeaturedArticle({ article }: FeaturedArticleProps) {
  const {
    title,
    excerpt,
    heroImage,
    category,
    author,
    publishedAt,
    readingTimeMinutes,
    slug,
  } = article

  return (
    <motion.section
      id="featured"
      className="py-20 px-6 md:px-12 bg-gradient-to-b from-gray-50 to-white"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <div className="max-w-6xl mx-auto">
        {/* Section Label */}
        <div className="mb-12">
          <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Featured</p>
          <h2 className="text-4xl font-serif text-gray-900">Latest Story</h2>
        </div>

        {/* Featured Article Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Image */}
          <motion.div
            className="relative h-96 md:h-full rounded-lg overflow-hidden shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {heroImage?.asset?.url ? (
              <Image
                src={heroImage.asset.url}
                alt={heroImage?.alt || title}
                fill
                className="object-cover"
                priority
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-blue-200" />
            )}
          </motion.div>

          {/* Content */}
          <div className="flex flex-col justify-center">
            {/* Category */}
            {category && (
              <Link href={`/journal/category/${getSlug(category.slug)}`}>
                <span className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2 block">
                  {category.title}
                </span>
              </Link>
            )}

            {/* Title */}
            <h3 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4 leading-tight">
              {title}
            </h3>

            {/* Excerpt */}
            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
              {excerpt}
            </p>

            {/* Metadata */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-8">
              {author && (
                <Link
                  href={`/journal/author/${getSlug(author.slug)}`}
                  className="flex items-center gap-2 hover:text-emerald-600 transition-colors"
                >
                  <User size={16} />
                  {author.name}
                </Link>
              )}
              {publishedAt && (
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  {formatDate(publishedAt)}
                </div>
              )}
              {readingTimeMinutes && (
                <div className="flex items-center gap-2">
                  <Clock size={16} />
                  {readingTimeMinutes} min read
                </div>
              )}
            </div>

            {/* CTA */}
            <Link
              href={`/journal/${getSlug(slug)}`}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all w-fit group"
            >
              Read Story
              <svg
                className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </motion.section>
  )
}
