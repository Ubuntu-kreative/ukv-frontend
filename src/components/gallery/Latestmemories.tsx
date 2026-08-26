'use client'

import { useMemo, useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import type { GalleryPhoto } from './Gallery.data'

interface LatestMemoriesProps {
  photos: GalleryPhoto[]
  onSelect: (photo: GalleryPhoto) => void
  onViewAll: () => void
}

const MONTH_FORMAT = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' })

export function LatestMemories({ photos, onSelect, onViewAll }: LatestMemoriesProps) {
  const latest = useMemo(
    () =>
      [...photos]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 6),
    [photos]
  )

  return (
    <section id="latest-memories" className="mx-auto max-w-7xl px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mb-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-700">Fresh from the village</span>
          <h2 className="mt-3 font-serif text-3xl text-stone-900 sm:text-4xl">Latest Memories</h2>
        </div>
        <button
          type="button"
          onClick={onViewAll}
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-stone-900 transition-colors hover:text-amber-700"
        >
          View All Memories
          <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
        {latest.map((photo, i) => (
          <MemoryCard key={photo.id} photo={photo} index={i} onSelect={onSelect} />
        ))}
      </div>
    </section>
  )
}

function MemoryCard({
  photo,
  index,
  onSelect,
}: {
  photo: GalleryPhoto
  index: number
  onSelect: (photo: GalleryPhoto) => void
}) {
  const [loaded, setLoaded] = useState(false)

  return (
    <motion.button
      type="button"
      onClick={() => onSelect(photo)}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: (index % 3) * 0.08 }}
      className="group relative aspect-[4/5] overflow-hidden rounded-2xl bg-stone-200 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-500"
    >
      {!loaded && <div className="absolute inset-0 animate-pulse bg-stone-200" aria-hidden />}
      <Image
        src={photo.image}
        alt={photo.title}
        fill
        loading="lazy"
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 380px"
        className={`object-cover transition-all duration-700 ease-out group-hover:scale-105 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={() => setLoaded(true)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/10 to-transparent opacity-90 transition-opacity group-hover:opacity-100" />
      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-amber-300">
          {photo.category}
        </span>
        <h3 className="mt-1 font-serif text-base text-white sm:text-lg">{photo.title}</h3>
        <time dateTime={photo.date} className="mt-1 block text-xs text-stone-300">
          {MONTH_FORMAT.format(new Date(photo.date))}
        </time>
      </div>
    </motion.button>
  )
}