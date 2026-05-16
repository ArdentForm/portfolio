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
      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-8">More posts</p>
      <div className="border-l border-t border-gray-200 dark:border-gray-700">
        <div className="grid grid-cols-1 sm:grid-cols-2">
          {posts.map((post: MorePostResult, index: number) => (
            <PostCard key={post._id} post={post} index={index} />
          ))}
        </div>
      </div>
    </div>
  )
}
