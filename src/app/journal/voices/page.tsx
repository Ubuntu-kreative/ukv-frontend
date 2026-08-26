/**
 * src/app/journal/voices/page.tsx
 *
 * Testimonials Hub - All guest stories
 * Search and filter by experience type
 */

'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import { UBUNTU_TESTIMONIALS, Testimonial } from '@/lib/ubuntu-testimonials'

type VisitType = 'retreat' | 'wellness' | 'accommodation' | 'events' | 'community' | 'all'

export default function VoicesPage() {
  const [selectedType, setSelectedType] = useState<VisitType>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    return UBUNTU_TESTIMONIALS.filter((t) => {
      const matchesType = selectedType === 'all' || t.visitType === selectedType
      const matchesSearch =
        searchQuery === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.testimonial.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.country?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesType && matchesSearch
    })
  }, [selectedType, searchQuery])

  const categories: Array<{ value: VisitType; label: string; emoji: string }> = [
    { value: 'all', label: 'All Experiences', emoji: '🌍' },
    { value: 'retreat', label: 'Retreats', emoji: '🏛️' },
    { value: 'wellness', label: 'Wellness', emoji: '🌊' },
    { value: 'accommodation', label: 'Accommodation', emoji: '🏠' },
    { value: 'events', label: 'Events', emoji: '🎉' },
    { value: 'community', label: 'Community', emoji: '👥' },
  ]

  return (
    <main className="w-full bg-white">
      {/* Hero */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Voices of Ubuntu</h1>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
              Real stories from real guests. Read authentic experiences of transformation, healing, creativity,
              and connection at Ubuntu Kreative Village.
            </p>
          </div>
        </div>
      </section>

      {/* Filters & Search */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Search */}
          <div className="mb-10">
            <input
              type="text"
              placeholder="Search by name, country, or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Filter Buttons */}
          <div className="mb-12">
            <p className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Filter by Type</p>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setSelectedType(cat.value)}
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    selectedType === cat.value
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results */}
          <div>
            <p className="text-sm text-gray-600 mb-8">
              {filtered.length} {filtered.length === 1 ? 'story' : 'stories'} found
            </p>

            <div className="space-y-6">
              {filtered.map((testimonial) => (
                <div
                  key={testimonial._id}
                  className="bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-8 md:p-10 hover:border-emerald-300 hover:shadow-lg transition-all"
                >
                  {/* Header */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-serif text-gray-900 mb-2">{testimonial.name}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        {testimonial.country && (
                          <span className="text-sm text-gray-600 flex items-center gap-1">
                            <span>📍</span> {testimonial.country}
                          </span>
                        )}
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase">
                          {testimonial.visitType}
                        </span>
                      </div>
                    </div>
                    {testimonial.date && (
                      <p className="text-sm text-gray-500 mt-4 md:mt-0">
                        {new Date(testimonial.date).toLocaleDateString('en-US', {
                          month: 'long',
                          year: 'numeric',
                        })}
                      </p>
                    )}
                  </div>

                  {/* Quote */}
                  <p className="text-lg text-gray-700 leading-relaxed mb-6 border-l-4 border-emerald-400 pl-6 italic">
                    "{testimonial.testimonial}"
                  </p>

                  {/* Related Article Link */}
                  {testimonial.relatedArticleSlug && (
                    <Link
                      href={`/journal/${testimonial.relatedArticleSlug}`}
                      className="inline-flex items-center text-emerald-600 hover:text-emerald-700 font-semibold gap-2 group"
                    >
                      Read the related story
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-6">No stories match your search.</p>
                <button
                  onClick={() => {
                    setSelectedType('all')
                    setSearchQuery('')
                  }}
                  className="px-6 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA - Share Your Story */}
      <section className="px-4 sm:px-6 md:px-8 lg:px-12 py-16 md:py-20 bg-gradient-to-r from-emerald-50 to-blue-50 border-t border-gray-200">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Your Story Matters</h2>
          <p className="text-lg text-gray-600 mb-8">
            Have you experienced Ubuntu? Share your transformation, your memories, your reflection on what
            ubuntu means to you.
          </p>
          <Link
            href="/journal/share-your-story"
            className="inline-flex items-center px-8 py-4 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Share Your Story
            <span className="ml-2">→</span>
          </Link>
        </div>
      </section>
    </main>
  )
}
