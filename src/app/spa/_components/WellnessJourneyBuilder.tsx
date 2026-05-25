'use client'
/**
 * _components/WellnessJourneyBuilder.tsx — CLIENT COMPONENT
 *
 * Interactive goal-selector with Moxie recommendation.
 * useMemo prevents recommended from recomputing on every render.
 * Framer Motion used sparingly — only for the recommendation reveal.
 */

import { useState, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RITUALS, WELLNESS_GOALS, WELLNESS_RECOMMENDATIONS,
} from '../_data/spa-data'

// Stable variant — module-level, never recreated
const REVEAL = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit:    { opacity: 0, y: 8 },
}

// O(1) lookup
const RITUAL_BY_ID = new Map(RITUALS.map((r) => [r.id, r]))

export default function WellnessJourneyBuilder() {
  const [selected, setSelected] = useState<string | null>(null)

  // FIX: useMemo — never recomputes unless `selected` changes
  const recommended = useMemo(() => {
    if (!selected) return null
    const id = WELLNESS_RECOMMENDATIONS[selected]
    return id ? (RITUAL_BY_ID.get(id) ?? null) : null
  }, [selected])

  const handleGoal = useCallback((goal: string) => {
    setSelected(prev => prev === goal ? null : goal)
  }, [])

  return (
    <section className="py-28 px-6 md:px-10 bg-[#050505]">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Moxie Wellness Intelligence</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            FIND YOUR<span className="italic text-gold"> RITUAL</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            What does your body need today? Select your intention and Moxie will recommend the right ritual.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 mb-12">
          {WELLNESS_GOALS.map((goal) => (
            <button
              key={goal}
              onClick={() => handleGoal(goal)}
              className={`px-6 py-3 rounded-full border text-[9px] uppercase tracking-[0.28em] transition-all duration-500 ${
                selected === goal
                  ? 'border-gold bg-gold/12 text-gold'
                  : 'border-white/10 text-white/38 hover:border-white/22'
              }`}
            >
              {goal}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {recommended && (
            <motion.div
              variants={REVEAL} initial="hidden" animate="visible" exit="exit"
              className="border border-gold/18 bg-[#0a0a0a] rounded-[2rem] p-7 md:p-10 flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="relative w-full md:w-[280px] h-[200px] rounded-[1.5rem] overflow-hidden flex-shrink-0">
                <Image
                  src={recommended.image} alt={recommended.name} fill
                  sizes="280px" className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
              <div className="flex-1">
                <p className="text-[8px] uppercase tracking-[0.35em] text-gold mb-2">
                  Moxie Recommends · {selected}
                </p>
                <h3 className="font-display text-3xl md:text-4xl leading-none mb-3">{recommended.name}</h3>
                <p className="text-white/42 text-sm leading-relaxed mb-6">{recommended.description}</p>
                <div className="flex gap-3 flex-wrap">
                  {/* data-ritual-id handled by ModalController */}
                  <button
                    data-ritual-id={recommended.id}
                    className="btn-gold !py-3 !text-[9px]"
                  >
                    View This Ritual →
                  </button>
                  <span className="px-5 py-3 border border-white/8 text-white/28 text-[9px] uppercase tracking-[0.22em] rounded-full">
                    KES {recommended.price.toLocaleString()} · {recommended.duration}
                  </span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}