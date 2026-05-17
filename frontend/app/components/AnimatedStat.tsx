'use client'

import {useRef} from 'react'
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'
import {useGSAP} from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

function parseValue(raw: string): {prefix: string; main: string; suffix: string} | null {
  const match = raw.match(/^([^0-9]*)(\d[\d,.]*)(.*)$/)
  if (!match) return null
  return {prefix: match[1], main: match[2], suffix: match[3]}
}

export default function AnimatedStat({value}: {value: string}) {
  const containerRef = useRef<HTMLElement>(null)
  const charsRef = useRef<(HTMLSpanElement | null)[]>([])
  const parsed = parseValue(value)

  useGSAP(() => {
    const chars = charsRef.current.filter(Boolean)
    if (!chars.length || !containerRef.current) return

    gsap.from(chars, {
      yPercent: 110,
      duration: 0.8,
      ease: 'power4.out',
      stagger: 0.05,
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 90%',
        once: true,
      },
    })
  })

  if (!parsed) {
    return (
      <dd className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter leading-none order-1">
        {value}
      </dd>
    )
  }

  const chars = (parsed.main + parsed.suffix).split('')

  return (
    <dd
      ref={containerRef}
      className="text-5xl sm:text-6xl lg:text-7xl font-light tracking-tighter leading-none order-1"
    >
      {parsed.prefix}
      {chars.map((char, i) => (
        <span key={i} style={{display: 'inline-block', overflow: 'hidden'}}>
          <span
            ref={(el) => {
              charsRef.current[i] = el
            }}
            style={{display: 'inline-block'}}
          >
            {char}
          </span>
        </span>
      ))}
    </dd>
  )
}
