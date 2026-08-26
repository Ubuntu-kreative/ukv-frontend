import { defineType, defineField } from 'sanity'

export const journalCollection = defineType({
  name: 'journalCollection',
  title: 'Journal Collection (Curated)',
  type: 'document',
  description: 'Curated thematic collections of articles',
  fields: [
    defineField({
      name: 'title',
      title: 'Collection Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 50,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Collection Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'collectionImage',
      title: 'Collection Hero Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'articles',
      title: 'Articles in Collection',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'journalPost' }] }],
      validation: Rule => Rule.required().min(3),
    }),
    defineField({
      name: 'featured',
      title: 'Featured Collection (Homepage)',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'displayOrder',
      title: 'Display Order',
      type: 'number',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      articleCount: 'articles.length',
    },
    prepare: ({ title, articleCount }) => ({
      title,
      subtitle: `${articleCount || 0} articles`,
    }),
  },
})
