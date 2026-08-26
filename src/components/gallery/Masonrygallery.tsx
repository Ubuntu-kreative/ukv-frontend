'use client'

import { useState } from 'react'
import Image from 'next/image'
import Masonry from 'react-masonry-css'
import { AnimatePresence, motion } from 'framer-motion'
import type { GalleryPhoto } from './Gallery.data'

interface MasonryGalleryProps {
  photos: GalleryPhoto[]
  onSelect: (photo: GalleryPhoto) => void
}

const BREAKPOINTS = {
  default: 4, // desktop
  1280: 4,
  1024: 3, // tablet
  768: 2, // mobile
  480: 1, // small mobile
}

const DATE_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function MasonryGallery({ photos, onSelect }: MasonryGalleryProps) {
  return (
    <AnimatePresence mode="popLayout">
      <Masonry
        breakpointCols={BREAKPOINTS}
        className="-ml-4 flex w-auto sm:-ml-5"
        columnClassName="pl-4 sm:pl-5 bg-clip-padding"
      >
        {photos.map((photo, i) => (
          <PhotoCard key={photo.id} photo={photo} index={i} onSelect={onSelect} />
        ))}
      </Masonry>
    </AnimatePresence>
  )
}

function PhotoCard({
  photo,
  index,
  onSelect,
}: {
  photo: GalleryPhoto
  index: number
  onSelect: (photo: GalleryPhoto) => void
}) {
  const [loaded, setLoaded] = useState(false)
  const ratio = photo.aspect === 'portrait' ? 5 / 6 : photo.aspect === 'square' ? 1 : 4 / 3

  return (
    <motion.button
      type="button"
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.35, delay: Math.min(index, 8) * 0.04 }}
      onClick={() => onSelect(photo)}
      className="group relative mb-4 block w-full overflow-hidden rounded-2xl bg-stone-200 text-left sm:mb-5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
      style={{ aspectRatio: ratio }}
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-stone-200" aria-hidden />}
      <Image
        src={photo.image}
        alt={photo.title}
        fill
        loading="lazy"
        sizes="(max-width: 480px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className={`object-cover transition-all duration-700 ease-out group-hover:scale-110 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/0 to-transparent opacity-70 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 translate-y-2 p-4 opacity-90 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-300">
          {photo.category}
        </span>
        <h3 className="mt-1 font-serif text-base leading-snug text-white">{photo.title}</h3>
        <time dateTime={photo.date} className="mt-1 block text-xs text-stone-300">
          {DATE_FORMAT.format(new Date(photo.date))}
        </time>
      </div>
    </motion.button>
  )
}