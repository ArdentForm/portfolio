import {RiInstagramLine, RiLinkedinLine} from 'react-icons/ri'

export default function Footer() {
  return (
    <footer>
      <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between px-4 sm:px-6 lg:px-10 py-8 border-t border-[oklch(88%_0.008_50)] dark:border-[oklch(23%_0.012_50)]">
        <p className="font-mono text-xs tracking-widest uppercase text-[oklch(58%_0.012_50)]">
          Craig Anderson · Built with{' '}
          <a
            href="https://www.sanity.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[oklch(78%_0.010_50)] dark:decoration-[oklch(38%_0.012_50)] underline-offset-2 hover:text-[oklch(9%_0.007_50)] dark:hover:text-[oklch(93%_0.006_55)] transition-colors duration-200"
          >
            Sanity
          </a>
          {' '}+{' '}
          <a
            href="https://nextjs.org"
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-[oklch(78%_0.010_50)] dark:decoration-[oklch(38%_0.012_50)] underline-offset-2 hover:text-[oklch(9%_0.007_50)] dark:hover:text-[oklch(93%_0.006_55)] transition-colors duration-200"
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
            className="text-[oklch(75%_0.010_50)] hover:text-[oklch(9%_0.007_50)] dark:text-[oklch(38%_0.012_50)] dark:hover:text-[oklch(80%_0.008_50)] transition-colors duration-200"
          >
            <RiInstagramLine size={18} />
          </a>
          <a
            href="https://www.linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-[oklch(75%_0.010_50)] hover:text-[oklch(9%_0.007_50)] dark:text-[oklch(38%_0.012_50)] dark:hover:text-[oklch(80%_0.008_50)] transition-colors duration-200"
          >
            <RiLinkedinLine size={18} />
          </a>
        </div>
      </div>
    </footer>
  )
}
