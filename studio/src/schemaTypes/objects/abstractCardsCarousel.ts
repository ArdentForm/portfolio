import {defineField, defineType} from 'sanity'
import {RiCarouselView} from 'react-icons/ri'

export default defineType({
  name: 'abstractCardsCarousel',
  title: 'Abstract Cards Carousel',
  type: 'object',
  icon: RiCarouselView,
  fields: [
    defineField({
      name: 'items',
      title: 'Cards',
      type: 'array',
      of: [
        defineField({
          name: 'card',
          title: 'Card',
          type: 'object',
          fields: [
            defineField({
              name: 'label',
              title: 'Label',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'heading',
              title: 'Heading',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'body',
              title: 'Body',
              type: 'text',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'image',
              title: 'Image',
              type: 'object',
              fields: [
                defineField({
                  name: 'image',
                  title: 'Image',
                  type: 'image',
                  validation: (Rule) => Rule.required(),
                }),
                defineField({
                  name: 'alt',
                  title: 'Alt Text',
                  type: 'string',
                  validation: (Rule) => Rule.required(),
                }),
              ],
            }),
            defineField({
              name: 'link',
              title: 'Link',
              type: 'link',
              validation: (Rule) => Rule.required(),
            }),
          ],
          preview: {
            select: {title: 'heading', subtitle: 'label'},
          },
        }),
      ],
      validation: (Rule) => Rule.required().min(1),
    }),
  ],
  preview: {
    select: {title: 'items'},
    prepare({title}) {
      return {
        title: 'Abstract Cards Carousel',
        subtitle: `${Array.isArray(title) ? title.length : 0} cards`,
      }
    },
  },
})
