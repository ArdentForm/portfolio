import {Navigation} from '@/app/components/Navigation'
import {sanityFetch} from '@/sanity/lib/live'
import {NAVIGATION_QUERY} from '@/sanity/lib/queries'

export default async function Header() {
  const {data: navigation} = await sanityFetch({
    query: NAVIGATION_QUERY,
  })

  return (
    <Navigation
      links={navigation?.links ?? []}
    />
  )
}