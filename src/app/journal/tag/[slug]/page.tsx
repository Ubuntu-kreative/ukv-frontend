/**
 * src/app/journal/tag/[slug]/page.tsx
 *
 * Tag page - displays all articles with a specific tag
 */

import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import ArticleGrid from '@/components/journal/ArticleGrid'
import { getArticlesByTag, getTags } from '@/lib/journal/sanity'

interface PageParams {
  slug: string
}

interface PageProps {
  params: Promise<PageParams>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const tags = await getTags(100)
  const tag = tags.find((t: any) => t.slug === params.slug)

  if (!tag) {
    return {}
  }

  return {
    title: `Articles Tagged "${tag.title}" | Ubuntu Journal`,
    description: `Discover articles tagged with "${tag.title}" from Ubuntu Kreative Village`,
    alternates: {
      canonical: `https://ubuntukreativevillage.com/journal/tag/${params.slug}`,
    },
  }
}

export default async function TagPage(props: PageProps) {
  const params = await props.params
  const [articles, tags] = await Promise.all([getArticlesByTag(params.slug), getTags(100)])

  const tag = tags.find((t: any) => t.slug === params.slug)

  if (!tag) {
    notFound()
  }

  return (
    <main className="w-full bg-white">
      {/* Header */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-blue-50 to-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <Link href="/journal" className="text-blue-600 hover:text-blue-700 text-sm font-semibold mb-4 inline-block">
            ← Back to Journal
          </Link>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4">
            Articles Tagged <span className="text-blue-600">"{tag.title}"</span>
          </h1>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          {articles && articles.length > 0 ? (
            <>
              <div className="mb-12">
                <h2 className="text-3xl font-serif text-gray-900">
                  {articles.length} {articles.length === 1 ? 'Story' : 'Stories'}
                </h2>
              </div>
              <ArticleGrid articles={articles} columns={3} />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No stories yet with this tag.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
