import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      description: 'Overrides the default site title in browser tab and search results.',
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 3,
      description: 'Used in search engine results and social sharing previews.',
    }),
    defineField({
      name: 'pageBuilder',
      title: 'Page Builder',
      type: 'array',
      of: [
        {type: 'callToAction'},
        {type: 'minimalHeader'},
        {type: 'sectionHeading'},
        {type: 'deviceCropped'},
        {type: 'imageHero'},
        {type: 'heroSplitImageRight'},
        {type: 'contentBlockGrid'},
        {type: 'carouselCards'},
        {type: 'abstractCardsCarousel'},
        {type: 'imageCollage'},
        {type: 'contentDetails'},
        {type: 'featuredPosts'},
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
  ],
  preview: {
    prepare() {
      return {title: 'Homepage'}
    },
  },
})
