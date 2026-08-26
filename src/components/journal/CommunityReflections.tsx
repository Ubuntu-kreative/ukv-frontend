/**
 * src/components/journal/CommunityReflections.tsx
 * 
 * Community inspirational thoughts section
 * Rotating cards with reflections from guests
 */

'use client'

import React from 'react'
import { CommunityReflection } from '@/lib/ubuntu-testimonials'

interface CommunityReflectionsProps {
  reflections: CommunityReflection[]
}

export default function CommunityReflections({ reflections }: CommunityReflectionsProps) {
  const featured = reflections.filter((r) => r.featured)

  if (featured.length === 0) return null

  const categoryEmoji = {
    philosophy: '🧠',
    memory: '✨',
    return: '🔄',
    transformation: '🦋',
  }

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Community Reflections</h2>
          <p className="text-lg text-gray-600">
            Inspiring thoughts from those who've experienced Ubuntu
          </p>
        </div>

        {/* Reflection Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((reflection) => (
            <div
              key={reflection._id}
              className="h-full bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-200 hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              <div className="text-4xl mb-4">
                {categoryEmoji[reflection.category as keyof typeof categoryEmoji]}
              </div>

              <p className="text-gray-900 font-serif text-lg mb-6 flex-grow leading-relaxed">
                "{reflection.reflection}"
              </p>

              {reflection.author && (
                <p className="text-sm text-gray-600 font-semibold">— {reflection.author}</p>
              )}
            </div>
          ))}
        </div>

        {/* Trust Statement */}
        <div className="mt-16 text-center p-8 md:p-12 rounded-2xl bg-gradient-to-r from-emerald-50 to-blue-50 border border-emerald-200">
          <p className="text-lg md:text-xl text-gray-900 font-serif leading-relaxed">
            Every reflection comes from real guests who've walked the same paths you'll explore.
            <br />
            <span className="text-emerald-600 font-semibold">Their Ubuntu is inviting yours.</span>
          </p>
        </div>
      </div>
    </section>
  )
}
