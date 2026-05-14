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
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Shown in the header when no logo image is uploaded',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'object',
      fields: [
        defineField({
          name: 'image',
          title: 'Logo Image',
          type: 'image',
          options: { hotspot: true },
        }),
        defineField({
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
        }),
        defineField({
          name: 'url',
          title: 'Logo Link URL',
          type: 'string',
        }),
      ],
    }),
  ],
})