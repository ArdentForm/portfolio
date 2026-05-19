import Image from 'next/image'

type ImageHeroProps = {
  image: string
  alt: string
  subtitle?: string
  index?: string
  heading?: string
  lightPanel?: boolean
}

export default function ImageHero({image, alt, subtitle, index, heading, lightPanel = false}: ImageHeroProps) {
  const panelBg = lightPanel ? 'oklch(99% 0.003 60 / 0.85)' : 'oklch(9% 0.007 50 / 0.5)'
  const textPrimary = lightPanel ? 'text-black' : 'text-white'
  const textMuted = lightPanel ? 'text-black/50' : 'text-white/70'

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10">

      {/* Mobile: stacked, image then panel */}
      <div className="md:hidden">
        <div className="relative w-full aspect-[4/3] overflow-hidden rounded-[2px]">
          <Image src={image} alt={alt} fill className="object-cover" priority sizes="100vw" />
        </div>
        <div
          className="px-7 pt-6 pb-7 flex flex-col gap-5"
          style={{backgroundColor: panelBg}}
        >
          {subtitle && (
            <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.18em] ${textMuted}`}>
              {subtitle}
            </p>
          )}
          {index && (
            <p className={`font-sans text-[clamp(3.5rem,14vw,5rem)] font-thin leading-none tracking-[-0.03em] ${textPrimary}`}>
              {index}
            </p>
          )}
          {heading && (
            <h2 className={`font-sans text-xl font-medium leading-snug tracking-[-0.01em] ${textPrimary}`}>
              {heading}
            </h2>
          )}
        </div>
      </div>

      {/* Desktop: image with floating inset panel */}
      <div className="hidden md:block relative aspect-[3/1] overflow-hidden rounded-[2px] shadow-layer">
        <Image
          src={image}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1440px) 100vw, 1440px"
        />
        {/* Panel inset equally on top, right, bottom — aspect-square derives width from height */}
        <div
          className="absolute top-4 right-4 bottom-4 aspect-square flex flex-col justify-between p-6 xl:p-9"
          style={{backgroundColor: panelBg}}
        >
          <p className={`font-mono text-[0.6875rem] uppercase tracking-[0.18em] ${textMuted} min-h-[1em]`}>
            {subtitle ?? ''}
          </p>
          {index && (
            <p className={`font-sans text-[clamp(3.5rem,7vw,8rem)] font-thin leading-none tracking-[-0.03em] ${textPrimary}`}>
              {index}
            </p>
          )}
          {heading && (
            <h2 className={`font-sans text-[clamp(0.875rem,1.3vw,1.125rem)] font-medium leading-snug tracking-[-0.01em] ${textPrimary}`}>
              {heading}
            </h2>
          )}
        </div>
      </div>

    </div>
  )
}
