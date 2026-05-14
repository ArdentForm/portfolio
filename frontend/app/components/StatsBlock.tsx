import {stegaClean} from '@sanity/client/stega'
import {backgroundVariants, tileOverlay} from '@/app/components/backgrounds'

type StatItem = {
  value?: string
  label?: string
}

type StatsBlockProps = {
  block: {
    items?: StatItem[]
    background?: 'none' | 'tint' | 'tile' | 'gradient'
  }
}

export default function StatsBlock({block}: StatsBlockProps) {
  const {items, background = 'none'} = block
  const cleanBackground = stegaClean(background)

  if (!items || items.length === 0) return null

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }`}
    >
      {cleanBackground === 'tile' && (
        <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />
      )}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-16 sm:py-20 lg:py-24">
        <dl className="flex flex-wrap justify-center gap-y-12 gap-x-12 sm:gap-x-20 lg:gap-x-28">
          {items.map((item, index) => (
            <div key={index} className="flex flex-col items-center gap-2 text-center">
              <dt className="text-xs font-mono tracking-widest uppercase text-gray-400 order-2">
                {item.label}
              </dt>
              <dd className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter leading-none order-1">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  )
}
