/**
 * src/lib/journal/seo.ts
 *
 * Advanced SEO utilities for Ubuntu Journal
 * Handles structured data, sitemaps, and metadata
 */

import { generateArticleSchema, generateBreadcrumbSchema } from './utils'

/**
 * Generate Organization schema for structured data
 */
export function generateOrganizationSchema(baseUrl: string = 'https://ubuntukreativevillage.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Ubuntu Kreative Village',
    url: baseUrl,
    logo: `${baseUrl}/logo.png`,
    description:
      'A premium eco-cultural retreat and creative village in Kisumu, Kenya. Experience authentic Ubuntu hospitality, wellness, dining, and cultural immersion.',
    sameAs: [
      'https://twitter.com/UbuntuKreative',
      'https://instagram.com/ubuntukreativevillage',
      'https://facebook.com/ubuntukreativevillage',
    ],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Lake Victoria Waterfront',
      addressLocality: 'Kisumu',
      addressRegion: 'Nyanza',
      postalCode: '40100',
      addressCountry: 'KE',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Reservations',
      telephone: '+254-7XX-XXXXXX',
      email: 'hello@ubuntukreativevillage.com',
    },
  }
}

/**
 * Generate SearchAction schema for sitelinks search box
 */
export function generateSearchActionSchema(baseUrl: string = 'https://ubuntukreativevillage.com') {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    url: baseUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/journal?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/**
 * Generate FAQ schema for articles
 */
export function generateFAQSchema(
  faqs: Array<{ question: string; answer: string }>,
) {
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
 * Generate LocalBusiness schema
 */
export function generateLocalBusinessSchema(baseUrl: string = 'https://ubuntukreativevillage.com') {
  return {
    '@context': 'https://schema.org',
    '@type': ['LocalBusiness', 'TouristAttraction'],
    name: 'Ubuntu Kreative Village',
    image: `${baseUrl}/images/hero.jpg`,
    description: 'Premium eco-cultural retreat in Kisumu, Kenya',
    url: baseUrl,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Lake Victoria Waterfront',
      addressLocality: 'Kisumu',
      addressRegion: 'Nyanza',
      postalCode: '40100',
      addressCountry: 'KE',
    },
    priceRange: '$$$',
    rating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: '500',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '-0.1030',
      longitude: '34.7618',
    },
  }
}

/**
 * Generate XML Sitemap entry for article
 */
export function generateSitemapEntry(slug: string, lastmod: string, priority: number = 0.8) {
  return {
    loc: `https://ubuntukreativevillage.com/journal/${slug}`,
    lastmod,
    priority,
    changefreq: 'monthly',
  }
}

/**
 * Generate robots.txt rules
 */
export function generateRobotsTxt(baseUrl: string = 'https://ubuntukreativevillage.com') {
  return `
User-agent: *
Allow: /
Allow: /journal/
Allow: /journal/category/
Allow: /journal/tag/
Allow: /journal/author/

Disallow: /admin/
Disallow: /api/private/
Disallow: /*.json$

Sitemap: ${baseUrl}/sitemap.xml
`
}
