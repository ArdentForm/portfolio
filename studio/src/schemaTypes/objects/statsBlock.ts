import {defineField, defineType} from 'sanity'
import {ActivityIcon} from '@sanity/icons'

export default defineType({
  name: 'statsBlock',
  title: 'Stats',
  type: 'object',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'items',
      title: 'Stats',
      type: 'array',
      validation: (Rule) => Rule.required().min(2).max(4),
      of: [
        defineField({
          name: 'stat',
          title: 'Stat',
          type: 'object',
          fields: [
            defineField({
              name: 'value',
              title: 'Value',
              type: 'string',
              description: 'The number or stat, e.g. "12", "5+", "99%"',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              description: 'Short description beneath the number',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'value', subtitle: 'label'},
          },
        }),
      ],
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      initialValue: 'none',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Tint', value: 'tint'},
          {title: 'Tile', value: 'tile'},
          {title: 'Gradient', value: 'gradient'},
        ],
        layout: 'radio',
      },
    }),
  ],
  preview: {
    select: {items: 'items'},
    prepare({items}) {
      const preview = (items ?? [])
        .slice(0, 3)
        .map((i: {value?: string; label?: string}) => `${i.value} ${i.label}`)
        .join(' · ')
      return {
        title: preview || 'Stats',
        subtitle: 'Stats block',
      }
    },
  },
})
