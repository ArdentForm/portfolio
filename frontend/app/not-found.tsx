import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-24 sm:py-32 lg:py-48 flex flex-col gap-8">
      <p className="font-mono text-xs tracking-widest uppercase text-gray-400">404</p>
      <h1 className="text-5xl sm:text-7xl lg:text-9xl font-light tracking-tighter leading-none">
        Page not found
      </h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 max-w-sm">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/"
        className="self-start font-mono text-xs tracking-widest uppercase text-gray-900 dark:text-white border-b border-gray-300 dark:border-gray-700 hover:border-brand hover:text-brand transition-colors duration-200 pb-1"
      >
        ← Back home
      </Link>
    </div>
  )
}
