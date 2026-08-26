'use client'

import { useId } from 'react'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import { motion } from 'framer-motion'
import type { ExhibitSlide } from './Gallery.data'

import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'

interface HeroSlideshowProps {
  slides: ExhibitSlide[]
}

/**
 * Fullscreen cinematic hero. First slide image is priority-loaded for LCP;
 * the rest lazy-load. Fade transition (no slide-translate) keeps it feeling
 * like a film dissolve rather than a carousel.
 */
export function HeroSlideshow({ slides }: HeroSlideshowProps) {
  const navPrevId = useId()
  const navNextId = useId()

  return (
    <section
      aria-label="Featured exhibitions"
      className="relative h-[92svh] min-h-[560px] w-full overflow-hidden bg-stone-950"
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        autoplay={{ delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation={{ prevEl: `#${navPrevId}`, nextEl: `#${navNextId}` }}
        pagination={{ clickable: true, bulletActiveClass: 'swiper-pagination-bullet-active !bg-amber-400' }}
        speed={1100}
        className="h-full w-full [&_.swiper-pagination]:!bottom-8"
      >
        {slides.map((slide, i) => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                priority={i === 0}
                loading={i === 0 ? 'eager' : 'lazy'}
                sizes="100vw"
                className="object-cover"
              />
              {/* Cinematic overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/20 to-stone-950/50" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950/60 via-transparent to-transparent" />

              <div className="relative z-10 flex h-full max-w-7xl flex-col justify-end px-6 pb-28 sm:px-10 sm:pb-32 lg:px-16">
                <motion.span
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="mb-4 inline-block w-fit rounded-full border border-amber-400/40 bg-amber-400/10 px-4 py-1.5 text-xs font-medium uppercase tracking-[0.2em] text-amber-300 backdrop-blur-sm"
                >
                  Ubuntu Kreative Village
                </motion.span>
                <motion.h1
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.1 }}
                  className="max-w-2xl font-serif text-4xl leading-[1.05] text-stone-50 sm:text-5xl lg:text-6xl"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.22 }}
                  className="mt-5 max-w-lg text-base leading-relaxed text-stone-200/90 sm:text-lg"
                >
                  {slide.description}
                </motion.p>
                <motion.a
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.34 }}
                  href={slide.cta.href}
                  className="group mt-8 inline-flex w-fit items-center gap-3 rounded-full bg-amber-400 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-stone-900 transition-all hover:bg-amber-300 hover:gap-4"
                >
                  {slide.cta.label}
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </motion.a>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom nav arrows */}
      <button
        id={navPrevId}
        type="button"
        aria-label="Previous slide"
        className="absolute left-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:left-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
      <button
        id={navNextId}
        type="button"
        aria-label="Next slide"
        className="absolute right-3 top-1/2 z-20 -translate-y-1/2 rounded-full border border-white/20 bg-white/10 p-3 text-white backdrop-blur-md transition-colors hover:bg-white/20 sm:right-6"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Scroll cue */}
      <div className="pointer-events-none absolute bottom-8 right-6 z-10 hidden flex-col items-center gap-2 text-stone-300/70 sm:flex lg:right-16">
        <span className="text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          className="h-8 w-px bg-gradient-to-b from-stone-300/70 to-transparent"
        />
      </div>
    </section>
  )
}