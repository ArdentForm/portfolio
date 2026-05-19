import {CogIcon, HomeIcon, ImagesIcon, DocumentTextIcon, DocumentIcon, TagIcon, UserIcon, MenuIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'
import {orderableDocumentListDeskItem} from '@sanity/orderable-document-list'

const HIDDEN_TYPES = [
  'settings',
  'homepage',
  'portfolioOverview',
  'portfolioProject',
  'portfolioTag',
  'postTag',
  'post',
  'page',
  'person',
  'navigation',
  'assist.instruction.context',
]

export const structure: StructureResolver = (S: StructureBuilder, context) =>
  S.list()
    .title('Content')
    .items([
      // Portfolio
      orderableDocumentListDeskItem({type: 'portfolioProject', title: 'Projects', S, context}),
      S.listItem()
        .title('Portfolio Tags')
        .icon(TagIcon)
        .child(S.documentTypeList('portfolioTag').title('Portfolio Tags')),
      S.listItem()
        .title('Portfolio Overview')
        .icon(ImagesIcon)
        .child(S.document().schemaType('portfolioOverview').documentId('portfolioOverview')),

      S.divider(),

      // Articles
      S.listItem()
        .title('Articles')
        .icon(DocumentTextIcon)
        .child(S.documentTypeList('post').title('Articles')),
      S.listItem()
        .title('Article Tags')
        .icon(TagIcon)
        .child(S.documentTypeList('postTag').title('Article Tags')),

      S.divider(),

      // Pages
      S.listItem()
        .title('Homepage')
        .icon(HomeIcon)
        .child(S.document().schemaType('homepage').documentId('homepage')),
      S.listItem()
        .title('Other Pages')
        .icon(DocumentIcon)
        .child(S.documentTypeList('page').title('Pages')),

      S.divider(),

      // Configuration
      S.listItem()
        .title('Navigation')
        .icon(MenuIcon)
        .child(S.document().schemaType('navigation').documentId('navigation')),
      S.listItem()
        .title('Site Settings')
        .icon(CogIcon)
        .child(S.document().schemaType('settings').documentId('siteSettings')),
      S.listItem()
        .title('Authors')
        .icon(UserIcon)
        .child(S.documentTypeList('person').title('Authors')),
    ])
