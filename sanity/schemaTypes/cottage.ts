import { defineType, defineField } from 'sanity'

export const cottage = defineType({
  name: 'cottage',
  title: 'Ubuntu Cottages',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Cottage Name',
      type: 'string',
      description: 'e.g., Pokomo Cottage, Farmhouse',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'treeInspiration',
      title: 'African Tree Inspiration',
      type: 'string',
      description: 'The African tree this cottage is named after.',
    }),
    defineField({
      name: 'pricePerNight',
      title: 'Price Per Night',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'features',
      title: 'Features / Amenities',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'e.g., Forest view, Outdoor rain shower, King bed',
    }),
    defineField({
      name: 'description',
      title: 'Detailed Description',
      type: 'text',
    }),
    defineField({
      name: 'isAvailable',
      title: 'Is Available',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})