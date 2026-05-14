import {defineArrayMember, defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

export const sectionHeading = defineType({
  name: 'sectionHeading',
  title: 'Section Heading',
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
          styles: [{title: 'Normal', value: 'normal'}],
          lists: [],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
            ],
            annotations: [],
          },
        }),
      ],
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
    },
    prepare({heading}) {
      const firstBlock = Array.isArray(heading) ? heading[0] : null
      const text = firstBlock?.children
        ?.map((child: {text?: string}) => child.text)
        .join('') || 'Untitled Section Heading'
      return {
        title: text,
        subtitle: 'Section Heading',
      }
    },
  },
})
