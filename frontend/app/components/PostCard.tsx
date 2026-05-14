import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'
import DateComponent from '@/app/components/Date'

type PostCardProps = {
  post: {
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
    tags?: Array<{name: string | null; slug: string | null}> | null
  }
}

export default function PostCard({post}: PostCardProps) {
  const {title, slug, excerpt, coverImage, date, tags} = post
  const firstTag = tags?.[0]

  return (
    <article className="h-full">
      <Link
        href={`/posts/${slug}`}
        className="bg-gray-200 dark:bg-gray-900 rounded-2xl p-4 sm:p-6 flex flex-col h-full hover:brightness-95 dark:hover:brightness-125 transition-[filter] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden flex flex-col flex-1">
          <div className="p-5 sm:p-6 flex-1 flex flex-col">
            {firstTag?.name && (
              <p className="flex items-center gap-1.5 text-xs text-gray-400 font-bold tracking-widest uppercase mb-3">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
                {firstTag.name}
              </p>
            )}
            {title && (
              <h3 className="text-xl font-bold leading-snug mb-2">{title}</h3>
            )}
            {excerpt && (
              <p className="text-sm leading-relaxed text-gray-500 dark:text-gray-400 line-clamp-3 flex-1">
                {excerpt}
              </p>
            )}
            {date && (
              <time dateTime={date} className="mt-4 text-xs font-mono text-gray-400 block">
                <DateComponent dateString={date} />
              </time>
            )}
          </div>
          {coverImage?.asset?._ref && (
            <SanityImage
              id={coverImage.asset._ref}
              alt={coverImage.alt ?? ''}
              width={600}
              hotspot={coverImage.hotspot ?? undefined}
              crop={coverImage.crop ?? undefined}
              mode="cover"
              className="w-full h-auto block"
            />
          )}
        </div>
      </Link>
    </article>
  )
}
