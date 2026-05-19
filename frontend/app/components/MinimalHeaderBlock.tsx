import MinimalHeader from '@/app/components/MinimalHeader'

type MinimalHeaderBlockProps = {
  block: {
    label?: string
    meta?: string
    heading?: string
  }
}

export default function MinimalHeaderBlock({block}: MinimalHeaderBlockProps) {
  return (
    <MinimalHeader
      label={block.label}
      meta={block.meta}
      heading={block.heading}
    />
  )
}
