import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'
import ResolvedLink from '@/app/components/ResolvedLink'
import Image from '@/app/components/SanityImage'

function AnchorLink({id}: {id?: string}) {
  if (!id) return null
  return (
    <a
      href={`#${id}`}
      className="absolute left-0 top-0 bottom-0 -ml-6 flex items-center opacity-0 group-hover:opacity-100 transition-opacity"
      aria-hidden="true"
      tabIndex={-1}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
        />
      </svg>
    </a>
  )
}

export default function CustomPortableText({
  className,
  value,
  anchors = true,
}: {
  className?: string
  value: PortableTextBlock[]
  anchors?: boolean
}) {
  const components: PortableTextComponents = {
    types: {
      image: ({value}) => {
        if (!value?.asset?._ref) return null
        return (
          <figure className="my-8">
            <Image
              id={value.asset._ref}
              alt={value.alt || ''}
              width={672}
              crop={value.crop}
              mode="cover"
              className="rounded-sm"
            />
          </figure>
        )
      },
    },
    block: {
      normal: ({children}) => <p>{children}</p>,
      h1: ({children, value}) => (
        <h1 id={anchors ? value?._key : undefined} className={`${anchors ? 'group relative' : ''} text-3xl sm:text-4xl mt-10 mb-4`}>
          {children}
          {anchors && <AnchorLink id={value?._key} />}
        </h1>
      ),
      h2: ({children, value}) => (
        <h2 id={anchors ? value?._key : undefined} className={`${anchors ? 'group relative' : ''} text-2xl sm:text-3xl mt-8 mb-4`}>
          {children}
          {anchors && <AnchorLink id={value?._key} />}
        </h2>
      ),
      h3: ({children, value}) => (
        <h3 id={anchors ? value?._key : undefined} className={`${anchors ? 'group relative' : ''} text-xl sm:text-2xl mt-6 mb-3`}>
          {children}
          {anchors && <AnchorLink id={value?._key} />}
        </h3>
      ),
      h4: ({children}) => (
        <h4 className="text-lg mt-6 mb-2">{children}</h4>
      ),
      blockquote: ({children}) => (
        <blockquote className="bg-gray-100 dark:bg-gray-800 rounded-sm px-6 py-5 my-8 italic text-lg text-gray-600 dark:text-gray-300">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({children}) => (
        <ul className="my-4 space-y-2 list-none pl-0">{children}</ul>
      ),
      number: ({children}) => (
        <ol className="my-4 space-y-2 list-none pl-0 counter-reset-[item]">{children}</ol>
      ),
    },
    listItem: {
      bullet: ({children}) => (
        <li className="flex gap-3 items-baseline">
          <span className="text-brand shrink-0 mt-1">—</span>
          <span>{children}</span>
        </li>
      ),
      number: ({children, index}) => (
        <li className="flex gap-3 items-baseline">
          <span className="font-mono text-xs text-brand shrink-0 tabular-nums">
            {String((index ?? 0) + 1).padStart(2, '0')}
          </span>
          <span>{children}</span>
        </li>
      ),
    },
    marks: {
      link: ({children, value: link}) => {
        return <ResolvedLink link={link}>{children}</ResolvedLink>
      },
    },
  }

  return (
    <div className={`prose dark:prose-invert prose-a:text-brand prose-a:no-underline hover:prose-a:underline max-w-none ${className ?? ''}`}>
      <PortableText components={components} value={value} />
    </div>
  )
}
