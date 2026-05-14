import { stegaClean } from '@sanity/client/stega'
import {backgroundVariants, tileOverlay} from '@/app/components/backgrounds'
import { type PortableTextBlock } from 'next-sanity'
import PortableText from '@/app/components/PortableText'

type ContentDetailsProps = {
  block: {
    listItemsLabel?: string
    items?: Array<{
      title?: string
    }>
    mainContentLabel?: string
    body?: PortableTextBlock[]
    background?: 'none' | 'tint' | 'tile' | 'gradient'
  }
}


export default function ContentDetails({ block }: ContentDetailsProps) {
  const { items, body, background = 'none', listItemsLabel = 'Services', mainContentLabel = 'Challenge' } = block
  const cleanBackground = stegaClean(background)

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }`}
    >
      {cleanBackground === 'tile' && <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <section className="py-12 sm:py-14">
          <div className="w-full lg:w-[62%] lg:mx-auto">
            {/* List item block */}
            {items && items.length > 0 && (
              <div className="mb-12 lg:mb-16">
                <p className="text-xs tracking-widest uppercase font-medium mb-6">{listItemsLabel}</p>
                <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-2">
                  {items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 py-4 border-b text-sm">
                      <span className="text-gray-400">—</span> {item.title}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Main content block */}
            {body && (
              <div>
                <p className="text-xs tracking-widest uppercase font-medium mb-5">{mainContentLabel}</p>
                <div className="text-sm sm:text-base leading-relaxed max-w-none">
                  <PortableText value={body as PortableTextBlock[]} />
                </div>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
