'use client'

import {stegaClean} from '@sanity/client/stega'
import Image from 'next/image'
import Link from 'next/link'
import {useRef, useState, useEffect, useCallback} from 'react'

type AbstractCardsCarouselProps = {
  block: {
    items?: Array<{
      label?: string
      heading?: string
      body?: string
      image?: string
      alt?: string
      link?: {
        linkType?: 'internal' | 'external'
        page?: string
        post?: string
        url?: string
      }
    }>
  }
}


export default function AbstractCardsCarousel({block}: AbstractCardsCarouselProps) {
  const {items} = block
  const slidesRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [prevDisabled, setPrevDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(false)

  const updateScrollState = useCallback(() => {
    const container = slidesRef.current
    if (!container || !items || items.length === 0) return

    const firstChild = container.children[0] as HTMLElement
    if (!firstChild) return

    const gap = window.innerWidth < 768 ? 16 : 24
    const step = firstChild.offsetWidth + gap
    const maxScroll = container.scrollWidth - container.clientWidth

    const index = step > 0 ? Math.round(container.scrollLeft / step) : 0
    setCurrentSlide(Math.max(0, Math.min(index, items.length - 1)))

    setPrevDisabled(container.scrollLeft <= 1)
    setNextDisabled(container.scrollLeft >= maxScroll - 1)
  }, [items])

  useEffect(() => {
    const container = slidesRef.current
    if (!container) return

    updateScrollState()

    container.addEventListener('scroll', updateScrollState, {passive: true})
    window.addEventListener('resize', updateScrollState)

    return () => {
      container.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [updateScrollState])

  const scrollToIndex = (index: number) => {
    const container = slidesRef.current
    if (!container) return

    const firstChild = container.children[0] as HTMLElement
    if (!firstChild) return

    const gap = window.innerWidth < 768 ? 16 : 24
    const step = firstChild.offsetWidth + gap

    container.scrollTo({
      left: index * step,
      behavior: 'smooth',
    })
  }

  const handleNext = () => {
    if (nextDisabled || !items) return
    scrollToIndex(Math.min(currentSlide + 1, items.length - 1))
  }

  const handlePrev = () => {
    if (prevDisabled) return
    scrollToIndex(Math.max(currentSlide - 1, 0))
  }

  const goToSlide = (index: number) => {
    scrollToIndex(index)
  }

  if (!items || items.length === 0) return null

  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
      <section className="w-full">
        <div className="relative w-full">
          <div
            ref={slidesRef}
            className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
          >
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
              const cleanLabel = item.label ? stegaClean(item.label) : ''

              return (
                <div
                  key={index}
                  className="snap-start w-full lg:w-[30%] flex-shrink-0"
                >
                  <LinkComponent
                    href={href}
                    className="bg-gray-200 dark:bg-gray-900 rounded-2xl p-4 sm:p-6 lg:p-6 h-full md:h-auto lg:h-full block cursor-pointer hover:brightness-95 dark:hover:brightness-125 transition-[filter] duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950"
                  >
                    <div className="bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden w-full flex flex-col md:flex-row lg:flex-col min-h-[340px] md:min-h-0 lg:min-h-[480px] h-full md:h-auto md:max-h-[260px] lg:h-full lg:max-h-none">
                      {/* Text content */}
                      <div className="p-6 pb-8 sm:pb-10 flex-1 flex flex-col justify-start md:pr-4">
                        <p className="flex items-center gap-1.5 text-xs text-gray-400 font-bold tracking-widest uppercase mb-3">
                          <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand"></span>
                          {item.label}
                        </p>
                        <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
                          {item.heading}
                        </h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {item.body}
                        </p>
                      </div>
                      {/* Image */}
                      {item.image && (
                        <div className="mt-auto md:mt-0 md:w-2/5 md:self-end lg:mt-auto lg:w-full flex-shrink-0 md:max-h-full">
                          <Image
                            src={item.image}
                            alt={item.alt || ''}
                            width={500}
                            height={480}
                            className="w-full h-auto block md:h-full md:object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </LinkComponent>
                </div>
              )
            })}
          </div>
        </div>

        {/* Controls Section: Arrows, Dots & Counter */}
        <div className="mt-6 sm:mt-8 grid grid-cols-3 items-center">
          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrev}
              disabled={prevDisabled}
              className={`p-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-950 dark:text-gray-50 hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed`}
              aria-label="Previous slide"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <button
              onClick={handleNext}
              disabled={nextDisabled}
              className="p-3 rounded-xl bg-gray-200 dark:bg-gray-800 text-gray-950 dark:text-gray-50 hover:bg-gray-300 dark:hover:bg-gray-700 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next slide"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
              </svg>
            </button>
          </div>

          {/* Pagination Dots (centred) - hidden on md and lg */}
          <div className="flex items-center justify-center gap-2 md:hidden">
            {items.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-brand'
                    : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              ></button>
            ))}
          </div>

          {/* Slide Counter (right-aligned) - hidden on lg */}
          <div className="flex justify-end text-sm font-medium text-gray-600 dark:text-gray-400 lg:hidden">
            <span>{currentSlide + 1}</span>&nbsp;of&nbsp;<span>{items.length}</span>
          </div>
        </div>
      </section>
    </div>
  )
}
