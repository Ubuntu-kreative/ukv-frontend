/**
 * src/app/journal/author/[slug]/page.tsx
 *
 * Author page - displays all articles by an author with bio
 */

import React from 'react'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ArticleGrid from '@/components/journal/ArticleGrid'
import { getArticlesByAuthor, getAuthor } from '@/lib/journal/sanity'

interface PageParams {
  slug: string
}

interface PageProps {
  params: Promise<PageParams>
}

export async function generateMetadata(props: PageProps): Promise<Metadata> {
  const params = await props.params
  const author = await getAuthor(params.slug)

  if (!author) {
    return {}
  }

  return {
    title: `${author.name} | Ubuntu Journal Authors`,
    description: author.bio || `Read articles by ${author.name} from Ubuntu Kreative Village`,
    alternates: {
      canonical: `https://ubuntukreativevillage.com/journal/author/${params.slug}`,
    },
  }
}

export default async function AuthorPage(props: PageProps) {
  const params = await props.params
  const [articles, author] = await Promise.all([
    getArticlesByAuthor(params.slug),
    getAuthor(params.slug),
  ])

  if (!author) {
    notFound()
  }

  return (
    <main className="w-full bg-white">
      {/* Author Header */}
      <section className="py-20 px-6 md:px-12 bg-gradient-to-b from-purple-50 to-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <Link href="/journal" className="text-purple-600 hover:text-purple-700 text-sm font-semibold mb-4 inline-block">
            ← Back to Journal
          </Link>

          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Avatar */}
            {author.avatar?.asset?.url && (
              <Image
                src={author.avatar.asset.url}
                alt={author.name}
                width={120}
                height={120}
                className="rounded-full"
              />
            )}

            {/* Info */}
            <div className="flex-1">
              <h1 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4">{author.name}</h1>
              {author.bio && <p className="text-lg text-gray-600 leading-relaxed mb-6">{author.bio}</p>}

              {/* Social Links */}
              {author.socialLinks && author.socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {author.socialLinks.map((link: any, idx: number) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-lg bg-purple-100 text-purple-700 text-sm font-semibold hover:bg-purple-200 transition-colors"
                    >
                      {link.platform}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-6xl mx-auto">
          {articles && articles.length > 0 ? (
            <>
              <div className="mb-12">
                <h2 className="text-3xl font-serif text-gray-900">
                  {articles.length} {articles.length === 1 ? 'Story' : 'Stories'} by {author.name}
                </h2>
              </div>
              <ArticleGrid articles={articles} columns={3} />
            </>
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">No stories yet by this author.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}
