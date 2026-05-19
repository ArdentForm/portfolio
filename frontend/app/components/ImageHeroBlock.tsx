import ImageHero from '@/app/components/ImageHero'

type ImageHeroBlockProps = {
  block: {
    _type: 'imageHero'
    _key: string
    image?: string | null
    alt?: string | null
    subtitle?: string | null
    index?: string | null
    heading?: string | null
    lightPanel?: boolean | null
  }
}

export default function ImageHeroBlock({block}: ImageHeroBlockProps) {
  if (!block.image) return null
  return (
    <ImageHero
      image={block.image}
      alt={block.alt ?? ''}
      subtitle={block.subtitle ?? undefined}
      index={block.index ?? undefined}
      heading={block.heading ?? undefined}
      lightPanel={block.lightPanel ?? false}
    />
  )
}
