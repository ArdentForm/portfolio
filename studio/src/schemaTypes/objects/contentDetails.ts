import { defineField, defineType } from 'sanity'
import { ComponentIcon } from '@sanity/icons'

export default defineType({
  name: 'contentDetails',
  title: 'Content Details',
  type: 'object',
  icon: ComponentIcon,
  fields: [
    defineField({
      name: 'listItemsLabel',
      title: 'List Items Label',
      type: 'string',
      initialValue: 'Services',
    }),
    defineField({
      name: 'items',
      title: 'List Items',
      type: 'array',
      of: [
        defineField({
          name: 'item',
          title: 'Item',
          type: 'object',
          fields: [
            defineField({
              name: 'title',
              title: 'List Item',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: { title: 'title' },
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
    defineField({
      name: 'mainContentLabel',
      title: 'Main Content Label',
      type: 'string',
      initialValue: 'Challenge',
    }),
    defineField({
      name: 'body',
      title: 'Main Content',
      type: 'blockContent',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          { title: 'None', value: 'none' },
          { title: 'Tint', value: 'tint' },
          { title: 'Tile', value: 'tile' },
          { title: 'Gradient', value: 'gradient' },
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
  ],
  preview: {
    select: {
      title: 'body',
      items: 'items',
    },
    prepare({ title, items }) {
      const itemCount = items?.length || 0
      const bodyText = title?.[0]?.children?.[0]?.text || 'Content Details'
      const displayText = bodyText.length > 50 ? bodyText.substring(0, 50) + '...' : bodyText

      return {
        title: displayText,
        subtitle: `${itemCount} ${itemCount === 1 ? 'item' : 'items'}`,
      }
    },
  },
})
