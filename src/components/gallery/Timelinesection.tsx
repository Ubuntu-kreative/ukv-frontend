'use client'

import { motion } from 'framer-motion'
import type { TimelineYear } from './Gallery.data'

interface TimelineSectionProps {
  timeline: TimelineYear[]
}

export function TimelineSection({ timeline }: TimelineSectionProps) {
  return (
    <section className="bg-stone-900 px-6 py-20 sm:px-10 sm:py-28 lg:px-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-16 text-center">
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-amber-400">Our Journey</span>
          <h2 className="mt-3 font-serif text-3xl text-stone-50 sm:text-4xl">The Village Story</h2>
        </div>

        <div className="relative">
          {/* Vertical spine */}
          <div
            aria-hidden
            className="absolute left-[15px] top-2 bottom-2 w-px bg-gradient-to-b from-amber-400/60 via-stone-700 to-transparent sm:left-1/2 sm:-translate-x-1/2"
          />

          <ol className="space-y-16">
            {timeline.map((yearBlock, yi) => (
              <li key={yearBlock.year}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ duration: 0.6 }}
                  className="relative flex flex-col gap-6 sm:flex-row sm:items-start"
                >
                  {/* Year marker */}
                  <div className="relative z-10 flex items-center gap-4 sm:w-1/2 sm:justify-end sm:pr-10">
                    <span className="absolute left-0 top-1 h-[9px] w-[9px] -translate-x-1/2 rounded-full bg-amber-400 ring-4 ring-stone-900 sm:left-auto sm:right-0 sm:translate-x-1/2" />
                    <span className="ml-8 font-serif text-2xl text-amber-400 sm:ml-0">{yearBlock.year}</span>
                  </div>

                  <div className="sm:w-1/2 sm:pl-10">
                    <ul className="space-y-4">
                      {yearBlock.milestones.map((milestone, mi) => (
                        <motion.li
                          key={milestone.title}
                          initial={{ opacity: 0, x: -12 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.4, delay: 0.1 + mi * 0.08 }}
                          className="rounded-xl border border-stone-800 bg-stone-800/40 p-4"
                        >
                          <h3 className="font-serif text-lg text-stone-50">{milestone.title}</h3>
                          <p className="mt-1 text-sm leading-relaxed text-stone-400">{milestone.description}</p>
                        </motion.li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}