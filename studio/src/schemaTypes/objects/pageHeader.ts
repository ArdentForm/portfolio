import { defineArrayMember, defineField, defineType } from 'sanity'
import { TextIcon } from '@sanity/icons'

export default defineType({
  name: 'pageHeader',
  title: 'Page Header',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          lists: [],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
            ],
            annotations: [],
          },
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Optional — leave blank to hide',
    }),
  ],
  preview: {
    select: { heading: 'heading', subtitle: 'subheading' },
    prepare({ heading, subtitle }) {
      const firstBlock = Array.isArray(heading) ? heading[0] : null
      const text = firstBlock?.children
        ?.map((child: { text?: string }) => child.text)
        .join('') || 'Page Header'
      return {
        title: text,
        subtitle: subtitle || 'Page Header',
      }
    },
  },
})
