/**
 * src/components/journal/HeroSection.tsx
 *
 * Full-screen immersive hero for journal homepage
 * Features: Cinematic photography, glassmorphism, elegant animations
 */

'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'

interface HeroSectionProps {
  backgroundImage?: string
  title?: string
  subtitle?: string
}

export default function HeroSection({
  backgroundImage = '/images/Cottages-front.jpeg',
  title = 'Ubuntu Journal',
  subtitle = 'Stories, Travel, Culture, Creativity and Community',
}: HeroSectionProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  }

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Parallax */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage}
          alt="Ubuntu Kreative Village cottages"
          fill
          className="object-cover"
          priority
          quality={90}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
      </div>

      {/* Content */}
      <motion.div
        className="relative z-10 text-center px-6 md:px-12"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-5xl md:text-7xl font-serif font-light text-white mb-6 tracking-tight"
        >
          {title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-xl md:text-2xl text-gray-100 font-light max-w-2xl mx-auto mb-12"
        >
          {subtitle}
        </motion.p>

        {/* Category Pills (Preview) */}
        <motion.div
          variants={itemVariants}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {['Stories', 'Travel', 'Culture', 'Events', 'Wellness'].map((category, idx) => (
            <div
              key={idx}
              className="px-4 py-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-md text-white text-sm hover:bg-white/20 transition-colors"
            >
              {category}
            </div>
          ))}
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center"
        >
          <Link
            href="#featured"
            className="flex flex-col items-center gap-2 text-white hover:opacity-70 transition-opacity"
          >
            <span className="text-sm font-light">Explore</span>
            <ArrowDown size={24} />
          </Link>
        </motion.div>
      </motion.div>
    </section>
  )
}
