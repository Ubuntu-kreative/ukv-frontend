/**
 * UBUNTU JOURNAL 2.0 - Core Content Library
 *
 * Real Ubuntu Kreative Village content
 * Remove Kisumu/Lake Victoria generic tourism content
 * Focus on: Ubuntu philosophy, accommodation, wellness, community, creative experiences
 */

// ─── CATEGORY DEFINITIONS ─────────────────────────────────────────────────────────

export const UBUNTU_CATEGORIES = [
  {
    _id: 'cat-community',
    _type: 'journalCategory',
    title: 'Community',
    slug: 'community',
    description: 'Stories of connection, collaboration, and Ubuntu philosophy in action',
    categoryIcon: 'Users',
    categoryColor: 'emerald',
  },
  {
    _id: 'cat-creative-life',
    _type: 'journalCategory',
    title: 'Creative Life',
    slug: 'creative-life',
    description: 'Artist residencies, creative process, and collaborative projects',
    categoryIcon: 'Palette',
    categoryColor: 'amber',
  },
  {
    _id: 'cat-accommodation',
    _type: 'journalCategory',
    title: 'Accommodation',
    slug: 'accommodation',
    description: 'Explore our Pokomo Cottages, Farmhouse, and luxury retreats',
    categoryIcon: 'Home',
    categoryColor: 'blue',
  },
  {
    _id: 'cat-wellness',
    _type: 'journalCategory',
    title: 'Wellness',
    slug: 'wellness',
    description: 'Spa treatments, yoga, meditation, and holistic wellness at Ubuntu',
    categoryIcon: 'Heart',
    categoryColor: 'rose',
  },
  {
    _id: 'cat-events',
    _type: 'journalCategory',
    title: 'Events',
    slug: 'events',
    description: 'Workshops, retreats, creative gatherings, and celebrations',
    categoryIcon: 'Calendar',
    categoryColor: 'violet',
  },
  {
    _id: 'cat-culture',
    _type: 'journalCategory',
    title: 'Culture',
    slug: 'culture',
    description: 'Ubuntu philosophy, African traditions, and cultural heritage',
    categoryIcon: 'BookOpen',
    categoryColor: 'purple',
  },
  {
    _id: 'cat-retreats',
    _type: 'journalCategory',
    title: 'Retreats',
    slug: 'retreats',
    description: 'Immersive retreat experiences and transformational programs',
    categoryIcon: 'Wind',
    categoryColor: 'cyan',
  },
  {
    _id: 'cat-guest-stories',
    _type: 'journalCategory',
    title: 'Guest Stories',
    slug: 'guest-stories',
    description: 'Voices of our guests and their Ubuntu experiences',
    categoryIcon: 'MessageCircle',
    categoryColor: 'orange',
  },
  {
    _id: 'cat-behind-scenes',
    _type: 'journalCategory',
    title: 'Behind the Scenes',
    slug: 'behind-the-scenes',
    description: 'Operations, sustainability, and the heart of Ubuntu',
    categoryIcon: 'Eye',
    categoryColor: 'indigo',
  },
  {
    _id: 'cat-philosophy',
    _type: 'journalCategory',
    title: 'Ubuntu Philosophy',
    slug: 'ubuntu-philosophy',
    description: '"I am because we are" — the foundation of everything we do',
    categoryIcon: 'Lightbulb',
    categoryColor: 'yellow',
  },
]

// ─── TAGS ─────────────────────────────────────────────────────────────────────────────

export const UBUNTU_TAGS = [
  { _id: 'tag-ubuntu', _type: 'journalTag', title: 'Ubuntu Philosophy', slug: 'ubuntu-philosophy' },
  { _id: 'tag-community', _type: 'journalTag', title: 'Community', slug: 'community' },
  { _id: 'tag-wellness', _type: 'journalTag', title: 'Wellness', slug: 'wellness' },
  { _id: 'tag-retreat', _type: 'journalTag', title: 'Retreat', slug: 'retreat' },
  { _id: 'tag-creativity', _type: 'journalTag', title: 'Creativity', slug: 'creativity' },
  { _id: 'tag-sustainability', _type: 'journalTag', title: 'Sustainability', slug: 'sustainability' },
  { _id: 'tag-accommodation', _type: 'journalTag', title: 'Accommodation', slug: 'accommodation' },
  { _id: 'tag-workshop', _type: 'journalTag', title: 'Workshop', slug: 'workshop' },
  { _id: 'tag-culture', _type: 'journalTag', title: 'Culture', slug: 'culture' },
  { _id: 'tag-kenya', _type: 'journalTag', title: 'Kenya', slug: 'kenya' },
  { _id: 'tag-nairobi', _type: 'journalTag', title: 'Nairobi', slug: 'nairobi' },
  { _id: 'tag-eco-lodge', _type: 'journalTag', title: 'Eco-Lodge', slug: 'eco-lodge' },
]

// ─── AUTHORS ──────────────────────────────────────────────────────────────────────────

export const UBUNTU_AUTHORS = [
  {
    _id: 'author-ubuntu',
    _type: 'journalAuthor',
    name: 'Ubuntu Team',
    slug: 'ubuntu-team',
    bio: 'The heart and voice of Ubuntu Kreative Village, sharing stories of community, creativity, and connection.',
    avatar: {
      asset: {
        url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=400&fit=crop',
      },
    },
    socialLinks: [],
  },
  {
    _id: 'author-founder',
    _type: 'journalAuthor',
    name: 'Ubuntu Founders',
    slug: 'ubuntu-founders',
    bio: 'Visionaries behind Ubuntu Kreative Village, dedicated to sustainable, community-driven hospitality.',
    avatar: {
      asset: {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      },
    },
    socialLinks: [],
  },
]

// ─── SAMPLE ARTICLES (15 CORE) ────────────────────────────────────────────────────────

export const UBUNTU_ARTICLES = [
  // 1. WELCOME
  {
    _id: '1',
    _type: 'journalPost',
    title: 'Welcome to Ubuntu Kreative Village',
    slug: 'welcome-to-ubuntu',
    excerpt:
      'Discover what Ubuntu Kreative Village is all about — a sanctuary where art, nature, wellness, and community converge in perfect harmony.',
    category: { _id: 'cat-community', title: 'Community', slug: 'community' },
    tags: [
      { _id: 'tag-ubuntu', title: 'Ubuntu Philosophy', slug: 'ubuntu-philosophy' },
      { _id: 'tag-community', title: 'Community', slug: 'community' },
    ],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-15',
    readingTimeMinutes: 5,
    featured: true,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Garden-Breakfast-Beneath-the-Trees.jpeg' },
      alt: 'Ubuntu Kreative Village aerial view',
    },
    seoTitle: 'Welcome to Ubuntu Kreative Village | Eco-Luxury Retreat',
    seoDescription: 'Discover Ubuntu Kreative Village, a premier destination for wellness, creativity, and authentic African hospitality.',
    keywords: 'eco-lodge, Kenya, wellness retreat, creative retreat, luxury accommodation',
    ogImage: { asset: { url: '/images/Garden-Breakfast-Beneath-the-Trees.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/welcome-to-ubuntu',
    ctaHeadline: 'Ready to experience Ubuntu?',
    ctaText: 'Plan Your Visit',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [
      {
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: 'Welcome to Ubuntu Kreative Village' }],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Ubuntu Kreative Village is not just a destination — it\'s a philosophy brought to life. Nestled in the highlands of Kenya, our community embodies the African principle of Ubuntu: "I am because we are."',
          },
        ],
      },
      {
        _type: 'block',
        style: 'h2',
        children: [{ _type: 'span', text: 'A Space for Connection' }],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'We\'re more than luxury accommodation. We\'re a gathering place for artists, creatives, wellness seekers, and community members who believe in the power of intentional spaces. Here, every interaction, every meal, every sunrise is designed to deepen connection — with yourself, with others, and with the land.',
          },
        ],
      },
    ],
  },

  // 2. THE STORY BEHIND UBUNTU
  {
    _id: '2',
    _type: 'journalPost',
    title: 'The Story Behind Ubuntu Kreative Village',
    slug: 'story-behind-ubuntu',
    excerpt:
      'Learn the vision, mission, and founding story of Ubuntu Kreative Village — a bold experiment in community-driven hospitality.',
    category: { _id: 'cat-philosophy', title: 'Ubuntu Philosophy', slug: 'ubuntu-philosophy' },
    tags: [
      { _id: 'tag-ubuntu', title: 'Ubuntu Philosophy', slug: 'ubuntu-philosophy' },
      { _id: 'tag-sustainability', title: 'Sustainability', slug: 'sustainability' },
    ],
    author: { _id: 'author-founder', name: 'Ubuntu Founders', slug: 'ubuntu-founders' },
    publishedAt: '2026-01-14',
    readingTimeMinutes: 8,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Story-Circle.jpeg' },
      alt: 'Ubuntu community gathering',
    },
    seoTitle: 'The Story Behind Ubuntu Kreative Village',
    seoDescription: 'Discover the founding vision, philosophy, and journey of Ubuntu Kreative Village.',
    keywords: 'Ubuntu philosophy, community hospitality, eco-lodge Kenya',
    ogImage: { asset: { url: '/images/Story-Circle.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/story-behind-ubuntu',
    ctaHeadline: 'Join our community',
    ctaText: 'Get Involved',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [
      {
        _type: 'block',
        style: 'h1',
        children: [{ _type: 'span', text: 'The Story Behind Ubuntu Kreative Village' }],
      },
      {
        _type: 'block',
        children: [
          {
            _type: 'span',
            text: 'Founded on the belief that community is the foundation of transformative experiences, Ubuntu Kreative Village was created as a sanctuary where creativity, wellness, and human connection thrive together.',
          },
        ],
      },
    ],
  },

  // 3. THE MEANING OF UBUNTU
  {
    _id: '3',
    _type: 'journalPost',
    title: 'The Meaning of Ubuntu: "I am because we are"',
    slug: 'meaning-of-ubuntu',
    excerpt:
      'Explore the profound African philosophy that guides everything we do at Ubuntu Kreative Village.',
    category: { _id: 'cat-philosophy', title: 'Ubuntu Philosophy', slug: 'ubuntu-philosophy' },
    tags: [{ _id: 'tag-ubuntu', title: 'Ubuntu Philosophy', slug: 'ubuntu-philosophy' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-13',
    readingTimeMinutes: 6,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/The-People-Who-Make-It-Possible.jpeg' },
      alt: 'Community circle at Ubuntu',
    },
    seoTitle: 'Ubuntu Philosophy: "I am because we are"',
    seoDescription: 'Understanding the African principle of Ubuntu and how it shapes community at Ubuntu Kreative Village.',
    keywords: 'Ubuntu philosophy, African culture, community',
    ogImage: { asset: { url: '/images/The-People-Who-Make-It-Possible.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/meaning-of-ubuntu',
    ctaHeadline: 'Experience Ubuntu philosophy firsthand',
    ctaText: 'Book a Retreat',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 4. MEET THE COMMUNITY
  {
    _id: '4',
    _type: 'journalPost',
    title: 'Meet the Community Behind Ubuntu',
    slug: 'meet-the-community',
    excerpt:
      'The people who make Ubuntu special — creatives, wellness experts, community builders, and visionaries.',
    category: { _id: 'cat-community', title: 'Community', slug: 'community' },
    tags: [{ _id: 'tag-community', title: 'Community', slug: 'community' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-12',
    readingTimeMinutes: 7,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Campfire-Under-the-Stars.jpeg' },
      alt: 'Ubuntu community team',
    },
    seoTitle: 'Meet the Ubuntu Community Team',
    seoDescription: 'Discover the creative minds and community builders who make Ubuntu Kreative Village thrive.',
    keywords: 'team, community, Ubuntu team',
    ogImage: { asset: { url: '/images/Campfire-Under-the-Stars.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/meet-the-community',
    ctaHeadline: 'Join our team or visit us',
    ctaText: 'Get in Touch',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 5. A DAY AT UBUNTU
  {
    _id: '5',
    _type: 'journalPost',
    title: 'A Day at Ubuntu: From Sunrise to Starlight',
    slug: 'a-day-at-ubuntu',
    excerpt:
      'Experience the rhythm and rituals that define life at Ubuntu Kreative Village.',
    category: { _id: 'cat-retreat', title: 'Retreats', slug: 'retreat' },
    tags: [{ _id: 'tag-retreat', title: 'Retreat', slug: 'retreat' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-11',
    readingTimeMinutes: 5,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/First-Light-Walk.jpeg' },
      alt: 'Sunset at Ubuntu',
    },
    seoTitle: 'A Day at Ubuntu Kreative Village',
    seoDescription: 'Experience the daily rhythm of Ubuntu, from morning wellness to evening community gatherings.',
    keywords: 'daily routine, wellness, community, retreat',
    ogImage: { asset: { url: '/images/First-Light-Walk.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/a-day-at-ubuntu',
    ctaHeadline: 'Experience a day at Ubuntu',
    ctaText: 'Book Your Stay',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 6. ACCOMMODATION SPACES
  {
    _id: '6',
    _type: 'journalPost',
    title: 'Discover Our Accommodation Spaces',
    slug: 'accommodation-spaces',
    excerpt:
      'Explore our carefully designed Pokomo Cottages, Farmhouse Suite, and luxury Penthouse — each with its own story.',
    category: { _id: 'cat-accommodation', title: 'Accommodation', slug: 'accommodation' },
    tags: [{ _id: 'tag-accommodation', title: 'Accommodation', slug: 'accommodation' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-10',
    readingTimeMinutes: 6,
    featured: true,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Tamarind-farmhouse01.jpeg' },
      alt: 'Ubuntu cottage interior',
    },
    seoTitle: 'Luxury Accommodation at Ubuntu Kreative Village',
    seoDescription: 'Discover our Pokomo Cottages, Farmhouse Suite, and Penthouse — unique spaces designed for connection and creativity.',
    keywords: 'accommodation, cottages, luxury, Kenya',
    ogImage: { asset: { url: '/images/Tamarind-farmhouse01.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/accommodation-spaces',
    ctaHeadline: 'Book your perfect space',
    ctaText: 'Reserve Now',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 7. WELLNESS AT UBUNTU
  {
    _id: '7',
    _type: 'journalPost',
    title: 'Wellness at Ubuntu: Holistic Healing',
    slug: 'wellness-at-ubuntu',
    excerpt:
      'Our Arohamai Spa and wellness offerings designed to restore, rejuvenate, and reconnect.',
    category: { _id: 'cat-wellness', title: 'Wellness', slug: 'wellness' },
    tags: [{ _id: 'tag-wellness', title: 'Wellness', slug: 'wellness' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-09',
    readingTimeMinutes: 7,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Sunrise Meditation.jpeg' },
      alt: 'Spa and wellness at Ubuntu',
    },
    seoTitle: 'Wellness & Spa at Ubuntu Kreative Village',
    seoDescription: 'Discover our Arohamai Spa and holistic wellness offerings designed for deep restoration and healing.',
    keywords: 'spa, wellness, yoga, meditation, retreat',
    ogImage: { asset: { url: '/images/Sunrise Meditation.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/wellness-at-ubuntu',
    ctaHeadline: 'Book a wellness treatment',
    ctaText: 'Reserve Your Session',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 8. HOSTING RETREATS
  {
    _id: '8',
    _type: 'journalPost',
    title: 'Hosting Retreats at Ubuntu',
    slug: 'hosting-retreats-ubuntu',
    excerpt:
      'From yoga retreats to creative workshops to transformational programs — Ubuntu is your perfect retreat destination.',
    category: { _id: 'cat-events', title: 'Events', slug: 'events' },
    tags: [{ _id: 'tag-retreat', title: 'Retreat', slug: 'retreat' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-08',
    readingTimeMinutes: 8,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Stronger-Together.jpeg' },
      alt: 'Retreat group at Ubuntu',
    },
    seoTitle: 'Host Your Retreat at Ubuntu Kreative Village',
    seoDescription: 'Plan your yoga retreat, workshop, or transformational program at Ubuntu Kreative Village.',
    keywords: 'retreat, workshop, yoga, events, group',
    ogImage: { asset: { url: '/images/Stronger-Together.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/hosting-retreats-ubuntu',
    ctaHeadline: 'Plan your retreat',
    ctaText: 'Inquire Now',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 9. CREATIVE LIVING
  {
    _id: '9',
    _type: 'journalPost',
    title: 'Creative Living and Collaboration',
    slug: 'creative-living-collaboration',
    excerpt:
      'How artists, makers, and creatives thrive in our community through residencies, workshops, and collaborative projects.',
    category: { _id: 'cat-creative-life', title: 'Creative Life', slug: 'creative-life' },
    tags: [{ _id: 'tag-creativity', title: 'Creativity', slug: 'creativity' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-07',
    readingTimeMinutes: 6,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Wheel-Pottery-&-Wood-Firing.jpeg' },
      alt: 'Creative work at Ubuntu',
    },
    seoTitle: 'Creative Residencies & Collaborations at Ubuntu',
    seoDescription: 'Join our artist residencies, creative workshops, and collaborative projects.',
    keywords: 'artist, creative, residency, workshop, collaboration',
    ogImage: { asset: { url: '/images/Wheel-Pottery-&-Wood-Firing.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/creative-living-collaboration',
    ctaHeadline: 'Apply for a creative residency',
    ctaText: 'Learn More',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 10. VOICES OF UBUNTU
  {
    _id: '10',
    _type: 'journalPost',
    title: 'Voices of Ubuntu: Guest Stories',
    slug: 'voices-of-ubuntu',
    excerpt:
      'Authentic reflections and transformative stories from guests who have visited Ubuntu Kreative Village.',
    category: { _id: 'cat-guest-stories', title: 'Guest Stories', slug: 'guest-stories' },
    tags: [{ _id: 'tag-community', title: 'Community', slug: 'community' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-06',
    readingTimeMinutes: 5,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/First-Light-Walk.jpeg' },
      alt: 'Guests at Ubuntu',
    },
    seoTitle: 'Guest Stories & Testimonials from Ubuntu Kreative Village',
    seoDescription: 'Read authentic stories from our guests about their transformative experiences at Ubuntu.',
    keywords: 'testimonials, reviews, guest stories, community',
    ogImage: { asset: { url: '/images/First-Light-Walk.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/voices-of-ubuntu',
    ctaHeadline: 'Share your Ubuntu story',
    ctaText: 'Send Us Your Story',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 11. BEHIND THE SCENES
  {
    _id: '11',
    _type: 'journalPost',
    title: 'Behind the Scenes: The Heart of Ubuntu',
    slug: 'behind-the-scenes-ubuntu',
    excerpt:
      'Discover what it takes to run Ubuntu Kreative Village — operations, sustainability, and the people who keep it thriving.',
    category: { _id: 'cat-behind-scenes', title: 'Behind the Scenes', slug: 'behind-the-scenes' },
    tags: [
      { _id: 'tag-sustainability', title: 'Sustainability', slug: 'sustainability' },
      { _id: 'tag-community', title: 'Community', slug: 'community' },
    ],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-05',
    readingTimeMinutes: 7,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Harvest-of-Green-Abundance.jpeg' },
      alt: 'Ubuntu operations and team',
    },
    seoTitle: 'Behind the Scenes at Ubuntu Kreative Village',
    seoDescription: 'Learn about the operations, sustainability practices, and team that make Ubuntu possible.',
    keywords: 'operations, sustainability, team, behind the scenes',
    ogImage: { asset: { url: '/images/Harvest-of-Green-Abundance.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/behind-the-scenes-ubuntu',
    ctaHeadline: 'Join our team',
    ctaText: 'Career Opportunities',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 12. WHY COMMUNITY MATTERS
  {
    _id: '12',
    _type: 'journalPost',
    title: 'Why Community Matters',
    slug: 'why-community-matters',
    excerpt:
      'In an increasingly disconnected world, Ubuntu reminds us of the power of genuine human connection.',
    category: { _id: 'cat-philosophy', title: 'Ubuntu Philosophy', slug: 'ubuntu-philosophy' },
    tags: [{ _id: 'tag-ubuntu', title: 'Ubuntu Philosophy', slug: 'ubuntu-philosophy' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-04',
    readingTimeMinutes: 6,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Garden-Gathering-Oasis.jpeg' },
      alt: 'Community gathering',
    },
    seoTitle: 'Why Community Matters at Ubuntu Kreative Village',
    seoDescription: 'Explore the profound impact of community and human connection in our world today.',
    keywords: 'community, connection, ubuntu, philosophy',
    ogImage: { asset: { url: '/images/Garden-Gathering-Oasis.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/why-community-matters',
    ctaHeadline: 'Become part of our community',
    ctaText: 'Join Us',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 13. EVENT SPACES
  {
    _id: '13',
    _type: 'journalPost',
    title: 'Event Spaces at Ubuntu',
    slug: 'event-spaces-ubuntu',
    excerpt:
      'From intimate gatherings to large celebrations — Ubuntu offers versatile spaces for weddings, conferences, and special events.',
    category: { _id: 'cat-events', title: 'Events', slug: 'events' },
    tags: [{ _id: 'tag-retreat', title: 'Retreat', slug: 'retreat' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-03',
    readingTimeMinutes: 5,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Your-Dream-Garden-Wedding.jpeg' },
      alt: 'Event space at Ubuntu',
    },
    seoTitle: 'Host Your Event at Ubuntu Kreative Village',
    seoDescription: 'Discover our event spaces perfect for weddings, conferences, retreats, and special celebrations.',
    keywords: 'event, wedding, conference, venue, celebration',
    ogImage: { asset: { url: '/images/Your-Dream-Garden-Wedding.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/event-spaces-ubuntu',
    ctaHeadline: 'Plan your event',
    ctaText: 'Inquire About Events',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 14. ARTIST STORIES
  {
    _id: '14',
    _type: 'journalPost',
    title: 'Artist and Creative Stories',
    slug: 'artist-creative-stories',
    excerpt:
      'Meet the artists and creatives who have found inspiration, community, and collaboration at Ubuntu.',
    category: { _id: 'cat-creative-life', title: 'Creative Life', slug: 'creative-life' },
    tags: [{ _id: 'tag-creativity', title: 'Creativity', slug: 'creativity' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-02',
    readingTimeMinutes: 8,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Tropical-Art-Gallery.jpeg' },
      alt: 'Artist at work',
    },
    seoTitle: 'Artist Stories from Ubuntu Kreative Village',
    seoDescription: 'Discover the creative journeys of artists and makers who have visited Ubuntu.',
    keywords: 'artist, creative, interview, inspiration, studio',
    ogImage: { asset: { url: '/images/Tropical-Art-Gallery.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/artist-creative-stories',
    ctaHeadline: 'Share your creative journey',
    ctaText: 'Get in Touch',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },

  // 15. SUSTAINABLE LIVING
  {
    _id: '15',
    _type: 'journalPost',
    title: 'Sustainable Living at Ubuntu',
    slug: 'sustainable-living-ubuntu',
    excerpt:
      'How Ubuntu operates as an eco-conscious community with renewable energy, organic farming, and ethical practices.',
    category: { _id: 'cat-behind-scenes', title: 'Behind the Scenes', slug: 'behind-the-scenes' },
    tags: [{ _id: 'tag-sustainability', title: 'Sustainability', slug: 'sustainability' }],
    author: { _id: 'author-ubuntu', name: 'Ubuntu Team', slug: 'ubuntu-team' },
    publishedAt: '2026-01-01',
    readingTimeMinutes: 7,
    featured: false,
    status: 'published',
    heroImage: {
      asset: { url: '/images/Harvest-of-Green-Abundance.jpeg' },
      alt: 'Sustainable farming at Ubuntu',
    },
    seoTitle: 'Sustainable Living at Ubuntu Kreative Village',
    seoDescription: 'Learn about our renewable energy, organic farming, and sustainable practices.',
    keywords: 'sustainability, eco-friendly, renewable energy, organic',
    ogImage: { asset: { url: '/images/Harvest-of-Green-Abundance.jpeg' } },
    canonicalUrl: 'https://ubuntukreativevillage.com/journal/sustainable-living-ubuntu',
    ctaHeadline: 'Support sustainable hospitality',
    ctaText: 'Book Your Stay',
    ctaLink: '/contact',
    relatedExperiences: [],
    content: [],
  },
]

// ─── FEATURED COLLECTIONS ─────────────────────────────────────────────────────────

export const UBUNTU_COLLECTIONS = [
  {
    _id: 'collection-welcome',
    _type: 'journalCollection',
    title: 'New to Ubuntu?',
    slug: 'new-to-ubuntu',
    description: 'Essential reads to understand what Ubuntu Kreative Village is all about',
    collectionImage: {
      asset: { url: '/images/Garden-Feast.jpeg' },
    },
    articles: [
      { _id: '1', title: 'Welcome to Ubuntu Kreative Village', slug: 'welcome-to-ubuntu' },
      { _id: '3', title: 'The Meaning of Ubuntu', slug: 'meaning-of-ubuntu' },
      { _id: '5', title: 'A Day at Ubuntu', slug: 'a-day-at-ubuntu' },
    ],
  },
  {
    _id: 'collection-wellness',
    _type: 'journalCollection',
    title: 'Wellness & Retreats',
    slug: 'wellness-retreats',
    description: 'Discover holistic wellness, spa treatments, and transformational retreat programs',
    collectionImage: {
      asset: { url: '/images/Under-the-Stars.jpeg' },
    },
    articles: [
      { _id: '7', title: 'Wellness at Ubuntu', slug: 'wellness-at-ubuntu' },
      { _id: '8', title: 'Hosting Retreats at Ubuntu', slug: 'hosting-retreats-ubuntu' },
      { _id: '5', title: 'A Day at Ubuntu', slug: 'a-day-at-ubuntu' },
    ],
  },
  {
    _id: 'collection-creativity',
    _type: 'journalCollection',
    title: 'Creative Living',
    slug: 'creative-living',
    description: 'Artist residencies, creative collaborations, and inspiration for makers',
    collectionImage: {
      asset: { url: '/images/Golden-Nights.jpeg' },
    },
    articles: [
      { _id: '9', title: 'Creative Living and Collaboration', slug: 'creative-living-collaboration' },
      { _id: '14', title: 'Artist and Creative Stories', slug: 'artist-creative-stories' },
      { _id: '4', title: 'Meet the Community', slug: 'meet-the-community' },
    ],
  },
]

export default {
  UBUNTU_CATEGORIES,
  UBUNTU_TAGS,
  UBUNTU_AUTHORS,
  UBUNTU_ARTICLES,
  UBUNTU_COLLECTIONS,
}
