type MinimalHeaderProps = {
  label?: string
  meta?: string
  heading: string
}

export default function MinimalHeader({label, meta, heading}: MinimalHeaderProps) {
  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 pt-20 lg:pt-28">
      <div className="flex items-center justify-between pb-5">
        {label ? (
          <span className="text-[11px] tracking-[0.2em] uppercase text-white/50 font-mono">
            {label}
          </span>
        ) : (
          <span />
        )}
        {meta && (
          <span className="text-[11px] tracking-[0.2em] uppercase text-white/50 font-mono">
            {meta}
          </span>
        )}
      </div>

      <div className="border-t border-white/10" />

      <div className="pt-8 pb-12">
        <h2 className="text-[clamp(3rem,7vw,5.5rem)] leading-[1.0] tracking-[-0.02em]">
          {heading}
        </h2>
      </div>
    </div>
  )
}
