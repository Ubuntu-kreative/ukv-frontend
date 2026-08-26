/**
 * src/components/journal/RelatedExperiences.tsx
 * 
 * Shows related Ubuntu experiences based on article category
 * Linked at the bottom of article pages
 */

'use client'

import React from 'react'
import Link from 'next/link'

interface Experience {
  id: string
  title: string
  description: string
  icon: string
}

interface RelatedExperiencesProps {
  articleCategory: string
  heading?: string
}

// Map article categories to related experiences
const categoryExperienceMap: Record<string, Experience[]> = {
  wellness: [
    {
      id: 'spa-hydrotherapy',
      title: 'Arohamai Spa - Hydrotherapy',
      description: 'Hot mineral pool therapy to release deep-held tension and restore circulation.',
      icon: '🌊',
    },
    {
      id: 'sound-healing',
      title: 'Sound Healing Journey',
      description: 'Crystal bowls and African percussion for nervous system restoration.',
      icon: '🎵',
    },
    {
      id: 'sunrise-yoga',
      title: 'Rooftop Sunrise Yoga',
      description: 'Begin each morning with open-sky movement above the valley.',
      icon: '☀️',
    },
  ],
  'creative-life': [
    {
      id: 'creative-retreat',
      title: 'Creative Retreat Week',
      description: 'For writers, designers, founders, artists seeking stillness and creative space.',
      icon: '✍️',
    },
    {
      id: 'neem-penthouse',
      title: 'Neem Penthouse',
      description: 'The signature cottage with rooftop silence—perfect for creative focus.',
      icon: '🏛️',
    },
    {
      id: 'fire-circle',
      title: 'Fire Circle Evenings',
      description: 'Ancestral fireside gatherings—stories, silence, warm drinks, community.',
      icon: '🔥',
    },
  ],
  accommodation: [
    {
      id: 'neem-penthouse',
      title: 'Neem Penthouse',
      description: 'Rooftop silence and open-sky views. The signature Ubuntu experience.',
      icon: '🏛️',
    },
    {
      id: 'buffalo-thorn',
      title: 'Buffalo Thorn Valley Suite',
      description: 'Privacy and stunning sunrise valley views. Perfect for couples.',
      icon: '🌅',
    },
    {
      id: 'farm-tour',
      title: 'Guided Farm Tours',
      description: 'Walk through the living ecological systems surrounding your cottage.',
      icon: '🌿',
    },
  ],
  events: [
    {
      id: 'moonlight-cinema',
      title: 'Moonlight Cinema',
      description: 'Open-air film nights beneath the Kenyan highland sky.',
      icon: '🌙',
    },
    {
      id: 'fire-circle',
      title: 'Fire Circle Evenings',
      description: 'Ancestral fireside gatherings with community and culture.',
      icon: '🔥',
    },
    {
      id: 'farm-dining',
      title: 'Farm-to-Table Dining',
      description: 'Fresh harvest meals prepared daily from the land around you.',
      icon: '🍽️',
    },
  ],
  community: [
    {
      id: 'fire-circle',
      title: 'Fire Circle Evenings',
      description: 'Stories, silence, warm drinks, and genuine human connection.',
      icon: '🔥',
    },
    {
      id: 'ubuntu-gatherings',
      title: 'Ubuntu Philosophical Circles',
      description: 'Deep dives into ubuntu philosophy with community.',
      icon: '🧠',
    },
    {
      id: 'farm-dining',
      title: 'Communal Farm-to-Table',
      description: 'Shared meals celebrating the harvest and community.',
      icon: '🌾',
    },
  ],
  retreats: [
    {
      id: 'creative-retreat',
      title: 'Creative Retreat Week',
      description: 'Immersion for writers, designers, and deep thinkers.',
      icon: '✍️',
    },
    {
      id: 'romantic-retreat',
      title: 'Romantic Escape Retreat',
      description: 'Slow mornings, golden sunsets, deep reconnection.',
      icon: '💑',
    },
    {
      id: 'wellness-retreat',
      title: 'Wellness & Restoration Retreat',
      description: 'Healing hydrotherapy, sound journeys, and wellness consultations.',
      icon: '🧘',
    },
  ],
  'guest-stories': [
    {
      id: 'voices-hub',
      title: 'All Guest Stories',
      description: 'Read transformative experiences from guests just like you.',
      icon: '🎙️',
    },
    {
      id: 'share-story',
      title: 'Share Your Story',
      description: 'Tell the community about your Ubuntu experience.',
      icon: '✍️',
    },
    {
      id: 'community-reflections',
      title: 'Community Reflections',
      description: 'Inspiring thoughts from guests who\'ve stayed with us.',
      icon: '✨',
    },
  ],
}

const getCategoryKey = (category: string): string => {
  const normalized = category.toLowerCase().replace(/\s+/g, '-')
  return Object.keys(categoryExperienceMap).find(
    (key) => key === normalized || key.includes(normalized.split('-')[0])
  ) || 'wellness'
}

export default function RelatedExperiences({ articleCategory, heading }: RelatedExperiencesProps) {
  const categoryKey = getCategoryKey(articleCategory)
  const experiences = categoryExperienceMap[categoryKey] || categoryExperienceMap.wellness

  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 md:px-8 lg:px-12 bg-gradient-to-r from-emerald-50 to-blue-50 border-t border-gray-200">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">
            {heading || 'Experience This at Ubuntu'}
          </h2>
          <p className="text-lg text-gray-600">
            Based on your reading, here's what you can experience at Ubuntu Kreative Village
          </p>
        </div>

        {/* Experiences Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <Link
              key={exp.id}
              href="/contact"
              className="group bg-white rounded-xl p-6 border-2 border-emerald-200 hover:border-emerald-400 hover:shadow-lg transition-all duration-300"
            >
              <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">{exp.icon}</div>
              <h3 className="text-xl font-serif text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors">
                {exp.title}
              </h3>
              <p className="text-gray-600 mb-4 leading-relaxed">{exp.description}</p>
              <div className="flex items-center text-emerald-600 font-semibold group-hover:gap-2 gap-1 transition-all">
                Learn More <span>→</span>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-12 text-center p-8 rounded-xl bg-white border-2 border-emerald-300">
          <p className="text-gray-900 mb-4 text-lg">
            Ready to transform your story like the guests you just read about?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center px-8 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors"
          >
            Inquire About Your Stay
            <span className="ml-2">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
