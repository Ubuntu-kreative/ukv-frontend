/**
 * src/lib/ubuntu-testimonials.ts
 * 
 * Real Ubuntu guest testimonials and community reflections
 * Used for Voices of Ubuntu section
 */

export interface Testimonial {
  _id: string
  name: string
  country?: string
  visitType: 'retreat' | 'wellness' | 'accommodation' | 'events' | 'community'
  testimonial: string
  date?: string
  featured?: boolean
  relatedArticleSlug?: string
}

export const UBUNTU_TESTIMONIALS: Testimonial[] = [
  {
    _id: 'testimonial-1',
    name: 'Sophie M.',
    country: 'Netherlands',
    visitType: 'retreat',
    testimonial:
      'Ubuntu Kreative Village is not just a place—it\'s a philosophical experience. Within days of arrival, I felt held by the community and the land. My creative practice transformed. I left with a clear sense of purpose I hadn\'t felt in years.',
    date: '2025-11-15',
    featured: true,
    relatedArticleSlug: 'creative-living',
  },
  {
    _id: 'testimonial-2',
    name: 'James K.',
    country: 'Canada',
    visitType: 'wellness',
    testimonial:
      'The hydrotherapy treatments and sound healing sessions literally changed my nervous system. I came exhausted. I left restored. But more than that—I learned a philosophy of living that I\'m taking home.',
    date: '2025-10-22',
    featured: true,
    relatedArticleSlug: 'wellness-at-ubuntu',
  },
  {
    _id: 'testimonial-3',
    name: 'Amara L.',
    country: 'South Africa',
    visitType: 'community',
    testimonial:
      'The fire circle evenings taught me what genuine connection looks like. Stories shared under the stars with strangers who felt like family—this is what community actually means. I understand ubuntu now.',
    date: '2025-09-18',
    featured: true,
    relatedArticleSlug: 'why-community-matters',
  },
  {
    _id: 'testimonial-4',
    name: 'Marcus T.',
    country: 'UK',
    visitType: 'accommodation',
    testimonial:
      'The Neem Penthouse rooftop became my sacred space. Watching the valley wake each morning with fresh coffee—this simplicity was profound. Every detail was thoughtfully designed for presence.',
    date: '2025-08-30',
    featured: true,
    relatedArticleSlug: 'discover-accommodation',
  },
  {
    _id: 'testimonial-5',
    name: 'Zara P.',
    country: 'Egypt',
    visitType: 'retreat',
    testimonial:
      'As a writer, I needed silence and inspiration. I found both. But I also found a community of creators supporting each other. The farm-to-table meals, the morning yoga, the late-night conversations—it\'s a holistic creative laboratory.',
    date: '2025-07-12',
    featured: false,
    relatedArticleSlug: 'creative-living',
  },
  {
    _id: 'testimonial-6',
    name: 'David & Elena',
    country: 'Italy',
    visitType: 'accommodation',
    testimonial:
      'We came for a romantic escape. We stayed because we fell in love—with the valley, the community, the philosophy. We\'re already planning our return and bringing friends.',
    date: '2025-06-08',
    featured: false,
    relatedArticleSlug: 'welcome-to-ubuntu',
  },
  {
    _id: 'testimonial-7',
    name: 'Dr. Kofi A.',
    country: 'Ghana',
    visitType: 'wellness',
    testimonial:
      'As a physician, I\'m skeptical. But the integration of traditional medicine, modern wellness, and community healing—backed by genuine expertise—changed my understanding of health. I\'m bringing this knowledge back to my practice.',
    date: '2025-05-20',
    featured: false,
    relatedArticleSlug: 'wellness-at-ubuntu',
  },
  {
    _id: 'testimonial-8',
    name: 'Yuki K.',
    country: 'Japan',
    visitType: 'community',
    testimonial:
      'I came alone, not speaking much English. But Ubuntu\'s philosophy transcends language. The team, the guests, the environment—everyone was welcoming. I felt seen and valued immediately.',
    date: '2025-04-15',
    featured: false,
    relatedArticleSlug: 'meaning-of-ubuntu',
  },
]

export interface CommunityReflection {
  _id: string
  reflection: string
  author?: string
  featured: boolean
  category: 'philosophy' | 'memory' | 'return' | 'transformation'
}

export const COMMUNITY_REFLECTIONS: CommunityReflection[] = [
  {
    _id: 'reflection-1',
    reflection: 'Ubuntu means: I am because we are. Here, that\'s not a concept—it\'s the daily practice.',
    author: 'Guest from Germany',
    featured: true,
    category: 'philosophy',
  },
  {
    _id: 'reflection-2',
    reflection:
      'My favorite memory: sunrise yoga on the rooftop, valley below turning gold, complete silence, perfect coffee. Pure grace.',
    author: 'Creative Guest',
    featured: true,
    category: 'memory',
  },
  {
    _id: 'reflection-3',
    reflection:
      'I returned because I needed to remember who I was when my nervous system felt safe. Ubuntu reminded me.',
    author: 'Returning Guest',
    featured: true,
    category: 'return',
  },
  {
    _id: 'reflection-4',
    reflection:
      'Three weeks of silence, presence, and genuine connection transformed how I show up in my life. This place does that.',
    author: 'Retreat Participant',
    featured: true,
    category: 'transformation',
  },
  {
    _id: 'reflection-5',
    reflection:
      'The farm teaches you about seasons. The fire circle teaches you about human connection. The silence teaches you about yourself.',
    author: 'Long-term Guest',
    featured: false,
    category: 'philosophy',
  },
  {
    _id: 'reflection-6',
    reflection:
      'I came here broken. I left here healing. I returned here whole. Ubuntu is a mirror for your own transformation.',
    author: 'Wellness Guest',
    featured: false,
    category: 'transformation',
  },
]
