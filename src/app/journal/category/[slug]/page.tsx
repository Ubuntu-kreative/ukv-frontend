/**
 * src/app/journal/category/[slug]/page.tsx
 *
 * Category page - displays all articles in a category
 */

import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import CategoryPills from '@/components/journal/CategoryPills'
import ArticleGrid from '@/components/journal/ArticleGrid'
import { getArticlesByCategory, getCategories } from '@/lib/journal/sanity'

interface PageParams {
  slug: string
}

interface PageProps {
  params: Promise<PageParams>
}

export async function generateMetadata(props: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const categories = await getCategories()
  const category = categories.find((c: any) => c.slug === params.slug)

  if (!category) {
    return {}
  }

  return {
    title: `${category.title} | Ubuntu Journal`,
    description: category.description || `Explore ${category.title} stories from Ubuntu Kreative Village`,
    alternates: {
      canonical: `https://ubuntukreativevillage.com/journal/category/${params.slug}`,
    },
  }
}

export default async function CategoryPage(props: PageProps) {
  const params = await props.params
  const [articles, categories] = await Promise.all([
    getArticlesByCategory(params.slug),
    getCategories(),
  ])

  const category = categories.find((c: any) => c.slug === params.slug)

  if (!category) {
    notFound()
  }

  return (
    <main className="w-full bg-white">
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-emerald-50 to-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <Link href="/journal" className="text-emerald-600 hover:text-emerald-700 text-sm font-semibold mb-4 inline-block">
            ← Back to Journal
          </Link>
          <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4">{category.title}</h1>
          {category.description && (
            <p className="text-xl text-gray-600 leading-relaxed">{category.description}</p>
          )}
        </div>
      </section>

      {/* Category Navigation */}
      <CategoryPills categories={categories} activeCategory={params.slug} />

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
              <p className="text-gray-500 text-lg">No stories yet in this category.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
