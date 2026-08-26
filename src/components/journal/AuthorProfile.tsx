/**
 * src/components/journal/AuthorProfile.tsx
 *
 * Author profile card component
 * Display author info with bio, image, and link to author page
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Author {
  _id: string
  name: string
  slug: string
  bio?: string
  image?: {
    asset?: {
      url: string
    }
  }
  email?: string
}

interface AuthorProfileProps {
  author: Author
  layout?: 'card' | 'inline'
}

export default function AuthorProfile({ author, layout = 'card' }: AuthorProfileProps) {
  if (!author) return null

  const getSlug = (slug: any) => {
    if (typeof slug === 'string') return slug
    if (slug?.current) return slug.current
    return ''
  }

  const authorSlug = getSlug(author.slug)

  if (layout === 'inline') {
    return (
      <Link href={`/journal/author/${authorSlug}`} className="flex items-center gap-3 group">
        {author.image?.asset?.url && (
          <Image
            src={author.image.asset.url}
            alt={author.name}
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover"
          />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors truncate">{author.name}</p>
          {author.bio && (
            <p className="text-xs text-gray-600 line-clamp-1">{author.bio}</p>
          )}
        </div>
      </Link>
    )
  }

  return (
    <Link
      href={`/journal/author/${authorSlug}`}
      className="block p-6 rounded-lg border border-gray-200 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 group"
    >
      <div className="flex flex-col items-center text-center">
        {author.image?.asset?.url && (
          <Image
            src={author.image.asset.url}
            alt={author.name}
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover mb-4"
          />
        )}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors">
          {author.name}
        </h3>
        {author.bio && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {author.bio}
          </p>
        )}
        <div className="text-sm font-semibold text-emerald-600 group-hover:text-emerald-700 transition-colors">
          View Profile →
        </div>
      </div>
    </Link>
  )
}
