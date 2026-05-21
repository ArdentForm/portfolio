import { defineField, defineType } from 'sanity'
import { ImagesIcon, ControlsIcon } from '@sanity/icons'

export default defineType({
  name: 'imageCollage',
  title: 'Image Collage',
  type: 'object',
  icon: ImagesIcon,
  groups: [
    {
      name: 'contents',
      icon: ImagesIcon,
      default: true,
    },
    {
      name: 'designSystem',
      icon: ControlsIcon,
    },
  ],
  fields: [
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Add 3, 4, or 6 images',
      group: 'contents',
      of: [
        defineField({
          name: 'imageBlock',
          title: 'Image',
          type: 'object',
          fields: [
            defineField({
              name: 'image',
              title: 'Image',
              type: 'image',
              options: { hotspot: true },
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'alt', media: 'image' },
          },
        }),
      ],
      validation: (Rule) =>
        Rule.required().custom((images) => {
          const count = (images as unknown[])?.length ?? 0
          if (count === 3 || count === 4 || count === 6) return true
          return 'Add 3, 4, or 6 images'
        }),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      group: 'designSystem',
      initialValue: 'none',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Tint', value: 'tint' },
          { title: 'Tile', value: 'tile' },
          { title: 'Gradient', value: 'gradient' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {},
    prepare() {
      return {
        title: 'Image Collage',
        subtitle: 'Image Collage',
      }
    },
  },
})
