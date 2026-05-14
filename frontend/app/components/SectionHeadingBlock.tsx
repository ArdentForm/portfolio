import SectionHeading from '@/app/components/SectionHeading'

type SectionHeadingBlockProps = {
  block: any
}

export default function SectionHeadingBlock({block}: SectionHeadingBlockProps) {
  return <SectionHeading block={block} />
}
