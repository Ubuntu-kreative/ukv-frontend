/**
 * src/components/journal/EventHighlights.tsx
 * 
 * Upcoming experiences and events section
 * Shows available retreats, workshops, and gatherings
 */

'use client'

import React from 'react'
import Link from 'next/link'

interface Event {
  _id: string
  title: string
  description: string
  date?: string
  category: 'retreat' | 'workshop' | 'gathering' | 'wellness'
  icon?: string
  cta?: string
  ctaLink?: string
}

interface EventHighlightsProps {
  events: Event[]
}

export default function EventHighlights({ events }: EventHighlightsProps) {
  if (!events || events.length === 0) {
    return (
      <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Upcoming Experiences</h2>
          <p className="text-lg text-gray-600">No upcoming events right now — check back soon.</p>
        </div>
      </section>
    )
  }

  return <EventHighlightsContent events={events} />
}

function EventHighlightsContent({ events }: { events: Event[] }) {
  const categoryColors = {
    retreat: 'from-purple-50 to-pink-50 border-purple-200',
    workshop: 'from-blue-50 to-cyan-50 border-blue-200',
    gathering: 'from-amber-50 to-orange-50 border-amber-200',
    wellness: 'from-emerald-50 to-teal-50 border-emerald-200',
  }

  const categoryIcons = {
    retreat: '🏛️',
    workshop: '🎓',
    gathering: '👥',
    wellness: '🧘',
  }

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">Upcoming Experiences</h2>
          <p className="text-lg text-gray-600">
            Join us for transformative retreats, workshops, and gatherings at Ubuntu Kreative Village
          </p>
        </div>

        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((event) => (
            <div
              key={event._id}
              className={`bg-gradient-to-br ${categoryColors[event.category as keyof typeof categoryColors]} rounded-2xl p-8 border-2 hover:shadow-xl transition-all duration-300 flex flex-col`}
            >
              {/* Icon & Category */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{event.icon || categoryIcons[event.category as keyof typeof categoryIcons]}</span>
                <span className="inline-block px-3 py-1 rounded-full bg-white bg-opacity-70 text-gray-700 text-xs font-bold uppercase tracking-wider">
                  {event.category}
                </span>
              </div>

              {/* Title & Description */}
              <h3 className="text-2xl font-serif text-gray-900 mb-3">{event.title}</h3>
              <p className="text-gray-700 mb-6 flex-grow leading-relaxed">{event.description}</p>

              {/* Date */}
              {event.date && (
                <div className="mb-6 p-3 bg-white bg-opacity-50 rounded-lg">
                  <p className="text-sm font-semibold text-gray-900">📅 {event.date}</p>
                </div>
              )}

              {/* CTA Button */}
              {event.ctaLink && (
                <Link
                  href={event.ctaLink}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-colors self-start"
                >
                  {event.cta || 'Learn More'}
                  <span className="ml-2">→</span>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Trust Message */}
        <div className="mt-16 text-center">
          <p className="text-gray-600 text-lg mb-6">
            Each experience is designed to deepen your connection to Ubuntu's philosophy and community.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-4 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          >
            Inquire About Any Experience
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
