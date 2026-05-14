import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import {backgroundVariants, tileOverlay} from '@/app/components/backgrounds'

type Card = {
  image: string
  alt: string
  caption?: string
}

type HeroSplitImageRightProps = {
  heading: string
  images: [Card, Card, Card]
  background?: 'none' | 'tint' | 'tile' | 'gradient'
  contentAlignment?: string
}


export default function HeroSplitImageRight({
  heading,
  images,
  background = 'none',
  contentAlignment,
}: HeroSplitImageRightProps) {
  const cleanBackground = stegaClean(background)
  const isImageFirst = stegaClean(contentAlignment) === 'imageFirst'

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }`}
    >
      {cleanBackground === 'tile' && <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12">
        <section className="p-6 lg:grid lg:grid-cols-4 lg:gap-8 lg:items-start lg:p-0">

        <h2
          className={`text-3xl font-normal leading-snug text-pretty mb-8 lg:text-2xl ${
            isImageFirst
              ? 'lg:col-start-3 lg:col-span-1 lg:row-start-1 lg:text-left'
              : 'lg:col-start-2 lg:col-span-1 lg:row-start-1 lg:text-right'
          } lg:mb-0 lg:pt-1`}
        >
          {heading}
        </h2>

        <div
          className={`flex flex-col gap-10 sm:grid sm:grid-cols-3 sm:gap-1 ${
            isImageFirst ? 'lg:col-start-1 lg:col-span-2 lg:row-start-1' : 'lg:col-start-3 lg:col-span-2 lg:row-start-1'
          }`}
        >
          {images.map((card, i) => (
            <div key={i}>
              <div className="relative w-full rounded-sm overflow-hidden aspect-[3/4]">
                <Image
                  src={card.image}
                  alt={card.alt}
                  fill
                  className="object-cover rounded-sm"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
                />
              </div>
              {card.caption && (
                <p className="text-xs mt-4 leading-relaxed pr-6">
                  {card.caption}
                </p>
              )}
            </div>
          ))}
        </div>
        </section>
      </div>
    </div>
  )
}
