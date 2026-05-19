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
    <div className={isCropped ? 'flex items-end justify-center px-10' : 'flex items-center justify-center px-10 aspect-square lg:aspect-auto pb-16 lg:pb-20'}>
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
    <div className="flex flex-col gap-8 pb-16 lg:pb-20">
      <div>
        {block.label && (
          <p className="font-mono text-xs tracking-widest uppercase mb-2">{block.label}</p>
        )}
        {block.heading && (
          <p className="text-4xl lg:text-5xl font-medium leading-[1.15] tracking-tight">
            {block.heading}
          </p>
        )}
      </div>

      {block.items && block.items.length > 0 && (
        <div className="flex flex-col gap-6">
          {block.items.map((item, index) => (
            <div key={index}>
              {item.title && (
                <p className="text-lg font-medium mb-3">{item.title}</p>
              )}
              {item.body && (
                <p className="text-base leading-[1.65] max-w-[65ch]">{item.body}</p>
              )}
            </div>
          ))}
        </div>
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
