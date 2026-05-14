import Link from 'next/link'
import SanityImage from '@/app/components/SanityImage'

type PortfolioCardProps = {
  project: {
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
    client?: string | null
    year?: string | null
    tags?: Array<{name: string | null; slug: string | null}> | null
  }
  hero?: boolean
}

export default function PortfolioCard({project, hero = false}: PortfolioCardProps) {
  const {title, slug, excerpt, coverImage, client, year, tags} = project
  const firstTag = tags?.[0]

  return (
    <article className={hero ? 'md:col-span-2' : ''}>
      <Link
        href={`/portfolio/${slug}`}
        className="group block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
      >
        {/* Image */}
        <div className="overflow-hidden aspect-video bg-gray-100 dark:bg-gray-900">
          {coverImage?.asset?._ref ? (
            <SanityImage
              id={coverImage.asset._ref}
              alt={coverImage.alt ?? ''}
              width={hero ? 1200 : 600}
              hotspot={coverImage.hotspot ?? undefined}
              crop={coverImage.crop ?? undefined}
              mode="cover"
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 dark:bg-gray-800" />
          )}
        </div>

        {/* Thin structural rule between image and metadata */}
        <div className="border-t border-gray-200 dark:border-gray-800" />

        {/* Metadata */}
        <div className="pt-3 pb-1">
          {(client || year || firstTag) && (
            <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400 dark:text-gray-600 mb-2">
              {client && <span>{client}</span>}
              {client && year && (
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
              )}
              {year && <span>{year}</span>}
              {(client || year) && firstTag?.name && (
                <span className="text-gray-300 dark:text-gray-700" aria-hidden="true">·</span>
              )}
              {firstTag?.name && <span>{firstTag.name}</span>}
            </p>
          )}

          {title && (
            <h3 className={`leading-tight tracking-tight ${hero ? 'text-2xl sm:text-3xl' : 'text-xl'}`}>
              {title}
            </h3>
          )}

          {excerpt && (
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
              {excerpt}
            </p>
          )}
        </div>
      </Link>
    </article>
  )
}
