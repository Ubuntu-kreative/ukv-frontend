import { defineType, defineField } from 'sanity'

export const villageEvent = defineType({
  name: 'villageEvent',
  title: 'Village Events & Gatherings',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Event Title',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'date',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Event Details',
      type: 'text',
      description: 'Describe the moon circle, wedding framework, or retreat setup.',
    }),
    defineField({
      name: 'isPublic',
      title: 'Visible to Guests',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})