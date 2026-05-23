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

export type BentoColor = 'base' | 'reverse' | 'brand'

interface BaseBentoItem {
  _key: string
  enabled?: boolean | null
}

export interface BentoImageItem extends BaseBentoItem {
  _type: 'bentoImage'
  image?: string | null
  imageWidth?: number | null
  imageHeight?: number | null
  alt?: string | null
  label?: string | null
}

export interface BentoTextItem extends BaseBentoItem {
  _type: 'bentoText'
  content?: PortableTextBlock[] | null
  textAlign?: 'left' | 'center' | 'right' | null
  backgroundColor?: BentoColor | null
  fontSize?: 'sm' | 'base' | 'lg' | 'xl' | null
  label?: string | null
  displayStyle?: 'card' | 'naked' | 'hairline' | null
}

export interface BentoCtaItem extends BaseBentoItem {
  _type: 'bentoCta'
  headline?: string | null
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  backgroundColor?: BentoColor | null
  label?: string | null
}

export type BentoItem = BentoImageItem | BentoTextItem | BentoCtaItem

export interface BentoGridProps {
  block: {
    items?: BentoItem[]
    background?: 'none' | 'tint' | 'tile' | 'gradient'
  }
}

// ─── Layout constants ─────────────────────────────────────────────────────────

// Desktop (4-col): container = 1440 - 80px padding - 24px gap = 1336px / 4 = 334px per col
const COL_W = 334
const ROW_H = 220
const GAP = 8
const SIZE_PENALTY = 0.15
const GRID_COLS = 4

// Tablet (3-col): container ≈ 768–1023px - 48px padding - 16px gap / 3 cols ≈ 260px per col
// Biased toward smaller tablet width so crops feel correct where stretching is most visible.
const SM_GRID_COLS = 3
const SM_COL_W = 260
const SM_IMAGE_AR_BAND = 0.55  // wider band than desktop — lets portrait flex to 1×1 to avoid gap penalty
const SM_SIZE_PENALTY = 0.20   // slightly higher than desktop — prefers smaller tiles on narrower viewports

interface Span { cols: 1 | 2 | 3 | 4; rows: 1 | 2 | 3 }

function effectiveAr(cols: number, rows: number): number {
  return (cols * COL_W + (cols - 1) * GAP) / (rows * ROW_H + (rows - 1) * GAP)
}

function smEffectiveAr(cols: number, rows: number): number {
  return (cols * SM_COL_W + (cols - 1) * GAP) / (rows * ROW_H + (rows - 1) * GAP)
}

// ─── Desktop span options (4-col) ─────────────────────────────────────────────
const SPAN_OPTIONS: Span[] = [
  { cols: 1, rows: 1 }, { cols: 2, rows: 1 }, { cols: 3, rows: 1 }, { cols: 4, rows: 1 },
  { cols: 1, rows: 2 }, { cols: 2, rows: 2 }, { cols: 3, rows: 2 }, { cols: 4, rows: 2 },
  { cols: 1, rows: 3 }, { cols: 2, rows: 3 },
]

// Tablet span options (3-col) — no cols: 4
const SM_SPAN_OPTIONS: Span[] = [
  { cols: 1, rows: 1 }, { cols: 2, rows: 1 }, { cols: 3, rows: 1 },
  { cols: 1, rows: 2 }, { cols: 2, rows: 2 }, { cols: 3, rows: 2 },
  { cols: 1, rows: 3 }, { cols: 2, rows: 3 },
]

// ─── Solver types ──────────────────────────────────────────────────────────────

interface Candidate { span: Span; penalty: number }

// ─── Desktop image candidates ──────────────────────────────────────────────────
// Images may drift up to ~55% off their best aspect-ratio fit.
const IMAGE_AR_BAND = 0.44

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
      penalty: (s.dev - bestDev) * 4 + Math.log(s.span.cols * s.span.rows) * SIZE_PENALTY,
    }))
    .sort((a, b) => a.penalty - b.penalty)
    .slice(0, 5)
}

// ─── Tablet image candidates ───────────────────────────────────────────────────
// Wider AR band (0.55 vs 0.44) lets portrait images flex between 1×2 (ideal crop)
// and 1×1 (compact). When many portraits pile up and create gaps, the hole penalty
// (4000) overwhelms the crop drift penalty (~1.7), so the solver naturally collapses
// them to 1×1 and eliminates the tall-strip problem.
function smImageCandidates(item: BentoImageItem): Candidate[] {
  if (!item.imageWidth || !item.imageHeight) {
    return [{ span: { cols: 1, rows: 1 }, penalty: 0 }]
  }
  const imageAr = item.imageWidth / item.imageHeight
  const scored = SM_SPAN_OPTIONS.map((span) => ({
    span,
    dev: Math.abs(Math.log(smEffectiveAr(span.cols, span.rows) / imageAr)),
  }))
  const bestDev = Math.min(...scored.map((s) => s.dev))
  return scored
    .filter((s) => s.dev <= bestDev + SM_IMAGE_AR_BAND)
    .map((s) => ({
      span: s.span,
      penalty: (s.dev - bestDev) * 4 + Math.log(s.span.cols * s.span.rows) * SM_SIZE_PENALTY,
    }))
    .sort((a, b) => a.penalty - b.penalty)
    .slice(0, 5)
}

// ─── Desktop flex / counter candidates ────────────────────────────────────────
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

// ─── Tablet flex / counter candidates ─────────────────────────────────────────
// Text/CTA prefer narrower shapes on tablet: 2×1 first, then 3×1 (full-width banner).
// 2×2 is a secondary option — avoids the "orphaned white-space block" from the old
// fixed assignment that always gave text a full 2×2 tile.
const SM_FLEX_CANDIDATES: Candidate[] = [
  { span: { cols: 2, rows: 1 }, penalty: 0 },
  { span: { cols: 3, rows: 1 }, penalty: 0.5 },
  { span: { cols: 2, rows: 2 }, penalty: 1.0 },
  { span: { cols: 3, rows: 2 }, penalty: 1.8 },
  { span: { cols: 1, rows: 2 }, penalty: 2.5 },
  { span: { cols: 1, rows: 1 }, penalty: 3.0 },
  { span: { cols: 1, rows: 3 }, penalty: 4.0 },
  { span: { cols: 2, rows: 3 }, penalty: 4.5 },
]

const SM_COUNTER_CANDIDATES: Candidate[] = [
  { span: { cols: 1, rows: 1 }, penalty: 0 },
  { span: { cols: 2, rows: 1 }, penalty: 1.5 },
  { span: { cols: 1, rows: 2 }, penalty: 1.5 },
  { span: { cols: 2, rows: 2 }, penalty: 4 },
  { span: { cols: 3, rows: 1 }, penalty: 7 },
  { span: { cols: 1, rows: 3 }, penalty: 7 },
  { span: { cols: 3, rows: 2 }, penalty: 11 },
  { span: { cols: 2, rows: 3 }, penalty: 11 },
]

// ─── Grid state helpers ────────────────────────────────────────────────────────
// All functions accept a `gridCols` parameter (default = GRID_COLS = 4) so the
// same logic can drive both the 4-col desktop solver and the 3-col tablet solver.

interface PlacedItem { span: Span; row: number; col: number }
type GridState = boolean[][]

function gEnsure(g: GridState, row: number, gridCols = GRID_COLS) {
  while (g.length <= row) g.push(new Array(gridCols).fill(false))
}

function gFree(g: GridState, row: number, col: number, cols: number, rows: number, gridCols = GRID_COLS): boolean {
  if (col + cols > gridCols) return false
  for (let r = row; r < row + rows; r++) {
    gEnsure(g, r, gridCols)
    for (let c = col; c < col + cols; c++) {
      if (g[r][c]) return false
    }
  }
  return true
}

function gPlace(g: GridState, row: number, col: number, cols: number, rows: number, gridCols = GRID_COLS) {
  for (let r = row; r < row + rows; r++) {
    gEnsure(g, r, gridCols)
    for (let c = col; c < col + cols; c++) { g[r][c] = true }
  }
}

function gFindDense(g: GridState, cols: number, rows: number, gridCols = GRID_COLS): { row: number; col: number } {
  for (let r = 0; ; r++) {
    gEnsure(g, r, gridCols)
    for (let c = 0; c <= gridCols - cols; c++) {
      if (gFree(g, r, c, cols, rows, gridCols)) return { row: r, col: c }
    }
  }
}

// Decomposes every empty cell into capped rectangles (non-destructive).
function holeRects(g: GridState, height: number, gridCols = GRID_COLS): PlacedItem[] {
  const c: boolean[][] = []
  for (let r = 0; r < height; r++) {
    c.push((g[r] ?? new Array(gridCols).fill(false)).slice())
  }
  const rects: PlacedItem[] = []
  for (let r = 0; r < height; r++) {
    for (let col = 0; col < gridCols; col++) {
      if (c[r][col]) continue
      let w = 0
      while (w < gridCols && col + w < gridCols && !c[r][col + w]) w++
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

function simulate(items: KeyedSpan[], gridCols = GRID_COLS) {
  const g: GridState = []
  const placed = new Map<string, PlacedItem>()
  for (const it of items) {
    const pos = gFindDense(g, it.span.cols, it.span.rows, gridCols)
    gPlace(g, pos.row, pos.col, it.span.cols, it.span.rows, gridCols)
    placed.set(it.key, { span: it.span, row: pos.row, col: pos.col })
  }
  return { placed, height: g.length, grid: g }
}

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

const MAX_COMBOS = 80000

// ─── Desktop layout solver (4-col) ────────────────────────────────────────────
// Do not touch — drives the lg: breakpoint. See handover notes for full context.
function computeLayout(items: BentoItem[]): {
  placed: Map<string, PlacedItem>
  fillers: PlacedItem[]
} {
  const solverItems: SolverItem[] = items.map((it) => ({
    key: it._key,
    isFlex: it._type === 'bentoText' || it._type === 'bentoCta',
    candidates: it._type === 'bentoImage' ? imageCandidates(it) : [...FLEX_CANDIDATES],
  }))
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
    const sim = simulate(keyed, GRID_COLS)
    const holes = holeRects(sim.grid, sim.height, GRID_COLS)
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

    const cost = holes.length * 4000 + holeArea * 300 + penaltySum + adjacent * 10
    if (cost < bestCost) {
      bestCost = cost
      bestPlaced = sim.placed
      bestGrid = sim.grid
      bestHeight = sim.height
    }
  }

  return { placed: bestPlaced!, fillers: holeRects(bestGrid, bestHeight, GRID_COLS) }
}

// ─── Tablet layout solver (3-col) ─────────────────────────────────────────────
// Mirrors computeLayout but uses SM_* constants and candidates throughout.
// Outputs explicit sm: grid-line placements that the lg: desktop placements
// cascade over at the lg breakpoint — the two solvers never conflict.
function computeTabletLayout(items: BentoItem[]): {
  placed: Map<string, PlacedItem>
  fillers: PlacedItem[]
} {
  const solverItems: SolverItem[] = items.map((it) => ({
    key: it._key,
    isFlex: it._type === 'bentoText' || it._type === 'bentoCta',
    candidates: it._type === 'bentoImage' ? smImageCandidates(it) : [...SM_FLEX_CANDIDATES],
  }))
  solverItems.push({ key: COUNTER_KEY, isFlex: false, candidates: [...SM_COUNTER_CANDIDATES] })

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
    const sim = simulate(keyed, SM_GRID_COLS)
    const holes = holeRects(sim.grid, sim.height, SM_GRID_COLS)
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

    const cost = holes.length * 4000 + holeArea * 300 + penaltySum + adjacent * 10
    if (cost < bestCost) {
      bestCost = cost
      bestPlaced = sim.placed
      bestGrid = sim.grid
      bestHeight = sim.height
    }
  }

  return { placed: bestPlaced!, fillers: holeRects(bestGrid, bestHeight, SM_GRID_COLS) }
}

// ─── Desktop grid-line class maps (lg:) ───────────────────────────────────────
// Complete strings required for Tailwind JIT. col-start + col-end longhands
// avoid clobbering grid-column-start via the span shorthand.
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

// ─── Tablet grid-line class maps (sm:) ────────────────────────────────────────
// At lg, these sm: classes are superseded by the lg: classes above — CSS breakpoints
// cascade in ascending order, so lg: always wins over sm: at the desktop viewport.
const SM_COL_START: Record<number, string> = {
  1: 'sm:col-start-1', 2: 'sm:col-start-2', 3: 'sm:col-start-3',
}
const SM_COL_END: Record<number, string> = {
  2: 'sm:col-end-2', 3: 'sm:col-end-3', 4: 'sm:col-end-4',
}
const SM_ROW_START: Record<number, string> = {
  1: 'sm:row-start-1', 2: 'sm:row-start-2', 3: 'sm:row-start-3', 4: 'sm:row-start-4',
  5: 'sm:row-start-5', 6: 'sm:row-start-6', 7: 'sm:row-start-7', 8: 'sm:row-start-8',
  9: 'sm:row-start-9', 10: 'sm:row-start-10', 11: 'sm:row-start-11', 12: 'sm:row-start-12',
  13: 'sm:row-start-13', 14: 'sm:row-start-14',
}
const SM_ROW_END: Record<number, string> = {
  2: 'sm:row-end-2', 3: 'sm:row-end-3', 4: 'sm:row-end-4', 5: 'sm:row-end-5',
  6: 'sm:row-end-6', 7: 'sm:row-end-7', 8: 'sm:row-end-8', 9: 'sm:row-end-9',
  10: 'sm:row-end-10', 11: 'sm:row-end-11', 12: 'sm:row-end-12', 13: 'sm:row-end-13',
  14: 'sm:row-end-14', 15: 'sm:row-end-15', 16: 'sm:row-end-16', 17: 'sm:row-end-17',
}

function cellClass(p: PlacedItem): string {
  return [
    LG_COL_START[p.col + 1] ?? '',
    LG_COL_END[p.col + 1 + p.span.cols] ?? '',
    LG_ROW_START[p.row + 1] ?? '',
    LG_ROW_END[p.row + 1 + p.span.rows] ?? '',
  ].filter(Boolean).join(' ')
}

function tabletCellClass(p: PlacedItem): string {
  return [
    SM_COL_START[p.col + 1] ?? '',
    SM_COL_END[p.col + 1 + p.span.cols] ?? '',
    SM_ROW_START[p.row + 1] ?? '',
    SM_ROW_END[p.row + 1 + p.span.rows] ?? '',
  ].filter(Boolean).join(' ')
}

// Mobile-only layout (below sm) — 2-column grid, aspect-ratio-driven heights.
// All sm:/lg: placement comes from tabletCellClass / cellClass; this function
// only emits classes for the mobile breakpoint plus sm:aspect-auto to clear
// the aspect ratio once grid-auto-rows takes over.
function mobileClass(item: BentoItem): string {
  if (item._type === 'bentoImage') {
    const img = item as BentoImageItem
    if (!img.imageWidth || !img.imageHeight) {
      return 'col-span-2 aspect-video sm:aspect-auto'
    }
    const ratio = img.imageWidth / img.imageHeight
    if (ratio > 1.5) return 'col-span-2 aspect-video sm:aspect-auto'
    if (ratio < 0.75) return 'col-span-2 aspect-[3/4] sm:aspect-auto'
    return 'col-span-2 aspect-square sm:aspect-auto'
  }
  return 'col-span-2 min-h-[180px] sm:min-h-0'
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
  base:    'bg-[oklch(93%_0.006_55)]',
  reverse: 'bg-[oklch(9%_0.007_50)]',
  brand:   'bg-[oklch(62%_0.22_35)]',
}

const fgMap: Record<BentoColor, string> = {
  base:    'text-[oklch(9%_0.007_50)]',
  reverse: 'text-[oklch(99%_0.003_60)]',
  brand:   'text-[oklch(99%_0.003_60)]',
}

const mutedMap: Record<BentoColor, string> = {
  base:    'text-[oklch(58%_0.012_50)]',
  reverse: 'text-[oklch(72%_0.010_50)]',
  brand:   'text-[oklch(88%_0.07_35)]',
}


function tileModifierClass(item: BentoItem): string {
  if (item._type !== 'bentoText') return ''
  const ds = stegaClean(item.displayStyle) ?? 'card'
  if (ds === 'hairline') return 'border border-gray-200 dark:border-gray-800'
  return ''
}

function tilePadding(span: Span): string {
  const area = span.cols * span.rows
  if (area >= 4) return 'p-8'
  if (area >= 2) return 'p-6'
  return 'p-5'
}

// ─── Image block ──────────────────────────────────────────────────────────────

function BentoImageBlock({
  item,
  span,
  smSpan,
}: {
  item: BentoImageItem
  span: Span
  smSpan: Span
}) {
  if (!item.image) return null

  const smPct = Math.round((smSpan.cols / SM_GRID_COLS) * 100)
  const lgPct = Math.round((span.cols / GRID_COLS) * 100)
  const sizes = `(max-width: 640px) 100vw, (max-width: 1024px) ${smPct}vw, ${lgPct}vw`

  return (
    <div className="absolute inset-0">
      <Image
        src={item.image}
        alt={item.alt ?? ''}
        fill
        sizes={sizes}
        className="object-cover"
      />
      {item.label && (
        <div className="absolute top-0 right-0 p-4">
          <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-[oklch(99%_0.003_60)] bg-[oklch(9%_0.007_50)]/75 px-3 py-1.5 rounded-sm">
            {item.label}
          </span>
        </div>
      )}
    </div>
  )
}

// ─── Text block ───────────────────────────────────────────────────────────────

function BentoTextBlock({ item, span }: { item: BentoTextItem; span: Span }) {
  const color = item.backgroundColor ?? 'base'
  const align = stegaClean(item.textAlign) ?? 'left'
  const size = stegaClean(item.fontSize) ?? 'base'
  const displayStyle = stegaClean(item.displayStyle) ?? 'card'
  const pad = tilePadding(span)

  const isTransparent = displayStyle === 'naked' || displayStyle === 'hairline'
  const bgClass  = isTransparent ? 'bg-transparent' : bgMap[color]
  const fgClass  = isTransparent ? 'text-[oklch(9%_0.007_50)]' : fgMap[color]
  const lblClass = isTransparent ? 'text-[oklch(58%_0.012_50)]' : mutedMap[color]

  const sizeClass: Record<string, string> = {
    sm:   '[&_p]:text-sm [&_p]:leading-relaxed',
    base: '[&_p]:text-base [&_p]:leading-relaxed',
    lg:   '[&_p]:text-lg [&_p]:leading-snug',
    xl:   '[&_p]:text-xl [&_p]:leading-snug [&_p]:tracking-tight',
  }

  const alignClass: Record<string, string> = {
    left:   'text-left',
    center: 'text-center',
    right:  'text-right',
  }

  const proseWidthClass = align === 'center' ? 'max-w-[55ch] mx-auto w-full' : 'max-w-[65ch]'

  return (
    <div
      className={`h-full flex flex-col justify-end ${pad} ${bgClass} ${fgClass} ${alignClass[align] ?? 'text-left'} ${sizeClass[size] ?? ''}`}
    >
      {item.label && (
        <div className="absolute top-0 right-0 p-4">
          <span className={`font-mono text-[0.7rem] uppercase tracking-[0.12em] py-1.5 ${lblClass}`}>
            {item.label}
          </span>
        </div>
      )}
      <div className={proseWidthClass}>
        {item.content && <PortableText value={item.content} anchors={false} />}
      </div>
    </div>
  )
}

// ─── CTA block ────────────────────────────────────────────────────────────────
// The whole tile is the link — no button. The article's hover:brightness-95
// is the interaction signal; a small arrow at bottom-right confirms tappability.

function BentoCtaBlock({ item, span }: { item: BentoCtaItem; span: Span }) {
  const color = item.backgroundColor ?? 'base'
  const pad = tilePadding(span)
  const isExternal = item.buttonLink?.startsWith('http')

  const inner = (
    <>
      {item.label && (
        <div className="absolute top-0 right-0 p-4">
          <span className={`font-mono text-[0.7rem] uppercase tracking-[0.12em] py-1.5 ${mutedMap[color]}`}>
            {item.label}
          </span>
        </div>
      )}
      <div className="flex flex-col gap-4">
        {item.headline && (
          <h3 className="text-2xl font-medium tracking-tight leading-snug text-balance">
            {item.headline}
          </h3>
        )}
        {(item.description || item.buttonLink) && (
          <div className="flex items-end gap-4">
            {item.description && (
              <p className={`flex-1 text-sm leading-relaxed ${mutedMap[color]}`}>{item.description}</p>
            )}
            {item.buttonLink && (
              <span className={`font-mono text-sm leading-none ml-auto flex-shrink-0 ${mutedMap[color]}`}>
                {isExternal ? '↗' : '→'}
              </span>
            )}
          </div>
        )}
      </div>
    </>
  )

  const baseClass = `h-full flex flex-col justify-end ${pad} ${bgMap[color]} ${fgMap[color]}`

  if (item.buttonLink) {
    return isExternal ? (
      <a
        href={item.buttonLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={item.headline ?? undefined}
        className={baseClass}
      >
        {inner}
      </a>
    ) : (
      <Link href={item.buttonLink} aria-label={item.headline ?? undefined} className={baseClass}>
        {inner}
      </Link>
    )
  }

  return <div className={baseClass}>{inner}</div>
}

// ─── Counter block ────────────────────────────────────────────────────────────

function BentoCounterBlock({ count, label, large, span }: { count: number; label: string; large: boolean; span: Span }) {
  const pad = tilePadding(span)
  return (
    <div className={`h-full flex flex-col justify-end ${pad} bg-[oklch(9%_0.007_50)]`}>
      <div className="absolute top-0 left-0 p-4">
        <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] py-1.5 text-[oklch(72%_0.010_50)]">
          {label}
        </span>
      </div>
      <p
        className={`font-bold leading-none tracking-tight text-[oklch(99%_0.003_60)] ${
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

  const visibleItems = items?.filter((i) => i.enabled !== false) ?? []
  const hasItems = visibleItems.length > 0

  // Desktop solver (4-col) — drives lg: placement
  const { placed, fillers } = useMemo(
    () =>
      hasItems
        ? computeLayout(visibleItems)
        : { placed: new Map<string, PlacedItem>(), fillers: [] as PlacedItem[] },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasItems, visibleItems],
  )

  // Tablet solver (3-col) — drives sm: placement; lg: classes cascade over it
  const { placed: smPlaced, fillers: smFillers } = useMemo(
    () =>
      hasItems
        ? computeTabletLayout(visibleItems)
        : { placed: new Map<string, PlacedItem>(), fillers: [] as PlacedItem[] },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hasItems, visibleItems],
  )

  const imageCount = hasItems ? visibleItems.filter((i) => i._type === 'bentoImage').length : 0
  const counterCount = imageCount > 0 ? imageCount : visibleItems.length
  const counterLabel = imageCount > 0 ? 'Images' : 'Items'
  const counterPlaced = placed.get(COUNTER_KEY) ?? null
  const smCounterPlaced = smPlaced.get(COUNTER_KEY) ?? null

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
          {hasItems && (
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
              className="grid grid-cols-2 sm:grid-cols-3 sm:[grid-auto-rows:minmax(220px,auto)] lg:grid-cols-4 lg:[grid-auto-rows:minmax(220px,auto)] [grid-auto-flow:dense] gap-2"
            >
              {visibleItems.map((item) => {
                const p = placed.get(item._key) ?? { span: { cols: 1, rows: 1 } as Span, row: 0, col: 0 }
                const sp = smPlaced.get(item._key) ?? { span: { cols: 1, rows: 1 } as Span, row: 0, col: 0 }
                return (
                  <motion.article
                    key={item._key}
                    variants={itemVariants}
                    className={`relative overflow-hidden rounded-sm transition-[filter] duration-200 ease-out hover:brightness-95 ${mobileClass(item)} ${tabletCellClass(sp)} ${cellClass(p)} ${tileModifierClass(item)}`}
                    aria-label={
                      item._type === 'bentoImage'
                        ? (item.alt ?? undefined)
                        : item._type === 'bentoCta'
                        ? (item.headline ?? undefined)
                        : undefined
                    }
                  >
                    {item._type === 'bentoImage' && (
                      <BentoImageBlock item={item} span={p.span} smSpan={sp.span} />
                    )}
                    {item._type === 'bentoText' && <BentoTextBlock item={item} span={p.span} />}
                    {item._type === 'bentoCta' && <BentoCtaBlock item={item} span={p.span} />}
                  </motion.article>
                )
              })}

              {(counterPlaced || smCounterPlaced) && (
                <motion.article
                  key="bento-counter"
                  variants={itemVariants}
                  aria-hidden="true"
                  className={`relative overflow-hidden rounded-sm hidden sm:block lg:min-h-0 ${smCounterPlaced ? tabletCellClass(smCounterPlaced) : ''} ${counterPlaced ? cellClass(counterPlaced) : ''}`}
                >
                  <BentoCounterBlock
                    count={counterCount}
                    label={counterLabel}
                    large={(counterPlaced ?? smCounterPlaced)!.span.cols * (counterPlaced ?? smCounterPlaced)!.span.rows >= 2}
                    span={(counterPlaced ?? smCounterPlaced)!.span}
                  />
                </motion.article>
              )}

              {/* Tablet fillers — visible sm only, hidden at lg where desktop fillers take over */}
              {smFillers.map((f, i) => (
                <motion.article
                  key={`bento-sm-filler-${i}`}
                  variants={itemVariants}
                  aria-hidden="true"
                  className={`relative overflow-hidden rounded-sm hidden sm:block lg:hidden ${tabletCellClass(f)}`}
                >
                  <div className="h-full bg-[oklch(97%_0.004_60)]" />
                </motion.article>
              ))}

              {/* Desktop fillers — visible lg only */}
              {fillers.map((f, i) => (
                <motion.article
                  key={`bento-filler-${i}`}
                  variants={itemVariants}
                  aria-hidden="true"
                  className={`relative overflow-hidden rounded-sm hidden lg:block ${cellClass(f)}`}
                >
                  <div className="h-full bg-[oklch(97%_0.004_60)]" />
                </motion.article>
              ))}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}
