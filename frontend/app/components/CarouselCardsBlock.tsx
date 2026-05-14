import CarouselCards from '@/app/components/CarouselCards'

type CarouselCardsBlockProps = {
  block: any
}

export default function CarouselCardsBlock({ block }: CarouselCardsBlockProps) {
  return <CarouselCards block={block} />
}
