import { PortableText, type PortableTextComponents, type PortableTextBlock } from 'next-sanity'

type PageHeaderProps = {
  heading: PortableTextBlock[]
  subheading?: string
}

const headingComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <>{children}</>,
  },
  marks: {
    strong: ({ children }) => <strong>{children}</strong>,
  },
}

export default function PageHeader({ heading, subheading }: PageHeaderProps) {
  return (
    <div className="max-w-[1440px] mx-auto w-full px-4 sm:px-6 lg:px-10 py-12">
      <div className="pb-6">
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl leading-snug">
            <PortableText value={heading} components={headingComponents} />
          </h1>
          {subheading && (
            <p className="mt-4 text-base lg:text-normal leading-relaxed uppercase font-light">
              {subheading}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
