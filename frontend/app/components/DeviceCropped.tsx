import { stegaClean } from '@sanity/client/stega'
import {backgroundVariants, tileOverlay} from '@/app/components/backgrounds'

type DeviceCroppedProps = {
  block: {
    label?: string
    heading?: string
    background?: string
    contentAlignment?: string
    mediaType?: 'image' | 'video'
    cropMode?: 'cropped' | 'full'
    image?: {
      image?: {asset?: {url?: string}}
      alt?: string
    }
    videoUrl?: string
    items?: Array<{
      title?: string
      body?: string
    }>
  }
}

const WARM_VOID = 'oklch(5% 0.004 50)'

export default function DeviceCropped({block}: DeviceCroppedProps) {
  const cleanBackground = stegaClean(block.background ?? 'none')
  const isImageFirst = stegaClean(block.contentAlignment) === 'imageFirst'
  const isVideo = stegaClean(block.mediaType) === 'video'
  const isCropped = stegaClean(block.cropMode ?? 'cropped') === 'cropped'

  const devicePanel = (
    <div className={isCropped ? 'px-10 lg:self-end' : 'flex items-center justify-center px-10 aspect-square lg:aspect-auto pb-16 lg:pb-20'}>
      <div className="device-frame mx-auto w-full" style={{maxWidth: isCropped ? '400px' : '280px', clipPath: isCropped ? 'inset(-20px -20px 0 -20px)' : 'none'}}>

        <div
          className={`device-screen border-medium relative overflow-hidden shadow-device border-[oklch(12%_0.009_50)] dark:border-[oklch(36%_0.012_50)]${isCropped ? ' crop-bottom' : ''}`}
          style={{
            aspectRatio: isCropped ? '417/518' : '417/890',
            backgroundColor: WARM_VOID,
          }}
          data-island="true"
        >
          <div className="device-island" />
          <div className="device-content">
            {isVideo ? (
              <video
                src={block.videoUrl || ''}
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={block.image?.image?.asset?.url || ''}
                alt={block.image?.alt || ''}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  )

  const contentPanel = (
    <div className="flex flex-col gap-12 pt-2 pb-16 lg:pb-20">
      <div className="flex flex-col gap-5">
        {block.label && (
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase text-gray-500 dark:text-gray-400">
            {block.label}
          </span>
        )}
        {block.heading && (
          <h2 className="text-[clamp(2.25rem,4vw,3.25rem)] font-medium leading-[1.05] tracking-[-0.02em] text-balance max-w-[18ch]">
            {block.heading}
          </h2>
        )}
      </div>

      {block.items && block.items.length > 0 && (
        <ol className="flex flex-col gap-9">
          {block.items.map((item, index) => (
            <li key={index} className="flex gap-5">
              <span className="font-mono text-[11px] tracking-[0.2em] text-gray-400 dark:text-gray-500 tabular-nums pt-[0.4rem] shrink-0">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="flex flex-col gap-2 min-w-0">
                {item.title && (
                  <h3 className="text-[1.25rem] font-medium leading-[1.3] tracking-[-0.01em]">
                    {item.title}
                  </h3>
                )}
                {item.body && (
                  <p className="text-[0.9375rem] leading-[1.7] max-w-[58ch] text-gray-600 dark:text-gray-400">
                    {item.body}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  )

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }${isCropped ? ' border-b border-[oklch(88%_0.008_50)] dark:border-[oklch(23%_0.012_50)]' : ''}`}
    >
      {cleanBackground === 'tile' && <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />}

      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <section className="grid grid-cols-1 lg:grid-cols-2 pt-12 lg:pt-20 pb-0">
          {isImageFirst ? devicePanel : contentPanel}
          {isImageFirst ? contentPanel : devicePanel}
        </section>
      </div>

    </div>
  )
}
