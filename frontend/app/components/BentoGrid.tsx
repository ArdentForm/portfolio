'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { stegaClean } from '@sanity/client/stega'
import { PortableTextBlock } from 'next-sanity'
import PortableText from '@/app/components/PortableText'
import { backgroundVariants, tileOverlay } from '@/app/components/backgrounds'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BentoSpan {
  cols?: 1 | 2
  rows?: 1 | 2
}

export type BentoColor = 'none' | 'warm' | 'tint' | 'dark' | 'accent'

interface BaseBentoItem {
  _key: string
  span?: BentoSpan
}

export interface BentoImageItem extends BaseBentoItem {
  _type: 'bentoImage'
  image?: string | null
  alt?: string | null
  overlayText?: string | null
  overlayPosition?: 'top' | 'center' | 'bottom' | null
}

export interface BentoTextItem extends BaseBentoItem {
  _type: 'bentoText'
  content?: PortableTextBlock[] | null
  textAlign?: 'left' | 'center' | 'right' | null
  backgroundColor?: BentoColor | null
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | null
}

export interface BentoCtaItem extends BaseBentoItem {
  _type: 'bentoCta'
  headline?: string | null
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  backgroundColor?: BentoColor | null
}

export type BentoItem = BentoImageItem | BentoTextItem | BentoCtaItem

export interface BentoGridProps {
  block: {
    items?: BentoItem[]
    background?: 'none' | 'tint' | 'tile' | 'gradient'
  }
}

// ─── Animation ────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

// ─── Color maps ───────────────────────────────────────────────────────────────

const bgMap: Record<BentoColor, string> = {
  none: 'bg-transparent',
  warm: 'bg-gray-50',
  tint: 'bg-gray-100',
  dark: 'bg-gray-900',
  accent: 'bg-orange-500',
}

const textMap: Record<BentoColor, string> = {
  none: 'text-gray-900',
  warm: 'text-gray-900',
  tint: 'text-gray-900',
  dark: 'text-gray-50',
  accent: 'text-white',
}

const borderMap: Record<BentoColor, string> = {
  none: 'border-gray-900/15',
  warm: 'border-gray-900/15',
  tint: 'border-gray-900/15',
  dark: 'border-white/20',
  accent: 'border-white/30',
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function resolveColor(c?: BentoColor | null): BentoColor {
  return c ?? 'warm'
}

function overlayJustify(pos: string): string {
  if (pos === 'top') return 'justify-start'
  if (pos === 'center') return 'justify-center'
  return 'justify-end'
}

function cellClasses(item: BentoItem): string {
  const cols = item.span?.cols === 2 ? 'sm:col-span-2' : ''
  const rows = item.span?.rows === 2 ? 'row-span-2' : ''
  return [cols, rows].filter(Boolean).join(' ')
}

// ─── Image block ──────────────────────────────────────────────────────────────

function BentoImageBlock({ item }: { item: BentoImageItem }) {
  const pos = stegaClean(item.overlayPosition) ?? 'bottom'

  if (!item.image) return null

  return (
    <div className="group absolute inset-0">
      <Image
        src={item.image}
        alt={item.alt ?? ''}
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-[transform,filter] duration-[400ms] ease-out group-hover:scale-[1.04] group-hover:brightness-105"
      />
      {item.overlayText && (
        <div className={`absolute inset-0 flex flex-col ${overlayJustify(pos)} p-5`}>
          <p className="bg-black/50 backdrop-blur-sm rounded px-3 py-2 text-white text-sm font-medium w-fit max-w-[80%]">
            {item.overlayText}
          </p>
        </div>
      )}
    </div>
  )
}

// ─── Text block ───────────────────────────────────────────────────────────────

function BentoTextBlock({ item }: { item: BentoTextItem }) {
  const color = resolveColor(item.backgroundColor)
  const align = stegaClean(item.textAlign) ?? 'left'
  const size = stegaClean(item.fontSize) ?? 'base'

  const sizeClass: Record<string, string> = {
    sm: 'text-sm',
    base: 'text-base',
    lg: 'text-lg leading-snug',
    xl: 'text-xl leading-snug',
  }
  const alignClass: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div
      className={`h-full flex flex-col justify-center p-6 ${bgMap[color]} ${textMap[color]} ${alignClass[align] ?? 'text-left'}`}
    >
      {item.content && (
        <div className={sizeClass[size] ?? 'text-base'}>
          <PortableText value={item.content} />
        </div>
      )}
    </div>
  )
}

// ─── CTA block ────────────────────────────────────────────────────────────────

function BentoCtaBlock({ item }: { item: BentoCtaItem }) {
  const color = resolveColor(item.backgroundColor)
  const isExternal = item.buttonLink?.startsWith('http')

  const buttonClass = `inline-flex items-center gap-2 text-sm font-medium border px-4 py-2 rounded-sm transition-opacity duration-200 hover:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current ${borderMap[color]}`
  const ariaLabel = item.buttonText
    ? `${item.buttonText}${item.headline ? ` — ${item.headline}` : ''}`
    : item.headline ?? undefined

  return (
    <div
      className={`h-full flex flex-col justify-between p-6 ${bgMap[color]} ${textMap[color]}`}
    >
      <div className="flex flex-col gap-3">
        {item.headline && (
          <h3 className="text-lg font-medium tracking-tight leading-snug">{item.headline}</h3>
        )}
        {item.description && (
          <p className="text-sm opacity-70 leading-relaxed">{item.description}</p>
        )}
      </div>

      {item.buttonText && item.buttonLink && (
        <div className="mt-5">
          {isExternal ? (
            <a
              href={item.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              className={buttonClass}
            >
              {item.buttonText}
            </a>
          ) : (
            <Link
              href={item.buttonLink}
              aria-label={ariaLabel}
              className={buttonClass}
            >
              {item.buttonText}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function BentoGrid({ block }: BentoGridProps) {
  const { items, background = 'none' } = block
  const cleanBackground = stegaClean(background)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }`}
    >
      {cleanBackground === 'tile' && (
        <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />
      )}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <section className="py-12">
          {items && items.length > 0 && (
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 [grid-auto-rows:minmax(220px,auto)] gap-2"
            >
              {items.map((item) => (
                <motion.article
                  key={item._key}
                  variants={itemVariants}
                  className={`relative overflow-hidden rounded-sm transition-shadow duration-300 hover:shadow-md ${cellClasses(item)}`}
                  aria-label={
                    item._type === 'bentoImage'
                      ? (item.alt ?? undefined)
                      : item._type === 'bentoCta'
                      ? (item.headline ?? undefined)
                      : undefined
                  }
                >
                  {item._type === 'bentoImage' && <BentoImageBlock item={item} />}
                  {item._type === 'bentoText' && <BentoTextBlock item={item} />}
                  {item._type === 'bentoCta' && <BentoCtaBlock item={item} />}
                </motion.article>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}
