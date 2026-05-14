import {CogIcon, HomeIcon, ImagesIcon, DocumentTextIcon, DocumentIcon, TagIcon, UserIcon, MenuIcon, FolderIcon} from '@sanity/icons'
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
      S.listItem()
        .title('Portfolio')
        .icon(FolderIcon)
        .child(
          S.list()
            .title('Portfolio')
            .items([
              orderableDocumentListDeskItem({type: 'portfolioProject', title: 'Projects', S, context}),
              S.listItem()
                .title('Tags')
                .icon(TagIcon)
                .child(S.documentTypeList('portfolioTag').title('Portfolio Tags')),
              S.divider(),
              S.listItem()
                .title('Portfolio Overview')
                .icon(ImagesIcon)
                .child(S.document().schemaType('portfolioOverview').documentId('portfolioOverview')),
            ])
        ),

      // Blog
      S.listItem()
        .title('Blog')
        .icon(DocumentTextIcon)
        .child(
          S.list()
            .title('Blog')
            .items([
              S.listItem()
                .title('Posts')
                .icon(DocumentTextIcon)
                .child(S.documentTypeList('post').title('Posts')),
              S.listItem()
                .title('Tags')
                .icon(TagIcon)
                .child(S.documentTypeList('postTag').title('Post Tags')),
            ])
        ),

      // Pages
      S.listItem()
        .title('Pages')
        .icon(DocumentIcon)
        .child(
          S.list()
            .title('Pages')
            .items([
              S.listItem()
                .title('Homepage')
                .icon(HomeIcon)
                .child(S.document().schemaType('homepage').documentId('homepage')),
              S.listItem()
                .title('Other Pages')
                .icon(DocumentIcon)
                .child(S.documentTypeList('page').title('Pages')),
            ])
        ),

      S.divider(),

      // Configuration
      S.listItem()
        .title('Configuration')
        .icon(CogIcon)
        .child(
          S.list()
            .title('Configuration')
            .items([
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
        ),
    ])
