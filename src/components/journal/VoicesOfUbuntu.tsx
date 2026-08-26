/**
 * src/components/journal/VoicesOfUbuntu.tsx
 * 
 * Premium guest stories section for homepage
 * Displays rotating featured testimonials
 */

'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Testimonial } from '@/lib/ubuntu-testimonials'

interface VoicesOfUbuntuProps {
  testimonials: Testimonial[]
}

export default function VoicesOfUbuntu({ testimonials }: VoicesOfUbuntuProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const featured = testimonials.filter((t) => t.featured)

  useEffect(() => {
    if (isPaused || featured.length === 0) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featured.length)
    }, 8000)

    return () => clearInterval(interval)
  }, [isPaused, featured.length])

  if (featured.length === 0) return null

  const current = featured[currentIndex]

  return (
    <section className="py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-100 mb-4">
            <span className="text-2xl">🎙️</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Voices of Ubuntu</h2>
          <p className="text-lg text-gray-600">
            Real stories from real guests. Authentic experiences of transformation and connection.
          </p>
        </div>

        {/* Featured Testimonial Card */}
        <div
          className="bg-white rounded-2xl shadow-xl p-8 md:p-12 border border-gray-200 min-h-96"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            {/* Quote */}
            <div className="md:col-span-2">
              <div className="text-5xl text-emerald-200 mb-4">"</div>
              <p className="text-xl md:text-2xl font-serif text-gray-900 leading-relaxed mb-6">
                {current.testimonial}
              </p>

              <div className="space-y-2">
                <p className="font-semibold text-gray-900">{current.name}</p>
                {current.country && (
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <span>📍</span> {current.country}
                  </p>
                )}
                {current.visitType && (
                  <div className="pt-2">
                    <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider">
                      {current.visitType.charAt(0).toUpperCase() + current.visitType.slice(1)} Experience
                    </span>
                  </div>
                )}
              </div>

              {current.relatedArticleSlug && (
                <Link
                  href={`/journal/${current.relatedArticleSlug}`}
                  className="inline-flex items-center gap-2 mt-6 text-emerald-600 hover:text-emerald-700 font-semibold group"
                >
                  Read the story →
                  <span className="group-hover:translate-x-1 transition-transform">▸</span>
                </Link>
              )}
            </div>

            {/* Visit Type Stats */}
            <div className="hidden md:block space-y-4">
              <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                <p className="text-xs text-emerald-700 font-semibold uppercase tracking-wider mb-2">Experience Type</p>
                <p className="text-lg font-serif text-gray-900 capitalize">{current.visitType}</p>
              </div>
              {current.date && (
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs text-blue-700 font-semibold uppercase tracking-wider mb-2">Visit Date</p>
                  <p className="text-sm text-gray-900">
                    {new Date(current.date).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Navigation Dots */}
        <div className="flex justify-center gap-2 mt-8">
          {featured.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setCurrentIndex(idx)
                setIsPaused(true)
              }}
              className={`w-3 h-3 rounded-full transition-all ${
                idx === currentIndex ? 'bg-emerald-600 w-8' : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to testimonial ${idx + 1}`}
            />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">Curious about other guest experiences?</p>
          <Link
            href="/journal/voices"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Read All Stories
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
