import {defineQuery, groq} from 'next-sanity'

export const settingsQuery = defineQuery(`*[_type == "settings"][0]`)

const postFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "author": author->{firstName, lastName, picture},
`

const postWithTagsFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  "date": coalesce(date, _updatedAt),
  "tags": tags[]->{name, "slug": slug.current}
`

const linkReference = /* groq */ `
  _type == "link" => {
    "page": page->slug.current,
    "post": post->slug.current
  }
`

const linkFields = /* groq */ `
  link {
      ...,
      ${linkReference}
      }
`

const pageBuilderFields = /* groq */ `
  "pageBuilder": pageBuilder[]{
    ...,
    _type == "callToAction" => {
      ...,
      button {
        ...,
        ${linkFields}
      }
    },
    _type == "infoSection" => {
      content[]{
        ...,
        markDefs[]{
          ...,
          ${linkReference}
        }
      }
    },
    _type == "sectionHeading" => {
      _type,
      _key,
      heading
    },
    _type == "minimalHeader" => {
      _type,
      _key,
      label,
      meta,
      heading
    },
    _type == "imageHero" => {
      _type,
      _key,
      "image": image.asset->url,
      alt,
      subtitle,
      index,
      heading,
      lightPanel
    },
    _type == "heroSplitImageRight" => {
      _type,
      _key,
      heading,
      background,
      contentAlignment,
      "images": images[] {
        "image": image.asset->url,
        alt,
        caption
      }
    },
    _type == "deviceCropped" => {
      _type,
      _key,
      label,
      heading,
      mediaType,
      cropMode,
      image {
        image { asset-> { url } },
        alt
      },
      "videoUrl": video.asset->url,
      background,
      contentAlignment,
      items[] {
        title,
        body
      }
    },
    _type == "contentBlockGrid" => {
      _type,
      _key,
      heading,
      intro,
      background,
      items[] {
        title,
        body
      }
    },
    _type == "carouselCards" => {
      _type,
      _key,
      background,
      items[] {
        "image": image.image.asset->url,
        "alt": image.alt,
        label,
        title,
        link {
          ...,
          ${linkReference}
        }
      }
    },
    _type == "abstractCardsCarousel" => {
      _type,
      _key,
      items[] {
        label,
        heading,
        body,
        "image": image.image.asset->url,
        "alt": image.alt,
        link {
          ...,
          ${linkReference}
        }
      }
    },
    _type == "imageCollage" => {
      _type,
      _key,
      background,
      "images": images[] {
        "image": image.asset->url,
        alt
      }
    },
    _type == "imageCollageContent" => {
      _type,
      _key,
      heading,
      client,
      year,
      "descriptions": descriptions[] {
        "content": content[] {
          ...,
          markDefs[] {
            ...,
            ${linkReference}
          }
        }
      },
      background,
    },
    _type == "contentDetails" => {
      _type,
      _key,
      background,
      listItemsLabel,
      mainContentLabel,
      body[] {
        ...,
        markDefs[] {
          ...,
          ${linkReference}
        }
      },
      items[] {
        title
      }
    },
    _type == "featuredPosts" => {
      _type,
      _key,
      heading,
      intro,
      background,
      selectionMode,
      "resolvedPosts": select(
        selectionMode == "tag" => *[_type == "post" && references(^.tag._ref)] | order(date desc) [0...6] {
          _id,
          title,
          "slug": slug.current,
          excerpt,
          coverImage,
          "date": coalesce(date, _updatedAt),
          "tags": tags[]->{name, "slug": slug.current}
        },
        selectionMode == "manual" => posts[]->{
          _id,
          title,
          "slug": slug.current,
          excerpt,
          coverImage,
          "date": coalesce(date, _updatedAt),
          "tags": tags[]->{name, "slug": slug.current}
        },
        []
      )
    },
  }
`

export const homepageQuery = defineQuery(`
  *[_type == "homepage"][0]{
    _id,
    _type,
    seoTitle,
    seoDescription,
    ${pageBuilderFields}
  }
`)

export const getPageQuery = defineQuery(`
  *[_type == 'page' && slug.current == $slug][0]{
    _id,
    _type,
    name,
    slug,
    heading,
    subheading,
    ${pageBuilderFields}
  }
`)

export const sitemapData = defineQuery(`
  *[_type == "page" || _type == "post" && defined(slug.current)] | order(_type asc) {
    "slug": slug.current,
    _type,
    _updatedAt,
  }
`)

export const allPostsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postFields}
  }
`)

export const morePostsQuery = defineQuery(`
  *[_type == "post" && _id != $skip && defined(slug.current)] | order(date desc, _updatedAt desc) [0...$limit] {
    ${postWithTagsFields}
  }
`)

export const postQuery = defineQuery(`
  *[_type == "post" && slug.current == $slug] [0] {
    content[]{
    ...,
    markDefs[]{
      ...,
      ${linkReference}
    }
  },
    ${postFields}
  }
`)

export const postPagesSlugs = defineQuery(`
  *[_type == "post" && defined(slug.current)]
  {"slug": slug.current}
`)

export const pagesSlugs = defineQuery(`
  *[_type == "page" && defined(slug.current)]
  {"slug": slug.current}
`)

export const allPostTagsQuery = defineQuery(`
  *[_type == "postTag"] | order(name asc) {
    name,
    "slug": slug.current
  }
`)

export const allPostsWithTagsQuery = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(date desc, _updatedAt desc) {
    ${postWithTagsFields}
  }
`)

export const postsByTagQuery = defineQuery(`
  *[_type == "post" && defined(slug.current) && $tag in tags[]->slug.current] | order(date desc, _updatedAt desc) {
    ${postWithTagsFields}
  }
`)

export const adjacentPostsQuery = defineQuery(`
  {
    "prev": *[_type == "post" && defined(slug.current) && _id != $id && coalesce(date, _updatedAt) < $date] | order(date desc, _updatedAt desc) [0] {
      title,
      "slug": slug.current,
      coverImage
    },
    "next": *[_type == "post" && defined(slug.current) && _id != $id && coalesce(date, _updatedAt) > $date] | order(date asc, _updatedAt asc) [0] {
      title,
      "slug": slug.current,
      coverImage
    }
  }
`)

const portfolioProjectFields = /* groq */ `
  _id,
  "status": select(_originalId in path("drafts.**") => "draft", "published"),
  "title": coalesce(title, "Untitled"),
  "slug": slug.current,
  excerpt,
  coverImage,
  client,
  year,
  "tags": tags[]->{name, "slug": slug.current}
`

export const portfolioOverviewQuery = defineQuery(`
  *[_type == "portfolioOverview"][0]{
    _id,
    _type,
    passwordProtected,
    seoTitle,
    seoDescription,
    ${pageBuilderFields}
  }
`)

export const portfolioProtectionQuery = defineQuery(`
  *[_type == "portfolioOverview"][0]{passwordProtected}
`)

export const allPortfolioTagsQuery = defineQuery(`
  *[_type == "portfolioTag"] | order(name asc) {
    name,
    "slug": slug.current
  }
`)

export const allPortfolioProjectsQuery = defineQuery(`
  *[_type == "portfolioProject" && defined(slug.current)] | order(orderRank asc) {
    ${portfolioProjectFields}
  }
`)

export const portfolioProjectsByTagQuery = defineQuery(`
  *[_type == "portfolioProject" && defined(slug.current) && $tag in tags[]->slug.current] | order(orderRank asc) {
    ${portfolioProjectFields}
  }
`)

export const portfolioProjectQuery = defineQuery(`
  *[_type == "portfolioProject" && slug.current == $slug][0]{
    _id,
    _type,
    "title": coalesce(title, "Untitled"),
    "slug": slug.current,
    excerpt,
    coverImage,
    client,
    year,
    seoTitle,
    seoDescription,
    ${pageBuilderFields}
  }
`)

export const portfolioProjectPagesSlugs = defineQuery(`
  *[_type == "portfolioProject" && defined(slug.current)]
  {"slug": slug.current}
`)

export const NAVIGATION_QUERY = defineQuery(`
  *[_id == "navigation"][0]{
    "links": links[visible != false]{
      label,
      url
    }
  }
`)