'use client'

import { stegaClean } from '@sanity/client/stega'
import {backgroundVariants, tileOverlay} from '@/app/components/backgrounds'
import Image from 'next/image'
import Link from 'next/link'

type CarouselCardsProps = {
  block: {
    background?: 'none' | 'tint' | 'tile' | 'gradient'
    items?: Array<{
      image?: string
      alt?: string
      label?: string
      title?: string
      link?: {
        linkType?: 'internal' | 'external'
        page?: string
        post?: string
        url?: string
      }
    }>
  }
}


export default function CarouselCards({ block }: CarouselCardsProps) {
  const { background = 'none', items } = block
  const cleanBackground = stegaClean(background)

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }`}
    >
      {cleanBackground === 'tile' && <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <section className="overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar py-12">
          {items && items.length > 0 && (
            <div className="flex gap-4 lg:gap-6 w-max">
              {items.map((item, index) => {
                const href = item.link
                  ? item.link.linkType === 'internal'
                    ? item.link.page
                      ? `/${item.link.page}`
                      : item.link.post
                        ? `/blog/${item.link.post}`
                        : '#'
                    : item.link.url || '#'
                  : '#'

                const LinkComponent = item.link && item.link.linkType === 'internal' ? Link : 'a'

                return (
                <article
                  key={index}
                  className="snap-start flex-shrink-0 flex flex-col w-[260px] sm:w-[300px] lg:w-[360px] rounded-2xl overflow-hidden dark:bg-gray-800 bg-gray-200 relative"
                >
                  <LinkComponent
                    href={href}
                    className="absolute inset-0 z-10 rounded-2xl focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand"
                    aria-label={item.title ? `${item.title} — ${item.label}` : undefined}
                  />
                  {item.image && (
                    <Image
                      src={item.image}
                      alt={item.alt || ''}
                      width={360}
                      height={270}
                      className="w-full aspect-[4/3] object-cover block"
                    />
                  )}
                  <div className="flex flex-col flex-1 p-5 lg:p-6">
                    {item.label && (
                      <p className="text-sm font-normal leading-snug mb-1" aria-hidden="true">
                        {item.label}
                      </p>
                    )}
                    {item.title && (
                      <p
                        className="text-lg lg:text-xl font-medium leading-snug"
                        aria-hidden="true"
                      >
                        {item.title}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-auto pt-6">
                      <span className="text-xs tracking-wide" aria-hidden="true">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span
                        aria-hidden="true"
                        className="w-8 h-8 rounded-full flex items-center justify-center text-lg"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="size-6"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25ZM12.75 9a.75.75 0 0 0-1.5 0v2.25H9a.75.75 0 0 0 0 1.5h2.25V15a.75.75 0 0 0 1.5 0v-2.25H15a.75.75 0 0 0 0-1.5h-2.25V9Z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </article>
              )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
