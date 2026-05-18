import { defineType, defineField, defineArrayMember } from 'sanity'

export const navigation = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  preview: {
    prepare() {
      return {
        title: 'Navigation',
      }
    },
  },
  fields: [
    defineField({
      name: 'links',
      title: 'Nav Links',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'url',
              title: 'URL',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'visible',
              title: 'Visible',
              type: 'boolean',
              initialValue: true,
              description: 'Uncheck to hide this link from the navigation',
            }),
          ],
          preview: {
            select: {
              title: 'label',
              subtitle: 'url',
              visible: 'visible',
            },
            prepare({ title, subtitle, visible }) {
              return {
                title: visible === false ? `${title} (hidden)` : title,
                subtitle,
              }
            },
          },
        }),
      ],
    }),
  ],
})