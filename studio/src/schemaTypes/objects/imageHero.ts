import {defineField, defineType} from 'sanity'
import {ImagesIcon} from '@sanity/icons'

export default defineType({
  name: 'imageHero',
  title: 'Image Hero',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'alt',
      title: 'Alt Text',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
      description: 'Small label shown at top of panel (e.g. "Brand Identity")',
    }),
    defineField({
      name: 'index',
      title: 'Index',
      type: 'string',
      description: 'Displayed as {01} — use "01", "02", etc.',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      description: 'Hero title shown at bottom of panel',
    }),
    defineField({
      name: 'lightPanel',
      title: 'Light panel',
      type: 'boolean',
      description: 'Use a light (white) panel instead of dark — for images with dark backgrounds',
      initialValue: false,
    }),
  ],
  preview: {
    select: {heading: 'heading', media: 'image'},
    prepare({heading, media}) {
      return {
        title: heading || 'Image Hero',
        subtitle: 'Image Hero',
        media,
      }
    },
  },
})
