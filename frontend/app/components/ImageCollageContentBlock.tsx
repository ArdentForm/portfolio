import ImageCollageContent from '@/app/components/ImageCollageContent'

type ImageCollageContentBlockProps = {
  block: any
}

export default function ImageCollageContentBlock({ block }: ImageCollageContentBlockProps) {
  return <ImageCollageContent block={block} />
}
