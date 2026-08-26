/**
 * src/app/journal/search/page.tsx
 *
 * Journal search page
 * Advanced search with filters
 */

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import JournalSearch from '@/components/journal/JournalSearch'
import { getJournalPosts, getCategories } from '@/lib/journal/sanity'

export default function SearchPage() {
  const [articles, setArticles] = useState<any[]>([])
  const [categories, setCategories] = useState<any[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredArticles, setFilteredArticles] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        const [postsData, categoriesData] = await Promise.all([
          getJournalPosts(50),
          getCategories(),
        ])
        setArticles(postsData)
        setCategories(categoriesData)
        setFilteredArticles(postsData)
      } catch (error) {
        console.error('Failed to load articles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filter articles based on search query and category
  useEffect(() => {
    let filtered = articles

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(
        (article) => article.category?.slug === selectedCategory
      )
    }

    // Filter by search query
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(lowerQuery) ||
          article.excerpt.toLowerCase().includes(lowerQuery) ||
          article.category?.title.toLowerCase().includes(lowerQuery)
      )
    }

    setFilteredArticles(filtered)
  }, [searchQuery, selectedCategory, articles])

  const getSlug = (slug: any) => {
    if (typeof slug === 'string') return slug
    if (slug?.current) return slug.current
    return ''
  }

  return (
    <main className="w-full bg-white">
      {/* Header */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4">
            Search the Journal
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Explore stories, insights, and inspiration from Ubuntu Kreative Village
          </p>

          {/* Search Bar */}
          <JournalSearch articles={articles} />
        </div>
      </section>

      {/* Filters & Results */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-20">
        <div className="max-w-6xl mx-auto">
          {/* Filter Chips */}
          <div className="mb-12">
            <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Filter by Topic
            </h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  selectedCategory === null
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                All Topics
              </button>
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === category.slug ? null : category.slug
                    )
                  }
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.slug
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          </div>

          {/* Search Input */}
          <div className="mb-12">
            <input
              type="text"
              placeholder="Search by title, topic, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-base"
            />
          </div>

          {/* Results */}
          <div>
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading articles...</p>
              </div>
            ) : filteredArticles.length > 0 ? (
              <>
                <h2 className="text-2xl font-serif text-gray-900 mb-8">
                  {filteredArticles.length} {filteredArticles.length === 1 ? 'Result' : 'Results'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredArticles.map((article) => (
                    <Link
                      key={article._id}
                      href={`/journal/${getSlug(article.slug)}`}
                      className="group overflow-hidden rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300"
                    >
                      {article.heroImage?.asset?.url && (
                        <div className="relative h-48 bg-gray-100 overflow-hidden">
                          <Image
                            src={article.heroImage.asset.url}
                            alt={article.title}
                            fill
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        {article.category && (
                          <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
                            {article.category.title}
                          </p>
                        )}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
                          {article.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          {article.author && (
                            <span>{article.author.name}</span>
                          )}
                          {article.readingTimeMinutes && (
                            <span>{article.readingTimeMinutes} min read</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">
                  No articles found matching your search.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory(null)
                  }}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}
