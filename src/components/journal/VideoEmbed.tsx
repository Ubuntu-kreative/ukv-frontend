/**
 * src/components/journal/VideoEmbed.tsx
 *
 * Video embedding component for articles
 * Supports YouTube, Vimeo, and custom video URLs
 */

'use client'

import React from 'react'

interface VideoEmbedProps {
  url: string
  title?: string
  caption?: string
  width?: number
  height?: number
}

export default function VideoEmbed({ url, title, caption, width = 1200, height = 675 }: VideoEmbedProps) {
  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/
    const match = url.match(regExp)
    return match && match[2].length === 11 ? match[2] : null
  }

  // Extract Vimeo video ID
  const getVimeoId = (url: string) => {
    const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^/]*)\/videos\/|album\/(\d+)\/videos\/)?(\d+)/
    const match = url.match(regExp)
    return match ? match[3] : null
  }

  const youtubeId = getYouTubeId(url)
  const vimeoId = getVimeoId(url)

  const aspectRatio = (height / width) * 100

  return (
    <figure className="my-12 md:my-16">
      <div className="relative rounded-xl overflow-hidden bg-gray-900" style={{ paddingBottom: `${aspectRatio}%` }}>
        {youtubeId && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youtubeId}`}
            title={title || 'YouTube video'}
            allowFullScreen
            loading="lazy"
            style={{ border: 'none' }}
          />
        )}

        {vimeoId && (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={title || 'Vimeo video'}
            allowFullScreen
            loading="lazy"
            style={{ border: 'none' }}
          />
        )}

        {!youtubeId && !vimeoId && (
          <video
            className="absolute inset-0 w-full h-full object-cover"
            controls
            title={title}
            src={url}
          />
        )}
      </div>
      {caption && (
        <figcaption className="text-sm text-gray-600 mt-3 text-center">
          {caption}
        </figcaption>
      )}
    </figure>
  )
}
