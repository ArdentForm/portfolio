import FeaturedPosts from '@/app/components/FeaturedPosts'

type FeaturedPostsBlockProps = {
  block: any
}

export default function FeaturedPostsBlock({block}: FeaturedPostsBlockProps) {
  return <FeaturedPosts block={block} />
}
