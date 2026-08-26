import { defineType, defineField } from 'sanity'

export const journalTag = defineType({
  name: 'journalTag',
  title: 'Journal Tag',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Tag Name',
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
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({
      title: `🏷️ ${title}`,
    }),
  },
})
