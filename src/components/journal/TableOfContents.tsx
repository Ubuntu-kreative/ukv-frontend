/**
 * src/components/journal/TableOfContents.tsx
 *
 * Table of contents for articles
 * Generates links from h2/h3 headings
 */

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'

export default function TableOfContents() {
  const [headings, setHeadings] = useState<Array<{ id: string; text: string; level: number }>>([])

  useEffect(() => {
    // Find all h2 and h3 elements in the article content
    const articleContent = document.querySelector('article')
    if (!articleContent) return

    const headingElements = articleContent.querySelectorAll('h2, h3')
    const headingList = Array.from(headingElements).map((el, idx) => {
      const id = el.id || `heading-${idx}`
      if (!el.id) el.id = id
      return {
        id,
        text: el.textContent || '',
        level: parseInt(el.tagName[1]),
      }
    })

    setHeadings(headingList)
  }, [])

  if (headings.length < 3) return null

  return (
    <nav className="sticky top-20 p-4 md:p-6 rounded-lg bg-gray-50 border border-gray-200 md:col-span-1">
      <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Contents</h3>
      <ul className="space-y-2 text-sm">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? 'ml-4' : ''}
          >
            <Link
              href={`#${heading.id}`}
              className="text-gray-600 hover:text-emerald-600 hover:font-semibold transition-colors truncate block"
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
