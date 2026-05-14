import type {Metadata} from 'next'

import PageBuilderPage from '@/app/components/PageBuilder'
import {sanityFetch} from '@/sanity/lib/live'
import {homepageQuery, settingsQuery} from '@/sanity/lib/queries'
import {GetPageQueryResult} from '@/sanity.types'

export async function generateMetadata(): Promise<Metadata> {
  const [{data: homepage}, {data: settings}] = await Promise.all([
    sanityFetch({query: homepageQuery, stega: false}),
    sanityFetch({query: settingsQuery, stega: false}),
  ])

  return {
    title: homepage?.seoTitle ?? settings?.title,
    description: homepage?.seoDescription,
    openGraph: settings?.ogImage?.asset?._ref
      ? {
          images: [{url: settings.ogImage.asset._ref}],
        }
      : undefined,
  }
}

export default async function Page() {
  const {data: homepage} = await sanityFetch({query: homepageQuery})

  return <PageBuilderPage page={homepage as unknown as GetPageQueryResult} />
}
