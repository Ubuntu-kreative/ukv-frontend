'use client'

import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {schemaTypes} from './sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio',

  projectId: '09xi8mov',
  dataset: 'production',

  title: 'Ubuntu Ecosystem',
  name: 'ubuntu-ecosystem',

  plugins: [deskTool()],

  schema: {
    types: schemaTypes,
  },
})