import {sanityFetch} from '@/sanity/lib/live'
import {morePostsQuery} from '@/sanity/lib/queries'
import PostCard from '@/app/components/PostCard'

type MorePostResult = Parameters<typeof PostCard>[0]['post']

export const MorePosts = async ({skip, limit}: {skip: string; limit: number}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const {data: posts} = await sanityFetch({query: morePostsQuery, params: {skip, limit}}) as any

  if (!posts || posts.length === 0) {
    return null
  }

  return (
    <div>
      <p className="text-xs font-mono tracking-widest uppercase text-gray-400 mb-8">More posts</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {posts.map((post: MorePostResult) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}
