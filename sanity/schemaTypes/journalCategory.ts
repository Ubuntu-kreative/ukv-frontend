import { defineType, defineField } from 'sanity'

export const journalCategory = defineType({
  name: 'journalCategory',
  title: 'Journal Category',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Category Name',
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
      title: 'Category Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'categoryIcon',
      title: 'Category Icon (Lucide icon name)',
      type: 'string',
      description: 'e.g., "Compass", "Users", "Leaf", "Music"',
    }),
    defineField({
      name: 'categoryColor',
      title: 'Category Color (Tailwind)',
      type: 'string',
      options: {
        list: [
          { title: 'Emerald', value: 'emerald' },
          { title: 'Amber', value: 'amber' },
          { title: 'Blue', value: 'blue' },
          { title: 'Purple', value: 'purple' },
          { title: 'Rose', value: 'rose' },
          { title: 'Green', value: 'green' },
          { title: 'Indigo', value: 'indigo' },
          { title: 'Orange', value: 'orange' },
        ],
      },
      initialValue: 'emerald',
    }),
  ],
  preview: {
    select: { title: 'title' },
    prepare: ({ title }) => ({ title }),
  },
})
