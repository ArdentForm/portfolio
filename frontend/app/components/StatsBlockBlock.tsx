import StatsBlock from '@/app/components/StatsBlock'

type StatsBlockBlockProps = {
  block: any
}

export default function StatsBlockBlock({block}: StatsBlockBlockProps) {
  return <StatsBlock block={block} />
}
