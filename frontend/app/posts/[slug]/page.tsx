import type {Metadata, ResolvingMetadata} from 'next'
import {notFound} from 'next/navigation'
import {type PortableTextBlock} from 'next-sanity'

import DateComponent from '@/app/components/Date'
import PortableText from '@/app/components/PortableText'
import PostNavigation from '@/app/components/PostNavigation'
import {sanityFetch} from '@/sanity/lib/live'
import {adjacentPostsQuery, postPagesSlugs, postQuery} from '@/sanity/lib/queries'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'

type Props = {
  params: Promise<{slug: string}>
}

/**
 * Generate the static params for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-static-params
 */
export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: postPagesSlugs,
    // Use the published perspective in generateStaticParams
    perspective: 'published',
    stega: false,
  })
  return data
}

/**
 * Generate metadata for the page.
 * Learn more: https://nextjs.org/docs/app/api-reference/functions/generate-metadata#generatemetadata-function
 */
export async function generateMetadata(props: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const params = await props.params
  const {data: post} = await sanityFetch({
    query: postQuery,
    params,
    // Metadata should never contain stega
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(post?.coverImage)

  return {
    authors:
      post?.author?.firstName && post?.author?.lastName
        ? [{name: `${post.author.firstName} ${post.author.lastName}`}]
        : [],
    title: post?.title,
    description: post?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PostPage(props: Props) {
  const params = await props.params
  const {data: post} = await sanityFetch({query: postQuery, params})

  if (!post?._id) {
    return notFound()
  }

  const {data: adjacent} = await sanityFetch({
    query: adjacentPostsQuery,
    params: {id: post._id, date: post.date ?? ''},
  })

  const hasAuthor = post.author?.firstName && post.author?.lastName

  return (
    <>
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="container pt-20 pb-16 lg:pt-28 lg:pb-20">

          {/* Meta strip — brand-dot · author · date, above the title */}
          {(hasAuthor || post.date) && (
            <div className="mb-10 flex items-center gap-3">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-brand" aria-hidden="true" />
              <p className="font-mono text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600">
                {hasAuthor && (
                  <span>{post.author!.firstName} {post.author!.lastName}</span>
                )}
                {hasAuthor && post.date && (
                  <span className="mx-2.5 text-gray-300 dark:text-gray-700" aria-hidden="true">·</span>
                )}
                {post.date && <DateComponent dateString={post.date} />}
              </p>
            </div>
          )}

          {/* Title — primary typographic event */}
          <h1 className="max-w-3xl text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] tracking-[-0.02em]">
            {post.title}
          </h1>
        </div>
      </header>

      <div className="container py-16 lg:py-24">
        <article>
          {post.content?.length && (
            <PortableText
              className="max-w-[68ch] prose-headings:font-medium prose-headings:tracking-tight"
              value={post.content as PortableTextBlock[]}
            />
          )}
        </article>
      </div>

      <PostNavigation prev={adjacent?.prev} next={adjacent?.next} />
    </>
  )
}
