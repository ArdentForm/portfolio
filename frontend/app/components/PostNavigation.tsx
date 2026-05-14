import Link from 'next/link'

type AdjacentPost = {
  title: string
  slug: string
}

type PostNavigationProps = {
  prev?: AdjacentPost | null
  next?: AdjacentPost | null
}

export default function PostNavigation({prev, next}: PostNavigationProps) {
  if (!prev && !next) return null

  return (
    <div className="border-t border-gray-200 dark:border-gray-800">
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 divide-x divide-gray-200 dark:divide-gray-800">
          <div className="py-10 pr-8 sm:pr-12">
            {prev ? (
              <Link
                href={`/posts/${prev.slug}`}
                className="group flex flex-col gap-3 focus-visible:outline-none"
              >
                <span className="font-mono text-xs tracking-widest uppercase text-gray-400 group-hover:text-brand transition-colors duration-200">
                  ← Previous
                </span>
                <span className="text-lg sm:text-xl font-light tracking-tight text-gray-900 dark:text-white group-hover:text-brand transition-colors duration-200 line-clamp-2">
                  {prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>

          <div className="py-10 pl-8 sm:pl-12 text-right">
            {next ? (
              <Link
                href={`/posts/${next.slug}`}
                className="group flex flex-col gap-3 focus-visible:outline-none items-end"
              >
                <span className="font-mono text-xs tracking-widest uppercase text-gray-400 group-hover:text-brand transition-colors duration-200">
                  Next →
                </span>
                <span className="text-lg sm:text-xl font-light tracking-tight text-gray-900 dark:text-white group-hover:text-brand transition-colors duration-200 line-clamp-2">
                  {next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
