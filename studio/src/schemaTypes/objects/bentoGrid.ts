import { defineField, defineType } from 'sanity'
import { ComponentIcon, ControlsIcon, ImageIcon, DocumentTextIcon, LinkIcon } from '@sanity/icons'

const enabledField = defineField({
  name: 'enabled',
  title: 'Visible',
  type: 'boolean',
  initialValue: true,
  description: 'Toggle off to hide this item from the grid without deleting it',
})

// Only shown when displayStyle === 'card' (or when the tile type has no displayStyle field).
// Hidden for naked/hairline tiles since background has no effect on transparent surfaces.
const backgroundColorField = defineField({
  name: 'backgroundColor',
  title: 'Background',
  type: 'string',
  initialValue: 'base',
  hidden: ({ parent }) => parent?.displayStyle === 'naked' || parent?.displayStyle === 'hairline',
  options: {
    list: [
      { title: 'Base', value: 'base' },
      { title: 'Reverse', value: 'reverse' },
      { title: 'Brand', value: 'brand' },
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
            enabledField,
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
              name: 'label',
              title: 'Caption',
              type: 'string',
              description: 'Short label shown top-right — e.g. "Portraits", "Patterns"',
            }),
          ],
          preview: {
            select: { title: 'alt', media: 'image', enabled: 'enabled' },
            prepare({ title, media, enabled }) {
              return {
                title: title || 'Image',
                subtitle: enabled === false ? '⚠ Hidden' : 'Auto-sized from aspect ratio',
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
            enabledField,
            backgroundColorField,
            defineField({
              name: 'displayStyle',
              title: 'Display style',
              type: 'string',
              initialValue: 'card',
              options: {
                list: [
                  { title: 'Card (filled background)', value: 'card' },
                  { title: 'Naked (transparent)', value: 'naked' },
                  { title: 'Hairline (border only)', value: 'hairline' },
                ],
                layout: 'radio',
              },
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Optional mono tag anchored top-left — hidden when display style is Naked or Hairline unless set',
            }),
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
            select: { bg: 'backgroundColor', enabled: 'enabled' },
            prepare({ bg, enabled }) {
              return {
                title: 'Text block',
                subtitle: enabled === false ? '⚠ Hidden' : (bg ?? 'base'),
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
            enabledField,
            backgroundColorField,
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Optional mono tag anchored top-left of the tile',
            }),
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
            select: { title: 'headline', bg: 'backgroundColor', enabled: 'enabled' },
            prepare({ title, bg, enabled }) {
              return {
                title: title || 'CTA',
                subtitle: enabled === false ? '⚠ Hidden' : (bg ?? 'base'),
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
      return { title: 'Bento Grid', subtitle: `${n} item${n === 1 ? '' : 's'} · auto-layout` }
    },
  },
})
