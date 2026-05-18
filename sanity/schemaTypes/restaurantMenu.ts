import { defineType, defineField } from 'sanity'

export const restaurantMenu = defineType({
  name: 'restaurantMenu',
  title: 'Restaurant Menu & Specials',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Item Name',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          { title: 'Breakfast', value: 'breakfast' },
          { title: 'Lunch', value: 'lunch' },
          { title: 'Dinner / Specials', value: 'dinner' },
          { title: 'Drinks / Smoothies', value: 'drinks' },
        ],
      },
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'price',
      title: 'Price (KSH / USD)',
      type: 'string',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Describe ingredients. Mention if it is harvested directly from the Ubuntu farm!',
    }),
    defineField({
      name: 'isVegetarian',
      title: 'Vegetarian Option',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isVegan',
      title: 'Vegan Option',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'isAvailable',
      title: 'Available Today',
      type: 'boolean',
      initialValue: true,
    }),
  ],
})