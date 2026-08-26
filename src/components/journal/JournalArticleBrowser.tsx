'use client'

import React, { useMemo, useState } from 'react'
import ArticleGrid from './ArticleGrid'

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

interface JournalArticleBrowserProps {
  articles: Article[]
  featuredArticleId?: string
}

const PAGE_SIZE = 12

export default function JournalArticleBrowser({ articles, featuredArticleId }: JournalArticleBrowserProps) {
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const uniqueArticles = useMemo(() => {
    const seenImages = new Set<string>()

    return articles.filter((article) => {
      if (article._id === featuredArticleId) return false

      const image = article.heroImage?.asset?.url
      if (!image) return true
      if (seenImages.has(image)) return false

      seenImages.add(image)
      return true
    })
  }, [articles, featuredArticleId])

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return uniqueArticles

    return uniqueArticles.filter((article) =>
      article.title.toLowerCase().includes(normalizedQuery) ||
      article.excerpt.toLowerCase().includes(normalizedQuery) ||
      article.category?.title.toLowerCase().includes(normalizedQuery) ||
      article.category?.slug.toLowerCase().includes(normalizedQuery)
    )
  }, [query, uniqueArticles])

  const visibleArticles = filteredArticles.slice(0, visibleCount)
  const hasMore = visibleCount < filteredArticles.length

  return (
    <>
      <div className="mb-8">
        <label htmlFor="journal-home-search" className="sr-only">Search journal articles</label>
        <input
          id="journal-home-search"
          type="search"
          value={query}
          onChange={(event) => {
            setQuery(event.target.value)
            setVisibleCount(PAGE_SIZE)
          }}
          placeholder="Search articles by title, topic, or keywords..."
          className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
        />
      </div>

      {visibleArticles.length > 0 ? (
        <>
          <ArticleGrid articles={visibleArticles} columns={3} />
          {hasMore && (
            <div className="mt-10 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((count) => count + PAGE_SIZE)}
                className="inline-flex items-center px-6 py-3 rounded-lg border border-emerald-600 text-emerald-700 font-semibold hover:bg-emerald-50 transition-colors"
              >
                Load more stories
              </button>
            </div>
          )}
        </>
      ) : (
        <p className="py-12 text-center text-gray-500">No articles found matching your search.</p>
      )}
    </>
  )
}