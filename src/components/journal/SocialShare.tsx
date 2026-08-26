/**
 * src/components/journal/SocialShare.tsx
 *
 * Social sharing buttons for articles
 * Supports: WhatsApp, Facebook, LinkedIn, X (Twitter)
 */

'use client'

import React from 'react'

interface SocialShareProps {
  title: string
  url: string
  excerpt?: string
  layout?: 'horizontal' | 'vertical'
}

export default function SocialShare({ title, url, excerpt = '', layout = 'horizontal' }: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)
  const encodedExcerpt = encodeURIComponent(excerpt)

  const shareLinks = [
    {
      name: 'WhatsApp',
      icon: 'whatsapp',
      url: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      color: 'hover:text-green-500',
      bgColor: 'hover:bg-green-50',
    },
    {
      name: 'Facebook',
      icon: 'facebook',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      color: 'hover:text-blue-600',
      bgColor: 'hover:bg-blue-50',
    },
    {
      name: 'LinkedIn',
      icon: 'linkedin',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      color: 'hover:text-blue-700',
      bgColor: 'hover:bg-blue-50',
    },
    {
      name: 'X',
      icon: 'twitter',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      color: 'hover:text-black',
      bgColor: 'hover:bg-gray-100',
    },
  ]

  const containerClass = layout === 'vertical' ? 'flex flex-col gap-3' : 'flex gap-3'

  return (
    <div className={containerClass}>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center justify-center w-10 h-10 rounded-lg border border-gray-200 text-gray-600 ${link.color} ${link.bgColor} transition-all duration-200 hover:border-gray-300`}
          title={`Share on ${link.name}`}
          aria-label={`Share on ${link.name}`}
        >
          {link.icon === 'whatsapp' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.223-3.797 6.044-1.574 9.099 2.223 3.055 6.044 3.797 9.099 1.574 3.055-2.223 3.797-6.044 1.574-9.099a9.87 9.87 0 00-3.064-2.952zm0-2.382c5.514 0 9.998 4.486 9.998 9.999 0 5.514-4.486 9.998-9.999 9.998C5.486 22 1 17.514 1 12.001 1 6.487 5.486 2 11.001 2z" />
            </svg>
          )}
          {link.icon === 'facebook' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
            </svg>
          )}
          {link.icon === 'linkedin' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.722-2.004 1.418-.103.249-.129.597-.129.946v5.441h-3.554s.035-8.087 0-8.937h3.554v1.26c-.009.015-.022.029-.033.042h.033v-.042c.537-.827 1.5-2.006 3.644-2.006 2.664 0 4.666 1.735 4.666 5.461v4.222zM5.337 9.433c-1.144 0-1.915-.762-1.915-1.715 0-.953.77-1.715 1.958-1.715 1.187 0 1.927.762 1.927 1.715 0 .953-.74 1.715-1.97 1.715zm1.946 10.019H3.394V9.495h3.889v10.019zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
            </svg>
          )}
          {link.icon === 'twitter' && (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M23.953 4.57a10 10 0 002.856-3.915 10 10 0 01-2.937.749 4.501 4.501 0 002.007-2.474 10.006 10.006 0 01-2.828 1.086 4.498 4.498 0 00-7.808 4.101 12.751 12.751 0 01-9.27-4.698 4.502 4.502 0 001.394 6.01A4.48 4.48 0 012.567 9.29v.05a4.5 4.5 0 003.608 4.41 4.5 4.5 0 01-2.034.077 4.507 4.507 0 004.208 3.12A9.04 9.04 0 012 17.85a12.994 12.994 0 007.06 2.07 12.981 12.981 0 0012.987-12.98c0-.198-.003-.397-.01-.595a9.268 9.268 0 002.278-2.37z" />
            </svg>
          )}
        </a>
      ))}
    </div>
  )
}
