import HeroSplitImageRight from '@/app/components/HeroSplitImageRight'
import {type BackgroundVariant} from '@/app/components/backgrounds'

type Props = {
  block: {
    _type: 'heroSplitImageRight'
    _key: string
    heading?: string | null
    background?: string | null
    contentAlignment?: string | null
    images?: Array<{
      image?: string | null
      alt?: string | null
      caption?: string | null
    }> | null
  }
}

export default function HeroSplitImageRightBlock({ block }: Props) {
  const images = block.images ?? []
  return (
    <HeroSplitImageRight
      heading={block.heading ?? ''}
      background={(block.background ?? 'none') as BackgroundVariant}
      contentAlignment={block.contentAlignment ?? undefined}
      images={[
        { image: images[0]?.image ?? '', alt: images[0]?.alt ?? '', caption: images[0]?.caption ?? undefined },
        { image: images[1]?.image ?? '', alt: images[1]?.alt ?? '', caption: images[1]?.caption ?? undefined },
        { image: images[2]?.image ?? '', alt: images[2]?.alt ?? '', caption: images[2]?.caption ?? undefined },
      ]}
    />
  )
}