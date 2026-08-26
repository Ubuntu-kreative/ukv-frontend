/**
 * src/app/journal/page.tsx
 *
 * Ubuntu Journal Homepage
 * SEO-optimized, stunning layout with all sections
 */

import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import HeroSection from '@/components/journal/HeroSection'
import FeaturedArticle from '@/components/journal/FeaturedArticle'
import CategoryPills from '@/components/journal/CategoryPills'
import JournalArticleBrowser from '@/components/journal/JournalArticleBrowser'
import CollectionsShowcase from '@/components/journal/CollectionsShowcase'
import NewsletterCTA from '@/components/journal/NewsletterCTA'
import VoicesOfUbuntu from '@/components/journal/VoicesOfUbuntu'
import EventHighlights from '@/components/journal/EventHighlights'
import { getJournalPosts, getFeaturedArticle, getCategories, getFeaturedCollections } from '@/lib/journal/sanity'
import { UBUNTU_TESTIMONIALS } from '@/lib/ubuntu-testimonials'

export const metadata: Metadata = {
  title: 'Ubuntu Journal - Stories, Travel & Culture | Ubuntu Kreative Village',
  description:
    'Discover authentic stories from Ubuntu Kreative Village. Travel guides, cultural insights, wellness retreats, and community experiences from Africa\'s premier creative hospitality destination.',
  keywords:
    'travel blog, Ubuntu Kreative Village, Kenya, Kisumu, eco-tourism, creative retreat, cultural storytelling',
  openGraph: {
    title: 'Ubuntu Journal',
    description: 'Stories, Travel, Culture, Creativity and Community',
    type: 'website',
    locale: 'en_US',
    url: 'https://ubuntukreativevillage.com/journal',
    siteName: 'Ubuntu Kreative Village',
    images: [
      {
        url: '/images/The-People-Who-Make-It-Possible.jpeg',
        width: 1200,
        height: 630,
          alt: 'The people who make Ubuntu Kreative Village possible',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ubuntu Journal',
    description: 'Stories, Travel, Culture, Creativity and Community',
    images: [
      '/images/The-People-Who-Make-It-Possible.jpeg',
    ],
  },
  alternates: {
    canonical: 'https://ubuntukreativevillage.com/journal',
  },
}

export default async function JournalHomepage() {
  try {
    const [featuredArticle, recentArticles, categories, collections] = await Promise.all([
      getFeaturedArticle(),
      getJournalPosts(50),
      getCategories(),
      getFeaturedCollections(),
    ])

    console.log('📰 Journal page - recentArticles:', recentArticles?.length || 0, 'articles')
    console.log('📰 Journal page - recentArticles first:', recentArticles?.[0]?.title)

    return (
      <main className="w-full">
        {/* Hero Section */}
        <HeroSection
          title="Ubuntu Journal"
          subtitle="Stories, Travel, Culture, Creativity and Community"
        />

        {/* Featured Article */}
        {featuredArticle && <FeaturedArticle article={featuredArticle} />}

        {/* Category Navigation */}
        <CategoryPills categories={categories} />

        {/* Featured Collections */}
        {collections && collections.length > 0 && <CollectionsShowcase collections={collections} />}

        {/* Latest Articles Grid */}
        <section className="py-20 px-6 md:px-12 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="mb-12">
              <h2 className="text-4xl font-serif text-gray-900">Latest Stories</h2>
            </div>
            <JournalArticleBrowser articles={recentArticles} featuredArticleId={featuredArticle?._id} />
          </div>
        </section>

        {/* Voices of Ubuntu - Featured Guest Stories */}
        <VoicesOfUbuntu testimonials={UBUNTU_TESTIMONIALS} />

        {/* Upcoming Experiences & Events */}
        <EventHighlights events={[]} />

        {/* Newsletter CTA */}
        <NewsletterCTA />

        {/* Related Experience CTA */}
        <section className="py-10 px-6 md:px-12 bg-white border-t border-gray-200">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-gray-600 mb-4">Want to experience the places behind these stories?</p>
            <Link
              href="/contact"
              className="inline-flex items-center px-5 py-3 text-sm font-semibold text-emerald-700 border border-emerald-600 rounded-lg hover:bg-emerald-50 transition-colors"
            >
              Plan a Visit
              <span className="ml-2">→</span>
            </Link>
          </div>
        </section>
      </main>
    )
  } catch (error) {
    console.error('Journal homepage error:', error)
    return (
      <main className="w-full py-20">
        <div className="text-center">
          <h1 className="text-4xl font-serif mb-4">Ubuntu Journal</h1>
          <p className="text-gray-600">Stories coming soon. Check back later.</p>
        </div>
      </main>
    )
  }
}
