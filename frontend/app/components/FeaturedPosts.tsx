'use client'

import {stegaClean} from '@sanity/client/stega'
import {backgroundVariants, tileOverlay} from '@/app/components/backgrounds'
import Link from 'next/link'
import {useRef, useState, useEffect, useCallback} from 'react'
import SanityImage from '@/app/components/SanityImage'

type FeaturedPostsProps = {
  block: {
    heading?: string | null
    intro?: string | null
    background?: 'none' | 'tint' | 'tile' | 'gradient' | null
    resolvedPosts?: Array<{
      _id: string
      title: string | null
      slug: string | null
      excerpt?: string | null
      coverImage?: {
        asset?: {_ref: string} | null
        hotspot?: {x: number; y: number} | null
        crop?: {top: number; bottom: number; left: number; right: number} | null
        alt?: string | null
      } | null
      date?: string | null
      tags?: Array<{name: string | null; slug: string | null}> | null
    }> | null
  }
}



export default function FeaturedPosts({block}: FeaturedPostsProps) {
  const {heading, intro, background = 'none', resolvedPosts} = block
  const cleanBackground = stegaClean(background)

  const slidesRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [prevDisabled, setPrevDisabled] = useState(true)
  const [nextDisabled, setNextDisabled] = useState(false)

  const updateScrollState = useCallback(() => {
    const container = slidesRef.current
    if (!container || !resolvedPosts || resolvedPosts.length === 0) return

    const firstChild = container.children[0] as HTMLElement
    if (!firstChild) return

    const gap = window.innerWidth < 768 ? 16 : 24
    const step = firstChild.offsetWidth + gap
    const maxScroll = container.scrollWidth - container.clientWidth

    const index = step > 0 ? Math.round(container.scrollLeft / step) : 0
    setCurrentSlide(Math.max(0, Math.min(index, resolvedPosts.length - 1)))

    setPrevDisabled(container.scrollLeft <= 1)
    setNextDisabled(container.scrollLeft >= maxScroll - 1)
  }, [resolvedPosts])

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

    container.scrollTo({left: index * step, behavior: 'smooth'})
  }

  const handleNext = () => {
    if (nextDisabled || !resolvedPosts) return
    scrollToIndex(Math.min(currentSlide + 1, resolvedPosts.length - 1))
  }

  const handlePrev = () => {
    if (prevDisabled) return
    scrollToIndex(Math.max(currentSlide - 1, 0))
  }

  if (!resolvedPosts || resolvedPosts.length === 0) return null

  return (
    <div
      className={`relative w-full ${cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground ?? 'none'] ?? '') : ''}`}
    >
      {cleanBackground === 'tile' && <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-8 lg:py-12">
        {(heading || intro) && (
          <div className="mb-10 max-w-2xl">
            {heading && <h2 className="text-3xl font-light">{heading}</h2>}
            {intro && <p className="mt-3 font-normal">{intro}</p>}
          </div>
        )}
        <section className="w-full">
          <div className="relative w-full">
            <div
              ref={slidesRef}
              className="flex gap-4 sm:gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory no-scrollbar"
            >
              {resolvedPosts.map((post, index) => {
                const firstTag = post.tags?.[0]?.name ?? null
                const cleanLabel = firstTag ? stegaClean(firstTag) : null

                return (
                  <div key={post._id} className="snap-start w-full lg:w-[30%] flex-shrink-0 border border-gray-200 dark:border-gray-800">
                    <Link
                      href={`/posts/${post.slug}`}
                      className="flex flex-col h-full min-h-[340px] md:min-h-0 lg:min-h-[480px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-inset"
                    >
                      <div className="flex-1 flex flex-col md:flex-row lg:flex-col">
                        <div className="p-6 lg:p-8 flex-1 flex flex-col justify-start md:pr-6 lg:pr-8">
                          <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-6">
                            {String(index + 1).padStart(2, '0')}
                          </span>
                          {cleanLabel && (
                            <p className="flex items-center gap-1.5 font-mono text-[10px] tracking-[0.18em] uppercase text-gray-400 mb-4">
                              <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand shrink-0" aria-hidden="true" />
                              {cleanLabel}
                            </p>
                          )}
                          <h2 className="font-bold text-[1.35rem] leading-tight tracking-tight text-gray-950 dark:text-gray-50 mb-3">
                            {post.title}
                          </h2>
                          {post.excerpt && (
                            <p className="text-[13px] text-gray-500 dark:text-gray-400 leading-relaxed">{post.excerpt}</p>
                          )}
                        </div>
                        {post.coverImage?.asset?._ref && (
                          <div className="md:w-2/5 md:flex-shrink-0 lg:w-full overflow-hidden">
                            <SanityImage
                              id={post.coverImage.asset._ref}
                              alt={post.coverImage.alt ?? ''}
                              width={600}
                              hotspot={post.coverImage.hotspot ?? undefined}
                              crop={post.coverImage.crop ?? undefined}
                              className="w-full h-auto block"
                            />
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Controls: Arrows, Dots & Counter */}
          <div className="mt-6 sm:mt-8 grid grid-cols-3 items-center">
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                disabled={prevDisabled}
                className={`p-3 border border-gray-200 dark:border-gray-800 text-gray-950 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed`}
                aria-label="Previous slide"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                </svg>
              </button>
              <button
                onClick={handleNext}
                disabled={nextDisabled}
                className="p-3 border border-gray-200 dark:border-gray-800 text-gray-950 dark:text-gray-50 hover:bg-gray-50 dark:hover:bg-gray-900 active:scale-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 dark:focus-visible:ring-offset-gray-950 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Next slide"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
                </svg>
              </button>
            </div>

            {/* Pagination dots — mobile only */}
            <div className="flex items-center justify-center gap-2 md:hidden">
              {resolvedPosts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    i === currentSlide
                      ? 'bg-brand'
                      : 'bg-gray-300 dark:bg-gray-700 hover:bg-gray-400 dark:hover:bg-gray-600'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Slide counter — hidden on lg */}
            <div className="col-start-3 flex justify-end text-sm font-medium text-gray-600 dark:text-gray-400 lg:hidden">
              <span>{currentSlide + 1}</span>&nbsp;of&nbsp;<span>{resolvedPosts.length}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
