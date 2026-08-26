/**
 * src/components/journal/PullQuote.tsx
 *
 * Large pull quote component for emphasis
 * Can be used inline in article content
 */

'use client'

import React from 'react'

interface PullQuoteProps {
  text: string
  author?: string
  layout?: 'left' | 'center' | 'right'
}

export default function PullQuote({ text, author, layout = 'center' }: PullQuoteProps) {
  const alignmentClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[layout]

  return (
    <figure className={`my-12 md:my-16 px-6 md:px-12 py-8 md:py-12 bg-gradient-to-br from-emerald-50 to-blue-50 rounded-xl border-l-4 border-emerald-500 ${alignmentClass}`}>
      <blockquote className="text-2xl md:text-3xl font-serif text-gray-900 leading-relaxed mb-6">
        "{text}"
      </blockquote>
      {author && <figcaption className="text-sm md:text-base font-semibold text-gray-700">— {author}</figcaption>}
    </figure>
  )
}
