'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useRef } from 'react'
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

interface Span { cols: 1 | 2 | 3 | 4; rows: 1 | 2 | 3 }

// Exact cell geometry at 1440px desktop:
// container = 1440 - 80px padding - 24px gap = 1336px / 4 cols = 334px per col
const COL_W = 334
const ROW_H = 220
const GAP = 8
const SIZE_PENALTY = 0.15

function effectiveAr(cols: number, rows: number): number {
  return (cols * COL_W + (cols - 1) * GAP) / (rows * ROW_H + (rows - 1) * GAP)
}

const SPAN_OPTIONS: { cols: 1 | 2 | 3 | 4; rows: 1 | 2 | 3 }[] = [
  { cols: 1, rows: 1 }, { cols: 2, rows: 1 }, { cols: 3, rows: 1 }, { cols: 4, rows: 1 },
  { cols: 1, rows: 2 }, { cols: 2, rows: 2 }, { cols: 3, rows: 2 }, { cols: 4, rows: 2 },
  { cols: 1, rows: 3 }, { cols: 2, rows: 3 },
]

function computeImageSpan(item: BentoImageItem): Span {
  if (!item.imageWidth || !item.imageHeight) return { cols: 1, rows: 1 }
  const imageAr = item.imageWidth / item.imageHeight
  let best = SPAN_OPTIONS[0]
  let bestScore = Infinity
  for (const opt of SPAN_OPTIONS) {
    const score =
      Math.abs(Math.log(effectiveAr(opt.cols, opt.rows) / imageAr)) +
      Math.log(opt.cols * opt.rows) * SIZE_PENALTY
    if (score < bestScore) { bestScore = score; best = opt }
  }
  return best
}

// ─── Layout solver ─────────────────────────────────────────────────────────────
// Images are rigid — their span is locked to aspect ratio. Text/CTA boxes are
// flexible: the solver searches span combinations and picks the one that tiles
// into the cleanest rectangle (no orphan blanks, text boxes not grouped). Any
// single leftover rectangle becomes the counter tile.

interface PlacedItem { span: Span; row: number; col: number }

const GRID_COLS = 4
type GridState = boolean[][]

function gEnsure(g: GridState, row: number) {
  while (g.length <= row) g.push(new Array(GRID_COLS).fill(false))
}

function gFree(g: GridState, row: number, col: number, cols: number, rows: number): boolean {
  if (col + cols > GRID_COLS) return false
  for (let r = row; r < row + rows; r++) {
    gEnsure(g, r)
    for (let c = col; c < col + cols; c++) {
      if (g[r][c]) return false
    }
  }
  return true
}

function gPlace(g: GridState, row: number, col: number, cols: number, rows: number) {
  for (let r = row; r < row + rows; r++) {
    gEnsure(g, r)
    for (let c = col; c < col + cols; c++) { g[r][c] = true }
  }
}

function gFindDense(g: GridState, cols: number, rows: number): { row: number; col: number } {
  for (let r = 0; ; r++) {
    gEnsure(g, r)
    for (let c = 0; c <= GRID_COLS - cols; c++) {
      if (gFree(g, r, c, cols, rows)) return { row: r, col: c }
    }
  }
}

// Decomposes every empty cell into capped rectangles (non-destructive).
function holeRects(g: GridState, height: number): PlacedItem[] {
  const c: boolean[][] = []
  for (let r = 0; r < height; r++) {
    c.push((g[r] ?? new Array(GRID_COLS).fill(false)).slice())
  }
  const rects: PlacedItem[] = []
  for (let r = 0; r < height; r++) {
    for (let col = 0; col < GRID_COLS; col++) {
      if (c[r][col]) continue
      let w = 0
      while (w < GRID_COLS && col + w < GRID_COLS && !c[r][col + w]) w++
      let h = 1
      while (h < 3 && r + h < height) {
        let rowFree = true
        for (let cc = col; cc < col + w; cc++) {
          if (c[r + h][cc]) { rowFree = false; break }
        }
        if (!rowFree) break
        h++
      }
      for (let rr = r; rr < r + h; rr++) {
        for (let cc = col; cc < col + w; cc++) c[rr][cc] = true
      }
      rects.push({ span: { cols: w as 1 | 2 | 3 | 4, rows: h as 1 | 2 | 3 }, row: r, col })
    }
  }
  return rects
}

interface KeyedSpan { key: string; span: Span }

// Places rigid images first, then flexible boxes, both by dense flow.
function simulate(images: KeyedSpan[], flex: KeyedSpan[]) {
  const g: GridState = []
  const placed = new Map<string, PlacedItem>()
  for (const it of [...images, ...flex]) {
    const pos = gFindDense(g, it.span.cols, it.span.rows)
    gPlace(g, pos.row, pos.col, it.span.cols, it.span.rows)
    placed.set(it.key, { span: it.span, row: pos.row, col: pos.col })
  }
  return { placed, height: g.length, grid: g }
}

// Two rectangles share an edge (used to keep text boxes apart).
function rectsAdjacent(a: PlacedItem, b: PlacedItem): boolean {
  const aR2 = a.row + a.span.rows, aC2 = a.col + a.span.cols
  const bR2 = b.row + b.span.rows, bC2 = b.col + b.span.cols
  const rowOverlap = a.row < bR2 && b.row < aR2
  const colOverlap = a.col < bC2 && b.col < aC2
  if (rowOverlap && (aC2 === b.col || bC2 === a.col)) return true
  if (colOverlap && (aR2 === b.row || bR2 === a.row)) return true
  return false
}

function scoreLayout(holes: PlacedItem[], flexPlaced: PlacedItem[]): number {
  let s = 0
  if (holes.length === 0) s += 120
  else if (holes.length === 1) {
    const a = holes[0].span.cols * holes[0].span.rows
    s += a <= 6 ? 200 : -(a - 6) * 45
  } else {
    s -= 3000 * holes.length
    s -= holes.reduce((t, h) => t + h.span.cols * h.span.rows, 0) * 20
  }
  for (const f of flexPlaced) {
    const area = f.span.cols * f.span.rows
    const ratio =
      Math.max(f.span.cols, f.span.rows) / Math.min(f.span.cols, f.span.rows)
    if (area === 1) s -= 35
    if (area > 4) s -= (area - 4) * 22
    if (ratio > 2) s -= (ratio - 2) * 16
  }
  for (let i = 0; i < flexPlaced.length; i++) {
    for (let j = i + 1; j < flexPlaced.length; j++) {
      if (rectsAdjacent(flexPlaced[i], flexPlaced[j])) s -= 70
    }
  }
  return s
}

// Flexible-box span palette. Subsets keep the search bounded as box count grows.
const FLEX_SPANS: Span[] = [
  { cols: 1, rows: 1 }, { cols: 2, rows: 1 }, { cols: 1, rows: 2 }, { cols: 2, rows: 2 },
  { cols: 3, rows: 1 }, { cols: 1, rows: 3 }, { cols: 3, rows: 2 }, { cols: 2, rows: 3 },
]

function flexPalette(count: number): Span[] {
  if (count <= 4) return FLEX_SPANS          // 8^4 = 4096
  if (count === 5) return FLEX_SPANS.slice(0, 5) // 5^5 = 3125
  if (count === 6) return FLEX_SPANS.slice(0, 4) // 4^6 = 4096
  return []                                  // greedy fallback
}

const GREEDY_FILL: [number, number][] = [
  [2, 2], [1, 2], [2, 1], [2, 3], [1, 3], [1, 1],
]

// Fallback for grids with many text boxes: place each at the first fit.
function greedyFlexSpans(images: KeyedSpan[], flexKeys: string[]): KeyedSpan[] {
  const g: GridState = []
  for (const im of images) {
    const pos = gFindDense(g, im.span.cols, im.span.rows)
    gPlace(g, pos.row, pos.col, im.span.cols, im.span.rows)
  }
  return flexKeys.map((key) => {
    const a = gFindDense(g, 1, 1)
    let span: Span = { cols: 1, rows: 1 }
    for (const [cols, rows] of GREEDY_FILL) {
      if (gFree(g, a.row, a.col, cols, rows)) {
        span = { cols: cols as 1 | 2 | 3 | 4, rows: rows as 1 | 2 | 3 }
        break
      }
    }
    gPlace(g, a.row, a.col, span.cols, span.rows)
    return { key, span }
  })
}

function computeLayout(items: BentoItem[]): {
  placed: Map<string, PlacedItem>
  fillers: PlacedItem[]
} {
  const images: KeyedSpan[] = items
    .filter((i): i is BentoImageItem => i._type === 'bentoImage')
    .map((i) => ({ key: i._key, span: computeImageSpan(i) }))
  const flexKeys = items.filter((i) => i._type !== 'bentoImage').map((i) => i._key)

  if (flexKeys.length === 0) {
    const sim = simulate(images, [])
    return { placed: sim.placed, fillers: holeRects(sim.grid, sim.height) }
  }

  const palette = flexPalette(flexKeys.length)
  if (palette.length === 0) {
    const sim = simulate(images, greedyFlexSpans(images, flexKeys))
    return { placed: sim.placed, fillers: holeRects(sim.grid, sim.height) }
  }

  // Exhaustively search flexible-box span combinations for the cleanest tiling.
  const S = palette.length
  const total = S ** flexKeys.length
  let best: { placed: Map<string, PlacedItem>; fillers: PlacedItem[] } | null = null
  let bestScore = -Infinity
  for (let combo = 0; combo < total; combo++) {
    let n = combo
    const flex: KeyedSpan[] = flexKeys.map((key) => {
      const span = palette[n % S]
      n = Math.floor(n / S)
      return { key, span }
    })
    const sim = simulate(images, flex)
    const holes = holeRects(sim.grid, sim.height)
    const flexPlaced = flex.map((f) => sim.placed.get(f.key)!)
    const score = scoreLayout(holes, flexPlaced)
    if (score > bestScore) {
      bestScore = score
      best = { placed: sim.placed, fillers: holes }
    }
  }
  return best!
}

// Explicit grid-line classes for lg — complete strings required for Tailwind JIT.
// start + end are two separate longhands, so neither resets the other; the
// col-span shorthand would clobber grid-column-start and break placement.
const LG_COL_START: Record<number, string> = {
  1: 'lg:col-start-1', 2: 'lg:col-start-2', 3: 'lg:col-start-3', 4: 'lg:col-start-4',
}
const LG_COL_END: Record<number, string> = {
  2: 'lg:col-end-2', 3: 'lg:col-end-3', 4: 'lg:col-end-4', 5: 'lg:col-end-5',
}
const LG_ROW_START: Record<number, string> = {
  1: 'lg:row-start-1', 2: 'lg:row-start-2', 3: 'lg:row-start-3', 4: 'lg:row-start-4',
  5: 'lg:row-start-5', 6: 'lg:row-start-6', 7: 'lg:row-start-7', 8: 'lg:row-start-8',
  9: 'lg:row-start-9', 10: 'lg:row-start-10', 11: 'lg:row-start-11', 12: 'lg:row-start-12',
  13: 'lg:row-start-13', 14: 'lg:row-start-14',
}
const LG_ROW_END: Record<number, string> = {
  2: 'lg:row-end-2', 3: 'lg:row-end-3', 4: 'lg:row-end-4', 5: 'lg:row-end-5',
  6: 'lg:row-end-6', 7: 'lg:row-end-7', 8: 'lg:row-end-8', 9: 'lg:row-end-9',
  10: 'lg:row-end-10', 11: 'lg:row-end-11', 12: 'lg:row-end-12', 13: 'lg:row-end-13',
  14: 'lg:row-end-14', 15: 'lg:row-end-15', 16: 'lg:row-end-16', 17: 'lg:row-end-17',
}
const SIZES_BY_COLS: Record<number, string> = {
  1: '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw',
  2: '(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 50vw',
  3: '(max-width: 640px) 100vw, 75vw',
  4: '100vw',
}

function cellClass(p: PlacedItem): string {
  const smSpan = p.span.cols >= 2 ? 'sm:col-span-2' : ''
  const smRows = p.span.rows >= 3 ? 'sm:row-span-3' : p.span.rows === 2 ? 'sm:row-span-2' : ''
  return [
    smSpan, smRows,
    LG_COL_START[p.col + 1] ?? '',
    LG_COL_END[p.col + 1 + p.span.cols] ?? '',
    LG_ROW_START[p.row + 1] ?? '',
    LG_ROW_END[p.row + 1 + p.span.rows] ?? '',
  ].filter(Boolean).join(' ')
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

function BentoImageBlock({ item, span }: { item: BentoImageItem; span: Span }) {
  const pos = stegaClean(item.overlayPosition) ?? 'bottom'
  if (!item.image) return null

  return (
    <div className="group absolute inset-0">
      <Image
        src={item.image}
        alt={item.alt ?? ''}
        fill
        sizes={SIZES_BY_COLS[span.cols] ?? SIZES_BY_COLS[1]}
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

// ─── Counter block ────────────────────────────────────────────────────────────
// Fills leftover grid space with a count, so the layout resolves to a rectangle.

function BentoCounterBlock({ count, label, large }: { count: number; label: string; large: boolean }) {
  return (
    <div className="h-full flex flex-col justify-between p-6 bg-gray-50">
      <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-gray-400">
        {label}
      </span>
      <p
        className={`font-bold leading-none tracking-tight text-gray-900 ${
          large ? 'text-[clamp(3rem,5vw,4.75rem)]' : 'text-[2.5rem]'
        }`}
      >
        {String(count).padStart(2, '0')}
      </p>
    </div>
  )
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function BentoGrid({ block }: BentoGridProps) {
  const { items, background = 'none' } = block
  const cleanBackground = stegaClean(background)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const hasItems = !!items && items.length > 0
  const { placed, fillers } = useMemo(
    () =>
      hasItems
        ? computeLayout(items)
        : { placed: new Map<string, PlacedItem>(), fillers: [] as PlacedItem[] },
    [hasItems, items],
  )

  const imageCount = hasItems ? items.filter((i) => i._type === 'bentoImage').length : 0
  const counterCount = imageCount > 0 ? imageCount : (items?.length ?? 0)
  const counterLabel = imageCount > 0 ? 'Images' : 'Items'
  // Largest leftover rect carries the counter; any others are quiet fill.
  const counterIdx = fillers.reduce(
    (best, f, i, arr) =>
      f.span.cols * f.span.rows > arr[best].span.cols * arr[best].span.rows ? i : best,
    0,
  )

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
                const p = placed.get(item._key) ?? { span: { cols: 1, rows: 1 } as Span, row: 0, col: 0 }
                return (
                  <motion.article
                    key={item._key}
                    variants={itemVariants}
                    className={`relative overflow-hidden rounded-sm transition-[filter] duration-200 ease-out hover:brightness-95 ${cellClass(p)}`}
                    aria-label={
                      item._type === 'bentoImage'
                        ? (item.alt ?? undefined)
                        : item._type === 'bentoCta'
                        ? (item.headline ?? undefined)
                        : undefined
                    }
                  >
                    {item._type === 'bentoImage' && <BentoImageBlock item={item} span={p.span} />}
                    {item._type === 'bentoText' && <BentoTextBlock item={item} />}
                    {item._type === 'bentoCta' && <BentoCtaBlock item={item} />}
                  </motion.article>
                )
              })}

              {fillers.map((f, i) => (
                <motion.article
                  key={`bento-filler-${i}`}
                  variants={itemVariants}
                  aria-hidden="true"
                  className={`relative overflow-hidden rounded-sm ${
                    i === counterIdx ? '' : 'hidden lg:block'
                  } ${cellClass(f)}`}
                >
                  {i === counterIdx ? (
                    <BentoCounterBlock
                      count={counterCount}
                      label={counterLabel}
                      large={f.span.cols * f.span.rows >= 2}
                    />
                  ) : (
                    <div className="h-full bg-gray-50" />
                  )}
                </motion.article>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}
