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

export type BentoColor = 'warm' | 'tint' | 'dark' | 'ink'

interface BaseBentoItem {
  _key: string
}

export interface BentoImageItem extends BaseBentoItem {
  _type: 'bentoImage'
  image?: string | null
  imageWidth?: number | null
  imageHeight?: number | null
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

// ─── Layout ───────────────────────────────────────────────────────────────────

interface Span { cols: 1 | 2; rows: 1 | 2 }

function computeSpan(item: BentoItem): Span {
  if (item._type !== 'bentoImage' || !item.imageWidth || !item.imageHeight) {
    return { cols: 1, rows: 1 }
  }
  const ar = item.imageWidth / item.imageHeight
  if (ar >= 1.5) return { cols: 2, rows: 1 }  // landscape → wide
  if (ar <= 0.67) return { cols: 1, rows: 2 }  // portrait → tall
  return { cols: 1, rows: 1 }
}

function cellClass(span: Span): string {
  const c = span.cols === 2 ? 'sm:col-span-2' : ''
  const r = span.rows === 2 ? 'row-span-2' : ''
  return [c, r].filter(Boolean).join(' ')
}

// ─── Animation ────────────────────────────────────────────────────────────────

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  },
}

// ─── Color maps ───────────────────────────────────────────────────────────────

const bgMap: Record<BentoColor, string> = {
  warm: 'bg-gray-50',
  tint: 'bg-gray-100',
  dark: 'bg-gray-900',
  ink: 'bg-black',
}

const fgMap: Record<BentoColor, string> = {
  warm: 'text-black',
  tint: 'text-black',
  dark: 'text-white',
  ink: 'text-white',
}

// Button styles invert relative to the surface
const btnMap: Record<BentoColor, string> = {
  warm: 'bg-black text-white hover:bg-gray-800',
  tint: 'bg-black text-white hover:bg-gray-800',
  dark: 'bg-white text-black hover:bg-gray-100',
  ink: 'bg-white text-black hover:bg-gray-100',
}

const overlayAnchor: Record<string, string> = {
  top: 'justify-start',
  center: 'justify-center',
  bottom: 'justify-end',
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
        className="object-cover transition-[transform,filter] duration-[500ms] ease-out group-hover:scale-[1.03] group-hover:brightness-105"
      />
      {item.overlayText && (
        <div className={`absolute inset-0 flex flex-col ${overlayAnchor[pos] ?? 'justify-end'} p-4`}>
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-white bg-black/75 px-3 py-1.5 rounded-sm w-fit max-w-[85%]">
            {item.overlayText}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Text block ───────────────────────────────────────────────────────────────

function BentoTextBlock({ item }: { item: BentoTextItem }) {
  const color = item.backgroundColor ?? 'warm'
  const align = stegaClean(item.textAlign) ?? 'left'
  const size = stegaClean(item.fontSize) ?? 'base'

  const sizeClass: Record<string, string> = {
    sm: '[&_p]:text-sm [&_p]:leading-relaxed',
    base: '[&_p]:text-base [&_p]:leading-relaxed',
    lg: '[&_p]:text-lg [&_p]:leading-snug',
    xl: '[&_p]:text-xl [&_p]:leading-snug [&_p]:tracking-tight',
  }

  const alignClass: Record<string, string> = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }

  return (
    <div
      className={`h-full flex flex-col justify-center p-6 ${bgMap[color]} ${fgMap[color]} ${alignClass[align] ?? 'text-left'} ${sizeClass[size] ?? ''}`}
    >
      {item.content && <PortableText value={item.content} />}
    </div>
  )
}

// ─── CTA block ────────────────────────────────────────────────────────────────

function BentoCtaBlock({ item }: { item: BentoCtaItem }) {
  const color = item.backgroundColor ?? 'warm'
  const isExternal = item.buttonLink?.startsWith('http')

  const btnClass = `inline-flex items-center font-mono text-[0.7rem] uppercase tracking-[0.12em] px-5 py-2.5 rounded-[8px] transition-colors duration-200 ease-out ${btnMap[color]}`

  const ariaLabel = item.buttonText
    ? `${item.buttonText}${item.headline ? ` — ${item.headline}` : ''}`
    : (item.headline ?? undefined)

  return (
    <div className={`h-full flex flex-col justify-between p-6 ${bgMap[color]} ${fgMap[color]}`}>
      <div className="flex flex-col gap-3">
        {item.headline && (
          <h3 className="text-xl font-medium tracking-tight leading-snug text-wrap-balance">
            {item.headline}
          </h3>
        )}
        {item.description && (
          <p className="text-sm leading-relaxed opacity-60">{item.description}</p>
        )}
      </div>

      {item.buttonText && item.buttonLink && (
        <div className="mt-6">
          {isExternal ? (
            <a
              href={item.buttonLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={ariaLabel}
              className={btnClass}
            >
              {item.buttonText}
            </a>
          ) : (
            <Link href={item.buttonLink} aria-label={ariaLabel} className={btnClass}>
              {item.buttonText}
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

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
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 [grid-auto-rows:minmax(220px,auto)] [grid-auto-flow:dense] gap-2"
            >
              {items.map((item) => {
                const span = computeSpan(item)
                return (
                  <motion.article
                    key={item._key}
                    variants={itemVariants}
                    className={`relative overflow-hidden rounded-sm transition-[filter] duration-200 ease-out hover:brightness-95 ${cellClass(span)}`}
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
                )
              })}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}
