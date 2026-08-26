/**
 * src/app/journal/[slug]/page.tsx
 *
 * Article detail page
 * SEO-optimized with full metadata, structured data, social cards
 */

import React from 'react'
import { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ArticleDetailHeader from '@/components/journal/ArticleDetailHeader'
import ArticleContent from '@/components/journal/ArticleContent'
import ArticleGrid from '@/components/journal/ArticleGrid'
import ReadingProgressBar from '@/components/journal/ReadingProgressBar'
import SocialShare from '@/components/journal/SocialShare'
import TableOfContents from '@/components/journal/TableOfContents'
import AuthorProfile from '@/components/journal/AuthorProfile'
import RelatedExperiences from '@/components/journal/RelatedExperiences'
import { getArticleBySlug, getRelatedArticles } from '@/lib/journal/sanity'
import {
  generateArticleSchema,
  generateCanonicalUrl,
  generateOGTags,
  generateTwitterTags,
  extractPlainText,
  getSlug,
} from '@/lib/journal/utils'

interface PageParams {
  slug: string
}

interface PageProps {
  params: Promise<PageParams>
}

export async function generateMetadata(props: PageProps, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    return {}
  }

  const seoTitle = article.seoTitle || article.title
  const seoDescription = article.seoDescription || article.excerpt
  const canonicalUrl = article.canonicalUrl || generateCanonicalUrl(getSlug(article.slug))
  const ogImage = article.ogImage?.asset?.url || article.heroImage?.asset?.url

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: article.keywords || undefined,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      type: 'article',
      url: canonicalUrl,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630, alt: article.title }] : [],
      publishedTime: article.publishedAt,
      authors: article.author ? [article.author.name] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [ogImage] : [],
    },
  }
}

export default async function ArticlePage(props: PageProps) {
  const params = await props.params
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(params.slug, 3)
  const articleText = extractPlainText(article.content || [])
  const articleSchema = generateArticleSchema(article)
  const canonicalUrl = article.canonicalUrl || generateCanonicalUrl(getSlug(article.slug))

  return (
    <main className="w-full bg-white">
      {/* Reading Progress Bar */}
      <ReadingProgressBar />

      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      {/* Article Header */}
      <ArticleDetailHeader article={article} />

      {/* Article Content Container - Mobile First Responsive */}
      <article className="px-4 sm:px-6 md:px-8 lg:px-12 py-8 md:py-12 lg:py-20 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-7xl mx-auto">
        {/* Table of Contents (Desktop) */}
        <div className="hidden lg:block lg:col-span-1">
          <TableOfContents />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-1">
          <ArticleContent content={article.content} />

          {/* Social Sharing - Mobile First */}
          <div className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6 sm:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-3">Share Article</h3>
                <SocialShare
                  title={article.title}
                  url={canonicalUrl}
                  excerpt={article.excerpt}
                  layout="horizontal"
                />
              </div>
            </div>
          </div>

          {/* Author Bio */}
          {article.author && (
            <div className="mt-12 pt-8 border-t border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-6">About the Author</h3>
              <AuthorProfile author={article.author} layout="card" />
            </div>
          )}
        </div>

        {/* Sidebar (Desktop) */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-20 space-y-8">
            {/* Article Tags */}
            {article.tags && article.tags.length > 0 && (
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {article.tags.map((tag: any) => (
                    <Link
                      key={tag._id}
                      href={`/journal/tag/${getSlug(tag.slug)}`}
                      className="px-3 py-1 rounded-full bg-white text-gray-700 text-xs font-medium border border-gray-200 hover:border-emerald-300 hover:text-emerald-600 transition-all"
                    >
                      {tag.title}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Related Experiences */}
            {article.relatedExperiences && article.relatedExperiences.length > 0 && (
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Related Experiences</h3>
                <div className="space-y-3">
                  {article.relatedExperiences.slice(0, 3).map((exp: any) => (
                    <Link
                      key={exp._id}
                      href={`/book?type=${exp._type}&id=${exp._id}`}
                      className="block p-3 rounded-lg bg-white border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all group"
                    >
                      <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                        {exp.title}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Article Metadata */}
            <div className="p-4 rounded-lg border border-gray-200 bg-gray-50 text-sm text-gray-600 space-y-3">
              {article.publishedAt && (
                <div>
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Published</p>
                  <p>{new Date(article.publishedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              )}
              {article.readingTimeMinutes && (
                <div>
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Reading Time</p>
                  <p>{article.readingTimeMinutes} min read</p>
                </div>
              )}
              {article.category && (
                <div>
                  <p className="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-1">Category</p>
                  <Link href={`/journal/category/${getSlug(article.category.slug)}`} className="text-emerald-600 hover:text-emerald-700 font-medium">
                    {article.category.title}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </aside>
      </article>

      {/* Article CTA Section */}
      {article.ctaHeadline && (
        <section className="px-6 md:px-12 py-12 md:py-20 bg-gradient-to-r from-emerald-50 to-blue-50 border-t border-gray-200">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">{article.ctaHeadline}</h2>
            <a
              href={article.ctaLink || '/contact'}
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all group"
            >
              {article.ctaText || 'Book Now'}
              <svg
                className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </section>
      )}

      {/* Related Experiences - Convert Article Content to Experiences */}
      {article.category && (
        <RelatedExperiences articleCategory={article.category.title} />
      )}

      {/* Related Articles */}
      {relatedArticles && relatedArticles.length > 0 && (
        <section className="px-6 md:px-12 py-20 bg-white border-t border-gray-200">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif text-gray-900 mb-12">Read More Stories</h2>
            <ArticleGrid articles={relatedArticles} columns={3} />
          </div>
        </section>
      )}
    </main>
  )
}
