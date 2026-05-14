import type {Metadata} from 'next'
import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {allPostTagsQuery, allPostsWithTagsQuery, postsByTagQuery} from '@/sanity/lib/queries'
import PostCard from '@/app/components/PostCard'

type PostTag = {slug: string | null; name: string | null}

type PostSummary = {
  _id: string
  title: string | null
  slug: string | null
  excerpt?: string | null
  coverImage?: {
    asset?: {_ref: string} | null
    hotspot?: {x: number; y: number} | null
    crop?: {top: number; bottom: number; left: number; right: number} | null
    alt?: string | null
  } | null
  date?: string | null
  tags?: PostTag[] | null
}

type Props = {
  searchParams: Promise<{tag?: string}>
}

export const metadata: Metadata = {
  title: 'Posts',
}

export default async function PostsPage({searchParams}: Props) {
  const {tag} = await searchParams

  const {data: tags} = await sanityFetch({query: allPostTagsQuery})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {data: posts}: {data: PostSummary[]} = tag
    ? await (sanityFetch as any)({query: postsByTagQuery, params: {tag}})
    : await sanityFetch({query: allPostsWithTagsQuery})

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12 lg:py-20">
      <div className="mb-10 max-w-2xl">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl">Articles</h1>
      </div>

      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-10">
          <Link
            href="/posts"
            className={`text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded border transition-colors ${
              !tag
                ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                : 'border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-400'
            }`}
          >
            All
          </Link>
          {tags.map((t: PostTag) => (
            <Link
              key={t.slug}
              href={`/posts?tag=${t.slug}`}
              className={`text-xs font-mono tracking-widest uppercase px-3 py-1.5 rounded border transition-colors ${
                tag === t.slug
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'border-gray-200 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-400'
              }`}
            >
              {t.name}
            </Link>
          ))}
        </div>
      )}

      {posts && posts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500 font-mono text-sm">
          No posts found{tag ? ' for this tag' : ''}.
        </p>
      )}
    </div>
  )
}
