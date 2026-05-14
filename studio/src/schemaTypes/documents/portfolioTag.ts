import {TagIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const portfolioTag = defineType({
  name: 'portfolioTag',
  title: 'Portfolio Tag',
  icon: TagIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: {title: 'name'},
  },
})
