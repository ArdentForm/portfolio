import { stegaClean } from '@sanity/client/stega'
import {backgroundVariants, tileOverlay} from '@/app/components/backgrounds'

type ContentBlockGridProps = {
  block: {
    heading?: string
    intro?: string
    background?: 'none' | 'tint' | 'tile' | 'gradient'
    items?: Array<{
      title?: string
      body?: string
    }>
  }
}


export default function ContentBlockGrid({
  block,
}: ContentBlockGridProps) {
  const { heading, intro, background = 'none', items } = block
  const cleanBackground = stegaClean(background)

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }`}
    >
      {cleanBackground === 'tile' && <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <section className="px-0 py-16 sm:py-20 lg:py-24">
          {/* Header row: stacked on mobile, 2-col on sm and lg */}
          <div className="mb-14 sm:grid sm:grid-cols-2 sm:gap-x-12 sm:items-start lg:gap-x-8">
            {heading && (
              <h2 className="font-normal text-4xl lg:text-5xl leading-tight mb-8 sm:mb-0">
                {heading}
              </h2>
            )}

            {intro && (
              <p className="text-xl sm:text-xl lg:text-2xl leading-relaxed">
                {intro}
              </p>
            )}
          </div>

          {/* grid: 1 col mobile, 2 col sm+, right-half only on desktop */}
          <div className="lg:grid lg:grid-cols-2">
            {/* Cards container pushed to col 2 on desktop */}
            {items && items.length > 0 && (
              <div className="lg:col-start-2 grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-x-12 sm:gap-y-12 lg:pl-4">
                {items.map((item, index) => (
                  <div key={index}>
                    {item.title && (
                      <h3 className="text-base font-medium mb-3">{item.title}</h3>
                    )}
                    {item.body && (
                      <p className="text-sm leading-relaxed">{item.body}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
