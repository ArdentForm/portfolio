import ImageCollage from '@/app/components/ImageCollage'

type ImageCollageBlockProps = {
  block: any
}

export default function ImageCollageBlock({ block }: ImageCollageBlockProps) {
  return <ImageCollage block={block} />
}
