/**
 * src/lib/journal/sanity.ts
 *
 * Sanity CMS queries for Ubuntu Journal
 * Includes fallback to sample data if Sanity is not configured
 */

import { client, isSanityConfigured } from '@/lib/sanity'
import { PHOTOS } from '@/components/gallery/Gallery.data'
import { DISHES } from '@/app/restaurant/_data/menu-data'
import { stays } from '@/app/cottages/_data/stays-data'
import { CROPS, EXPERIENCE_ITEMS, LIVESTOCK, TAB_DATA } from '@/app/farm/_data/farm-data'
import { RITUALS } from '@/app/spa/_data/spa-data'
import { SAMPLE_ARTICLES, SAMPLE_CATEGORIES, SAMPLE_AUTHORS, SAMPLE_TAGS, SAMPLE_COLLECTIONS } from './sample-data'

const JOURNAL_FALLBACK_IMAGE = '/images/Garden-Breakfast-Beneath-the-Trees.jpeg'

const SITE_IMAGE_CANDIDATES = [
  ...PHOTOS.map(photo => ({ src: photo.image, title: photo.title, context: `${photo.category} ${photo.location}` })),
  ...RITUALS.map(ritual => ({ src: ritual.image, title: ritual.name, context: `${ritual.categoryTag} ${ritual.mood}` })),
  ...stays.flatMap(stay => stay.images.map(image => ({ src: image, title: stay.name, context: `${stay.category} ${stay.description}` }))),
  ...EXPERIENCE_ITEMS.map(item => ({ src: item.image, title: item.name, context: `${item.category} ${item.description}` })),
  ...Object.values(TAB_DATA).flatMap(tab => tab.items.map(item => ({ src: item.image, title: item.name, context: `${item.tag} ${item.description}` }))),
  ...CROPS.map(crop => ({ src: crop.image, title: crop.name, context: `${crop.field} ${crop.status} ${crop.usedIn.join(' ')}` })),
  ...LIVESTOCK.map(animal => ({ src: animal.image, title: `${animal.species} ${animal.breed}`, context: `${animal.field} ${animal.notes}` })),
  ...DISHES.map(dish => ({ src: dish.image, title: dish.name, context: `${dish.category} ${dish.description} ${dish.storyLine ?? ''}` })),
]

function normalizeText(value: string = '') {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function buildArticleSignal(article: any) {
  const textBits = [
    article?.title,
    article?.excerpt,
    article?.category?.title,
    article?.category?.slug,
    ...(article?.tags ?? []).map((tag: any) => `${tag?.title ?? ''} ${tag?.slug ?? ''}`),
    ...(article?.content ?? []).flatMap((block: any) => block?.children ? block.children.map((child: any) => child?.text ?? '') : []),
  ].filter(Boolean)

  return normalizeText(textBits.join(' '))
}

function getFallbackHeroImage() {
  return {
    asset: { url: JOURNAL_FALLBACK_IMAGE },
    alt: 'Ubuntu Kreative Village',
  }
}

const IMAGE_MATCH_CACHE = new Map<string, { url: string; alt: string }>()

function resolveJournalHeroImage(article: any) {
  if (article?.heroImage?.asset?.url || article?.heroImage?.url) {
    return article.heroImage
  }

  const signal = buildArticleSignal(article)
  const cacheKey = signal || 'default-journal-hero'

  if (IMAGE_MATCH_CACHE.has(cacheKey)) {
    return IMAGE_MATCH_CACHE.get(cacheKey)
  }

  const keywords = signal.split(' ').filter((token: string) => token.length > 3)
  const keywordSet = new Set(keywords)
  let bestMatch: { url: string; alt: string; score: number } | null = null

  const weightedGroups = [
    ['ubuntu', 'community', 'village', 'connection', 'together', 'philosophy', 'story'],
    ['wellness', 'spa', 'healing', 'therapy', 'bath', 'massage', 'botanical', 'sauna'],
    ['accommodation', 'cottage', 'farmhouse', 'stay', 'retreat', 'suite', 'room', 'lodging'],
    ['nature', 'farm', 'garden', 'field', 'forest', 'savannah', 'sunrise', 'walk', 'harvest'],
    ['culture', 'craft', 'art', 'heritage', 'maasai', 'beadwork', 'traditional'],
    ['workshop', 'event', 'retreat', 'celebration', 'festival', 'gathering'],
    ['food', 'dining', 'breakfast', 'feast', 'restaurant', 'kitchen', 'harvest'],
  ]

  for (const candidate of SITE_IMAGE_CANDIDATES) {
    const haystack = normalizeText(`${candidate.title} ${candidate.context} ${candidate.src}`)
    let score = 0

    for (const group of weightedGroups) {
      const hits = group.filter(term => signal.includes(term))
      if (hits.length > 0 && group.some(term => haystack.includes(term))) {
        score += 10 + hits.length * 2
      }
    }

    for (const token of keywordSet) {
      if (haystack.includes(token)) {
        score += token.length > 5 ? 3 : 1
      }
    }

    if (score > 0 && (!bestMatch || score > bestMatch.score)) {
      bestMatch = { url: candidate.src, alt: candidate.title, score }
    }
  }

  const resolved = bestMatch ? { url: bestMatch.url, alt: bestMatch.alt } : getFallbackHeroImage().asset
  IMAGE_MATCH_CACHE.set(cacheKey, resolved)
  return resolved
}

function enrichJournalArticle(article: any) {
  if (!article) return article

  const resolvedHero = resolveJournalHeroImage(article)
  const heroImage = article.heroImage || resolvedHero

  return {
    ...article,
    heroImage,
    ogImage: article.ogImage || heroImage,
  }
}

// ─── SAFE QUERY WRAPPER ──────────────────────────────────────────────────────

/**
 * Safely execute a Sanity query with fallback to sample data
 * Uses fallback if Sanity is not configured, query fails, or result is empty
 */
async function safeSanityQuery<T>(
  query: string,
  fallback: T,
  context: string = 'Journal'
): Promise<T> {
  if (!isSanityConfigured()) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`ℹ️  [${context}] Sanity not configured, using sample data`)
    }
    return fallback
  }

  try {
    const result = await client.fetch(query)
    
    // Use fallback if result is empty (array or null)
    if (Array.isArray(result) && result.length === 0) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`ℹ️  [${context}] Sanity query returned empty, using sample data`)
      }
      return fallback
    }
    
    if (result === null || result === undefined) {
      if (process.env.NODE_ENV === 'development') {
        console.log(`ℹ️  [${context}] Sanity query returned null, using sample data`)
      }
      return fallback
    }
    
    return result
  } catch (error) {
    console.error(`⚠️  [${context}] Sanity query failed:`, error)
    if (process.env.NODE_ENV === 'development') {
      console.log(`ℹ️  [${context}] Falling back to sample data`)
    }
    return fallback
  }
}

// ─── QUERIES ──────────────────────────────────────────────────────────────

const ARTICLE_FIELDS = `
  _id,
  _createdAt,
  title,
  "slug": slug.current,
  excerpt,
  "heroImage": heroImage { "asset": asset -> { "url": url }, "alt": alt },
  "category": category -> { _id, title, "slug": slug.current },
  "tags": tags[] -> { _id, title, "slug": slug.current },
  "author": author -> { _id, name, "slug": slug.current, bio, "avatar": avatar { "asset": asset -> { "url": url } } },
  status,
  featured,
  publishedAt,
  readingTimeMinutes,
  seoTitle,
  seoDescription,
  keywords,
  "ogImage": ogImage { "asset": asset -> { "url": url } },
  canonicalUrl,
  ctaHeadline,
  ctaText,
  ctaLink
`

export async function getJournalPosts(limit = 12, status = 'published') {
  const query = `
    *[_type == "journalPost" && status == "${status}"]
    | order(publishedAt desc)
    [0...${limit}] {
      ${ARTICLE_FIELDS}
    }
  `
  const fallback = SAMPLE_ARTICLES.slice(0, limit).map(enrichJournalArticle)
  const result = await safeSanityQuery(query, fallback, `getJournalPosts(${limit})`)
  return Array.isArray(result) ? result.map(enrichJournalArticle) : enrichJournalArticle(result)
}

export async function getFeaturedArticle() {
  const query = `
    *[_type == "journalPost" && featured == true && status == "published"]
    | order(publishedAt desc)
    [0] {
      ${ARTICLE_FIELDS},
      content
    }
  `
  const result = await safeSanityQuery(query, SAMPLE_ARTICLES[0] || null, 'getFeaturedArticle')
  return enrichJournalArticle(result)
}

export async function getArticleBySlug(slug: string) {
  const query = `
    *[_type == "journalPost" && slug.current == "${slug}"][0] {
      ${ARTICLE_FIELDS},
      content,
      _updatedAt
    }
  `
  const sampleArticle = SAMPLE_ARTICLES.find(a => a.slug === slug)
  const result = await safeSanityQuery(query, sampleArticle || null, `getArticleBySlug(${slug})`)
  return enrichJournalArticle(result)
}

export async function getRelatedArticles(slug: string, limit = 3) {
  const query = `
    *[_type == "journalPost" && slug.current != "${slug}" && status == "published"]
    | order(publishedAt desc)
    [0...${limit}] {
      ${ARTICLE_FIELDS}
    }
  `
  const sampleRelated = SAMPLE_ARTICLES.filter(a => a.slug && a.slug !== slug).slice(0, limit).map(enrichJournalArticle)
  const result = await safeSanityQuery(query, sampleRelated, `getRelatedArticles(${slug})`)
  return Array.isArray(result) ? result.map(enrichJournalArticle) : enrichJournalArticle(result)
}

export async function getArticlesByCategory(categorySlug: string, limit = 12) {
  const query = `
    *[_type == "journalPost" && category->slug.current == "${categorySlug}" && status == "published"]
    | order(publishedAt desc)
    [0...${limit}] {
      ${ARTICLE_FIELDS}
    }
  `
  const sampleByCategory = SAMPLE_ARTICLES
    .filter(a => a.category?.slug === categorySlug)
    .slice(0, limit)
    .map(enrichJournalArticle)
  const result = await safeSanityQuery(query, sampleByCategory, `getArticlesByCategory(${categorySlug})`)
  return Array.isArray(result) ? result.map(enrichJournalArticle) : enrichJournalArticle(result)
}

export async function getArticlesByTag(tagSlug: string, limit = 12) {
  const query = `
    *[_type == "journalPost" && tags[]->.slug.current == "${tagSlug}" && status == "published"]
    | order(publishedAt desc)
    [0...${limit}] {
      ${ARTICLE_FIELDS}
    }
  `
  const sampleByTag = SAMPLE_ARTICLES
    .filter(a => a.tags?.some(t => t.slug === tagSlug))
    .slice(0, limit)
    .map(enrichJournalArticle)
  const result = await safeSanityQuery(query, sampleByTag, `getArticlesByTag(${tagSlug})`)
  return Array.isArray(result) ? result.map(enrichJournalArticle) : enrichJournalArticle(result)
}

export async function getArticlesByAuthor(authorSlug: string, limit = 12) {
  const query = `
    *[_type == "journalPost" && author->slug.current == "${authorSlug}" && status == "published"]
    | order(publishedAt desc)
    [0...${limit}] {
      ${ARTICLE_FIELDS}
    }
  `
  const sampleByAuthor = SAMPLE_ARTICLES
    .filter(a => a.author?.slug === authorSlug)
    .slice(0, limit)
    .map(enrichJournalArticle)
  const result = await safeSanityQuery(query, sampleByAuthor, `getArticlesByAuthor(${authorSlug})`)
  return Array.isArray(result) ? result.map(enrichJournalArticle) : enrichJournalArticle(result)
}

export async function getCategories() {
  const query = `
    *[_type == "journalCategory"] | order(title) {
      _id,
      title,
      "slug": slug.current,
      description,
      categoryIcon,
      categoryColor
    }
  `
  return safeSanityQuery(query, SAMPLE_CATEGORIES, 'getCategories')
}

export async function getTags(limit = 20) {
  const query = `
    *[_type == "journalTag"]
    [0...${limit}] {
      _id,
      title,
      "slug": slug.current
    }
  `
  return safeSanityQuery(query, SAMPLE_TAGS.slice(0, limit), 'getTags')
}

export async function getAuthor(authorSlug: string) {
  const query = `
    *[_type == "journalAuthor" && slug.current == "${authorSlug}"][0] {
      _id,
      name,
      "slug": slug.current,
      bio,
      avatar { asset -> { url } },
      email,
      socialLinks
    }
  `
  const sampleAuthor = SAMPLE_AUTHORS.find(a => a.slug === authorSlug)
  return safeSanityQuery(query, sampleAuthor || null, `getAuthor(${authorSlug})`)
}

export async function getFeaturedCollections() {
  const query = `
    *[_type == "journalCollection" && featured == true]
    | order(displayOrder)
    {
      _id,
      title,
      "slug": slug.current,
      description,
      "collectionImage": collectionImage { "asset": asset -> { "url": url } },
      "articles": articles[] -> { _id, title, "slug": slug.current }
    }
  `
  return safeSanityQuery(query, SAMPLE_COLLECTIONS, 'getFeaturedCollections')
}

export async function getCollection(slug: string) {
  const query = `
    *[_type == "journalCollection" && slug.current == "${slug}"][0] {
      _id,
      title,
      "slug": slug.current,
      description,
      collectionImage { asset -> { url } },
      articles[] -> {
        ${ARTICLE_FIELDS}
      }
    }
  `
  return safeSanityQuery(query, null, `getCollection(${slug})`)
}
