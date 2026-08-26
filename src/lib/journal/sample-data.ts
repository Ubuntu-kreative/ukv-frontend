/**
 * Sample Sanity Data for Ubuntu Journal 2.0
 *
 * Ubuntu Kreative Village content library
 * This includes real content about the community, philosophy, experiences, and guest stories
 * Imported from ubuntu-content.ts to maintain single source of truth
 */

import {
  UBUNTU_CATEGORIES,
  UBUNTU_TAGS,
  UBUNTU_AUTHORS,
  UBUNTU_ARTICLES,
  UBUNTU_COLLECTIONS,
} from './ubuntu-content'

// Use Ubuntu content directly - fallback when Sanity is unavailable
const SAMPLE_CATEGORIES = UBUNTU_CATEGORIES
const SAMPLE_TAGS = UBUNTU_TAGS


// Import Ubuntu-specific content
const SAMPLE_ARTICLES = UBUNTU_ARTICLES
const SAMPLE_AUTHORS = UBUNTU_AUTHORS
const SAMPLE_COLLECTIONS = UBUNTU_COLLECTIONS

console.log('📚 sample-data.ts loaded - UBUNTU_ARTICLES:', UBUNTU_ARTICLES.length, 'articles')
console.log('📚 sample-data.ts loaded - SAMPLE_ARTICLES:', SAMPLE_ARTICLES.length, 'articles')


// ─── INSTRUCTIONS FOR SANITY SETUP ───────────────────────────────────────

/*
UBUNTU JOURNAL 2.0 - Content Setup Instructions

This sample data provides fallback content when Sanity CMS is unavailable.
The content is sourced from ubuntu-content.ts to maintain a single source of truth.

To load this content into your Sanity Studio:

1. Log into your Sanity Studio at: https://sanity.io/desk
2. Go to Vision → Create Document
3. Create documents in this order:
   - Journal Categories (10 total)
   - Journal Tags (12 total)
   - Journal Authors (2 total)
   - Journal Posts (15 total)

Featured Collections are automatically derived from article relationships.

For bulk imports:
- Use the Sanity CLI: `sanity dataset import data.ndjson`
- Or use the Sanity Studio bulk upload feature
- Ensure all references (_ref, _key) are properly linked

Sample article structure in Sanity:
{
  "_type": "journalPost",
  "title": "Article Title",
  "slug": { "current": "article-slug" },
  "excerpt": "Brief article excerpt...",
  "heroImage": {
    "_type": "image",
    "asset": { "_ref": "IMAGE_ASSET_ID" },
    "alt": "Image description"
  },
  "category": { "_ref": "CATEGORY_ID", "_type": "reference" },
  "author": { "_ref": "AUTHOR_ID", "_type": "reference" },
  "tags": [
    { "_ref": "TAG_ID_1", "_type": "reference" },
    { "_ref": "TAG_ID_2", "_type": "reference" }
  ],
  "publishedAt": "2026-06-15T00:00:00Z",
  "status": "published",
  "featured": false,
  "readingTimeMinutes": 6,
  "seoTitle": "Article | Ubuntu Kreative Village",
  "seoDescription": "Brief SEO description...",
  "ctaHeadline": "Headline for CTA",
  "ctaText": "Button text",
  "ctaLink": "/contact",
  "content": [
    {
      "_type": "block",
      "style": "normal",
      "children": [
        { "_type": "span", "text": "Content here..." }
      ]
    }
  ]
}

Environment Setup:
- PROJECT_ID: 09xi8mov
- DATASET: production
- API_VERSION: 2024-01-01
- Ensure .env.local contains these variables for Sanity connection

For questions or content updates:
- Edit ubuntu-content.ts to update sample data
- Run `npm run dev` to reload with new content
- Run `npm run build` to verify no TypeScript errors
*/

export { SAMPLE_CATEGORIES, SAMPLE_TAGS, SAMPLE_AUTHORS, SAMPLE_ARTICLES, SAMPLE_COLLECTIONS }
