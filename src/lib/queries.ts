import {groq} from 'next-sanity'

export const menuItemsQuery = groq`
  *[_type == "menuItem"] | order(name asc) {
    _id,
    name,
    category,
    description,
    price,
    featured,
    image
  }
`