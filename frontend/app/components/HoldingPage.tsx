export default function HoldingPage() {
  return (
    <div className="min-h-dvh bg-gray-900 flex flex-col">

      {/* Corner identifiers — structural, not content */}
      <header className="flex justify-between items-center px-8 sm:px-12 lg:px-16 pt-8 sm:pt-10">
        <span className="font-mono text-[0.6875rem] tracking-[0.16em] uppercase text-orange-500">
          Craig Ardent
        </span>
        <span className="font-mono text-[0.6875rem] tracking-[0.1em] text-gray-700 select-none">
          001
        </span>
      </header>

      {/* Content — lower-third anchored, left-aligned */}
      <main className="flex-1 flex flex-col justify-end px-8 sm:px-12 lg:px-16 pb-16 sm:pb-20 lg:pb-24">
        <div className="max-w-3xl">

          <p className="font-mono text-[0.6875rem] tracking-[0.18em] uppercase text-orange-500 mb-10 sm:mb-12">
            Coming Soon
          </p>

          <h1
            className="font-sans font-bold text-white leading-[1.05] tracking-[-0.02em] text-balance mb-3"
            style={{fontSize: 'clamp(2.5rem, 6vw, 4.5rem)'}}
          >
            Craig Ardent
          </h1>

          <p className="font-sans font-light text-gray-600 text-lg sm:text-xl tracking-[-0.01em] mb-10 sm:mb-12">
            Design Portfolio
          </p>

          {/* Precision Signal — used once, intentionally short */}
          <div className="w-12 h-[1.5px] bg-orange-500 mb-8 sm:mb-10" />

          <p className="font-sans text-gray-500 text-base leading-relaxed max-w-sm">
            Something considered is on its way.
          </p>

        </div>
      </main>

    </div>
  )
}
