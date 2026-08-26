'use client'

import { motion } from 'framer-motion'
import type { GalleryStats } from './Gallery.data'

interface StatsStripProps {
  stats: GalleryStats
}

export function StatsStrip({ stats }: StatsStripProps) {
  const items = [
    { label: 'Artists Featured', value: stats.artistsFeatured },
    { label: 'Exhibitions Hosted', value: stats.exhibitionsHosted },
    { label: 'Workshops Run', value: stats.workshopsRun },
    { label: 'Years Running', value: stats.yearsRunning },
  ]

  return (
    <section className="border-y border-stone-200 bg-stone-50">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-6 py-12 sm:px-10 lg:grid-cols-4 lg:px-16">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
            className="text-center lg:text-left"
          >
            <span className="font-serif text-4xl text-stone-900 sm:text-5xl">{item.value}</span>
            <p className="mt-1 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">
              {item.label}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  )
}