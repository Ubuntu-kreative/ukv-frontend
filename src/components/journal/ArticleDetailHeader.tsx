/**
 * src/components/journal/ArticleDetailHeader.tsx
 *
 * Article header with metadata, breadcrumbs, and sharing
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Clock, User, Calendar, Share2, ChevronRight } from 'lucide-react'
import { formatDate, getSlug } from '@/lib/journal/utils'

interface ArticleDetailHeaderProps {
  article: any
}

export default function ArticleDetailHeader({ article }: ArticleDetailHeaderProps) {
  const {
    title,
    heroImage,
    heroImageAlt,
    category,
    author,
    publishedAt,
    readingTimeMinutes,
    slug,
  } = article

  const shareUrl = `https://ubuntukreativevillage.com/journal/${getSlug(slug)}`

  return (
    <>
      {/* Hero Image */}
      <motion.div
        className="relative w-full h-96 md:h-[500px] overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        {heroImage?.asset?.url ? (
          <Image
            src={heroImage.asset.url}
            alt={heroImageAlt || title}
            fill
            className="object-cover"
            priority
            quality={90}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-200 to-blue-200" />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </motion.div>

      {/* Article Header */}
      <article className="bg-white px-6 md:px-12">
        {/* Breadcrumb */}
        <motion.nav
          className="flex items-center gap-2 text-sm text-gray-600 pt-8 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Link href="/journal" className="hover:text-emerald-600 transition-colors">
            Journal
          </Link>
          <ChevronRight size={16} />
          {category && (
            <>
              <Link
                href={`/journal/category/${getSlug(category.slug)}`}
                className="hover:text-emerald-600 transition-colors"
              >
                {category.title}
              </Link>
              <ChevronRight size={16} />
            </>
          )}
          <span className="text-gray-900 font-semibold">{title.substring(0, 40)}...</span>
        </motion.nav>

        {/* Category Badge */}
        {category && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-4"
          >
            {category && (
              <Link href={`/journal/category/${getSlug(category.slug)}`}>
                <span className="inline-block px-4 py-1 rounded-full bg-emerald-100 text-emerald-700 text-sm font-semibold hover:bg-emerald-200 transition-colors">
                  {category.title}
                </span>
              </Link>
            )}
          </motion.div>
        )}

        {/* Title */}
        <motion.h1
          className="text-5xl md:text-6xl font-serif text-gray-900 mb-6 leading-tight max-w-4xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {title}
        </motion.h1>

        {/* Metadata Bar */}
        <motion.div
          className="flex flex-wrap items-center gap-6 pb-8 border-b border-gray-200 max-w-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {author && (
            <Link
              href={`/journal/author/${getSlug(author.slug)}`}
              className="flex items-center gap-3 group"
            >
              {author.avatar?.asset?.url && (
                <Image
                  src={author.avatar.asset.url}
                  alt={author.name}
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              )}
              <div>
                <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {author.name}
                </p>
                <p className="text-xs text-gray-600">Author</p>
              </div>
            </Link>
          )}

          {publishedAt && (
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <span>{formatDate(publishedAt)}</span>
            </div>
          )}

          {readingTimeMinutes && (
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} />
              <span>{readingTimeMinutes} min read</span>
            </div>
          )}

          {/* Share Button */}
          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title,
                  url: shareUrl,
                })
              } else {
                navigator.clipboard.writeText(shareUrl)
              }
            }}
            className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors text-sm font-semibold"
          >
            <Share2 size={16} />
            Share
          </button>
        </motion.div>
      </article>
    </>
  )
}
