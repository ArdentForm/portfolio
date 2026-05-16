import type {Metadata} from 'next'
import Link from 'next/link'

import {sanityFetch} from '@/sanity/lib/live'
import {allPostTagsQuery, allPostsWithTagsQuery, postsByTagQuery} from '@/sanity/lib/queries'
import SanityImage from '@/app/components/SanityImage'

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
  title: 'Articles',
}

function firstTagName(post: PostSummary): string | null {
  return post.tags?.[0]?.name ?? null
}

function chunk<T>(arr: T[], size: number): T[][] {
  return Array.from({length: Math.ceil(arr.length / size)}, (_, i) =>
    arr.slice(i * size, (i + 1) * size),
  )
}

const d = 'border-gray-200 dark:border-gray-800'

export default async function PostsPage({searchParams}: Props) {
  const {tag} = await searchParams

  const {data: tags} = await sanityFetch({query: allPostTagsQuery})
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {data: posts}: {data: PostSummary[]} = tag
    ? await (sanityFetch as any)({query: postsByTagQuery, params: {tag}})
    : await sanityFetch({query: allPostsWithTagsQuery})

  const featured = posts?.[0] ?? null
  const tripleRow = posts?.slice(1, 4) ?? []
  const landscape = posts?.[4] ?? null
  const overflow = posts?.slice(5) ?? []
  const overflowRows = chunk(overflow, 3)

  // CTA placement: fills whatever slot is left empty
  // 'inTriple'   — CTA absorbs the empty columns in the 3-col row (1–2 posts there)
  // 'inLandscape'— CTA sits in the 4-col slot beside the landscape card (or spans 12 if no landscape)
  // 'standalone' — only the featured card exists; CTA gets its own full-width row
  const ctaPlacement: 'inTriple' | 'inLandscape' | 'standalone' =
    tripleRow.length === 0 ? 'standalone'
    : tripleRow.length < 3 ? 'inTriple'
    : 'inLandscape'

  const ctaColSpan =
    ctaPlacement === 'inTriple'    ? (3 - tripleRow.length) * 4
    : ctaPlacement === 'inLandscape' && !landscape ? 12
    : 4

  const activeTagName = tag
    ? (tags as PostTag[]).find((t: PostTag) => t.slug === tag)?.name ?? tag
    : null

  return (
    <>
      {/* Page header */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28">
        <div className="flex items-baseline justify-between mb-4">
          <p className="font-mono text-xs tracking-widest uppercase text-gray-400 dark:text-gray-600">
            Selected Writing
          </p>
          {posts && posts.length > 0 && (
            <p className="font-mono text-xs tracking-widest uppercase text-gray-400 dark:text-gray-600">
              {String(posts.length).padStart(2, '0')} Articles
            </p>
          )}
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800" />

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pt-8 pb-14 lg:pb-20">
          <h1
            className="text-[clamp(3rem,7vw,5.5rem)] leading-[1.0] tracking-[-0.02em]"
            style={{textWrap: 'balance'} as React.CSSProperties}
          >
            Articles
          </h1>

          {tags && tags.length > 0 && (
            <nav className="flex items-center flex-wrap gap-x-6 gap-y-2 pb-1" aria-label="Filter by category">
              <Link
                href="/posts"
                className={`inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
                  !tag
                    ? 'text-gray-900 dark:text-gray-100'
                    : 'text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100'
                }`}
              >
                {!tag && (
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                )}
                All
              </Link>
              {tags.map((t: PostTag) => (
                <Link
                  key={t.slug}
                  href={`/posts?tag=${t.slug}`}
                  className={`inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
                    tag === t.slug
                      ? 'text-gray-900 dark:text-gray-100'
                      : 'text-gray-400 dark:text-gray-600 hover:text-gray-900 dark:hover:text-gray-100'
                  }`}
                >
                  {tag === t.slug && (
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                  )}
                  {t.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </div>

      {/* Editorial grid */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-24 lg:pb-36">
        {posts && posts.length > 0 ? (
          <div className={`border ${d}`}>

            {/* Row 1: Featured — 7 / 5 split */}
            {featured && (
              <Link
                href={`/posts/${featured.slug}`}
                className={`grid grid-cols-12 border-b ${d} cursor-pointer transition-colors duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset`}
              >
                <div className="col-span-12 md:col-span-7 p-8 md:p-12 lg:p-14 flex flex-col justify-start gap-8 min-h-[300px] md:min-h-[400px]">
                  <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">01</span>
                  <div>
                    {firstTagName(featured) && (
                      <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-5">
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                        {firstTagName(featured)}
                      </p>
                    )}
                    <h2 className="font-bold text-[2rem] md:text-[2.5rem] lg:text-[3.25rem] leading-[1.05] tracking-tight text-gray-950 dark:text-gray-50 mb-6 max-w-[22ch]">
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p className="text-[14px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[48ch]">
                        {featured.excerpt}
                      </p>
                    )}
                  </div>
                </div>
                <div className="col-span-12 md:col-span-5 flex items-end overflow-hidden pt-10">
                  {featured.coverImage?.asset?._ref && (
                    <SanityImage
                      id={featured.coverImage.asset._ref}
                      alt={featured.coverImage.alt ?? ''}
                      width={800}
                      hotspot={featured.coverImage.hotspot ?? undefined}
                      crop={featured.coverImage.crop ?? undefined}
                      className="w-full h-auto block"
                    />
                  )}
                </div>
              </Link>
            )}

            {/* Row 2: Three equal columns — CTA fills any empty slots */}
            {tripleRow.length > 0 && (
              <div className={`grid grid-cols-12 ${ctaPlacement === 'inLandscape' || overflow.length > 0 ? `border-b ${d}` : ''}`}>
                {tripleRow.map((post, i) => {
                  const isLast = i === tripleRow.length - 1
                  const needsRightBorder = !isLast || ctaPlacement === 'inTriple'
                  return (
                    <Link
                      key={post._id}
                      href={`/posts/${post.slug}`}
                      className={`col-span-12 md:col-span-4 flex flex-col cursor-pointer transition-colors duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset ${
                        needsRightBorder ? `border-b ${d} md:border-b-0 md:border-r` : `border-b md:border-b-0 ${d}`
                      }`}
                    >
                      <div className="p-6 lg:p-8 flex flex-col justify-start gap-6 flex-1">
                        <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">
                          {String(i + 2).padStart(2, '0')}
                        </span>
                        <div>
                          {firstTagName(post) && (
                            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-4">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                              {firstTagName(post)}
                            </p>
                          )}
                          <h3 className="font-bold text-[1.15rem] leading-tight tracking-tight text-gray-950 dark:text-gray-50 mb-3">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                        </div>
                      </div>
                      {post.coverImage?.asset?._ref && (
                        <SanityImage
                          id={post.coverImage.asset._ref}
                          alt={post.coverImage.alt ?? ''}
                          width={600}
                          hotspot={post.coverImage.hotspot ?? undefined}
                          crop={post.coverImage.crop ?? undefined}
                          className="w-full h-auto block"
                        />
                      )}
                    </Link>
                  )
                })}

                {/* CTA absorbs empty column slots when triple row is not full */}
                {ctaPlacement === 'inTriple' && (
                  <div className={`col-span-12 md:col-span-${ctaColSpan} flex flex-col`}>
                    <div className="p-6 lg:p-8 flex flex-col justify-between h-full min-h-[200px]">
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">
                        {activeTagName ?? 'All articles'}
                      </span>
                      <div>
                        <p className="font-bold text-[3.5rem] lg:text-[4.5rem] leading-none tracking-tight text-gray-950 dark:text-gray-50 mb-5">
                          {String(posts.length).padStart(2, '0')}
                        </p>
                        {activeTagName ? (
                          <Link
                            href="/posts"
                            className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 transition-colors"
                          >
                            View all articles
                            <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </Link>
                        ) : (
                          <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">Articles</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Row 3: Landscape (8) + CTA (4 or 12 if no landscape) */}
            {ctaPlacement === 'inLandscape' && (
              <div className={`grid grid-cols-12 ${overflow.length > 0 ? `border-b ${d}` : ''}`}>
                {landscape && (
                  <Link
                    href={`/posts/${landscape.slug}`}
                    className={`col-span-12 md:col-span-8 flex flex-col md:flex-row cursor-pointer transition-colors duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset border-b ${d} md:border-b-0 md:border-r`}
                  >
                    <div className="p-6 lg:p-8 xl:p-10 flex flex-col justify-start gap-6 flex-1">
                      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">05</span>
                      <div>
                        {firstTagName(landscape) && (
                          <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-4">
                            <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                            {firstTagName(landscape)}
                          </p>
                        )}
                        <h3 className="font-bold text-[1.35rem] leading-tight tracking-tight text-gray-950 dark:text-gray-50 mb-3 max-w-[28ch]">
                          {landscape.title}
                        </h3>
                        {landscape.excerpt && (
                          <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-[42ch]">
                            {landscape.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                    {landscape.coverImage?.asset?._ref && (
                      <div className="md:w-[45%] flex-shrink-0 flex items-end overflow-hidden pt-10">
                        <SanityImage
                          id={landscape.coverImage.asset._ref}
                          alt={landscape.coverImage.alt ?? ''}
                          width={700}
                          hotspot={landscape.coverImage.hotspot ?? undefined}
                          crop={landscape.coverImage.crop ?? undefined}
                          className="w-full h-auto block"
                        />
                      </div>
                    )}
                  </Link>
                )}

                {/* CTA: col-4 beside landscape, or col-12 when there's no landscape post */}
                <div className={`col-span-12 md:col-span-${ctaColSpan} flex flex-col`}>
                  <div className="p-6 lg:p-8 flex flex-col justify-between h-full min-h-[200px]">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">
                      {activeTagName ?? 'All articles'}
                    </span>
                    <div>
                      <p className="font-bold text-[3.5rem] lg:text-[4.5rem] leading-none tracking-tight text-gray-950 dark:text-gray-50 mb-5">
                        {String(posts.length).padStart(2, '0')}
                      </p>
                      {activeTagName ? (
                        <Link
                          href="/posts"
                          className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 transition-colors"
                        >
                          View all articles
                          <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      ) : (
                        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">Articles</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Standalone CTA: only the featured post exists */}
            {ctaPlacement === 'standalone' && (
              <div className="grid grid-cols-12">
                <div className="col-span-12 flex flex-col">
                  <div className="p-6 lg:p-8 flex flex-col justify-between min-h-[160px]">
                    <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">
                      {activeTagName ?? 'All articles'}
                    </span>
                    <div>
                      <p className="font-bold text-[3.5rem] lg:text-[4.5rem] leading-none tracking-tight text-gray-950 dark:text-gray-50 mb-5">
                        {String(posts.length).padStart(2, '0')}
                      </p>
                      {activeTagName ? (
                        <Link
                          href="/posts"
                          className="group inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 hover:text-gray-950 dark:hover:text-gray-50 transition-colors"
                        >
                          View all articles
                          <svg className="w-3 h-3 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        </Link>
                      ) : (
                        <p className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">Articles</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Overflow rows: posts 6+ in 3-column rows */}
            {overflowRows.map((rowPosts, rowIndex) => {
              const isLastRow = rowIndex === overflowRows.length - 1
              return (
                <div
                  key={rowIndex}
                  className={`grid grid-cols-12 ${!isLastRow ? `border-b ${d}` : ''}`}
                >
                  {rowPosts.map((post, i) => {
                    const isLastInRow = i === rowPosts.length - 1
                    const globalIndex = 5 + rowIndex * 3 + i
                    return (
                      <Link
                        key={post._id}
                        href={`/posts/${post.slug}`}
                        className={`col-span-12 md:col-span-4 flex flex-col cursor-pointer transition-colors duration-200 ease-out hover:bg-gray-50 dark:hover:bg-gray-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset ${
                          !isLastInRow ? `border-b ${d} md:border-b-0 md:border-r` : `border-b md:border-b-0 ${d}`
                        }`}
                      >
                        <div className="p-6 lg:p-8 flex flex-col justify-start gap-6 flex-1">
                          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400">
                            {String(globalIndex + 1).padStart(2, '0')}
                          </span>
                          <div>
                            {firstTagName(post) && (
                              <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-4">
                                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                                {firstTagName(post)}
                              </p>
                            )}
                            <h3 className="font-bold text-[1.15rem] leading-tight tracking-tight text-gray-950 dark:text-gray-50 mb-3">
                              {post.title}
                            </h3>
                            {post.excerpt && (
                              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                                {post.excerpt}
                              </p>
                            )}
                          </div>
                        </div>
                        {post.coverImage?.asset?._ref && (
                          <SanityImage
                            id={post.coverImage.asset._ref}
                            alt={post.coverImage.alt ?? ''}
                            width={600}
                            hotspot={post.coverImage.hotspot ?? undefined}
                            crop={post.coverImage.crop ?? undefined}
                            className="w-full h-auto block"
                          />
                        )}
                      </Link>
                    )
                  })}
                </div>
              )
            })}

          </div>
        ) : (
          <p className="text-gray-500 font-mono text-sm">
            No posts found{tag ? ' for this tag' : ''}.
          </p>
        )}
      </div>
    </>
  )
}
