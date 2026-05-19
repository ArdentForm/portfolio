import {CaseIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const portfolioProject = defineType({
  name: 'portfolioProject',
  title: 'Portfolio Project',
  icon: CaseIcon,
  type: 'document',
  fields: [
    defineField({
      name: 'orderRank',
      title: 'Order Rank',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: {
        hotspot: true,
        aiAssist: {
          imageDescriptionField: 'alt',
        },
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility.',
          validation: (rule) =>
            rule.custom((alt, context) => {
              if ((context.document as any)?.coverImage?.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            }),
        },
      ],
    }),
    defineField({
      name: 'client',
      title: 'Client',
      type: 'string',
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'string',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'portfolioTag'}]}],
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        {type: 'pageHeader'},
        {type: 'sectionHeading'},
        {type: 'statsBlock'},
        {type: 'imageHero'},
        {type: 'deviceCropped'},
        {type: 'heroSplitImageRight'},
        {type: 'contentBlockGrid'},
        {type: 'carouselCards'},
        {type: 'abstractCardsCarousel'},
        {type: 'imageCollageContent'},
        {type: 'imageCollage'},
        {type: 'contentDetails'},
      ],
      options: {
        insertMenu: {
          views: [
            {
              name: 'grid',
              previewImageUrl: (schemaTypeName) =>
                `/static/page-builder-thumbnails/${schemaTypeName}.webp`,
            },
          ],
        },
      },
    }),
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Overrides the project title in browser tab and search results.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Used in search engine results and social sharing previews.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      client: 'client',
      year: 'year',
      media: 'coverImage',
    },
    prepare({title, client, year, media}) {
      const subtitle = [client, year].filter(Boolean).join(' · ')
      return {title, media, subtitle}
    },
  },
})
