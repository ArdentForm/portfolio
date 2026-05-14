import ContentBlockGrid from '@/app/components/ContentBlockGrid'

type ContentBlockGridBlockProps = {
  block: any
}

export default function ContentBlockGridBlock({ block }: ContentBlockGridBlockProps) {
  return <ContentBlockGrid block={block} />
}
