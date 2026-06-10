import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',

  fields: [
    defineField({
      name: 'name',
      title: 'Food Name',
      type: 'string',
    }),

    defineField({
      name: 'category',
      title: 'Category',
      type: 'string',
      options: {
        list: [
          {title: 'Breakfast', value: 'breakfast'},
          {title: 'Main Course', value: 'main-course'},
          {title: 'Dessert', value: 'dessert'},
          {title: 'Drink', value: 'drink'},
          {title: 'Cocktail', value: 'cocktail'},
        ],
      },
    }),

    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
    }),

    defineField({
      name: 'price',
      title: 'Price',
      type: 'number',
    }),

    defineField({
      name: 'image',
      title: 'Food Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    }),

    defineField({
      name: 'featured',
      title: 'Featured Item',
      type: 'boolean',
    }),
  ],
})