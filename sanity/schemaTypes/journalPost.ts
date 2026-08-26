import { defineType, defineField } from 'sanity'

export const journalPost = defineType({
  name: 'journalPost',
  title: 'Journal Article',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'metadata', title: 'Metadata & Publishing' },
    { name: 'seo', title: 'SEO & Sharing' },
    { name: 'cta', title: 'Conversions & CTAs' },
  ],
  fields: [
    // ─── CONTENT GROUP ───────────────────────────────────────────────
    defineField({
      name: 'title',
      title: 'Article Title',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required().max(100),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt (50-100 words)',
      type: 'text',
      group: 'content',
      rows: 3,
      validation: Rule => Rule.required().max(150),
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero Image (Full-width)',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'heroImageAlt',
      title: 'Hero Image Alt Text',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Primary Category',
      type: 'reference',
      group: 'content',
      to: [{ type: 'journalCategory' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'journalTag' }] }],
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      group: 'content',
      to: [{ type: 'journalAuthor' }],
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'content',
      title: 'Article Content',
      type: 'array',
      group: 'content',
      of: [
        { type: 'block' },
        {
          type: 'object',
          name: 'pullQuote',
          title: 'Pull Quote',
          fields: [
            { name: 'quote', type: 'text', title: 'Quote Text' },
            { name: 'attribution', type: 'string', title: 'Attribution' },
          ],
          preview: {
            select: { quote: 'quote' },
            prepare: ({ quote }) => ({ title: `"${quote}"` }),
          },
        },
        {
          type: 'image',
          name: 'contentImage',
          title: 'Image Block',
          options: { hotspot: true },
          fields: [
            { name: 'alt', type: 'string', title: 'Alt Text' },
            { name: 'caption', type: 'string', title: 'Caption' },
          ],
        },
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video Embed',
          fields: [
            { name: 'url', type: 'url', title: 'Video URL (YouTube/Vimeo)' },
          ],
        },
        {
          type: 'object',
          name: 'callout',
          title: 'Callout Box',
          fields: [
            { name: 'type', type: 'string', options: { list: ['info', 'tip', 'highlight', 'warning'] } },
            { name: 'text', type: 'text' },
          ],
        },
      ],
    }),
    defineField({
      name: 'relatedExperiences',
      title: 'Related Experiences (for booking CTA)',
      type: 'array',
      group: 'content',
      description: 'Link to cottage, spa, restaurant, or event offerings',
      of: [
        { type: 'reference', to: [{ type: 'cottage' }, { type: 'spaTreatment' }, { type: 'villageEvent' }] },
      ],
    }),

    // ─── METADATA GROUP ──────────────────────────────────────────────
    defineField({
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'metadata',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'metadata',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'metadata',
      options: {
        list: [
          { title: 'Draft', value: 'draft' },
          { title: 'Published', value: 'published' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'draft',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Article (Homepage)',
      type: 'boolean',
      group: 'metadata',
      initialValue: false,
    }),
    defineField({
      name: 'readingTimeMinutes',
      title: 'Estimated Reading Time (minutes)',
      type: 'number',
      group: 'metadata',
      description: 'Auto-calculated, but can override',
    }),

    // ─── SEO GROUP ──────────────────────────────────────────────────
    defineField({
      name: 'seoTitle',
      title: 'SEO Title (60 chars)',
      type: 'string',
      group: 'seo',
      validation: Rule => Rule.max(60),
    }),
    defineField({
      name: 'seoDescription',
      title: 'Meta Description (160 chars)',
      type: 'text',
      group: 'seo',
      rows: 2,
      validation: Rule => Rule.max(160),
    }),
    defineField({
      name: 'keywords',
      title: 'Keywords (comma-separated)',
      type: 'string',
      group: 'seo',
      description: 'Primary keywords for SEO',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      group: 'seo',
      description: 'For social media sharing (1200x630px recommended)',
    }),
    defineField({
      name: 'canonicalUrl',
      title: 'Canonical URL',
      type: 'url',
      group: 'seo',
      description: 'Leave blank for auto-generated /journal/[slug]',
    }),

    // ─── CTA GROUP ──────────────────────────────────────────────────
    defineField({
      name: 'ctaHeadline',
      title: 'CTA Headline',
      group: 'cta',
      type: 'string',
      initialValue: 'Experience Ubuntu Kreative Village Yourself',
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      group: 'cta',
      type: 'string',
      initialValue: 'Book Your Stay',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      group: 'cta',
      type: 'string',
      initialValue: '/book',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      category: 'category.title',
      status: 'status',
    },
    prepare: ({ title, category, status }) => ({
      title,
      subtitle: `${category} • ${status}`,
    }),
  },
})
