import Image from 'next/image'
import { stegaClean } from '@sanity/client/stega'
import { backgroundVariants, tileOverlay } from '@/app/components/backgrounds'

type ImageItem = {
  image: string
  alt: string
}

type ImageCollageProps = {
  block: {
    images?: ImageItem[]
    background?: 'none' | 'tint' | 'tile' | 'gradient'
  }
}

export default function ImageCollage({ block }: ImageCollageProps) {
  const { images, background = 'none' } = block
  const cleanBackground = stegaClean(background)

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }`}
    >
      {cleanBackground === 'tile' && <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <section className="py-12">
          {images && images.length === 6 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
              {/* Left column */}
              <div className="flex flex-col gap-1">
                <div className="rounded-sm aspect-video w-full overflow-hidden">
                  <Image
                    src={images[0].image}
                    alt={images[0].alt}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div className="rounded-sm aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={images[1].image}
                      alt={images[1].alt}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-sm aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={images[2].image}
                      alt={images[2].alt}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Right column */}
              <div className="flex flex-col gap-1">
                <div className="grid grid-cols-2 gap-1">
                  <div className="rounded-sm aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={images[3].image}
                      alt={images[3].alt}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="rounded-sm aspect-[4/3] w-full overflow-hidden">
                    <Image
                      src={images[4].image}
                      alt={images[4].alt}
                      width={400}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="rounded-sm aspect-video w-full overflow-hidden">
                  <Image
                    src={images[5].image}
                    alt={images[5].alt}
                    width={800}
                    height={450}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
