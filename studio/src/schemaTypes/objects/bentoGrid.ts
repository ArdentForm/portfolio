import { defineField, defineType } from 'sanity'
import { ComponentIcon, ControlsIcon, ImageIcon, DocumentTextIcon, LinkIcon } from '@sanity/icons'

const backgroundColorField = defineField({
  name: 'backgroundColor',
  title: 'Background',
  type: 'string',
  initialValue: 'warm',
  options: {
    list: [
      { title: 'Warm white', value: 'warm' },
      { title: 'Tint', value: 'tint' },
      { title: 'Dark', value: 'dark' },
      { title: 'Ink', value: 'ink' },
    ],
    layout: 'radio',
  },
})

export default defineType({
  name: 'bentoGrid',
  title: 'Bento Grid',
  type: 'object',
  icon: ComponentIcon,
  groups: [
    { name: 'contents', icon: ComponentIcon, default: true },
    { name: 'designSystem', icon: ControlsIcon },
  ],
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      group: 'contents',
      description: 'Image sizes are set automatically from aspect ratio. Landscape → wide cell, portrait → tall cell, square → standard.',
      of: [
        // ── Image block ───────────────────────────────────────────────────
        defineField({
          name: 'bentoImage',
          title: 'Image',
          type: 'object',
          icon: ImageIcon,
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
              title: 'Alt text',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'overlayText',
              title: 'Overlay label',
              type: 'string',
              description: 'Optional caption shown over the image',
            }),
            defineField({
              name: 'overlayPosition',
              title: 'Label position',
              type: 'string',
              initialValue: 'bottom',
              hidden: ({ parent }) => !parent?.overlayText,
              options: {
                list: [
                  { title: 'Top', value: 'top' },
                  { title: 'Center', value: 'center' },
                  { title: 'Bottom', value: 'bottom' },
                ],
                layout: 'radio',
              },
            }),
          ],
          preview: {
            select: { title: 'alt', media: 'image' },
            prepare({ title, media }) {
              return { title: title || 'Image', subtitle: 'Auto-sized from aspect ratio', media }
            },
          },
        }),

        // ── Text block ────────────────────────────────────────────────────
        defineField({
          name: 'bentoText',
          title: 'Text',
          type: 'object',
          icon: DocumentTextIcon,
          fields: [
            backgroundColorField,
            defineField({
              name: 'content',
              title: 'Content',
              type: 'blockContentTextOnly',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'textAlign',
              title: 'Alignment',
              type: 'string',
              initialValue: 'left',
              options: {
                list: [
                  { title: 'Left', value: 'left' },
                  { title: 'Center', value: 'center' },
                  { title: 'Right', value: 'right' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'fontSize',
              title: 'Size',
              type: 'string',
              initialValue: 'base',
              options: {
                list: [
                  { title: 'Small', value: 'sm' },
                  { title: 'Base', value: 'base' },
                  { title: 'Large', value: 'lg' },
                  { title: 'XL', value: 'xl' },
                ],
                layout: 'radio',
              },
            }),
          ],
          preview: {
            select: { bg: 'backgroundColor' },
            prepare({ bg }) {
              return { title: 'Text block', subtitle: bg ?? 'warm', media: DocumentTextIcon }
            },
          },
        }),

        // ── CTA block ─────────────────────────────────────────────────────
        defineField({
          name: 'bentoCta',
          title: 'Call to Action',
          type: 'object',
          icon: LinkIcon,
          fields: [
            backgroundColorField,
            defineField({
              name: 'headline',
              title: 'Headline',
              type: 'string',
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
            }),
            defineField({
              name: 'buttonText',
              title: 'Button text',
              type: 'string',
            }),
            defineField({
              name: 'buttonLink',
              title: 'Link',
              type: 'string',
              description: 'URL or internal path (e.g. /work)',
            }),
          ],
          preview: {
            select: { title: 'headline', bg: 'backgroundColor' },
            prepare({ title, bg }) {
              return { title: title || 'CTA', subtitle: bg ?? 'warm', media: LinkIcon }
            },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),

    defineField({
      name: 'background',
      title: 'Section background',
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
    select: { count: 'items' },
    prepare({ count }) {
      const n = Array.isArray(count) ? count.length : 0
      return { title: 'Bento Grid', subtitle: `${n} item${n === 1 ? '' : 's'} · auto-layout` }
    },
  },
})
