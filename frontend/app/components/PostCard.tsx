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
  index?: number
}

export default function PostCard({post, index}: PostCardProps) {
  const {title, slug, excerpt, coverImage, date, tags} = post
  const firstTag = tags?.[0]
  const indexLabel = index !== undefined ? String(index + 1).padStart(2, '0') : undefined

  return (
    <article className="border-r border-b border-gray-200 dark:border-gray-700 flex flex-col cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 ease-out">
      <Link
        href={`/posts/${slug}`}
        className="flex flex-col h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
      >
        <div className="p-6 lg:p-8 flex flex-col flex-1 gap-6">
          {indexLabel && (
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400">
              {indexLabel}
            </span>
          )}
          <div>
            {firstTag?.name && (
              <p className="flex items-center gap-1.5 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-4">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                {firstTag.name}
              </p>
            )}
            {title && (
              <h3 className="font-bold text-[1.15rem] leading-tight tracking-tight text-gray-950 dark:text-gray-50 mb-3">
                {title}
              </h3>
            )}
            {excerpt && (
              <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">
                {excerpt}
              </p>
            )}
            {date && (
              <time dateTime={date} className="mt-4 text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 block">
                <DateComponent dateString={date} />
              </time>
            )}
          </div>
        </div>
        {coverImage?.asset?._ref && (
          <SanityImage
            id={coverImage.asset._ref}
            alt={coverImage.alt ?? ''}
            width={600}
            hotspot={coverImage.hotspot ?? undefined}
            crop={coverImage.crop ?? undefined}
            mode="cover"
            className="w-full max-h-44 h-auto object-contain object-bottom block"
          />
        )}
      </Link>
    </article>
  )
}
