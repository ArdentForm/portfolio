import {RiInstagramLine, RiLinkedinLine} from 'react-icons/ri'

export default function Footer() {
  return (
    <footer className="">
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-6 border-t dark:border-gray-700 border-gray-200">
        <p className="text-sm font-mono">
          Designed and built by Me using{' '}
          <a
            href="https://www.sanity.io"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:opacity-80 transition-opacity"
          >
            Sanity.io
          </a>{' '}
          and{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-brand hover:opacity-80 transition-opacity"
          >
            Next.js
          </a>
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="dark:text-gray-600 dark:hover:text-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RiInstagramLine size={22} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="dark:text-gray-600 dark:hover:text-gray-200 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RiLinkedinLine size={22} />
          </a>
        </div>
      </div>
    </footer>
  )
}
