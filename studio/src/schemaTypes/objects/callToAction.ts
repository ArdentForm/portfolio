import {defineField, defineType} from 'sanity'
import {
  ComposeSparklesIcon,
  LinkIcon,
  ImageIcon,
  ControlsIcon,
} from '@sanity/icons'
import {MdOutlineCallToAction} from 'react-icons/md'

/**
 * Call to action schema object.  Objects are reusable schema structures document.
 * Learn more: https://www.sanity.io/docs/studio/object-type
 */

export const callToAction = defineType({
  name: 'callToAction',
  title: 'Call to Action',
  type: 'object',
  icon: MdOutlineCallToAction,
  groups: [
    {
      name: 'contents',
      icon: ComposeSparklesIcon,
      default: true,
    },
    {
      name: 'media',
      icon: ImageIcon,
    },
    {
      name: 'button',
      icon: LinkIcon,
    },
    {
      name: 'designSystem',
      icon: ControlsIcon,
    },
  ],
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      group: 'contents',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
      group: 'contents',
    }),
    defineField({
      name: 'body',
      type: 'blockContentTextOnly',
      group: 'contents',
    }),
    defineField({
      name: 'button',
      type: 'button',
      group: 'button',
    }),
    defineField({
      name: 'image',
      type: 'image',
      group: 'media',
      options: {
        hotspot: true,
      },
    }),
    defineField({
      name: 'background',
      title: 'Background',
      type: 'string',
      group: 'designSystem',
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
    defineField({
      name: 'contentAlignment',
      title: 'Content Order',
      type: 'string',
      initialValue: 'textFirst',
      description: 'Does text content or image come first?',
      options: {
        list: [
          {title: 'Text then Image', value: 'textFirst'},
          {title: 'Image then Text', value: 'imageFirst'},
        ],
        layout: 'radio',
      },
      hidden: ({parent}) => !Boolean(parent?.image?.asset),
      group: 'designSystem',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      image: 'image.asset',
    },
    prepare(selection) {
      const {title, image} = selection
      return {
        title: title,
        subtitle: 'Call to Action',
        media: image || undefined,
      }
    },
  },
})
