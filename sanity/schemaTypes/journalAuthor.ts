import { defineType, defineField } from 'sanity'

export const journalAuthor = defineType({
  name: 'journalAuthor',
  title: 'Journal Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Author Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Author URL Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 50,
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'bio',
      title: 'Author Bio (100-150 words)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'avatar',
      title: 'Author Photo',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'socialLink',
          fields: [
            { name: 'platform', type: 'string', options: { list: ['twitter', 'instagram', 'linkedin', 'website'] } },
            { name: 'url', type: 'url' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: { title: 'name' },
    prepare: ({ title }) => ({ title: `✍️ ${title}` }),
  },
})
