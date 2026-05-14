import { defineField, defineType } from 'sanity'
import { ImagesIcon, ControlsIcon, ComposeSparklesIcon } from '@sanity/icons'

export default defineType({
  name: 'heroSplitImageRight',
  title: 'Hero — Split Image Right',
  type: 'object',
  icon: ImagesIcon,
  groups: [
    {
      name: 'contents',
      icon: ComposeSparklesIcon,
      default: true,
    },
    {
      name: 'designSystem',
      icon: ControlsIcon,
    },
  ],
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'images',
      title: 'Images',
      type: 'array',
      description: 'Add exactly 3 images',
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
            defineField({
              name: 'caption',
              title: 'Caption',
              type: 'string',
              description: 'Optional — leave blank to hide',
            }),
          ],
          preview: {
            select: { title: 'alt', media: 'image' },
          },
        }),
      ],
      validation: (Rule) => Rule.required().length(3),
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
    defineField({
      name: 'contentAlignment',
      title: 'Image Alignment',
      type: 'string',
      group: 'designSystem',
      initialValue: 'imageRight',
      description: 'Position of images relative to heading',
      options: {
        list: [
          { title: 'Images Right', value: 'imageRight' },
          { title: 'Images First (Left)', value: 'imageFirst' },
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Hero — Split Image Right',
        subtitle: 'Hero Split Image Right',
      }
    },
  },
})