// ─────────────────────────────────────────────────────────────────────────────
// Ubuntu Kreative Village — Gallery Data  (v2 — unified)
// Pure data module. No React, no hooks — safe to import from Server or Client.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Category types (used by GalleryClient v1 / masonry) ─────────────────────

export type GalleryCategory =
  | 'All'
  | 'Events'
  | 'Workshops'
  | 'Community'
  | 'Nature'
  | 'Accommodation'
  | 'Food'
  | 'Culture'
  | 'Guests'

export const CATEGORIES: GalleryCategory[] = [
  'All',
  'Events',
  'Workshops',
  'Community',
  'Nature',
  'Accommodation',
  'Food',
  'Culture',
  'Guests',
]

// ─── Photo / memory (masonry gallery) ─────────────────────────────────────────

export interface GalleryPhoto {
  id: string
  image: string
  title: string
  description: string
  category: Exclude<GalleryCategory, 'All'>
  location: string
  date: string
  year: number
  featured: boolean
  aspect?: 'portrait' | 'landscape' | 'square'
}

// ─── ExhibitSlide (hero slideshow — v1 Galleryclient.tsx) ─────────────────────

export interface ExhibitSlide {
  id: string
  image: string
  title: string
  description: string
  cta: {
    label: string
    href: string
  }
}

// ─── Exhibit (immersive card / modal — v2 GalleryClient.tsx) ─────────────────
//  This is the type imported by GalleryClient.tsx v2 and ImmersiveExhibit.tsx.

export interface VideoSource {
  directUrl?: string
  youtubeId?: string
  poster?: string
  label?: string
}

export interface Exhibit {
  id: string
  title: string
  artist: string
  heroImage: string
  /** Background / atmosphere image (used as a secondary layer in the modal) */
  atmosphereImage?: string
  description: string
  dates: string
  medium: string
  pieces: number
  tags: string[]
  status: 'Current' | 'Upcoming' | 'Past'
  /** CSS colour value or CSS variable like var(--gold) */
  accent: string
  video?: VideoSource
  galleryImages?: string[]
  /** Atmosphere config for ImmersiveExhibit background */
  atmosphere?: {
    bg?: string
    overlay?: string
  }
}

// ─── Workshop ─────────────────────────────────────────────────────────────────

export interface Workshop {
  id: string
  title: string
  description: string
  image: string
  schedule: string
  facilitator: string
  date?: string
  duration?: string
  spots?: number
  spotsLeft?: number
  accent?: string
  price?: number
}

// ─── CraftMarketItem ──────────────────────────────────────────────────────────

export interface CraftMarketItem {
  id: string
  name: string
  artisan: string
  image: string
  price: string
  category?: string
  description?: string
  accent?: string
  icon?: string
  vendors?: number
  days?: string
}

// ─── Stats ────────────────────────────────────────────────────────────────────

export interface GalleryStats {
  artistsFeatured: number
  exhibitionsHosted: number
  workshopsRun: number
  yearsRunning: number
}

/** Flat stat shape expected by GalleryClient v2 */
export type Stat = { value: string; label: string }

export function statsToArray(s: GalleryStats): Stat[] {
  return [
    { value: String(s.artistsFeatured), label: 'Artists Featured' },
    { value: String(s.exhibitionsHosted), label: 'Exhibitions Hosted' },
    { value: String(s.workshopsRun), label: 'Workshops Run' },
    { value: `${s.yearsRunning}+`, label: 'Years Running' },
  ]
}

// ─── Timeline ─────────────────────────────────────────────────────────────────

export interface TimelineMilestone {
  title: string
  description: string
}

export interface TimelineYear {
  year: number
  milestones: TimelineMilestone[]
}

// ─────────────────────────────────────────────────────────────────────────────
// HERO VIDEO — set directUrl/youtubeId to enable video hero.
// Leave both undefined to fall back to the poster image.
// ─────────────────────────────────────────────────────────────────────────────

export const HERO_VIDEO: VideoSource = {
  directUrl:  undefined,
  youtubeId:  undefined,
  poster:
    '/images/Garden-Breakfast-Beneath-the-Trees.jpeg',
}

// ───────────────────────────────────────────────────
// HERO SLIDES — 7-image rotating background for ArrivalHero.
// First slide is the priority/LCP image; the rest lazy-load in the carousel.
// ─────────────────────────────────────────────

export interface HeroSlideImage {
  id: string
  image: string
  alt: string
}

export const HERO_SLIDES: HeroSlideImage[] = [
  {
    id: 'hero-01',
    image: '/images/Garden-Breakfast-Beneath-the-Trees.jpeg',
    alt: 'Village under the acacias at golden hour',
  },
  {
    id: 'hero-02',
    image: '/images/hero1.jpeg',
    alt: 'Contemporary African art exhibition opening',
  },
  {
    id: 'hero-03',
    image: '/images/hero2.jpeg',
    alt: 'Artisan shaping clay on the pottery wheel',
  },
  {
    id: 'hero-04',
    image: '/images/hero3.jpeg',
    alt: 'Traditional Maasai beadwork in progress',
  },
  {
    id: 'hero-05',
    image: '/images/hero4.jpeg',
    alt: 'Village gathering beneath the evening sky',
  },
  {
    id: 'hero-06',
    image: '/images/hero5.jpeg',
    alt: 'Freshly dyed batik panels drying in the sun',
  },
  {
    id: 'hero-07',
    image: '/images/hero6.jpeg',
    alt: 'Savannah plains at dusk from the lodge terrace',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// EXHIBITS — immersive cards (v2 GalleryClient)
// ─────────────────────────────────────────────────────────────────────────────

export const EXHIBITS: Exhibit[] = [
  {
    id: 'exhibit-01',
    title: 'Contemporary African Visions',
    artist: 'Collective — East Africa',
    heroImage:
      '/images/he-Visionary-of-a-New-Dawn.jpeg',
    atmosphereImage:
      '/images/he-Visionary-of-a-New-Dawn.jpeg',
    description:
      'A rotating exhibition of painting, sculpture, and mixed media from emerging East African artists — celebrating the intersection of tradition and modernity., and great african leaders',
    dates: 'May – August 2026',
    medium: 'Mixed media · Painting · Sculpture',
    pieces: 24,
    tags: ['Contemporary', 'East Africa', 'Mixed Media', 'Painting'],
    status: 'Current',
    accent: '#A8D8F0',
    galleryImages: [
      '/images/he-Visionary-of-a-New-Dawn.jpeg',
      '/images/Sunrise Meditation.jpeg',
      '/images/Garden-Breakfast-Beneath-the-Trees.jpeg',
    ],
    atmosphere: {
      bg: 'radial-gradient(ellipse at 30% 20%, rgba(168,216,240,0.08) 0%, transparent 65%)',
    },
  },
  {
    id: 'exhibit-02',
    title: 'Hands, Clay & Heritage',
    artist: 'Ubuntu Kreative Earth Guild',
    heroImage:
      '/images/Hands-Clay-&-Heritage.jpeg',
    atmosphereImage:
      '/images/Hands-Clay-&-Heritage.jpeg',
    description:
      'Live pottery and beadwork demonstrations from artisans preserving century-old craft traditions. Watch, touch, and create alongside makers who learned at their grandmother\'s knee.',
    dates: 'Year-round · Tue & Thu',
    medium: 'Ceramics · Stoneware · Earthenware',
    pieces: 36,
    tags: ['Ceramics', 'Craft', 'Heritage', 'Live Demo'],
    status: 'Current',
    accent: '#D4A853',
    galleryImages: [
      '/images/Hands-Clay-&-Heritage1.jpeg',
      '/images/Hands-Clay-&-Heritage2.jpeg',
      '/images/Hands-Clay-&-Heritage3.jpeg',
    ],
    atmosphere: {
      bg: 'radial-gradient(ellipse at 70% 30%, rgba(212,168,83,0.08) 0%, transparent 60%)',
    },
  },
  {
    id: 'exhibit-03',
    title: 'Pattern & Memory — Maasai Beadwork',
    artist: 'Ubuntu Kreative Team',   
     heroImage:
      '/images/Maasai-Beadwork-Intensive.jpeg',
    atmosphereImage:
      '/images/Maasai-Beadwork-Intensive.jpeg',
    description:
      'Traditional Maasai beadwork. Each colour carries meaning across generations, season, and ceremony. Naserian\'s work bridges ancestral code and contemporary wearable art.',
    dates: 'April – September 2026',
    medium: 'Beadwork · Textile · Wearable Art',
    pieces: 18,
    tags: ['Maasai', 'Beadwork', 'Textile', 'Wearable'],
    status: 'Upcoming',
    accent: '#B8A9F0',
    galleryImages: [
      '/images/Maasai-Beadwork-Intensive1.jpeg',
      '/images/Maasai-Beadwork-Intensive2.jpeg',
      '/images/Maasai-Beadwork-Intensive3.jpeg',
    ],
    atmosphere: {
      bg: 'radial-gradient(ellipse at 50% 10%, rgba(184,169,240,0.08) 0%, transparent 65%)',
    },
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// WORKSHOPS
// ─────────────────────────────────────────────────────────────────────────────

export const WORKSHOPS: Workshop[] = [
  {
    id: 'workshop-01',
    title: 'Maasai Beadwork Intensive',
    description: 'Two skilled artisans handcraft vibrant Maasai beadwork, preserving generations of cultural heritage through intricate patterns, symbolism, and craftsmanship.',
    image:
      '/images/Maasai-Beadwork-Intensive.jpeg',
    schedule: 'Every Saturday, 10:00–13:00',
    facilitator: 'Ubuntu Kreative Team',
    date: 'Every Saturday',
    duration: '3 hours',
    spots: 12,
    spotsLeft: 3,
    accent: '#B8A9F0',
    price: 3500,
  },
  {
    id: 'workshop-02',
    title: 'Wheel Pottery & Wood Firing',
    description: 'Experience the timeless art of pottery, where skilled hands, natural clay, and wood-fired kilns transform creativity into lasting masterpieces.',
    image:
      '/images/Wheel-Pottery-&-Wood-Firing.jpeg',
    schedule: 'Tue & Thu, 14:00–17:00',
    facilitator: 'Ubuntu Kreative Team',
    date: 'Tue & Thu',
    duration: '3 hours',
    spots: 8,
    spotsLeft: 2,
    accent: '#D4A853',
    price: 4200,
  },
  {
    id: 'workshop-03',
    title: 'Batik & Natural Dye',
    description: 'Artisans create beautiful batik textiles using traditional wax-resist techniques and natural pigments sourced from local plants, celebrating craftsmanship, culture, and sustainable artistry.',
    image:
      '/images/Batik-&-Natural-Dye.jpeg',
    schedule: 'Sundays, 09:00–12:00',
    facilitator: 'Ubuntu Kreative Team',
    date: 'Every Sunday',
    duration: '3 hours',
    spots: 10,
    spotsLeft: 6,
    accent: '#E8956D',
    price: 3200,
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// CRAFT MARKET
// ─────────────────────────────────────────────────────────────────────────────

export const CRAFT_MARKET: CraftMarketItem[] = [
  {
    id: 'craft-01',
    name: 'Hand-thrown Stoneware Vase',
    artisan: 'Joseph Mwangi',
    image:
      '/images/Wheel-Pottery-&-Wood-Firing.jpeg',
    price: 'KSh 4,500',
    category: 'Ceramics',
    description: 'Artisan-fired stoneware pieces',
    accent: '#D4A853',
    icon: '🫖',
    vendors: 3,
    days: 'Sat–Sun',
  },
  {
    id: 'craft-02',
    name: 'Beaded Maasai Collar',
    artisan: 'Naserian Kantai',
    image:
      '/images/Maasai-Beadwork-Intensive.jpeg',
    price: 'KSh 6,200',
    category: 'Beadwork',
    description: 'Traditional Maasai craftsmanship',
    accent: '#B8A9F0',
    icon: '💎',
    vendors: 2,
    days: 'Daily',
  },
  {
    id: 'craft-03',
    name: 'Batik Wall Hanging',
    artisan: 'Amara Wekesa',
    image:
      '/images/Batik-&-Natural-Dye.jpeg',
    price: 'KSh 3,800',
    category: 'Textiles',
    description: 'Natural dye batik techniques',
    accent: '#E8956D',
    icon: '🎨',
    vendors: 2,
    days: 'Tue–Sun',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// STATS
// ─────────────────────────────────────────────────────────────────────────────

export const GALLERY_STATS: GalleryStats = {
  artistsFeatured: 42,
  exhibitionsHosted: 18,
  workshopsRun: 96,
  yearsRunning: 3,
}

// ─────────────────────────────────────────────────────────────────────────────
// TIMELINE
// ─────────────────────────────────────────────────────────────────────────────

export const TIMELINE: TimelineYear[] = [
  {
    year: 2026,
    milestones: [
      { title: 'Community Art Festival', description: 'Three-day open festival drawing artists from across the region.' },
      { title: 'Creative Workshops', description: 'Expanded weekly workshop schedule across pottery, beadwork, and dye.' },
      { title: 'New Cultural Events', description: 'Monthly storytelling and music nights launched in the village square.' },
    ],
  },
  {
    year: 2025,
    milestones: [
      { title: 'Guest Experiences', description: 'Immersive guided art tours introduced for lodge guests.' },
      { title: 'Village Growth', description: 'Artisan studio spaces doubled to accommodate resident makers.' },
    ],
  },
  {
    year: 2024,
    milestones: [
      { title: 'Construction Journey', description: 'Ground broken on the gallery pavilion and open-air craft market.' },
      { title: 'First Community Events', description: 'Inaugural exhibition welcomed local artists and neighboring villages.' },
    ],
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// PHOTOS
// ─────────────────────────────────────────────────────────────────────────────

export const PHOTOS: GalleryPhoto[] = [
  {
    id: 'photo-001',
    image: '/images/Garden-Breakfast-Beneath-the-Trees.jpeg',
    title: 'Garden Breakfast Beneath the Trees',
    description: 'Gather beneath the trees and enjoy a nourishing breakfast crafted from fresh local ingredients.',
    category: 'Events',
    location: 'Main Pavilion',
    date: '2026-05-18',
    year: 2026,
    featured: true,
    aspect: 'landscape',
  },
  {
    id: 'photo-002',
    image: '/images/Your-Dream-Garden-Wedding.jpeg',
    title: 'Your Dream Garden Wedding',
    description: 'Celebrate your special day in a breathtaking garden setting where lush greenery, elegant décor, and natural beauty create the perfect backdrop for unforgettable moments.',
    category: 'Workshops',
    location: 'Craft Studio',
    date: '2026-05-10',
    year: 2026,
    featured: true,
    aspect: 'portrait',
  },
  {
    id: 'photo-003',
    image: '/images/The-People-Who-Make-It-Possible.jpeg',
    title: 'The People Who Make It Possible',
    description: 'Neighbors and artisans share an evening meal beneath the acacias.',
    category: 'Community',
    location: 'Village Square',
    date: '2026-04-22',
    year: 2026,
    featured: true,
    aspect: 'landscape',
  },
  {
    id: 'photo-004',
    image: '/images/Story-Circle.jpeg',
    title: 'Acacia Light',
    description: 'Early morning light breaking through the acacia canopy.',
    category: 'Nature',
    location: 'Lodge Grounds',
    date: '2026-04-15',
    year: 2026,
    featured: false,
    aspect: 'portrait',
  },
  {
    id: 'photo-005',
    image: '/images/Tamarind-farmhouse01.jpeg',
    title: 'Rustic Comfort, Crafted with Culture',
    description: 'Experience a stay where comfort meets creativity. This handcrafted wooden bed, dressed in vibrant African-inspired textiles, reflects the warmth, artistry, and authentic character of Ubuntu Kreative Village—offering a peaceful retreat surrounded by culture, craftsmanship, and natural beauty.',
    category: 'Accommodation',
    location: 'Garden Wing',
    date: '2026-03-30',
    year: 2026,
    featured: true,
    aspect: 'landscape',
  },
  {
    id: 'photo-006',
    image: '/images/Garden-Feast.jpeg',
    title: 'Garden Feast',
    description: 'An unforgettable outdoor dining experience where fresh flavors, nature, and warm hospitality come together.',
    category: 'Food',
    location: 'Open Kitchen',
    date: '2026-03-12',
    year: 2026,
    featured: false,
    aspect: 'square',
  },
  {
    id: 'photo-007',
    image: '/images/Rustic-Feast-in-Bloom.jpeg',
    title: 'Rustic Feast in Bloom',
    description: 'A vibrant outdoor spread of golden traditional snacks, fresh banana leaves, and colorful tropical flowers, capturing the warmth, beauty, and richness of a rustic countryside dining experience.',
    category: 'Culture',
    location: 'Craft Market',
    date: '2026-02-26',
    year: 2026,
    featured: false,
    aspect: 'portrait',
  },
  {
    id: 'photo-008',
    image: '/images/First-Light-Walk.jpeg',
    title: 'First Light Walk',
    description: 'Follow a peaceful garden pathway beneath a canopy of lush tropical greenery, where every step invites quiet reflection, fresh air, and a deeper connection with nature.',
    category: 'Guests',
    location: 'Forest Trail',
    date: '2026-02-09',
    year: 2026,
    featured: true,
    aspect: 'landscape',
  },
  {
    id: 'photo-009',
    image: '/images/Tropical-Art-Gallery.jpeg',
    title: 'Tropical Art Gallery',
    description: 'A charming wooden art gallery surrounded by lush tropical greenery, offering a peaceful blend of nature, creativity, and rustic beauty.',
    category: 'Workshops',
    location: 'Craft Studio',
    date: '2026-01-28',
    year: 2026,
    featured: false,
    aspect: 'portrait',
  },
  {
    id: 'photo-010',
    image: '/images/Campfire-Under-the-Stars.jpeg',
    title: 'Campfire Under the Stars',
    description: 'A glowing campfire brings friends together in a lush tropical setting, creating a warm and peaceful atmosphere filled with light, laughter, and evening relaxation.',
    category: 'Culture',
    location: 'Dye Yard',
    date: '2025-12-19',
    year: 2025,
    featured: false,
    aspect: 'square',
  },
  {
    id: 'photo-011',
    image: '/images/A-Feast-Beneath-the-Forest-Canopy.jpeg',
    title: 'A Feast Beneath the Forest Canopy',
    description: 'A beautifully arranged outdoor dining experience set among towering trees, where handcrafted décor, fresh local cuisine, and nature\'s tranquility come together to create a warm and unforgettable gathering. 🌿✨',
    category: 'Events',
    location: 'Village Square',
    date: '2025-11-30',
    year: 2025,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-012',
    image: '/images/hero6.jpeg',
    title: 'Plains at Dusk',
    description: 'The view from the lodge terrace as the sun sets over the savannah.',
    category: 'Nature',
    location: 'Lodge Terrace',
    date: '2025-11-14',
    year: 2025,
    featured: false,
    aspect: 'landscape',
  },
  // ─── EXPANDED PHOTO LIBRARY (photos 13-100+) ───────────────────────────────
  {
    id: 'photo-013',
    image: '/images/Sunrise Meditation.jpeg',
    title: 'Sunrise Meditation',
    description: 'Morning meditation session by the old acacia tree.',
    category: 'Community',
    location: 'North Grove',
    date: '2026-05-25',
    year: 2026,
    featured: true,
    aspect: 'portrait',
  },
  {
    id: 'photo-014',
    image: '/images/Team-Bunding-&-Building.jpeg',
    title: 'Team Bunding & Building',
    description: 'An engaging outdoor team-building experience designed to strengthen collaboration, communication, and trust while fostering meaningful connections in a fun and inspiring natural environment.',
    category: 'Culture',
    location: 'Studio Wing',
    date: '2026-05-20',
    year: 2026,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-015',
    image: '/images/Stronger-Together.jpeg',
    title: 'Stronger Together',
    description: 'A lively team-building activity in a lush tropical setting, showcasing collaboration, trust, and the power of working together toward a common goal. A joyful outdoor group challenge that brings people together through teamwork, connection, and shared experiences. 🌿🤝✨',
    category: 'Workshops',
    location: 'Craft Studio',
    date: '2026-05-15',
    year: 2026,
    featured: true,
    aspect: 'landscape',
  },
  {
    id: 'photo-016',
    image: '/images/First-Light-Walk.jpeg',
    title: 'Savanna Landscape',
    description: 'Wide plains stretch endlessly toward the horizon.',
    category: 'Nature',
    location: 'Eastern Vista',
    date: '2026-05-10',
    year: 2026,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-017',
    image: '/images/Dining-in-Paradise.jpeg',
    title: 'Dining in Paradise',
    description: 'A charming outdoor dining setting nestled in lush greenery, where nature, comfort, and rustic elegance come together under a bright blue sky. 🌿☀️ An inviting garden table surrounded by vibrant trees and a beautiful thatched-roof retreat, creating the perfect escape into nature. ✨🌳🏡',
    category: 'Guests',
    location: 'Main Entrance',
    date: '2026-05-08',
    year: 2026,
    featured: false,
    aspect: 'portrait',
  },
  {
    id: 'photo-018',
    image: '/images/Believe-in-You.jpeg',
    title: 'Believe in You',
    description: 'A peaceful tropical escape surrounded by lush greenery, rustic wooden architecture, and inspiring moments that remind you there is only one you.',
    category: 'Nature',
    location: 'Gallery main',
    date: '2026-04-29',
    year: 2026,
    featured: false,
    aspect: 'square',
  },
  {
    id: 'photo-019',
    image: '/images/Pool-View.jpeg',
    title: 'Pool View',
    description: 'Unwind beside our serene pool, surrounded by lush tropical gardens and the peaceful beauty of Ubuntu Kreative Village.',
    category: 'Accommodation',
    location: 'Serene Pool',
    date: '2026-04-20',
    year: 2026,
    featured: true,
    aspect: 'landscape',
  },
  {
    id: 'photo-020',
    image: '/images/Fitness-in-Style.jpeg',
    title: 'Fitness in Style',
    description: 'Modern gym equipment set against a warm wooden backdrop, blending performance, comfort, and design to inspire an energizing workout experience.',
    category: 'Culture',
    location: 'Dye Workshop',
    date: '2026-04-18',
    year: 2026,
    featured: false,
    aspect: 'portrait',
  },
  {
    id: 'photo-021',
    image: '/images/Grace-of-the-Guinea-Fowl.jpeg',
    title: 'Grace of the Guinea Fowl',
    description: 'A striking guinea fowl stands proudly in a natural setting, showcasing its elegant speckled plumage and unique beauty against a softly blurred countryside backdrop. 🐦✨ With its distinctive patterned feathers and curious gaze, this guinea fowl captures the quiet charm of life in the wild. 🌾🤍',
    category: 'Events',
    location: 'Central Pavilion',
    date: '2026-04-12',
    year: 2026,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-022',
    image: '/images/Harvest-of-Green-Abundance.jpeg',
    title: 'Harvest of Green Abundance',
    description: 'A beautiful moment of hands gently gathering fresh green peppers, capturing the richness of nature, growth, and sustainable farming. 🌿💚 Nature’s Green Treasure, Fresh peppers thrive among vibrant leaves as caring hands celebrate the beauty of a flourishing harvest. 🌱✨',
    category: 'Workshops',
    location: 'Design Lab',
    date: '2026-04-05',
    year: 2026,
    featured: false,
    aspect: 'square',
  },
  {
    id: 'photo-023',
    image: '/images/BBQ-Beef-Chicken-Pizza-(Large).jpeg',
    title: 'BBQ Beef Chicken Pizza (Large)',
    description: 'Loaded with tender grilled chicken, savory beef, rich barbecue sauce, and melted mozzarella cheese on a perfectly baked crust. This hearty large pizza delivers a delicious balance of smoky, meaty flavors in every slice—perfect for sharing with family and friends. 🍕🔥',
    category: 'Nature',
    location: 'Eastern Plateau',
    date: '2026-03-28',
    year: 2026,
    featured: true,
    aspect: 'landscape',
  },
  {
    id: 'photo-024',
    image: '/images/A-Walk-Into-Forever.jpeg',
    title: 'A Walk Into Forever',
    description: 'A newlywed couple strolls hand in hand through a serene forest path, surrounded by nature’s beauty, capturing a timeless moment of love, unity, and new beginnings.',
    category: 'Community',
    location: 'Craft Studio',
    date: '2026-03-20',
    year: 2026,
    featured: false,
    aspect: 'portrait',
  },
  {
    id: 'photo-025',
    image: '/images/First-Light-Walk.jpeg',
    title: 'Forest Path',
    description: 'Walking trails connect the village to nature.',
    category: 'Nature',
    location: 'Forest Trail',
    date: '2026-03-15',
    year: 2026,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-026',
    image: '/images/The-Artists-Loft.jpeg',
    title: 'The Artists\' Loft',
    description: 'A serene open-air loft surrounded by nature, where Kreativity flows freely. Unwind on comfortable bean bags, explore inspiring artwork, and enjoy the perfect space to relax, connect, and be inspired.',
    category: 'Nature',
    location: 'Garden Suite',
    date: '2026-03-10',
    year: 2026,
    featured: true,
    aspect: 'portrait',
  },
  {
    id: 'photo-027',
    image: '/images/Garden-Gathering-Oasis.jpeg',
    title: 'Market Day',
    description: 'Local artisans display crafts at the weekend market.',
    category: 'Events',
    location: 'Market Square',
    date: '2026-02-28',
    year: 2026,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-028',
    image: '/images/Believe-in-You.jpeg',
    title: 'Believe in You',
    description: 'A peaceful tropical escape surrounded by lush greenery, rustic wooden architecture, and inspiring moments that remind you there is only one you.',
    category: 'Nature',
    location: 'Garden Pavilion',
    date: '2026-02-20',
    year: 2026,
    featured: false,
    aspect: 'square',
  },
  {
    id: 'photo-029',
    image: '/images/Pottery-Workshop.jpeg',
    title: 'Hands in Clay: The Art of Pottery',
    description: 'Discover the timeless craft of pottery through hands-on workshops where raw clay is transformed into beautiful, handcrafted pieces using both traditional and contemporary techniques.',
    category: 'Workshops',
    location: 'Clay Studio',
    date: '2026-02-15',
    year: 2026,
    featured: true,
    aspect: 'landscape',
  },
  {
    id: 'photo-030',
    image: '/images/Natures-Hidden-Gems.jpeg',
    title: 'Nature\'s Hidden Gems',
    description: 'Three vibrant green papayas cling gracefully to the trunk, showcasing the quiet beauty and abundance of tropical nature in a serene, close-up composition.',
    category: 'Community',
    location: 'Garden Terrace',
    date: '2026-02-10',
    year: 2026,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-031',
    image: '/images/Golden-Nights.jpeg',
    title: 'Golden Nights',
    description: 'Experience magical nights surrounded by soft lanterns, lush gardens, and an atmosphere designed for comfort and connection.',
    category: 'Culture',
    location: 'Garden Terrace',
    date: '2026-01-30',
    year: 2026,
    featured: false,
    aspect: 'portrait',
  },
  {
    id: 'photo-032',
    image: '/images/Garden-Gathering-Oasis.jpeg',
    title: 'Garden Gathering Oasis',
    description: 'A beautifully styled outdoor dining setup surrounded by lush greenery, colorful cushions, and artistic touches, creating a warm and inviting atmosphere for memorable gatherings.',
    category: 'Guests',
    location: 'Open Studio',
    date: '2026-01-22',
    year: 2026,
    featured: true,
    aspect: 'portrait',
  },
  {
    id: 'photo-033',
    image: '/images/Under-the-Stars.jpeg',
    title: 'Night Sky',
    description: 'Stars fill the sky above the village.',
    category: 'Nature',
    location: 'Open Grounds',
    date: '2026-01-15',
    year: 2026,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-034',
    image: '/images/Under-the-Stars.jpeg',
    title: 'Under the Stars',
    description: 'A warm and elegant outdoor dining setting illuminated by lanterns and string lights, creating a cozy atmosphere for unforgettable evenings and meaningful connections. An intimate open-air dining experience where soft lights, rustic charm, and artistic surroundings come together under the night sky. ✨🍽️🌙',
    category: 'Food',
    location: 'Dining Hall',
    date: '2025-12-28',
    year: 2025,
    featured: true,
    aspect: 'square',
  },
  {
    id: 'photo-035',
    image: '/images/Maasai-Beadwork-Intensive1.jpeg',
    title: 'Bead Collection',
    description: 'Display of completed beadwork pieces.',
    category: 'Culture',
    location: 'Gallery Wall',
    date: '2025-12-15',
    year: 2025,
    featured: false,
    aspect: 'portrait',
  },
  {
    id: 'photo-036',
    image: '/images/Garden-Gathering-Oasis.jpeg',
    title: 'Garden Terrace',
    description: 'Intimate outdoor space for reflection.',
    category: 'Accommodation',
    location: 'Garden Terrace',
    date: '2025-12-10',
    year: 2025,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-037',
    image: '/images/Campfire-Under-the-Stars.jpeg',
    title: 'Performance Arts',
    description: 'Traditional music and dance celebration.',
    category: 'Events',
    location: 'Central Stage',
    date: '2025-11-25',
    year: 2025,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-038',
    image: '/images/Sunbird-in-Flight.jpeg',
    title: 'Sunbird in Flight',
    description: 'Caught in a fleeting moment of flight, this graceful sunbird glides through the garden canopy, showcasing the beauty, speed, and delicate elegance of East Africa\'s vibrant birdlife. This bird appears to be a Female Eastern Double-collared Sunbird (Cinnyris mediocris) or a closely related African sunbird species. The curved beak and nectar-feeding profile are characteristic of sunbirds commonly found in East Africa.',
    category: 'Community',
    location: 'Studio',
    date: '2025-11-20',
    year: 2025,
    featured: true,
    aspect: 'portrait',
  },
  {
    id: 'photo-039',
    image: '/images/First-Light-Walk.jpeg',
    title: 'Landscape Vista',
    description: 'Rolling hills frame the village setting.',
    category: 'Nature',
    location: 'Hilltop',
    date: '2025-11-15',
    year: 2025,
    featured: false,
    aspect: 'landscape',
  },
  {
    id: 'photo-040',
    image: '/images/Wheel-Pottery-&-Wood-Firing.jpeg',
    title: 'Class in Session',
    description: 'Intensive workshop demonstrates traditional skills.',
    category: 'Workshops',
    location: 'Workshop Hall',
    date: '2025-11-08',
    year: 2025,
    featured: false,
    aspect: 'square',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTIONS — Themed photo groups for discovery
// ─────────────────────────────────────────────────────────────────────────────

export interface GalleryCollection {
  id: string
  name: string
  slug: string
  description: string
  coverImage: string
  photoCount: number
  accent: string
  icon: string
}

export const COLLECTIONS: GalleryCollection[] = [
  {
    id: 'coll-community',
    name: 'Community Life',
    slug: 'community-life',
    description: 'People, gatherings, and daily moments that define Ubuntu.',
    coverImage: '/images/The-People-Who-Make-It-Possible.jpeg',
    photoCount: 12,
    accent: '#FF6B6B',
    icon: '👥',
  },
  {
    id: 'coll-art',
    name: 'Art & Creativity',
    slug: 'art-creativity',
    description: 'Exhibitions, installations, and creative expression.',
    coverImage: '/images/he-Visionary-of-a-New-Dawn.jpeg',
    photoCount: 8,
    accent: '#4ECDC4',
    icon: '🎨',
  },
  {
    id: 'coll-workshops',
    name: 'Workshops',
    slug: 'workshops',
    description: 'Learn ancient crafts and skills from master artisans.',
    coverImage: '/images/Wheel-Pottery-&-Wood-Firing.jpeg',
    photoCount: 9,
    accent: '#F0E130',
    icon: '🛠️',
  },
  {
    id: 'coll-nature',
    name: 'Nature & Landscapes',
    slug: 'nature-landscapes',
    description: 'The wild beauty surrounding our creative village.',
    coverImage: '/images/First-Light-Walk.jpeg',
    photoCount: 10,
    accent: '#00C851',
    icon: '🌿',
  },
  {
    id: 'coll-guests',
    name: 'Guest Experiences',
    slug: 'guest-experiences',
    description: 'Moments with visitors discovering Ubuntu magic.',
    coverImage: '/images/Your-Dream-Garden-Wedding.jpeg',
    photoCount: 7,
    accent: '#A8D8F0',
    icon: '✈️',
  },
  {
    id: 'coll-accommodation',
    name: 'Accommodation',
    slug: 'accommodation',
    description: 'Luxury spaces designed for comfort and beauty.',
    coverImage: '/images/Tamarind-farmhouse01.jpeg',
    photoCount: 6,
    accent: '#D4A853',
    icon: '🏨',
  },
  {
    id: 'coll-food',
    name: 'Food & Culture',
    slug: 'food-culture',
    description: 'Farm-to-table dining celebrating local traditions.',
    coverImage: '/images/Garden-Feast.jpeg',
    photoCount: 8,
    accent: '#E8956D',
    icon: '🍽️',
  },
]

// ─────────────────────────────────────────────────────────────────────────────
// GALLERY CONFIG — Settings for masonry, infinite scroll, responsive behavior
// ─────────────────────────────────────────────────────────────────────────────

export interface GalleryConfig {
  initialLoadCount: number
  loadMoreCount: number
  masonryColumns: {
    desktop: number
    tablet: number
    mobile: number
    small: number
  }
  enableInfiniteScroll: boolean
  enableFullscreenMode: boolean
  enableSearch: boolean
  enableCollections: boolean
  animationDuration: number
  imageLazyLoad: boolean
}

export const GALLERY_CONFIG: GalleryConfig = {
  initialLoadCount: 24,
  loadMoreCount: 12,
  masonryColumns: {
    desktop: 4,      // 1400px+
    tablet: 3,       // 768px-1399px
    mobile: 2,       // 480px-767px
    small: 1,        // <480px
  },
  enableInfiniteScroll: true,
  enableFullscreenMode: true,
  enableSearch: false,
  enableCollections: true,
  animationDuration: 0.6,
  imageLazyLoad: true,
}

// ─────────────────────────────────────────────────────────────────────────────
// CHAPTER-BASED PHOTO ORGANIZATION
// ─────────────────────────────────────────────────────────────────────────────

// Get photos for each chapter by category
export function getPhotosByChapter() {
  return {
    // Latest Memories (Chapter 02) — newest first, mixed categories
    latest: PHOTOS.filter(p => p.featured).sort((a, b) =>
      new Date(b.date).getTime() - new Date(a.date).getTime()
    ).slice(0, 20),

    // Village OS (Chapter 03) — Community + Culture focus
    villageOS: PHOTOS.filter(p =>
      p.category === 'Community' || p.category === 'Culture'
    ).slice(0, 12),

    // Living Studios (Chapter 04) — Culture + Workshops
    livingStudios: PHOTOS.filter(p =>
      p.category === 'Culture' || p.category === 'Workshops'
    ).slice(0, 12),

    // Makers Alive (Chapter 05) — Events + Community + Guests
    makersAlive: PHOTOS.filter(p =>
      p.category === 'Events' || p.category === 'Community' || p.category === 'Guests'
    ).slice(0, 14),

    // Fire Circle (Chapter 06) — Culture + Food + Community
    fireCircle: PHOTOS.filter(p =>
      p.category === 'Culture' || p.category === 'Food' || p.category === 'Community'
    ).slice(0, 12),

    // All photos for gallery view
    all: PHOTOS,
  }
}

// Get photos by year for timeline filter
export function getPhotosByYear() {
  const grouped: Record<number, GalleryPhoto[]> = {}
  PHOTOS.forEach(photo => {
    if (!grouped[photo.year]) grouped[photo.year] = []
    grouped[photo.year].push(photo)
  })
  return grouped
}

// Export pre-organized photos by chapter
export const PHOTOS_BY_CHAPTER = getPhotosByChapter()
export const PHOTOS_BY_YEAR = getPhotosByYear()