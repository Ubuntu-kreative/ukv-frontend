/**
 * src/components/journal/ImageGallery.tsx
 *
 * Image gallery component for articles
 * Supports grid layouts and lightbox functionality
 */

'use client'

import React, { useState } from 'react'
import Image from 'next/image'

interface GalleryImage {
  src: string
  alt: string
  caption?: string
}

interface ImageGalleryProps {
  images: GalleryImage[]
  columns?: 2 | 3 | 4
  layout?: 'grid' | 'carousel'
}

export default function ImageGallery({ images, columns = 3, layout = 'grid' }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)

  if (!images || images.length === 0) return null

  const gridColsClass = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
  }[columns]

  if (layout === 'carousel') {
    return (
      <figure className="my-12 md:my-16">
        <div className="relative rounded-xl overflow-hidden bg-gray-100">
          {images.length > 0 && (
            <>
              <Image src={images[0].src} alt={images[0].alt} width={1200} height={700} className="w-full h-auto" />
              {images[0].caption && (
                <figcaption className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4 text-white text-sm">
                  {images[0].caption}
                </figcaption>
              )}
            </>
          )}
        </div>
        {images.length > 1 && (
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                className="flex-shrink-0 w-20 h-20 rounded border-2 border-gray-200 hover:border-emerald-500 transition-colors overflow-hidden"
              >
                <Image src={img.src} alt={img.alt} width={80} height={80} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </figure>
    )
  }

  return (
    <figure className="my-12 md:my-16">
      <div className={`grid ${gridColsClass} gap-4 md:gap-6`}>
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setSelectedIndex(idx)}
            className="group relative rounded-lg overflow-hidden bg-gray-100 aspect-square md:aspect-auto md:h-64 hover:shadow-lg transition-all duration-300"
          >
            <Image
              src={img.src}
              alt={img.alt}
              fill
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90 p-4">
          <button onClick={() => setSelectedIndex(null)} className="absolute top-4 right-4 text-white text-3xl leading-none hover:text-gray-300">
            ×
          </button>

          <button
            onClick={() => setSelectedIndex((selectedIndex - 1 + images.length) % images.length)}
            className="absolute left-4 text-white text-3xl leading-none hover:text-gray-300"
            aria-label="Previous image"
          >
            ‹
          </button>

          <figure className="max-w-4xl max-h-[80vh] relative">
            <Image
              src={images[selectedIndex].src}
              alt={images[selectedIndex].alt}
              width={1200}
              height={800}
              className="w-full h-auto rounded"
            />
            {images[selectedIndex].caption && (
              <figcaption className="text-white text-center mt-4 text-sm">{images[selectedIndex].caption}</figcaption>
            )}
            <p className="text-white text-center text-sm mt-4">
              {selectedIndex + 1} of {images.length}
            </p>
          </figure>

          <button
            onClick={() => setSelectedIndex((selectedIndex + 1) % images.length)}
            className="absolute right-4 text-white text-3xl leading-none hover:text-gray-300"
            aria-label="Next image"
          >
            ›
          </button>
        </div>
      )}
    </figure>
  )
}
