import { defineField, defineType } from 'sanity'
import { ComposeSparklesIcon, ControlsIcon } from '@sanity/icons'

export default defineType({
  name: 'imageCollageContent',
  title: 'Image Collage Content',
  type: 'object',
  icon: ComposeSparklesIcon,
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
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      group: 'contents',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
      group: 'contents',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'blockContentTextOnly',
      description: 'Optional description with basic formatting',
      group: 'contents',
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
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Image Collage Content',
        subtitle: 'Image Collage Content',
      }
    },
  },
})
