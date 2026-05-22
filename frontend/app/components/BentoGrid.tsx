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

const SPAN_OPTIONS: Span[] = [
  { cols: 1, rows: 1 }, { cols: 2, rows: 1 }, { cols: 3, rows: 1 }, { cols: 4, rows: 1 },
  { cols: 1, rows: 2 }, { cols: 2, rows: 2 }, { cols: 3, rows: 2 }, { cols: 4, rows: 2 },
  { cols: 1, rows: 3 }, { cols: 2, rows: 3 },
]

// ─── Layout solver ─────────────────────────────────────────────────────────────
// Every item carries a ranked list of spans it may occupy, each with a penalty.
// The solver searches span combinations, simulates CSS grid-auto-flow:dense for
// each, and keeps the cheapest gap-free tiling. Images flex only within a modest
// aspect-ratio band and are the preferred absorber of leftover space; text/CTA
// boxes flex freely; the counter is a small accent that grows only as a last
// resort. Every cell ends up owned by a real item or the counter — there are no
// blank filler tiles.

// A span an item may occupy, paired with the cost of choosing it.
interface Candidate { span: Span; penalty: number }

// Images may drift up to ~55% off their best aspect-ratio fit — enough to grow
// one step and absorb space (object-cover crops), not enough to lose the shot.
const IMAGE_AR_BAND = 0.44 // ≈ log(1.55)

function imageCandidates(item: BentoImageItem): Candidate[] {
  if (!item.imageWidth || !item.imageHeight) {
    return [{ span: { cols: 1, rows: 1 }, penalty: 0 }]
  }
  const imageAr = item.imageWidth / item.imageHeight
  const scored = SPAN_OPTIONS.map((span) => ({
    span,
    dev: Math.abs(Math.log(effectiveAr(span.cols, span.rows) / imageAr)),
  }))
  const bestDev = Math.min(...scored.map((s) => s.dev))
  return scored
    .filter((s) => s.dev <= bestDev + IMAGE_AR_BAND)
    .map((s) => ({
      span: s.span,
      // Crop drift dominates; a mild size term breaks ties toward smaller spans.
      penalty: (s.dev - bestDev) * 4 + Math.log(s.span.cols * s.span.rows) * SIZE_PENALTY,
    }))
    .sort((a, b) => a.penalty - b.penalty)
    .slice(0, 5)
}

// Text/CTA penalties encode reading comfort: 2-wide shapes read best, 1×1 is
// cramped, thin or oversized shapes are a last resort. Costs sit above the image
// band so images absorb leftover space before a text box stretches to fill it.
const FLEX_CANDIDATES: Candidate[] = [
  { span: { cols: 2, rows: 1 }, penalty: 0 },
  { span: { cols: 2, rows: 2 }, penalty: 0.6 },
  { span: { cols: 1, rows: 2 }, penalty: 1.2 },
  { span: { cols: 3, rows: 1 }, penalty: 1.8 },
  { span: { cols: 1, rows: 3 }, penalty: 2.4 },
  { span: { cols: 1, rows: 1 }, penalty: 2.8 },
  { span: { cols: 3, rows: 2 }, penalty: 3.4 },
  { span: { cols: 2, rows: 3 }, penalty: 3.6 },
]

// The counter is a designed accent, not a blank filler. It strongly prefers a
// single cell and only grows when nothing else can close a gap.
const COUNTER_KEY = '__bento_counter__'
const COUNTER_CANDIDATES: Candidate[] = [
  { span: { cols: 1, rows: 1 }, penalty: 0 },
  { span: { cols: 2, rows: 1 }, penalty: 1.5 },
  { span: { cols: 1, rows: 2 }, penalty: 1.5 },
  { span: { cols: 2, rows: 2 }, penalty: 4 },
  { span: { cols: 3, rows: 1 }, penalty: 7 },
  { span: { cols: 1, rows: 3 }, penalty: 7 },
  { span: { cols: 3, rows: 2 }, penalty: 11 },
  { span: { cols: 2, rows: 3 }, penalty: 11 },
]

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

// Places items in document order by dense flow (counter appended last).
function simulate(items: KeyedSpan[]) {
  const g: GridState = []
  const placed = new Map<string, PlacedItem>()
  for (const it of items) {
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

interface SolverItem { key: string; isFlex: boolean; candidates: Candidate[] }

// Upper bound on span combinations searched. Candidate lists are trimmed evenly
// (costliest first) until the product fits, keeping the search near-instant.
const MAX_COMBOS = 80000

function computeLayout(items: BentoItem[]): {
  placed: Map<string, PlacedItem>
  fillers: PlacedItem[]
} {
  const solverItems: SolverItem[] = items.map((it) => ({
    key: it._key,
    isFlex: it._type === 'bentoText' || it._type === 'bentoCta',
    candidates: it._type === 'bentoImage' ? imageCandidates(it) : [...FLEX_CANDIDATES],
  }))
  // The counter is appended last so dense flow lets it mop up a leftover cell.
  solverItems.push({ key: COUNTER_KEY, isFlex: false, candidates: [...COUNTER_CANDIDATES] })

  for (const si of solverItems) si.candidates.sort((a, b) => a.penalty - b.penalty)
  const comboCount = () => solverItems.reduce((p, si) => p * si.candidates.length, 1)
  while (comboCount() > MAX_COMBOS) {
    let widest: SolverItem | null = null
    for (const si of solverItems) {
      if (si.candidates.length > 1 && (!widest || si.candidates.length > widest.candidates.length)) {
        widest = si
      }
    }
    if (!widest) break
    widest.candidates.pop()
  }

  const flexKeys = new Set(solverItems.filter((s) => s.isFlex).map((s) => s.key))
  const total = comboCount()
  let bestPlaced: Map<string, PlacedItem> | null = null
  let bestGrid: GridState = []
  let bestHeight = 0
  let bestCost = Infinity

  for (let combo = 0; combo < total; combo++) {
    let n = combo
    let penaltySum = 0
    const keyed: KeyedSpan[] = solverItems.map((si) => {
      const len = si.candidates.length
      const c = si.candidates[n % len]
      n = Math.floor(n / len)
      penaltySum += c.penalty
      return { key: si.key, span: c.span }
    })
    const sim = simulate(keyed)
    const holes = holeRects(sim.grid, sim.height)
    const holeArea = holes.reduce((t, h) => t + h.span.cols * h.span.rows, 0)

    let adjacent = 0
    const flexPlaced = keyed
      .filter((k) => flexKeys.has(k.key))
      .map((k) => sim.placed.get(k.key)!)
    for (let i = 0; i < flexPlaced.length; i++) {
      for (let j = i + 1; j < flexPlaced.length; j++) {
        if (rectsAdjacent(flexPlaced[i], flexPlaced[j])) adjacent++
      }
    }

    // Holes dominate so a gap-free rectangle always wins; span penalties and
    // text-box adjacency are fine-grained tiebreakers among clean tilings.
    const cost = holes.length * 4000 + holeArea * 300 + penaltySum + adjacent * 10
    if (cost < bestCost) {
      bestCost = cost
      bestPlaced = sim.placed
      bestGrid = sim.grid
      bestHeight = sim.height
    }
  }

  return { placed: bestPlaced!, fillers: holeRects(bestGrid, bestHeight) }
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
// A small designed accent showing the item count — placed by the solver as a
// real tile, not a blank filler.

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
  const counterPlaced = placed.get(COUNTER_KEY) ?? null

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

              {counterPlaced && (
                <motion.article
                  key="bento-counter"
                  variants={itemVariants}
                  aria-hidden="true"
                  className={`relative overflow-hidden rounded-sm ${cellClass(counterPlaced)}`}
                >
                  <BentoCounterBlock
                    count={counterCount}
                    label={counterLabel}
                    large={counterPlaced.span.cols * counterPlaced.span.rows >= 2}
                  />
                </motion.article>
              )}

              {fillers.map((f, i) => (
                <motion.article
                  key={`bento-filler-${i}`}
                  variants={itemVariants}
                  aria-hidden="true"
                  className={`relative overflow-hidden rounded-sm hidden lg:block ${cellClass(f)}`}
                >
                  <div className="h-full bg-gray-50" />
                </motion.article>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}
