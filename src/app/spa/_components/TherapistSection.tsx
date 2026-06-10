'use client'
/**
 * _components/TherapistSection.tsx — CLIENT COMPONENT
 *
 * Therapist tab switching requires useState — must be client.
 * Framer Motion used only for the AnimatePresence transition
 * between therapist profiles (2 cards, not 30+).
 */

import { useState, useCallback } from 'react'
import Image from 'next/image'
import Link  from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { THERAPISTS } from '../_data/spa-data'

const SLIDE = {
  enter: { opacity: 0, x: 18 },
  center: { opacity: 1, x: 0, transition: { duration: 0.45 } },
  exit:  { opacity: 0, x: -14, transition: { duration: 0.25 } },
}

export default function TherapistSection() {
  const [active, setActive] = useState(THERAPISTS[0])
  const handleSelect = useCallback((t: typeof THERAPISTS[number]) => setActive(t), [])

  return (
    <section className="py-28 px-6 md:px-10 bg-[#080808] border-y border-white/5 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-18">
          <p className="text-gold uppercase tracking-[0.35em] text-[10px] mb-5">Healing Practitioners</p>
          <h2 className="font-display text-5xl md:text-6xl leading-none mb-6">
            THERAPIST<span className="italic text-gold"> ENERGY PROFILES</span>
          </h2>
          <p className="text-white/38 text-lg leading-relaxed">
            Every practitioner at Arohamai is matched to you by energy frequency, healing philosophy and therapeutic specialty.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-9 items-start">
          {/* Selector list */}
          <div className="space-y-4">
            {THERAPISTS.map((t) => (
              <div
                key={t.id}
                onClick={() => handleSelect(t)}
                className={`cursor-pointer border rounded-[2rem] p-7 transition-all duration-500 ${
                  active.id === t.id
                    ? 'border-gold/28 bg-gold/5'
                    : 'border-white/5 bg-[#0a0a0a] hover:border-white/10'
                }`}
              >
                <div className="flex gap-5 items-start">
                  <div className="relative w-14 h-14 rounded-full overflow-hidden flex-shrink-0 border border-white/10">
                    <Image src={t.image} alt={t.name} fill sizes="56px" className="object-cover" />
                    <div className="absolute inset-0 rounded-full" style={{ boxShadow: `0 0 16px ${t.aura}` }} />
                  </div>
                  <div>
                    <h3 className="font-display text-2xl leading-none mb-1">{t.name}</h3>
                    <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-2">{t.energy} · {t.experience}</p>
                    <p className="text-white/38 text-sm leading-relaxed">{t.quote}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              variants={SLIDE} initial="enter" animate="center" exit="exit"
              className="border border-white/5 rounded-[2.5rem] overflow-hidden bg-[#0a0a0a]"
            >
              <div className="relative h-[480px]">
                <Image
                  src={active.image} alt={active.name} fill
                  sizes="(max-width:1024px) 100vw, 50vw"
                  className="object-cover" style={{ objectPosition: "50% 15%" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute inset-0" style={{ background: `radial-gradient(circle at center, ${active.aura}, transparent 70%)` }} />
              </div>
              <div className="p-9">
                <p className="text-[8px] uppercase tracking-[0.3em] text-gold mb-2">{active.frequency}</p>
                <h3 className="font-display text-3xl mb-4 leading-none">{active.name}</h3>
                <p className="text-white/48 leading-relaxed mb-7 italic text-sm">&ldquo;{active.philosophy}&rdquo;</p>
                <div className="mb-7">
                  <p className="text-[8px] uppercase tracking-[0.3em] text-white/22 mb-3">Specialties</p>
                  <div className="flex flex-wrap gap-2">
                    {active.specialties.map((s) => (
                      <span key={s} className="px-4 py-1.5 border border-gold/20 text-gold text-[8px] uppercase tracking-[0.22em] rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
                <Link href="/contact" className="btn-gold w-full text-center block !py-4">
                  REQUEST {active.name.split(' ')[0].toUpperCase()}
                </Link>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}