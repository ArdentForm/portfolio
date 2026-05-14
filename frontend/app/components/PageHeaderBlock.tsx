import PageHeader from '@/app/components/PageHeader'
import { type PortableTextBlock } from 'next-sanity'

type PageHeaderBlockProps = {
  block: {
    heading?: PortableTextBlock[]
    subheading?: string
  }
}

export default function PageHeaderBlock({ block }: PageHeaderBlockProps) {
  if (!block.heading?.length) return null
  return (
    <PageHeader
      heading={block.heading}
      subheading={block.subheading ?? undefined}
    />
  )
}
