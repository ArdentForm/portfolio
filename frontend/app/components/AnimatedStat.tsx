'use client'

import {useEffect, useRef, useState} from 'react'
import {animate, useInView} from 'motion/react'

function parseValue(raw: string): {prefix: string; number: number; suffix: string} | null {
  const match = raw.match(/^([^0-9]*)(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return null
  return {prefix: match[1], number: parseFloat(match[2]), suffix: match[3]}
}

export default function AnimatedStat({value}: {value: string}) {
  const ref = useRef<HTMLElement>(null)
  const isInView = useInView(ref, {once: true, margin: '-10% 0px'})
  const parsed = parseValue(value)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isInView || !parsed) return
    const controls = animate(0, parsed.number, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setCount(Number.isInteger(parsed.number) ? Math.round(v) : v),
    })
    return () => controls.stop()
  }, [isInView, parsed?.number])

  if (!parsed) return <>{value}</>

  return (
    <dd
      ref={ref}
      className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter leading-none order-1"
    >
      {parsed.prefix}
      {isInView ? count : 0}
      {parsed.suffix}
    </dd>
  )
}
