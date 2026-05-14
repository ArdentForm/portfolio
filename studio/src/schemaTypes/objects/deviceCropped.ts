import { defineField, defineType } from 'sanity'
import { MobileDeviceIcon, ControlsIcon, ComposeSparklesIcon } from '@sanity/icons'

export default defineType({
  name: 'deviceCropped',
  title: 'Device — Cropped',
  type: 'object',
  icon: MobileDeviceIcon,
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
      name: 'label',
      title: 'Label',
      type: 'string',
      group: 'contents',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'mediaType',
      title: 'Device Media',
      type: 'string',
      group: 'contents',
      initialValue: 'image',
      options: {
        list: [
          {title: 'Image', value: 'image'},
          {title: 'Video', value: 'video'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'image',
      title: 'Device Image',
      type: 'object',
      group: 'contents',
      hidden: ({parent}) => parent?.mediaType === 'video',
      fields: [
        defineField({
          name: 'image',
          title: 'Image',
          type: 'image',
          options: {hotspot: true},
          validation: (Rule) =>
            Rule.custom((value, context: any) => {
              if (context.parent?.mediaType !== 'video' && !value) return 'Required'
              return true
            }),
        }),
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule) =>
            Rule.custom((value, context: any) => {
              if (context.parent?.mediaType !== 'video' && !value) return 'Required'
              return true
            }),
        }),
      ],
      preview: {
        select: {
          title: 'alt',
          media: 'image',
        },
      },
    }),
    defineField({
      name: 'video',
      title: 'Device Video',
      type: 'file',
      group: 'contents',
      hidden: ({parent}) => parent?.mediaType !== 'video',
      options: {accept: 'video/*'},
      validation: (Rule) =>
        Rule.custom((value, context: any) => {
          if (context.parent?.mediaType === 'video' && !value?.asset) return 'Required'
          return true
        }),
    }),
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      group: 'contents',
      of: [
        defineField({
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1).max(6),
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
      name: 'cropMode',
      title: 'Device Height',
      type: 'string',
      group: 'designSystem',
      initialValue: 'cropped',
      options: {
        list: [
          {title: 'Cropped (screen only)', value: 'cropped'},
          {title: 'Full device', value: 'full'},
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
      description: 'Position of the device image relative to the content',
      options: {
        list: [
          {title: 'Image Right', value: 'imageRight'},
          {title: 'Image Left', value: 'imageFirst'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: { title: 'heading' },
    prepare({ title }) {
      return {
        title: title || 'Device — Cropped',
        subtitle: 'Device Cropped block',
      }
    },
  },
})