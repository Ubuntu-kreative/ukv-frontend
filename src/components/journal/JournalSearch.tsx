/**
 * src/components/journal/JournalSearch.tsx
 *
 * Journal search bar with instant filtering
 * Filters articles by title, excerpt, category, and tags
 */

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Article {
  _id: string
  title: string
  slug: string
  excerpt: string
  heroImage?: {
    asset?: {
      url: string
    }
  }
  category?: {
    title: string
    slug: string
  }
  publishedAt: string
}

interface JournalSearchProps {
  articles: Article[]
  onClose?: () => void
}

export default function JournalSearch({ articles, onClose }: JournalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Article[]>([])
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    const lowerQuery = query.toLowerCase()
    const filtered = articles.filter((article) =>
      article.title.toLowerCase().includes(lowerQuery) ||
      article.excerpt.toLowerCase().includes(lowerQuery) ||
      article.category?.title.toLowerCase().includes(lowerQuery)
    )

    setResults(filtered.slice(0, 6)) // Limit to 6 results
  }, [query, articles])

  const handleClose = () => {
    setIsOpen(false)
    setQuery('')
    onClose?.()
  }

  const getSlug = (slug: any) => {
    if (typeof slug === 'string') return slug
    if (slug?.current) return slug.current
    return ''
  }

  return (
    <div className="relative w-full max-w-md">
      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search articles..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          aria-label="Search journal articles"
        />
        <svg
          className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.trim() && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={handleClose}
            role="button"
            tabIndex={-1}
          />

          {/* Results Panel */}
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
            {results.length > 0 ? (
              <div className="divide-y divide-gray-100">
                {results.map((article) => (
                  <Link
                    key={article._id}
                    href={`/journal/${getSlug(article.slug)}`}
                    onClick={handleClose}
                    className="flex gap-3 p-3 hover:bg-gray-50 transition-colors group"
                  >
                    {article.heroImage?.asset?.url && (
                      <div className="flex-shrink-0 w-16 h-16 rounded overflow-hidden bg-gray-100">
                        <Image
                          src={article.heroImage.asset.url}
                          alt={article.title}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">
                        {article.title}
                      </p>
                      {article.category && (
                        <p className="text-xs text-emerald-600 mb-1">{article.category.title}</p>
                      )}
                      <p className="text-sm text-gray-600 line-clamp-1">{article.excerpt}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-gray-600">
                No articles found. Try different keywords.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
