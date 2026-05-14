import AbstractCardsCarousel from '@/app/components/AbstractCardsCarousel'

type AbstractCardsCarouselBlockProps = {
  block: any
}

export default function AbstractCardsCarouselBlock({block}: AbstractCardsCarouselBlockProps) {
  return <AbstractCardsCarousel block={block} />
}
