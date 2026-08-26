/**
 * src/lib/journal/utils.ts
 *
 * Utility functions for the Ubuntu Journal
 */

/**
 * Safely extract slug string from various slug formats
 * Handles: string | { current: string } | null | undefined
 */
export function getSlug(slug: unknown): string {
  if (!slug) return ''

  if (typeof slug === 'string') {
    return slug
  }

  if (typeof slug === 'object' && slug !== null && 'current' in slug) {
    return String((slug as any).current)
  }

  return ''
}

/**
 * Calculate reading time in minutes based on word count
 * Assumes 200 words per minute average reading speed
 */
export function calculateReadingTime(text: string): number {
  const wordCount = text.trim().split(/\s+/).length
  const readingTime = Math.ceil(wordCount / 200)
  return Math.max(1, readingTime)
}

/**
 * Format date for display
 */
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Generate SEO title (60 chars max)
 */
export function generateSEOTitle(title: string): string {
  return title.length > 60 ? `${title.substring(0, 57)}...` : title
}

/**
 * Generate SEO description (160 chars max)
 */
export function generateSEODescription(excerpt: string): string {
  return excerpt.length > 160 ? `${excerpt.substring(0, 157)}...` : excerpt
}

/**
 * Generate canonical URL for article
 */
export function generateCanonicalUrl(slug: string, baseUrl: string = 'https://ubuntukreativevillage.com'): string {
  return `${baseUrl}/journal/${slug}`
}

/**
 * Generate JSON-LD structured data for Article
 */
export function generateArticleSchema(article: any, baseUrl: string = 'https://ubuntukreativevillage.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage?.asset?.url,
    author: {
      '@type': 'Person',
      name: article.author?.name,
    },
    datePublished: article.publishedAt,
    dateModified: article._updatedAt || article.publishedAt,
    articleBody: article.content
      ? article.content
          .filter((block: any) => block._type === 'block')
          .map((block: any) => (block.children ? block.children.map((child: any) => child.text).join(' ') : ''))
          .join('\n')
      : '',
    url: generateCanonicalUrl(getSlug(article.slug), baseUrl),
    mainEntityOfPage: generateCanonicalUrl(getSlug(article.slug), baseUrl),
  }
}

/**
 * Generate JSON-LD for BreadcrumbList
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/**
 * Generate Open Graph meta tags
 */
export function generateOGTags(article: any, baseUrl: string = 'https://ubuntukreativevillage.com') {
  return {
    'og:title': article.seoTitle || article.title,
    'og:description': article.seoDescription || article.excerpt,
    'og:image': article.ogImage?.asset?.url || article.heroImage?.asset?.url,
    'og:url': generateCanonicalUrl(getSlug(article.slug), baseUrl),
    'og:type': 'article',
    'og:site_name': 'Ubuntu Kreative Village',
  }
}

/**
 * Generate Twitter Card meta tags
 */
export function generateTwitterTags(article: any, author?: string) {
  return {
    'twitter:card': 'summary_large_image',
    'twitter:title': article.seoTitle || article.title,
    'twitter:description': article.seoDescription || article.excerpt,
    'twitter:image': article.ogImage?.asset?.url || article.heroImage?.asset?.url,
    'twitter:creator': author ? `@${author}` : '@UbuntuKreative',
  }
}

/**
 * Parse and extract plain text from Sanity rich text blocks
 */
export function extractPlainText(blocks: any[]): string {
  if (!blocks) return ''
  return blocks
    .filter(block => block._type === 'block')
    .map(block => {
      if (block.children) {
        return block.children.map((child: any) => child.text || '').join('')
      }
      return ''
    })
    .join('\n')
}

/**
 * Generate JSON-LD for Testimonial/Review
 */
export function generateTestimonialSchema(testimonial: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `https://ubuntukreativevillage.com/testimonial/${testimonial._id}`,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: '5',
      bestRating: '5',
      worstRating: '1',
    },
    author: {
      '@type': 'Person',
      name: testimonial.name,
    },
    reviewBody: testimonial.testimonial,
    datePublished: testimonial.date || new Date().toISOString(),
  }
}

/**
 * Generate AggregateRating schema for multiple reviews/testimonials
 */
export function generateAggregateRatingSchema(reviewCount: number = 8, ratingValue: number = 4.9) {
  return {
    '@context': 'https://schema.org',
    '@type': 'AggregateRating',
    ratingValue: ratingValue.toString(),
    reviewCount: reviewCount.toString(),
    bestRating: '5',
    worstRating: '1',
  }
}

/**
 * Generate JSON-LD for Event
 */
export function generateEventSchema(event: any, baseUrl: string = 'https://ubuntukreativevillage.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Event',
    '@id': `${baseUrl}/event/${event._id}`,
    name: event.title,
    description: event.description,
    url: `${baseUrl}/contact`,
    image: event.image?.asset?.url,
    eventAttendanceMode: 'OfflineEventAttendanceMode',
    eventStatus: 'EventScheduled',
    location: {
      '@type': 'Place',
      name: 'Ubuntu Kreative Village',
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'KE',
        addressRegion: 'Kisumu County',
      },
    },
    organizer: {
      '@type': 'Organization',
      name: 'Ubuntu Kreative Village',
      url: baseUrl,
    },
  }
}

/**
 * Generate JSON-LD for FAQPage
 */
export function generateFAQSchema(faqs: Array<{ question: string; answer: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(faq => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/**
 * Generate Organization schema for Ubuntu
 */
export function generateOrganizationSchema(baseUrl: string = 'https://ubuntukreativevillage.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ubuntu Kreative Village',
    url: baseUrl,
    logo: `${baseUrl}/images/ubuntu-logo.png`,
    description: 'Africa\'s premier creative hospitality destination. A sanctuary where art, nature, wellness, and community converge.',
    sameAs: [
      'https://www.facebook.com/ubuntukreativevillage',
      'https://www.instagram.com/ubuntukreativevillage',
      'https://twitter.com/ubuntukreative',
    ],
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KE',
      addressRegion: 'Kisumu County',
      addressLocality: 'Kisumu',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'hello@ubuntukreativevillage.com',
    },
  }
}

