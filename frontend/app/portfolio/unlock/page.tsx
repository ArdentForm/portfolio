import type {Metadata} from 'next'

import PasswordForm from './PasswordForm'

export const metadata: Metadata = {
  title: 'Portfolio Access',
  robots: {index: false, follow: false},
}

type Props = {
  searchParams: Promise<{from?: string; error?: string}>
}

export default async function UnlockPage({searchParams}: Props) {
  const {from = '/portfolio', error} = await searchParams

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Padlock icon */}
        <div className="mb-5 text-gray-400 dark:text-gray-600">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="4" y="11" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="1.5" />
            <path d="M8 11V7a4 4 0 0 1 8 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </div>

        <p className="font-mono text-xs tracking-widest uppercase text-gray-400 dark:text-gray-600 mb-4">
          Portfolio Access
        </p>
        <div className="border-t border-gray-200 dark:border-gray-800 mb-8" />

        <PasswordForm from={from} hasError={!!error} />

      </div>
    </div>
  )
}
