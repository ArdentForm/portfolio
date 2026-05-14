import type {Metadata} from 'next'
import Link from 'next/link'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

import PageBuilderPage from '@/app/components/PageBuilder'
import PortfolioCard from '@/app/components/PortfolioCard'
import {sanityFetch} from '@/sanity/lib/live'
import {
  allPortfolioProjectsQuery,
  allPortfolioTagsQuery,
  portfolioOverviewQuery,
  portfolioProjectsByTagQuery,
} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'
import {PORTFOLIO_COOKIE, isValidSessionToken} from '@/lib/portfolioAuth'

type PortfolioTag = {slug: string | null; name: string | null}

type PortfolioProjectSummary = {
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
  tags?: PortfolioTag[] | null
}

type Props = {
  searchParams: Promise<{tag?: string}>
}

export async function generateMetadata(): Promise<Metadata> {
  const {data: overview} = await sanityFetch({query: portfolioOverviewQuery, stega: false})
  return {
    title: overview?.seoTitle ?? 'Portfolio',
    description: overview?.seoDescription ?? undefined,
  }
}

export default async function PortfolioPage({searchParams}: Props) {
  const {tag} = await searchParams

  const [{data: overview}, {data: tags}, {data: projects}] = await Promise.all([
    sanityFetch({query: portfolioOverviewQuery}),
    sanityFetch({query: allPortfolioTagsQuery}),
    tag
      ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (sanityFetch as any)({query: portfolioProjectsByTagQuery, params: {tag}})
      : sanityFetch({query: allPortfolioProjectsQuery}),
  ])

  if (overview?.passwordProtected) {
    const cookieStore = await cookies()
    const token = cookieStore.get(PORTFOLIO_COOKIE)?.value
    if (!isValidSessionToken(token)) {
      redirect('/portfolio/unlock?from=/portfolio')
    }
  }

  const hasIntroBlocks = overview?.pageBuilder && overview.pageBuilder.length > 0
  const projectList = (projects ?? []) as PortfolioProjectSummary[]
  const tagList = (tags ?? []) as PortfolioTag[]

  return (
    <>
      {hasIntroBlocks && (
        <PageBuilderPage page={overview as unknown as GetPageQueryResult} />
      )}

      {/* Editorial page header */}
      {!hasIntroBlocks && (
        <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28">
          {/* Running strip: label left, count right */}
          <div className="flex items-baseline justify-between mb-4">
            <p className="font-mono text-xs tracking-widest uppercase text-gray-400 dark:text-gray-600">
              Selected Work
            </p>
            {projectList.length > 0 && (
              <p className="font-mono text-xs tracking-widest uppercase text-gray-400 dark:text-gray-600">
                {String(projectList.length).padStart(2, '0')} Projects
              </p>
            )}
          </div>

          {/* Rule */}
          <div className="border-t border-gray-200 dark:border-gray-800" />

          {/* Title + tag filters — stacked on mobile, side-by-side on lg */}
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 pt-8 pb-14 lg:pb-20">
            <h1
              className="text-[clamp(3rem,7vw,5.5rem)] leading-[1.0] tracking-[-0.02em]"
              style={{textWrap: 'balance'} as React.CSSProperties}
            >
              Case Studies
            </h1>

            {/* Flat text tag filters */}
            {tagList.length > 0 && (
              <nav className="flex items-center flex-wrap gap-x-6 gap-y-2 pb-1" aria-label="Filter by category">
                <Link
                  href="/portfolio"
                  className={`group inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
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
                {tagList.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/portfolio?tag=${t.slug}`}
                    className={`group inline-flex items-center gap-1.5 font-mono text-xs tracking-widest uppercase transition-colors ${
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
      )}

      {/* Project grid */}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 pb-24 lg:pb-36">
        {projectList.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14 lg:gap-x-8 lg:gap-y-20">
            {projectList.map((project, index) => (
              <PortfolioCard key={project._id} project={project} hero={index === 0} />
            ))}
          </div>
        ) : (
          <p className="font-mono text-xs tracking-widest uppercase text-gray-400 dark:text-gray-600">
            No projects found{tag ? ' for this tag' : ''}.
          </p>
        )}
      </div>
    </>
  )
}
