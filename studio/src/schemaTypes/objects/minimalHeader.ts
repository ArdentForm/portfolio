import {defineField, defineType} from 'sanity'
import {TextIcon} from '@sanity/icons'

export default defineType({
  name: 'minimalHeader',
  title: 'Minimal Header',
  type: 'object',
  icon: TextIcon,
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Small caption top-left (e.g. "Selected Work")',
    }),
    defineField({
      name: 'meta',
      title: 'Meta',
      type: 'string',
      description: 'Small text top-right (e.g. "03 Projects")',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {heading: 'heading', label: 'label'},
    prepare({heading, label}) {
      return {
        title: heading || 'Minimal Header',
        subtitle: label || 'Minimal Header',
      }
    },
  },
})
