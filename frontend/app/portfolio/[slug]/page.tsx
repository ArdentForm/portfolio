import type {Metadata, ResolvingMetadata} from 'next'
import {notFound, redirect} from 'next/navigation'
import {cookies} from 'next/headers'

import PageBuilderPage from '@/app/components/PageBuilder'
import PortfolioNavigation from '@/app/components/PortfolioNavigation'
import {sanityFetch} from '@/sanity/lib/live'
import {
  adjacentPortfolioProjectsQuery,
  portfolioProjectPagesSlugs,
  portfolioProjectQuery,
  portfolioProtectionQuery,
} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'
import {resolveOpenGraphImage} from '@/sanity/lib/utils'
import {PORTFOLIO_COOKIE, isValidSessionToken} from '@/lib/portfolioAuth'

type Props = {
  params: Promise<{slug: string}>
}

export async function generateStaticParams() {
  const {data} = await sanityFetch({
    query: portfolioProjectPagesSlugs,
    perspective: 'published',
    stega: false,
  })
  return data
}

export async function generateMetadata(
  props: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params
  const {data: project} = await sanityFetch({
    query: portfolioProjectQuery,
    params,
    stega: false,
  })
  const previousImages = (await parent).openGraph?.images || []
  const ogImage = resolveOpenGraphImage(project?.coverImage)

  return {
    title: project?.seoTitle ?? project?.title,
    description: project?.seoDescription ?? project?.excerpt,
    openGraph: {
      images: ogImage ? [ogImage, ...previousImages] : previousImages,
    },
  } satisfies Metadata
}

export default async function PortfolioProjectPage(props: Props) {
  const params = await props.params

  const [{data: protection}, {data: project}] = await Promise.all([
    sanityFetch({query: portfolioProtectionQuery, stega: false}),
    sanityFetch({query: portfolioProjectQuery, params}),
  ])

  if (protection?.passwordProtected) {
    const cookieStore = await cookies()
    const token = cookieStore.get(PORTFOLIO_COOKIE)?.value
    if (!isValidSessionToken(token)) {
      redirect(`/portfolio/unlock?from=/portfolio/${params.slug}`)
    }
  }

  if (!project?._id) {
    return notFound()
  }

  const {data: adjacent} = await sanityFetch({
    query: adjacentPortfolioProjectsQuery,
    params: {id: project._id, orderRank: project.orderRank ?? ''},
  })

  return (
    <>
      <PageBuilderPage page={project as unknown as GetPageQueryResult} />
      <PortfolioNavigation prev={adjacent?.prev} next={adjacent?.next} />
    </>
  )
}
