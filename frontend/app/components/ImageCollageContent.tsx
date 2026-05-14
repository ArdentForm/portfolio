import { stegaClean } from '@sanity/client/stega'
import { backgroundVariants, tileOverlay } from '@/app/components/backgrounds'
import { PortableTextBlock } from 'next-sanity'
import PortableText from '@/app/components/PortableText'

type ImageCollageContentProps = {
  block: {
    heading?: string
    label?: string
    year?: string
    description?: PortableTextBlock[]
    background?: 'none' | 'tint' | 'tile' | 'gradient'
  }
}

export default function ImageCollageContent({ block }: ImageCollageContentProps) {
  const { heading, label, year, description, background = 'none' } = block
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="flex flex-col gap-2">
              {label && <p className="font-mono text-xs uppercase tracking-[0.12em] text-gray-500">{label}</p>}
              {heading && <p className="text-xl font-medium tracking-tight">{heading}</p>}
            </div>

            <div>
              {year && <p className="font-mono text-xs uppercase tracking-[0.12em] text-gray-500">{year}</p>}
            </div>

            {description ? (
              <div className="sm:col-span-2 lg:col-span-2 text-sm leading-relaxed">
                <PortableText value={description} />
              </div>
            ) : (
              <div className="sm:col-span-2 lg:col-span-2" />
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
