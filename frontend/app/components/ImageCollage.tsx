'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { motion, useInView } from 'motion/react'
import { stegaClean } from '@sanity/client/stega'
import { backgroundVariants, tileOverlay } from '@/app/components/backgrounds'

type ImageItem = {
  image: string
  alt: string
}

type ImageCollageProps = {
  block: {
    images?: ImageItem[]
    background?: 'none' | 'tint' | 'tile' | 'gradient'
  }
}

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
}

const hoverClass =
  'w-full h-full object-cover transition-[transform,filter] duration-[400ms] ease-out hover:scale-[1.03] hover:brightness-110'

function CollageCell({
  image,
  className,
  priority,
  sizes,
  width,
  height,
}: {
  image: ImageItem
  className: string
  priority?: boolean
  sizes: string
  width: number
  height: number
}) {
  return (
    <motion.div variants={itemVariants} className={`rounded-sm overflow-hidden ${className}`}>
      <Image
        src={image.image}
        alt={image.alt}
        width={width}
        height={height}
        priority={priority}
        sizes={sizes}
        className={hoverClass}
      />
    </motion.div>
  )
}

function SixImageLayout({ images }: { images: ImageItem[] }) {
  const wideSizes = '(max-width: 1024px) 100vw, 720px'
  const smallSizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px'

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
      <div className="flex flex-col gap-1">
        <CollageCell image={images[0]} className="aspect-video w-full" sizes={wideSizes} width={800} height={450} priority />
        <div className="grid grid-cols-2 gap-1">
          <CollageCell image={images[1]} className="aspect-[4/3] w-full" sizes={smallSizes} width={400} height={300} />
          <CollageCell image={images[2]} className="aspect-[4/3] w-full" sizes={smallSizes} width={400} height={300} />
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <div className="grid grid-cols-2 gap-1">
          <CollageCell image={images[3]} className="aspect-[4/3] w-full" sizes={smallSizes} width={400} height={300} />
          <CollageCell image={images[4]} className="aspect-[4/3] w-full" sizes={smallSizes} width={400} height={300} />
        </div>
        <CollageCell image={images[5]} className="aspect-video w-full" sizes={wideSizes} width={800} height={450} />
      </div>
    </div>
  )
}

function FourImageLayout({ images }: { images: ImageItem[] }) {
  const sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px'

  return (
    <div className="grid grid-cols-2 gap-1">
      {images.map((img, i) => (
        <CollageCell key={i} image={img} className="aspect-[4/3] w-full" sizes={sizes} width={600} height={450} priority={i === 0} />
      ))}
    </div>
  )
}

function ThreeImageLayout({ images }: { images: ImageItem[] }) {
  return (
    <div className="flex flex-col gap-1">
      <CollageCell
        image={images[0]}
        className="aspect-video w-full"
        sizes="100vw"
        width={1200}
        height={675}
        priority
      />
      <div className="grid grid-cols-2 gap-1">
        <CollageCell image={images[1]} className="aspect-[4/3] w-full" sizes="(max-width: 640px) 100vw, 50vw" width={600} height={450} />
        <CollageCell image={images[2]} className="aspect-[4/3] w-full" sizes="(max-width: 640px) 100vw, 50vw" width={600} height={450} />
      </div>
    </div>
  )
}

export default function ImageCollage({ block }: ImageCollageProps) {
  const { images, background = 'none' } = block
  const cleanBackground = stegaClean(background)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })

  const count = images?.length ?? 0
  const supported = count === 3 || count === 4 || count === 6

  return (
    <div
      className={`relative w-full ${
        cleanBackground !== 'tile' ? (backgroundVariants[cleanBackground] ?? '') : ''
      }`}
    >
      {cleanBackground === 'tile' && <div className={`absolute inset-0 -z-10 ${tileOverlay}`} />}
      <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10">
        <section className="py-12">
          {images && supported && (
            <motion.div
              ref={ref}
              variants={containerVariants}
              initial="hidden"
              animate={inView ? 'visible' : 'hidden'}
            >
              {count === 6 && <SixImageLayout images={images} />}
              {count === 4 && <FourImageLayout images={images} />}
              {count === 3 && <ThreeImageLayout images={images} />}
            </motion.div>
          )}
        </section>
      </div>
    </div>
  )
}
