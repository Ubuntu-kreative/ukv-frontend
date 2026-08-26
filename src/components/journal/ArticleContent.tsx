/**
 * src/components/journal/ArticleContent.tsx
 *
 * Render rich content blocks from Sanity
 */

'use client'

import React from 'react'
import Image from 'next/image'
import { PortableText } from '@portabletext/react'
import PullQuote from './PullQuote'
import ImageGallery from './ImageGallery'
import VideoEmbed from './VideoEmbed'

interface BlockContent {
  _type: string
  [key: string]: any
}

interface ArticleContentProps {
  content: BlockContent[]
}

const components = {
  block: ({ children, value }: any) => {
    if (value?.style === 'h1') {
      return <h2 className="text-4xl font-serif text-gray-900 mt-12 mb-6">{children}</h2>
    }
    if (value?.style === 'h2') {
      return <h3 className="text-3xl font-serif text-gray-900 mt-10 mb-4">{children}</h3>
    }
    if (value?.style === 'h3') {
      return <h4 className="text-2xl font-serif text-gray-800 mt-8 mb-3">{children}</h4>
    }
    if (value?.style === 'blockquote') {
      return (
        <blockquote className="border-l-4 border-emerald-500 pl-6 italic text-gray-700 text-lg my-8 py-4">
          {children}
        </blockquote>
      )
    }
    return <p className="text-lg text-gray-700 leading-relaxed mb-4">{children}</p>
  },

  list: ({ children, value }: any) => {
    if (value.style === 'bullet') {
      return <ul className="list-disc list-inside space-y-2 my-4 text-gray-700">{children}</ul>
    }
    return <ol className="list-decimal list-inside space-y-2 my-4 text-gray-700">{children}</ol>
  },

  listItem: ({ children }: any) => <li className="ml-4">{children}</li>,

  marks: {
    strong: ({ children }: any) => <strong className="font-bold">{children}</strong>,
    em: ({ children }: any) => <em className="italic">{children}</em>,
    code: ({ children }: any) => (
      <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">{children}</code>
    ),
  },

  types: {
    image: ({ value }: any) => (
      <figure className="my-8">
        {value.asset?.url && (
          <Image
            src={value.asset.url}
            alt={value.alt || 'Article image'}
            width={800}
            height={600}
            className="w-full rounded-lg"
          />
        )}
        {value.caption && <figcaption className="text-sm text-gray-600 mt-2 text-center">{value.caption}</figcaption>}
      </figure>
    ),

    pullQuote: ({ value }: any) => (
      <PullQuote text={value.text} author={value.author} layout={value.layout || 'center'} />
    ),

    gallery: ({ value }: any) => {
      if (!value.images) return null
      const images = value.images.map((img: any) => ({
        src: img.asset?.url || '',
        alt: img.alt || 'Gallery image',
        caption: img.caption,
      }))
      return <ImageGallery images={images} columns={value.columns || 3} layout={value.layout || 'grid'} />
    },

    video: ({ value }: any) => (
      <VideoEmbed url={value.url} title={value.title} caption={value.caption} />
    ),

    callout: ({ value }: any) => {
      const styles: Record<string, string> = {
        info: 'bg-blue-50 border-blue-200 text-blue-900',
        tip: 'bg-emerald-50 border-emerald-200 text-emerald-900',
        highlight: 'bg-amber-50 border-amber-200 text-amber-900',
        warning: 'bg-rose-50 border-rose-200 text-rose-900',
      }
      return (
        <div className={`border-l-4 p-4 my-6 rounded ${styles[value.type] || styles.info}`}>
          <p className="font-semibold mb-2">{value.type?.charAt(0).toUpperCase() + value.type?.slice(1)}</p>
          <p>{value.text}</p>
        </div>
      )
    },
  },
}

export default function ArticleContent({ content }: ArticleContentProps) {
  if (!content || content.length === 0) {
    return null
  }

  return (
    <div className="prose prose-lg max-w-2xl">
      <PortableText value={content} components={components as any} />
    </div>
  )
}
