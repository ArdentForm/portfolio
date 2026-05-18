import {Navigation} from '@/app/components/Navigation'
import {client} from '@/sanity/lib/client'
import {NAVIGATION_QUERY} from '@/sanity/lib/queries'

export default async function Header() {
  const navigation = await client.fetch(
    NAVIGATION_QUERY,
    {},
    { cache: 'no-store', next: { revalidate: 0 } },
  )

  return (
    <Navigation
      links={navigation?.links ?? []}
    />
  )
}
