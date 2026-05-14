import {PortableTextBlock} from 'next-sanity'

import ResolvedLink from '@/app/components/ResolvedLink'
import PortableText from '@/app/components/PortableText'
import Image from '@/app/components/SanityImage'
import {stegaClean} from '@sanity/client/stega'
import {backgroundVariants, tileOverlay} from '@/app/components/backgrounds'
import {ExtractPageBuilderType} from '@/sanity/lib/types'

type CtaProps = {
  block: ExtractPageBuilderType<'callToAction'>
  index: number
  // Needed if you want to createDataAttributes to do non-text overlays in Presentation (Visual Editing)
  pageType: string
  pageId: string
}


export default function CTA({block}: CtaProps) {
  const {heading, eyebrow, body = [], button, image, background = 'none', contentAlignment} = block

  const cleanBackground = stegaClean(background)
  const isImageFirst = stegaClean(contentAlignment) === 'imageFirst'

  return (
    <section className={`relative ${cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''}`}>
      {cleanBackground === 'tile' && <div className={`absolute inset-0 ${tileOverlay}`} />}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12 relative">
        <div className="grid lg:grid-cols-2 gap-12 py-12">
          <div
            className={`${isImageFirst && image ? 'row-start-2 lg:row-start-1 lg:col-start-2' : ''} flex flex-col gap-2 `}
          >
            {eyebrow && (
              <span className="text-xs uppercase dark:text-white font-mono tracking-widest opacity-70">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2 className="text-2xl md:text-3xl lg:text-4xl dark:text-white">{heading}</h2>
            )}
            {body && (
              <div className="lg:text-left">
                <PortableText value={body as PortableTextBlock[]} className="dark:prose-invert" />
              </div>
            )}

            {button?.buttonText && button?.link && (
              <div className="flex mt-4">
                <ResolvedLink
                  link={button?.link}
                  className="rounded-lg flex gap-2 font-mono text-sm whitespace-nowrap items-center bg-black dark:bg-white hover:bg-gray-800 dark:hover:bg-gray-100 active:scale-95 active:translate-y-px py-3 px-6 text-white dark:text-black transition-all duration-200"
                >
                  {button?.buttonText}
                </ResolvedLink>
              </div>
            )}
          </div>

          {image?.asset?._ref && (
            <Image
              id={image.asset._ref}
              alt="Demo image"
              width={704}
              crop={image.crop}
              mode="cover"
              className="rounded-sm"
            />
          )}
        </div>
      </div>
    </section>
  )
}
