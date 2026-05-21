'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  Bot,
  Calendar,
  Heart,
  Leaf,
  MessageCircle,
  Moon,
  Mountain,
  Sparkles,
  Sun,
  Trees,
  Waves,
} from 'lucide-react'

const retreatTypes = [
  {
    title: 'Creative Retreat',
    description:
      'For writers, designers, founders, artists, and deep thinkers seeking stillness.',
    recommendation: 'Neem Penthouse',
    vibe: 'Silence · Rooftop · Open Sky',
  },
  {
    title: 'Romantic Escape',
    description:
      'Slow mornings, golden sunsets, private dinners, and emotional reconnection.',
    recommendation: 'Buffalo Thorn',
    vibe: 'Sunrise Valley Views',
  },
  {
    title: 'Digital Detox',
    description:
      'Disconnect from noise and return to the rhythm of the land.',
    recommendation: 'Inko',
    vibe: 'Stars · Firelight · Quiet',
  },
  {
    title: 'Wellness Journey',
    description:
      'Spa rituals, grounding, farm meals, herbal tea, deep rest.',
    recommendation: 'Marula Cottage',
    vibe: 'Nature · Calm · Recovery',
  },
]

const experiences = [
  {
    title: 'Arohamai Spa',
    icon: Waves,
    text: 'Hot hydrotherapy, grounding rituals, herbal treatments, and slow healing.',
  },
  {
    title: 'Farm-to-Table Dining',
    icon: Leaf,
    text: 'Fresh harvest meals prepared from the land surrounding your stay.',
  },
  {
    title: 'Moonlight Cinema',
    icon: Moon,
    text: 'Open-air film nights beneath the Kenyan highland sky.',
  },
  {
    title: 'Guided Farm Tours',
    icon: Trees,
    text: 'Walk through the living systems that power the village.',
  },
]

const suggestions = [
  'Which cottage is best for a honeymoon?',
  'What is included in Full Board?',
  'Plan me a 3-day wellness retreat',
  'Which room has the best sunrise view?',
]

export default function MoxiePage() {
  const [selectedRetreat, setSelectedRetreat] = useState('Creative Retreat')

  const selectedRecommendation = useMemo(() => {
    return retreatTypes.find(
      (r) => r.title === selectedRetreat
    )
  }, [selectedRetreat])

  return (
    <main className="min-h-screen bg-[#050505] text-white overflow-hidden">
      {/* HERO */}
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="h-full w-full object-cover opacity-30"
          >
            <source
              src="/videos/cottages-hero.mp4"
              type="video/mp4"
            />
          </video>

          <div className="absolute inset-0 bg-black/70" />

          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_40%)]" />
        </div>

        <div className="relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-32 lg:px-10">
          <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm backdrop-blur">
            <Bot size={16} />
            Ubuntu AI Concierge · Live
          </div>

          <div className="max-w-4xl">
            <p className="mb-6 text-sm uppercase tracking-[0.35em] text-white/50">
              The Living Digital Host
            </p>

            <h1 className="text-5xl font-light leading-tight tracking-tight md:text-7xl">
              Meet{' '}
              <span className="italic text-[#d9c7a2]">
                Moxie
              </span>
              <br />
              the digital spirit of Ubuntu.
            </h1>

            <p className="mt-8 max-w-2xl text-lg leading-8 text-white/70 md:text-xl">
              More than a chatbot — Moxie is your
              personal retreat concierge, wellness guide,
              reservation assistant, and emotional host
              inside Ubuntu Kreative Village.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="#chat"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-medium text-black transition hover:scale-[1.02]"
              >
                Talk To Moxie
                <ArrowRight size={16} />
              </Link>

              <Link
                href="/cottages"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-medium text-white backdrop-blur transition hover:bg-white/10"
              >
                Explore Residences
              </Link>
            </div>
          </div>

          <div className="mt-20 grid gap-6 md:grid-cols-4">
            {[
              '24/7 Guest Assistance',
              'Luxury Stay Recommendations',
              'Spa & Wellness Planning',
              'Direct Booking Guidance',
            ].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur"
              >
                <p className="text-sm text-white/60">
                  {item}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PURPOSE */}
      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 py-28 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#d9c7a2]">
              Why Moxie Exists
            </p>

            <h2 className="text-4xl font-light leading-tight md:text-5xl">
              Hospitality should feel personal before
              you even arrive.
            </h2>
          </div>

          <div className="space-y-6 text-lg leading-8 text-white/70">
            <p>
              Most lodge websites simply display rooms,
              prices, and galleries.
            </p>

            <p>
              Moxie transforms Ubuntu into an immersive,
              interactive hospitality experience —
              helping guests discover the perfect stay,
              understand experiences, and feel emotionally
              connected before booking.
            </p>

            <p>
              The goal is simple:
            </p>

            <div className="rounded-3xl border border-[#d9c7a2]/20 bg-[#d9c7a2]/5 p-6 text-[#f2e7cf]">
              Increase direct bookings through emotional,
              intelligent, luxury digital hospitality.
            </div>
          </div>
        </div>
      </section>

      {/* RETREAT MATCHER */}
      <section className="border-b border-white/10">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#d9c7a2]">
              Retreat Matcher
            </p>

            <h2 className="text-4xl font-light md:text-5xl">
              What kind of experience are you seeking?
            </h2>
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-2">
            <div className="space-y-4">
              {retreatTypes.map((item) => (
                <button
                  key={item.title}
                  onClick={() =>
                    setSelectedRetreat(item.title)
                  }
                  className={`w-full rounded-3xl border p-6 text-left transition ${
                    selectedRetreat === item.title
                      ? 'border-[#d9c7a2] bg-[#d9c7a2]/10'
                      : 'border-white/10 bg-white/[0.03] hover:bg-white/[0.06]'
                  }`}
                >
                  <h3 className="text-xl font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-white/60">
                    {item.description}
                  </p>
                </button>
              ))}
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#121212] to-[#0a0a0a] p-8">
              <div className="mb-6 inline-flex rounded-full border border-[#d9c7a2]/20 bg-[#d9c7a2]/10 px-4 py-2 text-sm text-[#f2e7cf]">
                Moxie Recommendation
              </div>

              <h3 className="text-3xl font-light">
                {selectedRecommendation?.recommendation}
              </h3>

              <p className="mt-4 text-lg text-white/60">
                {selectedRecommendation?.vibe}
              </p>

              <p className="mt-8 text-white/70 leading-8">
                “You are not booking a room. You are
                choosing the emotional atmosphere your
                spirit needs most right now.”
              </p>

              <Link
                href="/cottages"
                className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-4 text-sm font-medium text-black transition hover:scale-[1.02]"
              >
                Explore Residences
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* EXPERIENCES */}
      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#d9c7a2]">
              Intelligent Upselling
            </p>

            <h2 className="text-4xl font-light md:text-5xl">
              Moxie helps guests discover more than a room.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2">
            {experiences.map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
                >
                  <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Icon size={24} />
                  </div>

                  <h3 className="text-2xl font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-4 leading-8 text-white/60">
                    {item.text}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* LIVE CHAT */}
      <section
        id="chat"
        className="border-b border-white/10"
      >
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="grid gap-16 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#d9c7a2]">
                Ask Moxie
              </p>

              <h2 className="text-4xl font-light md:text-5xl">
                Begin your conversation with the village.
              </h2>

              <p className="mt-8 max-w-xl text-lg leading-8 text-white/70">
                Ask about cottages, meal plans, wellness,
                events, farm experiences, private retreats,
                or personalized stay recommendations.
              </p>

              <div className="mt-10 space-y-4">
                {suggestions.map((item) => (
                  <button
                    key={item}
                    className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-5 py-4 text-left transition hover:bg-white/[0.06]"
                  >
                    <span>{item}</span>
                    <MessageCircle size={18} />
                  </button>
                ))}
              </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0d0d0d] p-6 shadow-2xl shadow-black/40">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d9c7a2]/10 text-[#f2e7cf]">
                    <Bot size={22} />
                  </div>

                  <div>
                    <h3 className="font-medium">
                      Moxie AI Concierge
                    </h3>

                    <p className="text-sm text-emerald-400">
                      Live · GPT-4o Powered
                    </p>
                  </div>
                </div>

                <div className="rounded-full border border-white/10 px-3 py-1 text-xs text-white/50">
                  Online
                </div>
              </div>

              <div className="space-y-6 py-8">
                <div className="max-w-md rounded-3xl rounded-tl-md bg-white/5 p-5 text-white/80">
                  Good evening ☀️ I’m Moxie, your Ubuntu
                  AI concierge. Tell me what kind of
                  experience you’re seeking and I’ll help
                  guide you toward the perfect stay.
                </div>

                <div className="ml-auto max-w-sm rounded-3xl rounded-tr-md bg-[#d9c7a2] p-5 text-black">
                  I want a quiet retreat for deep rest and
                  writing.
                </div>

                <div className="max-w-md rounded-3xl rounded-tl-md bg-white/5 p-5 text-white/80">
                  Then Neem Penthouse may be your perfect
                  sanctuary. It was designed for silence,
                  rooftop stillness, and long reflective
                  mornings above the farm valley.
                </div>
              </div>

              <div className="border-t border-white/10 pt-5">
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Ask Moxie anything..."
                    className="h-14 flex-1 rounded-2xl border border-white/10 bg-black px-5 text-white outline-none placeholder:text-white/30 focus:border-[#d9c7a2]"
                  />

                  <button className="inline-flex h-14 items-center justify-center rounded-2xl bg-white px-6 text-sm font-medium text-black transition hover:scale-[1.02]">
                    Send
                  </button>
                </div>

                <p className="mt-4 text-xs text-white/40">
                  Ubuntu AI · Emotional Hospitality System
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BUSINESS VALUE */}
      <section className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto max-w-7xl px-6 py-28 lg:px-10">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm uppercase tracking-[0.3em] text-[#d9c7a2]">
              Why This Matters
            </p>

            <h2 className="text-4xl font-light md:text-5xl">
              Moxie transforms your website into
              interactive digital hospitality.
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: 'Increase Direct Bookings',
                icon: Calendar,
              },
              {
                title: 'Reduce Support Load',
                icon: MessageCircle,
              },
              {
                title: 'Upsell Experiences',
                icon: Sparkles,
              },
              {
                title: 'Build Emotional Luxury',
                icon: Heart,
              },
            ].map((item) => {
              const Icon = item.icon

              return (
                <div
                  key={item.title}
                  className="rounded-[2rem] border border-white/10 bg-white/[0.03] p-8"
                >
                  <div className="mb-6 inline-flex rounded-2xl border border-white/10 bg-white/5 p-4">
                    <Icon size={22} />
                  </div>

                  <h3 className="text-xl font-medium leading-snug">
                    {item.title}
                  </h3>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,199,162,0.12),transparent_45%)]" />

        <div className="relative mx-auto max-w-5xl px-6 py-32 text-center lg:px-10">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#d9c7a2]/20 bg-[#d9c7a2]/10 px-5 py-2 text-sm text-[#f2e7cf]">
            <Sun size={16} />
            Ubuntu Kreative Village · Kenya
          </div>

          <h2 className="text-5xl font-light leading-tight md:text-7xl">
            Your journey into Ubuntu begins with a conversation.
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/60">
            Let Moxie guide you toward rest, beauty,
            stillness, and reconnection inside the living
            village.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              href="/cottages"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-medium text-black transition hover:scale-[1.02]"
            >
              Reserve Your Escape
              <ArrowRight size={16} />
            </Link>

            <Link
              href="/spa"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.03] px-7 py-4 text-sm font-medium text-white transition hover:bg-white/[0.06]"
            >
              Explore The Spa
            </Link>
          </div>

          <p className="mt-14 text-sm tracking-[0.3em] text-white/30">
            “I am because we are.”
          </p>
        </div>
      </section>
    </main>
  )
}