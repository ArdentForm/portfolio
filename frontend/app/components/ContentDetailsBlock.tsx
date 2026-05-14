import ContentDetails from '@/app/components/ContentDetails'

type ContentDetailsBlockProps = {
  block: any
}

export default function ContentDetailsBlock({ block }: ContentDetailsBlockProps) {
  return <ContentDetails block={block} />
}
