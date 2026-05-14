import {PortableText, type PortableTextComponents, type PortableTextBlock} from 'next-sanity'

type SectionHeadingProps = {
  block: {
    _type: string
    _key: string
    heading?: PortableTextBlock[]
  }
}

const headingComponents: PortableTextComponents = {
  block: {
    normal: ({children}) => <>{children}</>,
  },
  marks: {
    strong: ({children}) => <strong>{children}</strong>,
    em: ({children}) => <em>{children}</em>,
  },
}

export default function SectionHeading({block}: SectionHeadingProps) {
  if (!block?.heading?.length) return null

  return (
    <div className="max-w-[1440px] mx-auto w-full">
    <section className="px-4 sm:px-6 lg:px-10 py-10">
      <h2 className="text-2xl sm:text-3xl font-normal leading-snug max-w-3xl">
        <PortableText value={block.heading} components={headingComponents} />
      </h2>
    </section>
    </div>
  )
}
