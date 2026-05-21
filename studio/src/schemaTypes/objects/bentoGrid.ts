import { defineField, defineType } from 'sanity'
import { GridIcon, ControlsIcon, ImageIcon, DocumentTextIcon, LinkIcon } from '@sanity/icons'

const spanField = defineField({
  name: 'span',
  title: 'Size',
  type: 'object',
  options: { collapsible: true, collapsed: false },
  fields: [
    defineField({
      name: 'cols',
      title: 'Width',
      type: 'number',
      initialValue: 1,
      options: {
        list: [
          { title: '1 column', value: 1 },
          { title: '2 columns', value: 2 },
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'rows',
      title: 'Height',
      type: 'number',
      initialValue: 1,
      options: {
        list: [
          { title: '1 row', value: 1 },
          { title: '2 rows', value: 2 },
        ],
        layout: 'radio',
      },
    }),
  ],
})

const backgroundColorField = defineField({
  name: 'backgroundColor',
  title: 'Background color',
  type: 'string',
  initialValue: 'warm',
  options: {
    list: [
      { title: 'Warm white', value: 'warm' },
      { title: 'Tint', value: 'tint' },
      { title: 'Dark', value: 'dark' },
      { title: 'Accent (orange)', value: 'accent' },
      { title: 'None', value: 'none' },
    ],
    layout: 'radio',
  },
})

export default defineType({
  name: 'bentoGrid',
  title: 'Bento Grid',
  type: 'object',
  icon: GridIcon,
  groups: [
    { name: 'contents', icon: GridIcon, default: true },
    { name: 'designSystem', icon: ControlsIcon },
  ],
  fields: [
    defineField({
      name: 'items',
      title: 'Items',
      type: 'array',
      group: 'contents',
      of: [
        // ── Image block ───────────────────────────────────────────────────
        defineField({
          name: 'bentoImage',
          title: 'Image',
          type: 'object',
          icon: ImageIcon,
          fields: [
            spanField,
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
              title: 'Overlay text',
              type: 'string',
              description: 'Optional caption shown on top of the image',
            }),
            defineField({
              name: 'overlayPosition',
              title: 'Overlay position',
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
            select: { title: 'alt', media: 'image', cols: 'span.cols', rows: 'span.rows' },
            prepare({ title, media, cols, rows }) {
              return {
                title: title || 'Image',
                subtitle: cols && rows ? `${cols}×${rows}` : '1×1',
                media,
              }
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
            spanField,
            backgroundColorField,
            defineField({
              name: 'content',
              title: 'Content',
              type: 'blockContentTextOnly',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'textAlign',
              title: 'Text alignment',
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
              title: 'Font size',
              type: 'string',
              initialValue: 'base',
              options: {
                list: [
                  { title: 'Small', value: 'sm' },
                  { title: 'Base', value: 'base' },
                  { title: 'Large', value: 'lg' },
                  { title: 'Extra large', value: 'xl' },
                ],
                layout: 'radio',
              },
            }),
          ],
          preview: {
            select: { cols: 'span.cols', rows: 'span.rows', bg: 'backgroundColor' },
            prepare({ cols, rows, bg }) {
              return {
                title: 'Text block',
                subtitle: `${cols ?? 1}×${rows ?? 1} · ${bg ?? 'warm'}`,
                media: DocumentTextIcon,
              }
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
            spanField,
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
              title: 'Button link',
              type: 'string',
              description: 'URL or internal path (e.g. /about)',
            }),
          ],
          preview: {
            select: {
              title: 'headline',
              cols: 'span.cols',
              rows: 'span.rows',
              bg: 'backgroundColor',
            },
            prepare({ title, cols, rows, bg }) {
              return {
                title: title || 'CTA',
                subtitle: `${cols ?? 1}×${rows ?? 1} · ${bg ?? 'warm'}`,
                media: LinkIcon,
              }
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
      return {
        title: 'Bento Grid',
        subtitle: `${n} item${n === 1 ? '' : 's'}`,
      }
    },
  },
})
