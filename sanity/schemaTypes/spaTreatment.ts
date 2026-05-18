import { defineType, defineField } from 'sanity'

export const spaTreatment = defineType({
  name: 'spaTreatment',
  title: 'Arohamai Spa Treatments',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Treatment Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'duration',
      title: 'Duration (e.g., 60 mins, 90 mins)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Treatment Description / Ritual Rituals',
      type: 'text',
    }),
    defineField({
      name: 'isActive',
      title: 'Currently Bookable',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})