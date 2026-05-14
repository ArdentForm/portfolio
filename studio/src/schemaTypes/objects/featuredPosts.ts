import {ImagesIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'featuredPosts',
  title: 'Featured Posts',
  type: 'object',
  icon: ImagesIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      options: {
        list: [
          {title: 'None', value: 'none'},
          {title: 'Tint', value: 'tint'},
          {title: 'Tile', value: 'tile'},
          {title: 'Gradient', value: 'gradient'},
        ],
        layout: 'radio',
      },
      initialValue: 'none',
    }),
    defineField({
      name: 'selectionMode',
      title: 'Post Selection',
      type: 'string',
      options: {
        list: [
          {title: 'By Tag', value: 'tag'},
          {title: 'Manual', value: 'manual'},
        ],
        layout: 'radio',
      },
      initialValue: 'tag',
    }),
    defineField({
      name: 'tag',
      title: 'Tag',
      description: 'Show all posts with this tag.',
      type: 'reference',
      to: [{type: 'postTag'}],
      hidden: ({parent}) => parent?.selectionMode !== 'tag',
    }),
    defineField({
      name: 'posts',
      title: 'Posts',
      description: 'Manually pick which posts to show.',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'post'}]}],
      hidden: ({parent}) => parent?.selectionMode !== 'manual',
    }),
  ],
  preview: {
    select: {
      heading: 'heading',
      selectionMode: 'selectionMode',
      tagName: 'tag.name',
    },
    prepare({heading, selectionMode, tagName}) {
      const subtitle =
        selectionMode === 'tag' && tagName
          ? `By tag: ${tagName}`
          : selectionMode === 'manual'
            ? 'Manual selection'
            : ''
      return {
        title: heading || 'Featured Posts',
        subtitle,
      }
    },
  },
})
